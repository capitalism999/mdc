import { useEffect, useState } from 'react'
import type { ModuleContentProps } from '../registry'
import { getCases } from '../../../lib/endpoints/cases'
import { getNotes } from '../../../lib/endpoints/notes'
import { getPeople } from '../../../lib/endpoints/people'
import { getVehicles } from '../../../lib/endpoints/vehicles'
import type { CaseFile, OfficerNote, Person, Vehicle } from '../../../types'
import { useWindowManager } from '../../../windows/WindowManagerContext'
import { NoteEditor } from './NoteEditor'
import { NoteList } from './NoteList'

type View = { kind: 'list' } | { kind: 'edit'; noteId: string }

let draftCounter = 0

function createDraft(): OfficerNote {
  draftCounter += 1
  return {
    id: `draft-note-${Date.now()}-${draftCounter}`,
    title: 'Новая заметка',
    content: '',
    category: 'Личное',
    isPinned: false,
    author: 'Текущий офицер',
    time: 'Только что',
  }
}

function buildBreadcrumb(view: View, notes: OfficerNote[]): string[] {
  if (view.kind === 'list') return ['Заметки']
  const note = notes.find((n) => n.id === view.noteId)
  return ['Заметки', note ? note.title : view.noteId]
}

/**
 * "Заметки" module: the officer's personal notepad — separate from the
 * per-person `PersonNote` list. List (pin/category/search) → simple
 * textarea editor with an optional single link out to a person/vehicle/case.
 * Opened via the `CTRL+M` header shortcut.
 */
export function NotesApp({ windowId }: ModuleContentProps) {
  const { updateBreadcrumb } = useWindowManager()
  const [notes, setNotes] = useState<OfficerNote[]>([])
  const [people, setPeople] = useState<Person[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [cases, setCases] = useState<CaseFile[]>([])
  const [view, setView] = useState<View>({ kind: 'list' })

  useEffect(() => {
    getNotes().then(setNotes)
    getPeople().then(setPeople)
    getVehicles().then(setVehicles)
    getCases().then(setCases)
  }, [])

  useEffect(() => {
    updateBreadcrumb(windowId, buildBreadcrumb(view, notes))
  }, [windowId, view, notes, updateBreadcrumb])

  function updateNote(updated: OfficerNote) {
    setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)))
  }

  function togglePin(noteId: string) {
    setNotes((prev) => prev.map((n) => (n.id === noteId ? { ...n, isPinned: !n.isPinned } : n)))
  }

  function createNote() {
    const draft = createDraft()
    setNotes((prev) => [draft, ...prev])
    setView({ kind: 'edit', noteId: draft.id })
  }

  function deleteNote(noteId: string) {
    setNotes((prev) => prev.filter((n) => n.id !== noteId))
    setView({ kind: 'list' })
  }

  if (view.kind === 'list') {
    return <NoteList notes={notes} onSelect={(n) => setView({ kind: 'edit', noteId: n.id })} onCreate={createNote} onTogglePin={togglePin} />
  }

  const note = notes.find((n) => n.id === view.noteId)
  if (!note) {
    return <div className="flex h-full items-center justify-center text-[14px] text-ink/40">Заметка не найдена</div>
  }

  return (
    <NoteEditor
      note={note}
      people={people}
      vehicles={vehicles}
      cases={cases}
      onChange={updateNote}
      onDelete={deleteNote}
      onBack={() => setView({ kind: 'list' })}
    />
  )
}
