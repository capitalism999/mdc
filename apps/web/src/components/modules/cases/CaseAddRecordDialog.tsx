import { useEffect, useMemo, useState } from 'react'
import type { CasePlaceType, CaseTone, CaseTreeItem, CaseTreeNode } from '../../../types'
import { mockProfile } from '../../../lib/mockData/profile'
import { SEARCH_DB } from '../search/searchLogic'
import { SingleDropdown } from './CaseDropdown'
import { PLACE_TYPE_COLOR, PLACE_TYPE_IDS, PLACE_TYPE_LABEL } from './casePlaces'
import { ITEM_STATUSES, StatusMenu, type StatusOption } from './caseStatus'

/**
 * Поиск → «Добавить в дело» for a property, a weapon or an organisation: the
 * MDC record is already picked; choose where it goes in the case and add a
 * note. A property becomes a point in «Места» (its type, a pin on the map),
 * a weapon a physical exhibit in «Улики», an organisation a participant
 * (e.g. a robbed business among the victims). Person / vehicle keep their own
 * dialog (CaseAddEntityDialog).
 */

export type RecordKind = 'place' | 'weapon' | 'org'

interface DbRec {
  id: string
  type: string
  title: string
  code?: string
  serial?: string
  sub?: string
  initials?: string
  color?: string
}

/** Pins of known MDC addresses on the case map (percent of the map image). */
const KNOWN_PINS: Record<string, [number, number]> = {
  a_forum14: [44, 73.8],
  a_grove1207: [46.4, 76.6],
  a_garage7: [46.8, 76.9],
}

function today() {
  const d = new Date()
  const p2 = (n: number) => String(n).padStart(2, '0')
  return `${p2(d.getDate())}.${p2(d.getMonth() + 1)}.${d.getFullYear()}`
}

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  return (parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : (parts[0]?.slice(0, 2) ?? '?')).toUpperCase()
}

function collect(n: CaseTreeNode, out: CaseTreeItem[] = []) {
  for (const it of n.items ?? []) out.push(it)
  for (const c of n.children ?? []) collect(c, out)
  return out
}

interface Props {
  kind: RecordKind
  recId: string
  tree: CaseTreeNode
  /** the section the record goes to: Места / Улики / Участники */
  section: CaseTreeNode
  accent: string
  onAdd: (folderId: string, item: CaseTreeItem) => void
  onClose: () => void
}

const NOUN: Record<RecordKind, string> = { place: 'место', weapon: 'улику', org: 'организацию' }

