import { useSyncExternalStore } from 'react'
import { mockCaseFiles, mockCaseList, CASE_PEOPLE } from '../../../lib/mockData/caseFiles'
import { mockProfile } from '../../../lib/mockData/profile'
import type { CaseAccessRole, CaseAgency, CaseFileDetail, CaseListRow, CaseTreeItem, CaseTreeNode } from '../../../types'

/**
 * Live cases shared by every window: «Дела» reads and writes them here, and
 * other modules (Заметки) see new cases, renames and access changes at once.
 * Also carries «open this case» requests, so a link from another app switches
 * an already open «Дела» window to the right case.
 */
interface CasesState {
  list: CaseListRow[]
  files: Record<string, CaseFileDetail>
  /** last «open case» request; `n` bumps so the same id can be asked again;
   * `itemId` — open the case right at this record (its folder, inspector open) */
  open: { id: string; n: number; itemId?: string } | null
  /** last «add this MDC record to a case» request (Поиск → «Добавить в дело»):
   * `caseId` null means «create a new case first» */
  add: CaseAddRequest | null
}

/** What can be added from Поиск: a person / vehicle (Участники, Транспорт),
 * a property (Места), a weapon (Улики), an organisation (Участники). */
export type CaseAddKind = 'person' | 'vehicle' | 'place' | 'weapon' | 'org'

export interface CaseAddRequest {
  caseId: string | null
  /** SEARCH_DB record id */
  recId: string
  kind: CaseAddKind
  n: number
}

let state: CasesState = { list: mockCaseList, files: mockCaseFiles, open: null, add: null }
const subs = new Set<() => void>()
const emit = () => subs.forEach((f) => f())

export function getCases(): CasesState {
  return state
}

export function setCaseList(fn: (prev: CaseListRow[]) => CaseListRow[]) {
  state = { ...state, list: fn(state.list) }
  emit()
}

export function setCaseFiles(fn: (prev: Record<string, CaseFileDetail>) => Record<string, CaseFileDetail>) {
  state = { ...state, files: fn(state.files) }
  emit()
}

export function requestOpenCase(id: string, itemId?: string) {
  state = { ...state, open: { id, n: (state.open?.n ?? 0) + 1, ...(itemId ? { itemId } : {}) } }
  emit()
}

/** Asks «Дела» to add an MDC record to a case (or to a new one): the case
 * opens with its add dialog and the record already picked. */
export function requestAddToCase(caseId: string | null, recId: string, kind: CaseAddKind): CaseAddRequest {
  const add = { caseId, recId, kind, n: (state.add?.n ?? 0) + 1 }
  state = { ...state, add }
  emit()
  return add
}

/** Cases the current user can add records to: ведущий, администратор, участник
 * (наблюдатель only writes notes, «только просмотр» changes nothing). */
export function myWritableCases(): CaseFileDetail[] {
  return Object.values(state.files).filter((f) => {
    const r = myCaseRole(f)
    return r === 'lead' || r === 'manager' || r === 'member'
  })
}

function subscribe(f: () => void) {
  subs.add(f)
  return () => {
    subs.delete(f)
  }
}

export function useCases(): CasesState {
  return useSyncExternalStore(subscribe, getCases)
}

/** Owning agency of a case (file first, then its list row; default LSPD). */
export function caseAgency(id: string): CaseAgency {
  return state.files[id]?.agency ?? state.list.find((r) => r.id === id)?.agency ?? 'lspd'
}

/** Each agency has its own case base: a case is visible to its own agency,
 * and to anyone from another agency only when they are in its access list. */
export function canSeeCase(id: string): boolean {
  return caseAgency(id) === (mockProfile.agency ?? 'lssd') || myCaseRole(state.files[id]) !== null
}

/** The active character's case list: own agency + cases shared with them;
 * «Мои дела» = cases they are on by name. */
export function visibleCaseList(list: CaseListRow[] = state.list): CaseListRow[] {
  return list.filter((r) => canSeeCase(r.id)).map((r) => ({ ...r, mine: myCaseRole(state.files[r.id]) !== null }))
}

export const AGENCY_SHORT: Record<CaseAgency, string> = { lspd: 'LSPD', lssd: 'LSSD', dao: 'Прокуратура', court: 'Суд' }
/** «3 дела · Отдел расследований LSPD» — whose case base the list is. */
export function caseDeskName(): string {
  const a = mockProfile.agency ?? 'lssd'
  return a === 'lspd' ? 'Отдел расследований LSPD' : a === 'lssd' ? 'Детективное бюро LSSD' : a === 'dao' ? 'Окружная прокуратура' : 'Superior Court · уголовная коллегия'
}

/** The current user's role in a case (by name in its access list), or null. */
export function myCaseRole(file: CaseFileDetail | undefined, me = mockProfile.name): CaseAccessRole | null {
  if (!file) return null
  const m = file.access.members.find((x) => x.name === me || CASE_PEOPLE[x.name]?.name === me)
  return m?.role ?? null
}

export interface CaseMention {
  caseId: string
  itemId: string
  /** «Участники › Подозреваемые › Marcus Tate» */
  where: string
}

/**
 * Where a record sits in a case: the first record of the case whose title,
 * subtitle, fields or note contain one of `tokens` (name, plate, serial,
 * evidence number, address…); an exact title match wins. The journal is
 * skipped. Null when the case has no such record.
 */
export function findCaseMention(caseNo: string, tokens: string[], exactTitle?: string): CaseMention | null {
  const file = Object.values(state.files).find((f) => f.no === caseNo)
  if (!file) return null
  const toks = tokens.map((t) => t.trim().toLowerCase()).filter((t) => t.length >= 3)
  const exact = exactTitle?.trim().toLowerCase()
  let best: { item: CaseTreeItem; path: string[]; score: number } | null = null
  const walk = (n: CaseTreeNode, path: string[]) => {
    if (n.view === 'log') return
    for (const it of n.items ?? []) {
      if (it.kind === 'note') continue
      const title = it.title.toLowerCase()
      const hay = [it.title, it.sub, it.note, ...it.info.map(([k, v]) => k + ' ' + v)].join(' ').toLowerCase()
      const score = exact && title === exact ? 3 : toks.some((t) => title.includes(t)) ? 2 : toks.some((t) => hay.includes(t)) ? 1 : 0
      if (score > (best?.score ?? 0)) best = { item: it, path, score }
    }
    for (const c of n.children ?? []) walk(c, [...path, c.name])
  }
  walk(file.tree, [])
  if (!best) return null
  const b = best as { item: CaseTreeItem; path: string[] }
  return { caseId: file.id, itemId: b.item.id, where: [...b.path, b.item.title].join(' › ') }
}
