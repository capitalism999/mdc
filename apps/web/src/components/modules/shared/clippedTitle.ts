import type { MouseEvent } from 'react'

/**
 * Tooltips for text cut off with «…»: put `onMouseOver={showClippedTitle}` on a
 * module's root and any truncated line (CSS ellipsis — `.ell`, Tailwind
 * `truncate`, or `text-overflow: ellipsis`) shows its full text on hover.
 * Elements that already have their own `title` keep it.
 */
export function showClippedTitle(e: MouseEvent<HTMLElement>) {
  let el = e.target as HTMLElement | null
  for (let depth = 0; el && depth < 4; depth++, el = el.parentElement) {
    if (el === e.currentTarget) return
    if (el.hasAttribute('title')) return
    if (el.scrollWidth <= el.clientWidth + 1) continue
    if (getComputedStyle(el).textOverflow !== 'ellipsis') continue
    const text = (el.textContent ?? '').replace(/\s+/g, ' ').trim()
    if (text) el.setAttribute('title', text)
    return
  }
}
