import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react'
import type { AppTile } from '../types'
import type { WindowInstance } from './types'

export interface DesktopSize {
  width: number
  height: number
}

/** Used only before the desktop surface has been measured for the first
 * time (first paint), so the very first window opened still gets a sane
 * size/position instead of 0x0. */
const FALLBACK_DESKTOP_SIZE: DesktopSize = { width: 1920, height: 919 }

const DEFAULT_WINDOW_WIDTH_RATIO = 0.55
const DEFAULT_WINDOW_HEIGHT_RATIO = 0.88
const CASCADE_STEP = 28
const CASCADE_SLOTS = 6
export const MIN_WINDOW_WIDTH = 480
export const MIN_WINDOW_HEIGHT = 320

/**
 * Asked before a window's content is thrown away — the user closing it
 * (title-bar ✕, «ЗАКРЫТЬ», Ctrl+W, «Закрыть MDT», signing out) or reloading
 * it («ОБНОВИТЬ»). Return `false` (or resolve to `false`) to keep the
 * window open — e.g. after saving a draft or asking the user first. Any other
 * result lets the close go ahead. See `useCloseGuard`.
 */
export type CloseGuard = () => boolean | void | Promise<boolean | void>

export interface CloseOptions {
  /** skip the window's close guard — for a module closing its own window
   * once the guarded work is done (letter sent, draft discarded on purpose) */
  force?: boolean
}

interface WindowManagerContextValue {
  windows: WindowInstance[]
  desktopSize: DesktopSize
  desktopRef: RefObject<HTMLDivElement | null>
  openWindow: (app: AppTile, opts?: { instanceKey?: string; initialParams?: Record<string, unknown> }) => void
  /** Closes a window, asking its close guard first (unless `force`).
   * Resolves to whether the window was closed. */
  closeWindow: (id: string, opts?: CloseOptions) => Promise<boolean>
  /** Registers the window's close guard (one per window; `null` removes it). */
  setCloseGuard: (id: string, guard: CloseGuard | null) => void
  minimizeWindow: (id: string) => void
  toggleMaximize: (id: string) => void
  focusWindow: (id: string) => void
  updateBounds: (id: string, bounds: Partial<Pick<WindowInstance, 'x' | 'y' | 'width' | 'height'>>) => void
  /** Leaves the maximised state with the given bounds (dragging a maximised
   * window by its title bar, like Windows does). */
  restoreTo: (id: string, bounds: Pick<WindowInstance, 'x' | 'y' | 'width' | 'height'>) => void
  updateBreadcrumb: (id: string, breadcrumb: string[]) => void
  /** Renames an open window (title bar and task bar) — e.g. «Новое письмо · <тема>» as the subject is typed. */
  setWindowTitle: (id: string, title: string) => void
  /** Re-mounts a window's module content so it loads its data again — «ОБНОВИТЬ» / F5.
   * Asks the close guard first; resolves to whether it reloaded. */
  reloadWindow: (id: string) => Promise<boolean>
  /** Minimises every open window — «ГЛАВНАЯ» (show the desktop). */
  minimizeAll: () => void
  /** Closes every open window (signing out, «Закрыть MDT»), asking each
   * close guard; resolves to whether every window closed. */
  closeAll: () => Promise<boolean>
  setBackHandler: (id: string, handler: (() => void) | null) => void
  setForwardHandler: (id: string, handler: (() => void) | null) => void
}

const WindowManagerContext = createContext<WindowManagerContextValue | null>(null)

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(Math.max(min, max), v))
}

type Bounds = { x: number; y: number; width: number; height: number }

/** Shrinks/moves bounds so the whole rectangle lies on the desktop. */
function fitBounds(b: Bounds, desk: DesktopSize): Bounds {
  const width = Math.min(b.width, desk.width)
  const height = Math.min(b.height, desk.height)
  return { width, height, x: clamp(b.x, 0, desk.width - width), y: clamp(b.y, 0, desk.height - height) }
}

function sameBounds(a: Bounds, b: Bounds) {
  return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height
}

/** The window the user is working in: the top-most one that isn't minimised. */
export function activeWindow(windows: WindowInstance[]): WindowInstance | null {
  let top: WindowInstance | null = null
  for (const w of windows) if (!w.isMinimized && (!top || w.zIndex > top.zIndex)) top = w
  return top
}

/**
 * OS-style window state for the desktop: tracks every open module window
 * (position, size, z-order, minimized/maximized) so `AppWindow` instances
 * behave like real OS windows and the task bar can list running apps.
 *
 * There is no fixed design canvas anymore — `desktopRef` is attached to the
 * real `DesktopSurface` element by that component, and a `ResizeObserver`
 * tracks its actual pixel size (`desktopSize`) so default window position/
 * size, cascading, maximize, and drag/resize clamping all work correctly at
 * any viewport size or aspect ratio.
 */
