import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { ClipboardEvent as ReactClipboardEvent, KeyboardEvent as ReactKeyboardEvent } from 'react'
import type { NoteBlock, OfficerNote } from '../../../types'
import { NoteCaseMenu } from './NoteCaseMenu'
import { CheckIcon, CloseIcon, PanelSplitIcon, PinIcon, PrintIcon, TrashIcon } from './icons'
import { PlateText } from './PlateText'

interface NoteEditorProps {
  note: OfficerNote
  listHidden: boolean
  printedTitle: string | null
  onToggleList: () => void
  onTogglePin: () => void
  onTitleChange: (title: string) => void
  /** whole body after an edit (typing, new line, merge, type change…) */
  onBlocksChange: (blocks: NoteBlock[]) => void
  onBlockToggle: (blockId: string) => void
  /** file the note into a case folder; undefined = take it out */
  onLinkCase: (caseId: string | undefined, folderId?: string) => void
  /** another officer's note: shown read-only with «Сделать себе копию» */
  readOnly?: { author: string; onCopy: () => void }
  /** opens the linked case in «Дела» */
  onOpenCase: (caseId: string) => void
  onPrint: () => void
  onDismissPrintToast: () => void
  onDelete: () => void
  onClose: () => void
}

const ACCENT = '#60CDFF'

let blockSeq = 0
const newId = () => `b${Date.now().toString(36)}${(blockSeq++).toString(36)}`

/** The block being typed in and where the caret goes when it opens. */
interface Active {
  id: string
  caret: number
  /** bumps so the same block can be re-focused at a new caret */
  n: number
}

const TYPE_STYLE: Record<NoteBlock['type'], string> = {
  heading: 'mt-3 text-[18px] font-semibold leading-[26px]',
  paragraph: 'text-[15px] leading-[25px]',
  bullet: 'text-[15px] leading-[25px]',
  checklist: 'text-[15px] leading-[25px]',
  quote: 'whitespace-pre-line font-mono text-[14px] leading-[25px]',
  image: '',
}

/** Caret offset (in the plain text) where the user clicked the static view. */
function caretAt(el: HTMLElement): number | undefined {
  const sel = window.getSelection()
  if (!sel || !sel.rangeCount || !sel.focusNode || !el.contains(sel.focusNode)) return undefined
  const r = document.createRange()
  r.setStart(el, 0)
  r.setEnd(sel.focusNode, sel.focusOffset)
  return r.toString().length
}

/** Static (plate-highlighted) text; becomes an auto-growing textarea while it
 * is the active block. Keys are handled by the editor (new line, merge…). */
function BlockText({
  block,
  active,
  className,
  placeholder,
  onActivate,
  onDeactivate,
  onText,
  onKey,
}: {
  block: NoteBlock
  active: Active | null
  className: string
  placeholder?: string
  onActivate: (caret?: number) => void
  onDeactivate: () => void
  onText: (text: string, caret: number) => void
  onKey: (e: ReactKeyboardEvent<HTMLTextAreaElement>) => void
}) {
  const ref = useRef<HTMLTextAreaElement>(null)
  const mouse = useRef(false)
  const editing = active?.id === block.id
  const fit = () => {
    const el = ref.current
    if (!el) return
    el.style.height = '0px'
    el.style.height = `${el.scrollHeight}px`
  }
  useLayoutEffect(() => {
    if (!editing || !ref.current) return
    const el = ref.current
    el.focus()
    const c = Math.min(active!.caret, el.value.length)
    el.setSelectionRange(c, c)
    fit()
    // re-run only when (re)activated, not on every keystroke
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing, active?.n])
  useLayoutEffect(fit, [block.text, editing])

  if (editing) {
    return (
      <textarea
        ref={ref}
        rows={1}
        value={block.text}
        placeholder={placeholder}
        onChange={(e) => onText(e.target.value, e.target.selectionStart)}
        onKeyDown={onKey}
        onBlur={onDeactivate}
        className={`block w-full resize-none overflow-hidden bg-transparent outline-none placeholder:text-[#F2F2F2]/40 ${className}`}
      />
    )
  }
  return (
    <div
      role="textbox"
      tabIndex={0}
      onMouseDown={() => (mouse.current = true)}
      onMouseUp={(e) => {
        mouse.current = false
        // an empty line only shows its placeholder: caret at 0
        onActivate(block.text ? caretAt(e.currentTarget) : 0)
      }}
      onFocus={() => !mouse.current && onActivate()}
      className={`min-h-[25px] w-full cursor-text whitespace-pre-wrap break-words text-left ${className}`}>
      {block.text ? <PlateText text={block.text} /> : <span className="opacity-40">{placeholder ?? ''}</span>}
    </div>
  )
}

