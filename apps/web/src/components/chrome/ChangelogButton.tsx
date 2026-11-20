import { useEffect, useRef, useState } from 'react'
import { CHANGELOG_AREAS, changelog, type ChangelogArea, type ChangelogEntry } from '../../data/changelog'

const SEEN_KEY = 'mdt.changelog.seen'

function readSeen(): string | null {
  try {
    return localStorage.getItem(SEEN_KEY)
  } catch {
    return null
  }
}
function writeSeen(v: string) {
  try {
    localStorage.setItem(SEEN_KEY, v)
  } catch {
    /* private mode — the dot just shows again next time */
  }
}

const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']

/** «20.11.2026» → «Сегодня · 20 ноября» / «Вчера · 19 ноября» / «12 ноября 2026». */
function dayLabel(date: string): string {
  const [d, m, y] = date.split('.').map(Number)
  const now = new Date()
  const that = new Date(y, m - 1, d)
  const diff = Math.round((new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() - that.getTime()) / 86400000)
  const pretty = `${d} ${MONTHS[m - 1]}`
  if (diff === 0) return `Сегодня · ${pretty}`
  if (diff === 1) return `Вчера · ${pretty}`
  return y === now.getFullYear() ? pretty : `${pretty} ${y}`
}

const count = (e: ChangelogEntry) => e.groups.reduce((s, g) => s + g.items.length, 0)

function plural(n: number) {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return 'изменение'
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 'изменения'
  return 'изменений'
}

function AreaIcon({ area }: { area: ChangelogArea }) {
  if (area === 'desktop') {
    return (
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] bg-[#2B5797] text-white">
        <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
          <rect x="2.5" y="3.5" width="15" height="10" rx="1.5" />
          <path d="M7 17h6M10 13.5V17" />
        </svg>
      </span>
    )
  }
  return <img src={CHANGELOG_AREAS[area].icon} alt="" className="h-7 w-7 shrink-0 object-contain" />
}

const Chevron = ({ open }: { open: boolean }) => (
  <svg width="10" height="10" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true">
    <path d="M5 8l5 5 5-5" />
  </svg>
)

