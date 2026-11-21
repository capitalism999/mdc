import { useEffect, useRef, useState } from 'react'
import type { CasePlaceArea, CasePlaceLink, CasePlaceType, CaseTreeItem } from '../../../types'
import { PlaceTypeIcon } from './placeIcons'
import { readImages } from './CasePhotos'
import type { LinkOption } from './CaseInfoRows'
import { SingleDropdown } from './CaseDropdown'
import { AREA_MAX_R, AREA_PRESETS, EVIDENCE_ROLE, PERSON_ROLES, PLACE_TYPE_COLOR, PLACE_TYPE_IDS, PLACE_TYPE_LABEL, areaLabel, placeWhen } from './casePlaces'

/** Place card parts: edit form, «Связано» (people / evidence tied to the
 * place) and the «Места» section shown on person / evidence cards. */

/** Zone of a place: shape, presets, size slider (the map has a drag handle too). */
export function AreaEditor({ area, onChange }: { area: CasePlaceArea; onChange: (a: CasePlaceArea) => void }) {
  return (
    <div className="flex flex-col gap-1.5 text-[12px] text-[#C2C2C2]">
      <span className="flex items-center">
        <span className="flex-1">Зона неопределённости</span>
        <span className="text-white">{areaLabel(area)}</span>
      </span>
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="flex gap-0.5 rounded-[8px] bg-[#3A3A3A] p-0.5">
          {(
            [
              ['circle', 'Круг', <circle key="c" cx="10" cy="10" r="6.5" />],
              ['square', 'Квадрат', <rect key="s" x="3.5" y="3.5" width="13" height="13" rx="1.5" />],
            ] as const
          ).map(([shape, label, glyph]) => (
            <button
              key={shape}
              type="button"
              title={label}
              aria-label={label}
              aria-pressed={area.shape === shape}
              onClick={() => onChange({ shape, r: area.r || AREA_PRESETS[1].r })}
              className={`flex h-7 items-center gap-1.5 rounded-[6px] px-2.5 text-[12px] ${area.shape === shape ? 'bg-[#2C2C2C] font-semibold text-white' : 'text-[#C2C2C2] hover:bg-white/[0.06] hover:text-white'}`}
            >
              <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                {glyph}
              </svg>
              {label}
            </button>
          ))}
        </span>
        <span className="flex gap-0.5 rounded-[8px] bg-[#3A3A3A] p-0.5">
          {AREA_PRESETS.map((pr) => {
            const on = Math.abs(area.r - pr.r) < 0.05
            return (
              <button key={pr.label} type="button" onClick={() => onChange({ ...area, r: pr.r })} className={`h-7 whitespace-nowrap rounded-[6px] px-2 text-[12px] ${on ? 'bg-[#2C2C2C] font-semibold text-white' : 'text-[#C2C2C2] hover:bg-white/[0.06] hover:text-white'}`}>
                {pr.label}
              </button>
            )
          })}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={AREA_MAX_R}
        step={0.1}
        value={area.r}
        onChange={(e) => onChange({ ...area, r: Number(e.target.value) })}
        aria-label="Размер зоны"
        className="w-full accent-[#60CDFF]"
      />
      <span className="text-[11px] text-[#9A9A9A]">Тяните за ручку зоны прямо на карте — размер подстроится здесь.</span>
    </div>
  )
}

const WHEN_RE = /^\d{2}\.\d{2}\.\d{4}(, \d{2}:\d{2})?$/

export interface PlaceFormResult {
  title: string
  sub: string
  placeType: CasePlaceType
  when: string
  area: CasePlaceArea | null
  /** only with `withPhotos` (new place) */
  photos?: { src: string; name: string }[]
}

