from __future__ import annotations

import os
from typing import Any

from openai import AsyncOpenAI


class ManusLLM:
    """Server-only OpenAI-compatible adapter for Manus built-in LLM."""

    def __init__(self) -> None:
        base_url = os.environ.get("OPENAI_API_BASE") or os.environ.get("BUILT_IN_FORGE_API_URL")
        api_key = os.environ.get("OPENAI_API_KEY") or os.environ.get("BUILT_IN_FORGE_API_KEY")
        if not base_url or not api_key:
            raise RuntimeError("Manus LLM backend credentials are not configured")
        self.client = AsyncOpenAI(base_url=base_url, api_key=api_key)
        self.model = os.environ.get("XIAOYU_LLM_MODEL", "gpt-5-mini")

    async def complete(self, messages: list[dict[str, Any]], *, model: str | None = None) -> str:
        response = await self.client.chat.completions.create(
            model=model or self.model,
            messages=messages,
            max_completion_tokens=2000,
        )
        return response.choices[0].message.content or ""

    async def plan(self, goal: str) -> list[dict[str, str]]:
        text = await self.complete([
            {"role": "system", "content": "你是 Xiaoyu AI 任務規劃器。只輸出 JSON 陣列，每個項目包含 name、role、description。將任務拆成可執行的 Agent 步驟。"},
            {"role": "user", "content": goal},
        ])
        import json
        try:
            value = json.loads(text)
            return value if isinstance(value, list) else []
        except json.JSONDecodeError:
            return [{"name": "分析與執行", "role": "generalist", "description": text}]
