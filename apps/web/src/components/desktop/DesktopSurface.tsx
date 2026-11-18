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
    <div ref={desktopRef} className="relative h-full w-full overflow-hidden bg-bg-app">
      <DesktopBackground />
      <AppIconGrid />
      <PersonalizationTile />
      {windows.map((win) => (
        <AppWindow key={win.id} win={win} />
      ))}
    </div>
  )
}
