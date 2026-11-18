import type { Announcement } from '../../types'

export const mockAnnouncements: Announcement[] = [
  {
    id: 'ann1',
    title: 'Усиленные патрули в районе Vinewood Blvd',
    body: 'В связи с серией вооружённых ограблений до дальнейших указаний назначены усиленные патрули в районе Vinewood Blvd и прилегающих банковских отделений.',
    author: 'Capt. D. Sullivan',
    date: 'Сегодня',
    priority: 'Важный',
  },
  {
    id: 'ann2',
    title: 'Обновление формы рапортов',
    body: 'С этой недели все новые рапорты должны указывать связанный вызов CAD, если он есть — используйте кнопку "Создать рапорт" на карточке вызова.',
    author: 'Lt. R. Okafor',
    date: '2 дня назад',
    priority: 'Обычный',
  },
  {
    id: 'ann3',
    title: 'Плановое обслуживание системы',
    body: 'В ночь на субботу MDT будет недоступен с 02:00 до 04:00 для планового обслуживания.',
    author: 'IT Division',
    date: '4 дня назад',
    priority: 'Обычный',
  },
]
