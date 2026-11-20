import { useEffect, useRef, useState } from 'react'
import type { CaseListRow, CaseTone, CaseTreeItem } from '../../../types'

/** Status pickers for Дела: the case status and the status of each record
 * (participant, vehicle, evidence…). */

export interface StatusOption {
  status: string
  tone: CaseTone
  desc?: string
  /** optional group heading in the menu */
  group?: string
}

/** Every status a case can be in: its tag colour and which home-list group
 * («В работе» / «Розыск» / «В суде» / «Закрытые») it belongs to. */
export const CASE_STATUSES: (StatusOption & { group: CaseListRow['group'] })[] = [
  { status: 'Новое', tone: 'red', group: 'work', desc: 'Заведено, ещё никто не взял в работу' },
  { status: 'Расследование', tone: 'amber', group: 'work', desc: 'Идёт сбор улик и показаний' },
  { status: 'Подготовка обыска', tone: 'blue', group: 'work', desc: 'Ордер получен или запрошен' },
  { status: 'Розыск', tone: 'amber', group: 'search', desc: 'Подозреваемый или ТС в розыске' },
  { status: 'В суде', tone: 'blue', group: 'court', desc: 'Передано прокурору, идут слушания' },
  { status: 'Приостановлено', tone: 'grey', group: 'closed', desc: 'Нет новых зацепок, дело на паузе' },
  { status: 'Закрыто', tone: 'green', group: 'closed', desc: 'Расследование завершено' },
]

const S = (status: string, tone: CaseTone, group?: string): StatusOption => ({ status, tone, group })

/** Record statuses per record kind (places use their type instead). */
export const ITEM_STATUSES: Partial<Record<CaseTreeItem['kind'], StatusOption[]>> = {
  person: [
    S('Проверяется', 'blue', 'Подозреваемые'),
    S('Розыск', 'amber', 'Подозреваемые'),
    S('Особый розыск', 'red', 'Подозреваемые'),
    S('Под наблюдением', 'amber', 'Подозреваемые'),
    S('Под стражей', 'red', 'Подозреваемые'),
    S('Освобождён', 'grey', 'Подозреваемые'),
    S('Не опрошен', 'grey', 'Свидетели и потерпевшие'),
    S('Показания даны', 'green', 'Свидетели и потерпевшие'),
    S('Повторный опрос', 'amber', 'Свидетели и потерпевшие'),
    S('Не отвечает', 'red', 'Свидетели и потерпевшие'),
    S('Заявление подано', 'green', 'Свидетели и потерпевшие'),
    S('Ведущий', 'blue', 'Сотрудники'),
    S('Первый на месте', 'blue', 'Сотрудники'),
    S('Группа обыска', 'blue', 'Сотрудники'),
    S('Наблюдение', 'green', 'Сотрудники'),
    S('Помогает', 'blue', 'Сотрудники'),
  ],
  vehicle: [S('Проверяется', 'blue'), S('Проверено', 'green'), S('Розыск', 'amber'), S('Не найдена', 'red'), S('Штрафстоянка', 'grey'), S('Возвращено владельцу', 'green')],
  evidence: [S('Хранилище', 'grey'), S('В лаборатории', 'blue'), S('На ДНК', 'amber'), S('На отпечатках', 'amber'), S('Возвращено владельцу', 'green')],
  exam: [S('Ожидается', 'amber'), S('В работе', 'amber'), S('Совпадение', 'green'), S('Нет совпадений', 'grey'), S('Непригодны', 'grey')],
  media: [S('Новое', 'blue'), S('Ожидается', 'amber'), S('Проверено', 'green')],
  doc: [S('Черновик', 'grey'), S('На проверке', 'amber'), S('Отправлен', 'blue'), S('Подписан', 'green'), S('Утверждён', 'green'), S('Действует', 'blue'), S('Исполнен', 'green'), S('Ответ получен', 'green'), S('Отклонён', 'red')],
  event: [S('Запланировано', 'blue'), S('Подтверждено', 'green'), S('Не подтверждено', 'amber'), S('Перенесено', 'amber')],
  surv: [S('Ждёт ордера', 'amber'), S('Активен', 'blue'), S('Просмотрено', 'green'), S('Нет совпадений', 'grey'), S('Отказано', 'red')],
}

