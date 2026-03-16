function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * Very small inline Markdown subset:
 * - **bold**
 * - *italic*
 * - __underline__
 * - line breaks -> <br>
 */
export function inlineMarkdownToHtml(raw: string): string {
  if (!raw) return ''
  let html = escapeHtml(raw)

  // Normalize line endings
  html = html.replace(/\r\n/g, '\n')

  // Bold: **text**
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

  // Underline: __text__
  html = html.replace(/__(.+?)__/g, '<u>$1</u>')

  // Italic: *text* (single stars only, avoid interfering with bold)
  html = html.replace(/(^|[^\*])\*(?!\*)([^*\n]+)\*(?!\*)(?=[^\*]|$)/g, '$1<em>$2</em>')

  // Line breaks
  html = html.replace(/\n/g, '<br/>')

  return html
}

