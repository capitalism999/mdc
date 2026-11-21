import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useWindowManager } from '../../../windows/WindowManagerContext'
import { apps } from '../../../data/apps'
import { CASE_LINKS, CASE_PEOPLE } from '../../../lib/mockData/caseFiles'
import type { CaseAccessMember, CaseAccessRole, CaseAccessState, CaseFileDetail, CaseLogRow, CasePlaceArea, CaseNote, CasePinned, CasePlaceLink, CasePlaceType, CaseTone, CaseTreeItem, CaseTreeNode } from '../../../types'
import { CasePinnedWidget, type PinDraft } from './CasePinnedWidget'
import { CaseAccessDialog, SECTION_LEVELS } from './CaseAccessDialog'
import { ROLE_LABEL } from './CaseAccessMembers'
import { CaseInspector, type InspectorNote } from './CaseInspector'
import { CasePlacesView } from './CasePlacesView'
import { nearestPlace, useElementSize } from '../shared/sanAndreasMap'
import { PLACE_TYPE_LABEL, areaLabel, placeArea, boloPinsFor, nowStamp, placeAuthorHints, placeWhen, placesLinkedTo } from './casePlaces'
import { readImages } from './CasePhotos'
import { ChargesEditor, EditableTitle, LeadPicker, RelatedEditor } from './CaseHeaderEdit'
import { SingleDropdown, useDismiss } from './CaseDropdown'
import { mockBolos } from '../../../lib/mockData/bolos'
import { requestOpenBolo } from '../bolo/boloRequests'
import type { AutoLinks } from './CaseInspector'
import { buildRefIndex, findItemWithFolder, linkOptions, renderRefs, type CaseRef } from './caseRefs'
import { CaseStatusMenu } from './caseStatus'
import { addFolder, addItem, appendLog, mapNode, deleteFolder, findItem as treeFindItem, findLogNode, isSystemFolder, itemPath, moveItem, NEW_SECTION_COLORS, removeItem, renameFolder, updateItem } from './caseTreeOps'
import { MoveItemDialog, RemoveItemDialog } from './CaseItemActions'
import { CaseActivityLog, RecentActivity } from './CaseActivityLog'
import { CaseAddEntityDialog } from './CaseAddEntityDialog'
import { CaseAddRecordDialog, type RecordKind } from './CaseAddRecordDialog'
import type { CaseAddKind } from './casesStore'
import { setNotes } from '../notes/notesStore'
import { CaseEventDialog, sortEvents, type EventDraft } from './CaseEventDialog'
import { AddFolderButton, DeleteFolderDialog, FolderMenu, FolderTile, NameInput, NewFolderTile, NoFoldersHint, type FolderMenuProps } from './CaseFolderUi'
import type { StaffEntry } from './staffDirectory'
import { findMdc, mdcIdByTitle } from './caseMdc'
import { ownPhoto } from '../shared/personPhotos'
import { BackArrowIcon, CaseFolderIcon, ChevronDownIcon, ChevronRightIcon, InfoPaneIcon, KindIcon, LockIcon, PanelSplitIcon, PeopleIcon, PlusIcon, RootIcon } from './icons'
import { mockProfile } from '../../../lib/mockData/profile'

const ACCENT = '#60CDFF'
const ON_ACCENT = '#000000'
const TONE: Record<string, { bg: string; fg: string }> = {
  red: { bg: 'rgba(232,17,35,0.2)', fg: '#FF99A4' },
  amber: { bg: 'rgba(255,185,0,0.16)', fg: '#FCE100' },
  green: { bg: 'rgba(16,124,16,0.28)', fg: '#6CCB5F' },
  grey: { bg: 'rgba(255,255,255,0.08)', fg: '#C8C8C8' },
  blue: { bg: 'rgba(0,120,212,0.25)', fg: '#99D9FF' },
}
const KC: Record<string, string> = { evidence: '#B26A00', media: '#B4009E', exam: '#7A57B0', doc: '#03787C', event: '#5C6B70', vehicle: '#C25A1C', place: '#2E8B57', surv: '#B83B5E', note: '#B8860B' }
const TYPE_LABEL: Record<string, string> = { vehicle: 'Транспорт', place: 'Место', surv: 'Наблюдение', evidence: 'Вещдок', media: 'Медиа', exam: 'Экспертиза', doc: 'Документ', event: 'Событие', note: 'Заметка' }

/** Subtitle of a record: its «Роль» field when it has one (so the list, the
 * card header and the field never disagree), else the stored subtitle. */
function itemSubtitle(it: CaseTreeItem) {
  return it.info.find(([k]) => k === 'Роль')?.[1] ?? it.sub
}

/** Records filed in a folder and its subfolders (journal rows are not records). */
function countNode(n: CaseTreeNode): number {
  let s = n.items?.length ?? 0
  for (const ch of n.children ?? []) s += countNode(ch)
  return s
}
/** The number shown next to a folder: its records, or the journal's row count. */
function badgeCount(n: CaseTreeNode): number {
  return n.view === 'log' ? (n.log?.length ?? 0) : countNode(n)
}
function findPath(n: CaseTreeNode, id: string, path: CaseTreeNode[] = []): CaseTreeNode[] | null {
  const p = [...path, n]
  if (n.id === id) return p
  for (const ch of n.children ?? []) {
    const r = findPath(ch, id, p)
    if (r) return r
  }
  return null
}
function findItem(n: CaseTreeNode, id: string): boolean {
  if ((n.items ?? []).some((it) => it.id === id)) return true
  return (n.children ?? []).some((ch) => findItem(ch, id))
}
/** Sections that are still being built: shown, but only as folders for now. */
const WIP_SECTIONS = new Set(['evd', 'srv', 'exp', 'doc'])

function WipBadge({ short = false }: { short?: boolean }) {
  return (
    <span title="Раздел ещё в разработке" className="shrink-0 whitespace-nowrap rounded-[10px] px-2 py-[1px] text-[11px] font-semibold" style={{ background: 'rgba(255,185,0,0.16)', color: '#FCE100' }}>
      {short ? 'скоро' : 'В разработке'}
    </span>
  )
}

function plural(n: number) {
  const a = n % 10
  const b = n % 100
  if (a === 1 && b !== 11) return `${n} запись`
  if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return `${n} записи`
  return `${n} записей`
}

function Linkified({ text, exclude, tree, refIdx, onGo, onOpenBolo }: { text: string; exclude: string; tree: CaseTreeNode; refIdx: Map<string, CaseRef>; onGo: (folderId: string, itemId: string) => void; onOpenBolo: (no?: string) => void }) {
  // Names / addresses → case records (CASE_LINKS); record numbers and plates
  // are resolved live against the case's records (caseRefs).
  const candidates = CASE_LINKS.filter((l) => l[2] !== exclude && !/^(?:SW|W|R|E|BAL|FP|VID|DNA|B)-\d|^\d[A-Z]{3}\d{3}$/.test(l[0]) && findPath(tree, l[1]) && findItem(tree, l[2]))
  function plain(chunk: string, k: number): ReactNode {
    const parts: ReactNode[] = []
    let rest = chunk
    let guard = 0
    while (rest.length && guard < 20) {
      guard += 1
      let best: (typeof CASE_LINKS)[number] | null = null
      let bi = -1
      for (const l of candidates) {
        const i = rest.indexOf(l[0])
        if (i >= 0 && (bi < 0 || i < bi || (i === bi && l[0].length > (best?.[0].length ?? 0)))) {
          best = l
          bi = i
        }
      }
      if (!best) {
        parts.push(rest)
        break
      }
      if (bi > 0) parts.push(rest.slice(0, bi))
      const [matchText, folderId, itemId] = best
      parts.push(
        <button key={parts.length} type="button" onClick={() => onGo(folderId, itemId)} className="inline text-[13px] text-[#8FD8FF] underline decoration-[rgba(143,216,255,0.45)] underline-offset-[3px]">
          {matchText}
        </button>,
      )
      rest = rest.slice(bi + matchText.length)
    }
    return <Fragment key={k}>{parts}</Fragment>
  }
  return <>{renderRefs(text, refIdx, { exclude, onGo, onOpenBolo, renderPlain: plain })}</>
}

/** «DD.MM, HH:MM» — the stamp record comments use. */
function dayStamp() {
  const d = new Date()
  const p2 = (n: number) => String(n).padStart(2, '0')
  return `${p2(d.getDate())}.${p2(d.getMonth() + 1)}, ${p2(d.getHours())}:${p2(d.getMinutes())}`
}

/** Display name of an access member ('@…' = group, else CASE_PEOPLE alias). */
function memberName(name: string) {
  return name.startsWith('@') ? name.slice(1) : (CASE_PEOPLE[name]?.name ?? name)
}

type AddKind = 'place' | 'person' | 'vehicle' | 'event'

const PLACE_TYPE_NAMES: Record<CasePlaceType, string> = { crime: 'Место преступления', home: 'Жильё', find: 'Находка', seen: 'Замечен', witness: 'Показания', other: 'Другое' }

function pluralRu(n: number, one: string, few: string, many: string) {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return one
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few
  return many
}

const GRIF_INFO: Record<CaseAccessState['grif'], [string, string]> = {
  normal: ['Обычное', '#6CCB5F'],
  conf: ['Конфиденциально', '#FCE100'],
  secret: ['Секретно', '#FF99A4'],
}

/** Overview property values (right pane). */
function PersonValue({ name, renderLinkedText }: { name: string; renderLinkedText: (t: string) => ReactNode }) {
  const pp = CASE_PEOPLE[name]
  const photo = ownPhoto(mdcIdByTitle(name), name)
  return (
    <span className="inline-flex max-w-full items-center justify-end gap-1.5 whitespace-nowrap">
      {photo ? (
        <img src={photo} alt="" className="h-5 w-5 shrink-0 rounded-full object-cover object-top" draggable={false} />
      ) : (
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold text-white" style={{ background: pp?.color ?? '#5C6B70' }}>
          {pp?.initials ?? name.replace(/[^A-ZА-Я]/g, '').slice(0, 2)}
        </span>
      )}
      <span className="truncate">{renderLinkedText(name)}</span>
    </span>
  )
}

function TwoLine({ main, sub }: { main: ReactNode; sub: ReactNode }) {
  return (
    <span className="flex flex-col items-end leading-[18px]">
      <span>{main}</span>
      <span className="text-[12px] text-[#C2C2C2]">{sub}</span>
    </span>
  )
}

