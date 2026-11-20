interface IconProps {
  className?: string
}

export function NoteGlyphIcon({ className }: IconProps) {
  return (
    <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 6h10M5 10h10M5 14h6" />
    </svg>
  )
}

export function FolderIcon({ className }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" className={className}>
      <path d="M2.5 5.5v10h15v-8h-7l-2-2z" />
    </svg>
  )
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 8l4 4 4-4" />
    </svg>
  )
}

export function PlusNoteIcon({ className }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 3.5H5A1.5 1.5 0 003.5 5v10A1.5 1.5 0 005 16.5h10a1.5 1.5 0 001.5-1.5v-4" />
      <path d="M14.5 2.5l3 3-7 7H7.5v-3z" />
    </svg>
  )
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className={className}>
      <circle cx="8.5" cy="8.5" r="5.5" />
      <path d="M12.5 12.5l4.5 4.5" />
    </svg>
  )
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg width="11" height="11" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
      <path d="M5 5l10 10M15 5L5 15" />
    </svg>
  )
}

/** Rectangle split by a vertical line — "collapse/show the note list". */
export function PanelSplitIcon({ className }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" className={className}>
      <rect x="2.5" y="3.5" width="15" height="13" rx="2" />
      <path d="M8 3.5v13" />
    </svg>
  )
}

/** Pushpin, not a flag — matches the reference's pin glyph exactly. */
export function PinIcon({ className }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" className={className}>
      <path d="M12 2.5l5.5 5.5-2.5 1-3 3 .5 3.5-1.5 1.5-3-3-4.5 4.5M8.5 11.5l-3-3 1.5-1.5 3.5.5 3-3z" />
    </svg>
  )
}

export function LinkCaseIcon({ className }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className={className}>
      <path d="M8.5 11.5a3 3 0 004.2 0l2.6-2.6a3 3 0 00-4.2-4.2l-1 1" />
      <path d="M11.5 8.5a3 3 0 00-4.2 0l-2.6 2.6a3 3 0 004.2 4.2l1-1" />
    </svg>
  )
}

export function PrintIcon({ className }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" className={className}>
      <path d="M5.5 7.5V3h9v4.5" />
      <rect x="2.5" y="7.5" width="15" height="7" rx="1.5" />
      <path d="M5.5 12h9v5h-9z" />
      <path d="M14.5 10h.5" />
    </svg>
  )
}

export function TrashIcon({ className }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3.5 5.5h13" />
      <path d="M8 5.5v-2h4v2" />
      <path d="M5 5.5l1 11h8l1-11" />
    </svg>
  )
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4.5 10.5l3.5 3.5 7.5-8" />
    </svg>
  )
}
