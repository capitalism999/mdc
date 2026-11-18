import { request } from '../api'
import { mockEvidence } from '../mockData/evidence'
import type { Evidence } from '../../types'

export function getEvidence() {
  return request<Evidence[]>('/evidence', mockEvidence)
}
