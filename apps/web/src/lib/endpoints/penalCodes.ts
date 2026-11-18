import { request } from '../api'
import { mockPenalCodes } from '../mockData/penalCodes'
import type { PenalCode } from '../../types'

export function getPenalCodes() {
  return request<PenalCode[]>('/penal-codes', mockPenalCodes)
}
