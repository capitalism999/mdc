import { useCallback, useRef, type PointerEvent as ReactPointerEvent } from 'react'
import { MIN_WINDOW_HEIGHT, MIN_WINDOW_WIDTH, useWindowManager } from './WindowManagerContext'
import type { WindowInstance } from './types'

export type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

/**
 * Makes one edge/corner of a window resizable. The desktop surface is real
 * screen pixels (no CSS scaling), so pointer deltas are used as-is. Edges
 * stop at the desktop's borders, so a resize never pushes the title bar off
 * the top or the window under the task bar.
 */
export function useWindowResize(win: WindowInstance, direction: ResizeDirection) {
  const { updateBounds, focusWindow, desktopSize } = useWindowManager()
  const start = useRef({ pointerX: 0, pointerY: 0, x: 0, y: 0, width: 0, height: 0 })

  return useCallback(
    (event: ReactPointerEvent) => {
      if (win.isMaximized || event.button !== 0) return
      event.stopPropagation()
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
      start.current = { pointerX: event.clientX, pointerY: event.clientY, x: win.x, y: win.y, width: win.width, height: win.height }
      const minW = Math.min(MIN_WINDOW_WIDTH, desktopSize.width)
      const minH = Math.min(MIN_WINDOW_HEIGHT, desktopSize.height)

      const handleMove = (moveEvent: PointerEvent) => {
        const s = start.current
        const dx = moveEvent.clientX - s.pointerX
        const dy = moveEvent.clientY - s.pointerY
        let { x, y, width, height } = s
        const right = s.x + s.width
        const bottom = s.y + s.height

        // the far edge may only grow up to the desktop border (or stay where it already is)
        if (direction.includes('e')) width = Math.max(minW, Math.min(s.width + dx, Math.max(s.width, desktopSize.width - s.x)))
        if (direction.includes('s')) height = Math.max(minH, Math.min(s.height + dy, Math.max(s.height, desktopSize.height - s.y)))
        if (direction.includes('w')) {
          width = Math.max(minW, Math.min(s.width - dx, s.x >= 0 ? right : s.width))
          x = right - width
        }
        if (direction.includes('n')) {
          height = Math.max(minH, Math.min(s.height - dy, bottom))
          y = bottom - height
        }

        updateBounds(win.id, { x, y, width, height })
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
    [win, direction, desktopSize, updateBounds, focusWindow],
  )
}
