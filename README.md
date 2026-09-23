# Xiaoyu AI Agent

以 Suna 的工作區導覽與純色平面視覺語言為基礎，整合 Xiaoyu AI 前端、Manus LLM Gateway、CrewAI 分發子代理與 OpenManus 工具橋接。GitHub Pages 提供靜態 UI，完整 Agent runtime 透過根目錄 Docker Compose 在伺服器執行。

## 功能

- 繁體中文介面與 Xiaoyu AI 新圖示。
- 保留 Suna 風格的左側導覽、工作區、任務卡片與工具入口。
- 新增右側霧面毛玻璃即時進度面板：任務命名、完成度、目前步驟與錯誤狀態。
- 前端任務輸入與 Server-Sent Events 即時回報。
- Manus LLM 後端規劃與完成回報。
- CrewAI Agent、Task、Crew、Process 與 delegation 分發層。
- OpenManus 的 planning、web search、browser、bash、Python、檔案、computer use、MCP、圖表與 crawl4ai 工具註冊。
- 三個官方上游以 Git submodule 追蹤於 `vendor/suna`、`vendor/crewai`、`vendor/openmanus`。
- GitHub Actions 自動建置與 GitHub Pages 發佈。

## 模型與金鑰

這個版本依你的選擇使用 **Manus LLM 後端模型**。`BUILT_IN_FORGE_API_URL` 與 `BUILT_IN_FORGE_API_KEY` 只存在後端 `.env`，不會進入 GitHub Pages。使用者不需要自行填 key；管理者只需在執行 Docker Compose 的伺服器設定一次。

## 本機前端

```bash
npm install
npm run dev
```

## 完整後端

在可執行 Docker 的伺服器上：

```bash
cp .env.example .env
# 在 .env 設定 Manus LLM 的後端憑證
docker compose up --build
```

之後將前端的 `VITE_XIAOYU_API_BASE` 指向 Gateway。完整後端細節見 [`backend/README.md`](backend/README.md)。

GitHub Pages 不執行 Docker、資料庫或 sandbox；這是為了避免把 Manus 憑證及本機工具暴露給瀏覽器。

## GitHub Pages

推送到 `main` 後，`.github/workflows/deploy-pages.yml` 會建置 `dist` 並部署到 GitHub Pages。首次使用需在 GitHub Repository Settings → Pages → Source 選擇 **GitHub Actions**。

## 來源與授權

本工作區透過 submodule 保留 Suna、CrewAI、OpenManus 的完整上游來源與各自授權。整合層不將它們裁剪成 UI 示意；正式啟用 Suna 完整 API、資料庫、OAuth、sandbox 與 connector 時，請按 `vendor/suna/apps/cli/src/self-host` 的上游自架流程設定相應服務。
