import type { PointerEvent } from 'react'
import { allAppTiles } from '../../data/apps'
import type { WindowInstance } from '../../windows/types'
import { useWindowDrag } from '../../windows/useWindowDrag'
import { useWindowManager } from '../../windows/WindowManagerContext'
import { useWindowResize, type ResizeDirection } from '../../windows/useWindowResize'
import { moduleContent } from '../modules/registry'
import { StubApp } from './StubApp'

const RESIZE_HANDLES: { direction: ResizeDirection; className: string }[] = [
  { direction: 'n', className: 'left-0 right-0 top-0 h-[4px] cursor-ns-resize' },
  { direction: 's', className: 'bottom-0 left-0 right-0 h-[4px] cursor-ns-resize' },
  { direction: 'e', className: 'right-0 top-0 bottom-0 w-[4px] cursor-ew-resize' },
  { direction: 'w', className: 'left-0 top-0 bottom-0 w-[4px] cursor-ew-resize' },
  { direction: 'ne', className: 'right-0 top-0 h-[10px] w-[10px] cursor-nesw-resize' },
  { direction: 'nw', className: 'left-0 top-0 h-[10px] w-[10px] cursor-nwse-resize' },
  { direction: 'se', className: 'right-0 bottom-0 h-[10px] w-[10px] cursor-nwse-resize' },
  { direction: 'sw', className: 'left-0 bottom-0 h-[10px] w-[10px] cursor-nesw-resize' },
]

function ResizeHandle({ win, direction, className }: { win: WindowInstance; direction: ResizeDirection; className: string }) {
  const onPointerDown = useWindowResize(win, direction)
  return <div onPointerDown={onPointerDown} className={`absolute z-10 ${className}`} />
}

/**
 * Inline (not `<img>`) so the arrow follows `currentColor` (the window's
 * text color), which a static SVG asset loaded via `<img src>` can't do.
 */
function WindowBackArrow({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
      <path
        d="M7.35333 5.68667C7.40246 5.64089 7.44186 5.58569 7.46919 5.52436C7.49652 5.46303 7.51121 5.39682 7.51239 5.32968C7.51358 5.26255 7.50123 5.19586 7.47608 5.1336C7.45093 5.07134 7.4135 5.01479 7.36603 4.96731C7.31855 4.91983 7.26199 4.8824 7.19973 4.85725C7.13747 4.8321 7.07079 4.81975 7.00365 4.82094C6.93652 4.82212 6.87031 4.83682 6.80897 4.86415C6.74764 4.89147 6.69244 4.93087 6.64667 4.98L3.98 7.64667C3.88637 7.74042 3.83377 7.8675 3.83377 8C3.83377 8.1325 3.88637 8.25958 3.98 8.35333L6.64667 11.02C6.69244 11.0691 6.74764 11.1085 6.80897 11.1359C6.87031 11.1632 6.93652 11.1779 7.00365 11.1791C7.07079 11.1802 7.13747 11.1679 7.19973 11.1427C7.26199 11.1176 7.31855 11.0802 7.36603 11.0327C7.4135 10.9852 7.45093 10.9287 7.47608 10.8664C7.50123 10.8041 7.51358 10.7375 7.51239 10.6703C7.51121 10.6032 7.49652 10.537 7.46919 10.4756C7.44186 10.4143 7.40246 10.3591 7.35333 10.3133L5.54 8.5H12C12.1326 8.5 12.2598 8.44732 12.3536 8.35355C12.4473 8.25978 12.5 8.13261 12.5 8C12.5 7.86739 12.4473 7.74021 12.3536 7.64645C12.2598 7.55268 12.1326 7.5 12 7.5H5.54L7.35333 5.68667Z"
        fill="currentColor"
        fillOpacity="0.5"
      />
    </svg>
  )
}

function WindowChevron({ className }: { className?: string }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={className}>
      <path
        d="M3.75 2.5L6.25 5L3.75 7.5"
        strokeWidth="0.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
        strokeOpacity="0.5"
      />
    </svg>
  )
}

function MinimizeIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M3 10h14" />
    </svg>
  )
}

function MaximizeIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="3.5" y="3.5" width="13" height="13" rx="2" />
    </svg>
  )
}

function CloseGlyph() {
  return (
    <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M4 4l12 12M16 4L4 16" />
    </svg>
  )
}

/** Title bar for a `chrome: 'bare'` module — the module's real desktop
 * icon + title, no breadcrumb strip, styled to match the module's own
 * reference design instead of the generic OS chrome below. */
function BareTitleBar({
  win,
  onDragPointerDown,
  onMinimize,
  onToggleMaximize,
  onClose,
}: {
  win: WindowInstance
  onDragPointerDown: (event: PointerEvent) => void
  onMinimize: () => void
  onToggleMaximize: () => void
  onClose: () => void
}) {
  return (
    <div
      className="flex h-10 shrink-0 items-center gap-2.5 bg-[#1D2027] pl-3.5 text-white"
      onPointerDown={onDragPointerDown}
      onDoubleClick={onToggleMaximize}
    >
      <img src={win.icon} alt="" className="h-[18px] w-[18px] shrink-0 object-contain" />
      <span className="flex-1 truncate text-[12px]">{win.title}</span>
      <div className="flex h-full items-stretch">
        <button
          type="button"
          aria-label="Свернуть"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={onMinimize}
          className="flex h-full w-[46px] items-center justify-center hover:bg-white/10"
        >
          <MinimizeIcon />
        </button>
        <button
          type="button"
          aria-label={win.isMaximized ? 'Восстановить' : 'Развернуть'}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={onToggleMaximize}
          className="flex h-full w-[46px] items-center justify-center hover:bg-white/10"
        >
          <MaximizeIcon />
        </button>
        <button
          type="button"
          aria-label="Закрыть"
          onPointerDown={(event) => event.stopPropagation()}
          onClick={onClose}
          className="flex h-full w-[46px] items-center justify-center rounded-tr-[7px] hover:bg-[#C42B1C]"
        >
          <CloseGlyph />
        </button>
      </div>
    </div>
  )
}

