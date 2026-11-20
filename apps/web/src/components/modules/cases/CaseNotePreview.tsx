import type { NoteBlock } from '../../../types'
import { copyNote, isMyNote, noteAuthorName, useNotesState, useOpenNote } from '../notes/notesStore'

/** Read-only text of a note filed into the case, with «Открыть в Заметках»
 * and — for someone else's note — «Сделать себе копию» (an editable copy of
 * your own, not tied to the case). */
export function CaseNotePreview({ noteId }: { noteId?: string }) {
  const { notes } = useNotesState()
  const openNote = useOpenNote()
  const note = notes.find((n) => n.id === noteId)
  if (!note) {
    return <div className="rounded-[12px] bg-[#303030] px-4 py-3 text-[13px] text-[#C2C2C2]">Заметка удалена автором или недоступна.</div>
  }
  const mine = isMyNote(note)
  return (
    <div>
      <div className="mb-1.5 ml-1 flex items-center text-[13px] font-semibold text-[#C2C2C2]">
        <span className="flex-1">Содержание</span>
        {!mine && <span className="text-[11px] font-normal">только просмотр</span>}
      </div>
      <div className="scroll max-h-[340px] overflow-y-auto rounded-[12px] bg-[#303030] px-4 py-3">
        <div className="mb-1 text-[15px] font-semibold leading-5">{note.title || 'Без названия'}</div>
        <div className="mb-2 text-[11px] text-[#C2C2C2]">
          {noteAuthorName(note)} · {note.dateFull}
        </div>
        <div className="flex flex-col gap-1.5 text-[13px] leading-[19px]">
          {note.blocks.map((b) => (
            <PreviewBlock key={b.id} b={b} />
          ))}
        </div>
      </div>
      <div className="mt-2 flex gap-1.5">
        <button type="button" onClick={() => openNote(note.id)} className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-[6px] bg-[#3A3A3A] text-[13px] hover:brightness-125">
          {mine ? 'Открыть и редактировать' : 'Открыть в Заметках'}
          <svg width="11" height="11" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M8 4h8v8M16 4L5 15" />
          </svg>
        </button>
        {!mine && (
          <button
            type="button"
            onClick={() => {
              const id = copyNote(note.id)
              if (id) openNote(id)
            }}
            className="h-8 flex-1 rounded-[6px] bg-[#60CDFF] text-[13px] font-semibold text-[#1B1B1B] hover:brightness-110"
          >
            Сделать себе копию
          </button>
        )}
      </div>
    </div>
  )
}

function PreviewBlock({ b }: { b: NoteBlock }) {
  if (b.type === 'image') return b.src ? <img src={b.src} alt={b.name ?? ''} className="max-h-[160px] max-w-full rounded-[6px] object-contain" /> : null
  if (!b.text) return null
  if (b.type === 'heading') return <div className="mt-1 text-[14px] font-semibold">{b.text}</div>
  if (b.type === 'bullet')
    return (
      <div className="flex gap-2">
        <span className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-[#F2F2F2]" />
        <span>{b.text}</span>
      </div>
    )
  if (b.type === 'checklist')
    return (
      <div className="flex items-start gap-2">
        <span className="mt-[3px] flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border" style={{ borderColor: b.done ? '#60CDFF' : '#8A8A8A', background: b.done ? '#60CDFF' : 'transparent' }}>
          {b.done && (
            <svg width="8" height="8" viewBox="0 0 20 20" fill="none" stroke="#1B1B1B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4.5 10.5l3.5 3.5 7.5-8" />
            </svg>
          )}
        </span>
        <span className={b.done ? 'text-[#B4B4B4] line-through' : ''}>{b.text}</span>
      </div>
    )
  if (b.type === 'quote') return <div className="whitespace-pre-line rounded-[6px] bg-black/20 px-2.5 py-1.5 font-mono text-[12px]">{b.text}</div>
  return <div className="whitespace-pre-line">{b.text}</div>
}
