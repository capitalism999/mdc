import { useEffect, useState } from 'react'
import type { CaseTone, CaseTreeItem } from '../../../types'
import { timeKey } from './casePlaces'

/** «Новое событие» / «Изменить событие» for the case «Хронология»: what
 * happened and when (date + time), details, status and where it is known
 * from. Unlike the activity journal, these entries are written by hand. */

export const EVENT_STATUSES: [string, CaseTone][] = [
  ['Подтверждено', 'green'],
  ['Запланировано', 'blue'],
  ['Не подтверждено', 'amber'],
  ['Перенесено', 'amber'],
]

const TONE: Record<CaseTone, { bg: string; fg: string }> = {
  red: { bg: 'rgba(232,17,35,0.2)', fg: '#FF99A4' },
  amber: { bg: 'rgba(255,185,0,0.16)', fg: '#FCE100' },
  green: { bg: 'rgba(16,124,16,0.28)', fg: '#6CCB5F' },
  grey: { bg: 'rgba(255,255,255,0.08)', fg: '#C8C8C8' },
  blue: { bg: 'rgba(0,120,212,0.25)', fg: '#99D9FF' },
}

const DATE_RE = /^(\d{2})\.(\d{2})\.(\d{4})$/
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/

/** «10:10 · Дело открыто» → time + name. */
export function splitEventTitle(title: string): { time: string; name: string } {
  const m = /^(\d{1,2}:\d{2})\s*·\s*(.*)$/.exec(title)
  return m ? { time: m[1].padStart(5, '0'), name: m[2] } : { time: '', name: title }
}

/** Sort key of an event: its date plus the time from the title. */
export function eventKey(it: CaseTreeItem): number {
  const { time } = splitEventTitle(it.title)
  return timeKey(time ? `${it.date}, ${time}` : it.date)
}

/** Events in chronological order (other records keep their place at the end). */
export function sortEvents(items: CaseTreeItem[]): CaseTreeItem[] {
  const ev = items.filter((it) => it.kind === 'event').sort((a, b) => eventKey(a) - eventKey(b))
  return [...ev, ...items.filter((it) => it.kind !== 'event')]
}

function nowParts() {
  const d = new Date()
  const p2 = (n: number) => String(n).padStart(2, '0')
  return { date: `${p2(d.getDate())}.${p2(d.getMonth() + 1)}.${d.getFullYear()}`, time: `${p2(d.getHours())}:${p2(d.getMinutes())}` }
}

export interface EventDraft {
  title: string
  sub: string
  date: string
  status: string
  tone: CaseTone
  source: string
}

interface Props {
  /** record being edited; null = a new event */
  initial: CaseTreeItem | null
  accent: string
  onSave: (d: EventDraft) => void
  onClose: () => void
}

