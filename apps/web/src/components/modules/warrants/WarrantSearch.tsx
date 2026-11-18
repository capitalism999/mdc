import { useState } from 'react'
import type { Person, WarrantFile } from '../../../types'
import { EmptyState, ListRow, SearchBar, StatusPill } from '../shared/ui'
import { WarrantIcon } from '../people/icons'

const STATUS_OPTIONS: { id: WarrantFile['status'] | 'all'; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'Активен', label: 'Активные' },
  { id: 'Исполнен', label: 'Исполненные' },
  { id: 'Истёк', label: 'Истёкшие' },
]

interface WarrantSearchProps {
  warrants: WarrantFile[]
  people: Person[]
  onSelect: (warrant: WarrantFile) => void
}

function personName(people: Person[], personId: string) {
  const person = people.find((p) => p.id === personId)
  return person ? `${person.firstName} ${person.lastName}` : personId
}

/** Landing screen of "Ордера" — status filter chips + search over warrant
 * number / subject / reason. */
export function WarrantSearch({ warrants, people, onSelect }: WarrantSearchProps) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<WarrantFile['status'] | 'all'>('all')

  const q = query.trim().toLowerCase()
  const results = warrants.filter((w) => {
    if (status !== 'all' && w.status !== status) return false
    if (!q) return true
    const subject = personName(people, w.subjectPersonId).toLowerCase()
    return w.warrantNumber.toLowerCase().includes(q) || w.reason.toLowerCase().includes(q) || subject.includes(q)
  })

  return (
    <div className="flex h-full flex-col">
      <SearchBar value={query} onChange={setQuery} onSubmit={() => {}} placeholder="Номер ордера, субъект или причина..." icon={<WarrantIcon />} />
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
          <EmptyState label="Ничего не найдено" />
        ) : (
          results.map((w) => (
            <ListRow
              key={w.id}
              leading={
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink/10 text-ink/60">
                  <WarrantIcon />
                </div>
              }
              title={
                <>
                  <span className="truncate text-[14px] font-medium text-ink">{w.warrantNumber}</span>
                  <StatusPill status={w.status} positive={w.status !== 'Активен'} />
                </>
              }
              subtitle={`${personName(people, w.subjectPersonId)} · ${w.reason}`}
              onClick={() => onSelect(w)}
            />
          ))
        )}
      </div>
    </div>
  )
}
