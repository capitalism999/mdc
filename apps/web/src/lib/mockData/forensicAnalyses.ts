import type { ForensicAnalysis } from '../../types'

/** Lab results per evidence item (`mockData/forensicAnalyses.ts`). */
export const mockForensicAnalyses: ForensicAnalysis[] = [
  {
    id: 'fa1',
    analysisNumber: 'FA-2026-0071',
    evidenceId: 'ev1',
    analysisType: 'Дактилоскопия',
    status: 'Завершён',
    matchFound: true,
    matchedPersonId: 'p1',
    resultSummary: 'Отпечатки совпадают с биометрическим профилем подозреваемого на 97%.',
  },
  {
    id: 'fa2',
    analysisNumber: 'FA-2024-0033',
    evidenceId: 'ev2',
    analysisType: 'Баллистическая экспертиза',
    status: 'Завершён',
    matchFound: false,
    resultSummary: 'Совпадений с базой нераскрытых преступлений не найдено.',
  },
  {
    id: 'fa3',
    analysisNumber: 'FA-2026-0072',
    evidenceId: 'ev3',
    analysisType: 'Видеоанализ',
    status: 'В работе',
    matchFound: false,
    resultSummary: 'Экспертиза в процессе — покадровый анализ записи.',
  },
]
