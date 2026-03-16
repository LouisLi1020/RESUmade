import type { Resume } from '@/types/resume'

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function getResumePrintHtml(resume: Resume): string {
  const p = resume.personal
  const name = p.preferredName?.trim() || p.legalName?.trim() || 'Name'
  const contact: string[] = []
  if (p.email) contact.push(escapeHtml(p.email))
  if (p.phone) contact.push(escapeHtml(p.phone))
  if (p.address) contact.push(escapeHtml(p.address))
  if (p.links?.length) p.links.forEach((l) => {
    if (!l.url) return
    const display = p.showFullUrls ? (l.label ? `${l.label}: ${l.url}` : l.url) : (l.label || l.url)
    contact.push(`<a href="${escapeHtml(l.url)}">${escapeHtml(display)}</a>`)
  })

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
    .contact { color: #64748b; margin-bottom: 12px; }
    .contact a { color: #475569; text-decoration: none; }
    .contact span + span::before { content: " · "; }
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
  <div class="contact">${contact.join(' ')}</div>
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
