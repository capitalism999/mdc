import { useEffect, useRef, useState } from 'react'
import type { ModuleContentProps } from '../registry'
import { AGENCY_SHORT, canSeeCase, caseAgency, setCaseFiles, setCaseList, useCases, visibleCaseList, type CaseAddRequest } from './casesStore'
import type { CaseAccessMember, CaseFileDetail, CaseListRow, CaseTreeNode } from '../../../types'
import { CaseFileView } from './CaseFileView'
import { CasesHome } from './CasesHome'
import { CASE_STATUSES } from './caseStatus'
import { CaseCreateDialog, type NewCaseData } from './CaseCreateDialog'
import { showClippedTitle } from '../shared/clippedTitle'
import { mockProfile } from '../../../lib/mockData/profile'

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

/** Records filed anywhere inside top section `id` (Участники, Улики…). */
function sectionCount(tree: CaseTreeNode, id: string): number {
  const count = (n: CaseTreeNode): number => (n.items?.length ?? 0) + (n.children ?? []).reduce((s, c) => s + count(c), 0)
  const sec = tree.children?.find((c) => c.id === id)
  return sec ? count(sec) : 0
}

/**
 * "Дела" module: home list → a case's full file browser (tree of folders,
 * map, journal, access control). New cases are created here too.
 */
