import type { AppTile } from '../types'

/**
 * Source of truth for the module tiles on the desktop grid — each opens
 * its own OS-style window (see `windows/WindowManagerContext`). Positions in
 * the Figma design follow a two-column layout (x=12 and x=132), which
 * `AppIconGrid` reproduces by laying these out in order. Ready modules come
 * first; stubs (still in development) after them.
 */
export const apps: AppTile[] = [
  { id: 'search', label: 'Поиск', icon: '/assets/apps/search.svg', chrome: 'bare', defaultSize: { width: 1440, height: 900 } },
  { id: 'mail', label: 'Почта', icon: '/assets/apps/mail.png', chrome: 'bare', defaultSize: { width: 1440, height: 900 } },
  { id: 'bolo', label: 'BOLO', icon: '/assets/apps/bolo.png', chrome: 'bare', defaultSize: { width: 1440, height: 900 } },
  { id: 'notes', label: 'Заметки', icon: '/assets/apps/notes.png', chrome: 'bare', defaultSize: { width: 1440, height: 900 } },
  { id: 'cases', label: 'Дела', icon: '/assets/apps/cases.png', chrome: 'bare', defaultSize: { width: 1440, height: 900 } },
  { id: 'reports', label: 'Отчёты', icon: '/assets/apps/reports.png', chrome: 'bare', defaultSize: { width: 1440, height: 900 } },
  { id: 'calls', label: 'Вызовы', icon: '/assets/apps/calls.png', stub: true },
  { id: 'arrests', label: 'Аресты', icon: '/assets/apps/arrests.png', stub: true },
  { id: 'forensics', label: 'Экспертизы', icon: '/assets/apps/forensics.png', stub: true },
  { id: 'warrants', label: 'Ордера', icon: '/assets/apps/warrants.png', stub: true },
  { id: 'laws', label: 'Законы', icon: '/assets/apps/laws.png', stub: true },
  { id: 'admin', label: 'Админ', icon: '/assets/apps/admin.png', stub: true },
  { id: 'sanggang', label: 'SangGang', icon: '/assets/apps/sanggang.svg', stub: true },
  { id: 'ftp', label: 'FTP', icon: '/assets/apps/ftp.svg', stub: true },
]

/**
 * "Персонализация" (appearance/theme customization) is intentionally not
 * part of the regular two-column grid above — it's pinned to the
 * bottom-right corner of the desktop (see `PersonalizationTile`), reading
 * as a standalone "customize this desktop" shortcut rather than another
 * module tile.
 */
export const personalizationApp: AppTile = {
  id: 'personalization',
  label: 'Персонализация',
  icon: '/assets/apps/personalization.svg',
  // closed for now: the only setting it had (light theme) is gone
  stub: true,
}

/**
 * Почта's compose window — opened from inside the Mail module (via
 * `useWindowManager().openWindow`), not from the desktop grid, matching the
 * reference design where "Новое письмо" is its own floating panel rather
 * than a pane swapped into the Mail window. The label includes "— Почта" so
 * `AppWindow`'s generic `{title} · MDC Los Santos` title-bar template reads
 * "Новое письмо — Почта · MDC Los Santos", exactly as in the reference.
 */
export const mailComposeApp: AppTile = {
  id: 'mail-compose',
  label: 'Новое письмо — Почта',
  icon: '/assets/apps/mail.png',
  chrome: 'bare',
  defaultSize: { width: 960, height: 760 },
}

/**
 * Every app tile `AppWindow` needs chrome/size metadata for — the visible
 * desktop grid (`apps`) plus windows only ever opened from inside another
 * module (`mailComposeApp` and friends), which must stay out of `apps` so
 * `AppIconGrid` never turns them into desktop tiles.
 */
export const allAppTiles: AppTile[] = [...apps, personalizationApp, mailComposeApp]
