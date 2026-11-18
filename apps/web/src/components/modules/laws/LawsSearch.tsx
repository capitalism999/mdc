import { useMemo, useState } from 'react'
import type { PenalCode } from '../../../types'
import { EmptyState, ListRow, SearchBar, StatusPill } from '../shared/ui'
import { PenalCodeIcon } from '../shared/entityIcons'
import { ChevronIcon } from '../people/icons'

const CLASS_LABEL: Record<PenalCode['class'], string> = {
  felony: 'Фелония',
  misdemeanor: 'Мисдиминор',
  infraction: 'Проступок',
  provision: 'Положение',
}

const CLASS_OPTIONS: { id: PenalCode['class'] | 'all'; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'felony', label: 'Фелонии' },
  { id: 'misdemeanor', label: 'Мисдиминоры' },
  { id: 'infraction', label: 'Проступки' },
  { id: 'provision', label: 'Положения' },
]

/** Canonical order of "Разделы" (sections) — matched against the leading
 * `Раздел <token>` prefix of `PenalCode.category`. */
const SECTION_TOKEN_ORDER = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV']

function sectionOrderIndex(category: string) {
  const token = category.match(/^Раздел\s+(\S+)/)?.[1] ?? ''
  const idx = SECTION_TOKEN_ORDER.indexOf(token)
  return idx === -1 ? SECTION_TOKEN_ORDER.length : idx
}

interface LawsSearchProps {
  penalCodes: PenalCode[]
  onSelect: (code: PenalCode) => void
  onSelectPreamble: () => void
}

/** Landing screen of "Законы" — statutes grouped into collapsible sections
 * (Разделы), each filterable by class and searchable by code/title. Search
 * auto-expands only the sections that have matches. Pins the Penal Code's
 * "Предварительные положения" above the section list. */
export function LawsSearch({ penalCodes, onSelect, onSelectPreamble }: LawsSearchProps) {
  const [query, setQuery] = useState('')
  const [cls, setCls] = useState<PenalCode['class'] | 'all'>('all')
  const [openSections, setOpenSections] = useState<Set<string>>(new Set())

  const q = query.trim().toLowerCase()
  const filtered = penalCodes.filter((p) => {
    if (cls !== 'all' && p.class !== cls) return false
    if (!q) return true
    return p.code.toLowerCase().includes(q) || p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
  })

  const sections = useMemo(() => {
    const byCategory = new Map<string, PenalCode[]>()
    for (const p of filtered) {
      const list = byCategory.get(p.category) ?? []
      list.push(p)
      byCategory.set(p.category, list)
    }
    return Array.from(byCategory.entries())
      .sort(([a], [b]) => sectionOrderIndex(a) - sectionOrderIndex(b))
      .map(([category, items]) => ({ category, items: items.sort((a, b) => Number(a.code) - Number(b.code)) }))
  }, [filtered])

  const isSearching = q.length > 0 || cls !== 'all'

  function toggleSection(category: string) {
    setOpenSections((prev) => {
      const next = new Set(prev)
      if (next.has(category)) next.delete(category)
      else next.add(category)
      return next
    })
  }

  return (
    <div className="flex h-full flex-col">
      <SearchBar value={query} onChange={setQuery} onSubmit={() => {}} placeholder="Код или название статьи..." icon={<PenalCodeIcon />} />

      <div className="flex gap-1.5 overflow-x-auto px-4 pb-3">
        {CLASS_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setCls(opt.id)}
            className={`shrink-0 rounded-[6px] px-3 py-1.5 text-[12px] font-medium transition-colors ${
              cls === opt.id ? 'bg-[#48adec] text-black' : 'bg-ink/5 text-ink/50 hover:text-ink/80'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 pb-4">
        {!isSearching && (
          <ListRow
            leading={
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink/10 text-ink/60">
                <PenalCodeIcon />
              </div>
            }
            title={<span className="truncate text-[14px] font-medium text-ink">Предварительные положения</span>}
            subtitle="Общие нормы, виды и классификация преступлений, определения"
            onClick={onSelectPreamble}
          />
        )}

        {sections.length === 0 ? (
          <EmptyState label="Ничего не найдено" />
        ) : (
          sections.map(({ category, items }) => {
            const open = isSearching || openSections.has(category)
            return (
              <div key={category} className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => toggleSection(category)}
                  className="flex items-center justify-between gap-2 rounded-[8px] bg-ink/5 px-3 py-2.5 text-left hover:bg-ink/10"
                >
                  <span className="truncate text-[13px] font-semibold text-ink/80">{category}</span>
                  <span className="flex shrink-0 items-center gap-2 text-ink/40">
                    <span className="text-[11px] font-medium">{items.length}</span>
                    <ChevronIcon className={`transition-transform ${open ? 'rotate-180' : ''}`} />
                  </span>
                </button>

                {open && (
                  <div className="flex flex-col gap-1.5 pl-1">
                    {items.map((p) => (
                      <ListRow
                        key={p.id}
                        leading={
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink/10 text-ink/60">
                            <PenalCodeIcon />
                          </div>
                        }
                        title={
                          <>
                            <span className="truncate text-[14px] font-medium text-ink">
                              {p.code} — {p.title}
                            </span>
                            <StatusPill status={CLASS_LABEL[p.class]} positive={p.class === 'infraction'} />
                          </>
                        }
                        subtitle={isSearching ? p.category : undefined}
                        onClick={() => onSelect(p)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
