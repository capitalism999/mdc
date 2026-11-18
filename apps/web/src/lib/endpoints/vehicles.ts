import { request } from '../api'
import { mockVehicles } from '../mockData/vehicles'
import type { Vehicle } from '../../types'

export function getVehicles() {
  return request<Vehicle[]>('/vehicles', mockVehicles)
}
