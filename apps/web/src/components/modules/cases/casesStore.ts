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
}

let state: CasesState = { list: mockCaseList, files: mockCaseFiles, open: null }
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
