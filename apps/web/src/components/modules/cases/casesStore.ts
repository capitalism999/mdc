import { useSyncExternalStore } from 'react'
import { mockCaseFiles, mockCaseList, CASE_PEOPLE } from '../../../lib/mockData/caseFiles'
import { mockProfile } from '../../../lib/mockData/profile'
import type { CaseAccessRole, CaseFileDetail, CaseListRow } from '../../../types'

/**
 * Live cases shared by every window: «Дела» reads and writes them here, and
 * other modules (Заметки) see new cases, renames and access changes at once.
 * Also carries «open this case» requests, so a link from another app switches
 * an already open «Дела» window to the right case.
 */
interface CasesState {
  list: CaseListRow[]
  files: Record<string, CaseFileDetail>
  /** last «open case» request; `n` bumps so the same id can be asked again */
  open: { id: string; n: number } | null
  /** last «add this MDC record to a case» request (Поиск → «Добавить в дело»):
   * `caseId` null means «create a new case first» */
  add: CaseAddRequest | null
}

export interface CaseAddRequest {
  caseId: string | null
  /** SEARCH_DB record id (person / vehicle) */
  recId: string
  kind: 'person' | 'vehicle'
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

export function requestOpenCase(id: string) {
  state = { ...state, open: { id, n: (state.open?.n ?? 0) + 1 } }
  emit()
}

/** Asks «Дела» to add an MDC person / vehicle to a case (or to a new one):
 * the case opens with «Добавить участника / транспорт» and the record picked. */
export function requestAddToCase(caseId: string | null, recId: string, kind: 'person' | 'vehicle'): CaseAddRequest {
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

/** The current user's role in a case (by name in its access list), or null. */
export function myCaseRole(file: CaseFileDetail | undefined, me = mockProfile.name): CaseAccessRole | null {
  if (!file) return null
  const m = file.access.members.find((x) => x.name === me || CASE_PEOPLE[x.name]?.name === me)
  return m?.role ?? null
}
