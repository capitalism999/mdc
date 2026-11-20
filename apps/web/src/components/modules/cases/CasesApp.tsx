import { useEffect, useRef, useState } from 'react'
import type { ModuleContentProps } from '../registry'
import { setCaseFiles, setCaseList, useCases } from './casesStore'
import type { CaseAccessMember, CaseFileDetail, CaseListRow, CaseTreeNode } from '../../../types'
import { CaseFileView } from './CaseFileView'
import { CasesHome } from './CasesHome'
import { CASE_STATUSES } from './caseStatus'
import { CaseCreateDialog, type NewCaseData } from './CaseCreateDialog'

function stamp() {
  const now = new Date()
  const p2 = (n: number) => String(n).padStart(2, '0')
  const hm = `${p2(now.getHours())}:${p2(now.getMinutes())}`
  return { hm, full: `${p2(now.getDate())}.${p2(now.getMonth() + 1)}.${now.getFullYear()}, ${hm}`, date: `${p2(now.getDate())}.${p2(now.getMonth() + 1)}.${now.getFullYear()}`, dm: `${p2(now.getDate())}.${p2(now.getMonth() + 1)}` }
}

/** Empty copy of a case's section structure (same sections and subfolders,
 * no records), with a fresh journal — the skeleton of a new case. */
function emptyTree(from: CaseTreeNode | undefined, no: string, log: CaseTreeNode['log']): CaseTreeNode {
  const strip = (n: CaseTreeNode): CaseTreeNode => ({ id: n.id, name: n.name, color: n.color, desc: n.desc, view: n.view, children: n.children?.map(strip), items: n.view === 'log' ? undefined : [], log: n.view === 'log' ? log : undefined })
  return { id: 'root', name: no, children: (from?.children ?? []).map(strip) }
}

/**
 * "Дела" module: home list → a case's full file browser (tree of folders,
 * map, journal, access control). New cases are created here too.
 */
