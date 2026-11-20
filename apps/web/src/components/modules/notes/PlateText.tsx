import type { ReactNode } from 'react'

const PLATE_RE = /\b\d{1,2}[A-Z]{3}\d{3}\b/g

/** Renders `text` with any embedded plate number ("87PLN903") styled as a
 * small license-plate chip, matching the reference's `.lpi` convention —
 * used inside note blocks (paragraph/bullet/checklist/quote). */
export function PlateText({ text }: { text: string }) {
  const parts: ReactNode[] = []
  let last = 0
  let match: RegExpExecArray | null
  let key = 0
  PLATE_RE.lastIndex = 0
  while ((match = PLATE_RE.exec(text))) {
    if (match.index > last) parts.push(text.slice(last, match.index))
    parts.push(
      <span
        key={key++}
        className="inline-block whitespace-nowrap rounded-[3px] bg-white px-[0.32em] text-[1.05em] font-normal tracking-[0.04em] text-[#2C307E] shadow-[inset_0_0_0_1px_#B8BEC8]"
        style={{ fontFamily: "'Arial Narrow', sans-serif" }}
      >
        {match[0]}
      </span>,
    )
    last = match.index + match[0].length
  }
  parts.push(text.slice(last))
  return <>{parts}</>
}
