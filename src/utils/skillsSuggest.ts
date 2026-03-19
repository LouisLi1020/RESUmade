import type { Experience } from '@/types/resume'

interface SkillsSuggestionResult {
  tech: string[]
  soft: string[]
}

const TECH_KEYWORDS: Record<string, string> = {
  react: 'React',
  'react.js': 'React',
  'reactjs': 'React',
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  'node.js': 'Node.js',
  nodejs: 'Node.js',
  python: 'Python',
  'c++': 'C++',
  'c#': 'C#',
  java: 'Java',
  go: 'Go',
  rust: 'Rust',
  aws: 'AWS',
  'amazon web services': 'AWS',
  azure: 'Azure',
  gcp: 'GCP',
  'google cloud': 'GCP',
  docker: 'Docker',
  kubernetes: 'Kubernetes',
  sql: 'SQL',
  postgres: 'PostgreSQL',
  postgresql: 'PostgreSQL',
  mysql: 'MySQL',
  mongodb: 'MongoDB',
  'mongo db': 'MongoDB',
  redis: 'Redis',
  graphql: 'GraphQL',
  'rest api': 'REST APIs',
  'restful api': 'REST APIs',
  git: 'Git',
  linux: 'Linux',
}

const SOFT_KEYWORDS: Record<string, string> = {
  communication: 'Communication',
  'public speaking': 'Public speaking',
  leadership: 'Leadership',
  'team lead': 'Leadership',
  'teamwork': 'Teamwork',
  collaboration: 'Collaboration',
  'cross-functional': 'Cross‑functional collaboration',
  'problem solving': 'Problem solving',
  'problem-solving': 'Problem solving',
  'critical thinking': 'Critical thinking',
  ownership: 'Ownership',
  'time management': 'Time management',
  'project management': 'Project management',
  mentoring: 'Mentoring',
  'people management': 'People management',
  'stakeholder management': 'Stakeholder management',
  adaptability: 'Adaptability',
  'fast learner': 'Fast learner',
}

function collectTextFromExperience(exp: Experience): string {
  const parts: string[] = []
  if (exp.title) parts.push(exp.title)
  if (exp.companyOrProjectName) parts.push(exp.companyOrProjectName)
  if (exp.subtitle) parts.push(exp.subtitle)
  if (exp.details?.length) parts.push(exp.details.join(' '))
  return parts.join(' ')
}

export function suggestSkillsFromExperiences(experiences: Experience[]): SkillsSuggestionResult {
  const tech = new Set<string>()
  const soft = new Set<string>()

  const fullText = experiences.map(collectTextFromExperience).join(' ').toLowerCase()
  if (!fullText.trim()) {
    return { tech: [], soft: [] }
  }

  Object.entries(TECH_KEYWORDS).forEach(([needle, label]) => {
    if (fullText.includes(needle)) tech.add(label)
  })

  Object.entries(SOFT_KEYWORDS).forEach(([needle, label]) => {
    if (fullText.includes(needle)) soft.add(label)
  })

  return {
    tech: Array.from(tech).sort(),
    soft: Array.from(soft).sort(),
  }
}

