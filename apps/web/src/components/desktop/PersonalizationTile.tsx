import { personalizationApp } from '../../data/apps'
import { AppIconTile } from './AppIconTile'

/**
 * The "Персонализация" shortcut is pinned to the bottom-right corner of the
 * desktop, deliberately outside the regular two-column `AppIconGrid` — it
 * reads as a standalone "customize this desktop" shortcut (future home for
 * wallpaper/theme/appearance settings) rather than another module tile.
 */
export function PersonalizationTile() {
  return (
    <div className="absolute bottom-2 right-2">
      <AppIconTile app={personalizationApp} />
    </div>
  )
}
