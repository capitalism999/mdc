/** Portrait photos of characters (cropped head-and-shoulders, 480×600,
 * `public/assets/people/`). One table for every module — Поиск records and
 * result rows, vehicle owners, Дела participants — keyed by MDC record id;
 * people without an MDC record are keyed by their exact name. */
const P = (key: string) => `/assets/people/${key}.jpg`

export const PHOTO_BY_RECORD: Record<string, string> = {
  p_tate: P('tate'),
  p_webb: P('webb'),
  p_kwebb: P('kwebb'),
  p_holt: P('holt'),
  p_reyes: P('reyes'),
  e_watts: P('watts'),
  e_moreno: P('moreno'),
  e_ortiz: P('ortiz'),
  e_lanier: P('lanier'),
  e_koval: P('koval'),
}

export const PHOTO_BY_NAME: Record<string, string> = {
  'Emily Ross': P('ross'),
  'Brian Talbot': P('talbot'),
}

/** The design's generic mugshot, for records that have no photo yet. */
export const DEFAULT_PERSON_PHOTO = '/assets/search/0beed155fce0828779f15482eb63b5dd.png'

export function personPhoto(recordId?: string | null, name?: string | null): string {
  return (recordId && PHOTO_BY_RECORD[recordId]) || (name && PHOTO_BY_NAME[name]) || DEFAULT_PERSON_PHOTO
}

/** Photo only if this person really has one (no generic fallback). */
export function ownPhoto(recordId?: string | null, name?: string | null): string | null {
  return (recordId && PHOTO_BY_RECORD[recordId]) || (name && PHOTO_BY_NAME[name]) || null
}
