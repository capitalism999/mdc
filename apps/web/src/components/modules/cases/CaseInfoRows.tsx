import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { CaseTone } from '../../../types'

/** Key → value rows of a case record («По делу»). Every label sits above its
 * value (one consistent size). Optional editing: ✎ edits a value in place,
 * 🗑 removes a field, «+ Добавить поле» adds one, and «Связать с записью»
 * links a record of this case explicitly — nothing links by itself. */

const TONE_FG: Record<CaseTone, string> = { red: '#FF99A4', amber: '#FCE100', green: '#6CCB5F', grey: '#C8C8C8', blue: '#99D9FF' }

export interface LinkOption {
  id: string
  insert: string
  label: string
  status: string
  tone: CaseTone
  group: string
}

interface Props {
  rows: [string, ReactNode][]
  /** renders a field value; `refIds` = records explicitly linked to it */
  renderLinkedText: (text: string, refIds?: string[]) => ReactNode
  rowRefs?: Record<string, string[]>
  /** (old title, new title, value, linked record ids) */
  onEdit?: (key: string, newKey: string, value: string, refs: string[]) => void
  /** open a linked record */
  onOpenRef?: (id: string) => void
  onAdd?: (key: string, value: string, refs: string[]) => void
  onRemove?: (key: string) => void
  /** fields that can't be edited or removed (e.g. «Добавил») */
  lockedKeys?: string[]
  /** typical field names offered when adding */
  suggestions?: string[]
  linkOptions?: LinkOption[]
  /** read-only rows filled automatically (from MDC / case documents), shown first */
  autoRows?: { k: string; v: ReactNode; hint: string }[]
}

/** «Связать» — the case's records with category tabs on top, searchable. */
function LinkPicker({ options, onPick }: { options: LinkOption[]; onPick: (o: LinkOption) => void }) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [tab, setTab] = useState('Все')
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const down = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', down)
    return () => document.removeEventListener('mousedown', down)
  }, [open])
  const groups = ['Все', ...Array.from(new Set(options.map((o) => o.group)))]
  const s = q.trim().toLowerCase()
  const list = options.filter((o) => (tab === 'Все' || o.group === tab) && (!s || `${o.insert} ${o.label}`.toLowerCase().includes(s)))
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((o) => !o)}
        title="Связать с записью дела"
        className={`flex h-7 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[6px] px-2 text-[12px] text-[#99D9FF] hover:bg-white/10 ${open ? 'bg-white/10' : ''}`}
      >
        <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <path d="M8.5 11.5a3 3 0 004.2 0l2.6-2.6a3 3 0 00-4.2-4.2l-1 1M11.5 8.5a3 3 0 00-4.2 0l-2.6 2.6a3 3 0 004.2 4.2l1-1" />
        </svg>
        Связать
      </button>
      {open && (
        <div className="absolute left-0 top-[32px] z-30 w-[300px] rounded-[8px] border border-[#3A3A3A] bg-[#2C2C2C] p-1 shadow-[0_10px_28px_rgba(0,0,0,0.45)]">
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Имя, номер или название" aria-label="Поиск записи дела" className="mb-1 h-8 w-full rounded-[6px] bg-[#3A3A3A] px-2.5 text-[13px] text-white outline-none" />
          <div role="tablist" aria-label="Тип записи" className="mb-1 flex gap-1 overflow-x-auto pb-1 [scrollbar-width:none]">
            {groups.map((g) => (
              <button
                key={g}
                type="button"
                role="tab"
                aria-selected={tab === g}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setTab(g)}
                className={`h-6 shrink-0 whitespace-nowrap rounded-[12px] px-2.5 text-[12px] ${tab === g ? 'bg-white text-[#272727]' : 'bg-[#3A3A3A] text-white hover:brightness-125'}`}
              >
                {g}
              </button>
            ))}
          </div>
          <div className="max-h-[240px] overflow-y-auto">
            {list.length === 0 && <div className="px-2.5 py-2 text-[12px] text-[#C2C2C2]">Ничего не найдено</div>}
            {list.map((o) => (
              <button
                key={o.id}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onPick(o)
                  setOpen(false)
                  setQ('')
                }}
                className="flex w-full items-center gap-2 rounded-[4px] px-2.5 py-1.5 text-left hover:bg-white/[0.06]"
              >
                <span className="min-w-0 flex-1 leading-[16px]">
                  <span className="block truncate text-[13px] text-white">{o.label}</span>
                  <span className="flex items-center gap-1 text-[11px]" style={{ color: TONE_FG[o.tone] }}>
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: TONE_FG[o.tone] }} />
                    {o.status}
                  </span>
                </span>
                {tab === 'Все' && <span className="shrink-0 text-[11px] text-[#9A9A9A]">{o.group}</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function IconBtn({ label, onClick, danger, children }: { label: string; onClick: () => void; danger?: boolean; children: ReactNode }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className={`flex h-6 w-6 items-center justify-center rounded-[4px] text-[#C2C2C2] hover:bg-white/10 ${danger ? 'hover:text-[#FF99A4]' : 'hover:text-white'}`}>
      {children}
    </button>
  )
}


function LinkIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M8.5 11.5a3 3 0 004.2 0l2.6-2.6a3 3 0 00-4.2-4.2l-1 1M11.5 8.5a3 3 0 00-4.2 0l-2.6 2.6a3 3 0 004.2 4.2l1-1" />
    </svg>
  )
}

