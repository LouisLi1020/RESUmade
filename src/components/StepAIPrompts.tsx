import { useMemo, useState } from 'react'
import type { Resume } from '@/types/resume'
import { maskPersonalInfo } from '@/utils/privacy'

type TabId = 'cover' | 'ats' | 'jd'

function joinNonEmpty(lines: Array<string | undefined | null>, sep = '\n') {
  return lines.map((l) => (l ?? '').trim()).filter((l) => l.length > 0).join(sep)
}

function buildAnonymizedResumeText(resume: Resume): string {
  const masked = maskPersonalInfo(resume)

  const intro = masked.introduction.trim()
  const skills = masked.skills.filter(Boolean)

  const expText = masked.experiences
    .map((e) => {
      const header = joinNonEmpty([e.companyOrProjectName, e.title ? `— ${e.title}` : undefined], ' ')
      const meta = joinNonEmpty([e.timePeriod, e.subtitle ? `· ${e.subtitle}` : undefined], ' ')
      const bullets = e.details.filter(Boolean).map((d) => `- ${d}`).join('\n')
      return [header, meta, bullets].filter(Boolean).join('\n')
    })
    .filter(Boolean)
    .join('\n\n')

  const eduText = masked.education
    .map((e) => {
      const header = `${e.schoolName} — ${e.degreeOrTitle}`.trim()
      const meta = joinNonEmpty([e.timePeriod, e.subtitle ? `· ${e.subtitle}` : undefined], ' ')
      const bullets = e.details.filter(Boolean).map((d) => `- ${d}`).join('\n')
      return [header, meta, bullets].filter(Boolean).join('\n')
    })
    .filter(Boolean)
    .join('\n\n')

  const certText = masked.certifications
    .map((c) => {
      const header = joinNonEmpty([c.title, c.issuer ? `(${c.issuer})` : undefined], ' ')
      const meta = c.issueDate ? `Issue date: ${c.issueDate}` : ''
      const bullets = c.details.filter(Boolean).map((d) => `- ${d}`).join('\n')
      return [header, meta, bullets].filter(Boolean).join('\n')
    })
    .filter(Boolean)
    .join('\n\n')

  const refsText = masked.references
    .map((r) => {
      const basic = joinNonEmpty([r.name, [r.company, r.roleOrRelation].filter(Boolean).join(' · ')], '\n')
      // Avoid leaking contact info in prompt to reduce privacy risk.
      return joinNonEmpty([basic, 'Contact: Available upon request'], '\n')
    })
    .filter(Boolean)
    .join('\n\n')

  const parts = [
    `INTRODUCTION:\n${intro || '(not provided)'}`,
    `SKILLS:\n${skills.length ? skills.join(', ') : '(not provided)'}`,
    expText ? `EXPERIENCE:\n${expText}` : '',
    eduText ? `EDUCATION:\n${eduText}` : '',
    certText ? `CERTIFICATIONS:\n${certText}` : '',
    refsText ? `REFERENCES:\n${refsText}` : '',
  ].filter(Boolean)

  return parts.join('\n\n')
}

function renderCoverLetterPrompt(lang: 'en' | 'zh-TW' | 'zh-CN', params: { resumeText: string; jdText: string; tone: string; jobTitles: string[] }) {
  const { resumeText, jdText, tone, jobTitles } = params
  const titles = jobTitles.length ? jobTitles.join(', ') : '(not provided)'
  const outputStructureEn = `Output structure:
1) Opening (1 paragraph): why you are applying and your key strengths
2) Fit summary (1 paragraph): 3-4 points strongly related to the JD
3) Experience highlights (2-3 paragraphs): select the most relevant experiences and highlight impact/results
4) Closing (1 paragraph): thank you and a polite end`;

  const baseCommon = `You are a professional career coach. Based on the information below, generate a tailored Cover Letter.
Tone: ${tone}
Job titles: ${titles}
Important rules:
- Do NOT invent experiences, skills, or metrics that are not present in the resume.
- If the resume does not include direct contact info, avoid writing email/phone/address. Use “available upon request” instead.

Resume (anonymized):
${resumeText}

JD / Target:
${jdText}
`

  if (lang === 'en') {
    return `${baseCommon}\n${outputStructureEn}\n`
  }

  if (lang === 'zh-TW') {
    return `你是一位專業的求職顧問。根據以下資訊，撰寫一封量身打造的 Cover Letter。
語氣：${tone}
目標職位（多個）：${titles}
重要規則：
- 請勿捏造履歷中沒有的經驗、技能或數據/成果。
- 若履歷未提供直接聯絡資訊，請避免寫 email/phone/address；改用「available upon request」或等價禮貌用語。

履歷（可能已匿名化）：
${resumeText}

JD / 職缺目標：
${jdText}

輸出結構：
1) Opening（1段）：為何申請此職位、你的核心優勢
2) Fit summary（1段）：與 JD 關鍵點高度相關的 3-4 個重點
3) Experience highlights（2-3 段）：挑選最匹配的經歷並強調成果/影響
4) Closing（1段）：感謝並期待面談，禮貌收尾
`
  }

  // zh-CN
  return `你是一位专业的求职顾问。根据以下信息，撰写一封量身定制的 Cover Letter。
语气：${tone}
目标职位（多个）：${titles}
重要规则：
- 请勿编造履历中没有的经验、技能或数据/成果。
- 若简历未提供直接联系信息，请避免写 email/phone/address；改用“available upon request”或等价礼貌用语。

履历（可能已匿名化）：
${resumeText}

JD / 职位目标：
${jdText}

输出结构：
1) Opening（1段）：为何申请此职位、你的核心优势
2) Fit summary（1段）：与 JD 关键点高度相关的 3-4 个要点
3) Experience highlights（2-3段）：挑选最匹配的经历并强调成果/影响
4) Closing（1段）：感谢并期待面谈，礼貌收尾
`
}

