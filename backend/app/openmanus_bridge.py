from __future__ import annotations

import importlib
from typing import Any

OPENMANUS_TOOLS = {
    "planning": "app.tool.planning",
    "web_search": "app.tool.web_search",
    "browser": "app.agent.browser",
    "bash": "app.tool.bash",
    "python_execute": "app.tool.python_execute",
    "file_operators": "app.tool.file_operators",
    "computer_use": "app.tool.computer_use_tool",
    "mcp": "app.tool.mcp",
    "chart_visualization": "app.tool.chart_visualization.data_visualization",
    "crawl4ai": "app.tool.crawl4ai",
    "ask_human": "app.tool.ask_human",
}


def available_tools() -> list[dict[str, Any]]:
    result = []
    for name, module_name in OPENMANUS_TOOLS.items():
        try:
            importlib.import_module(module_name)
            available = True
        except Exception:
            available = False
        result.append({"name": name, "module": module_name, "available": available})
    return result


def tool_policy() -> dict[str, Any]:
    return {
        "engine": "openmanus",
        "tools": available_tools(),
        "sandbox_required": ["bash", "python_execute", "computer_use"],
        "approval_required": ["bash", "file_operators", "computer_use"],
    }
