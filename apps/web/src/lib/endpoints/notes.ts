import { request } from '../api'
import { mockStandaloneNotes } from '../mockData/standaloneNotes'
import type { OfficerNote } from '../../types'

export function getNotes() {
  return request<OfficerNote[]>('/notes', mockStandaloneNotes)
}
