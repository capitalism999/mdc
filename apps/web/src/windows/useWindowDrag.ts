import { useCallback, useRef, type PointerEvent as ReactPointerEvent } from 'react'
import { useWindowManager } from './WindowManagerContext'
import type { WindowInstance } from './types'

/** How much of the title bar must stay reachable so a dragged-off window can
 * always be grabbed again, matching real-OS window dragging. */
const MIN_VISIBLE = 160
/** Title bar height that must stay above the desktop's bottom edge. */
const TITLE_VISIBLE = 40
/** Pointer travel before a press on a maximised title bar counts as a drag
 * (so a double-click to restore doesn't jump the window). */
const DRAG_THRESHOLD = 4

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

/**
 * Makes a window's title bar draggable. The desktop surface is laid out at
 * its real screen size (no CSS scaling), so pointer deltas map 1:1 to the
 * window-bounds coordinate space — no scale conversion needed. Bounds are
 * clamped against the live `desktopSize`, so dragging stays correct at any
 * viewport size. Dragging a maximised window restores it under the cursor,
 * like Windows does.
 */
export function useWindowDrag(win: WindowInstance) {
  const { updateBounds, focusWindow, restoreTo, desktopSize, desktopRef } = useWindowManager()
  const start = useRef({ pointerX: 0, pointerY: 0, winX: 0, winY: 0, width: 0 })

  return useCallback(
    (event: ReactPointerEvent) => {
      if (event.button !== 0) return
      // keep the press from starting a text selection in the window body
      event.preventDefault()
      focusWindow(win.id)
      // keep receiving moves when the cursor races ahead over other windows,
      // and no text selection anywhere while dragging
      const target = event.currentTarget as Element
      try {
        target.setPointerCapture(event.pointerId)
      } catch {
        /* synthetic / already released pointer */
      }
      const prevSelect = document.body.style.userSelect
      document.body.style.userSelect = 'none'
      let maximized = win.isMaximized
      start.current = { pointerX: event.clientX, pointerY: event.clientY, winX: win.x, winY: win.y, width: win.width }

      const handleMove = (moveEvent: PointerEvent) => {
        const dx = moveEvent.clientX - start.current.pointerX
        const dy = moveEvent.clientY - start.current.pointerY
        if (maximized) {
          if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return
          // restore to the pre-maximise size, keeping the grab point under the cursor
          const rb = win.restoreBounds ?? { x: win.x, y: win.y, width: win.width, height: win.height }
          const width = Math.min(rb.width, desktopSize.width)
          const height = Math.min(rb.height, desktopSize.height)
          const origin = desktopRef.current?.getBoundingClientRect()
          const localX = start.current.pointerX - (origin?.left ?? 0)
          const localY = start.current.pointerY - (origin?.top ?? 0)
          const ratio = desktopSize.width > 0 ? localX / desktopSize.width : 0.5
          const winX = clamp(localX - width * ratio, 0, desktopSize.width - width)
          const winY = clamp(localY - 20, 0, desktopSize.height - TITLE_VISIBLE)
          start.current = { pointerX: start.current.pointerX, pointerY: start.current.pointerY, winX, winY, width }
          maximized = false
          restoreTo(win.id, { x: winX, y: winY, width, height })
        }
        const x = clamp(start.current.winX + dx, MIN_VISIBLE - start.current.width, desktopSize.width - MIN_VISIBLE)
        const y = clamp(start.current.winY + dy, 0, desktopSize.height - TITLE_VISIBLE)
        updateBounds(win.id, { x, y })
      }
      const handleUp = () => {
        document.body.style.userSelect = prevSelect
        window.removeEventListener('pointermove', handleMove)
        window.removeEventListener('pointerup', handleUp)
        window.removeEventListener('pointercancel', handleUp)
      }
      window.addEventListener('pointermove', handleMove)
      window.addEventListener('pointerup', handleUp)
      window.addEventListener('pointercancel', handleUp)
    },
    [win, desktopSize, desktopRef, updateBounds, focusWindow, restoreTo],
  )
}
