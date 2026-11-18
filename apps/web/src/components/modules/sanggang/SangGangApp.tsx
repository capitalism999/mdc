import { useEffect, useState } from 'react'
import type { ModuleContentProps } from '../registry'
import { getGangs } from '../../../lib/endpoints/gangs'
import { getPeople } from '../../../lib/endpoints/people'
import type { Gang, Person } from '../../../types'
import { useWindowManager } from '../../../windows/WindowManagerContext'
import { GangCard } from './GangCard'
import { GangSearch } from './GangSearch'

type View = { kind: 'search' } | { kind: 'card'; gangId: string }

function buildBreadcrumb(view: View, gangs: Gang[]): string[] {
  if (view.kind === 'search') return ['SangGang']
  const gang = gangs.find((g) => g.id === view.gangId)
  return ['SangGang', gang ? gang.name : view.gangId]
}

/** "SangGang" module: gang registry → card with members/rivalries/intel. */
export function SangGangApp({ windowId, initialParams }: ModuleContentProps) {
  const { updateBreadcrumb } = useWindowManager()
  const [gangs, setGangs] = useState<Gang[]>([])
  const [people, setPeople] = useState<Person[]>([])
  const [view, setView] = useState<View>(() => {
    const entityId = initialParams?.entityType === 'gang' ? (initialParams.entityId as string) : undefined
    return entityId ? { kind: 'card', gangId: entityId } : { kind: 'search' }
  })

  useEffect(() => {
    getGangs().then(setGangs)
    getPeople().then(setPeople)
  }, [])

  useEffect(() => {
    updateBreadcrumb(windowId, buildBreadcrumb(view, gangs))
  }, [windowId, view, gangs, updateBreadcrumb])

  if (view.kind === 'search') {
    return <GangSearch gangs={gangs} onSelect={(g) => setView({ kind: 'card', gangId: g.id })} />
  }

  const gang = gangs.find((g) => g.id === view.gangId)
  if (!gang) {
    return <div className="flex h-full items-center justify-center text-[14px] text-ink/40">Банда не найдена</div>
  }

  return <GangCard gang={gang} gangs={gangs} people={people} onBack={() => setView({ kind: 'search' })} />
}
