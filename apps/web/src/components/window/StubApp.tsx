import { allAppTiles } from '../../data/apps'
import { useWindowManager } from '../../windows/WindowManagerContext'
import type { ModuleContentProps } from '../modules/registry'

/**
 * Placeholder content for every module not yet rebuilt for the new design —
 * rendered by `AppWindow` in place of the module's real (pre-redesign)
 * component whenever its `AppTile.stub` flag is set, so switching a module
 * back on later is just removing that flag, not restoring deleted code.
 * Names the module (its icon + title) so a window opened from a cross-link
 * or the start menu still says what it is.
 */
export function StubApp({ windowId }: ModuleContentProps) {
  const { windows, closeWindow } = useWindowManager()
  const win = windows.find((w) => w.id === windowId)
  const app = allAppTiles.find((a) => a.id === win?.appId)
  const label = app?.label ?? win?.title ?? 'Модуль'

  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 px-6 text-center">
      <span className="relative flex h-20 w-20 items-center justify-center rounded-[18px] bg-ink/5">
        {app && <img src={app.icon} alt="" className="h-11 w-11 opacity-70 grayscale" />}
        <span className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-bg-chrome-2 text-ink/70 shadow-[0_0_0_3px_var(--color-bg-app)]">
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12.5 3.5a3.5 3.5 0 00-4.6 4.6L3 13v3h3l4.9-4.9a3.5 3.5 0 004.6-4.6l-2.3 2.3-2-2z" />
          </svg>
        </span>
      </span>
      <div className="flex max-w-[360px] flex-col gap-1.5">
        <div className="text-[20px] font-semibold text-ink">«{label}» в разработке</div>
        <div className="text-[14px] leading-[20px] text-ink/55">
          Этот раздел MDT ещё готовится. Как только он будет готов, он откроется здесь — о запуске сообщим в патчноуте.
        </div>
      </div>
      <button
        type="button"
        onClick={() => closeWindow(windowId)}
        className="h-8 rounded-[4px] bg-ink/10 px-4 text-[13px] font-medium text-ink hover:bg-ink/15"
      >
        Закрыть окно
      </button>
    </div>
  )
}
