import { useWindowManager } from '../../windows/WindowManagerContext'
import { SystemTray } from './SystemTray'

/**
 * Bottom task bar: a pinned-apps tile group on the left (decorative, matches
 * the Windows-style chrome in the design), running module windows next to
 * it, and the system tray on the right.
 */
export function TaskBar() {
  const { windows, focusWindow, minimizeWindow } = useWindowManager()
  const topZIndex = windows.reduce((max, win) => Math.max(max, win.zIndex), 0)

  return (
    <div className="flex h-[40px] w-full items-center justify-between bg-bg-chrome/60 backdrop-blur-[30px]">
      <div className="flex h-full items-center gap-1 px-2">
        <button type="button" aria-label="Пуск" className="flex h-7 w-7 items-center justify-center rounded-[4px] hover:bg-ink/10">
          <div className="grid grid-cols-2 gap-px">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-2 w-2 rounded-[2px] bg-[#48adec]" />
            ))}
          </div>
        </button>
        <button type="button" aria-label="Поиск" className="flex h-7 w-7 items-center justify-center rounded-[4px] hover:bg-ink/10">
          <img src="/assets/icons/taskbar-search.svg" alt="" className="h-3.5 w-3.5" />
        </button>

        {windows.length > 0 && (
          <>
            <div className="h-5 w-px bg-ink/10" />
            <div className="flex h-full items-center gap-1">
              {windows.map((win) => {
                const isActive = !win.isMinimized && win.zIndex === topZIndex
                return (
                  <button
                    key={win.id}
                    type="button"
                    onClick={() => {
                      if (win.isMinimized || !isActive) {
                        focusWindow(win.id)
                      } else {
                        minimizeWindow(win.id)
                      }
                    }}
                    className="relative flex h-7 w-7 items-center justify-center rounded-[4px] hover:bg-ink/10"
                  >
                    <img src={win.icon} alt={win.title} className="h-4 w-4 object-cover" />
                    <span
                      className={`absolute bottom-0 h-[2px] rounded-full ${
                        isActive ? 'w-3.5 bg-[#48adec]' : 'w-1 bg-ink/40'
                      }`}
                    />
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>
      <SystemTray />
    </div>
  )
}