/** Place form — the same for editing an existing pin and creating a new one. */
export function PlaceEditForm({ item, area, onAreaChange, onSave, onCancel, onReposition, onTypeChange, withPhotos, titlePlaceholder, saveLabel = 'Сохранить' }: { item: CaseTreeItem; area: CasePlaceArea; onAreaChange: (a: CasePlaceArea) => void; onSave: (p: PlaceFormResult) => void; onCancel: () => void; onReposition?: () => void; onTypeChange?: (t: CasePlaceType) => void; withPhotos?: boolean; titlePlaceholder?: string; saveLabel?: string }) {
  const [title, setTitle] = useState(item.title)
  const [sub, setSub] = useState(item.sub)
  const [type, setTypeState] = useState<CasePlaceType>(item.placeType ?? 'other')
  const setType = (t: CasePlaceType) => {
    setTypeState(t)
    onTypeChange?.(t)
  }
  const [photos, setPhotos] = useState<{ src: string; name: string }[]>([])
  const [drag, setDrag] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const addFiles = (files: FileList | null) => void readImages(files).then((list) => list.length && setPhotos((p) => [...p, ...list]))
  const [when, setWhen] = useState(placeWhen(item))
  const [tried, setTried] = useState(false)
  const titleErr = !title.trim() ? 'Укажите название' : null
  const whenErr = !WHEN_RE.test(when.trim()) ? 'Формат: ДД.ММ.ГГГГ, ЧЧ:ММ' : null
  const save = () => {
    setTried(true)
    if (titleErr || whenErr) return
    onSave({ title: title.trim(), sub: sub.trim(), placeType: type, when: when.trim(), area: area.r > 0 ? area : null, ...(withPhotos ? { photos } : {}) })
  }
  const input = 'h-8 w-full rounded-[6px] bg-black/30 px-2.5 text-[13px] text-white outline-none placeholder:text-[#C2C2C2]/60'
  const ring = (err: boolean) => ({ boxShadow: `inset 0 0 0 1px ${err ? '#E5484D' : '#4A4A4A'}` })
  return (
    <div className="flex w-full flex-col gap-2.5 text-left" onKeyDown={(e) => e.key === 'Escape' && (e.stopPropagation(), onCancel())}>
      <label className="flex flex-col gap-1 text-[12px] text-[#C2C2C2]">
        Название
        <input autoFocus value={title} placeholder={titlePlaceholder} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && save()} className={input} style={ring(tried && !!titleErr)} />
        {tried && titleErr && <span className="text-[#FF99A4]">{titleErr}</span>}
      </label>
      <label className="flex flex-col gap-1 text-[12px] text-[#C2C2C2]">
        Описание
        <input value={sub} onChange={(e) => setSub(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && save()} placeholder="Что здесь произошло или найдено" className={input} style={ring(false)} />
      </label>
      <div className="flex flex-col gap-1 text-[12px] text-[#C2C2C2]">
        Тип
        <div className="flex flex-wrap gap-1">
          {PLACE_TYPE_IDS.map((t) => (
            <button key={t} type="button" onClick={() => setType(t)} className={`flex h-7 items-center gap-1.5 rounded-full px-2.5 text-[12px] ${type === t ? 'bg-white text-[#272727]' : 'bg-[#3A3A3A] text-white hover:brightness-125'}`}>
              <span style={{ color: type === t ? PLACE_TYPE_COLOR[t] : PLACE_TYPE_COLOR[t] }}>
                <PlaceTypeIcon type={t} size={12} strokeWidth={2.4} />
              </span>
              {PLACE_TYPE_LABEL[t]}
            </button>
          ))}
        </div>
      </div>
      <label className="flex flex-col gap-1 text-[12px] text-[#C2C2C2]">
        Когда
        <input value={when} onChange={(e) => setWhen(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && save()} placeholder="17.11.2026, 11:05" className={input} style={ring(tried && !!whenErr)} />
        {tried && whenErr && <span className="text-[#FF99A4]">{whenErr}</span>}
      </label>
      <AreaEditor area={area} onChange={onAreaChange} />
      {withPhotos && (
        <div className="flex flex-col gap-1 text-[12px] text-[#C2C2C2]">
          <span>Фото{photos.length > 0 && ` · ${photos.length}`}</span>
          <div className="grid grid-cols-3 gap-1.5">
            {photos.map((ph, i) => (
              <span key={i} className="group/ph relative aspect-square overflow-hidden rounded-[6px] bg-black/30">
                <img src={ph.src} alt={ph.name} className="h-full w-full object-cover" />
                <button type="button" aria-label="Убрать фото" title="Убрать фото" onClick={() => setPhotos((p) => p.filter((_, j) => j !== i))} className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-white opacity-0 hover:bg-black group-hover/ph:opacity-100 focus-visible:opacity-100">
                  <svg width="9" height="9" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M2 2l6 6M8 2l-6 6" /></svg>
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => (e.preventDefault(), setDrag(true))}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDrag(false)
                addFiles(e.dataTransfer.files)
              }}
              className={`flex flex-col items-center justify-center gap-1 rounded-[6px] border border-dashed text-[11px] ${photos.length ? 'aspect-square' : 'col-span-3 h-16 flex-row gap-1.5 text-[12px]'} ${drag ? 'border-[#60CDFF] bg-[#60CDFF]/10 text-white' : 'border-[#4A4A4A] text-[#C2C2C2] hover:border-[#6A6A6A] hover:text-white'}`}
            >
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2.5" y="4.5" width="15" height="11" rx="2" /><circle cx="7.5" cy="9" r="1.5" /><path d="M17.5 13l-4-4-7 6.5" /></svg>
              {photos.length ? 'Ещё' : 'Загрузить фото или перетащить сюда'}
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => (addFiles(e.target.files), (e.target.value = ''))} />
        </div>
      )}
      {onReposition && <button type="button" onClick={onReposition} className="flex h-8 items-center justify-center gap-1.5 rounded-[6px] border border-dashed border-[#4A4A4A] text-[12px] text-[#C2C2C2] hover:border-[#6A6A6A] hover:text-white">
        <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <circle cx="10" cy="10" r="6" />
          <path d="M10 1.5v4M10 14.5v4M1.5 10h4M14.5 10h4" />
        </svg>
        Переставить на карте
      </button>}
      {/* sticky, so «Сохранить / Создать» stays in reach in a short window */}
      <div className="sticky bottom-0 z-[2] -mx-4 -mb-5 flex justify-end gap-1.5 rounded-b-[12px] border-t border-[#3A3A3A] bg-[#303030] px-4 pb-3 pt-2.5">
        <button type="button" onClick={onCancel} className="h-8 rounded-[6px] px-3 text-[13px] text-[#C2C2C2] hover:bg-white/10">
          Отмена
        </button>
        <button type="button" onClick={save} className="h-8 rounded-[6px] bg-[#60CDFF] px-3 text-[13px] font-semibold text-black hover:brightness-110">
          {saveLabel}
        </button>
      </div>
    </div>
  )
}

