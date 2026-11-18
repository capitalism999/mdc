import { useEffect, useRef, useState } from 'react'
import type { ModuleContentProps } from '../registry'
import { getPenalCodes } from '../../../lib/endpoints/penalCodes'
import type { PenalCode } from '../../../types'
import { useWindowManager } from '../../../windows/WindowManagerContext'
import { LawsSearch } from './LawsSearch'
import { LawsToc } from './LawsToc'
import { PenalCodeCard } from './PenalCodeCard'
import { PreambleCard } from './PreambleCard'

/** Below this content width there isn't room for a persistent sidebar +
 * reading pane, so the module falls back to the single-pane list ↔ card
 * navigation instead. */
const TWO_PANE_MIN_WIDTH = 680

type Selection = 'preamble' | string | null

function buildBreadcrumb(selection: Selection, codes: PenalCode[]): string[] {
  if (!selection) return ['Законы']
  if (selection === 'preamble') return ['Законы', 'Предварительные положения']
  const code = codes.find((c) => c.id === selection)
  return ['Законы', code ? code.code : selection]
}

/**
 * "Законы" module: the Penal Code reference table. Wide windows get a
 * classic legal-document-site layout — a table-of-contents sidebar
 * (`LawsToc`) next to a reading pane, like a real statute browser. Narrow
 * windows fall back to the original list ↔ detail-card navigation.
 * Deep-links via `initialParams.entityId` (e.g. from a
 * `<EntityChip type="penalCode">` on an arrest record).
 */
export function LawsApp({ windowId, initialParams }: ModuleContentProps) {
  const { updateBreadcrumb } = useWindowManager()
  const [codes, setCodes] = useState<PenalCode[]>([])
  const [selection, setSelection] = useState<Selection>(() => {
    const entityId = initialParams?.entityType === 'penalCode' ? (initialParams.entityId as string) : undefined
    return entityId ?? null
  })

  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isWide, setIsWide] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0
      setIsWide(width >= TWO_PANE_MIN_WIDTH)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    getPenalCodes().then(setCodes)
  }, [])

  // In the two-pane layout there's no "back" step — default to showing the
  // preamble (like a code's title page) until the reader picks a statute.
  const effectiveSelection: Selection = selection ?? (isWide ? 'preamble' : null)

  useEffect(() => {
    updateBreadcrumb(windowId, buildBreadcrumb(effectiveSelection, codes))
  }, [windowId, effectiveSelection, codes, updateBreadcrumb])

  const selectedCode = effectiveSelection && effectiveSelection !== 'preamble' ? codes.find((c) => c.id === effectiveSelection) : undefined

  if (isWide) {
    return (
      <div ref={containerRef} className="flex h-full">
        <LawsToc penalCodes={codes} selected={effectiveSelection} onSelectPreamble={() => setSelection('preamble')} onSelectCode={(c) => setSelection(c.id)} />
        <div className="min-w-0 flex-1 overflow-y-auto">
          {effectiveSelection === 'preamble' ? (
            <PreambleCard />
          ) : selectedCode ? (
            <PenalCodeCard code={selectedCode} />
          ) : (
            <div className="flex h-full items-center justify-center text-[14px] text-ink/40">Статья не найдена</div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="h-full">
      {effectiveSelection === null ? (
        <LawsSearch penalCodes={codes} onSelect={(c) => setSelection(c.id)} onSelectPreamble={() => setSelection('preamble')} />
      ) : effectiveSelection === 'preamble' ? (
        <PreambleCard onBack={() => setSelection(null)} />
      ) : selectedCode ? (
        <PenalCodeCard code={selectedCode} onBack={() => setSelection(null)} />
      ) : (
        <div className="flex h-full items-center justify-center text-[14px] text-ink/40">Статья не найдена</div>
      )}
    </div>
  )
}
