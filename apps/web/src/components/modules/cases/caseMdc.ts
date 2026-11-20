import type { CaseTreeItem } from '../../../types'
import { SEARCH_BOLOREF, SEARCH_DB, SEARCH_EMPX, SEARCH_RICH, SEARCH_RICHV } from '../search/searchLogic'

/**
 * Links a case participant / vehicle to its record in the MDC database
 * (Поиск — `search/searchLogic.ts` is the single source of truth), so the
 * case inspector shows the live MDC data instead of a copy:
 * - person with an info row `['Запись MDC', code]` → DB record with that `code`;
 * - person whose title equals an employee record title → that employee;
 * - vehicle with `['Номер', plate]` → DB vehicle with that plate.
 */

export type MdcTone = 'red' | 'amber' | 'green' | 'blue' | 'grey'

export interface MdcRow {
  k: string
  v: string
  link: [string, string?] | null
  dot: MdcTone | null
}

export interface MdcRecord {
  id: string
  type: 'person' | 'vehicle' | 'weapon' | 'org' | 'place'
  title: string
  code?: string
  plate?: string
  sub?: string
  alert?: string
  alertTone?: MdcTone
  badges?: [string, MdcTone][]
  sections?: [string, MdcRow[]][]
}

export interface MdcCrime {
  date: string
  time: string
  tag: string
  charges: [string, string, string][]
  who: string
  status: string
  active: boolean
}

export interface MdcFine {
  date: string
  code: string
  name: string
  vehicle?: string
  who: string
  sum: number
  st: 'paid' | 'unpaid' | 'overdue'
}

export interface MdcPersonRich {
  banner: [string, string, string, string] | null
  orgs: [string, string][]
  phone: string
  info: [string, string, string, string][]
  gang: [string, string] | null
  strikes: number
  crimes: MdcCrime[]
  fines: MdcFine[]
  property: [string, string][]
  vehicles: [string, string, string, string, string, string][]
  weapons: [string, string, string, string][]
  docs: { kind: string; fields: [string, string][] }[]
  fp: string
  fpNote: string
  dna: string
  notes: [string, string, string, string, string][]
}

export interface MdcBolo {
  no: string
  vid?: string
  armed?: boolean
  why?: string
  instr?: string
  restricted?: boolean
  access?: string
  ct?: string
}

export interface MdcEmployee {
  full: string
  badge: string
  unit: string
  rank: string
  pos: string
  radio: string
  phone: string
  since: string
  now: string
  ftp?: string
  certs: [string, string, string, string, string][]
  gear: [string, string][]
  journal: [string, string, string, string, string][]
}

export interface MdcVehicleRich {
  owner: string
  biz: string | null
  type: string
  make: string
  model: string
  color: [string, string]
  insurance: string
  wanted?: { title: string; text: string; by: string; date?: string; tone?: MdcTone; label?: string }
  talon: string
  dmv: [string, string][]
  owners: [string, string, string, string][]
  fines: MdcFine[]
  cases: [string, string][]
}

export interface MdcLink {
  rec: MdcRecord
  rich?: MdcPersonRich
  bolo?: MdcBolo
  emp?: MdcEmployee
  veh?: MdcVehicleRich
}

const DB = SEARCH_DB as unknown as MdcRecord[]
const RICH = SEARCH_RICH as unknown as Record<string, MdcPersonRich>
const BOLO = SEARCH_BOLOREF as unknown as Record<string, MdcBolo>
const EMP = SEARCH_EMPX as unknown as Record<string, MdcEmployee>
const RICHV = SEARCH_RICHV as unknown as Record<string, MdcVehicleRich>

export function findMdc(item: CaseTreeItem): MdcLink | null {
  let rec: MdcRecord | undefined
  if (item.kind === 'person') {
    const code = item.info.find(([k]) => k === 'Запись MDC')?.[1]
    rec = code ? DB.find((r) => r.type === 'person' && r.code === code) : DB.find((r) => r.type === 'person' && r.title === item.title)
  } else if (item.kind === 'vehicle') {
    const plate = item.info.find(([k]) => k === 'Номер')?.[1]
    rec = plate ? DB.find((r) => r.type === 'vehicle' && r.plate === plate) : undefined
  }
  if (!rec) return null
  return { rec, rich: RICH[rec.id], bolo: BOLO[rec.id], emp: EMP[rec.id], veh: RICHV[rec.id] }
}

/** A DB record's section rows by section title (e.g. 'Лицензии'). */
export function mdcSection(rec: MdcRecord, title: string): MdcRow[] {
  return rec.sections?.find(([t]) => t === title)?.[1] ?? []
}

/** Record id for a name/plate shown inside MDC data (owner names, plates). */
export function mdcIdByTitle(title: string): string | null {
  return DB.find((r) => r.title === title || r.plate === title)?.id ?? null
}
