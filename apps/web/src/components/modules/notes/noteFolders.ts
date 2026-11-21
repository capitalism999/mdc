import type { NoteFolder } from '../../../types'

/** Folder-picker selection — the four real folders plus a virtual "all". */
export type NoteView = NoteFolder | 'all'

export const FOLDER_NAMES: Record<NoteView, string> = {
  all: 'Все заметки',
  cases: 'Дела',
  plates: 'Номера ТС',
  shifts: 'Смены',
  personal: 'Личное',
}
export const FOLDER_ORDER: NoteView[] = ['all', 'cases', 'plates', 'shifts', 'personal']
/** the folders a note can actually live in */
export const REAL_FOLDERS: NoteFolder[] = ['cases', 'plates', 'shifts', 'personal']
export const FOLDER_COLORS: Record<NoteView, string> = {
  all: '#8A8A8A',
  cases: '#2EC4B6',
  plates: '#2B88D8',
  shifts: '#8764B8',
  personal: '#D25A8E',
}
