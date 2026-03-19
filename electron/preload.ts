import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('resumade', {
  saveDraft: (payload: string) => ipcRenderer.invoke('resume:saveDraft', payload),
  loadDraft: () => ipcRenderer.invoke('resume:loadDraft'),
  exportPdf: (htmlContent: string) => ipcRenderer.invoke('resume:exportPdf', htmlContent),
})
