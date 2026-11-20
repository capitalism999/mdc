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

/** Author shown on a note: «12D3 Thorne Watts» → «Thorne Watts» (a badge has digits). */
export function noteAuthorName(n: OfficerNote): string {
  return n.author.replace(/^\S*\d\S*\s+/, '')
}

export function isMyNote(n: OfficerNote, me = mockProfile.name): boolean {
  return noteAuthorName(n) === me
}

let copySeq = 0
/** «Сделать себе копию»: a new note of the current user with the same text;
 * not tied to any case. Returns its id. */
export function copyNote(id: string): string | null {
  const src = state.notes.find((n) => n.id === id)
  if (!src) return null
  const nid = `copy-${Date.now()}-${copySeq++}`
  const copy: OfficerNote = {
    ...src,
    id: nid,
    folder: 'cases',
    isPinned: false,
    author: `${mockProfile.badgeNumber} ${mockProfile.name}`,
    time: 'Сегодня, только что',
    dateFull: 'Только что',
    title: src.title,
    blocks: src.blocks.map((b, i) => ({ ...b, id: `${nid}-b${i}` })),
    linkedCaseId: undefined,
    caseNo: undefined,
    copiedFrom: `${noteAuthorName(src)} · ${src.title}`,
  }
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
