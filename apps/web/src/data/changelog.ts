export interface ChangelogEntry {
  date: string
  items: string[]
}

/**
 * What actually shipped, newest first — surfaced by `ChangelogButton` in
 * the header. Add an entry here whenever a visible change ships; this is
 * the only place that list is kept, so the button never drifts from
 * reality.
 */
export const changelog: ChangelogEntry[] = [
  {
    date: '19.11.2026',
    items: [
      'Почта переведена на новый дизайн: папки через выпадающий список, поиск с подсказками и подсветкой совпадений, флажки, вложения',
      '«Новое письмо» теперь открывается отдельным окном, а не панелью рядом со списком',
      'Поддержка нескольких получателей в поле «Кому»',
      'Более компактные верхняя панель и панель задач',
      'Шрифт интерфейса приведён к Segoe UI / Inter',
      'Подсказка про полноэкранный режим (F11) при входе',
      'Остальные приложения временно помечены как «в разработке» на время перехода на новый дизайн',
    ],
  },
]
