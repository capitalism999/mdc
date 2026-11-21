import { useEffect, useRef, useState } from 'react'
import type { NoteFolder } from '../../../types'
import { FOLDER_COLORS, FOLDER_NAMES, REAL_FOLDERS } from './noteFolders'
import { CheckIcon, FolderIcon } from './icons'

/** Editor toolbar: which of the user's folders the note is in, and moving it
 * to another one. */
export function NoteFolderMenu({ folder, onMove }: { folder: NoteFolder; onMove: (f: NoteFolder) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const down = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const key = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      triggerRef.current?.focus()
    }
    document.addEventListener('mousedown', down)
    document.addEventListener('keydown', key)
    return () => {
      document.removeEventListener('mousedown', down)
      document.removeEventListener('keydown', key)
    }
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Папка: ${FOLDER_NAMES[folder]}`}
        title={`Папка: ${FOLDER_NAMES[folder]} — переложить`}
        className={`flex h-9 items-center gap-1.5 rounded-[6px] px-2 hover:bg-white/10 ${open ? 'bg-white/10' : ''}`}
      >
        <FolderIcon className="h-4 w-4 shrink-0" />
        <span className="hidden whitespace-nowrap text-[13px] @[760px]:inline">{FOLDER_NAMES[folder]}</span>
      </button>
      {open && (
        <div role="menu" aria-label="Переложить в папку" className="absolute right-0 top-10 z-20 w-[200px] rounded-[8px] border border-[#363636] bg-[#2C2C2C] p-1 text-[#F2F2F2] shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
          <div className="px-2.5 pb-1 pt-1.5 text-[11px] font-semibold text-[#B4B4B4]">Переложить в папку</div>
          {REAL_FOLDERS.map((f) => {
            const on = f === folder
            return (
              <button
                key={f}
                type="button"
                role="menuitemradio"
                aria-checked={on}
                autoFocus={on}
                onClick={() => {
                  if (!on) onMove(f)
                  setOpen(false)
                }}
                className={`flex h-[34px] w-full items-center gap-2.5 rounded-[4px] px-2.5 text-[13px] ${on ? 'bg-white/10 font-semibold' : 'hover:bg-white/5'}`}
              >
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: FOLDER_COLORS[f] }} />
                <span className="flex-1 text-left">{FOLDER_NAMES[f]}</span>
                {on && <CheckIcon />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
