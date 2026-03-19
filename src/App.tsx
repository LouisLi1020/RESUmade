import { useState, useCallback } from 'react'
import { useResumeForm } from '@/hooks/useResumeForm'
import { useI18n } from '@/i18n/I18nContext'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import Stepper from '@/components/Stepper'
import StepPersonalForm from '@/components/StepPersonalForm'
import StepIntroductionForm from '@/components/StepIntroductionForm'
import StepExperienceForm from '@/components/StepExperienceForm'
import StepEducationForm from '@/components/StepEducationForm'
import StepSkillsForm from '@/components/StepSkillsForm'
import StepPreview from '@/components/StepPreview'

const STEP_IDS = ['personal', 'introduction', 'experience', 'education', 'skills', 'preview'] as const

const hasElectron = typeof window !== 'undefined' && window.resumade

export default function App() {
  const [stepIndex, setStepIndex] = useState(0)
  const form = useResumeForm()
  const { t, stepLabels } = useI18n()

  const handleOpenDraft = useCallback(async () => {
    const api = window.resumade
    if (!api?.loadDraft) return
    const { ok, data } = await api.loadDraft()
    if (ok && data) {
      try {
        const parsed = JSON.parse(data) as Parameters<typeof form.loadResume>[0]
        form.loadResume(parsed)
        setStepIndex(0)
      } catch {
        // invalid JSON
      }
    }
  }, [form.loadResume])

  const stepId = STEP_IDS[stepIndex]
  const goNext = () => setStepIndex((i) => Math.min(i + 1, STEP_IDS.length - 1))
  const goPrev = () => setStepIndex((i) => Math.max(i - 1, 0))
  const goTo = (index: number) => setStepIndex(Math.max(0, Math.min(index, STEP_IDS.length - 1)))

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <header className="bg-slate-800 text-white py-3 px-4 shadow flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-xl font-semibold">{t('app.title')}</h1>
          <p className="text-slate-300 text-sm">{t('app.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          {hasElectron && (
            <button
              type="button"
              onClick={handleOpenDraft}
              className="text-sm bg-slate-600 hover:bg-slate-500 px-3 py-1.5 rounded"
            >
              {t('app.openDraft')}
            </button>
          )}
        </div>
      </header>

      <Stepper
        steps={stepLabels}
        currentIndex={stepIndex}
        onStepClick={goTo}
      />

      <main className="max-w-2xl mx-auto p-6 pb-12">
        {stepId === 'personal' && (
          <StepPersonalForm
            data={form.resume.personal}
            onChange={form.updatePersonal}
            onNext={goNext}
          />
        )}
        {stepId === 'introduction' && (
          <StepIntroductionForm
            value={form.resume.introduction}
            onChange={form.updateIntroduction}
            onPrev={goPrev}
            onNext={goNext}
          />
        )}
        {stepId === 'experience' && (
          <StepExperienceForm
            experiences={form.resume.experiences}
            skills={form.resume.skills}
            onAdd={form.addExperience}
            onUpdate={form.updateExperience}
            onRemove={form.removeExperience}
            onChangeSkills={form.setSkills}
            onPrev={goPrev}
            onNext={goNext}
          />
        )}
        {stepId === 'education' && (
          <StepEducationForm
            education={form.resume.education}
            onAdd={form.addEducation}
            onUpdate={form.updateEducation}
            onRemove={form.removeEducation}
            onPrev={goPrev}
            onNext={goNext}
          />
        )}
        {stepId === 'skills' && (
          <StepSkillsForm
            skills={form.resume.skills}
            maxSkills={form.maxSkills}
            onChange={form.setSkills}
            onPrev={goPrev}
            onNext={goNext}
          />
        )}
        {stepId === 'preview' && (
          <StepPreview
            resume={form.resume}
            onPrev={goPrev}
            onReorderExperiences={form.reorderExperiences}
            onReorderEducation={form.reorderEducation}
          />
        )}
      </main>
    </div>
  )
}
