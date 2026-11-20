import { useEffect, useState } from 'react'
import type { CaseAccessMember, CaseAccessState } from '../../../types'
import { CASE_PEOPLE } from '../../../lib/mockData/caseFiles'
import { AccessMembers } from './CaseAccessMembers'
import { SingleDropdown } from './CaseDropdown'
import { ChargesEditor, LeadPicker } from './CaseHeaderEdit'
import { CASE_STATUSES } from './caseStatus'
import type { StaffEntry } from './staffDirectory'

/** «Новое дело»: title, status, classification, lead, charges and who gets
 * access (with roles). The new
 * case gets the standard sections (Участники…Журнал) and opens right away. */

export interface NewCaseData {
  title: string
  status: string
  grif: CaseAccessState['grif']
  lead: { name: string; rank: string }
  charges: [string, string][]
  /** everyone with access, the lead first */
  members: CaseAccessMember[]
}

const GRIFS: { value: CaseAccessState['grif']; label: string }[] = [
  { value: 'normal', label: 'Обычное' },
  { value: 'conf', label: 'Конфиденциально' },
  { value: 'secret', label: 'Секретно' },
]

export function CaseCreateDialog({ onCreate, onClose }: { onCreate: (d: NewCaseData) => void; onClose: () => void }) {
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('Новое')
  const [grif, setGrif] = useState<CaseAccessState['grif']>('normal')
  const [lead, setLead] = useState({ name: 'Thorne Watts', rank: 'Deputy Sheriff (Bonus I)' })
  const [charges, setCharges] = useState<[string, string][]>([])
  const [tried, setTried] = useState(false)
  // access: the lead is always first; the others are picked here
  const [others, setOthers] = useState<CaseAccessMember[]>([])
  const [inviteName, setInviteName] = useState('')
  const [roleMenu, setRoleMenu] = useState<number | null>(null)
  const same = (m: CaseAccessMember, name: string) => m.name === name || CASE_PEOPLE[m.name]?.name === name
  const members: CaseAccessMember[] = [{ name: lead.name, role: 'lead', sub: lead.rank }, ...others]
  function changeLead(s: StaffEntry) {
    const next = { name: s.name, rank: s.sub.split(' · ')[0] ?? '' }
    setOthers((prev) => {
      let list = prev.filter((m) => !same(m, next.name))
      // whoever creates the case keeps managing it when the lead goes to someone else
      if (lead.name === 'Thorne Watts' && next.name !== 'Thorne Watts' && !list.some((m) => same(m, 'Thorne Watts'))) list = [{ name: 'Thorne Watts', role: 'manager', sub: 'Deputy Sheriff (Bonus I) · создал дело' }, ...list]
      return list
    })
    setLead(next)
  }
  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [onClose])
  const titleError = !title.trim() ? 'Укажите, что расследуется' : null
  const create = () => {
    setTried(true)
    if (titleError) return
    onCreate({ title: title.trim(), status, grif, lead, charges, members })
  }
  const field = 'flex flex-col gap-1 text-[12px] font-semibold text-[#C2C2C2]'
  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div role="dialog" aria-label="Новое дело" className="flex max-h-[min(720px,100%)] w-[620px] max-w-full flex-col rounded-[12px] border border-[#3A3A3A] bg-[#2C2C2C] text-white shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
        <div className="flex shrink-0 items-center gap-3 px-5 pb-3 pt-[18px]">
          <span className="flex-1 leading-5">
            <span className="block text-[18px] font-semibold">Новое дело</span>
            <span className="block text-[12px] text-[#C2C2C2]">Номер присвоится автоматически. Разделы дела создадутся сразу.</span>
          </span>
          <button type="button" onClick={onClose} aria-label="Закрыть" className="flex h-8 w-8 items-center justify-center rounded-[6px] hover:bg-white/10">
            <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 pb-4 pt-1">
          <label className={field}>
            Название
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && create()}
              placeholder="Например, кража со взломом, Mirror Park"
              aria-invalid={tried && !!titleError}
              className="h-9 rounded-[6px] bg-[#3A3A3A] px-2.5 text-[14px] font-normal text-white outline-none placeholder:text-[#C2C2C2]/60"
              style={{ boxShadow: tried && titleError ? 'inset 0 0 0 1px #E5484D' : 'none' }}
            />
            {tried && titleError && <span className="font-normal text-[#FF99A4]">{titleError}</span>}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div className={field}>
              Статус
              <span className="font-normal">
                <SingleDropdown label="Статус" options={CASE_STATUSES.map((s) => ({ value: s.status, label: s.status }))} value={status} onChange={setStatus} wide />
              </span>
            </div>
            <div className={field}>
              Гриф
              <span className="font-normal">
                <SingleDropdown label="Гриф" options={GRIFS} value={grif} onChange={(g) => setGrif(g as CaseAccessState['grif'])} wide />
              </span>
            </div>
          </div>
          <div className={field}>
            Ведущий
            <span className="rounded-[6px] bg-[#3A3A3A] px-2.5 py-1.5 font-normal">
              <LeadPicker name={lead.name} onPick={changeLead}>
                <span className="block text-[13px] font-semibold text-white">{lead.name}</span>
                <span className="block text-[12px] text-[#C2C2C2]">{lead.rank}</span>
              </LeadPicker>
            </span>
          </div>
          <div className={field}>
            Статьи <span className="font-normal text-[#9A9A9A]">— можно добавить позже</span>
            <span className="rounded-[6px] bg-[#3A3A3A] px-2.5 py-2 font-normal text-white">
              {charges.length === 0 && <span className="block pb-1 text-[13px] text-[#C2C2C2]">Пока без статей</span>}
              <ChargesEditor charges={charges} onChange={(c) => setCharges(c)} />
            </span>
          </div>
          <div className={field}>
            <span>
              Доступ <span className="font-normal text-[#9A9A9A]">— кто ещё работает по делу; права можно поменять позже</span>
            </span>
            <span className="font-normal">
              <AccessMembers
                members={members}
                accent="#60CDFF"
                onAccent="#000000"
                inviteName={inviteName}
                onInviteNameChange={setInviteName}
                onInvite={(s) => {
                  setOthers((prev) => (prev.some((m) => m.name === s.key) || s.name === lead.name ? prev : [...prev, { name: s.key, role: 'member', sub: s.sub || 'Добавлен при создании' }]))
                  setInviteName('')
                }}
                openRoleMenuIndex={roleMenu}
                onToggleRoleMenu={setRoleMenu}
                onSetRole={(i, role) => {
                  setOthers((prev) => prev.map((m, k) => (k === i - 1 ? { ...m, role } : m)))
                  setRoleMenu(null)
                }}
                onRemoveMember={(i) => {
                  setOthers((prev) => prev.filter((_, k) => k !== i - 1))
                  setRoleMenu(null)
                }}
              />
            </span>
          </div>
        </div>
        <div className="flex shrink-0 items-center justify-end gap-2 border-t border-[#3A3A3A] px-5 py-3.5">
          <button type="button" onClick={onClose} className="h-[34px] rounded-[8px] bg-[#3A3A3A] px-4 text-[13px] hover:brightness-125">
            Отмена
          </button>
          <button type="button" onClick={create} className="h-[34px] rounded-[8px] bg-[#60CDFF] px-4 text-[13px] font-semibold text-black hover:brightness-110">
            Создать дело
          </button>
        </div>
      </div>
    </div>
  )
}
