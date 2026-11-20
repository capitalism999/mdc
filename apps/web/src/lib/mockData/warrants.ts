import type { WarrantFile } from '../../types'

/**
 * Global "Ордера" registry — the full warrant file behind every
 * `Warrant.warrantFileId` on a person's denormalized profile list, and
 * behind every `EntityChip type="warrant"` link.
 */
export const mockWarrants: WarrantFile[] = [
  {
    id: 'w1',
    warrantNumber: 'WR-2026-0142',
    warrantType: 'На арест',
    status: 'Активен',
    subjectPersonId: 'p1',
    reason: 'Вооружённое ограбление банка Fleeca на Vinewood Blvd.',
    issuingJudge: 'Evelyn Marlowe',
    charges: [{ penalCodeId: 'pc211', count: 1 }],
    relatedArrestId: 'ar1',
    relatedCaseId: 'case1',
  },
  {
    id: 'w2',
    warrantNumber: 'WR-2026-0138',
    warrantType: 'На арест',
    status: 'Активен',
    subjectPersonId: 'p3',
    reason: 'Нападение с применением оружия на автостоянке в Davis.',
    issuingJudge: 'Evelyn Marlowe',
    charges: [{ penalCodeId: 'pc25850', count: 1 }],
    relatedArrestId: 'ar3',
    relatedCaseId: 'case2',
  },
  {
    id: 'w3',
    warrantNumber: 'WR-2026-0101',
    warrantType: 'На обыск',
    status: 'Исполнен',
    subjectPersonId: 'p1',
    reason: 'Обыск резиденции Vinewood Hills по делу об ограблении Fleeca.',
    issuingJudge: 'Rachel Hollis',
    charges: [],
    relatedArrestId: 'ar1',
  },
]
