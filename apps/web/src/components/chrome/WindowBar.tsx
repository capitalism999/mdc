import { useState } from 'react'
import { isEnvBrowser } from '../../env'
import { fetchNui } from '../../nui/fetchNui'
import { useNuiEvent } from '../../nui/useNuiEvent'
import { useWindowManager } from '../../windows/WindowManagerContext'
import { toggleFullscreen, useFullscreen } from './fullscreen'

type Hidden = 'minimized' | 'closed' | null

/**
 * The outer OS-style title bar: app title + minimize/maximize/close glyphs
 * rendered with the Segoe Fluent Icons font (Windows-only, which is fine
 * since FiveM only runs on Windows). In FiveM «Свернуть» / «Закрыть» ask the
 * client script to hide the terminal (`minimize` / `close` NUI callbacks);
 * in a plain browser they show a lock-screen-like cover instead, from which
 * the terminal is brought back. «Развернуть» toggles browser fullscreen.
 */
export function WindowBar() {
  const { closeAll } = useWindowManager()
  const full = useFullscreen()
  const [hidden, setHidden] = useState<Hidden>(null)

  // the client script shows the terminal again
  useNuiEvent<unknown>('open', () => setHidden(null))

  function minimize() {
    if (isEnvBrowser()) setHidden('minimized')
    else void fetchNui('minimize')
  }

  async function close() {
    // a window that wants to save / ask first can keep the terminal open
    if (!(await closeAll())) return
    if (isEnvBrowser()) setHidden('closed')
    else void fetchNui('close')
  }

  return (
    <>
      <div className="flex h-[30px] w-full items-center justify-between bg-bg-chrome-2" onDoubleClick={toggleFullscreen}>
        <div className="flex items-center gap-1.5 px-3">
          <img src="/assets/icons/window-logo.svg" alt="" className="h-4 w-4" />
          <span className="text-xs font-semibold text-ink">SALETS MDT 1.0</span>
        </div>
        <div className="flex h-full items-stretch" onDoubleClick={(e) => e.stopPropagation()}>
          <button type="button" aria-label="Свернуть" title="Свернуть MDT" onClick={minimize} className="icon-font flex h-full w-[46px] items-center justify-center text-xs text-ink hover:bg-ink/10">
            {''}
          </button>
          <button
            type="button"
            aria-label={full ? 'Выйти из полноэкранного режима' : 'Развернуть'}
            title={full ? 'Выйти из полноэкранного режима' : 'Во весь экран'}
            onClick={toggleFullscreen}
            className="icon-font flex h-full w-[46px] items-center justify-center text-xs text-ink hover:bg-ink/10"
          >
            {full ? '' : ''}
          </button>
          <button type="button" aria-label="Закрыть окно" title="Закрыть MDT" onClick={() => void close()} className="icon-font flex h-full w-[46px] items-center justify-center rounded-tr-md text-xs text-ink hover:bg-red-600">
            {''}
          </button>
        </div>
      </div>

      {hidden && (
        <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center gap-5 bg-bg-app text-center">
          <img src="/assets/icons/window-logo.svg" alt="" className="h-14 w-14 opacity-80" />
          <div className="flex flex-col gap-1">
            <span className="text-[20px] font-semibold text-ink">{hidden === 'minimized' ? 'SALETS MDT свёрнут' : 'SALETS MDT закрыт'}</span>
            <span className="text-[13px] text-ink/55">
              {hidden === 'minimized' ? 'Окна и несохранённые данные на месте.' : 'Все окна закрыты. Терминал можно открыть снова.'}
            </span>
          </div>
          <button
            type="button"
            autoFocus
            onClick={() => setHidden(null)}
            className="h-9 rounded-[4px] bg-[#48adec] px-5 text-[14px] font-semibold text-black hover:brightness-110"
          >
            {hidden === 'minimized' ? 'Развернуть MDT' : 'Открыть MDT'}
          </button>
        </div>
      )}
    </>
  )
}
