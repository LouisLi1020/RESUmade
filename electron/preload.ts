import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('resumade', {
  saveDraft: (payload: string) => ipcRenderer.invoke('resume:saveDraft', payload),
  loadDraft: () => ipcRenderer.invoke('resume:loadDraft'),
  exportPdf: (htmlContent: string) => ipcRenderer.invoke('resume:exportPdf', htmlContent),
  aiGetStatus: () => ipcRenderer.invoke('ai:getStatus'),
  aiSetOpenAIConfig: (config: { apiKey: string; model: string }) => ipcRenderer.invoke('ai:setOpenAIConfig', config),
  aiAnalyzeJD: (payload: { resume: unknown; jobDescription: string }) => ipcRenderer.invoke('ai:analyzeJD', payload),
  aiOptimizeATS: (payload: { resume: unknown; target?: string | null }) => ipcRenderer.invoke('ai:optimizeATS', payload),
  aiOpenApiKeyPage: () => ipcRenderer.invoke('ai:openApiKeyPage'),
  aiGetBudget: () => ipcRenderer.invoke('ai:getBudget'),
  aiSetBudget: (budget: { maxCallsPerSession: number; maxOutputTokens: number; maxInputChars: number }) =>
    ipcRenderer.invoke('ai:setBudget', budget),
})
