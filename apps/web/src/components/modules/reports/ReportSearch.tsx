import { useState } from 'react'
import type { Report } from '../../../types'
import { EmptyState, ListRow, SearchBar, StatusPill } from '../shared/ui'
import { ReportIcon } from '../shared/entityIcons'

const STATUS_OPTIONS: { id: Report['status'] | 'all'; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'Черновик', label: 'Черновики' },
  { id: 'Отправлен', label: 'Отправленные' },
  { id: 'Утверждён', label: 'Утверждённые' },
]

interface ReportSearchProps {
  reports: Report[]
  onSelect: (report: Report) => void
}

export function ReportSearch({ reports, onSelect }: ReportSearchProps) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<Report['status'] | 'all'>('all')

  const q = query.trim().toLowerCase()
  const results = reports.filter((r) => {
    if (status !== 'all' && r.status !== status) return false
    if (!q) return true
    return r.reportNumber.toLowerCase().includes(q) || r.title.toLowerCase().includes(q) || r.authorName.toLowerCase().includes(q)
  })

  return (
    <div className="flex h-full flex-col">
      <SearchBar value={query} onChange={setQuery} onSubmit={() => {}} placeholder="Номер, заголовок или автор..." icon={<ReportIcon />} />
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
          <EmptyState label="Рапортов нет" />
        ) : (
          results.map((r) => (
            <ListRow
              key={r.id}
              leading={
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink/10 text-ink/60">
                  <ReportIcon />
                </div>
              }
              title={
                <>
                  <span className="truncate text-[14px] font-medium text-ink">{r.reportNumber}</span>
                  <StatusPill status={r.status} positive={r.status === 'Утверждён'} />
                </>
              }
              subtitle={`${r.title} · ${r.authorName}`}
              onClick={() => onSelect(r)}
            />
          ))
        )}
      </div>
    </div>
  )
}
