import { useState } from 'react'
import type { Evidence } from '../../../types'
import { EmptyState, ListRow, SearchBar, StatusPill } from '../shared/ui'
import { EvidenceIcon } from '../shared/entityIcons'

interface EvidenceSearchProps {
  evidence: Evidence[]
  onSelect: (item: Evidence) => void
}

export function EvidenceSearch({ evidence, onSelect }: EvidenceSearchProps) {
  const [query, setQuery] = useState('')

  const q = query.trim().toLowerCase()
  const results = evidence.filter((e) => {
    if (!q) return true
    return e.evidenceNumber.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || e.evidenceType.toLowerCase().includes(q)
  })

  return (
    <div className="flex h-full flex-col">
      <SearchBar value={query} onChange={setQuery} onSubmit={() => {}} placeholder="Номер, описание или тип..." icon={<EvidenceIcon />} />
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 pb-4">
        {results.length === 0 ? (
          <EmptyState label="Вещдоков нет" />
        ) : (
          results.map((e) => (
            <ListRow
              key={e.id}
              leading={
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink/10 text-ink/60">
                  <EvidenceIcon />
                </div>
              }
              title={
                <>
                  <span className="truncate text-[14px] font-medium text-ink">{e.evidenceNumber}</span>
                  <StatusPill status={e.status} positive={e.status === 'Возвращено'} />
                </>
              }
              subtitle={`${e.evidenceType} · ${e.description}`}
              onClick={() => onSelect(e)}
            />
          ))
        )}
      </div>
    </div>
  )
}
