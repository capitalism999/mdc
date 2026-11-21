import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { mockPenalCodes } from '../../../lib/mockData/penalCodes'
import { mockArrests } from '../../../lib/mockData/arrests'
import { mockPeople } from '../../../lib/mockData/people'
import { mockWarrants } from '../../../lib/mockData/warrants'
import { visibleCaseList } from '../cases/casesStore'
import { staffDirectory } from '../cases/staffDirectory'
import { SEARCH_DB } from '../search/searchLogic'
import { ownPhoto } from '../shared/personPhotos'
import type { BoloVals } from './boloRuntime'

interface DbRec {
  id: string
  type: string
  title: string
  code?: string
  plate?: string
  sub?: string
  keys?: string
  f?: Record<string, string>
}

/** How many matches a picker lists at once — the rest are reached by typing more. */
const CAP = 8

/** Keyboard + highlight state shared by the pickers below. */
function useListKeys<T>(items: T[], onPick: (it: T) => void, onEscape: () => void) {
  const [hi, setHi] = useState(0)
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') onEscape()
    else if (e.key === 'ArrowDown') setHi((h) => Math.min(h + 1, items.length - 1))
    else if (e.key === 'ArrowUp') setHi((h) => Math.max(h - 1, 0))
    else if (e.key === 'Enter' && items[Math.min(hi, items.length - 1)]) onPick(items[Math.min(hi, items.length - 1)])
    else return
    e.preventDefault()
  }
  return { hi: Math.min(hi, Math.max(0, items.length - 1)), setHi, onKeyDown }
}

function fieldStyle($v: BoloVals, focused: boolean) {
  return { flex: '1', minWidth: '0', height: '34px', boxSizing: 'border-box', padding: '0 10px', borderRadius: '6px', border: '0', borderBottom: `1px solid ${focused ? $v.accent : $v.c.stroke2}`, background: $v.c.field, fontSize: '14px', color: $v.c.text } as const
}

/** The suggestion panel: capped, scrollable, with «уточните запрос» and empty states. */
function SuggestList<T>({ $v, items, total, hi, setHi, label, onPick, hint }: { $v: BoloVals; items: T[]; total: number; hi: number; setHi: (i: number) => void; label: (it: T) => [ReactNode, ReactNode]; onPick: (it: T) => void; hint: string | null }) {
  const c = $v.c
  return (
    <div className="scroll" style={{ display: 'flex', flexDirection: 'column', maxHeight: '264px', borderRadius: '8px', background: c.card, boxShadow: '0 8px 20px rgba(0,0,0,0.3)' }}>
      {hint ? <span style={{ padding: '8px 10px', fontSize: '13px', color: c.text2 }}>{hint}</span> : null}
      {items.map((it, i) => {
        const [a, b] = label(it)
        return (
          <button
            key={i}
            className="btn hv"
            onMouseDown={(e) => e.preventDefault()}
            onMouseEnter={() => setHi(i)}
            onClick={() => onPick(it)}
            style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', padding: '7px 10px', lineHeight: '17px', textAlign: 'left', background: i === hi ? c.sel : 'transparent' }}
          >
            <span className="ell" style={{ fontWeight: 600 }}>{a}</span>
            {b ? <span className="ell" style={{ fontSize: '12px', color: c.text2 }}>{b}</span> : null}
          </button>
        )
      })}
      {total > items.length ? <span style={{ flexShrink: 0, padding: '6px 10px 8px', fontSize: '12px', color: c.text2 }}>Ещё {total - items.length} — уточните запрос</span> : null}
    </div>
  )
}

/**
 * A search box with suggestions under it, in the reference's field style.
 * `needQuery`: nothing is listed until something is typed (big directories).
 */
