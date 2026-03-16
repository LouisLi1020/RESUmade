import { useState } from 'react'
import type { Resume } from '@/types/resume'
import ResumePreview from './ResumePreview'
import { DraggableExperienceList } from './DraggableSectionList'
import { DraggableEducationList } from './DraggableSectionList'
import { getResumePrintHtml } from '@/utils/printHtml'

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
  const [saving, setSaving] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  const hasElectron = typeof window !== 'undefined' && window.resumade

  const handleSaveDraft = async () => {
    if (!hasElectron) {
      setMessage({ type: 'err', text: 'Save is only available in the desktop app.' })
      return
    }
    setSaving(true)
    setMessage(null)
    try {
      const payload = JSON.stringify(resume)
      const result = await window.resumade!.saveDraft(payload)
      if (result.ok && result.path) {
        setMessage({ type: 'ok', text: `Saved to ${result.path}` })
      } else {
        setMessage({ type: 'err', text: result.error || 'Save cancelled or failed.' })
      }
    } finally {
      setSaving(false)
    }
  }

  const handleExportPdf = async () => {
    if (!hasElectron) {
      setMessage({ type: 'err', text: 'Export PDF is only available in the desktop app.' })
      return
    }
    setExporting(true)
    setMessage(null)
    try {
      const html = getResumePrintHtml(resume)
      const result = await window.resumade!.exportPdf(html)
      if (result.ok && result.path) {
        setMessage({ type: 'ok', text: `Exported to ${result.path}` })
      } else {
        setMessage({ type: 'err', text: result.error || 'Export cancelled or failed.' })
      }
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Preview & Edit</h2>
        <p className="text-sm text-slate-600 mb-4">
          Drag the items below to change the order of experience and education on your resume.
        </p>
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
            Back
          </button>
          {hasElectron && (
            <>
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={saving}
                className="bg-slate-600 text-white px-4 py-2 rounded hover:bg-slate-500 disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save draft'}
              </button>
              <button
                type="button"
                onClick={handleExportPdf}
                disabled={exporting}
                className="bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-700 disabled:opacity-50"
              >
                {exporting ? 'Exporting…' : 'Export PDF'}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-slate-100 rounded-lg p-4">
        <h3 className="text-sm font-medium text-slate-600 mb-3">Resume preview</h3>
        <ResumePreview resume={resume} />
      </div>
    </div>
  )
}
