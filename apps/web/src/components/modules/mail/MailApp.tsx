import { useEffect, useState } from 'react'
import { getMailMessages } from '../../../lib/endpoints/mail'
import { mailComposeApp } from '../../../data/apps'
import { mockProfile } from '../../../lib/mockData/profile'
import type { MailAttachment, MailMessage } from '../../../types'
import { useWindowManager } from '../../../windows/WindowManagerContext'
import { setAppBadge } from '../../../windows/appBadges'
import { MailList } from './MailList'
import { MailReader } from './MailReader'
import { escapeHtml } from './text'

export type MailFolder = MailMessage['folder']
/** Folder-picker selection — the real folders plus "flagged", a virtual
 * view aggregating pinned messages across every non-trash folder rather
 * than a folder of its own. */
export type MailView = MailFolder | 'flagged'

/**
 * Mail module. Two-pane layout (message list, reader) — folder navigation
 * lives in a dropdown inside the list header rather than a persistent
 * sidebar, matching the reference design. Composing opens its own top-level
 * window (`MailComposeWindow`) rather than swapping a pane in here, also
 * matching the reference. Messages are either system-generated
 * notifications or officer-to-officer mail (see `lib/mockData/mail.ts`).
 * Sending is local-only for now (appends to the in-memory `sent` folder)
 * until a real backend endpoint exists. Deleting moves a message to
 * `trash`; deleting it again from there removes it for good.
 */
export function MailApp() {
  const { openWindow } = useWindowManager()
  const [messages, setMessages] = useState<MailMessage[]>([])
  const [view, setView] = useState<MailView>('inbox')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  /** `true` hides the reader and lets the list fill the window as a compact
   * table — reached by closing the open message, matching the reference's
   * "list without a reading pane" state. */
  const [closed, setClosed] = useState(false)
  /** `true` hides the list and lets the reader fill the window — the
   * reference's "Скрыть список писем" toggle in the reader toolbar. */
  const [listHidden, setListHidden] = useState(false)

  useEffect(() => {
    getMailMessages().then((data) => {
      setMessages(data)
      setSelectedId(data.find((m) => m.folder === 'inbox')?.id ?? null)
    })
  }, [])

  // desktop tile counter: unread mail in «Входящие»
  useEffect(() => {
    if (messages.length) setAppBadge('mail', messages.filter((m) => m.folder === 'inbox' && !m.read).length)
  }, [messages])

  const selected = messages.find((m) => m.id === selectedId) ?? null

  function openFolder(next: MailView) {
    setView(next)
    setClosed(false)
    const first =
      next === 'flagged' ? messages.find((m) => m.pinned && m.folder !== 'trash') : messages.find((m) => m.folder === next)
    setSelectedId(first?.id ?? null)
  }

  function selectMessage(id: string) {
    setClosed(false)
    setSelectedId(id)
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)))
  }

  function setPinned(id: string, pinned: boolean) {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, pinned } : m)))
  }

  function setRead(id: string, read: boolean) {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read } : m)))
  }

  function moveToFolder(id: string, folder: MailFolder) {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, folder } : m)))
    setSelectedId((prev) => (prev === id ? null : prev))
  }

  function deleteMessage(id: string) {
    setMessages((prev) =>
      prev.flatMap((m) => {
        if (m.id !== id) return [m]
        if (m.folder === 'trash') return []
        return [{ ...m, folder: 'trash' as const }]
      }),
    )
    setSelectedId((prev) => (prev === id ? null : prev))
  }

  function sendMessage(to: string, subject: string, bodyHtml: string, attachments: MailAttachment[], important: boolean) {
    const next: MailMessage = {
      id: `local-${Date.now()}`,
      from: `${mockProfile.badgeNumber} ${mockProfile.name}`,
      to,
      subject,
      preview: bodyHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80),
      body: bodyHtml,
      time: 'Сегодня, только что',
      read: true,
      important: important || undefined,
      folder: 'sent',
      kind: 'player',
      attachments: attachments.length > 0 ? attachments : undefined,
    }
    setMessages((prev) => [next, ...prev])
    setView('sent')
    setSelectedId(next.id)
  }

  function sendQuickReply(source: MailMessage, text: string) {
    const to = source.folder === 'sent' ? source.to : source.from
    sendMessage(to, `Re: ${source.subject}`, `<p>${escapeHtml(text)}</p>`, [], false)
  }

  /** Opens Compose as its own window, seeded via `initialParams` (a plain
   * in-memory object — never serialized — so passing `sendMessage` itself
   * through is safe; see `MailComposeWindow`). Each call gets a fresh
   * `instanceKey` so replying to two different messages opens two separate
   * compose windows instead of the second reusing/clobbering the first. */
  function startCompose(source?: { message: MailMessage; mode: 'reply' | 'forward' }) {
    const initialTo = source?.mode === 'reply' ? (source.message.folder === 'sent' ? source.message.to : source.message.from) : ''
    const initialSubject = source ? `${source.mode === 'reply' ? 'Re' : 'Fwd'}: ${source.message.subject}` : ''
    const initialBody =
      source?.mode === 'forward'
        ? `<p>---------- Пересланное сообщение ----------</p><p>От: ${escapeHtml(source.message.from)}<br/>Дата: ${escapeHtml(
            source.message.time,
          )}<br/>Тема: ${escapeHtml(source.message.subject)}</p>${source.message.body.replace(/\n/g, '<br/>')}`
        : undefined

    openWindow(mailComposeApp, {
      instanceKey: `mail-compose-${Date.now()}`,
      initialParams: { initialTo, initialSubject, initialBody, onSend: sendMessage },
    })
  }

  return (
    <div className="flex h-full min-w-0">
      {!listHidden && (
        <MailList
          messages={messages}
          view={view}
          selectedId={selectedId}
          wide={closed || !selected}
          onSelectFolder={openFolder}
          onSelect={selectMessage}
          onCompose={() => startCompose()}
        />
      )}
      {!closed && selected && (
        <MailReader
          message={selected}
          listHidden={listHidden}
          onToggleList={() => setListHidden((v) => !v)}
          onReply={() => startCompose({ message: selected, mode: 'reply' })}
          onForward={() => startCompose({ message: selected, mode: 'forward' })}
          onArchive={() => moveToFolder(selected.id, 'archive')}
          onDelete={() => deleteMessage(selected.id)}
          onTogglePin={() => setPinned(selected.id, !selected.pinned)}
          onToggleRead={() => setRead(selected.id, !selected.read)}
          onClose={() => {
            setClosed(true)
            setListHidden(false)
          }}
          onQuickReply={(text) => sendQuickReply(selected, text)}
        />
      )}
    </div>
  )
}
