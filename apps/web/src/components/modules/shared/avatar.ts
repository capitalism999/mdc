const PALETTE = ['#48adec', '#9b6bea', '#e8637a', '#3fb97f', '#e0a63f', '#5c7cfa']

export function getInitials(firstName: string, lastName: string) {
  const first = firstName.trim()[0] ?? ''
  const last = lastName.trim()[0] ?? ''
  return (first + last).toUpperCase() || '?'
}

export function getAvatarColor(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  return PALETTE[hash % PALETTE.length]
}
