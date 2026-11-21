import type { OfficerProfile } from '../../types'

const A = (f: string) => `/assets/bolo/${f}.png`

/**
 * The characters signed into this client — the account switcher in the
 * header (`UserProfile`) picks one. Everything the MDT says about «me» —
 * prints, signatures, who wrote a note or a letter, which department's
 * blank a report is on — comes from the active one.
 */
export const PROFILES: OfficerProfile[] = [
  {
    id: 'acc1',
    badgeNumber: '12D3',
    rank: 'Deputy Sheriff (Bonus I)',
    name: 'Thorne Watts',
    agency: 'lssd',
    agencyName: "Los Santos County Sheriff's Department",
    agencyShort: 'LSSD',
    agencyRu: 'Департамент шерифа округа Лос-Сантос',
    employeeNo: '20388',
    station: "Davis Sheriff's Station",
    position: 'Patrol Deputy',
    logo: A('bce88aa0f0b36efc819d63ae60d246eb'),
    seal: A('1962b8787fd085eb06bb9e025b029b41'),
    color: '#7A5A16',
    wallpaper: '#3E7A2E',
    photo: '/assets/people/watts.jpg',
    emblem: '/assets/images/sheriff-badge.png',
  },
  {
    id: 'acc2',
    badgeNumber: '2-A-03',
    rank: 'Police Officer III',
    name: 'Carlos Mendez',
    agency: 'lspd',
    agencyName: 'Los Santos Police Department',
    agencyShort: 'LSPD',
    agencyRu: 'Департамент полиции Лос-Сантоса',
    employeeNo: '20417',
    station: 'Mission Row Police Station',
    position: 'Patrol Officer',
    logo: A('45c489eca07290dce77f5ba9125d4868'),
    seal: A('058edb0cf660a661d66b6ee66781369e'),
    color: '#1F4E9C',
    wallpaper: '#2753C3',
    emblem: A('45c489eca07290dce77f5ba9125d4868'),
  },
  {
    id: 'acc3',
    badgeNumber: 'DDA-117',
    rank: 'Deputy District Attorney',
    name: 'Megan Sullivan',
    agency: 'dao',
    agencyName: "Los Santos County District Attorney's Office",
    agencyShort: 'DAO',
    agencyRu: 'Окружная прокуратура Лос-Сантоса',
    employeeNo: 'DA-4471',
    station: 'Hall of Justice, Downtown',
    position: 'Prosecutor, Major Crimes Division',
    logo: '/assets/images/dao-logo.png',
    seal: A('1962b8787fd085eb06bb9e025b029b41'),
    color: '#8A2430',
    wallpaper: '#B0242E',
    emblem: '/assets/images/dao-logo.png',
  },
  {
    id: 'acc4',
    badgeNumber: 'Dept. 3',
    rank: 'Judge of the Superior Court',
    name: 'Eleanor Harper',
    agency: 'court',
    agencyName: 'Superior Court of San Andreas, County of Los Santos',
    agencyShort: 'Суд',
    agencyRu: 'Высший суд Сан-Андреас, округ Лос-Сантос',
    employeeNo: 'J-0312',
    station: 'Los Santos County Courthouse',
    position: 'Criminal Division, Department 3',
    logo: '/assets/images/court-logo.png',
    seal: A('825788c8508b978ce522fadd12971f1e'),
    color: '#5B3E8A',
    wallpaper: '#6B3FC6',
    emblem: '/assets/images/court-logo.png',
  },
]

/** The active character. A live object: switching characters rewrites it in
 * place (see `lib/session.ts`), so every `mockProfile.name` read at render
 * time follows the switch. */
export const mockProfile: OfficerProfile = { ...PROFILES[0] }

/** Kept for the endpoint mock: the characters other than the first. */
export const mockOtherAccounts: OfficerProfile[] = PROFILES.slice(1)
