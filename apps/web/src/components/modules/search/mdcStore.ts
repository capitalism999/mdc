import { useSyncExternalStore } from 'react'

/**
 * Shared MDC state that must be the same in every window: record tags
 * («Опасен», «Вооружён»…). The reference logic keeps them per instance
 * (`state.tg`, seeded from `TAG_SEED`); `SearchApp` mirrors each instance's
 * `tg` here and pulls changes back, and other modules (Дела) read it, so a
 * tag set in one Поиск window shows up everywhere at once.
 */
export interface MdcTag {
  n: string
  /** access level index (0 = everyone) */
  a: number
  by: string
  d: string
  note: string
}

type TagMap = Record<string, MdcTag[]>

let tags: TagMap | null = null
const subs = new Set<() => void>()

export function getMdcTags(): TagMap | null {
  return tags
}

export function setMdcTags(next: TagMap | null | undefined) {
  if (!next || next === tags) return
  tags = next
  subs.forEach((f) => f())
}

export function subscribeMdcTags(f: () => void) {
  subs.add(f)
  return () => {
    subs.delete(f)
  }
}

export function useMdcTags(): TagMap | null {
  return useSyncExternalStore(subscribeMdcTags, getMdcTags)
}
