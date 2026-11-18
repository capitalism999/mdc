import { useState } from 'react'
import type { CaseFile } from '../../../types'
import { EmptyState, ListRow, SearchBar, StatusPill } from '../shared/ui'
import { CaseIcon } from '../shared/entityIcons'

const STATUS_OPTIONS: { id: CaseFile['status'] | 'all'; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'Открыто', label: 'Открытые' },
  { id: 'Активно', label: 'Активные' },
  { id: 'Закрыто', label: 'Закрытые' },
]

interface CaseSearchProps {
  cases: CaseFile[]
  onSelect: (c: CaseFile) => void
}

export function CaseSearch({ cases, onSelect }: CaseSearchProps) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<CaseFile['status'] | 'all'>('all')

  const q = query.trim().toLowerCase()
  const results = cases.filter((c) => {
    if (status !== 'all' && c.status !== status) return false
    if (!q) return true
    return c.caseNumber.toLowerCase().includes(q) || c.title.toLowerCase().includes(q) || c.caseType.toLowerCase().includes(q)
  })

  return (
    <div className="flex h-full flex-col">
      <SearchBar value={query} onChange={setQuery} onSubmit={() => {}} placeholder="Номер, название или тип дела..." icon={<CaseIcon />} />
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
          <EmptyState label="Дел нет" />
        ) : (
          results.map((c) => (
            <ListRow
              key={c.id}
              leading={
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink/10 text-ink/60">
                  <CaseIcon />
                </div>
              }
              title={
                <>
                  <span className="truncate text-[14px] font-medium text-ink">{c.caseNumber}</span>
                  <StatusPill status={c.status} positive={c.status === 'Закрыто'} />
                </>
              }
              subtitle={`${c.title} · ${c.caseType}`}
              onClick={() => onSelect(c)}
            />
          ))
        )}
      </div>
    </div>
  )
}