/** One app's changes of the day: icon, name, count — collapsible list. */
function AreaCard({ area, items, startOpen }: { area: ChangelogArea; items: string[]; startOpen: boolean }) {
  const [open, setOpen] = useState(startOpen)
  return (
    <div className="overflow-hidden rounded-[8px] bg-[#2D2D2D] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left hover:bg-white/[0.04]">
        <AreaIcon area={area} />
        <span className="flex-1 text-[14px] font-semibold text-white">{CHANGELOG_AREAS[area].label}</span>
        <span className="rounded-full bg-white/[0.08] px-2 text-[11px] leading-5 text-[#C8C8C8]">{items.length}</span>
        <span className="text-[#C8C8C8]">
          <Chevron open={open} />
        </span>
      </button>
      {open && (
        <ul className="flex flex-col gap-2 border-t border-white/[0.06] px-3 pb-3 pt-2.5">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-[13px] leading-[19px] text-[#E4E4E4]">
              <span className="mt-[8px] h-[5px] w-[5px] shrink-0 rounded-full bg-[#60CDFF]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/** A day: header with how much changed, collapsible; the newest one is open. */
function DaySection({ entry, startOpen, isNew }: { entry: ChangelogEntry; startOpen: boolean; isNew: boolean }) {
  const [open, setOpen] = useState(startOpen)
  const n = count(entry)
  return (
    <section>
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="flex w-full items-center gap-2 rounded-[6px] px-1.5 py-1.5 text-left hover:bg-white/[0.04]">
        <span className="flex-1">
          <span className="block text-[13px] font-semibold text-white">{dayLabel(entry.date)}</span>
          <span className="block text-[12px] text-[#A8A8A8]">
            {n} {plural(n)} · {entry.groups.map((g) => CHANGELOG_AREAS[g.area].label).join(', ')}
          </span>
        </span>
        {isNew && <span className="rounded-full bg-[#60CDFF] px-2 text-[11px] font-semibold leading-5 text-black">Новое</span>}
        <span className="text-[#C8C8C8]">
          <Chevron open={open} />
        </span>
      </button>
      {open && (
        <div className="mt-1.5 flex flex-col gap-1.5">
          {entry.groups.map((g, i) => (
            <AreaCard key={g.area} area={g.area} items={g.items} startOpen={i === 0 || g.items.length <= 3} />
          ))}
        </div>
      )}
    </section>
  )
}

/**
 * «Что нового» bell next to the profile pill — a Windows 11 flyout with the
 * patch notes (`data/changelog.ts`): days newest first (the latest open),
 * each split into cards per app. A dot on the bell marks updates the user
 * hasn't opened yet.
 */
export function ChangelogButton() {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const latest = changelog[0]?.date ?? ''
  const [seen, setSeen] = useState(readSeen)
  const unseen = !!latest && seen !== latest
  /** whether the latest day was new when the flyout was opened (keeps «Новое» while it is open) */
  const [freshOnOpen, setFreshOnOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setIsOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', onKey)
    }
  }, [isOpen])

  function toggle() {
    setIsOpen((v) => !v)
    if (!isOpen) setFreshOnOpen(unseen)
    if (!isOpen && unseen) {
      writeSeen(latest)
      setSeen(latest)
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={toggle}
        aria-label={unseen ? 'Патчноут — есть новые изменения' : 'Патчноут'}
        aria-expanded={isOpen}
        title="Патчноут — что нового в MDT"
        className={`relative flex h-[54px] items-center gap-2 rounded-[6px] px-2.5 text-ink/80 hover:bg-ink/5 hover:text-ink ${isOpen ? 'bg-ink/5 text-ink' : ''}`}
      >
        {/* a release-notes sheet with a «new» sparkle */}
        <span className="relative">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11.5 2.5H5.5a1.5 1.5 0 00-1.5 1.5v12a1.5 1.5 0 001.5 1.5h9a1.5 1.5 0 001.5-1.5V9" />
            <path d="M7 10.5h6M7 13.5h4" />
            <path d="M15.5 1.5l.7 1.6 1.6.7-1.6.7-.7 1.6-.7-1.6-1.6-.7 1.6-.7z" fill="currentColor" stroke="none" />
          </svg>
          {unseen && <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#60CDFF] shadow-[0_0_0_2px_#1C1C1C]" />}
        </span>
        <span className="flex flex-col items-start leading-[14px]">
          <span className="text-[11px] font-semibold uppercase tracking-[0.02em]">Патчноут</span>
          <span className={`text-[10px] ${unseen ? 'text-[#60CDFF]' : 'text-ink/50'}`}>{unseen ? 'есть новое' : `от ${latest.slice(0, 5)}`}</span>
        </span>
      </button>

      {isOpen && (
        <div role="dialog" aria-label="Патчноут" className="absolute right-0 top-full z-50 mt-2 flex max-h-[min(640px,calc(100vh-120px))] w-[420px] flex-col overflow-hidden rounded-[8px] border border-white/[0.08] bg-[#202020] text-white shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
          <div className="flex shrink-0 items-center gap-3 px-4 pb-3 pt-3.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#60CDFF]/[0.15] text-[#60CDFF]">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M10 2.5l1.9 4.6 4.6.4-3.5 3 1.1 4.8L10 12.8l-4.1 2.5 1.1-4.8-3.5-3 4.6-.4z" />
              </svg>
            </span>
            <span className="flex-1 leading-5">
              <span className="block text-[16px] font-semibold">Патчноут</span>
              <span className="block text-[12px] text-[#A8A8A8]">Обновления MDT по дням и приложениям</span>
            </span>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Закрыть" className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[#C8C8C8] hover:bg-white/10 hover:text-white">
              <svg width="11" height="11" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M5 5l10 10M15 5L5 15" />
              </svg>
            </button>
          </div>
          <div className="scroll flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto border-t border-white/[0.06] px-3 pb-3 pt-2.5">
            {changelog.map((entry, i) => (
              <DaySection key={entry.date} entry={entry} startOpen={i === 0} isNew={i === 0 && freshOnOpen} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