/** Linked record as a pill; with `onRemove` it shows a × to unlink. */
function RefPill({ label, onRemove, onClick }: { label: string; onRemove?: () => void; onClick?: () => void }) {
  return (
    <span className="inline-flex h-6 max-w-full items-center gap-1 rounded-[12px] bg-[rgba(96,205,255,0.14)] pl-2 pr-1 text-[12px] text-[#BFEAFF]">
      <LinkIcon />
      {onClick ? (
        <button type="button" onClick={onClick} className="truncate hover:underline">
          {label}
        </button>
      ) : (
        <span className="truncate">{label}</span>
      )}
      {onRemove ? (
        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={onRemove} aria-label={`Убрать связь: ${label}`} title="Убрать связь" className="flex h-4 w-4 items-center justify-center rounded-full text-[#BFEAFF] hover:bg-white/15">
          <svg width="8" height="8" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <path d="M5 5l10 10M15 5L5 15" />
          </svg>
        </button>
      ) : (
        <span className="w-1" />
      )}
    </span>
  )
}

/** Value field with linked records shown as pills right inside the text
 * (contenteditable). The value stays plain text — a pill contributes its
 * record's text — and the ids of the pills present are the field's links. */
export interface TokenEditorHandle {
  insert: (o: LinkOption) => void
}

function pillNode(id: string, label: string): HTMLSpanElement {
  const pill = document.createElement('span')
  pill.contentEditable = 'false'
  pill.dataset.ref = id
  pill.dataset.label = label
  pill.className = 'mx-px inline-flex h-[22px] items-center gap-1 rounded-[11px] bg-[rgba(96,205,255,0.16)] pl-1.5 pr-0.5 align-middle text-[12px] text-[#BFEAFF]'
  pill.innerHTML =
    '<svg width="11" height="11" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M8.5 11.5a3 3 0 004.2 0l2.6-2.6a3 3 0 00-4.2-4.2l-1 1M11.5 8.5a3 3 0 00-4.2 0l-2.6 2.6a3 3 0 004.2 4.2l1-1"/></svg>'
  const text = document.createElement('span')
  text.textContent = label
  pill.appendChild(text)
  const x = document.createElement('button')
  x.type = 'button'
  x.dataset.remove = '1'
  x.title = 'Убрать связь'
  x.setAttribute('aria-label', `Убрать связь: ${label}`)
  x.className = 'flex h-4 w-4 items-center justify-center rounded-full hover:bg-white/15'
  x.innerHTML = '<svg width="8" height="8" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M5 5l10 10M15 5L5 15"/></svg>'
  pill.appendChild(x)
  return pill
}

/** DOM → { text, refs } */
function readEditor(root: HTMLElement): { text: string; refs: string[] } {
  let text = ''
  const refs: string[] = []
  const walk = (n: Node) => {
    if (n.nodeType === Node.TEXT_NODE) text += n.textContent ?? ''
    else if (n instanceof HTMLElement) {
      if (n.dataset.ref) {
        text += n.dataset.label ?? ''
        if (!refs.includes(n.dataset.ref)) refs.push(n.dataset.ref)
      } else if (n.tagName === 'BR') text += '\n'
      else {
        if (n.tagName === 'DIV' && text && !text.endsWith('\n')) text += '\n'
        n.childNodes.forEach(walk)
      }
    }
  }
  root.childNodes.forEach(walk)
  return { text: text.replace(/ /g, ' '), refs }
}

