import type { NoteBlock, OfficerNote } from '../../types'

function blocks(items: Array<[NoteBlock['type'], string, boolean?]>): NoteBlock[] {
  return items.map(([type, text, done], i) => ({ id: `b${i}`, type, text, done }))
}

/**
 * "Заметки" — the officer's personal notepad, separate from `PersonNote`
 * (which lives inside a specific person's profile). Each entry can
 * optionally link out to a case via the editor's case-picker.
 */
export const mockStandaloneNotes: OfficerNote[] = [
  {
    id: 'n1',
    folder: 'cases',
    isPinned: true,
    author: 'Thorne Watts',
    time: 'Сегодня, 15:20',
    dateFull: '15 ноября 2026 г. в 15:20',
    title: 'Обыск 1207 Grove St',
    caseNo: 'SW-2611',
    linkedCaseId: 'c2',
    blocks: blocks([
      ['paragraph', 'Сбор в 19:30 на парковке Davis Station, вход в 20:00. Ордер действует до 18.11, 14:00.'],
      ['paragraph', 'Задняя дверь выходит в переулок к Forum Dr, туда ставим второй экипаж.'],
      ['heading', 'Перед выездом'],
      ['checklist', 'Сверить адрес и описание помещений с ордером', true],
      ['checklist', 'Запросить K-9 через диспетчерскую', true],
      ['checklist', 'Экипажи: 2-A-14 (мы), 2-A-09 (переулок)', false],
      ['checklist', 'Бронежилеты, бодикамеры заряжены', false],
      ['checklist', 'Фото помещений до начала обыска', false],
      ['heading', 'По осведомителю'],
      ['bullet', 'В доме может быть оружие, держать дистанцию у входа'],
      ['bullet', 'Хозяин дома ездит на пикапе 87PLN903'],
    ]),
  },
  {
    id: 'n2',
    folder: 'plates',
    isPinned: true,
    author: 'Thorne Watts',
    time: 'Сегодня, 14:05',
    dateFull: '15 ноября 2026 г. в 14:05',
    title: 'Номера на проверку',
    blocks: blocks([
      ['quote', '46EEK572   Bravado Buffalo   Daniel Reyes\n87PLN903   пикап, Grove St   ?\n——————   Karin Sultan RS   без номеров'],
      ['paragraph', 'Buffalo: досмотр 14.11, запах марихуаны в салоне. Пикап пробить до обыска. Sultan по ориентировке, смотреть следы от снятых номеров.'],
    ]),
  },
  {
    id: 'n3',
    folder: 'cases',
    isPinned: false,
    author: 'Thorne Watts',
    time: 'Сегодня, 12:40',
    dateFull: '15 ноября 2026 г. в 12:40',
    title: 'Показания для прокурора',
    caseNo: 'LS-0893',
    linkedCaseId: 'c1',
    blocks: blocks([
      ['paragraph', 'Отправить Megan Sullivan до 18.11. Рапорт R-10977.'],
      ['bullet', 'Задержание в 02:14 за магазином на Innocence Blvd'],
      ['bullet', 'Подозреваемый выбросил оружие у мусорного бака'],
      ['bullet', 'Права зачитаны в патрульной машине'],
      ['checklist', 'Найти запись бодикамеры за 08.11', true],
      ['checklist', 'Написать и отправить показания', false],
    ]),
  },
  {
    id: 'n4',
    folder: 'shifts',
    isPinned: false,
    author: 'Thorne Watts',
    time: 'Вчера, 21:30',
    dateFull: '14 ноября 2026 г. в 21:30',
    title: 'Route 68 с SAHP',
    blocks: blocks([
      ['paragraph', 'Пт и Сб, 22:00–03:00, развязка с Senora Rd. SAHP: два экипажа и радар. От нас: экипаж и эвакуатор.'],
      ['paragraph', 'Ответить Lisa Brooks до среды, сначала поговорить с Donald Hayes.'],
    ]),
  },
  {
    id: 'n5',
    folder: 'shifts',
    isPinned: false,
    author: 'Thorne Watts',
    time: 'Вчера, 19:10',
    dateFull: '14 ноября 2026 г. в 19:10',
    title: 'Что поднять на брифинге',
    blocks: blocks([
      ['checklist', 'Усилить Davis ночью', false],
      ['checklist', 'Бодикамеры у 2-A-09', false],
      ['checklist', 'Сектора на неделю', false],
    ]),
  },
  {
    id: 'n6',
    folder: 'personal',
    isPinned: false,
    author: 'Thorne Watts',
    time: 'Пт',
    dateFull: '13 ноября 2026 г. в 18:02',
    title: 'Аттестация по стрельбе',
    blocks: blocks([
      ['paragraph', 'Тир Pillbox Hill, 20–22 ноября.'],
      ['checklist', 'Записаться на 21.11', false],
      ['checklist', 'Защита слуха', false],
    ]),
  },
  // another officer's note, filed into SW-2611 › Документы › Планы операций —
  // not in Thorne Watts' list, opens read-only from the case
  {
    id: 'n7',
    folder: 'cases',
    isPinned: false,
    author: 'Raul Moreno',
    time: '17.11, 14:20',
    dateFull: '17 ноября 2026 г. в 14:20',
    title: 'План обыска 18.11',
    caseNo: 'SW-2611',
    linkedCaseId: 'c2',
    blocks: blocks([
      ['paragraph', 'Сбор в 05:15 на Mission Row, брифинг в 05:30. Вход в 06:00 одновременно с двух сторон.'],
      ['heading', 'Расстановка'],
      ['bullet', '2-A-14 (Thorne Watts, Andrew Koval) — главный вход, Grove St'],
      ['bullet', '2-A-09 (Devin Lanier) — задняя дверь, переулок к Forum Dr'],
      ['bullet', 'K-9 — у гаража, ищем оружие и тайники'],
      ['heading', 'Перед входом'],
      ['checklist', 'Бронежилеты, бодикамеры заряжены', true],
      ['checklist', 'Ордер SW-2611 на руках у старшего', true],
      ['checklist', 'Скорая на парковке Davis Station', false],
      ['quote', 'Tyrone Webb может быть вооружён. Не заходить без команды.'],
    ]),
  },
]
