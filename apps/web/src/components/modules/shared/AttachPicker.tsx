import { useState } from 'react'

interface AttachPickerProps<T> {
  items: T[]
  getId: (item: T) => string
  getLabel: (item: T) => string
  getSublabel?: (item: T) => string | undefined
  excludeIds: string[]
  placeholder: string
  onAttach: (item: T) => void
}

/**
 * Inline "+ прикрепить" control: a toggle button that reveals a filterable
 * list of candidate records to attach by id. First used by `ReportEditor`
 * (Рапорты) for composable person/vehicle/weapon/charge attachments; reused
 * almost 1:1 by `CaseBoard` (Дела) for attaching reports/evidence/etc.
 */
export function AttachPicker<T>({ items, getId, getLabel, getSublabel, excludeIds, placeholder, onAttach }: AttachPickerProps<T>) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-[6px] border border-dashed border-ink/15 py-1.5 text-[12px] font-medium text-ink/50 hover:border-ink/30 hover:text-ink/80"
      >
        + Прикрепить
      </button>
    )
  }

  const q = query.trim().toLowerCase()
  const candidates = items.filter((item) => !excludeIds.includes(getId(item)))
  const results = q
    ? candidates.filter((item) => getLabel(item).toLowerCase().includes(q) || getSublabel?.(item)?.toLowerCase().includes(q))
    : candidates

  return (
    <div className="rounded-[6px] bg-black/30 p-2">
      <input
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="mb-1.5 w-full rounded-[4px] bg-ink/5 px-2 py-1 text-[12px] text-ink placeholder:text-ink/30 focus:outline-none"
      />
      <div className="flex max-h-32 flex-col gap-0.5 overflow-y-auto">
        {results.length === 0 ? (
          <span className="px-2 py-1 text-[12px] text-ink/30">Ничего не найдено</span>
        ) : (
          results.map((item) => (
            <button
              key={getId(item)}
              type="button"
              onClick={() => {
                onAttach(item)
                setOpen(false)
                setQuery('')
              }}
              className="flex items-center justify-between gap-2 rounded-[4px] px-2 py-1 text-left text-[12px] text-ink/80 hover:bg-ink/10"
            >
              <span className="truncate">{getLabel(item)}</span>
              {getSublabel?.(item) && <span className="shrink-0 text-ink/40">{getSublabel(item)}</span>}
            </button>
          ))
        )}
      </div>
      <button type="button" onClick={() => setOpen(false)} className="mt-1 text-[11px] text-ink/40 hover:text-ink/70">
        Отмена
      </button>
    </div>
  )
}
