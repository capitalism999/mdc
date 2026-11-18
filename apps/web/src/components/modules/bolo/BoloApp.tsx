import { useEffect, useState } from 'react'
import type { ModuleContentProps } from '../registry'
import { getBolos } from '../../../lib/endpoints/bolos'
import type { Bolo } from '../../../types'
import { useWindowManager } from '../../../windows/WindowManagerContext'
import { BoloCard } from './BoloCard'
import { BoloSearch } from './BoloSearch'

type View = { kind: 'search' } | { kind: 'card'; boloId: string }

function buildBreadcrumb(view: View, bolos: Bolo[]): string[] {
  if (view.kind === 'search') return ['BOLO']
  const bolo = bolos.find((b) => b.id === view.boloId)
  return ['BOLO', bolo ? bolo.title : view.boloId]
}

/**
 * "BOLO" module: active/closed alert feed, priority color-coded → detail
 * card. Opened via the `CTRL+B` header shortcut or `<EntityChip type="bolo">`.
 */
export function BoloApp({ windowId, initialParams }: ModuleContentProps) {
  const { updateBreadcrumb } = useWindowManager()
  const [bolos, setBolos] = useState<Bolo[]>([])
  const [view, setView] = useState<View>(() => {
    const entityId = initialParams?.entityType === 'bolo' ? (initialParams.entityId as string) : undefined
    return entityId ? { kind: 'card', boloId: entityId } : { kind: 'search' }
  })

  useEffect(() => {
    getBolos().then(setBolos)
  }, [])

  useEffect(() => {
    updateBreadcrumb(windowId, buildBreadcrumb(view, bolos))
  }, [windowId, view, bolos, updateBreadcrumb])

  if (view.kind === 'search') {
    return <BoloSearch bolos={bolos} onSelect={(b) => setView({ kind: 'card', boloId: b.id })} />
  }

  const bolo = bolos.find((b) => b.id === view.boloId)
  if (!bolo) {
    return <div className="flex h-full items-center justify-center text-[14px] text-ink/40">BOLO не найден</div>
  }

  return <BoloCard bolo={bolo} onBack={() => setView({ kind: 'search' })} />
}