function InlinePicker<T>({ $v, placeholder, find, label, onPick, onClose, empty, needQuery, startHint }: { $v: BoloVals; placeholder: string; find: (q: string) => T[]; label: (it: T) => [ReactNode, ReactNode]; onPick: (it: T) => void; onClose?: () => void; empty: string; needQuery?: boolean; startHint?: string }) {
  const c = $v.c
  const [q, setQ] = useState('')
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => ref.current?.focus(), [])
  const typed = q.trim().length > 0
  const all = needQuery && !typed ? [] : find(q)
  const items = all.slice(0, CAP)
  const keys = useListKeys(items, onPick, onClose ?? (() => {}))
  const hint = needQuery && !typed ? startHint ?? 'Начните вводить' : !all.length ? empty : null
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexBasis: '100%', minWidth: 0 }}>
      <div style={{ display: 'flex', gap: '6px' }}>
        <input ref={ref} type="text" value={q} placeholder={placeholder} onChange={(e) => { setQ(e.target.value); keys.setHi(0) }} onKeyDown={keys.onKeyDown} style={fieldStyle($v, true)} />
        {onClose ? (
          <button className="btn hv" onClick={onClose} style={{ flexShrink: 0, height: '34px', padding: '0 12px', borderRadius: '6px', background: c.btn, fontSize: '13px' }}>
            Отмена
          </button>
        ) : null}
      </div>
      <SuggestList $v={$v} items={items} total={all.length} hi={keys.hi} setHi={keys.setHi} label={label} onPick={onPick} hint={hint} />
    </div>
  )
}

/** «Другой» on the «Из базы» card: a person or a vehicle from the MDC records. */
export function BoloRecordPicker({ $v }: { $v: BoloVals }) {
  const kind: 'person' | 'vehicle' = $v.recPickKind
  const pool = (SEARCH_DB as unknown as DbRec[]).filter((r) => r.type === kind)
  return (
    <InlinePicker<DbRec>
      $v={$v}
      needQuery
      startHint={kind === 'vehicle' ? 'Введите номер, марку или владельца' : 'Введите имя, CIT-номер или телефон'}
      placeholder={kind === 'vehicle' ? 'Номер, марка или владелец' : 'Имя или CIT-номер'}
      empty="В базе MDC ничего не найдено"
      find={(q) => {
        const s = q.trim().toLowerCase()
        return pool.filter((r) => `${r.title} ${r.code ?? ''} ${r.plate ?? ''} ${r.sub ?? ''} ${r.keys ?? ''} ${r.f?.name ?? ''} ${r.f?.phone ?? ''}`.toLowerCase().includes(s))
      }}
      label={(r) => [kind === 'vehicle' ? `${r.title} · ${r.plate ?? ''}` : `${r.title} · ${r.code ?? ''}`, r.sub ?? '']}
      onPick={(r) =>
        $v.recPickSet({
          recId: r.id,
          name: r.title,
          code: kind === 'vehicle' ? (r.plate ?? '') : (r.code ?? ''),
          sub: r.sub ?? '',
          vid: 0,
          reason: '',
          armed: false,
          isVeh: kind === 'vehicle',
          photo: kind === 'person' ? ownPhoto(r.id, r.title) : null,
        })
      }
      onClose={$v.recPickClose}
    />
  )
}

/** «Другой сотрудник…»: anyone from the department directory as the contact. */
export function BoloStaffPicker({ $v }: { $v: BoloVals }) {
  const staff = staffDirectory().filter((s) => !s.group)
  return (
    <InlinePicker
      $v={$v}
      needQuery
      startHint="Введите имя, жетон или позывной сотрудника"
      placeholder="Имя, жетон или позывной"
      empty="Сотрудник не найден"
      find={(q) => {
        const s = q.trim().toLowerCase()
        return staff.filter((p) => `${p.name} ${p.sub} ${p.search}`.toLowerCase().includes(s))
      }}
      label={(p) => [p.name, p.sub]}
      onPick={(p) => $v.ctPickSet([p.name, p.sub, '—', ''])}
      onClose={$v.ctPickClose}
    />
  )
}

/** Articles a BOLO can cite: the whole Penal Code except its general provisions. */
const ARTICLES = mockPenalCodes.filter((p) => p.class !== 'provision')

/**
 * «Статья Penal Code»: type a number or words of the title; the matching
 * articles drop down under the field (all of them, scrollable), ↑ / ↓ / Enter
 * or a click adds one.
 */
