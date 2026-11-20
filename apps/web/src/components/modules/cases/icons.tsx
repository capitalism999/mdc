interface IconProps {
  className?: string
}

export function CaseFolderIcon({ className, color = 'currentColor' }: IconProps & { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true" className={className}>
      <path d="M2 5.5A1.5 1.5 0 013.5 4h4l2 2h7A1.5 1.5 0 0118 7.5v8a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 012 15.5z" fill={color} />
      <path d="M2 8h16v7.5a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 012 15.5z" fill="#FFFFFF" fillOpacity="0.22" />
    </svg>
  )
}

export function RootIcon({ className }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true" className={className}>
      <rect x="3" y="3" width="6" height="6" rx="1.5" />
      <rect x="11" y="3" width="6" height="6" rx="1.5" />
      <rect x="3" y="11" width="6" height="6" rx="1.5" />
      <rect x="11" y="11" width="6" height="6" rx="1.5" />
    </svg>
  )
}

export function ChevronRightIcon({ className }: IconProps) {
  return (
    <svg width="10" height="10" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M8 5l5 5-5 5" />
    </svg>
  )
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M6 8l4 4 4-4" />
    </svg>
  )
}

export function BackArrowIcon({ className }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M12.5 4.5L7 10l5.5 5.5" />
    </svg>
  )
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true" className={className}>
      <circle cx="8.5" cy="8.5" r="5.5" />
      <path d="M12.5 12.5l4.5 4.5" />
    </svg>
  )
}

export function PlusIcon({ className }: IconProps) {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className={className}>
      <path d="M10 4v12M4 10h12" />
    </svg>
  )
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className={className}>
      <path d="M4 4l12 12M16 4L4 16" />
    </svg>
  )
}

export function PanelSplitIcon({ className }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true" className={className}>
      <rect x="2.5" y="3.5" width="15" height="13" rx="2" />
      <path d="M8 3.5v13" />
    </svg>
  )
}

export function InfoPaneIcon({ className }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true" className={className}>
      <rect x="2.5" y="3.5" width="15" height="13" rx="2" />
      <path d="M12 3.5v13" />
    </svg>
  )
}

export function LockIcon({ className }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true" className={className}>
      <rect x="4.5" y="9" width="11" height="8" rx="1.5" />
      <path d="M7 9V6.5a3 3 0 016 0V9" />
    </svg>
  )
}

export function PinIcon({ className }: IconProps) {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true" className={className}>
      <path d="M10 17.5s-5.5-5-5.5-9a5.5 5.5 0 0111 0c0 4-5.5 9-5.5 9z" />
      <path d="M10 6v5M7.5 8.5h5" />
    </svg>
  )
}

export function LinkIcon({ className }: IconProps) {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true" className={className}>
      <path d="M8.5 11.5a3 3 0 004.2 0l2.6-2.6a3 3 0 00-4.2-4.2l-1 1" />
      <path d="M11.5 8.5a3 3 0 00-4.2 0l-2.6 2.6a3 3 0 004.2 4.2l1-1" />
    </svg>
  )
}

export function ExportIcon({ className }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true" className={className}>
      <path d="M5.5 7.5V3h9v4.5" />
      <rect x="2.5" y="7.5" width="15" height="7" rx="1.5" />
      <path d="M5.5 12h9v5h-9z" />
    </svg>
  )
}

export function ZoomInIcon({ className }: IconProps) {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className={className}>
      <path d="M10 4v12M4 10h12" />
    </svg>
  )
}

export function ZoomOutIcon({ className }: IconProps) {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className={className}>
      <path d="M4 10h12" />
    </svg>
  )
}

export function PeopleIcon({ className }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true" className={className}>
      <circle cx="10" cy="7" r="3.2" />
      <path d="M3.5 17a6.5 6.5 0 0113 0" />
    </svg>
  )
}

export function GroupIcon({ className }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true" className={className}>
      <circle cx="7.5" cy="7" r="2.6" />
      <circle cx="13.5" cy="7.5" r="2.2" />
      <path d="M2.5 16a5 5 0 0110 0M12.5 12.2a4 4 0 015 3.8" />
    </svg>
  )
}

/** Entity-kind icon (18px, stroke-only) used in item rows and the
 * inspector — matches the reference's `KC`/`isEvidence`/`isMedia`/... set. */
export function KindIcon({ kind, className }: { kind: string; className?: string }) {
  const common = { width: 18, height: 18, viewBox: '0 0 20 20', fill: 'none', stroke: 'currentColor', 'aria-hidden': true, className } as const
  switch (kind) {
    case 'evidence':
      return (
        <svg {...common} strokeWidth="1.6" strokeLinejoin="round">
          <path d="M3 3h7l7 7-7 7-7-7z" />
          <circle cx="6.8" cy="6.8" r="1.2" />
        </svg>
      )
    case 'media':
      return (
        <svg {...common} strokeWidth="1.6" strokeLinejoin="round">
          <rect x="2.5" y="5" width="11" height="10" rx="2" />
          <path d="M13.5 9l4-2.5v7l-4-2.5" />
        </svg>
      )
    case 'exam':
      return (
        <svg {...common} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
          <path d="M7.5 2.5h5M8.5 2.5v5.5L4 15.6a1.3 1.3 0 001.1 1.9h9.8a1.3 1.3 0 001.1-1.9L11.5 8V2.5" />
          <path d="M6 12.5h8" />
        </svg>
      )
    case 'note':
      return (
        <svg {...common} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
          <path d="M4.5 3.5h11v9l-4 4h-7z" />
          <path d="M11.5 16.5v-4h4M7.5 7.5h5M7.5 10.5h3" />
        </svg>
      )
    case 'doc':
      return (
        <svg {...common} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
          <path d="M5 2.5h7l3 3v12H5z" />
          <path d="M12 2.5v3h3M7.5 10h5M7.5 13h5" />
        </svg>
      )
    case 'event':
      return (
        <svg {...common} strokeWidth="1.6" strokeLinecap="round">
          <circle cx="10" cy="10" r="7" />
          <path d="M10 6v4l2.5 1.5" />
        </svg>
      )
    case 'vehicle':
      return (
        <svg {...common} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
          <path d="M3 13.5V10l1.8-4.2A1.5 1.5 0 016.2 5h7.6a1.5 1.5 0 011.4.8L17 10v3.5" />
          <path d="M2.5 13.5h15v2h-15z" />
          <circle cx="6" cy="15.5" r="1.3" />
          <circle cx="14" cy="15.5" r="1.3" />
          <path d="M3.5 10h13" />
        </svg>
      )
    case 'place':
      return (
        <svg {...common} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
          <path d="M10 17.5s-5.5-5-5.5-9a5.5 5.5 0 0111 0c0 4-5.5 9-5.5 9z" />
          <circle cx="10" cy="8.5" r="2" />
        </svg>
      )
    case 'surv':
      return (
        <svg {...common} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
          <path d="M3 6.5h10l-1.5 5H4.5z" />
          <path d="M13 7.5l3.5-1.5v5L13 9.5" />
          <path d="M7 11.5v3M4.5 14.5h5" />
        </svg>
      )
    default:
      return null
  }
}
