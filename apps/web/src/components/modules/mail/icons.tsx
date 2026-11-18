interface IconProps {
  className?: string
}

export function InboxIcon({ className }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M2 3h12v6.5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V3Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path
        d="M2 9h3.2a1 1 0 0 1 .9.56l.4.88a1 1 0 0 0 .9.56h1.2a1 1 0 0 0 .9-.56l.4-.88a1 1 0 0 1 .9-.56H14"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function SentIcon({ className }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M2 8 13.5 2.5 11 13l-3.2-3.8L2 8Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M7.8 9.2 13.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

export function TrashIcon({ className }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className={className}>
      <path
        d="M3 4.5h10M6.5 4.5V3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1.5M4 4.5 4.6 13a1 1 0 0 0 1 .9h4.8a1 1 0 0 0 1-.9l.6-8.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M6.5 7.3v4M9.5 7.3v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

export function MailOpenIcon({ className }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M2 5.5 8 9l6-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="2" y="3.5" width="12" height="9" rx="1.3" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}

/** A flag-on-a-pole glyph (not a drawing-pin) — "flagged" in this module
 * means marked with a flag, matching the reference design exactly. */
export function PinIcon({ className, filled }: IconProps & { filled?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" className={className}>
      <path d="M5 17V3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path
        d="M5 3.5h10l-2 3.5 2 3.5H5"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Double-chevron "collapse panel" toggle — points left by default; callers
 * rotate it 180° via `className` to flip the direction depending on which
 * side of the layout the panel it controls sits on. */
export function PanelToggleIcon({ className }: IconProps) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={className}>
      <path
        d="M5.5 3.5 2.5 7l3 3.5M9.5 3.5 6.5 7l3 3.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ImportantIcon({ className }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M8 2v7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="8" cy="12.5" r="1" fill="currentColor" />
    </svg>
  )
}

export function AttachIcon({ className }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <path
        d="M11 4.5 5.8 9.7a2.1 2.1 0 1 0 3 3l5-5a3.6 3.6 0 1 0-5.1-5.1l-5 5a5.1 5.1 0 0 0 7.2 7.2l4.6-4.6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ArchiveIcon({ className }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="2" y="3" width="12" height="3" rx="0.8" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M3 6v6.5a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M6.5 9h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

export function ReplyIcon({ className }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M6.3 4 2.3 8l4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.3 8h6.4a4 4 0 0 1 4 4v1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ForwardIcon({ className }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M9.7 4 13.7 8l-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.7 8H7.3a4 4 0 0 0-4 4v1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function FolderIcon({ className }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M3 11l2-7h10l2 7v5H3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M3 11h4l1 2h4l1-2h4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

/** Document with a pencil overlay — drafts. */
export function DraftIcon({ className }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M11 3H5.5a1 1 0 00-1 1v12a1 1 0 001 1h9a1 1 0 001-1V8.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M11 3v5h5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path
        d="M12.4 11.8l2.1 2.1-3.3 3.3h-2.1v-2.1z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg width="12" height="12" viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="none" className={className}>
      <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12.5 12.5l4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg width="11" height="11" viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

/** Rectangle split by a vertical line — "collapse/show this pane" (the
 * reader toolbar's "Скрыть список писем" toggle). */
export function PanelSplitIcon({ className }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className={className}>
      <rect x="2.5" y="3.5" width="15" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 3.5v13" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function MoreIcon({ className }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <circle cx="4.5" cy="10" r="1.4" />
      <circle cx="10" cy="10" r="1.4" />
      <circle cx="15.5" cy="10" r="1.4" />
    </svg>
  )
}

export function MailUnreadIcon({ className }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="2" y="3.5" width="12" height="9" rx="1.3" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2.5 4.2 8 8.3l5.5-4.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12.5" cy="3.5" r="2.6" fill="#48adec" stroke="#0c0c0c" strokeWidth="0.8" />
    </svg>
  )
}
