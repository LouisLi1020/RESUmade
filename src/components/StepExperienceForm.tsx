import { useState } from 'react'
import type { Experience } from '@/types/resume'
import { useI18n } from '@/i18n/I18nContext'
import { inlineMarkdownToHtml } from '@/utils/markdown'
import { suggestSkillsFromExperiences } from '@/utils/skillsSuggest'

interface Props {
  experiences: Experience[]
  skills: string[]
  onAdd: () => void
  onUpdate: (id: string, patch: Partial<Experience>) => void
  onRemove: (id: string) => void
  onChangeSkills: (skills: string[]) => void
  onPrev: () => void
  onNext: () => void
}

export default function StepExperienceForm({
  experiences,
  skills,
  onAdd,
  onUpdate,
  onRemove,
  onChangeSkills,
  onPrev,
  onNext,
}: Props) {
  const { t } = useI18n()
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false)
  const [availableSuggestions, setAvailableSuggestions] = useState<string[]>([])
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([])
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

  const handleOpenSkillSuggestions = () => {
    const { tech, soft } = suggestSkillsFromExperiences(experiences)
    const combined = [...tech, ...soft].filter((s) => !skills.includes(s))
    setAvailableSuggestions(combined)
    setSelectedSuggestions(combined)
    setShowSkillSuggestions(true)
  }

  const toggleSuggestion = (value: string) => {
    setSelectedSuggestions((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    )
  }

  const handleApplySuggestions = () => {
    if (!selectedSuggestions.length) {
      setShowSkillSuggestions(false)
      return
    }
    const merged = [...skills]
    selectedSuggestions.forEach((s) => {
      if (!merged.includes(s)) merged.push(s)
    })
    onChangeSkills(merged)
    setShowSkillSuggestions(false)
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{t('experience.heading')}</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenSkillSuggestions}
            className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded border border-slate-300 hover:bg-slate-200"
          >
            Suggest tech / skills
          </button>
          <button
            type="button"
            onClick={onAdd}
            className="text-sm bg-slate-800 text-white px-3 py-1.5 rounded hover:bg-slate-700"
          >
            {t('common.add')}
          </button>
        </div>
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
                  <div key={i} className="mb-2">
                    <div className="flex gap-2 mb-1">
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
      {showSkillSuggestions && (
        <div className="mt-4 border border-dashed border-slate-300 rounded p-3 bg-slate-50">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-slate-700">Suggested tech / soft skills</h3>
            <button
              type="button"
              onClick={() => setShowSkillSuggestions(false)}
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              Close
            </button>
          </div>
          {availableSuggestions.length === 0 ? (
            <p className="text-xs text-slate-500">
              No obvious skills detected from your experience titles and bullet points yet.
            </p>
          ) : (
            <>
              <p className="text-xs text-slate-500 mb-2">
                Select which suggestions you want to add to your skills. Existing skills will not be overwritten.
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {availableSuggestions.map((s) => {
                  const checked = selectedSuggestions.includes(s)
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSuggestion(s)}
                      className={`text-xs px-2 py-1 rounded-full border ${
                        checked
                          ? 'bg-slate-800 text-white border-slate-800'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {s}
                    </button>
                  )
                })}
              </div>
              <button
                type="button"
                onClick={handleApplySuggestions}
                className="text-xs bg-slate-800 text-white px-3 py-1.5 rounded hover:bg-slate-700"
              >
                Add selected to skills
              </button>
            </>
          )}
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
