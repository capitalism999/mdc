import type { DispatchCall } from '../../types'

/** CAD dispatch call feed (`mockData/dispatchCalls.ts`). */
export const mockDispatchCalls: DispatchCall[] = [
  {
    id: 'call1',
    callNumber: 'CAD-2026-3301',
    natureCode: '211 — Ограбление',
    priority: 'Высокий',
    status: 'Завершён',
    callerName: 'Аноним',
    locationStreet: 'Vinewood Blvd.',
    relatedPersonId: 'p1',
    relatedVehiclePlate: '12ABC345',
    linkedReportId: 'report1',
  },
  {
    id: 'call2',
    callNumber: 'CAD-2026-3298',
    natureCode: '415 — Нарушение порядка',
    priority: 'Средний',
    status: 'В ожидании',
    callerName: 'James Walsh',
    locationStreet: 'Davis, Vespucci Ave.',
    relatedPersonId: 'p3',
  },
  {
    id: 'call3',
    callNumber: 'CAD-2026-3295',
    natureCode: '902 — Подмога на месте ДТП',
    priority: 'Низкий',
    status: 'Направлен',
    callerName: 'Dispatch',
    locationStreet: 'Great Ocean Highway',
  },
]
