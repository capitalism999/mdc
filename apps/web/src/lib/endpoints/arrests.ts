import { request } from '../api'
import { mockArrests } from '../mockData/arrests'
import type { ArrestFile } from '../../types'

export function getArrests() {
  return request<ArrestFile[]>('/arrests', mockArrests)
}
