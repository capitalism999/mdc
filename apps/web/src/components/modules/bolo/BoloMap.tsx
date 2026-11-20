import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import type { Bolo } from '../../../types'
import { ACCENT, C, ON_ACCENT, TONE, type BoloUIState, statusOf } from './BoloApp'
import { CloseIcon, PathIcon, SearchIcon } from './icons'
import { MAP_LABEL_STYLE, MAP_SRC, MAP_WATER, MapTiles, containBox, useElementSize } from '../shared/sanAndreasMap'

const MIN_ZOOM = 1
const MAX_ZOOM = 24
/** Past this zoom the map's own printed labels are legible, so the overlay
 * district labels (which would duplicate them) are hidden. */
const LABELS_MAX_ZOOM = 4
/** Zoom is multiplicative so each wheel notch / button press feels the same
 * at any magnification. */
const WHEEL_FACTOR = 1.25
/** Pointer movement (px) below which a press+release counts as a click
 * rather than a drag — same threshold as Дела's CaseMap. */
const DRAG_THRESHOLD = 4

/** Named places, in % of the map image (see `shared/sanAndreasMap`) — read
 * off the map's own street/district labels. */
export const GEO: [string, number, number][] = [
  ['Grove Street, Davis', 46.5, 76.5], ['Forum Dr, Strawberry', 44.5, 73.5], ['Davis Ave', 42, 75.5], ['Rockford Hills', 30, 61.5],
  ['Vespucci Beach', 27, 73], ['Del Perro', 25, 65.5], ['Mission Row', 48.5, 67.5], ['Downtown Los Santos', 45, 64],
  ['La Mesa', 55.5, 71.5], ['LSIA, аэропорт', 31, 84.5], ['Sandy Shores', 63, 35], ['Paleto Bay', 46, 14], ['Paleto Blvd', 43.5, 16.5],
  ['Grapeseed', 68, 26], ['Route 68, Harmony', 54, 42], ['Great Ocean Hwy', 12.5, 43], ['Mount Chiliad', 49, 20],
  ['Grand Senora Desert', 58, 39], ['Alamo Sea', 57, 31],
]

/** Overlay district labels: [text, x%, y%, emphasised]. */
const MAP_LABELS: [string, number, number, boolean?][] = [
  ['Paleto Bay', 46, 12.5], ['Mount Chiliad', 50, 19.5], ['Grapeseed', 68, 24.5], ['Sandy Shores', 63, 36.8],
  ['Grand Senora Desert', 58, 40.5], ['Los Santos', 44, 66, true], ['Vespucci', 30, 71],
]

/** Nearest named place to a map-percent coordinate — the reference's
 * `nearest()` helper, used to label a dropped pin. */
export function nearestPlace(x: number, y: number) {
  let best = ''
  let bd = Infinity
  for (const [name, gx, gy] of GEO) {
    const d = (gx - x) ** 2 + (gy - y) ** 2
    if (d < bd) {
      bd = d
      best = name
    }
  }
  return best
}

/** The San Andreas map — the user's own real map image
 * (`/assets/map/los-santos.jpg`), shared by the standalone map and the map
 * picker. Native pan/zoom (scroll wheel zooms toward the cursor, left-click-
 * drag pans — a press that moves more than a few px counts as a pan instead
 * of a click, so the picker's click-to-place still works after panning),
 * mirroring Дела's `CaseMap.tsx`. Only the map content (image, labels, pins —
 * passed as `children`) is transformed; chrome like dialog headers/footers
 * and instruction banners stays outside, as siblings of this component. */
