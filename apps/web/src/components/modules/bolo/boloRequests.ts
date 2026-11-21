import { useSyncExternalStore } from 'react'

/** Who a new BOLO is about, when another module starts it (Поиск → «Объявить в розыск»). */
export interface BoloSubject {
  /** SEARCH_DB record id */
  recId: string
  name: string
  /** record number (CIT-…) */
  code: string
  /** «Мужчина · 12.03.1997 · 29 лет» */
  sub: string
  /** index into BoloNew's VIDS: 0 разыскивается, 1 особый розыск, 2 лицо, представляющее интерес */
  vid: number
  /** the grounds typed in Поиск */
  reason: string
  armed: boolean
  /** a vehicle (Поиск → машина): name = model, code = plate, sub = description */
  isVeh?: boolean
  /** the person's photo, when known */
  photo?: string | null
}

export interface BoloNewRequest {
  subject: BoloSubject
  n: number
}

/**
 * «Start a new BOLO on this person» requests shared across windows: an open
 * BOLO window switches to the new-BOLO form prefilled with the subject; a new
 * window gets the request as `initialParams.boloRequest`.
 */
let last: BoloNewRequest | null = null
const subs = new Set<() => void>()

export function requestNewBolo(subject: BoloSubject): BoloNewRequest {
  last = { subject, n: (last?.n ?? 0) + 1 }
  subs.forEach((f) => f())
  return last
}

export function getBoloRequest(): BoloNewRequest | null {
  return last
}

function subscribe(f: () => void) {
  subs.add(f)
  return () => {
    subs.delete(f)
  }
}

export function useBoloRequest(): BoloNewRequest | null {
  return useSyncExternalStore(subscribe, getBoloRequest)
}

/** «Open this BOLO» from another module (Дела, Поиск): `id` is a record id
 * (b409) or its number (B-0409). An open BOLO window switches to it; a new
 * window gets it as `initialParams` (entityId / label). */
export interface BoloOpenRequest {
  id: string
  n: number
}

let lastOpen: BoloOpenRequest | null = null
const openSubs = new Set<() => void>()

export function requestOpenBolo(id: string): BoloOpenRequest {
  lastOpen = { id, n: (lastOpen?.n ?? 0) + 1 }
  openSubs.forEach((f) => f())
  return lastOpen
}

function subscribeOpen(f: () => void) {
  openSubs.add(f)
  return () => {
    openSubs.delete(f)
  }
}

export function useBoloOpenRequest(): BoloOpenRequest | null {
  return useSyncExternalStore(subscribeOpen, () => lastOpen)
}
