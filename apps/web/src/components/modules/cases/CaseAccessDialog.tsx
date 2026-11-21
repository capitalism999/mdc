import { useEffect, useState } from 'react'
import type { CaseAccessRole, CaseAccessState, CaseSectionLevel } from '../../../types'
import { CloseIcon, LockIcon } from './icons'
import type { StaffEntry } from './staffDirectory'
import { AccessMembers } from './CaseAccessMembers'
import { useDismiss } from './CaseDropdown'

const GRIFS: { id: CaseAccessState['grif']; label: string; desc: string; tone: string }[] = [
  { id: 'normal', label: 'Обычное', desc: 'Видят все с доступом к делу', tone: '#6CCB5F' },
  { id: 'conf', label: 'Конфиденциально', desc: 'Скрыто из общего поиска MDT', tone: '#FCE100' },
  { id: 'secret', label: 'Секретно', desc: 'Только по личному приглашению', tone: '#FF99A4' },
]
export const SECTION_LEVELS: { id: CaseSectionLevel; label: string; desc: string }[] = [
  { id: 'all', label: 'Все с доступом', desc: 'Без ограничений: видят все, у кого есть доступ к делу' },
  { id: 'members', label: 'Участники и выше', desc: 'Скрыто от наблюдателей и «только просмотр»' },
  { id: 'managers', label: 'Администраторы и ведущий', desc: 'Только администраторы дела и ведущий' },
  { id: 'lead', label: 'Только ведущий', desc: 'Раздел видит только ведущий следователь' },
]

interface CaseAccessDialogProps {
  caseNo: string
  caseShort: string
  accent: string
  onAccent: string
  access: CaseAccessState
  sections: { id: string; name: string; color?: string }[]
  inviteName: string
  onInviteNameChange: (v: string) => void
  onInvite: (entry: StaffEntry) => void
  openRoleMenuIndex: number | null
  onToggleRoleMenu: (i: number | null) => void
  onSetRole: (i: number, role: CaseAccessRole) => void
  onRemoveMember: (i: number) => void
  onSetGrif: (g: CaseAccessState['grif']) => void
  onSetSection: (sectionId: string, level: CaseSectionLevel) => void
  onClose: () => void
}

/** The "Доступ к делу" modal: classification level, member roster with
 * per-row role menu, and per-section access overrides. All state mutation
 * flows back through props — this component is purely presentational. */
