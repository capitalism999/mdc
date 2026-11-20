import type { CSSProperties } from 'react'

interface IconProps {
  className?: string
}

/** Generic outline icon — renders one `d` path from `ICN`/`PHI` below with
 * the project's usual stroke conventions. Used wherever the reference keys
 * an icon dynamically by a string (nav item, link kind, photo slot). */
export function PathIcon({ d, className, style }: { d: string; className?: string; style?: CSSProperties }) {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      <path d={d} />
    </svg>
  )
}

export function PlusIcon({ className, style }: IconProps & { style?: CSSProperties }) {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className={className} style={style} aria-hidden="true">
      <path d="M10 4v12M4 10h12" />
    </svg>
  )
}

/** Sidebar/nav/link icon paths — ported verbatim from the reference's `ICN`
 * table (same `d` data, so shapes match exactly). */
export const ICN: Record<string, string> = {
  home: 'M3 9.5L10 3.5l7 6M5 8v8.5h10V8M8.5 16.5v-4h3v4',
  person: 'M10 9a3.2 3.2 0 100-6.4A3.2 3.2 0 0010 9zM3.5 17.5c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6',
  car: 'M3 13v-3l2-4h10l2 4v3zM3 13v2h2v-2M15 13v2h2v-2M6 10.5h.5M13.5 10.5h.5',
  doc: 'M5 2.5h7l3 3v12H5zM8 9h4M8 12h4M8 15h2',
  case: 'M2.5 6h15v10.5h-15zM7 6V4h6v2M2.5 10h15',
  bolo: 'M10 3.5a6.5 6.5 0 100 13 6.5 6.5 0 100-13zM10 8a2 2 0 100 4 2 2 0 100-4z',
  org: 'M3 17h14M5 17V8l5-4 5 4v9M8 17v-4h4v4',
  call: 'M5 3h3l1.5 4-2 1.2a9 9 0 004.3 4.3L13 10.5l4 1.5v3a2 2 0 01-2 2A12.5 12.5 0 013 5a2 2 0 012-2z',
  list: 'M7 5h10M7 10h10M7 15h10M3 5h.01M3 10h.01M3 15h.01',
  flame: 'M10 17.5c3 0 5-2 5-5 0-3.5-3-5-3-9-2 1-4.5 3.5-4 6.5-1-.5-1.5-1.5-1.5-2.5C5 9 5 10.5 5 12.5c0 3 2 5 5 5z',
  help: 'M10 17.5a7.5 7.5 0 100-15 7.5 7.5 0 000 15zM7.8 7.8a2.3 2.3 0 114.4 1c-.5.9-2.2 1.3-2.2 2.7M10 14h.01',
  me: 'M10 9a3.2 3.2 0 100-6.4A3.2 3.2 0 0010 9zM3.5 17.5c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M14 4l1.5 1.5L18 3',
  pin: 'M10 17.5s-5.5-5-5.5-9a5.5 5.5 0 0111 0c0 4-5.5 9-5.5 9zM10 6.5a2 2 0 100 4 2 2 0 100-4z',
  map: 'M2.5 5l5-2 5 2 5-2v12l-5 2-5-2-5 2zM7.5 3v12M12.5 5v12',
  check: 'M4 10.5l3.5 3.5L16 5.5',
  clock: 'M10 17.5a7.5 7.5 0 100-15 7.5 7.5 0 000 15zM10 6v4l2.5 1.5',
  plus: 'M10 4v12M4 10h12',
  menu: 'M4.5 10h.01M10 10h.01M15.5 10h.01',
  warn: 'M10 3l8 14H2z M10 8.5v3.5M10 14.5h.01',
}

/** Placeholder-photo icon paths — the reference's `PHI` table. */
export const PHI: Record<string, string> = {
  mug: 'M10 9a3.2 3.2 0 100-6.4A3.2 3.2 0 0010 9zM3.5 17.5c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6',
  cam: 'M3 6.5h3l1.5-2h5l1.5 2h3v10H3zM10 8a3 3 0 100 6 3 3 0 100-6z',
  car: 'M3 13v-3l2-4h10l2 4v3zM3 13v2h2v-2M15 13v2h2v-2',
  tattoo: 'M10 3c3 3 4 6 1 9s-2 5 0 5M7 7c-2 2-2 4 0 6',
  obj: 'M4 7h12v9H4zM7 7V5h6v2',
}

/** Placeholder-photo gradient pairs — the reference's `PHB` table. */
export const PHB: Record<string, [string, string]> = {
  mug: ['#4A505A', '#2F343C'],
  cam: ['#3B4B5E', '#232E3B'],
  car: ['#4A4F45', '#2C3029'],
  tattoo: ['#5A4A50', '#352C30'],
  obj: ['#50493E', '#302B24'],
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={className} aria-hidden="true">
      <path d="M4 4l12 12M16 4L4 16" />
    </svg>
  )
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className={className} aria-hidden="true">
      <circle cx="8.5" cy="8.5" r="5.5" />
      <path d="M12.5 12.5l4.5 4.5" />
    </svg>
  )
}

export function SirenIcon({ className }: IconProps) {
  return (
    <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="10" cy="10" r="6.5" />
      <circle cx="10" cy="10" r="2" />
      <path d="M10 1.5v3M10 15.5v3M1.5 10h3M15.5 10h3" />
    </svg>
  )
}

export function PanelSplitIcon({ className }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <rect x="2.5" y="3.5" width="15" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 3.5v13" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function MoreIcon({ className }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
      <circle cx="4.5" cy="10" r="1.4" />
      <circle cx="10" cy="10" r="1.4" />
      <circle cx="15.5" cy="10" r="1.4" />
    </svg>
  )
}

export function PrintIcon({ className }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" className={className} aria-hidden="true">
      <path d="M5.5 7.5V3h9v4.5" />
      <rect x="2.5" y="7.5" width="15" height="7" rx="1.5" />
      <path d="M5.5 12h9v5h-9z" />
    </svg>
  )
}

export function BinocularsIcon({ className }: IconProps) {
  return (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={className} aria-hidden="true">
      <path d="M1.5 10S4.5 4.5 10 4.5 18.5 10 18.5 10 15.5 15.5 10 15.5 1.5 10 1.5 10z" />
      <circle cx="10" cy="10" r="2.5" />
    </svg>
  )
}

export function PlacePinIcon({ className }: IconProps) {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M10 17.5s-5.5-5-5.5-9a5.5 5.5 0 0111 0c0 4-5.5 9-5.5 9z" />
      <circle cx="10" cy="8.5" r="2" />
    </svg>
  )
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4 10.5l3.5 3.5L16 5.5" />
    </svg>
  )
}

export function ShieldWarnIcon({ className, style }: IconProps & { style?: CSSProperties }) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} aria-hidden="true">
      <path d="M10 3l8 14H2z" />
      <path d="M10 8.5v3.5M10 14.5h.01" />
    </svg>
  )
}
