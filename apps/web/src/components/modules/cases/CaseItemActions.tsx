import { useEffect, useRef, useState, type ReactNode } from 'react'
import { SingleDropdown } from './CaseDropdown'

/** Record actions in the inspector: ⋯ menu (move to another folder / remove
 * from the case) and their dialogs. */

export interface ItemMenuAction {
  label: string
  icon: ReactNode
  onClick: () => void
  danger?: boolean
}

/** ⋯ menu of a record: «Переместить в папку…» (when allowed), extra actions
 * (e.g. for places «Изменить метку», «Переставить на карте»), a divider and
 * the remove action. `overCover`: the button sits on a photo → dark backdrop. */
export function ItemActionsMenu({ canMove, onMove, onRemove, removeLabel = 'Убрать из дела', actions = [], overCover = false }: { canMove: boolean; onMove: () => void; onRemove: () => void; removeLabel?: string; actions?: ItemMenuAction[]; overCover?: boolean }) {
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
  const item = (label: string, onClick: () => void, icon: ReactNode, danger?: boolean) => (
    <button
      type="button"
      role="menuitem"
      onClick={() => {
        setOpen(false)
        onClick()
      }}
      className={`flex h-8 w-full items-center gap-2.5 rounded-[4px] px-2.5 text-left text-[13px] ${danger ? 'text-[#FF99A4] hover:bg-[rgba(232,17,35,0.14)]' : 'text-white hover:bg-white/[0.06]'}`}
    >
      <span className="flex w-4 justify-center">{icon}</span>
      {label}
    </button>
  )
  return (
    <span ref={ref} className={`absolute z-10 ${overCover ? "right-6 top-7" : "right-2 top-2"}`}>
      <button
        type="button"
        aria-label="Действия с записью"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`flex h-8 w-8 items-center justify-center rounded-[6px] hover:text-white ${overCover ? `text-white ${open ? 'bg-black/65' : 'bg-black/45 hover:bg-black/65'}` : `text-[#C2C2C2] hover:bg-white/10 ${open ? 'bg-white/10 text-white' : ''}`}`}
      >
        <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <circle cx="4.5" cy="10" r="1.6" />
          <circle cx="10" cy="10" r="1.6" />
          <circle cx="15.5" cy="10" r="1.6" />
        </svg>
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-[36px] w-[220px] rounded-[8px] border border-[#3A3A3A] bg-[#2C2C2C] p-1 text-left shadow-[0_10px_28px_rgba(0,0,0,0.45)]">
          {canMove &&
            item(
              'Переместить в папку…',
              onMove,
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 5.5v10h15v-8h-7l-2-2zM8 11.5h5M11 9.5l2 2-2 2" />
              </svg>,
            )}
          {actions.map((a) => (
            <span key={a.label}>{item(a.label, a.onClick, a.icon, a.danger)}</span>
          ))}
          {(canMove || actions.length > 0) && <div className="my-1 h-px bg-[#3A3A3A]" />}
          {item(
            removeLabel,
            onRemove,
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6h12M8 6V4h4v2M6 6l1 10h6l1-10" />
            </svg>,
            true,
          )}
        </div>
      )}
    </span>
  )
}

function DialogShell({ label, children, onCancel }: { label: string; children: ReactNode; onCancel: () => void }) {
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
      <div role="dialog" aria-label={label} className="flex w-[440px] max-w-full flex-col gap-3 rounded-[12px] border border-[#3A3A3A] bg-[#2C2C2C] p-5 text-white shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
        {children}
      </div>
    </div>
  )
}

export function RemoveItemDialog({ title, linkedToMdc, isPlace = false, onConfirm, onCancel }: { title: string; linkedToMdc: boolean; isPlace?: boolean; onConfirm: () => void; onCancel: () => void }) {
  return (
    <DialogShell label={isPlace ? 'Удалить метку' : 'Убрать из дела'} onCancel={onCancel}>
      <div className="text-[18px] font-semibold">{isPlace ? 'Удалить метку «' + title + '»?' : 'Убрать «' + title + '» из дела?'}</div>
      <div className="text-[13px] leading-[19px] text-[#C2C2C2]">
        {isPlace ? 'Метка пропадёт с карты вместе с фото, связями и заметками. ' : 'Запись и её заметки пропадут из этого дела. '}
        {linkedToMdc ? 'Запись в MDC останется без изменений. ' : ''}Действие попадёт в журнал дела.
      </div>
      <div className="mt-1 flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="h-[34px] rounded-[8px] bg-[#3A3A3A] px-4 text-[13px] hover:brightness-125">
          Отмена
        </button>
        <button type="button" autoFocus onClick={onConfirm} className="h-[34px] rounded-[8px] bg-[#C42B1C] px-4 text-[13px] font-semibold text-white hover:brightness-110">
          {isPlace ? 'Удалить' : 'Убрать'}
        </button>
      </div>
    </DialogShell>
  )
}

export function MoveItemDialog({ title, folders, currentId, onMove, onCancel }: { title: string; folders: { id: string; label: string }[]; currentId: string; onMove: (folderId: string) => void; onCancel: () => void }) {
  const first = folders.find((f) => f.id !== currentId)?.id ?? currentId
  const [target, setTarget] = useState(first)
  return (
    <DialogShell label="Переместить в папку" onCancel={onCancel}>
      <div className="text-[18px] font-semibold">Переместить «{title}»</div>
      <div className="flex flex-col gap-1 text-[12px] font-semibold text-[#C2C2C2]">
        Папка
        <span className="font-normal">
          <SingleDropdown label="Папка" options={folders.map((f) => ({ value: f.id, label: f.id === currentId ? `${f.label} (сейчас)` : f.label }))} value={target} onChange={setTarget} wide />
        </span>
      </div>
      <div className="mt-1 flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="h-[34px] rounded-[8px] bg-[#3A3A3A] px-4 text-[13px] hover:brightness-125">
          Отмена
        </button>
        <button type="button" onClick={() => onMove(target)} disabled={target === currentId} className="h-[34px] rounded-[8px] bg-[#60CDFF] px-4 text-[13px] font-semibold text-black enabled:hover:brightness-110 disabled:opacity-40">
          Переместить
        </button>
      </div>
    </DialogShell>
  )
}
