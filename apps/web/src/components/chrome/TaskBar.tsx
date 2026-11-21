import { useEffect, useRef, useState } from 'react'
import { apps } from '../../data/apps'
import { useAppBadge } from '../../windows/appBadges'
import { endSession } from '../../lib/session'
import { useShellActions } from '../../windows/shellActions'
import type { WindowInstance } from '../../windows/types'
import { activeWindow, useWindowManager } from '../../windows/WindowManagerContext'
import { SystemTray } from './SystemTray'

/** A running window on the task bar; the app's main window also carries its red counter. */
function TaskbarItem({ win, isActive, onClick }: { win: WindowInstance; isActive: boolean; onClick: () => void }) {
  const badge = useAppBadge(win.appId)
  const shown = win.instanceKey === win.appId ? badge : 0
  const crumb = win.breadcrumb[win.breadcrumb.length - 1]
  const base = crumb && crumb !== win.title ? `${win.title} — ${crumb}` : win.title
  const label = shown > 0 ? `${base} · новых: ${shown}` : base
  return (
    <button
      type="button"
      title={win.isMinimized ? `${label} (свёрнуто)` : label}
      aria-label={label}
      aria-pressed={isActive}
      onClick={onClick}
      className={`relative flex h-7 w-7 shrink-0 items-center justify-center rounded-[4px] hover:bg-ink/10 ${isActive ? 'bg-ink/[0.07]' : ''}`}
    >
      <img src={win.icon} alt="" className="h-4 w-4 object-cover" />
      {shown > 0 && (
        <span aria-hidden="true" className="absolute -right-0.5 -top-0.5 flex h-[14px] min-w-[14px] items-center justify-center rounded-full bg-[#E5484D] px-[3px] text-[9px] font-bold leading-none text-white">
          {shown > 99 ? '99+' : shown}
        </span>
      )}
      <span className={`absolute bottom-0 h-[2px] rounded-full ${isActive ? 'w-3.5 bg-[#48adec]' : 'w-1 bg-ink/40'}`} />
    </button>
  )
}

/** Start menu: every desktop module as a pinned tile, plus «show desktop». */
function StartMenu({ onClose }: { onClose: () => void }) {
  const { openApp } = useShellActions()
  const { minimizeAll, closeAll } = useWindowManager()
  const [confirmEnd, setConfirmEnd] = useState(false)
  /** «Завершить сессию»: windows close (each may save / ask), then every account is signed out */
  async function end() {
    if (!(await closeAll())) return setConfirmEnd(false)
    onClose()
    endSession()
  }
  const ready = apps.filter((a) => !a.stub)
  const soon = apps.filter((a) => a.stub)

  const tile = (app: (typeof apps)[number]) => (
    <button
      key={app.id}
      type="button"
      onClick={() => {
        onClose()
        openApp(app.id)
      }}
      title={app.stub ? `${app.label} — в разработке` : app.label}
      className="flex flex-col items-center gap-1.5 rounded-[6px] px-1 py-2.5 hover:bg-white/[0.08]"
    >
      <img src={app.icon} alt="" className={`h-8 w-8 object-contain ${app.stub ? 'opacity-60 grayscale' : ''}`} />
      <span className={`w-full truncate text-center text-[12px] ${app.stub ? 'text-ink/50' : 'text-ink'}`}>{app.label}</span>
    </button>
  )

  return (
    <div role="dialog" aria-label="Пуск" className="absolute bottom-full left-2 z-50 mb-2 w-[420px] rounded-[8px] border border-white/[0.08] bg-[#202020] p-3 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
      <div className="px-1 pb-1.5 text-[12px] font-semibold text-ink/60">Приложения</div>
      <div className="grid grid-cols-5 gap-0.5">{ready.map(tile)}</div>
      {soon.length > 0 && (
        <>
          <div className="px-1 pb-1.5 pt-3 text-[12px] font-semibold text-ink/60">В разработке</div>
          <div className="grid grid-cols-5 gap-0.5">{soon.map(tile)}</div>
        </>
      )}
      {confirmEnd ? (
        <div className="mt-3 flex items-center gap-2 border-t border-white/[0.06] px-1 pt-2.5">
          <span className="flex-1 text-[12px] leading-[16px] text-ink/80">Выйти из всех аккаунтов? Окна закроются.</span>
          <button type="button" autoFocus onClick={() => void end()} className="h-7 rounded-[4px] bg-[#C42B1C] px-2.5 text-[12px] font-semibold text-white hover:brightness-110">
            Завершить
          </button>
          <button type="button" onClick={() => setConfirmEnd(false)} className="h-7 rounded-[4px] bg-white/[0.08] px-2.5 text-[12px] hover:bg-white/[0.12]">
            Отмена
          </button>
        </div>
      ) : (
        <div className="mt-3 flex items-center justify-between gap-1 border-t border-white/[0.06] px-1 pt-2.5">
          <span className="text-[12px] text-ink/50">SALETS MDT 1.0</span>
          <span className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                onClose()
                minimizeAll()
              }}
              className="rounded-[4px] px-2.5 py-1 text-[12px] text-ink/80 hover:bg-white/[0.08] hover:text-ink"
            >
              Свернуть все окна
            </button>
            <button type="button" onClick={() => setConfirmEnd(true)} title="Выйти из всех аккаунтов" className="flex items-center gap-1.5 rounded-[4px] px-2.5 py-1 text-[12px] text-ink/80 hover:bg-white/[0.08] hover:text-ink">
              <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
                <path d="M10 2.5v7M6 5a6.5 6.5 0 108 0" />
              </svg>
              Завершить сессию
            </button>
          </span>
        </div>
      )}
    </div>
  )
}

