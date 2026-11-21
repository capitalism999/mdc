import { useEffect, useRef, useState } from 'react'
import type { MailAttachment } from '../../../types'
import type { MailDraft } from './MailComposeWindow'
import { MailRecipients } from './MailRecipients'
import { findRecipients, resolveRecipient } from './mailDirectory'
import { AttachIcon, CloseIcon, DraftIcon, ImportantIcon, SentIcon, TrashIcon } from './icons'
import { FontSizeDropdown, mailTextStyle } from './mailTextSize'

/** Font sizes offered in the compose bar (Outlook's list). */
const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 36]
/** the editor's base size */
const BASE_SIZE = 14

interface MailComposeProps {
  initialTo: string
  initialCc?: string
  initialSubject: string
  initialBody?: string
  initialAttachments?: MailAttachment[]
  initialImportant?: boolean
  draftId?: string
  onSend: (draft: MailDraft, draftId?: string) => void
  onSaveDraft: (draft: MailDraft, draftId?: string, notify?: boolean) => string
  onDiscard: () => void
  /** filled by Compose: run when the window is being closed — saves unsaved
   * changes to «Черновики» and lets the close go ahead */
  closeGuardRef?: { current: (() => boolean) | null }
  /** the subject as it is typed — the compose window renames itself after it */
  onSubjectChange?: (subject: string) => void
}

