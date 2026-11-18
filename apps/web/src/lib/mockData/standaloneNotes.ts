import type { OfficerNote } from '../../types'

/**
 * "Заметки" — the officer's personal notepad, separate from `PersonNote`
 * (which lives inside a specific person's profile). Each entry can
 * optionally link out to one person/vehicle/case via `EntityChip`.
 */
export const mockStandaloneNotes: OfficerNote[] = [
  {
    id: 'note1',
    title: 'Fleeca — проверить камеры на Vinewood Blvd',
    content:
      'Запросить у владельца магазина на углу Vinewood Blvd запись с камер за 14:00–14:30. Возможно, попал в кадр второй подозреваемый.',
    category: 'Дело',
    isPinned: true,
    author: 'Thorne Watts',
    time: 'Сегодня, 10:12',
    linkedCaseId: 'case1',
  },
  {
    id: 'note2',
    title: 'Подозрительный Sultan RS у Davis Ave',
    content: 'Третий день подряд замечен на той же парковке в ночное время. Пробить номер при следующей встрече.',
    category: 'Патруль',
    isPinned: true,
    author: 'Thorne Watts',
    time: 'Вчера, 23:48',
    linkedVehicleId: 'v1',
  },
  {
    id: 'note3',
    title: 'Разговор с информатором',
    content: 'Источник сообщил о возможной поставке оружия через порт в конце недели. Требует проверки, не для рапорта.',
    category: 'Оперативное',
    isPinned: false,
    author: 'Thorne Watts',
    time: '2 дня назад',
    linkedPersonId: 'p1',
  },
  {
    id: 'note4',
    title: 'Напоминание: продлить сертификацию K9',
    content: 'Сертификация по работе с служебной собакой истекает в конце месяца. Записаться на переаттестацию.',
    category: 'Личное',
    isPinned: false,
    author: 'Thorne Watts',
    time: '5 дней назад',
  },
]