export function CasesApp({ initialParams }: ModuleContentProps) {
  // shared with other windows / modules (Заметки)
  const { list: caseList, files: caseFiles, open, add } = useCases()
  const firstAdd = initialParams?.addRequest as CaseAddRequest | undefined
  const [activeId, setActiveId] = useState<string | null>(() => (initialParams?.entityType === 'case' ? (initialParams.entityId as string) : (firstAdd?.caseId ?? null)))
  const [creating, setCreating] = useState(() => !!firstAdd && !firstAdd.caseId)
  /** Поиск → «Добавить в дело»: the record to pre-pick once the case is open */
  const [pendingAdd, setPendingAdd] = useState<CaseAddRequest | null>(() => (firstAdd?.caseId ? firstAdd : null))
  /** …or once the new case («Новое дело») is created */
  const [addAfterCreate, setAddAfterCreate] = useState<CaseAddRequest | null>(() => (firstAdd && !firstAdd.caseId ? firstAdd : null))

  // an add request while this window is already open (a new window got it as initialParams)
  const seenAdd = useRef(Math.max(add?.n ?? 0, firstAdd?.n ?? 0))
  useEffect(() => {
    if (!add || add.n <= seenAdd.current) return
    seenAdd.current = add.n
    if (add.caseId) {
      setCreating(false)
      setActiveId(add.caseId)
      setPendingAdd(add)
    } else {
      setAddAfterCreate(add)
      setCreating(true)
    }
  }, [add])

  /** open the case at a record (Поиск → «Упоминания в делах») */
  const [focusItem, setFocusItem] = useState<{ id: string; n: number } | null>(() => (initialParams?.entityType === 'case' && initialParams.itemId ? { id: String(initialParams.itemId), n: 1 } : null))
  // consumed by the case view on mount / update (child effects run first) — then dropped, so going back to the case later does not jump again
  useEffect(() => {
    if (focusItem) setFocusItem(null)
  }, [focusItem])
  // «open this case» from another app (e.g. a note's linked case); a request
  // older than this window is ignored — a new window gets it as initialParams
  const seenOpen = useRef(open?.n ?? 0)
  useEffect(() => {
    if (!open || open.n <= seenOpen.current) return
    seenOpen.current = open.n
    setActiveId(open.id)
    setCreating(false)
    if (open.itemId) setFocusItem({ id: open.itemId, n: open.n + 1 })
  }, [open])

  /** Status change from inside a case file: updates the file and its home-list
   * row (tag colour + group), and stamps «Изменено» with now / current user. */
  function changeStatus(id: string, status: string) {
    const def = CASE_STATUSES.find((x) => x.status === status)
    if (!def) return
    const { hm, full } = stamp()
    setCaseFiles((prev) => (prev[id] ? { ...prev, [id]: { ...prev[id], status, tone: def.tone, updated: full, updatedBy: mockProfile.name } } : prev))
    setCaseList((prev) => prev.map((r) => (r.id === id ? { ...r, status, tone: def.tone, group: def.group, updated: `сегодня, ${hm}` } : r)))
  }

  /** Edits of the case's own properties (title, lead, charges, related, grif):
   * patches the file and its home-list row, stamps «Изменено». */
  function updateCase(id: string, patch: Partial<Pick<CaseFileDetail, 'title' | 'lead' | 'charges' | 'related'>> & { grif?: CaseListRow['grif'] }) {
    const { hm, full } = stamp()
    const { grif, ...filePatch } = patch
    setCaseFiles((prev) => (prev[id] ? { ...prev, [id]: { ...prev[id], ...filePatch, updated: full, updatedBy: mockProfile.name } } : prev))
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
    const tree = emptyTree(template, no, [{ when: `${dm}, ${hm}`, who: mockProfile.name, action: 'Добавление', where: no, detail: `Дело заведено · статус: ${def.status}` }])
    const short = d.title.length > 34 ? `${d.title.slice(0, 33).trimEnd()}…` : d.title
    const members: CaseAccessMember[] = d.members
    const file: CaseFileDetail = {
      id,
      agency: mockProfile.agency ?? 'lssd',
      no,
      short,
      title: d.title,
      status: def.status,
      tone: def.tone,
      updated: full,
      updatedBy: mockProfile.name,
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
      { id, agency: mockProfile.agency ?? 'lssd', ...(d.grif !== 'normal' ? { grif: d.grif } : {}), no, title: d.title, status: def.status, group: def.group, tone: def.tone, lead: d.lead.name, updated: `сегодня, ${hm}`, ppl: 0, evd: 0, exp: 0, mine: true, recent: true },
      ...prev,
    ])
    setCreating(false)
    setActiveId(id)
    if (addAfterCreate) {
      setPendingAdd({ ...addAfterCreate, caseId: id })
      setAddAfterCreate(null)
    }
  }

  let body
  if (activeId && caseFiles[activeId] && !canSeeCase(activeId)) {
    const f = caseFiles[activeId]
    body = (
      <div className="flex h-full flex-col items-center justify-center gap-2 bg-[#272727] px-6 text-center text-white">
        <div className="text-[16px] font-semibold">{f.no}</div>
        <div className="max-w-[420px] text-[13px] text-[#C2C2C2]">
          Это дело {AGENCY_SHORT[caseAgency(activeId)]}: у вас нет к нему доступа. Доступ выдаёт ведущий дела — попросите его добавить вас в список доступа.
        </div>
        <button type="button" onClick={() => setActiveId(null)} className="mt-2 text-[13px] text-[#8FD8FF] hover:underline">
          Назад ко всем делам
        </button>
      </div>
    )
  } else if (activeId && caseFiles[activeId]) {
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
        onPersist={(part) => {
          setCaseFiles((prev) => (prev[activeId] ? { ...prev, [activeId]: { ...prev[activeId], ...part } } : prev))
          // the home list's people / evidence / expertise counters follow the tree
          const tree = part.tree
          if (tree) setCaseList((prev) => prev.map((r) => (r.id === activeId ? { ...r, ppl: sectionCount(tree, 'ppl'), evd: sectionCount(tree, 'evd'), exp: sectionCount(tree, 'exp') } : r)))
        }}
        onNewCase={() => setCreating(true)}
        pendingAdd={pendingAdd && pendingAdd.caseId === activeId ? pendingAdd : null}
        focusItem={focusItem}
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
    body = <CasesHome cases={visibleCaseList(caseList)} onOpenCase={setActiveId} onNewCase={() => setCreating(true)} />
  }

  return (
    // keyboard focus shows an accent ring on every button of the app
    <div onMouseOver={showClippedTitle} className="relative h-full [&_[role=button]:focus-visible]:outline-2 [&_[role=button]:focus-visible]:outline-offset-1 [&_[role=button]:focus-visible]:outline-[#60CDFF] [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-offset-1 [&_button:focus-visible]:outline-[#60CDFF]">
      {body}
      {creating && (
        <CaseCreateDialog
          onCreate={createCase}
          onClose={() => {
            setCreating(false)
            setAddAfterCreate(null)
          }}
        />
      )}
    </div>
  )
}
