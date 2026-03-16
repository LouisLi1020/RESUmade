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

function formatUrlDisplay(parsed: URL, full: boolean): string {
  const host = parsed.hostname
  const path = parsed.pathname === '/' ? '' : parsed.pathname

  if (full) {
    const base = `${host}${path}`
    return base || host
  }

  // Simplified: host + first-level path, no query/hash
  if (!path) return host

  // Remove trailing slash for display
  const cleanPath = path.replace(/\/+$/, '')
  return `${host}${cleanPath}`
}

export function getLinkDisplayText(link: LinkItem, options?: { showFullUrls?: boolean }): string {
  const url = (link.url ?? '').trim()
  if (!url) return ''

  const parsed = normalizeUrl(url)
  if (!parsed) return url

  const full = !!options?.showFullUrls
  return formatUrlDisplay(parsed, full)
}

