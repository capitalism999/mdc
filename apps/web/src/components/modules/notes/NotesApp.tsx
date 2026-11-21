import { useEffect, useRef, useState } from 'react'
import { apps } from '../../../data/apps'
import { useWindowManager } from '../../../windows/WindowManagerContext'
import type { ModuleContentProps } from '../registry'
import { getCases, requestOpenCase } from '../cases/casesStore'
import { attachNote, detachNote, findAttachedNote, syncNoteTitle } from '../cases/caseNoteAttach'
import type { NoteBlock, NoteFolder, OfficerNote } from '../../../types'
import { mockProfile } from '../../../lib/mockData/profile'
import { NoteEditor } from './NoteEditor'
import { NoteList } from './NoteList'
import type { NoteView } from './noteFolders'
import { CloseIcon, NoteGlyphIcon, PlusNoteIcon } from './icons'
import { copyNote, displayOrder, findMyCopy, isMyNote, noteAuthorName, nowStamps, setNotes, useNotesState } from './notesStore'
import { showClippedTitle } from '../shared/clippedTitle'

export type { NoteView } from './noteFolders'

let draftCounter = 0

/** A short notice at the bottom of the window, optionally with «Отменить». */
interface Toast {
  title: string
  text: string
  undo?: () => void
  n: number
}

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
  const notes = displayOrder(all.filter((n) => isMyNote(n)))
  const { openWindow } = useWindowManager()
  const [folder, setFolder] = useState<NoteView>('all')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(() => (initialParams?.noteId as string | undefined) ?? notes[0]?.id ?? null)
  /** `true` hides the editor and lets the list fill the window as a
   * card gallery — matches the reference's `NotesGallery` state. */
  const [closed, setClosed] = useState(false)
  /** `true` hides the list and lets the editor fill the window — the
   * reference's "Скрыть список заметок" toggle. */
  const [listHidden, setListHidden] = useState(false)
  /** the note just made with «+»: its title gets the focus */
  // a blank note opened from outside (the shell's «СОЗДАТЬ» → «Заметка») starts with the caret in its title
  const [freshId, setFreshId] = useState<string | null>(() => {
    const id = initialParams?.noteId as string | undefined
    const n = id ? all.find((x) => x.id === id) : undefined
    return n && !n.title && n.blocks.every((b) => !b.text) ? n.id : null
  })
  const [printedTitle, setPrintedTitle] = useState<string | null>(null)
  const printTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [toast, setToast] = useState<Toast | null>(null)
  /** «Удалить» asks first — the note being confirmed. */
  const [confirmDel, setConfirmDel] = useState<string | null>(null)
  const confirmNote = confirmDel ? all.find((x) => x.id === confirmDel) : undefined
  const confirmCase = confirmNote?.linkedCaseId ? getCases().list.find((x) => x.id === confirmNote.linkedCaseId) : undefined
  useEffect(() => {
    if (!confirmDel) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        setConfirmDel(null)
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [confirmDel])
  const toastSeq = useRef(0)

  // «open this note» from a case (a request older than this window is ignored —
  // a new window gets the note as initialParams). Folder and search are reset
  // so the note is actually visible in the list.
  const seenOpen = useRef(open?.n ?? 0)
  useEffect(() => {
    if (!open || open.n <= seenOpen.current) return
    seenOpen.current = open.n
    setSelectedId(open.id)
    const n = all.find((x) => x.id === open.id)
    if (n && !n.title && n.blocks.every((b) => !b.text)) setFreshId(n.id)
    setFolder('all')
    setQuery('')
    setClosed(false)
  }, [open])

  useEffect(() => () => clearTimeout(printTimeout.current), [])
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast((cur) => (cur?.n === toast.n ? null : cur)), 10000)
    return () => clearTimeout(t)
  }, [toast])

  function showToast(t: Omit<Toast, 'n'>) {
    setPrintedTitle(null)
    setToast({ ...t, n: ++toastSeq.current })
  }

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
    setFreshId(null)
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

  /** Deletes at once, with «Отменить» in a toast: undo puts the note back where
   * it was — in the list and in its case folder. */
  function deleteNote(id: string) {
    const n = all.find((x) => x.id === id)
    if (!n) return
    const index = all.findIndex((x) => x.id === id)
    const file = n.linkedCaseId ? getCases().files[n.linkedCaseId] : undefined
    const filedIn = file ? findAttachedNote(file.tree, id)?.folderId : undefined
    const caseRow = n.linkedCaseId ? getCases().list.find((x) => x.id === n.linkedCaseId) : undefined
    if (n.linkedCaseId) detachNote(id, n.linkedCaseId, 'Заметка удалена автором')
    // open the next note of the same folder (or the previous one at the end)
    const visible = notes.filter((x) => folder === 'all' || x.folder === folder)
    const i = visible.findIndex((x) => x.id === id)
    const next = visible[i + 1] ?? visible[i - 1]
    setNotes((prev) => prev.filter((x) => x.id !== id))
    setSelectedId((prev) => (prev === id ? (next?.id ?? null) : prev))
    showToast({
      title: 'Заметка удалена',
      text: `«${n.title || 'Без названия'}»${caseRow ? ` убрана и из дела ${caseRow.no}` : ''}.`,
      undo: () => {
        setNotes((prev) => (prev.some((x) => x.id === n.id) ? prev : [...prev.slice(0, index), n, ...prev.slice(index)]))
        if (n.linkedCaseId && filedIn) attachNote(n, n.linkedCaseId, filedIn)
        else if (n.linkedCaseId) setNotes((prev) => prev.map((x) => (x.id === n.id ? { ...x, linkedCaseId: undefined, caseNo: undefined } : x)))
        setSelectedId(n.id)
        setClosed(false)
        setToast(null)
      },
    })
  }

  function createNote() {
    draftCounter += 1
    const id = `draft-${Date.now()}-${draftCounter}`
    const next: OfficerNote = {
      id,
      folder: folder === 'all' ? 'cases' : folder,
      isPinned: false,
      author: `${mockProfile.badgeNumber} ${mockProfile.name}`,
      ...nowStamps(),
      title: '',
      blocks: [{ id: 'b0', type: 'paragraph', text: '' }],
    }
    setNotes((prev) => [next, ...prev])
    // a search would hide the new note
    setQuery('')
    setSelectedId(id)
    setFreshId(id)
    setClosed(false)
  }

  function makeCopy(id: string) {
    const had = findMyCopy(id)
    const nid = copyNote(id)
    if (!nid) return
    setFolder('all')
    setQuery('')
    setSelectedId(nid)
    setClosed(false)
    const src = all.find((n) => n.id === id)
    // a second press just opens the copy made before
    if (!had) showToast({ title: 'Копия создана', text: `«${src?.title || 'Без названия'} (копия)» — в ваших заметках, её можно редактировать.` })
  }

  function doPrint() {
    if (!selected) return
    setToast(null)
    setPrintedTitle(selected.title || 'Без названия')
    clearTimeout(printTimeout.current)
    printTimeout.current = setTimeout(() => setPrintedTitle(null), 4000)
  }

  const myCopy = selected && !isMyNote(selected) ? findMyCopy(selected.id) : undefined
  const readOnly =
    selected && !isMyNote(selected)
      ? { author: noteAuthorName(selected), onCopy: () => makeCopy(selected.id), hasCopy: !!myCopy }
      : undefined
  const showEditor = !closed && !!selected
  // with nothing open the list always shows (the hide-list toggle lives in the editor)
  const showList = !listHidden || !showEditor

  return (
    <div onMouseOver={showClippedTitle} className="@container/notes relative flex h-full min-w-0">
      {showList && (
        <NoteList
          notes={notes}
          folder={folder}
          selectedId={selectedId}
          wide={closed}
          query={query}
          onQueryChange={setQuery}
          onSelectFolder={openFolder}
          onSelect={selectNote}
          onCreate={createNote}
        />
      )}
      {showEditor && selected && (
        <NoteEditor
          note={selected}
          readOnly={readOnly}
          listHidden={listHidden}
          printedTitle={printedTitle}
          fresh={freshId === selected.id}
          onToggleList={() => setListHidden((v) => !v)}
          onTogglePin={() => patch(selected.id, (n) => ({ ...n, isPinned: !n.isPinned }))}
          onMoveFolder={(f: NoteFolder) => patch(selected.id, (n) => ({ ...n, folder: f }))}
          onTitleChange={(title) => updateTitle(selected.id, title)}
          onBlocksChange={(blocks: NoteBlock[]) => patch(selected.id, (n) => ({ ...n, blocks }))}
          onLinkCase={(caseId, folderId) => setLinkedCase(selected.id, caseId, folderId)}
          onOpenCase={openCase}
          onPrint={doPrint}
          onDismissPrintToast={() => setPrintedTitle(null)}
          onDelete={() => setConfirmDel(selected.id)}
          onClose={() => {
            setClosed(true)
            setListHidden(false)
          }}
        />
      )}
      {!closed && !selected && (
        <main className="flex min-w-0 flex-1 flex-col items-center justify-center gap-3 bg-[#1C1C1C] px-6 text-center text-[#B4B4B4]">
          <NoteGlyphIcon className="h-10 w-10 opacity-60" />
          <div className="text-[15px] font-semibold text-[#F2F2F2]">Заметка не выбрана</div>
          <div className="max-w-[300px] text-[13px]">Выберите заметку в списке или начните новую.</div>
          <button type="button" onClick={createNote} className="mt-1 flex h-8 items-center gap-2 rounded-[6px] bg-[#60CDFF] px-3 text-[13px] font-semibold text-[#1B1B1B] hover:brightness-110">
            <PlusNoteIcon className="h-4 w-4" />
            Новая заметка
          </button>
        </main>
      )}

      {confirmNote && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 px-4" onMouseDown={(e) => e.target === e.currentTarget && setConfirmDel(null)}>
          <div role="alertdialog" aria-modal="true" aria-label="Удалить заметку?" className="w-[min(380px,100%)] rounded-[8px] border border-[#3A3A3A] bg-[#2C2C2C] p-5 text-[#F2F2F2] shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
            <div className="text-[16px] font-semibold">Удалить заметку?</div>
            <div className="mt-2 break-words text-[13px] text-[#B4B4B4]">
              «{confirmNote.title || 'Без названия'}» будет удалена{confirmCase ? ` и убрана из дела ${confirmCase.no}` : ''}. Пока видно уведомление, удаление можно отменить.
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                autoFocus
                onClick={() => {
                  const id = confirmNote.id
                  setConfirmDel(null)
                  deleteNote(id)
                }}
                className="h-8 rounded-[6px] bg-[#C42B1C] px-4 text-[13px] font-semibold text-white hover:brightness-110"
              >
                Удалить
              </button>
              <button type="button" onClick={() => setConfirmDel(null)} className="h-8 rounded-[6px] bg-[#3A3A3A] px-4 text-[13px] font-semibold hover:bg-[#454545]">
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div role="status" className="absolute bottom-[88px] right-6 z-30 flex w-[min(360px,calc(100%-48px))] items-start gap-3 rounded-[8px] border border-[#363636] bg-[#2C2C2C] py-3 pl-4 pr-3 text-[#F2F2F2] shadow-[0_12px_32px_rgba(0,0,0,0.4)]">
          <span className="min-w-0 flex-1">
            <div className="font-semibold">{toast.title}</div>
            <div className="break-words text-[13px] text-[#B4B4B4]">{toast.text}</div>
          </span>
          {toast.undo && (
            <button type="button" onClick={toast.undo} className="h-7 shrink-0 rounded-[4px] px-2.5 text-[13px] font-semibold text-[#60CDFF] hover:bg-white/10">
              Отменить
            </button>
          )}
          <button type="button" onClick={() => setToast(null)} aria-label="Скрыть уведомление" className="h-7 w-7 shrink-0 rounded-[4px] text-[#B4B4B4] hover:bg-white/10">
            <CloseIcon className="mx-auto h-2.5 w-2.5" />
          </button>
        </div>
      )}
    </div>
  )
}
