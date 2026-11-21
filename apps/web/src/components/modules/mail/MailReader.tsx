import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { MailAttachment, MailMessage } from '../../../types'
import { getAvatarColor, getInitials } from './avatar'
import { MailTextSizeControl, mailTextStyle, useMailTextSize } from './mailTextSize'
import {
  CloseIcon,
  DraftIcon,
  ForwardIcon,
  ImportantIcon,
  InboxIcon,
  MailOpenIcon,
  MailUnreadIcon,
  MoreIcon,
  PanelSplitIcon,
  PinIcon,
  ReplyIcon,
  SentIcon,
  TrashIcon,
} from './icons'

interface MailReaderProps {
  message: MailMessage
  listHidden: boolean
  /** narrow window: the reader is the only pane; the first button goes back to the list */
  narrow?: boolean
  onBack: () => void
  onToggleList: () => void
  onReply: () => void
  onReplyAll: () => void
  onForward: () => void
  onEditDraft: () => void
  onArchive: () => void
  onRestore: () => void
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

function fileExt(name: string) {
  return (name.split('.').pop() || 'FILE').slice(0, 3).toUpperCase()
}

function ReplyAllIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6.5 5L2.5 9l4 4" />
      <path d="M10.5 5l-4 4 4 4" />
      <path d="M6.5 9h6a5 5 0 015 5v1.5" />
    </svg>
  )
}

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 10H4M9 5l-5 5 5 5" />
    </svg>
  )
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

/** Toolbar action; the caption folds away when the reading pane gets narrow
 * (the icon + tooltip stay), so nothing is clipped in a small window. */
function ToolbarButton({ icon, label, onClick, danger }: { icon: ReactNode; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`flex h-8 shrink-0 items-center gap-2 whitespace-nowrap rounded-[4px] px-2 text-[13px] hover:bg-white/10 @min-[980px]:px-2.5 ${danger ? 'text-[#FF99A4]' : ''}`}
    >
      <span className="flex h-4 w-4 items-center justify-center">{icon}</span>
      <span className="hidden @min-[980px]:inline">{label}</span>
    </button>
  )
}

/** Opened attachment: pictures and real files (attached or pasted here) are
 * shown in place and can be saved; files of the demo letters exist only as a
 * name and size, which is what the card says. */
