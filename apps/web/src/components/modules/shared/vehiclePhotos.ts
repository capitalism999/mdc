/**
 * Vehicle pictures. There are no real photos of individual cars yet, so every
 * vehicle gets a side-view silhouette of its body type (sedan, pickup, van …)
 * painted in its own colour — two different cars never look the same, and no
 * car borrows another one's photo. One helper for every module: Поиск, BOLO,
 * Дела.
 */

type Body = 'sedan' | 'coupe' | 'super' | 'suv' | 'pickup' | 'van' | 'bike'

/** Model (or its last word) → body type. Unknown models are drawn as sedans. */
const BODY: Record<string, Body> = {
  bison: 'pickup', sadler: 'pickup', bobcat: 'pickup', rebel: 'pickup', sandking: 'pickup',
  speedo: 'van', burrito: 'van', rumpo: 'van', youga: 'van', pony: 'van', boxville: 'van',
  zentorno: 'super', adder: 'super', infernus: 'super', entityxf: 'super', turismo: 'super', t20: 'super', osiris: 'super',
  dominator: 'coupe', gauntlet: 'coupe', sabre: 'coupe', phoenix: 'coupe', ruiner: 'coupe', banshee: 'coupe', elegy: 'coupe', sultan: 'sedan',
  premier: 'sedan', buffalo: 'sedan', fugitive: 'sedan', stanier: 'sedan', tailgater: 'sedan', washington: 'sedan', schafter: 'sedan', oracle: 'sedan', primo: 'sedan', asea: 'sedan',
  granger: 'suv', baller: 'suv', cavalcade: 'suv', dubsta: 'suv', huntley: 'suv', landstalker: 'suv', mesa: 'suv', patriot: 'suv', fq2: 'suv', gresley: 'suv',
  bati: 'bike', akuma: 'bike', pcj: 'bike', sanchez: 'bike', faggio: 'bike', hakuchou: 'bike', double: 'bike', vader: 'bike',
}

/** Russian colour words (DMV text) → paint. */
const COLOR_WORD: [RegExp, string][] = [
  [/чёрн|черн/i, '#26282B'],
  [/бел/i, '#E8E8E4'],
  [/сер(ый|ая|ое|ебр)|графит/i, '#9AA0A6'],
  [/красн|бордов/i, '#B3261E'],
  [/жёлт|желт/i, '#E3B505'],
  [/оранж/i, '#E0731F'],
  [/зел/i, '#3F7A3A'],
  [/голуб/i, '#5AA9E6'],
  [/син/i, '#1F4E9C'],
  [/коричн|бронз/i, '#7A4E2D'],
  [/фиолет/i, '#6E4AA8'],
  [/бежев/i, '#CDB891'],
]