function renderAtsPrompt(lang: 'en' | 'zh-TW' | 'zh-CN', params: { resumeText: string; targetText: string }) {
  const { resumeText, targetText } = params

  if (lang === 'en') {
    return `You are an expert ATS resume optimizer. Using the anonymized resume and the ATS target below, provide actionable improvements.

Resume (anonymized):
${resumeText}

ATS Target / Keywords:
${targetText || '(not provided)'}

Requirements for your output:
1) Section-wise suggestions (Introduction / Experience / Skills / Keywords)
2) Provide rewritten bullet points for Experience when possible (use action verbs + impact)
3) Provide a recommended top skills/keywords list (8–12 items) aligned with the target
4) Keep everything concise and practical.
`
  }

  if (lang === 'zh-TW') {
    return `你是一位專精 ATS 的履歷優化顧問。請使用「匿名化的履歷」與下方的 ATS 目標，提供可操作的改進建議。

履歷（可能已匿名化）：
${resumeText}

ATS 目標 / 關鍵字：
${targetText || '(未提供)'}

你的輸出需求：
1) 分區建議（Introduction / Experience / Skills / Keywords）
2) 盡可能提供 Experience 的改寫 bullet（使用動作動詞 + 具體影響/成果）
3) 提供建議的 Top skills / keywords 清單（8–12 個，與目標對齊）
4) 全部內容保持精簡實用。
`
  }

  return `你是一位擅长 ATS 的简历优化顾问。请使用“匿名化的简历”与下方的 ATS 目标，提供可执行的改进建议。

简历（可能已匿名化）：
${resumeText}

ATS 目标 / 关键词：
${targetText || '(未提供)'}

你的输出需求：
1) 分区建议（Introduction / Experience / Skills / Keywords）
2) 尽可能提供 Experience 的改写 bullet（使用行动动词 + 具体影响/成果）
3) 提供建议的 Top skills / keywords 清单（8–12 个，和目标对齐）
4) 内容保持精简、可落地。
`
}

function renderJdMatcherPrompt(
  lang: 'en' | 'zh-TW' | 'zh-CN',
  params: { resumeText: string; jdText: string },
) {
  const { resumeText, jdText } = params
  const jd = jdText || ''
  if (lang === 'en') {
    return `You are an expert JD matcher. Compare the anonymized resume against the JD below.

Resume (anonymized):
${resumeText}

JD:
${jd}

Output requirements:
1) Overall match score (0–100%) and short justification
2) Section scores: Skills / Experience / Keywords (separate percentages)
3) Suggestions per section (bulleted)
4) Highlight missing or underrepresented skills/phrases from the JD.
`
  }

  if (lang === 'zh-TW') {
    return `你是一位專精 JD 匹配的顧問。請將以下匿名化履歷與 JD 進行對照分析。

履歷（可能已匿名化）：
${resumeText}

JD：
${jd}

輸出需求：
1) 整體匹配分數（0–100%）與簡短理由
2) 分區分數：Skills / Experience / Keywords（分別百分比）
3) 每個 section 的建議（條列）
4) 指出 JD 中缺失或代表性不足的技能/關鍵字/短語。
`
  }

  return `你是一位擅长 JD 匹配的顾问。请将下面的匿名化简历与 JD 进行对照分析。

简历（可能已匿名化）：
${resumeText}

JD：
${jd}

输出需求：
1) 整体匹配分数（0–100%）与简短理由
2) 分区分数：Skills / Experience / Keywords（分别百分比）
3) 每个 section 的建议（条列）
4) 指出 JD 中缺失或代表性不足的技能/关键词/短语。
`
}