function AttachmentViewer({ file, onClose }: { file: MailAttachment; onClose: () => void }) {
  const real = file.url !== '#' && file.url !== ''
  const isImage = file.type.startsWith('image/')
  const inline = real && (isImage || file.type === 'application/pdf' || file.type.startsWith('text/'))
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', key)
    return () => document.removeEventListener('keydown', key)
  }, [onClose])
  return (
    <div role="dialog" aria-label={`Вложение ${file.name}`} className="absolute inset-0 z-30 flex flex-col bg-[#1D2027]/95">
      <div className="flex h-12 shrink-0 items-center gap-3 border-b border-[#3A3A3A] px-4">
        <span className="flex h-7 w-6 shrink-0 items-center justify-center rounded-[3px] bg-[#C42B1C] text-[8px] font-bold">{fileExt(file.name)}</span>
        <span className="min-w-0 flex-1 truncate">
          <span className="font-semibold">{file.name}</span>
          <span className="ml-2 text-[12px] text-[#C8C8C8]">{formatSize(file.size)}</span>
        </span>
        {real && (
          <a
            href={file.url}
            download={file.name}
            className="flex h-8 shrink-0 items-center gap-2 rounded-[4px] border border-[#454545] bg-[#2D2D2D] px-3 text-[13px] hover:bg-[#333333]"
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M10 3v10M5.5 8.5L10 13l4.5-4.5M4 16.5h12" />
            </svg>
            Сохранить
          </a>
        )}
        <button type="button" onClick={onClose} aria-label="Закрыть вложение" title="Закрыть (Esc)" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] hover:bg-white/10">
          <CloseIcon />
        </button>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center p-6">
        {inline && isImage ? (
          <img src={file.url} alt={file.name} className="max-h-full max-w-full rounded-[4px] object-contain" />
        ) : inline ? (
          <iframe src={file.url} title={file.name} className="h-full w-full rounded-[4px] border border-[#3A3A3A] bg-white" />
        ) : (
          <div className="flex max-w-[360px] flex-col items-center gap-3 text-center">
            <span className="flex h-20 w-16 items-center justify-center rounded-[6px] bg-[#C42B1C] text-[16px] font-bold">{fileExt(file.name)}</span>
            <div className="text-[15px] font-semibold">{file.name}</div>
            <div className="text-[13px] text-[#C8C8C8]">
              {formatSize(file.size)} · {real ? 'предпросмотр для этого типа файла недоступен — сохраните его' : 'файл хранится в архиве MDC, предпросмотр недоступен'}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Reading pane: a top action toolbar (reply/forward, archive/delete/flag,
 * close), the message header, body, attachments, and a quick-reply bar
 * pinned to the bottom so a short reply doesn't require opening full
 * compose. Flagging a message happens only from here, not from the list
 * row — matching the reference, which has no per-row flag toggle. Drafts
 * get «Изменить» instead of reply/forward; letters in «Архив» / «Удалённые»
 * get a restore action, and deleting from «Удалённые» asks first.
 */
export function MailReader({
  message,
  listHidden,
  narrow,
  onBack,
  onToggleList,
  onReply,
  onReplyAll,
  onForward,
  onEditDraft,
  onArchive,
  onRestore,
  onDelete,
  onTogglePin,
  onToggleRead,
  onClose,
  onQuickReply,
}: MailReaderProps) {
  const textSize = useMailTextSize()
  const [quickReply, setQuickReply] = useState('')
  const [moreOpen, setMoreOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [preview, setPreview] = useState<MailAttachment | null>(null)
  const moreRef = useRef<HTMLDivElement>(null)
  const confirmRef = useRef<HTMLDivElement>(null)
  const party = message.folder === 'sent' ? message.to : message.from
  const isDraft = message.folder === 'drafts' || message.from === 'Черновик'
  const inTrash = message.folder === 'trash'
  const restorable = message.folder === 'archive' || inTrash

  useEffect(() => {
    if (!moreOpen && !confirmDelete) return
    function onDown(event: MouseEvent) {
      const t = event.target as Node
      if (moreRef.current && !moreRef.current.contains(t)) setMoreOpen(false)
      if (confirmRef.current && !confirmRef.current.contains(t)) setConfirmDelete(false)
    }
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      setMoreOpen(false)
      setConfirmDelete(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [moreOpen, confirmDelete])

  function sendQuickReply() {
    const text = quickReply.trim()
    if (!text) return
    onQuickReply(text)
    setQuickReply('')
  }

  function menuItem(icon: ReactNode, label: string, action: () => void) {
    return (
      <button
        type="button"
        onClick={() => {
          action()
          setMoreOpen(false)
        }}
        className="flex h-9 w-full items-center gap-2.5 rounded-[4px] px-2.5 text-left text-[13px] hover:bg-white/10"
      >
        <span className="flex h-4 w-4 shrink-0 items-center justify-center">{icon}</span>
        {label}
      </button>
    )
  }

  return (
    <main className="@container relative flex min-w-0 flex-1 flex-col bg-[#272727] text-white">
      <div className="flex h-12 shrink-0 items-center gap-0.5 border-b border-[#3A3A3A] px-3">
        {narrow ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="К списку писем"
            title="К списку писем"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] text-[#C8C8C8] hover:bg-white/10"
          >
            <BackIcon />
          </button>
        ) : (
          <button
            type="button"
            onClick={onToggleList}
            aria-label={listHidden ? 'Показать список писем' : 'Скрыть список писем'}
            title={listHidden ? 'Показать список писем' : 'Скрыть список писем'}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] text-[#C8C8C8] hover:bg-white/10"
          >
            <PanelSplitIcon />
          </button>
        )}
        <span className="mx-1.5 h-5 w-px shrink-0 bg-[#3A3A3A]" />
        <MailTextSizeControl />
        <span className="mx-1.5 h-5 w-px shrink-0 bg-[#3A3A3A]" />
        {isDraft ? (
          <ToolbarButton icon={<DraftIcon />} label="Изменить" onClick={onEditDraft} />
        ) : (
          <>
            <ToolbarButton icon={<ReplyIcon />} label="Ответить" onClick={onReply} />
            <ToolbarButton icon={<ReplyAllIcon />} label="Ответить всем" onClick={onReplyAll} />
            <ToolbarButton icon={<ForwardIcon />} label="Переслать" onClick={onForward} />
          </>
        )}
        <span className="mx-1.5 h-5 w-px shrink-0 bg-[#3A3A3A]" />
        {restorable ? (
          <ToolbarButton icon={<InboxIcon />} label="Восстановить" onClick={onRestore} />
        ) : (
          !isDraft && <ToolbarButton icon={<ArchiveIcon />} label="В архив" onClick={onArchive} />
        )}
        {inTrash ? (
          <div className="relative shrink-0" ref={confirmRef}>
            <ToolbarButton icon={<TrashIcon />} label="Удалить навсегда" onClick={() => setConfirmDelete((v) => !v)} danger />
            {confirmDelete && (
              <div role="alertdialog" aria-label="Удалить навсегда?" className="absolute left-0 top-9 z-20 w-[260px] rounded-[8px] border border-[#3A3A3A] bg-[#2C2C2C] p-3 shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
                <div className="text-[13px] font-semibold">Удалить письмо навсегда?</div>
                <div className="mt-1 text-[12px] text-[#C8C8C8]">Его нельзя будет восстановить.</div>
                <div className="mt-3 flex justify-end gap-2">
                  <button type="button" onClick={() => setConfirmDelete(false)} className="h-8 rounded-[4px] border border-[#454545] px-3 text-[13px] hover:bg-white/10">
                    Отмена
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmDelete(false)
                      onDelete()
                    }}
                    className="h-8 rounded-[4px] bg-[#C42B1C] px-3 text-[13px] font-semibold hover:brightness-110"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <ToolbarButton icon={<TrashIcon />} label="Удалить" onClick={onDelete} />
        )}
        <ToolbarButton icon={<PinIcon filled={message.pinned} />} label={message.pinned ? 'Снять флажок' : 'Флажок'} onClick={onTogglePin} />
        <span className="min-w-0 flex-1" />
        <div className="relative shrink-0" ref={moreRef}>
          <button
            type="button"
            onClick={() => setMoreOpen((v) => !v)}
            aria-label="Ещё"
            title="Ещё"
            aria-expanded={moreOpen}
            className="flex h-8 w-8 items-center justify-center rounded-[4px] hover:bg-white/10"
          >
            <MoreIcon />
          </button>
          {moreOpen && (
            <div className="absolute right-0 top-9 z-20 w-[240px] rounded-[8px] border border-[#3A3A3A] bg-[#2C2C2C] p-1 shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
              {menuItem(message.read ? <MailUnreadIcon /> : <MailOpenIcon />, message.read ? 'Отметить непрочитанным' : 'Отметить прочитанным', onToggleRead)}
              {!narrow && menuItem(<PanelSplitIcon />, listHidden ? 'Показать список писем' : 'Скрыть список писем', onToggleList)}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть письмо"
          title="Закрыть письмо"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] hover:bg-white/10"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="scroll flex flex-1 flex-col overflow-y-auto px-6 py-6 @min-[700px]:px-10">
        <h2 className="m-0 break-words text-[24px] font-semibold leading-8">{message.subject || '(без темы)'}</h2>
        <div className="mt-5 flex items-center gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[14px] font-semibold"
            style={{ backgroundColor: getAvatarColor(isDraft ? message.to : message.from) }}
          >
            {getInitials(isDraft ? message.to || '?' : message.from)}
          </div>
          <div className="min-w-0 flex-1 leading-[18px]">
            <div className="flex items-center gap-1.5 font-semibold">
              {message.important && <ImportantIcon className="shrink-0 text-[#C42B1C]" />}
              {isDraft ? <span className="shrink-0 text-[#FF6B6B]">[Черновик]</span> : <span className="truncate">{message.from}</span>}
            </div>
            {message.role && <div className="text-[12px] text-[#C8C8C8]">{message.role}</div>}
            <div className="break-words text-[12px] text-[#C8C8C8]">Кому: {message.to || '—'}</div>
            {message.cc && <div className="break-words text-[12px] text-[#C8C8C8]">Копия: {message.cc}</div>}
          </div>
          <div className="shrink-0 self-start text-[12px] text-[#C8C8C8]">{message.time}</div>
        </div>

        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {message.attachments.map((file, i) => (
              <button
                key={`${file.url}-${i}`}
                type="button"
                onClick={() => setPreview(file)}
                title={`Открыть ${file.name}`}
                className="flex max-w-full items-center gap-3 rounded-[6px] border border-[#3A3A3A] bg-[#2D2D2D] py-2 pl-2 pr-3 text-left hover:bg-[#333333]"
              >
                {file.type.startsWith('image/') && file.url !== '#' ? (
                  <img src={file.url} alt="" className="h-9 w-8 shrink-0 rounded-[4px] object-cover" />
                ) : (
                  <span className="flex h-9 w-8 shrink-0 items-center justify-center rounded-[4px] bg-[#C42B1C] text-[10px] font-bold">{fileExt(file.name)}</span>
                )}
                <span className="min-w-0 leading-[18px]">
                  <span className="block truncate text-[13px] font-semibold">{file.name}</span>
                  <span className="block text-[12px] text-[#C8C8C8]">{formatSize(file.size)}</span>
                </span>
              </button>
            ))}
          </div>
        )}

        <div
          className="mail-rich-text mt-5 max-w-[720px] whitespace-pre-line break-words"
          style={mailTextStyle(textSize)}
          dangerouslySetInnerHTML={{ __html: message.body }}
        />

        <div className="flex-1" />

        {!isDraft && (
          <label className="mt-5 flex h-11 max-w-[720px] shrink-0 items-center gap-2.5 rounded-[6px] border border-[#3A3A3A] border-b-[#5A5A5A] bg-[#2D2D2D] pl-3.5 pr-2 text-[#C8C8C8]">
            <ReplyIcon className="shrink-0" />
            <input
              value={quickReply}
              onChange={(e) => setQuickReply(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendQuickReply()
              }}
              placeholder={`Ответить: ${party}`}
              aria-label="Быстрый ответ"
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
        )}
      </div>

      {preview && <AttachmentViewer file={preview} onClose={() => setPreview(null)} />}
    </main>
  )
}
