import type { ArrestFile } from '../../types'

/**
 * Global "Аресты" journal — the full arrest file behind every
 * `ArrestRecord.arrestFileId` on a person's denormalized profile list, and
 * behind every `Weapon.seizedInArrestId` / `EntityChip type="arrest"` link.
 */
export const mockArrests: ArrestFile[] = [
  {
    id: 'ar1',
    arrestNumber: 'AR-2024-0981',
    arresteeId: 'p1',
    arrestingOfficer: '9F1 Robert Haines',
    status: 'В суде',
    charges: [{ penalCodeId: 'pc211', count: 1, fineAmount: 15000, jailTime: 48 }],
    seizedWeaponIds: [],
    relatedWarrantId: 'w1',
    relatedReportId: 'report1',
    relatedCaseId: 'case1',
  },
  {
    id: 'ar2',
    arrestNumber: 'AR-2022-0147',
    arresteeId: 'p1',
    arrestingOfficer: '4D8 Kyle Lonso',
    status: 'Закрыто',
    charges: [{ penalCodeId: 'pc2800', count: 1, fineAmount: 8000, jailTime: 24 }],
    seizedWeaponIds: [],
  },
  {
    id: 'ar3',
    arrestNumber: 'AR-2023-0552',
    arresteeId: 'p3',
    arrestingOfficer: '9F1 Robert Haines',
    status: 'Закрыто',
    charges: [{ penalCodeId: 'pc25850', count: 1, fineAmount: 6000, jailTime: 18 }],
    seizedWeaponIds: ['wp2'],
    relatedWarrantId: 'w2',
    relatedCaseId: 'case2',
  },
  {
    id: 'ar4',
    arrestNumber: 'AR-2026-1203',
    arresteeId: 'p5',
    arrestingOfficer: '9F2 Diego Reyes',
    status: 'Открыто',
    charges: [{ penalCodeId: 'pc428', count: 1, fineAmount: 2500, jailTime: 6 }],
    seizedWeaponIds: [],
  },
]
