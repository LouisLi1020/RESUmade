import { useState, useCallback } from 'react'
import type {
  Resume,
  Experience,
  Education,
  CertificationQualification,
  Reference,
} from '@/types/resume'
import {
  createEmptyResume,
  createEmptyExperience,
  createEmptyEducation,
  createEmptyPersonal,
  createEmptyCertification,
  createEmptyReference,
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

  const addCertification = useCallback(() => {
    const newCert: CertificationQualification = {
      ...createEmptyCertification(),
      id: uuidv4(),
    }
    setResume((r) => ({ ...r, certifications: [...r.certifications, newCert] }))
  }, [])

  const updateCertification = useCallback((id: string, patch: Partial<CertificationQualification>) => {
    setResume((r) => ({
      ...r,
      certifications: r.certifications.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }))
  }, [])

  const removeCertification = useCallback((id: string) => {
    setResume((r) => ({ ...r, certifications: r.certifications.filter((c) => c.id !== id) }))
  }, [])

  const addReference = useCallback(() => {
    const newRef: Reference = {
      ...createEmptyReference(),
      id: uuidv4(),
    }
    setResume((r) => ({ ...r, references: [...r.references, newRef] }))
  }, [])

  const updateReference = useCallback((id: string, patch: Partial<Reference>) => {
    setResume((r) => ({
      ...r,
      references: r.references.map((ref) => (ref.id === id ? { ...ref, ...patch } : ref)),
    }))
  }, [])

  const removeReference = useCallback((id: string) => {
    setResume((r) => ({ ...r, references: r.references.filter((ref) => ref.id !== id) }))
  }, [])

  const setSkills = useCallback((skills: string[]) => {
    setResume((r) => ({ ...r, skills: skills.slice(0, MAX_SKILLS) }))
  }, [])

  const loadResume = useCallback((data: Resume) => {
    // Backward-compat: older drafts may not contain new optional fields.
    setResume({
      ...createEmptyResume(),
      ...data,
      personal: { ...createEmptyPersonal(), ...(data.personal ?? {}) },
      experiences: data.experiences ?? [],
      education: data.education ?? [],
      skills: data.skills ?? [],
      certifications: data.certifications ?? [],
      references: data.references ?? [],
    })
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
    addCertification,
    updateCertification,
    removeCertification,
    addReference,
    updateReference,
    removeReference,
    loadResume,
    resetResume,
    maxSkills: MAX_SKILLS,
  }
}
