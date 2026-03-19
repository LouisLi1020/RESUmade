import { useEffect, useState } from 'react'
import type { Resume } from '@/types/resume'
import { useI18n } from '@/i18n/I18nContext'
import ResumePreview from './ResumePreview'
import { DraggableExperienceList } from './DraggableSectionList'
import { DraggableEducationList } from './DraggableSectionList'
import { getResumePrintHtml } from '@/utils/printHtml'
import { maskPersonalInfo } from '@/utils/privacy'
import { analyzeResumeAgainstJD, optimizeResumeForATS } from '@/utils/analyzer'

type ResumeStyleVariant = 'clean' | 'compact' | 'classic'
type AdvancedToolsTab = 'ats' | 'jd'

interface StepPreviewProps {
  resume: Resume
  onPrev: () => void
  onReorderExperiences: (reordered: Resume['experiences']) => void
  onReorderEducation: (reordered: Resume['education']) => void
}

export default function StepPreview({
  resume,
  onPrev,
  onReorderExperiences,
  onReorderEducation,
}: StepPreviewProps) {
  const { t } = useI18n()
  const [saving, setSaving] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [styleVariant, setStyleVariant] = useState<ResumeStyleVariant>('clean')
  const [showAdvancedTools, setShowAdvancedTools] = useState(false)
  const [advancedToolsTab, setAdvancedToolsTab] = useState<AdvancedToolsTab>('ats')
  const [atsTargetText, setAtsTargetText] = useState('')
  const [atsAnalyzing, setAtsAnalyzing] = useState(false)
  const [atsResult, setAtsResult] = useState<{
    score: number
    suggestionsBySection: {
      introduction: string[]
      experience: string[]
      skills: string[]
      keywords: string[]
    }
  } | null>(null)
  const [jdText, setJdText] = useState('')
  const [jdAnalyzing, setJdAnalyzing] = useState(false)
  const [jdResult, setJdResult] = useState<{
    overall: number
    skills: number
    experience: number
    keywords: number
    suggestions: string[]
  } | null>(null)
  const [aiConfigured, setAiConfigured] = useState(false)
  const [aiModel, setAiModel] = useState('gpt-4.1-mini')
  const [apiKeyDraft, setApiKeyDraft] = useState('')
  const [configMessage, setConfigMessage] = useState<string | null>(null)
  const [aiBudget, setAiBudget] = useState<{ maxCallsPerSession: number; maxOutputTokens: number; maxInputChars: number } | null>(null)
  const [aiUsedCalls, setAiUsedCalls] = useState<number>(0)

  const hasElectron = typeof window !== 'undefined' && window.resumade

  useEffect(() => {
    if (!showAdvancedTools || !hasElectron) return
    ;(async () => {
      const st = await window.resumade!.aiGetStatus()
      if (st.ok) {
        setAiConfigured(!!st.configured)
        if (st.model) setAiModel(st.model)
      }
      const b = await window.resumade!.aiGetBudget()
      if (b.ok && b.budget) {
        setAiBudget(b.budget)
        setAiUsedCalls(b.usedCalls ?? 0)
      }
    })()
  }, [showAdvancedTools, hasElectron])

  const handleSaveAIConfig = async () => {
    if (!hasElectron) return
    setConfigMessage(null)
    const key = apiKeyDraft.trim()
    if (!key) {
      setConfigMessage('Please paste your OpenAI API key.')
      return
    }
    const res = await window.resumade!.aiSetOpenAIConfig({ apiKey: key, model: aiModel })
    if (res.ok) {
      setAiConfigured(true)
      setApiKeyDraft('')
      setConfigMessage('Saved for this session.')
    } else {
      setConfigMessage(res.error || 'Failed to save config.')
    }
  }

  const handleOpenApiKeyPage = async () => {
    if (!hasElectron) return
    const res = await window.resumade!.aiOpenApiKeyPage()
    if (!res.ok) setConfigMessage(res.error || 'Failed to open API key page.')
  }

  const handleSetSaferBudget = async () => {
    if (!hasElectron) return
    // Safe defaults for personal use
    const budget = { maxCallsPerSession: 15, maxOutputTokens: 700, maxInputChars: 10000 }
    const res = await window.resumade!.aiSetBudget(budget)
    if (res.ok) {
      setAiBudget(budget)
      setConfigMessage('Budget guard enabled (safe defaults).')
    } else {
      setConfigMessage(res.error || 'Failed to set budget.')
    }
  }

  const handleSaveDraft = async () => {
    if (!hasElectron) {
      setMessage({ type: 'err', text: t('preview.saveOnlyDesktop') })
      return
    }
    setSaving(true)
    setMessage(null)
    try {
      const payload = JSON.stringify(resume)
      const result = await window.resumade!.saveDraft(payload)
      if (result.ok && result.path) {
        setMessage({ type: 'ok', text: t('preview.savedTo', { path: result.path }) })
      } else {
        setMessage({ type: 'err', text: result.error || t('preview.saveFailed') })
      }
    } finally {
      setSaving(false)
    }
  }

  const handleRunAtsOptimization = async () => {
    setAtsAnalyzing(true)
    setAtsResult(null)
    setMessage(null)
    try {
      const masked = maskPersonalInfo(resume)
      const result = await optimizeResumeForATS({
        resume: masked,
        target: atsTargetText.trim() || null,
      })
      setAtsResult(result)
    } catch (e) {
      const errText = e instanceof Error ? e.message : String(e)
      setMessage({ type: 'err', text: `ATS optimization failed: ${errText}` })
    } finally {
      setAtsAnalyzing(false)
    }
  }

  const handleExportPdf = async () => {
    if (!hasElectron) {
      setMessage({ type: 'err', text: t('preview.exportOnlyDesktop') })
      return
    }
    setExporting(true)
    setMessage(null)
    try {
      const html = getResumePrintHtml(resume, styleVariant)
      const result = await window.resumade!.exportPdf(html)
      if (result.ok && result.path) {
        setMessage({ type: 'ok', text: t('preview.exportTo', { path: result.path }) })
      } else {
        setMessage({ type: 'err', text: result.error || t('preview.exportFailed') })
      }
    } finally {
      setExporting(false)
    }
  }

  const handleRunJdAnalysis = async () => {
    if (!jdText.trim()) {
      setJdResult(null)
      return
    }
    setJdAnalyzing(true)
    setMessage(null)
    try {
      const masked = maskPersonalInfo(resume)
      const result = await analyzeResumeAgainstJD({
        resume: masked,
        jobDescription: jdText,
      })
      setJdResult(result)
    } catch (e) {
      const errText = e instanceof Error ? e.message : String(e)
      setMessage({ type: 'err', text: `JD matching failed: ${errText}` })
    } finally {
      setJdAnalyzing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">{t('preview.heading')}</h2>
        <p className="text-sm text-slate-600 mb-4">{t('preview.dragHint')}</p>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="text-sm text-slate-600">{t('preview.styleLabel')}:</span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setStyleVariant('clean')}
              className={`px-3 py-1 rounded border text-sm ${
                styleVariant === 'clean'
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {t('preview.styleClean')}
            </button>
            <button
              type="button"
              onClick={() => setStyleVariant('compact')}
              className={`px-3 py-1 rounded border text-sm ${
                styleVariant === 'compact'
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {t('preview.styleCompact')}
            </button>
            <button
              type="button"
              onClick={() => setStyleVariant('classic')}
              className={`px-3 py-1 rounded border text-sm ${
                styleVariant === 'classic'
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {t('preview.styleClassic')}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <DraggableExperienceList
              experiences={resume.experiences}
              onReorder={onReorderExperiences}
            />
          </div>
          <div>
            <DraggableEducationList
              education={resume.education}
              onReorder={onReorderEducation}
            />
          </div>
        </div>
        {message && (
          <p
            className={`text-sm mb-4 ${message.type === 'ok' ? 'text-green-700' : 'text-red-600'}`}
          >
            {message.text}
          </p>
        )}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onPrev}
            className="bg-slate-200 text-slate-800 px-4 py-2 rounded hover:bg-slate-300"
          >
            {t('common.back')}
          </button>
          <button
            type="button"
            onClick={() => setShowAdvancedTools(true)}
            className="bg-slate-500 text-white px-4 py-2 rounded hover:bg-slate-600 border border-slate-600"
          >
            {t('preview.advancedTools')}
          </button>
          {hasElectron && (
            <>
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={saving}
                className="bg-slate-600 text-white px-4 py-2 rounded hover:bg-slate-500 disabled:opacity-50"
              >
                {saving ? t('preview.saving') : t('preview.saveDraft')}
              </button>
              <button
                type="button"
                onClick={handleExportPdf}
                disabled={exporting}
                className="bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-700 disabled:opacity-50"
              >
                {exporting ? t('preview.exporting') : t('preview.exportPdf')}
              </button>
            </>
          )}
        </div>
      </div>

      {showAdvancedTools && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowAdvancedTools(false)}
          role="dialog"
          aria-modal="true"
          aria-label={t('preview.advancedTools')}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-slate-800 mb-4">{t('preview.advancedTools')}</h3>
            <div className="bg-slate-50 border border-slate-200 rounded p-3 mb-4 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs text-slate-600">
                  AI provider: <span className="font-medium text-slate-800">OpenAI</span>{' '}
                  {aiConfigured ? (
                    <span className="text-green-700 font-medium">• configured</span>
                  ) : (
                    <span className="text-amber-700 font-medium">• not configured</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-500">Model</label>
                  <input
                    value={aiModel}
                    onChange={(e) => setAiModel(e.target.value)}
                    className="border border-slate-300 rounded px-2 py-1 text-xs w-36"
                    placeholder="gpt-4.1-mini"
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  value={apiKeyDraft}
                  onChange={(e) => setApiKeyDraft(e.target.value)}
                  className="flex-1 min-w-[220px] border border-slate-300 rounded px-2 py-1 text-xs"
                  placeholder="Paste OpenAI API key (stored in-memory for this session)"
                  type="password"
                  autoComplete="off"
                  spellCheck={false}
                />
                <button
                  type="button"
                  onClick={handleSaveAIConfig}
                  className="bg-slate-800 text-white px-3 py-1.5 rounded text-xs hover:bg-slate-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleOpenApiKeyPage}
                  className="bg-white text-slate-700 px-3 py-1.5 rounded text-xs border border-slate-300 hover:bg-slate-100"
                >
                  Get API key
                </button>
                <button
                  type="button"
                  onClick={handleSetSaferBudget}
                  className="bg-white text-slate-700 px-3 py-1.5 rounded text-xs border border-slate-300 hover:bg-slate-100"
                >
                  Enable budget guard
                </button>
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <div>Uses your own OpenAI API key. You are responsible for API usage costs.</div>
                <div>We do not store your key; it stays on your device (in-memory for this session).</div>
                {aiBudget && (
                  <div className="text-slate-500">
                    Budget: max {aiBudget.maxCallsPerSession} calls/session, max {aiBudget.maxOutputTokens} output tokens/call, max {aiBudget.maxInputChars} input chars.
                    {' '}Used: {aiUsedCalls}.
                  </div>
                )}
              </div>
              {configMessage && <div className="text-xs text-slate-600">{configMessage}</div>}
            </div>
            <div className="flex gap-2 border-b border-slate-200 mb-4">
              <button
                type="button"
                onClick={() => setAdvancedToolsTab('ats')}
                className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px ${
                  advancedToolsTab === 'ats'
                    ? 'border-slate-700 text-slate-800'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {t('preview.atsOptimizer')}
              </button>
              <button
                type="button"
                onClick={() => setAdvancedToolsTab('jd')}
                className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px ${
                  advancedToolsTab === 'jd'
                    ? 'border-slate-700 text-slate-800'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {t('preview.jdMatcher')}
              </button>
            </div>
            {advancedToolsTab === 'ats' && (
              <div className="space-y-4 mb-4">
                <p className="text-sm text-slate-600">
                  {t('preview.advancedToolsDescription')}
                </p>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Target role / JD (optional, free text)
                  </label>
                  <textarea
                    value={atsTargetText}
                    onChange={(e) => setAtsTargetText(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2 py-1 text-sm min-h-[80px] focus:outline-none focus:ring-1 focus:ring-slate-500"
                    placeholder="e.g. Graduate software engineer role, focusing on TypeScript/React and backend APIs..."
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs text-slate-500">
                    Personal identifiers (name / email / phone / address) will be masked before analysis.
                  </div>
                  <button
                    type="button"
                    onClick={handleRunAtsOptimization}
                    disabled={atsAnalyzing || !aiConfigured}
                    className="bg-slate-800 text-white px-3 py-1.5 rounded text-sm hover:bg-slate-700 disabled:opacity-50"
                  >
                    {atsAnalyzing ? 'Analyzing…' : 'Run ATS optimization (AI)'}
                  </button>
                </div>
                {atsResult && (
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-slate-700">
                      ATS readiness score: <span className="font-semibold">{atsResult.score}%</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs text-slate-700">
                      <div className="bg-slate-50 border border-slate-200 rounded p-2">
                        <div className="font-semibold mb-1">Introduction</div>
                        <ul className="list-disc list-inside space-y-1">
                          {atsResult.suggestionsBySection.introduction.map((s, idx) => (
                            <li key={idx}>{s}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded p-2">
                        <div className="font-semibold mb-1">Skills</div>
                        <ul className="list-disc list-inside space-y-1">
                          {atsResult.suggestionsBySection.skills.map((s, idx) => (
                            <li key={idx}>{s}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded p-2">
                        <div className="font-semibold mb-1">Experience</div>
                        <ul className="list-disc list-inside space-y-1">
                          {atsResult.suggestionsBySection.experience.map((s, idx) => (
                            <li key={idx}>{s}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded p-2">
                        <div className="font-semibold mb-1">Keywords</div>
                        <ul className="list-disc list-inside space-y-1">
                          {atsResult.suggestionsBySection.keywords.map((s, idx) => (
                            <li key={idx}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {advancedToolsTab === 'jd' && (
              <div className="space-y-4 mb-4">
                <p className="text-sm text-slate-600">
                  {t('preview.advancedToolsDescription')}
                </p>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Job description / posting (paste text)
                  </label>
                  <textarea
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2 py-1 text-sm min-h-[100px] focus:outline-none focus:ring-1 focus:ring-slate-500"
                    placeholder="Paste the full text of a job description here to analyze how well this resume matches it..."
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs text-slate-500">
                    We will use the masked resume (without name / email / phone / address) to compute section-aware scores.
                  </div>
                  <button
                    type="button"
                    onClick={handleRunJdAnalysis}
                    disabled={jdAnalyzing || !jdText.trim() || !aiConfigured}
                    className="bg-slate-800 text-white px-3 py-1.5 rounded text-sm hover:bg-slate-700 disabled:opacity-50"
                  >
                    {jdAnalyzing ? 'Analyzing…' : 'Run JD matching (AI)'}
                  </button>
                </div>
                {jdResult && (
                  <div className="space-y-3">
                    <div className="text-sm font-medium text-slate-700">
                      Match score: <span className="font-semibold">{jdResult.overall}%</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-xs text-slate-700">
                      <div>
                        <div className="font-semibold">Skills</div>
                        <div>{jdResult.skills}%</div>
                      </div>
                      <div>
                        <div className="font-semibold">Experience</div>
                        <div>{jdResult.experience}%</div>
                      </div>
                      <div>
                        <div className="font-semibold">Keywords</div>
                        <div>{jdResult.keywords}%</div>
                      </div>
                    </div>
                    {jdResult.suggestions.length > 0 && (
                      <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 max-h-44 overflow-auto">
                        {jdResult.suggestions.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            )}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowAdvancedTools(false)}
                className="bg-slate-200 text-slate-800 px-4 py-2 rounded hover:bg-slate-300"
              >
                {t('common.back')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-slate-100 rounded-lg p-4">
        <h3 className="text-sm font-medium text-slate-600 mb-3">{t('preview.resumePreview')}</h3>
        <ResumePreview resume={resume} styleVariant={styleVariant} />
      </div>
    </div>
  )
}