export function BoloPcPicker({ $v }: { $v: BoloVals }) {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const sel: string[] = $v.pcSelKeys ?? []
  const s = q.trim().toLowerCase().replace(/^pc\s*/, '')
  const all = ARTICLES.filter((p) => !sel.includes(p.code) && (!s || p.code.startsWith(s) || p.title.toLowerCase().includes(s)))
  const add = (p: (typeof ARTICLES)[number]) => {
    $v.pcAdd(p.code, p.title)
    setQ('')
  }
  const keys = useListKeys(all, add, () => setOpen(false))
  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <input
        type="text"
        value={q}
        placeholder="Номер или название статьи"
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onChange={(e) => {
          setQ(e.target.value)
          setOpen(true)
          keys.setHi(0)
        }}
        onKeyDown={(e) => {
          if (!open && e.key === 'ArrowDown') setOpen(true)
          keys.onKeyDown(e)
        }}
        style={{ ...fieldStyle($v, open), flex: 'none' }}
      />
      {$v.nE?.pc ? <span data-bolo-err="" style={{ marginTop: '6px', fontSize: '12px', lineHeight: '16px', color: $v.T?.red }}>{$v.nE.pc}</span> : null}
      {open ? (
        <div style={{ position: 'absolute', left: 0, right: 0, top: '38px', zIndex: 20 }}>
          <SuggestList
            $v={$v}
            items={all}
            total={all.length}
            hi={keys.hi}
            setHi={keys.setHi}
            label={(p) => [
              <>
                <span className="num">PC {p.code}</span> <span style={{ fontWeight: 400 }}>{p.title}</span>
              </>,
              null,
            ]}
            onPick={add}
            hint={all.length ? null : 'Статья не найдена'}
          />
        </div>
      ) : null}
    </div>
  )
}

/** Warrants a BOLO can be linked to: the registry plus the reference's own (W-2231). */
function warrantPool(): [string, string][] {
  const name = (id: string) => { const p = mockPeople.find((x) => x.id === id); return p ? `${p.firstName} ${p.lastName}` : '' }
  return [
    ['Ордер W-2231 · арест', 'Tyrone Webb · на арест · активен'] as [string, string],
    ...mockWarrants.map((w) => [`Ордер ${w.warrantNumber} · ${w.warrantType.toLowerCase()}`, `${name(w.subjectPersonId)} · ${w.status.toLowerCase()} · ${w.reason}`] as [string, string]),
  ]
}

/**
 * «Привязать»: the BOLO's links as removable chips; «+ Ордер» and «+ Дело»
 * pick a real warrant / case. The chips become the published BOLO's «Связано».
 */
