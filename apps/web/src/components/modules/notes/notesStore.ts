import { useSyncExternalStore } from 'react'
import { apps } from '../../../data/apps'
import { mockProfile } from '../../../lib/mockData/profile'
import { mockStandaloneNotes } from '../../../lib/mockData/standaloneNotes'
import type { OfficerNote } from '../../../types'
import { useWindowManager } from '../../../windows/WindowManagerContext'

/**
 * Officer notes shared by every window: «Заметки» edits them here, and «Дела»
 * reads the ones attached to a case (as a file in one of its folders). Holds
 * other officers' notes too — they're only reachable through a case and open
 * read-only. Also carries «open this note» requests (like casesStore).
 */
interface NotesState {
  notes: OfficerNote[]
  open: { id: string; n: number } | null
}

let state: NotesState = { notes: mockStandaloneNotes, open: null }
const subs = new Set<() => void>()
const emit = () => subs.forEach((f) => f())

export function getNotesState(): NotesState {
  return state
}

export function setNotes(fn: (prev: OfficerNote[]) => OfficerNote[]) {
  state = { ...state, notes: fn(state.notes) }
  emit()
}

export function requestOpenNote(id: string) {
  state = { ...state, open: { id, n: (state.open?.n ?? 0) + 1 } }
  emit()
}

function subscribe(f: () => void) {
  subs.add(f)
  return () => {
    subs.delete(f)
  }
}

export function useNotesState(): NotesState {
  return useSyncExternalStore(subscribe, getNotesState)
}

/** Author shown on a note: «12D3 Thorne Watts» / «Dept. 3 Eleanor Harper» → the name (the badge goes). */
export function noteAuthorName(n: OfficerNote): string {
  return n.author.replace(/^(?:Dept\.\s*\d+\s+|\S*\d\S*\s+)/, '')
}

export function isMyNote(n: OfficerNote, me = mockProfile.name): boolean {
  return noteAuthorName(n) === me || n.author.endsWith(' ' + me)
}

const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']

/** `time` / `dateFull` of a note written now: «Сегодня, 14:05» and
 * «21 ноября 2026 г. в 14:05» (same forms as the mock notes). */
export function nowStamps(d = new Date()): { time: string; dateFull: string } {
  const hm = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  return { time: `Сегодня, ${hm}`, dateFull: `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()} г. в ${hm}` }
}

/** The order the list shows notes in: pinned, then Сегодня / Вчера / Ранее. */
export function displayOrder(list: OfficerNote[]): OfficerNote[] {
  const rank = (n: OfficerNote) => (n.isPinned ? 0 : n.time.startsWith('Сегодня') ? 1 : n.time.startsWith('Вчера') ? 2 : 3)
  return list.map((n, i) => ({ n, i })).sort((a, b) => rank(a.n) - rank(b.n) || a.i - b.i).map((x) => x.n)
}

let copySeq = 0
/** copy id → the note it was copied from (so a second «Сделать себе копию»
 * opens the copy already made instead of piling up duplicates) */
const copySource = new Map<string, string>()

/** The current user's copy of note `id`, if they made one and still have it. */
export function findMyCopy(id: string): OfficerNote | undefined {
  return state.notes.find((n) => copySource.get(n.id) === id && isMyNote(n))
}

/** «Сделать себе копию»: a new note of the current user with the same text
 * («… (копия)»), not tied to any case. Returns its id — or the id of the copy
 * made earlier, when there is one. */
export function copyNote(id: string): string | null {
  const src = state.notes.find((n) => n.id === id)
  if (!src) return null
  const existing = findMyCopy(id)
  if (existing) return existing.id
  const nid = `copy-${Date.now()}-${copySeq++}`
  const copy: OfficerNote = {
    ...src,
    id: nid,
    folder: 'cases',
    isPinned: false,
    author: `${mockProfile.badgeNumber} ${mockProfile.name}`,
    ...nowStamps(),
    title: `${src.title || 'Без названия'} (копия)`,
    blocks: src.blocks.map((b, i) => ({ ...b, id: `${nid}-b${i}` })),
    linkedCaseId: undefined,
    caseNo: undefined,
    copiedFrom: `${noteAuthorName(src)} · ${src.title}`,
  }
  copySource.set(nid, id)
  setNotes((prev) => [copy, ...prev])
  return nid
}

/** Opens a note in «Заметки» (switches an open window, or opens one on it). */
export function useOpenNote() {
  const { openWindow } = useWindowManager()
  return (id: string) => {
    const app = apps.find((a) => a.id === 'notes')
    if (!app) return
    requestOpenNote(id)
    openWindow(app, { initialParams: { noteId: id } })
  }
}
