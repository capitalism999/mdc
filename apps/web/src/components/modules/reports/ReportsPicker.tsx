import { useEffect, useMemo, useRef, useState } from 'react'
import { mockArrests } from '../../../lib/mockData/arrests'
import { mockDispatchCalls } from '../../../lib/mockData/dispatchCalls'
import { mockEvidence } from '../../../lib/mockData/evidence'
import { mockOfficers } from '../../../lib/mockData/officers'
import { mockPeople } from '../../../lib/mockData/people'
import { mockWarrants } from '../../../lib/mockData/warrants'
import { visibleCaseList } from '../cases/casesStore'
import { SEARCH_DB } from '../search/searchLogic'
import { REPORTS_ENTS } from './reportsLogic'
import type { ReportsVals } from './reportsRuntime'

/** One record the officer can attach: `v` goes into the field, `row` into an
 * «Добавить из системы» table, `fill` into neighbouring fields. */
export interface PickItem {
  v: string
  sub: string
  fill?: Record<string, string>
  row?: string[]
}

interface DbSection {
  0: string
  1: { k: string; v: string }[]
}
interface DbRec {
  id: string
  type: string
  title: string
  sub?: string
  code?: string
  plate?: string
  f?: Record<string, string>
  sections?: DbSection[]
}
interface ReportRef {
  id: string
  no: string
  type: string
  title: string
  sub: string
  by: string
}

const ENTS = REPORTS_ENTS as Record<string, string>
const DB = SEARCH_DB as unknown as DbRec[]

const field = (r: DbRec, key: RegExp) => {
  for (const s of r.sections ?? []) for (const it of s[1] ?? []) if (key.test(it.k)) return it.v
  return ''
}
const personName = (id: string) => {
  const p = mockPeople.find((x) => x.id === id)
  return p ? `${p.firstName} ${p.lastName}` : ''
}
/** «Мужчина · 12.03.1997 · 29 лет» → sex / date of birth */
const personFill = (sub = ''): Record<string, string> => {
  const out: Record<string, string> = {}
  const parts = sub.split(' · ')
  if (/^(Мужчина|Женщина)$/.test(parts[0] ?? '')) out.sex = parts[0]
  const dob = /\d{2}\.\d{2}\.\d{4}/.exec(sub)?.[0]
  if (dob) out.dob = dob
  return out
}

/** Records of one kind from the MDT's own data: Поиск (SEARCH_DB), Дела,
 * reports of this window, and the arrests / warrants / calls / units /
 * evidence registers. The reference's own record for the kind comes first. */
function itemsFor(kind: string, mode: string, reports: ReportRef[]): PickItem[] {
  const seed: PickItem[] = ENTS[kind] && mode === 'ent' ? [{ v: ENTS[kind], sub: 'из материалов смены' }] : []
  switch (kind) {
    case 'person':
      return DB.filter((r) => r.type === 'person').map((r) => ({
        v: r.title,
        sub: [r.sub, r.code].filter(Boolean).join(' · '),
        fill: personFill(r.sub),
        row: [r.title, r.f?.phone ?? ''],
      }))
    case 'vehicle':
      return DB.filter((r) => r.type === 'vehicle').map((r) => {
        const parts = (r.sub ?? '').split(' · ')
        const plate = r.plate ?? ''
        return {
          v: `${r.title} · ${plate}`,
          sub: r.sub ?? '',
          row: [r.title, /\d{4}/.exec(r.sub ?? '')?.[0] ?? '', parts[1] ?? '', plate, field(r, /Владел/)],
        }
      })
    case 'case':
      return visibleCaseList().map((c) => ({ v: `${c.no} · ${c.title}`, sub: `${c.status} · ${c.lead}` }))
    case 'report':
    case 'force':
      return reports
        .filter((r) => kind === 'report' || r.type === 'force')
        .map((r) => ({ v: `${r.no} · ${r.title}`, sub: `${r.sub} · ${r.by}` }))
    case 'arrest':
      return [
        ...seed,
        ...mockArrests.map((a) => ({ v: `${a.arrestNumber} · ${personName(a.arresteeId)}`, sub: `${a.status} · ${a.arrestingOfficer}` })),
      ]
    case 'warrant': {
      const fromDb = [...new Set((JSON.stringify(DB).match(/\bS?W-\d{4}\b/g) ?? []))]
      return [
        ...seed,
        ...fromDb.filter((w) => !seed.some((s) => s.v.startsWith(w))).map((w) => ({ v: w, sub: 'упоминается в базе Поиска' })),
        ...mockWarrants.map((w) => ({ v: `${w.warrantNumber} · ${w.warrantType}`, sub: `${w.status} · судья ${w.issuingJudge}` })),
      ]
    }
    case 'call':
      return [...seed, ...mockDispatchCalls.map((c) => ({ v: `${c.callNumber} · ${c.natureCode}`, sub: `${c.status} · ${c.locationStreet}` }))]
    case 'unit':
      return [...seed, ...mockOfficers.map((o) => ({ v: `${o.callsign} · ${o.name}`, sub: `${o.department} · ${o.dutyStatus}` }))]
    case 'bodyrec':
    case 'cctvrec':
      return [
        ...seed,
        ...mockEvidence
          .filter((e) => /видео/i.test(e.evidenceType))
          .map((e) => ({ v: `${e.evidenceNumber} · ${e.description}`, sub: `${e.evidenceType} · ${e.collectedBy}` })),
      ]
    default:
      return seed
  }
}

