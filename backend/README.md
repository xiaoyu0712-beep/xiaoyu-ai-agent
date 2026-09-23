# Xiaoyu AI Gateway

此服務是 Xiaoyu AI 的伺服器端 Agent Gateway。它不把任何模型金鑰送到瀏覽器，並提供：

- Manus LLM 規劃與最終回報。
- CrewAI 分發子代理、delegation 與 Crew/Task/Process 執行。
- OpenManus 工具註冊，包括 planning、web search、browser、bash、Python、檔案、computer use、MCP、圖表與 crawl4ai。
- `/api/runs` 任務建立。
- `/api/runs/{id}/events` Server-Sent Events 即時進度。
- `/api/tools` 工具能力清單。

## 啟動

在專案根目錄：

```bash
cp .env.example .env
# 只在伺服器的 .env 填入 Manus 後端憑證
docker compose up --build
```

前端設定 `VITE_XIAOYU_API_BASE=http://your-server:8080` 後，會把任務送到此 Gateway。

## 安全邊界

`BUILT_IN_FORGE_API_KEY`、`OPENAI_API_KEY` 只能存在後端環境變數或 secrets manager。GitHub Pages 只負責靜態前端，不應存取或編譯任何秘密。

## 完整上游 runtime

`vendor/suna`、`vendor/crewai`、`vendor/openmanus` 以 Git submodule 追蹤官方專案。這個 Gateway 是共用協議層，不刪除上游的工具與 runtime。Suna 的正式自架 compose 仍位於 `vendor/suna/apps/cli/src/self-host/assets/kortix-compose.yml`，可按上游文件啟用資料庫、sandbox、connectors 與完整 Suna API。
