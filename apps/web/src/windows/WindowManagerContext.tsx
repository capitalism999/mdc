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

interface WindowManagerContextValue {
  windows: WindowInstance[]
  desktopSize: DesktopSize
  desktopRef: RefObject<HTMLDivElement | null>
  openWindow: (app: AppTile, opts?: { instanceKey?: string; initialParams?: Record<string, unknown> }) => void
  closeWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  toggleMaximize: (id: string) => void
  focusWindow: (id: string) => void
  updateBounds: (id: string, bounds: Partial<Pick<WindowInstance, 'x' | 'y' | 'width' | 'height'>>) => void
  updateBreadcrumb: (id: string, breadcrumb: string[]) => void
  setBackHandler: (id: string, handler: (() => void) | null) => void
  setForwardHandler: (id: string, handler: (() => void) | null) => void
}

const WindowManagerContext = createContext<WindowManagerContextValue | null>(null)

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
function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(Math.max(min, max), v))
}

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<WindowInstance[]>([])
  const [desktopSize, setDesktopSize] = useState<DesktopSize>(FALLBACK_DESKTOP_SIZE)
  const desktopRef = useRef<HTMLDivElement | null>(null)
  const zCounter = useRef(1)
  const cascadeCount = useRef(0)

  useEffect(() => {
    const el = desktopRef.current
    if (!el) return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      const { width, height } = entry.contentRect
      setDesktopSize({ width, height })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // When the desktop gets smaller (F11 off, browser resized), shrink and move
  // open windows so each one stays fully on screen — otherwise their bottom
  // (and any dialog centred in them) ends up unreachable.
  useEffect(() => {
    setWindows((prev) => {
      let changed = false
      const next = prev.map((w) => {
        const width = Math.min(w.width, desktopSize.width)
        const height = Math.min(w.height, desktopSize.height)
        const x = clamp(w.x, 0, desktopSize.width - width)
        const y = clamp(w.y, 0, desktopSize.height - height)
        if (width === w.width && height === w.height && x === w.x && y === w.y) return w
        changed = true
        return { ...w, width, height, x, y }
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
        const offset = (cascadeCount.current % CASCADE_SLOTS) * CASCADE_STEP
        cascadeCount.current += 1

        const width = app.defaultSize ? Math.min(app.defaultSize.width, desktopSize.width) : Math.round(desktopSize.width * DEFAULT_WINDOW_WIDTH_RATIO)
        const height = app.defaultSize ? Math.min(app.defaultSize.height, desktopSize.height) : Math.round(desktopSize.height * DEFAULT_WINDOW_HEIGHT_RATIO)

        const next: WindowInstance = {
          id: `${app.id}-${Date.now()}`,
          appId: app.id,
          instanceKey,
          title: app.label,
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

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id))
  }, [])

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w)))
  }, [])

  const focusWindow = useCallback((id: string) => {
    zCounter.current += 1
    const z = zCounter.current
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, isMinimized: false, zIndex: z } : w)))
  }, [])

  const toggleMaximize = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w
        if (w.isMaximized) {
          const restore = w.restoreBounds ?? { x: w.x, y: w.y, width: w.width, height: w.height }
          return { ...w, isMaximized: false, restoreBounds: null, ...restore }
        }
        return {
          ...w,
          isMaximized: true,
          restoreBounds: { x: w.x, y: w.y, width: w.width, height: w.height },
        }
      }),
    )
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

  const updateBreadcrumb = useCallback((id: string, breadcrumb: string[]) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w
        if (w.breadcrumb.length === breadcrumb.length && w.breadcrumb.every((c, i) => c === breadcrumb[i])) return w
        return { ...w, breadcrumb }
      }),
    )
  }, [])

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
        minimizeWindow,
        toggleMaximize,
        focusWindow,
        updateBounds,
        updateBreadcrumb,
        setBackHandler,
        setForwardHandler,
      }}
    >
      {children}
    </WindowManagerContext.Provider>
  )
}

export function useWindowManager() {
  const ctx = useContext(WindowManagerContext)
  if (!ctx) throw new Error('useWindowManager must be used within WindowManagerProvider')
  return ctx
}
