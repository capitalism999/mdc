import type { Bolo } from '../../types'

/** Active/closed BOLO alerts (`HeaderNav` CTRL+B shortcut opens this module). */
export const mockBolos: Bolo[] = [
  {
    id: 'bolo1',
    title: 'Ограбление Fleeca — M. De Santa',
    boloType: 'Розыск лица и ТС',
    status: 'Активен',
    priority: 'Высокий',
    personId: 'p1',
    vehicleId: 'v1',
    reason: 'Вооружённое ограбление банка Fleeca на Vinewood Blvd., подозреваемый скрылся на Obey Tailgater.',
    dangerLevel: 'Высокий',
    lastKnownLocation: 'Vinewood Blvd.',
    caseId: 'case1',
  },
  {
    id: 'bolo2',
    title: 'Нападение в Davis — L. Davis',
    boloType: 'Розыск лица',
    status: 'Активен',
    priority: 'Высокий',
    personId: 'p3',
    reason: 'Нападение с применением SMG на автостоянке в Davis.',
    dangerLevel: 'Критический',
    lastKnownLocation: 'Davis, Vespucci Ave.',
    caseId: 'case2',
  },
  {
    id: 'bolo3',
    title: 'Угнанный Declasse Tornado',
    boloType: 'Розыск ТС',
    status: 'Закрыт',
    priority: 'Средний',
    vehicleId: 'v5',
    reason: 'Заявление об угоне, ТС в угоне.',
    dangerLevel: 'Низкий',
    lastKnownLocation: 'Del Perro Freeway',
  },
]
