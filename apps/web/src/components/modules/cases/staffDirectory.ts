import { CASE_PEOPLE } from '../../../lib/mockData/caseFiles'
import { SEARCH_DB, SEARCH_EMPX } from '../search/searchLogic'

/** Who can be given access to a case: department employees from the MDC
 * (Поиск employee records + their service file), groups, and anyone already
 * known to the case files. Used by the «Кто имеет доступ» autocomplete. */
export interface StaffEntry {
  /** value stored in `CaseAccessMember.name` ('@…' = group) */
  key: string
  name: string
  sub: string
  initials: string
  color: string
  group?: boolean
  /** extra text the search matches (badge, callsign…) */
  search: string
}

interface DbPerson {
  id: string
  type: string
  title: string
  initials?: string
  color?: string
  code?: string
  sub?: string
}
interface Emp {
  rank: string
  unit: string
  badge: string
  radio: string
}

let cache: StaffEntry[] | null = null

export function staffDirectory(): StaffEntry[] {
  if (cache) return cache
  const out: StaffEntry[] = []
  const emp = SEARCH_EMPX as unknown as Record<string, Emp>
  for (const r of SEARCH_DB as unknown as DbPerson[]) {
    if (r.type !== 'person' || !/^LSPD-/.test(r.code ?? '')) continue
    const e = emp[r.id]
    out.push({
      key: r.title,
      name: r.title,
      sub: e ? `${e.rank} · ${e.unit} · жетон ${e.badge}` : r.sub ?? '',
      initials: r.initials ?? r.title.slice(0, 2),
      color: r.color ?? '#5C6B70',
      search: `${r.code ?? ''} ${e?.badge ?? ''} ${e?.radio ?? ''}`,
    })
  }
  for (const [key, p] of Object.entries(CASE_PEOPLE)) {
    if (out.some((s) => s.key === key || s.name === p.name)) continue
    const rank = (p as { rank?: string }).rank
    out.push({ key, name: p.name, sub: rank ?? '', initials: p.initials, color: p.color, search: '' })
  }
  out.push(
    { key: '@Отдел расследований', name: 'Отдел расследований', sub: 'Группа · все детективы LSPD', initials: '', color: '#3A4E72', group: true, search: 'detective investigations' },
    { key: '@Патрульное управление · Mission Row', name: 'Патрульное управление · Mission Row', sub: 'Группа · все патрульные участка', initials: '', color: '#3A4E72', group: true, search: 'patrol' },
  )
  cache = out
  return out
}

export function findStaff(query: string): StaffEntry[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return staffDirectory().filter((s) => `${s.name} ${s.sub} ${s.search}`.toLowerCase().includes(q))
}
