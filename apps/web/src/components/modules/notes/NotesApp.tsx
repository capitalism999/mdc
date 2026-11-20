import { useEffect, useRef, useState } from 'react'
import { apps } from '../../../data/apps'
import { useWindowManager } from '../../../windows/WindowManagerContext'
import type { ModuleContentProps } from '../registry'
import { getCases, requestOpenCase } from '../cases/casesStore'
import { attachNote, detachNote, syncNoteTitle } from '../cases/caseNoteAttach'
import type { NoteBlock, NoteFolder, OfficerNote } from '../../../types'
import { mockProfile } from '../../../lib/mockData/profile'
import { NoteEditor } from './NoteEditor'
import { NoteList } from './NoteList'
import { copyNote, isMyNote, noteAuthorName, setNotes, useNotesState } from './notesStore'

/** Folder-picker selection — the four real folders plus a virtual "all". */
export type NoteView = NoteFolder | 'all'

let draftCounter = 0

/**
 * "Заметки" module. Two-pane layout (note list, reader/editor) — folder
 * navigation lives in a dropdown inside the list header rather than a
 * persistent sidebar, matching the reference design (same pattern as
 * Почта). Notes live in `notesStore` (shared with «Дела», where a note can be
 * filed into a case folder). The list holds the user's own notes; another
 * officer's note (opened from a case) shows read-only, with «Сделать себе копию».
 */
export function NotesApp({ initialParams }: ModuleContentProps) {
  const { notes: all, open } = useNotesState()
  const notes = all.filter((n) => isMyNote(n))
  const { openWindow } = useWindowManager()
  const [folder, setFolder] = useState<NoteView>('all')
  const [selectedId, setSelectedId] = useState<string | null>(() => (initialParams?.noteId as string | undefined) ?? notes[0]?.id ?? null)
  /** `true` hides the editor and lets the list fill the window as a
   * card gallery — matches the reference's `NotesGallery` state. */
  const [closed, setClosed] = useState(false)
  /** `true` hides the list and lets the editor fill the window — the
   * reference's "Скрыть список заметок" toggle. */
  const [listHidden, setListHidden] = useState(false)
  const [printedTitle, setPrintedTitle] = useState<string | null>(null)
  const printTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // «open this note» from a case (a request older than this window is ignored —
  // a new window gets the note as initialParams)
  const seenOpen = useRef(open?.n ?? 0)
  useEffect(() => {
    if (!open || open.n <= seenOpen.current) return
    seenOpen.current = open.n
    setSelectedId(open.id)
    setClosed(false)
  }, [open])

  useEffect(() => () => clearTimeout(printTimeout.current), [])

  const selected = all.find((n) => n.id === selectedId) ?? null
  const patch = (id: string, fn: (n: OfficerNote) => OfficerNote) => setNotes((prev) => prev.map((n) => (n.id === id ? fn(n) : n)))

  function openFolder(next: NoteView) {
    setFolder(next)
    setClosed(false)
    const first = next === 'all' ? notes[0] : notes.find((n) => n.folder === next)
    setSelectedId(first?.id ?? null)
  }

  function selectNote(id: string) {
    setClosed(false)
    setSelectedId(id)
  }

  function updateTitle(id: string, title: string) {
    patch(id, (n) => ({ ...n, title }))
    const n = all.find((x) => x.id === id)
    if (n?.linkedCaseId) syncNoteTitle(id, n.linkedCaseId, title)
  }

  /** File the note into a case folder (or take it out with `caseId` undefined). */
  function setLinkedCase(id: string, caseId: string | undefined, folderId?: string) {
    const n = all.find((x) => x.id === id)
    if (!n) return
    if (n.linkedCaseId && n.linkedCaseId !== caseId) detachNote(id, n.linkedCaseId)
    if (caseId && folderId) attachNote(n, caseId, folderId)
    const c = getCases().list.find((x) => x.id === caseId)
    // «LS-2026-0893» → «LS-0893» for the list; warrant-style numbers stay as is
    const short = c ? c.no.replace(/^([A-Z]+)-\d{4}-/, '$1-') : undefined
    patch(id, (x) => ({ ...x, linkedCaseId: caseId, caseNo: short }))
  }

  /** Linked case → «Дела»: switches an open window to it, or opens one on it. */
  function openCase(caseId: string) {
    const app = apps.find((a) => a.id === 'cases')
    if (!app) return
    requestOpenCase(caseId)
    openWindow(app, { initialParams: { entityType: 'case', entityId: caseId } })
  }

  function deleteNote(id: string) {
    const n = all.find((x) => x.id === id)
    if (n?.linkedCaseId) detachNote(id, n.linkedCaseId, 'Заметка удалена автором')
    // open the next note of the same folder (or the previous one at the end)
    const visible = notes.filter((x) => folder === 'all' || x.folder === folder)
    const i = visible.findIndex((x) => x.id === id)
    const next = visible[i + 1] ?? visible[i - 1]
    setNotes((prev) => prev.filter((x) => x.id !== id))
    setSelectedId((prev) => (prev === id ? (next?.id ?? null) : prev))
  }

  function createNote() {
    draftCounter += 1
    const id = `draft-${Date.now()}-${draftCounter}`
    const next: OfficerNote = {
      id,
      folder: folder === 'all' ? 'cases' : folder,
      isPinned: false,
      author: `${mockProfile.badgeNumber} ${mockProfile.name}`,
      time: 'Сегодня, только что',
      dateFull: 'Только что',
      title: 'Новая заметка',
      blocks: [{ id: 'b0', type: 'paragraph', text: '' }],
    }
    setNotes((prev) => [next, ...prev])
    setSelectedId(id)
    setClosed(false)
  }

  function makeCopy(id: string) {
    const nid = copyNote(id)
    if (!nid) return
    setFolder('all')
    setSelectedId(nid)
    setClosed(false)
  }

  function doPrint() {
    if (!selected) return
    setPrintedTitle(selected.title)
    clearTimeout(printTimeout.current)
    printTimeout.current = setTimeout(() => setPrintedTitle(null), 4000)
  }

  const readOnly = selected && !isMyNote(selected) ? { author: noteAuthorName(selected), onCopy: () => makeCopy(selected.id) } : undefined

  return (
    <div className="flex h-full min-w-0">
      {!listHidden && (
        <NoteList
          notes={notes}
          folder={folder}
          selectedId={selectedId}
          wide={closed || !selected}
          onSelectFolder={openFolder}
          onSelect={selectNote}
          onCreate={createNote}
        />
      )}
      {!closed && selected && (
        <NoteEditor
          note={selected}
          readOnly={readOnly}
          listHidden={listHidden}
          printedTitle={printedTitle}
          onToggleList={() => setListHidden((v) => !v)}
          onTogglePin={() => patch(selected.id, (n) => ({ ...n, isPinned: !n.isPinned }))}
          onTitleChange={(title) => updateTitle(selected.id, title)}
          onBlocksChange={(blocks: NoteBlock[]) => patch(selected.id, (n) => ({ ...n, blocks }))}
          onBlockToggle={(blockId) => patch(selected.id, (n) => ({ ...n, blocks: n.blocks.map((b) => (b.id === blockId ? { ...b, done: !b.done } : b)) }))}
          onLinkCase={(caseId, folderId) => setLinkedCase(selected.id, caseId, folderId)}
          onOpenCase={openCase}
          onPrint={doPrint}
          onDismissPrintToast={() => setPrintedTitle(null)}
          onDelete={() => deleteNote(selected.id)}
          onClose={() => {
            setClosed(true)
            setListHidden(false)
          }}
        />
      )}
    </div>
  )
}
