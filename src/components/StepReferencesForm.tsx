import type { Reference } from '@/types/resume'
import { useI18n } from '@/i18n/I18nContext'

interface Props {
  references: Reference[]
  onAdd: () => void
  onUpdate: (id: string, patch: Partial<Reference>) => void
  onRemove: (id: string) => void
  onPrev: () => void
  onNext: () => void
}

export default function StepReferencesForm({
  references,
  onAdd,
  onUpdate,
  onRemove,
  onPrev,
  onNext,
}: Props) {
  const { t } = useI18n()

  const anyRef = references.length > 0

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">References</h2>
        <button
          type="button"
          onClick={onAdd}
          className="text-sm bg-slate-800 text-white px-3 py-1.5 rounded hover:bg-slate-700"
        >
          {t('common.add')}
        </button>
      </div>

      {!anyRef ? (
        <p className="text-slate-500 text-sm mb-4">{`No references yet. Click "+ Add" to add one.`}</p>
      ) : (
        <div className="space-y-6">
          {references.map((ref) => (
            <div key={ref.id} className="border border-slate-200 rounded p-4 bg-slate-50">
              <div className="flex justify-end mb-2">
                <button
                  type="button"
                  onClick={() => onRemove(ref.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  {t('common.remove')}
                </button>
              </div>

              <div className="grid gap-2 mb-2">
                <input
                  type="text"
                  value={ref.name}
                  onChange={(e) => onUpdate(ref.id, { name: e.target.value })}
                  className="w-full border border-slate-300 rounded px-3 py-2"
                  placeholder="Reference name"
                />
                <input
                  type="text"
                  value={ref.company}
                  onChange={(e) => onUpdate(ref.id, { company: e.target.value })}
                  className="w-full border border-slate-300 rounded px-3 py-2"
                  placeholder="Company / Organization"
                />
                <input
                  type="text"
                  value={ref.roleOrRelation}
                  onChange={(e) => onUpdate(ref.id, { roleOrRelation: e.target.value })}
                  className="w-full border border-slate-300 rounded px-3 py-2"
                  placeholder="Role / Relationship (e.g., Manager)"
                />
              </div>

              <div className="mt-3 border-t border-slate-200 pt-3 space-y-2">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={ref.showContactInfo}
                    onChange={(e) => onUpdate(ref.id, { showContactInfo: e.target.checked })}
                  />
                  Show contact info (email / phone / link) on the final resume
                </label>

                {ref.showContactInfo ? (
                  <div className="grid gap-2">
                    <input
                      type="text"
                      value={ref.contactEmail}
                      onChange={(e) => onUpdate(ref.id, { contactEmail: e.target.value })}
                      className="w-full border border-slate-300 rounded px-3 py-2"
                      placeholder="Email"
                    />
                    <input
                      type="text"
                      value={ref.contactPhone}
                      onChange={(e) => onUpdate(ref.id, { contactPhone: e.target.value })}
                      className="w-full border border-slate-300 rounded px-3 py-2"
                      placeholder="Phone"
                    />
                    <input
                      type="text"
                      value={ref.contactLink}
                      onChange={(e) => onUpdate(ref.id, { contactLink: e.target.value })}
                      className="w-full border border-slate-300 rounded px-3 py-2"
                      placeholder="Website / LinkedIn URL (optional)"
                    />
                  </div>
                ) : (
                  <div className="text-xs text-slate-500">
                    Contact info will be hidden. On the resume, we will show “Available upon request”.
                  </div>
                )}
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