export function CasesApp({ initialParams }: ModuleContentProps) {
  // shared with other windows / modules (Заметки)
  const { list: caseList, files: caseFiles, open } = useCases()
  const [activeId, setActiveId] = useState<string | null>(() => (initialParams?.entityType === 'case' ? (initialParams.entityId as string) : null))
  const [creating, setCreating] = useState(false)

  // «open this case» from another app (e.g. a note's linked case); a request
  // older than this window is ignored — a new window gets it as initialParams
  const seenOpen = useRef(open?.n ?? 0)
  useEffect(() => {
    if (!open || open.n <= seenOpen.current) return
    seenOpen.current = open.n
    setActiveId(open.id)
  }, [open])

  /** Status change from inside a case file: updates the file and its home-list
   * row (tag colour + group), and stamps «Изменено» with now / current user. */
  function changeStatus(id: string, status: string) {
    const def = CASE_STATUSES.find((x) => x.status === status)
    if (!def) return
    const { hm, full } = stamp()
    setCaseFiles((prev) => (prev[id] ? { ...prev, [id]: { ...prev[id], status, tone: def.tone, updated: full, updatedBy: 'Thorne Watts' } } : prev))
    setCaseList((prev) => prev.map((r) => (r.id === id ? { ...r, status, tone: def.tone, group: def.group, updated: `сегодня, ${hm}` } : r)))
  }

  /** Edits of the case's own properties (title, lead, charges, related, grif):
   * patches the file and its home-list row, stamps «Изменено». */
  function updateCase(id: string, patch: Partial<Pick<CaseFileDetail, 'title' | 'lead' | 'charges' | 'related'>> & { grif?: CaseListRow['grif'] }) {
    const { hm, full } = stamp()
    const { grif, ...filePatch } = patch
    setCaseFiles((prev) => (prev[id] ? { ...prev, [id]: { ...prev[id], ...filePatch, updated: full, updatedBy: 'Thorne Watts' } } : prev))
    setCaseList((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, ...(patch.title ? { title: patch.title } : {}), ...(patch.lead ? { lead: patch.lead.name } : {}), ...('grif' in patch ? { grif } : {}), updated: `сегодня, ${hm}` }
          : r,
      ),
    )
  }

  /** «Новое дело»: next LS-2026-#### number, standard sections, the lead (and
   * the creator, as administrator) in its access list; opens it. */
  function createCase(d: NewCaseData) {
    const { hm, full, date, dm } = stamp()
    const def = CASE_STATUSES.find((x) => x.status === d.status) ?? CASE_STATUSES[0]
    const nums = Object.values(caseFiles)
      .map((c) => /^LS-2026-(\d{4})$/.exec(c.no)?.[1])
      .filter(Boolean)
      .map(Number)
    const no = `LS-2026-${String((nums.length ? Math.max(...nums) : 900) + 1).padStart(4, '0')}`
    const id = `n${Date.now()}`
    const template = Object.values(caseFiles)[0]?.tree
    const tree = emptyTree(template, no, [{ when: `${dm}, ${hm}`, who: 'Thorne Watts', action: 'Добавление', where: no, detail: `Дело заведено · статус: ${def.status}` }])
    const short = d.title.length > 34 ? `${d.title.slice(0, 33).trimEnd()}…` : d.title
    const members: CaseAccessMember[] = d.members
    const file: CaseFileDetail = {
      id,
      no,
      short,
      title: d.title,
      status: def.status,
      tone: def.tone,
      updated: full,
      updatedBy: 'Thorne Watts',
      meta: [['Открыто', date]],
      lead: d.lead,
      charges: d.charges,
      pinned: null,
      recent: [],
      tree,
      access: { grif: d.grif, members, sections: {} },
      notes: {},
    }
    setCaseFiles((prev) => ({ ...prev, [id]: file }))
    setCaseList((prev) => [
      { id, ...(d.grif !== 'normal' ? { grif: d.grif } : {}), no, title: d.title, status: def.status, group: def.group, tone: def.tone, lead: d.lead.name, updated: `сегодня, ${hm}`, ppl: 0, evd: 0, exp: 0, mine: true, recent: true },
      ...prev,
    ])
    setCreating(false)
    setActiveId(id)
  }

  let body
  if (activeId && caseFiles[activeId]) {
    const detail = caseFiles[activeId]
    const openCases = Object.values(caseFiles).map((c) => ({ id: c.id, no: c.no, short: c.short, tone: c.tone }))
    body = (
      <CaseFileView
        key={activeId}
        detail={detail}
        openCases={openCases}
        onSwitchCase={setActiveId}
        onBackToHome={() => setActiveId(null)}
        onChangeStatus={(st) => changeStatus(activeId, st)}
        onUpdateCase={(p) => updateCase(activeId, p)}
        onPersist={(part) => setCaseFiles((prev) => (prev[activeId] ? { ...prev, [activeId]: { ...prev[activeId], ...part } } : prev))}
        onNewCase={() => setCreating(true)}
      />
    )
  } else if (activeId) {
    const row = caseList.find((c) => c.id === activeId)
    body = (
      <div className="flex h-full flex-col items-center justify-center gap-2 bg-[#272727] text-center text-white">
        <div className="text-[16px] font-semibold">{row ? row.no : 'Дело'}</div>
        <div className="text-[13px] text-[#C2C2C2]">Файл дела ещё не заведён в системе.</div>
        <button type="button" onClick={() => setActiveId(null)} className="mt-2 text-[13px] text-[#8FD8FF] hover:underline">
          Назад ко всем делам
        </button>
      </div>
    )
  } else {
    body = <CasesHome cases={caseList} onOpenCase={setActiveId} onNewCase={() => setCreating(true)} />
  }

  return (
    <div className="relative h-full">
      {body}
      {creating && <CaseCreateDialog onCreate={createCase} onClose={() => setCreating(false)} />}
    </div>
  )
}
