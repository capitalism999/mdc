import { useMemo, useState } from 'react'
import type { CaseLogRow } from '../../../types'
import { MultiDropdown, SingleDropdown } from './CaseDropdown'

function plural(n: number, one: string, few: string, many: string) {
  const a = n % 10
  const b = n % 100
  if (a === 1 && b !== 11) return one
  if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return few
  return many
}

/** A case's activity journal: search, filter by action / person / section,
 * sort by date / action / person / section, grouped by day when sorted by
 * date. Also exports the compact «Последние изменения» list for the overview. */

type Action = CaseLogRow['action']

export const ACTION_TONE: Record<Action, string> = { Добавление: '#6CCB5F', Изменение: '#FCE100', Перемещение: '#99D9FF', Удаление: '#FF99A4' }
const ACTIONS: { id: Action; label: string }[] = [
  { id: 'Добавление', label: 'Добавления' },
  { id: 'Изменение', label: 'Изменения' },
  { id: 'Перемещение', label: 'Перемещения' },
  { id: 'Удаление', label: 'Удаления' },
]
const SORTS = [
  { id: 'new', label: 'Сначала новые' },
  { id: 'old', label: 'Сначала старые' },
  { id: 'action', label: 'По действию' },
  { id: 'who', label: 'По сотруднику' },
  { id: 'section', label: 'По разделу' },
] as const
type SortId = (typeof SORTS)[number]['id']

/** 'DD.MM, HH:MM' → sortable number. */
function timeKey(when: string) {
  const m = /(\d{1,2})\.(\d{1,2}),?\s*(\d{1,2}):(\d{2})/.exec(when)
  return m ? +m[2] * 1e6 + +m[1] * 1e4 + +m[3] * 100 + +m[4] : 0
}
const dayOf = (when: string) => when.split(',')[0]
/** Top section of a journal row; rows about the case itself (where = case
 * number, e.g. status changes) are grouped as «Дело целиком». */
const sectionOf = (where: string) => {
  const top = where.split(' › ')[0]
  return /^[A-Z]{2}-\d/.test(top) ? 'Дело целиком' : top
}

function Row({ r, last, onWho, onSection }: { r: CaseLogRow; last: boolean; onWho?: (w: string) => void; onSection?: (s: string) => void }) {
  const sec = r.where.split(' › ')[0]
  const rest = r.where.slice(sec.length)
  return (
    <div className="flex items-center px-4">
      <span className={`flex min-w-0 flex-1 items-center gap-3.5 py-2.5 ${last ? '' : 'border-b border-[#3A3A3A]'}`}>
        <span className="min-w-0 flex-1 leading-[18px]">
          <span className="flex min-w-0 items-center gap-1.5 text-[12px] text-[#C2C2C2]">
            <span className="inline-flex shrink-0 items-center gap-1 rounded-[4px] px-1.5 text-[11px] font-semibold leading-[16px]" style={{ color: ACTION_TONE[r.action], background: `${ACTION_TONE[r.action]}1F` }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: ACTION_TONE[r.action] }} />
              {r.action}
            </span>
            <span className="ell min-w-0">
              {onSection ? (
                <button type="button" onClick={() => onSection(sectionOf(r.where))} className="hover:text-[#99D9FF] hover:underline" title={`Только раздел «${sectionOf(r.where)}»`}>
                  {sec}
                </button>
              ) : (
                sec
              )}
              {rest}
            </span>
          </span>
          <span className="ell mt-0.5 block text-[13px]">{r.detail}</span>
          {onWho ? (
            <button type="button" onClick={() => onWho(r.who)} className="block text-[12px] text-[#C2C2C2] hover:text-[#99D9FF] hover:underline" title={`Только действия: ${r.who}`}>
              {r.who}
            </button>
          ) : (
            <span className="block text-[12px] text-[#C2C2C2]">{r.who}</span>
          )}
        </span>
        <span className="shrink-0 text-[12px] text-[#C2C2C2]">{r.when}</span>
      </span>
    </div>
  )
}

/** Overview block: the 10 latest journal rows + «Показать все». */
export function RecentActivity({ rows, onShowAll }: { rows: CaseLogRow[]; onShowAll: () => void }) {
  const latest = [...rows].sort((a, b) => timeKey(b.when) - timeKey(a.when)).slice(0, 10)
  return (
    <div>
      <div className="mb-1.5 ml-1 flex items-center text-[13px] font-semibold text-[#C2C2C2]">
        <span className="flex-1">Последние изменения</span>
        {rows.length > 0 && (
          <button type="button" onClick={onShowAll} className="flex h-7 items-center gap-1 rounded-[6px] px-2 text-[12px] font-normal text-[#99D9FF] hover:bg-white/10">
            Показать все · {rows.length}
            <svg width="10" height="10" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7.5 4.5L13 10l-5.5 5.5" />
            </svg>
          </button>
        )}
      </div>
      <div className="overflow-hidden rounded-[12px] bg-[#303030]">
        {latest.length === 0 && <div className="px-4 py-3 text-[13px] text-[#C2C2C2]">Изменений пока нет</div>}
        {latest.map((r, i) => (
          <Row key={r.when + r.where + i} r={r} last={i === latest.length - 1} />
        ))}
      </div>
    </div>
  )
}


