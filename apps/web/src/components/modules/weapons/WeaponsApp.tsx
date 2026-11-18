import { useEffect, useState } from 'react'
import type { ModuleContentProps } from '../registry'
import { getWeapons } from '../../../lib/endpoints/weapons'
import type { Weapon } from '../../../types'
import { useWindowManager } from '../../../windows/WindowManagerContext'
import { WeaponProfile } from './WeaponProfile'
import { WeaponSearch } from './WeaponSearch'

type View = { kind: 'search' } | { kind: 'profile'; weaponId: string }

function buildBreadcrumb(view: View, weapons: Weapon[]): string[] {
  if (view.kind === 'search') return ['Оружие']
  const weapon = weapons.find((w) => w.id === view.weaponId)
  return ['Оружие', weapon ? `${weapon.make} ${weapon.model}` : view.weaponId]
}

/**
 * "Оружие" module: single search box over the weapons registry → read-only
 * weapon card. Supports deep-linking via `initialParams.entityId`.
 */
export function WeaponsApp({ windowId, initialParams }: ModuleContentProps) {
  const { updateBreadcrumb } = useWindowManager()
  const [weapons, setWeapons] = useState<Weapon[]>([])
  const [view, setView] = useState<View>(() => {
    const entityId = initialParams?.entityType === 'weapon' ? (initialParams.entityId as string) : undefined
    return entityId ? { kind: 'profile', weaponId: entityId } : { kind: 'search' }
  })

  useEffect(() => {
    getWeapons().then(setWeapons)
  }, [])

  useEffect(() => {
    updateBreadcrumb(windowId, buildBreadcrumb(view, weapons))
  }, [windowId, view, weapons, updateBreadcrumb])

  if (view.kind === 'search') {
    return <WeaponSearch weapons={weapons} onSelect={(w) => setView({ kind: 'profile', weaponId: w.id })} />
  }

  const weapon = weapons.find((w) => w.id === view.weaponId)
  if (!weapon) {
    return <div className="flex h-full items-center justify-center text-[14px] text-ink/40">Оружие не найдено</div>
  }

  return <WeaponProfile weapon={weapon} onBack={() => setView({ kind: 'search' })} />
}
