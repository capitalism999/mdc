import { request } from '../api'
import { mockReports } from '../mockData/reports'
import type { Report } from '../../types'

export function getReports() {
  return request<Report[]>('/reports', mockReports)
}