export function TerrainMap({ children, onClick, cursor }: { children?: ReactNode; onClick?: (xPercent: number, yPercent: number) => void; cursor?: string }) {
  const [zoom, setZoom] = useState(MIN_ZOOM)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ startX: number; startY: number; panX: number; panY: number; moved: boolean; pointerId: number } | null>(null)
  const size = useElementSize(containerRef)
  const box = containBox(size.w, size.h)

  /** Keeps the scaled layer covering the container — the map sits fitted
   * (native aspect) inside that layer with sea colour around it. */
  function clampPan(nextPan: { x: number; y: number }, z: number) {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return nextPan
    const minX = rect.width * (1 - z)
    const minY = rect.height * (1 - z)
    return { x: Math.min(0, Math.max(minX, nextPan.x)), y: Math.min(0, Math.max(minY, nextPan.y)) }
  }

  function applyZoom(nextZoomRaw: number, originX: number, originY: number) {
    const clamped = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, nextZoomRaw))
    const nextZoom = clamped < 1.02 ? MIN_ZOOM : clamped
    if (nextZoom === zoom) return
    // Keep the point currently under (originX, originY) stationary on screen.
    const nextPan = { x: originX - ((originX - pan.x) / zoom) * nextZoom, y: originY - ((originY - pan.y) / zoom) * nextZoom }
    setZoom(nextZoom)
    setPan(clampPan(nextPan, nextZoom))
  }

  function handleWheel(event: WheelEvent) {
    event.preventDefault()
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    applyZoom(zoom * Math.pow(WHEEL_FACTOR, Math.max(-3, Math.min(3, -event.deltaY / 100))), event.clientX - rect.left, event.clientY - rect.top)
  }
  // Native non-passive listener: React's onWheel is passive, so it can't stop
  // the page from scrolling while the map zooms. The ref keeps the latest
  // zoom/pan without re-binding.
  const wheelRef = useRef(handleWheel)
  wheelRef.current = handleWheel
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => wheelRef.current(e)
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  /** Client point → % of the map image (the box's rect already includes the
   * pan/zoom transform). */
  function pointToPercent(clientX: number, clientY: number) {
    const rect = boxRef.current?.getBoundingClientRect()
    if (!rect || !rect.width) return { x: 50, y: 50 }
    const fx = (clientX - rect.left) / rect.width
    const fy = (clientY - rect.top) / rect.height
    return { x: Math.max(1, Math.min(99, fx * 100)), y: Math.max(1, Math.min(99, fy * 100)) }
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest('button')) return
    if (event.button !== 0) return
    dragRef.current = { startX: event.clientX, startY: event.clientY, panX: pan.x, panY: pan.y, moved: false, pointerId: event.pointerId }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    const dx = event.clientX - drag.startX
    const dy = event.clientY - drag.startY
    if (!drag.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return
    drag.moved = true
    setPan(clampPan({ x: drag.panX + dx, y: drag.panY + dy }, zoom))
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    dragRef.current = null
    if (!drag || drag.pointerId !== event.pointerId) return
    if (drag.moved) return // was a pan, not a click
    if (!onClick) return
    const { x, y } = pointToPercent(event.clientX, event.clientY)
    onClick(x, y)
  }

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="relative h-full w-full touch-none overflow-hidden"
      style={{ background: MAP_WATER, cursor: cursor ?? (dragRef.current?.moved ? 'grabbing' : 'grab') }}
    >
      <div className="absolute inset-0">
        <div ref={boxRef} className="absolute" style={{ left: pan.x + box.left * zoom, top: pan.y + box.top * zoom, width: box.w * zoom, height: box.h * zoom }}>
          <img src={MAP_SRC} alt="" className="absolute inset-0 h-full w-full" draggable={false} />
          <MapTiles left={pan.x + box.left * zoom} top={pan.y + box.top * zoom} w={box.w * zoom} h={box.h * zoom} viewW={size.w} viewH={size.h} />
          {zoom < LABELS_MAX_ZOOM && MAP_LABELS.map(([t, x, y, big]) => (
            <span key={t} className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap ${big ? 'text-[12px] font-semibold' : 'text-[11px]'}`} style={{ left: `${x}%`, top: `${y}%`, ...MAP_LABEL_STYLE }}>
              {t}
            </span>
          ))}
          {children}
        </div>
      </div>
    </div>
  )
}

export function BoloMap({ all, state, patch }: { all: Bolo[]; state: BoloUIState; patch: (p: Partial<BoloUIState>) => void }) {
  const active = all.filter((b) => statusOf(b, state.closedMap) === 'open' && (state.mapF !== 'high' || b.prio === 'high'))
  const selMap = active.find((b) => b.id === state.sel) ?? active[0]

  return (
    <div className="flex min-h-0 flex-1 flex-col px-7 pb-6 pt-3">
      <div className="flex items-end gap-3 pb-3.5">
        <div className="flex flex-1 flex-col gap-0.5">
          <div className="text-[26px] font-semibold leading-[34px]">Карта ориентировок</div>
          <div className="text-[13px]" style={{ color: C.text2 }}>
            Последнее место, где видели каждого, и маршрут по отметкам «Замечен» за 24 часа
          </div>
        </div>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => patch({ pick: 'map', pin: null })}
            className="flex h-[30px] items-center gap-1.5 whitespace-nowrap rounded-[15px] px-3 text-[13px] font-semibold hover:brightness-110"
            style={{ background: ACCENT, color: ON_ACCENT }}
          >
            <PathIcon d="M10 17.5s-5.5-5-5.5-9a5.5 5.5 0 0111 0c0 4-5.5 9-5.5 9zM10 6v5M7.5 8.5h5" className="h-3.5 w-3.5" />
            Отметить «Замечен»
          </button>
          {(['all', 'high', '24'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => patch({ mapF: f })}
              className="h-[30px] whitespace-nowrap rounded-[15px] px-3 text-[13px] hover:brightness-110"
              style={{ background: state.mapF === f ? '#FFFFFF' : C.card, color: state.mapF === f ? '#1B1B1B' : C.text, fontWeight: state.mapF === f ? 600 : 400 }}
            >
              {{ all: 'Все активные', high: 'Высокий приоритет', '24': 'За 24 часа' }[f]}
            </button>
          ))}
        </div>
      </div>
      <div className="flex min-h-0 flex-1 gap-3.5">
        <div className="relative min-w-0 flex-1 overflow-hidden rounded-[12px]">
          <TerrainMap>
            {active.map((b) => {
              const last = b.sightings[b.sightings.length - 1]
              if (!last) return null
              const on = selMap && b.id === selMap.id
              const col = b.kind === 'missing' ? TONE.blue[1] : b.prio === 'high' ? TONE.red[1] : TONE.amber[1]
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => patch({ sel: b.id })}
                  aria-label={b.title}
                  className="absolute flex -translate-x-1/2 -translate-y-full flex-col items-center gap-1 hover:brightness-110"
                  style={{ left: `${last.x}%`, top: `${last.y}%` }}
                >
                  <span className="whitespace-nowrap rounded-[6px] px-2 py-0.5 text-[11px] font-semibold" style={{ background: on ? C.btn : 'rgba(0,0,0,0.55)', color: C.text, boxShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>
                    {(b.plate || b.title) + ' · ' + last.when.split(', ')[1]}
                  </span>
                  <span className="rounded-[50%_50%_50%_0] rotate-[-45deg]" style={{ width: on ? 22 : 16, height: on ? 22 : 16, background: col, border: `2px solid ${on ? '#fff' : 'rgba(0,0,0,0.35)'}`, boxShadow: '0 2px 6px rgba(0,0,0,0.4)' }} />
                </button>
              )
            })}
          </TerrainMap>
          <div className="absolute bottom-3 left-3 flex gap-1.5">
            {[
              ['Высокий приоритет', TONE.red[1]],
              ['Средний', TONE.amber[1]],
              ['Пропавшие', TONE.blue[1]],
            ].map(([t, col]) => (
              <span key={t} className="flex h-[26px] items-center gap-1.5 rounded-[13px] px-2.5 text-[12px]" style={{ background: C.btn }}>
                <span className="h-2 w-2 rounded-full" style={{ background: col }} />
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="scroll flex w-[300px] shrink-0 flex-col gap-2 overflow-y-auto">
          {active.map((b) => {
            const last = b.sightings[b.sightings.length - 1]
            const on = selMap && b.id === selMap.id
            const col = b.kind === 'missing' ? TONE.blue[1] : b.prio === 'high' ? TONE.red[1] : TONE.amber[1]
            return (
              <button key={b.id} type="button" onClick={() => patch({ sel: b.id })} className="flex flex-col gap-1 rounded-[10px] p-2.5 text-left hover:brightness-110" style={{ background: on ? C.sel : C.card, boxShadow: on ? `inset 0 0 0 1px ${C.stroke2}` : 'none' }}>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: col }} />
                  <span className="min-w-0 flex-1 truncate font-semibold">{b.title}</span>
                  <span className="text-[12px] tabular-nums" style={{ color: C.text2 }}>
                    {b.no}
                  </span>
                </span>
                {last && (
                  <span className="truncate text-[12px]" style={{ color: C.text2 }}>
                    {last.place} · {last.when}
                  </span>
                )}
              </button>
            )
          })}
          {selMap && (
            <button type="button" onClick={() => patch({ view: 'feed', nav: 'active', sel: selMap.id })} className="h-[34px] shrink-0 rounded-[6px] text-center hover:brightness-110" style={{ background: C.btn }}>
              Открыть ориентировку
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export function BoloMapPicker({ state, patch, all, selected }: { state: BoloUIState; patch: (p: Partial<BoloUIState>) => void; all: Bolo[]; selected: Bolo }) {
  const mode = state.pick
  const target = mode === 'map' ? all.find((b) => b.id === state.sel && statusOf(b, state.closedMap) === 'open') ?? all.find((b) => statusOf(b, state.closedMap) === 'open') : mode === 'seen' ? selected : null
  const old = target?.sightings ?? []
  const place = state.pin ? nearestPlace(state.pin.x, state.pin.y) : ''
  const title = mode === 'new' ? 'Где видели последний раз' : `Замечен: ${target?.title ?? ''}`
  const sub = mode === 'new' ? 'Новая ориентировка · точка станет первой отметкой на карте' : target ? `${target.no} · серые точки — прошлые отметки` : ''

  function handleMapClick(x: number, y: number) {
    patch({ pin: { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 } })
  }

  function done() {
    const p = state.pin
    if (!p) return
    if (mode === 'new') patch({ pick: null, nPlace: { x: p.x, y: p.y, acc: state.acc } })
    else if (mode === 'seen') patch({ pick: null, seenPin: p, dlg: 'seen' })
    else {
      const t = target
      if (t) patch({ pick: null, seenPin: p, sel: t.id, view: 'feed', nav: 'active', dlg: 'seen' })
      else patch({ pick: null })
    }
  }

  return (
    <div className="absolute inset-0 z-[25] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.55)' }}>
      <div role="dialog" aria-label="Указать на карте" className="box-border flex flex-col overflow-hidden rounded-[10px]" style={{ width: 1060, height: 780, background: C.dialog, border: `1px solid ${C.stroke}`, boxShadow: '0 32px 64px rgba(0,0,0,0.55)' }}>
        <div className="flex items-center gap-3 px-5 pb-3 pt-3.5">
          <span className="flex flex-1 flex-col leading-5">
            <span className="text-[18px] font-semibold">{title}</span>
            <span className="text-[12px]" style={{ color: C.text2 }}>
              {sub}
            </span>
          </span>
          <label className="flex h-8 w-[300px] items-center gap-2 rounded-[6px] px-2.5" style={{ background: C.search, color: C.text2 }}>
            <SearchIcon />
            <input placeholder="Найти адрес или место" className="min-w-0 flex-1 bg-transparent text-[14px] outline-none" style={{ color: C.text }} />
          </label>
          <button type="button" onClick={() => patch({ pick: null, pin: null })} aria-label="Закрыть" className="flex h-8 w-8 items-center justify-center rounded-[6px] hover:bg-white/10">
            <CloseIcon />
          </button>
        </div>
        <div className="relative mx-4 min-h-0 flex-1 overflow-hidden rounded-[10px]">
          <TerrainMap onClick={handleMapClick} cursor="crosshair">
            {old.map((s, i) => (
              <span key={i} className="absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-85" style={{ left: `${s.x}%`, top: `${s.y}%`, background: '#9AA0A6', border: `2px solid ${C.mapWater}` }} />
            ))}
            {state.pin && (
              <>
                <span className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ left: `${state.pin.x}%`, top: `${state.pin.y}%`, width: ['18px', '64px', '150px'][state.acc], height: ['18px', '64px', '150px'][state.acc], background: 'rgba(96,205,255,0.14)', border: `1px dashed ${ACCENT}` }} />
                <span className="absolute h-[26px] w-[26px] -translate-x-1/2 -translate-y-full rounded-[50%_50%_50%_0] rotate-[-45deg]" style={{ left: `${state.pin.x}%`, top: `${state.pin.y}%`, background: ACCENT, border: '2px solid #fff', boxShadow: '0 3px 8px rgba(0,0,0,0.5)' }} />
              </>
            )}
          </TerrainMap>
          {!state.pin && (
            <div className="absolute left-1/2 top-3.5 flex h-[34px] -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-[17px] px-3.5 text-[13px] font-semibold" style={{ background: ACCENT, color: ON_ACCENT, boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}>
              <PathIcon d="M10 1.5v4M10 14.5v4M1.5 10h4M14.5 10h4" className="h-3.5 w-3.5" />
              Нажмите на карту, где видели
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 px-5 pb-4 pt-3.5">
          <span className="flex min-w-0 flex-1 flex-col leading-[19px]">
            <span className="text-[12px]" style={{ color: C.text2 }}>
              Место
            </span>
            <span className="truncate font-semibold" style={{ color: state.pin ? C.text : C.text2 }}>
              {state.pin ? `Рядом: ${place}${state.acc === 2 ? ' · район' : state.acc === 1 ? ' · ±200 м' : ''}` : 'Точка не выбрана'}
            </span>
          </span>
          <span className="flex flex-col gap-1">
            <span className="text-[12px]" style={{ color: C.text2 }}>
              Насколько точно
            </span>
            <span className="flex gap-0.5 rounded-[8px] p-0.5" style={{ background: C.card }}>
              {['Точно', '~200 м', 'Район'].map((t, i) => (
                <button key={t} type="button" onClick={() => patch({ acc: i })} className="h-7 whitespace-nowrap rounded-[6px] px-3 text-[13px] hover:shadow-[inset_0_0_0_999px_rgba(255,255,255,0.08)]" style={{ background: state.acc === i ? C.btn : 'transparent', fontWeight: state.acc === i ? 600 : 400 }}>
                  {t}
                </button>
              ))}
            </span>
          </span>
          <button type="button" onClick={() => patch({ pick: null, pin: null })} className="h-9 w-[110px] rounded-[6px] text-center hover:brightness-110" style={{ background: C.btn }}>
            Отмена
          </button>
          <button type="button" onClick={done} disabled={!state.pin} className="h-9 w-[150px] rounded-[6px] text-center font-semibold enabled:hover:brightness-110 disabled:opacity-50" style={{ background: state.pin ? ACCENT : C.btn, color: state.pin ? ON_ACCENT : C.text2 }}>
            {mode === 'map' ? 'Далее' : 'Готово'}
          </button>
        </div>
      </div>
    </div>
  )
}
