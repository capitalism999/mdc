import { request } from '../api'
import { mockDispatchCalls } from '../mockData/dispatchCalls'
import type { DispatchCall } from '../../types'

export function getDispatchCalls() {
  return request<DispatchCall[]>('/dispatch-calls', mockDispatchCalls)
}
