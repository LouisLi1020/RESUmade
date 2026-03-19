import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import * as path from 'path'
import * as fs from 'fs'

let mainWindow: BrowserWindow | null = null
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('closed', () => { mainWindow = null })
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// --- IPC: save draft (JSON)
ipcMain.handle('resume:saveDraft', async (_, payload: string) => {
  const { filePath, canceled } = await dialog.showSaveDialog(mainWindow!, {
    defaultPath: 'resume.resumade.json',
    filters: [{ name: 'RESUmade JSON', extensions: ['resumade.json', 'json'] }],
  })
  if (canceled || !filePath) return { ok: false, path: null }
  try {
    fs.writeFileSync(filePath, payload, 'utf-8')
    return { ok: true, path: filePath }
  } catch (e) {
    return { ok: false, path: null, error: String(e) }
  }
})

// --- IPC: load draft (JSON)
ipcMain.handle('resume:loadDraft', async () => {
  const { filePaths, canceled } = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openFile'],
    filters: [{ name: 'RESUmade JSON', extensions: ['resumade.json', 'json'] }],
  })
  if (canceled || filePaths.length === 0) return { ok: false, data: null }
  try {
    const data = fs.readFileSync(filePaths[0], 'utf-8')
    return { ok: true, data }
  } catch (e) {
    return { ok: false, data: null, error: String(e) }
  }
})

// --- IPC: export PDF (open print dialog; user can "Save as PDF")
ipcMain.handle('resume:exportPdf', async (_, htmlContent: string) => {
  if (!mainWindow) return { ok: false }
  const pdfWindow = new BrowserWindow({
    width: 794,
    height: 1123,
    show: false,
    webPreferences: { contextIsolation: true },
  })
  pdfWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent))
  await new Promise<void>((resolve) => pdfWindow.webContents.on('did-finish-load', () => resolve()))

  const { filePath, canceled } = await dialog.showSaveDialog(mainWindow, {
    defaultPath: 'resume.pdf',
    filters: [{ name: 'PDF', extensions: ['pdf'] }],
  })
  if (canceled || !filePath) {
    pdfWindow.close()
    return { ok: false, path: null }
  }
  try {
    await pdfWindow.webContents.printToPDF({
      printBackground: true,
      margins: { marginType: 'default' },
    }).then((buf) => fs.writeFileSync(filePath, buf))
    pdfWindow.close()
    return { ok: true, path: filePath }
  } catch (e) {
    pdfWindow.close()
    return { ok: false, path: null, error: String(e) }
  }
})
