import { useEffect, useRef, useState, type ReactNode } from 'react'
import { mockPenalCodes } from '../../../lib/mockData/penalCodes'
import { findStaff, staffDirectory, type StaffEntry } from './staffDirectory'

/** Editors for a case's own properties on the overview: title, lead,
 * charges and related cases. */

function useOutside(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const down = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) close()
    }
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        close()
      }
    }
    document.addEventListener('mousedown', down)
    window.addEventListener('keydown', esc, true)
    return () => {
      document.removeEventListener('mousedown', down)
      window.removeEventListener('keydown', esc, true)
    }
  }, [open, close])
  return ref
}

const panel = 'absolute z-30 rounded-[8px] border border-[#3A3A3A] bg-[#2C2C2C] p-1 shadow-[0_10px_28px_rgba(0,0,0,0.45)]'
const searchCls = 'mb-1 h-8 w-full rounded-[6px] bg-[#3A3A3A] px-2.5 text-[13px] text-white outline-none'

export function PencilBtn({ label, onClick, className = '' }: { label: string; onClick: () => void; className?: string }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] text-[#C2C2C2] opacity-0 hover:bg-white/10 hover:text-white focus:opacity-100 group-hover:opacity-100 ${className}`}>
      <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.5 4.5l3 3L7 16H4v-3z" />
      </svg>
    </button>
  )
}

