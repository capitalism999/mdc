import { useState } from 'react'
import type { ArrestFile, Person } from '../../../types'
import { EmptyState, ListRow, SearchBar, StatusPill } from '../shared/ui'
import { ArrestIcon } from '../people/icons'

interface ArrestSearchProps {
  arrests: ArrestFile[]
  people: Person[]
  onSelect: (arrest: ArrestFile) => void
}

function personName(people: Person[], personId: string) {
  const person = people.find((p) => p.id === personId)
  return person ? `${person.firstName} ${person.lastName}` : personId
}

/** Landing screen of "Аресты" — global journal, search by arrestee or
 * arresting officer. */
export function ArrestSearch({ arrests, people, onSelect }: ArrestSearchProps) {
  const [query, setQuery] = useState('')

  const q = query.trim().toLowerCase()
  const results = arrests.filter((a) => {
    if (!q) return true
    const arrestee = personName(people, a.arresteeId).toLowerCase()
    return a.arrestNumber.toLowerCase().includes(q) || arrestee.includes(q) || a.arrestingOfficer.toLowerCase().includes(q)
  })

  return (
    <div className="flex h-full flex-col">
      <SearchBar value={query} onChange={setQuery} onSubmit={() => {}} placeholder="Номер ареста, задержанный или офицер..." icon={<ArrestIcon />} />
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 pb-4">
        {results.length === 0 ? (
          <EmptyState label="Ничего не найдено" />
        ) : (
          results.map((a) => (
            <ListRow
              key={a.id}
              leading={
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink/10 text-ink/60">
                  <ArrestIcon />
                </div>
              }
              title={
                <>
                  <span className="truncate text-[14px] font-medium text-ink">{a.arrestNumber}</span>
                  <StatusPill status={a.status} positive={a.status === 'Закрыто'} />
                </>
              }
              subtitle={`${personName(people, a.arresteeId)} · ${a.arrestingOfficer}`}
              onClick={() => onSelect(a)}
            />
          ))
        )}
      </div>
    </div>
  )
}