export default function StepAIPrompts({ resume, onPrev }: { resume: Resume; onPrev: () => void }) {
  const [tab, setTab] = useState<TabId>('cover')
  const [tone, setTone] = useState('formal')
  const [jobTitlesText, setJobTitlesText] = useState('Software Engineer')
  const [jdText, setJdText] = useState('')
  const [atsTargetText, setAtsTargetText] = useState('')

  const jobTitles = useMemo(
    () => jobTitlesText.split('\n').map((s) => s.trim()).filter(Boolean),
    [jobTitlesText],
  )

  const resumeText = useMemo(() => buildAnonymizedResumeText(resume), [resume])

  const coverPrompts = {
    en: renderCoverLetterPrompt('en', { resumeText, jdText, tone, jobTitles }),
    'zh-TW': renderCoverLetterPrompt('zh-TW', { resumeText, jdText, tone, jobTitles }),
    'zh-CN': renderCoverLetterPrompt('zh-CN', { resumeText, jdText, tone, jobTitles }),
  }

  const atsPrompts = {
    en: renderAtsPrompt('en', { resumeText, targetText: atsTargetText }),
    'zh-TW': renderAtsPrompt('zh-TW', { resumeText, targetText: atsTargetText }),
    'zh-CN': renderAtsPrompt('zh-CN', { resumeText, targetText: atsTargetText }),
  }

  const jdPrompts = {
    en: renderJdMatcherPrompt('en', { resumeText, jdText }),
    'zh-TW': renderJdMatcherPrompt('zh-TW', { resumeText, jdText }),
    'zh-CN': renderJdMatcherPrompt('zh-CN', { resumeText, jdText }),
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
  }

  const renderPromptCard = (title: string, text: string) => (
    <div className="bg-slate-50 border border-slate-200 rounded p-3">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="text-sm font-medium text-slate-700">{title}</div>
        <button
          type="button"
          onClick={() => copyToClipboard(text)}
          className="text-xs bg-slate-800 text-white px-3 py-1.5 rounded hover:bg-slate-700"
        >
          Copy
        </button>
      </div>
      <textarea
        readOnly
        value={text}
        className="w-full min-h-[220px] max-h-[45vh] border border-slate-200 rounded px-3 py-2 text-xs font-mono bg-white"
      />
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-2">AI Prompts (Copy & Paste)</h2>
        <p className="text-sm text-slate-600 mb-4">
          This app provides prompt templates only. Paste them into your preferred web AI agent (LLM) to generate
          cover letters / ATS suggestions / JD matching results.
        </p>

        <div className="flex gap-2 border-b border-slate-200 mb-4">
          <button
            type="button"
            onClick={() => setTab('cover')}
            className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px ${
              tab === 'cover'
                ? 'border-slate-700 text-slate-800'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Cover Letter
          </button>
          <button
            type="button"
            onClick={() => setTab('ats')}
            className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px ${
              tab === 'ats'
                ? 'border-slate-700 text-slate-800'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            ATS Optimizer
          </button>
          <button
            type="button"
            onClick={() => setTab('jd')}
            className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px ${
              tab === 'jd'
                ? 'border-slate-700 text-slate-800'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            JD Matcher
          </button>
        </div>

        {tab === 'cover' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2 py-1 text-sm"
                >
                  <option value="formal">Formal</option>
                  <option value="friendly">Friendly</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Job titles (one per line)</label>
                <textarea
                  value={jobTitlesText}
                  onChange={(e) => setJobTitlesText(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2 py-1 text-sm min-h-[86px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">JD / Job description</label>
              <textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                className="w-full border border-slate-300 rounded px-2 py-1 text-sm min-h-[120px]"
              />
            </div>
          </div>
        )}

        {tab === 'ats' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                ATS target (role / keywords / phrases)
              </label>
              <textarea
                value={atsTargetText}
                onChange={(e) => setAtsTargetText(e.target.value)}
                className="w-full border border-slate-300 rounded px-2 py-1 text-sm min-h-[120px]"
                placeholder="Paste the job target role or key requirements you want ATS to detect..."
              />
            </div>
          </div>
        )}

        {tab === 'jd' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">JD / Job description</label>
              <textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                className="w-full border border-slate-300 rounded px-2 py-1 text-sm min-h-[120px]"
              />
            </div>
          </div>
        )}

        <div className="space-y-3 mt-6">
          {tab === 'cover' && (
            <>
              {renderPromptCard('English', coverPrompts.en)}
              {renderPromptCard('繁體中文 (zh-TW)', coverPrompts['zh-TW'])}
              {renderPromptCard('简体中文 (zh-CN)', coverPrompts['zh-CN'])}
            </>
          )}
          {tab === 'ats' && (
            <>
              {renderPromptCard('English', atsPrompts.en)}
              {renderPromptCard('繁體中文 (zh-TW)', atsPrompts['zh-TW'])}
              {renderPromptCard('简体中文 (zh-CN)', atsPrompts['zh-CN'])}
            </>
          )}
          {tab === 'jd' && (
            <>
              {renderPromptCard('English', jdPrompts.en)}
              {renderPromptCard('繁體中文 (zh-TW)', jdPrompts['zh-TW'])}
              {renderPromptCard('简体中文 (zh-CN)', jdPrompts['zh-CN'])}
            </>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onPrev}
          className="bg-slate-200 text-slate-800 px-4 py-2 rounded hover:bg-slate-300"
        >
          Back
        </button>
      </div>
    </div>
  )
}

