import { useEffect, useState } from 'react'
import type { ModuleContentProps } from '../registry'
import { getGangs } from '../../../lib/endpoints/gangs'
import { getPeople } from '../../../lib/endpoints/people'
import { mockProfile } from '../../../lib/mockData/profile'
import type { Gang, Person } from '../../../types'
import { useWindowManager } from '../../../windows/WindowManagerContext'
import { PersonProfile } from './PersonProfile'
import { SearchHome, type ResidencyFilter, type SearchFilters, type SearchHomeTab } from './SearchHome'
import { SearchResults } from './SearchResults'
import { SEARCH_CATEGORIES, type SearchCategoryId } from './searchCategories'

const RECENT_LIMIT = 8

type ProfileOrigin =
  | { kind: 'recent' }
  | { kind: 'results'; filters: SearchFilters; residency: ResidencyFilter }
  | { kind: 'profile'; personId: string; from: ProfileOrigin }

type View =
  | { kind: 'search' }
  | { kind: 'results'; filters: SearchFilters; residency: ResidencyFilter }
  | { kind: 'profile'; personId: string; from: ProfileOrigin }

/**
 * "Люди" module: search-first flow (search by any combination of name/
 * phone/document/vehicle/weapon/business/biometric id, filterable by
 * residency) → result list → read-only profile. A "Недавние" tab tracks
 * recently opened profiles for quick re-entry.
 */
function personName(people: Person[], personId: string) {
  const person = people.find((p) => p.id === personId)
  return person ? `${person.firstName} ${person.lastName}` : personId
}

function originToView(origin: ProfileOrigin): View {
  if (origin.kind === 'recent') return { kind: 'search' }
  if (origin.kind === 'results') return { kind: 'results', filters: origin.filters, residency: origin.residency }
  return { kind: 'profile', personId: origin.personId, from: origin.from }
}

function buildBreadcrumb(view: View, people: Person[]): string[] {
  if (view.kind === 'search') return ['Люди']
  if (view.kind === 'results') return ['Люди', 'Результаты поиска']

  const trail: string[] = [personName(people, view.personId)]
  let origin: ProfileOrigin = view.from
  while (origin.kind === 'profile') {
    trail.unshift(personName(people, origin.personId))
    origin = origin.from
  }
  trail.unshift(origin.kind === 'results' ? 'Результаты поиска' : 'Недавние')
  return ['Люди', ...trail]
}

export function PeopleApp({ windowId, initialParams }: ModuleContentProps) {
  const { updateBreadcrumb, setBackHandler, setForwardHandler } = useWindowManager()
  const [people, setPeople] = useState<Person[]>([])
  const [gangs, setGangs] = useState<Gang[]>([])
  const [view, setView] = useState<View>(() => {
    const entityId = initialParams?.entityType === 'person' ? (initialParams.entityId as string) : undefined
    return entityId ? { kind: 'profile', personId: entityId, from: { kind: 'recent' } } : { kind: 'search' }
  })
  // Views undone via the window chrome's back arrow, most-recent last, so the
  // forward arrow can redo them (standard browser back/forward semantics).
  // Any fresh navigation (search, opening a profile) clears this stack.
  const [forwardStack, setForwardStack] = useState<View[]>([])
  const [searchTab, setSearchTab] = useState<SearchHomeTab>('search')
  const [recentIds, setRecentIds] = useState<string[]>([])

  useEffect(() => {
    getPeople().then(setPeople)
    getGangs().then(setGangs)
  }, [])

  useEffect(() => {
    if (initialParams?.entityType === 'person') addRecent(initialParams.entityId as string)
    // Runs once: consumes the one-shot `initialParams.entityId` deep-link signal.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    updateBreadcrumb(windowId, buildBreadcrumb(view, people))
  }, [windowId, view, people, updateBreadcrumb])

  useEffect(() => {
    const backTarget = view.kind === 'results' ? { kind: 'search' as const } : view.kind === 'profile' ? originToView(view.from) : null
    if (!backTarget) {
      setBackHandler(windowId, null)
      return () => setBackHandler(windowId, null)
    }
    setBackHandler(windowId, () => {
      setForwardStack((stack) => [...stack, view])
      setView(backTarget)
    })
    return () => setBackHandler(windowId, null)
  }, [windowId, view, setBackHandler])

  useEffect(() => {
    if (forwardStack.length === 0) {
      setForwardHandler(windowId, null)
      return () => setForwardHandler(windowId, null)
    }
    const next = forwardStack[forwardStack.length - 1]
    setForwardHandler(windowId, () => {
      setForwardStack((stack) => stack.slice(0, -1))
      setView(next)
    })
    return () => setForwardHandler(windowId, null)
  }, [windowId, forwardStack, setForwardHandler])

  function addRecent(personId: string) {
    setRecentIds((prev) => [personId, ...prev.filter((id) => id !== personId)].slice(0, RECENT_LIMIT))
  }

  function openProfile(personId: string, from: ProfileOrigin) {
    addRecent(personId)
    setForwardStack([])
    setView({ kind: 'profile', personId, from })
  }

  function search(filters: SearchFilters, residency: ResidencyFilter) {
    setForwardStack([])
    setView({ kind: 'results', filters, residency })
  }

  function addNote(personId: string, text: string) {
    setPeople((prev) =>
      prev.map((p) =>
        p.id === personId
          ? {
              ...p,
              notes: [
                { id: `note-${Date.now()}`, author: `${mockProfile.badgeNumber} ${mockProfile.name}`, time: 'Только что', text },
                ...p.notes,
              ],
            }
          : p,
      ),
    )
  }

  const recentPeople = recentIds.map((id) => people.find((p) => p.id === id)).filter((p): p is Person => !!p)

  if (view.kind === 'search') {
    return (
      <SearchHome
        tab={searchTab}
        onTabChange={setSearchTab}
        onSearch={search}
        recent={recentPeople}
        onSelectRecent={(person) => openProfile(person.id, { kind: 'recent' })}
      />
    )
  }

  if (view.kind === 'results') {
    const entries = Object.entries(view.filters) as [SearchCategoryId, string][]
    const results = people.filter((p) => {
      if (p.residency !== view.residency) return false
      return entries.every(([categoryId, query]) => {
        if (!query?.trim()) return true
        const category = SEARCH_CATEGORIES.find((c) => c.id === categoryId)!
        return category.match(p, query.toLowerCase())
      })
    })
    return (
      <SearchResults
        filters={view.filters}
        residency={view.residency}
        results={results}
        onSelect={(person) => openProfile(person.id, { kind: 'results', filters: view.filters, residency: view.residency })}
      />
    )
  }

  const person = people.find((p) => p.id === view.personId)
  if (!person) {
    return (
      <div className="flex h-full items-center justify-center text-[14px] text-ink/40">
        Личность не найдена
      </div>
    )
  }

  return (
    <PersonProfile
      person={person}
      gangs={gangs}
      onBack={() => setView(originToView(view.from))}
      onAddNote={addNote}
      onSelectAssociate={(personId) => openProfile(personId, { kind: 'profile', personId: view.personId, from: view.from })}
    />
  )
}
