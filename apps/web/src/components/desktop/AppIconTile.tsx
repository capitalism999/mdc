import type { AppTile } from '../../types'
import { useWindowManager } from '../../windows/WindowManagerContext'
import { useAppBadge } from '../../windows/appBadges'

interface AppIconTileProps {
  app: AppTile
}

/**
 * A single 120x105 desktop shortcut tile: icon + label, placed as a normal
 * grid item by `AppIconGrid` (no absolute positioning). Clicking it opens
 * (or refocuses) the module's OS-style window.
 */
export function AppIconTile({ app }: AppIconTileProps) {
  const { openWindow } = useWindowManager()
  const badge = useAppBadge(app.id)

  return (
    <button
      type="button"
      onClick={() => openWindow(app)}
      title={app.stub ? `${app.label} — в разработке` : badge ? `${app.label} — новых: ${badge}` : undefined}
      className="flex h-[105px] w-[120px] flex-col items-center gap-2 overflow-clip rounded-[5.003px] pt-5 hover:bg-ink/5"
    >
      <span className="relative h-10 w-10">
        <img src={app.icon} alt="" className={`h-10 w-10 ${app.stub ? 'opacity-60 grayscale' : ''}`} />
        {!app.stub && badge > 0 && (
          // red notification counter, like the Windows 11 / mobile app badge
          <span aria-hidden="true" className="absolute -right-2.5 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#E5484D] px-1.5 text-[11px] font-bold leading-none text-white shadow-[0_0_0_2px_#0B0F1A,0_2px_6px_rgba(0,0,0,0.4)]">
            {badge > 99 ? '99+' : badge}
          </span>
        )}
        {app.stub && (
          <span className="absolute -bottom-1 -right-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-bg-chrome-2 text-ink/70">
            <svg width="10" height="10" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12.5 3.5a3.5 3.5 0 00-4.6 4.6L3 13v3h3l4.9-4.9a3.5 3.5 0 004.6-4.6l-2.3 2.3-2-2z" />
            </svg>
          </span>
        )}
      </span>
      <span className={`w-full break-words text-center text-base font-medium leading-tight ${app.stub ? 'text-ink/50' : 'text-ink'}`}>{app.label}</span>
    </button>
  )
}
