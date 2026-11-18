import { apps } from '../../data/apps'
import { useWindowManager } from '../../windows/WindowManagerContext'
import { NavButton, type NavItem } from './NavButton'

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'ГЛАВНАЯ', shortcut: 'ALT+H', icon: '/assets/icons/home.svg', dividerAfter: true },
  { id: 'create', label: 'СОЗДАТЬ', shortcut: 'ALT+N', icon: '/assets/icons/nav-create.svg' },
  { id: 'search', label: 'ПОИСК', shortcut: 'ALT+J', icon: '/assets/icons/nav-search.svg', dividerAfter: true },
  { id: 'mail', label: 'ПОЧТА', shortcut: 'F6', icon: '/assets/icons/nav-mail.svg' },
  { id: 'bolo', label: 'BOLO', shortcut: 'CTRL+B', icon: '/assets/icons/nav-bolo.svg' },
  { id: 'notes', label: 'ЗАМЕТКИ', shortcut: 'CTRL+M', icon: '/assets/icons/nav-notes.svg', dividerAfter: true },
  { id: 'refresh', label: 'ОБНОВИТЬ', shortcut: 'F5', icon: '/assets/icons/nav-refresh.svg' },
  { id: 'close', label: 'ЗАКРЫТЬ', shortcut: 'CTRL+W', icon: '/assets/icons/nav-close.svg' },
]

/**
 * Renders the pill-button navigation row from `NAV_ITEMS`, inserting a
 * vertical divider after any item flagged with `dividerAfter`.
 */
export function HeaderNav() {
  const { openWindow } = useWindowManager()

  function handleClick(item: NavItem) {
    if (item.id === 'mail' || item.id === 'bolo' || item.id === 'notes') {
      const app = apps.find((a) => a.id === item.id)
      if (app) openWindow(app)
    }
  }

  return (
    <div className="flex h-[54px] items-center gap-1.5">
      {NAV_ITEMS.map((item) => (
        <div key={item.id} className="flex h-full items-center gap-1.5">
          <NavButton item={item} onClick={() => handleClick(item)} />
          {item.dividerAfter && <div className="h-10 w-px bg-ink/15" />}
        </div>
      ))}
    </div>
  )
}
