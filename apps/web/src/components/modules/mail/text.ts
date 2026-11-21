import type { MailMessage } from '../../../types'

/** A letter in «Черновики» (mock drafts carry the sender «Черновик»). */
export function isDraft(m: MailMessage) {
  return m.folder === 'drafts' || m.from === 'Черновик'
}

export function stripHtml(html: string) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function escapeHtml(text: string) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/** Russian plural form for a count of letters/messages ("1 письмо",
 * "3 письма", "5 писем"). */
export function pluralLetters(n: number) {
  const a = n % 10
  const b = n % 100
  if (a === 1 && b !== 11) return 'письмо'
  if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return 'письма'
  return 'писем'
}

export type TextSplit = [string, string, string]

/** Splits `text` around the first case-insensitive occurrence of `query`,
 * for highlighting a search match — `null` when there's no match. */
export function splitMatch(text: string, query: string): TextSplit | null {
  if (!query) return null
  const i = text.toLowerCase().indexOf(query.toLowerCase())
  if (i < 0) return null
  return [text.slice(0, i), text.slice(i, i + query.length), text.slice(i + query.length)]
}
