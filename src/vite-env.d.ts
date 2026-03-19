/// <reference types="vite/client" />

interface ResumadeAPI {
  saveDraft: (payload: string) => Promise<{ ok: boolean; path: string | null; error?: string }>
  loadDraft: () => Promise<{ ok: boolean; data: string | null; error?: string }>
  exportPdf: (htmlContent: string) => Promise<{ ok: boolean; path: string | null; error?: string }>
  aiGetStatus: () => Promise<{ ok: boolean; provider: 'openai' | null; model?: string; configured: boolean; error?: string }>
  aiSetOpenAIConfig: (config: { apiKey: string; model: string }) => Promise<{ ok: boolean; error?: string }>
  aiAnalyzeJD: (payload: { resume: unknown; jobDescription: string }) => Promise<{ ok: boolean; result?: unknown; error?: string }>
  aiOptimizeATS: (payload: { resume: unknown; target?: string | null }) => Promise<{ ok: boolean; result?: unknown; error?: string }>
  aiOpenApiKeyPage: () => Promise<{ ok: boolean; error?: string }>
  aiGetBudget: () => Promise<{ ok: boolean; budget?: { maxCallsPerSession: number; maxOutputTokens: number; maxInputChars: number }; usedCalls?: number; error?: string }>
  aiSetBudget: (budget: { maxCallsPerSession: number; maxOutputTokens: number; maxInputChars: number }) => Promise<{ ok: boolean; error?: string }>
}

declare global {
  interface Window {
    resumade?: ResumadeAPI
  }
}

export {}
