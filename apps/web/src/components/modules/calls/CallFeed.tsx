import { useState } from 'react'
import type { DispatchCall } from '../../../types'
import { EmptyState, ListRow, SearchBar, StatusPill } from '../shared/ui'
import { DispatchIcon } from '../shared/entityIcons'

const STATUS_OPTIONS: { id: DispatchCall['status'] | 'all'; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'В ожидании', label: 'В ожидании' },
  { id: 'Направлен', label: 'Направлены' },
  { id: 'Завершён', label: 'Завершённые' },
]

const PRIORITY_CLASS: Record<DispatchCall['priority'], string> = {
  Высокий: 'bg-[#e8637a]/20 text-[#ff8ba0]',
  Средний: 'bg-[#e0a63f]/20 text-[#e0a63f]',
  Низкий: 'bg-ink/10 text-ink/50',
}

interface CallFeedProps {
  calls: DispatchCall[]
  onSelect: (call: DispatchCall) => void
}

/** Landing screen of "Вызовы" (CAD) — live feed, status filter + priority
 * color coding. */
export function CallFeed({ calls, onSelect }: CallFeedProps) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<DispatchCall['status'] | 'all'>('all')

  const q = query.trim().toLowerCase()
  const results = calls.filter((c) => {
    if (status !== 'all' && c.status !== status) return false
    if (!q) return true
    return c.callNumber.toLowerCase().includes(q) || c.natureCode.toLowerCase().includes(q) || c.locationStreet.toLowerCase().includes(q)
  })

  return (
    <div className="flex h-full flex-col">
      <SearchBar value={query} onChange={setQuery} onSubmit={() => {}} placeholder="Номер вызова, характер или адрес..." icon={<DispatchIcon />} />
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
          <EmptyState label="Вызовов нет" />
        ) : (
          results.map((c) => (
            <ListRow
              key={c.id}
              leading={
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink/10 text-ink/60">
                  <DispatchIcon />
                </div>
              }
              title={
                <>
                  <span className="truncate text-[14px] font-medium text-ink">{c.callNumber}</span>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${PRIORITY_CLASS[c.priority]}`}>
                    {c.priority}
                  </span>
                  <StatusPill status={c.status} positive={c.status === 'Завершён'} />
                </>
              }
              subtitle={`${c.natureCode} · ${c.locationStreet}`}
              onClick={() => onSelect(c)}
            />
          ))
        )}
      </div>
    </div>
  )
}
