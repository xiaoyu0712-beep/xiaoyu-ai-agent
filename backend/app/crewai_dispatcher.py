from __future__ import annotations

from typing import Any, Awaitable, Callable

Progress = Callable[[dict[str, Any]], Awaitable[None]]


async def dispatch_with_crewai(goal: str, steps: list[dict[str, str]], progress: Progress) -> dict[str, Any]:
    """Use CrewAI when installed; keep progress events independent of console output."""
    try:
        from crewai import Agent, Crew, Process, Task
        from crewai import LLM
    except Exception as exc:
        await progress({"event": "warning", "message": f"CrewAI 載入失敗：{exc}"})
        return {"engine": "fallback", "goal": goal, "steps": steps}

    import os
    base_url = os.environ.get("OPENAI_API_BASE") or os.environ.get("BUILT_IN_FORGE_API_URL")
    api_key = os.environ.get("OPENAI_API_KEY") or os.environ.get("BUILT_IN_FORGE_API_KEY")
    llm = LLM(model=os.environ.get("XIAOYU_LLM_MODEL", "gpt-5-mini"), base_url=base_url, api_key=api_key) if base_url and api_key else None
    agents = []
    tasks = []
    for step in steps:
        agent = Agent(
            role=step.get("role", "generalist"),
            goal=step.get("description", goal),
            backstory="你是 Xiaoyu AI 的專業分發子代理，必須回報可驗證結果。",
            allow_delegation=True,
            verbose=False,
            llm=llm,
        )
        agents.append(agent)
        tasks.append(Task(description=step.get("description", goal), expected_output="繁體中文結構化結果", agent=agent))
        await progress({"event": "agent_created", "name": step.get("name", agent.role), "role": agent.role})

    crew = Crew(agents=agents, tasks=tasks, process=Process.sequential, verbose=False)
    result = crew.kickoff()
    await progress({"event": "crew_completed", "message": "CrewAI 分發子代理已完成協作"})
    return {"engine": "crewai", "result": str(result)}
