import type { Resume } from '@/types/resume'

interface Props {
  resume: Resume
  className?: string
}

export default function ResumePreview({ resume, className = '' }: Props) {
  const p = resume.personal
  const name = p.preferredName?.trim() || p.legalName?.trim() || 'Name'

  return (
    <div
      className={`bg-white shadow-lg rounded-lg p-6 text-slate-800 max-w-[210mm] mx-auto ${className}`}
      style={{ minHeight: '297mm' }}
    >
      <h1 className="text-xl font-semibold border-b border-slate-200 pb-1 mb-1">{name}</h1>
      <div className="flex flex-wrap gap-x-3 gap-y-0 text-sm text-slate-500 mb-4">
        {p.email && <span>{p.email}</span>}
        {p.phone && <span>{p.phone}</span>}
        {p.address && <span>{p.address}</span>}
        {p.links?.filter((l) => l.url).map((l, i) => (
          <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:underline">
            {l.label || l.url}
          </a>
        ))}
      </div>

      {resume.introduction.trim() && (
        <section className="mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Introduction</h2>
          <p className="text-sm whitespace-pre-wrap">{resume.introduction.trim()}</p>
        </section>
      )}

      {resume.experiences.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Experience</h2>
          <div className="space-y-3">
            {resume.experiences.map((e) => (
              <div key={e.id}>
                <div className="font-medium text-sm">
                  {e.companyOrProjectName}
                  {e.title && ` – ${e.title}`}
                </div>
                <div className="text-xs text-slate-500">
                  {e.timePeriod}
                  {e.subtitle && ` · ${e.subtitle}`}
                </div>
                {e.details.filter(Boolean).length > 0 && (
                  <ul className="mt-1 list-disc list-inside text-sm text-slate-600">
                    {e.details.filter(Boolean).map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Education</h2>
          <div className="space-y-3">
            {resume.education.map((e) => (
              <div key={e.id}>
                <div className="font-medium text-sm">
                  {e.schoolName} – {e.degreeOrTitle}
                </div>
                <div className="text-xs text-slate-500">
                  {e.timePeriod}
                  {e.subtitle && ` · ${e.subtitle}`}
                </div>
                {e.details.filter(Boolean).length > 0 && (
                  <ul className="mt-1 list-disc list-inside text-sm text-slate-600">
                    {e.details.filter(Boolean).map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {resume.skills.filter(Boolean).length > 0 && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {resume.skills.filter(Boolean).map((s, i) => (
              <span key={i} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-sm">
                {s}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
