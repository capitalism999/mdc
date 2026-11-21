import { useSyncExternalStore } from 'react'
import { mailComposeApp } from '../../../data/apps'
import { getMailMessages } from '../../../lib/endpoints/mail'
import { mockProfile } from '../../../lib/mockData/profile'
import { mockMailByProfile } from '../../../lib/mockData/mailOthers'
import type { AppTile, MailAttachment, MailMessage } from '../../../types'
import type { MailComposeParams, MailDraft } from './MailComposeWindow'
import { stripHtml } from './text'

/**
 * One mailbox per session, outside the Почта window: letters written in a
 * compose window, sent from BOLO or Поиск («В Почту участку», «Написать»)
 * land here even when Почта is closed, and an open Почта window shows them
 * at once. Like casesStore / notesStore — in memory until a backend exists.
 */

export const JUST_NOW = 'Сегодня, только что'
/** The active character's own address («12D3 Thorne Watts»). */
export function me(): string {
  return `${mockProfile.badgeNumber} ${mockProfile.name}`
}

/** One mailbox per character (key: profile id): Thorne Watts's letters come
 * from the mail endpoint, the other characters' from mailOthers. */
const boxes = new Map<string, { messages: MailMessage[]; loaded: boolean; loading: Promise<MailMessage[]> | null }>()
function box() {
  let b = boxes.get(mockProfile.id)
  if (!b) {
    b = { messages: [], loaded: false, loading: null }
    boxes.set(mockProfile.id, b)
  }
  return b
}
const subs = new Set<() => void>()

const subscribe = (fn: () => void) => {
  subs.add(fn)
  return () => subs.delete(fn)
}
const emit = () => subs.forEach((fn) => fn())

export function getMail(): MailMessage[] {
  return box().messages
}

export function isMailLoaded() {
  return box().loaded
}

export function setMail(next: MailMessage[] | ((prev: MailMessage[]) => MailMessage[])) {
  const b = box()
  b.messages = typeof next === 'function' ? next(b.messages) : next
  emit()
}

/** Sort key for the mock `time` strings: «Сегодня, только что» › «Сегодня,
 * 14:32» › «Вчера, 21:18» › «13.11.2026, 17:40». */
export function timeKey(time: string) {
  if (time === JUST_NOW) return Number.MAX_SAFE_INTEGER
  const hm = /(\d{1,2}):(\d{2})\s*$/.exec(time)
  const minutes = hm ? Number(hm[1]) * 60 + Number(hm[2]) : 0
  if (time.startsWith('Сегодня')) return 4e12 + minutes
  if (time.startsWith('Вчера')) return 3e12 + minutes
  const d = /(\d{2})\.(\d{2})\.(\d{4})/.exec(time)
  return d ? (Number(d[3]) * 372 + Number(d[2]) * 31 + Number(d[1])) * 1440 + minutes : 0
}

/** Loads the mailbox once; later calls get the same letters (with everything done to them since). */
export function loadMail(): Promise<MailMessage[]> {
  const b = box()
  if (b.loaded) return Promise.resolve(b.messages)
  if (!b.loading) {
    const mine = mockProfile.id === 'acc1'
    b.loading = (mine ? getMailMessages() : Promise.resolve(mockMailByProfile[mockProfile.id] ?? [])).then((data) => {
      // letters sent before the first load (from another module) stay on top
      b.messages = [...b.messages, ...[...data].sort((x, y) => timeKey(y.time) - timeKey(x.time))]
      b.loaded = true
      emit()
      return b.messages
    })
  }
  return b.loading
}

export function useMail(): { messages: MailMessage[]; loaded: boolean } {
  const list = useSyncExternalStore(subscribe, getMail)
  return { messages: list, loaded: box().loaded }
}

function letterFields(draft: MailDraft) {
  return {
    to: draft.to,
    cc: draft.cc || undefined,
    subject: draft.subject,
    preview: stripHtml(draft.bodyHtml).slice(0, 80),
    body: draft.bodyHtml,
    time: JUST_NOW,
    important: draft.important || undefined,
    attachments: draft.attachments.length > 0 ? draft.attachments : undefined,
  }
}

let seq = 0

/** Puts a letter into «Отправленные» (a sent draft leaves «Черновики»); returns it. */
export function sendMail(draft: MailDraft, draftId?: string): MailMessage {
  seq += 1
  const next: MailMessage = { id: `local-${Date.now()}-${seq}`, from: me(), ...letterFields(draft), read: true, folder: 'sent', kind: 'player' }
  setMail((prev) => [next, ...prev.filter((m) => m.id !== draftId)])
  return next
}

/** Creates or updates a letter in «Черновики»; returns its id. */
export function saveMailDraft(draft: MailDraft, draftId?: string): string {
  seq += 1
  const id = draftId ?? `draft-${Date.now()}-${seq}`
  const fields = letterFields(draft)
  setMail((prev) => {
    const existing = prev.find((m) => m.id === id)
    if (existing) return prev.map((m) => (m.id === id ? { ...m, ...fields, folder: 'drafts' as const } : m))
    const created: MailMessage = { id, from: 'Черновик', ...fields, read: true, folder: 'drafts', kind: 'player' }
    return [created, ...prev]
  })
  return id
}

type OpenWindow = (app: AppTile, opts?: { instanceKey?: string; initialParams?: Record<string, unknown> }) => void

/**
 * «Написать» from any module: a compose window addressed to `to`, sending
 * straight into the shared mailbox (Почта may be closed).
 */
export function composeMail(
  openWindow: OpenWindow,
  seed: { to?: string; cc?: string; subject?: string; bodyHtml?: string; attachments?: MailAttachment[]; important?: boolean },
) {
  void loadMail()
  const params: MailComposeParams = {
    initialTo: seed.to ?? '',
    initialCc: seed.cc,
    initialSubject: seed.subject ?? '',
    initialBody: seed.bodyHtml,
    initialAttachments: seed.attachments,
    initialImportant: seed.important,
    label: seed.subject || undefined,
    onSend: (draft, draftId) => void sendMail(draft, draftId),
    onSaveDraft: (draft, draftId) => saveMailDraft(draft, draftId),
  }
  openWindow(mailComposeApp, { instanceKey: `mail-compose-${Date.now()}`, initialParams: params as unknown as Record<string, unknown> })
}