/** { text, refs } → DOM: each linked record's text becomes a pill. */
function fillEditor(root: HTMLElement, text: string, refs: string[], options: LinkOption[]) {
  root.innerHTML = ''
  const targets = refs.map((id) => options.find((o) => o.id === id)).filter((o): o is LinkOption => !!o)
  let rest = text
  for (let guard = 0; rest && guard < 50; guard++) {
    let best: { at: number; o: LinkOption; s: string } | null = null
    for (const o of targets) {
      for (const s of [o.label, o.insert]) {
        const at = rest.indexOf(s)
        if (at >= 0 && (!best || at < best.at)) best = { at, o, s }
      }
    }
    if (!best) {
      root.appendChild(document.createTextNode(rest))
      break
    }
    if (best.at > 0) root.appendChild(document.createTextNode(rest.slice(0, best.at)))
    root.appendChild(pillNode(best.o.id, best.s))
    rest = rest.slice(best.at + best.s.length)
  }
}

function TokenEditor({ initialText, initialRefs, options, autoFocus, invalid, onChange, onEnter, onEscape, editorRef }: { initialText: string; initialRefs: string[]; options: LinkOption[]; autoFocus: boolean; invalid: boolean; onChange: (text: string, refs: string[]) => void; onEnter: () => void; onEscape: () => void; editorRef: React.MutableRefObject<TokenEditorHandle | null> }) {
  const root = useRef<HTMLDivElement>(null)
  const lastRange = useRef<Range | null>(null)
  useEffect(() => {
    const el = root.current
    if (!el) return
    fillEditor(el, initialText, initialRefs, options)
    if (autoFocus) {
      el.focus()
      const r = document.createRange()
      r.selectNodeContents(el)
      r.collapse(false)
      const sel = window.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(r)
    }
    // initial content only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const emit = () => {
    if (!root.current) return
    const { text, refs } = readEditor(root.current)
    onChange(text, refs)
  }
  const remember = () => {
    const sel = window.getSelection()
    if (sel && sel.rangeCount && root.current?.contains(sel.anchorNode)) lastRange.current = sel.getRangeAt(0).cloneRange()
  }
  editorRef.current = {
    insert: (o: LinkOption) => {
      const el = root.current
      if (!el) return
      const pill = pillNode(o.id, o.label)
      const space = document.createTextNode(' ')
      const r = lastRange.current && el.contains(lastRange.current.startContainer) ? lastRange.current : null
      // No caret yet and the name is already typed as plain text → turn that
      // occurrence into the pill instead of adding the name again.
      if (!r) {
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
          if (n.parentElement?.closest('[data-ref]')) continue
          for (const needle of [o.label, o.insert]) {
            const at = (n.textContent ?? '').indexOf(needle)
            if (at < 0) continue
            const tail = (n as Text).splitText(at)
            tail.textContent = (tail.textContent ?? '').slice(needle.length)
            tail.parentNode?.insertBefore(pillNode(o.id, needle), tail)
            emit()
            return
          }
        }
      }
      if (r) {
        r.deleteContents()
        r.insertNode(space)
        r.insertNode(pill)
      } else {
        if (el.textContent && !/\s$/.test(el.textContent)) el.appendChild(document.createTextNode(' '))
        el.appendChild(pill)
        el.appendChild(space)
      }
      // caret after the pill
      el.focus()
      const after = document.createRange()
      after.setStartAfter(space)
      after.collapse(true)
      const sel = window.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(after)
      lastRange.current = after.cloneRange()
      emit()
    },
  }
  return (
    <div
      ref={root}
      role="textbox"
      aria-multiline="true"
      aria-label="Значение поля"
      aria-invalid={invalid}
      contentEditable
      suppressContentEditableWarning
      data-placeholder="Значение"
      onInput={() => {
        emit()
        remember()
      }}
      onKeyUp={remember}
      onMouseUp={remember}
      onBlur={remember}
      onClick={(e) => {
        const btn = (e.target as HTMLElement).closest('[data-remove]')
        if (btn) {
          btn.closest('[data-ref]')?.remove()
          emit()
        }
      }}
      onPaste={(e) => {
        // plain text only
        e.preventDefault()
        document.execCommand('insertText', false, e.clipboardData.getData('text/plain'))
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.stopPropagation()
          onEscape()
        } else if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault()
          onEnter()
        }
      }}
      className="min-h-[32px] w-full whitespace-pre-wrap break-words rounded-[6px] bg-black/30 px-2.5 py-[5px] text-[13px] leading-[22px] text-white outline-none empty:before:pointer-events-none empty:before:text-[#C2C2C2]/60 empty:before:content-[attr(data-placeholder)]"
      style={{ boxShadow: `inset 0 0 0 1px ${invalid ? '#E5484D' : '#60CDFF'}` }}
    />
  )
}

