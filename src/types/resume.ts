export type ExperienceType = 'work' | 'project'

export interface LinkItem {
  label: string
  url: string
}

export interface Personal {
  legalName: string
  preferredName?: string
  phone?: string
  email: string
  address?: string
  links?: LinkItem[]
  /** When true, resume preview and PDF show full URL for links (for printing); otherwise show label only */
  showFullUrls?: boolean
  /** When true, show preferred name on resume after legal name, e.g. "ChengYi Li (Louis Li)" */
  showPreferredName?: boolean
}

export interface Experience {
  id: string
  type: ExperienceType
  companyOrProjectName: string
  title: string
  timePeriod: string
  subtitle?: string
  details: string[]
}

export interface Education {
  id: string
  schoolName: string
  degreeOrTitle: string
  timePeriod: string
  subtitle?: string
  details: string[]
}

export interface Resume {
  personal: Personal
  introduction: string
  experiences: Experience[]
  education: Education[]
  skills: string[]
}

export const createEmptyPersonal = (): Personal => ({
  legalName: '',
  preferredName: '',
  email: '',
  phone: '',
  address: '',
  links: [],
})

export const createEmptyExperience = (): Experience => ({
  id: '',
  type: 'work',
  companyOrProjectName: '',
  title: '',
  timePeriod: '',
  subtitle: '',
  details: [],
})

export const createEmptyEducation = (): Education => ({
  id: '',
  schoolName: '',
  degreeOrTitle: '',
  timePeriod: '',
  subtitle: '',
  details: [],
})

export const createEmptyResume = (): Resume => ({
  personal: createEmptyPersonal(),
  introduction: '',
  experiences: [],
  education: [],
  skills: [],
})