export function CaseEventDialog({ initial, accent, onSave, onClose }: Props) {
  const now = nowParts()
  // time only when known: a new event starts without one
  const parts = initial ? splitEventTitle(initial.title) : { time: '', name: '' }
  const [name, setName] = useState(parts.name)
  const [date, setDate] = useState(initial?.date ?? now.date)
  const [time, setTime] = useState(parts.time)
  const [sub, setSub] = useState(initial?.sub ?? '')
  const [source, setSource] = useState(initial?.info.find(([k]) => k === 'Источник')?.[1] ?? '')
  const [status, setStatus] = useState(() => Math.max(0, EVENT_STATUSES.findIndex(([l]) => l === initial?.status)))
  const [tried, setTried] = useState(false)

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [onClose])

  const dm = DATE_RE.exec(date.trim())
  const nameErr = !name.trim() ? 'Опишите событие' : null
  const dateErr = !dm || +dm[1] < 1 || +dm[1] > 31 || +dm[2] < 1 || +dm[2] > 12 ? 'Формат: ДД.ММ.ГГГГ' : null
  const timeErr = time.trim() && !TIME_RE.test(time.trim()) ? 'Формат: ЧЧ:ММ' : null

  function submit() {
    setTried(true)
    if (nameErr || dateErr || timeErr) return
    const [label, tone] = EVENT_STATUSES[status]
    onSave({ title: time.trim() ? `${time.trim()} · ${name.trim()}` : name.trim(), sub: sub.trim(), date: date.trim(), status: label, tone, source: source.trim() })
  }

  const input = 'h-8 rounded-[6px] bg-[#3A3A3A] px-2.5 text-[13px] font-normal text-white outline-none placeholder:text-[#C2C2C2]/60'
  const ring = (err: boolean) => ({ boxShadow: err ? 'inset 0 0 0 1px #E5484D' : 'none' })
  const errText = (e: string | null) => tried && e && <span className="font-normal text-[#FF99A4]">{e}</span>

  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div role="dialog" aria-label={initial ? 'Изменить событие' : 'Новое событие'} className="flex max-h-[min(640px,100%)] w-[520px] max-w-full flex-col overflow-hidden rounded-[12px] border border-[#3A3A3A] bg-[#2C2C2C] text-white shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
        <div className="flex shrink-0 items-center gap-3 px-5 pb-3 pt-[18px]">
          <span className="flex-1 leading-5">
            <span className="block text-[18px] font-semibold">{initial ? 'Изменить событие' : 'Новое событие'}</span>
            <span className="block text-[12px] text-[#C2C2C2]">Что и когда произошло по делу. Встанет в хронологию по дате и времени.</span>
          </span>
          <button type="button" onClick={onClose} aria-label="Закрыть" className="flex h-8 w-8 items-center justify-center rounded-[6px] hover:bg-white/10">
            <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto px-5 pb-4 pt-1" onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLElement).tagName === 'INPUT' && submit()}>
          <label className="flex flex-col gap-1 text-[12px] font-semibold text-[#C2C2C2]">
            Событие
            <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Например, Tyrone Webb замечен у гаража" className={input} style={ring(tried && !!nameErr)} />
            {errText(nameErr)}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-[12px] font-semibold text-[#C2C2C2]">
              Дата
              <input value={date} onChange={(e) => setDate(e.target.value)} placeholder="ДД.ММ.ГГГГ" className={input} style={ring(tried && !!dateErr)} />
              {errText(dateErr)}
            </label>
            <label className="flex flex-col gap-1 text-[12px] font-semibold text-[#C2C2C2]">
              Время (если известно)
              <input value={time} onChange={(e) => setTime(e.target.value)} placeholder="ЧЧ:ММ" className={input} style={ring(tried && !!timeErr)} />
              {errText(timeErr)}
            </label>
          </div>
          <label className="flex flex-col gap-1 text-[12px] font-semibold text-[#C2C2C2]">
            Подробности
            <input value={sub} onChange={(e) => setSub(e.target.value)} placeholder="Кто, где, что известно" className={input} />
          </label>
          <label className="flex flex-col gap-1 text-[12px] font-semibold text-[#C2C2C2]">
            Источник (необязательно)
            <input value={source} onChange={(e) => setSource(e.target.value)} placeholder="Рапорт R-11002, камера, показания…" className={input} />
          </label>
          <div className="flex flex-col gap-1 text-[12px] font-semibold text-[#C2C2C2]">
            Статус
            <div className="flex flex-wrap gap-1">
              {EVENT_STATUSES.map(([label, tone], i) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setStatus(i)}
                  className="h-[26px] rounded-[13px] px-2.5 text-[12px] font-semibold hover:brightness-125"
                  style={{ background: TONE[tone].bg, color: TONE[tone].fg, boxShadow: status === i ? `0 0 0 1.5px ${TONE[tone].fg}` : 'none', opacity: status === i ? 1 : 0.6 }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-2.5 border-t border-[#3A3A3A] px-5 py-3.5">
          <button type="button" onClick={onClose} className="h-[34px] rounded-[8px] bg-[#3A3A3A] px-4 text-[13px] hover:brightness-125">
            Отмена
          </button>
          <button type="button" onClick={submit} style={{ background: accent }} className="h-[34px] rounded-[8px] px-4 text-[13px] font-semibold text-black hover:brightness-110">
            {initial ? 'Сохранить' : 'Добавить'}
          </button>
        </div>
      </div>
    </div>
  )
}
