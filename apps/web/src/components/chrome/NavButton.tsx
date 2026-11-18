export interface NavItem {
  id: string
  label: string
  shortcut: string
  icon: string
  dividerAfter?: boolean
}

interface NavButtonProps {
  item: NavItem
  onClick?: () => void
}

export function NavButton({ item, onClick }: NavButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[54px] w-[78px] flex-col items-center justify-center rounded-[6px] bg-ink/5 hover:bg-ink/10"
    >
      <img src={item.icon} alt="" className="mb-1.5 h-[18px] w-[18px]" />
      <span className="text-[11px] font-bold leading-[14px] text-ink">{item.label}</span>
      <span className="text-[9.5px] leading-[12px] text-ink/50">{item.shortcut}</span>
    </button>
  )
}
