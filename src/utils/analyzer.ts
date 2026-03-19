import type { Resume } from '@/types/resume'
import { maskPersonalInfo } from '@/utils/privacy'

export interface JdMatchScores {
  overall: number
  skills: number
  experience: number
  keywords: number
  suggestions: string[]
}

export interface AnalyzeJDPayload {
  resume: Resume
  jobDescription: string
}

export interface AtsOptimizationResult {
  score: number
  suggestionsBySection: {
    introduction: string[]
    experience: string[]
    skills: string[]
    keywords: string[]
  }
}

export interface OptimizeATSPayload {
  resume: Resume
  target?: string | null
}

/**
 * 共用 analyzer 介面：目前僅使用本地 heuristic 模型，不呼叫任何外部 API。
 * 之後若要接 LLM / local model，可以在此檔案替換實作。
 */
export async function analyzeResumeAgainstJD(payload: AnalyzeJDPayload): Promise<JdMatchScores> {
  const masked = maskPersonalInfo(payload.resume)
  const jd = payload.jobDescription.toLowerCase()

  const skills = masked.skills.filter(Boolean).map((s) => s.toLowerCase())
  const experienceTexts = masked.experiences
    .flatMap((e) => [e.companyOrProjectName, e.title, e.subtitle, ...e.details])
    .filter(Boolean)
    .map((s) => s.toLowerCase())

  const jdTokens = new Set(
    jd
      .split(/[^a-z0-9+.#]+/i)
      .map((t) => t.trim())
      .filter((t) => t.length >= 3),
  )

  // 粗略 keyword overlap，僅作為 mock heuristic，未來由 LLM 取代。
  const skillsHits = skills.filter((s) => jdTokens.has(s)).length
  const skillsScore = skills.length ? Math.min(100, Math.round((skillsHits / skills.length) * 100)) : 0

  const expJoined = experienceTexts.join(' ')
  let expHits = 0
  jdTokens.forEach((tok) => {
    if (expJoined.includes(tok)) expHits += 1
  })
  const expScore = jdTokens.size ? Math.min(100, Math.round((expHits / jdTokens.size) * 100)) : 0

  const keywordScore = Math.round((skillsScore * 0.6 + expScore * 0.4))
  const overall = Math.round((skillsScore * 0.4 + expScore * 0.4 + keywordScore * 0.2))

  const suggestions: string[] = []
  if (!jd.trim()) {
    suggestions.push('Provide a job description so we can evaluate alignment more accurately.')
  } else {
    if (skillsScore < 70) {
      suggestions.push('Your listed skills only partially overlap with this JD. Consider adding specific tools, frameworks, or domains that appear in the job posting (only if they are genuinely relevant).')
    } else {
      suggestions.push('Your skills broadly align with this JD. Double-check that the most important tools and domains from the posting are present.')
    }
    if (expScore < 60) {
      suggestions.push('Your experience bullets may not clearly describe responsibilities that match the JD. Add more concrete examples that mirror the job\'s responsibilities and impact.')
    } else {
      suggestions.push('Your experience appears reasonably aligned. You can still strengthen it by explicitly mentioning outcomes (metrics, scope, or stakeholders).')
    }
    if (keywordScore < 65) {
      suggestions.push('Important phrases from the JD may be missing or underrepresented. Re-read the posting and carefully weave in key terminology where it naturally fits.')
    }
  }

  return {
    overall,
    skills: skillsScore,
    experience: expScore,
    keywords: keywordScore,
    suggestions,
  }
}

/**
 * ATS optimizer analyzer 介面：目前是 heuristic 模型，不呼叫任何外部服務。
 */
export async function optimizeResumeForATS(payload: OptimizeATSPayload): Promise<AtsOptimizationResult> {
  const masked = maskPersonalInfo(payload.resume)
  const target = (payload.target ?? '').trim()

  const skillsCount = masked.skills.filter(Boolean).length
  const expCount = masked.experiences.length
  const introLen = masked.introduction.trim().length

  const suggestionsBySection: AtsOptimizationResult['suggestionsBySection'] = {
    introduction: [],
    experience: [],
    skills: [],
    keywords: [],
  }

  if (!target) {
    suggestionsBySection.keywords.push('Add a target role / JD to make optimization more specific (keywords, responsibilities, and priority skills).')
  } else {
    suggestionsBySection.keywords.push('Target role/JD captured. Ensure your resume mirrors key responsibilities and required skills from the posting.')
  }

  if (introLen < 120) {
    suggestionsBySection.introduction.push('Your introduction is quite short. Consider adding 1–2 lines that summarize your focus area, strengths, and impact.')
  } else {
    suggestionsBySection.introduction.push('Ensure your introduction contains role-relevant keywords (tools, domains) and a clear value proposition.')
  }

  if (expCount === 0) {
    suggestionsBySection.experience.push('Add experience entries (internships, projects, labs). ATS often expects evidence of responsibilities and outcomes.')
  } else {
    suggestionsBySection.experience.push('Rewrite experience bullets using action verbs + measurable outcomes (metrics, scope, performance, users, cost, time).')
    suggestionsBySection.experience.push('Align bullet phrasing with JD responsibilities (e.g., “built APIs”, “improved latency”, “implemented CI/CD”, etc.).')
  }

  if (skillsCount < 8) {
    suggestionsBySection.skills.push('List more specific skills (languages, frameworks, tools, cloud, databases). Avoid vague items like “problem solving” as primary skills.')
  } else {
    suggestionsBySection.skills.push('Prioritize the top 8–12 role-relevant skills; keep the list concise and consistent with your experience bullets.')
  }

  // Rough score heuristic; will be replaced by a model.
  const base = 60
  const score =
    base +
    Math.min(20, skillsCount * 2) +
    (expCount > 0 ? 10 : 0) +
    (target ? 5 : 0) +
    (introLen >= 120 ? 5 : 0)

  return { score: Math.min(95, score), suggestionsBySection }
}

