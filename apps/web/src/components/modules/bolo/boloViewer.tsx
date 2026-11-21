import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import type { BoloVals } from './boloRuntime'

interface SeenPin {
  n: string
  x: string
  y: string
  bg: string
  halo: string
  haloC: string
}
interface SeenRow {
  n: string
  key: string
  place: string
  when: string
  text: string
  who: string
  dot: string
}

/** Zoom handle of the San Andreas map (see `boloTerrain`). */
export interface MapZoomApi {
  zoom: (dir: 1 | -1) => void
}

/** A photo as the reference's render values describe it (`b.photos[i]`). */
export interface BoloPhoto {
  cap: string
  img?: string
  hasImg?: boolean
  icon?: string
  bg?: string
}

const CloseX = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
    <path d="M4 4l12 12M16 4L4 16" />
  </svg>
)
const Chevron = ({ d }: { d: string }) => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
)

function useKeys(map: Record<string, () => void>) {
  const ref = useRef(map)
  ref.current = map
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const f = ref.current[e.key]
      if (!f) return
      e.preventDefault()
      e.stopPropagation()
      f()
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [])
}

const roundBtn = { width: '40px', height: '40px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(32,32,32,0.85)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.12)' } as const

/**
 * BOLO photos full size (MDT addition — the reference shows them only as
 * tiles): the picture fitted to the window, its caption, ← / → between the
 * card's photos, Esc or a click outside closes.
 */
