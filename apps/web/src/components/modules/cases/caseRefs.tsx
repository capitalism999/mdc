import type { ReactNode } from 'react'
import type { CaseTone, CaseTreeItem, CaseTreeNode } from '../../../types'
import { mockBolos } from '../../../lib/mockData/bolos'

/**
 * References inside case text. Record numbers (W-2231, SW-2611, R-10977,
 * E-4469, BAL-311, plates 87PLN903…) are resolved against the case's actual
 * records — not a fixed table — so a typed number links to the record it
 * names, shows its status, and a number with no such record is flagged.
 * BOLO numbers (B-0412) resolve against the BOLO register.
 */

/** Record numbers and plates. */
const CODE_RE = /\b(?:SW|W|R|E|BAL|FP|VID|DNA|ATF|BOLO|B)-\d{3,5}\b|\b\d[A-Z]{3}\d{3}\b/g

export interface CaseRef {
  code: string
  folderId: string
  item: CaseTreeItem
}


/** code → record, built from the live tree. */
export function buildRefIndex(tree: CaseTreeNode): Map<string, CaseRef> {
  const idx = new Map<string, CaseRef>()
  const walk = (n: CaseTreeNode) => {
    for (const it of n.items ?? []) {
      const lead = it.title.split(' · ')[0].trim()
      const codes = new Set<string>()
      for (const m of lead.matchAll(CODE_RE)) codes.add(m[0])
      for (const [k, v] of it.info) if (k === 'Номер') for (const m of v.matchAll(CODE_RE)) codes.add(m[0])
      for (const c of codes) if (!idx.has(c)) idx.set(c, { code: c, folderId: n.id, item: it })
    }
    for (const c of n.children ?? []) walk(c)
  }
  walk(tree)
  return idx
}

export const KIND_GROUP: Record<CaseTreeItem['kind'], string> = {
  person: 'Люди',
  vehicle: 'Транспорт',
  place: 'Места',
  evidence: 'Улики',
  media: 'Медиа',
  surv: 'Наблюдение',
  exam: 'Экспертизы',
  doc: 'Документы',
  event: 'События',
  note: 'Заметки',
}
const GROUP_ORDER = ['Люди', 'Транспорт', 'Места', 'Улики', 'Наблюдение', 'Экспертизы', 'Документы', 'Медиа', 'События']

export interface CaseLinkOption {
  id: string
  /** text put into the field (record number when it has one, else its title) */
  insert: string
  label: string
  status: string
  tone: CaseTone
  group: string
}

/** Every record of the case, grouped by kind, for the «Связать с записью» picker. */
export function linkOptions(tree: CaseTreeNode): CaseLinkOption[] {
  const out: CaseLinkOption[] = []
  const walk = (n: CaseTreeNode) => {
    for (const it of n.items ?? []) {
      const lead = it.title.split(' · ')[0].trim()
      const code = lead.match(CODE_RE)?.[0]
      out.push({ id: it.id, insert: code ?? it.title, label: it.title, status: it.status, tone: it.tone, group: KIND_GROUP[it.kind] })
    }
    for (const c of n.children ?? []) walk(c)
  }
  walk(tree)
  return out.sort((x, y) => GROUP_ORDER.indexOf(x.group) - GROUP_ORDER.indexOf(y.group))
}

export function findItemWithFolder(tree: CaseTreeNode, id: string): { item: CaseTreeItem; folderId: string } | null {
  const hit = tree.items?.find((it) => it.id === id)
  if (hit) return { item: hit, folderId: tree.id }
  for (const c of tree.children ?? []) {
    const r = findItemWithFolder(c, id)
    if (r) return r
  }
  return null
}

function RefChip({ code, title, status, onClick }: { code: string; title: string; status: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={`${title} · ${status} — открыть`}
      className="mx-px inline-flex items-center gap-1 rounded-[4px] bg-[rgba(96,205,255,0.12)] px-1.5 align-baseline text-[12px] font-semibold leading-[18px] text-[#8FD8FF] hover:bg-[rgba(96,205,255,0.22)]"
    >
      {code}
      <span className="inline-flex items-center gap-1 font-normal text-[#BFEAFF]/80">
        <span className="h-1.5 w-1.5 rounded-full bg-[#8FD8FF]" />
        {status}
      </span>
    </button>
  )
}

/** Splits `text` into plain parts and resolved / unresolved number refs;
 * plain parts go through `renderPlain` (name/address links). */
export function renderRefs(text: string, idx: Map<string, CaseRef>, opts: { exclude?: string; onGo: (folderId: string, itemId: string) => void; onOpenBolo: () => void; renderPlain: (t: string, key: number) => ReactNode }) {
  const parts: ReactNode[] = []
  let last = 0
  let key = 0
  for (const m of text.matchAll(CODE_RE)) {
    const code = m[0]
    const at = m.index ?? 0
    if (at > last) parts.push(opts.renderPlain(text.slice(last, at), key++))
    const ref = idx.get(code)
    const bolo = /^(?:B|BOLO)-\d{4}$/.test(code) ? mockBolos.find((b) => b.no === code.replace(/^BOLO-/, 'B-')) : undefined
    if (ref && ref.item.id !== opts.exclude) {
      parts.push(<RefChip key={key++} code={code} title={ref.item.title} status={ref.item.status} onClick={() => opts.onGo(ref.folderId, ref.item.id)} />)
    } else if (ref) {
      parts.push(<span key={key++}>{code}</span>)
    } else if (bolo) {
      parts.push(<RefChip key={key++} code={code} title={`Ориентировка: ${bolo.title}`} status="BOLO" onClick={opts.onOpenBolo} />)
    } else if (/^\d[A-Z]{3}\d{3}$/.test(code)) {
      parts.push(<span key={key++}>{code}</span>)
    } else {
      parts.push(
        <span key={key++} title={`Нет в деле: запись ${code} не найдена`} className="cursor-help underline decoration-[#FF99A4] decoration-dashed underline-offset-[3px]">
          {code}
        </span>,
      )
    }
    last = at + code.length
  }
  if (last < text.length) parts.push(opts.renderPlain(text.slice(last), key++))
  return parts
}