export const STATUS_TONE: Record<CaseTone, { bg: string; fg: string }> = {
  red: { bg: 'rgba(232,17,35,0.2)', fg: '#FF99A4' },
  amber: { bg: 'rgba(255,185,0,0.16)', fg: '#FCE100' },
  green: { bg: 'rgba(16,124,16,0.28)', fg: '#6CCB5F' },
  grey: { bg: 'rgba(255,255,255,0.08)', fg: '#C8C8C8' },
  blue: { bg: 'rgba(0,120,212,0.25)', fg: '#99D9FF' },
}

/** Status tag that opens a menu to change the status. */
export function StatusMenu({ status, tone, options, onChange, align = 'left', label = 'Статус' }: { status: string; tone: CaseTone; options: StatusOption[]; onChange: (status: string, tone: CaseTone) => void; align?: 'left' | 'right' | 'center'; label?: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', close)
    window.addEventListener('keydown', esc, true)
    return () => {
      document.removeEventListener('mousedown', close)
      window.removeEventListener('keydown', esc, true)
    }
  }, [open])
  const t = STATUS_TONE[tone]
  // Keep a status that isn't in the list (free-form data) visible as current.
  const list = options.some((o) => o.status === status) ? options : [{ status, tone, group: options[0]?.group ? 'Сейчас' : undefined }, ...options]
  const pos = align === 'right' ? 'right-0' : align === 'center' ? 'left-1/2 -translate-x-1/2' : 'left-0'
  return (
    <span ref={ref} className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        title={`Изменить: ${label.toLowerCase()}`}
        className="flex items-center gap-1.5 rounded-[10px] px-2.5 py-0.5 text-[12px] font-semibold hover:brightness-125"
        style={{ background: t.bg, color: t.fg }}
      >
        {status}
        <svg width="8" height="8" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 8l4 4 4-4" />
        </svg>
      </button>
      {open && (
        <div role="listbox" aria-label={label} className={`absolute top-[28px] z-30 max-h-[360px] w-[290px] overflow-y-auto rounded-[8px] border border-[#3A3A3A] bg-[#2C2C2C] p-1 text-left shadow-[0_10px_28px_rgba(0,0,0,0.45)] ${pos}`}>
          {list.map((s, i) => {
            const on = s.status === status
            const heading = s.group && s.group !== list[i - 1]?.group ? s.group : null
            return (
              <div key={s.status + i}>
                {heading && <div className={`px-2.5 pb-1 text-[11px] font-semibold uppercase tracking-wide text-[#9A9A9A] ${i > 0 ? 'mt-1.5 border-t border-[#3A3A3A] pt-2' : 'pt-1'}`}>{heading}</div>}
                <button
                  type="button"
                  role="option"
                  aria-selected={on}
                  onClick={() => {
                    setOpen(false)
                    if (!on) onChange(s.status, s.tone)
                  }}
                  className={`flex w-full items-start gap-2.5 rounded-[4px] px-2.5 py-1.5 text-left ${on ? 'bg-white/[0.08]' : 'hover:bg-white/[0.06]'}`}
                >
                  <span className="mt-[6px] h-2 w-2 shrink-0 rounded-full" style={{ background: STATUS_TONE[s.tone].fg }} />
                  <span className="flex flex-1 flex-col leading-[18px]">
                    <span className="text-[13px] font-semibold text-white">{s.status}</span>
                    {s.desc && <span className="text-[11px] leading-[15px] text-[#C2C2C2]">{s.desc}</span>}
                  </span>
                  {on && (
                    <svg className="mt-1 shrink-0 text-[#60CDFF]" width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4.5 10.5l3.5 3.5 7.5-8" />
                    </svg>
                  )}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </span>
  )
}

/** Case status tag + menu. Case statuses carry their own group (home-list
 * filter), so no headings are shown. */
export function CaseStatusMenu({ status, tone, onChange, align = 'left' }: { status: string; tone: CaseTone; onChange: (status: string) => void; align?: 'left' | 'right' }) {
  return <StatusMenu status={status} tone={tone} options={CASE_STATUSES.map(({ status: s, tone: t, desc }) => ({ status: s, tone: t, desc }))} onChange={(s) => onChange(s)} align={align} label="Статус дела" />
}
