interface IconProps {
  className?: string
}

export function FolderIcon({ className }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <path
        d="M2 4.2A1.2 1.2 0 0 1 3.2 3h3.1l1.1 1.4h5.4A1.2 1.2 0 0 1 14 5.6v6.2A1.2 1.2 0 0 1 12.8 13H3.2A1.2 1.2 0 0 1 2 11.8Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function FileIcon({ className }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M4 2h5l3 3v9H4Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M9 2v3h3" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  )
}

export function UploadIcon({ className }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M8 11V3.5M8 3.5 4.8 6.7M8 3.5l3.2 3.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.5 11.5v1a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}
