import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { MAP_LABEL_STYLE, MAP_SRC, MAP_WATER, MapThumb, MapTiles, containBox, useElementSize } from '../shared/sanAndreasMap'
import { createPortal } from 'react-dom'
import type { BoloVals } from './boloRuntime'
import { BoloMapViewer } from './boloViewer'

export interface TerrainApi {
  zoom: (dir: 1 | -1) => void
}

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

/** Overlay district labels: [text, x%, y%, emphasised]. */
const MAP_LABELS: [string, number, number, boolean?][] = [
  ['Paleto Bay', 46, 12.5], ['Mount Chiliad', 50, 19.5], ['Grapeseed', 68, 24.5], ['Sandy Shores', 63, 36.8],
  ['Grand Senora Desert', 58, 40.5], ['Los Santos', 44, 66, true], ['Vespucci', 30, 71],
]


/** The San Andreas map — the user's own real map image
 * (`/assets/map/los-santos.jpg`), shared by the standalone map and the map
 * picker. Native pan/zoom (scroll wheel zooms toward the cursor, left-click-
 * drag pans — a press that moves more than a few px counts as a pan instead
 * of a click, so the picker's click-to-place still works after panning),
 * mirroring Дела's `CaseMap.tsx`. Only the map content (image, labels, pins —
 * passed as `children`) is transformed; chrome like dialog headers/footers
 * and instruction banners stays outside, as siblings of this component. */
export function TerrainMap({ children, onClick, cursor, onApi, fit }: { children?: ReactNode; onClick?: (xPercent: number, yPercent: number) => void; cursor?: string; onApi?: (api: TerrainApi | null) => void; fit?: { x: number; y: number }[] }) {
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

  // `fit`: open framed on these points (as the card's thumbnail frames them), once the size is known
  const fitted = useRef(false)
  useEffect(() => {
    if (fitted.current || !fit || !fit.length || !size.w || !box.w) return
    fitted.current = true
    const xs = fit.map((p) => p.x)
    const ys = fit.map((p) => p.y)
    const spanX = ((Math.max(...xs) - Math.min(...xs)) / 100) * box.w
    const spanY = ((Math.max(...ys) - Math.min(...ys)) / 100) * box.h
    let z = 6
    if (spanX > 0) z = Math.min(z, (size.w * 0.6) / spanX)
    if (spanY > 0) z = Math.min(z, (size.h * 0.6) / spanY)
    z = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z))
    const cx = (Math.min(...xs) + Math.max(...xs)) / 200
    const cy = (Math.min(...ys) + Math.max(...ys)) / 200
    setZoom(z)
    setPan(clampPan({ x: size.w / 2 - (box.left + cx * box.w) * z, y: size.h / 2 - (box.top + cy * box.h) * z }, z))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fit, size.w, size.h, box.w])

  // the reference's «Приблизить» / «Отдалить» buttons zoom around the centre
  const zoomByRef = useRef((dir: 1 | -1) => {
    void dir
  })
  zoomByRef.current = (dir: 1 | -1) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    applyZoom(zoom * Math.pow(WHEEL_FACTOR, dir * 2), rect.width / 2, rect.height / 2)
  }
  useEffect(() => {
    if (!onApi) return
    onApi({ zoom: (dir) => zoomByRef.current(dir) })
    return () => onApi(null)
  }, [onApi])

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

const pct = (v: unknown) => parseFloat(String(v ?? '')) || 0

/** «Карта ориентировок»: pan, zoom (+/−) and opening framed on its pins. */
function FullMap({ $v, children }: { $v: BoloVals; children?: ReactNode }) {
  const pins = ($v.mapPins ?? []) as { x: string; y: string }[]
  const [fit] = useState(() => pins.map((p) => ({ x: parseFloat(p.x), y: parseFloat(p.y) })).filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y)))
  return (
    <TerrainMap onApi={$v.__mapApi} fit={fit.length ? fit : undefined}>
      {children}
    </TerrainMap>
  )
}

