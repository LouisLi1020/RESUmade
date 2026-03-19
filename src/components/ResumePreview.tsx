import type { Resume, ResumeSectionId } from '@/types/resume'
import { defaultSectionsOrder } from '@/types/resume'
import { useI18n } from '@/i18n/I18nContext'
import { getLinkDisplayText, inferLinkKindFromUrl } from '@/utils/linkDisplay'
import { inlineMarkdownToHtml } from '@/utils/markdown'
import type { LinkKind } from '@/types/resume'

const iconClass = 'w-5 h-5 flex-shrink-0 text-slate-500'

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

function IconLinkedIn() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="2" className="fill-[#0a66c2]" />
      <path
        d="M8 17h2.2v-6.2H8V17Zm1.1-7.3c.7 0 1.1-.45 1.1-1.05-.01-.6-.41-1.05-1.09-1.05S8 8.05 8 8.65c0 .6.43 1.05 1.09 1.05ZM11.5 17H13.7v-3.5c0-.19.02-.37.07-.5.15-.37.49-.75 1.07-.75.76 0 1.06.57 1.06 1.4V17H18v-3.6c0-1.93-1.03-2.83-2.4-2.83-1.13 0-1.64.63-1.92 1.06h.01V10.8h-2.19c.03.6 0 6.2 0 6.2Z"
        fill="white"
      />
    </svg>
  )
}

function IconInstagram() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" className="fill-[#e1306c]" />
      <circle cx="12" cy="12" r="4" fill="white" />
      <circle cx="17" cy="7" r="1" fill="white" />
    </svg>
  )
}

function IconSpotify() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="10" className="fill-[#1db954]" />
      <path
        d="M8 10.5c2.3-.4 4.4-.2 6.5.5M8.5 13c1.8-.3 3.4-.2 5 .3M9 15.3c1.3-.2 2.4-.2 3.6.2"
        stroke="white"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconGitHub() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.48 2 2 6.58 2 12.26c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.9 1.56 2.36 1.11 2.94.85.09-.67.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.32.1-2.76 0 0 .84-.28 2.75 1.05A9.18 9.18 0 0 1 12 6.3c.85 0 1.7.12 2.49.34 1.9-1.33 2.74-1.05 2.74-1.05.56 1.44.21 2.5.11 2.76.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.95.68 1.92 0 1.39-.01 2.51-.01 2.85 0 .27.18.6.69.49A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z"
        className="fill-slate-800"
      />
    </svg>
  )
}

function IconX() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="2" className="fill-slate-900" />
      <path
        d="M9 8h1.6l1.8 2.6L14.8 8H16l-2.6 3.5L16.2 16h-1.6l-2-2.8L10.4 16H9l2.8-3.7L9 8Z"
        fill="white"
      />
    </svg>
  )
}

function IconFacebook() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="2" className="fill-[#1877f2]" />
      <path
        d="M13 19v-5h2.1l.4-2H13V10c0-.58.19-1 .98-1H16V7.1C15.82 7.07 15.3 7 14.71 7 13.02 7 12 7.9 12 9.7V12H10v2h2v5h1Z"
        fill="white"
      />
    </svg>
  )
}

function LinkIcon({ kind }: { kind: LinkKind }) {
  switch (kind) {
    case 'linkedin':
      return <IconLinkedIn />
    case 'instagram':
      return <IconInstagram />
    case 'spotify':
      return <IconSpotify />
    case 'github':
      return <IconGitHub />
    case 'x':
      return <IconX />
    case 'facebook':
      return <IconFacebook />
    default:
      return <IconGlobe />
  }
}

type ResumeStyleVariant = 'clean' | 'compact' | 'classic'

interface Props {
  resume: Resume
  className?: string
  styleVariant?: ResumeStyleVariant
}

