import { useEffect, useState } from 'react'
import type { ModuleContentProps } from '../registry'
import { getVehicles } from '../../../lib/endpoints/vehicles'
import type { Vehicle } from '../../../types'
import { useWindowManager } from '../../../windows/WindowManagerContext'
import { VehicleProfile } from './VehicleProfile'
import { VehicleSearch } from './VehicleSearch'

type View = { kind: 'search' } | { kind: 'profile'; vehicleId: string }

function buildBreadcrumb(view: View, vehicles: Vehicle[]): string[] {
  if (view.kind === 'search') return ['DMV']
  const vehicle = vehicles.find((v) => v.id === view.vehicleId)
  return ['DMV', vehicle ? `${vehicle.make} ${vehicle.model}` : view.vehicleId]
}

/**
 * "DMV" module: single search box over the vehicle registry → read-only
 * vehicle card. Supports deep-linking — opened via `<EntityChip type="vehicle">`
 * from another module, it jumps straight to that vehicle's card
 * (`initialParams.entityId`).
 */
export function DmvApp({ windowId, initialParams }: ModuleContentProps) {
  const { updateBreadcrumb } = useWindowManager()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [view, setView] = useState<View>(() => {
    const entityId = initialParams?.entityType === 'vehicle' ? (initialParams.entityId as string) : undefined
    return entityId ? { kind: 'profile', vehicleId: entityId } : { kind: 'search' }
  })

  useEffect(() => {
    getVehicles().then(setVehicles)
  }, [])

  useEffect(() => {
    updateBreadcrumb(windowId, buildBreadcrumb(view, vehicles))
  }, [windowId, view, vehicles, updateBreadcrumb])

  if (view.kind === 'search') {
    return <VehicleSearch vehicles={vehicles} onSelect={(v) => setView({ kind: 'profile', vehicleId: v.id })} />
  }

  const vehicle = vehicles.find((v) => v.id === view.vehicleId)
  if (!vehicle) {
    return <div className="flex h-full items-center justify-center text-[14px] text-ink/40">ТС не найдено</div>
  }

  return <VehicleProfile vehicle={vehicle} onBack={() => setView({ kind: 'search' })} />
}
