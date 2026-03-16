import type { Experience } from '@/types/resume'
import { useI18n } from '@/i18n/I18nContext'

interface Props {
  experiences: Experience[]
  onAdd: () => void
  onUpdate: (id: string, patch: Partial<Experience>) => void
  onRemove: (id: string) => void
  onPrev: () => void
  onNext: () => void
}

export default function StepExperienceForm({
  experiences,
  onAdd,
  onUpdate,
  onRemove,
  onPrev,
  onNext,
}: Props) {
  const { t } = useI18n()
  const addDetail = (id: string) => {
    const exp = experiences.find((e) => e.id === id)
    if (!exp) return
    onUpdate(id, { details: [...exp.details, ''] })
  }
  const updateDetail = (id: string, detailIndex: number, value: string) => {
    const exp = experiences.find((e) => e.id === id)
    if (!exp) return
    const next = [...exp.details]
    next[detailIndex] = value
    onUpdate(id, { details: next })
  }
  const removeDetail = (id: string, detailIndex: number) => {
    const exp = experiences.find((e) => e.id === id)
    if (!exp) return
    onUpdate(id, { details: exp.details.filter((_, i) => i !== detailIndex) })
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{t('experience.heading')}</h2>
        <button
          type="button"
          onClick={onAdd}
          className="text-sm bg-slate-800 text-white px-3 py-1.5 rounded hover:bg-slate-700"
        >
          {t('common.add')}
        </button>
      </div>
      {experiences.length === 0 ? (
        <p className="text-slate-500 text-sm mb-4">{t('experience.emptyHint')}</p>
      ) : (
        <div className="space-y-6">
          {experiences.map((exp) => (
            <div key={exp.id} className="border border-slate-200 rounded p-4 bg-slate-50">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs text-slate-500 font-medium uppercase">
                  {exp.type === 'work' ? t('experience.work') : t('experience.project')}
                </span>
                <button
                  type="button"
                  onClick={() => onRemove(exp.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  {t('common.remove')}
                </button>
              </div>
              <div className="grid gap-2 mb-2">
                <input
                  type="text"
                  value={exp.companyOrProjectName}
                  onChange={(e) => onUpdate(exp.id, { companyOrProjectName: e.target.value })}
                  className="w-full border border-slate-300 rounded px-3 py-2"
                  placeholder={t('experience.companyPlaceholder')}
                />
                <input
                  type="text"
                  value={exp.title}
                  onChange={(e) => onUpdate(exp.id, { title: e.target.value })}
                  className="w-full border border-slate-300 rounded px-3 py-2"
                  placeholder={t('experience.titlePlaceholder')}
                />
                <input
                  type="text"
                  value={exp.timePeriod}
                  onChange={(e) => onUpdate(exp.id, { timePeriod: e.target.value })}
                  className="w-full border border-slate-300 rounded px-3 py-2"
                  placeholder={t('experience.timePlaceholder')}
                />
                <input
                  type="text"
                  value={exp.subtitle ?? ''}
                  onChange={(e) => onUpdate(exp.id, { subtitle: e.target.value || undefined })}
                  className="w-full border border-slate-300 rounded px-3 py-2"
                  placeholder={t('experience.subtitlePlaceholder')}
                />
              </div>
              <div className="mt-2">
                <label className="block text-sm text-slate-600 mb-1">{t('experience.detailsLabel')}</label>
                {exp.details.map((d, i) => (
                  <div key={i} className="flex gap-2 mb-1">
                    <input
                      type="text"
                      value={d}
                      onChange={(e) => updateDetail(exp.id, i, e.target.value)}
                      className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm"
                      placeholder="•"
                    />
                    <button
                      type="button"
                      onClick={() => removeDetail(exp.id, i)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addDetail(exp.id)}
                  className="text-sm text-slate-600 hover:text-slate-800 mt-1"
                >
                  {t('experience.addBullet')}
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
