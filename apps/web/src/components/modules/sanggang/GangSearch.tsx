import { useState } from 'react'
import type { Gang } from '../../../types'
import { EmptyState, ListRow, SearchBar } from '../shared/ui'
import { GangIcon } from '../shared/entityIcons'

const THREAT_CLASS: Record<Gang['threatLevel'], string> = {
  Критический: 'bg-[#e8637a]/20 text-[#ff8ba0]',
  Высокий: 'bg-[#e8637a]/20 text-[#ff8ba0]',
  Средний: 'bg-[#e0a63f]/20 text-[#e0a63f]',
  Низкий: 'bg-ink/10 text-ink/50',
}

interface GangSearchProps {
  gangs: Gang[]
  onSelect: (g: Gang) => void
}

export function GangSearch({ gangs, onSelect }: GangSearchProps) {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const results = gangs.filter((g) => !q || g.name.toLowerCase().includes(q) || g.aliases.some((a) => a.toLowerCase().includes(q)))

  return (
    <div className="flex h-full flex-col">
      <SearchBar value={query} onChange={setQuery} onSubmit={() => {}} placeholder="Название или псевдоним банды..." icon={<GangIcon />} />
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 pb-4">
        {results.length === 0 ? (
          <EmptyState label="Банды не найдены" />
        ) : (
          results.map((g) => (
            <ListRow
              key={g.id}
              leading={
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink/10 text-ink/60">
                  <GangIcon />
                </div>
              }
              title={
                <>
                  <span className="truncate text-[14px] font-medium text-ink">{g.name}</span>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${THREAT_CLASS[g.threatLevel]}`}>{g.threatLevel}</span>
                </>
              }
              subtitle={g.territoryDescription}
              onClick={() => onSelect(g)}
            />
          ))
        )}
      </div>
    </div>
  )
}
