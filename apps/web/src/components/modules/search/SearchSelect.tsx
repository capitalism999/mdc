import { useEffect, useRef, useState } from 'react'
import { useDismiss } from '../cases/CaseDropdown'
import type { SearchVals } from './searchRuntime'

interface Field {
  name: string
  val: string
  ring: string
  opts: { v: string; t: string }[]
  set: (e: { target: { value: string } }) => void
}

/**
 * A form field with a choice (e.g. «Вид деятельности») — looks like the other
 * fields of the form and opens the MDT's own dark list (as the dropdowns in
 * «Дела»), not the browser's white native <select> popup.
 */
export function SearchSelect({ $v, f }: { $v: SearchVals; f: Field }) {
  const [open, setOpen] = useState(false)
  const ref = useDismiss(open, () => setOpen(false))
  const current = f.opts.find((o) => o.v === f.val) ?? f.opts[0]
  // the list floats over the form card (which clips its content); it closes when anything scrolls
  const btn = useRef<HTMLButtonElement>(null)
  const list = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState<{ left: number; top: number; width: number } | null>(null)
  useEffect(() => {
    if (!open) return
    const r = btn.current?.getBoundingClientRect()
    if (r) setBox({ left: r.left, top: r.bottom + 4, width: r.width })
    const close = (e: Event) => {
      if (e.type === 'scroll' && list.current?.contains(e.target as Node)) return
      setOpen(false)
    }
    window.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    return () => {
      window.removeEventListener('scroll', close, true)
      window.removeEventListener('resize', close)
    }
  }, [open])
  const pick = (v: string) => {
    f.set({ target: { value: v } })
    setOpen(false)
  }
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        ref={btn}
        type="button"
        aria-label={f.name}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
          e.preventDefault()
          const i = f.opts.findIndex((o) => o.v === f.val)
          const next = f.opts[Math.max(0, Math.min(f.opts.length - 1, i + (e.key === 'ArrowDown' ? 1 : -1)))]
          if (next) f.set({ target: { value: next.v } })
        }}
        style={{ width: '100%', height: '40px', boxSizing: 'border-box', padding: '0 10px 0 12px', borderRadius: '8px', border: 0, background: $v.c?.search, boxShadow: `inset 0 0 0 1px ${open ? $v.accent : f.ring}`, fontSize: '14px', color: $v.c?.text, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', textAlign: 'left', font: 'inherit' }}
      >
        <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '14px' }}>{current?.t ?? ''}</span>
        <svg width="10" height="10" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .12s' }}>
          <path d="M5 8l5 5 5-5" />
        </svg>
      </button>
      {open && box ? (
        <div ref={list} role="listbox" aria-label={f.name} className="max-h-[280px] overflow-y-auto rounded-[8px] border border-[#3A3A3A] bg-[#2C2C2C] p-1 shadow-[0_10px_28px_rgba(0,0,0,0.45)]" style={{ position: 'fixed', left: box.left, top: box.top, width: box.width, boxSizing: 'border-box', zIndex: 1000 }}>
          {f.opts.map((o) => {
            const on = o.v === f.val
            return (
              <button
                key={o.v || '_any'}
                type="button"
                role="option"
                aria-selected={on}
                onClick={() => pick(o.v)}
                className={`relative flex h-8 w-full items-center rounded-[4px] pl-3 pr-2.5 text-left text-[13px] text-white ${on ? 'bg-white/[0.08]' : 'hover:bg-white/[0.06]'}`}
                style={{ border: 0, font: 'inherit', fontSize: '13px', cursor: 'pointer', background: on ? 'rgba(255,255,255,0.08)' : undefined }}
              >
                {on && <span className="absolute left-0 top-2 h-4 w-[3px] rounded-[2px]" style={{ background: '#60CDFF' }} />}
                <span className="min-w-0 flex-1 truncate">{o.t}</span>
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
