const PALETTE = ['#48adec', '#9b6bea', '#e8637a', '#3fb97f', '#e0a63f', '#5c7cfa']

/**
 * Derives 1-2 letter initials for an avatar bubble from a free-form name
 * like "12D3 Thorne Watts", "Deputy K. Alvarez" or "Система SALETS MDT".
 * Strips a leading badge-number token (contains a digit) if present, then
 * takes the first letter of the first and last remaining words.
 */
export function getInitials(name: string) {
  const cleaned = name.replace(/^\S*\d\S*\s+/, '').trim()
  const parts = cleaned.split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  const first = parts[0].replace(/[^\p{L}]/gu, '')[0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1].replace(/[^\p{L}]/gu, '')[0] ?? '') : ''
  return (first + last).toUpperCase() || '?'
}

export function getAvatarColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i += 1) hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  return PALETTE[hash % PALETTE.length]
}
