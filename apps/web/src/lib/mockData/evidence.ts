import type { Evidence } from '../../types'

/** "Экспертизы" evidence locker (`mockData/evidence.ts`). */
export const mockEvidence: Evidence[] = [
  {
    id: 'ev1',
    evidenceNumber: 'EV-2026-0141',
    description: 'Отпечатки пальцев с прилавка',
    evidenceType: 'Биологический след',
    status: 'На анализе',
    collectedBy: '9F1 Robert Haines',
    collectedDate: '14.11.2026',
    custodyLog: [
      { officer: '9F1 Robert Haines', action: 'Изъято с места происшествия', date: '14.11.2026 09:12' },
      { officer: '9F1 Robert Haines', action: 'Передано в лабораторию', date: '14.11.2026 11:40' },
    ],
    relatedReportId: 'report1',
    relatedCaseId: 'case1',
  },
  {
    id: 'ev2',
    evidenceNumber: 'EV-2026-0098',
    description: 'Изъятое оружие (протокол приёма-передачи)',
    evidenceType: 'Оружие',
    status: 'В хранилище',
    collectedBy: '9F1 Robert Haines',
    collectedDate: '02.09.2024',
    custodyLog: [
      { officer: '9F1 Robert Haines', action: 'Изъято при аресте', date: '02.09.2024 18:05' },
      { officer: 'Lab Tech. Mark Price', action: 'Баллистическая экспертиза', date: '04.09.2024 10:00' },
      { officer: 'Evidence Clerk Joseph Okafor', action: 'Помещено в хранилище', date: '05.09.2024 08:30' },
    ],
    relatedArrestId: 'ar3',
    relatedCaseId: 'case2',
  },
  {
    id: 'ev3',
    evidenceNumber: 'EV-2026-0142',
    description: 'Записи камер наблюдения, Vinewood Blvd.',
    evidenceType: 'Видеозапись',
    status: 'Возвращено',
    collectedBy: '4D8 Kyle Lonso',
    collectedDate: '14.11.2026',
    custodyLog: [
      { officer: '4D8 Kyle Lonso', action: 'Получено у владельца магазина', date: '14.11.2026 10:05' },
      { officer: 'Lab Tech. Mark Price', action: 'Видеоанализ начат', date: '14.11.2026 13:20' },
    ],
    relatedReportId: 'report1',
    relatedCaseId: 'case1',
  },
]
