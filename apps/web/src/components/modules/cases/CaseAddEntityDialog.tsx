import { useEffect, useMemo, useState } from 'react'
import type { CaseTreeItem, CaseTreeNode } from '../../../types'
import { SEARCH_DB } from '../search/searchLogic'
import { LicensePlate } from '../shared/LicensePlate'
import { ownPhoto } from '../shared/personPhotos'
import { SingleDropdown } from './CaseDropdown'
import { ITEM_STATUSES, StatusMenu, type StatusOption } from './caseStatus'
import { mockProfile } from '../../../lib/mockData/profile'

/** «Добавить участника» / «Добавить транспорт» for a case: find the person or
 * vehicle in the MDC database (or enter one that isn't there), pick the
 * folder and status, add a note. Linked entries carry the MDC link
 * (`Запись MDC` / `Номер`), so the inspector shows their live MDC data. */

type Kind = 'person' | 'vehicle'

interface DbRec {
  id: string
  type: string
  title: string
  code?: string
  plate?: string
  sub?: string
  initials?: string
  color?: string
  keys?: string
  f?: Record<string, string>
}

/** The status a new record gets in a folder: witnesses / victims start
 * «Не опрошен», staff «Помогает», everyone / everything else «Проверяется». */
function defaultStatus(kind: Kind, folderLabel: string): StatusOption {
  const want = kind === 'person' && /Свидетел|Потерпевш/.test(folderLabel) ? 'Не опрошен' : kind === 'person' && /Сотрудник/.test(folderLabel) ? 'Помогает' : 'Проверяется'
  const list = ITEM_STATUSES[kind] ?? []
  return list.find((o) => o.status === want) ?? list[0] ?? { status: 'Добавлен', tone: 'grey' }
}

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  return (parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : parts[0]?.slice(0, 2) ?? '?').toUpperCase()
}

function today() {
  const d = new Date()
  const p2 = (n: number) => String(n).padStart(2, '0')
  return `${p2(d.getDate())}.${p2(d.getMonth() + 1)}.${d.getFullYear()}`
}

function collectItems(n: CaseTreeNode, out: CaseTreeItem[] = []) {
  out.push(...(n.items ?? []))
  for (const c of n.children ?? []) collectItems(c, out)
  return out
}

interface Props {
  kind: Kind
  tree: CaseTreeNode
  /** top-level section the entity goes into (Участники / Транспорт) */
  section: CaseTreeNode
  startFolderId: string
  accent: string
  onAdd: (folderId: string, item: CaseTreeItem) => void
  onClose: () => void
  /** SEARCH_DB id to start with already picked (Поиск → «Добавить в дело») */
  initialPickId?: string | null
}

