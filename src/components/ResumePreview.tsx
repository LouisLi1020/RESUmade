import type { Resume } from '@/types/resume'
import { useI18n } from '@/i18n/I18nContext'

const iconClass = 'w-4 h-4 flex-shrink-0 text-slate-500'

function IconEmail() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}
function IconPhone() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}
function IconLocation() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}
function IconGlobe() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

interface Props {
  resume: Resume
  className?: string
}

export default function ResumePreview({ resume, className = '' }: Props) {
  const { t } = useI18n()
  const p = resume.personal
  const legal = p.legalName?.trim() || '—'
  const preferred = (p.showPreferredName !== false && p.preferredName?.trim()) ? p.preferredName.trim() : ''
  const name = preferred ? `${legal} (${preferred})` : legal

  return (
    <div
      className={`bg-white shadow-lg rounded-lg p-6 text-slate-800 max-w-[210mm] mx-auto ${className}`}
      style={{ minHeight: '297mm' }}
    >
      <h1 className="text-xl font-semibold border-b border-slate-200 pb-1 mb-1">{name}</h1>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500 mb-4">
        {p.email && (
          <a href={`mailto:${p.email}`} className="flex items-center gap-2 hover:text-slate-700">
            <IconEmail />
            <span>{p.email}</span>
          </a>
        )}
        {p.phone && (
          <a href={`tel:${p.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 hover:text-slate-700">
            <IconPhone />
            <span>{p.phone}</span>
          </a>
        )}
        {p.address && (
          <span className="flex items-center gap-2">
            <IconLocation />
            <span>{p.address}</span>
          </span>
        )}
        {p.links?.filter((l) => l.url).map((l, i) => (
          <a key={i} href={l.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-600 hover:text-slate-800 hover:underline">
            <IconGlobe />
            <span>{p.showFullUrls ? (l.label ? `${l.label}: ${l.url}` : l.url) : (l.label || l.url)}</span>
          </a>
        ))}
      </div>

      {resume.introduction.trim() && (
        <section className="mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">{t('resume.introduction')}</h2>
          <p className="text-sm whitespace-pre-wrap">{resume.introduction.trim()}</p>
        </section>
      )}

      {resume.experiences.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">{t('resume.experience')}</h2>
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
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">{t('resume.education')}</h2>
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
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">{t('resume.skills')}</h2>
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
