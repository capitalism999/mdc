import { mockMailMessages as mockMail } from '../../../lib/mockData/mail'
import { staffDirectory, type StaffEntry } from '../cases/staffDirectory'

/** Service mailboxes that aren't people (dispatch, HR…). */
const SERVICE: Record<string, string> = {
  'Диспетчерская LSPD': 'Служебный ящик · диспетчерская',
  'Отдел кадров LSPD': 'Служебный ящик · кадры',
  'Отдел улик': 'Служебный ящик · хранилище улик',
  'Офис окружного прокурора': 'Служебный ящик · DA',
  'Сержант смены': 'Служебный ящик · дежурный сержант',
}

let cache: StaffEntry[] | null = null

/** Everyone mail can be sent to: department staff and groups (same list as
 * case access), service mailboxes, and anyone already in the mailbox. */
export function mailDirectory(): StaffEntry[] {
  if (cache) return cache
  const out = [...staffDirectory()]
  const has = (name: string) => out.some((s) => s.name.toLowerCase() === name.toLowerCase() || name.toLowerCase().endsWith(` ${s.name.toLowerCase()}`))
  for (const [name, sub] of Object.entries(SERVICE)) if (!has(name)) out.push({ key: name, name, sub, initials: '', color: '#3A4E72', group: true, search: '' })
  const seen = mockMail.flatMap((m) => [m.from, ...m.to.split(',')]).map((s) => s.trim())
  for (const name of seen) {
    if (!name || name === 'Черновик' || has(name)) continue
    const parts = name.split(/\s+/)
    out.push({ key: name, name, sub: 'Адресная книга', initials: (parts[0][0] + (parts[1]?.[0] ?? '')).toUpperCase(), color: '#5C6B70', search: '' })
  }
  cache = out
  return out
}

export function findRecipients(query: string): StaffEntry[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return mailDirectory().filter((s) => `${s.name} ${s.sub} ${s.search}`.toLowerCase().includes(q))
}

/** Exact recipient for a typed / stored address: by name, «12D3 Thorne
 * Watts» (badge + name) or a badge / record number. */
export function resolveRecipient(text: string): StaffEntry | null {
  const t = text.trim().toLowerCase()
  if (!t) return null
  const dir = mailDirectory()
  return (
    dir.find((s) => s.name.toLowerCase() === t) ??
    dir.find((s) => t.endsWith(` ${s.name.toLowerCase()}`)) ??
    dir.find((s) => !s.group && s.search.toLowerCase().split(/\s+/).includes(t)) ??
    null
  )
}
