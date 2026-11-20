import { useEffect, useMemo, useRef, useState } from 'react'
import type { CaseAccessRole, OfficerNote } from '../../../types'
import { myCaseRole, useCases } from '../cases/casesStore'
import { caseFolderOptions, findAttachedNote } from '../cases/caseNoteAttach'
import { LinkCaseIcon } from './icons'

const ROLE_LABEL: Record<CaseAccessRole, string> = { lead: 'Ведущий', manager: 'Администратор', member: 'Участник', observer: 'Наблюдатель', viewer: 'Только просмотр' }
const ROLE_ORDER: Record<CaseAccessRole, number> = { lead: 0, manager: 1, member: 2, observer: 3, viewer: 4 }
const GRIF: Record<string, { label: string; fg: string; bg: string }> = {
  conf: { label: 'Конфиденциально', fg: '#FCE100', bg: 'rgba(255,185,0,0.16)' },
  secret: { label: 'Секретно', fg: '#FF99A4', bg: 'rgba(232,17,35,0.2)' },
}

/** Cases of «Дела» the current user has access to, theirs (lead / admin) first. */
export function useMyCases() {
  const { list, files } = useCases()
  return useMemo(
    () =>
      list
        .map((row) => ({ row, role: myCaseRole(files[row.id]) }))
        .filter((x): x is { row: typeof x.row; role: CaseAccessRole } => x.role !== null)
        .sort((a, b) => ROLE_ORDER[a.role] - ROLE_ORDER[b.role]),
    [list, files],
  )
}

const Check = () => (
  <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4.5 10.5l3.5 3.5 7.5-8" />
  </svg>
)

const FolderGlyph = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" aria-hidden="true">
    <path d="M2.5 5.5v10h15v-8h-7l-2-2z" />
  </svg>
)

/** «Прикрепить к делу»: pick a case, then the folder the note is filed into
 * (it shows up there as a file). Also: where it is now, open the case,
 * take it out. */
