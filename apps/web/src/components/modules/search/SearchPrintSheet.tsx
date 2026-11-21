import { useEffect, useRef, useState } from 'react'
import { mockProfile } from '../../../lib/mockData/profile'
import { personPhoto } from '../shared/personPhotos'
import { vehiclePhoto } from '../shared/vehiclePhotos'
import { downloadElementPdf } from '../shared/downloadPdf'
import { ReportsZoomBar } from '../reports/ReportsZoom'

/** Zoom steps, 33%…300% — as Отчёты. */
const ZOOMS = [0.33, 0.4, 0.5, 0.67, 0.75, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2, 2.5, 3]

/** What the sheet needs from a Поиск record (SEARCH_DB row + its dossier). */
export interface PrintRec {
  id: string
  type: string
  title: string
  code?: string
  plate?: string
  serial?: string
  sub?: string
  badges?: [string, string][]
  sections?: [string, { k: string; v: string }[]][]
}
interface Crime { date: string; time?: string; tag: string; charges: [string, string, string][]; who: string; dept: string; status: string }
interface Fine { date: string; time?: string; code: string; name: string; sum: number; st: string; receipt?: string }
export interface PrintDossier {
  info?: [string, string, string?, string?][]
  crimes?: Crime[]
  fines?: Fine[]
}

const KIND: Record<string, string> = { person: 'Личное дело', vehicle: 'Транспортное средство', weapon: 'Оружие', org: 'Организация', place: 'Недвижимость' }
const FINE_ST: Record<string, string> = { unpaid: 'не оплачен', overdue: 'просрочен', paid: 'оплачен' }

