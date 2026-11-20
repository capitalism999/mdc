import type { OfficerProfile } from '../../types'

export const mockProfile: OfficerProfile = {
  id: 'acc1',
  badgeNumber: '12D3',
  rank: 'Deputy Sheriff (Bonus I)',
  name: 'Thorne Watts',
}

/** Other accounts already signed into this client — powers the account
 * switcher in `UserProfile`'s dropdown (switch/add/log out). */
export const mockOtherAccounts: OfficerProfile[] = [
  {
    id: 'acc2',
    badgeNumber: '9F2A',
    rank: 'Deputy Sheriff',
    name: 'Jack Harlow',
  },
]
