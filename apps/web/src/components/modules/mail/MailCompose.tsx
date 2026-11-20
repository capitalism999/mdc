import { useEffect, useRef, useState } from 'react'
import type { MailAttachment } from '../../../types'
import { MailRecipients } from './MailRecipients'
import { resolveRecipient } from './mailDirectory'
import { AttachIcon, CloseIcon, ImportantIcon, SentIcon } from './icons'

interface MailComposeProps {
  initialTo: string
  initialSubject: string
  initialBody?: string
  onSend: (to: string, subject: string, bodyHtml: string, attachments: MailAttachment[], important: boolean) => void
}

function hasVisibleHtmlText(html: string) {
  return html.replace(/<[^>]+>/g, '').trim().length > 0
}

/**
 * Formatting toolbar backed by `document.execCommand` — deprecated in the
 * web-standards sense, but the MDT only ever runs inside Chromium (FiveM's
 * NUI is CEF, and the standalone site targets evergreen browsers), where
 * it's still fully supported and is by far the smallest way to get rich
 * text editing without a dependency. Deliberately only as rich as the
 * reference's own toolbar (Ж/К/Ч, 4 alignments, one bulleted list, emoji) —
 * no font size, color or list-style picker, since the reference doesn't
 * have them either.
 */
const EMOJIS = [
  '🙂', '😀', '😅', '😡', '👍', '👎', '✅', '❌', '⚠️', '⏰',
  '🚓', '🚨', '👮', '🔫', '🛡️', '📋', '📝', '📎', '📍', '📞',
]

function AlignLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M3 5h14M3 9h9M3 13h14M3 17h9" />
    </svg>
  )
}
function AlignCenterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M3 5h14M5.5 9h9M3 13h14M5.5 17h9" />
    </svg>
  )
}
function AlignRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M3 5h14M8 9h9M3 13h14M8 17h9" />
    </svg>
  )
}
function AlignJustifyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M3 5h14M3 9h14M3 13h14M3 17h14" />
    </svg>
  )
}
function ListBulletedIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M8 5h9M8 10h9M8 15h9" />
      <circle cx="4" cy="5" r="1" fill="currentColor" stroke="none" />
      <circle cx="4" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="4" cy="15" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}
function EmojiIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="10" cy="10" r="7.5" />
      <path d="M6.8 11.8a4 4 0 006.4 0" />
      <circle cx="7.5" cy="8" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="12.5" cy="8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  )
}

const ALIGN_OPTIONS = [
  { command: 'justifyLeft', label: 'По левому краю', stateKey: 'justifyLeft', icon: <AlignLeftIcon /> },
  { command: 'justifyCenter', label: 'По центру', stateKey: 'justifyCenter', icon: <AlignCenterIcon /> },
  { command: 'justifyRight', label: 'По правому краю', stateKey: 'justifyRight', icon: <AlignRightIcon /> },
  { command: 'justifyFull', label: 'По ширине', stateKey: 'justifyFull', icon: <AlignJustifyIcon /> },
] as const

type ActiveFormats = {
  bold: boolean
  italic: boolean
  underline: boolean
  justifyLeft: boolean
  justifyCenter: boolean
  justifyRight: boolean
  justifyFull: boolean
  list: boolean
}

const EMPTY_FORMATS: ActiveFormats = {
  bold: false,
  italic: false,
  underline: false,
  justifyLeft: true,
  justifyCenter: false,
  justifyRight: false,
  justifyFull: false,
  list: false,
}

function hasVisibleText(el: HTMLElement | null) {
  return (el?.textContent ?? '').trim().length > 0
}

function closestList(tag: 'UL') {
  const sel = window.getSelection()
  let node = sel?.anchorNode ?? null
  while (node && node.nodeName !== tag) node = node.parentNode
  return node as HTMLElement | null
}

