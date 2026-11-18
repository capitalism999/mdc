import type { OfficerProfile } from '../../types'
import { request } from '../api'
import { mockOtherAccounts, mockProfile } from '../mockData/profile'

export function getProfile(): Promise<OfficerProfile> {
  return request('/profile', mockProfile)
}

/** All accounts signed into this client (active + already-added others) —
 * backs the account switcher dropdown in `UserProfile`. */
export function getAccounts(): Promise<OfficerProfile[]> {
  return request('/accounts', [mockProfile, ...mockOtherAccounts])
}
