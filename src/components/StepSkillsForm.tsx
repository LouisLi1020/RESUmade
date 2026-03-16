import { useI18n } from '@/i18n/I18nContext'

interface Props {
  skills: string[]
  maxSkills: number
  onChange: (skills: string[]) => void
  onPrev: () => void
  onNext: () => void
}

export default function StepSkillsForm({
  skills,
  maxSkills,
  onChange,
  onPrev,
  onNext,
}: Props) {
  const { t } = useI18n()
  const addSkill = () => {
    if (skills.length >= maxSkills) return
    onChange([...skills, ''])
  }
  const updateSkill = (i: number, value: string) => {
    const next = [...skills]
    next[i] = value
    onChange(next)
  }
  const removeSkill = (i: number) => {
    onChange(skills.filter((_, idx) => idx !== i))
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{t('skills.heading')}</h2>
        <span className="text-sm text-slate-500">{t('skills.upTo', { max: maxSkills })}</span>
      </div>
      <p className="text-sm text-slate-600 mb-4">{t('skills.hint', { max: maxSkills })}</p>
      <div className="space-y-2">
        {skills.map((s, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={s}
              onChange={(e) => updateSkill(i, e.target.value)}
              className="flex-1 border border-slate-300 rounded px-3 py-2"
              placeholder={`${t('skills.skillPlaceholder')} ${i + 1}`}
            />
            <button
              type="button"
              onClick={() => removeSkill(i)}
              className="text-red-600 hover:text-red-800 px-2"
            >
              ×
            </button>
          </div>
        ))}
        {skills.length < maxSkills && (
          <button
            type="button"
            onClick={addSkill}
            className="text-slate-600 hover:text-slate-800 text-sm border border-dashed border-slate-300 rounded px-3 py-2 w-full"
          >
            {t('skills.addSkill')}
          </button>
        )}
      </div>
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
          {t('common.nextToPreview')}
        </button>
      </div>
    </div>
  )
}
