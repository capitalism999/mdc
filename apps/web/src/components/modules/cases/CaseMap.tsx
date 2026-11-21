import { Fragment, useEffect, useRef, useState, type PointerEvent } from 'react'
import type { CasePlaceArea, CaseTreeItem } from '../../../types'
import { PlaceTypeIcon } from './placeIcons'
import { MAP_LABEL_STYLE, MAP_SRC, MAP_WATER, MapTiles, containBox, useElementSize } from '../shared/sanAndreasMap'
import { AREA_MAX_R, PLACE_TYPE_COLOR, PLACE_TYPE_LABEL, areaLabel, placeArea, type BoloPin } from './casePlaces'

/** Overlay district labels: [text, x%, y%, emphasised] in % of the map image. */
const MAP_LABELS: [string, number, number, boolean?][] = [
  ['Paleto Bay', 46, 12.5], ['Mount Chiliad', 50, 19.5], ['Grapeseed', 68, 24.5], ['Alamo Sea', 57, 31.5], ['Sandy Shores', 63, 36.8],
  ['Grand Senora Desert', 58, 40.5], ['Los Santos', 44, 66, true], ['Vespucci', 30, 71],
]

const MIN_ZOOM = 1
const MAX_ZOOM = 24
/** Past this zoom the map's own printed labels are legible. */
const LABELS_MAX_ZOOM = 4
const WHEEL_FACTOR = 1.25
const BUTTON_FACTOR = 1.6
/** Pointer movement (px) below which a press+release is a click, not a drag. */
const DRAG_THRESHOLD = 4
/** Markers closer than this (px, at the current zoom) form a group. */
const GROUP_PX = 28
/** A BOLO sighting this close to a case pin attaches to it as «+N». */
const ATTACH_PX = 20
/** Groups up to this size are spread around their centre; bigger → cluster. */
const SPREAD_MAX = 3
const SPREAD_R = 15
export const BOLO_RED = '#E5484D'

export interface MapFocus {
  x: number
  y: number
  zoom?: number
  /** bump to re-trigger the same point */
  n: number
}

interface CaseMapProps {
  /** visible places, in list order (pin numbers follow it) */
  places: CaseTreeItem[]
  selectedId: string | null
  hoveredId: string | null
  onHover: (id: string | null) => void
  placing: boolean
  placingLabel: string
  /** «Расставить метки» mode: only then pins can be dragged */
  arrange: boolean
  onArrangeDone: () => void
  onArrangeStart: () => void
  draftPin: { x: number; y: number } | null
  accent: string
  legend: { type: string; count: number; hidden: boolean }[]
  onToggleType: (type: string) => void
  onStartPlacing: () => void
  onCancelPlacing: () => void
  onMapClick: (xPercent: number, yPercent: number) => void
  onPickPin: (id: string) => void
  onMovePin: (id: string, xPercent: number, yPercent: number) => void
  /** zone being edited in the place card: drawn with a resize handle */
  areaDraft: (CasePlaceArea & { id: string }) | null
  onAreaDraft: (d: (CasePlaceArea & { id: string }) | null) => void
  /** places in time order to connect, or null */
  heatmap: boolean
  boloPins: BoloPin[]
  /** BOLO sighting whose card is open */
  activeBolo: string | null
  onActiveBolo: (key: string | null) => void
  onOpenBolo: (no?: string) => void
  focus: MapFocus | null
}

type Entry = { kind: 'place'; id: string; p: CaseTreeItem; n: number; x: number; y: number; sx: number; sy: number } | { kind: 'bolo'; id: string; b: BoloPin; x: number; y: number; sx: number; sy: number }

/** BOLO sighting marker: round «B» badge with a dashed ring (not a teardrop). */
function BoloBadge({ size = 20, active }: { size?: number; active?: boolean }) {
  return (
    <span className="relative flex items-center justify-center rounded-full" style={{ width: size, height: size }}>
      <span className="absolute -inset-[4px] rounded-full border-[1.5px] border-dashed" style={{ borderColor: BOLO_RED, background: 'rgba(229,72,77,0.15)' }} />
      <span className="relative flex h-full w-full items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: BOLO_RED, border: `2px solid ${active ? '#FFFFFF' : '#FFE1E2'}` }}>
        B
      </span>
    </span>
  )
}

