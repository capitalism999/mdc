interface IconProps {
  className?: string
}

/** Small icon set for entity types that don't already have an icon in
 * `people/icons.tsx` (case, report, evidence, forensics, officer, gang,
 * penal code, dispatch call). Person/vehicle/weapon/warrant/BOLO/arrest
 * reuse the existing icons from `people/icons.tsx` via `EntityChip`. */

export function CaseIcon({ className }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="1.5" y="4.5" width="13" height="8.5" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5.5 4.5V3.3a1.3 1.3 0 0 1 1.3-1.3h2.4a1.3 1.3 0 0 1 1.3 1.3v1.2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1.5 7.8h13" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  )
}

export function ReportIcon({ className }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="3" y="1.8" width="10" height="12.4" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5.2 5h5.6M5.2 7.5h5.6M5.2 10h3.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M10.5 1.8v3.2h2.5" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

export function EvidenceIcon({ className }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M9.2 2 2.5 8.7l4.8 4.8L14 6.8V2H9.2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="11.2" cy="4.8" r="0.9" fill="currentColor" />
    </svg>
  )
}

export function ForensicsIcon({ className }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M6.3 1.8h3.4M7 1.8v4.6L3.5 12a1.6 1.6 0 0 0 1.4 2.4h6.2A1.6 1.6 0 0 0 12.5 12L9 6.4V1.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10.5h6" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  )
}

export function OfficerIcon({ className }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M8 1.5 13 4v4c0 3.5-2.2 5.6-5 6.2-2.8-.6-5-2.7-5-6.2V4L8 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="8" cy="6.5" r="1.4" stroke="currentColor" strokeWidth="1" />
      <path d="M5.6 10c.5-1.2 1.4-1.8 2.4-1.8s1.9.6 2.4 1.8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}

export function GangIcon({ className }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="5.3" cy="5.3" r="2" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="10.7" cy="5.3" r="2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1.8 12.8c.5-1.9 1.8-3 3.5-3s3 1.1 3.5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M7.2 12.8c.5-1.9 1.8-3 3.5-3s3 1.1 3.5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export function PenalCodeIcon({ className }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M3 3.5 7 2l1 3-4 1.5L3 3.5Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M9 2l4 1.5-1 3-4-1.5 1-3Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M8 2v11.5M5 13.5h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M2.3 6.5 4 3.5l1.7 3a1.9 1.9 0 0 1-3.4 0ZM10.3 6.5 12 3.5l1.7 3a1.9 1.9 0 0 1-3.4 0Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
    </svg>
  )
}

export function DispatchIcon({ className }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M3.5 2.5h2l1 3-1.5 1.2a8 8 0 0 0 4.3 4.3l1.2-1.5 3 1v2a1 1 0 0 1-1 1C7.6 13.5 2.5 8.4 2.5 3.5a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M9.5 2.3a4.3 4.3 0 0 1 3.2 4.1" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M9.8 4.3a2.3 2.3 0 0 1 1.7 2.2" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
    </svg>
  )
}

export function LinkIcon({ className }: IconProps) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M6.5 9.5 9.5 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M7.3 4.8 8.6 3.5a2.2 2.2 0 1 1 3.1 3.1l-1.3 1.3M8.7 11.2 7.4 12.5a2.2 2.2 0 1 1-3.1-3.1l1.3-1.3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}
