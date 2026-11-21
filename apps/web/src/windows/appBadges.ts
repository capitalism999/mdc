import { useSyncExternalStore } from 'react'
import { useActiveProfile } from '../lib/session'
import { mockProfile } from '../lib/mockData/profile'
import { mockBolos } from '../lib/mockData/bolos'
import { mockMailMessages } from '../lib/mockData/mail'
import { mockMailByProfile } from '../lib/mockData/mailOthers'

/**
 * Red notification counters on the desktop tiles («Почта 3», «BOLO 2»).
 * Each module reports its own count while it is open (unread inbox mail,
 * unread active BOLOs); before it's ever opened the count comes from the
 * same data it would load.
 *
 * Mail is per character (each has their own mailbox — the mock letters are
 * the first character's); the BOLO feed is shared by everyone.
 */
const PER_CHARACTER = new Set(['mail'])

let shared: Record<string, number> = {
  bolo: mockBolos.filter((b) => b.status === 'open' && b.unread).length,
}
const own = new Map<string, Record<string, number>>()
function mine(): Record<string, number> {
  let r = own.get(mockProfile.id)
  if (!r) {
    r = { mail: (mockProfile.id === 'acc1' ? mockMailMessages : (mockMailByProfile[mockProfile.id] ?? [])).filter((m) => m.folder === 'inbox' && !m.read).length }
    own.set(mockProfile.id, r)
  }
  return r
}
let version = 0
const subs = new Set<() => void>()

export function setAppBadge(appId: string, count: number) {
  if (PER_CHARACTER.has(appId)) {
    const r = mine()
    if ((r[appId] ?? 0) === count) return
    own.set(mockProfile.id, { ...r, [appId]: count })
  } else {
    if ((shared[appId] ?? 0) === count) return
    shared = { ...shared, [appId]: count }
  }
  version += 1
  subs.forEach((f) => f())
}

function subscribe(f: () => void) {
  subs.add(f)
  return () => {
    subs.delete(f)
  }
}

export function useAppBadge(appId: string): number {
  useActiveProfile() // re-render on a character switch
  useSyncExternalStore(subscribe, () => version)
  return (PER_CHARACTER.has(appId) ? mine()[appId] : shared[appId]) ?? 0
}