export function BoloLinksEditor({ $v }: { $v: BoloVals }) {
  const c = $v.c
  const [mode, setMode] = useState<'warrant' | 'case' | null>(null)
  const links: { t: string; del: () => void }[] = $v.nLinkList ?? []
  const chip = { height: '30px', borderRadius: '15px', fontSize: '13px', background: c.btn, whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', flexShrink: 0 } as const
  return (
    <>
      {links.map((l, i) => (
        <span key={l.t + i} className="chip" style={{ ...chip, padding: '0 6px 0 12px', gap: '6px', fontWeight: 400, maxWidth: '100%' }}>
          <span className="ell">{l.t}</span>
          <button className="btn hv" onClick={l.del} aria-label={'Отвязать: ' + l.t} title="Отвязать" style={{ width: '20px', height: '20px', flexShrink: 0, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="10" height="10" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </span>
      ))}
      <button className="btn hv" onClick={() => setMode(mode === 'warrant' ? null : 'warrant')} style={{ ...chip, padding: '0 12px', boxShadow: mode === 'warrant' ? `inset 0 0 0 1px ${$v.accent}` : 'none' }}>
        + Ордер
      </button>
      <button className="btn hv" onClick={() => setMode(mode === 'case' ? null : 'case')} style={{ ...chip, padding: '0 12px', boxShadow: mode === 'case' ? `inset 0 0 0 1px ${$v.accent}` : 'none' }}>
        + Дело
      </button>
      {mode === 'warrant' ? (
        <InlinePicker<[string, string]>
          key="w"
          $v={$v}
          placeholder="Номер ордера, фамилия или основание"
          empty="Ордер не найден"
          find={(q) => {
            const s = q.trim().toLowerCase()
            return warrantPool().filter(([a, b]) => !links.some((l) => l.t === a) && `${a} ${b}`.toLowerCase().includes(s))
          }}
          label={([a, b]) => [a, b]}
          onPick={([a]) => {
            $v.linkAdd(a)
            setMode(null)
          }}
          onClose={() => setMode(null)}
        />
      ) : null}
      {mode === 'case' ? (
        <InlinePicker<{ no: string; title: string; status: string; lead: string }>
          key="c"
          $v={$v}
          placeholder="Номер или название дела"
          empty="Дело не найдено"
          find={(q) => {
            const s = q.trim().toLowerCase()
            return visibleCaseList().filter((x) => !links.some((l) => l.t.startsWith('Дело ' + x.no)) && `${x.no} ${x.title} ${x.lead}`.toLowerCase().includes(s))
          }}
          label={(x) => [`${x.no} · ${x.title}`, `${x.status} · ведущий ${x.lead}`]}
          onPick={(x) => {
            $v.linkAdd(`Дело ${x.no} · ${x.title}`)
            setMode(null)
          }}
          onClose={() => setMode(null)}
        />
      ) : null}
    </>
  )
}

/** Arrests a BOLO can be closed with: the session's arrests plus the journal. */
function arrestPool(): [string, string][] {
  const name = (id: string) => { const p = mockPeople.find((x) => x.id === id); return p ? `${p.firstName} ${p.lastName}` : '' }
  return [
    ['A-2026-1203 · Tyrone Webb', 'Открыт · Thomas Watts · 17.11'] as [string, string],
    ['A-2026-1187 · Marcus Tate', 'Под стражей · Andrew Koval · 08.11'] as [string, string],
    ['A-2026-1196 · PC 305', 'В суде · Thorne Watts · 15.11'] as [string, string],
    ['A-2026-1180 · PC 211', 'Закрыт · Miguel Ortiz · 02.11'] as [string, string],
    ...mockArrests.map((a) => [`${a.arrestNumber} · ${name(a.arresteeId)}`, `${a.status} · ${a.arrestingOfficer}`] as [string, string]),
  ]
}

/** «Закрыть ориентировку» → «Задержан»: the arrest that closed it (its number goes to the card and the history). */
export function BoloArrestPicker({ $v }: { $v: BoloVals }) {
  const c = $v.c
  const picked: string | null = $v.closeArrest ?? null
  const who = String($v.closeArrestFor ?? '').toLowerCase()
  if (picked) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', background: c.card }}>
        <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', lineHeight: '18px' }}>
          <span style={{ fontSize: '12px', color: c.text2 }}>Арест</span>
          <span className="ell" style={{ fontWeight: 600 }}>{picked}</span>
        </span>
        <button className="btn hv" onClick={() => $v.closeArrestSet(null)} style={{ height: '28px', padding: '0 10px', borderRadius: '6px', background: c.btn, fontSize: '13px' }}>
          Другой
        </button>
      </div>
    )
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <span style={{ fontSize: '12px', color: c.text2 }}>Арест — номер появится в карточке и в истории (можно не указывать)</span>
      <InlinePicker<[string, string]>
        $v={$v}
        placeholder="Номер ареста или фамилия"
        empty="Арест не найден"
        find={(q) => {
          const s = q.trim().toLowerCase()
          // the subject's own arrests first
          return arrestPool()
            .filter(([a, b]) => `${a} ${b}`.toLowerCase().includes(s))
            .sort((x, y) => Number(!!who && y[0].toLowerCase().includes(who)) - Number(!!who && x[0].toLowerCase().includes(who)))
        }}
        label={([a, b]) => [a, b]}
        onPick={([a]) => $v.closeArrestSet(a)}
      />
    </div>
  )
}

/** «Закрыть ориентировку» for any reason but the main one: why — for the admins (required). */
export function BoloCloseNote({ $v }: { $v: BoloVals }) {
  const c = $v.c
  const err = !!$v.closeNoteErr
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <span style={{ fontSize: '13px', fontWeight: 600, color: c.text2 }}>Причина — для администрации</span>
      <textarea
        rows={3}
        autoFocus
        value={$v.closeNote ?? ''}
        onChange={(e) => $v.closeNoteSet(e.target.value)}
        placeholder="Например: ордер W-2231 отозван судьёй 21.11, основание отпало"
        style={{ resize: 'none', boxSizing: 'border-box', padding: '8px 10px', borderRadius: '6px', border: '0', borderBottom: `1px solid ${err ? '#FF99A4' : c.stroke2}`, background: c.field, fontSize: '14px', lineHeight: '20px', color: c.text }}
      />
      <span data-bolo-err={err ? '' : undefined} style={{ fontSize: '12px', color: err ? '#FF99A4' : c.text2 }}>
        {err ? 'Без причины закрыть нельзя — её увидят администраторы в истории.' : 'Попадёт в историю ориентировки и в журнал администратора.'}
      </span>
    </label>
  )
}

