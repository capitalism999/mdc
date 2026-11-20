import { useSyncExternalStore } from 'react'
import { mockBolos } from '../lib/mockData/bolos'
import { mockMailMessages } from '../lib/mockData/mail'

/**
 * Red notification counters on the desktop tiles («Почта 3», «BOLO 2»).
 * Each module reports its own count while it is open (unread inbox mail,
 * unread active BOLOs); before it's ever opened the count comes from the
 * same data it would load.
 */
let badges: Record<string, number> = {
  mail: mockMailMessages.filter((m) => m.folder === 'inbox' && !m.read).length,
  bolo: mockBolos.filter((b) => b.status === 'open' && b.unread).length,
}
const subs = new Set<() => void>()

export function setAppBadge(appId: string, count: number) {
  if ((badges[appId] ?? 0) === count) return
  badges = { ...badges, [appId]: count }
  subs.forEach((f) => f())
}

function subscribe(f: () => void) {
  subs.add(f)
  return () => {
    subs.delete(f)
  }
}

export function useAppBadge(appId: string): number {
  return useSyncExternalStore(subscribe, () => badges[appId] ?? 0)
}
