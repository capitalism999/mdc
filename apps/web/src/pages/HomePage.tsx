import { ChangelogButton } from '../components/chrome/ChangelogButton'
import { FullscreenHintToast } from '../components/chrome/FullscreenHintToast'
import { HeaderNav } from '../components/chrome/HeaderNav'
import { SessionEndedScreen } from '../components/chrome/SessionEndedScreen'
import { TaskBar } from '../components/chrome/TaskBar'
import { UserProfile } from '../components/chrome/UserProfile'
import { WindowBar } from '../components/chrome/WindowBar'
import { DesktopSurface } from '../components/desktop/DesktopSurface'
import { WindowManagerProvider } from '../windows/WindowManagerContext'

/**
 * Reproduces the Figma "Full HD Main" frame (node 8056:210): window bar,
 * header (nav + user profile), desktop background with the app grid, and
 * the task bar. There is no fixed-size scaled canvas here — the chrome bars
 * (`WindowBar`, header, `TaskBar`) keep their designed pixel height and
 * span the full width, while `DesktopSurface` fills whatever space is left
 * (`flex-1`). That means the UI always fills the entire screen, at any
 * resolution or aspect ratio (4:3, 16:9, ultrawide, ...), with no scaling
 * and no letterbox bars. `WindowManagerProvider` tracks any module windows
 * opened from the desktop (icon grid, task bar) — see
 * `DesktopSurface`/`AppWindow`.
 */
export function HomePage() {
  return (
    <WindowManagerProvider>
        <div className="relative flex h-screen w-screen flex-col overflow-clip bg-bg-app">
          <WindowBar />
          <div className="relative flex h-[66px] w-full items-center justify-between bg-bg-chrome px-3">
            <HeaderNav />
            <div className="flex items-center gap-1">
              <ChangelogButton />
              <UserProfile />
            </div>
          </div>
          <div className="relative min-h-0 flex-1 overflow-clip bg-bg-app">
            <DesktopSurface />
          </div>
          <TaskBar />
          <FullscreenHintToast />
          <SessionEndedScreen />
        </div>
    </WindowManagerProvider>
  )
}
