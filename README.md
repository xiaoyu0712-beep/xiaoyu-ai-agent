# Xiaoyu AI Agent

以 Suna 的工作區導覽與純色平面視覺語言為基礎，新增 Xiaoyu AI 品牌、右側霧面毛玻璃即時進度欄、任務拆分、排程入口、工具與連接器工作區，以及可在 GitHub Pages 執行的 Agent 互動原型。

## 目前包含

- 繁體中文介面與 Xiaoyu AI 新圖示。
- 保留 Suna 風格的左側導覽、工作區、任務卡片與工具入口。
- 新增右側即時進度面板：任務命名、完成度、目前步驟、模型與金鑰狀態。
- 任務輸入、空值提示、執行狀態、完成回報與響應式版面。
- CrewAI 的多 Agent 編排概念、OpenManus 的研究／程式／檔案／網路工具能力入口。
- GitHub Actions 自動建置與 GitHub Pages 發佈。

## 模型 API 判斷

原始 Suna 架構本來就支援供應商與模型切換，且 GitHub Pages 是純靜態主機，不能安全地把任何模型 API 金鑰放在瀏覽器。因此本版本**沒有強制改成 Manus LLM**，也**不要求使用者填 API key**。UI 會顯示「未要求填寫」，並保留後端接點說明；若之後接上 Suna API、自有後端或其他安全代理，可在伺服器端接入真正的模型執行。

## 本機執行

```bash
npm install
npm run dev
```

## GitHub Pages

推送到 `main` 後，`.github/workflows/deploy-pages.yml` 會建置 `dist` 並部署到 GitHub Pages。首次使用需在 GitHub Repository Settings → Pages → Source 選擇 **GitHub Actions**。

## 來源專案

本工作區的能力設計參考附件中的 Suna、CrewAI、OpenManus 開源專案。原專案的後端、沙箱、OAuth、資料庫與連接器仍應以各自授權與部署方式獨立接入，不直接把伺服器秘密複製到靜態網站。