function Block({
  block,
  readOnly,
  active,
  isOnly,
  onActivate,
  onDeactivate,
  onText,
  onKey,
  onToggle,
}: {
  block: NoteBlock
  active: Active | null
  isOnly: boolean
  onActivate: (caret?: number) => void
  onDeactivate: () => void
  onText: (text: string, caret: number) => void
  onKey: (e: ReactKeyboardEvent<HTMLTextAreaElement>) => void
  onToggle: () => void
  readOnly?: boolean
}) {
  const done = !!block.done
  const placeholder = block.type === 'heading' ? 'Заголовок' : block.type === 'checklist' ? 'Пункт' : block.type === 'bullet' ? 'Пункт списка' : isOnly ? 'Начните писать… «- » список, «[] » чек-лист, «# » заголовок' : ''
  const text = (
    <BlockText
      block={block}
      active={active}
      placeholder={placeholder}
      className={`${TYPE_STYLE[block.type]} ${block.type === 'checklist' ? (done ? 'text-[#B4B4B4] line-through' : 'text-[#F2F2F2]') : ''}`}
      onActivate={readOnly ? () => {} : onActivate}
      onDeactivate={onDeactivate}
      onText={onText}
      onKey={onKey}
    />
  )
  if (block.type === 'bullet') {
    return (
      <div className="flex gap-3 pl-1">
        <span className="mt-[10px] h-[5px] w-[5px] shrink-0 rounded-full bg-[#F2F2F2]" />
        {text}
      </div>
    )
  }
  if (block.type === 'checklist') {
    return (
      <div className="flex items-start gap-3 py-px">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onToggle}
          disabled={readOnly}
          aria-label={done ? 'Снять отметку' : 'Отметить выполненным'}
          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[1.5px]"
          style={{ borderColor: done ? ACCENT : '#8A8A8A', background: done ? ACCENT : 'transparent', color: '#1B1B1B' }}
        >
          {done && <CheckIcon />}
        </button>
        {text}
      </div>
    )
  }
  if (block.type === 'quote') return <div className="rounded-[8px] bg-[#262626] px-3.5 py-2.5">{text}</div>
  return text
}

/** A picture pasted into the note, shown inline; × removes it. */
function ImageBlock({ block, readOnly, onRemove }: { block: NoteBlock; readOnly: boolean; onRemove: () => void }) {
  return (
    <figure className="group/img relative my-1 w-fit max-w-full">
      <img src={block.src} alt={block.name ?? ''} className="block max-h-[420px] max-w-full rounded-[8px] border border-[#363636] object-contain" />
      {!readOnly && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Убрать картинку"
          title="Убрать картинку"
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white opacity-0 hover:bg-black focus-visible:opacity-100 group-hover/img:opacity-100"
        >
          <CloseIcon className="h-2.5 w-2.5" />
        </button>
      )}
    </figure>
  )
}

/** One undo step: the body and where the caret was. */
interface Snap {
  blocks: NoteBlock[]
  at: { id: string; caret: number } | null
}
interface History {
  noteId: string
  undo: Snap[]
  redo: Snap[]
  /** what the last step was (typing in a line coalesces) and when */
  lastKey: string
  lastAt: number
}

