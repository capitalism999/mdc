import { useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react'

/** The San Andreas street map (the user's own Google-Maps-style render,
 * 8110×12165 source, exported at 2731×4096). It is portrait — every map view
 * keeps its native aspect ratio instead of stretching/cropping it into the
 * container, and every pin/label coordinate in the app is a percentage of
 * THIS image (x of its width, y of its height), not of the container. */
export const MAP_SRC = '/assets/map/los-santos.jpg'
/** width / height of the map image. */
export const MAP_RATIO = 8110 / 12165
/** The map's own sea colour — fills the container around the fitted image so
 * the edges are seamless. */
export const MAP_WATER = '#9CC0FA'

export function useElementSize(ref: RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ w: 0, h: 0 })
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setSize({ w: el.clientWidth, h: el.clientHeight })
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return size
}

/** The largest map-aspect box that fits inside a W×H container, centered. */
export function containBox(W: number, H: number) {
  if (W <= 0 || H <= 0) return { w: 0, h: 0, left: 0, top: 0 }
  const h = Math.min(H, W / MAP_RATIO)
  const w = h * MAP_RATIO
  return { w, h, left: (W - w) / 2, top: (H - h) / 2 }
}

/** Static (non-interactive) map thumbnail that frames the given points:
 * zooms so they all fit with some padding (a single point gets `maxZoom`),
 * centers them, and never shows past the image edge where the zoomed image is
 * bigger than the container. `children` are positioned in % of the image. */
export function MapThumb({ points, children, maxZoom = 5, pad = 0.2 }: { points: { x: number; y: number }[]; children?: ReactNode; maxZoom?: number; pad?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { w: W, h: H } = useElementSize(ref)
  const fit = containBox(W, H)
  const xs = points.map((p) => p.x)
  const ys = points.map((p) => p.y)
  const minX = xs.length ? Math.min(...xs) : 50
  const maxX = xs.length ? Math.max(...xs) : 50
  const minY = ys.length ? Math.min(...ys) : 50
  const maxY = ys.length ? Math.max(...ys) : 50
  let z = points.length ? maxZoom : 1
  const spanX = ((maxX - minX) / 100) * fit.w
  const spanY = ((maxY - minY) / 100) * fit.h
  if (spanX > 0) z = Math.min(z, (W * (1 - 2 * pad)) / spanX)
  if (spanY > 0) z = Math.min(z, (H * (1 - 2 * pad)) / spanY)
  z = Math.max(1, z)
  const bw = fit.w * z
  const bh = fit.h * z
  const cx = (((minX + maxX) / 2) / 100) * bw
  const cy = (((minY + maxY) / 2) / 100) * bh
  const left = bw >= W ? Math.min(0, Math.max(W - bw, W / 2 - cx)) : (W - bw) / 2
  const top = bh >= H ? Math.min(0, Math.max(H - bh, H / 2 - cy)) : (H - bh) / 2
  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden" style={{ background: MAP_WATER }}>
      {W > 0 && (
        <div className="absolute" style={{ left, top, width: bw, height: bh }}>
          <img src={MAP_SRC} alt="" className="absolute inset-0 h-full w-full" draggable={false} />
          {children}
        </div>
      )}
    </div>
  )
}

/** Full-resolution tiles of the source (8 × 12 grid, `public/assets/map/tiles/{row}_{col}.jpg`,
 * ~1014 px each). The base image is 4800 px wide; past that the map would
 * upscale, so above `TILE_THRESHOLD_W` displayed width only the tiles that
 * intersect the visible part of the container are mounted on top of it. */
const TILE_COLS = 8
const TILE_ROWS = 12
const TILE_THRESHOLD_W = 4200

/** Sharp tiles for a zoomed map box. `left/top/w/h` are the box's px rect
 * inside a `viewW × viewH` clipping container. Render inside the box, after
 * the base `<img>`. */
export function MapTiles({ left, top, w, h, viewW, viewH }: { left: number; top: number; w: number; h: number; viewW: number; viewH: number }) {
  if (w < TILE_THRESHOLD_W) return null
  const tiles: ReactNode[] = []
  for (let r = 0; r < TILE_ROWS; r++) {
    const y0 = top + (r / TILE_ROWS) * h
    const y1 = top + ((r + 1) / TILE_ROWS) * h
    if (y1 < 0 || y0 > viewH) continue
    for (let c = 0; c < TILE_COLS; c++) {
      const x0 = left + (c / TILE_COLS) * w
      const x1 = left + ((c + 1) / TILE_COLS) * w
      if (x1 < 0 || x0 > viewW) continue
      tiles.push(
        <img
          key={`${r}_${c}`}
          src={`/assets/map/tiles/${r}_${c}.jpg`}
          alt=""
          draggable={false}
          decoding="async"
          className="absolute"
          // +1px hides hairline seams between neighbouring tiles.
          style={{ left: x0 - left, top: y0 - top, width: x1 - x0 + 1, height: y1 - y0 + 1 }}
        />,
      )
    }
  }
  return <>{tiles}</>
}

/** Overlay place-name style: dark text with a white halo, like the map's
 * own labels, so it stays legible on the light map. */
export const MAP_LABEL_STYLE = { color: '#3C4043', textShadow: '0 0 3px #fff, 0 0 2px #fff, 0 0 1px #fff' } as const
