import type { Resume } from '@/types/resume'

/**
 * Return a shallow-masked copy of resume where obvious personal identifiers
 * (name / email / phone / address) are replaced with placeholders.
 * Links are kept as-is for now, since they多半只是 public profiles。
 */
export function maskPersonalInfo(resume: Resume): Resume {
  const cloned: Resume = JSON.parse(JSON.stringify(resume))
  const p = cloned.personal

  if (p.legalName) p.legalName = '[NAME]'
  if (p.preferredName) p.preferredName = '[PREFERRED_NAME]'
  if (p.email) p.email = '[EMAIL]'
  if (p.phone) p.phone = '[PHONE]'
  if (p.address) p.address = '[ADDRESS]'

  return cloned
}

