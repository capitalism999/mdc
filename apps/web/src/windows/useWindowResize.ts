import { useCallback, useRef, type PointerEvent as ReactPointerEvent } from 'react'
import { MIN_WINDOW_HEIGHT, MIN_WINDOW_WIDTH, useWindowManager } from './WindowManagerContext'
import type { WindowInstance } from './types'

export type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

/**
 * Makes one edge/corner of a window resizable. The desktop surface is real
 * screen pixels (no CSS scaling), so pointer deltas are used as-is.
 */
export function useWindowResize(win: WindowInstance, direction: ResizeDirection) {
  const { updateBounds, focusWindow } = useWindowManager()
  const start = useRef({ pointerX: 0, pointerY: 0, x: 0, y: 0, width: 0, height: 0 })

  return useCallback(
    (event: ReactPointerEvent) => {
      if (win.isMaximized) return
      event.stopPropagation()
      focusWindow(win.id)
      start.current = { pointerX: event.clientX, pointerY: event.clientY, x: win.x, y: win.y, width: win.width, height: win.height }

      const handleMove = (moveEvent: PointerEvent) => {
        const dx = moveEvent.clientX - start.current.pointerX
        const dy = moveEvent.clientY - start.current.pointerY
        let { x, y, width, height } = start.current

        if (direction.includes('e')) width = Math.max(MIN_WINDOW_WIDTH, start.current.width + dx)
        if (direction.includes('s')) height = Math.max(MIN_WINDOW_HEIGHT, start.current.height + dy)
        if (direction.includes('w')) {
          width = Math.max(MIN_WINDOW_WIDTH, start.current.width - dx)
          x = start.current.x + (start.current.width - width)
        }
        if (direction.includes('n')) {
          height = Math.max(MIN_WINDOW_HEIGHT, start.current.height - dy)
          y = start.current.y + (start.current.height - height)
        }

        updateBounds(win.id, { x, y, width, height })
      }
      const handleUp = () => {
        window.removeEventListener('pointermove', handleMove)
        window.removeEventListener('pointerup', handleUp)
      }
      window.addEventListener('pointermove', handleMove)
      window.addEventListener('pointerup', handleUp)
    },
    [win, direction, updateBounds, focusWindow],
  )
}
