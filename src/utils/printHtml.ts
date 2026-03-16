import type { Resume, LinkKind } from '@/types/resume'
import { getLinkDisplayText, inferLinkKindFromUrl } from '@/utils/linkDisplay'
import { inlineMarkdownToHtml } from '@/utils/markdown'

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

const svgEmail = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>'
const svgPhone = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>'
const svgLocation = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>'
const svgGlobe = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'
const svgLinkedIn =
  '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" fill="#0a66c2"/><path d="M8 17h2.2v-6.2H8V17Zm1.1-7.3c.7 0 1.1-.45 1.1-1.05-.01-.6-.41-1.05-1.09-1.05S8 8.05 8 8.65c0 .6.43 1.05 1.09 1.05ZM11.5 17H13.7v-3.5c0-.19.02-.37.07-.5.15-.37.49-.75 1.07-.75.76 0 1.06.57 1.06 1.4V17H18v-3.6c0-1.93-1.03-2.83-2.4-2.83-1.13 0-1.64.63-1.92 1.06h.01V10.8h-2.19c.03.6 0 6.2 0 6.2Z" fill="#ffffff"/></svg>'
const svgInstagram =
  '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="#e1306c"/><circle cx="12" cy="12" r="4" fill="#ffffff"/><circle cx="17" cy="7" r="1" fill="#ffffff"/></svg>'
const svgSpotify =
  '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#1db954"/><path d="M8 10.5c2.3-.4 4.4-.2 6.5.5M8.5 13c1.8-.3 3.4-.2 5 .3M9 15.3c1.3-.2 2.4-.2 3.6.2" stroke="#ffffff" stroke-width="1.3" stroke-linecap="round"/></svg>'
const svgGitHub =
  '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.48 2 2 6.58 2 12.26c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.9 1.56 2.36 1.11 2.94.85.09-.67.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.32.1-2.76 0 0 .84-.28 2.75 1.05A9.18 9.18 0 0 1 12 6.3c.85 0 1.7.12 2.49.34 1.9-1.33 2.74-1.05 2.74-1.05.56 1.44.21 2.5.11 2.76.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.95.68 1.92 0 1.39-.01 2.51-.01 2.85 0 .27.18.6.69.49A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" fill="#0f172a"/></svg>'
const svgX =
  '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" fill="#020617"/><path d="M9 8h1.6l1.8 2.6L14.8 8H16l-2.6 3.5L16.2 16h-1.6l-2-2.8L10.4 16H9l2.8-3.7L9 8Z" fill="#ffffff"/></svg>'
const svgFacebook =
  '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" fill="#1877f2"/><path d="M13 19v-5h2.1l.4-2H13V10c0-.58.19-1 .98-1H16V7.1C15.82 7.07 15.3 7 14.71 7 13.02 7 12 7.9 12 9.7V12H10v2h2v5h1Z" fill="#ffffff"/></svg>'

function contactItem(icon: string, content: string): string {
  return `<span class="ci">${icon}<span>${content}</span></span>`
}

function socialIconForKind(kind: LinkKind): string {
  switch (kind) {
    case 'linkedin':
      return svgLinkedIn
    case 'instagram':
      return svgInstagram
    case 'spotify':
      return svgSpotify
    case 'github':
      return svgGitHub
    case 'x':
      return svgX
    case 'facebook':
      return svgFacebook
    case 'link':
    default:
      return svgGlobe
  }
}

type ResumeStyleVariant = 'clean' | 'compact' | 'classic'

function getStyleCss(variant: ResumeStyleVariant): string {
  if (variant === 'compact') {
    return `
    * { box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, system-ui, sans-serif; font-size: 10px; line-height: 1.35; color: #1e293b; margin: 0; padding: 18px 24px; max-width: 210mm; }
    h1 { font-size: 16px; margin: 0 0 4px 0; font-weight: 600; }
    .contact { display: flex; flex-wrap: wrap; align-items: center; gap: 0.6rem 1rem; color: #64748b; margin-bottom: 10px; }
    .contact .ci { display: inline-flex; align-items: center; gap: 0.3rem; }
    .contact .ci svg { flex-shrink: 0; color: #475569; }
    .contact a { color: #475569; text-decoration: none; }
    section { margin-bottom: 10px; }
    section h2 { font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #475569; border-bottom: 1px solid #cbd5e1; padding-bottom: 3px; margin: 0 0 6px 0; }
    .intro { margin-bottom: 10px; }
    .block { margin-bottom: 8px; }
    .block-title { font-weight: 600; font-size: 10px; }
    .block-meta { color: #64748b; font-size: 9px; margin-bottom: 2px; }
    ul { margin: 0; padding-left: 16px; }
    .skills { display: flex; flex-wrap: wrap; gap: 4px; }
    .skills span { background: #f1f5f9; padding: 1px 6px; border-radius: 3px; font-size: 9px; }
  `
  }

  if (variant === 'classic') {
    return `
    * { box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif; font-size: 11px; line-height: 1.45; color: #111827; margin: 0; padding: 24px 32px; max-width: 210mm; }
    h1 { font-family: "Georgia", "Times New Roman", serif; font-size: 18px; margin: 0 0 4px 0; font-weight: 700; color: #111827; }
    .contact { display: flex; flex-wrap: wrap; align-items: center; gap: 0.75rem 1.25rem; color: #4b5563; margin-bottom: 12px; }
    .contact .ci { display: inline-flex; align-items: center; gap: 0.35rem; }
    .contact .ci svg { flex-shrink: 0; color: #4b5563; }
    .contact a { color: #374151; text-decoration: none; }
    section { margin-bottom: 14px; }
    section h2 { font-family: "Georgia", "Times New Roman", serif; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #111827; border-bottom: 1px solid #d1d5db; padding-bottom: 4px; margin: 0 0 8px 0; }
    .intro { margin-bottom: 14px; }
    .block { margin-bottom: 10px; }
    .block-title { font-weight: 600; font-size: 11px; }
    .block-meta { color: #6b7280; font-size: 10px; margin-bottom: 2px; }
    ul { margin: 0; padding-left: 18px; }
    .skills { display: flex; flex-wrap: wrap; gap: 6px; }
    .skills span { background: #f3f4f6; padding: 2px 8px; border-radius: 999px; font-size: 10px; }
  `
  }

  // clean (default)
  return `
    * { box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, system-ui, sans-serif; font-size: 11px; line-height: 1.4; color: #1e293b; margin: 0; padding: 24px 32px; max-width: 210mm; }
    h1 { font-size: 18px; margin: 0 0 4px 0; font-weight: 600; }
    .contact { display: flex; flex-wrap: wrap; align-items: center; gap: 0.75rem 1.25rem; color: #64748b; margin-bottom: 12px; }
    .contact .ci { display: inline-flex; align-items: center; gap: 0.35rem; }
    .contact .ci svg { flex-shrink: 0; color: #475569; }
    .contact a { color: #475569; text-decoration: none; }
    section { margin-bottom: 12px; }
    section h2 { font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #475569; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin: 0 0 8px 0; }
    .intro { margin-bottom: 12px; }
    .block { margin-bottom: 10px; }
    .block-title { font-weight: 600; font-size: 11px; }
    .block-meta { color: #64748b; font-size: 10px; margin-bottom: 2px; }
    ul { margin: 0; padding-left: 18px; }
    .skills { display: flex; flex-wrap: wrap; gap: 6px; }
    .skills span { background: #f1f5f9; padding: 2px 8px; border-radius: 4px; font-size: 10px; }
  `
}

