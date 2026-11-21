import { useState } from 'react'
import { getAvatarColor, getInitials } from './avatar'
import { CloseIcon } from './icons'
import { findRecipients, resolveRecipient } from './mailDirectory'

/** «Кому» with validation: only people / groups / service mailboxes from the
 * directory can be added — typed text is picked from suggestions (arrows +
 * Enter, click) or must match one exactly; anything else is flagged. */
export function MailRecipients({
  value,
  onChange,
  input,
  onInputChange,
  id = 'mail-to',
  label = 'Кому',
  autoFocus,
}: {
  value: string[]
  onChange: (list: string[]) => void
  input: string
  onInputChange: (v: string) => void
  id?: string
  label?: string
  autoFocus?: boolean
}) {
  const [focus, setFocus] = useState(false)
  const [hi, setHi] = useState(0)
  const [tried, setTried] = useState(false)
  const q = input.trim()
  const matches = findRecipients(q).slice(0, 8)
  const already = (name: string) => value.some((v) => v.toLowerCase() === name.toLowerCase() || resolveRecipient(v)?.name === name)
  const hiIdx = matches[hi] && !already(matches[hi].name) ? hi : matches.findIndex((s) => !already(s.name))
  const chosen = hiIdx >= 0 ? matches[hiIdx] : undefined

  function add(name: string) {
    if (!already(name)) onChange([...value, name])
    onInputChange('')
    setHi(0)
    setTried(false)
  }
  /** Enter / comma / Tab / blur: exact match or the highlighted suggestion. */
  function commit(fromBlur = false) {
    if (!q) return false
    const exact = resolveRecipient(q)
    if (exact) {
      add(exact.name)
      return true
    }
    if (!fromBlur && chosen) {
      add(chosen.name)
      return true
    }
    setTried(true)
    return false
  }

  const error = q && (tried || (!focus && q)) ? (matches.length === 0 ? `Получатель «${q}» не найден` : `«${q}» — выберите получателя из списка`) : null

  return (
    <div className="relative flex flex-1 flex-col py-1.5">
      <div className="flex flex-wrap items-center gap-1.5">
        {value.map((name) => {
          const ok = !!resolveRecipient(name)
          return (
            <span
              key={name}
              title={ok ? undefined : 'Такого получателя нет в справочнике — письмо не будет отправлено'}
              className={`flex h-[26px] items-center gap-1.5 rounded-full border py-0 pl-[3px] pr-1 text-[13px] ${ok ? 'border-[#454545] bg-[#333333]' : 'border-[#E5484D] bg-[rgba(232,17,35,0.14)] text-[#FF99A4]'}`}
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold text-white" style={{ backgroundColor: ok ? getAvatarColor(name) : '#8A3B40' }}>
                {ok ? getInitials(name) : '!'}
              </span>
              <span>{name}</span>
              <button
                type="button"
                onClick={() => onChange(value.filter((n) => n !== name))}
                aria-label={`Убрать получателя ${name}`}
                className="flex h-[18px] w-[18px] items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white"
              >
                <CloseIcon className="h-2.5 w-2.5" />
              </button>
            </span>
          )
        })}
        <input
          id={id}
          autoFocus={autoFocus ?? value.length === 0}
          value={input}
          onChange={(e) => {
            onInputChange(e.target.value)
            setHi(0)
            setTried(false)
          }}
          onFocus={() => setFocus(true)}
          onBlur={() => {
            setFocus(false)
            commit(true)
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown' && matches.length) {
              e.preventDefault()
              setHi(Math.min(Math.max(hiIdx, 0) + 1, matches.length - 1))
            } else if (e.key === 'ArrowUp' && matches.length) {
              e.preventDefault()
              setHi(Math.max(hiIdx - 1, 0))
            } else if (e.key === 'Tab') {
              // resolve what's typed (if anything) but let focus move on — an
              // unknown name stays in the field, flagged, instead of trapping Tab
              if (q && !e.shiftKey) commit()
            } else if ((e.key === 'Enter' && !e.ctrlKey && !e.metaKey) || e.key === ',') {
              e.preventDefault()
              commit()
            } else if (e.key === 'Escape') {
              onInputChange('')
            } else if (e.key === 'Backspace' && !input && value.length > 0) {
              onChange(value.slice(0, -1))
            }
          }}
          placeholder={value.length === 0 ? 'Имя, жетон или отдел' : ''}
          aria-label={label}
          aria-invalid={!!error}
          aria-autocomplete="list"
          className="min-w-[160px] flex-1 bg-transparent text-[14px] text-white outline-none placeholder:text-[#C8C8C8]"
        />
      </div>
      {error && <span className="pt-1 text-[12px] text-[#FF99A4]">{error}</span>}
      {focus && q && matches.length > 0 && (
        <div role="listbox" aria-label={`${label}: получатели`} className="absolute left-0 top-full z-20 mt-1 w-[min(420px,100%)] rounded-[8px] border border-[#3A3A3A] bg-[#2C2C2C] p-1 shadow-[0_10px_28px_rgba(0,0,0,0.45)]">
          {matches.map((s, k) => {
            const dup = already(s.name)
            return (
              <button
                key={s.key}
                type="button"
                role="option"
                aria-selected={k === hiIdx}
                disabled={dup}
                // mousedown so the pick lands before the input's blur
                onMouseDown={(e) => {
                  e.preventDefault()
                  if (!dup) add(s.name)
                }}
                onMouseEnter={() => setHi(k)}
                className={`flex w-full items-center gap-2.5 rounded-[4px] px-2 py-1.5 text-left disabled:cursor-default ${k === hiIdx && !dup ? 'bg-white/[0.08]' : ''}`}
              >
                {s.group ? (
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] bg-[#3A4E72] text-white">
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                      <circle cx="7.5" cy="7" r="2.6" />
                      <path d="M2.5 16a5 5 0 0110 0M13 4.8a2.6 2.6 0 010 4.9M14.5 16a5 5 0 00-2-4" />
                    </svg>
                  </span>
                ) : (
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white" style={{ background: s.color, opacity: dup ? 0.5 : 1 }}>
                    {s.initials}
                  </span>
                )}
                <span className={`min-w-0 flex-1 leading-[17px] ${dup ? 'opacity-50' : ''}`}>
                  <span className="block truncate text-[13px] font-semibold">{s.name}</span>
                  {s.sub && <span className="block truncate text-[11px] text-[#C2C2C2]">{s.sub}</span>}
                </span>
                {dup && <span className="shrink-0 text-[11px] text-[#C2C2C2]">Уже добавлен</span>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
