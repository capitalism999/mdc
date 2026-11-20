import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { MailMessage } from '../../../types'
import { getAvatarColor, getInitials } from './avatar'
import { MailTextSizeControl, mailTextStyle, useMailTextSize } from './mailTextSize'
import { CloseIcon, ForwardIcon, ImportantIcon, MailOpenIcon, MailUnreadIcon, MoreIcon, PanelSplitIcon, PinIcon, ReplyIcon, SentIcon, TrashIcon } from './icons'

interface MailReaderProps {
  message: MailMessage
  listHidden: boolean
  onToggleList: () => void
  onReply: () => void
  onForward: () => void
  onArchive: () => void
  onDelete: () => void
  onTogglePin: () => void
  onToggleRead: () => void
  onClose: () => void
  onQuickReply: (text: string) => void
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} Б`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} КБ`
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`
}

function ArchiveIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="3.5" width="15" height="4" rx="1" />
      <path d="M4 7.5v9h12v-9" />
      <path d="M8 11h4" />
    </svg>
  )
}

function ToolbarButton({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex h-8 shrink-0 items-center gap-2 whitespace-nowrap rounded-[4px] px-2.5 text-[13px] hover:bg-white/10">
      <span className="flex h-4 w-4 items-center justify-center">{icon}</span>
      {label}
    </button>
  )
}

/**
 * Reading pane: a top action toolbar (reply/forward, archive/delete/flag,
 * close), the message header, body, attachments, and a quick-reply bar
 * pinned to the bottom so a short reply doesn't require opening full
 * compose. Flagging a message happens only from here, not from the list
 * row — matching the reference, which has no per-row flag toggle.
 */
export function MailReader({
  message,
  listHidden,
  onToggleList,
  onReply,
  onForward,
  onArchive,
  onDelete,
  onTogglePin,
  onToggleRead,
  onClose,
  onQuickReply,
}: MailReaderProps) {
  const textSize = useMailTextSize()
  const [quickReply, setQuickReply] = useState('')
  const [moreOpen, setMoreOpen] = useState(false)
  const moreRef = useRef<HTMLDivElement>(null)
  const party = message.folder === 'sent' ? message.to : message.from

  useEffect(() => {
    if (!moreOpen) return
    function onDown(event: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) setMoreOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [moreOpen])

  function sendQuickReply() {
    const text = quickReply.trim()
    if (!text) return
    onQuickReply(text)
    setQuickReply('')
  }

  return (
    <main className="flex min-w-0 flex-1 flex-col bg-[#272727] text-white">
      <div className="flex h-12 shrink-0 items-center gap-0.5 border-b border-[#3A3A3A] px-3">
        <button
          type="button"
          onClick={onToggleList}
          aria-label={listHidden ? 'Показать список писем' : 'Скрыть список писем'}
          title={listHidden ? 'Показать список писем' : 'Скрыть список писем'}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] text-[#C8C8C8] hover:bg-white/10"
        >
          <PanelSplitIcon />
        </button>
        <span className="mx-1.5 h-5 w-px bg-[#3A3A3A]" />
        <MailTextSizeControl />
        <span className="mx-1.5 h-5 w-px bg-[#3A3A3A]" />
        <ToolbarButton icon={<ReplyIcon />} label="Ответить" onClick={onReply} />
        <ToolbarButton icon={<ForwardIcon />} label="Переслать" onClick={onForward} />
        <span className="mx-1.5 h-5 w-px bg-[#3A3A3A]" />
        <ToolbarButton icon={<ArchiveIcon />} label="В архив" onClick={onArchive} />
        <ToolbarButton icon={<TrashIcon />} label="Удалить" onClick={onDelete} />
        <ToolbarButton
          icon={<PinIcon filled={message.pinned} />}
          label={message.pinned ? 'Снять флажок' : 'Флажок'}
          onClick={onTogglePin}
        />
        <span className="flex-1" />
        <div className="relative" ref={moreRef}>
          <button
            type="button"
            onClick={() => setMoreOpen((v) => !v)}
            aria-label="Ещё"
            title="Ещё"
            className="flex h-8 w-8 items-center justify-center rounded-[4px] hover:bg-white/10"
          >
            <MoreIcon />
          </button>
          {moreOpen && (
            <div className="absolute right-0 top-9 z-20 w-[240px] rounded-[8px] border border-[#3A3A3A] bg-[#2C2C2C] p-1 shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
              <button
                type="button"
                onClick={() => {
                  onToggleRead()
                  setMoreOpen(false)
                }}
                className="flex h-9 w-full items-center gap-2.5 rounded-[4px] px-2.5 text-left text-[13px] hover:bg-white/10"
              >
                {message.read ? <MailUnreadIcon /> : <MailOpenIcon />}
                {message.read ? 'Отметить непрочитанным' : 'Отметить прочитанным'}
              </button>
            </div>
          )}
        </div>
        <button type="button" onClick={onClose} aria-label="Закрыть письмо" title="Закрыть письмо" className="flex h-8 w-8 items-center justify-center rounded-[4px] hover:bg-white/10">
          <CloseIcon />
        </button>
      </div>

      <div className="scroll flex flex-1 flex-col overflow-y-auto px-10 py-6">
        <h2 className="m-0 text-[24px] font-semibold leading-8">{message.subject}</h2>
        <div className="mt-5 flex items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[14px] font-semibold"
            style={{ backgroundColor: getAvatarColor(message.from) }}
          >
            {getInitials(message.from)}
          </div>
          <div className="min-w-0 flex-1 leading-[18px]">
            <div className="flex items-center gap-1.5 font-semibold">
              {message.important && <ImportantIcon className="shrink-0 text-[#C42B1C]" />}
              {message.from}
            </div>
            {message.role && <div className="text-[12px] text-[#C8C8C8]">{message.role}</div>}
            <div className="text-[12px] text-[#C8C8C8]">Кому: {message.to}</div>
          </div>
          <div className="shrink-0 self-start text-[12px] text-[#C8C8C8]">{message.time}</div>
        </div>

        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {message.attachments.map((file) => (
              <a
                key={file.url}
                href={file.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-[6px] border border-[#3A3A3A] bg-[#2D2D2D] py-2 pl-2 pr-3 hover:bg-[#333333]"
              >
                {file.type.startsWith('image/') ? (
                  <img src={file.url} alt="" className="h-9 w-8 rounded-[4px] object-cover" />
                ) : (
                  <span className="flex h-9 w-8 items-center justify-center rounded-[4px] bg-[#C42B1C] text-[10px] font-bold">
                    {(file.name.split('.').pop() || 'FILE').slice(0, 3).toUpperCase()}
                  </span>
                )}
                <span className="leading-[18px]">
                  <div className="text-[13px] font-semibold">{file.name}</div>
                  <div className="text-[12px] text-[#C8C8C8]">{formatSize(file.size)}</div>
                </span>
              </a>
            ))}
          </div>
        )}

        <div
          className="mail-rich-text mt-5 max-w-[720px] whitespace-pre-line"
          style={mailTextStyle(textSize)}
          dangerouslySetInnerHTML={{ __html: message.body }}
        />

        <div className="flex-1" />

        <label className="mt-5 flex h-11 max-w-[720px] shrink-0 items-center gap-2.5 rounded-[6px] border border-[#3A3A3A] border-b-[#5A5A5A] bg-[#2D2D2D] pl-3.5 pr-2 text-[#C8C8C8]">
          <ReplyIcon className="shrink-0" />
          <input
            value={quickReply}
            onChange={(e) => setQuickReply(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') sendQuickReply()
            }}
            placeholder={`Ответить: ${party}`}
            className="min-w-0 flex-1 bg-transparent text-[14px] text-white outline-none placeholder:text-[#C8C8C8]"
          />
          <button
            type="button"
            onClick={sendQuickReply}
            disabled={!quickReply.trim()}
            aria-label="Отправить"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] bg-[#60CDFF] text-black enabled:hover:brightness-[1.08] disabled:opacity-40"
          >
            <SentIcon />
          </button>
        </label>
      </div>
    </main>
  )
}
