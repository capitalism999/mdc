import { useEffect, useState } from 'react'
import type { ModuleContentProps } from '../registry'
import { getArrests } from '../../../lib/endpoints/arrests'
import { getPenalCodes } from '../../../lib/endpoints/penalCodes'
import { getPeople } from '../../../lib/endpoints/people'
import type { ArrestFile, PenalCode, Person } from '../../../types'
import { useWindowManager } from '../../../windows/WindowManagerContext'
import { ArrestCard } from './ArrestCard'
import { ArrestSearch } from './ArrestSearch'

type View = { kind: 'search' } | { kind: 'card'; arrestId: string }

function buildBreadcrumb(view: View, arrests: ArrestFile[]): string[] {
  if (view.kind === 'search') return ['Аресты']
  const arrest = arrests.find((a) => a.id === view.arrestId)
  return ['Аресты', arrest ? arrest.arrestNumber : view.arrestId]
}

/**
 * "Аресты" module: global arrest journal → detail card with charges,
 * seized items, and related warrant/report/case/BOLO links. Deep-links via
 * `initialParams.entityId` (e.g. from `<EntityChip type="arrest">`).
 */
export function ArrestsApp({ windowId, initialParams }: ModuleContentProps) {
  const { updateBreadcrumb } = useWindowManager()
  const [arrests, setArrests] = useState<ArrestFile[]>([])
  const [people, setPeople] = useState<Person[]>([])
  const [penalCodes, setPenalCodes] = useState<PenalCode[]>([])
  const [view, setView] = useState<View>(() => {
    const entityId = initialParams?.entityType === 'arrest' ? (initialParams.entityId as string) : undefined
    return entityId ? { kind: 'card', arrestId: entityId } : { kind: 'search' }
  })

  useEffect(() => {
    getArrests().then(setArrests)
    getPeople().then(setPeople)
    getPenalCodes().then(setPenalCodes)
  }, [])

  useEffect(() => {
    updateBreadcrumb(windowId, buildBreadcrumb(view, arrests))
  }, [windowId, view, arrests, updateBreadcrumb])

  if (view.kind === 'search') {
    return <ArrestSearch arrests={arrests} people={people} onSelect={(a) => setView({ kind: 'card', arrestId: a.id })} />
  }

  const arrest = arrests.find((a) => a.id === view.arrestId)
  if (!arrest) {
    return <div className="flex h-full items-center justify-center text-[14px] text-ink/40">Арест не найден</div>
  }

  return <ArrestCard arrest={arrest} people={people} penalCodes={penalCodes} onBack={() => setView({ kind: 'search' })} />
}
