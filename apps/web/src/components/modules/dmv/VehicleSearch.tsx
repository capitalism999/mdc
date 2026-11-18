import { useState } from 'react'
import type { Vehicle } from '../../../types'
import { EmptyState, ListRow, SearchBar, StatusPill } from '../shared/ui'
import { VehicleIcon } from '../people/icons'

interface VehicleSearchProps {
  vehicles: Vehicle[]
  onSelect: (vehicle: Vehicle) => void
}

/**
 * Landing screen of the "DMV" module — a single-field lookup (plate/VIN/
 * owner name all match) over the full vehicle registry, unlike "Люди"'s
 * multi-field form, since a plate/VIN is usually known up front.
 */
export function VehicleSearch({ vehicles, onSelect }: VehicleSearchProps) {
  const [query, setQuery] = useState('')

  const q = query.trim().toLowerCase()
  const results = q
    ? vehicles.filter(
        (v) =>
          v.plate.toLowerCase().includes(q) ||
          v.vin.toLowerCase().includes(q) ||
          v.ownerName.toLowerCase().includes(q) ||
          `${v.make} ${v.model}`.toLowerCase().includes(q),
      )
    : vehicles

  return (
    <div className="flex h-full flex-col">
      <SearchBar
        value={query}
        onChange={setQuery}
        onSubmit={() => {}}
        placeholder="Гос. номер, VIN или владелец..."
        icon={<VehicleIcon />}
      />
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 pb-4">
        {results.length === 0 ? (
          <EmptyState label="Ничего не найдено" />
        ) : (
          results.map((v) => (
            <ListRow
              key={v.id}
              leading={
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink/10 text-ink/60">
                  <VehicleIcon />
                </div>
              }
              title={
                <>
                  <span className="truncate text-[14px] font-medium text-ink">
                    {v.make} {v.model}
                  </span>
                  {v.stolenFlag && <StatusPill status="В угоне" positive={false} />}
                  {v.impoundFlag && <StatusPill status="На штрафстоянке" positive={false} />}
                </>
              }
              subtitle={`${v.plate} · ${v.ownerName}`}
              onClick={() => onSelect(v)}
            />
          ))
        )}
      </div>
    </div>
  )
}
