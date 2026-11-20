import { apps } from '../data/apps'
import { useWindowManager } from './WindowManagerContext'

/**
 * Every cross-linkable entity type in the system (see "Единый паттерн
 * перекрёстных ссылок" in the module research doc). Each maps to the one
 * module whose window hosts that entity's detail card.
 */
export type EntityType =
  | 'person'
  | 'vehicle'
  | 'weapon'
  | 'case'
  | 'report'
  | 'warrant'
  | 'bolo'
  | 'arrest'
  | 'evidence'
  | 'forensicAnalysis'
  | 'officer'
  | 'gang'
  | 'penalCode'
  | 'dispatchCall'

const ENTITY_TO_APP: Record<EntityType, string> = {
  person: 'search',
  vehicle: 'search',
  weapon: 'search',
  case: 'cases',
  report: 'reports',
  warrant: 'warrants',
  bolo: 'bolo',
  arrest: 'arrests',
  evidence: 'forensics',
  forensicAnalysis: 'forensics',
  officer: 'admin',
  gang: 'sanggang',
  penalCode: 'laws',
  dispatchCall: 'calls',
}

/**
 * Single entry point for "провалиться" navigation: clicking a reference to
 * any entity anywhere in the system (person profile, report, case board...)
 * opens that entity's own window. Re-clicking the same entity focuses the
 * existing window instead of opening a duplicate; different entities of the
 * same type each get their own window (`instanceKey = type:id`).
 */
export function useEntityNavigation() {
  const { openWindow } = useWindowManager()

  return function openEntity(type: EntityType, id: string, label?: string) {
    const app = apps.find((a) => a.id === ENTITY_TO_APP[type])
    if (!app) return
    openWindow(app, {
      instanceKey: `${type}:${id}`,
      initialParams: { entityType: type, entityId: id, label },
    })
  }
}
