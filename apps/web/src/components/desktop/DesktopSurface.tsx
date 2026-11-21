import { AppWindow } from '../window/AppWindow'
import { useWindowManager } from '../../windows/WindowManagerContext'
import { AppIconGrid } from './AppIconGrid'
import { DesktopBackground } from './DesktopBackground'
import { PersonalizationTile } from './PersonalizationTile'

/**
 * The desktop content area (below header, above task bar): wallpaper + app
 * shortcut grid, with any open module windows layered on top.
 */
export function DesktopSurface() {
  const { windows, desktopRef } = useWindowManager()

  return (
    // `isolate`: window z-indexes grow with every focus — keep them in the
    // desktop's own stacking context so they never cover the header menus
    // (Патчноут, account switcher, СОЗДАТЬ) or the task bar's start menu.
    <div ref={desktopRef} className="relative isolate h-full w-full overflow-clip bg-bg-app">
      <DesktopBackground />
      <AppIconGrid />
      <PersonalizationTile />
      {windows.map((win) => (
        <AppWindow key={win.id} win={win} />
      ))}
    </div>
  )
}