function stamp() {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}, ${p(d.getHours())}:${p(d.getMinutes())}`
}

/**
 * «Распечатать» in Поиск: the printout itself on an A4 sheet — what the
 * officer gets as an in-game item. «Краткая карточка» (1 page: photo, the main
 * facts, statuses) or «Полная справка» (every section, criminal records,
 * fines). «Отправить на принтер» hands it to the game; «Скачать PDF» saves it.
 */
export function SearchPrintSheet({ $v, rec, dossier, onPrint, onClose }: { $v: { c: Record<string, string>; accent: string; onAccent: string }; rec: PrintRec; dossier?: PrintDossier; onPrint: (full: boolean) => void; onClose: () => void }) {
  const c = $v.c
  const [full, setFull] = useState(false)
  const [show, setShow] = useState({ photo: true, info: true, crimes: true, fines: true })
  /** «Подписать мной» puts the officer's signature on the sheet; «Пустая строка» leaves it to sign by hand in the game */
  const [sign, setSign] = useState<'me' | 'blank' | 'none'>('me')
  const sheet = useRef<HTMLDivElement>(null)
  // zoom: a fixed step, or «По ширине» (follows the column width); Ctrl + wheel steps it
  const rail = useRef<HTMLDivElement>(null)
  const [railW, setRailW] = useState(0)
  const [zm, setZm] = useState<{ fit: boolean; z: number }>({ fit: false, z: 1 })
  useEffect(() => {
    const el = rail.current
    if (!el) return
    const ro = new ResizeObserver(() => setRailW(el.clientWidth))
    ro.observe(el)
    setRailW(el.clientWidth)
    return () => ro.disconnect()
  }, [])
  const fitZ = railW ? Math.max(ZOOMS[0], Math.min(ZOOMS[ZOOMS.length - 1], Math.floor(((railW - 48) / 560) * 100) / 100)) : 1
  const zoom = zm.fit ? fitZ : zm.z
  const zoomRef = useRef(zoom)
  zoomRef.current = zoom
  const step = (dir: 1 | -1) => {
    const z = zoomRef.current
    const next = dir > 0 ? ZOOMS.find((s) => s > z + 0.001) : [...ZOOMS].reverse().find((s) => s < z - 0.001)
    if (next) setZm({ fit: false, z: next })
  }
  const stepRef = useRef(step)
  stepRef.current = step
  useEffect(() => {
    const el = rail.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return
      e.preventDefault()
      stepRef.current(e.deltaY < 0 ? 1 : -1)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])
  const zoomBar = {
    c: { flyout: '#2C2C2C', stroke: c.stroke, stroke2: '#555555', text: c.text },
    __zoom: zoom,
    __canIn: zoom < ZOOMS[ZOOMS.length - 1] - 0.001,
    __canOut: zoom > ZOOMS[0] + 0.001,
    __zoomIn: () => step(1),
    __zoomOut: () => step(-1),
    __zoomReset: () => setZm({ fit: false, z: 1 }),
    __zoomFit: () => setZm({ fit: true, z: 1 }),
  }
  const when = useRef(stamp()).current
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [onClose])

  // «Судимости» (year + charge, no article) is the short form of «Криминальные записи» — with the records present it is dropped
  const sections = (rec.sections ?? []).filter(([t]) => !(t === 'Судимости' && (dossier?.crimes ?? []).length > 0))
  const shown = full ? sections : sections.slice(0, 2)
  const photo = rec.type === 'person' ? personPhoto(rec.id) : rec.type === 'vehicle' ? vehiclePhoto(rec.title, rec.sub) : null
  const number = rec.code || rec.plate || rec.serial || ''
  const crimes = full && show.crimes ? dossier?.crimes ?? [] : []
  const fines = full && show.fines ? dossier?.fines ?? [] : []
  const info = show.info ? (dossier?.info ?? []).filter((i) => i[1]) : []
  const hasCrimes = (dossier?.crimes ?? []).length > 0
  const hasFines = (dossier?.fines ?? []).length > 0
  const toggles: [keyof typeof show, string, string][] = [
    ['photo', 'Фото', rec.type === 'vehicle' ? 'Силуэт машины' : 'Снимок из записи'],
    ...(dossier?.info?.length ? [['info', 'Сведения из досье', 'Документ, дата рождения, адрес'] as [keyof typeof show, string, string]] : []),
    ...(full && hasCrimes ? [['crimes', 'Криминальные записи', 'Аресты, обвинения, розыск'] as [keyof typeof show, string, string]] : []),
    ...(full && hasFines ? [['fines', 'Штрафы', 'С суммами и статусом оплаты'] as [keyof typeof show, string, string]] : []),
  ]

  const cell = { padding: '3px 6px', borderBottom: '1px solid #C9C5BB', fontSize: '9.5px', lineHeight: '13px', verticalAlign: 'top' } as const
  const head = { fontFamily: "Georgia, 'Times New Roman', serif", fontSize: '12px', fontWeight: 700, letterSpacing: '.6px', textTransform: 'uppercase', borderBottom: '1.5px solid #141414', padding: '10px 0 3px', marginBottom: '4px' } as const

  return (
    // the same layout as BOLO's «Листовка»: the sheet on a rail, the settings on the right, actions at the bottom of the panel
    <div style={{ position: 'absolute', inset: 0, zIndex: 60, display: 'flex', background: c.content, color: c.text }}>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 24px 12px 24px' }}>
          <button className="btn hv" onClick={onClose} aria-label="Назад" title="Назад (Esc)" style={{ width: '32px', height: '32px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12.5 4.5L7 10l5.5 5.5" />
            </svg>
          </button>
          <span style={{ fontSize: '20px', lineHeight: '28px', fontWeight: 600 }}>Распечатка</span>
          <span className="ell" style={{ minWidth: 0, fontSize: '13px', color: c.text2 }}>
            {number ? `${number} · ` : ''}
            {rec.title} · A4, предпросмотр
          </span>
        </div>
        <div ref={rail} className="scroll" style={{ flex: 1, minHeight: 0, overflow: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'safe center', padding: '4px 24px 16px 24px', background: '#202020' }}>
        <div style={{ zoom, flexShrink: 0 }}>
        <div ref={sheet} style={{ width: '560px', minHeight: '792px', flexShrink: 0, boxSizing: 'border-box', padding: '26px 30px 22px', background: '#FAF9F5', color: '#141414', fontFamily: "Inter, 'Segoe UI', sans-serif", boxShadow: '0 10px 30px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column' }}>
          {/* header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingBottom: '10px', borderBottom: '2px solid #141414' }}>
            <img src={mockProfile.logo} alt="" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
            <span style={{ flex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: '14px', fontWeight: 700, letterSpacing: '1.2px' }}>{(mockProfile.agencyName ?? '').toUpperCase()}</span>
              <span style={{ fontSize: '9.5px', color: '#444' }}>Выписка из базы данных MDC · только для служебного пользования</span>
            </span>
            <img src={mockProfile.seal} alt="" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8.5px', letterSpacing: '.5px', color: '#444', padding: '5px 0 12px' }}>
            <span>{(KIND[rec.type] ?? 'Запись').toUpperCase()} · {full ? 'ПОЛНАЯ СПРАВКА' : 'КРАТКАЯ КАРТОЧКА'}</span>
            <span>{when}</span>
          </div>

          {/* who / what */}
          <div style={{ display: 'flex', gap: '16px' }}>
            {photo && show.photo ? (
              <span style={{ width: rec.type === 'vehicle' ? '150px' : '92px', height: rec.type === 'vehicle' ? '84px' : '114px', flexShrink: 0, border: '1px solid #141414', background: rec.type === 'vehicle' ? '#DCDAD4' : '#E6E3DC', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: rec.type === 'vehicle' ? 'contain' : 'cover', objectPosition: '50% 15%' }} />
              </span>
            ) : null}
            <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: '22px', fontWeight: 700, lineHeight: '26px' }}>{rec.title.toUpperCase()}</span>
              <span style={{ fontSize: '10.5px', color: '#333' }}>
                {number ? <b>{number}</b> : null}
                {number && rec.sub ? ' · ' : ''}
                {rec.sub}
              </span>
              {(rec.badges ?? []).length ? (
                <span style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', paddingTop: '2px' }}>
                  {(rec.badges ?? []).map(([b, tone]) => (
                    <span key={b} style={{ padding: '1px 6px', border: `1px solid ${tone === 'red' ? '#B3121D' : '#141414'}`, color: tone === 'red' ? '#B3121D' : '#141414', fontSize: '8.5px', fontWeight: 700, letterSpacing: '.4px', textTransform: 'uppercase' }}>
                      {b}
                    </span>
                  ))}
                </span>
              ) : null}
            </span>
          </div>

          {info.length ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '18px', marginTop: '12px', borderTop: '1.5px solid #141414' }}>
              {info.slice(0, full ? info.length : 6).map((i) => (
                <div key={i[0]} style={{ display: 'flex', gap: '8px', padding: '4px 0', borderBottom: '1px solid #C9C5BB', fontSize: '9.5px', lineHeight: '13px' }}>
                  <span style={{ width: '42%', flexShrink: 0, color: '#555' }}>{i[0]}</span>
                  <span style={{ flex: 1, minWidth: 0, fontWeight: 600 }}>
                    {i[1]}
                    {i[3] ? <span style={{ fontWeight: 400, color: '#555' }}> · {i[3]}</span> : null}
                  </span>
                </div>
              ))}
            </div>
          ) : null}

          {/* sections of the record */}
          {shown.map(([title, rows]) => (
            <div key={title}>
              <div style={head}>{title}</div>
              <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={r.k + i}>
                      <td style={{ ...cell, width: '38%', color: '#555' }}>{r.k}</td>
                      <td style={{ ...cell, fontWeight: 600 }}>{r.v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

          {crimes.length ? (
            <div>
              <div style={head}>Криминальные записи · {crimes.length}</div>
              <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <tbody>
                  {crimes.map((c, i) => (
                    <tr key={i}>
                      <td style={{ ...cell, width: '17%' }}>
                        {c.date}
                        {c.time ? <div style={{ color: '#555' }}>{c.time}</div> : null}
                      </td>
                      <td style={cell}>
                        <b>{c.tag}</b> · {c.charges.map((ch) => `${ch[0]} ${ch[1]}`).join('; ')}
                        <div style={{ color: '#555' }}>
                          {c.who} · {c.dept}
                        </div>
                      </td>
                      <td style={{ ...cell, width: '16%', textAlign: 'right' }}>{c.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {fines.length ? (
            <div>
              <div style={head}>Штрафы · {fines.length}</div>
              <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <tbody>
                  {fines.map((f, i) => (
                    <tr key={i}>
                      <td style={{ ...cell, width: '17%' }}>
                        {f.date}
                        {f.time ? <div style={{ color: '#555' }}>{f.time}</div> : null}
                      </td>
                      <td style={cell}>
                        {f.code} {f.name}
                        {f.receipt ? <div style={{ color: '#555' }}>квитанция {f.receipt}</div> : null}
                      </td>
                      <td style={{ ...cell, width: '12%', textAlign: 'right', fontWeight: 700 }}>${f.sum}</td>
                      <td style={{ ...cell, width: '14%', textAlign: 'right' }}>{FINE_ST[f.st] ?? f.st}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          <span style={{ flex: 1 }} />
          {/* footer */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', marginTop: '18px', paddingTop: '8px', borderTop: '1px solid #141414', fontSize: '8.5px', color: '#444' }}>
            <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>
                Распечатал: <b style={{ color: '#141414' }}>{mockProfile.badgeNumber} {mockProfile.name}</b> · {when}
              </span>
              <span>Сведения действительны на момент печати. Передача третьим лицам запрещена.</span>
            </span>
            {sign !== 'none' ? (
              <span style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ width: '150px', height: '30px', borderBottom: '1px solid #141414', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                  {sign === 'me' ? (
                    <span style={{ fontFamily: "'Segoe Script', 'Brush Script MT', 'Lucida Handwriting', cursive", fontSize: '17px', lineHeight: '24px', color: '#1F3A8A', transform: 'rotate(-4deg)', whiteSpace: 'nowrap' }}>{mockProfile.name}</span>
                  ) : null}
                </span>
                <span style={{ paddingTop: '2px' }}>{sign === 'me' ? mockProfile.rank ?? 'подпись' : 'подпись'}</span>
              </span>
            ) : null}
          </div>
        </div>
        </div>
        <div style={{ height: '12px', flexShrink: 0 }} />
        <ReportsZoomBar $v={zoomBar as never} />
        </div>
      </div>

      {/* settings — as the BOLO poster's panel */}
      <div style={{ width: '320px', flexShrink: 0, borderLeft: `1px solid ${c.stroke}`, background: c.content, display: 'flex', flexDirection: 'column' }}>
        <div className="scroll" style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '58px 18px 16px 18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: c.text2 }}>Что печатать</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {(
                [
                  [false, 'Краткая карточка', '1 страница'],
                  [true, 'Полная справка', 'Все разделы'],
                ] as [boolean, string, string][]
              ).map(([v, t, sub]) => {
                const on = full === v
                return (
                  <button key={t} className="btn hv" onClick={() => setFull(v)} style={{ padding: '8px 10px', borderRadius: '6px', background: on ? c.sel2 : c.btn, boxShadow: on ? `inset 0 0 0 2px ${$v.accent}` : 'none', display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' }}>
                    <span style={{ fontSize: '13px', fontWeight: on ? 600 : 400 }}>{t}</span>
                    <span style={{ fontSize: '11px', color: c.text2 }}>{sub}</span>
                  </button>
                )
              })}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: c.text2 }}>Что показать</span>
            {toggles.map(([k, t, sub]) => {
              const on = show[k]
              return (
                <button key={k} className="btn hv" onClick={() => setShow((s) => ({ ...s, [k]: !s[k] }))} role="switch" aria-checked={on} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '6px', background: c.card, textAlign: 'left' }}>
                  <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', lineHeight: '17px' }}>
                    <span style={{ fontSize: '13px' }}>{t}</span>
                    <span style={{ fontSize: '11px', color: c.text2 }}>{sub}</span>
                  </span>
                  <span style={{ position: 'relative', width: '40px', height: '20px', boxSizing: 'border-box', flexShrink: 0, borderRadius: '10px', background: on ? $v.accent : 'transparent', border: `1px solid ${on ? $v.accent : '#8A8A8A'}` }}>
                    <span style={{ position: 'absolute', top: '2px', left: '2px', width: '14px', height: '14px', borderRadius: '50%', background: on ? $v.onAccent : '#C8C8C8', transform: `translateX(${on ? '20px' : '0'})`, transition: 'transform .12s' }} />
                  </span>
                </button>
              )
            })}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: c.text2 }}>Подпись</span>
            <div style={{ display: 'flex', gap: '2px', padding: '3px', borderRadius: '8px', background: c.card }}>
              {(
                [
                  ['me', 'Подписать мной'],
                  ['blank', 'Пустая строка'],
                  ['none', 'Без подписи'],
                ] as ['me' | 'blank' | 'none', string][]
              ).map(([k, t]) => (
                <button key={k} className="btn" onClick={() => setSign(k)} style={{ flex: 1, height: '28px', borderRadius: '6px', background: sign === k ? c.btn : 'transparent', color: sign === k ? c.text : c.text2, fontSize: '12px', fontWeight: sign === k ? 600 : 400, textAlign: 'center', whiteSpace: 'nowrap' }}>
                  {t}
                </button>
              ))}
            </div>
            <span style={{ fontSize: '11px', lineHeight: '15px', color: c.text2 }}>
              {sign === 'me' ? `Лист подписан от вашего имени: ${mockProfile.name}, ${mockProfile.rank}.` : sign === 'blank' ? 'Строка останется пустой — подпишете распечатку в игре.' : 'На листе не будет строки для подписи.'}
            </span>
          </div>
          <span style={{ fontSize: '12px', lineHeight: '17px', color: c.text2 }}>
            Распечатка собирается из карточки: если данные изменят, новая распечатка покажет их. В игре вы получите предмет с этим листом.
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '14px 18px 16px 18px', borderTop: `1px solid ${c.stroke}` }}>
          <button className="btn acc" onClick={() => onPrint(full)} style={{ height: '36px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: $v.accent, color: $v.onAccent, fontWeight: 600 }}>
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
              <path d="M5.5 7.5V3h9v4.5" />
              <rect x="2.5" y="7.5" width="15" height="7" rx="1.5" />
              <path d="M5.5 12h9v5h-9z" />
            </svg>
            Отправить на принтер
          </button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn hv" onClick={() => sheet.current && void downloadElementPdf(sheet.current, `${rec.title.replace(/[^\wА-Яа-яЁё -]/g, '').trim() || 'MDC'} — выписка.pdf`)} style={{ flex: 1, height: '34px', borderRadius: '6px', background: c.btn, textAlign: 'center' }}>
              Скачать PDF
            </button>
            <button className="btn hv" onClick={onClose} style={{ flex: 1, height: '34px', borderRadius: '6px', background: c.btn, textAlign: 'center' }}>
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