/** «12D3 Thorne Watts, Lisa Brooks» → canonical directory names. */
function splitRecipients(text: string | undefined) {
  return (text ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => resolveRecipient(s)?.name ?? s)
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} Б`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} КБ`
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`
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
 * reference's own toolbar (font size, Ж/К/Ч, 4 alignments, one bulleted
 * list, emoji) — no color or list-style picker.
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

export function MailCompose({
  initialTo,
  initialCc,
  initialSubject,
  initialBody,
  initialAttachments,
  initialImportant,
  draftId: initialDraftId,
  onSend,
  onSaveDraft,
  onDiscard,
  closeGuardRef,
  onSubjectChange,
}: MailComposeProps) {
  // a reply / forward starts with the canonical name («12D3 Thorne Watts» → «Thorne Watts»)
  const [toList, setToList] = useState<string[]>(() => splitRecipients(initialTo))
  const [toInput, setToInput] = useState('')
  const [ccList, setCcList] = useState<string[]>(() => splitRecipients(initialCc))
  const [ccInput, setCcInput] = useState('')
  /** «Копия» row: shown once asked for, or when the letter already has Cc */
  const [showCc, setShowCc] = useState(() => splitRecipients(initialCc).length > 0)
  const [ccAutoFocus, setCcAutoFocus] = useState(false)
  const [subject, setSubject] = useState(initialSubject)
  const subjectCb = useRef(onSubjectChange)
  subjectCb.current = onSubjectChange
  useEffect(() => {
    subjectCb.current?.(subject)
  }, [subject])
  const [attachments, setAttachments] = useState<MailAttachment[]>(() => initialAttachments ?? [])
  const [important, setImportant] = useState(!!initialImportant)
  /** id of this letter in «Черновики» once saved there */
  const [draftId, setDraftId] = useState(initialDraftId)
  /** «Черновик сохранён в 02:14» — cleared by the next edit */
  const [savedAt, setSavedAt] = useState<string | null>(null)
  /** body edited since the window opened / since the last save */
  const [bodyDirty, setBodyDirty] = useState(false)
  const [hasBody, setHasBody] = useState(() => hasVisibleHtmlText(initialBody ?? ''))
  const [active, setActive] = useState<ActiveFormats>(EMPTY_FORMATS)
  const [openEmoji, setOpenEmoji] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  /** font size at the caret / of the selection (null = mixed); picked size waits here for text typed at a bare caret */
  const [curSize, setCurSize] = useState<number | null>(BASE_SIZE)
  const pendingSize = useRef(BASE_SIZE)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)

  const badTo = [...toList, ...ccList].filter((n) => !resolveRecipient(n))
  const pendingText = [toInput, showCc ? ccInput : ''].map((t) => t.trim()).find(Boolean) ?? ''
  const pendingTo = pendingText.length > 0
  // a letter may be just an attachment (e.g. a pasted screenshot)
  const hasContent = hasBody || attachments.length > 0
  const canSend = toList.length > 0 && badTo.length === 0 && !pendingTo && subject.trim().length > 0 && hasContent
  /** why «Отправить» is off — shown next to it */
  const sendHint = pendingTo
    ? findRecipients(pendingText).length
      ? 'Выберите получателя из списка'
      : 'Получатель не найден'
    : toList.length === 0
      ? 'Укажите получателя'
      : badTo.length
        ? 'Уберите неизвестных получателей'
        : !subject.trim()
          ? 'Укажите тему'
          : !hasContent
            ? 'Напишите текст письма'
            : ''
  const canSaveDraft = toList.length > 0 || ccList.length > 0 || subject.trim().length > 0 || hasContent

  // a reply / draft already has its recipient: start typing in the body, at the very top
  useEffect(() => {
    const ed = editorRef.current
    if (!ed || toList.length === 0) return
    ed.focus()
    const range = document.createRange()
    range.setStart(ed, 0)
    range.collapse(true)
    const sel = window.getSelection()
    sel?.removeAllRanges()
    sel?.addRange(range)
    // mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // any edit makes the «saved» note stale
  useEffect(() => {
    setSavedAt(null)
  }, [toList, ccList, subject, attachments, important, hasBody])

  /** fields (besides the body) as last saved — anything else is unsaved work */
  const fieldsSig = JSON.stringify([toList, ccList, subject, attachments.map((a) => a.url), important])
  const [savedSig, setSavedSig] = useState(fieldsSig)
  const dirty = bodyDirty || fieldsSig !== savedSig

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
    setCurSize(sizeAtSelection())
  }

  /** px size of the selected text (null when it mixes sizes), or at the caret. */
  function sizeAtSelection(): number | null {
    const ed = editorRef.current
    const sel = window.getSelection()
    if (!ed || !sel || !sel.rangeCount || !ed.contains(sel.anchorNode)) return BASE_SIZE
    const px = (n: Node | null) => {
      const el = n && n.nodeType === Node.TEXT_NODE ? n.parentElement : (n as Element | null)
      return el ? Math.round(parseFloat(getComputedStyle(el).fontSize)) : BASE_SIZE
    }
    const range = sel.getRangeAt(0)
    if (range.collapsed) return px(sel.anchorNode)
    const sizes = new Set<number>()
    const walker = document.createTreeWalker(range.commonAncestorContainer, NodeFilter.SHOW_TEXT)
    for (let n = walker.currentNode; n; n = walker.nextNode() as Node) {
      if (n.nodeType === Node.TEXT_NODE && (n.textContent ?? '').trim() && range.intersectsNode(n)) sizes.add(px(n))
    }
    if (!sizes.size) return px(sel.anchorNode)
    return sizes.size === 1 ? [...sizes][0] : null
  }

  /** execCommand('fontSize') only knows sizes 1–7: it marks the text with <font size="7">, which gets a px size here. */
  function normalizeFonts() {
    // restyled in place (not re-wrapped), so the caret / selection inside it stays put
    editorRef.current?.querySelectorAll<HTMLElement>('font[size="7"]').forEach((font) => {
      font.removeAttribute('size')
      font.style.fontSize = `${pendingSize.current}px`
    })
  }

  /** Font size for the selection — or, at a bare caret, for what is typed next. */
  function applyFontSize(px: number) {
    editorRef.current?.focus()
    pendingSize.current = px
    document.execCommand('styleWithCSS', false, 'false')
    document.execCommand('fontSize', false, '7')
    normalizeFonts()
    setCurSize(px)
    setHasBody(hasVisibleText(editorRef.current))
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

  function currentDraft(): MailDraft {
    return {
      to: toList.join(', '),
      cc: ccList.join(', '),
      subject: subject.trim(),
      bodyHtml: hasVisibleText(editorRef.current) ? (editorRef.current?.innerHTML ?? '') : '',
      attachments,
      important,
    }
  }

  function handleSend() {
    if (!canSend) return
    onSend(currentDraft(), draftId)
  }

  function handleSaveDraft() {
    if (!canSaveDraft) return
    setDraftId(onSaveDraft(currentDraft(), draftId))
    setSavedSig(fieldsSig)
    setBodyDirty(false)
    const now = new Date()
    setSavedAt(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`)
  }

  // closing the window (✕, Ctrl+W, «ЗАКРЫТЬ»…) keeps unsaved work as a draft
  if (closeGuardRef) {
    closeGuardRef.current = () => {
      if (dirty && canSaveDraft) onSaveDraft(currentDraft(), draftId, true)
      return true
    }
  }

  const toolBtnCls = (isActive: boolean) =>
    `flex h-[30px] w-[30px] items-center justify-center rounded-[4px] text-[14px] hover:bg-white/10 ${isActive ? 'bg-white/10 text-[#60CDFF]' : 'text-white'}`
  const noBlur = (event: { preventDefault: () => void }) => event.preventDefault()
  return (
    <div
      className="flex h-full flex-col bg-[#1D2027] text-white"
      onKeyDown={(event) => {
        if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
          event.preventDefault()
          handleSend()
        }
      }}
    >
      <div className="m-2 flex min-h-0 flex-1 flex-col overflow-hidden rounded-[8px] border border-[#3A3A3A] bg-[#272727]">
        <div className="flex min-h-[48px] items-start gap-3 border-b border-[#383838] px-5 text-[14px]">
          <label htmlFor="mail-to" className="w-14 shrink-0 pt-[9px] text-[#C8C8C8]">
            Кому
          </label>
          <MailRecipients value={toList} onChange={setToList} input={toInput} onInputChange={setToInput} />
          {!showCc && (
            <button
              type="button"
              onClick={() => {
                setCcAutoFocus(true)
                setShowCc(true)
              }}
              title="Добавить получателей копии"
              className="mt-[9px] h-[26px] shrink-0 rounded-[4px] px-2 text-[13px] text-[#C8C8C8] hover:bg-white/10 hover:text-white"
            >
              Копия
            </button>
          )}
        </div>

        {showCc && (
          <div className="flex min-h-[48px] items-start gap-3 border-b border-[#383838] px-5 text-[14px]">
            <label htmlFor="mail-cc" className="w-14 shrink-0 pt-[9px] text-[#C8C8C8]">
              Копия
            </label>
            <MailRecipients id="mail-cc" label="Копия" autoFocus={ccAutoFocus} value={ccList} onChange={setCcList} input={ccInput} onInputChange={setCcInput} />
            <button
              type="button"
              onClick={() => {
                setShowCc(false)
                setCcList([])
                setCcInput('')
              }}
              aria-label="Убрать копию"
              title="Убрать копию"
              className="mt-[11px] flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[4px] text-white/60 hover:bg-white/10 hover:text-white"
            >
              <CloseIcon className="h-2.5 w-2.5" />
            </button>
          </div>
        )}

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
          <FontSizeDropdown value={curSize} sizes={FONT_SIZES} onPick={applyFontSize} label="Размер шрифта" />
          <span className="mx-1.5 h-[18px] w-px bg-[#3A3A3A]" />
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
          onInput={() => {
            normalizeFonts()
            const ed = editorRef.current
            // emptied by the user: drop the leftover <br>/<div> so the placeholder comes back
            if (ed && !hasVisibleText(ed) && !ed.querySelector('li, img') && ed.innerHTML !== '') ed.innerHTML = ''
            setHasBody(hasVisibleText(ed))
            setSavedAt(null)
            setBodyDirty(true)
          }}
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
          className="mail-rich-text mail-editor flex-1 overflow-y-auto bg-transparent px-7 pb-4 pt-[18px] text-white outline-none"
          style={mailTextStyle(BASE_SIZE)}
          suppressContentEditableWarning
          dangerouslySetInnerHTML={initialBody ? { __html: initialBody } : undefined}
        />

        {attachments.length > 0 && (
          <div className="scroll flex max-h-[116px] shrink-0 flex-wrap gap-2 overflow-y-auto border-t border-[#383838] px-7 py-3">
            {attachments.map((file) => (
              <div key={file.url} title={`${file.name} · ${formatSize(file.size)}`} className="flex items-center gap-2 rounded-[6px] border border-[#3A3A3A] bg-[#2D2D2D] px-2 py-1.5">
                {file.type.startsWith('image/') ? (
                  <img src={file.url} alt="" className="h-8 w-8 rounded-[4px] object-cover" />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-white/10 text-[10px] font-bold text-white/80">
                    {(file.name.split('.').pop() || 'FILE').slice(0, 3).toUpperCase()}
                  </span>
                )}
                <span className="flex min-w-0 flex-col leading-[15px]">
                  <span className="max-w-[160px] truncate text-[12px] text-white/80">{file.name}</span>
                  <span className="text-[11px] text-[#C8C8C8]">{formatSize(file.size)}</span>
                </span>
                <button type="button" onClick={() => removeAttachment(file.url)} aria-label={`Удалить вложение ${file.name}`} title="Удалить вложение" className="text-white/50 hover:text-white">
                  <CloseIcon className="h-2.5 w-2.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {!canSend && sendHint && (
          <div role="status" className="shrink-0 border-t border-[#383838] px-4 pt-2 text-right text-[12px] text-[#C8C8C8]">
            {sendHint}
          </div>
        )}
        <div className={`flex min-h-[60px] shrink-0 flex-wrap items-center gap-2 px-4 py-3 ${!canSend && sendHint ? 'pt-2' : 'border-t border-[#383838]'}`}>
          <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={onDiscard}
            aria-label="Отменить"
            title={draftId ? 'Закрыть без сохранения изменений' : 'Отменить письмо'}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] border border-[#454545] text-white/80 hover:bg-white/10 hover:text-white"
          >
            <TrashIcon />
          </button>
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={!canSaveDraft}
            title="Сохранить в «Черновики»"
            className="flex h-9 shrink-0 items-center gap-2 whitespace-nowrap rounded-[4px] border border-[#454545] bg-[#2D2D2D] px-3.5 text-[13px] text-white enabled:hover:bg-[#333333] disabled:opacity-40"
          >
            <DraftIcon />
            Сохранить черновик
          </button>
          {savedAt && <span className="min-w-0 truncate text-[12px] text-[#C8C8C8]">Сохранено в {savedAt}</span>}
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setImportant((v) => !v)}
            title={important ? 'Снять пометку "Важное"' : 'Пометить как важное'}
            aria-label={important ? 'Снять пометку "Важное"' : 'Пометить как важное'}
            aria-pressed={important}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] border ${
              important ? 'border-[#C42B1C] text-[#C42B1C]' : 'border-[#454545] text-white/80 hover:text-white'
            } hover:bg-white/10`}
          >
            <ImportantIcon />
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-9 shrink-0 items-center gap-2 rounded-[4px] border border-[#454545] bg-[#2D2D2D] px-3.5 text-[13px] text-white hover:bg-[#333333]"
          >
            <AttachIcon />
            Вложить
          </button>
          <span title={canSend ? 'Отправить (Ctrl+Enter)' : sendHint} className="shrink-0">
            <button
              type="button"
              disabled={!canSend}
              onClick={handleSend}
              className="flex h-9 shrink-0 items-center gap-2 rounded-[4px] bg-[#60CDFF] px-5 text-[13px] font-semibold text-black enabled:hover:brightness-[1.08] disabled:opacity-40"
            >
              <SentIcon />
              Отправить
            </button>
          </span>
          </div>
        </div>
      </div>
    </div>
  )
}
