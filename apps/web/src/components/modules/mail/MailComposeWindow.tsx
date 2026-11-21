import { useRef } from 'react'
import type { MailAttachment } from '../../../types'
import { mailComposeApp } from '../../../data/apps'
import { useCloseGuard, useWindowManager } from '../../../windows/WindowManagerContext'
import type { ModuleContentProps } from '../registry'
import { MailCompose } from './MailCompose'

/** A letter as Compose hands it back — to send, or to keep as a draft. */
export interface MailDraft {
  to: string
  cc: string
  subject: string
  bodyHtml: string
  attachments: MailAttachment[]
  important: boolean
}

/** What `MailApp` hands through `openWindow`'s `initialParams` when it opens
 * a compose window — plain in-memory closures, never serialized, so passing
 * a real callback through here is safe (see `windows/types.ts`). */
export interface MailComposeParams {
  initialTo: string
  initialCc?: string
  initialSubject: string
  initialBody?: string
  initialAttachments?: MailAttachment[]
  initialImportant?: boolean
  /** set when an existing draft is being edited */
  draftId?: string
  /** window title suffix (the window manager reads it): «Re: …», «Fwd: …» or the draft's subject */
  label?: string
  /** sends; `draftId` (if the letter was saved as a draft) is removed from «Черновики» */
  onSend: (draft: MailDraft, draftId?: string) => void
  /** creates / updates a draft in «Черновики» and returns its id; `notify` shows a toast in Почта */
  onSaveDraft: (draft: MailDraft, draftId?: string, notify?: boolean) => string
}

/**
 * Thin adapter that lets Compose run as its own top-level OS window (see
 * `data/apps.ts`'s `mailComposeApp`) instead of a pane swapped into the Mail
 * window — matching the reference, where "Новое письмо" is a separate
 * floating panel. Reads the params `MailApp` passed at `openWindow` time and
 * closes this window itself once the message is sent or discarded. Closing
 * it any other way (✕, Ctrl+W, «ЗАКРЫТЬ», «ОБНОВИТЬ», sign-out) keeps unsaved
 * work in «Черновики» through the window manager's close guard.
 */
export function MailComposeWindow({ windowId, initialParams }: ModuleContentProps) {
  const { closeWindow, setWindowTitle } = useWindowManager()
  const params = initialParams as unknown as MailComposeParams
  const guard = useRef<(() => boolean) | null>(null)
  useCloseGuard(windowId, () => guard.current?.() ?? true)

  return (
    <MailCompose
      initialTo={params.initialTo}
      initialCc={params.initialCc}
      initialSubject={params.initialSubject}
      initialBody={params.initialBody}
      initialAttachments={params.initialAttachments}
      initialImportant={params.initialImportant}
      draftId={params.draftId}
      onSend={(draft, draftId) => {
        params.onSend(draft, draftId)
        // sent: nothing left for the close guard to keep
        void closeWindow(windowId, { force: true })
      }}
      onSaveDraft={params.onSaveDraft}
      onDiscard={() => void closeWindow(windowId, { force: true })}
      closeGuardRef={guard}
      // the window is named after the letter as its subject is typed
      onSubjectChange={(s) => setWindowTitle(windowId, s.trim() ? `${mailComposeApp.label} · ${s.trim()}` : mailComposeApp.label)}
    />
  )
}