export function CaseAddEntityDialog({ kind, tree, section, startFolderId, accent, onAdd, onClose, initialPickId }: Props) {
  // a pre-picked record also fills the search, so it is the row shown (and highlighted) in the results
  const [initialPick] = useState<DbRec | null>(() => (initialPickId ? ((SEARCH_DB as unknown as DbRec[]).find((r) => r.id === initialPickId && r.type === kind) ?? null) : null))
  const [q, setQ] = useState(initialPick ? (initialPick.plate ?? initialPick.title) : '')
  const [picked, setPicked] = useState<DbRec | null>(initialPick)
  const [manual, setManual] = useState(false)
  const [mName, setMName] = useState('')
  const [mExtra, setMExtra] = useState('')
  const [note, setNote] = useState('')

  // Folder choices: the section and every folder inside it.
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
  const [folderId, setFolderIdState] = useState(folders.some((f) => f.id === startFolderId) ? startFolderId : (section.children?.[0]?.id ?? section.id))
  const labelOf = (id: string) => folders.find((f) => f.id === id)?.label ?? ''
  const [status, setStatus] = useState<StatusOption>(() => defaultStatus(kind, labelOf(folderId)))
  /** once a status is picked by hand, changing the folder no longer resets it */
  const [statusPicked, setStatusPicked] = useState(false)
  const setFolderId = (id: string) => {
    setFolderIdState(id)
    if (!statusPicked) setStatus(defaultStatus(kind, labelOf(id)))
  }

  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [onClose])

  const inCase = useMemo(() => {
    const items = collectItems(tree).filter((it) => it.kind === kind)
    const keys = new Set<string>()
    for (const it of items) {
      keys.add(it.title)
      for (const [k, v] of it.info) if (k === 'Запись MDC' || k === 'Номер') keys.add(v)
    }
    return keys
  }, [tree, kind])
  const isInCase = (r: DbRec) => inCase.has(r.title) || (!!r.code && inCase.has(r.code)) || (!!r.plate && inCase.has(r.plate))

  const results = useMemo(() => {
    const s = q.trim().toLowerCase()
    const pool = (SEARCH_DB as unknown as DbRec[]).filter((r) => r.type === kind)
    if (!s) return pool.slice(0, 8)
    return pool.filter((r) => `${r.title} ${r.code ?? ''} ${r.plate ?? ''} ${r.sub ?? ''} ${r.keys ?? ''} ${r.f?.phone ?? ''}`.toLowerCase().includes(s)).slice(0, 12)
  }, [q, kind])

  const { status: stLabel, tone: stTone } = status
  // a hand-entered name / plate that is already in the case
  const manualKey = kind === 'person' ? mName.trim() : mName.trim().toUpperCase()
  const manualDup = manual && !!manualKey && inCase.has(manualKey)
  const canAdd = manual ? !manualDup && (kind === 'person' ? true : !!(mName.trim() || mExtra.trim())) : !!picked

  function submit() {
    if (!canAdd) return
    const base = { id: `n-${Date.now()}`, kind, status: stLabel, tone: stTone, date: today(), note: note.trim() } as const
    let item: CaseTreeItem
    if (!manual && picked) {
      if (kind === 'person') {
        const employee = /^LSPD-/.test(picked.code ?? '')
        item = {
          ...base,
          title: picked.title,
          initials: picked.initials ?? initialsOf(picked.title),
          color: picked.color ?? '#5C6B70',
          sub: picked.sub ?? '',
          info: [...(employee ? [] : ([['Запись MDC', picked.code ?? '']] as [string, string][])), ['Добавил', mockProfile.name]],
        }
      } else {
        item = { ...base, title: `${picked.plate} · ${picked.title}`, sub: picked.sub ?? '', info: [['Номер', picked.plate ?? ''], ['Добавил', mockProfile.name]] }
      }
    } else if (kind === 'person') {
      const name = mName.trim()
      item = {
        ...base,
        title: name || 'Неизвестный',
        initials: name ? initialsOf(name) : '?',
        color: '#5C6B70',
        sub: mExtra.trim() || 'Нет в MDC',
        info: [...(mExtra.trim() ? ([['Приметы', mExtra.trim()]] as [string, string][]) : []), ['Добавил', mockProfile.name]],
      }
    } else {
      const plate = mName.trim().toUpperCase()
      const model = mExtra.trim()
      item = { ...base, title: `${plate || 'Без номеров'} · ${model || 'Неизвестное ТС'}`, sub: 'Нет в MDC', info: [['Номер', plate || 'Не установлен'], ['Добавил', mockProfile.name]] }
    }
    onAdd(folderId, item)
  }

  const noun = kind === 'person' ? 'участника' : 'транспорт'
  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div role="dialog" aria-label={`Добавить ${noun}`} className="flex max-h-[min(760px,100%)] w-[620px] max-w-full flex-col overflow-hidden rounded-[12px] border border-[#3A3A3A] bg-[#2C2C2C] text-white shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
        <div className="flex shrink-0 items-center gap-3 px-5 pb-3 pt-[18px]">
          <span className="flex-1 leading-5">
            <span className="block text-[18px] font-semibold">Добавить {noun}</span>
            <span className="block text-[12px] text-[#C2C2C2]">{kind === 'person' ? 'Найдите человека в базе MDC — документы, судимости и транспорт подтянутся сами' : 'Найдите ТС в базе MDC по номеру или модели'}</span>
          </span>
          <button type="button" onClick={onClose} aria-label="Закрыть" className="flex h-8 w-8 items-center justify-center rounded-[6px] hover:bg-white/10">
            <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 pb-4 pt-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex min-w-0 flex-col gap-1 text-[12px] font-semibold text-[#C2C2C2]">
              Папка
              <span className="font-normal">
                <SingleDropdown label="Папка" options={folders.map((f) => ({ value: f.id, label: f.label }))} value={folderId} onChange={setFolderId} wide />
              </span>
            </div>
            <div className="flex min-w-0 flex-col items-start gap-1 text-[12px] font-semibold text-[#C2C2C2]">
              Статус в деле
              <span className="flex h-8 items-center font-normal">
                <StatusMenu
                  status={status.status}
                  tone={status.tone}
                  options={ITEM_STATUSES[kind] ?? []}
                  onChange={(st, tone) => {
                    setStatus({ status: st, tone })
                    setStatusPicked(true)
                  }}
                  label="Статус в деле"
                />
              </span>
            </div>
          </div>
          {!manual ? (
            <div className="flex flex-col gap-2">
              <label className="flex h-9 items-center gap-2 rounded-[8px] bg-[#3A3A3A] px-2.5 text-[#C2C2C2]" style={{ boxShadow: `inset 0 0 0 1.5px ${accent}` }}>
                <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
                  <circle cx="8.5" cy="8.5" r="5" />
                  <path d="M12.5 12.5l4.5 4.5" />
                </svg>
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value)
                    setPicked(null)
                  }}
                  placeholder={kind === 'person' ? 'Имя, номер записи (CIT-…) или телефон' : 'Номер, модель или VIN'}
                  aria-label="Поиск в MDC"
                  className="min-w-0 flex-1 bg-transparent text-[13px] text-white outline-none"
                />
              </label>
              <div className="overflow-hidden rounded-[10px] bg-[#303030]">
                {results.length === 0 && <div className="px-3.5 py-3 text-[13px] text-[#FF99A4]">В MDC ничего не найдено</div>}
                {results.map((r, i) => {
                  const already = isInCase(r)
                  const on = picked?.id === r.id
                  const photo = kind === 'person' ? ownPhoto(r.id, r.title) : null
                  return (
                    <button
                      key={r.id}
                      type="button"
                      disabled={already}
                      onClick={() => setPicked(r)}
                      className={`flex w-full items-center gap-3 px-3 py-2 text-left disabled:cursor-default ${i === results.length - 1 ? '' : 'border-b border-[#3A3A3A]'} ${on ? 'bg-white/[0.08]' : already ? '' : 'hover:bg-white/[0.05]'}`}
                      style={{ boxShadow: on ? `inset 3px 0 0 ${accent}` : 'none' }}
                    >
                      {kind === 'person' ? (
                        photo ? (
                          <img src={photo} alt="" className="h-9 w-9 shrink-0 rounded-[8px] object-cover object-top" style={{ opacity: already ? 0.5 : 1 }} />
                        ) : (
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] text-[12px] font-semibold text-white" style={{ background: r.color ?? '#5C6B70', opacity: already ? 0.5 : 1 }}>
                            {r.initials ?? initialsOf(r.title)}
                          </span>
                        )
                      ) : (
                        <span style={{ opacity: already ? 0.5 : 1 }}>
                          <LicensePlate plate={r.plate ?? ''} size="md" />
                        </span>
                      )}
                      <span className={`min-w-0 flex-1 leading-[18px] ${already ? 'opacity-50' : ''}`}>
                        <span className="block truncate text-[13px] font-semibold">{r.title}</span>
                        <span className="block truncate text-[12px] text-[#C2C2C2]">{kind === 'person' ? `${r.code} · ${r.sub}` : r.sub}</span>
                      </span>
                      {already ? <span className="shrink-0 text-[11px] text-[#C2C2C2]">Уже в деле</span> : on ? <span className="shrink-0 text-[12px] font-semibold" style={{ color: accent }}>Выбран</span> : null}
                    </button>
                  )
                })}
              </div>
              <button type="button" onClick={() => setManual(true)} className="self-start rounded-[6px] px-1.5 py-1 text-[12px] text-[#99D9FF] hover:bg-white/[0.06]">
                {kind === 'person' ? 'Нет в MDC или личность не установлена — добавить вручную' : 'Нет в MDC или номер неизвестен — добавить вручную'}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 rounded-[10px] bg-[#303030] p-3.5">
              <div className="flex items-center text-[13px] font-semibold">
                <span className="flex-1">Без записи в MDC</span>
                <button type="button" onClick={() => setManual(false)} className="rounded-[6px] px-1.5 py-0.5 text-[12px] font-normal text-[#99D9FF] hover:bg-white/[0.06]">
                  ← Искать в MDC
                </button>
              </div>
              <label className="flex flex-col gap-1 text-[12px] text-[#C2C2C2]">
                {kind === 'person' ? 'Имя (оставьте пустым, если личность не установлена)' : 'Номер (если известен)'}
                <input autoFocus value={mName} onChange={(e) => setMName(e.target.value)} placeholder={kind === 'person' ? 'Например, John Doe' : 'Например, 6SLT214'} className="h-8 rounded-[6px] bg-[#3A3A3A] px-2.5 text-[13px] text-white outline-none" />
              </label>
              <label className="flex flex-col gap-1 text-[12px] text-[#C2C2C2]">
                {kind === 'person' ? 'Приметы' : 'Модель и цвет'}
                <input value={mExtra} onChange={(e) => setMExtra(e.target.value)} placeholder={kind === 'person' ? 'Пол, возраст, одежда, особые приметы' : 'Например, серый Karin Sultan RS'} className="h-8 rounded-[6px] bg-[#3A3A3A] px-2.5 text-[13px] text-white outline-none" />
              </label>
            </div>
          )}

          <label className="flex flex-col gap-1 text-[12px] font-semibold text-[#C2C2C2]">
            Заметка (необязательно)
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder={kind === 'person' ? 'Почему проходит по делу, что известно' : 'Где замечено, как связано с делом'} className="resize-none rounded-[6px] bg-[#3A3A3A] px-2.5 py-2 text-[13px] font-normal leading-5 text-white outline-none" />
          </label>
        </div>

        <div className="flex shrink-0 items-center gap-2.5 border-t border-[#3A3A3A] px-5 py-3.5">
          <span className={`min-w-0 flex-1 truncate text-[12px] ${manualDup ? 'text-[#FF99A4]' : 'text-[#C2C2C2]'}`}>{manualDup ? (kind === 'person' ? `${manualKey} уже проходит по делу` : `Номер ${manualKey} уже есть в деле`) : manual ? 'Запись появится без связи с MDC — её можно связать позже' : picked ? `Будет добавлен: ${picked.title}` : 'Выберите запись из списка'}</span>
          <button type="button" onClick={onClose} className="h-[34px] rounded-[8px] bg-[#3A3A3A] px-4 text-[13px] hover:brightness-125">
            Отмена
          </button>
          <button type="button" onClick={submit} disabled={!canAdd} style={{ background: accent }} className="h-[34px] rounded-[8px] px-4 text-[13px] font-semibold text-black enabled:hover:brightness-110 disabled:opacity-40">
            Добавить
          </button>
        </div>
      </div>
    </div>
  )
}
