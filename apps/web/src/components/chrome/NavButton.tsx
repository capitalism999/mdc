export interface NavItem {
  id: string
  label: string
  shortcut: string
  icon: string
  /** what the button does, shown as its tooltip */
  hint: string
  dividerAfter?: boolean
}

interface NavButtonProps {
  item: NavItem
  onClick?: () => void
  /** a menu it owns is open (СОЗДАТЬ) */
  active?: boolean
  /** nothing to act on right now (ЗАКРЫТЬ with no open window) */
  disabled?: boolean
  /** one turn of the icon — feedback for ОБНОВИТЬ */
  spin?: boolean
}

export function NavButton({ item, onClick, active, disabled, spin }: NavButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={`${item.hint} (${item.shortcut})`}
      aria-haspopup={item.id === 'create' ? 'menu' : undefined}
      aria-expanded={item.id === 'create' ? !!active : undefined}
      className={`flex h-[54px] w-[78px] flex-col items-center justify-center rounded-[6px] ${
        active ? 'bg-ink/15' : 'bg-ink/5 hover:bg-ink/10'
      } disabled:cursor-default disabled:opacity-40 disabled:hover:bg-ink/5`}
    >
      <img src={item.icon} alt="" className={`mb-1.5 h-[18px] w-[18px] ${spin ? 'animate-[spin_0.6s_ease-in-out]' : ''}`} />
      <span className="text-[11px] font-bold leading-[14px] text-ink">{item.label}</span>
      <span className="text-[9.5px] leading-[12px] text-ink/50">{item.shortcut}</span>
    </button>
  )
}
