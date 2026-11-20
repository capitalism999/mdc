import type { CasePlaceArea, CasePlaceType, CaseTreeItem, CaseTreeNode } from '../../../types'
import { mockBolos } from '../../../lib/mockData/bolos'

/** Shared helpers for the «Места» map: types, time, author, links, BOLO layer. */

export const PLACE_TYPE_COLOR: Record<string, string> = { crime: '#E5484D', home: '#3E8EDE', find: '#E09F2D', seen: '#9B6BE0', witness: '#3FB27F', other: '#8A94A0' }
export const PLACE_TYPE_LABEL: Record<CasePlaceType, string> = { crime: 'Место преступления', home: 'Жильё', find: 'Находка', seen: 'Замечен', witness: 'Показания', other: 'Другое' }
export const PLACE_TYPE_IDS = Object.keys(PLACE_TYPE_LABEL) as CasePlaceType[]

export const ACCURACY_LABEL = ['Точно', '~200 м', 'Район'] as const
/** Accuracy circle radius, % of the map image height (200 m / a district). */
export const ACCURACY_RADIUS = [0, 1.7, 6]

/** Uncertainty zone of a place: its own `area`, else the legacy accuracy
 * preset as a circle; null = exact point. */
export function placeArea(p: CaseTreeItem): CasePlaceArea | null {
  if (p.area) return p.area.r > 0 ? p.area : null
  return p.accuracy ? { shape: 'circle', r: ACCURACY_RADIUS[p.accuracy] } : null
}

/** ~118 m per 1% of the map height (Los Santos county scale). */
export const METERS_PER_PCT = 118
export const AREA_MAX_R = 12

export function areaLabel(a: CasePlaceArea | null): string {
  if (!a || a.r <= 0) return 'Точно'
  const m = Math.round((a.r * METERS_PER_PCT) / 50) * 50
  const size = m >= 1000 ? `${(m / 1000).toFixed(1).replace('.0', '')} км` : `${Math.max(50, m)} м`
  return `${a.shape === 'square' ? 'квадрат' : 'круг'} ~${size}`
}

export const AREA_PRESETS: { label: string; r: number }[] = [
  { label: 'Точно', r: 0 },
  { label: '~200 м', r: 1.7 },
  { label: 'Район', r: 6 },
]

export const PERSON_ROLES = ['живёт', 'замечен', 'свидетель', 'работает', 'другое'] as const
export const EVIDENCE_ROLE = 'найдено здесь'

/** «DD.MM.YYYY, HH:MM» (or just the date) of a place: its own `when`, else the
 * «Когда» field («16.11, 23:40») with the record's year, else the date. */
export function placeWhen(p: CaseTreeItem): string {
  if (p.when) return p.when
  const k = p.info.find(([key]) => key === 'Когда')?.[1]
  const m = k && /(\d{2})\.(\d{2}),?\s*(\d{2}:\d{2})/.exec(k)
  if (m) return `${m[1]}.${m[2]}.${p.date.slice(6) || '2026'}, ${m[3]}`
  return p.date
}

/** Sortable number from «DD.MM.YYYY[, HH:MM]» / «DD.MM, HH:MM». */
export function timeKey(s: string): number {
  const m = /(\d{1,2})\.(\d{1,2})(?:\.(\d{4}))?(?:,?\s*(\d{1,2}):(\d{2}))?/.exec(s)
  if (!m) return 0
  const y = m[3] ? +m[3] : 2026
  return new Date(y, +m[2] - 1, +m[1], m[4] ? +m[4] : 0, m[5] ? +m[5] : 0).getTime()
}

/** Who put the pin (or found / reported the thing there). */
export function placeAuthor(p: CaseTreeItem, hints?: Record<string, string>): string {
  for (const k of ['Добавил', 'Отметил', 'Кто видел', 'Нашёл', 'Нашла', 'Осмотр', 'Источник', 'Свидетель']) {
    const v = p.info.find(([key]) => key === k)?.[1]
    if (v) {
      // «08.11, 03:00–05:30, Diana Okafor» → «Diana Okafor»
      const name = v.split(',').map((s) => s.trim()).filter((s) => /^[A-Z][a-z]+ [A-Z]/.test(s)).pop()
      return name ?? v
    }
  }
  return hints?.[p.title] ?? 'Не указан'
}

/** title → who added it, from the case journal («Добавление · Места › title»). */
export function placeAuthorHints(log: { who: string; action: string; where: string }[]): Record<string, string> {
  const out: Record<string, string> = {}
  for (const r of [...log].reverse()) if (r.action === 'Добавление' && r.where.startsWith('Места ›')) out[r.where.split(' › ').pop()!] = r.who
  return out
}

/** Places of the tree that link to record `id`, with the role. */
export function placesLinkedTo(tree: CaseTreeNode, id: string): { place: CaseTreeItem; role: string; folderId: string }[] {
  const out: { place: CaseTreeItem; role: string; folderId: string }[] = []
  const walk = (n: CaseTreeNode) => {
    for (const it of n.items ?? []) {
      const l = it.kind === 'place' ? it.placeLinks?.find((x) => x.id === id) : undefined
      if (l) out.push({ place: it, role: l.role, folderId: n.id })
    }
    n.children?.forEach(walk)
  }
  walk(tree)
  return out
}

export interface BoloPin {
  key: string
  x: number
  y: number
  /** person / vehicle of the case */
  subject: string
  boloNo: string
  place: string
  when: string
  who: string
  text: string
}

/** BOLO sightings of the case's people / vehicles (matched by name / plate). */
export function boloPinsFor(tree: CaseTreeNode): BoloPin[] {
  const subjects: { title: string; plate?: string; kind: CaseTreeItem['kind'] }[] = []
  const walk = (n: CaseTreeNode) => {
    for (const it of n.items ?? []) if (it.kind === 'person' || it.kind === 'vehicle') subjects.push({ title: it.title, plate: it.info.find(([k]) => k === 'Номер')?.[1], kind: it.kind })
    n.children?.forEach(walk)
  }
  walk(tree)
  const out: BoloPin[] = []
  const seen = new Set<string>()
  for (const s of subjects) {
    const b = mockBolos.find((x) => (s.kind === 'vehicle' ? !!s.plate && x.plate === s.plate : x.title === s.title))
    if (!b || seen.has(b.id)) continue
    seen.add(b.id)
    b.sightings.forEach((sg, i) => out.push({ key: `${b.id}-${i}`, x: sg.x, y: sg.y, subject: s.kind === 'vehicle' ? `${b.plate ?? ''} · ${b.title}` : b.title, boloNo: b.no, place: sg.place, when: sg.when, who: sg.who, text: sg.text }))
  }
  return out
}

export function nowStamp(): string {
  const d = new Date()
  const p2 = (n: number) => String(n).padStart(2, '0')
  return `${p2(d.getDate())}.${p2(d.getMonth() + 1)}.${d.getFullYear()}, ${p2(d.getHours())}:${p2(d.getMinutes())}`
}
