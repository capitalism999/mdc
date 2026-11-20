import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { CasePlaceArea, CaseTreeItem } from '../../../types'
import { PlaceTypeIcon } from './placeIcons'
import { GEO } from '../bolo/BoloMap'
import { MultiDropdown, SingleDropdown } from './CaseDropdown'
import { BOLO_RED, CaseMap, type MapFocus } from './CaseMap'
import { PLACE_TYPE_COLOR, PLACE_TYPE_LABEL, placeAuthor, placeWhen, timeKey, type BoloPin } from './casePlaces'

/** «Места»: address search, filters & layers, the map and the list of pins. */

interface Props {
  places: CaseTreeItem[]
  selectedId: string | null
  onSelect: (id: string) => void
  placing: boolean
  placingLabel: string
  draftPin: { x: number; y: number } | null
  onStartPlacing: () => void
  onCancelPlacing: () => void
  onMapClick: (x: number, y: number) => void
  onMovePin: (id: string, x: number, y: number) => void
  areaDraft: (CasePlaceArea & { id: string }) | null
  onAreaDraft: (d: (CasePlaceArea & { id: string }) | null) => void
  /** people of the case (for «маршрут человека») */
  people: { id: string; title: string }[]
  boloPins: BoloPin[]
  onOpenBolo: () => void
  accent: string
  /** title → author from the case journal */
  authorHints: Record<string, string>
}

const PERIODS = [
  { value: 'all', label: 'Всё время' },
  { value: '24h', label: 'За 24 часа' },
  { value: '7d', label: 'За 7 дней' },
]

function Toggle({ on, onClick, children, title }: { on: boolean; onClick: () => void; children: ReactNode; title?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      title={title}
      className={`flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[6px] px-2.5 text-[13px] ${on ? 'bg-[rgba(96,205,255,0.16)] text-[#BFEAFF] hover:bg-[rgba(96,205,255,0.24)]' : 'bg-[#3A3A3A] text-white hover:brightness-125'}`}
    >
      {children}
    </button>
  )
}

