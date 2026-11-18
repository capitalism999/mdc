import type { MailAttachment } from '../../../types'
import { useWindowManager } from '../../../windows/WindowManagerContext'
import type { ModuleContentProps } from '../registry'
import { MailCompose } from './MailCompose'

/** What `MailApp` hands through `openWindow`'s `initialParams` when it opens
 * a compose window — plain in-memory closures, never serialized, so passing
 * a real callback through here is safe (see `windows/types.ts`). */
export interface MailComposeParams {
  initialTo: string
  initialSubject: string
  initialBody?: string
  onSend: (to: string, subject: string, bodyHtml: string, attachments: MailAttachment[], important: boolean) => void
}

/**
 * Thin adapter that lets Compose run as its own top-level OS window (see
 * `data/apps.ts`'s `mailComposeApp`) instead of a pane swapped into the Mail
 * window — matching the reference, where "Новое письмо" is a separate
 * floating panel. Reads the params `MailApp` passed at `openWindow` time and
 * closes this window itself once the message is sent.
 */
export function MailComposeWindow({ windowId, initialParams }: ModuleContentProps) {
  const { closeWindow } = useWindowManager()
  const params = initialParams as unknown as MailComposeParams

  return (
    <MailCompose
      initialTo={params.initialTo}
      initialSubject={params.initialSubject}
      initialBody={params.initialBody}
      onSend={(to, subject, bodyHtml, attachments, important) => {
        params.onSend(to, subject, bodyHtml, attachments, important)
        closeWindow(windowId)
      }}
    />
  )
}
