import { useEffect, useMemo, useRef, useState } from 'react'
import type { OfficerNote } from '../../../types'
import type { NoteView } from './NotesApp'
import { ChevronDownIcon, FolderIcon, PlusNoteIcon, SearchIcon } from './icons'
import { PlateText } from './PlateText'

interface NoteListProps {
  notes: OfficerNote[]
  folder: NoteView
  selectedId: string | null
  wide: boolean
  onSelectFolder: (folder: NoteView) => void
  onSelect: (id: string) => void
  onCreate: () => void
}

const FOLDER_NAMES: Record<NoteView, string> = {
  all: 'Все заметки',
  cases: 'Дела',
  plates: 'Номера ТС',
  shifts: 'Смены',
  personal: 'Личное',
}
const FOLDER_ORDER: NoteView[] = ['all', 'cases', 'plates', 'shifts', 'personal']
const FOLDER_COLORS: Record<NoteView, string> = {
  all: '#8A8A8A',
  cases: '#2EC4B6',
  plates: '#2B88D8',
  shifts: '#8764B8',
  personal: '#D25A8E',
}

function inFolder(n: OfficerNote, folder: NoteView) {
  return folder === 'all' || n.folder === folder
}

function noteText(n: OfficerNote) {
  return [n.title, ...n.blocks.map((b) => b.text)].join(' ').toLowerCase()
}

function firstTextBlock(n: OfficerNote) {
  return n.blocks.find((b) => b.type !== 'heading')
}

function cardThumb(n: OfficerNote) {
  return n.blocks
    .map((b) => (b.type === 'checklist' ? (b.done ? '◉ ' : '○ ') : b.type === 'bullet' ? '• ' : '') + b.text)
    .join('\n')
}

function groupNotes(list: OfficerNote[]) {
  const pinned = list.filter((n) => n.isPinned)
  const buckets: { label: string; items: OfficerNote[] }[] = []
  if (pinned.length > 0) buckets.push({ label: 'Закреплённые', items: pinned })
  for (const label of ['Сегодня', 'Вчера', 'Ранее']) {
    const items = list.filter((n) => {
      if (n.isPinned) return false
      const day = n.time.startsWith('Сегодня') ? 'Сегодня' : n.time.startsWith('Вчера') ? 'Вчера' : 'Ранее'
      return day === label
    })
    if (items.length > 0) buckets.push({ label, items })
  }
  return buckets
}

/**
 * Note list pane: folder picker (dropdown, not a persistent sidebar), free
 * search, and the notes themselves — a 5-column card gallery when the
 * editor is hidden (`wide`), or a compact one-line-per-note list with an
 * editor alongside otherwise.
 */
