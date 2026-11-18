import type { ReactNode } from 'react'

/**
 * Shared building blocks for every module's detail/card screens — originally
 * grown inside `people/PersonProfile.tsx`, promoted here once a second
 * module needed the exact same look. Keep these generic (no module-specific
 * domain knowledge) so all 15 modules can compose with them.
 */
export function SectionCard({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-[8px] bg-ink/5 p-4">
      <div className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-ink/70">
        <span className="text-ink/40">{icon}</span>
        {title}
      </div>
      {children}
    </div>
  )
}

export function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-[13px]">
      <span className="text-ink/40">{label}</span>
      <span className="text-ink/90">{value}</span>
    </div>
  )
}

export function StatusPill({ status, positive }: { status: string; positive: boolean }) {
  return (
    <span
      className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
        positive ? 'bg-[#3fb97f]/15 text-[#3fb97f]' : 'bg-[#e8637a]/20 text-[#ff8ba0]'
      }`}
    >
      {status}
    </span>
  )
}

export function formatMoney(amount: number) {
  return `$${amount.toLocaleString('ru-RU')}`
}

/** Standard "← Back" header used by every module's list/detail screens. */
export function BackHeader({
  title,
  subtitle,
  onBack,
  icon,
}: {
  title: string
  subtitle?: string
  onBack: () => void
  icon: ReactNode
}) {
  return (
    <div className="flex items-center gap-3 border-b border-ink/10 p-4">
      <button
        type="button"
        onClick={onBack}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] bg-ink/10 text-ink hover:bg-ink/20"
      >
        {icon}
      </button>
      <div>
        <h2 className="text-[16px] font-semibold text-ink">{title}</h2>
        {subtitle && <p className="text-[12px] text-ink/40">{subtitle}</p>}
      </div>
    </div>
  )
}

/** Standard search input row used by every module's list screen. */
export function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder,
  icon,
}: {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  placeholder: string
  icon: ReactNode
}) {
  return (
    <div className="flex items-center gap-2 p-4">
      <div className="flex flex-1 items-center gap-2 rounded-[8px] border border-transparent bg-bg-chrome-2 px-4 py-3 focus-within:border-[#01a8f9]/60">
        <span className="shrink-0 text-ink/40">{icon}</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
          placeholder={placeholder}
          className="w-full min-w-0 bg-transparent text-[14px] font-medium tracking-[-0.2px] text-ink placeholder:text-ink/40 focus:outline-none"
        />
      </div>
      <button
        type="button"
        onClick={onSubmit}
        className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-[8px] bg-[#48adec] px-4 text-[14px] font-semibold text-black hover:bg-[#62b9ef]"
      >
        {icon}
        Искать
      </button>
    </div>
  )
}

/** Row used in a module's list screen (search results list) — avatar/icon
 * block + title/subtitle + optional trailing status pill. */
export function ListRow({
  leading,
  title,
  subtitle,
  trailing,
  onClick,
}: {
  leading: ReactNode
  title: ReactNode
  subtitle?: string
  trailing?: ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-[8px] bg-ink/5 px-4 py-3 text-left hover:bg-ink/10"
    >
      {leading}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">{title}</div>
        {subtitle && <p className="truncate text-[12px] text-ink/40">{subtitle}</p>}
      </div>
      {trailing}
    </button>
  )
}

export function EmptyState({ label }: { label: string }) {
  return <div className="flex flex-1 items-center justify-center text-[14px] text-ink/40">{label}</div>
}