/**
 * A single OS-style module window. Most modules get the generic chrome
 * (title bar + breadcrumb bar + content pane, matching the Figma "Full HD
 * Human" window node 8056:383); a module flagged `chrome: 'bare'` in
 * `data/apps.ts` gets a slimmer title bar with no breadcrumb strip instead,
 * styled to its own reference design. Either way the window is draggable by
 * its title bar, resizable from every edge/corner, and wired to minimize/
 * maximize/close via `WindowManagerContext`.
 */
export function AppWindow({ win }: { win: WindowInstance }) {
  const { closeWindow, minimizeWindow, toggleMaximize, focusWindow, desktopSize } = useWindowManager()
  const onDragPointerDown = useWindowDrag(win)
  const appDef = allAppTiles.find((a) => a.id === win.appId)
  const ModuleContent = appDef?.stub ? StubApp : moduleContent[win.appId]
  const isBare = appDef?.chrome === 'bare'

  if (win.isMinimized) return null

  // Maximized bounds are derived live from the measured desktop surface
  // size (not a snapshot), so a maximized window keeps filling the screen
  // if the viewport is resized while it's maximized.
  const bounds = win.isMaximized
    ? { left: 0, top: 0, width: desktopSize.width, height: desktopSize.height }
    : { left: win.x, top: win.y, width: win.width, height: win.height }

  return (
    <div
      className={`absolute flex flex-col overflow-clip ${
        isBare
          ? 'border border-[#3B3B3B] bg-[#272727] shadow-[0_24px_60px_rgba(0,0,0,0.55),0_0_0_1px_rgba(0,0,0,0.35)]'
          : 'bg-bg-chrome shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
      } ${win.isMaximized ? '' : isBare ? 'rounded-[8px]' : 'rounded-[12px]'}`}
      style={{ ...bounds, zIndex: win.zIndex }}
      onPointerDown={() => focusWindow(win.id)}
    >
      {isBare ? (
        <BareTitleBar
          win={win}
          onDragPointerDown={onDragPointerDown}
          onMinimize={() => minimizeWindow(win.id)}
          onToggleMaximize={() => toggleMaximize(win.id)}
          onClose={() => closeWindow(win.id)}
        />
      ) : (
        <>
          <div
            className="flex h-[34px] shrink-0 items-center justify-between bg-bg-chrome pl-3"
            onPointerDown={onDragPointerDown}
            onDoubleClick={() => toggleMaximize(win.id)}
          >
            <div className="flex items-center gap-2">
              <img src={win.icon} alt="" className="h-5 w-5 object-cover" />
              <span className="text-[14px] font-semibold tracking-[-0.144px] text-ink">{win.title}</span>
            </div>
            <div className="flex items-center self-stretch">
              <button
                type="button"
                className="icon-font flex h-full w-[42px] items-center justify-center text-[10px] text-ink/90 hover:bg-ink/10"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => minimizeWindow(win.id)}
                aria-label="Свернуть"
              >
                {''}
              </button>
              <button
                type="button"
                className="icon-font flex h-full w-[42px] items-center justify-center text-[10px] text-ink/90 hover:bg-ink/10"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => toggleMaximize(win.id)}
                aria-label={win.isMaximized ? 'Восстановить' : 'Развернуть'}
              >
                {win.isMaximized ? '' : ''}
              </button>
              <button
                type="button"
                className="icon-font flex h-full w-[42px] items-center justify-center rounded-tr-[12px] text-[10px] text-ink/90 hover:bg-[#e81123]"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => closeWindow(win.id)}
                aria-label="Закрыть"
              >
                {''}
              </button>
            </div>
          </div>

          <div className="flex shrink-0 items-center bg-bg-chrome py-1.5 pl-2 pr-3">
            <div className="flex items-center gap-0.5 px-2 text-ink">
              <button
                type="button"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => win.onBack?.()}
                disabled={!win.onBack}
                aria-label="Назад"
                className={win.onBack ? 'hover:opacity-70' : 'opacity-40'}
              >
                <WindowBackArrow className="h-5 w-5" />
              </button>
              <button
                type="button"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => win.onForward?.()}
                disabled={!win.onForward}
                aria-label="Вперёд"
                className={win.onForward ? 'hover:opacity-70' : 'opacity-40'}
              >
                <WindowBackArrow className="h-5 w-5 rotate-180" />
              </button>
            </div>
            <div className="flex flex-1 items-center gap-1.5 rounded-[4px] bg-bg-chrome-2 p-2.5 text-ink">
              {win.breadcrumb.map((crumb, index) => (
                <span key={crumb} className="flex items-center gap-1.5">
                  {index > 0 && <WindowChevron className="h-3.5 w-3.5" />}
                  <span
                    className={`text-[14px] font-medium tracking-[-0.144px] ${
                      index === win.breadcrumb.length - 1 ? 'text-ink' : 'text-ink/50'
                    }`}
                  >
                    {crumb}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </>
      )}

      <div className={`min-h-0 flex-1 ${ModuleContent ? 'overflow-clip' : 'overflow-auto'} ${isBare ? '' : 'bg-bg-app'}`}>
        {ModuleContent && <ModuleContent windowId={win.id} initialParams={win.initialParams} />}
      </div>

      {!win.isMaximized && RESIZE_HANDLES.map((handle) => (
        <ResizeHandle key={handle.direction} win={win} direction={handle.direction} className={handle.className} />
      ))}
    </div>
  )
}
