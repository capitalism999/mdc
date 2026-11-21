import { useSyncExternalStore } from 'react'
import type { OfficerProfile } from '../types'
import { PROFILES, mockProfile } from './mockData/profile'

/**
 * Which character is signed in. `mockProfile` is the live object the
 * modules read; switching rewrites it in place and tells subscribers, so the
 * header re-renders and every window opened afterwards works as the new
 * character (the switch closes the open windows first — see `UserProfile`).
 */
let activeId = mockProfile.id
let version = 0
const subs = new Set<() => void>()

export function getProfiles(): OfficerProfile[] {
  return PROFILES
}

export function getActiveProfile(): OfficerProfile {
  return mockProfile
}

export function switchProfile(id: string) {
  const next = PROFILES.find((p) => p.id === id)
  if (!next || id === activeId) return
  activeId = id
  // rewrite the live object (drop keys the new character doesn't have)
  for (const k of Object.keys(mockProfile)) delete (mockProfile as unknown as Record<string, unknown>)[k]
  Object.assign(mockProfile, next)
  version += 1
  subs.forEach((fn) => fn())
}

const subscribe = (fn: () => void) => {
  subs.add(fn)
  return () => subs.delete(fn)
}

/** Re-renders on a character switch; returns the active character. */
export function useActiveProfile(): OfficerProfile {
  useSyncExternalStore(subscribe, () => version)
  return mockProfile
}

/** «LSSD» / «LSPD» → the BOLO source key of the active character's agency (prosecutors and judges file as LSSD). */
export function activeBoloSrc(): 'lssd' | 'lspd' {
  return mockProfile.agency === 'lspd' ? 'lspd' : 'lssd'
}

/** Initials of the active character («Thorne Watts» → «TW»). */
export function activeInitials(): string {
  return mockProfile.name
    .split(/\s+/)
    .map((w) => w[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

/** «Завершить сессию»: every account signed out (SessionEndedScreen covers the MDT). */
let ended = false
const endSubs = new Set<() => void>()
export function endSession() {
  ended = true
  endSubs.forEach((fn) => fn())
}
export function useSessionEnded(): boolean {
  return useSyncExternalStore(
    (fn) => {
      endSubs.add(fn)
      return () => endSubs.delete(fn)
    },
    () => ended,
  )
}
