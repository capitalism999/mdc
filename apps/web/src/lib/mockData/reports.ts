import type { Report } from '../../types'

/**
 * "Рапорты" journal — each entry attaches persons/vehicles/weapons/charges
 * by id (the composable-attachment pattern reused by `mockData/cases.ts`).
 * `report1` is the payoff of `DispatchCall.linkedReportId` wiring: it was
 * created from `call1` via the "Создать рапорт" action.
 */
export const mockReports: Report[] = [
  {
    id: 'report1',
    reportNumber: 'R-2026-0088',
    title: 'Вооружённое ограбление — Vinewood Blvd.',
    reportType: 'Инцидент',
    narrative:
      'По прибытии на место обнаружен потерпевший, сообщивший о вооружённом ограблении. Подозреваемый опознан по камерам наблюдения и описанию свидетелей, задержан на месте.',
    status: 'Утверждён',
    authorName: '9F1 Robert Haines',
    incidentDate: '14.11.2026',
    dispatchCallId: 'call1',
    persons: [{ personId: 'p1', role: 'Подозреваемый' }],
    vehicles: [{ vehicleId: 'v1', role: 'Транспорт подозреваемого' }],
    weapons: [],
    charges: [{ personId: 'p1', penalCodeId: 'pc211', count: 1 }],
    evidenceIds: ['ev1', 'ev3'],
    relatedCaseId: 'case1',
  },
  {
    id: 'report2',
    reportNumber: 'R-2026-0092',
    title: 'Нарушение общественного порядка — Vespucci Ave.',
    reportType: 'Инцидент',
    narrative: 'Поступила жалоба на громкий конфликт возле бара. На месте установлен зачинщик, составлен рапорт без задержания.',
    status: 'Черновик',
    authorName: '4D8 Kyle Lonso',
    incidentDate: '13.11.2026',
    persons: [{ personId: 'p3', role: 'Нарушитель' }],
    vehicles: [],
    weapons: [],
    charges: [{ personId: 'p3', penalCodeId: 'pc148', count: 1 }],
    evidenceIds: [],
  },
  {
    id: 'report3',
    reportNumber: 'R-2026-0095',
    title: 'ДТП — Great Ocean Highway',
    reportType: 'Происшествие',
    narrative: 'Столкновение двух транспортных средств без пострадавших. Составлена схема происшествия, стороны направлены за страховым возмещением.',
    status: 'Отправлен',
    authorName: '9F2 Diego Reyes',
    incidentDate: '12.11.2026',
    persons: [],
    vehicles: [],
    weapons: [],
    charges: [],
    evidenceIds: [],
    relatedCaseId: 'case3',
  },
]
