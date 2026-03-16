import type { Education } from '@/types/resume'

interface Props {
  education: Education[]
  onAdd: () => void
  onUpdate: (id: string, patch: Partial<Education>) => void
  onRemove: (id: string) => void
  onPrev: () => void
  onNext: () => void
}

export default function StepEducationForm({
  education,
  onAdd,
  onUpdate,
  onRemove,
  onPrev,
  onNext,
}: Props) {
  const addDetail = (id: string) => {
    const ed = education.find((e) => e.id === id)
    if (!ed) return
    onUpdate(id, { details: [...ed.details, ''] })
  }
  const updateDetail = (id: string, detailIndex: number, value: string) => {
    const ed = education.find((e) => e.id === id)
    if (!ed) return
    const next = [...ed.details]
    next[detailIndex] = value
    onUpdate(id, { details: next })
  }
  const removeDetail = (id: string, detailIndex: number) => {
    const ed = education.find((e) => e.id === id)
    if (!ed) return
    onUpdate(id, { details: ed.details.filter((_, i) => i !== detailIndex) })
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Education</h2>
        <button
          type="button"
          onClick={onAdd}
          className="text-sm bg-slate-800 text-white px-3 py-1.5 rounded hover:bg-slate-700"
        >
          + Add
        </button>
      </div>
      {education.length === 0 ? (
        <p className="text-slate-500 text-sm mb-4">No education yet. Click &quot;+ Add&quot; to add one.</p>
      ) : (
        <div className="space-y-6">
          {education.map((ed) => (
            <div key={ed.id} className="border border-slate-200 rounded p-4 bg-slate-50">
              <div className="flex justify-end mb-2">
                <button
                  type="button"
                  onClick={() => onRemove(ed.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
              <div className="grid gap-2 mb-2">
                <input
                  type="text"
                  value={ed.schoolName}
                  onChange={(e) => onUpdate(ed.id, { schoolName: e.target.value })}
                  className="w-full border border-slate-300 rounded px-3 py-2"
                  placeholder="School name"
                />
                <input
                  type="text"
                  value={ed.degreeOrTitle}
                  onChange={(e) => onUpdate(ed.id, { degreeOrTitle: e.target.value })}
                  className="w-full border border-slate-300 rounded px-3 py-2"
                  placeholder="Degree / Title"
                />
                <input
                  type="text"
                  value={ed.timePeriod}
                  onChange={(e) => onUpdate(ed.id, { timePeriod: e.target.value })}
                  className="w-full border border-slate-300 rounded px-3 py-2"
                  placeholder="Time period"
                />
                <input
                  type="text"
                  value={ed.subtitle ?? ''}
                  onChange={(e) => onUpdate(ed.id, { subtitle: e.target.value || undefined })}
                  className="w-full border border-slate-300 rounded px-3 py-2"
                  placeholder="Subtitle (optional)"
                />
              </div>
              <div className="mt-2">
                <label className="block text-sm text-slate-600 mb-1">Details (bullet points)</label>
                {ed.details.map((d, i) => (
                  <div key={i} className="flex gap-2 mb-1">
                    <input
                      type="text"
                      value={d}
                      onChange={(e) => updateDetail(ed.id, i, e.target.value)}
                      className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm"
                      placeholder="• Point..."
                    />
                    <button
                      type="button"
                      onClick={() => removeDetail(ed.id, i)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addDetail(ed.id)}
                  className="text-sm text-slate-600 hover:text-slate-800 mt-1"
                >
                  + Add bullet
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
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-700"
        >
          Next
        </button>
      </div>
    </div>
  )
}
