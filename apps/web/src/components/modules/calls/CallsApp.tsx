import { useEffect, useState } from 'react'
import type { ModuleContentProps } from '../registry'
import { getDispatchCalls } from '../../../lib/endpoints/dispatchCalls'
import { getPeople } from '../../../lib/endpoints/people'
import { getVehicles } from '../../../lib/endpoints/vehicles'
import type { DispatchCall, Person, Vehicle } from '../../../types'
import { useWindowManager } from '../../../windows/WindowManagerContext'
import { CallCard } from './CallCard'
import { CallFeed } from './CallFeed'

type View = { kind: 'feed' } | { kind: 'card'; callId: string }

function buildBreadcrumb(view: View, calls: DispatchCall[]): string[] {
  if (view.kind === 'feed') return ['Вызовы']
  const call = calls.find((c) => c.id === view.callId)
  return ['Вызовы', call ? call.callNumber : view.callId]
}

/**
 * "Вызовы" (CAD) module: live dispatch feed → call card. Deep-links via
 * `initialParams.entityId` (e.g. from `<EntityChip type="dispatchCall">`).
 */
export function CallsApp({ windowId, initialParams }: ModuleContentProps) {
  const { updateBreadcrumb } = useWindowManager()
  const [calls, setCalls] = useState<DispatchCall[]>([])
  const [people, setPeople] = useState<Person[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [view, setView] = useState<View>(() => {
    const entityId = initialParams?.entityType === 'dispatchCall' ? (initialParams.entityId as string) : undefined
    return entityId ? { kind: 'card', callId: entityId } : { kind: 'feed' }
  })

  useEffect(() => {
    getDispatchCalls().then(setCalls)
    getPeople().then(setPeople)
    getVehicles().then(setVehicles)
  }, [])

  useEffect(() => {
    updateBreadcrumb(windowId, buildBreadcrumb(view, calls))
  }, [windowId, view, calls, updateBreadcrumb])

  if (view.kind === 'feed') {
    return <CallFeed calls={calls} onSelect={(c) => setView({ kind: 'card', callId: c.id })} />
  }

  const call = calls.find((c) => c.id === view.callId)
  if (!call) {
    return <div className="flex h-full items-center justify-center text-[14px] text-ink/40">Вызов не найден</div>
  }

  return <CallCard call={call} people={people} vehicles={vehicles} onBack={() => setView({ kind: 'feed' })} />
}
