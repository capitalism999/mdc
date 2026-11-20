import type { CaseLogRow, CaseTreeItem, CaseTreeNode } from '../../../types'

/** Pure, immutable edits of a case's folder tree (create / rename / delete
 * folders) plus the journal rows those edits leave behind. */

export const NEW_SECTION_COLORS = ['#2B88D8', '#D0682E', '#2E8B57', '#C49A1A', '#C2456A', '#8764B8', '#03787C', '#5C6B70']

/** «Места» (map) and «Журнал действий» (log) are system sections. */
export function isSystemFolder(n: CaseTreeNode) {
  return n.id === 'root' || n.view === 'map' || n.view === 'log'
}

export function mapNode(tree: CaseTreeNode, id: string, fn: (n: CaseTreeNode) => CaseTreeNode): CaseTreeNode {
  if (tree.id === id) return fn(tree)
  if (!tree.children) return tree
  let changed = false
  const children = tree.children.map((ch) => {
    const next = mapNode(ch, id, fn)
    if (next !== ch) changed = true
    return next
  })
  return changed ? { ...tree, children } : tree
}

export function addFolder(tree: CaseTreeNode, parentId: string, folder: CaseTreeNode): CaseTreeNode {
  return mapNode(tree, parentId, (p) => {
    const kids = p.children ?? []
    // New sections go before the system «Журнал действий», which stays last.
    const logAt = kids.findIndex((c) => c.view === 'log')
    return { ...p, children: logAt >= 0 ? [...kids.slice(0, logAt), folder, ...kids.slice(logAt)] : [...kids, folder] }
  })
}

export function renameFolder(tree: CaseTreeNode, id: string, name: string): CaseTreeNode {
  return mapNode(tree, id, (n) => ({ ...n, name }))
}

/** Removes folder `id`; its records and subfolders move up into the parent,
 * so nothing filed in it is lost. */
export function deleteFolder(tree: CaseTreeNode, parentId: string, id: string): CaseTreeNode {
  return mapNode(tree, parentId, (p) => {
    const victim = (p.children ?? []).find((c) => c.id === id)
    if (!victim) return p
    const children = (p.children ?? []).flatMap((c) => (c.id === id ? (victim.children ?? []) : [c]))
    return { ...p, children: children.length ? children : undefined, items: [...(p.items ?? []), ...(victim.items ?? [])] }
  })
}

export function findLogNode(tree: CaseTreeNode): CaseTreeNode | undefined {
  return (tree.children ?? []).find((c) => c.view === 'log')
}

/** Prepends a journal row to the case's «Журнал действий». */
export function appendLog(tree: CaseTreeNode, row: Omit<CaseLogRow, 'when' | 'who'>, who = 'Thorne Watts'): CaseTreeNode {
  const log = findLogNode(tree)
  if (!log) return tree
  const now = new Date()
  const p2 = (n: number) => String(n).padStart(2, '0')
  const when = `${p2(now.getDate())}.${p2(now.getMonth() + 1)}, ${p2(now.getHours())}:${p2(now.getMinutes())}`
  return mapNode(tree, log.id, (n) => ({ ...n, log: [{ when, who, ...row }, ...(n.log ?? [])] }))
}

export function addItem(tree: CaseTreeNode, folderId: string, item: CaseTreeItem): CaseTreeNode {
  return mapNode(tree, folderId, (n) => ({ ...n, items: [...(n.items ?? []), item] }))
}

/** Applies fn to the record with id itemId wherever it is filed. */
export function updateItem(tree: CaseTreeNode, itemId: string, fn: (it: CaseTreeItem) => CaseTreeItem): CaseTreeNode {
  const items = tree.items?.some((it) => it.id === itemId) ? tree.items.map((it) => (it.id === itemId ? fn(it) : it)) : tree.items
  const children = tree.children?.map((c) => updateItem(c, itemId, fn))
  const childChanged = children?.some((c, i) => c !== tree.children![i])
  return items !== tree.items || childChanged ? { ...tree, items, children } : tree
}

/** Folder path (Участники › Подозреваемые) of the folder holding itemId. */
export function itemPath(tree: CaseTreeNode, itemId: string, trail: string[] = []): string[] | null {
  const here = tree.id === 'root' ? trail : [...trail, tree.name]
  if (tree.items?.some((it) => it.id === itemId)) return here
  for (const c of tree.children ?? []) {
    const r = itemPath(c, itemId, here)
    if (r) return r
  }
  return null
}

/** Removes the record with id itemId from the case (its MDC record, if any, is untouched). */
export function removeItem(tree: CaseTreeNode, itemId: string): CaseTreeNode {
  const items = tree.items?.some((it) => it.id === itemId) ? tree.items.filter((it) => it.id !== itemId) : tree.items
  const children = tree.children?.map((c) => removeItem(c, itemId))
  const childChanged = children?.some((c, i) => c !== tree.children![i])
  return items !== tree.items || childChanged ? { ...tree, items, children } : tree
}

export function findItem(tree: CaseTreeNode, itemId: string): CaseTreeItem | null {
  const hit = tree.items?.find((it) => it.id === itemId)
  if (hit) return hit
  for (const c of tree.children ?? []) {
    const r = findItem(c, itemId)
    if (r) return r
  }
  return null
}

/** Moves the record with id itemId into folder toFolderId. */
export function moveItem(tree: CaseTreeNode, itemId: string, toFolderId: string): CaseTreeNode {
  const it = findItem(tree, itemId)
  if (!it) return tree
  return addItem(removeItem(tree, itemId), toFolderId, it)
}