/** Case title: shown as the page heading, ✎ turns it into a field. */
export function EditableTitle({ value, onSave }: { value: string; onSave: (v: string) => void }) {
  const [editing, setEditing] = useState(false)
  const [v, setV] = useState(value)
  if (editing) {
    const commit = () => {
      const t = v.trim()
      if (t && t !== value) onSave(t)
      setEditing(false)
    }
    return (
      <textarea
        autoFocus
        value={v}
        rows={1}
        ref={(el) => {
          // grow to the content: one line when it fits, more when it wraps
          if (!el) return
          el.style.height = 'auto'
          el.style.height = `${el.scrollHeight}px`
        }}
        onChange={(e) => {
          setV(e.target.value)
          e.currentTarget.style.height = 'auto'
          e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`
        }}
        onFocus={(e) => e.currentTarget.select()}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            commit()
          }
          if (e.key === 'Escape') {
            e.stopPropagation()
            setEditing(false)
          }
        }}
        maxLength={160}
        aria-label="Название дела"
        className="m-0 w-full resize-none rounded-[8px] bg-black/30 px-2 py-0.5 text-[28px] font-bold leading-9 tracking-[-0.2px] text-white outline-none ring-1 ring-[#60CDFF]"
      />
    )
  }
  return (
    <div className="group flex items-start gap-2">
      <h1 className="m-0 min-w-0 break-words text-[28px] font-bold leading-9 tracking-[-0.2px]">{value}</h1>
      <PencilBtn
        label="Изменить название дела"
        className="mt-0.5 h-8 w-8"
        onClick={() => {
          setV(value)
          setEditing(true)
        }}
      />
    </div>
  )
}

/** Lead investigator picker (department staff from MDC). */
export function LeadPicker({ name, onPick, children, align = 'left', variant = 'text' }: { name: string; onPick: (e: StaffEntry) => void; children: ReactNode; align?: 'left' | 'right'; variant?: 'text' | 'avatar' }) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const ref = useOutside(open, () => setOpen(false))
  const people = (q.trim() ? findStaff(q) : staffDirectory()).filter((s) => !s.group)
  return (
    <div ref={ref} className="relative min-w-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Сменить ведущего"
        title="Сменить ведущего"
        className={`flex min-w-0 text-left hover:bg-white/[0.08] ${variant === 'avatar' ? '-my-1 -mr-1.5 items-center gap-1.5 rounded-[14px] py-1 pl-1 pr-2' : '-mx-2 -my-1 max-w-[calc(100%+16px)] items-start gap-2.5 rounded-[8px] px-2 py-1'} ${open ? 'bg-white/[0.08]' : ''}`}
      >
        <span className="flex min-w-0 flex-col overflow-hidden [&>span]:truncate">{children}</span>
        <svg className={`shrink-0 text-[#C2C2C2] transition-transform ${variant === 'text' ? 'mt-[5px]' : ''} ${open ? 'rotate-180' : ''}`} width="10" height="10" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 8l5 5 5-5" />
        </svg>
      </button>
      {open && (
        <div className={`${panel} top-[calc(100%+4px)] w-[300px] ${align === 'right' ? 'right-0' : 'left-0'}`}>
          <div className="px-2.5 pb-1.5 pt-1 text-[12px] font-semibold text-[#C2C2C2]">Сменить ведущего дела</div>
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Имя, жетон или отдел" aria-label="Поиск сотрудника" className={searchCls} />
          <div className="max-h-[260px] overflow-y-auto">
            {people.length === 0 && <div className="px-2.5 py-2 text-[12px] text-[#FF99A4]">Сотрудник не найден</div>}
            {people.map((s) => {
              const on = s.name === name
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    setQ('')
                    if (!on) onPick(s)
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-[4px] px-2 py-1.5 text-left ${on ? 'bg-white/[0.08]' : 'hover:bg-white/[0.06]'}`}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] text-[10px] font-semibold text-white" style={{ background: s.color }}>
                    {s.initials}
                  </span>
                  <span className="min-w-0 flex-1 leading-[16px]">
                    <span className="block truncate text-[13px] font-semibold text-white">{s.name}</span>
                    {s.sub && <span className="block truncate text-[11px] text-[#C2C2C2]">{s.sub}</span>}
                  </span>
                  {on && <span className="text-[11px] text-[#60CDFF]">Ведущий</span>}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

/** Charges: × on each, «+ Статья» searches the penal code. */
export function ChargesEditor({ charges, onChange }: { charges: [string, string][]; onChange: (c: [string, string][], change: string) => void }) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const ref = useOutside(open, () => setOpen(false))
  const s = q.trim().toLowerCase().replace(/^pc\s*/, '')
  const have = new Set(charges.map(([c]) => c))
  const found = mockPenalCodes.filter((p) => !have.has(`PC ${p.code}`) && (!s || p.code.toLowerCase().includes(s) || p.title.toLowerCase().includes(s))).slice(0, 40)
  const custom = /^(?:PC\s*)?([\dA-Za-z.-]+)\s+(.+)$/i.exec(q.trim())
  return (
    <div className="flex flex-col gap-1">
      {charges.map(([code, what]) => (
        <span key={code} className="group/c flex items-start gap-1 text-[13px] leading-[18px]">
          <span className="min-w-0 flex-1">
            <span className="font-semibold">{code}</span> <span className="text-[#E0E0E0]">{what}</span>
          </span>
          <button
            type="button"
            aria-label={`Убрать статью ${code}`}
            title="Убрать статью"
            onClick={() => onChange(charges.filter(([c]) => c !== code), `Статья убрана: ${code} ${what}`)}
            className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[4px] text-[#C2C2C2] opacity-0 hover:bg-white/10 hover:text-[#FF99A4] focus:opacity-100 group-hover/c:opacity-100"
          >
            <svg width="9" height="9" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </span>
      ))}
      <div ref={ref} className="relative">
        <button type="button" onClick={() => setOpen((o) => !o)} className="flex h-6 items-center gap-1 rounded-[4px] px-1 text-[12px] text-[#99D9FF] hover:bg-white/10">
          <svg width="10" height="10" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M10 4v12M4 10h12" />
          </svg>
          Статья
        </button>
        {open && (
          <div className={`${panel} right-0 top-[28px] w-[320px]`}>
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Номер или название статьи" aria-label="Поиск статьи" className={searchCls} />
            <div className="max-h-[260px] overflow-y-auto">
              {found.map((p) => (
                <button
                  key={p.code}
                  type="button"
                  onClick={() => {
                    onChange([...charges, [`PC ${p.code}`, p.title]], `Статья добавлена: PC ${p.code} ${p.title}`)
                    setOpen(false)
                    setQ('')
                  }}
                  className="flex w-full items-baseline gap-2 rounded-[4px] px-2.5 py-1.5 text-left hover:bg-white/[0.06]"
                >
                  <span className="w-[64px] shrink-0 text-[12px] font-semibold text-white">PC {p.code}</span>
                  <span className="min-w-0 flex-1 text-[13px] text-[#E0E0E0]">{p.title}</span>
                </button>
              ))}
              {found.length === 0 && !custom && <div className="px-2.5 py-2 text-[12px] text-[#C2C2C2]">Нет такой статьи. Введите номер и название, чтобы добавить свою.</div>}
              {custom && !have.has(`PC ${custom[1]}`) && (
                <button
                  type="button"
                  onClick={() => {
                    onChange([...charges, [`PC ${custom[1]}`, custom[2]]], `Статья добавлена: PC ${custom[1]} ${custom[2]}`)
                    setOpen(false)
                    setQ('')
                  }}
                  className="mt-1 flex w-full items-center gap-2 rounded-[4px] border-t border-[#3A3A3A] px-2.5 py-2 text-left text-[13px] text-[#99D9FF] hover:bg-white/[0.06]"
                >
                  + Добавить: PC {custom[1]} {custom[2]}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/** Related cases: chips (open on click, × to unlink) and «+» to link one. */
export function RelatedEditor({ related, cases, onChange, onOpen }: { related: string[]; cases: { id: string; no: string; short: string }[]; onChange: (r: string[], change: string) => void; onOpen: (id: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useOutside(open, () => setOpen(false))
  const free = cases.filter((c) => !related.includes(c.no))
  return (
    <span className="inline-flex flex-wrap items-center justify-end gap-1">
      {related.map((no) => {
        const c = cases.find((x) => x.no === no)
        return (
          <span key={no} className="group/r inline-flex h-6 items-center gap-0.5 rounded-[12px] bg-[rgba(96,205,255,0.12)] pl-2 pr-0.5 text-[12px]">
            {c ? (
              <button type="button" onClick={() => onOpen(c.id)} className="text-[#99D9FF] hover:underline">
                {no}
              </button>
            ) : (
              <span className="text-[#C2C2C2]">{no}</span>
            )}
            <button type="button" aria-label={`Убрать связь с ${no}`} title="Убрать связь" onClick={() => onChange(related.filter((x) => x !== no), `Убрана связь с делом ${no}`)} className="flex h-4 w-4 items-center justify-center rounded-full text-[#99D9FF] hover:bg-white/15">
              <svg width="8" height="8" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <path d="M5 5l10 10M15 5L5 15" />
              </svg>
            </button>
          </span>
        )
      })}
      {free.length > 0 && (
        <div ref={ref} className="relative">
          <button type="button" aria-label="Связать с делом" title="Связать с делом" onClick={() => setOpen((o) => !o)} className="flex h-6 w-6 items-center justify-center rounded-full text-[#99D9FF] hover:bg-white/10">
            <svg width="10" height="10" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M10 4v12M4 10h12" />
            </svg>
          </button>
          {open && (
            <div className={`${panel} right-0 top-[28px] w-[260px] text-left`}>
              {free.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    onChange([...related, c.no], `Добавлена связь с делом ${c.no}`)
                    setOpen(false)
                  }}
                  className="flex w-full flex-col rounded-[4px] px-2.5 py-1.5 text-left leading-[16px] hover:bg-white/[0.06]"
                >
                  <span className="text-[13px] font-semibold text-white">{c.no}</span>
                  <span className="truncate text-[11px] text-[#C2C2C2]">{c.short}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </span>
  )
}
