import { useMemo, useState } from 'react'
import type { CaseListRow } from '../../../types'
import { CaseFolderIcon, ChevronRightIcon, PeopleIcon, RootIcon, SearchIcon } from './icons'

const ACCENT = '#60CDFF'
const TONE: Record<string, { bg: string; fg: string }> = {
  red: { bg: 'rgba(232,17,35,0.2)', fg: '#FF99A4' },
  amber: { bg: 'rgba(255,185,0,0.16)', fg: '#FCE100' },
  green: { bg: 'rgba(16,124,16,0.28)', fg: '#6CCB5F' },
  grey: { bg: 'rgba(255,255,255,0.08)', fg: '#C8C8C8' },
  blue: { bg: 'rgba(0,120,212,0.25)', fg: '#99D9FF' },
}

type ViewId = 'all' | 'mine' | 'recent' | 'closed'
const VIEWS: { id: ViewId; label: string }[] = [
  { id: 'all', label: 'Все дела' },
  { id: 'mine', label: 'Мои дела' },
  { id: 'recent', label: 'Недавние' },
  { id: 'closed', label: 'Закрытые' },
]
const STATUS: { id: string; label: string; tone?: string }[] = [
  { id: 'any', label: 'Все' },
  { id: 'work', label: 'В работе', tone: 'amber' },
  { id: 'search', label: 'Розыск', tone: 'amber' },
  { id: 'court', label: 'В суде', tone: 'blue' },
  { id: 'closed', label: 'Закрытые', tone: 'green' },
]

function inView(k: CaseListRow, v: ViewId) {
  if (v === 'mine') return k.mine
  if (v === 'recent') return k.recent
  if (v === 'closed') return k.group === 'closed'
  return true
}
function plural(n: number) {
  const a = n % 10
  const b = n % 100
  if (a === 1 && b !== 11) return `${n} дело`
  if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return `${n} дела`
  return `${n} дел`
}

interface CasesHomeProps {
  cases: CaseListRow[]
  onOpenCase: (id: string) => void
  onNewCase: () => void
}

/** "Дела" home/list screen — the sidebar views + status chips + search are
 * all real local filtering over the same `cases` list. */
