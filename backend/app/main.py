from __future__ import annotations

import asyncio
import json
import uuid
from collections import defaultdict
from typing import Any

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from .crewai_dispatcher import dispatch_with_crewai
from .manus_llm import ManusLLM
from .openmanus_bridge import available_tools, tool_policy

app = FastAPI(title="Xiaoyu AI Agent Gateway", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

runs: dict[str, dict[str, Any]] = {}
queues: dict[str, asyncio.Queue[dict[str, Any]]] = defaultdict(asyncio.Queue)


class RunRequest(BaseModel):
    goal: str = Field(min_length=1, max_length=20000)
    model: str | None = None
    tools: list[str] = []
    engine: str = "hybrid"


async def emit(run_id: str, event: dict[str, Any]) -> None:
    runs[run_id]["events"].append(event)
    await queues[run_id].put(event)


async def execute(run_id: str, request: RunRequest) -> None:
    try:
        await emit(run_id, {"event": "started", "step": "接收任務", "progress": 5})
        llm = ManusLLM()
        await emit(run_id, {"event": "planning", "step": "Manus LLM 任務規劃", "progress": 18})
        steps = await llm.plan(request.goal)
        for index, step in enumerate(steps):
            await emit(run_id, {"event": "step_planned", "step": step.get("name", f"步驟 {index + 1}"), "role": step.get("role", "generalist"), "progress": 20 + index * 8})
        await emit(run_id, {"event": "crew_dispatch", "step": "CrewAI 分發子代理", "progress": 42})
        result = await dispatch_with_crewai(request.goal, steps, lambda event: emit(run_id, event))
        await emit(run_id, {"event": "openmanus_tools", "step": "OpenManus 工具橋接", "progress": 78, "tools": request.tools or [x["name"] for x in available_tools()]})
        summary = await llm.complete([
            {"role": "system", "content": "你是 Xiaoyu AI。請以繁體中文簡潔回報任務執行結果、使用的子代理與工具、下一步建議。"},
            {"role": "user", "content": json.dumps({"goal": request.goal, "crew_result": result}, ensure_ascii=False)},
        ], model=request.model)
        runs[run_id].update({"status": "completed", "result": summary})
        await emit(run_id, {"event": "completed", "step": "完成回報", "progress": 100, "summary": summary})
    except Exception as exc:
        runs[run_id]["status"] = "failed"
        await emit(run_id, {"event": "failed", "progress": 100, "message": str(exc)})


@app.get("/health")
async def health() -> dict[str, Any]:
    return {"ok": True, "service": "xiaoyu-agent-gateway", "manus_llm": True, "crewai": True, "openmanus": True}


@app.get("/api/tools")
async def tools() -> dict[str, Any]:
    return tool_policy()


@app.post("/api/runs")
async def create_run(request: RunRequest) -> dict[str, str]:
    run_id = uuid.uuid4().hex
    runs[run_id] = {"status": "running", "events": [], "result": None}
    asyncio.create_task(execute(run_id, request))
    return {"run_id": run_id}


@app.get("/api/runs/{run_id}")
async def get_run(run_id: str) -> dict[str, Any]:
    if run_id not in runs:
        raise HTTPException(status_code=404, detail="run not found")
    return runs[run_id]


@app.get("/api/runs/{run_id}/events")
async def stream_events(run_id: str, request: Request) -> StreamingResponse:
    if run_id not in runs:
        raise HTTPException(status_code=404, detail="run not found")

    async def generator():
        for event in runs[run_id]["events"]:
            yield f"data: {json.dumps(event, ensure_ascii=False)}\n\n"
        while True:
            if await request.is_disconnected():
                break
            try:
                event = await asyncio.wait_for(queues[run_id].get(), timeout=20)
                yield f"data: {json.dumps(event, ensure_ascii=False)}\n\n"
                if event.get("event") in {"completed", "failed"}:
                    break
            except asyncio.TimeoutError:
                yield ": heartbeat\n\n"

    return StreamingResponse(generator(), media_type="text/event-stream")