const TYPE_BUTTONS: { type: NoteBlock['type']; label: string; glyph: string }[] = [
  { type: 'paragraph', label: 'Текст', glyph: 'M4 5h12M4 10h12M4 15h8' },
  { type: 'heading', label: 'Заголовок', glyph: 'M5 4v12M15 4v12M5 10h10' },
  { type: 'bullet', label: 'Список', glyph: 'M8 5h9M8 10h9M8 15h9M3.5 5h.01M3.5 10h.01M3.5 15h.01' },
  { type: 'checklist', label: 'Чек-лист', glyph: 'M3 5.5l1.5 1.5L7 4.5M3 13.5l1.5 1.5L7 12.5M10 6h7M10 14h7' },
  { type: 'quote', label: 'Цитата', glyph: 'M5 7h3v4H5zM5 11c0 2 1 3 3 3M12 7h3v4h-3zM12 11c0 2 1 3 3 3' },
]

/**
 * Reader/editor pane: toolbar (hide-list, pin, case-link, print, delete,
 * close), the note's title and date, its typed blocks (each click-to-edit,
 * matching the reference exactly otherwise), a "Распечатано" toast, and a
 * floating word-count pill. The reference's four floating-bar formatting
 * buttons (Aa/checklist/list/photo) have no backing logic in the source —
 * omitted rather than shipped as dead UI; same for "Новая папка" in
 * `NoteList`'s flyout.
 */
