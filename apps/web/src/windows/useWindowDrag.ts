import { useCallback, useRef, type PointerEvent as ReactPointerEvent } from 'react'
import { useWindowManager } from './WindowManagerContext'
import type { WindowInstance } from './types'

/** How much of the title bar must stay reachable so a dragged-off window can
 * always be grabbed again, matching real-OS window dragging. */
const MIN_VISIBLE = 160

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

/**
 * Makes a window's title bar draggable. The desktop surface is laid out at
 * its real screen size (no CSS scaling), so pointer deltas map 1:1 to the
 * window-bounds coordinate space — no scale conversion needed. Bounds are
 * clamped against the live `desktopSize`, so dragging stays correct at any
 * viewport size.
 */
export function useWindowDrag(win: WindowInstance) {
  const { updateBounds, focusWindow, desktopSize } = useWindowManager()
  const start = useRef({ pointerX: 0, pointerY: 0, winX: 0, winY: 0 })

  return useCallback(
    (event: ReactPointerEvent) => {
      if (win.isMaximized) return
      focusWindow(win.id)
      start.current = { pointerX: event.clientX, pointerY: event.clientY, winX: win.x, winY: win.y }

      const handleMove = (moveEvent: PointerEvent) => {
        const dx = moveEvent.clientX - start.current.pointerX
        const dy = moveEvent.clientY - start.current.pointerY
        const x = clamp(start.current.winX + dx, MIN_VISIBLE - win.width, desktopSize.width - MIN_VISIBLE)
        const y = clamp(start.current.winY + dy, 0, desktopSize.height - 26)
        updateBounds(win.id, { x, y })
      }
      const handleUp = () => {
        window.removeEventListener('pointermove', handleMove)
        window.removeEventListener('pointerup', handleUp)
      }
      window.addEventListener('pointermove', handleMove)
      window.addEventListener('pointerup', handleUp)
    },
    [win, desktopSize, updateBounds, focusWindow],
  )
}
