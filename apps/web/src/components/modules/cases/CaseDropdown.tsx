import { useEffect, useRef, useState, type ReactNode } from 'react'

/** Windows 11-style dropdowns used across Дела instead of native <select>:
 * a multi-select with checkboxes and a single-select with a checkmark. */

const ACCENT = '#60CDFF'

/** Closes a popup on an outside press or Escape (Escape is swallowed, so a
 * dialog underneath stays open). */
export function useDismiss<T extends HTMLElement = HTMLDivElement>(open: boolean, close: () => void) {
  const ref = useRef<T>(null)
  useEffect(() => {
    if (!open) return
    const down = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) close()
    }
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        close()
      }
    }
    document.addEventListener('mousedown', down)
    window.addEventListener('keydown', esc, true)
    return () => {
      document.removeEventListener('mousedown', down)
      window.removeEventListener('keydown', esc, true)
    }
  }, [open, close])
  return ref
}

/** Which side the panel should hang from so it stays inside the nearest
 * scrolling/clipping container (main column, dialog). */
function autoAlign(el: HTMLElement | null, preferred?: 'left' | 'right'): 'left' | 'right' {
  if (!el) return preferred ?? 'left'
  let box: HTMLElement | null = el.parentElement
  while (box && !/(auto|scroll|hidden|clip)/.test(getComputedStyle(box).overflowX)) box = box.parentElement
  const r = el.getBoundingClientRect()
  const limit = box ? box.getBoundingClientRect().right : window.innerWidth
  if (r.left + 300 > limit) return 'right'
  return preferred ?? 'left'
}

function Trigger({ open, active, onClick, children, label, wide }: { open: boolean; active: boolean; onClick: () => void; children: ReactNode; label: string; wide?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-haspopup="listbox"
      aria-expanded={open}
      onClick={onClick}
      className={`flex h-8 items-center gap-2 rounded-[6px] pl-3 pr-2.5 text-[13px] hover:brightness-125 ${wide ? 'w-full' : 'max-w-[240px]'}`}
      style={{ background: active ? 'rgba(96,205,255,0.16)' : '#3A3A3A', color: active ? '#BFEAFF' : '#FFFFFF', boxShadow: open ? `inset 0 0 0 1px ${ACCENT}` : 'none' }}
    >
      <span className="min-w-0 flex-1 truncate text-left">{children}</span>
      <svg className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} width="10" height="10" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 8l5 5 5-5" />
      </svg>
    </button>
  )
}

function Panel({ children, label, align = 'left' }: { children: ReactNode; label: string; align?: 'left' | 'right' }) {
  return (
    <div role="listbox" aria-label={label} className={`absolute top-[36px] z-30 max-h-[320px] min-w-full overflow-y-auto rounded-[8px] border border-[#3A3A3A] bg-[#2C2C2C] p-1 shadow-[0_10px_28px_rgba(0,0,0,0.45)] ${align === 'right' ? 'right-0' : 'left-0'}`} style={{ width: 'max-content', maxWidth: 320 }}>
      {children}
    </div>
  )
}

function Checkbox({ on }: { on: boolean }) {
  return (
    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px]" style={{ background: on ? ACCENT : 'transparent', boxShadow: on ? 'none' : 'inset 0 0 0 1px #8A8A8A' }}>
      {on && (
        <svg width="10" height="10" viewBox="0 0 20 20" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4.5 10.5l3.5 3.5 7.5-8" />
        </svg>
      )}
    </span>
  )
}

export interface DropdownOption {
  value: string
  label: string
  count?: number
}

/** Multi-select: empty selection = «все». */
export function MultiDropdown({ label, allLabel, nounMany, options, selected, onChange, align }: { label: string; allLabel: string; nounMany: (n: number) => string; options: DropdownOption[]; selected: string[]; onChange: (v: string[]) => void; align?: 'left' | 'right' }) {
  const [open, setOpen] = useState(false)
  const ref = useDismiss(open, () => setOpen(false))
  const side = open ? autoAlign(ref.current, align) : align
  const text = selected.length === 0 ? allLabel : selected.length === 1 ? (options.find((o) => o.value === selected[0])?.label ?? selected[0]) : nounMany(selected.length)
  const toggle = (v: string) => onChange(selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v])
  return (
    <div ref={ref} className="relative">
      <Trigger open={open} active={selected.length > 0} onClick={() => setOpen((o) => !o)} label={label}>
        {text}
      </Trigger>
      {open && (
        <Panel label={label} align={side}>
          <button type="button" role="option" aria-selected={selected.length === 0} onClick={() => onChange([])} className="flex h-8 w-full items-center gap-2.5 rounded-[4px] px-2.5 text-left text-[13px] text-white hover:bg-white/[0.06]">
            <Checkbox on={selected.length === 0} />
            <span className="flex-1">{allLabel}</span>
          </button>
          <div className="my-1 h-px bg-[#3A3A3A]" />
          {options.map((o) => {
            const on = selected.includes(o.value)
            return (
              <button key={o.value} type="button" role="option" aria-selected={on} onClick={() => toggle(o.value)} className="flex h-8 w-full items-center gap-2.5 rounded-[4px] px-2.5 text-left text-[13px] text-white hover:bg-white/[0.06]">
                <Checkbox on={on} />
                <span className="min-w-0 flex-1 truncate">{o.label}</span>
                {o.count !== undefined && <span className="pl-3 text-[12px] tabular-nums text-[#9A9A9A]">{o.count}</span>}
              </button>
            )
          })}
        </Panel>
      )}
    </div>
  )
}

/** Single-select with a checkmark. */
export function SingleDropdown({ label, options, value, onChange, align, wide }: { label: string; options: DropdownOption[]; value: string; onChange: (v: string) => void; align?: 'left' | 'right'; wide?: boolean }) {
  const [open, setOpen] = useState(false)
  const ref = useDismiss(open, () => setOpen(false))
  const side = open ? autoAlign(ref.current, align) : align
  const current = options.find((o) => o.value === value)
  return (
    <div ref={ref} className={`relative ${wide ? 'w-full' : ''}`}>
      <Trigger open={open} active={false} onClick={() => setOpen((o) => !o)} label={label} wide={wide}>
        {current?.label ?? ''}
      </Trigger>
      {open && (
        <Panel label={label} align={side}>
          {options.map((o) => {
            const on = o.value === value
            return (
              <button
                key={o.value}
                type="button"
                role="option"
                aria-selected={on}
                onClick={() => {
                  onChange(o.value)
                  setOpen(false)
                }}
                className={`relative flex h-8 w-full items-center gap-2.5 rounded-[4px] pl-3 pr-2.5 text-left text-[13px] text-white ${on ? 'bg-white/[0.08]' : 'hover:bg-white/[0.06]'}`}
              >
                {on && <span className="absolute left-0 top-2 h-4 w-[3px] rounded-[2px]" style={{ background: ACCENT }} />}
                <span className="min-w-0 flex-1 truncate">{o.label}</span>
                {o.count !== undefined && <span className="pl-3 text-[12px] tabular-nums text-[#9A9A9A]">{o.count}</span>}
              </button>
            )
          })}
        </Panel>
      )}
    </div>
  )
}
