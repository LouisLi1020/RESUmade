import type { CertificationQualification } from '@/types/resume'
import { useI18n } from '@/i18n/I18nContext'
import { inlineMarkdownToHtml } from '@/utils/markdown'

interface Props {
  certifications: CertificationQualification[]
  onAdd: () => void
  onUpdate: (id: string, patch: Partial<CertificationQualification>) => void
  onRemove: (id: string) => void
  onPrev: () => void
  onNext: () => void
}

export default function StepCertificationsForm({
  certifications,
  onAdd,
  onUpdate,
  onRemove,
  onPrev,
  onNext,
}: Props) {
  const { t } = useI18n()

  const addDetail = (id: string) => {
    const cert = certifications.find((c) => c.id === id)
    if (!cert) return
    onUpdate(id, { details: [...cert.details, ''] })
  }

  const updateDetail = (id: string, detailIndex: number, value: string) => {
    const cert = certifications.find((c) => c.id === id)
    if (!cert) return
    const next = [...cert.details]
    next[detailIndex] = value
    onUpdate(id, { details: next })
  }

  const removeDetail = (id: string, detailIndex: number) => {
    const cert = certifications.find((c) => c.id === id)
    if (!cert) return
    onUpdate(id, { details: cert.details.filter((_, i) => i !== detailIndex) })
  }

  const anyCert = certifications.length > 0

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Certifications / Qualifications</h2>
        <button
          type="button"
          onClick={onAdd}
          className="text-sm bg-slate-800 text-white px-3 py-1.5 rounded hover:bg-slate-700"
        >
          {t('common.add')}
        </button>
      </div>

      {!anyCert ? (
        <p className="text-slate-500 text-sm mb-4">{`No certifications yet. Click "+ Add" to add one.`}</p>
      ) : (
        <div className="space-y-6">
          {certifications.map((cert) => (
            <div key={cert.id} className="border border-slate-200 rounded p-4 bg-slate-50">
              <div className="flex justify-end mb-2">
                <button
                  type="button"
                  onClick={() => onRemove(cert.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  {t('common.remove')}
                </button>
              </div>

              <div className="grid gap-2 mb-2">
                <input
                  type="text"
                  value={cert.title}
                  onChange={(e) => onUpdate(cert.id, { title: e.target.value })}
                  className="w-full border border-slate-300 rounded px-3 py-2"
                  placeholder="Certification title"
                />
                <input
                  type="text"
                  value={cert.issuer}
                  onChange={(e) => onUpdate(cert.id, { issuer: e.target.value })}
                  className="w-full border border-slate-300 rounded px-3 py-2"
                  placeholder="Issuing organization"
                />
                <input
                  type="text"
                  value={cert.issueDate}
                  onChange={(e) => onUpdate(cert.id, { issueDate: e.target.value })}
                  className="w-full border border-slate-300 rounded px-3 py-2"
                  placeholder="Issue / obtained date"
                />
              </div>

              <div className="mt-2">
                <label className="block text-sm text-slate-600 mb-1">Details (bullet points)</label>
                {cert.details.map((d, i) => (
                  <div key={i} className="mb-2">
                    <div className="flex gap-2 mb-1">
                      <input
                        type="text"
                        value={d}
                        onChange={(e) => updateDetail(cert.id, i, e.target.value)}
                        className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm"
                        placeholder="•"
                      />
                      <button
                        type="button"
                        onClick={() => removeDetail(cert.id, i)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ×
                      </button>
                    </div>
                    {d.trim() && (
                      <div className="ml-1 pl-3 border-l border-dashed border-slate-200">
                        <div
                          className="text-xs text-slate-600"
                          dangerouslySetInnerHTML={{ __html: inlineMarkdownToHtml(d) }}
                        />
                      </div>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addDetail(cert.id)}
                  className="text-sm text-slate-600 hover:text-slate-800 mt-1"
                >
                  {t('education.addBullet')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="bg-slate-200 text-slate-800 px-4 py-2 rounded hover:bg-slate-300"
        >
          {t('common.back')}
        </button>
        <button
          type="button"
          onClick={onNext}
          className="bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-700"
        >
          {t('common.next')}
        </button>
      </div>
    </div>
  )
}

