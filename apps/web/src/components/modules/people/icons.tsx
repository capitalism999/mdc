interface IconProps {
  className?: string
}

export function NameIcon({ className }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="8" cy="5.2" r="2.4" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2.8 13.2c.6-2.8 2.7-4.2 5.2-4.2s4.6 1.4 5.2 4.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

export function PhoneIcon({ className }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className={className}>
      <path
        d="M3.5 2.5h2l1 3-1.5 1.2a8 8 0 0 0 4.3 4.3l1.2-1.5 3 1v2a1 1 0 0 1-1 1C7.6 13.5 2.5 8.4 2.5 3.5a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function WeaponIcon({ className }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className={className}>
      <path
        d="M2 9.5h6.5V7H13a1 1 0 0 1 1 1v1.5h-1.5V11H9v-1.5H5.5V11H2V9.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M4 9.5V12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export function DocumentIcon({ className }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="3" y="1.8" width="10" height="12.4" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5.2 5h5.6M5.2 7.5h5.6M5.2 10h3.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  )
}

export function VehicleIcon({ className }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className={className}>
      <path
        d="M2.5 9.5 3.6 5.8a1.4 1.4 0 0 1 1.34-1h6.12a1.4 1.4 0 0 1 1.34 1l1.1 3.7"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <rect x="1.8" y="9.5" width="12.4" height="3.2" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="4.5" cy="12.7" r="0.9" fill="currentColor" />
      <circle cx="11.5" cy="12.7" r="0.9" fill="currentColor" />
    </svg>
  )
}

export function BusinessIcon({ className }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="2" y="6.5" width="12" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5.5 6.5V4a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 10.5 4v2.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2 9.8h12" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  )
}

export function BiometricIcon({ className }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className={className}>
      <path
        d="M8 2.2a5.3 5.3 0 0 0-5.3 5.3v1.2M8 2.2a5.3 5.3 0 0 1 5.3 5.3v1.2M5.3 13.5c-.8-1-1.3-2.4-1.3-4v-.7a4 4 0 0 1 8 0v.7c0 .5-.03 1-.1 1.4M8 6.2a2.3 2.3 0 0 0-2.3 2.3v.5c0 2 .7 3.6 1.6 4.6M8 6.2a2.3 2.3 0 0 1 2.3 2.3v.5c0 .9-.1 1.7-.3 2.4"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M10.3 10.3 14 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

export function ChevronIcon({ className }: IconProps) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function BackIcon({ className }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function WantedIcon({ className }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <path
        d="M8 1.5 9.5 5l3.5.3-2.7 2.4.8 3.5L8 9.4l-3.1 1.8.8-3.5L3 5.3 6.5 5 8 1.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ClockIcon({ className }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="8" cy="8" r="5.8" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 4.8V8l2.4 1.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function NoteAddIcon({ className }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M8 3.5v7M4.5 7h7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

export function ArrestIcon({ className }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="3" y="2" width="10" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 7.5v2.3a3 3 0 0 0 6 0V7.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5.5 12.5h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export function WarrantIcon({ className }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M8 1.8 13 4v4c0 3.5-2.2 5.6-5 6.2-2.8-.6-5-2.7-5-6.2V4L8 1.8Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M6 8l1.4 1.4L10.3 6.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function FineIcon({ className }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="1.8" y="4" width="12.4" height="8" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="8" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.1" />
      <path d="M3.5 4v8M12.5 4v8" stroke="currentColor" strokeWidth="1.1" strokeDasharray="1.4 1.4" />
    </svg>
  )
}

export function AssociateIcon({ className }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="5.3" cy="5.3" r="2" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="10.7" cy="5.3" r="2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1.8 12.8c.5-1.9 1.8-3 3.5-3s3 1.1 3.5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M7.2 12.8c.5-1.9 1.8-3 3.5-3s3 1.1 3.5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export function BankIcon({ className }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M8 1.8 14 5H2L8 1.8Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M2.8 5v7.2M6 5v7.2M10 5v7.2M13.2 5v7.2" stroke="currentColor" strokeWidth="1.1" />
      <path d="M1.8 12.2h12.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

export function PropertyIcon({ className }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M2.3 7.2 8 2.5l5.7 4.7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.5 6.5v6.8h9V6.5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M6.5 13.3V9.5h3v3.8" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  )
}

export function IncidentIcon({ className }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M8 1.5 1.5 13h13L8 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M8 6v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="8" cy="10.8" r="0.9" fill="currentColor" />
    </svg>
  )
}
