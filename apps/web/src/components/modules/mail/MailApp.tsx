import { useEffect, useRef, useState } from 'react'
import { mailComposeApp } from '../../../data/apps'
import { mockProfile } from '../../../lib/mockData/profile'
import { me, loadMail, saveMailDraft, sendMail, setMail, useMail } from './mailStore'
import type { MailMessage } from '../../../types'
import { useWindowManager } from '../../../windows/WindowManagerContext'
import { setAppBadge } from '../../../windows/appBadges'
import type { MailComposeParams, MailDraft } from './MailComposeWindow'
import { MailList } from './MailList'
import { MailReader } from './MailReader'
import { resolveRecipient } from './mailDirectory'
import { escapeHtml, isDraft } from './text'
import { showClippedTitle } from '../shared/clippedTitle'

export type MailFolder = MailMessage['folder']
/** Folder-picker selection — the real folders plus "flagged", a virtual
 * view aggregating pinned messages across every non-trash folder rather
 * than a folder of its own. */
export type MailView = MailFolder | 'flagged'

/** below this width Почта shows one pane at a time (list → letter) */
const NARROW = 760
/** below this width the list column gets slimmer */
const COMPACT = 1100

export function inView(m: MailMessage, view: MailView) {
  if (view === 'flagged') return !!m.pinned && m.folder !== 'trash'
  return m.folder === view
}

function isMe(name: string) {
  const n = name.trim()
  return n === me() || n === mockProfile.name || resolveRecipient(n)?.name === mockProfile.name
}

/** A stored body as compose-editor HTML: mock letters are plain text with
 * line breaks, letters written here are already HTML. */
function bodyAsHtml(body: string) {
  return /<[a-z][\s\S]*>/i.test(body) ? body : escapeHtml(body).replace(/\n/g, '<br/>')
}

interface Toast {
  id: number
  text: string
  action?: { label: string; run: () => void }
}

/**
 * Mail module. Two-pane layout (message list, reader) — folder navigation
 * lives in a dropdown inside the list header rather than a persistent
 * sidebar, matching the reference design; in a narrow window (< 760px) it
 * shows one pane at a time. Composing opens its own top-level window
 * (`MailComposeWindow`) rather than swapping a pane in here, also matching
 * the reference. Messages are either system-generated notifications or
 * officer-to-officer mail (see `lib/mockData/mail.ts`). Sending is
 * local-only for now (appends to the in-memory `sent` folder) until a real
 * backend endpoint exists. Deleting moves a message to `trash`; deleting it
 * again from there removes it for good. Sending, archiving and deleting
 * report in a toast at the bottom (with «Открыть» / «Отменить»).
 */
