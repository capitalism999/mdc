import { useMemo, useState } from 'react'
import type { Person } from '../../../types'
import { getAvatarColor, getInitials } from '../shared/avatar'
import { ChevronIcon, WantedIcon } from './icons'
import { RESIDENCY_LABEL, type ResidencyFilter, type SearchFilters } from './SearchHome'
import { SEARCH_CATEGORIES } from './searchCategories'

interface SearchResultsProps {
  filters: SearchFilters
  residency: ResidencyFilter
  results: Person[]
  onSelect: (person: Person) => void
}

type SortKey = 'name' | 'dob' | 'address' | 'phone'
type SortDir = 'asc' | 'desc'

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'name', label: 'Имя Фамилия' },
  { key: 'dob', label: 'Дата рожд.' },
  { key: 'address', label: 'Адрес' },
  { key: 'phone', label: 'Телефон' },
]

/** `dob` is stored as "DD.MM.YYYY" — convert to a comparable timestamp. */
function parseDob(dob: string): number {
  const [d, m, y] = dob.split('.').map(Number)
  return new Date(y ?? 0, (m ?? 1) - 1, d ?? 1).getTime()
}

const GRID_COLS = 'grid-cols-[minmax(0,1.6fr)_110px_minmax(0,1.3fr)_120px]'

export function SearchResults({ filters, residency, results, onSelect }: SearchResultsProps) {
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  const parts = SEARCH_CATEGORIES.filter((c) => filters[c.id]?.trim()).map((c) => `${c.label}: «${filters[c.id]}»`)
  parts.push(RESIDENCY_LABEL[residency])
  const summary = parts.join(', ')

  function toggleSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sorted = useMemo(() => {
    const dir = sortDir === 'asc' ? 1 : -1
    return [...results].sort((a, b) => {
      switch (sortKey) {
        case 'name':
          return dir * `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`, 'ru')
        case 'dob':
          return dir * (parseDob(a.dob) - parseDob(b.dob))
        case 'address':
          return dir * a.address.localeCompare(b.address, 'ru')
        case 'phone':
          return dir * a.phone.localeCompare(b.phone, undefined, { numeric: true })
      }
    })
  }, [results, sortKey, sortDir])

  return (
    <div className="flex h-full flex-col p-4">
      <div className="mb-4 min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="text-[16px] font-semibold text-ink">Результаты поиска</h2>
          <span className="shrink-0 rounded-full bg-[#48adec]/15 px-2 py-0.5 text-[11px] font-semibold text-[#48adec]">{results.length}</span>
        </div>
        <p className="truncate text-[12px] text-ink/40">{summary}</p>
      </div>

      {results.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-[14px] text-ink/40">Ничего не найдено</div>
      ) : (
        <div className="flex flex-col overflow-y-auto rounded-[8px] border border-ink/10">
          <div className={`grid ${GRID_COLS} divide-x divide-ink/10 border-b border-ink/10 bg-ink/[0.03] text-[11px] font-semibold uppercase tracking-wide text-ink/40`}>
            {COLUMNS.map((col) => (
              <button
                key={col.key}
                type="button"
                onClick={() => toggleSort(col.key)}
                className={`flex items-center gap-1 whitespace-nowrap px-3 py-2 text-left uppercase tracking-wide hover:text-ink/70 ${
                  sortKey === col.key ? 'text-ink/70' : ''
                }`}
              >
                {col.label}
                {sortKey === col.key && <ChevronIcon className={sortDir === 'asc' ? 'rotate-180' : ''} />}
              </button>
            ))}
          </div>
          {sorted.map((person) => (
            <button
              key={person.id}
              type="button"
              onClick={() => onSelect(person)}
              className={`grid ${GRID_COLS} divide-x divide-ink/5 border-b border-ink/5 text-left last:border-b-0 hover:bg-ink/5`}
            >
              <div className="flex min-w-0 items-center gap-3 px-3 py-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold text-ink"
                  style={{ backgroundColor: getAvatarColor(person.id) }}
                >
                  {getInitials(person.firstName, person.lastName)}
                </div>
                <div className="flex min-w-0 items-center gap-1.5">
                  <span className="truncate text-[13.5px] font-medium text-ink">
                    {person.firstName} {person.lastName}
                  </span>
                  {person.wanted && (
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#e8637a]/20 px-1.5 py-0.5 text-[10px] font-semibold text-[#ff8ba0]">
                      <WantedIcon /> В розыске
                    </span>
                  )}
                </div>
              </div>
              <span className="flex items-center whitespace-nowrap px-3 py-3 text-[13px] text-ink/60">{person.dob}</span>
              <span className="flex items-center truncate px-3 py-3 text-[13px] text-ink/60">{person.address}</span>
              <span className="flex items-center truncate px-3 py-3 text-[13px] text-ink/60">{person.phone}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
