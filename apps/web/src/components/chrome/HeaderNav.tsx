import { useEffect, useRef, useState } from 'react'
import { apps } from '../../data/apps'
import { CREATE_ACTIONS, useShellActions } from '../../windows/shellActions'
import { activeWindow, useWindowManager } from '../../windows/WindowManagerContext'
import { NavButton, type NavItem } from './NavButton'

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'ГЛАВНАЯ', shortcut: 'ALT+H', icon: '/assets/icons/home.svg', hint: 'Свернуть все окна и показать рабочий стол', dividerAfter: true },
  { id: 'create', label: 'СОЗДАТЬ', shortcut: 'ALT+N', icon: '/assets/icons/nav-create.svg', hint: 'Создать отчёт, дело, ориентировку, письмо или заметку' },
  { id: 'search', label: 'ПОИСК', shortcut: 'ALT+J', icon: '/assets/icons/nav-search.svg', hint: 'Открыть Поиск', dividerAfter: true },
  { id: 'mail', label: 'ПОЧТА', shortcut: 'F6', icon: '/assets/icons/nav-mail.svg', hint: 'Открыть Почту' },
  { id: 'bolo', label: 'BOLO', shortcut: 'CTRL+B', icon: '/assets/icons/nav-bolo.svg', hint: 'Открыть BOLO' },
  { id: 'notes', label: 'ЗАМЕТКИ', shortcut: 'CTRL+M', icon: '/assets/icons/nav-notes.svg', hint: 'Открыть Заметки', dividerAfter: true },
  { id: 'refresh', label: 'ОБНОВИТЬ', shortcut: 'F5', icon: '/assets/icons/nav-refresh.svg', hint: 'Обновить активное окно — заново загрузить его данные' },
  { id: 'close', label: 'ЗАКРЫТЬ', shortcut: 'CTRL+W', icon: '/assets/icons/nav-close.svg', hint: 'Закрыть активное окно' },
]

/** Which nav item a key press triggers — `code`, so it works in the Russian layout too. */
function shortcutFor(e: KeyboardEvent): string | null {
  const ctrl = e.ctrlKey || e.metaKey
  if (e.altKey && !ctrl && !e.shiftKey) {
    if (e.code === 'KeyH') return 'home'
    if (e.code === 'KeyN') return 'create'
    if (e.code === 'KeyJ') return 'search'
  }
  if (ctrl && !e.altKey && !e.shiftKey) {
    if (e.code === 'KeyB') return 'bolo'
    if (e.code === 'KeyM') return 'notes'
    if (e.code === 'KeyW') return 'close'
  }
  if (!ctrl && !e.altKey && !e.shiftKey) {
    if (e.key === 'F6') return 'mail'
    // Ctrl/Shift+F5 stay the browser's hard reload
    if (e.key === 'F5') return 'refresh'
  }
  return null
}

/**
 * Renders the pill-button navigation row from `NAV_ITEMS`, inserting a
 * vertical divider after any item flagged with `dividerAfter`. Every button
 * (and its shortcut) acts on the desktop: open a module, the «СОЗДАТЬ» menu,
 * show the desktop, reload or close the active window.
 */
export function HeaderNav() {
  const { windows, minimizeAll, reloadWindow, closeWindow } = useWindowManager()
  const { openApp, create } = useShellActions()
  const [createOpen, setCreateOpen] = useState(false)
  const [spinning, setSpinning] = useState(false)
  const createRef = useRef<HTMLDivElement>(null)
  const firstItemRef = useRef<HTMLButtonElement>(null)
  const active = activeWindow(windows)

  function refresh() {
    setSpinning(true)
    window.setTimeout(() => setSpinning(false), 600)
    // the active window; with every window minimised, all of them. Never a
    // page reload: module data lives in memory, a reload would wipe it.
    if (active) reloadWindow(active.id)
    else windows.forEach((w) => reloadWindow(w.id))
  }

  function run(id: string) {
    switch (id) {
      case 'home':
        setCreateOpen(false)
        minimizeAll()
        return
      case 'create':
        setCreateOpen((v) => !v)
        return
      case 'search':
      case 'mail':
      case 'bolo':
      case 'notes':
        setCreateOpen(false)
        openApp(id)
        return
      case 'refresh':
        if (windows.length) refresh()
        return
      case 'close':
        if (active) closeWindow(active.id)
        return
    }
  }
  const runRef = useRef(run)
  runRef.current = run
  const hasWindowsRef = useRef(false)
  hasWindowsRef.current = windows.length > 0

  // keyboard shortcuts printed on the buttons
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.defaultPrevented) return
      const id = shortcutFor(e)
      if (!id) return
      // F5 with nothing open stays the browser's own reload
      if (id === 'refresh' && !hasWindowsRef.current) return
      e.preventDefault()
      if (e.repeat && (id === 'create' || id === 'refresh' || id === 'close')) return
      runRef.current(id)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // «СОЗДАТЬ» menu: focus its first entry, close on outside click / Escape
  useEffect(() => {
    if (!createOpen) return
    firstItemRef.current?.focus()
    function onDown(event: MouseEvent) {
      if (createRef.current && !createRef.current.contains(event.target as Node)) setCreateOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setCreateOpen(false)
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        const items = Array.from(createRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? [])
        if (!items.length) return
        e.preventDefault()
        const i = items.indexOf(document.activeElement as HTMLButtonElement)
        const next = e.key === 'ArrowDown' ? (i + 1) % items.length : (i - 1 + items.length) % items.length
        items[next]?.focus()
      }
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [createOpen])

  return (
    <div className="flex h-[54px] items-center gap-1.5">
      {NAV_ITEMS.map((item) => (
        <div key={item.id} className="flex h-full items-center gap-1.5">
          {item.id === 'create' ? (
            <div className="relative h-full" ref={createRef}>
              <NavButton item={item} active={createOpen} onClick={() => run('create')} />
              {createOpen && (
                <div role="menu" aria-label="Создать" className="absolute left-0 top-full z-50 mt-2 w-[268px] rounded-[8px] border border-white/[0.08] bg-[#202020] p-1 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
                  <div className="px-2.5 pb-1 pt-1.5 text-[11px] font-semibold uppercase tracking-[0.04em] text-ink/45">Создать</div>
                  {CREATE_ACTIONS.map((action, i) => {
                    const app = apps.find((a) => a.id === action.appId)
                    return (
                      <button
                        key={action.id}
                        ref={i === 0 ? firstItemRef : undefined}
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setCreateOpen(false)
                          create(action.id)
                        }}
                        className="flex w-full items-center gap-3 rounded-[4px] px-2.5 py-2 text-left outline-none hover:bg-white/[0.08] focus-visible:bg-white/[0.08]"
                      >
                        {app && <img src={app.icon} alt="" className="h-6 w-6 shrink-0 object-contain" />}
                        <span className="flex min-w-0 flex-col leading-[17px]">
                          <span className="text-[13px] font-semibold text-ink">{action.label}</span>
                          <span className="text-[12px] text-ink/50">{action.hint}</span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          ) : (
            <NavButton
              item={item}
              spin={spinning && item.id === 'refresh'}
              disabled={(item.id === 'close' && !active) || (item.id === 'refresh' && windows.length === 0)}
              onClick={() => run(item.id)}
            />
          )}
          {item.dividerAfter && <div className="h-10 w-px bg-ink/15" />}
        </div>
      ))}
    </div>
  )
}
