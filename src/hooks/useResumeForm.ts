import { useState, useCallback } from 'react'
import type { Resume, Experience, Education } from '@/types/resume'
import {
  createEmptyResume,
  createEmptyExperience,
  createEmptyEducation,
} from '@/types/resume'
import { v4 as uuidv4 } from 'uuid'

const MAX_SKILLS = 20

export function useResumeForm(initial?: Resume | null) {
  const [resume, setResume] = useState<Resume>(initial ?? createEmptyResume())

  const updatePersonal = useCallback((patch: Partial<Resume['personal']>) => {
    setResume((r) => ({ ...r, personal: { ...r.personal, ...patch } }))
  }, [])

  const updateIntroduction = useCallback((intro: string) => {
    setResume((r) => ({ ...r, introduction: intro }))
  }, [])

  const addExperience = useCallback(() => {
    const newExp: Experience = {
      ...createEmptyExperience(),
      id: uuidv4(),
    }
    setResume((r) => ({ ...r, experiences: [...r.experiences, newExp] }))
  }, [])

  const updateExperience = useCallback((id: string, patch: Partial<Experience>) => {
    setResume((r) => ({
      ...r,
      experiences: r.experiences.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }))
  }, [])

  const removeExperience = useCallback((id: string) => {
    setResume((r) => ({ ...r, experiences: r.experiences.filter((e) => e.id !== id) }))
  }, [])

  const reorderExperiences = useCallback((reordered: Experience[]) => {
    setResume((r) => ({ ...r, experiences: reordered }))
  }, [])

  const addEducation = useCallback(() => {
    const newEd: Education = {
      ...createEmptyEducation(),
      id: uuidv4(),
    }
    setResume((r) => ({ ...r, education: [...r.education, newEd] }))
  }, [])

  const updateEducation = useCallback((id: string, patch: Partial<Education>) => {
    setResume((r) => ({
      ...r,
      education: r.education.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }))
  }, [])

  const removeEducation = useCallback((id: string) => {
    setResume((r) => ({ ...r, education: r.education.filter((e) => e.id !== id) }))
  }, [])

  const reorderEducation = useCallback((reordered: Education[]) => {
    setResume((r) => ({ ...r, education: reordered }))
  }, [])

  const setSkills = useCallback((skills: string[]) => {
    setResume((r) => ({ ...r, skills: skills.slice(0, MAX_SKILLS) }))
  }, [])

  const loadResume = useCallback((data: Resume) => {
    setResume(data)
  }, [])

  const resetResume = useCallback(() => {
    setResume(createEmptyResume())
  }, [])

  return {
    resume,
    updatePersonal,
    updateIntroduction,
    addExperience,
    updateExperience,
    removeExperience,
    reorderExperiences,
    addEducation,
    updateEducation,
    removeEducation,
    reorderEducation,
    setSkills,
    loadResume,
    resetResume,
    maxSkills: MAX_SKILLS,
  }
}