export function getResumePrintHtml(resume: Resume, styleVariant: ResumeStyleVariant = 'clean'): string {
  const p = resume.personal
  const legal = p.legalName?.trim() || ''
  const preferred = (p.showPreferredName !== false && p.preferredName?.trim()) ? p.preferredName.trim() : ''
  const name = legal ? (preferred ? `${legal} (${preferred})` : legal) : 'Name'

  const contactParts: string[] = []
  if (p.email) contactParts.push(contactItem(svgEmail, escapeHtml(p.email)))
  if (p.phone) contactParts.push(contactItem(svgPhone, escapeHtml(p.phone)))
  if (p.address) contactParts.push(contactItem(svgLocation, escapeHtml(p.address)))
  if (p.links?.length)
    p.links.forEach((l) => {
      if (!l.url) return
      const showText = !!p.showFullUrls
      const display = showText ? getLinkDisplayText(l, { showFullUrls: true }) : ''
      const kind: LinkKind = l.kind ?? inferLinkKindFromUrl(l.url)
      const icon = socialIconForKind(kind)
      const textPart = showText && display ? `<span>${escapeHtml(display)}</span>` : ''
      contactParts.push(
        `<a href="${escapeHtml(l.url)}" class="ci">${icon}${textPart}</a>`,
      )
    })
  const contactHtml = contactParts.length ? `<div class="contact">${contactParts.join('')}</div>` : ''

  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Resume - ${escapeHtml(name)}</title>
  <style>
  ${getStyleCss(styleVariant)}
  </style>
</head>
<body>
  <h1>${escapeHtml(name)}</h1>
  ${contactHtml}
  ${resume.introduction.trim() ? `<section class="intro"><h2>Introduction</h2><p>${inlineMarkdownToHtml(resume.introduction.trim())}</p></section>` : ''}
  ${resume.experiences.length ? `
  <section>
    <h2>Experience</h2>
    ${resume.experiences
      .map(
        (e) => `
    <div class="block">
      <div class="block-title">${escapeHtml(e.companyOrProjectName)}${e.title ? ` – ${escapeHtml(e.title)}` : ''}</div>
      <div class="block-meta">${escapeHtml(e.timePeriod)}${e.subtitle ? ` · ${escapeHtml(e.subtitle)}` : ''}</div>
      ${e.details.filter(Boolean).length ? `<ul>${e.details
        .filter(Boolean)
        .map((d) => `<li>${inlineMarkdownToHtml(d)}</li>`)
        .join('')}</ul>` : ''}
    </div>`
      )
      .join('')}
  </section>` : ''}
  ${resume.education.length ? `
  <section>
    <h2>Education</h2>
    ${resume.education
      .map(
        (e) => `
    <div class="block">
      <div class="block-title">${escapeHtml(e.schoolName)} – ${escapeHtml(e.degreeOrTitle)}</div>
      <div class="block-meta">${escapeHtml(e.timePeriod)}${e.subtitle ? ` · ${escapeHtml(e.subtitle)}` : ''}</div>
      ${e.details.filter(Boolean).length ? `<ul>${e.details
        .filter(Boolean)
        .map((d) => `<li>${inlineMarkdownToHtml(d)}</li>`)
        .join('')}</ul>` : ''}
    </div>`
      )
      .join('')}
  </section>` : ''}
  ${resume.skills.filter(Boolean).length ? `
  <section>
    <h2>Skills</h2>
    <div class="skills">${resume.skills.filter(Boolean).map((s) => `<span>${escapeHtml(s)}</span>`).join('')}</div>
  </section>` : ''}
</body>
</html>`
  return html
}