export function CaseAddRecordDialog({ kind, recId, tree, section, accent, onAdd, onClose }: Props) {
  const rec = useMemo(() => (SEARCH_DB as unknown as DbRec[]).find((r) => r.id === recId) ?? null, [recId])

  // folders: the section and everything inside; a weapon defaults to «Вещественные», an organisation to the victims
  const folders = useMemo(() => {
    const out: { id: string; label: string }[] = []
    const walk = (n: CaseTreeNode, trail: string[]) => {
      const t = [...trail, n.name]
      out.push({ id: n.id, label: t.join(' › ') })
      for (const c of n.children ?? []) walk(c, t)
    }
    walk(section, [])
    return out
  }, [section])
  const startFolder = useMemo(() => {
    if (kind === 'place') return section.id
    const wants = kind === 'weapon' ? [/Вещественн/] : [/Потерпевш/, /Свидетел/]
    for (const w of wants) {
      const f = folders.find((x) => w.test(x.label))
      if (f) return f.id
    }
    return section.children?.[0]?.id ?? section.id
  }, [folders, kind, section])
  const [folderId, setFolderId] = useState(startFolder)

  const statusKind = kind === 'place' ? null : kind === 'weapon' ? 'evidence' : 'person'
  const statusOptions: StatusOption[] = statusKind ? (ITEM_STATUSES[statusKind] ?? []) : []
  const [status, setStatus] = useState<StatusOption>(() => (kind === 'weapon' ? (statusOptions.find((o) => o.status === 'Хранилище') ?? statusOptions[0]) : (statusOptions.find((o) => o.status === 'Не опрошен') ?? statusOptions[0])) ?? { status: 'Добавлен', tone: 'grey' })
  const [placeType, setPlaceType] = useState<CasePlaceType>('other')
  const [note, setNote] = useState('')

  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [onClose])

  // already in the case: same title, or the MDC number / serial in its fields
  const dup = useMemo(() => {
    if (!rec) return false
    const keys = [rec.title, rec.code, rec.serial].filter(Boolean) as string[]
    return collect(tree).some((it) => it.title === rec.title || (rec.serial && it.title.includes(rec.serial)) || it.info.some(([k, v]) => (k === 'Запись MDC' || k === 'Серийный номер') && keys.includes(v)))
  }, [rec, tree])

  function submit() {
    if (!rec || dup) return
    const base = { id: `n-${Date.now()}`, date: today(), note: note.trim() }
    let item: CaseTreeItem
    if (kind === 'place') {
      const pin = KNOWN_PINS[rec.id]
      item = {
        ...base,
        kind: 'place',
        title: rec.title,
        sub: rec.sub ?? '',
        status: PLACE_TYPE_LABEL[placeType],
        tone: 'grey' as CaseTone,
        placeType,
        info: [['Тип', PLACE_TYPE_LABEL[placeType]], ['Адрес', rec.title], ['Запись MDC', rec.title], ['Добавил', mockProfile.name]],
        ...(pin ? { px: pin[0], py: pin[1] } : {}),
      }
    } else if (kind === 'weapon') {
      item = {
        ...base,
        kind: 'evidence',
        title: `${rec.title}${rec.serial ? ` · ${rec.serial}` : ''}`,
        sub: 'Оружие из базы MDC',
        status: status.status,
        tone: status.tone,
        info: [['Серийный номер', rec.serial ?? ''], ['Запись MDC', rec.serial ?? rec.title], ['Добавил', mockProfile.name]],
      }
    } else {
      item = {
        ...base,
        kind: 'person',
        title: rec.title,
        sub: rec.sub ?? 'Организация',
        initials: rec.initials ?? initialsOf(rec.title),
        color: rec.color ?? '#5C6B70',
        status: status.status,
        tone: status.tone,
        info: [['Организация', rec.sub ?? ''], ['Запись MDC', rec.title], ['Добавил', mockProfile.name]],
      }
    }
    onAdd(folderId, item)
  }

  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div role="dialog" aria-label={`Добавить ${NOUN[kind]}`} className="flex max-h-[min(640px,100%)] w-[560px] max-w-full flex-col overflow-hidden rounded-[12px] border border-[#3A3A3A] bg-[#2C2C2C] text-white shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
        <div className="flex shrink-0 items-center gap-3 px-5 pb-3 pt-[18px]">
          <span className="flex-1 leading-5">
            <span className="block text-[18px] font-semibold">Добавить {NOUN[kind]}</span>
            <span className="block text-[12px] text-[#C2C2C2]">
              {kind === 'place' ? 'Адрес попадёт в «Места» — метку на карте можно передвинуть' : kind === 'weapon' ? 'Оружие попадёт в «Улики» как вещественное доказательство' : 'Организация проходит по делу как участник'}
            </span>
          </span>
          <button type="button" onClick={onClose} aria-label="Закрыть" className="flex h-8 w-8 items-center justify-center rounded-[6px] hover:bg-white/10">
            <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 pb-4 pt-1">
          {/* the picked MDC record */}
          <div className="flex items-center gap-3 rounded-[10px] bg-[#333333] px-3.5 py-3" style={{ boxShadow: `inset 0 0 0 1.5px ${accent}` }}>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] text-[12px] font-bold" style={{ background: kind === 'org' ? (rec?.color ?? '#5C6B70') : kind === 'place' ? '#2E6B57' : '#5C4A2A' }}>
              {kind === 'org' ? (rec?.initials ?? initialsOf(rec?.title ?? '')) : kind === 'place' ? '⌂' : '⌖'}
            </span>
            <span className="min-w-0 flex-1 leading-[18px]">
              <span className="block truncate text-[14px] font-semibold">{rec?.title ?? 'Запись не найдена'}</span>
              <span className="block truncate text-[12px] text-[#C2C2C2]">{[rec?.serial ? `Серийный номер ${rec.serial}` : rec?.sub, 'запись MDC'].filter(Boolean).join(' · ')}</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex min-w-0 flex-col gap-1 text-[12px] font-semibold text-[#C2C2C2]">
              Папка
              <span className="font-normal">
                <SingleDropdown label="Папка" options={folders.map((f) => ({ value: f.id, label: f.label }))} value={folderId} onChange={setFolderId} wide />
              </span>
            </div>
            {kind !== 'place' && (
              <div className="flex min-w-0 flex-col items-start gap-1 text-[12px] font-semibold text-[#C2C2C2]">
                Статус в деле
                <span className="flex h-8 items-center font-normal">
                  <StatusMenu status={status.status} tone={status.tone} options={statusOptions} onChange={(st, tone) => setStatus({ status: st, tone })} label="Статус в деле" />
                </span>
              </div>
            )}
          </div>

          {kind === 'place' && (
            <div className="flex flex-col gap-1.5 text-[12px] font-semibold text-[#C2C2C2]">
              Что это за место для дела
              <span className="flex flex-wrap gap-1.5 font-normal">
                {PLACE_TYPE_IDS.map((t) => {
                  const on = t === placeType
                  return (
                    <button key={t} type="button" onClick={() => setPlaceType(t)} className="flex h-7 items-center gap-1.5 rounded-full px-3 text-[12px]" style={{ background: on ? accent : '#3A3A3A', color: on ? '#0B2B3A' : '#FFFFFF' }}>
                      <span className="h-2 w-2 rounded-full" style={{ background: PLACE_TYPE_COLOR[t] }} />
                      {PLACE_TYPE_LABEL[t]}
                    </button>
                  )
                })}
              </span>
            </div>
          )}

          <label className="flex flex-col gap-1 text-[12px] font-semibold text-[#C2C2C2]">
            Заметка (необязательно)
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder={kind === 'place' ? 'Что здесь произошло или найдено' : kind === 'weapon' ? 'Где и при каких обстоятельствах изъято' : 'Как организация связана с делом'}
              className="resize-none rounded-[6px] bg-[#3A3A3A] px-2.5 py-2 text-[13px] font-normal leading-5 text-white outline-none"
            />
          </label>
        </div>

        <div className="flex shrink-0 items-center gap-2.5 border-t border-[#3A3A3A] px-5 py-3.5">
          <span className={`min-w-0 flex-1 truncate text-[12px] ${dup ? 'text-[#FF99A4]' : 'text-[#C2C2C2]'}`}>{dup ? 'Эта запись уже есть в деле' : rec ? `Будет добавлено: ${rec.title}` : ''}</span>
          <button type="button" onClick={onClose} className="h-[34px] rounded-[8px] bg-[#3A3A3A] px-4 text-[13px] hover:brightness-125">
            Отмена
          </button>
          <button type="button" onClick={submit} disabled={!rec || dup} style={{ background: accent }} className="h-[34px] rounded-[8px] px-4 text-[13px] font-semibold text-black enabled:hover:brightness-110 disabled:opacity-40">
            Добавить
          </button>
        </div>
      </div>
    </div>
  )
}