export function MailCompose({ initialTo, initialSubject, initialBody, onSend }: MailComposeProps) {
  // a reply / forward starts with the canonical name («12D3 Thorne Watts» → «Thorne Watts»)
  const [toList, setToList] = useState<string[]>(() => (initialTo.trim() ? [resolveRecipient(initialTo)?.name ?? initialTo.trim()] : []))
  const [toInput, setToInput] = useState('')
  const [subject, setSubject] = useState(initialSubject)
  const [attachments, setAttachments] = useState<MailAttachment[]>([])
  const [important, setImportant] = useState(false)
  const [hasBody, setHasBody] = useState(() => hasVisibleHtmlText(initialBody ?? ''))
  const [active, setActive] = useState<ActiveFormats>(EMPTY_FORMATS)
  const [openEmoji, setOpenEmoji] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)

  const badTo = toList.filter((n) => !resolveRecipient(n))
  const pendingTo = toInput.trim().length > 0
  const canSend = toList.length > 0 && badTo.length === 0 && !pendingTo && subject.trim().length > 0 && hasBody
  /** why «Отправить» is off — shown next to it */
  const sendHint = toList.length === 0 && !pendingTo ? 'Укажите получателя' : pendingTo ? 'Выберите получателя из списка' : badTo.length ? 'Уберите неизвестных получателей' : !subject.trim() ? 'Укажите тему' : !hasBody ? 'Напишите текст письма' : ''

  useEffect(() => {
    if (!openEmoji) return
    function handleClickOutside(event: MouseEvent) {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        setOpenEmoji(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openEmoji])

  function updateActiveFormats() {
    setActive({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      justifyLeft: document.queryCommandState('justifyLeft'),
      justifyCenter: document.queryCommandState('justifyCenter'),
      justifyRight: document.queryCommandState('justifyRight'),
      justifyFull: document.queryCommandState('justifyFull'),
      list: !!closestList('UL'),
    })
  }

  /** Buttons that keep the editor's live selection (no blur) via preventDefault. */
  function applyCommand(command: string) {
    editorRef.current?.focus()
    document.execCommand(command, false)
    setHasBody(hasVisibleText(editorRef.current))
    updateActiveFormats()
  }

  function insertEmoji(emoji: string) {
    editorRef.current?.focus()
    document.execCommand('insertText', false, emoji)
    setHasBody(hasVisibleText(editorRef.current))
    setOpenEmoji(false)
  }

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    const next: MailAttachment[] = Array.from(files).map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
    }))
    setAttachments((prev) => [...prev, ...next])
  }

  function removeAttachment(url: string) {
    setAttachments((prev) => prev.filter((file) => file.url !== url))
  }

  function handleSend() {
    onSend(toList.join(', '), subject.trim(), editorRef.current?.innerHTML ?? '', attachments, important)
  }

  const toolBtnCls = (isActive: boolean) =>
    `flex h-[30px] w-[30px] items-center justify-center rounded-[4px] text-[14px] hover:bg-white/10 ${isActive ? 'bg-white/10 text-[#60CDFF]' : 'text-white'}`
  const noBlur = (event: { preventDefault: () => void }) => event.preventDefault()

  return (
    <div className="flex h-full flex-col bg-[#1D2027] text-white">
      <div className="m-2 flex min-h-0 flex-1 flex-col overflow-hidden rounded-[8px] border border-[#3A3A3A] bg-[#272727]">
        <div className="flex min-h-[48px] items-start gap-3 border-b border-[#383838] px-5 text-[14px]">
          <label htmlFor="mail-to" className="w-14 shrink-0 pt-[9px] text-[#C8C8C8]">
            Кому
          </label>
          <MailRecipients value={toList} onChange={setToList} input={toInput} onInputChange={setToInput} />
        </div>

        <label htmlFor="mail-subject" className="flex h-12 items-center gap-3 border-b border-[#383838] px-5 text-[14px]">
          <span className="w-14 shrink-0 text-[#C8C8C8]">Тема</span>
          <input
            id="mail-subject"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="Тема сообщения"
            className="flex-1 bg-transparent text-[14px] font-semibold text-white outline-none placeholder:font-normal placeholder:text-[#C8C8C8]"
          />
        </label>

        <div ref={toolbarRef} className="flex items-center gap-0.5 border-b border-[#383838] px-4 py-2">
          <button type="button" title="Жирный" onMouseDown={noBlur} onClick={() => applyCommand('bold')} className={`${toolBtnCls(active.bold)} font-bold`}>
            Ж
          </button>
          <button type="button" title="Курсив" onMouseDown={noBlur} onClick={() => applyCommand('italic')} className={`${toolBtnCls(active.italic)} italic`}>
            К
          </button>
          <button
            type="button"
            title="Подчёркнутый"
            onMouseDown={noBlur}
            onClick={() => applyCommand('underline')}
            className={`${toolBtnCls(active.underline)} underline`}
          >
            Ч
          </button>
          <span className="mx-1.5 h-[18px] w-px bg-[#3A3A3A]" />
          {ALIGN_OPTIONS.map((opt) => (
            <button
              key={opt.command}
              type="button"
              title={opt.label}
              onMouseDown={noBlur}
              onClick={() => applyCommand(opt.command)}
              className={toolBtnCls(active[opt.stateKey])}
            >
              {opt.icon}
            </button>
          ))}
          <span className="mx-1.5 h-[18px] w-px bg-[#3A3A3A]" />
          <button
            type="button"
            title="Маркированный список"
            onMouseDown={noBlur}
            onClick={() => applyCommand('insertUnorderedList')}
            className={toolBtnCls(active.list)}
          >
            <ListBulletedIcon />
          </button>
          <div className="relative">
            <button type="button" title="Эмодзи" onMouseDown={noBlur} onClick={() => setOpenEmoji((v) => !v)} className={toolBtnCls(openEmoji)}>
              <EmojiIcon />
            </button>
            {openEmoji && (
              <div className="absolute left-0 top-full z-10 mt-1 grid w-[224px] grid-cols-8 gap-1 rounded-[6px] border border-[#3A3A3A] bg-[#2C2C2C] p-2 shadow-lg">
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onMouseDown={noBlur}
                    onClick={() => insertEmoji(emoji)}
                    className="flex h-7 w-7 items-center justify-center rounded-[4px] text-[15px] hover:bg-white/10"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,.doc,.docx,.txt"
            multiple
            className="hidden"
            onChange={(event) => {
              handleFiles(event.target.files)
              event.target.value = ''
            }}
          />
        </div>

        <div
          ref={editorRef}
          contentEditable
          onInput={() => setHasBody(hasVisibleText(editorRef.current))}
          onPaste={(event) => {
            // a pasted picture goes in as an attachment, not into the text
            const images = Array.from(event.clipboardData.items)
              .filter((it) => it.kind === 'file' && it.type.startsWith('image/'))
              .map((it) => it.getAsFile())
              .filter((f): f is File => !!f)
            if (!images.length) return
            event.preventDefault()
            const now = new Date()
            const p2 = (n: number) => String(n).padStart(2, '0')
            const stampName = `Снимок ${p2(now.getDate())}.${p2(now.getMonth() + 1)} ${p2(now.getHours())}-${p2(now.getMinutes())}-${p2(now.getSeconds())}`
            setAttachments((prev) => [
              ...prev,
              ...images.map((file, i) => ({
                // clipboard images come as «image.png» — give them a readable name
                name: file.name && file.name !== 'image.png' ? file.name : `${stampName}${images.length > 1 ? ` (${i + 1})` : ''}.png`,
                size: file.size,
                type: file.type,
                url: URL.createObjectURL(file),
              })),
            ])
          }}
          onKeyUp={updateActiveFormats}
          onMouseUp={updateActiveFormats}
          onFocus={updateActiveFormats}
          data-placeholder="Текст сообщения..."
          className="mail-rich-text mail-editor flex-1 overflow-y-auto bg-transparent px-7 pb-4 pt-[18px] text-[14px] leading-[22px] text-white outline-none"
          suppressContentEditableWarning
          dangerouslySetInnerHTML={initialBody ? { __html: initialBody } : undefined}
        />

        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 border-t border-[#383838] px-7 py-3">
            {attachments.map((file) => (
              <div key={file.url} className="flex items-center gap-2 rounded-[6px] border border-[#3A3A3A] bg-[#2D2D2D] px-2 py-1.5">
                {file.type.startsWith('image/') ? (
                  <img src={file.url} alt="" className="h-8 w-8 rounded-[4px] object-cover" />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-white/10 text-[10px] font-bold text-white/80">
                    {(file.name.split('.').pop() || 'FILE').slice(0, 3).toUpperCase()}
                  </span>
                )}
                <span className="max-w-[120px] truncate text-[12px] text-white/80">{file.name}</span>
                <button type="button" onClick={() => removeAttachment(file.url)} aria-label="Удалить вложение" className="text-white/50 hover:text-white">
                  <CloseIcon className="h-2.5 w-2.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex h-[60px] shrink-0 items-center gap-2 border-t border-[#383838] px-4">
          <div className="flex-1" />
          <button
            type="button"
            onClick={() => setImportant((v) => !v)}
            title={important ? 'Снять пометку "Важное"' : 'Пометить как важное'}
            className={`flex h-9 w-9 items-center justify-center rounded-[4px] border ${
              important ? 'border-[#C42B1C] text-[#C42B1C]' : 'border-[#454545] text-white/80 hover:text-white'
            } hover:bg-white/10`}
          >
            <ImportantIcon />
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-9 items-center gap-2 rounded-[4px] border border-[#454545] bg-[#2D2D2D] px-3.5 text-[13px] text-white hover:bg-[#333333]"
          >
            <AttachIcon />
            Вложить
          </button>
          {!canSend && sendHint && <span className="text-[12px] text-[#C8C8C8]">{sendHint}</span>}
          <button
            type="button"
            disabled={!canSend}
            onClick={handleSend}
            className="flex h-9 items-center gap-2 rounded-[4px] bg-[#60CDFF] px-5 text-[13px] font-semibold text-black enabled:hover:brightness-[1.08] disabled:opacity-40"
          >
            <SentIcon />
            Отправить
          </button>
        </div>
      </div>
    </div>
  )
}