/**
 * Every map the reference draws (its stylised SVG landscape) is the real San
 * Andreas map here; pins and trails from the reference markup are passed as
 * `children`, positioned in % of the map image exactly as the reference
 * positions them in % of its drawing.
 * - full: the standalone «Карта ориентировок» — pan and zoom;
 * - pick: «Указать на карте» — a click drops the pin, +/− zoom;
 * - thumb: «Где замечен» in the card — framed around the sightings;
 * - seen: the «Замечен» dialog — framed around the reported point.
 */
export function BoloTerrain({ $v, mode, pts, children }: { $v: BoloVals; mode: 'full' | 'pick' | 'thumb' | 'seen'; pts?: { x: string; y: string }[]; children?: ReactNode }) {
  if (mode === 'full') return <FullMap $v={$v}>{children}</FullMap>
  if (mode === 'pick') {
    return (
      <TerrainMap onClick={(x, y) => $v.__pickAt(x, y)} cursor="crosshair" onApi={$v.__mapApi}>
        {children}
      </TerrainMap>
    )
  }
  if (mode === 'seen') {
    const p = $v.__seenPt as { x: number; y: number }
    return (
      <MapThumb points={[p]} maxZoom={6}>
        <span style={{ position: 'absolute', left: p.x + '%', top: p.y + '%', transform: 'translate(-50%, calc(-50% - 15.5px)) rotate(-45deg)', width: '22px', height: '22px', borderRadius: '50% 50% 50% 0', background: $v.accent, border: '2px solid #FFFFFF' }}></span>
        {children}
      </MapThumb>
    )
  }
  return <ThumbWithViewer $v={$v} pts={pts}>{children}</ThumbWithViewer>
}

/** «Где замечен» in the card; a click (or the expand button) opens the same
 * pins and route on the whole BOLO window (MDT addition). */
function ThumbWithViewer({ $v, pts, children }: { $v: BoloVals; pts?: { x: string; y: string }[]; children?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [host, setHost] = useState<Element | null>(null)
  const open = () => setHost(ref.current?.closest('.bolo-root') ?? null)
  const points = (pts ?? []).map((p) => ({ x: pct(p.x), y: pct(p.y) }))
  // no sightings yet: say so instead of an empty island
  if (!points.length) {
    return (
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', background: $v.c.field, color: $v.c.text2, fontSize: '13px', textAlign: 'center', padding: '0 24px' }}>
        <svg width="26" height="26" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M10 17.5s-5.5-5-5.5-9a5.5 5.5 0 0111 0c0 4-5.5 9-5.5 9z" />
          <circle cx="10" cy="8.5" r="2" />
        </svg>
        <span>Отметок пока нет. Видели — нажмите «Замечен»</span>
      </div>
    )
  }
  return (
    <div ref={ref} onClick={open} title="Открыть карту во всё окно" style={{ position: 'absolute', inset: 0, cursor: 'zoom-in' }}>
      <MapThumb points={points}>{children}</MapThumb>
      <button
        className="btn hv"
        onClick={(e) => {
          e.stopPropagation()
          open()
        }}
        aria-label="Развернуть карту"
        title="Развернуть карту"
        style={{ position: 'absolute', right: '8px', top: '8px', width: '30px', height: '30px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(32,32,32,0.85)', color: '#FFFFFF' }}
      >
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 3.5h4.5V8M8 16.5H3.5V12M16.5 3.5L11 9M3.5 16.5L9 11" />
        </svg>
      </button>
      {host
        ? createPortal(
            // portal events still bubble through React to the thumb — keep them here
            <div onClick={(e) => e.stopPropagation()} style={{ cursor: 'auto' }}>
              <BoloMapViewer $v={$v} onClose={() => setHost(null)} renderMap={(onApi, content) => <TerrainMap onApi={onApi} fit={points}>{content}</TerrainMap>} />
            </div>,
            host,
          )
        : null}
    </div>
  )
}