/**
 * Bottom task bar: Start (all modules) and Search on the left, running
 * module windows next to them (click: focus / minimise / restore), and the
 * system tray on the right.
 */
export function TaskBar() {
  const { windows, focusWindow, minimizeWindow } = useWindowManager()
  const { openApp } = useShellActions()
  const active = activeWindow(windows)
  const [startOpen, setStartOpen] = useState(false)
  const startRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!startOpen) return
    function onDown(event: MouseEvent) {
      if (startRef.current && !startRef.current.contains(event.target as Node)) setStartOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setStartOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [startOpen])

  return (
    <div className="relative z-20 flex h-[40px] w-full items-center justify-between bg-bg-chrome/60 backdrop-blur-[30px]">
      <div className="flex h-full min-w-0 items-center gap-1 px-2" ref={startRef}>
        <button
          type="button"
          aria-label="Пуск"
          aria-expanded={startOpen}
          title="Пуск — все приложения"
          onClick={() => setStartOpen((v) => !v)}
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[4px] hover:bg-ink/10 ${startOpen ? 'bg-ink/10' : ''}`}
        >
          <div className="grid grid-cols-2 gap-px">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-2 w-2 rounded-[2px] bg-[#48adec]" />
            ))}
          </div>
        </button>
        {startOpen && <StartMenu onClose={() => setStartOpen(false)} />}
        <button
          type="button"
          aria-label="Поиск"
          title="Поиск"
          onClick={() => {
            setStartOpen(false)
            openApp('search')
          }}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[4px] hover:bg-ink/10"
        >
          <img src="/assets/icons/taskbar-search.svg" alt="" className="h-3.5 w-3.5" />
        </button>

        {windows.length > 0 && (
          <>
            <div className="h-5 w-px shrink-0 bg-ink/10" />
            <div className="flex h-full min-w-0 items-center gap-1 overflow-hidden">
              {windows.map((win) => (
                <TaskbarItem
                  key={win.id}
                  win={win}
                  isActive={win.id === active?.id}
                  onClick={() => {
                    if (win.id === active?.id) minimizeWindow(win.id)
                    else focusWindow(win.id)
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <SystemTray />
    </div>
  )
}
