import { useState } from 'react'
import type { CaseAccessMember, CaseAccessRole } from '../../../types'
import { CASE_PEOPLE } from '../../../lib/mockData/caseFiles'
import { GroupIcon } from './icons'
import { findStaff, type StaffEntry } from './staffDirectory'
import { useDismiss } from './CaseDropdown'

export const ROLES: { id: CaseAccessRole; label: string; desc: string }[] = [
  { id: 'manager', label: 'Администратор', desc: 'Всё, что участник, плюс выдаёт и меняет права других, гриф и ограничения разделов' },
  { id: 'member', label: 'Участник', desc: 'Добавляет, изменяет и перемещает записи' },
  { id: 'observer', label: 'Наблюдатель', desc: 'Смотрит всё и пишет заметки' },
  { id: 'viewer', label: 'Только просмотр', desc: 'Видит дело без права что-то менять' },
]
export const ROLE_LABEL: Record<CaseAccessRole, string> = { lead: 'Ведущий', manager: 'Администратор', member: 'Участник', observer: 'Наблюдатель', viewer: 'Только просмотр' }

/** «Кто имеет доступ»: staff autocomplete (not found / already in case) and
 * the member list with a per-row role menu. Used by «Доступ к делу» and
 * «Новое дело». */
export function AccessMembers({
  members,
  accent,
  onAccent,
  inviteName,
  onInviteNameChange,
  onInvite,
  openRoleMenuIndex,
  onToggleRoleMenu,
  onSetRole,
  onRemoveMember,
}: {
  members: CaseAccessMember[]
  accent: string
  onAccent: string
  inviteName: string
  onInviteNameChange: (v: string) => void
  onInvite: (entry: StaffEntry) => void
  openRoleMenuIndex: number | null
  onToggleRoleMenu: (i: number | null) => void
  onSetRole: (i: number, role: CaseAccessRole) => void
  onRemoveMember: (i: number) => void
}) {
  // Invite autocomplete against the MDC staff directory.
  const [inviteFocus, setInviteFocus] = useState(false)
  /** «Убрать доступ» asks once more before taking the access away */
  const [confirmRemove, setConfirmRemove] = useState<number | null>(null)
  const closeRoleMenu = () => {
    onToggleRoleMenu(null)
    setConfirmRemove(null)
  }
  // the open role menu closes on an outside press / Escape (not the dialog)
  const roleMenuRef = useDismiss(openRoleMenuIndex !== null, closeRoleMenu)
  const [hi, setHi] = useState(0)
  const query = inviteName.trim()
  const inCase = (s: StaffEntry) => members.some((m) => m.name === s.key || CASE_PEOPLE[m.name]?.name === s.name)
  const matches = findStaff(query)
  const selectable = matches.filter((s) => !inCase(s))
  const notFound = query.length > 1 && matches.length === 0
  const exact = selectable.find((s) => s.name.toLowerCase() === query.toLowerCase())
  // Highlight lands on the first person who can actually be added.
  const hiIdx = matches[hi] && !inCase(matches[hi]) ? hi : exact ? matches.indexOf(exact) : matches.findIndex((s) => !inCase(s))
  const chosen = hiIdx >= 0 ? matches[hiIdx] : undefined
  function pick(s: StaffEntry | undefined) {
    if (!s || inCase(s)) return
    onInvite(s)
    setHi(0)
  }
  return (
    <>
            <div className="relative mb-2 flex gap-2">
              <label
                className="flex h-9 flex-1 items-center gap-2 rounded-[8px] bg-[#3A3A3A] px-2.5 text-[#C2C2C2]"
                style={{ boxShadow: notFound ? 'inset 0 0 0 1.5px #E5484D' : inviteFocus ? `inset 0 0 0 1.5px ${accent}` : 'none' }}
              >
                <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                  <circle cx="8" cy="7" r="3" />
                  <path d="M2.5 17a5.5 5.5 0 0111 0M15.5 6v5M13 8.5h5" />
                </svg>
                <input
                  value={inviteName}
                  onChange={(e) => {
                    onInviteNameChange(e.target.value)
                    setHi(0)
                  }}
                  onFocus={() => setInviteFocus(true)}
                  onBlur={() => setInviteFocus(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown') {
                      e.preventDefault()
                      setHi(Math.min(Math.max(hiIdx, 0) + 1, matches.length - 1))
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault()
                      setHi(Math.max(hiIdx - 1, 0))
                    } else if (e.key === 'Enter') {
                      pick(chosen)
                    }
                  }}
                  placeholder="Имя, жетон или отдел"
                  aria-label="Добавить сотрудника"
                  aria-invalid={notFound}
                  aria-autocomplete="list"
                  className="min-w-0 flex-1 bg-transparent text-[13px] text-white outline-none"
                />
                {notFound && <span className="shrink-0 text-[12px] text-[#FF99A4]">Сотрудник не найден</span>}
              </label>
              <button
                type="button"
                onClick={() => pick(chosen)}
                disabled={!chosen}
                style={{ background: accent, color: onAccent }}
                className="h-9 rounded-[8px] px-3.5 text-[13px] font-semibold enabled:hover:brightness-110 enabled:active:brightness-95 disabled:opacity-40"
              >
                Добавить
              </button>
              {inviteFocus && query && matches.length > 0 && (
                <div role="listbox" aria-label="Найденные сотрудники" className="absolute left-0 right-[92px] top-[40px] z-[6] max-h-[264px] overflow-y-auto rounded-[8px] border border-[#3A3A3A] bg-[#2C2C2C] p-1 shadow-[0_10px_28px_rgba(0,0,0,0.45)]">
                  {matches.map((s, k) => {
                    const already = inCase(s)
                    return (
                      <button
                        key={s.key}
                        type="button"
                        role="option"
                        aria-selected={k === hiIdx}
                        disabled={already}
                        // mousedown so the pick lands before the input's blur closes the list
                        onMouseDown={(e) => {
                          e.preventDefault()
                          pick(s)
                        }}
                        onMouseEnter={() => setHi(k)}
                        className={`flex w-full items-center gap-2.5 rounded-[4px] px-2 py-1.5 text-left disabled:cursor-default ${k === hiIdx && !already ? 'bg-white/[0.08]' : ''}`}
                      >
                        {s.group ? (
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] bg-[#3A4E72] text-white">
                            <GroupIcon />
                          </span>
                        ) : (
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white" style={{ background: s.color, opacity: already ? 0.5 : 1 }}>
                            {s.initials}
                          </span>
                        )}
                        <span className={`min-w-0 flex-1 leading-[17px] ${already ? 'opacity-50' : ''}`}>
                          <span className="block truncate text-[13px] font-semibold">{s.name}</span>
                          {s.sub && <span className="block truncate text-[11px] text-[#C2C2C2]">{s.sub}</span>}
                        </span>
                        {already && <span className="shrink-0 text-[11px] text-[#C2C2C2]">Уже в деле</span>}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
            <div className="rounded-[10px] bg-[#303030]">
              {members.map((m, i, arr) => {
                const isGroup = m.name.startsWith('@')
                const pp = CASE_PEOPLE[m.name]
                const isLead = m.role === 'lead'
                const initials = pp ? pp.initials : m.name.replace(/[^А-ЯA-Z]/g, '').slice(0, 2) || '?'
                return (
                  <div key={m.name} ref={openRoleMenuIndex === i ? roleMenuRef : undefined} className="relative flex items-center gap-3 px-3">
                    {isGroup ? (
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-[#3A4E72] text-white">
                        <GroupIcon />
                      </span>
                    ) : (
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white" style={{ background: pp?.color ?? '#5C6B70' }}>
                        {initials}
                      </span>
                    )}
                    <span className={`flex flex-1 items-center gap-3 py-2.5 ${i === arr.length - 1 ? '' : 'border-b border-[#3A3A3A]'}`}>
                      <span className="min-w-0 flex-1 leading-[18px]">
                        <span className="block truncate text-[13px] font-semibold">{isGroup ? m.name.slice(1) : pp?.name ?? m.name}</span>
                        <span className="block truncate text-[12px] text-[#C2C2C2]">{m.sub}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (isLead) return
                          setConfirmRemove(null)
                          onToggleRoleMenu(openRoleMenuIndex === i ? null : i)
                        }}
                        style={{ color: isLead ? '#C2C2C2' : '#FFFFFF', background: isLead ? 'transparent' : '#3A3A3A' }}
                        className={`flex h-7 items-center gap-1.5 rounded-[6px] px-2.5 text-[12px] ${isLead ? 'cursor-default' : 'hover:brightness-125'}`}
                      >
                        {ROLE_LABEL[m.role]}
                        {!isLead && (
                          <svg width="9" height="9" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 8l4 4 4-4" />
                          </svg>
                        )}
                      </button>
                    </span>
                    {openRoleMenuIndex === i && (
                      <div className={`absolute right-3 z-[5] w-[300px] rounded-[8px] border border-[#3A3A3A] bg-[#2C2C2C] p-1 shadow-[0_10px_28px_rgba(0,0,0,0.45)] ${i >= arr.length - 2 && arr.length > 2 ? 'bottom-[46px]' : 'top-[46px]'}`}>
                        {ROLES.map((r) => {
                          const on = m.role === r.id
                          return (
                            <button key={r.id} type="button" onClick={() => onSetRole(i, r.id)} className={`flex w-full gap-2.5 rounded-[4px] px-2.5 py-2 ${on ? 'bg-white/[0.08]' : 'hover:bg-white/[0.06]'}`}>
                              <span className="w-3.5 pt-0.5" style={{ color: accent }}>
                                {on && (
                                  <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4.5 10.5l3.5 3.5 7.5-8" />
                                  </svg>
                                )}
                              </span>
                              <span className="flex flex-1 flex-col text-left leading-[17px]">
                                <span className="text-[13px] font-semibold">{r.label}</span>
                                <span className="text-[11px] text-[#C2C2C2]">{r.desc}</span>
                              </span>
                            </button>
                          )
                        })}
                        <div className="my-1 h-px bg-[#3A3A3A]" />
                        {confirmRemove === i ? (
                          <div className="flex flex-col gap-1.5 px-2.5 py-1.5">
                            <span className="text-[12px] leading-[16px] text-[#C2C2C2]">Убрать доступ у {isGroup ? m.name.slice(1) : (pp?.name ?? m.name)}? Дело пропадёт из его списка.</span>
                            <span className="flex justify-end gap-1.5">
                              <button type="button" onClick={() => setConfirmRemove(null)} className="h-7 rounded-[6px] bg-[#3A3A3A] px-2.5 text-[12px] hover:brightness-125">
                                Отмена
                              </button>
                              <button
                                type="button"
                                autoFocus
                                onClick={() => {
                                  setConfirmRemove(null)
                                  onRemoveMember(i)
                                }}
                                className="h-7 rounded-[6px] bg-[#C42B1C] px-2.5 text-[12px] font-semibold text-white hover:brightness-110"
                              >
                                Убрать
                              </button>
                            </span>
                          </div>
                        ) : (
                          <button type="button" onClick={() => setConfirmRemove(i)} className="flex h-8 w-full items-center justify-center rounded-[4px] text-[13px] text-[#FF99A4] hover:bg-[rgba(232,17,35,0.14)]">
                            Убрать доступ
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
    </>
  )
}
