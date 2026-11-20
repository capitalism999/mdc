import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ChevronRightIcon } from './icons'

/** Folder management UI for a case file: folder tiles with a ⋯ menu
 * (rename in place / new subfolder / delete), a «+ Новая папка» tile, and
 * the delete confirmation. */

function FolderGlyph({ color, size = 32 }: { color: string; size?: number }) {
  return (
    <span className="flex shrink-0 items-center justify-center rounded-[8px] text-white" style={{ background: color, width: size, height: size }}>
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
        <path d="M2.5 5.5v10h15v-8h-7l-2-2z" />
      </svg>
    </span>
  )
}

/** Text field that commits on Enter / blur and cancels on Escape. */
export function NameInput({ initial, placeholder, onCommit, onCancel, className = '' }: { initial: string; placeholder: string; onCommit: (v: string) => void; onCancel: () => void; className?: string }) {
  const [v, setV] = useState(initial)
  const done = useRef(false)
  const commit = () => {
    if (done.current) return
    done.current = true
    const t = v.trim()
    if (t && t !== initial) onCommit(t)
    else onCancel()
  }
  return (
    <input
      autoFocus
      value={v}
      onChange={(e) => setV(e.target.value)}
      onFocus={(e) => e.currentTarget.select()}
      onKeyDown={(e) => {
        e.stopPropagation()
        if (e.key === 'Enter') commit()
        if (e.key === 'Escape') {
          done.current = true
          onCancel()
        }
      }}
      onBlur={commit}
      onClick={(e) => e.stopPropagation()}
      placeholder={placeholder}
      aria-label={placeholder}
      className={`min-w-0 rounded-[6px] bg-black/30 px-2 text-white outline-none ring-1 ring-[#60CDFF] placeholder:text-[#C2C2C2]/60 ${className}`}
    />
  )
}

export interface FolderMenuProps {
  canRename: boolean
  canDelete: boolean
  canAddSub: boolean
  /** why delete is unavailable (shown instead of the action) */
  lockedHint?: string
  onRename: () => void
  onDelete: () => void
  onAddSub: () => void
}

/** ⋯ button with the folder actions. */
export function FolderMenu({ canRename, canDelete, canAddSub, lockedHint, onRename, onDelete, onAddSub, className = '' }: FolderMenuProps & { className?: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])
  const item = (label: string, onClick: () => void, opts: { danger?: boolean; icon: ReactNode }) => (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        setOpen(false)
        onClick()
      }}
      className={`flex h-8 w-full items-center gap-2.5 rounded-[4px] px-2.5 text-left text-[13px] ${opts.danger ? 'text-[#FF99A4] hover:bg-[rgba(232,17,35,0.14)]' : 'text-white hover:bg-white/[0.06]'}`}
    >
      <span className="flex w-4 justify-center">{opts.icon}</span>
      {label}
    </button>
  )
  return (
    <span ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        aria-label="Действия с папкой"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation()
          setOpen((o) => !o)
        }}
        className={`flex h-7 w-7 items-center justify-center rounded-[6px] text-[#C2C2C2] hover:bg-white/10 hover:text-white ${open ? 'bg-white/10 text-white' : ''}`}
      >
        <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <circle cx="4.5" cy="10" r="1.6" />
          <circle cx="10" cy="10" r="1.6" />
          <circle cx="15.5" cy="10" r="1.6" />
        </svg>
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-[32px] z-20 w-[230px] rounded-[8px] border border-[#3A3A3A] bg-[#2C2C2C] p-1 shadow-[0_10px_28px_rgba(0,0,0,0.45)]">
          {canAddSub &&
            item('Новая подпапка', onAddSub, {
              icon: (
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 5.5v10h15v-8h-7l-2-2zM10 9.5v4M8 11.5h4" />
                </svg>
              ),
            })}
          {canRename &&
            item('Переименовать', onRename, {
              icon: (
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12.5 4.5l3 3L7 16H4v-3z" />
                </svg>
              ),
            })}
          {canDelete &&
            item('Удалить папку', onDelete, {
              danger: true,
              icon: (
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 6h12M8 6V4h4v2M6 6l1 10h6l1-10" />
                </svg>
              ),
            })}
          {lockedHint && <div className="px-2.5 py-1.5 text-[11px] leading-[15px] text-[#9A9A9A]">{lockedHint}</div>}
        </div>
      )}
    </span>
  )
}