export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<WindowInstance[]>([])
  const [desktopSize, setDesktopSize] = useState<DesktopSize>(FALLBACK_DESKTOP_SIZE)
  const desktopRef = useRef<HTMLDivElement | null>(null)
  const zCounter = useRef(1)
  const cascadeCount = useRef(0)
  /** Window ids: `Date.now()` alone collides when two windows open in the
   * same millisecond (a module opening a sibling window while it mounts). */
  const idCounter = useRef(0)
  const sizeRef = useRef(desktopSize)
  sizeRef.current = desktopSize
  const guards = useRef(new Map<string, CloseGuard>())
  const windowsRef = useRef(windows)
  windowsRef.current = windows

  /** true = the window may go */
  const askGuard = useCallback(async (id: string) => {
    const guard = guards.current.get(id)
    if (!guard) return true
    try {
      return (await guard()) !== false
    } catch {
      return false
    }
  }, [])

  useEffect(() => {
    const el = desktopRef.current
    if (!el) return

    const apply = (width: number, height: number) =>
      setDesktopSize((prev) => (prev.width === width && prev.height === height ? prev : { width, height }))
    // measure right away (the observer reports on the next rendered frame,
    // which a hidden / background page may not get for a while) …
    const measure = () => apply(el.clientWidth, el.clientHeight)
    measure()
    // … then follow every size change
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      apply(entry.contentRect.width, entry.contentRect.height)
    })
    observer.observe(el)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  // When the desktop gets smaller (F11 off, browser resized), shrink and move
  // open windows so each one stays fully on screen — otherwise their bottom
  // (and any dialog centred in them) ends up unreachable. A maximised window
  // follows the desktop live, but its restore bounds must still fit.
  useEffect(() => {
    setWindows((prev) => {
      let changed = false
      const next = prev.map((w) => {
        const fitted = fitBounds(w, desktopSize)
        const restore = w.restoreBounds && fitBounds(w.restoreBounds, desktopSize)
        const restoreSame = !restore || !w.restoreBounds || sameBounds(restore, w.restoreBounds)
        if (sameBounds(fitted, w) && restoreSame) return w
        changed = true
        return { ...w, ...fitted, restoreBounds: restore }
      })
      return changed ? next : prev
    })
  }, [desktopSize])

  const openWindow = useCallback(
    (app: AppTile, opts?: { instanceKey?: string; initialParams?: Record<string, unknown> }) => {
      const instanceKey = opts?.instanceKey ?? app.id
      setWindows((prev) => {
        const existing = prev.find((w) => w.instanceKey === instanceKey)
        if (existing) {
          zCounter.current += 1
          const z = zCounter.current
          return prev.map((w) => (w.id === existing.id ? { ...w, isMinimized: false, zIndex: z } : w))
        }

        zCounter.current += 1
        idCounter.current += 1
        const offset = (cascadeCount.current % CASCADE_SLOTS) * CASCADE_STEP
        cascadeCount.current += 1

        const width = app.defaultSize ? Math.min(app.defaultSize.width, desktopSize.width) : Math.round(desktopSize.width * DEFAULT_WINDOW_WIDTH_RATIO)
        const height = app.defaultSize ? Math.min(app.defaultSize.height, desktopSize.height) : Math.round(desktopSize.height * DEFAULT_WINDOW_HEIGHT_RATIO)

        // a dedicated record window (own instanceKey) names its record: «Дела · LS-2026-0911»
        const label = opts?.initialParams?.label
        const title = instanceKey !== app.id && typeof label === 'string' && label.trim() ? `${app.label} · ${label.trim()}` : app.label

        const next: WindowInstance = {
          id: `${app.id}-${Date.now()}-${idCounter.current}`,
          appId: app.id,
          instanceKey,
          title,
          icon: app.icon,
          breadcrumb: [app.label],
          initialParams: opts?.initialParams,
          // Cascade, but never past the desktop edge (a full-height window
          // shifted by the cascade step would hang off the bottom).
          x: clamp((desktopSize.width - width) / 2 + offset, 0, desktopSize.width - width),
          y: clamp((desktopSize.height - height) / 2 + offset, 0, desktopSize.height - height),
          width,
          height,
          zIndex: zCounter.current,
          isMinimized: false,
          isMaximized: false,
          restoreBounds: null,
        }
        return [...prev, next]
      })
    },
    [desktopSize],
  )

  const closeWindow = useCallback(
    async (id: string, opts?: CloseOptions) => {
      if (!opts?.force && !(await askGuard(id))) return false
      guards.current.delete(id)
      setWindows((prev) => prev.filter((w) => w.id !== id))
      return true
    },
    [askGuard],
  )

  const setCloseGuard = useCallback((id: string, guard: CloseGuard | null) => {
    if (guard) guards.current.set(id, guard)
    else guards.current.delete(id)
  }, [])

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w)))
  }, [])

  const focusWindow = useCallback((id: string) => {
    setWindows((prev) => {
      const target = prev.find((w) => w.id === id)
      if (!target) return prev
      // already on top and visible — don't re-render every window on each click
      if (!target.isMinimized && prev.every((w) => w.id === id || w.zIndex < target.zIndex)) return prev
      zCounter.current += 1
      const z = zCounter.current
      return prev.map((w) => (w.id === id ? { ...w, isMinimized: false, zIndex: z } : w))
    })
  }, [])

  const toggleMaximize = useCallback((id: string) => {
    zCounter.current += 1
    const z = zCounter.current
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w
        if (w.isMaximized) {
          const restore = fitBounds(w.restoreBounds ?? { x: w.x, y: w.y, width: w.width, height: w.height }, sizeRef.current)
          return { ...w, isMaximized: false, restoreBounds: null, zIndex: z, ...restore }
        }
        return {
          ...w,
          zIndex: z,
          isMaximized: true,
          restoreBounds: { x: w.x, y: w.y, width: w.width, height: w.height },
        }
      }),
    )
  }, [])

  const restoreTo = useCallback((id: string, bounds: Bounds) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, ...bounds, isMaximized: false, restoreBounds: null } : w)))
  }, [])

  const updateBounds = useCallback(
    (id: string, bounds: Partial<Pick<WindowInstance, 'x' | 'y' | 'width' | 'height'>>) => {
      setWindows((prev) =>
        prev.map((w) => {
          if (w.id !== id || w.isMaximized) return w
          return { ...w, ...bounds }
        }),
      )
    },
    [],
  )

  const setWindowTitle = useCallback((id: string, title: string) => {
    setWindows((prev) => (prev.some((w) => w.id === id && w.title !== title) ? prev.map((w) => (w.id === id ? { ...w, title } : w)) : prev))
  }, [])

  const updateBreadcrumb = useCallback((id: string, breadcrumb: string[]) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w
        if (w.breadcrumb.length === breadcrumb.length && w.breadcrumb.every((c, i) => c === breadcrumb[i])) return w
        return { ...w, breadcrumb }
      }),
    )
  }, [])

  const reloadWindow = useCallback(
    async (id: string) => {
      if (!(await askGuard(id))) return false
      setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, reloadKey: (w.reloadKey ?? 0) + 1, onBack: undefined, onForward: undefined } : w)))
      return true
    },
    [askGuard],
  )

  const minimizeAll = useCallback(() => {
    setWindows((prev) => (prev.some((w) => !w.isMinimized) ? prev.map((w) => (w.isMinimized ? w : { ...w, isMinimized: true })) : prev))
  }, [])

  const closeAll = useCallback(async () => {
    // one guard at a time, so two windows never ask the user at once
    const kept = new Set<string>()
    for (const w of windowsRef.current) if (!(await askGuard(w.id))) kept.add(w.id)
    for (const id of guards.current.keys()) if (!kept.has(id)) guards.current.delete(id)
    setWindows((prev) => prev.filter((w) => kept.has(w.id)))
    return kept.size === 0
  }, [askGuard])

  const setBackHandler = useCallback((id: string, handler: (() => void) | null) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, onBack: handler ?? undefined } : w)))
  }, [])

  const setForwardHandler = useCallback((id: string, handler: (() => void) | null) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, onForward: handler ?? undefined } : w)))
  }, [])

  return (
    <WindowManagerContext.Provider
      value={{
        windows,
        desktopSize,
        desktopRef,
        openWindow,
        closeWindow,
        setCloseGuard,
        minimizeWindow,
        toggleMaximize,
        focusWindow,
        updateBounds,
        restoreTo,
        updateBreadcrumb,
        setWindowTitle,
        reloadWindow,
        minimizeAll,
        closeAll,
        setBackHandler,
        setForwardHandler,
      }}
    >
      {children}
    </WindowManagerContext.Provider>
  )
}

/**
 * Lets a module window veto or delay its own close: `guard` runs whenever
 * the user closes or reloads the window (see `CloseGuard`). Always calls
 * the latest `guard`, so it can read current state without re-registering.
 *
 *   useCloseGuard(windowId, async () => {
 *     if (!dirty) return true
 *     saveDraft()          // or: return await askUser()
 *     return true
 *   })
 *
 * A module closing its own window after the guarded work is done uses
 * `closeWindow(windowId, { force: true })`.
 */
export function useCloseGuard(windowId: string, guard: CloseGuard) {
  const { setCloseGuard } = useWindowManager()
  const ref = useRef(guard)
  ref.current = guard
  useEffect(() => {
    setCloseGuard(windowId, () => ref.current())
    return () => setCloseGuard(windowId, null)
  }, [windowId, setCloseGuard])
}

export function useWindowManager() {
  const ctx = useContext(WindowManagerContext)
  if (!ctx) throw new Error('useWindowManager must be used within WindowManagerProvider')
  return ctx
}