/** The Места map: the real San Andreas map (portrait, native aspect), pan &
 * zoom, numbered pins (drag to move), close markers spread apart or merged
 * into clusters, BOLO sightings (own «B» marker; one sitting on a case pin
 * shows as «+N» on it), accuracy circles, a heatmap and
 * the «поставить метку» flow. */
export function CaseMap(props: CaseMapProps) {
  const { arrange, onArrangeDone, onArrangeStart, areaDraft, onAreaDraft, places, selectedId, hoveredId, onHover, placing, placingLabel, draftPin, accent, legend, onToggleType, onStartPlacing, onCancelPlacing, onMapClick, onPickPin, onMovePin, heatmap, boloPins, activeBolo, onActiveBolo, onOpenBolo, focus } = props
  const [zoom, setZoom] = useState(MIN_ZOOM)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const size = useElementSize(containerRef)
  const box = containBox(size.w, size.h)
  const dragRef = useRef<{ startX: number; startY: number; panX: number; panY: number; moved: boolean; pointerId: number } | null>(null)
  const pinDrag = useRef<{ id: string; startX: number; startY: number; pointerId: number; moved: boolean } | null>(null)
  const [dragPos, setDragPos] = useState<{ id: string; x: number; y: number } | null>(null)
  /** case pin whose «place + BOLO sightings» popover is open */
  const [pinMenu, setPinMenu] = useState<string | null>(null)

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
    const nextPan = { x: originX - ((originX - pan.x) / zoom) * nextZoom, y: originY - ((originY - pan.y) / zoom) * nextZoom }
    setZoom(nextZoom)
    setPan(clampPan(nextPan, nextZoom))
  }

  /** Centre the map on a map-% point at zoom `z`. */
  function centerOn(x: number, y: number, z: number) {
    const nz = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z))
    const bx = box.left + (x / 100) * box.w
    const by = box.top + (y / 100) * box.h
    setZoom(nz)
    setPan(clampPan({ x: size.w / 2 - bx * nz, y: size.h / 2 - by * nz }, nz))
  }

  useEffect(() => {
    if (focus && size.w) centerOn(focus.x, focus.y, Math.max(zoom, focus.zoom ?? 3))
    // only when a new focus request arrives
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus?.n])

  function zoomByStep(direction: 1 | -1) {
    applyZoom(direction > 0 ? zoom * BUTTON_FACTOR : zoom / BUTTON_FACTOR, size.w / 2, size.h / 2)
  }

  // The map captures the wheel completely: React's onWheel is passive (can't
  // preventDefault → the page scrolled too), so use a native non-passive
  // listener that always calls the latest zoom logic through a ref.
  const wheelRef = useRef<(e: globalThis.WheelEvent) => void>(() => {})
  wheelRef.current = (event) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    applyZoom(zoom * Math.pow(WHEEL_FACTOR, Math.max(-3, Math.min(3, -event.deltaY / 100))), event.clientX - rect.left, event.clientY - rect.top)
  }
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onWheel = (e: globalThis.WheelEvent) => {
      e.preventDefault()
      e.stopPropagation()
      wheelRef.current(e)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  function pointToPercent(clientX: number, clientY: number) {
    const rect = boxRef.current?.getBoundingClientRect()
    if (!rect || !rect.width) return { x: 50, y: 50 }
    return { x: Math.max(1, Math.min(99, ((clientX - rect.left) / rect.width) * 100)), y: Math.max(1, Math.min(99, ((clientY - rect.top) / rect.height) * 100)) }
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest('button, [data-map-ui]')) return
    if (event.button !== 0) return
    onActiveBolo(null)
    setPinMenu(null)
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
    if (!drag || drag.pointerId !== event.pointerId || drag.moved || !placing) return
    const { x, y } = pointToPercent(event.clientX, event.clientY)
    onMapClick(x, y)
  }

  // ── layout of markers: attach, spread, cluster ──────────────────────────
  const posOf = (p: CaseTreeItem) => (dragPos?.id === p.id ? { x: dragPos.x, y: dragPos.y } : { x: p.px ?? 50, y: p.py ?? 50 })
  const toScreen = (x: number, y: number) => ({ sx: pan.x + (box.left + (x / 100) * box.w) * zoom, sy: pan.y + (box.top + (y / 100) * box.h) * zoom })
  const placeEntries: Entry[] = places.map((p, i) => {
    const { x, y } = posOf(p)
    return { kind: 'place', id: p.id, p, n: i + 1, x, y, ...toScreen(x, y) }
  })
  /** BOLO sightings stacked on a case pin → shown as «+N» on that pin */
  const attached = new Map<string, BoloPin[]>()
  const freeBolo: Entry[] = []
  for (const b of boloPins) {
    const s = toScreen(b.x, b.y)
    let best: Entry | null = null
    let bd = ATTACH_PX
    for (const e of placeEntries) {
      const d = Math.hypot(e.sx - s.sx, e.sy - s.sy)
      if (d < bd) {
        bd = d
        best = e
      }
    }
    if (best) attached.set(best.id, [...(attached.get(best.id) ?? []), b])
    else freeBolo.push({ kind: 'bolo', id: b.key, b, x: b.x, y: b.y, ...s })
  }
  const groups: Entry[][] = []
  const fixed: Entry[] = []
  /** selected / open markers never hide inside a cluster */
  const keep = (e: Entry) => e.id === selectedId || e.id === activeBolo
  for (const e of [...placeEntries, ...freeBolo]) {
    if (e.id === dragPos?.id) {
      fixed.push(e)
      continue
    }
    const g = groups.find((m) => {
      const cx = m.reduce((s, q) => s + q.sx, 0) / m.length
      const cy = m.reduce((s, q) => s + q.sy, 0) / m.length
      return Math.hypot(cx - e.sx, cy - e.sy) < GROUP_PX
    })
    if (g) g.push(e)
    else groups.push([e])
  }
  const offset = new Map<string, { dx: number; dy: number }>()
  const singles: Entry[] = [...fixed]
  const clusters: Entry[][] = []
  for (const all of groups) {
    let g = all
    if (all.length > SPREAD_MAX && all.some(keep)) {
      singles.push(...all.filter(keep))
      g = all.filter((e) => !keep(e))
    }
    if (g.length === 0) continue
    if (g.length === 1) singles.push(g[0])
    else if (g.length <= SPREAD_MAX) {
      g.forEach((e, i) => {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / g.length
        offset.set(e.id, { dx: Math.cos(a) * SPREAD_R, dy: Math.sin(a) * SPREAD_R })
        singles.push(e)
      })
    } else clusters.push(g)
  }

  function openCluster(c: Entry[]) {
    const cx = c.reduce((s, e) => s + e.x, 0) / c.length
    const cy = c.reduce((s, e) => s + e.y, 0) / c.length
    let minD = Infinity
    for (let i = 0; i < c.length; i++) for (let j = i + 1; j < c.length; j++) minD = Math.min(minD, Math.hypot(c[i].sx - c[j].sx, c[i].sy - c[j].sy))
    const need = minD > 0 ? (zoom * (GROUP_PX + 14)) / minD : zoom * 3
    centerOn(cx, cy, Math.max(zoom * 2, need))
  }


  // ── pin drag ────────────────────────────────────────────────────────────
  function pinDown(e: PointerEvent<HTMLButtonElement>, id: string) {
    if (e.button !== 0) return
    e.stopPropagation()
    pinDrag.current = { id, startX: e.clientX, startY: e.clientY, pointerId: e.pointerId, moved: false }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  function pinMove(e: PointerEvent<HTMLButtonElement>) {
    const d = pinDrag.current
    if (!d || d.pointerId !== e.pointerId) return
    // pins move only in «Расставить метки» mode — no accidental drags
    if (!arrange) return
    if (!d.moved && Math.hypot(e.clientX - d.startX, e.clientY - d.startY) < DRAG_THRESHOLD) return
    d.moved = true
    const { x, y } = pointToPercent(e.clientX, e.clientY)
    setDragPos({ id: d.id, x, y })
  }
  function pinUp(e: PointerEvent<HTMLButtonElement>) {
    const d = pinDrag.current
    pinDrag.current = null
    if (!d || d.pointerId !== e.pointerId) return
    if (d.moved && dragPos) onMovePin(d.id, Math.round(dragPos.x * 10) / 10, Math.round(dragPos.y * 10) / 10)
    else if (attached.has(d.id)) {
      onActiveBolo(null)
      setPinMenu(pinMenu === d.id ? null : d.id)
    } else onPickPin(d.id)
    setDragPos(null)
  }

  const pxPerPctH = (box.h * zoom) / 100
  const bolo = boloPins.find((b) => b.key === activeBolo)
  const menuEntry = placeEntries.find((e) => e.id === pinMenu)
  /** Popover anchored at a map point: below it, or above when the point is in
   * the lower half of the view (so it never runs off the map's bottom edge). */
  const popAt = (x: number, y: number, sy: number, below: number, above: number) =>
    sy > size.h / 2 ? { left: `${x}%`, top: `calc(${y}% - ${above}px)`, transform: 'translate(-50%, -100%)' } : { left: `${x}%`, top: `calc(${y}% + ${below}px)`, transform: 'translateX(-50%)' }
  const tr = (id: string) => {
    const o = offset.get(id)
    return o ? ` translate(${o.dx}px, ${o.dy}px)` : ''
  }

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="relative h-[440px] touch-none overflow-hidden rounded-[12px]"
      style={{ background: MAP_WATER, cursor: placing ? 'crosshair' : dragRef.current?.moved ? 'grabbing' : 'grab', boxShadow: placing ? `inset 0 0 0 2px ${accent}` : 'none' }}
    >
      <div className="absolute inset-0">
        <div ref={boxRef} className="absolute" style={{ left: pan.x + box.left * zoom, top: pan.y + box.top * zoom, width: box.w * zoom, height: box.h * zoom }}>
          <img src={MAP_SRC} alt="" className="absolute inset-0 h-full w-full" draggable={false} />
          <MapTiles left={pan.x + box.left * zoom} top={pan.y + box.top * zoom} w={box.w * zoom} h={box.h * zoom} viewW={size.w} viewH={size.h} />
          {zoom < LABELS_MAX_ZOOM &&
            MAP_LABELS.map(([t, x, y, big]) => (
              <span key={t} className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap ${big ? 'text-[12px] font-semibold' : 'text-[11px]'}`} style={{ left: `${x}%`, top: `${y}%`, ...MAP_LABEL_STYLE }}>
                {t}
              </span>
            ))}

          {/* heatmap */}
          {heatmap &&
            places.map((p) => {
              const { x, y } = posOf(p)
              return (
                <span
                  key={`h-${p.id}`}
                  className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{ left: `${x}%`, top: `${y}%`, width: 130, height: 130, background: 'radial-gradient(circle, rgba(232,17,35,0.55) 0%, rgba(255,140,0,0.32) 35%, rgba(255,200,0,0.12) 55%, transparent 70%)' }}
                />
              )
            })}

          {/* uncertainty zones (circle / square); the one being edited gets a resize handle */}
          {[...places, ...(draftPin && areaDraft?.id === 'new' ? [{ id: 'new', kind: 'place', title: '', sub: '', status: '', tone: 'grey', date: '', info: [], note: '', px: draftPin.x, py: draftPin.y } as CaseTreeItem] : [])].map((p) => {
            const draft = areaDraft?.id === p.id ? areaDraft : null
            const a = draft ? (draft.r > 0 ? draft : null) : placeArea(p)
            if (!a && !draft) return null
            const { x, y } = posOf(p)
            const rpx = (a?.r ?? 0) * pxPerPctH
            const col = p.id === 'new' ? accent : p.placeType ? PLACE_TYPE_COLOR[p.placeType] : '#2E8B57'
            return (
              <Fragment key={`a-${p.id}`}>
                {a && (
                  <span
                    className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      width: rpx * 2,
                      height: rpx * 2,
                      borderRadius: a.shape === 'square' ? 6 : '50%',
                      background: `${col}${draft ? '33' : '22'}`,
                      border: `${draft ? 2 : 1.5}px dashed ${col}`,
                      opacity: draft || p.id === selectedId || p.id === hoveredId ? 1 : 0.7,
                    }}
                  />
                )}
                {draft && (
                  <span
                    role="slider"
                    aria-label="Размер зоны"
                    aria-valuemin={0}
                    aria-valuemax={AREA_MAX_R}
                    aria-valuenow={Math.round(draft.r * 10) / 10}
                    data-map-ui
                    title="Тяните, чтобы изменить размер зоны"
                    onPointerDown={(e) => {
                      e.stopPropagation()
                      e.currentTarget.setPointerCapture(e.pointerId)
                    }}
                    onPointerMove={(e) => {
                      if (!e.currentTarget.hasPointerCapture(e.pointerId)) return
                      const pt = pointToPercent(e.clientX, e.clientY)
                      const dx = (pt.x - x) * (box.w / box.h)
                      const dy = pt.y - y
                      const r = draft.shape === 'square' ? Math.max(Math.abs(dx), Math.abs(dy)) : Math.hypot(dx, dy)
                      onAreaDraft({ ...draft, r: Math.max(0, Math.min(AREA_MAX_R, Math.round(r * 10) / 10)) })
                    }}
                    onPointerUp={(e) => e.currentTarget.releasePointerCapture(e.pointerId)}
                    className="absolute z-[5] flex cursor-ew-resize items-center gap-1.5"
                    style={{ left: `${x}%`, top: `${y}%`, transform: `translate(${Math.max(rpx, 26) - 8}px, -50%)` }}
                  >
                    <span className="h-4 w-4 rounded-full border-2 border-white shadow-[0_1px_4px_rgba(0,0,0,0.5)]" style={{ background: col }} />
                    <span className="whitespace-nowrap rounded-[6px] bg-[#1F1F1F]/90 px-1.5 py-0.5 text-[11px] font-semibold text-white">{areaLabel(a)}</span>
                  </span>
                )}
              </Fragment>
            )
          })}


          {draftPin && (
            <span className="pointer-events-none absolute z-[3] flex -translate-x-1/2 -translate-y-full" style={{ left: `${draftPin.x}%`, top: `${draftPin.y}%` }}>
              <span className="flex h-[30px] w-[30px] rotate-[-45deg] items-center justify-center rounded-[50%_50%_50%_0] border-2 border-dashed border-white" style={{ background: accent }}>
                <span className="rotate-45 text-[14px] font-bold text-black">+</span>
              </span>
            </span>
          )}

          {/* clusters (case pins + BOLO sightings) */}
          {clusters.map((c, i) => {
            const x = c.reduce((s, e) => s + e.x, 0) / c.length
            const y = c.reduce((s, e) => s + e.y, 0) / c.length
            const hot = c.some((e) => e.id === hoveredId)
            const stuck = c.flatMap((e) => attached.get(e.id) ?? [])
            const nBolo = c.filter((e) => e.kind === 'bolo').length + stuck.length
            const total = c.length + stuck.length
            return (
              <button
                key={`c-${i}`}
                type="button"
                data-map-ui
                aria-label={`${total} меток рядом — приблизить`}
                title={[...c.map((e) => (e.kind === 'place' ? `${e.n}. ${e.p.title}` : `BOLO · ${e.b.subject}, ${e.b.when}`)), ...stuck.map((b) => `BOLO · ${b.subject}, ${b.when}`)].join('\n')}
                onClick={(e) => {
                  e.stopPropagation()
                  openCluster(c)
                }}
                className="absolute z-[2] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[13px] font-bold text-white transition-transform hover:scale-110"
                style={{ left: `${x}%`, top: `${y}%`, width: 34, height: 34, background: '#2B3A55', border: '2px solid #FFFFFF', boxShadow: hot ? `0 0 0 4px ${accent}88, 0 2px 8px rgba(0,0,0,0.45)` : '0 2px 8px rgba(0,0,0,0.45)' }}
              >
                {total}
                {nBolo > 0 && <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold text-white" style={{ background: BOLO_RED, border: '1.5px solid #FFFFFF' }}>B{nBolo > 1 ? nBolo : ''}</span>}
              </button>
            )
          })}

          {/* single markers */}
          {singles.map((e) => {
            if (e.kind === 'bolo') {
              const on = e.id === activeBolo
              return (
                <button
                  key={e.id}
                  type="button"
                  data-map-ui
                  aria-label={`Отметка BOLO: ${e.b.subject}, ${e.b.when}`}
                  title={`BOLO ${e.b.boloNo} · ${e.b.subject}\n${e.b.when} · ${e.b.place}\nОтметил ${e.b.who}`}
                  onClick={(ev) => {
                    ev.stopPropagation()
                    setPinMenu(null)
                    onActiveBolo(on ? null : e.id)
                  }}
                  className="group/b absolute cursor-pointer"
                  style={{ left: `${e.x}%`, top: `${e.y}%`, transform: `translate(-50%, -50%)${tr(e.id)}`, zIndex: on ? 5 : 3 }}
                >
                  <span className={`block rounded-full transition-[transform,box-shadow] duration-150 group-hover/b:-translate-y-0.5 group-hover/b:scale-110 group-hover/b:shadow-[0_6px_14px_rgba(0,0,0,0.45)] ${on ? 'scale-110 shadow-[0_6px_14px_rgba(0,0,0,0.45)]' : 'shadow-[0_2px_6px_rgba(0,0,0,0.35)]'}`}>
                    <BoloBadge active={on} />
                  </span>
                </button>
              )
            }
            const { p, n, x, y } = e
            const on = p.id === selectedId
            const hot = p.id === hoveredId
            const s = on ? 30 : hot ? 28 : 24
            const extra = attached.get(p.id)
            return (
              <button
                key={p.id}
                type="button"
                data-map-ui
                aria-label={`${n}. ${p.title}${extra ? `, ещё отметок BOLO: ${extra.length}` : ''}`}
                title={extra ? `${p.title} + отметки BOLO (${extra.length}) — нажмите, чтобы выбрать` : arrange ? `${p.title} — перетащите, чтобы переставить` : p.title}
                onPointerDown={(ev) => pinDown(ev, p.id)}
                onPointerMove={pinMove}
                onPointerUp={pinUp}
                onKeyDown={(ev) => ev.key === 'Enter' && (extra ? setPinMenu(p.id) : onPickPin(p.id))}
                onMouseEnter={() => onHover(p.id)}
                onMouseLeave={() => onHover(null)}
                className="absolute flex flex-col items-center"
                style={{ left: `${x}%`, top: `${y}%`, transform: `translate(-50%, -100%)${tr(p.id)}`, zIndex: on || hot || dragPos?.id === p.id ? 4 : 2, cursor: dragPos?.id === p.id ? 'grabbing' : arrange ? 'grab' : 'pointer' }}
              >
                <span
                  className="flex rotate-[-45deg] items-center justify-center rounded-[50%_50%_50%_0] transition-[width,height]"
                  style={{ width: s, height: s, background: p.placeType ? PLACE_TYPE_COLOR[p.placeType] : '#2E8B57', border: on ? '3px solid #FFFFFF' : '2px solid #FFFFFF', boxShadow: hot && !on ? `0 0 0 3px ${accent}, 0 2px 6px rgba(0,0,0,0.4)` : '0 2px 6px rgba(0,0,0,0.4)' }}
                >
                  <span className="rotate-45 text-white">
                    <PlaceTypeIcon type={p.placeType} size={Math.round(s * 0.5)} strokeWidth={2.2} />
                  </span>
                </span>
                {extra && (
                  <span className="absolute -right-3 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold text-white shadow-[0_1px_4px_rgba(0,0,0,0.4)]" style={{ background: BOLO_RED, border: '1.5px solid #FFFFFF' }}>
                    +{extra.length}
                  </span>
                )}
              </button>
            )
          })}

          {/* popover: a case pin with BOLO sightings on top of it */}
          {menuEntry && menuEntry.kind === 'place' && (
            <div
              data-map-ui
              className="absolute z-[8] w-[240px] rounded-[10px] border border-[#3A3A3A] bg-[#2C2C2C] p-1 text-left text-white shadow-[0_10px_28px_rgba(0,0,0,0.5)]"
              style={popAt(menuEntry.x, menuEntry.y, menuEntry.sy, 8, 40)}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <div className="px-2.5 pb-1 pt-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#9A9A9A]">В этой точке</div>
              <button
                type="button"
                onClick={() => {
                  setPinMenu(null)
                  onPickPin(menuEntry.id)
                }}
                className="flex w-full items-center gap-2.5 rounded-[6px] px-2.5 py-2 text-left hover:bg-white/[0.06]"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: menuEntry.p.placeType ? PLACE_TYPE_COLOR[menuEntry.p.placeType] : '#2E8B57' }}>
                  {menuEntry.n}
                </span>
                <span className="min-w-0 flex-1 leading-[16px]">
                  <span className="block truncate text-[13px] font-semibold">{menuEntry.p.title}</span>
                  <span className="block text-[11px] text-[#9A9A9A]">Метка дела · {menuEntry.p.placeType ? PLACE_TYPE_LABEL[menuEntry.p.placeType] : ''}</span>
                </span>
              </button>
              {(attached.get(menuEntry.id) ?? []).map((b) => (
                <button
                  key={b.key}
                  type="button"
                  onClick={() => {
                    setPinMenu(null)
                    onActiveBolo(b.key)
                  }}
                  className="flex w-full items-center gap-2.5 rounded-[6px] px-2.5 py-2 text-left hover:bg-white/[0.06]"
                >
                  <span className="shrink-0 px-[3px]">
                    <BoloBadge size={18} />
                  </span>
                  <span className="min-w-0 flex-1 leading-[16px]">
                    <span className="block truncate text-[13px] font-semibold">{b.subject}</span>
                    <span className="block truncate text-[11px] text-[#9A9A9A]">
                      BOLO {b.boloNo} · {b.when}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* BOLO sighting card */}
          {bolo && (
            <div
              data-map-ui
              className="absolute z-[8] w-[230px] rounded-[10px] border border-[#3A3A3A] bg-[#2C2C2C] p-3 text-left text-[12px] text-white shadow-[0_10px_28px_rgba(0,0,0,0.5)]"
              style={popAt(bolo.x, bolo.y, toScreen(bolo.x, bolo.y).sy, 16, 16)}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <div className="mb-1 flex items-center gap-1.5">
                <span className="rounded-[4px] bg-white/[0.08] px-1 text-[10px] font-semibold uppercase tracking-wide text-[#9A9A9A]">авто</span>
                <span className="font-semibold text-[#FF99A4]">BOLO {bolo.boloNo}</span>
                <span className="flex-1" />
                <button type="button" onClick={() => onActiveBolo(null)} aria-label="Закрыть" className="flex h-5 w-5 items-center justify-center rounded-[4px] text-[#C2C2C2] hover:bg-white/10 hover:text-white">
                  <svg width="9" height="9" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                    <path d="M5 5l10 10M15 5L5 15" />
                  </svg>
                </button>
              </div>
              <div className="text-[13px] font-semibold">{bolo.subject}</div>
              <div className="text-[#C2C2C2]">
                {bolo.when} · {bolo.place}
              </div>
              <div className="mt-1 leading-[17px]">{bolo.text}</div>
              <div className="mt-1 text-[#C2C2C2]">Отметил {bolo.who}</div>
              <button type="button" onClick={() => onOpenBolo(bolo.boloNo)} className="mt-2 h-7 w-full rounded-[6px] bg-[#3A3A3A] text-[12px] hover:brightness-125">
                Открыть ориентировку
              </button>
            </div>
          )}
        </div>
      </div>

      {legend.length > 0 && (
        <div data-map-ui className="absolute bottom-3 left-3 z-[7] flex max-w-[calc(100%-64px)] flex-wrap gap-1">
          {legend.map(({ type, count, hidden }) => (
            <button
              key={type}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onToggleType(type)
              }}
              title={hidden ? 'Показать' : 'Скрыть'}
              style={{ opacity: hidden ? 0.45 : 1 }}
              className="flex h-[26px] items-center gap-1.5 rounded-full bg-[#2C2C2C]/90 px-2.5 text-[12px] text-white hover:brightness-125"
            >
              <span style={{ color: PLACE_TYPE_COLOR[type] }}>
                <PlaceTypeIcon type={type} size={12} strokeWidth={2.4} />
              </span>
              {PLACE_TYPE_LABEL[type as keyof typeof PLACE_TYPE_LABEL]} · {count}
            </button>
          ))}
        </div>
      )}

      {/* map editing actions: put a new pin / rearrange existing ones */}
      {!placing && !draftPin && !arrange && (
        <div data-map-ui className="absolute left-3 top-3 z-[7] flex overflow-hidden rounded-[8px] bg-[#2C2C2C]/95 text-[13px] text-white shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onStartPlacing()
            }}
            className="flex h-8 items-center gap-1.5 px-3 hover:bg-white/10"
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round">
              <path d="M10 17.5s-5.5-5-5.5-9a5.5 5.5 0 0111 0c0 4-5.5 9-5.5 9z" />
              <path d="M10 6v5M7.5 8.5h5" />
            </svg>
            Поставить метку
          </button>
          <span className="my-1.5 w-px bg-white/15" />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onArrangeStart()
            }}
            title="Перетаскивать метки по карте"
            className="flex h-8 items-center gap-1.5 px-3 hover:bg-white/10"
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M10 2v16M2 10h16M10 2L7.5 4.5M10 2l2.5 2.5M10 18l-2.5-2.5M10 18l2.5-2.5M2 10l2.5-2.5M2 10l2.5 2.5M18 10l-2.5-2.5M18 10l-2.5 2.5" />
            </svg>
            Расставить
          </button>
        </div>
      )}
      {arrange && !placing && (
        <div data-map-ui className="absolute left-3 right-3 top-3 z-[7] flex h-9 items-center gap-2 rounded-[8px] pl-3 pr-1.5 text-[13px] font-semibold text-black" style={{ background: accent }}>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10 2v16M2 10h16M10 2L7.5 4.5M10 2l2.5 2.5M10 18l-2.5-2.5M10 18l2.5-2.5M2 10l2.5-2.5M2 10l2.5 2.5M18 10l-2.5-2.5M18 10l-2.5 2.5" />
          </svg>
          <span className="min-w-0 flex-1 truncate">Режим расстановки — перетаскивайте метки</span>
          <button type="button" onClick={(e) => { e.stopPropagation(); onArrangeDone() }} className="h-[26px] rounded-[6px] bg-black/15 px-2.5 text-[12px] hover:bg-black/25">
            Готово
          </button>
        </div>
      )}
      {placing && (
        <div data-map-ui className="absolute left-3 right-3 top-3 z-[7] flex h-9 items-center gap-2 rounded-[8px] pl-3 pr-1.5 text-[13px] font-semibold text-black" style={{ background: accent }}>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="10" cy="10" r="6" />
            <path d="M10 1.5v4M10 14.5v4M1.5 10h4M14.5 10h4" />
          </svg>
          <span className="min-w-0 flex-1 truncate">{placingLabel}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onCancelPlacing()
            }}
            className="h-[26px] rounded-[6px] bg-black/15 px-2.5 text-[12px] hover:bg-black/25"
          >
            Отмена
          </button>
        </div>
      )}

      <div data-map-ui className="absolute bottom-3 right-3 z-[7] flex flex-col overflow-hidden rounded-[8px] bg-[#2C2C2C]/95">
        <button
          type="button"
          aria-label="Приблизить"
          disabled={zoom >= MAX_ZOOM}
          onClick={(e) => {
            e.stopPropagation()
            zoomByStep(1)
          }}
          className="flex h-8 w-8 items-center justify-center text-white hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M10 4v12M4 10h12" />
          </svg>
        </button>
        <span className="h-px bg-white/15" />
        <button
          type="button"
          aria-label="Отдалить"
          disabled={zoom <= MIN_ZOOM}
          onClick={(e) => {
            e.stopPropagation()
            zoomByStep(-1)
          }}
          className="flex h-8 w-8 items-center justify-center text-white hover:bg-white/10 disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 10h12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