/** One editor for adding and editing a field: title + value + explicit links. */
function FieldEditor({
  initialKey,
  initialValue,
  initialRefs,
  existingKeys,
  suggestions,
  linkOptions,
  onSave,
  onCancel,
}: {
  initialKey: string
  initialValue: string
  initialRefs: string[]
  /** other fields' titles (a title must be unique) */
  existingKeys: string[]
  suggestions: string[]
  linkOptions: LinkOption[]
  onSave: (key: string, value: string, refs: string[]) => void
  onCancel: () => void
}) {
  const [key, setKey] = useState(initialKey)
  const [v, setV] = useState(initialValue)
  const [refs, setRefs] = useState(initialRefs)
  const [tried, setTried] = useState(false)
  const editor = useRef<TokenEditorHandle | null>(null)
  const k = key.trim()
  const val = v.trim()
  const keyError = !k ? 'Укажите название поля' : existingKeys.includes(k) ? 'Поле с таким названием уже есть' : null
  const valError = !val ? 'Укажите значение' : null
  const valid = !keyError && !valError
  const save = () => {
    setTried(true)
    if (valid) onSave(k, val, refs)
  }
  const esc = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation()
      onCancel()
    }
  }
  const free = suggestions.filter((s) => !existingKeys.includes(s))
  const showKeyErr = (tried || (!!k && existingKeys.includes(k))) && keyError
  const showValErr = tried && valError
  return (
    <div className="flex flex-col gap-1.5">
      <input
        autoFocus={!initialKey}
        value={key}
        onChange={(e) => setKey(e.target.value)}
        onKeyDown={(e) => {
          esc(e)
          if (e.key === 'Enter') save()
        }}
        placeholder="Название поля"
        aria-label="Название поля"
        aria-invalid={!!showKeyErr}
        className="h-8 rounded-[6px] bg-black/30 px-2.5 text-[13px] text-white outline-none placeholder:text-[#C2C2C2]/60"
        style={{ boxShadow: `inset 0 0 0 1px ${showKeyErr ? '#E5484D' : '#60CDFF'}` }}
      />
      {showKeyErr && <span className="text-[12px] text-[#FF99A4]">{keyError}</span>}
      {!initialKey && free.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {free.map((s) => (
            <button key={s} type="button" onClick={() => setKey(s)} className={`h-6 rounded-[12px] px-2 text-[12px] ${k === s ? 'bg-[#60CDFF] text-black' : 'bg-[#3A3A3A] text-white hover:brightness-125'}`}>
              {s}
            </button>
          ))}
        </div>
      )}
      <TokenEditor
        initialText={initialValue}
        initialRefs={initialRefs}
        options={linkOptions}
        autoFocus={!!initialKey}
        invalid={!!showValErr}
        editorRef={editor}
        onChange={(text, ids) => {
          setV(text)
          setRefs(ids)
        }}
        onEnter={save}
        onEscape={onCancel}
      />
      {showValErr && <span className="text-[12px] text-[#FF99A4]">{valError}</span>}
      <div className="flex items-center gap-1">
        {linkOptions.length > 0 && (
          <LinkPicker
            options={linkOptions.filter((o) => !refs.includes(o.id))}
            onPick={(o) => editor.current?.insert(o)}
          />
        )}
        <span className="flex-1" />
        <button type="button" onClick={onCancel} className="h-7 rounded-[6px] px-2.5 text-[12px] text-[#C2C2C2] hover:bg-white/10">
          Отмена
        </button>
        <button type="button" onClick={save} className={`h-7 rounded-[6px] px-2.5 text-[12px] font-semibold text-black ${valid ? 'bg-[#60CDFF] hover:brightness-110' : 'cursor-not-allowed bg-[#60CDFF]/40'}`}>
          {initialKey ? 'Сохранить' : 'Добавить'}
        </button>
      </div>
    </div>
  )
}

