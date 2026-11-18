import type { CaseFile } from '../../types'

/**
 * "Дела" — the central hub aggregating reports/evidence/warrants/BOLOs and
 * attached persons/vehicles/weapons/locations. `case1`/`case2` show a fully
 * assembled case (every cross-reference below is mirrored on the target
 * record's own `relatedCaseId`/`caseId` field); `case3` is intentionally
 * empty to exercise the "+ прикрепить" attach flow on `CaseBoard`.
 */
export const mockCases: CaseFile[] = [
  {
    id: 'case1',
    caseNumber: 'CASE-2026-0021',
    title: 'Вооружённое ограбление банка Fleeca',
    status: 'Активно',
    caseType: 'Ограбление',
    leadOfficerName: '9F1 R. Haines',
    persons: [{ personId: 'p1', role: 'Подозреваемый' }],
    vehicles: [{ vehicleId: 'v1', role: 'Транспорт побега' }],
    weapons: [],
    reportIds: ['report1'],
    evidenceIds: ['ev1', 'ev3'],
    warrantIds: ['w1', 'w3'],
    boloIds: ['bolo1'],
    locations: [{ address: 'Vinewood Blvd.', type: 'Место преступления', description: 'Банк Fleeca, зона ограбления' }],
    gangIds: [],
  },
  {
    id: 'case2',
    caseNumber: 'CASE-2026-0019',
    title: 'Нападение с применением оружия — Davis',
    status: 'Закрыто',
    caseType: 'Нападение',
    leadOfficerName: '9F1 R. Haines',
    persons: [{ personId: 'p3', role: 'Подозреваемый' }],
    vehicles: [],
    weapons: [{ weaponId: 'wp2', role: 'Орудие преступления' }],
    reportIds: [],
    evidenceIds: ['ev2'],
    warrantIds: ['w2'],
    boloIds: ['bolo2'],
    locations: [{ address: 'Davis, Vespucci Ave.', type: 'Место преступления', description: 'Автостоянка возле бара' }],
    gangIds: [],
  },
  {
    id: 'case3',
    caseNumber: 'CASE-2026-0024',
    title: 'Серия ДТП на Great Ocean Highway',
    status: 'Открыто',
    caseType: 'Происшествие',
    leadOfficerName: '9F2 D. Reyes',
    persons: [],
    vehicles: [],
    weapons: [],
    reportIds: ['report3'],
    evidenceIds: [],
    warrantIds: [],
    boloIds: [],
    locations: [],
    gangIds: [],
  },
]