export function NoteCaseMenu({ note, onLink, onOpen }: { note: OfficerNote; onLink: (caseId: string | undefined, folderId?: string) => void; onOpen: (id: string) => void }) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  /** step 2: the case whose folders are shown */
  const [caseId, setCaseId] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const mine = useMyCases()
  const { list, files } = useCases()
  const linked = note.linkedCaseId ? list.find((r) => r.id === note.linkedCaseId) : undefined
  const where = linked && files[linked.id] ? findAttachedNote(files[linked.id].tree, note.id) : null

  useEffect(() => {
    if (!open) return
    const down = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', down)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', down)
      document.removeEventListener('keydown', esc)
    }
  }, [open])

  const s = q.trim().toLowerCase()
  const shown = mine.filter(({ row }) => !s || `${row.no} ${row.title}`.toLowerCase().includes(s))
  const stepCase = caseId ? list.find((r) => r.id === caseId) : undefined
  const folders = caseId && files[caseId] ? caseFolderOptions(files[caseId].tree) : []
  const shownFolders = folders.filter((f) => !s || f.path.toLowerCase().includes(s))

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v)
          setQ('')
          setCaseId(null)
        }}
        aria-label={linked ? `Прикреплено к делу ${linked.no}` : 'Прикрепить к делу'}
        aria-expanded={open}
        title={linked ? `В деле ${linked.no}${where ? ` › ${where.path}` : ''}` : 'Прикрепить к делу'}
        className={`flex h-9 items-center gap-1.5 rounded-[6px] px-2 hover:bg-white/10 ${open ? 'bg-white/10' : ''}`}
        style={{ color: linked ? '#F2F2F2' : undefined }}
      >
        <LinkCaseIcon />
        {linked && <span className="text-[13px]">{linked.no}</span>}
      </button>
      {open && (
        <div role="dialog" aria-label="Прикрепить к делу" className="absolute right-0 top-10 z-20 flex w-[380px] flex-col rounded-[8px] border border-[#363636] bg-[#2C2C2C] text-[#F2F2F2] shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
          <div className="px-3 pb-2 pt-3">
            <div className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold">
              {stepCase && (
                <button
                  type="button"
                  onClick={() => {
                    setCaseId(null)
                    setQ('')
                  }}
                  aria-label="Назад к делам"
                  className="-ml-1 flex h-6 w-6 items-center justify-center rounded-[4px] text-[#B4B4B4] hover:bg-white/10 hover:text-white"
                >
                  <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12.5 4.5L7 10l5.5 5.5" />
                  </svg>
                </button>
              )}
              <span className="min-w-0 flex-1 truncate">{stepCase ? `В какую папку ${stepCase.no}?` : 'Прикрепить к делу'}</span>
            </div>
            <label className="flex h-8 items-center gap-2 rounded-[6px] bg-[#3A3A3A] px-2.5 text-[#B4B4B4] focus-within:shadow-[inset_0_-2px_0_#60CDFF]">
              <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
                <circle cx="8.5" cy="8.5" r="5" />
                <path d="M12.5 12.5l4.5 4.5" />
              </svg>
              <input key={caseId ?? 'cases'} autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={stepCase ? 'Найти папку' : 'Номер или название дела'} aria-label={stepCase ? 'Найти папку' : 'Найти дело'} className="min-w-0 flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-[#B4B4B4]" />
            </label>
          </div>

          <div className="scroll max-h-[300px] overflow-y-auto px-1.5 pb-1.5">
            {!stepCase && (
              <>
                {shown.length === 0 && <div className="px-2.5 py-3 text-[13px] text-[#B4B4B4]">{mine.length === 0 ? 'У вас нет доступа ни к одному делу' : 'Ничего не найдено'}</div>}
                {shown.map(({ row, role }) => {
                  const on = row.id === note.linkedCaseId
                  const g = row.grif ? GRIF[row.grif] : null
                  return (
                    <button
                      key={row.id}
                      type="button"
                      onClick={() => {
                        setCaseId(row.id)
                        setQ('')
                      }}
                      className={`flex w-full items-center gap-2.5 rounded-[4px] px-2.5 py-2 text-left ${on ? 'bg-white/[0.08]' : 'hover:bg-white/[0.06]'}`}
                    >
                      <span className="w-3.5 shrink-0 text-[#60CDFF]">{on && <Check />}</span>
                      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className="flex items-center gap-1.5 whitespace-nowrap">
                          <span className="shrink-0 text-[13px] font-semibold">{row.no}</span>
                          {g && (
                            <span className="shrink-0 rounded-full px-1.5 text-[10px] leading-4" style={{ background: g.bg, color: g.fg }}>
                              {g.label}
                            </span>
                          )}
                          <span className="ml-auto shrink-0 text-[11px] text-[#B4B4B4]">{ROLE_LABEL[role]}</span>
                        </span>
                        <span className="truncate text-[12px] text-[#B4B4B4]" title={row.title}>
                          {row.title}
                        </span>
                      </span>
                      <svg width="10" height="10" viewBox="0 0 20 20" fill="none" stroke="#B4B4B4" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden="true">
                        <path d="M7.5 4.5L13 10l-5.5 5.5" />
                      </svg>
                    </button>
                  )
                })}
              </>
            )}
            {stepCase && (
              <>
                {shownFolders.length === 0 && <div className="px-2.5 py-3 text-[13px] text-[#B4B4B4]">Папок не найдено</div>}
                {shownFolders.map((fo) => {
                  const here = where?.folderId === fo.id && note.linkedCaseId === stepCase.id
                  return (
                    <button
                      key={fo.id}
                      type="button"
                      disabled={here}
                      onClick={() => {
                        onLink(stepCase.id, fo.id)
                        setOpen(false)
                      }}
                      className={`flex w-full items-center gap-2 rounded-[4px] py-1.5 pr-2.5 text-left text-[13px] disabled:cursor-default ${here ? 'bg-white/[0.08]' : 'hover:bg-white/[0.06]'}`}
                      style={{ paddingLeft: 10 + (s ? 0 : fo.depth * 18) }}
                    >
                      <span className="text-[#B4B4B4]">
                        <FolderGlyph />
                      </span>
                      <span className="min-w-0 flex-1 truncate">{s ? fo.path : fo.path.split(' › ').pop()}</span>
                      {here && <span className="shrink-0 text-[11px] text-[#60CDFF]">Здесь</span>}
                    </button>
                  )
                })}
              </>
            )}
          </div>

          <div className="flex items-center gap-1 border-t border-[#363636] px-1.5 py-1.5">
            {linked ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onOpen(linked.id)
                    setOpen(false)
                  }}
                  title={where ? `${linked.no} › ${where.path}` : linked.no}
                  className="flex h-8 min-w-0 items-center gap-1.5 rounded-[4px] px-2.5 text-[13px] text-[#F2F2F2] hover:bg-white/[0.08]"
                >
                  <span className="truncate">Открыть: {linked.no}{where ? ` › ${where.path}` : ''}</span>
                  <svg width="11" height="11" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden="true">
                    <path d="M8 4h8v8M16 4L5 15" />
                  </svg>
                </button>
                <span className="flex-1" />
                <button
                  type="button"
                  onClick={() => {
                    onLink(undefined)
                    setOpen(false)
                  }}
                  className="h-8 shrink-0 rounded-[4px] px-2.5 text-[13px] text-[#FF99A4] hover:bg-[rgba(232,17,35,0.14)]"
                >
                  Открепить
                </button>
              </>
            ) : (
              <span className="px-2.5 py-1.5 text-[11px] text-[#B4B4B4]">{stepCase ? 'Заметка появится в выбранной папке как файл' : 'Показаны дела, к которым у вас есть доступ'}</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