export default function ResumePreview({
  resume,
  className = '',
  styleVariant = 'clean',
  sectionsOrder,
}: Props & { sectionsOrder?: ResumeSectionId[] }) {
  const { t } = useI18n()
  const p = resume.personal
  const legal = p.legalName?.trim() || '—'
  const preferred = (p.showPreferredName !== false && p.preferredName?.trim()) ? p.preferredName.trim() : ''
  const name = preferred ? `${legal} (${preferred})` : legal

  const isCompact = styleVariant === 'compact'
  const isClassic = styleVariant === 'classic'

  const order: ResumeSectionId[] = sectionsOrder && sectionsOrder.length
    ? sectionsOrder
    : defaultSectionsOrder

  return (
    <div
      className={`bg-white shadow-lg rounded-lg ${
        isCompact ? 'p-4' : 'p-6'
      } text-slate-800 max-w-[210mm] mx-auto ${className}`}
      style={{ minHeight: '297mm' }}
    >
      <h1
        className={`border-b border-slate-200 pb-1 mb-1 ${
          isCompact ? 'text-lg' : 'text-xl'
        } ${isClassic ? 'font-serif font-bold' : 'font-semibold'}`}
      >
        {name}
      </h1>
      <div
        className={`flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500 ${
          isCompact ? 'mb-3' : 'mb-4'
        }`}
      >
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
        {p.links
          ?.filter((l) => l.url)
          .map((l, i) => {
            const showUrlText = !!p.showFullUrls
            const text = showUrlText ? getLinkDisplayText(l, { showFullUrls: true }) : ''
            const kind: LinkKind = l.kind ?? inferLinkKindFromUrl(l.url)
            return (
              <a
                key={i}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-600 hover:text-slate-800 hover:underline"
              >
                <LinkIcon kind={kind} />
                {showUrlText && text && <span>{text}</span>}
              </a>
            )
          })}
      </div>

      {order.map((sec) => {
        if (sec === 'introduction') {
          if (!resume.introduction.trim()) return null
          return (
            <section key={sec} className={isCompact ? 'mb-3' : 'mb-4'}>
              <h2
                className={`text-xs font-semibold uppercase tracking-wide text-slate-500 ${
                  isCompact ? 'mb-1.5' : 'mb-2'
                } ${isClassic ? 'font-serif' : ''}`}
              >
                {t('resume.introduction')}
              </h2>
              <p
                className={`${isCompact ? 'text-xs' : 'text-sm'}`}
                dangerouslySetInnerHTML={{ __html: inlineMarkdownToHtml(resume.introduction.trim()) }}
              />
            </section>
          )
        }
        if (sec === 'experience') {
          if (!resume.experiences.length) return null
          return (
            <section key={sec} className={isCompact ? 'mb-3' : 'mb-4'}>
              <h2
                className={`text-xs font-semibold uppercase tracking-wide text-slate-500 ${
                  isCompact ? 'mb-1.5' : 'mb-2'
                } ${isClassic ? 'font-serif' : ''}`}
              >
                {t('resume.experience')}
              </h2>
              <div className={isCompact ? 'space-y-2' : 'space-y-3'}>
                {resume.experiences.map((e) => (
                  <div key={e.id}>
                    <div className={`font-medium ${isCompact ? 'text-xs' : 'text-sm'}`}>
                      {e.companyOrProjectName}
                      {e.title && ` – ${e.title}`}
                    </div>
                    <div className="text-xs text-slate-500">
                      {e.timePeriod}
                      {e.subtitle && ` · ${e.subtitle}`}
                    </div>
                    {e.details.filter(Boolean).length > 0 && (
                      <ul
                        className={`mt-1 list-disc list-inside text-slate-600 ${
                          isCompact ? 'text-xs' : 'text-sm'
                        }`}
                      >
                        {e.details.filter(Boolean).map((d, i) => (
                          <li
                            key={i}
                            dangerouslySetInnerHTML={{ __html: inlineMarkdownToHtml(d) }}
                          />
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )
        }
        if (sec === 'education') {
          if (!resume.education.length) return null
          return (
            <section key={sec} className={isCompact ? 'mb-3' : 'mb-4'}>
              <h2
                className={`text-xs font-semibold uppercase tracking-wide text-slate-500 ${
                  isCompact ? 'mb-1.5' : 'mb-2'
                } ${isClassic ? 'font-serif' : ''}`}
              >
                {t('resume.education')}
              </h2>
              <div className={isCompact ? 'space-y-2' : 'space-y-3'}>
                {resume.education.map((e) => (
                  <div key={e.id}>
                    <div className={`font-medium ${isCompact ? 'text-xs' : 'text-sm'}`}>
                      {e.schoolName} – {e.degreeOrTitle}
                    </div>
                    <div className="text-xs text-slate-500">
                      {e.timePeriod}
                      {e.subtitle && ` · ${e.subtitle}`}
                    </div>
                    {e.details.filter(Boolean).length > 0 && (
                      <ul
                        className={`mt-1 list-disc list-inside text-slate-600 ${
                          isCompact ? 'text-xs' : 'text-sm'
                        }`}
                      >
                        {e.details.filter(Boolean).map((d, i) => (
                          <li
                            key={i}
                            dangerouslySetInnerHTML={{ __html: inlineMarkdownToHtml(d) }}
                          />
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )
        }
        if (sec === 'skills') {
          const skills = resume.skills.filter(Boolean)
          if (!skills.length) return null
          return (
            <section key={sec}>
              <h2
                className={`text-xs font-semibold uppercase tracking-wide text-slate-500 ${
                  isCompact ? 'mb-1.5' : 'mb-2'
                } ${isClassic ? 'font-serif' : ''}`}
              >
                {t('resume.skills')}
              </h2>
              <div className={`flex flex-wrap gap-2 ${isCompact ? 'text-xs' : 'text-sm'}`}>
                {skills.map((s, i) => (
                  <span key={i} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )
        }
        return null
      })}
    </div>
  )
}
