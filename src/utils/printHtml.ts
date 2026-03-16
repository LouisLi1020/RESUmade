import type { Resume } from '@/types/resume'

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

function contactItem(icon: string, content: string): string {
  return `<span class="ci">${icon}<span>${content}</span></span>`
}

export function getResumePrintHtml(resume: Resume): string {
  const p = resume.personal
  const legal = p.legalName?.trim() || ''
  const preferred = (p.showPreferredName !== false && p.preferredName?.trim()) ? p.preferredName.trim() : ''
  const name = legal ? (preferred ? `${legal} (${preferred})` : legal) : 'Name'

  const contactParts: string[] = []
  if (p.email) contactParts.push(contactItem(svgEmail, escapeHtml(p.email)))
  if (p.phone) contactParts.push(contactItem(svgPhone, escapeHtml(p.phone)))
  if (p.address) contactParts.push(contactItem(svgLocation, escapeHtml(p.address)))
  if (p.links?.length) p.links.forEach((l) => {
    if (!l.url) return
    const display = p.showFullUrls ? (l.label ? `${l.label}: ${l.url}` : l.url) : (l.label || l.url)
    contactParts.push(`<a href="${escapeHtml(l.url)}" class="ci">${svgGlobe}<span>${escapeHtml(display)}</span></a>`)
  })
  const contactHtml = contactParts.length ? `<div class="contact">${contactParts.join('')}</div>` : ''

  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Resume - ${escapeHtml(name)}</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11px; line-height: 1.4; color: #1e293b; margin: 0; padding: 24px 32px; max-width: 210mm; }
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
  </style>
</head>
<body>
  <h1>${escapeHtml(name)}</h1>
  ${contactHtml}
  ${resume.introduction.trim() ? `<section class="intro"><h2>Introduction</h2><p>${escapeHtml(resume.introduction.trim())}</p></section>` : ''}
  ${resume.experiences.length ? `
  <section>
    <h2>Experience</h2>
    ${resume.experiences
      .map(
        (e) => `
    <div class="block">
      <div class="block-title">${escapeHtml(e.companyOrProjectName)}${e.title ? ` – ${escapeHtml(e.title)}` : ''}</div>
      <div class="block-meta">${escapeHtml(e.timePeriod)}${e.subtitle ? ` · ${escapeHtml(e.subtitle)}` : ''}</div>
      ${e.details.filter(Boolean).length ? `<ul>${e.details.filter(Boolean).map((d) => `<li>${escapeHtml(d)}</li>`).join('')}</ul>` : ''}
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
      ${e.details.filter(Boolean).length ? `<ul>${e.details.filter(Boolean).map((d) => `<li>${escapeHtml(d)}</li>`).join('')}</ul>` : ''}
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