/** «Найти адрес или место» with suggestions (map districts/streets + case places). */
function PlaceSearch({ places, placing, onPick }: { places: CaseTreeItem[]; placing: boolean; onPick: (r: { x: number; y: number; placeId?: string; label: string }) => void }) {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [hi, setHi] = useState(0)
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
  const results = s
    ? [
        ...places.filter((p) => p.title.toLowerCase().includes(s) || p.sub.toLowerCase().includes(s)).map((p) => ({ label: p.title, sub: `Метка дела · ${p.placeType ? PLACE_TYPE_LABEL[p.placeType] : ''}`, x: p.px ?? 50, y: p.py ?? 50, placeId: p.id })),
        ...GEO.filter(([name]) => name.toLowerCase().includes(s)).map(([name, x, y]) => ({ label: name, sub: 'Район / улица на карте', x, y, placeId: undefined as string | undefined })),
      ].slice(0, 10)
    : []
  const pick = (r: (typeof results)[number] | undefined) => {
    if (!r) return
    onPick(r)
    setOpen(false)
    setQ('')
  }
  return (
    <div ref={ref} className="relative min-w-[200px] flex-1">
      <label className="flex h-8 items-center gap-2 rounded-[6px] bg-[#3A3A3A] px-2.5 text-[#C2C2C2]" style={{ boxShadow: open && s ? 'inset 0 0 0 1px #60CDFF' : 'none' }}>
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
          <circle cx="8.5" cy="8.5" r="5" />
          <path d="M12.5 12.5l4.5 4.5" />
        </svg>
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            setOpen(true)
            setHi(0)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setHi((h) => Math.min(h + 1, results.length - 1))
            } else if (e.key === 'ArrowUp') {
              e.preventDefault()
              setHi((h) => Math.max(h - 1, 0))
            } else if (e.key === 'Enter') pick(results[hi])
            else if (e.key === 'Escape') setOpen(false)
          }}
          placeholder={placing ? 'Найти адрес, чтобы поставить туда метку' : 'Найти адрес или место'}
          aria-label="Найти адрес или место"
          className="min-w-0 flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-[#C2C2C2]/70"
        />
      </label>
      {open && s && (
        <div className="absolute left-0 right-0 top-[36px] z-30 max-h-[300px] overflow-y-auto rounded-[8px] border border-[#3A3A3A] bg-[#2C2C2C] p-1 shadow-[0_10px_28px_rgba(0,0,0,0.45)]">
          {results.length === 0 && <div className="px-2.5 py-2 text-[12px] text-[#C2C2C2]">Ничего не найдено</div>}
          {results.map((r, i) => (
            <button
              key={r.label + i}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => pick(r)}
              onMouseEnter={() => setHi(i)}
              className={`flex w-full flex-col rounded-[4px] px-2.5 py-1.5 text-left leading-[17px] ${i === hi ? 'bg-white/[0.08]' : 'hover:bg-white/[0.06]'}`}
            >
              <span className="text-[13px] text-white">{r.label}</span>
              <span className="text-[11px] text-[#9A9A9A]">{r.sub}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function CasePlacesView({ areaDraft, onAreaDraft, places, selectedId, onSelect, placing, placingLabel, draftPin, onStartPlacing, onCancelPlacing, onMapClick, onMovePin, boloPins, onOpenBolo, accent, authorHints }: Props) {
  const authorOf = (p: CaseTreeItem) => placeAuthor(p, authorHints)
  const [hiddenTypes, setHiddenTypes] = useState<Record<string, boolean>>({})
  const [period, setPeriod] = useState('all')
  const [authors, setAuthors] = useState<string[]>([])
  const [heatmap, setHeatmap] = useState(false)
  const [arrange, setArrange] = useState(false)
  const [boloLayer, setBoloLayer] = useState(true)
  const [hovered, setHovered] = useState<string | null>(null)
  const [focus, setFocus] = useState<MapFocus | null>(null)
  const [activeBolo, setActiveBolo] = useState<string | null>(null)
  const fromMap = useRef(false)
  const shownBolo = boloLayer ? boloPins : []

  const allAuthors = useMemo(() => Array.from(new Set(places.map(authorOf))), [places])
  const now = Date.now()
  const visible = places
    .filter((p) => !p.placeType || !hiddenTypes[p.placeType])
    .filter((p) => period === 'all' || now - timeKey(placeWhen(p)) <= (period === '24h' ? 864e5 : 7 * 864e5))
    .filter((p) => authors.length === 0 || authors.includes(authorOf(p)))
    .sort((a, b) => timeKey(placeWhen(a)) - timeKey(placeWhen(b)))
  const legend = Array.from(new Set(places.map((p) => p.placeType).filter(Boolean)))
    .map((t) => ({ type: t as string, count: places.filter((p) => p.placeType === t).length, hidden: !!hiddenTypes[t as string] }))
  const filtered = period !== 'all' || authors.length > 0 || Object.values(hiddenTypes).some(Boolean)

  // Selecting from the list / another card (not from the map) centres on the pin.
  useEffect(() => {
    if (selectedId) setActiveBolo(null)
    if (fromMap.current) {
      fromMap.current = false
      return
    }
    const p = places.find((x) => x.id === selectedId)
    if (p) setFocus((f) => ({ x: p.px ?? 50, y: p.py ?? 50, zoom: 3, n: (f?.n ?? 0) + 1 }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId])

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <PlaceSearch
          places={places}
          placing={placing}
          onPick={(r) => {
            setFocus((f) => ({ x: r.x, y: r.y, zoom: 5, n: (f?.n ?? 0) + 1 }))
            if (placing) onMapClick(r.x, r.y)
            else if (r.placeId) onSelect(r.placeId)
          }}
        />
        <SingleDropdown label="Период" options={PERIODS} value={period} onChange={setPeriod} />
        {allAuthors.length > 1 && <MultiDropdown label="Кто отметил" allLabel="Все сотрудники" nounMany={(n) => `${n} сотрудника`} options={allAuthors.map((a) => ({ value: a, label: a }))} selected={authors} onChange={setAuthors} />}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {boloPins.length > 0 && (
          <Toggle
            on={boloLayer}
            onClick={() => {
              setBoloLayer((v) => !v)
              setActiveBolo(null)
            }}
            title="Отметки «Замечен» из ориентировок по фигурантам дела">
            <span className="h-2.5 w-2.5 rounded-full border-2 border-dashed border-[#FF5A64]" />
            Отметки BOLO · {boloPins.length}
          </Toggle>
        )}
        <Toggle on={heatmap} onClick={() => setHeatmap((v) => !v)} title="Где меток больше всего">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'radial-gradient(circle, #E81123, #FFB900)' }} />
          Тепловая карта
        </Toggle>
      </div>

      <CaseMap
        arrange={arrange}
        onArrangeDone={() => setArrange(false)}
        onArrangeStart={() => setArrange(true)}
        areaDraft={areaDraft}
        onAreaDraft={onAreaDraft}
        places={visible}
        selectedId={selectedId}
        hoveredId={hovered}
        onHover={setHovered}
        placing={placing}
        placingLabel={placingLabel}
        draftPin={draftPin}
        accent={accent}
        legend={legend}
        onToggleType={(t) => setHiddenTypes((prev) => ({ ...prev, [t]: !prev[t] }))}
        onStartPlacing={onStartPlacing}
        onCancelPlacing={onCancelPlacing}
        onMapClick={onMapClick}
        onPickPin={(id) => {
          fromMap.current = true
          onSelect(id)
        }}
        onMovePin={onMovePin}
        heatmap={heatmap}
        boloPins={shownBolo}
        activeBolo={activeBolo}
        onActiveBolo={setActiveBolo}
        onOpenBolo={onOpenBolo}
        focus={focus}
      />

      <div>
        <div className="mb-1.5 ml-1 flex items-center text-[13px] font-semibold text-[#C2C2C2]">
          <span className="flex-1">
            Метки · {visible.length}
            {visible.length !== places.length && <span className="font-normal"> из {places.length}</span>}
          </span>
          <span className="text-[12px] font-normal text-[#9A9A9A]">по времени</span>
        </div>
        <div className="overflow-hidden rounded-[12px] bg-[#303030]">
          {visible.length === 0 && (
            <div className="flex items-center gap-2 px-4 py-4 text-[13px] text-[#C2C2C2]">
              <span className="flex-1">{places.length ? 'Нет меток по выбранным фильтрам' : 'Меток пока нет — поставьте первую на карте'}</span>
              {filtered && (
                <button
                  type="button"
                  onClick={() => {
                    setHiddenTypes({})
                    setPeriod('all')
                    setAuthors([])
                  }}
                  className="h-7 rounded-[6px] px-2 text-[12px] text-[#99D9FF] hover:bg-white/10"
                >
                  Сбросить фильтры
                </button>
              )}
            </div>
          )}
          {visible.map((p, i) => {
            const on = p.id === selectedId
            const hot = p.id === hovered
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelect(p.id)}
                onMouseEnter={() => setHovered(p.id)}
                onMouseLeave={() => setHovered(null)}
                className={`relative flex w-full items-center gap-3 px-3 text-left ${on ? 'bg-white/[0.08]' : hot ? 'bg-white/[0.05]' : 'hover:bg-white/[0.05]'}`}
              >
                <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-[2px]" style={{ background: accent, opacity: on ? 1 : 0 }} />
                <span className="my-2.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] text-white" style={{ background: p.placeType ? PLACE_TYPE_COLOR[p.placeType] : '#2E8B57' }}>
                  <PlaceTypeIcon type={p.placeType} size={15} />
                </span>
                <span className={`flex min-w-0 flex-1 items-center gap-3 py-2.5 ${i === visible.length - 1 ? '' : 'border-b border-[#3A3A3A]'}`}>
                  <span className="min-w-0 flex-1 leading-[18px]">
                    <span className="block truncate text-[13px] font-semibold">{p.title}</span>
                    <span className="block truncate text-[12px] text-[#C2C2C2]">
                      {p.placeType ? PLACE_TYPE_LABEL[p.placeType] : 'Место'} · {placeWhen(p)} · {authorOf(p)}
                    </span>
                  </span>
                  {p.photos?.length ? <img src={p.photos[0].src} alt="" className="h-9 w-9 shrink-0 rounded-[6px] object-cover" /> : null}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {shownBolo.length > 0 && (
        <div>
          <div className="mb-1.5 ml-1 flex items-center text-[13px] font-semibold text-[#C2C2C2]">
            <span className="flex-1">Отметки BOLO · {shownBolo.length}</span>
            <span className="text-[12px] font-normal text-[#9A9A9A]">из ориентировок</span>
          </div>
          <div className="overflow-hidden rounded-[12px] bg-[#303030]">
            {[...shownBolo]
              .sort((a, b) => timeKey(a.when) - timeKey(b.when))
              .map((b, i, arr) => {
                const on = b.key === activeBolo
                return (
                  <button
                    key={b.key}
                    type="button"
                    onClick={() => {
                      const next = on ? null : b.key
                      setActiveBolo(next)
                      if (next) setFocus((f) => ({ x: b.x, y: b.y, zoom: 3, n: (f?.n ?? 0) + 1 }))
                    }}
                    className={`relative flex w-full items-center gap-3 px-3 text-left ${on ? 'bg-white/[0.08]' : 'hover:bg-white/[0.05]'}`}
                  >
                    <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-[2px]" style={{ background: BOLO_RED, opacity: on ? 1 : 0 }} />
                    <span className="my-2.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white outline-dashed outline-[1.5px] outline-offset-2" style={{ background: BOLO_RED, outlineColor: BOLO_RED }}>
                      B
                    </span>
                    <span className={`min-w-0 flex-1 py-2.5 leading-[18px] ${i === arr.length - 1 ? '' : 'border-b border-[#3A3A3A]'}`}>
                      <span className="block truncate text-[13px] font-semibold">{b.subject}</span>
                      <span className="block truncate text-[12px] text-[#C2C2C2]">
                        BOLO {b.boloNo} · {b.when} · {b.place} · Отметил {b.who}
                      </span>
                    </span>
                  </button>
                )
              })}
          </div>
        </div>
      )}
    </div>
  )
}
