import { request } from '../api'
import { mockPeople } from '../mockData/people'
import type { Person } from '../../types'

export function getPeople() {
  return request<Person[]>('/people', mockPeople)
}
