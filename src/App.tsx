import { useState, useCallback } from 'react'
import { useResumeForm } from '@/hooks/useResumeForm'
import Stepper from '@/components/Stepper'
import StepPersonalForm from '@/components/StepPersonalForm'
import StepIntroductionForm from '@/components/StepIntroductionForm'
import StepExperienceForm from '@/components/StepExperienceForm'
import StepEducationForm from '@/components/StepEducationForm'
import StepSkillsForm from '@/components/StepSkillsForm'
import StepPreview from '@/components/StepPreview'

const STEPS = [
  { id: 'personal', label: 'Personal' },
  { id: 'introduction', label: 'Introduction' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'preview', label: 'Preview & Edit' },
] as const

const hasElectron = typeof window !== 'undefined' && window.resumade

export default function App() {
  const [stepIndex, setStepIndex] = useState(0)
  const form = useResumeForm()

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

  const stepId = STEPS[stepIndex].id
  const goNext = () => setStepIndex((i) => Math.min(i + 1, STEPS.length - 1))
  const goPrev = () => setStepIndex((i) => Math.max(i - 1, 0))
  const goTo = (index: number) => setStepIndex(Math.max(0, Math.min(index, STEPS.length - 1)))

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <header className="bg-slate-800 text-white py-3 px-4 shadow flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">RESUmade</h1>
          <p className="text-slate-300 text-sm">One-page resume builder</p>
        </div>
        {hasElectron && (
          <button
            type="button"
            onClick={handleOpenDraft}
            className="text-sm bg-slate-600 hover:bg-slate-500 px-3 py-1.5 rounded"
          >
            Open draft
          </button>
        )}
      </header>

      <Stepper
        steps={STEPS.map((s) => s.label)}
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
            onAdd={form.addExperience}
            onUpdate={form.updateExperience}
            onRemove={form.removeExperience}
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
