import { useState } from 'react'
import type { Resume } from '@/types/resume'
import { useI18n } from '@/i18n/I18nContext'
import ResumePreview from './ResumePreview'
import { DraggableExperienceList } from './DraggableSectionList'
import { DraggableEducationList } from './DraggableSectionList'
import { getResumePrintHtml } from '@/utils/printHtml'

type ResumeStyleVariant = 'clean' | 'compact' | 'classic'

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

  const hasElectron = typeof window !== 'undefined' && window.resumade

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

      <div className="bg-slate-100 rounded-lg p-4">
        <h3 className="text-sm font-medium text-slate-600 mb-3">{t('preview.resumePreview')}</h3>
        <ResumePreview resume={resume} styleVariant={styleVariant} />
      </div>
    </div>
  )
}
