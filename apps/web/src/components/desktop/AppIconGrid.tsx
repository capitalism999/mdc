import { apps } from '../../data/apps'
import { useWindowManager } from '../../windows/WindowManagerContext'
import { AppIconTile } from './AppIconTile'

const TILE_HEIGHT = 105
const GRID_PADDING = 12
const MAX_ROWS = 7

/**
 * Lays out the module tiles from `data/apps.ts` in a real CSS grid, filling
 * column-by-column — up to 7 apps per column, matching the Figma two-column
 * layout. The row count follows the measured desktop height, so on a short
 * screen (1366x768, 1280x720) a column wraps into the next one instead of
 * letting icons run off the bottom edge, where they'd be unreachable (the
 * desktop surface clips with `overflow-hidden` for window layering, so
 * there's no scrolling here).
 */
export function AppIconGrid() {
  const { desktopSize } = useWindowManager()
  const rows = Math.max(1, Math.min(MAX_ROWS, Math.floor((desktopSize.height - GRID_PADDING * 2) / TILE_HEIGHT)))

  return (
    <div
      className="relative grid w-max grid-flow-col auto-cols-[120px] gap-0 p-3"
      style={{ gridTemplateRows: `repeat(${rows}, ${TILE_HEIGHT}px)` }}
    >
      {apps.map((app) => (
        <AppIconTile key={app.id} app={app} />
      ))}
    </div>
  )
}
