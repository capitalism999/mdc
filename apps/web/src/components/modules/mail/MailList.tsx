import { useEffect, useMemo, useRef, useState } from 'react'
import type { ComponentType } from 'react'
import { mockProfile } from '../../../lib/mockData/profile'
import type { MailMessage } from '../../../types'
import { getAvatarColor, getInitials } from './avatar'
import { ArchiveIcon, AttachIcon, ChevronDownIcon, CloseIcon, DraftIcon, FolderIcon, InboxIcon, PinIcon, SearchIcon, SentIcon, TrashIcon } from './icons'
import type { MailView } from './MailApp'
import { pluralLetters, splitMatch, stripHtml } from './text'

interface MailListProps {
  messages: MailMessage[]
  view: MailView
  selectedId: string | null
  wide: boolean
  onSelectFolder: (view: MailView) => void
  onSelect: (id: string) => void
  onCompose: () => void
}

const FOLDER_NAMES: Record<MailView, string> = {
  inbox: 'Входящие',
  flagged: 'С флажком',
  sent: 'Отправленные',
  drafts: 'Черновики',
  archive: 'Архив',
  trash: 'Удалённые',
}
const FOLDER_ORDER: MailView[] = ['inbox', 'flagged', 'sent', 'drafts', 'archive', 'trash']
const FOLDER_ICONS: Record<MailView, ComponentType<{ className?: string }>> = {
  inbox: InboxIcon,
  flagged: PinIcon,
  sent: SentIcon,
  drafts: DraftIcon,
  archive: ArchiveIcon,
  trash: TrashIcon,
}

function RowIcon({ folder, active }: { folder: MailView; active: boolean }) {
  const Icon = FOLDER_ICONS[folder]
  return <Icon className={`shrink-0 ${active ? 'text-[#60CDFF]' : 'text-[#C8C8C8]'}`} />
}

function inFolder(m: MailMessage, view: MailView) {
  if (view === 'flagged') return !!m.pinned && m.folder !== 'trash'
  return m.folder === view
}

/** Groups messages by the leading word of `time` ("Сегодня, 10:42" →
 * "Сегодня"), preserving incoming order. Anything else falls into "Ранее". */
function groupByDate(messages: MailMessage[]) {
  const groups: { key: string; items: MailMessage[] }[] = []
  for (const m of messages) {
    const key = m.time.startsWith('Сегодня') ? 'Сегодня' : m.time.startsWith('Вчера') ? 'Вчера' : 'Ранее'
    const last = groups[groups.length - 1]
    if (last && last.key === key) last.items.push(m)
    else groups.push({ key, items: [m] })
  }
  return groups
}

function Mark({ text }: { text: string }) {
  if (!text) return null
  return <mark className="rounded-[2px] bg-[rgba(252,225,0,0.28)] text-white">{text}</mark>
}

function Avatar({ name, size }: { name: string; size: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
      style={{ width: size, height: size, backgroundColor: getAvatarColor(name), fontSize: size > 30 ? 13 : 11 }}
    >
      {getInitials(name)}
    </span>
  )
}

/**
 * Message list pane: folder picker (dropdown, not a persistent sidebar —
 * the reference design folds navigation into this header), a search box
 * with live filtering across every folder but Удалённые, Все/Непрочитанные
 * tabs (or filter chips while searching), and the message rows themselves —
 * a compact one-line table when the reader pane is hidden (`wide`), or
 * two/three-line cards with a reading pane alongside otherwise.
 */
