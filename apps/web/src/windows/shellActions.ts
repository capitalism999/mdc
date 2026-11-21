import { apps } from '../data/apps'
import { mockProfile } from '../lib/mockData/profile'
import { nowStamps, requestOpenNote, setNotes } from '../components/modules/notes/notesStore'
import type { OfficerNote } from '../types'
import { useWindowManager } from './WindowManagerContext'

/** Text a button shows, or its aria-label for icon-only buttons. */
function buttonLabel(b: HTMLElement): string {
  return (b.getAttribute('aria-label') || b.textContent || '').replace(/\s+/g, ' ').trim()
}

/** The module's create button: marked `data-create` (the visible one), else found by its label. */
function findCreate(root: Element, labels: string[]): HTMLElement | undefined {
  const marked = Array.from(root.querySelectorAll<HTMLElement>('[data-create]')).find((b) => !(b as HTMLButtonElement).disabled && b.offsetParent !== null)
  return marked ?? findButton(root, labels)
}

function findButton(root: Element, labels: string[]): HTMLElement | undefined {
  return Array.from(root.querySelectorAll<HTMLElement>('button')).find((b) => !(b as HTMLButtonElement).disabled && labels.includes(buttonLabel(b)))
}

/**
 * Presses a module's own «create» button inside its window once the window
 * has mounted — the shell's «СОЗДАТЬ» menu reuses each module's real create
 * flow (the same form, the same data store) instead of a parallel one.
 * `via` are buttons that lead back to the view holding the create button
 * (e.g. «Все дела» from inside a case file), pressed once if it isn't found.
 */
function pressInWindow(instanceKey: string, labels: string[], via: string[] = [], timeoutMs = 4000) {
  const t0 = performance.now()
  let usedVia = false
  const tick = () => {
    const root = document.querySelector(`[data-instance-key="${CSS.escape(instanceKey)}"]`)
    if (root) {
      const btn = findCreate(root, labels)
      if (btn) {
        btn.click()
        return
      }
      if (!usedVia && via.length && performance.now() - t0 > 150) {
        const back = findButton(root, via)
        if (back) {
          usedVia = true
          back.click()
        }
      }
    }
    if (performance.now() - t0 < timeoutMs) window.setTimeout(tick, 40)
  }
  window.setTimeout(tick, 40)
}

let noteSeq = 0

export interface CreateAction {
  id: string
  label: string
  hint: string
  appId: string
}

/** What «СОЗДАТЬ» (Alt+N) can start — one entry per module with a create flow. */
export const CREATE_ACTIONS: CreateAction[] = [
  { id: 'report', label: 'Отчёт', hint: 'Новый отчёт по бланку', appId: 'reports' },
  { id: 'case', label: 'Дело', hint: 'Завести новое дело', appId: 'cases' },
  { id: 'bolo', label: 'Ориентировка BOLO', hint: 'Объявить в розыск', appId: 'bolo' },
  { id: 'mail', label: 'Письмо', hint: 'Написать в Почте', appId: 'mail' },
  { id: 'note', label: 'Заметка', hint: 'Пустая заметка', appId: 'notes' },
]

/** Shell-level window actions shared by the header, the task bar and their shortcuts. */
export function useShellActions() {
  const { openWindow } = useWindowManager()

  function openApp(appId: string) {
    const app = apps.find((a) => a.id === appId)
    if (app) openWindow(app)
  }

  function create(actionId: string) {
    switch (actionId) {
      case 'report':
        openApp('reports')
        pressInWindow('reports', ['Новый отчёт'])
        return
      case 'case':
        openApp('cases')
        pressInWindow('cases', ['Новое дело'], ['Все дела'])
        return
      case 'bolo':
        openApp('bolo')
        pressInWindow('bolo', ['Новая ориентировка'])
        return
      case 'mail':
        openApp('mail')
        pressInWindow('mail', ['Новое письмо'])
        return
      case 'note': {
        // same blank note «Заметки» makes with its own «+», then opened there
        noteSeq += 1
        const id = `draft-${Date.now()}-shell${noteSeq}`
        const note: OfficerNote = {
          id,
          folder: 'cases',
          isPinned: false,
          author: `${mockProfile.badgeNumber} ${mockProfile.name}`,
          ...nowStamps(),
          // like Заметки' own «+»: an empty title with the caret in it
          title: '',
          blocks: [{ id: 'b0', type: 'paragraph', text: '' }],
        }
        setNotes((prev) => [note, ...prev])
        requestOpenNote(id)
        const app = apps.find((a) => a.id === 'notes')
        if (app) openWindow(app, { initialParams: { noteId: id } })
        return
      }
    }
  }

  return { openApp, create }
}
