import { request } from '../api'
import { mockCases } from '../mockData/cases'
import type { CaseFile } from '../../types'

export function getCases() {
  return request<CaseFile[]>('/cases', mockCases)
}