interface CaseFileViewProps {
  detail: CaseFileDetail
  openCases: { id: string; no: string; short: string; tone: string }[]
  onSwitchCase: (id: string) => void
  onBackToHome: () => void
  onChangeStatus: (status: string) => void
  /** silent save of in-file state (no «Изменено» stamp) */
  onNewCase: () => void
  onPersist: (part: Partial<Pick<CaseFileDetail, 'tree' | 'access' | 'pinned' | 'notes'>>) => void
  onUpdateCase: (patch: Partial<Pick<CaseFileDetail, 'title' | 'lead' | 'charges' | 'related'>> & { grif?: 'conf' | 'secret' }) => void
  /** «Добавить в дело» from Поиск: open «Добавить участника / транспорт» with this MDC record picked */
  pendingAdd?: { recId: string; kind: CaseAddKind; n: number } | null
  /** open the case right at this record: its folder, the inspector open (Поиск → «Упоминания в делах») */
  focusItem?: { id: string; n: number } | null
}

/**
 * One case's file browser: tree sidebar + toolbar + main content (overview
 * / sub-folder grid / items list / map / log) + inspector pane + access
 * dialog. Re-mounted (via a `key={caseId}` in the parent) whenever the
 * active case changes, so every piece of in-progress UI state below resets
 * to that case's overview — a deliberate simplification of the reference's
 * per-tab-persistent state, not an oversight.
 */
