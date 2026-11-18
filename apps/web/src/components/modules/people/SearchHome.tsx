import { useState } from 'react'
import type { Person } from '../../../types'
import { getAvatarColor, getInitials } from '../shared/avatar'
import { ClockIcon, SearchIcon, WantedIcon } from './icons'
import { SEARCH_CATEGORIES, type SearchCategoryId } from './searchCategories'

export type SearchFilters = Partial<Record<SearchCategoryId, string>>
export type ResidencyFilter = 'resident' | 'migrant'
export type SearchHomeTab = 'search' | 'recent'

const RESIDENCY_OPTIONS: { id: ResidencyFilter; label: string }[] = [
  { id: 'resident', label: 'Резиденты' },
  { id: 'migrant', label: 'Мигранты' },
]

export const RESIDENCY_LABEL: Record<ResidencyFilter, string> = {
  resident: 'Резидент',
  migrant: 'Мигрант',
}

interface SearchHomeProps {
  tab: SearchHomeTab
  onTabChange: (tab: SearchHomeTab) => void
  onSearch: (filters: SearchFilters, residency: ResidencyFilter) => void
  recent: Person[]
  onSelectRecent: (person: Person) => void
}

/**
 * Landing page of the "Люди" module. Two tabs: "Поиск" (every lookup field
 * shown at once, no tab-switching between categories — officers fill in as
 * many fields as they know, plus a Все/Резиденты/Мигранты filter) and
 * "Недавние" (profiles opened earlier in this session, for quick re-entry).
 */
export function SearchHome({ tab, onTabChange, onSearch, recent, onSelectRecent }: SearchHomeProps) {
  const [values, setValues] = useState<SearchFilters>({})
  const [residency, setResidency] = useState<ResidencyFilter>('resident')

  function setValue(id: SearchCategoryId, value: string) {
    setValues((prev) => ({ ...prev, [id]: value }))
  }

  function submit() {
    const filters: SearchFilters = {}
    for (const [id, value] of Object.entries(values)) {
      if (value?.trim()) filters[id as SearchCategoryId] = value.trim()
    }
    onSearch(filters, residency)
  }

  return (
    <div className="flex h-full flex-col items-center p-8">
      <div className="w-full max-w-[680px]">
        <div className="mb-4 flex flex-col items-center gap-2">
          <img src="/assets/images/sa-state-seal.png" alt="" className="h-24 w-24" />
          <h2 className="text-[20px] font-semibold text-ink">Поиск личности</h2>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onTabChange('search')}
            className={`flex items-center gap-1.5 rounded-[8px] px-3.5 py-2 text-[13px] font-medium transition-colors ${
              tab === 'search' ? 'bg-[#48adec]/15 text-[#48adec]' : 'bg-ink/5 text-ink/60 hover:bg-ink/10'
            }`}
          >
            <SearchIcon />
            Поиск
          </button>
          <button
            type="button"
            onClick={() => onTabChange('recent')}
            className={`flex items-center gap-1.5 rounded-[8px] px-3.5 py-2 text-[13px] font-medium transition-colors ${
              tab === 'recent' ? 'bg-[#48adec]/15 text-[#48adec]' : 'bg-ink/5 text-ink/60 hover:bg-ink/10'
            }`}
          >
            <ClockIcon />
            Недавние
            {recent.length > 0 && <span className="text-ink/40">{recent.length}</span>}
          </button>
        </div>

        {tab === 'search' ? (
          <>
            <div className="mb-4 flex gap-1.5 rounded-[8px] bg-ink/5 p-1">
              {RESIDENCY_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setResidency(opt.id)}
                  className={`flex-1 rounded-[6px] py-1.5 text-[12px] font-medium transition-colors ${
                    residency === opt.id ? 'bg-[#48adec] text-black' : 'text-ink/50 hover:text-ink/80'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="mb-4 grid grid-cols-2 gap-3">
              {SEARCH_CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center gap-2 rounded-[8px] border border-transparent bg-bg-chrome-2 px-4 py-3 focus-within:border-[#01a8f9]/60"
                >
                  <span className="shrink-0 text-ink/40">{cat.icon}</span>
                  <input
                    value={values[cat.id] ?? ''}
                    onChange={(e) => setValue(cat.id, e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && submit()}
                    placeholder={cat.label}
                    className="w-full min-w-0 bg-transparent text-[14px] font-medium tracking-[-0.2px] text-ink placeholder:text-ink/40 focus:outline-none"
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={submit}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-[8px] bg-[#48adec] text-[14px] font-semibold text-black hover:bg-[#62b9ef]"
            >
              <SearchIcon />
              Искать
            </button>
          </>
        ) : recent.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-[14px] text-ink/40">
            Недавно открытых профилей нет
          </div>
        ) : (
          <div className="flex flex-col gap-2 overflow-y-auto">
            {recent.map((person) => (
              <button
                key={person.id}
                type="button"
                onClick={() => onSelectRecent(person)}
                className="flex items-center gap-3 rounded-[8px] bg-ink/5 px-4 py-3 text-left hover:bg-ink/10"
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold text-ink"
                  style={{ backgroundColor: getAvatarColor(person.id) }}
                >
                  {getInitials(person.firstName, person.lastName)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-[14px] font-medium text-ink">
                      {person.firstName} {person.lastName}
                    </span>
                    {person.wanted && (
                      <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#e8637a]/20 px-2 py-0.5 text-[11px] font-semibold text-[#ff8ba0]">
                        <WantedIcon /> В розыске
                      </span>
                    )}
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        person.residency === 'migrant' ? 'bg-[#48adec]/15 text-[#48adec]' : 'bg-ink/10 text-ink/50'
                      }`}
                    >
                      {RESIDENCY_LABEL[person.residency]}
                    </span>
                  </div>
                  <p className="truncate text-[12px] text-ink/40">
                    Д.р. {person.dob} · ID {person.idNumber}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
