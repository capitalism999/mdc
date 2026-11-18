import { useEffect, useMemo, useState } from 'react'
import type { PenalCode } from '../../../types'
import { PenalCodeIcon } from '../shared/entityIcons'
import { ChevronIcon, SearchIcon } from '../people/icons'

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

function sectionToken(category: string) {
  return category.match(/^Раздел\s+(\S+)/)?.[1] ?? ''
}

function sectionOrderIndex(category: string) {
  const idx = SECTION_TOKEN_ORDER.indexOf(sectionToken(category))
  return idx === -1 ? SECTION_TOKEN_ORDER.length : idx
}

interface LawsTocProps {
  penalCodes: PenalCode[]
  selected: 'preamble' | string | null
  onSelectPreamble: () => void
  onSelectCode: (code: PenalCode) => void
}

/** Table-of-contents sidebar for the "Законы" module's two-pane "document"
 * layout — a classic legal-reference-site nav tree: Разделы (sections)
 * collapse/expand to reveal their statutes, filterable by class and
 * searchable by code/title/section. Mirrors `LawsSearch`'s grouping logic
 * but rendered as a persistent nav rail instead of a swappable list view. */
export function LawsToc({ penalCodes, selected, onSelectPreamble, onSelectCode }: LawsTocProps) {
  const [query, setQuery] = useState('')
  const [cls, setCls] = useState<PenalCode['class'] | 'all'>('all')
  const [openSections, setOpenSections] = useState<Set<string>>(new Set())

  const selectedCategory = useMemo(() => {
    if (!selected || selected === 'preamble') return null
    return penalCodes.find((p) => p.id === selected)?.category ?? null
  }, [selected, penalCodes])

  // Keep the Раздел containing the current selection expanded (e.g. on
  // deep-link mount, or after picking a statute from a different section).
  useEffect(() => {
    if (!selectedCategory) return
    setOpenSections((prev) => (prev.has(selectedCategory) ? prev : new Set(prev).add(selectedCategory)))
  }, [selectedCategory])

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

  const isFiltering = q.length > 0 || cls !== 'all'

  function toggleSection(category: string) {
    setOpenSections((prev) => {
      const next = new Set(prev)
      if (next.has(category)) next.delete(category)
      else next.add(category)
      return next
    })
  }

  return (
    <div className="flex h-full w-[280px] shrink-0 flex-col border-r border-ink/10 bg-ink/[0.02]">
      <div className="p-3">
        <div className="mb-2 flex items-center gap-2 rounded-[7px] border border-transparent bg-bg-chrome-2 px-3 py-2 focus-within:border-[#01a8f9]/60">
          <span className="shrink-0 text-ink/40">
            <SearchIcon />
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Код или название..."
            className="w-full min-w-0 bg-transparent text-[13px] font-medium text-ink placeholder:text-ink/40 focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {CLASS_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setCls(opt.id)}
              className={`rounded-[5px] px-2 py-1 text-[11px] font-medium transition-colors ${
                cls === opt.id ? 'bg-[#48adec] text-black' : 'bg-ink/5 text-ink/50 hover:text-ink/80'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 pb-3">
        <button
          type="button"
          onClick={onSelectPreamble}
          className={`flex items-center gap-2 rounded-[6px] px-2.5 py-2 text-left text-[12.5px] font-medium transition-colors ${
            selected === 'preamble' ? 'bg-[#48adec]/15 text-[#7cc4f2]' : 'text-ink/70 hover:bg-ink/5'
          }`}
        >
          <PenalCodeIcon className="shrink-0" />
          <span className="truncate">Предварительные положения</span>
        </button>

        <div className="my-1.5 h-px bg-ink/10" />

        {sections.length === 0 ? (
          <p className="px-2.5 py-3 text-[12px] text-ink/40">Ничего не найдено</p>
        ) : (
          sections.map(({ category, items }) => {
            const open = isFiltering || openSections.has(category)
            return (
              <div key={category}>
                <button
                  type="button"
                  onClick={() => toggleSection(category)}
                  className="flex w-full items-start justify-between gap-2 rounded-[6px] px-2.5 py-2 text-left hover:bg-ink/5"
                >
                  <span className="text-[12px] font-semibold leading-snug text-ink/60">{category}</span>
                  <span className="flex shrink-0 items-center gap-1.5 pt-0.5 text-ink/30">
                    <span className="text-[10.5px] font-medium">{items.length}</span>
                    <ChevronIcon className={`transition-transform ${open ? 'rotate-180' : ''}`} />
                  </span>
                </button>

                {open && (
                  <div className="flex flex-col gap-0.5 pb-1 pl-2">
                    {items.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => onSelectCode(p)}
                        className={`flex items-center gap-1.5 rounded-[6px] px-2.5 py-1.5 text-left text-[12.5px] transition-colors ${
                          selected === p.id
                            ? 'bg-[#48adec]/15 text-ink'
                            : 'text-ink/60 hover:bg-ink/5 hover:text-ink/90'
                        }`}
                      >
                        <span className="shrink-0 text-ink/40">{p.code}</span>
                        <span className="truncate">{p.title}</span>
                      </button>
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