export function NoteEditor({
  note,
  readOnly,
  listHidden,
  printedTitle,
  onToggleList,
  onTogglePin,
  onTitleChange,
  onBlocksChange: emitBlocks,
  onBlockToggle,
  onLinkCase,
  onOpenCase,
  onPrint,
  onDismissPrintToast,
  onDelete,
  onClose,
}: NoteEditorProps) {
  const [active, setActiveState] = useState<Active | null>(null)
  const nRef = useRef(0)
  const focusBlock = (id: string, caret: number) => setActiveState({ id, caret, n: ++nRef.current })
  // a different note opens with nothing being edited
  useEffect(() => setActiveState(null), [note.id])
  const blocks = note.blocks

  // ── undo / redo (Ctrl+Z, Ctrl+Y / Ctrl+Shift+Z). Lines get split, merged and
  // re-created, which the browser's own per-field history can't follow — so
  // the editor keeps the note's history itself.
  const hist = useRef<History>({ noteId: note.id, undo: [], redo: [], lastKey: '', lastAt: 0 })
  if (hist.current.noteId !== note.id) hist.current = { noteId: note.id, undo: [], redo: [], lastKey: '', lastAt: 0 }
  const caretNow = (): Snap['at'] => {
    const el = document.activeElement
    if (active && el instanceof HTMLTextAreaElement) return { id: active.id, caret: el.selectionStart }
    return active ? { id: active.id, caret: active.caret } : null
  }
  /** Every body edit goes through here; typing in one line within a second
   * is a single undo step. */
  function onBlocksChange(next: NoteBlock[], typingIn?: string) {
    const h = hist.current
    const now = Date.now()
    const key = typingIn ? `type:${typingIn}` : ''
    if (!(key && key === h.lastKey && now - h.lastAt < 1000)) {
      h.undo.push({ blocks, at: caretNow() })
      if (h.undo.length > 200) h.undo.shift()
    }
    h.lastKey = key
    h.lastAt = now
    h.redo = []
    emitBlocks(next)
  }
  function undoRedo(dir: 'undo' | 'redo') {
    const h = hist.current
    const snap = (dir === 'undo' ? h.undo : h.redo).pop()
    if (!snap) return
    ;(dir === 'undo' ? h.redo : h.undo).push({ blocks, at: caretNow() })
    h.lastKey = ''
    emitBlocks(snap.blocks)
    if (snap.at && snap.blocks.some((b) => b.id === snap.at!.id)) focusBlock(snap.at.id, snap.at.caret)
    else setActiveState(null)
  }
  /** Ctrl+Z / Ctrl+Y / Ctrl+Shift+Z by physical key (works in any layout). */
  function historyKey(e: { ctrlKey: boolean; metaKey: boolean; shiftKey: boolean; code: string; preventDefault: () => void }) {
    if (readOnly || !(e.ctrlKey || e.metaKey)) return false
    if (e.code === 'KeyZ') {
      e.preventDefault()
      undoRedo(e.shiftKey ? 'redo' : 'undo')
      return true
    }
    if (e.code === 'KeyY') {
      e.preventDefault()
      undoRedo('redo')
      return true
    }
    return false
  }

  // ── Ctrl+A: the whole note at once (not just the line being typed in) —
  // shown as a real text selection over all lines, so Ctrl+C copies
  // it; Delete / Backspace / Ctrl+X / typing / pasting replace it.
  const [selAll, setSelAll] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)
  useEffect(() => setSelAll(false), [note.id])
  useLayoutEffect(() => {
    const el = bodyRef.current
    if (!selAll || !el) return
    el.focus({ preventScroll: true })
    const r = document.createRange()
    r.selectNodeContents(el)
    const sel = window.getSelection()
    sel?.removeAllRanges()
    sel?.addRange(r)
  }, [selAll])
  function selectAll() {
    if (readOnly) return
    ;(document.activeElement as HTMLElement | null)?.blur()
    setActiveState(null)
    setSelAll(true)
  }
  /** Replaces the whole body (after select-all) with typed / pasted text. */
  function replaceAll(text: string) {
    const lines = text.split(/\r?\n/)
    const next: NoteBlock[] = lines.map((t) => ({ id: newId(), type: 'paragraph', text: t }))
    onBlocksChange(next)
    setSelAll(false)
    window.getSelection()?.removeAllRanges()
    const last = next[next.length - 1]
    focusBlock(last.id, last.text.length)
  }
  function onSelAllKey(e: ReactKeyboardEvent) {
    if (!selAll) return false
    const mod = e.ctrlKey || e.metaKey
    if (mod && e.code === 'KeyC') return true // native copy of the selection
    if (mod && e.code === 'KeyA') {
      e.preventDefault()
      return true
    }
    if (mod && e.code === 'KeyX') {
      e.preventDefault()
      document.execCommand('copy')
      replaceAll('')
      return true
    }
    if (mod && (e.code === 'KeyZ' || e.code === 'KeyY')) {
      setSelAll(false)
      return false // let undo run
    }
    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault()
      replaceAll('')
      return true
    }
    if (!mod && !e.altKey && e.key.length === 1) {
      e.preventDefault()
      replaceAll(e.key)
      return true
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      replaceAll('\n')
      return true
    }
    if (['Escape', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
      e.preventDefault()
      setSelAll(false)
      window.getSelection()?.removeAllRanges()
      const first = blocks.find((x) => x.type !== 'image')
      const last = [...blocks].reverse().find((x) => x.type !== 'image')
      const to = e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'Home' ? first : last
      if (to && e.key !== 'Escape') focusBlock(to.id, to === first ? 0 : to.text.length)
      return true
    }
    return false
  }

  function setText(id: string, raw: string, caret: number) {
    const b = blocks.find((x) => x.id === id)
    if (!b) return
    // markdown-style shortcuts at the start of a plain paragraph
    if (b.type === 'paragraph' || b.type === 'bullet' || b.type === 'checklist') {
      const m = /^(- |\* |\[\] |\[ \] |# |> )/.exec(raw)
      const type: NoteBlock['type'] | null = !m ? null : m[1] === '# ' ? 'heading' : m[1] === '> ' ? 'quote' : m[1].startsWith('[') ? 'checklist' : 'bullet'
      // a paragraph takes any shortcut; a list item only switches bullet ⇄ checklist
      if (m && type && type !== b.type && (b.type === 'paragraph' || type === 'bullet' || type === 'checklist')) {
        onBlocksChange(blocks.map((x) => (x.id === id ? { ...x, type, text: raw.slice(m[1].length), done: false } : x)))
        focusBlock(id, Math.max(0, caret - m[1].length))
        return
      }
    }
    onBlocksChange(
      blocks.map((x) => (x.id === id ? { ...x, text: raw } : x)),
      id,
    )
  }

  function onKey(e: ReactKeyboardEvent<HTMLTextAreaElement>, b: NoteBlock) {
    const el = e.currentTarget
    const s = el.selectionStart
    const end = el.selectionEnd
    const v = el.value
    const i = blocks.findIndex((x) => x.id === b.id)
    const list = b.type === 'bullet' || b.type === 'checklist'
    if (historyKey(e)) return
    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyA') {
      e.preventDefault()
      selectAll()
      return
    }
    if (e.key === 'Escape') {
      el.blur()
      return
    }
    if (e.key === 'Enter' && !e.shiftKey && b.type !== 'quote') {
      e.preventDefault()
      // Enter on an empty list item ends the list
      if (list && v === '') {
        onBlocksChange(blocks.map((x) => (x.id === b.id ? { ...x, type: 'paragraph', done: false } : x)))
        focusBlock(b.id, 0)
        return
      }
      const nb: NoteBlock = { id: newId(), type: list ? b.type : 'paragraph', text: v.slice(end), ...(b.type === 'checklist' ? { done: false } : {}) }
      const next = [...blocks]
      next.splice(i, 1, { ...b, text: v.slice(0, s) }, nb)
      onBlocksChange(next)
      focusBlock(nb.id, 0)
      return
    }
    if (e.key === 'Backspace' && s === 0 && end === 0) {
      if (b.type !== 'paragraph') {
        e.preventDefault()
        onBlocksChange(blocks.map((x) => (x.id === b.id ? { ...x, type: 'paragraph', done: false } : x)))
        focusBlock(b.id, 0)
        return
      }
      if (i > 0 && blocks[i - 1].type === 'image') {
        e.preventDefault()
        onBlocksChange(blocks.filter((x) => x.id !== blocks[i - 1].id))
        focusBlock(b.id, 0)
        return
      }
      if (i > 0) {
        e.preventDefault()
        const prev = blocks[i - 1]
        onBlocksChange(blocks.filter((x) => x.id !== b.id).map((x) => (x.id === prev.id ? { ...x, text: x.text + v } : x)))
        focusBlock(prev.id, prev.text.length)
        return
      }
      if (v === '' && blocks.length > 1) {
        e.preventDefault()
        onBlocksChange(blocks.slice(1))
        focusBlock(blocks[1].id, 0)
      }
      return
    }
    if (e.key === 'Delete' && s === v.length && end === v.length && i < blocks.length - 1) {
      e.preventDefault()
      const nx = blocks[i + 1]
      onBlocksChange(blocks.filter((x) => x.id !== nx.id).map((x) => (x.id === b.id && nx.type !== 'image' ? { ...x, text: v + nx.text } : x)))
      focusBlock(b.id, v.length)
      return
    }
    const up = blocks.slice(0, i).reverse().find((x) => x.type !== 'image')
    const down = blocks.slice(i + 1).find((x) => x.type !== 'image')
    if (e.key === 'ArrowUp' && up && !v.slice(0, s).includes('\n') && s === end) {
      e.preventDefault()
      focusBlock(up.id, Math.min(s, up.text.length))
      return
    }
    if (e.key === 'ArrowDown' && down && !v.slice(end).includes('\n') && s === end) {
      e.preventDefault()
      focusBlock(down.id, Math.min(s, down.text.length))
    }
  }

  /** Bottom bar: change the active line's type (or start a new line of it). */
  function applyType(type: NoteBlock['type']) {
    const cur = active && blocks.find((x) => x.id === active.id)
    if (cur) {
      onBlocksChange(blocks.map((x) => (x.id === cur.id ? { ...x, type: x.type === type && type !== 'paragraph' ? 'paragraph' : type, done: false } : x)))
      focusBlock(cur.id, cur.text.length)
      return
    }
    const last = blocks[blocks.length - 1]
    if (last && last.text === '' && last.type !== 'image') {
      onBlocksChange(blocks.map((x) => (x.id === last.id ? { ...x, type, done: false } : x)))
      focusBlock(last.id, 0)
      return
    }
    const nb: NoteBlock = { id: newId(), type, text: '', ...(type === 'checklist' ? { done: false } : {}) }
    onBlocksChange([...blocks, nb])
    focusBlock(nb.id, 0)
  }

  /** Click below the text: caret to the end (a fresh line after a list/heading). */
  function focusEnd() {
    const last = blocks[blocks.length - 1]
    if (last && last.type !== 'image' && (last.type === 'paragraph' || last.text === '')) {
      focusBlock(last.id, last.text.length)
      return
    }
    const nb: NoteBlock = { id: newId(), type: 'paragraph', text: '' }
    onBlocksChange([...blocks, nb])
    focusBlock(nb.id, 0)
  }
  const activeType = active ? blocks.find((x) => x.id === active.id)?.type : undefined

  /** Ctrl+V of a picture: goes in right where the caret is — the line is cut
   * there, the picture sits between the two halves and typing continues on
   * the line after it (at the end of the note when nothing is being edited). */
  function onPaste(e: ReactClipboardEvent) {
    if (readOnly) return
    const pastedText = e.clipboardData.getData('text/plain')
    const hasImage = Array.from(e.clipboardData.items).some((it) => it.kind === 'file' && it.type.startsWith('image/'))
    if (selAll && !hasImage) {
      e.preventDefault()
      replaceAll(pastedText)
      return
    }
    const field = e.target instanceof HTMLTextAreaElement ? e.target : null
    const lineBlock = active ? blocks.find((x) => x.id === active.id) : undefined
    if (!hasImage && field && lineBlock && lineBlock.type !== 'quote' && /\r?\n/.test(pastedText)) {
      // several lines pasted into one: each becomes its own line
      e.preventDefault()
      const parts = pastedText.split(/\r?\n/)
      const s0 = field.selectionStart
      const before = lineBlock.text.slice(0, s0)
      const after = lineBlock.text.slice(field.selectionEnd)
      const i = blocks.findIndex((x) => x.id === lineBlock.id)
      const lastText = parts[parts.length - 1]
      const middle: NoteBlock[] = parts.slice(1).map((t, k) => ({ id: newId(), type: lineBlock.type === 'heading' ? 'paragraph' : lineBlock.type, text: k === parts.length - 2 ? t + after : t, ...(lineBlock.type === 'checklist' ? { done: false } : {}) }))
      onBlocksChange([...blocks.slice(0, i), { ...lineBlock, text: before + parts[0] }, ...middle, ...blocks.slice(i + 1)])
      const lastB = middle[middle.length - 1]
      focusBlock(lastB.id, lastText.length)
      return
    }
    if (selAll && hasImage) setSelAll(false)
    const files = Array.from(e.clipboardData.items)
      .filter((it) => it.kind === 'file' && it.type.startsWith('image/'))
      .map((it) => it.getAsFile())
      .filter((x): x is File => !!x)
    if (!files.length) return
    e.preventDefault()
    const ta = e.target instanceof HTMLTextAreaElement ? e.target : null
    const curId = active?.id ?? null
    const s = ta ? ta.selectionStart : null
    const sEnd = ta ? ta.selectionEnd : null
    Promise.all(
      files.map(
        (file) =>
          new Promise<NoteBlock>((resolve) => {
            const r = new FileReader()
            r.onload = () => resolve({ id: newId(), type: 'image', text: '', src: String(r.result), name: file.name || 'Изображение' })
            r.readAsDataURL(file)
          }),
      ),
    ).then((imgs) => {
      const cur = getBlocksRef.current()
      const i = curId ? cur.findIndex((x) => x.id === curId) : -1
      if (i < 0) {
        const tail: NoteBlock = { id: newId(), type: 'paragraph', text: '' }
        onBlocksChange([...cur, ...imgs, tail])
        focusBlock(tail.id, 0)
        return
      }
      const b = cur[i]
      const cut = s ?? b.text.length
      const before = b.text.slice(0, cut)
      const after = b.text.slice(sEnd ?? cut)
      // caret at the very start of a written line: the picture goes above it
      if (cut === 0 && after) {
        onBlocksChange([...cur.slice(0, i), ...imgs, ...cur.slice(i)])
        focusBlock(b.id, 0)
        return
      }
      const nextBlock = cur[i + 1]
      const reuse = !after && nextBlock && nextBlock.type === 'paragraph' && nextBlock.text === ''
      const tail: NoteBlock = reuse ? nextBlock : { id: newId(), type: b.type === 'bullet' || b.type === 'checklist' ? b.type : 'paragraph', text: after, ...(b.type === 'checklist' ? { done: false } : {}) }
      // an empty plain line just turns into the picture
      const head = before === '' && b.type === 'paragraph' ? [] : [{ ...b, text: before }]
      onBlocksChange([...cur.slice(0, i), ...head, ...imgs, tail, ...cur.slice(i + (reuse ? 2 : 1))])
      focusBlock(tail.id, 0)
    })
  }
  // blocks at the time the async image read finishes
  const getBlocksRef = useRef(() => blocks)
  getBlocksRef.current = () => blocks
  function removeBlock(id: string) {
    const i = blocks.findIndex((x) => x.id === id)
    const next = blocks.filter((x) => x.id !== id)
    const body = next.length ? next : [{ id: newId(), type: 'paragraph' as const, text: '' }]
    onBlocksChange(body)
    // caret to the nearest line, so Ctrl+Z can bring the picture back
    const near = body.slice(i).find((x) => x.type !== 'image') ?? body.slice(0, i).reverse().find((x) => x.type !== 'image')
    if (near) focusBlock(near.id, 0)
  }

  const wordCount = note.blocks.reduce((sum, b) => sum + b.text.split(/\s+/).filter(Boolean).length, 0)

  return (
    <main className="relative flex min-w-0 flex-1 flex-col bg-[#1C1C1C] text-[#F2F2F2]">
      <div className="flex h-11 shrink-0 items-center gap-0.5 px-4 text-[#B4B4B4]">
        <button
          type="button"
          onClick={onToggleList}
          aria-label={listHidden ? 'Показать список заметок' : 'Скрыть список заметок'}
          title={listHidden ? 'Показать список заметок' : 'Скрыть список заметок'}
          className="flex h-9 w-9 items-center justify-center rounded-[6px] hover:bg-white/10"
        >
          <PanelSplitIcon />
        </button>
        <span className="flex-1" />
        {!readOnly && (<>
        <button
          type="button"
          onClick={onTogglePin}
          aria-label={note.isPinned ? 'Открепить' : 'Закрепить'}
          title={note.isPinned ? 'Открепить' : 'Закрепить'}
          className="flex h-9 w-9 items-center justify-center rounded-[6px] hover:bg-white/10"
          style={{ color: note.isPinned ? '#60CDFF' : undefined }}
        >
          <PinIcon />
        </button>
        <NoteCaseMenu note={note} onLink={onLinkCase} onOpen={onOpenCase} />
        </>)}
        <button
          type="button"
          onClick={onPrint}
          className="flex h-9 items-center gap-2 rounded-[6px] px-3 text-[#F2F2F2] hover:bg-white/10"
        >
          <PrintIcon />
          Распечатать
        </button>
        {!readOnly && (
          <button type="button" onClick={onDelete} aria-label="Удалить" title="Удалить" className="flex h-9 w-9 items-center justify-center rounded-[6px] hover:bg-white/10">
            <TrashIcon />
          </button>
        )}
        <span className="mx-1 h-5 w-px bg-[#363636]" />
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть заметку"
          title="Закрыть заметку"
          className="flex h-9 w-9 items-center justify-center rounded-[6px] hover:bg-white/10"
        >
          <CloseIcon />
        </button>
      </div>

      {readOnly && (
        <div role="status" className="mx-4 mb-1 flex items-center gap-3 rounded-[8px] px-3.5 py-2.5" style={{ background: 'rgba(96,205,255,0.12)', boxShadow: 'inset 0 0 0 1px rgba(96,205,255,0.35)' }}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="#60CDFF" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="4" y="8.5" width="12" height="8.5" rx="1.5" />
            <path d="M7 8.5V6a3 3 0 016 0v2.5" />
          </svg>
          <span className="min-w-0 flex-1 text-[13px] leading-[18px]">
            <span className="font-semibold">Заметка {readOnly.author}</span>
            <span className="text-[#B4B4B4]"> · только просмотр. Редактировать может только автор.</span>
          </span>
          <button type="button" onClick={readOnly.onCopy} className="h-8 shrink-0 rounded-[6px] px-3 text-[13px] font-semibold text-[#1B1B1B] hover:brightness-110" style={{ background: ACCENT }}>
            Сделать себе копию
          </button>
        </div>
      )}
      <div
        className="scroll flex-1 overflow-y-auto px-12 pb-[140px] pt-2"
        onPaste={onPaste}
        onKeyDown={(e) => {
          if (onSelAllKey(e)) return
          // the title keeps its own (native) undo / select-all; lines handle theirs in onKey
          const t = e.target as HTMLElement
          if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA') return
          if ((e.ctrlKey || e.metaKey) && e.code === 'KeyA') {
            e.preventDefault()
            selectAll()
            return
          }
          historyKey(e)
        }}
        onMouseDown={() => selAll && setSelAll(false)}
      >
        <div className="mx-auto flex max-w-[720px] flex-col gap-2.5">
          <div className="pb-3.5 text-center text-[12px] text-[#B4B4B4]">
            {note.dateFull}
            {note.copiedFrom && <span> · копия заметки {note.copiedFrom}</span>}
          </div>
          <input
            readOnly={!!readOnly}
            value={note.title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Заголовок"
            className="bg-transparent text-[30px] font-bold leading-[38px] tracking-[-0.2px] text-[#F2F2F2] outline-none placeholder:text-[#B4B4B4]"
          />
          <div ref={bodyRef} tabIndex={-1} aria-label="Текст заметки" className={`flex flex-col gap-2.5 outline-none ${selAll ? 'selection:bg-[#60CDFF]/35' : ''}`}>
          {blocks.map((block) =>
            block.type === 'image' ? (
              <ImageBlock key={block.id} block={block} readOnly={!!readOnly} onRemove={() => removeBlock(block.id)} />
            ) : (
            <Block
              key={block.id}
              block={block}
              active={active}
              isOnly={blocks.length === 1}
              onActivate={(c) => active?.id !== block.id && focusBlock(block.id, c ?? block.text.length)}
              onDeactivate={() => setActiveState((a) => (a?.id === block.id ? null : a))}
              onText={(t, c) => setText(block.id, t, c)}
              onKey={(e) => onKey(e, block)}
              onToggle={() => onBlockToggle(block.id)}
              readOnly={!!readOnly}
            />
            ),
          )}
          </div>
          {!readOnly && <div aria-hidden="true" onClick={focusEnd} className="min-h-[120px] flex-1 cursor-text" />}
        </div>
      </div>

      {printedTitle && (
        <div
          role="status"
          className="absolute bottom-[88px] right-6 flex w-[340px] gap-3 rounded-[8px] border border-[#363636] bg-[#2C2C2C] py-3.5 pl-4 pr-3.5 shadow-[0_12px_32px_rgba(0,0,0,0.4)]"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px]" style={{ background: ACCENT, color: '#1B1B1B' }}>
            <PrintIcon />
          </span>
          <span className="min-w-0 flex-1">
            <div className="font-semibold">Распечатано</div>
            <div className="text-[13px] text-[#B4B4B4]">Лист «{printedTitle}» забран из принтера.</div>
          </span>
          <button
            type="button"
            onClick={onDismissPrintToast}
            aria-label="Скрыть уведомление"
            className="h-6 w-6 shrink-0 rounded-[4px] text-[#B4B4B4] hover:bg-white/10"
          >
            <CloseIcon className="mx-auto h-2.5 w-2.5" />
          </button>
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
        <div className="pointer-events-auto flex items-center gap-1 rounded-[12px] border border-[#363636] bg-[#2C2C2C] px-3 py-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.12),0_0_2px_rgba(0,0,0,0.1)]">
          {!readOnly && TYPE_BUTTONS.map((t) => (
            <button
              key={t.type}
              type="button"
              title={t.label}
              aria-label={t.label}
              aria-pressed={activeType === t.type}
              // keep the caret in the line being edited
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyType(t.type)}
              className={`flex h-8 w-8 items-center justify-center rounded-[6px] ${activeType === t.type ? 'bg-white/[0.12] text-white' : 'text-[#B4B4B4] hover:bg-white/10 hover:text-white'}`}
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={t.glyph} />
              </svg>
            </button>
          ))}
          {!readOnly && <span className="mx-1 h-5 w-px bg-[#363636]" />}
          {!readOnly && <span className="px-1 text-[11px] text-[#8A8A8A]">Ctrl+V — вставить картинку</span>}
          <span className="px-2 text-[12px] text-[#B4B4B4]">{wordCount} слов</span>
        </div>
      </div>
    </main>
  )
}
