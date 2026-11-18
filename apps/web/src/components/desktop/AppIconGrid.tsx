import { apps } from '../../data/apps'
import { AppIconTile } from './AppIconTile'

/**
 * Lays out the module tiles from `data/apps.ts` in a real CSS grid, filling
 * column-by-column — the first 7 apps in column 1, the next 7 in column 2,
 * and so on — matching the Figma two-column layout. 7 rows (not 8) is a
 * conservative cap that comfortably fits the desktop's vertical space; once
 * a column fills up, `grid-auto-flow: column` automatically starts a new
 * one (via `auto-cols`) instead of letting icons run off the bottom edge
 * where they'd be unreachable (the desktop surface clips with
 * `overflow-hidden` for window layering, so there's no scrolling here).
 */
export function AppIconGrid() {
  return (
    <div className="relative grid grid-flow-col grid-cols-[120px_120px] auto-cols-[120px] grid-rows-[repeat(7,105px)] gap-0 p-3">
      {apps.map((app) => (
        <AppIconTile key={app.id} app={app} />
      ))}
    </div>
  )
}
