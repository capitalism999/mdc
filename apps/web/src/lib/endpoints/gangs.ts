import { request } from '../api'
import { mockGangs } from '../mockData/gangs'
import type { Gang } from '../../types'

export function getGangs() {
  return request<Gang[]>('/gangs', mockGangs)
}