const SHAPES: Record<Body, { body: string; glass: string; wheels: [number, number][]; r: number }> = {
  sedan: {
    body: 'M8 62c0-8 4-13 14-15l26-5 22-16c5-3 10-4 16-4h40c7 0 12 2 17 6l18 15 22 4c7 1 9 5 9 11v8c0 3-2 5-5 5H13c-3 0-5-2-5-5z',
    glass: 'M58 42l18-13c3-2 7-3 11-3h18v16zM110 26h20c5 0 8 1 11 4l13 12h-44z',
    wheels: [[48, 70], [154, 70]], r: 13,
  },
  coupe: {
    body: 'M6 63c0-7 4-11 13-13l32-6 26-15c5-3 10-4 16-4h28c8 0 14 3 20 8l14 12 25 4c8 1 12 5 12 12v6c0 3-2 5-5 5H11c-3 0-5-2-5-5z',
    glass: 'M64 44l20-12c3-2 7-3 11-3h14v15zM114 29h14c6 0 10 2 14 6l9 9h-37z',
    wheels: [[46, 70], [156, 70]], r: 13,
  },
  super: {
    body: 'M4 66c0-6 3-9 10-11l40-9 34-15c6-3 12-4 19-4h20c9 0 16 3 23 8l18 12 21 4c6 1 9 4 9 9v7c0 3-2 5-5 5H9c-3 0-5-2-5-5z',
    glass: 'M70 47l26-12c4-2 8-3 13-3h22c6 0 11 2 15 5l11 10z',
    wheels: [[46, 72], [158, 72]], r: 12,
  },
  suv: {
    body: 'M8 64V44c0-6 3-9 9-10l20-3 18-16c3-3 7-4 12-4h64c6 0 10 2 13 6l12 15 20 3c8 1 12 5 12 12v17c0 3-2 5-5 5H13c-3 0-5-2-5-5z',
    glass: 'M44 32l14-13c2-2 5-3 8-3h22v16zM96 16h26c4 0 7 1 9 4l9 12H96z',
    wheels: [[50, 72], [156, 72]], r: 14,
  },
  pickup: {
    body: 'M6 64V48c0-5 3-8 8-8h16l18-22c3-3 6-4 10-4h36c4 0 6 2 6 5v19h88c5 0 8 3 8 8v18c0 3-2 5-5 5H11c-3 0-5-2-5-5z',
    glass: 'M38 40l16-19c2-2 4-3 7-3h29v22z',
    wheels: [[48, 72], [160, 72]], r: 14,
  },
  van: {
    body: 'M8 66V36c0-5 2-9 6-12l14-12c3-2 6-3 10-3h146c6 0 10 4 10 10v47c0 3-2 5-5 5H13c-3 0-5-2-5-5z',
    glass: 'M18 36V27l12-10c2-2 4-2 6-2h18v21z',
    wheels: [[46, 74], [160, 74]], r: 13,
  },
  bike: {
    body: 'M58 58l22-24h30l14-10h16l-8 14 26 8-6 12H104l-14 10H70z',
    glass: 'M118 26l8-6h10l-6 8z',
    wheels: [[54, 70], [152, 70]], r: 16,
  },
}

export function vehicleBody(model?: string | null): Body {
  const words = String(model || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean)
  for (let i = words.length - 1; i >= 0; i--) if (BODY[words[i]]) return BODY[words[i]]
  return 'sedan'
}

/** `#2A2A2A`, or a DMV colour word («чёрный пикап») → paint; unknown → neutral grey. */
export function vehiclePaint(color?: string | null): string {
  const c = String(color || '').trim()
  if (/^#[0-9a-f]{3,8}$/i.test(c)) return c
  for (const [re, hex] of COLOR_WORD) if (re.test(c)) return hex
  return '#8A9099'
}

/** 0…1 brightness of a #rrggbb paint */
function lum(hex: string): number {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((x) => x + x).join('') : h.slice(0, 6)
  const n = parseInt(full, 16)
  return (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255
}

function shade(hex: string, k: number): string {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((x) => x + x).join('') : h.slice(0, 6)
  const n = parseInt(full, 16)
  const ch = (s: number) => Math.max(0, Math.min(255, Math.round(((n >> s) & 255) * k)))
  return `rgb(${ch(16)},${ch(8)},${ch(0)})`
}

const cache = new Map<string, string>()

/**
 * Side-view picture of a vehicle as a data URL (viewBox 220×90, transparent
 * background — it sits on the module's own «sky» tile like the old photo).
 */
export function vehiclePhoto(model?: string | null, color?: string | null): string {
  const body = vehicleBody(model)
  const paint = vehiclePaint(color)
  const key = body + paint
  const hit = cache.get(key)
  if (hit) return hit
  const s = SHAPES[body]
  const light = paint.toLowerCase() === '#e8e8e4'
  // a dark car on the dark «sky» tile still needs a visible edge
  const edge = lum(paint) < 0.25 ? '#8A9099' : shade(paint, 0.6)
  const glass = light ? '#5B6B7A' : '#2B3946'
  const wheels = s.wheels
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${s.r}" fill="#1A1A1A"/><circle cx="${x}" cy="${y}" r="${Math.round(s.r * 0.5)}" fill="#9AA0A6"/>`)
    .join('')
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 90">` +
    `<ellipse cx="110" cy="84" rx="96" ry="4" fill="rgba(0,0,0,0.25)"/>` +
    `<path d="${s.body}" fill="${paint}" stroke="${edge}" stroke-width="2"/>` +
    `<path d="${s.glass}" fill="${glass}" opacity="0.92"/>` +
    wheels +
    `</svg>`
  const url = 'data:image/svg+xml,' + encodeURIComponent(svg)
  cache.set(key, url)
  return url
}
