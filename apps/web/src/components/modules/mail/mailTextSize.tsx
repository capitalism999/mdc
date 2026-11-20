import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

/**
 * Text size for reading mail — a per-viewer display setting, shared by every
 * Почта window and kept across reloads. It only changes how letters are shown
 * here (the compose window has its own real font-size formatting).
 */
export const MAIL_TEXT_SIZES = [12, 13, 14, 15, 16, 18, 20, 22, 24]
const DEFAULT = 14
const KEY = 'mdt.mail.textSize'

function read(): number {
  try {
    const v = Number(localStorage.getItem(KEY))
    return MAIL_TEXT_SIZES.includes(v) ? v : DEFAULT
  } catch {
    return DEFAULT
  }
}

let size = read()
const subs = new Set<() => void>()

export function setMailTextSize(v: number) {
  if (!MAIL_TEXT_SIZES.includes(v) || v === size) return
  size = v
  try {
    localStorage.setItem(KEY, String(v))
  } catch {
    /* private mode — the size just isn't remembered */
  }
  subs.forEach((f) => f())
}

function subscribe(f: () => void) {
  subs.add(f)
  return () => {
    subs.delete(f)
  }
}

export function useMailTextSize(): number {
  return useSyncExternalStore(subscribe, () => size)
}

/** font-size + a relative line-height (14 → 22px as in the design; bigger inline text keeps room). */
export function mailTextStyle(px: number) {
  return { fontSize: `${px}px`, lineHeight: 1.57 }
}

const Chevron = () => (
  <svg width="10" height="10" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 8l5 5 5-5" />
  </svg>
)

/**
 * The font-size box of Outlook / Word: the current size with a chevron, a
 * flyout list of sizes under it. Mouse-downs don't take focus, so a text
 * selection in an editor survives picking a size.
 */
export function FontSizeDropdown({ value, sizes, onPick, label, prefix }: { value: number | null; sizes: number[]; onPick: (px: number) => void; label: string; prefix?: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const down = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', down)
    document.addEventListener('keydown', key)
    return () => {
      document.removeEventListener('mousedown', down)
      document.removeEventListener('keydown', key)
    }
  }, [open])
  const keep = (e: { preventDefault: () => void }) => e.preventDefault()
  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onMouseDown={keep}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${label}: ${value ?? '—'}`}
        title={label}
        className={`flex h-[30px] items-center gap-1.5 rounded-[4px] border px-2 text-[13px] tabular-nums hover:bg-white/10 ${open ? 'border-[#60CDFF] bg-white/[0.06]' : 'border-[#454545]'}`}
      >
        {prefix && <span className="text-[12px] text-[#C8C8C8]">{prefix}</span>}
        <span className="min-w-[18px] text-left">{value ?? ''}</span>
        <span className="text-[#C8C8C8]">
          <Chevron />
        </span>
      </button>
      {open && (
        <div role="listbox" aria-label={label} className="scroll absolute left-0 top-full z-30 mt-1 max-h-[280px] w-[76px] overflow-y-auto rounded-[8px] border border-[#3A3A3A] bg-[#2C2C2C] p-1 shadow-[0_8px_24px_rgba(0,0,0,0.45)]">
          {sizes.map((s) => {
            const on = s === value
            return (
              <button
                key={s}
                type="button"
                role="option"
                aria-selected={on}
                onMouseDown={keep}
                onClick={() => {
                  onPick(s)
                  setOpen(false)
                }}
                className={`relative flex h-8 w-full items-center rounded-[4px] pl-3 text-left text-[13px] tabular-nums hover:bg-white/10 ${on ? 'bg-white/[0.08] font-semibold' : ''}`}
              >
                {on && <span className="absolute left-0 top-2 h-4 w-[3px] rounded-[2px] bg-[#60CDFF]" />}
                {s}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

/** Reading pane: how big letters are shown. */
export function MailTextSizeControl() {
  const px = useMailTextSize()
  return <FontSizeDropdown value={px} sizes={MAIL_TEXT_SIZES} onPick={setMailTextSize} label="Размер текста письма" prefix="Aa" />
}
