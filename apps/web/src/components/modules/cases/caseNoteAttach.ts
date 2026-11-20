import type { CaseTreeItem, CaseTreeNode, OfficerNote } from '../../../types'
import { mockProfile } from '../../../lib/mockData/profile'
import { addItem, appendLog, removeItem, updateItem } from './caseTreeOps'
import { getCases, setCaseFiles } from './casesStore'

/** A folder a note can be filed into: everything except the map (Места) and
 * the journal, with its path for display. */
export interface CaseFolderOption {
  id: string
  path: string
  depth: number
}

export function caseFolderOptions(tree: CaseTreeNode): CaseFolderOption[] {
  const out: CaseFolderOption[] = []
  const walk = (n: CaseTreeNode, trail: string[], depth: number) => {
    for (const c of n.children ?? []) {
      if (c.view === 'map' || c.view === 'log') continue
      const path = [...trail, c.name]
      out.push({ id: c.id, path: path.join(' › '), depth })
      walk(c, path, depth + 1)
    }
  }
  walk(tree, [], 0)
  return out
}

/** Where the note is filed in the case: its folder id and path, or null. */
export function findAttachedNote(tree: CaseTreeNode, noteId: string): { item: CaseTreeItem; folderId: string; path: string } | null {
  const walk = (n: CaseTreeNode, trail: string[]): { item: CaseTreeItem; folderId: string; path: string } | null => {
    const it = n.items?.find((x) => x.kind === 'note' && x.noteId === noteId)
    if (it) return { item: it, folderId: n.id, path: trail.join(' › ') }
    for (const c of n.children ?? []) {
      const r = walk(c, [...trail, c.name])
      if (r) return r
    }
    return null
  }
  return walk(tree, [])
}

const authorOf = (n: OfficerNote) => n.author.replace(/^\S*\d\S*\s+/, '')

function today() {
  const d = new Date()
  const p2 = (x: number) => String(x).padStart(2, '0')
  return `${p2(d.getDate())}.${p2(d.getMonth() + 1)}.${d.getFullYear()}`
}

function patchTree(caseId: string, fn: (t: CaseTreeNode) => CaseTreeNode) {
  setCaseFiles((prev) => (prev[caseId] ? { ...prev, [caseId]: { ...prev[caseId], tree: fn(prev[caseId].tree) } } : prev))
}

/** Files the note into a folder of the case (moves it if it's already there). */
export function attachNote(note: OfficerNote, caseId: string, folderId: string) {
  const file = getCases().files[caseId]
  if (!file) return
  const folder = caseFolderOptions(file.tree).find((f) => f.id === folderId)
  const existing = findAttachedNote(file.tree, note.id)
  patchTree(caseId, (t) => {
    let tree = existing ? removeItem(t, existing.item.id) : t
    const item: CaseTreeItem = existing
      ? { ...existing.item, title: note.title }
      : {
          id: `nt-${note.id}`,
          kind: 'note',
          noteId: note.id,
          title: note.title || 'Без названия',
          sub: authorOf(note),
          status: 'Заметка',
          tone: 'grey',
          date: today(),
          info: [
            ['Автор', authorOf(note)],
            ['Прикрепил', mockProfile.name],
          ],
          note: '',
        }
    tree = addItem(tree, folderId, item)
    return appendLog(tree, existing ? { action: 'Перемещение', where: `${folder?.path ?? ''} › ${item.title}`, detail: `Заметка перенесена из «${existing.path}»` } : { action: 'Добавление', where: `${folder?.path ?? ''} › ${item.title}`, detail: `Прикреплена заметка ${authorOf(note)}` })
  })
}

/** Takes the note out of the case (unlinking it in Заметки). */
export function detachNote(noteId: string, caseId: string, reason = 'Заметка откреплена') {
  const file = getCases().files[caseId]
  const found = file && findAttachedNote(file.tree, noteId)
  if (!found) return
  patchTree(caseId, (t) => appendLog(removeItem(t, found.item.id), { action: 'Удаление', where: `${found.path} › ${found.item.title}`, detail: reason }))
}

/** Keeps the file's name in the case in step with the note's title. */
export function syncNoteTitle(noteId: string, caseId: string, title: string) {
  const file = getCases().files[caseId]
  const found = file && findAttachedNote(file.tree, noteId)
  if (!found || found.item.title === title) return
  patchTree(caseId, (t) => updateItem(t, found.item.id, (it) => ({ ...it, title: title || 'Без названия' })))
}