/** «Из системы» / «+ Добавить из системы»: pick a real record to attach. */
export function ReportsPicker({ $v, made }: { $v: ReportsVals; made: ReportRef[] }) {
  const pick = $v.pick as { mode: string; k: string; o: string; l: string } | null
  const [q, setQ] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const key = pick ? `${pick.mode}:${pick.k}` : ''
  useEffect(() => {
    setQ('')
    if (key) inputRef.current?.focus()
  }, [key])
  const all = useMemo(
    () => (pick ? itemsFor(pick.o, pick.mode, made) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key, made],
  )
  if (!pick) return null
  const needle = q.trim().toLowerCase()
  const items = needle ? all.filter((it) => `${it.v} ${it.sub}`.toLowerCase().includes(needle)) : all
  const c = $v.c
  return (
    <div
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) $v.pickClose()
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') $v.pickClose()
      }}
      style={{ position: 'absolute', inset: 0, zIndex: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.45)' }}
    >
      <div
        role="dialog"
        aria-label={`Выбрать: ${pick.l}`}
        style={{ width: '520px', maxWidth: 'calc(100% - 32px)', maxHeight: 'calc(100% - 64px)', display: 'flex', flexDirection: 'column', borderRadius: '8px', background: c.dialog, border: `1px solid ${c.stroke}`, boxShadow: '0 16px 48px rgba(0,0,0,0.5)' }}
      >
        <div style={{ padding: '18px 20px 10px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span style={{ fontSize: '18px', lineHeight: '24px', fontWeight: 600 }}>{pick.mode === 'add' ? 'Добавить из системы' : 'Запись из системы'}</span>
          <span style={{ fontSize: '12.5px', color: c.text2 }}>{pick.l}</span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && items[0]) $v.pickApply(items[0])
            }}
            placeholder="Поиск по номеру, имени, описанию"
            style={{ boxSizing: 'border-box', height: '32px', padding: '0 10px', borderRadius: '6px', border: 0, borderBottom: `1px solid ${c.stroke2}`, background: c.field, fontSize: '13px' }}
          />
        </div>
        <div className="scroll" style={{ flex: 1, minHeight: 0, padding: '0 12px 8px 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {items.map((it, i) => (
            <button key={i} className="btn hv" onClick={() => $v.pickApply(it)} style={{ display: 'flex', flexDirection: 'column', gap: '1px', padding: '8px 10px', borderRadius: '6px', lineHeight: '18px' }}>
              <span className="ell" style={{ fontWeight: 600 }}>{it.v}</span>
              <span className="ell" style={{ fontSize: '12px', color: c.text2 }}>{it.sub}</span>
            </button>
          ))}
          {!items.length ? <span style={{ padding: '18px 10px', fontSize: '13px', color: c.text2, textAlign: 'center' }}>Ничего не найдено</span> : null}
        </div>
        <div style={{ padding: '12px 20px', display: 'flex', justifyContent: 'flex-end', borderTop: `1px solid ${c.stroke}`, background: c.dialogFoot, borderRadius: '0 0 8px 8px' }}>
          <button className="btn hv" onClick={$v.pickClose} style={{ height: '32px', padding: '0 16px', borderRadius: '6px', background: c.btn, textAlign: 'center' }}>
            Отмена
          </button>
        </div>
      </div>
    </div>
  )
}