export function CaseActivityLog({ rows }: { rows: CaseLogRow[] }) {
  const [q, setQ] = useState('')
  const [action, setAction] = useState<Action | 'all'>('all')
  const [who, setWho] = useState<string[]>([])
  const [section, setSection] = useState<string[]>([])
  const [sort, setSort] = useState<SortId>('new')

  const people = useMemo(() => countBy(rows.map((r) => r.who)), [rows])
  const sections = useMemo(() => countBy(rows.map((r) => sectionOf(r.where))), [rows])
  const actionCount = useMemo(() => countBy(rows.map((r) => r.action)), [rows])

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase()
    const list = rows.filter(
      (r) =>
        (action === 'all' || r.action === action) &&
        (who.length === 0 || who.includes(r.who)) &&
        (section.length === 0 || section.includes(sectionOf(r.where))) &&
        (!s || `${r.where} ${r.detail} ${r.who} ${r.action}`.toLowerCase().includes(s)),
    )
    const byTime = (a: CaseLogRow, b: CaseLogRow) => timeKey(b.when) - timeKey(a.when)
    const cmp: Record<SortId, (a: CaseLogRow, b: CaseLogRow) => number> = {
      new: byTime,
      old: (a, b) => -byTime(a, b),
      action: (a, b) => a.action.localeCompare(b.action, 'ru') || byTime(a, b),
      who: (a, b) => a.who.localeCompare(b.who) || byTime(a, b),
      section: (a, b) => sectionOf(a.where).localeCompare(sectionOf(b.where), 'ru') || byTime(a, b),
    }
    return [...list].sort(cmp[sort])
  }, [rows, q, action, who, section, sort])

  const filtered = q.trim() !== '' || action !== 'all' || who.length > 0 || section.length > 0
  const groupKey = (r: CaseLogRow) => (sort === 'new' || sort === 'old' ? dayOf(r.when) : sort === 'action' ? r.action : sort === 'who' ? r.who : sectionOf(r.where))
  const groups: { key: string; rows: CaseLogRow[] }[] = []
  for (const r of shown) {
    const k = groupKey(r)
    const g = groups[groups.length - 1]
    if (g && g.key === k) g.rows.push(r)
    else groups.push({ key: k, rows: [r] })
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex h-8 min-w-[220px] flex-1 items-center gap-2 rounded-[6px] bg-[#3A3A3A] px-2.5 text-[#C2C2C2]">
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
            <circle cx="8.5" cy="8.5" r="5" />
            <path d="M12.5 12.5l4.5 4.5" />
          </svg>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Поиск по журналу" aria-label="Поиск по журналу" className="min-w-0 flex-1 bg-transparent text-[13px] text-white outline-none" />
        </label>
        <MultiDropdown label="Сотрудники" allLabel="Все сотрудники" nounMany={(n) => `${n} ${plural(n, 'сотрудник', 'сотрудника', 'сотрудников')}`} options={people.map(([p]) => ({ value: p, label: p }))} selected={who} onChange={setWho} />
        <MultiDropdown label="Разделы" allLabel="Все разделы" nounMany={(n) => `${n} ${plural(n, 'раздел', 'раздела', 'разделов')}`} options={sections.map(([s]) => ({ value: s, label: s }))} selected={section} onChange={setSection} />
        <SingleDropdown label="Сортировка" options={SORTS.map((s) => ({ value: s.id, label: s.label }))} value={sort} onChange={(v) => setSort(v as SortId)} />
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <button type="button" onClick={() => setAction('all')} className={`flex h-7 items-center rounded-full px-2.5 text-[12px] ${action === 'all' ? 'bg-white text-[#272727]' : 'bg-[#3A3A3A] text-white hover:brightness-125'}`}>
          Все · {rows.length}
        </button>
        {ACTIONS.map((a) => {
          const on = action === a.id
          const n = actionCount.find(([k]) => k === a.id)?.[1] ?? 0
          return (
            <button key={a.id} type="button" onClick={() => setAction(on ? 'all' : a.id)} disabled={n === 0} className={`flex h-7 items-center gap-1.5 rounded-full px-2.5 text-[12px] disabled:opacity-40 ${on ? 'bg-white text-[#272727]' : 'bg-[#3A3A3A] text-white enabled:hover:brightness-125'}`}>
              <span className="h-[7px] w-[7px] rounded-full" style={{ background: ACTION_TONE[a.id] }} />
              {a.label} · {n}
            </button>
          )
        })}
        <span className="flex-1" />
        <span className="text-[12px] text-[#C2C2C2]">
          Показано {shown.length} из {rows.length}
        </span>
        {filtered && (
          <button
            type="button"
            onClick={() => {
              setQ('')
              setAction('all')
              setWho([])
              setSection([])
            }}
            className="h-7 rounded-[6px] px-2 text-[12px] text-[#99D9FF] hover:bg-white/10"
          >
            Сбросить
          </button>
        )}
      </div>

      {shown.length === 0 ? (
        <div className="rounded-[12px] bg-[#303030] px-4 py-10 text-center text-[13px] text-[#C2C2C2]">Ничего не найдено — измените фильтры</div>
      ) : (
        groups.map((g) => (
          <div key={g.key}>
            <div className="mb-1.5 ml-1 text-[12px] font-semibold text-[#C2C2C2]">
              {g.key} <span className="font-normal">· {g.rows.length}</span>
            </div>
            <div className="overflow-hidden rounded-[12px] bg-[#303030]">
              {g.rows.map((r, i) => (
                <Row key={r.when + r.where + i} r={r} last={i === g.rows.length - 1} onWho={(w) => setWho([w])} onSection={(sec) => setSection([sec])} />
              ))}
            </div>
          </div>
        ))
      )}
      <div className="text-center text-[12px] text-[#9A9A9A]">Журнал пишется автоматически, правка запрещена</div>
    </div>
  )
}

function countBy(list: string[]): [string, number][] {
  const m = new Map<string, number>()
  for (const x of list) m.set(x, (m.get(x) ?? 0) + 1)
  return [...m.entries()].sort((a, b) => b[1] - a[1])
}
