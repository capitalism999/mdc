import { request } from '../api'
import { mockWarrants } from '../mockData/warrants'
import type { WarrantFile } from '../../types'

export function getWarrants() {
  return request<WarrantFile[]>('/warrants', mockWarrants)
}