/** «+ Связать» picker over the case's people and evidence (tabs). */
function LinkAdd({ options, onPick }: { options: LinkOption[]; onPick: (o: LinkOption) => void }) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<'Люди' | 'Улики'>('Люди')
  const [q, setQ] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const down = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', down)
    return () => document.removeEventListener('mousedown', down)
  }, [open])
  const s = q.trim().toLowerCase()
  const list = options.filter((o) => o.group === tab && (!s || o.label.toLowerCase().includes(s)))
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((v) => !v)} className={`flex h-9 w-full items-center gap-1.5 text-[13px] text-[#C2C2C2] hover:text-white ${open ? 'text-white' : ''}`}>
        <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M10 4v12M4 10h12" />
        </svg>
        Связать с человеком или уликой
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-[36px] z-30 rounded-[8px] border border-[#3A3A3A] bg-[#2C2C2C] p-1 shadow-[0_10px_28px_rgba(0,0,0,0.45)]">
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Имя или номер улики" aria-label="Поиск" className="mb-1 h-8 w-full rounded-[6px] bg-[#3A3A3A] px-2.5 text-[13px] text-white outline-none" />
          <div role="tablist" className="mb-1 flex gap-1">
            {(['Люди', 'Улики'] as const).map((t) => (
              <button key={t} type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`h-6 rounded-[12px] px-2.5 text-[12px] ${tab === t ? 'bg-white text-[#272727]' : 'bg-[#3A3A3A] text-white hover:brightness-125'}`}>
                {t}
              </button>
            ))}
          </div>
          <div className="max-h-[220px] overflow-y-auto">
            {list.length === 0 && <div className="px-2.5 py-2 text-[12px] text-[#C2C2C2]">Нечего связать</div>}
            {list.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  onPick(o)
                  setOpen(false)
                  setQ('')
                }}
                className="flex w-full flex-col rounded-[4px] px-2.5 py-1.5 text-left leading-[16px] hover:bg-white/[0.06]"
              >
                <span className="truncate text-[13px] text-white">{o.label}</span>
                <span className="text-[11px] text-[#9A9A9A]">{o.status}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function PlaceLinksSection({ links, options, onChange, onOpen }: { links: CasePlaceLink[]; options: LinkOption[]; onChange: (links: CasePlaceLink[], change: string) => void; onOpen: (id: string) => void }) {
  const byId = (id: string) => options.find((o) => o.id === id)
  const free = options.filter((o) => (o.group === 'Люди' || o.group === 'Улики') && !links.some((l) => l.id === o.id))
  return (
    <div>
      <div className="mb-1.5 ml-1 text-[13px] font-semibold text-[#C2C2C2]">Связано · {links.filter((l) => byId(l.id)).length}</div>
      <div className="rounded-[12px] bg-[#303030] px-3.5">
        {links.map((l) => {
          const o = byId(l.id)
          if (!o) return null
          const person = o.group === 'Люди'
          return (
            <div key={l.id} className="group flex items-center gap-2 border-b border-[#3A3A3A] py-2 text-[13px]">
              <button type="button" onClick={() => onOpen(l.id)} className="min-w-0 flex-1 text-left leading-[18px]">
                <span className="block truncate text-[#99D9FF] hover:underline">{o.label}</span>
                <span className="block text-[11px] text-[#9A9A9A]">{person ? 'Человек' : 'Улика'}</span>
              </button>
              {person ? (
                <SingleDropdown
                  label="Роль"
                  options={PERSON_ROLES.map((r) => ({ value: r, label: r }))}
                  value={l.role}
                  onChange={(r) => onChange(links.map((x) => (x.id === l.id ? { ...x, role: r } : x)), `Связь с ${o.label}: роль «${r}»`)}
                  align="right"
                />
              ) : (
                <span className="rounded-[10px] bg-white/[0.08] px-2 py-0.5 text-[12px] text-[#C8C8C8]">{EVIDENCE_ROLE}</span>
              )}
              <button
                type="button"
                aria-label={`Убрать связь с ${o.label}`}
                title="Убрать связь"
                onClick={() => onChange(links.filter((x) => x.id !== l.id), `Убрана связь с ${o.label}`)}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[4px] text-[#C2C2C2] hover:bg-white/10 hover:text-[#FF99A4]"
              >
                <svg width="9" height="9" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                  <path d="M5 5l10 10M15 5L5 15" />
                </svg>
              </button>
            </div>
          )
        })}
        <LinkAdd options={free} onPick={(o) => onChange([...links, { id: o.id, role: o.group === 'Люди' ? 'замечен' : EVIDENCE_ROLE }], `Связано: ${o.label}`)} />
      </div>
    </div>
  )
}

/** On a person / evidence card: places of the case linked to it. */
export function RecordPlacesSection({ places, onOpen }: { places: { place: CaseTreeItem; role: string; folderId: string }[]; onOpen: (folderId: string, placeId: string) => void }) {
  if (!places.length) return null
  return (
    <div>
      <div className="mb-1.5 ml-1 text-[13px] font-semibold text-[#C2C2C2]">Места · {places.length}</div>
      <div className="rounded-[12px] bg-[#303030] px-3.5">
        {places.map(({ place, role, folderId }, i) => (
          <button key={place.id} type="button" onClick={() => onOpen(folderId, place.id)} className={`group flex w-full items-center gap-2.5 py-2.5 text-left text-[13px] ${i === places.length - 1 ? '' : 'border-b border-[#3A3A3A]'}`}>
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] text-white" style={{ background: place.placeType ? PLACE_TYPE_COLOR[place.placeType] : '#2E8B57' }}>
              <PlaceTypeIcon type={place.placeType} size={13} />
            </span>
            <span className="min-w-0 flex-1 leading-[18px]">
              <span className="block truncate text-[#99D9FF] group-hover:underline">{place.title}</span>
              <span className="block text-[11px] text-[#9A9A9A]">
                {role} · {placeWhen(place)}
              </span>
            </span>
            <svg className="shrink-0 text-[#C2C2C2]" width="10" height="10" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7.5 4.5L13 10l-5.5 5.5" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}
