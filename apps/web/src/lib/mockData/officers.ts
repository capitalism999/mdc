import type { Officer } from '../../types'
import { mockProfile } from './profile'

/** Personnel roster — includes the current officer (`mockProfile`) plus
 * colleagues referenced elsewhere in the system as plain display strings
 * (arresting officer, lead officer, evidence collector, issuing judge). */
export const mockOfficers: Officer[] = [
  {
    id: 'off1',
    name: mockProfile.name,
    badgeNumber: mockProfile.badgeNumber,
    callsign: '1-ADAM-12',
    department: 'Patrol Division',
    rank: mockProfile.rank,
    dutyStatus: 'На смене',
  },
  {
    id: 'off2',
    name: 'J. Harlow',
    badgeNumber: '9F2A',
    callsign: '1-ADAM-14',
    department: 'Patrol Division',
    rank: 'Deputy Sheriff',
    dutyStatus: 'На смене',
  },
  {
    id: 'off3',
    name: 'M. Reyes',
    badgeNumber: '4C7B',
    callsign: '2-DAVID-03',
    department: 'Detective Bureau',
    rank: 'Detective II',
    dutyStatus: 'Не на смене',
  },
  {
    id: 'off4',
    name: 'K. Novak',
    badgeNumber: '6E1D',
    callsign: 'FORENSICS-1',
    department: 'Forensics Unit',
    rank: 'Criminalist',
    dutyStatus: 'На смене',
  },
]