export function MailApp() {
  const { openWindow } = useWindowManager()
  // the shared mailbox (mailStore): letters sent from other modules or after Почта was closed are here too
  const { messages, loaded } = useMail()
  const setMessages = setMail
  const [view, setView] = useState<MailView>('inbox')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  /** `true` hides the reader and lets the list fill the window as a compact
   * table — reached by closing the open message, matching the reference's
   * "list without a reading pane" state. In the narrow layout it means
   * "showing the list" (the letter is behind the back arrow). */
  const [closed, setClosed] = useState(false)
  /** `true` hides the list and lets the reader fill the window — the
   * reference's "Скрыть список писем" toggle in the reader toolbar. */
  const [listHidden, setListHidden] = useState(false)
  const [searching, setSearching] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)
  const [width, setWidth] = useState(1440)
  const rootRef = useRef<HTMLDivElement>(null)
  /** where an archived / deleted letter came from, for «Восстановить» / «Отменить» */
  const origin = useRef(new Map<string, MailFolder>())
  /** the letter that was open when a search started, back once it's cleared */
  const beforeSearch = useRef<string | null>(null)
  /** Latest state for callbacks that outlive the render they were made in —
   * a toast's «Отменить», or a compose window's send / save. */
  const live = useRef({ messages, view, selectedId })
  live.current = { messages, view, selectedId }

  const narrow = width < NARROW

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    loadMail().then((data) => {
      const first = data.find((m) => m.folder === 'inbox')
      // a narrow window starts on the list; otherwise the newest letter opens (and counts as read)
      const openFirst = first && (rootRef.current?.clientWidth ?? 1440) >= NARROW
      if (openFirst) setMessages((prev) => prev.map((m) => (m.id === first.id ? { ...m, read: true } : m)))
      setSelectedId(openFirst ? first.id : null)
    })
  }, [])

  // desktop tile counter: unread mail in «Входящие»
  useEffect(() => {
    if (loaded) setAppBadge('mail', messages.filter((m) => m.folder === 'inbox' && !m.read).length)
  }, [messages, loaded])

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 5000)
    return () => window.clearTimeout(t)
  }, [toast])

  const selected = messages.find((m) => m.id === selectedId) ?? null

  // nothing left to read with the list hidden — bring the list back instead of an empty pane
  useEffect(() => {
    if (listHidden && !selected && loaded) setListHidden(false)
  }, [listHidden, selected, loaded])

  function showToast(text: string, action?: Toast['action']) {
    setToast({ id: Date.now(), text, action })
  }

  function markRead(id: string) {
    setMessages((prev) => prev.map((m) => (m.id === id && !m.read ? { ...m, read: true } : m)))
  }

  function openFolder(next: MailView) {
    setView(next)
    setClosed(narrow)
    const first = narrow ? undefined : messages.find((m) => inView(m, next))
    setSelectedId(first?.id ?? null)
    if (first) markRead(first.id)
  }

  function selectMessage(id: string) {
    setClosed(false)
    setSelectedId(id)
    markRead(id)
  }

  function setRead(id: string, read: boolean) {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read } : m)))
  }

  /** After the open letter leaves the current view, the reader moves on to
   * the next one in the list (or the previous one at the end), like Outlook,
   * instead of collapsing the window into list-only mode. */
  function selectNeighbour(goneId: string, next: MailMessage[]) {
    const { messages: cur, view: v, selectedId: sel } = live.current
    if (sel !== goneId) return
    if (narrow) {
      // one pane at a time: back to the list
      setSelectedId(null)
      setClosed(true)
      return
    }
    const visible = cur.filter((m) => inView(m, v))
    const at = visible.findIndex((m) => m.id === goneId)
    const stillThere = (m: MailMessage) => next.some((n) => n.id === m.id && inView(n, v))
    const pick = visible.slice(at + 1).find(stillThere) ?? visible.slice(0, Math.max(at, 0)).reverse().find(stillThere)
    setSelectedId(pick?.id ?? null)
    if (pick) markRead(pick.id)
  }

  function setPinned(id: string, pinned: boolean) {
    const next = live.current.messages.map((m) => (m.id === id ? { ...m, pinned } : m))
    setMessages(next)
    // unflagged inside «С флажком»: it leaves that view, so move on like a move / delete
    if (live.current.view === 'flagged' && !pinned) selectNeighbour(id, next)
  }

  /** Moves a letter; returns `false` when there was nothing to move. */
  function moveToFolder(id: string, folder: MailFolder) {
    const cur = live.current.messages.find((m) => m.id === id)
    if (!cur || cur.folder === folder) return false
    if (folder === 'archive' || folder === 'trash') origin.current.set(id, cur.folder)
    else origin.current.delete(id)
    const next = live.current.messages.map((m) => (m.id === id ? { ...m, folder } : m))
    live.current = { ...live.current, messages: next }
    setMessages(next)
    selectNeighbour(id, next)
    return true
  }

  /** Back from «Архив» / «Удалённые» to where the letter was before. */
  function restoreMessage(id: string) {
    const cur = live.current.messages.find((m) => m.id === id)
    if (!cur) return
    const from = origin.current.get(id)
    const back: MailFolder = from && from !== 'archive' && from !== 'trash' ? from : isDraft(cur) ? 'drafts' : cur.from === me() ? 'sent' : 'inbox'
    moveToFolder(id, back)
  }

  /** «Отменить» in the toast: put the letter back and reopen it if it belongs here. */
  function undoMove(id: string) {
    restoreMessage(id)
    const m = live.current.messages.find((x) => x.id === id)
    if (m && inView(m, live.current.view)) {
      setSelectedId(id)
      setClosed(false)
    }
  }

  function archiveMessage(id: string) {
    if (moveToFolder(id, 'archive')) showToast('Письмо перемещено в архив', { label: 'Отменить', run: () => undoMove(id) })
  }

  function deleteMessage(id: string) {
    const cur = live.current.messages.find((m) => m.id === id)
    if (!cur) return
    if (cur.folder !== 'trash') {
      if (moveToFolder(id, 'trash')) showToast('Письмо перемещено в «Удалённые»', { label: 'Отменить', run: () => undoMove(id) })
      return
    }
    origin.current.delete(id)
    const next = live.current.messages.filter((m) => m.id !== id)
    setMessages(next)
    selectNeighbour(id, next)
    showToast('Письмо удалено навсегда')
  }

  /** Sends and stays where the user is; the toast's «Открыть» jumps to the sent letter. */
  function sendMessage(draft: MailDraft, draftId?: string) {
    // a sent draft leaves «Черновики»
    const next = sendMail(draft, draftId)
    if (draftId) {
      origin.current.delete(draftId)
      if (live.current.selectedId === draftId) selectNeighbour(draftId, live.current.messages.filter((m) => m.id !== draftId))
    }
    showToast('Отправлено', {
      label: 'Открыть',
      run: () => {
        setView('sent')
        setClosed(false)
        setListHidden(false)
        setSelectedId(next.id)
      },
    })
  }

  /** Creates or updates a letter in «Черновики»; returns its id. */
  function saveDraft(draft: MailDraft, draftId?: string, notify?: boolean) {
    const id = saveMailDraft(draft, draftId)
    if (notify)
      showToast('Черновик сохранён', {
        label: 'Открыть',
        run: () => {
          setView('drafts')
          setClosed(false)
          setListHidden(false)
          setSelectedId(id)
        },
      })
    return id
  }

  function sendQuickReply(source: MailMessage, text: string) {
    const to = source.folder === 'sent' ? source.to : source.from
    sendMessage({ to, cc: '', subject: `Re: ${source.subject.replace(/^Re:\s*/i, '')}`, bodyHtml: `<p>${escapeHtml(text)}</p>`, attachments: [], important: false })
  }

  function openCompose(params: Omit<MailComposeParams, 'onSend' | 'onSaveDraft' | 'label'>, instanceKey: string) {
    openWindow(mailComposeApp, {
      instanceKey,
      // the window title names the letter: «Новое письмо — Почта · Re: …»
      initialParams: { ...params, label: params.initialSubject || undefined, onSend: sendMessage, onSaveDraft: saveDraft } satisfies MailComposeParams,
    })
  }

  /** Opens Compose as its own window, seeded via `initialParams` (a plain
   * in-memory object — never serialized — so passing `sendMessage` itself
   * through is safe; see `MailComposeWindow`). Each call gets a fresh
   * `instanceKey` so replying to two different messages opens two separate
   * compose windows instead of the second reusing/clobbering the first. */
  function startCompose(source?: { message: MailMessage; mode: 'reply' | 'replyAll' | 'forward' }) {
    const msg = source?.message
    const mode = source?.mode
    const reply = mode === 'reply' || mode === 'replyAll'
    let initialTo = ''
    let initialCc = ''
    if (msg && reply) {
      const sender = msg.folder === 'sent' ? '' : msg.from
      const toList = msg.folder === 'sent' ? msg.to.split(',') : [sender, ...(mode === 'replyAll' ? msg.to.split(',') : [])]
      const uniq = (list: string[]) => [...new Set(list.map((s) => s.trim()).filter((s) => s && !isMe(s)))]
      initialTo = uniq(toList).join(', ')
      if (mode === 'replyAll') initialCc = uniq((msg.cc ?? '').split(',')).join(', ')
    }
    const initialSubject = msg ? `${reply ? 'Re' : 'Fwd'}: ${msg.subject.replace(reply ? /^Re:\s*/i : /^Fwd:\s*/i, '')}` : ''
    const quote = msg
      ? `<p>---------- ${mode === 'forward' ? 'Пересланное сообщение' : 'Исходное сообщение'} ----------</p><p>От: ${escapeHtml(msg.from)}<br/>Кому: ${escapeHtml(
          msg.to,
        )}${msg.cc ? `<br/>Копия: ${escapeHtml(msg.cc)}` : ''}<br/>Дата: ${escapeHtml(msg.time)}<br/>Тема: ${escapeHtml(msg.subject)}</p>${bodyAsHtml(msg.body)}`
      : undefined
    const initialBody = reply ? `<p><br/></p>${quote}` : quote

    openCompose(
      {
        initialTo,
        initialCc,
        initialSubject,
        initialBody,
        // a forward carries the original's files along
        initialAttachments: mode === 'forward' ? msg?.attachments : undefined,
      },
      `mail-compose-${Date.now()}`,
    )
  }

  /** Continues a letter from «Черновики» in Compose. */
  function editDraft(draft: MailMessage) {
    openCompose(
      {
        initialTo: draft.to,
        initialCc: draft.cc,
        initialSubject: draft.subject,
        initialBody: draft.body ? bodyAsHtml(draft.body) : undefined,
        initialAttachments: draft.attachments,
        initialImportant: draft.important,
        draftId: draft.id,
      },
      `mail-compose-${draft.id}`,
    )
  }

  /** Search clears the reader until a result is picked; clearing the search
   * brings back the letter that was open before (if it's still here). */
  function onSearchChange(active: boolean) {
    if (active === searching) return
    setSearching(active)
    if (active) {
      beforeSearch.current = live.current.selectedId
      setSelectedId(null)
      if (narrow) setClosed(true)
      return
    }
    const back = beforeSearch.current
    beforeSearch.current = null
    setSelectedId((cur) => {
      if (cur) return cur
      const m = back ? live.current.messages.find((x) => x.id === back) : undefined
      return m && inView(m, live.current.view) && !narrow ? m.id : null
    })
  }

  // one pane at a time when narrow: the letter (with a back arrow) or the list
  const showReader = narrow ? !closed && !!selected : !closed
  const showList = narrow ? !showReader : !listHidden

  return (
    <div ref={rootRef} onMouseOver={showClippedTitle} className="relative flex h-full min-w-0">
      {/* the list stays mounted while a narrow window shows the letter, so «Непрочитанные», search and scroll survive «Назад» */}
      <div className={showList ? 'contents' : 'hidden'}>
        <MailList
          messages={messages}
          view={view}
          selectedId={selectedId}
          wide={!narrow && closed}
          fill={narrow}
          compact={width < COMPACT}
          onSelectFolder={openFolder}
          onSelect={selectMessage}
          onCompose={() => startCompose()}
          onSearchChange={onSearchChange}
        />
      </div>
      {showReader &&
        (selected ? (
          <MailReader
            // per-letter state (quick-reply draft, menus, file preview) must not leak into the next letter
            key={selected.id}
            message={selected}
            listHidden={listHidden}
            narrow={narrow}
            onBack={() => setClosed(true)}
            onToggleList={() => setListHidden((v) => !v)}
            onReply={() => startCompose({ message: selected, mode: 'reply' })}
            onReplyAll={() => startCompose({ message: selected, mode: 'replyAll' })}
            onForward={() => startCompose({ message: selected, mode: 'forward' })}
            onEditDraft={() => editDraft(selected)}
            onArchive={() => archiveMessage(selected.id)}
            onRestore={() => restoreMessage(selected.id)}
            onDelete={() => deleteMessage(selected.id)}
            onTogglePin={() => setPinned(selected.id, !selected.pinned)}
            onToggleRead={() => setRead(selected.id, !selected.read)}
            onClose={() => {
              setClosed(true)
              setListHidden(false)
            }}
            onQuickReply={(text) => sendQuickReply(selected, text)}
          />
        ) : (
          <main className="flex min-w-0 flex-1 flex-col items-center justify-center gap-3 bg-[#272727] px-6 text-center text-[#C8C8C8]">
            <svg width="56" height="56" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" className="opacity-50" aria-hidden="true">
              <rect x="2.5" y="4.5" width="15" height="11" rx="1.5" />
              <path d="M3 5.5l7 5.5 7-5.5" />
            </svg>
            <div className="text-[16px] font-semibold text-white">Выберите письмо, чтобы прочитать его</div>
            <div className="text-[13px]">{searching ? 'Откройте один из результатов поиска.' : 'Здесь появится содержимое письма.'}</div>
          </main>
        ))}

      {toast && (
        <div
          key={toast.id}
          role="status"
          className="absolute bottom-4 left-1/2 z-40 flex max-w-[calc(100%-32px)] -translate-x-1/2 items-center gap-3 rounded-[8px] border border-[#3A3A3A] bg-[#2C2C2C] py-2 pl-4 pr-2 text-[13px] text-white shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
        >
          <span className="min-w-0 truncate">{toast.text}</span>
          {toast.action && (
            <button
              type="button"
              onClick={() => {
                toast.action?.run()
                setToast(null)
              }}
              className="h-7 shrink-0 rounded-[4px] px-2.5 font-semibold text-[#60CDFF] hover:bg-white/10"
            >
              {toast.action.label}
            </button>
          )}
          <button type="button" onClick={() => setToast(null)} aria-label="Скрыть уведомление" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[4px] text-white/60 hover:bg-white/10 hover:text-white">
            <svg width="10" height="10" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" aria-hidden="true">
              <path d="M1 1l8 8M9 1L1 9" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
