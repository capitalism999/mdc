import { request } from '../api'
import { mockBolos } from '../mockData/bolos'
import type { Bolo } from '../../types'

export function getBolos() {
  return request<Bolo[]>('/bolos', mockBolos)
}
