/// <reference types="vite/client" />

interface ResumadeAPI {
  saveDraft: (payload: string) => Promise<{ ok: boolean; path: string | null; error?: string }>
  loadDraft: () => Promise<{ ok: boolean; data: string | null; error?: string }>
  exportPdf: (htmlContent: string) => Promise<{ ok: boolean; path: string | null; error?: string }>
}

declare global {
  interface Window {
    resumade?: ResumadeAPI
  }
}

export {}