export function CaseAccessDialog({
  caseNo,
  caseShort,
  accent,
  onAccent,
  access,
  sections,
  inviteName,
  onInviteNameChange,
  onInvite,
  openRoleMenuIndex,
  onToggleRoleMenu,
  onSetRole,
  onRemoveMember,
  onSetGrif,
  onSetSection,
  onClose,
}: CaseAccessDialogProps) {
  const [sectionMenu, setSectionMenu] = useState<string | null>(null)
  // the open section menu closes on an outside press / Escape (not the dialog)
  const sectionMenuRef = useDismiss(sectionMenu !== null, () => setSectionMenu(null))
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div role="dialog" aria-label="Доступ к делу" tabIndex={-1} className="flex max-h-[min(820px,100%)] w-[660px] max-w-full flex-col overflow-hidden rounded-[12px] outline-none border border-[#3A3A3A] bg-[#2C2C2C] text-white shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
        <div className="flex shrink-0 items-center gap-3 px-5 pb-3 pt-[18px]">
          <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#3A4E72] text-white">
            <LockIcon />
          </span>
          <span className="flex-1 leading-5">
            <span className="block text-[18px] font-semibold">Доступ к делу</span>
            <span className="block text-[12px] text-[#C2C2C2]">
              {caseNo} · {caseShort}
            </span>
          </span>
          <button type="button" onClick={onClose} aria-label="Закрыть" className="flex h-8 w-8 items-center justify-center rounded-[6px] hover:bg-white/10">
            <CloseIcon />
          </button>
        </div>

        <div className="scroll flex min-h-0 flex-1 flex-col gap-[18px] overflow-y-auto px-5 pb-4 pt-1">
          <div>
            <div className="mb-1.5 text-[12px] font-semibold text-[#C2C2C2]">Гриф дела</div>
            <div className="grid grid-cols-3 gap-1.5">
              {GRIFS.map((g) => {
                const on = access.grif === g.id
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => onSetGrif(g.id)}
                    style={{ boxShadow: on ? `inset 0 0 0 1.5px ${accent}` : 'inset 0 0 0 1px #3A3A3A' }}
                    className={`flex flex-col gap-0.5 rounded-[8px] px-3 py-2.5 text-left ${on ? 'bg-[#303030]' : 'hover:bg-white/[0.05]'}`}
                  >
                    <span className="flex items-center gap-1.5 text-[13px] font-semibold">
                      <span className="h-2 w-2 rounded-full" style={{ background: g.tone }} />
                      {g.label}
                    </span>
                    <span className="text-[11px] leading-[15px] text-[#C2C2C2]">{g.desc}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <div className="mb-1.5 text-[12px] font-semibold text-[#C2C2C2]">Кто имеет доступ</div>
            <AccessMembers members={access.members} accent={accent} onAccent={onAccent} inviteName={inviteName} onInviteNameChange={onInviteNameChange} onInvite={onInvite} openRoleMenuIndex={openRoleMenuIndex} onToggleRoleMenu={onToggleRoleMenu} onSetRole={onSetRole} onRemoveMember={onRemoveMember} />
          </div>

          <div>
            <div className="mb-1.5 text-[12px] font-semibold text-[#C2C2C2]">Ограничения по разделам</div>
            <div className="rounded-[10px] bg-[#303030]">
              {sections.map((s, i, arr) => {
                const level = access.sections[s.id] ?? 'all'
                const label = SECTION_LEVELS.find((l) => l.id === level)?.label ?? 'Все с доступом'
                const locked = level !== 'all'
                const menuUp = i >= arr.length - 4 && arr.length > 4
                return (
                  <div key={s.id} ref={sectionMenu === s.id ? sectionMenuRef : undefined} className="relative flex items-center gap-3 px-3">
                    <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true" className="shrink-0">
                      <path d="M2 5.5A1.5 1.5 0 013.5 4h4l2 2h7A1.5 1.5 0 0118 7.5v8a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 012 15.5z" fill={s.color ?? '#5C6B70'} />
                    </svg>
                    <span className={`flex flex-1 items-center gap-3 py-2 ${i === arr.length - 1 ? '' : 'border-b border-[#3A3A3A]'}`}>
                      <span className="flex-1 text-[13px]">{s.name}</span>
                      <button
                        type="button"
                        onClick={() => setSectionMenu(sectionMenu === s.id ? null : s.id)}
                        aria-haspopup="listbox"
                        aria-expanded={sectionMenu === s.id}
                        style={{ background: locked ? 'rgba(255,185,0,0.16)' : '#3A3A3A', color: locked ? '#FCE100' : '#FFFFFF' }}
                        className="flex h-7 items-center gap-1.5 rounded-[6px] px-2.5 text-[12px] hover:brightness-125"
                      >
                        {locked && <LockIcon className="h-[11px] w-[11px]" />}
                        {label}
                        <svg width="9" height="9" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 8l4 4 4-4" />
                        </svg>
                      </button>
                    </span>
                    {sectionMenu === s.id && (
                      <div role="listbox" aria-label={`Кто видит раздел «${s.name}»`} className={`absolute right-3 z-[5] w-[300px] rounded-[8px] border border-[#3A3A3A] bg-[#2C2C2C] p-1 shadow-[0_10px_28px_rgba(0,0,0,0.45)] ${menuUp ? 'bottom-[38px]' : 'top-[38px]'}`}>
                        {SECTION_LEVELS.map((l) => {
                          const on = level === l.id
                          return (
                            <button
                              key={l.id}
                              type="button"
                              role="option"
                              aria-selected={on}
                              onClick={() => {
                                onSetSection(s.id, l.id)
                                setSectionMenu(null)
                              }}
                              className={`flex w-full gap-2.5 rounded-[4px] px-2.5 py-2 ${on ? 'bg-white/[0.08]' : 'hover:bg-white/[0.06]'}`}
                            >
                              <span className="w-3.5 pt-0.5" style={{ color: accent }}>
                                {on && (
                                  <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4.5 10.5l3.5 3.5 7.5-8" />
                                  </svg>
                                )}
                              </span>
                              <span className="flex flex-1 flex-col text-left leading-[17px]">
                                <span className="flex items-center gap-1.5 text-[13px] font-semibold">
                                  {l.id !== 'all' && <LockIcon className="h-[11px] w-[11px] text-[#FCE100]" />}
                                  {l.label}
                                </span>
                                <span className="text-[11px] text-[#C2C2C2]">{l.desc}</span>
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2.5 border-t border-[#3A3A3A] px-5 py-3.5">
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true" className="shrink-0 text-[#C2C2C2]">
            <circle cx="10" cy="10" r="7" />
            <path d="M10 9v5M10 6.2v.2" />
          </svg>
          <span className="flex-1 text-[12px] text-[#C2C2C2]">Все изменения доступа попадают в журнал действий дела</span>
          <button type="button" onClick={onClose} style={{ background: accent, color: onAccent }} className="h-[34px] rounded-[8px] px-[18px] text-[13px] font-semibold hover:brightness-110 active:brightness-95">
            Готово
          </button>
        </div>
      </div>
    </div>
  )
}