export function BoloPhotoViewer({ photos, index, onIndex, onClose }: { photos: BoloPhoto[]; index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const n = photos.length
  const p = photos[Math.min(index, n - 1)]
  const go = (d: number) => onIndex((index + d + n) % n)
  useKeys({ Escape: onClose, ArrowLeft: () => n > 1 && go(-1), ArrowRight: () => n > 1 && go(1) })
  if (!p) return null
  return (
    <div role="dialog" aria-label={'Фото: ' + p.cap} onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 40, background: 'rgba(0,0,0,0.86)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px', padding: '56px 88px 28px 88px', boxSizing: 'border-box' }}>
      <button className="btn hv" onClick={onClose} aria-label="Закрыть" title="Закрыть (Esc)" style={{ ...roundBtn, position: 'absolute', right: '16px', top: '16px' }}>
        <CloseX />
      </button>
      <div onClick={(e) => e.stopPropagation()} style={{ position: 'relative', flex: '1', minHeight: '0', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {p.hasImg && p.img ? (
          <img src={p.img} alt={p.cap} style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.6))', display: 'block' }} />
        ) : (
          <span style={{ width: 'min(100%, 640px)', aspectRatio: '4 / 3', borderRadius: '8px', background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.45)' }}>
            <svg width="96" height="96" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d={p.icon} />
            </svg>
          </span>
        )}
      </div>
      <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#FFFFFF', fontSize: '14px' }}>
        <span style={{ fontWeight: 600 }}>{p.cap}</span>
        {n > 1 ? <span className="num" style={{ color: '#C2C2C2', fontSize: '13px' }}>{index + 1} из {n}</span> : null}
      </div>
      {n > 1 ? (
        <>
          <button className="btn hv" onClick={(e) => { e.stopPropagation(); go(-1) }} aria-label="Предыдущее фото" style={{ ...roundBtn, position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)' }}>
            <Chevron d="M12.5 4.5L7 10l5.5 5.5" />
          </button>
          <button className="btn hv" onClick={(e) => { e.stopPropagation(); go(1) }} aria-label="Следующее фото" style={{ ...roundBtn, position: 'absolute', right: '24px', top: '50%', transform: 'translateY(-50%)' }}>
            <Chevron d="M7.5 4.5L13 10l-5.5 5.5" />
          </button>
        </>
      ) : null}
    </div>
  )
}

/**
 * «Где замечен» on the whole window (MDT addition — the reference's card map
 * is a fixed thumbnail): the card's pins and route on the pan / zoom map. A pin
 * (or a row of the list beside it) opens that sighting: where, when, what was
 * seen and who reported it.
 */
export function BoloMapViewer({ $v, onClose, renderMap }: { $v: BoloVals; onClose: () => void; renderMap: (onApi: (api: MapZoomApi | null) => void, content: ReactNode) => ReactNode }) {
  const api = useRef<MapZoomApi | null>(null)
  const onApi = useCallback((a: MapZoomApi | null) => {
    api.current = a
  }, [])
  useKeys({ Escape: onClose })
  const c = $v.c
  const pins = ($v.b?.pins ?? []) as SeenPin[]
  const seen = ($v.b?.seen ?? []) as SeenRow[]
  const [sel, setSel] = useState<string | null>(pins.length ? pins[pins.length - 1].n : null)
  const row = seen.find((s) => s.n === sel)
  const pin = pins.find((p) => p.n === sel)
  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 40, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', boxSizing: 'border-box' }}>
      <div role="dialog" aria-label="Где замечен" onClick={(e) => e.stopPropagation()} style={{ width: '100%', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', borderRadius: '10px', background: c.dialog, border: `1px solid ${c.stroke}`, boxShadow: '0 32px 64px rgba(0,0,0,0.55)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px 12px 20px' }}>
          <span style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', lineHeight: '20px' }}>
            <span className="ell" style={{ fontSize: '18px', fontWeight: 600 }}>Где замечен: {$v.b?.title}</span>
            <span className="ell" style={{ fontSize: '12px', color: c.text2 }}>{$v.b?.id} · {$v.b?.seenCount}</span>
          </span>
          <button className="btn hv" onClick={onClose} aria-label="Закрыть" title="Закрыть (Esc)" style={{ width: '32px', height: '32px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CloseX />
          </button>
        </div>
        <div style={{ flex: '1', minHeight: '0', display: 'flex', gap: '14px', margin: '0 16px 16px 16px' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '0', borderRadius: '10px', overflow: 'hidden' }}>
          {renderMap(
            onApi,
            <>
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none' }}>
                <polyline points={$v.b?.trail} fill="none" stroke={$v.b?.trailColor} strokeWidth="4" strokeDasharray="8 6" vectorEffect="non-scaling-stroke" />
              </svg>
              {pins.map((p) => {
                const on = p.n === sel
                return (
                  <button
                    key={p.n}
                    className="btn"
                    onClick={() => setSel(on ? null : p.n)}
                    aria-label={'Отметка ' + p.n}
                    style={{ position: 'absolute', left: p.x, top: p.y, width: on ? '30px' : '26px', height: on ? '30px' : '26px', transform: 'translate(-50%, -50%)', borderRadius: '50%', background: p.bg, border: '2px solid ' + (on ? '#FFFFFF' : c.card), boxShadow: '0 0 0 ' + (on ? '5px rgba(96,205,255,0.35)' : p.halo + ' ' + p.haloC) + ', 0 2px 6px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000000', fontSize: '12px', fontWeight: 700, textAlign: 'center', zIndex: on ? 2 : 1 }}
                  >
                    {p.n}
                  </button>
                )
              })}
              {pin && row ? (
                <div style={{ position: 'absolute', left: pin.x, top: pin.y, transform: 'translate(-50%, calc(-100% - 22px))', zIndex: 3, width: '280px', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', background: c.flyout, border: '1px solid ' + c.stroke, boxShadow: '0 12px 28px rgba(0,0,0,0.45)', display: 'flex', flexDirection: 'column', gap: '3px', lineHeight: '18px', cursor: 'auto' }}>
                  <span style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: 600 }}>{row.n}. {row.place}</span>
                    <span className="num" style={{ fontSize: '12px', color: c.text2, whiteSpace: 'nowrap' }}>{row.when}</span>
                  </span>
                  <span style={{ fontSize: '13px', color: c.text2 }}>{row.text}</span>
                  <span style={{ fontSize: '12px', color: c.link }}>{row.who}</span>
                </div>
              ) : null}
            </>,
          )}
          <div style={{ position: 'absolute', right: '12px', bottom: '12px', display: 'flex', flexDirection: 'column', borderRadius: '8px', overflow: 'hidden', background: c.btn }}>
            <button className="btn hv" aria-label="Приблизить" onClick={() => api.current?.zoom(1)} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Chevron d="M10 4v12M4 10h12" />
            </button>
            <button className="btn hv" aria-label="Отдалить" onClick={() => api.current?.zoom(-1)} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Chevron d="M4 10h12" />
            </button>
          </div>
        </div>
        <div className="scroll" style={{ width: '300px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {seen.map((s) => {
            const on = s.n === sel
            return (
              <button key={s.n} className="btn hv" onClick={() => setSel(s.n)} style={{ display: 'flex', gap: '10px', padding: '10px 12px', borderRadius: '10px', background: on ? c.sel : c.card, boxShadow: on ? 'inset 0 0 0 2px ' + $v.accent : 'none', lineHeight: '18px' }}>
                <span style={{ width: '20px', height: '20px', flexShrink: 0, borderRadius: '50%', background: s.dot, color: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700 }}>{s.n}</span>
                <span style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: 600 }}>{s.place}</span>
                    <span className="num" style={{ fontSize: '12px', color: c.text2, whiteSpace: 'nowrap' }}>{s.when}</span>
                    <span
                      role="button"
                      tabIndex={0}
                      className="hv"
                      aria-label={'Удалить отметку ' + s.n}
                      title="Удалить отметку"
                      onClick={(e) => {
                        e.stopPropagation()
                        $v.__seenDel(s)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          e.stopPropagation()
                          $v.__seenDel(s)
                        }
                      }}
                      style={{ marginLeft: 'auto', flexShrink: 0, width: '24px', height: '24px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.text2, cursor: 'pointer' }}
                    >
                      <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M4 6h12M8 6V4h4v2M6 6l1 10h6l1-10" />
                      </svg>
                    </span>
                  </span>
                  <span style={{ fontSize: '13px', color: c.text2 }}>{s.text}</span>
                  <span style={{ fontSize: '12px', color: c.link }}>{s.who}</span>
                </span>
              </button>
            )
          })}
        </div>
        </div>
      </div>
    </div>
  )
}

/** Quick captions for a new photo, by what the BOLO is about. */
const CAPTION_HINTS: Record<string, string[]> = {
  person: ['Из личного дела', 'Татуировка', 'Шрам', 'Одежда', 'Камера наблюдения', 'Транспорт', 'Фоторобот'],
  veh: ['Камера наблюдения', 'Номер', 'Повреждения', 'Вид сбоку', 'Салон', 'Место угона'],
  event: ['Место происшествия', 'Перекрытие', 'Карта зоны', 'Камера наблюдения'],
}

/**
 * «Добавить фото»: before the picture joins the card it gets a caption like the
 * reference's own photos («Татуировка FDB на шее», «Камера · 1207 Grove St») —
 * typed, or started from a quick hint and finished by hand.
 */
export function BoloPhotoCaption({ $v, url, kind, onSave, onCancel }: { $v: BoloVals; url: string; kind: string; onSave: (cap: string) => void; onCancel: () => void }) {
  const c = $v.c
  const [cap, setCap] = useState('')
  const input = useRef<HTMLInputElement>(null)
  useEffect(() => input.current?.focus(), [])
  const ok = cap.trim().length > 0
  const save = () => ok && onSave(cap.trim())
  useKeys({ Escape: onCancel })
  const hints = CAPTION_HINTS[kind === 'veh' ? 'veh' : kind === 'event' ? 'event' : 'person']
  return (
    <div onClick={onCancel} style={{ position: 'absolute', inset: 0, zIndex: 45, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', boxSizing: 'border-box' }}>
      <div onClick={(e) => e.stopPropagation()} aria-label="Подпись к фото" style={{ width: 'min(520px, 100%)', boxSizing: 'border-box', borderRadius: '10px', background: c.dialog, border: `1px solid ${c.stroke}`, boxShadow: '0 32px 64px rgba(0,0,0,0.55)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px 24px 0 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '20px', lineHeight: '28px', fontWeight: 600 }}>Подпись к фото</span>
            <span style={{ fontSize: '13px', color: c.text2 }}>Что на снимке — подпись увидят все, кто откроет ориентировку, и она попадёт в листовку</span>
          </span>
          <img src={url} alt="Новое фото" style={{ display: 'block', width: '100%', maxHeight: '220px', objectFit: 'contain', borderRadius: '8px', background: '#111111' }} />
          <input
            ref={input}
            type="text"
            value={cap}
            maxLength={60}
            onChange={(e) => setCap(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                save()
              }
            }}
            placeholder="Например: Татуировка FDB на шее"
            aria-label="Подпись к фото"
            style={{ boxSizing: 'border-box', width: '100%', padding: '8px 10px', borderRadius: '6px', border: '0', borderBottom: `1px solid ${$v.accent}`, background: c.field, fontSize: '14px', lineHeight: '20px', color: c.text }}
          />
          <span style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {hints.map((h) => (
              <button
                key={h}
                type="button"
                className="btn hv"
                onClick={() => {
                  // a hint starts the caption; «Камера наблюдения» → «Камера наблюдения · » to add where
                  setCap(h + (h === 'Камера наблюдения' || h === 'Татуировка' || h === 'Шрам' ? ' · ' : ''))
                  input.current?.focus()
                }}
                style={{ height: '28px', padding: '0 12px', borderRadius: '14px', background: c.btn, fontSize: '12px' }}
              >
                {h}
              </button>
            ))}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '20px', padding: '14px 24px', background: c.dialogFoot, borderTop: `1px solid ${c.stroke}` }}>
          <button type="button" className="btn hv" onClick={onCancel} style={{ width: '120px', height: '34px', borderRadius: '6px', background: c.btn, textAlign: 'center' }}>
            Отмена
          </button>
          <button type="button" className="btn acc" onClick={save} disabled={!ok} style={{ width: '160px', height: '34px', borderRadius: '6px', background: ok ? $v.accent : c.btn, color: ok ? $v.onAccent : c.text2, fontWeight: 600, textAlign: 'center', cursor: ok ? 'pointer' : 'default' }}>
            Добавить фото
          </button>
        </div>
      </div>
    </div>
  )
}

const SEEN_DEL_WHY = ['Отметка по ошибке', 'Дубль отметки', 'Не тот человек или машина', 'Неверное место']

/** Deleting a «Замечен» sighting: which one, and why — the reason goes to the BOLO's history. */
export function BoloSeenDelete({ $v, row, onDelete, onCancel }: { $v: BoloVals; row: { n: string; place: string; when: string; who: string }; onDelete: (why: string) => void; onCancel: () => void }) {
  const c = $v.c
  const [why, setWhy] = useState('')
  const ok = why.trim().length > 0
  useKeys({ Escape: onCancel })
  return (
    <div onClick={onCancel} style={{ position: 'absolute', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', boxSizing: 'border-box' }}>
      <div onClick={(e) => e.stopPropagation()} role="alertdialog" aria-label="Удалить отметку" style={{ width: 'min(480px, 100%)', boxSizing: 'border-box', borderRadius: '10px', background: c.dialog, border: '1px solid ' + c.stroke, boxShadow: '0 32px 64px rgba(0,0,0,0.55)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '20px', lineHeight: '28px', fontWeight: 600 }}>Удалить отметку {row.n}?</span>
            <span style={{ fontSize: '13px', color: c.text2 }}>
              {row.place} · {row.when} · {row.who.replace(/^Вы · /, '')}
            </span>
          </span>
          <span style={{ fontSize: '13px', color: c.text2 }}>Отметка пропадёт с карты и из списка у всех. Причина останется в истории ориентировки.</span>
          <span style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {SEEN_DEL_WHY.map((w) => (
              <button key={w} type="button" className="btn hv" onClick={() => setWhy(w)} style={{ height: '28px', padding: '0 12px', borderRadius: '14px', background: why === w ? '#FFFFFF' : c.btn, color: why === w ? '#1B1B1B' : c.text, fontSize: '12px', fontWeight: why === w ? 600 : 400 }}>
                {w}
              </button>
            ))}
          </span>
          <input
            type="text"
            value={why}
            onChange={(e) => setWhy(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && ok) {
                e.preventDefault()
                onDelete(why.trim())
              }
            }}
            placeholder="Причина — выберите выше или напишите"
            aria-label="Причина удаления"
            style={{ boxSizing: 'border-box', width: '100%', padding: '8px 10px', borderRadius: '6px', border: '0', borderBottom: '1px solid ' + c.stroke2, background: c.field, fontSize: '14px', lineHeight: '20px', color: c.text }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '14px 24px', background: c.dialogFoot, borderTop: '1px solid ' + c.stroke }}>
          <button type="button" className="btn hv" onClick={onCancel} style={{ width: '120px', height: '34px', borderRadius: '6px', background: c.btn, textAlign: 'center' }}>
            Отмена
          </button>
          <button type="button" className="btn" onClick={() => ok && onDelete(why.trim())} disabled={!ok} style={{ width: '160px', height: '34px', borderRadius: '6px', background: ok ? '#C42B1C' : c.btn, color: ok ? '#FFFFFF' : c.text2, fontWeight: 600, textAlign: 'center', cursor: ok ? 'pointer' : 'default' }}>
            Удалить отметку
          </button>
        </div>
      </div>
    </div>
  )
}