export function MailList({ messages, view, selectedId, wide, onSelectFolder, onSelect, onCompose }: MailListProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [searchFocus, setSearchFocus] = useState(false)
  const [unreadOnly, setUnreadOnly] = useState(false)
  const [attachOnly, setAttachOnly] = useState(false)
  const [flagOnly, setFlagOnly] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const q = query.trim()
  const ql = q.toLowerCase()
  const searching = q.length > 0

  useEffect(() => {
    if (!menuOpen) return
    function onDown(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [menuOpen])

  useEffect(() => {
    setUnreadOnly(false)
    setAttachOnly(false)
    setFlagOnly(false)
    setQuery('')
  }, [view])

  const folderCounts = useMemo(() => {
    const counts = {} as Record<MailView, { unread: number; total: number }>
    FOLDER_ORDER.forEach((f) => {
      const inF = messages.filter((m) => inFolder(m, f))
      counts[f] = { unread: inF.filter((m) => !m.read).length, total: inF.length }
    })
    return counts
  }, [messages])

  const list = useMemo(() => {
    function hit(m: MailMessage) {
      return [m.subject, m.preview, m.from, stripHtml(m.body)].some((t) => t.toLowerCase().includes(ql))
    }
    let base = searching ? messages.filter((m) => m.folder !== 'trash' && hit(m)) : messages.filter((m) => inFolder(m, view))
    if (unreadOnly) base = base.filter((m) => !m.read)
    if (searching && attachOnly) base = base.filter((m) => m.attachments && m.attachments.length > 0)
    if (searching && flagOnly) base = base.filter((m) => m.pinned)
    return base
  }, [messages, view, searching, ql, unreadOnly, attachOnly, flagOnly])

  const people = useMemo(() => {
    const seen = new Map<string, MailMessage>()
    messages.forEach((m) => {
      if (m.kind === 'player' && m.folder !== 'sent' && !seen.has(m.from)) seen.set(m.from, m)
    })
    return Array.from(seen.values()).slice(0, 3)
  }, [messages])

  const groups = searching ? (list.length ? [{ key: 'Лучшие совпадения', items: list }] : []) : groupByDate(list)
  const folderCount = folderCounts[view]?.total ?? 0

  function split(text: string) {
    return searching ? (splitMatch(text, q) ?? ([text, '', ''] as const)) : ([text, '', ''] as const)
  }

  function snippet(m: MailMessage) {
    const p = split(m.preview)
    if (p[1]) return p
    const body = stripHtml(m.body)
    const i = body.toLowerCase().indexOf(ql)
    if (i < 0) return [m.preview, '', ''] as const
    const start = Math.max(0, i - 24)
    return [(start > 0 ? '…' : '') + body.slice(start, i), body.slice(i, i + q.length), body.slice(i + q.length)] as const
  }

  const chips: { label: string; active: boolean; toggle: () => void }[] = [
    { label: 'Непрочитанные', active: unreadOnly, toggle: () => setUnreadOnly((v) => !v) },
    { label: 'С вложениями', active: attachOnly, toggle: () => setAttachOnly((v) => !v) },
    { label: 'С флажком', active: flagOnly, toggle: () => setFlagOnly((v) => !v) },
  ]

  const TriggerIcon = FOLDER_ICONS[view]

  return (
    <section
      aria-label="Список писем"
      className={`flex min-w-0 flex-col border-r border-[#3A3A3A] bg-[#1D2027] text-white ${wide ? 'flex-1' : 'w-[400px] shrink-0'}`}
    >
      <div className={`flex ${wide ? 'items-center gap-2 py-2 pl-4 pr-4' : 'flex-col gap-0 pt-2'}`}>
        <div className={`relative flex items-center gap-1 px-2 pb-2 pt-1 ${wide ? 'w-[300px] shrink-0 pt-0' : ''}`} ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 flex-1 items-center gap-2 rounded-[6px] px-2.5 hover:bg-white/10"
          >
            <TriggerIcon className="shrink-0 text-white" />
            <span className="text-[16px] font-semibold">{FOLDER_NAMES[view]}</span>
            <ChevronDownIcon className="shrink-0 text-white/70" />
            <span className="flex-1" />
            <span className="text-[12px] text-[#C8C8C8]">{folderCount > 0 ? folderCount : ''}</span>
          </button>
          {!wide && (
            <button
              type="button"
              onClick={onCompose}
              aria-label="Новое письмо"
              title="Новое письмо"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] hover:bg-white/10"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 3.5H5A1.5 1.5 0 003.5 5v10A1.5 1.5 0 005 16.5h10a1.5 1.5 0 001.5-1.5v-4" />
                <path d="M14.5 2.5l3 3-7 7H7.5v-3z" />
              </svg>
            </button>
          )}
          {menuOpen && (
            <div className="absolute left-2 top-11 z-20 w-[280px] rounded-[8px] border border-[#3A3A3A] bg-[#2C2C2C] p-1 shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
              <div className="px-2.5 py-1.5 text-[12px] text-[#C8C8C8]">{mockProfile.badgeNumber} {mockProfile.name}</div>
              {FOLDER_ORDER.map((f) => {
                const active = view === f
                const c = folderCounts[f]
                const count = c.unread > 0 ? c.unread : c.total
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
                    <span className={`h-4 w-[3px] rounded-[2px] bg-[#60CDFF] ${active ? 'opacity-100' : 'opacity-0'}`} />
                    <RowIcon folder={f} active={active} />
                    <span className={`flex-1 text-left ${active ? 'font-semibold' : ''}`}>{FOLDER_NAMES[f]}</span>
                    <span className={`text-[12px] ${c.unread > 0 ? 'font-semibold text-white' : 'text-[#C8C8C8]'}`}>{count > 0 ? count : ''}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className={`relative px-2 pb-2 ${wide ? 'w-[380px] shrink-0 pb-0' : ''}`}>
          <label
            className="flex h-8 items-center gap-2 rounded-[6px] px-2.5"
            style={{ background: searchFocus ? 'rgba(255,255,255,0.11)' : 'rgba(255,255,255,0.07)' }}
          >
            <SearchIcon className="shrink-0 text-[#C8C8C8]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
              placeholder="Поиск"
              aria-label="Поиск"
              className="min-w-0 flex-1 bg-transparent text-[14px] text-white outline-none placeholder:text-[#C8C8C8]"
            />
            {searching && (
              <button type="button" onClick={() => setQuery('')} aria-label="Очистить поиск" className="shrink-0 rounded-[4px] p-1 hover:bg-white/10">
                <CloseIcon />
              </button>
            )}
          </label>
          {searchFocus && !searching && people.length > 0 && (
            <div
              onMouseDown={(e) => e.preventDefault()}
              className="absolute left-2 right-2 top-9 z-20 rounded-[8px] border border-[#3A3A3A] bg-[#2C2C2C] p-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.45)]"
            >
              <div className="px-2.5 pb-1 pt-1 text-[12px] font-semibold text-[#C8C8C8]">Люди</div>
              {people.map((p) => (
                <button
                  key={p.from}
                  type="button"
                  onClick={() => setQuery(p.from)}
                  className="flex h-10 w-full items-center gap-2.5 rounded-[4px] px-2.5 hover:bg-white/10"
                >
                  <Avatar name={p.from} size={26} />
                  <span className="flex flex-col text-left leading-tight">
                    <span>{p.from}</span>
                    {p.role && <span className="text-[12px] text-[#C8C8C8]">{p.role}</span>}
                  </span>
                </button>
              ))}
            </div>
          )}
          {searching && (
            <div className="px-0.5 pt-1.5 text-[12px] text-[#C8C8C8]">
              {list.length} {pluralLetters(list.length)} по запросу «{q}» · во всех папках
            </div>
          )}
        </div>

        {wide && (
          <>
            <span className="flex-1" />
            <button
              type="button"
              onClick={onCompose}
              className="flex h-[34px] shrink-0 items-center gap-2 rounded-[4px] bg-[#60CDFF] px-3.5 font-semibold text-black hover:brightness-[1.08]"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 3.5H5A1.5 1.5 0 003.5 5v10A1.5 1.5 0 005 16.5h10a1.5 1.5 0 001.5-1.5v-4" />
                <path d="M14.5 2.5l3 3-7 7H7.5v-3z" />
              </svg>
              Новое письмо
            </button>
          </>
        )}
      </div>

      {searching ? (
        <div className="flex flex-wrap gap-1.5 px-4 pb-2.5">
          {chips.map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={chip.toggle}
              className={`h-7 rounded-full border px-2.5 text-[13px] ${
                chip.active ? 'border-[#60CDFF] bg-[#60CDFF] text-black' : 'border-[#3A3A3A] text-white hover:bg-white/5'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex gap-1 px-4 pb-2">
          <button
            type="button"
            onClick={() => setUnreadOnly(false)}
            className={`relative h-[30px] rounded-[4px] px-3 ${!unreadOnly ? 'font-semibold' : 'text-[#C8C8C8] hover:bg-white/5'}`}
          >
            Все
            {!unreadOnly && <span className="absolute bottom-0 left-3 right-3 h-[3px] rounded-[2px] bg-[#60CDFF]" />}
          </button>
          <button
            type="button"
            onClick={() => setUnreadOnly(true)}
            className={`relative h-[30px] rounded-[4px] px-3 ${unreadOnly ? 'font-semibold' : 'text-[#C8C8C8] hover:bg-white/5'}`}
          >
            Непрочитанные{folderCounts[view]?.unread ? ` (${folderCounts[view].unread})` : ''}
            {unreadOnly && <span className="absolute bottom-0 left-3 right-3 h-[3px] rounded-[2px] bg-[#60CDFF]" />}
          </button>
        </div>
      )}

      {wide && (
        <div className="mx-2 flex h-8 items-center gap-4 border-b border-[#3A3A3A] py-0 pl-[68px] pr-4 text-[12px] text-[#C8C8C8]">
          <span className="w-[220px]">От</span>
          <span className="flex-1">Тема</span>
          <span className="w-14" />
          <span className="w-16 text-right">Получено</span>
        </div>
      )}

      <div className="scroll flex-1 overflow-y-auto px-2 pb-3">
        {list.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-6 py-20 text-center text-[#C8C8C8]">
            <FolderIcon className="h-12 w-12 opacity-60" />
            <div className="text-[16px] font-semibold text-white">{searching ? 'Ничего не найдено' : 'Здесь пусто'}</div>
            <div>{searching ? `По запросу «${q}» писем нет. Проверьте написание или уберите фильтры.` : 'В этой папке нет писем.'}</div>
          </div>
        ) : (
          groups.map((group, i) => (
            <div key={`${group.key}-${i}`}>
              <div className="px-3 pb-1 pt-3 text-[12px] font-semibold text-[#C8C8C8]">{group.key}</div>
              {group.items.map((m) => {
                const party = m.folder === 'sent' ? m.to : m.from
                const unread = !m.read
                const flagged = !!m.pinned
                const hasAttach = !!m.attachments && m.attachments.length > 0
                const isSelected = m.id === selectedId
                const [sA, sM, sB] = split(m.subject)
                const [pA, pM, pB] = snippet(m)

                if (wide) {
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => onSelect(m.id)}
                      className={`mb-[1px] flex h-11 w-full items-center gap-4 rounded-[6px] pl-3 pr-4 text-left ${isSelected ? 'bg-white/10' : 'hover:bg-white/5'}`}
                    >
                      <span className="flex w-2 justify-center">{unread && <span className="h-2 w-2 rounded-full bg-[#60CDFF]" />}</span>
                      <Avatar name={party} size={28} />
                      <span className={`w-[220px] shrink-0 truncate ${unread ? 'font-semibold' : ''}`}>{party}</span>
                      <span className="min-w-0 flex-1 truncate">
                        <span className={unread ? 'font-semibold' : ''}>{m.subject}</span>
                        <span className="text-[#C8C8C8]"> — {m.preview}</span>
                      </span>
                      <span className="flex w-14 justify-end gap-2 text-[#C8C8C8]">
                        {hasAttach && <AttachIcon aria-label="Есть вложение" />}
                        {flagged && <PinIcon filled className="text-[#C42B1C]" />}
                      </span>
                      <span className={`w-16 shrink-0 text-right text-[12px] ${unread ? 'font-semibold text-white' : 'text-[#C8C8C8]'}`}>{m.time}</span>
                    </button>
                  )
                }

                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => onSelect(m.id)}
                    className={`relative mb-0.5 flex w-full gap-3 rounded-[6px] py-2.5 pl-3.5 pr-3 text-left ${isSelected ? 'bg-white/10' : 'hover:bg-white/5'}`}
                  >
                    <span className={`absolute left-0 top-[18px] h-5 w-[3px] rounded-[2px] bg-[#60CDFF] ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                    <Avatar name={party} size={36} />
                    <span className="flex min-w-0 flex-1 flex-col gap-px">
                      <span className="flex items-center gap-1.5">
                        {unread && <span className="h-2 w-2 shrink-0 rounded-full bg-[#60CDFF]" />}
                        <span className={`min-w-0 flex-1 truncate ${unread ? 'font-semibold' : ''}`}>{party}</span>
                        {hasAttach && <AttachIcon className="shrink-0 text-[#C8C8C8]" aria-label="Есть вложение" />}
                        {flagged && <PinIcon filled className="shrink-0 text-[#C42B1C]" />}
                        <span className={`shrink-0 text-[12px] ${unread ? 'font-semibold text-white' : 'text-[#C8C8C8]'}`}>{m.time}</span>
                      </span>
                      <span className={`truncate ${unread ? 'font-semibold' : ''}`}>
                        {sA}
                        <Mark text={sM} />
                        {sB}
                      </span>
                      <span className="truncate text-[13px] text-[#C8C8C8]">
                        {pA}
                        <Mark text={pM} />
                        {pB}
                      </span>
                      {searching && (
                        <span className="flex items-center gap-1 text-[12px] text-[#C8C8C8]">
                          <FolderIcon className="h-[11px] w-[11px]" />
                          {FOLDER_NAMES[m.folder]}
                        </span>
                      )}
                    </span>
                  </button>
                )
              })}
            </div>
          ))
        )}
      </div>
    </section>
  )
}
