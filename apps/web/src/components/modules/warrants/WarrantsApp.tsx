import { useEffect, useState } from 'react'
import type { ModuleContentProps } from '../registry'
import { getPenalCodes } from '../../../lib/endpoints/penalCodes'
import { getPeople } from '../../../lib/endpoints/people'
import { getWarrants } from '../../../lib/endpoints/warrants'
import type { PenalCode, Person, WarrantFile } from '../../../types'
import { useWindowManager } from '../../../windows/WindowManagerContext'
import { WarrantCard } from './WarrantCard'
import { WarrantSearch } from './WarrantSearch'

type View = { kind: 'search' } | { kind: 'card'; warrantId: string }

function buildBreadcrumb(view: View, warrants: WarrantFile[]): string[] {
  if (view.kind === 'search') return ['Ордера']
  const warrant = warrants.find((w) => w.id === view.warrantId)
  return ['Ордера', warrant ? warrant.warrantNumber : view.warrantId]
}

/**
 * "Ордера" module: status-filterable registry of warrant files → detail
 * card with subject/charges/related-record links. Deep-links via
 * `initialParams.entityId` (e.g. from `<EntityChip type="warrant">`).
 */
export function WarrantsApp({ windowId, initialParams }: ModuleContentProps) {
  const { updateBreadcrumb } = useWindowManager()
  const [warrants, setWarrants] = useState<WarrantFile[]>([])
  const [people, setPeople] = useState<Person[]>([])
  const [penalCodes, setPenalCodes] = useState<PenalCode[]>([])
  const [view, setView] = useState<View>(() => {
    const entityId = initialParams?.entityType === 'warrant' ? (initialParams.entityId as string) : undefined
    return entityId ? { kind: 'card', warrantId: entityId } : { kind: 'search' }
  })

  useEffect(() => {
    getWarrants().then(setWarrants)
    getPeople().then(setPeople)
    getPenalCodes().then(setPenalCodes)
  }, [])

  useEffect(() => {
    updateBreadcrumb(windowId, buildBreadcrumb(view, warrants))
  }, [windowId, view, warrants, updateBreadcrumb])

  if (view.kind === 'search') {
    return <WarrantSearch warrants={warrants} people={people} onSelect={(w) => setView({ kind: 'card', warrantId: w.id })} />
  }

  const warrant = warrants.find((w) => w.id === view.warrantId)
  if (!warrant) {
    return <div className="flex h-full items-center justify-center text-[14px] text-ink/40">Ордер не найден</div>
  }

  return <WarrantCard warrant={warrant} people={people} penalCodes={penalCodes} onBack={() => setView({ kind: 'search' })} />
}