export function NoteList({ notes, folder, selectedId, wide, onSelectFolder, onSelect, onCreate }: NoteListProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    function onDown(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [menuOpen])

  const q = query.trim().toLowerCase()

  const folderCounts = useMemo(() => {
    const counts = {} as Record<NoteView, number>
    FOLDER_ORDER.forEach((f) => {
      counts[f] = notes.filter((n) => inFolder(n, f)).length
    })
    return counts
  }, [notes])

  const list = useMemo(() => {
    let base = notes.filter((n) => inFolder(n, folder))
    if (q) base = base.filter((n) => noteText(n).includes(q))
    return base
  }, [notes, folder, q])

  const groups = groupNotes(list)

  return (
    <section
      aria-label="Список заметок"
      className={`flex min-w-0 flex-col border-r border-[#363636] bg-[#202227] text-[#F2F2F2] ${wide ? 'flex-1' : 'w-[320px] shrink-0'}`}
    >
      <div className="flex items-center gap-1 px-2.5 pb-2 pt-2" ref={menuRef}>
        <div className="relative flex-1">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-full items-center gap-2 rounded-[6px] px-2.5 hover:bg-white/10"
          >
            <FolderIcon className="shrink-0 text-[#F2F2F2]" />
            <span className="text-[16px] font-semibold">{FOLDER_NAMES[folder]}</span>
            <ChevronDownIcon className="shrink-0 text-[#B4B4B4]" />
            <span className="flex-1" />
            <span className="text-[12px] text-[#B4B4B4]">{folderCounts[folder] > 0 ? folderCounts[folder] : ''}</span>
          </button>
          {menuOpen && (
            <div className="absolute left-0 top-11 z-20 w-[260px] rounded-[8px] border border-[#363636] bg-[#2C2C2C] p-1 shadow-[0_8px_16px_rgba(0,0,0,0.14),0_0_2px_rgba(0,0,0,0.12)]">
              {FOLDER_ORDER.map((f) => {
                const active = folder === f
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => {
                      onSelectFolder(f)
                      setMenuOpen(false)
                    }}
                    className={`flex h-[34px] w-full items-center gap-2.5 rounded-[4px] px-2.5 ${active ? 'bg-white/10' : 'hover:bg-white/5'}`}
                  >
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: FOLDER_COLORS[f] }} />
                    <span className={`flex-1 text-left ${active ? 'font-semibold' : ''}`}>{FOLDER_NAMES[f]}</span>
                    <span className="text-[12px] text-[#B4B4B4]">{folderCounts[f]}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onCreate}
          aria-label="Новая заметка"
          title="Новая заметка"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] text-[#60CDFF] hover:bg-white/10"
        >
          <PlusNoteIcon />
        </button>
      </div>

      <div className="px-3.5 pb-2.5">
        <label className="flex h-8 items-center gap-2 rounded-[6px] bg-[rgba(255,255,255,0.07)] px-2.5">
          <SearchIcon className="shrink-0 text-[#B4B4B4]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск"
            aria-label="Поиск по заметкам"
            className="min-w-0 flex-1 bg-transparent text-[14px] text-[#F2F2F2] outline-none placeholder:text-[#B4B4B4]"
          />
        </label>
      </div>

      {list.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center text-[#B4B4B4]">
          <FolderIcon className="h-10 w-10 opacity-60" />
          <div className="text-[15px] font-semibold text-[#F2F2F2]">Здесь пусто</div>
        </div>
      ) : wide ? (
        <div className="scroll flex-1 overflow-y-auto px-6 pb-6">
          {groups.map((group) => (
            <div key={group.label}>
              <div className="px-1 pb-2.5 pt-4 text-[13px] font-semibold text-[#B4B4B4]">{group.label}</div>
              <div className="grid grid-cols-5 gap-5">
                {group.items.map((n) => {
                  return (
                    <button key={n.id} type="button" onClick={() => onSelect(n.id)} className="flex flex-col gap-2">
                      <span className="box-border flex h-[190px] flex-col gap-1.5 overflow-hidden rounded-[10px] border border-[#363636] bg-[#1C1C1C] p-3.5 pb-0 text-left shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:border-white/20">
                        <span className="text-[13px] font-bold leading-[18px]">{n.title}</span>
                        <span className="whitespace-pre-line text-[11px] leading-[16px] text-[#B4B4B4]">
                          <PlateText text={cardThumb(n)} />
                        </span>
                      </span>
                      <span className="flex flex-col items-center gap-px px-1 text-center">
                        <span className="max-w-full truncate text-[13px] font-semibold">{n.title}</span>
                        <span className="text-[12px] text-[#B4B4B4]">
                          {n.time} · {FOLDER_NAMES[n.folder]}
                        </span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="scroll flex-1 overflow-y-auto px-2.5 pb-3">
          {groups.map((group) => (
            <div key={group.label}>
              <div className="px-2 pb-1.5 pt-3.5 text-[12px] font-semibold text-[#B4B4B4]">{group.label}</div>
              {group.items.map((n, i) => {
                const isSelected = n.id === selectedId
                const last = i === group.items.length - 1
                const snippet = firstTextBlock(n)
                return (
                  <button key={n.id} type="button" onClick={() => onSelect(n.id)} className="block w-full px-0.5 text-left">
                    <span
                      className="flex flex-col gap-0.5 rounded-[8px] px-3 py-2.5"
                      style={{ background: isSelected ? 'rgba(96,205,255,0.16)' : 'transparent' }}
                    >
                      <span className="flex items-center gap-1.5">
                        <span className="min-w-0 flex-1 truncate font-semibold">{n.title}</span>
                        {n.caseNo && <span className="shrink-0 text-[11px] text-[#B4B4B4]">{n.caseNo}</span>}
                      </span>
                      <span className="flex gap-2 text-[13px] leading-[18px]">
                        <span className="shrink-0">{n.time}</span>
                        <span className="min-w-0 flex-1 truncate text-[#B4B4B4]">
                          {snippet ? <PlateText text={snippet.text.replace(/\n/g, ' ')} /> : 'Нет текста'}
                        </span>
                      </span>
                      <span className="flex items-center gap-1.5 text-[12px] text-[#B4B4B4]">
                        <FolderIcon className="h-3 w-3" />
                        {FOLDER_NAMES[n.folder]}
                      </span>
                    </span>
                    <span className="block h-px" style={{ background: isSelected || last ? 'transparent' : '#363636', margin: '0 12px' }} />
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