const LABEL = 'text-[12px] leading-4 text-[#C2C2C2]'
const ROW = 'group relative flex flex-col gap-1 py-2.5 text-[13px]'
const SEP = 'border-b border-[#3A3A3A]'

export function InfoRows({ rows, renderLinkedText, rowRefs = {}, onEdit, onAdd, onRemove, onOpenRef, lockedKeys = [], suggestions = [], linkOptions = [], autoRows = [] }: Props) {
  const [editing, setEditing] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const keys = rows.map(([k]) => k)
  const total = autoRows.length + rows.length

  return (
    <div className="rounded-[12px] bg-[#303030] px-3.5">
      {autoRows.map((r, i) => (
        <div key={r.k} className={`${ROW} ${i === total - 1 && !onAdd ? '' : SEP}`}>
          <span className={`flex items-center gap-1.5 ${LABEL}`}>
            {r.k}
            <span title={r.hint} className="cursor-help rounded-[4px] bg-white/[0.08] px-1 text-[10px] font-semibold uppercase leading-[14px] tracking-wide text-[#9A9A9A]">
              авто
            </span>
          </span>
          <span className="leading-[20px]">{r.v}</span>
        </div>
      ))}
      {rows.map(([k, v], i) => {
        const text = typeof v === 'string' ? v : null
        const locked = lockedKeys.includes(k)
        const isEditing = editing === k && text !== null
        const actions = (!!onEdit || !!onRemove) && text !== null && !locked && !isEditing
        const last = autoRows.length + i === total - 1 && !onAdd
        const refs = rowRefs[k] ?? []
        // links whose text isn't in the value are shown as pills under it
        const orphanRefs = text === null ? [] : refs.map((id) => linkOptions.find((o) => o.id === id)).filter((o): o is LinkOption => !!o && !text.includes(o.label) && !text.includes(o.insert))
        return (
          <div key={k} className={`${ROW} ${last ? '' : SEP}`}>
            {isEditing ? (
              <div className="py-0.5">
                <FieldEditor
                  initialKey={k}
                  initialValue={text!}
                  initialRefs={refs}
                  existingKeys={keys.filter((x) => x !== k)}
                  suggestions={[]}
                  linkOptions={linkOptions}
                  onSave={(nk, val, nrefs) => {
                    if (nk !== k || val !== text || nrefs.join() !== refs.join()) onEdit?.(k, nk, val, nrefs)
                    setEditing(null)
                  }}
                  onCancel={() => setEditing(null)}
                />
              </div>
            ) : (
              <>
                <span className={`${LABEL} ${actions ? 'pr-14' : ''}`}>{k}</span>
                <span className="leading-[20px]">{text !== null ? renderLinkedText(text, refs) : v}</span>
                {orphanRefs.length > 0 && (
                  <span className="flex flex-wrap gap-1">
                    {orphanRefs.map((o) => (
                      <RefPill key={o.id} label={o.label} onClick={onOpenRef ? () => onOpenRef(o.id) : undefined} />
                    ))}
                  </span>
                )}
              </>
            )}
            {actions && (
              <span className="absolute right-0 top-1.5 flex opacity-0 focus-within:opacity-100 group-hover:opacity-100">
                {onEdit && (
                  <IconBtn label={`Изменить: ${k}`} onClick={() => setEditing(k)}>
                    <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12.5 4.5l3 3L7 16H4v-3z" />
                    </svg>
                  </IconBtn>
                )}
                {onRemove && (
                  <IconBtn label={`Удалить поле «${k}»`} onClick={() => onRemove(k)} danger>
                    <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 6h12M8 6V4h4v2M6 6l1 10h6l1-10" />
                    </svg>
                  </IconBtn>
                )}
              </span>
            )}
          </div>
        )
      })}

      {onAdd &&
        (adding ? (
          <div className="py-3">
            <FieldEditor
              initialKey=""
              initialValue=""
              initialRefs={[]}
              existingKeys={keys}
              suggestions={suggestions}
              linkOptions={linkOptions}
              onSave={(k, val, refs) => {
                onAdd(k, val, refs)
                setAdding(false)
              }}
              onCancel={() => setAdding(false)}
            />
          </div>
        ) : (
          <button type="button" onClick={() => setAdding(true)} className="flex h-10 w-full items-center gap-1.5 text-[13px] text-[#C2C2C2] hover:text-white">
            <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M10 4v12M4 10h12" />
            </svg>
            Добавить поле
          </button>
        ))}
    </div>
  )
}
