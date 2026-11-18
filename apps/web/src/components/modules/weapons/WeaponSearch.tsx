import { useState } from 'react'
import type { Weapon } from '../../../types'
import { EmptyState, ListRow, SearchBar, StatusPill } from '../shared/ui'
import { WeaponIcon } from '../people/icons'

interface WeaponSearchProps {
  weapons: Weapon[]
  onSelect: (weapon: Weapon) => void
}

/** Landing screen of the "Оружие" module — single-field lookup over the
 * weapons registry by serial number or registered owner. */
export function WeaponSearch({ weapons, onSelect }: WeaponSearchProps) {
  const [query, setQuery] = useState('')

  const q = query.trim().toLowerCase()
  const results = q
    ? weapons.filter(
        (w) =>
          w.serialNumber.toLowerCase().includes(q) ||
          w.registeredOwnerName.toLowerCase().includes(q) ||
          `${w.make} ${w.model}`.toLowerCase().includes(q),
      )
    : weapons

  return (
    <div className="flex h-full flex-col">
      <SearchBar value={query} onChange={setQuery} onSubmit={() => {}} placeholder="Серийный номер или владелец..." icon={<WeaponIcon />} />
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 pb-4">
        {results.length === 0 ? (
          <EmptyState label="Ничего не найдено" />
        ) : (
          results.map((w) => (
            <ListRow
              key={w.id}
              leading={
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink/10 text-ink/60">
                  <WeaponIcon />
                </div>
              }
              title={
                <>
                  <span className="truncate text-[14px] font-medium text-ink">
                    {w.make} {w.model}
                  </span>
                  {w.stolenFlag && <StatusPill status="В угоне" positive={false} />}
                  {w.seizedFlag && <StatusPill status="Изъято" positive={false} />}
                </>
              }
              subtitle={`${w.serialNumber} · ${w.registeredOwnerName}`}
              onClick={() => onSelect(w)}
            />
          ))
        )}
      </div>
    </div>
  )
}
