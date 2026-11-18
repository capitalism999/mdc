import type { AuditLogEntry } from '../../types'

/** Audit trail — seeded declaratively from mock data rather than produced
 * by real action-logging hooks in this prototype. */
export const mockAuditLog: AuditLogEntry[] = [
  { id: 'audit1', officerId: 'off1', action: 'Создал рапорт', entityType: 'report', entityId: 'report1', timestamp: 'Сегодня, 09:40' },
  { id: 'audit2', officerId: 'off3', action: 'Открыл дело', entityType: 'case', entityId: 'case1', timestamp: 'Сегодня, 09:52' },
  { id: 'audit3', officerId: 'off4', action: 'Завершил экспертизу', entityType: 'forensicAnalysis', entityId: 'fa1', timestamp: 'Вчера, 17:15' },
  { id: 'audit4', officerId: 'off2', action: 'Выдал ордер', entityType: 'warrant', entityId: 'w1', timestamp: 'Вчера, 14:02' },
  { id: 'audit5', officerId: 'off1', action: 'Пробил транспорт', entityType: 'vehicle', entityId: 'v1', timestamp: '2 дня назад' },
  { id: 'audit6', officerId: 'off3', action: 'Закрыл дело', entityType: 'case', entityId: 'case2', timestamp: '3 дня назад' },
]
