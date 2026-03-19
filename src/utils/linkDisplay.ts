import type { LinkItem, LinkKind } from '@/types/resume'

function normalizeUrl(raw: string): URL | null {
  const trimmed = raw.trim()
  if (!trimmed) return null
  try {
    // If the user omitted protocol, assume https
    const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
    return new URL(withProto)
  } catch {
    return null
  }
}

export function inferLinkKindFromUrl(url: string): LinkKind {
  const parsed = normalizeUrl(url)
  if (!parsed) return 'link'
  const host = parsed.hostname.toLowerCase()

  if (host.includes('linkedin.com')) return 'linkedin'
  if (host.includes('instagram.com')) return 'instagram'
  if (host.includes('spotify.com')) return 'spotify'
  if (host.includes('github.com')) return 'github'
  if (host.includes('x.com') || host.includes('twitter.com')) return 'x'
  if (host.includes('facebook.com')) return 'facebook'

  return 'link'
}

/**
 * Returns the meaningful part of a URL for display (e.g. icon already tells the site).
 * LinkedIn → "in/username", GitHub → "username", generic → "domain.com/path" (no protocol/www).
 */
function formatUrlDisplayByKind(parsed: URL, kind: LinkKind): string {
  const host = parsed.hostname.replace(/^www\./i, '')
  const path = parsed.pathname.replace(/\/+$/, '') // trim trailing slash
  const pathSegments = path.split('/').filter(Boolean)

  switch (kind) {
    case 'linkedin':
      // e.g. /in/username → "in/username"
      return pathSegments.length ? pathSegments.join('/') : host
    case 'github':
      // e.g. /username or /username/repo → "username"
      return pathSegments[0] ?? host
    case 'x':
    case 'instagram':
    case 'facebook':
      // e.g. /username → "username"
      return pathSegments[0] ?? host
    case 'spotify':
      // e.g. /user/xxx, /artist/xxx → "user/xxx" or "artist/xxx"
      return pathSegments.length ? pathSegments.join('/') : host
    case 'link':
    default:
      return path ? `${host}${path}` : host
  }
}

export function getLinkDisplayText(link: LinkItem, options?: { showFullUrls?: boolean }): string {
  const url = (link.url ?? '').trim()
  if (!url) return ''

  const parsed = normalizeUrl(url)
  if (!parsed) return url

  const kind: LinkKind = link.kind ?? inferLinkKindFromUrl(url)
  return formatUrlDisplayByKind(parsed, kind)
}

