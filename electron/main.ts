import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron'
import * as path from 'path'
import * as fs from 'fs'

let mainWindow: BrowserWindow | null = null
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

// --- AI config (in-memory; user supplies API key)
let openaiApiKey: string | null = null
let openaiModel: string = 'gpt-4.1-mini'
let aiUsedCallsThisSession = 0
let aiBudget = {
  maxCallsPerSession: 20,
  maxOutputTokens: 900,
  maxInputChars: 12000,
}

type JsonSchema = Record<string, unknown>

function getAggregatedOutputText(responseJson: any): string {
  if (!responseJson || !Array.isArray(responseJson.output)) return ''
  const chunks: string[] = []
  for (const item of responseJson.output) {
    if (item?.type !== 'message') continue
    if (!Array.isArray(item.content)) continue
    for (const c of item.content) {
      if (c?.type === 'output_text' && typeof c.text === 'string') chunks.push(c.text)
    }
  }
  return chunks.join('\n').trim()
}

async function callOpenAIJsonSchema<T>(args: {
  schemaName: string
  schema: JsonSchema
  system: string
  user: string
}): Promise<T> {
  if (!openaiApiKey) throw new Error('OpenAI API key is not set')
  if (aiUsedCallsThisSession >= aiBudget.maxCallsPerSession) {
    throw new Error(`AI budget reached: max ${aiBudget.maxCallsPerSession} calls per session`)
  }

  const userTruncated = args.user.length > aiBudget.maxInputChars
    ? args.user.slice(0, aiBudget.maxInputChars) + '\n\n[Truncated due to input limit]'
    : args.user

  const body = {
    model: openaiModel,
    input: [
      {
        role: 'system',
        content: [{ type: 'input_text', text: args.system }],
      },
      {
        role: 'user',
        content: [{ type: 'input_text', text: userTruncated }],
      },
    ],
    text: {
      format: {
        type: 'json_schema',
        name: args.schemaName,
        schema: args.schema,
        strict: true,
      },
    },
    max_output_tokens: aiBudget.maxOutputTokens,
  }

  const res = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    throw new Error(`OpenAI error ${res.status}: ${errText || res.statusText}`)
  }

  const json = await res.json()
  const out = getAggregatedOutputText(json)
  if (!out) throw new Error('OpenAI returned empty output')
  try {
    aiUsedCallsThisSession += 1
    return JSON.parse(out) as T
  } catch (e) {
    throw new Error(`Failed to parse model JSON output: ${String(e)}\n\nRaw:\n${out}`)
  }
}

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

// --- IPC: AI status/config
ipcMain.handle('ai:getStatus', async () => {
  return {
    ok: true,
    provider: 'openai' as const,
    model: openaiModel,
    configured: !!openaiApiKey,
  }
})

ipcMain.handle('ai:setOpenAIConfig', async (_, config: { apiKey: string; model: string }) => {
  try {
    const key = (config.apiKey ?? '').trim()
    const model = (config.model ?? '').trim()
    if (!key) return { ok: false, error: 'Missing OpenAI API key' }
    if (!model) return { ok: false, error: 'Missing model name' }
    openaiApiKey = key
    openaiModel = model
    return { ok: true }
  } catch (e) {
    return { ok: false, error: String(e) }
  }
})

ipcMain.handle('ai:openApiKeyPage', async () => {
  try {
    // Official OpenAI API keys page (user must be signed in)
    await shell.openExternal('https://platform.openai.com/api-keys')
    return { ok: true }
  } catch (e) {
    return { ok: false, error: String(e) }
  }
})

ipcMain.handle('ai:getBudget', async () => {
  return { ok: true, budget: aiBudget, usedCalls: aiUsedCallsThisSession }
})

ipcMain.handle('ai:setBudget', async (_, budget: { maxCallsPerSession: number; maxOutputTokens: number; maxInputChars: number }) => {
  try {
    const maxCallsPerSession = Math.max(1, Math.min(200, Math.floor(budget.maxCallsPerSession)))
    const maxOutputTokens = Math.max(128, Math.min(4000, Math.floor(budget.maxOutputTokens)))
    const maxInputChars = Math.max(2000, Math.min(60000, Math.floor(budget.maxInputChars)))
    aiBudget = { maxCallsPerSession, maxOutputTokens, maxInputChars }
    return { ok: true }
  } catch (e) {
    return { ok: false, error: String(e) }
  }
})

// --- IPC: JD matcher (LLM)
ipcMain.handle('ai:analyzeJD', async (_, payload: { resume: unknown; jobDescription: string }) => {
  try {
    const schema: JsonSchema = {
      type: 'object',
      additionalProperties: false,
      properties: {
        overall: { type: 'number', minimum: 0, maximum: 100 },
        skills: { type: 'number', minimum: 0, maximum: 100 },
        experience: { type: 'number', minimum: 0, maximum: 100 },
        keywords: { type: 'number', minimum: 0, maximum: 100 },
        suggestions: { type: 'array', items: { type: 'string' }, maxItems: 12 },
      },
      required: ['overall', 'skills', 'experience', 'keywords', 'suggestions'],
    }

    const system =
      'You are a strict resume-vs-job-description evaluator. Return section-aware match scores and actionable suggestions. Output MUST match the provided JSON schema.'
    const user = `Job description:\n${payload.jobDescription}\n\nResume (masked JSON):\n${JSON.stringify(payload.resume)}`

    const result = await callOpenAIJsonSchema<{
      overall: number
      skills: number
      experience: number
      keywords: number
      suggestions: string[]
    }>({ schemaName: 'jd_match', schema, system, user })

    return { ok: true, result }
  } catch (e) {
    return { ok: false, error: String(e) }
  }
})

// --- IPC: ATS optimizer (LLM)
ipcMain.handle('ai:optimizeATS', async (_, payload: { resume: unknown; target?: string | null }) => {
  try {
    const schema: JsonSchema = {
      type: 'object',
      additionalProperties: false,
      properties: {
        score: { type: 'number', minimum: 0, maximum: 100 },
        suggestionsBySection: {
          type: 'object',
          additionalProperties: false,
          properties: {
            introduction: { type: 'array', items: { type: 'string' }, maxItems: 8 },
            experience: { type: 'array', items: { type: 'string' }, maxItems: 10 },
            skills: { type: 'array', items: { type: 'string' }, maxItems: 8 },
            keywords: { type: 'array', items: { type: 'string' }, maxItems: 10 },
          },
          required: ['introduction', 'experience', 'skills', 'keywords'],
        },
      },
      required: ['score', 'suggestionsBySection'],
    }

    const system =
      'You are an ATS-focused resume writing assistant. Provide section-wise optimization suggestions and an overall ATS readiness score. Output MUST match the provided JSON schema.'
    const targetText = payload.target ? `Target role/JD:\n${payload.target}\n\n` : ''
    const user = `${targetText}Resume (masked JSON):\n${JSON.stringify(payload.resume)}`

    const result = await callOpenAIJsonSchema<{
      score: number
      suggestionsBySection: { introduction: string[]; experience: string[]; skills: string[]; keywords: string[] }
    }>({ schemaName: 'ats_opt', schema, system, user })

    return { ok: true, result }
  } catch (e) {
    return { ok: false, error: String(e) }
  }
})
