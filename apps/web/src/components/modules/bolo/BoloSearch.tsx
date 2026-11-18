import { useState } from 'react'
import type { Bolo } from '../../../types'
import { EmptyState, ListRow, SearchBar, StatusPill } from '../shared/ui'
import { WantedIcon } from '../people/icons'

const STATUS_OPTIONS: { id: Bolo['status'] | 'all'; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'Активен', label: 'Активные' },
  { id: 'Закрыт', label: 'Закрытые' },
]

const PRIORITY_CLASS: Record<Bolo['priority'], string> = {
  Высокий: 'bg-[#e8637a]/20 text-[#ff8ba0]',
  Средний: 'bg-[#e0a63f]/20 text-[#e0a63f]',
  Низкий: 'bg-ink/10 text-ink/50',
}

interface BoloSearchProps {
  bolos: Bolo[]
  onSelect: (bolo: Bolo) => void
}

/** Landing screen of "BOLO" — active/closed filter + priority-colored list,
 * bound to the `CTRL+B` header shortcut. */
export function BoloSearch({ bolos, onSelect }: BoloSearchProps) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<Bolo['status'] | 'all'>('all')

  const q = query.trim().toLowerCase()
  const results = bolos.filter((b) => {
    if (status !== 'all' && b.status !== status) return false
    if (!q) return true
    return b.title.toLowerCase().includes(q) || b.reason.toLowerCase().includes(q) || b.lastKnownLocation.toLowerCase().includes(q)
  })

  return (
    <div className="flex h-full flex-col">
      <SearchBar value={query} onChange={setQuery} onSubmit={() => {}} placeholder="Название, причина или локация..." icon={<WantedIcon />} />
      <div className="flex gap-1.5 px-4 pb-3">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setStatus(opt.id)}
            className={`rounded-[6px] px-3 py-1.5 text-[12px] font-medium transition-colors ${
              status === opt.id ? 'bg-[#48adec] text-black' : 'bg-ink/5 text-ink/50 hover:text-ink/80'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 pb-4">
        {results.length === 0 ? (
          <EmptyState label="Активных BOLO нет" />
        ) : (
          results.map((b) => (
            <ListRow
              key={b.id}
              leading={
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink/10 text-ink/60">
                  <WantedIcon />
                </div>
              }
              title={
                <>
                  <span className="truncate text-[14px] font-medium text-ink">{b.title}</span>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${PRIORITY_CLASS[b.priority]}`}>
                    {b.priority}
                  </span>
                  {b.status === 'Закрыт' && <StatusPill status="Закрыт" positive />}
                </>
              }
              subtitle={`${b.boloType} · ${b.lastKnownLocation}`}
              onClick={() => onSelect(b)}
            />
          ))
        )}
      </div>
    </div>
  )
}