export function CasesHome({ cases, onOpenCase, onNewCase }: CasesHomeProps) {
  const [view, setView] = useState<ViewId>('all')
  const [status, setStatus] = useState('any')
  const [query, setQuery] = useState('')

  const ql = query.trim().toLowerCase()
  const base = useMemo(() => cases.filter((k) => inView(k, view) && (!ql || `${k.no} ${k.title} ${k.lead}`.toLowerCase().includes(ql))), [cases, view, ql])
  const shown = status === 'any' ? base : base.filter((k) => k.group === status)

  return (
    <div className="flex h-full min-w-0 text-white">
      <aside className="flex w-[300px] shrink-0 flex-col border-r border-[#3A3A3A] bg-[#1D2027]">
        <div className="flex flex-col gap-2 px-3.5 pb-3 pt-3.5">
          <button type="button" onClick={onNewCase} className="flex h-9 items-center justify-center gap-2 rounded-[6px] bg-[#60CDFF] text-[14px] font-semibold text-black hover:brightness-110">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M10 4v12M4 10h12" />
            </svg>
            Новое дело
          </button>
          <label className="flex h-8 items-center gap-2 rounded-[6px] bg-[rgba(255,255,255,0.07)] px-2.5 text-[#C2C2C2]">
            <SearchIcon />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Номер, адрес или фамилия" aria-label="Поиск дел" className="min-w-0 flex-1 bg-transparent text-[14px] text-white outline-none" />
          </label>
        </div>
        <nav aria-label="Разделы" className="flex-1 px-2.5">
          {VIEWS.map((v) => {
            const on = view === v.id
            const count = cases.filter((k) => inView(k, v.id)).length
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => {
                  setView(v.id)
                  setStatus('any')
                }}
                style={{ background: on ? 'rgba(255,255,255,0.08)' : 'transparent' }}
                className="relative mb-[1px] flex h-9 w-full items-center gap-3 rounded-[6px] px-3"
              >
                <span className="absolute left-0 top-[10px] h-4 w-[3px] rounded-[2px]" style={{ background: ACCENT, opacity: on ? 1 : 0 }} />
                {v.id === 'all' && <RootIcon />}
                {v.id === 'mine' && <PeopleIcon />}
                {v.id === 'recent' && (
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <circle cx="10" cy="10" r="7" />
                    <path d="M10 6v4l2.5 1.5" />
                  </svg>
                )}
                {v.id === 'closed' && (
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
                    <rect x="2.5" y="3.5" width="15" height="4" rx="1" />
                    <path d="M4 7.5v9h12v-9" />
                    <path d="M8 11h4" />
                  </svg>
                )}
                <span className={`flex-1 text-left ${on ? 'font-semibold' : ''}`}>{v.label}</span>
                <span className="text-[12px] text-[#C2C2C2]">{count}</span>
              </button>
            )
          })}
        </nav>
      </aside>

      <main className="scroll min-w-0 flex-1 overflow-y-auto bg-[#272727] px-10 pb-8 pt-1">
        <div className="flex max-w-[1040px] flex-col gap-[18px]">
          <div className="flex items-end gap-4 pt-4">
            <div className="flex-1">
              <h1 className="m-0 text-[28px] font-bold leading-9 tracking-[-0.2px]">{VIEWS.find((v) => v.id === view)?.label}</h1>
              <div className="text-[13px] text-[#C2C2C2]">
                {plural(shown.length)}
                {ql ? ` по запросу «${query.trim()}»` : ''} · Отдел расследований LSPD
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {STATUS.map((s) => {
              const on = status === s.id
              const count = s.id === 'any' ? base.length : base.filter((k) => k.group === s.id).length
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStatus(s.id)}
                  style={{ background: on ? '#FFFFFF' : 'rgba(255,255,255,0.07)', color: on ? '#1B1B1B' : '#FFFFFF' }}
                  className="flex h-[30px] items-center gap-1.5 rounded-full px-3 text-[13px]"
                >
                  {s.tone && <span className="h-[7px] w-[7px] rounded-full" style={{ background: TONE[s.tone].fg }} />}
                  {s.label} {count}
                </button>
              )
            })}
          </div>

          {shown.length > 0 ? (
            <div className="overflow-hidden rounded-[12px] bg-[#303030]">
              {shown.map((k, i, arr) => {
                const t = TONE[k.tone]
                const grifLabel = k.grif === 'secret' ? 'Секретно' : k.grif === 'conf' ? 'Конфиденциально' : null
                const grifTone = k.grif === 'secret' ? TONE.red : TONE.amber
                return (
                  <button key={k.id} type="button" onClick={() => onOpenCase(k.id)} className="flex w-full items-center gap-3.5 px-4 text-left hover:bg-white/5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]" style={{ background: t.bg, color: t.fg }}>
                      <CaseFolderIcon color="currentColor" />
                    </span>
                    <span className={`flex min-w-0 flex-1 items-center gap-4 py-3.5 ${i === arr.length - 1 ? '' : 'border-b border-[#3A3A3A]'}`}>
                      <span className="flex min-w-0 flex-1 flex-col gap-0.5 leading-[18px]">
                        <span className="flex min-w-0 items-center gap-1.5 whitespace-nowrap">
                          <b className="shrink-0 font-bold">{k.no}</b>
                          {grifLabel && (
                            <span className="flex h-[18px] shrink-0 items-center gap-1 rounded-full px-1.5 text-[11px]" style={{ background: grifTone.bg, color: grifTone.fg }}>
                              <svg width="10" height="10" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round">
                                <rect x="4.5" y="9" width="11" height="8" rx="1.5" />
                                <path d="M7 9V6.5a3 3 0 016 0V9" />
                              </svg>
                              {grifLabel}
                            </span>
                          )}
                          <span className="shrink-0 text-[#C2C2C2]">·</span>
                          <span className="min-w-0 truncate" title={k.title}>{k.title}</span>
                        </span>
                        <span className="truncate text-[12px] text-[#C2C2C2]">
                          {k.lead} · изменено {k.updated}
                        </span>
                      </span>
                      <span className="flex shrink-0 items-center gap-3.5 text-[12px] text-[#C2C2C2]">
                        <span title="Участники" className="flex items-center gap-1">
                          <PeopleIcon className="h-[13px] w-[13px]" />
                          {k.ppl}
                        </span>
                        <span title="Улики" className="flex items-center gap-1">
                          <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round">
                            <path d="M3 3h7l7 7-7 7-7-7z" />
                          </svg>
                          {k.evd}
                        </span>
                        <span title="Экспертизы" className="flex items-center gap-1">
                          <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round">
                            <path d="M7.5 2.5h5M8.5 2.5v5.5L4 15.6a1.3 1.3 0 001.1 1.9h9.8a1.3 1.3 0 001.1-1.9L11.5 8V2.5" />
                          </svg>
                          {k.exp}
                        </span>
                      </span>
                      <span className="w-[150px] shrink-0 text-right">
                        <span className="rounded-[10px] px-2.5 py-0.5 text-[12px] font-semibold" style={{ background: t.bg, color: t.fg }}>
                          {k.status}
                        </span>
                      </span>
                      <ChevronRightIcon className="shrink-0 text-[#C2C2C2]" />
                    </span>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 rounded-[12px] bg-[#303030] px-6 py-[72px] text-center text-[#C2C2C2]">
              <div className="text-[16px] font-semibold text-white">Дел не найдено</div>
              <div>Измените запрос или сбросьте фильтр статуса.</div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
