import { useMemo, useState } from 'react'
import type { OfficerNote } from '../../../types'
import { EmptyState, ListRow, SearchBar } from '../shared/ui'
import { NoteAddIcon } from '../people/icons'

interface NoteListProps {
  notes: OfficerNote[]
  onSelect: (note: OfficerNote) => void
  onCreate: () => void
  onTogglePin: (noteId: string) => void
}

/**
 * "Заметки" list screen: pinned notes pulled to the top, category filter
 * chips, free-text search over title/content, "+ Новая заметка" to open a
 * fresh draft in `NoteEditor`.
 */
export function NoteList({ notes, onSelect, onCreate, onTogglePin }: NoteListProps) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | null>(null)

  const categories = useMemo(() => Array.from(new Set(notes.map((n) => n.category))), [notes])

  const q = query.trim().toLowerCase()
  const filtered = notes.filter((n) => {
    if (category && n.category !== category) return false
    if (!q) return true
    return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
  })

  const pinned = filtered.filter((n) => n.isPinned)
  const rest = filtered.filter((n) => !n.isPinned)

  function renderRow(note: OfficerNote) {
    return (
      <ListRow
        key={note.id}
        leading={
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onTogglePin(note.id)
            }}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] text-[14px] ${
              note.isPinned ? 'bg-[#48adec]/20 text-[#48adec]' : 'bg-ink/10 text-ink/40 hover:text-ink/70'
            }`}
            title={note.isPinned ? 'Открепить' : 'Закрепить'}
          >
            {note.isPinned ? '★' : '☆'}
          </button>
        }
        title={<span className="truncate font-medium text-ink">{note.title}</span>}
        subtitle={note.content}
        trailing={
          <div className="flex shrink-0 flex-col items-end gap-1 text-[11px] text-ink/40">
            <span className="rounded-full bg-ink/10 px-2 py-0.5">{note.category}</span>
            <span>{note.time}</span>
          </div>
        }
        onClick={() => onSelect(note)}
      />
    )
  }

  return (
    <div className="flex h-full flex-col">
      <SearchBar value={query} onChange={setQuery} onSubmit={() => {}} placeholder="Поиск по заголовку и тексту" icon={<NoteAddIcon />} />

      <div className="flex items-center gap-2 px-4 pb-2">
        <button
          type="button"
          onClick={() => setCategory(null)}
          className={`rounded-full px-3 py-1 text-[12px] font-medium ${
            category === null ? 'bg-[#48adec] text-black' : 'bg-ink/10 text-ink/60 hover:bg-ink/20'
          }`}
        >
          Все
        </button>
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={`rounded-full px-3 py-1 text-[12px] font-medium ${
              category === c ? 'bg-[#48adec] text-black' : 'bg-ink/10 text-ink/60 hover:bg-ink/20'
            }`}
          >
            {c}
          </button>
        ))}
        <button
          type="button"
          onClick={onCreate}
          className="ml-auto flex items-center gap-1.5 rounded-[8px] bg-[#48adec] px-3 py-1.5 text-[12px] font-semibold text-black hover:bg-[#62b9ef]"
        >
          + Новая заметка
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 pb-4">
        {filtered.length === 0 ? (
          <EmptyState label="Заметок не найдено" />
        ) : (
          <>
            {pinned.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-ink/30">Закреплённые</span>
                {pinned.map(renderRow)}
              </div>
            )}
            {rest.length > 0 && (
              <div className="flex flex-col gap-1.5">
                {pinned.length > 0 && <span className="text-[11px] font-semibold uppercase tracking-wide text-ink/30">Остальные</span>}
                {rest.map(renderRow)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
