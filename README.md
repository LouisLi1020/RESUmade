# RESUmade

一款幫你快速產生一頁式履歷的桌面應用程式。  
使用者只需依照步驟輸入個人資料、經歷與技能，接著在預覽畫面拖拉排序各模組，即可一鍵匯出美觀的 PDF 履歷。

---

## 功能特色

- **引導式表單流程**：分步填寫 Personal / Introduction / Experience / Education / Skills
- **模組化拖拉排序**：工作經歷、專案、教育等段落可自由排序
- **即時預覽**：所見即所得的 Resume 預覽畫面
- **離線使用**：所有資料儲存在本機，不需網路與後端伺服器
- **一鍵匯出**：支援匯出為 PDF，方便投遞履歷
- **儲存 / 開啟草稿**：可將履歷存成 `.resumade.json`，之後再開啟繼續編輯

---

## 技術棧（Tech Stack）

| 項目 | 技術 |
|------|------|
| 桌面框架 | Electron |
| 前端 | React 18 + TypeScript |
| 建置 | Vite 6 |
| 樣式 | Tailwind CSS |
| 拖拉排序 | @dnd-kit (core + sortable + utilities) |
| PDF | Electron `webContents.printToPDF()` |

---

## 系統架構

- **Electron Main Process** (`electron/main.ts`)
  - 建立應用視窗，開發時載入 `http://localhost:5173`，正式版載入 `dist/index.html`
  - 檔案 I/O：儲存 / 讀取 JSON 草稿、匯出 PDF
  - IPC handlers：`resume:saveDraft`、`resume:loadDraft`、`resume:exportPdf`
- **Renderer（React）**
  - Stepper 流程：Personal → Introduction → Experience → Education → Skills → Preview & Edit
  - 表單元件與 `useResumeForm` 管理 `Resume` 狀態
  - Preview 步驟：拖拉排序 Experience / Education 模組，即時預覽 + 匯出 PDF / 儲存草稿

---

## 專案結構

```
RESUmade/
├── electron/
│   ├── main.ts        # Electron 主進程、IPC
│   └── preload.ts     # 暴露 resumade API 給 Renderer
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   │   ├── Stepper.tsx
│   │   ├── StepPersonalForm.tsx
│   │   ├── StepIntroductionForm.tsx
│   │   ├── StepExperienceForm.tsx
│   │   ├── StepEducationForm.tsx
│   │   ├── StepSkillsForm.tsx
│   │   ├── StepPreview.tsx
│   │   ├── ResumePreview.tsx
│   │   └── DraggableSectionList.tsx
│   ├── hooks/
│   │   └── useResumeForm.ts
│   ├── types/
│   │   └── resume.ts
│   ├── utils/
│   │   └── printHtml.ts   # 產生 PDF 用 HTML
│   └── styles/
│       └── index.css
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── tsconfig.electron.json
```

---

## 開發環境

### 先決條件

- **Node.js 18+**（建議用 nvm 管理）
- **npm** 或 yarn / pnpm

### 安裝與啟動

```bash
# 進入專案
cd RESUmade

# 安裝依賴
npm install

# 若有漏洞提示，可執行（非必須）
npm audit fix

# 啟動開發模式（會先編譯 Electron，再同時啟動 Vite 與 Electron）
npm run dev
```

**安裝時出現 deprecated / vulnerability 警告？**  
- 專案已將 `electron`、`electron-builder`、`vite` 等升級以降低漏洞與過時套件；部分警告來自上游依賴，不影響本機開發與打包。  
- 若出現 `TAR_ENTRY_ERROR ... xmlbuilder/.vscode`：多數不影響安裝結果，可忽略；若安裝中斷，可先執行 `npm cache clean --force`，刪除 `node_modules` 與 `package-lock.json` 後再執行 `npm install`。

- 瀏覽器會開 Vite 開發站（若只跑 `npm run dev:vite` 則僅有網頁版，無儲存/匯出 PDF）
- 桌面視窗會由 Electron 開啟，可測試「Open draft / Save draft / Export PDF」

### 僅跑網頁版（無 Electron）

```bash
npm run dev:vite
```

然後開啟 http://localhost:5173 。儲存與匯出按鈕在非 Electron 環境下會顯示「僅在桌面版可用」。

---

## 建置與部署

### 建置

```bash
# 建置前端 + Electron 主進程
npm run build
```

- 產出：`dist/`（前端靜態檔）、`dist-electron/`（main.js, preload.js）

### 打包成安裝檔

```bash
# 打包（不壓縮成安裝檔，僅產出目錄）
npm run pack

# 產出 .dmg / .exe 等安裝檔
npm run dist
```

- macOS：`release/RESUmade-x.x.x.dmg`（或 zip）
- Windows：`release/` 內 NSIS 安裝檔

### 發佈

- 將 `release/` 內的安裝檔上傳至 GitHub Releases 或個人空間，供使用者下載安裝即可離線使用。

---

## 使用流程（使用者）

1. 開啟 RESUmade 桌面應用
2. 可點選「Open draft」開啟先前儲存的 `.resumade.json`
3. 依序填寫：Personal → Introduction → Experience → Education → Skills
4. 進入 **Preview & Edit**：可拖拉「Experience」「Education」區塊調整順序，下方即時預覽
5. **Save draft**：存成 JSON，之後可再開啟編輯
6. **Export PDF**：選擇儲存路徑後產生一頁式履歷 PDF

---

## 授權與備註

- 專案名稱暫定 RESUmade；技術棧與架構可依需求再調整。
- 若需多模板、多語系或 Word 匯出，可在此架構上擴充。
