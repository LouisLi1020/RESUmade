# RESUmade

一款幫你快速產生**一頁式履歷**的桌面應用程式。  
依照步驟輸入個人資料、經歷與技能，在預覽畫面拖拉排序各模組，即可匯出 PDF 履歷。

**目前狀態**：v0.2.x，已可日常使用與打包；程式已推送到 [GitHub](https://github.com/LouisLi1020/RESUmade)。

---

## 功能特色（已實現）

- **引導式表單**：Personal → Introduction → Experience → Education → Skills，分步填寫
- **拖拉排序**：工作經歷、教育等段落可拖曳調整順序
- **即時預覽**：Preview & Edit 步驟所見即所得
- **離線使用**：資料僅存本機，無需後端
- **匯出 PDF**：一鍵匯出，可自選儲存路徑
- **草稿存讀**：存成 `.resumade.json`，之後可「Open draft」繼續編輯
- **多語系介面**：內建 English / 繁體中文 / 简体中文，可在右上角切換
- **社群連結圖標**：支援 LinkedIn / GitHub / X / Instagram / Facebook / Spotify 等 icon，並可選擇是否顯示網址文字
- **樣式風格切換**：Clean / Compact / Classic 三種 style bundle，同步套用在預覽與 PDF
- **輕量排版標記**：Introduction 與各段落 bullet 支援簡易 Markdown（**粗體** / *斜體* / __底線__）

> 目前表單主要以英文欄位命名，但文案已支援繁中／簡中／英文切換。

---

## 技術棧

| 項目     | 技術 |
|----------|------|
| 桌面框架 | Electron 33 |
| 前端     | React 18 + TypeScript |
| 建置     | Vite 6 |
| 樣式     | Tailwind CSS |
| 拖拉排序 | @dnd-kit (core + sortable + utilities) |
| PDF 產生 | Electron `webContents.printToPDF()` |

---

## 系統架構簡述

- **Main Process**（`electron/main.ts`）：視窗、IPC、檔案存讀與 PDF 匯出
- **Renderer**（React）：Stepper、表單、預覽、拖拉列表；透過 `window.resumade` 呼叫 Save / Load / Export PDF

---

## 專案結構

```
RESUmade/
├── electron/           # Electron 主進程
│   ├── main.ts
│   └── preload.ts
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── components/     # 各步驟表單、Stepper、Preview、拖拉列表
│   ├── hooks/          # useResumeForm
│   ├── types/          # resume 型別
│   ├── utils/          # printHtml（PDF 用 HTML）
│   └── styles/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig*.json
```

---

## 開發環境

### 先決條件

- **Node.js 18+**（建議用 nvm）
- **npm**（或 yarn / pnpm）

### 安裝

```bash
cd RESUmade
npm install
```

若出現漏洞提示，可執行（可選）：`npm audit fix`

### 啟動開發模式

```bash
npm run dev
```

- 會先編譯 Electron，再同時啟動 Vite 與 Electron
- 瀏覽器可開 http://localhost:5173（僅前端）；**桌面視窗**由 Electron 開啟，才能使用「Open draft / Save draft / Export PDF」

### 僅跑網頁版（無 Electron）

```bash
npm run dev:vite
```

開啟 http://localhost:5173。儲存與匯出在網頁版會顯示「僅在桌面版可用」。

### 安裝時常見狀況

- **deprecated / vulnerability 警告**：專案已升級 electron、electron-builder、vite 等以降低風險；其餘多來自上游依賴，不影響本機開發與打包。
- **`TAR_ENTRY_ERROR ... xmlbuilder/.vscode`**：多數不影響安裝結果；若安裝中斷，可執行 `npm cache clean --force`，刪除 `node_modules` 與 `package-lock.json` 後再 `npm install`。

---

## 建置與部署

```bash
# 建置（產出 dist/、dist-electron/）
npm run build

# 打包成安裝檔目錄（不壓縮）
npm run pack

# 產出 .dmg / .exe 等安裝檔
npm run dist
```

- macOS：`release/` 內 dmg、zip
- Windows：`release/` 內 NSIS 安裝檔  
可將安裝檔上傳至 [GitHub Releases](https://github.com/LouisLi1020/RESUmade/releases) 或個人空間供下載。

---

## 使用流程（使用者）

1. 開啟 RESUmade 桌面應用
2. 可點「Open draft」開啟先前儲存的 `.resumade.json`
3. 依序填寫：Personal → Introduction → Experience → Education → Skills
4. 進入 **Preview & Edit**：拖拉 Experience / Education 區塊調整順序，下方即時預覽
5. **Save draft**：存成 JSON，之後可再開啟編輯
6. **Export PDF**：選擇儲存路徑後產生一頁式履歷 PDF

---

## 後續規劃

- **多模板**：多種履歷版型可選
- **更多排版控制**：字級微調、段落間距預設組合
- **匯出**：Word / Markdown 等格式（可選）

---

## English overview

RESUmade is a lightweight **one-page resume** desktop app.  
It guides you through Personal / Introduction / Experience / Education / Skills, lets you reorder sections visually, and exports a single-page PDF.

### Current capabilities

- **Guided steps**: Personal → Introduction → Experience → Education → Skills  
- **Drag & drop ordering** for experience and education blocks  
- **Live Preview & Edit** with on-screen resume preview  
- **Offline-first**: data stays on your machine, no backend  
- **PDF export** via Electron `printToPDF()`  
- **Draft save/load** as `.resumade.json`  
- **Multi-language UI**: English / Traditional Chinese / Simplified Chinese  
- **Social links with icons** (LinkedIn, GitHub, X, Instagram, Facebook, Spotify, generic link)  
- **Style bundles**: Clean / Compact / Classic, shared by preview and PDF  
- **Lightweight Markdown formatting** in introduction and bullet points (**bold**, *italic*, __underline__)  

For more details and releases, see the [GitHub repo](https://github.com/LouisLi1020/RESUmade).

---

## 授權與備註

- 專案名稱：RESUmade  
- 技術棧與架構可依需求調整；若需貢獻或 fork，請參考 [GitHub 倉庫](https://github.com/LouisLi1020/RESUmade)。
