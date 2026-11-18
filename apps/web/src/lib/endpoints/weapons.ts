import { request } from '../api'
import { mockWeapons } from '../mockData/weapons'
import type { Weapon } from '../../types'

export function getWeapons() {
  return request<Weapon[]>('/weapons', mockWeapons)
}
