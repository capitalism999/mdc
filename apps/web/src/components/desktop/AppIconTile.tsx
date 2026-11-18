import type { AppTile } from '../../types'
import { useWindowManager } from '../../windows/WindowManagerContext'

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

  return (
    <button
      type="button"
      onClick={() => openWindow(app)}
      title={app.stub ? `${app.label} — в разработке` : undefined}
      className="flex h-[105px] w-[120px] flex-col items-center gap-2 overflow-clip rounded-[5.003px] pt-5 hover:bg-ink/5"
    >
      <span className="relative h-10 w-10">
        <img src={app.icon} alt="" className={`h-10 w-10 ${app.stub ? 'opacity-60 grayscale' : ''}`} />
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