interface UpdEditor {
  key: string
  label: string
  type: 'text' | 'area' | 'choice' | 'photo'
  value: string
  ph?: string
  opts?: [string, string][]
}

/** «Обновить ориентировку»: every chip chosen under «Что изменилось» opens its field — the change goes into the card and the poster. */
export function BoloUpdateEditors({ $v }: { $v: BoloVals }) {
  const c = $v.c
  const eds: UpdEditor[] = $v.updEditors ?? []
  if (!eds.length) return null
  const field = { boxSizing: 'border-box', padding: '7px 10px', borderRadius: '6px', border: '0', borderBottom: `1px solid ${c.stroke2}`, background: c.field, fontSize: '14px', lineHeight: '20px', color: c.text, width: '100%' } as const
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '12px', borderRadius: '8px', background: c.card }}>
      {eds.map((ed) => (
        <label key={ed.key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: c.text2 }}>{ed.label}</span>
          {ed.type === 'text' ? <input type="text" value={ed.value} placeholder={ed.ph} onChange={(e) => $v.updEditSet(ed.key, e.target.value)} style={field} /> : null}
          {ed.type === 'area' ? <textarea rows={3} value={ed.value} placeholder={ed.ph} onChange={(e) => $v.updEditSet(ed.key, e.target.value)} style={{ ...field, resize: 'vertical' }} /> : null}
          {ed.type === 'choice' ? (
            <span style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {(ed.opts ?? []).map(([k, t]) => {
                const on = ed.value === k
                return (
                  <button key={k} type="button" className="btn hv" onClick={() => $v.updEditSet(ed.key, k)} style={{ height: '30px', padding: '0 12px', borderRadius: '15px', background: on ? '#FFFFFF' : c.btn, color: on ? '#1B1B1B' : c.text, fontSize: '13px', fontWeight: on ? 600 : 400 }}>
                    {t}
                  </button>
                )
              })}
            </span>
          ) : null}
          {ed.type === 'photo' ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                className="btn hv"
                onClick={() => {
                  $v.addPhoto()
                  $v.updEditSet('photo', '1')
                }}
                style={{ height: '30px', padding: '0 12px', borderRadius: '6px', background: c.btn, fontSize: '13px' }}
              >
                Добавить фото с компьютера
              </button>
              <span style={{ fontSize: '12px', color: c.text2 }}>{ed.value ? 'Фото добавлено в карточку' : 'Новое фото сразу появится в карточке'}</span>
            </span>
          ) : null}
        </label>
      ))}
    </div>
  )
}

/** ⋯ → «Личность установлена»: the person from MDC this unknown turned out to be. */
export function BoloIdentifyDialog({ $v }: { $v: BoloVals }) {
  const c = $v.c
  const pool = (SEARCH_DB as unknown as DbRec[]).filter((r) => r.type === 'person')
  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) $v.identClose() }} style={{ position: 'absolute', inset: 0, zIndex: 30, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div role="dialog" aria-label="Личность установлена" style={{ width: 'min(560px, calc(100% - 32px))', boxSizing: 'border-box', padding: '24px', borderRadius: '10px', background: c.dialog, border: `1px solid ${c.stroke}`, boxShadow: '0 32px 64px rgba(0,0,0,0.55)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontSize: '20px', lineHeight: '28px', fontWeight: 600 }}>Личность установлена</span>
          <span style={{ fontSize: '13px', color: c.text2 }}>{$v.b?.id} · выберите человека из базы MDC — ориентировка перейдёт на него</span>
        </div>
        <InlinePicker<DbRec>
          $v={$v}
          needQuery
          startHint="Введите имя, CIT-номер или телефон"
          placeholder="Имя или CIT-номер"
          empty="В базе MDC ничего не найдено"
          find={(q) => {
            const s = q.trim().toLowerCase()
            return pool.filter((r) => `${r.title} ${r.code ?? ''} ${r.sub ?? ''} ${r.keys ?? ''} ${r.f?.name ?? ''} ${r.f?.phone ?? ''}`.toLowerCase().includes(s))
          }}
          label={(r) => [`${r.title} · ${r.code ?? ''}`, r.sub ?? '']}
          onPick={(r) => $v.identSet({ name: r.title, code: r.code ?? '', photo: ownPhoto(r.id, r.title) })}
          onClose={$v.identClose}
        />
      </div>
    </div>
  )
}