export function CaseFileView({ detail, openCases, onSwitchCase, onBackToHome, onChangeStatus, onUpdateCase, onPersist, onNewCase, pendingAdd, focusItem }: CaseFileViewProps) {
  const { openWindow } = useWindowManager()
  // Pinned announcement per case: undefined = untouched (use the case's own).
  const [pinnedById, setPinnedById] = useState<Record<string, CasePinned | null>>({})
  const [pinEdit, setPinEdit] = useState<PinDraft | null>(null)
  const pinned = detail.id in pinnedById ? pinnedById[detail.id] : detail.pinned
  useEffect(() => setPinEdit(null), [detail.id])
  const [folderId, setFolderId] = useState('root')
  const [itemId, setItemId] = useState<string | null>(null)
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({ root: true, ppl: true, evd: true, exp: true })
  /** place being re-positioned via «Переставить на карте» */
  const [repositionId, setRepositionId] = useState<string | null>(null)
  const [placing, setPlacing] = useState(false)
  const [draftPin, setDraftPin] = useState<{ x: number; y: number } | null>(null)
  const [draft, setDraft] = useState('')
  const [replyTo, setReplyTo] = useState<{ itemId: string; path: number[]; name: string } | null>(null)
  const [access, setAccess] = useState<CaseAccessState>(detail.access)
  const [pane, setPane] = useState(true)
  const [sidebarHidden, setSidebarHidden] = useState(false)
  // Narrow windows: below 1200 px the inspector, below 1000 px the folder tree
  // become drawers over the content instead of fixed columns.
  const rootRef = useRef<HTMLDivElement>(null)
  const { w: rootW } = useElementSize(rootRef)
  const narrowPane = rootW > 0 && rootW < 1200
  const narrowTree = rootW > 0 && rootW < 1000
  /** a jump to a record (focusItem) keeps its inspector open even once the window turns out narrow */
  const focusOpen = useRef(false)
  useEffect(() => {
    setPane(!narrowPane || focusOpen.current)
    if (narrowPane) focusOpen.current = false
  }, [narrowPane])
  useEffect(() => setSidebarHidden(narrowTree), [narrowTree])
  const [addMenu, setAddMenu] = useState(false)
  const addMenuRef = useDismiss(addMenu, () => setAddMenu(false))
  const [accessOpen, setAccessOpen] = useState(false)
  const [roleMenuIndex, setRoleMenuIndex] = useState<number | null>(null)
  const [inviteName, setInviteName] = useState('')
  const [caseMenuOpen, setCaseMenuOpen] = useState(false)
  const caseMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!caseMenuOpen) return
    function onDown(e: MouseEvent) {
      if (caseMenuRef.current && !caseMenuRef.current.contains(e.target as Node)) setCaseMenuOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [caseMenuOpen])

  // The folder tree is editable (create / rename / delete folders); the case
  // view is keyed by case id, so this state is per case.
  const [tree, setTree] = useState<CaseTreeNode>(detail.tree)
  // Keep this case's edits (tree + journal, access, pinned note) when the
  // view unmounts — leaving to the list and coming back restores them.
  const firstPersist = useRef(true)
  // the tree as last exchanged with the shared store: a different one coming
  // in is an outside change (e.g. a note filed here from «Заметки»)
  const syncedTree = useRef(detail.tree)
  useEffect(() => {
    if (detail.tree === syncedTree.current) return
    syncedTree.current = detail.tree
    setTree(detail.tree)
  }, [detail.tree])
  useEffect(() => {
    if (firstPersist.current) {
      firstPersist.current = false
      return
    }
    syncedTree.current = tree
    onPersist({ tree, access, pinned })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tree, access, pinned])
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [creatingIn, setCreatingIn] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<{ id: string; parentId: string } | null>(null)
  const [addKind, setAddKind] = useState<'person' | 'vehicle' | null>(null)
  /** MDC record to pre-pick in the add dialog (Поиск → «Добавить в дело») */
  const [addPick, setAddPick] = useState<string | null>(null)
  const seenAdd = useRef(0)
  useEffect(() => {
    if (!pendingAdd || pendingAdd.n <= seenAdd.current) return
    seenAdd.current = pendingAdd.n
    const k = pendingAdd.kind
    if (k === 'person' || k === 'vehicle') {
      go(k === 'person' ? 'ppl' : 'veh')
      setAddPick(pendingAdd.recId)
      setAddKind(k)
    } else {
      // property → Места, weapon → Улики, organisation → Участники
      go(k === 'place' ? 'plc' : k === 'weapon' ? 'evd' : 'ppl')
      setRecAdd({ kind: k, recId: pendingAdd.recId })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingAdd])
  /** Поиск → «Добавить в дело» for a property / weapon / organisation */
  const [recAdd, setRecAdd] = useState<{ kind: RecordKind; recId: string } | null>(null)
  // «Упоминания в делах» → open at the record
  const seenFocus = useRef(0)
  useEffect(() => {
    if (!focusItem || focusItem.n <= seenFocus.current) return
    seenFocus.current = focusItem.n
    const found = findItemWithFolder(tree, focusItem.id)
    if (!found) return
    go(found.folderId)
    setItemId(found.item.id)
    setPane(true)
    focusOpen.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusItem])
  /** «Хронология»: 'new' or the id of the event being edited */
  const [eventDialog, setEventDialog] = useState<string | null>(null)

  /** Case property edit: updates the case (and its list row) + journal. */
  function editCase(patch: Parameters<typeof onUpdateCase>[0], change: string) {
    onUpdateCase(patch)
    setTree((t) => appendLog(t, { action: 'Изменение', where: detail.no, detail: change }))
  }

  function setLeadAction(s: StaffEntry) {
    const rank = s.sub.split(' · ')[0] || ''
    editCase({ lead: { name: s.name, rank } }, 'Ведущий: ' + detail.lead.name + ' → ' + s.name)
    // the access list follows: the old lead stays on as administrator, the new
    // one becomes «Ведущий» (added if they had no access yet)
    setAccess((prev) => {
      const isNew = (m: CaseAccessMember) => m.name === s.key || memberName(m.name) === s.name
      const members = prev.members.map((m) => (isNew(m) ? { ...m, role: 'lead' as const } : m.role === 'lead' ? { ...m, role: 'manager' as const } : m))
      return { ...prev, members: members.some(isNew) ? [...members.filter(isNew), ...members.filter((m) => !isNew(m))] : [{ name: s.key, role: 'lead', sub: s.sub }, ...members] }
    })
  }

  function setStatusAction(status: string) {
    if (status === detail.status) return
    onChangeStatus(status)
    setTree((t) => appendLog(t, { action: 'Изменение', where: detail.no, detail: `Статус дела: ${detail.status} → ${status}` }))
  }

  function setGrifAction(g: CaseAccessState['grif']) {
    if (g === access.grif) return
    setAccess((prev) => ({ ...prev, grif: g }))
    editCase({ grif: g === 'normal' ? undefined : g }, 'Гриф: ' + GRIF_INFO[access.grif][0] + ' → ' + GRIF_INFO[g][0])
  }

  // zone being edited in a place card — shared with the map (drag handle)
  const [areaDraft, setAreaDraft] = useState<(CasePlaceArea & { id: string }) | null>(null)
  const [removingItemId, setRemovingItemId] = useState<string | null>(null)
  const [movingItemId, setMovingItemId] = useState<string | null>(null)

  function itemWhere(t: CaseTreeNode, id: string, title: string) {
    return [...(itemPath(t, id) ?? []), title].join(' › ')
  }

  function confirmRemoveItem() {
    const id = removingItemId
    if (!id) return
    // a note filed here: unlink it in «Заметки» too
    const removed = treeFindItem(tree, id)
    if (removed?.kind === 'note' && removed.noteId) setNotes((prev) => prev.map((n) => (n.id === removed.noteId ? { ...n, linkedCaseId: undefined, caseNo: undefined } : n)))
    // its comment thread goes with it
    if (detail.notes[id]) {
      const rest = { ...detail.notes }
      delete rest[id]
      onPersist({ notes: rest })
    }
    setTree((t) => {
      const it = treeFindItem(t, id)
      if (!it) return t
      // places tied to it lose that link
      const unlinked = (n: CaseTreeNode): CaseTreeNode => ({
        ...n,
        items: n.items?.map((x) => (x.placeLinks?.some((l) => l.id === id) ? { ...x, placeLinks: x.placeLinks.filter((l) => l.id !== id) } : x)),
        children: n.children?.map(unlinked),
      })
      return appendLog(unlinked(removeItem(t, id)), { action: 'Удаление', where: itemWhere(t, id, it.title), detail: it.kind === 'place' ? 'Метка удалена с карты' : 'Запись убрана из дела' })
    })
    if (itemId === id) setItemId(null)
    setRemovingItemId(null)
  }

  /** Folders a record can move to: its own top section and everything in it. */
  function moveTargets(id: string) {
    const top = itemPath(tree, id)?.[0]
    const section = (tree.children ?? []).find((c) => c.name === top)
    const out: { id: string; label: string }[] = []
    const walk = (n: CaseTreeNode, trail: string[]) => {
      if (isSystemFolder(n)) return
      const t = [...trail, n.name]
      out.push({ id: n.id, label: t.join(' › ') })
      for (const c of n.children ?? []) walk(c, t)
    }
    if (section) walk(section, [])
    return out
  }

  function confirmMoveItem(toFolderId: string) {
    const id = movingItemId
    if (!id) return
    setTree((t) => {
      const it = treeFindItem(t, id)
      if (!it) return t
      const from = (itemPath(t, id) ?? []).join(' › ')
      const moved = moveItem(t, id, toFolderId)
      const to = (itemPath(moved, id) ?? []).join(' › ')
      return appendLog(moved, { action: 'Перемещение', where: `${to} › ${it.title}`, detail: `${from} → ${to}` })
    })
    setMovingItemId(null)
    go(toFolderId)
    setItemId(id)
    setPane(true)
  }

  function editItemInfo(id: string, key: string, newKey: string, value: string, refs: string[] = []) {
    setTree((t) => {
      let old = ''
      let title = ''
      const next = updateItem(t, id, (it) => {
        title = it.title
        old = it.info.find(([k]) => k === key)?.[1] ?? ''
        const nextRefs = { ...(it.refs ?? {}) }
        delete nextRefs[key]
        nextRefs[newKey] = refs
        return { ...it, info: it.info.map(([k, v]) => (k === key ? [newKey, value] : [k, v])), refs: nextRefs }
      })
      const parts = [key !== newKey ? `поле «${key}» → «${newKey}»` : '', old !== value ? `${newKey}: ${old} → ${value}` : '', old === value && key === newKey ? `${newKey}: изменены связи` : ''].filter(Boolean)
      return appendLog(next, { action: 'Изменение', where: itemWhere(t, id, title), detail: parts.join('; ') })
    })
  }


  /** Warrants and BOLO tied to a person / vehicle, found automatically:
   * warrants = W-/SW- documents of this case naming them; BOLO = the
   * register entry for them (by name / plate, or the MDC record's BOLO). */
  function autoLinksFor(it: CaseTreeItem): AutoLinks {
    if (it.kind !== 'person' && it.kind !== 'vehicle') return { warrants: [], bolo: null }
    const plate = it.info.find(([k]) => k === 'Номер')?.[1]
    const key = it.kind === 'vehicle' ? plate : it.title
    if (!key || key === 'Не установлен') return { warrants: [], bolo: null }
    const warrants = [...refIdx.values()]
      .filter((r) => r.item.kind === 'doc' && /^(?:W|SW)-\d/.test(r.code) && (r.item.title.includes(key) || r.item.info.some(([, v]) => v.includes(key))))
      .map((r) => ({ code: r.code, sub: r.item.sub }))
    const mdc = findMdc(it)
    const b = mockBolos.find((x) => (it.kind === 'vehicle' ? x.plate === plate : x.title === it.title)) ?? (mdc?.bolo ? mockBolos.find((x) => x.no === mdc.bolo!.no) : undefined)
    const VID: Record<string, string> = { special: 'особый розыск', wanted: 'розыск', poi: 'лицо, представляющее интерес', missing: 'пропал без вести' }
    const seen = b?.sightings[b.sightings.length - 1]
    return { warrants, bolo: b ? { no: b.no, label: VID[b.vid] ?? b.sub, lastSeen: seen ? `${seen.when}, ${seen.place}` : undefined, lastSeenBy: seen?.who } : null }
  }

  /** Journal rows about one record (its path ends with the record title), newest first. */
  function itemHistory(it: CaseTreeItem): CaseLogRow[] {
    const rows = findLogNode(tree)?.log ?? []
    const tail = ' › ' + it.title
    return rows.filter((r) => r.where === it.title || r.where.endsWith(tail))
  }

  function addItemInfo(id: string, key: string, value: string, refs: string[] = []) {
    setTree((t) => {
      let title = ''
      const next = updateItem(t, id, (it) => {
        title = it.title
        // keep the automatic «Добавил» row last
        const added = it.info.filter(([k]) => k === 'Добавил')
        return { ...it, info: [...it.info.filter(([k]) => k !== 'Добавил'), [key, value], ...added], refs: { ...(it.refs ?? {}), [key]: refs } }
      })
      return appendLog(next, { action: 'Добавление', where: itemWhere(t, id, title), detail: `Поле «${key}»: ${value}` })
    })
  }

  function removeItemInfo(id: string, key: string) {
    setTree((t) => {
      let title = ''
      let old = ''
      const next = updateItem(t, id, (it) => {
        title = it.title
        old = it.info.find(([k]) => k === key)?.[1] ?? ''
        return { ...it, info: it.info.filter(([k]) => k !== key) }
      })
      return appendLog(next, { action: 'Удаление', where: itemWhere(t, id, title), detail: `Поле «${key}» удалено (было: ${old})` })
    })
  }

  async function addItemPhotos(id: string, files: FileList | null) {
    const imgs = await readImages(files)
    if (!imgs.length) return
    const now = new Date()
    const p2 = (n: number) => String(n).padStart(2, '0')
    const when = p2(now.getDate()) + '.' + p2(now.getMonth() + 1) + ', ' + p2(now.getHours()) + ':' + p2(now.getMinutes())
    setTree((t) => {
      let title = ''
      const next = updateItem(t, id, (it) => {
        title = it.title
        return { ...it, photos: [...(it.photos ?? []), ...imgs.map((im) => ({ ...im, when, who: mockProfile.name }))] }
      })
      return appendLog(next, { action: 'Добавление', where: itemWhere(t, id, title), detail: imgs.length > 1 ? 'Добавлено фото: ' + imgs.length : 'Добавлено фото: ' + imgs[0].name })
    })
  }

  function removeItemPhoto(id: string, index: number) {
    setTree((t) => {
      let title = ''
      let name = ''
      const next = updateItem(t, id, (it) => {
        title = it.title
        name = it.photos?.[index]?.name ?? ''
        return { ...it, photos: (it.photos ?? []).filter((_, i) => i !== index) }
      })
      return appendLog(next, { action: 'Удаление', where: itemWhere(t, id, title), detail: 'Удалено фото: ' + name })
    })
  }

  // ── Места: move / edit / links ───────────────────────────────────────────
  function movePlace(id: string, x: number, y: number) {
    setTree((t) => {
      let title = ''
      const next = updateItem(t, id, (it) => {
        title = it.title
        return { ...it, px: x, py: y }
      })
      return appendLog(next, { action: 'Перемещение', where: itemWhere(t, id, title), detail: 'Метка переставлена на карте' })
    })
  }

  function editPlace(id: string, patch: { title: string; sub: string; placeType: CasePlaceType; when: string; area: CasePlaceArea | null }) {
    setTree((t) => {
      const changes: string[] = []
      let oldTitle = ''
      const next = updateItem(t, id, (it) => {
        oldTitle = it.title
        if (patch.title !== it.title) changes.push(`название: ${it.title} → ${patch.title}`)
        if (patch.sub !== it.sub) changes.push('описание изменено')
        if (patch.placeType !== it.placeType) changes.push(`тип: ${it.placeType ? PLACE_TYPE_LABEL[it.placeType] : '—'} → ${PLACE_TYPE_LABEL[patch.placeType]}`)
        if (patch.when !== placeWhen(it)) changes.push(`когда: ${patch.when}`)
        if (areaLabel(patch.area) !== areaLabel(placeArea(it))) changes.push(`зона: ${areaLabel(patch.area)}`)
        const label = PLACE_TYPE_LABEL[patch.placeType]
        return {
          ...it,
          title: patch.title,
          sub: patch.sub,
          placeType: patch.placeType,
          status: label,
          when: patch.when,
          area: patch.area ?? { shape: 'circle', r: 0 },
          accuracy: undefined,
          info: it.info.some(([k]) => k === 'Тип') ? it.info.map(([k, v]) => (k === 'Тип' ? [k, label] : [k, v])) : [['Тип', label], ...it.info],
        }
      })
      if (!changes.length) return t
      return appendLog(next, { action: 'Изменение', where: itemWhere(t, id, oldTitle), detail: changes.join('; ') })
    })
  }

  function setPlaceLinks(placeId: string, links: CasePlaceLink[], change: string) {
    setTree((t) => {
      let title = ''
      const next = updateItem(t, placeId, (it) => {
        title = it.title
        return { ...it, placeLinks: links }
      })
      return appendLog(next, { action: 'Изменение', where: itemWhere(t, placeId, title), detail: change })
    })
  }

  function changeItemStatus(itemId: string, status: string, tone: CaseTone) {
    setTree((t) => {
      let old = ''
      let title = ''
      const next = updateItem(t, itemId, (it) => {
        old = it.status
        title = it.title
        return { ...it, status, tone }
      })
      const where = [...(itemPath(t, itemId) ?? []), title].join(' › ')
      return appendLog(next, { action: 'Изменение', where, detail: `Статус: ${old} → ${status}` })
    })
  }

  function addEntityAction(targetFolderId: string, item: CaseTreeItem) {
    setTree((t) => appendLog(addItem(t, targetFolderId, item), { action: 'Добавление', where: `${folderLabel(targetFolderId)} › ${item.title}`, detail: item.kind === 'person' ? (item.info.some(([k]) => k === 'Организация') ? 'Организация — участник дела' : 'Новый участник дела') : item.kind === 'place' ? 'Новое место' : item.kind === 'evidence' ? 'Новая улика' : 'Новое ТС в деле' }))
    setRecAdd(null)
    // the note typed in the dialog opens the record's «Заметки» thread
    if (item.note) onPersist({ notes: { ...detail.notes, [item.id]: [{ who: mockProfile.name, when: dayStamp(), text: item.note }] } })
    setAddKind(null)
    go(targetFolderId)
    setItemId(item.id)
    setPane(true)
  }

  /** Saves a hand-written «Хронология» event (new or edited), keeping the folder in time order. */
  function saveEvent(d: EventDraft) {
    const info: [string, string][] = d.source ? [['Источник', d.source]] : []
    if (eventDialog === 'new') {
      const id = `ev${Date.now()}`
      const ev: CaseTreeItem = { id, kind: 'event', title: d.title, sub: d.sub, status: d.status, tone: d.tone, date: d.date, info: [...info, ['Добавил', mockProfile.name]], note: '' }
      setTree((t) => appendLog(mapNode(t, node.id, (n) => ({ ...n, items: sortEvents([...(n.items ?? []), ev]) })), { action: 'Добавление', where: `${folderLabel(node.id)} › ${d.title}`, detail: `Событие ${d.date}, «${d.status}»` }))
      setItemId(id)
      setPane(true)
    } else if (eventDialog) {
      const found = findItemWithFolder(tree, eventDialog)
      if (!found) return
      const old = found.item
      const changes = [old.title !== d.title && `«${old.title}» → «${d.title}»`, old.date !== d.date && `дата: ${old.date} → ${d.date}`, old.status !== d.status && `статус: ${old.status} → ${d.status}`, old.sub !== d.sub && 'подробности', (old.info.find(([k]) => k === 'Источник')?.[1] ?? '') !== d.source && 'источник'].filter(Boolean)
      setTree((t) =>
        appendLog(
          mapNode(updateItem(t, old.id, (it) => ({ ...it, title: d.title, sub: d.sub, date: d.date, status: d.status, tone: d.tone, info: [...it.info.filter(([k]) => k !== 'Источник'), ...info] })), found.folderId, (n) => ({ ...n, items: sortEvents(n.items ?? []) })),
          { action: 'Изменение', where: `${folderLabel(found.folderId)} › ${d.title}`, detail: changes.length ? changes.join(', ') : 'Без изменений' },
        ),
      )
    }
    setEventDialog(null)
  }

  function folderLabel(id: string) {
    const p = findPath(tree, id) ?? []
    return p
      .slice(1)
      .map((n) => n.name)
      .join(' › ')
  }

  function createFolderAction(parentId: string, name: string) {
    const isSection = parentId === 'root'
    const sections = tree.children?.length ?? 0
    const folder: CaseTreeNode = {
      id: `f-${Date.now()}`,
      name,
      desc: isSection ? 'Раздел, созданный вручную' : '',
      ...(isSection ? { color: NEW_SECTION_COLORS[sections % NEW_SECTION_COLORS.length] } : {}),
    }
    setTree((t) => {
      const added = addFolder(t, parentId, folder)
      const where = [folderLabel(parentId), name].filter(Boolean).join(' › ')
      return appendLog(added, { action: 'Добавление', where, detail: isSection ? 'Создан раздел' : 'Создана папка' })
    })
    setOpenFolders((prev) => ({ ...prev, [parentId]: true }))
    setCreatingIn(null)
  }

  function renameFolderAction(id: string, name: string) {
    const old = findPath(tree, id)?.at(-1)?.name ?? ''
    setTree((t) => appendLog(renameFolder(t, id, name), { action: 'Изменение', where: folderLabel(id).replace(/[^›]+$/, ` ${name}`).trim(), detail: `Папка переименована: «${old}» → «${name}»` }))
    setRenamingId(null)
  }

  function confirmDeleteFolder() {
    if (!deleting) return
    const victim = findPath(tree, deleting.id)?.at(-1)
    const where = folderLabel(deleting.id)
    const moved = victim ? countNode(victim) : 0
    setTree((t) => appendLog(deleteFolder(t, deleting.parentId, deleting.id), { action: 'Удаление', where, detail: moved ? `Папка удалена, записи (${moved}) перенесены уровнем выше` : 'Удалена пустая папка' }))
    if (findPath(tree, folderId)?.some((n) => n.id === deleting.id)) setFolderId(deleting.parentId)
    setDeleting(null)
  }

  /** What the ⋯ menu offers for folder `n` (inside `parent`). */
  function folderMenu(n: CaseTreeNode, parent: CaseTreeNode): FolderMenuProps {
    if (isSystemFolder(n)) {
      return { canRename: false, canDelete: false, canAddSub: false, lockedHint: 'Системный раздел: его нельзя переименовать или удалить', onRename: () => {}, onDelete: () => {}, onAddSub: () => {} }
    }
    // Main sections (Участники, Экспертизы…) are fixed: only folders inside
    // them can be renamed or deleted.
    const topLevel = parent.id === 'root'
    return {
      canRename: !topLevel,
      canAddSub: true,
      canDelete: !topLevel,
      lockedHint: topLevel ? 'Основной раздел дела: переименовать или удалить нельзя, только папки внутри' : undefined,
      onRename: () => {
        go(parent.id)
        setRenamingId(n.id)
      },
      onAddSub: () => {
        go(n.id)
        setCreatingIn(n.id)
      },
      onDelete: () => setDeleting({ id: n.id, parentId: parent.id }),
    }
  }

  /** What a journal row is about — the record (folder path › title), a folder
   * or the case itself — as an «open it» action; null when it no longer exists. */
  function logOpener(r: CaseLogRow): (() => void) | null {
    if (r.where === detail.no) return () => go('root')
    const parts = r.where.split(' › ')
    const folderAt = (names: string[]): CaseTreeNode | null => {
      let n: CaseTreeNode | undefined = tree
      for (const nm of names) {
        n = n.children?.find((c) => c.name === nm)
        if (!n) return null
      }
      return n
    }
    const f = folderAt(parts.slice(0, -1))
    const it = f?.items?.find((x) => x.title === parts[parts.length - 1])
    if (f && it) return () => goItem(f.id, it.id)
    const whole = folderAt(parts)
    return whole && whole.id !== 'root' ? () => go(whole.id) : null
  }

  /** A folder name must be unique among its siblings. */
  function folderNameError(parentId: string, name: string, selfId?: string) {
    const sibs = findPath(tree, parentId)?.at(-1)?.children ?? []
    return sibs.some((c) => c.id !== selfId && c.name.trim().toLowerCase() === name.trim().toLowerCase()) ? 'Папка с таким названием уже есть' : null
  }

  function parentOf(id: string) {
    const p = findPath(tree, id)
    return p && p.length > 1 ? p[p.length - 2] : null
  }

  const refIdx = useMemo(() => buildRefIndex(tree), [tree])
  const refOptions = useMemo(() => linkOptions(tree), [tree])
  const boloPins = useMemo(() => boloPinsFor(tree), [tree])
  const casePeople = useMemo(() => refOptions.filter((o) => o.group === 'Люди').map((o) => ({ id: o.id, title: o.label })), [refOptions])

  const path = findPath(tree, folderId) ?? [tree]
  const node = path[path.length - 1]
  const topColor = (path.length > 1 ? path[1].color : undefined) ?? '#2B3A55'
  const isOverview = node.id === 'root'
  /** What the toolbar «Добавить» creates here: a map pin in Места, a
   * participant anywhere under Участники, a vehicle under Транспорт. */
  const sectionNode = path[1]
  const addTarget: AddKind | null = node.view === 'map' ? 'place' : sectionNode?.id === 'ppl' ? 'person' : sectionNode?.id === 'veh' ? 'vehicle' : sectionNode?.id === 'tl' ? 'event' : null

  /** Starts adding a record of `kind` (going to its section first when asked). */
  function startAdd(kind: AddKind, toFolder?: string) {
    if (toFolder) go(toFolder)
    if (kind === 'place') {
      setRepositionId(null)
      setPlacing(true)
      // a narrow window keeps the map free until the pin is put
      setPane(!narrowPane)
    } else if (kind === 'event') setEventDialog('new')
    else setAddKind(kind)
  }
  /** «Добавить» where the folder itself takes nothing (overview, journal…): a menu. */
  const addMenuItems = (
    [
      { kind: 'person', folderId: 'ppl', label: 'Участник', color: '#3A4E72', icon: <PeopleIcon className="h-3.5 w-3.5" /> },
      { kind: 'vehicle', folderId: 'veh', label: 'Транспорт', color: KC.vehicle, icon: <KindIcon kind="vehicle" className="h-3.5 w-3.5" /> },
      { kind: 'place', folderId: tree.children?.find((c) => c.view === 'map')?.id ?? '', label: 'Место на карте', color: KC.place, icon: <KindIcon kind="place" className="h-3.5 w-3.5" /> },
      { kind: 'event', folderId: 'tl', label: 'Событие', color: KC.event, icon: <KindIcon kind="event" className="h-3.5 w-3.5" /> },
    ] as { kind: AddKind; folderId: string; label: string; color: string; icon: ReactNode }[]
  )
    .map((m) => ({ ...m, where: tree.children?.find((c) => c.id === m.folderId)?.name ?? '' }))
    .filter((m) => m.where)

  function go(id: string) {
    const p = findPath(tree, id) ?? []
    setOpenFolders((prev) => {
      const next = { ...prev }
      p.forEach((n) => {
        next[n.id] = true
      })
      return next
    })
    if (narrowTree) setSidebarHidden(true)
    if (id !== folderId) {
      // leaving «Места» drops a half-placed pin, so it can't land in another folder
      setPlacing(false)
      setDraftPin(null)
      setRepositionId(null)
      setAreaDraft(null)
    }
    setFolderId(id)
    setItemId(null)
  }

  function goItem(fid: string, iid: string) {
    go(fid)
    setItemId(iid)
    setPane(true)
  }

  const rawItems = useMemo(() => {
    const base = node.items ?? []
    return base
  }, [node])

  const selectedItem = rawItems.find((it) => it.id === itemId) ?? null

  function toggleFolder(id: string) {
    setOpenFolders((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const rows = useMemo(() => {
    const out: { node: CaseTreeNode; depth: number; color: string }[] = []
    function walk(n: CaseTreeNode, depth: number, color: string) {
      const col = n.color ?? color
      out.push({ node: n, depth, color: col })
      if (openFolders[n.id] ?? n.id === 'root') {
        for (const ch of n.children ?? []) walk(ch, depth + 1, col)
      }
    }
    walk(tree, 0, '#2B3A55')
    return out
  }, [tree, openFolders])

  function itemNotesFor(id: string): InspectorNote[] {
    const merged = detail.notes[id] ?? []
    const flat: InspectorNote[] = []
    function rec(list: CaseNote[], depth: number, path: number[]) {
      list.forEach((n, i) => {
        const p = [...path, i]
        flat.push({ path: p, depth, who: n.who, when: n.when, text: n.text })
        rec(n.replies ?? [], depth + 1, p)
      })
    }
    rec(merged, 0, [])
    return flat
  }

  /** Adds a comment to a record. It is kept in the shared case file (so it
   * survives leaving the case) and a reply threads under the note it answers. */
  function submitNote() {
    const text = draft.trim()
    if (!text || !selectedItem) return
    const id = selectedItem.id
    const title = selectedItem.title
    const newNote: CaseNote = { who: mockProfile.name, when: dayStamp(), text }
    const list = detail.notes[id] ?? []
    const insert = (l: CaseNote[], at: number[]): CaseNote[] =>
      l.map((n, i) => (i !== at[0] ? n : at.length === 1 ? { ...n, replies: [...(n.replies ?? []), newNote] } : { ...n, replies: insert(n.replies ?? [], at.slice(1)) }))
    const reply = replyTo && replyTo.itemId === id && replyTo.path.length > 0 ? replyTo : null
    onPersist({ notes: { ...detail.notes, [id]: reply ? insert(list, reply.path) : [...list, newNote] } })
    const short = text.length > 80 ? `${text.slice(0, 79)}…` : text
    setTree((t) => appendLog(t, { action: 'Добавление', where: itemWhere(t, id, title), detail: `${reply ? `Ответ для ${reply.name}` : 'Заметка'}: ${short}` }))
    setDraft('')
    setReplyTo(null)
  }

  function onReply(n: InspectorNote) {
    if (!selectedItem) return
    setReplyTo({ itemId: selectedItem.id, path: n.path, name: CASE_PEOPLE[n.who]?.name ?? n.who })
  }

  /** Notes / prose (no `refIds`): name & address links + record numbers.
   * Record fields (`refIds` given, maybe empty): only what was linked
   * explicitly via «Связать с записью», plus record numbers. */
  function renderLinkedText(text: string, refIds?: string[]) {
    if (refIds === undefined) return <Linkified text={text} exclude={selectedItem?.id ?? ''} tree={tree} refIdx={refIdx} onGo={goItem} onOpenBolo={handleOpenBolo} />
    const targets = refIds.map((id) => findItemWithFolder(tree, id)).filter(Boolean) as { item: CaseTreeItem; folderId: string }[]
    const plain = (chunk: string, k: number): ReactNode => {
      const out: ReactNode[] = []
      let rest = chunk
      for (let guard = 0; rest && guard < 20; guard++) {
        let best: { at: number; t: (typeof targets)[number] } | null = null
        for (const t of targets) {
          const at = rest.indexOf(t.item.title)
          if (at >= 0 && (!best || at < best.at)) best = { at, t }
        }
        if (!best) {
          out.push(rest)
          break
        }
        if (best.at > 0) out.push(rest.slice(0, best.at))
        const { t } = best
        out.push(
          <button key={out.length} type="button" onClick={() => goItem(t.folderId, t.item.id)} className="inline text-[13px] text-[#8FD8FF] underline decoration-[rgba(143,216,255,0.45)] underline-offset-[3px]">
            {t.item.title}
          </button>,
        )
        rest = rest.slice(best.at + t.item.title.length)
      }
      return <Fragment key={k}>{out}</Fragment>
    }
    return <>{renderRefs(text, refIdx, { exclude: selectedItem?.id, onGo: goItem, onOpenBolo: handleOpenBolo, renderPlain: plain })}</>
  }

  /** Opens Поиск on an MDC record (its own window per record), or — with no
   * record — a Поиск window searching for `label`. */
  function handleOpenMdc(recordId: string | null, label: string) {
    const target = apps.find((a) => a.id === 'search')
    if (!target) return
    openWindow(target, { instanceKey: recordId ? `rec:${recordId}` : `q:${label}`, initialParams: { entityId: recordId ?? undefined, label } })
  }

  /** Opens «BOLO» on the given ориентировка (B-0412 → its record). */
  function handleOpenBolo(no?: string) {
    const target = apps.find((a) => a.id === 'bolo')
    if (!target) return
    const id = no ? (mockBolos.find((b) => b.no === no)?.id ?? no) : undefined
    // an open BOLO window switches to it (the window manager ignores params for an existing window)
    if (id) requestOpenBolo(id)
    openWindow(target, id ? { initialParams: { entityType: 'bolo', entityId: id } } : undefined)
  }

  const sectionList = tree.children?.map((ch) => ({ id: ch.id, name: ch.name, color: ch.color })) ?? []

  /** Access changes go to the case journal (the dialog promises it). */
  function logAccess(action: CaseLogRow['action'], text: string) {
    setTree((t) => appendLog(t, { action, where: detail.no, detail: text }))
  }

  function setSectionLevel(id: string, level: CaseAccessState['sections'][string]) {
    const old = access.sections[id] ?? 'all'
    if (old === level) return
    setAccess((prev) => ({ ...prev, sections: { ...prev.sections, [id]: level } }))
    const label = (l: string) => SECTION_LEVELS.find((x) => x.id === l)?.label ?? l
    logAccess('Изменение', `Доступ к разделу «${sectionList.find((s) => s.id === id)?.name ?? id}»: ${label(old)} → ${label(level)}`)
  }

  function setRole(i: number, role: CaseAccessRole) {
    const m = access.members[i]
    setRoleMenuIndex(null)
    if (!m || m.role === role) return
    setAccess((prev) => ({ ...prev, members: prev.members.map((x, idx) => (idx === i ? { ...x, role } : x)) }))
    logAccess('Изменение', `Права ${memberName(m.name)}: ${ROLE_LABEL[m.role]} → ${ROLE_LABEL[role]}`)
  }
  function removeMember(i: number) {
    const m = access.members[i]
    setRoleMenuIndex(null)
    if (!m) return
    setAccess((prev) => ({ ...prev, members: prev.members.filter((_, idx) => idx !== i) }))
    logAccess('Удаление', `Доступ отозван: ${memberName(m.name)} (${ROLE_LABEL[m.role]})`)
  }
  function invite(entry: StaffEntry) {
    setInviteName('')
    if (access.members.some((m) => m.name === entry.key || memberName(m.name) === entry.name)) return
    setAccess((prev) => ({ ...prev, members: [...prev.members, { name: entry.key, role: 'member', sub: entry.sub || 'Приглашён только что' }] }))
    logAccess('Добавление', `Доступ выдан: ${entry.name} (${ROLE_LABEL.member})`)
  }

  const grifDot = access.grif === 'secret' ? TONE.red.fg : access.grif === 'conf' ? TONE.amber.fg : TONE.green.fg

  return (
    <div ref={rootRef} className="relative flex h-full min-w-0">
      {narrowTree && !sidebarHidden && <div className="absolute inset-0 z-[24] bg-black/40" onMouseDown={() => setSidebarHidden(true)} />}
      {!sidebarHidden && (
        <aside className={`flex w-[300px] shrink-0 flex-col border-r border-[#3A3A3A] bg-[#1D2027] text-white ${narrowTree ? 'absolute inset-y-0 left-0 z-[25] max-w-[85%] shadow-[8px_0_24px_rgba(0,0,0,0.45)]' : ''}`}>
          <div className="flex h-10 shrink-0 items-center px-2.5">
            <button type="button" onClick={onBackToHome} className="flex h-7 items-center gap-1.5 rounded-[6px] px-2.5 text-[12px] text-[#C2C2C2] hover:bg-white/10 hover:text-white">
              <BackArrowIcon className="h-2.5 w-2.5" />
              Все дела
            </button>
          </div>

          <div className="relative flex items-center gap-1 px-2.5 pb-2 pt-1" ref={caseMenuRef}>
            <button type="button" onClick={() => setCaseMenuOpen((v) => !v)} className="flex h-11 min-w-0 flex-1 items-center gap-2.5 rounded-[6px] px-2.5 text-left hover:bg-white/10">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: TONE[detail.tone]?.fg ?? '#C8C8C8' }} />
              <span className="flex min-w-0 flex-1 flex-col leading-[18px]">
                <span className="flex items-center gap-1.5">
                  <span className="text-[16px] font-semibold">{detail.no}</span>
                  <ChevronDownIcon className="text-white" />
                </span>
                <span className="truncate text-[12px] text-[#C2C2C2]">{detail.short}</span>
              </span>
            </button>
            <button type="button" onClick={onNewCase} aria-label="Новое дело" title="Новое дело" className="flex h-9 w-9 items-center justify-center rounded-[6px] hover:bg-white/10">
              <PlusIcon />
            </button>
            {caseMenuOpen && (
              <div className="absolute left-2.5 right-2.5 top-[52px] z-[12] rounded-[8px] border border-[#3A3A3A] bg-[#2C2C2C] p-1 shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
                <button type="button" onClick={onBackToHome} className="flex h-[34px] w-full items-center gap-2.5 rounded-[4px] px-2.5 hover:bg-white/10">
                  <RootIcon className="h-3.5 w-3.5" />
                  Все дела
                </button>
                <div className="my-1 h-px bg-[#3A3A3A]" />
                <div className="px-2.5 pb-1 pt-1.5 text-[12px] text-[#C2C2C2]">Открытые дела</div>
                {openCases.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      onSwitchCase(c.id)
                      setCaseMenuOpen(false)
                    }}
                    style={{ background: c.id === detail.id ? 'rgba(255,255,255,0.08)' : 'transparent' }}
                    className="flex w-full items-center gap-2.5 rounded-[4px] px-2.5 py-2"
                  >
                    <span className="h-7 w-[3px] shrink-0 rounded-[2px]" style={{ background: ACCENT, opacity: c.id === detail.id ? 1 : 0 }} />
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: TONE[c.tone]?.fg ?? '#C8C8C8' }} />
                    <span className="flex min-w-0 flex-1 flex-col text-left leading-[17px]">
                      <span className={c.id === detail.id ? 'font-semibold' : ''}>{c.no}</span>
                      <span className="truncate text-[12px] text-[#C2C2C2]">{c.short}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <nav aria-label="Структура дела" className="scroll flex-1 overflow-y-auto px-2.5 pb-3 pt-1">
            {rows.map(({ node: n, depth, color }) => {
              const isOpen = openFolders[n.id] ?? n.id === 'root'
              const sel = n.id === folderId
              const kids = n.children ?? []
              return (
                <div key={n.id} className="group relative flex h-[34px] items-center rounded-[6px] has-[[aria-expanded=true]]:z-20" style={{ paddingLeft: 4 + depth * 18, background: sel ? 'rgba(255,255,255,0.08)' : 'transparent' }}>
                  <span className="absolute left-0 top-[9px] h-4 w-[3px] rounded-[2px]" style={{ background: ACCENT, opacity: sel ? 1 : 0 }} />
                  {kids.length > 0 ? (
                    <button type="button" onClick={() => toggleFolder(n.id)} aria-label={isOpen ? 'Свернуть' : 'Развернуть'} className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[4px] text-[#C2C2C2]">
                      <ChevronRightIcon className={isOpen ? 'rotate-90' : ''} />
                    </button>
                  ) : (
                    <span className="w-[22px] shrink-0" />
                  )}
                  <button type="button" onClick={() => go(n.id)} className={`flex h-[34px] flex-1 items-center gap-2.5 truncate pr-2.5 ${sel || n.id === 'root' ? 'font-semibold' : ''}`}>
                    {n.id === 'root' ? <RootIcon /> : <CaseFolderIcon color={color} />}
                    <span className="flex-1 truncate text-left">{n.id === 'root' ? 'Обзор дела' : n.name}</span>
                    {n.id !== 'root' && (depth === 1 && WIP_SECTIONS.has(n.id) ? <WipBadge short /> : <span className="text-[12px] font-normal text-[#C2C2C2]">{badgeCount(n)}</span>)}
                  </button>
                  {n.id !== 'root' && parentOf(n.id) && <FolderMenu {...folderMenu(n, parentOf(n.id)!)} className="mr-1 opacity-0 focus-within:opacity-100 group-hover:opacity-100" />}
                </div>
              )
            })}
          </nav>

          {detail.related && (
            <div className="border-t border-[#3A3A3A] px-3.5 py-3.5">
              <div className="mb-1 text-[12px] font-semibold text-[#C2C2C2]">Связанные дела</div>
              <div className="flex min-w-0 items-center gap-2 text-[13px] text-[#C2C2C2]">
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="shrink-0">
                  <path d="M8.5 11.5a3 3 0 004.2 0l2.6-2.6a3 3 0 00-4.2-4.2l-1 1" />
                  <path d="M11.5 8.5a3 3 0 00-4.2 0l-2.6 2.6a3 3 0 004.2 4.2l1-1" />
                </svg>
                <span className="flex min-w-0 flex-wrap items-center gap-x-1">
                  {detail.related.split(' · ').map((no, i) => {
                    const c = openCases.find((x) => x.no === no)
                    return (
                      <Fragment key={no}>
                        {i > 0 && <span>·</span>}
                        {c ? (
                          <button type="button" onClick={() => onSwitchCase(c.id)} title={c.short} className="hover:text-[#99D9FF] hover:underline">
                            {no}
                          </button>
                        ) : (
                          <span>{no}</span>
                        )}
                      </Fragment>
                    )
                  })}
                </span>
              </div>
            </div>
          )}
        </aside>
      )}

      <div className="flex min-w-0 flex-1 flex-col bg-[#272727] text-white">
        <div className="flex h-11 shrink-0 items-center gap-0.5 px-4">
          <button
            type="button"
            onClick={() => setSidebarHidden((v) => !v)}
            aria-label={sidebarHidden ? 'Показать структуру дела' : 'Скрыть структуру дела'}
            title={sidebarHidden ? 'Показать структуру дела' : 'Скрыть структуру дела'}
            className="flex h-9 w-9 items-center justify-center rounded-[6px] text-[#C2C2C2] hover:bg-white/10"
          >
            <PanelSplitIcon />
          </button>
          <button type="button" onClick={() => path.length > 1 && go(path[path.length - 2].id)} disabled={path.length <= 1} aria-label="На уровень вверх" title="На уровень вверх" className="flex h-9 w-9 items-center justify-center rounded-[6px] text-[#C2C2C2] hover:bg-white/10 disabled:opacity-30">
            <BackArrowIcon />
          </button>
          <div className="ml-1 flex min-w-0 flex-1 items-center gap-0.5 overflow-hidden">
            {path.map((n, i) => (
              <span key={n.id} className={`flex min-w-0 items-center gap-0.5 ${i === path.length - 1 ? 'shrink' : 'shrink-[3]'}`}>
                {i > 0 && <span className="shrink-0 px-0.5 text-[#C2C2C2]">/</span>}
                <button type="button" onClick={() => go(n.id)} title={n.id === 'root' ? detail.no : n.name} className={`h-7 min-w-[24px] max-w-[260px] truncate rounded-[4px] px-1.5 text-[13px] hover:bg-white/10 ${i === path.length - 1 ? 'font-semibold text-white' : 'text-[#C2C2C2]'}`}>
                  {n.id === 'root' ? detail.no : n.name}
                </button>
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setAccessOpen(true)}
            title="Доступ к делу"
            className="flex h-8 shrink-0 items-center gap-1.5 rounded-[6px] px-2.5 text-[13px] hover:bg-white/10"
          >
            <LockIcon className="h-4 w-4" />
            Доступ
            <span className="h-[7px] w-[7px] rounded-full" style={{ background: grifDot }} />
          </button>
          <button
            type="button"
            onClick={() => setPane((v) => !v)}
            aria-label="Сведения"
            title="Сведения"
            style={{ background: pane ? 'rgba(255,255,255,0.08)' : 'transparent', color: pane ? '#FFFFFF' : '#C2C2C2' }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px]"
          >
            <InfoPaneIcon />
          </button>
          <span className="mx-1.5 h-5 w-px shrink-0 bg-[#3A3A3A]" />
          <div ref={addMenuRef} className="relative shrink-0">
            <button
              type="button"
              aria-haspopup={addTarget ? undefined : 'menu'}
              aria-expanded={addTarget ? undefined : addMenu}
              onClick={() => (addTarget ? startAdd(addTarget) : setAddMenu((v) => !v))}
              style={{ background: ACCENT, color: ON_ACCENT }}
              className="flex h-8 items-center gap-1.5 rounded-[6px] px-3 text-[13px] font-semibold hover:brightness-110"
            >
              <PlusIcon />
              Добавить
              {!addTarget && (
                <svg width="9" height="9" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 8l4 4 4-4" />
                </svg>
              )}
            </button>
            {addMenu && !addTarget && (
              <div role="menu" className="absolute right-0 top-[38px] z-30 w-[220px] rounded-[8px] border border-[#3A3A3A] bg-[#2C2C2C] p-1 shadow-[0_10px_28px_rgba(0,0,0,0.45)]">
                {addMenuItems.map((m) => (
                  <button
                    key={m.kind}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setAddMenu(false)
                      startAdd(m.kind, m.folderId)
                    }}
                    className="flex h-9 w-full items-center gap-2.5 rounded-[4px] px-2.5 text-left text-[13px] hover:bg-white/[0.06]"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] text-white" style={{ background: m.color }}>
                      {m.icon}
                    </span>
                    <span className="flex-1">{m.label}</span>
                    <span className="text-[11px] text-[#9A9A9A]">{m.where}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="relative flex min-h-0 flex-1">
          <main className="scroll min-w-0 flex-1 overflow-y-auto px-8 pb-8 pt-2">
            {isOverview && (
              <div className="flex max-w-[920px] flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2.5">
                    <CaseStatusMenu status={detail.status} tone={detail.tone} onChange={setStatusAction} />
                    <span className="text-[12px] text-[#C2C2C2]">
                      Изменено {detail.updated} · {detail.updatedBy}
                    </span>
                  </div>
                  <EditableTitle value={detail.title} onSave={(t) => editCase({ title: t }, `Название: ${detail.title} → ${t}`)} />
                </div>
                <div className="grid rounded-[12px] bg-[#303030]" style={{ gridTemplateColumns: `minmax(0, 1fr) ${detail.meta.map(() => 'minmax(0, 0.7fr)').join(' ')} minmax(0, 1.8fr)` }}>
                  <div className="flex flex-col gap-0.5 border-r border-[#3A3A3A] px-4 py-3.5">
                    <span className="text-[12px] text-[#C2C2C2]">Ведущий</span>
                    <LeadPicker name={detail.lead.name} onPick={setLeadAction}>
                      <span className="block text-[13px] font-semibold">{detail.lead.name}</span>
                      <span className="block text-[12px] text-[#C2C2C2]">{detail.lead.rank}</span>
                    </LeadPicker>
                  </div>
                  {detail.meta.map(([k, v]) => (
                    <div key={k} className="flex flex-col gap-0.5 border-r border-[#3A3A3A] px-4 py-3.5">
                      <span className="text-[12px] text-[#C2C2C2]">{k}</span>
                      <span className="text-[13px] font-semibold">{v}</span>
                    </div>
                  ))}
                  <div className="flex flex-col gap-1 px-4 py-3.5">
                    <span className="text-[12px] text-[#C2C2C2]">Статьи</span>
                    <ChargesEditor charges={detail.charges} onChange={(c, change) => editCase({ charges: c }, change)} />
                  </div>
                </div>
                <CasePinnedWidget
                  pinned={pinned}
                  editing={pinEdit}
                  onEdit={() => setPinEdit({ title: pinned?.title ?? '', text: pinned?.text ?? '', tone: pinned?.tone ?? 'red' })}
                  onChange={setPinEdit}
                  onCancel={() => setPinEdit(null)}
                  onSave={() => {
                    if (!pinEdit || !pinEdit.title.trim()) return
                    const now = new Date()
                    const p2 = (n: number) => String(n).padStart(2, '0')
                    setPinnedById((prev) => ({ ...prev, [detail.id]: { title: pinEdit.title.trim(), text: pinEdit.text.trim(), tone: pinEdit.tone, who: mockProfile.name, when: `${p2(now.getDate())}.${p2(now.getMonth() + 1)}, ${p2(now.getHours())}:${p2(now.getMinutes())}` } }))
                    setTree((t) => appendLog(t, { action: pinned ? 'Изменение' : 'Добавление', where: detail.no, detail: `${pinned ? 'Объявление изменено' : 'Закреплено объявление'}: ${pinEdit.title.trim()}` }))
                    setPinEdit(null)
                  }}
                  onRemove={() => {
                    if (pinned) setTree((t) => appendLog(t, { action: 'Удаление', where: detail.no, detail: `Объявление снято: ${pinned.title}` }))
                    setPinnedById((prev) => ({ ...prev, [detail.id]: null }))
                    setPinEdit(null)
                  }}
                />
                <div>
                  <div className="mb-2 ml-1 text-[13px] font-semibold text-[#C2C2C2]">Разделы</div>
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-3">
                    {(tree.children ?? []).map((ch) => (
                      <div
                        key={ch.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => renamingId !== ch.id && go(ch.id)}
                        onKeyDown={(e) => {
                          if (renamingId !== ch.id && (e.key === 'Enter' || e.key === ' ')) go(ch.id)
                        }}
                        className="group relative flex cursor-pointer flex-col gap-2.5 rounded-[12px] bg-[#303030] p-4 text-left hover:bg-[#363636] has-[[aria-expanded=true]]:z-20"
                      >
                        <span className="flex w-full items-center gap-2.5">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] text-white" style={{ background: ch.color }}>
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
                              <path d="M2.5 5.5v10h15v-8h-7l-2-2z" />
                            </svg>
                          </span>
                          {renamingId === ch.id ? (
                            <NameInput initial={ch.name} placeholder="Название раздела" onCommit={(v) => renameFolderAction(ch.id, v)} onCancel={() => setRenamingId(null)} validate={(v) => folderNameError('root', v, ch.id)} className="h-7 flex-1 text-[15px] font-semibold" />
                          ) : (
                            <span className="min-w-0 flex-1 truncate text-[15px] font-semibold">{ch.name}</span>
                          )}
                          {WIP_SECTIONS.has(ch.id) ? <span className="group-focus-within:invisible group-hover:invisible"><WipBadge /></span> : <span className="text-[20px] font-semibold group-focus-within:invisible group-hover:invisible">{badgeCount(ch)}</span>}
                          <FolderMenu {...folderMenu(ch, tree)} className="!absolute right-3 top-4 opacity-0 focus-within:opacity-100 group-hover:opacity-100" />
                        </span>
                        <span className="ell w-full text-[12px] text-[#C2C2C2]">{(ch.children ?? []).map((s) => s.name).join(' · ') || ch.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <RecentActivity rows={findLogNode(tree)?.log ?? []} onShowAll={() => findLogNode(tree) && go(findLogNode(tree)!.id)} opener={logOpener} />
              </div>
            )}

            {!isOverview && node.view === 'map' && (
              <div className="flex max-w-[920px] flex-col gap-5">
                <div>
                  <h1 className="m-0 text-[28px] font-bold leading-9 tracking-[-0.2px]">{node.name}</h1>
                  <div className="text-[13px] text-[#C2C2C2]">{node.desc}</div>
                </div>
                <CasePlacesView
                  areaDraft={areaDraft}
                  onAreaDraft={setAreaDraft}
                  places={rawItems}
                  selectedId={itemId}
                  onSelect={(id) => {
                    setItemId(id)
                    setPane(true)
                  }}
                  placing={placing}
                  placingLabel={repositionId ? `Нажмите на карту, чтобы переставить «${treeFindItem(tree, repositionId)?.title ?? ''}»` : 'Нажмите на карту, чтобы поставить метку'}
                  draftPin={draftPin}
                  onStartPlacing={() => startAdd('place')}
                  onCancelPlacing={() => {
                    setPlacing(false)
                    setRepositionId(null)
                    setDraftPin(null)
                    setAreaDraft(null)
                  }}
                  onMapClick={(x, y) => {
                    if (repositionId) {
                      movePlace(repositionId, x, y)
                      setRepositionId(null)
                      setPlacing(false)
                      return
                    }
                    setDraftPin({ x, y })
                    setItemId(null)
                    setPane(true)
                  }}
                  onMovePin={movePlace}
                  people={casePeople}
                  boloPins={boloPins}
                  onOpenBolo={handleOpenBolo}
                  accent={ACCENT}
                  authorHints={placeAuthorHints(findLogNode(tree)?.log ?? [])}
                />
              </div>
            )}

            {!isOverview && node.view === 'log' && (
              <div className="flex max-w-[920px] flex-col gap-4">
                <div>
                  <h1 className="m-0 text-[28px] font-bold leading-9 tracking-[-0.2px]">{node.name}</h1>
                  <div className="text-[13px] text-[#C2C2C2]">{node.desc}</div>
                </div>
                <CaseActivityLog rows={node.log ?? []} opener={logOpener} />
              </div>
            )}

            {!isOverview && node.view !== 'map' && node.view !== 'log' && (
              <div className="flex max-w-[920px] flex-col gap-5">
                <div className="group flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    {renamingId === node.id ? (
                      <NameInput initial={node.name} placeholder="Название папки" onCommit={(v) => renameFolderAction(node.id, v)} onCancel={() => setRenamingId(null)} validate={(v) => folderNameError(parentOf(node.id)?.id ?? 'root', v, node.id)} className="h-10 w-full max-w-[520px] text-[24px] font-bold" />
                    ) : (
                      <h1 className="m-0 text-[28px] font-bold leading-9 tracking-[-0.2px]">{node.name}</h1>
                    )}
                    <div className="text-[13px] text-[#C2C2C2]">{node.desc}</div>
                  </div>
                  {path.length > 1 && <FolderMenu {...folderMenu(node, path[path.length - 2])} className="mt-1.5" />}
                </div>
                {sectionNode && WIP_SECTIONS.has(sectionNode.id) && (
                  <div role="status" className="flex items-start gap-3 rounded-[10px] px-4 py-3" style={{ background: 'rgba(255,185,0,0.10)', boxShadow: 'inset 0 0 0 1px rgba(255,185,0,0.28)' }}>
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#FCE100" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="mt-px shrink-0" aria-hidden="true">
                      <path d="M11.5 3.5l5 5-8 8h-5v-5z" />
                      <path d="M9.5 5.5l5 5" />
                    </svg>
                    <span className="flex flex-col leading-5">
                      <span className="text-[14px] font-semibold">Раздел «{sectionNode.name}» ещё в разработке</span>
                      <span className="text-[13px] text-[#C2C2C2]">Мы работаем над этим: скоро здесь можно будет добавлять и вести записи. Пока можно раскладывать папки и прикреплять сюда заметки из «Заметок».</span>
                    </span>
                  </div>
                )}
                <div>
                  {(node.children?.length ?? 0) > 0 ? (
                    <div className="mb-1.5 ml-1 flex items-center text-[13px] font-semibold text-[#C2C2C2]">
                      <span className="flex-1">Папки · {node.children!.length}</span>
                      <AddFolderButton label="Папка" onClick={() => setCreatingIn(node.id)} />
                    </div>
                  ) : (
                    creatingIn !== node.id && <NoFoldersHint onAdd={() => setCreatingIn(node.id)} />
                  )}
                  <div className={`grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-3 ${(node.children?.length ?? 0) === 0 && creatingIn !== node.id ? 'hidden' : ''}`}>
                    {(node.children ?? []).map((s) => (
                      <FolderTile
                        key={s.id}
                        name={s.name}
                        color={s.color ?? topColor}
                        sub={plural(countNode(s))}
                        renaming={renamingId === s.id}
                        onOpen={() => go(s.id)}
                        onRenameCommit={(v) => renameFolderAction(s.id, v)}
                        onRenameCancel={() => setRenamingId(null)}
                        validate={(v) => folderNameError(node.id, v, s.id)}
                        menu={folderMenu(s, node)}
                      />
                    ))}
                    <NewFolderTile color={topColor} creating={creatingIn === node.id} onCreate={(name) => createFolderAction(node.id, name)} onCancel={() => setCreatingIn(null)} validate={(v) => folderNameError(node.id, v)} />
                  </div>
                </div>
                {rawItems.length > 0 ? (
                  <div>
                    <div className="mb-2 ml-1 text-[13px] font-semibold text-[#C2C2C2]">Записи · {rawItems.length}</div>
                    <div className="overflow-hidden rounded-[12px] bg-[#303030]">
                      {rawItems.map((it, i, arr) => {
                        const sel = it.id === itemId
                        const t = TONE[it.tone]
                        return (
                          <button
                            key={it.id}
                            type="button"
                            onClick={() => {
                              setItemId(it.id)
                              setPane(true)
                            }}
                            style={{ background: sel ? 'rgba(255,255,255,0.08)' : 'transparent' }}
                            className="relative flex w-full items-center gap-3.5 px-3 text-left"
                          >
                            <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-[2px]" style={{ background: ACCENT, opacity: sel ? 1 : 0 }} />
                            {it.kind === 'person' && ownPhoto(findMdc(it)?.rec.id, it.title) ? (
                              <img src={ownPhoto(findMdc(it)?.rec.id, it.title)!} alt="" className="my-3 h-11 w-11 shrink-0 rounded-[8px] object-cover object-top" draggable={false} />
                            ) : it.kind === 'person' ? (
                              <span className="my-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] text-[13px] font-semibold text-white" style={{ background: it.color }}>
                                {it.initials}
                              </span>
                            ) : (
                              <span className="my-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] text-white" style={{ background: KC[it.kind] }}>
                                <KindIcon kind={it.kind} />
                              </span>
                            )}
                            <span className={`flex flex-1 items-center gap-3 py-3 ${i === arr.length - 1 ? '' : 'border-b border-[#3A3A3A]'}`}>
                              <span className="min-w-0 flex-1 leading-[18px]">
                                <span className="ell block font-semibold">{it.title}</span>
                                <span className="ell block text-[12px] text-[#C2C2C2]">
                                  {it.kind === 'person' ? (it.info.some(([k]) => k === 'Организация') ? 'Организация' : 'Лицо') : TYPE_LABEL[it.kind]} · {itemSubtitle(it)}
                                </span>
                              </span>
                              <span className="shrink-0 rounded-[10px] px-2.5 py-0.5 text-[12px] font-semibold" style={{ background: t.bg, color: t.fg }}>
                                {it.status}
                              </span>
                              <span className="w-[78px] shrink-0 text-right text-[12px] text-[#C2C2C2]">{it.date}</span>
                              <ChevronRightIcon className="shrink-0 text-[#C2C2C2]" />
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ) : (node.children?.length ?? 0) === 0 ? (
                  <div className="flex flex-col items-center gap-2.5 rounded-[12px] bg-[#303030] px-6 py-16 text-center text-[#C2C2C2]">
                    <svg width="48" height="48" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round">
                      <path d="M2.5 5.5v10h15v-8h-7l-2-2z" />
                    </svg>
                    <div className="text-[16px] font-semibold text-white">Папка пуста</div>
                    <div>Записей пока нет. Можно разложить будущие записи по подпапкам.</div>
                  </div>
                ) : null}
              </div>
            )}
          </main>

          {pane && narrowPane && !placing && <div className="absolute inset-0 z-[19] bg-black/30" onMouseDown={() => setPane(false)} />}
          {pane && (
            <div className={narrowPane ? 'absolute inset-y-0 right-0 z-20 flex max-w-full border-l border-[#3A3A3A] bg-[#272727] shadow-[-8px_0_24px_rgba(0,0,0,0.45)]' : 'flex'}>
            <CaseInspector
              view={draftPin ? 'place-form' : selectedItem ? 'item' : 'folder-info'}
              accent={ACCENT}
              onAccent={ON_ACCENT}
              draftPinLabel={draftPin ? `Рядом: ${nearestPlace(draftPin.x, draftPin.y)}` : ''}
              onSavePlace={(p) => {
                if (!draftPin) return
                const id = `np${Date.now()}`
                const typeLabel = PLACE_TYPE_NAMES[p.placeType]
                const d = new Date()
                const p2 = (n: number) => String(n).padStart(2, '0')
                const stamp = nowStamp()
                const newPlace: CaseTreeItem = {
                  id,
                  kind: 'place',
                  title: p.title || 'Новая метка',
                  sub: p.sub || 'Добавлено вручную',
                  status: typeLabel,
                  tone: 'grey',
                  date: `${p2(d.getDate())}.${p2(d.getMonth() + 1)}.${d.getFullYear()}`,
                  info: [['Тип', typeLabel], ['Добавил', mockProfile.name]],
                  note: '',
                  placeType: p.placeType,
                  px: draftPin.x,
                  py: draftPin.y,
                  when: p.when,
                  accuracy: 0,
                  ...(p.area ? { area: p.area } : {}),
                  ...(p.photos?.length ? { photos: p.photos.map((ph) => ({ ...ph, when: stamp, who: mockProfile.name })) } : {}),
                }
                const extra = [p.area ? `зона: ${areaLabel(p.area)}` : '', p.photos?.length ? `фото: ${p.photos.length}` : ''].filter(Boolean).join(', ')
                // a real record of the case (kept with the case, can hold photos)
                setAreaDraft(null)
                setTree((t) => appendLog(addItem(t, node.id, newPlace), { action: 'Добавление', where: `${node.name} › ${newPlace.title}`, detail: `Новая метка, тип «${typeLabel}»${extra ? `, ${extra}` : ''}` }))
                setItemId(id)
                setPlacing(false)
                setDraftPin(null)
              }}
              onCancelPlace={() => {
                setPlacing(false)
                setAreaDraft(null)
                setDraftPin(null)
              }}
              item={selectedItem}
              itemNotes={selectedItem ? itemNotesFor(selectedItem.id) : []}
              replyToName={replyTo && replyTo.itemId === selectedItem?.id ? replyTo.name : null}
              draft={draft}
              onDraftChange={setDraft}
              onSubmitNote={submitNote}
              onReply={onReply}
              onCancelReply={() => setReplyTo(null)}
              caseNo={detail.no}
              onOpenMdc={handleOpenMdc}
              onOpenBolo={handleOpenBolo}
              onChangeItemStatus={changeItemStatus}
              onMoveItem={setMovingItemId}
              onRemoveItem={setRemovingItemId}
              onEditItemInfo={editItemInfo}
              onEditPlace={editPlace}
              areaDraft={areaDraft}
              onAreaDraft={setAreaDraft}
              onEditEvent={(id) => setEventDialog(id)}
              onRepositionPlace={(id) => {
                setRepositionId(id)
                setDraftPin(null)
                setPlacing(true)
              }}
              onSetPlaceLinks={setPlaceLinks}
              linkedPlaces={selectedItem && selectedItem.kind !== 'place' ? placesLinkedTo(tree, selectedItem.id) : []}
              onOpenPlace={(folderId, placeId) => goItem(folderId, placeId)}
              onAddPhotos={addItemPhotos}
              onRemovePhoto={removeItemPhoto}
              onOpenRecord={(rid) => {
                const hit = findItemWithFolder(tree, rid)
                if (hit) goItem(hit.folderId, rid)
              }}
              onAddItemInfo={addItemInfo}
              onRemoveItemInfo={removeItemInfo}
              linkOptions={refOptions}
              autoLinks={selectedItem ? autoLinksFor(selectedItem) : { warrants: [], bolo: null }}
              history={selectedItem ? itemHistory(selectedItem) : []}
              renderLinkedText={renderLinkedText}
              folderIcon={isOverview ? 'root' : 'folder'}
              folderColor={isOverview ? '#3A4E72' : (node.color ?? topColor)}
              folderName={isOverview ? detail.no : node.name}
              folderSummary={isOverview ? `${plural(countNode(node))} в ${(node.children ?? []).length} ${pluralRu((node.children ?? []).length, 'разделе', 'разделах', 'разделах')}` : `${plural(countNode(node))}${(node.children?.length ?? 0) ? ` · ${node.children!.length} ${pluralRu(node.children!.length, 'подпапка', 'подпапки', 'подпапок')}` : ''}`}
              folderRows={
                isOverview
                  ? [
                      ['Статус', <CaseStatusMenu key="st" status={detail.status} tone={detail.tone} onChange={setStatusAction} align="right" />],
                      [
                        'Гриф',
                        <span key="gr" className="inline-flex justify-end">
                          <SingleDropdown
                            label="Гриф дела"
                            options={(Object.keys(GRIF_INFO) as CaseAccessState['grif'][]).map((g) => ({ value: g, label: GRIF_INFO[g][0] }))}
                            value={access.grif}
                            onChange={(g) => setGrifAction(g as CaseAccessState['grif'])}
                            align="right"
                          />
                        </span>,
                      ],
                      [
                        'Ведущий',
                        <span key="ld" className="inline-flex justify-end">
                          <LeadPicker name={detail.lead.name} onPick={setLeadAction} align="right" variant="avatar">
                            <PersonValue name={detail.lead.name} renderLinkedText={(t) => t} />
                          </LeadPicker>
                        </span>,
                      ],
                      ['Открыто', detail.meta.find(([k]) => k === 'Открыто')?.[1] ?? '—'],
                      ['Изменено', <TwoLine key="up" main={detail.updated} sub={renderLinkedText(detail.updatedBy)} />],
                      [
                        'Доступ',
                        <button key="acc" type="button" onClick={() => setAccessOpen(true)} className="text-[#99D9FF] hover:underline">
                          {`${access.members.length} ${pluralRu(access.members.length, 'сотрудник', 'сотрудника', 'сотрудников')}`}
                        </button>,
                      ],
                      [
                        'Связанные дела',
                        <RelatedEditor
                          key="rel"
                          related={detail.related ? detail.related.split(' · ') : []}
                          cases={openCases.filter((c) => c.id !== detail.id)}
                          onOpen={onSwitchCase}
                          onChange={(r, change) => editCase({ related: r.join(' · ') }, change)}
                        />,
                      ],
                    ]
                  : [
                      ['Расположение', <span key="loc">{path.slice(0, -1).map((n) => (n.id === 'root' ? detail.no : n.name)).join(' › ')}</span>],
                      ['Описание', node.desc ?? '—'],
                      ['Дело', <span key="no">{detail.no}</span>],
                      ['Доступ', sectionNode ? (SECTION_LEVELS.find((l) => l.id === (access.sections[sectionNode.id] ?? 'all'))?.label ?? 'Все с доступом') : 'Все с доступом'],
                    ]
              }
            />
            </div>
          )}
        </div>
      </div>

      {eventDialog && (
        <CaseEventDialog initial={eventDialog === 'new' ? null : (treeFindItem(tree, eventDialog) ?? null)} accent={ACCENT} onSave={saveEvent} onClose={() => setEventDialog(null)} />
      )}

      {addKind && sectionNode && (
        <CaseAddEntityDialog
          key={`${addKind}-${addPick ?? ''}`}
          kind={addKind}
          tree={tree}
          section={sectionNode}
          startFolderId={node.id}
          accent={ACCENT}
          initialPickId={addPick}
          onAdd={(f, it) => {
            setAddPick(null)
            addEntityAction(f, it)
          }}
          onClose={() => {
            setAddPick(null)
            setAddKind(null)
          }}
        />
      )}

      {recAdd && tree.children?.find((c) => c.id === (recAdd.kind === 'place' ? 'plc' : recAdd.kind === 'weapon' ? 'evd' : 'ppl')) && (
        <CaseAddRecordDialog
          key={recAdd.recId}
          kind={recAdd.kind}
          recId={recAdd.recId}
          tree={tree}
          section={tree.children.find((c) => c.id === (recAdd.kind === 'place' ? 'plc' : recAdd.kind === 'weapon' ? 'evd' : 'ppl'))!}
          accent={ACCENT}
          onAdd={(f, it) => addEntityAction(f, it)}
          onClose={() => setRecAdd(null)}
        />
      )}

      {removingItemId && (
        <RemoveItemDialog
          title={treeFindItem(tree, removingItemId)?.title ?? ''}
          linkedToMdc={(() => {
            const it = treeFindItem(tree, removingItemId)
            return !!it && !!findMdc(it)
          })()}
          isPlace={treeFindItem(tree, removingItemId)?.kind === 'place'}
          onConfirm={confirmRemoveItem}
          onCancel={() => setRemovingItemId(null)}
        />
      )}

      {movingItemId && (
        <MoveItemDialog title={treeFindItem(tree, movingItemId)?.title ?? ''} folders={moveTargets(movingItemId)} currentId={(() => {
          const p = itemPath(tree, movingItemId) ?? []
          return moveTargets(movingItemId).find((f) => f.label === p.join(' › '))?.id ?? ''
        })()} onMove={confirmMoveItem} onCancel={() => setMovingItemId(null)} />
      )}

      {deleting && (
        <DeleteFolderDialog
          name={findPath(tree, deleting.id)?.at(-1)?.name ?? ''}
          count={countNode(findPath(tree, deleting.id)?.at(-1) ?? tree)}
          parentName={deleting.parentId === 'root' ? detail.no : findPath(tree, deleting.parentId)?.at(-1)?.name ?? ''}
          onConfirm={confirmDeleteFolder}
          onCancel={() => setDeleting(null)}
        />
      )}

      {accessOpen && (
        <CaseAccessDialog
          caseNo={detail.no}
          caseShort={detail.short}
          accent={ACCENT}
          onAccent={ON_ACCENT}
          access={access}
          sections={sectionList}
          inviteName={inviteName}
          onInviteNameChange={setInviteName}
          onInvite={invite}
          openRoleMenuIndex={roleMenuIndex}
          onToggleRoleMenu={setRoleMenuIndex}
          onSetRole={setRole}
          onRemoveMember={removeMember}
          onSetGrif={setGrifAction}
          onSetSection={setSectionLevel}
          onClose={() => {
            setAccessOpen(false)
            setRoleMenuIndex(null)
          }}
        />
      )}
    </div>
  )
}