/** Subfolder tile in a folder view. */
export function FolderTile({
  name,
  color,
  sub,
  renaming,
  onOpen,
  onRenameCommit,
  onRenameCancel,
  menu,
}: {
  name: string
  color: string
  sub: string
  renaming: boolean
  onOpen: () => void
  onRenameCommit: (v: string) => void
  onRenameCancel: () => void
  menu: FolderMenuProps
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => !renaming && onOpen()}
      onKeyDown={(e) => {
        if (!renaming && (e.key === 'Enter' || e.key === ' ')) onOpen()
      }}
      className="group relative flex cursor-pointer items-center gap-3 rounded-[12px] bg-[#303030] p-4 text-left hover:bg-[#363636] has-[[aria-expanded=true]]:z-20"
    >
      <FolderGlyph color={color} />
      <span className="flex min-w-0 flex-1 flex-col">
        {renaming ? <NameInput initial={name} placeholder="Название папки" onCommit={onRenameCommit} onCancel={onRenameCancel} className="h-7 text-[14px] font-semibold" /> : <span className="ell font-semibold">{name}</span>}
        <span className="text-[12px] text-[#C2C2C2]">{sub}</span>
      </span>
      {!renaming && <ChevronRightIcon className="shrink-0 text-[#C2C2C2] group-focus-within:invisible group-hover:invisible" />}
      {!renaming && <FolderMenu {...menu} className="!absolute right-2.5 top-1/2 -translate-y-1/2 opacity-0 focus-within:opacity-100 group-hover:opacity-100" />}
    </div>
  )
}

/** Small secondary «+ Папка» button for a section header. */
export function AddFolderButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex h-7 items-center gap-1.5 rounded-[6px] px-2 text-[12px] font-normal text-[#C2C2C2] hover:bg-white/10 hover:text-white">
      <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <path d="M10 4v12M4 10h12" />
      </svg>
      {label}
    </button>
  )
}

/** Shown when a folder has no subfolders yet. */
export function NoFoldersHint({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex items-center gap-2.5 rounded-[10px] border border-dashed border-[#3F3F3F] px-3.5 py-2.5 text-[13px] text-[#C2C2C2]">
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" aria-hidden="true">
        <path d="M2.5 5.5v10h15v-8h-7l-2-2z" />
      </svg>
      <span className="flex-1">Подпапок нет — можно разложить записи по папкам</span>
      <button type="button" onClick={onAdd} className="h-7 rounded-[6px] bg-[#3A3A3A] px-2.5 text-[12px] text-white hover:brightness-125">
        Добавить папку
      </button>
    </div>
  )
}

/** Name field tile for a folder being created (only rendered while creating). */
export function NewFolderTile({ color, creating, onCreate, onCancel }: { color: string; creating: boolean; onCreate: (name: string) => void; onCancel: () => void }) {
  if (!creating) return null
  return (
    <div className="flex items-center gap-3 rounded-[12px] bg-[#303030] p-4">
      <FolderGlyph color={color} />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <NameInput initial="" placeholder="Название папки" onCommit={onCreate} onCancel={onCancel} className="h-7 text-[14px] font-semibold" />
        <span className="text-[11px] text-[#9A9A9A]">Enter — создать, Esc — отмена</span>
      </span>
    </div>
  )
}

export function DeleteFolderDialog({ name, count, parentName, onConfirm, onCancel }: { name: string; count: number; parentName: string; onConfirm: () => void; onCancel: () => void }) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [onCancel])
  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel()
      }}
    >
      <div role="alertdialog" aria-label="Удалить папку" className="flex w-[420px] max-w-full flex-col gap-3 rounded-[12px] border border-[#3A3A3A] bg-[#2C2C2C] p-5 text-white shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
        <div className="text-[18px] font-semibold">Удалить папку «{name}»?</div>
        <div className="text-[13px] leading-[19px] text-[#C2C2C2]">
          {count > 0 ? (
            <>
              Записи из неё ({count}) не удалятся — они переместятся в «{parentName}». Действие попадёт в журнал дела.
            </>
          ) : (
            <>Папка пустая. Действие попадёт в журнал дела.</>
          )}
        </div>
        <div className="mt-1 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="h-[34px] rounded-[8px] bg-[#3A3A3A] px-4 text-[13px] hover:brightness-125">
            Отмена
          </button>
          <button type="button" autoFocus onClick={onConfirm} className="h-[34px] rounded-[8px] bg-[#C42B1C] px-4 text-[13px] font-semibold text-white hover:brightness-110">
            Удалить
          </button>
        </div>
      </div>
    </div>
  )
}
