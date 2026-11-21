import { useCallback, useEffect, useLayoutEffect, useReducer, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react'
import { apps } from '../../../data/apps'
import { useWindowManager } from '../../../windows/WindowManagerContext'
import { setAppBadge } from '../../../windows/appBadges'
import { getCases, requestOpenCase } from '../cases/casesStore'
import type { ModuleContentProps } from '../registry'
import { SEARCH_DB } from '../search/searchLogic'
import { ownPhoto } from '../shared/personPhotos'
import { downloadElementPdf } from '../shared/downloadPdf'
import { composeMail } from '../mail/mailStore'
import { showClippedTitle } from '../shared/clippedTitle'
import { BoloShell } from './BoloShell'
import { BOLOS, BoloLogic, EVENTS } from './boloLogic'
import type { BoloVals } from './boloRuntime'
import type { TerrainApi } from './boloTerrain'
import { BoloPhotoCaption, BoloPhotoViewer, BoloSeenDelete, type BoloPhoto } from './boloViewer'
import { useBoloOpenRequest, useBoloRequest, type BoloNewRequest, type BoloSubject } from './boloRequests'
import { BoloIdentifyDialog } from './boloPickers'
import './bolo.css'

interface BoloLogicApi {
  state: Record<string, unknown>
  __onChange: (() => void) | null
  setState(patch: Record<string, unknown>): void
  renderVals(): BoloVals
}

interface BoloRec {
  id: string
  status: string
  unread: boolean
}

/** Boards the reference links to → the module window that hosts them. */
const BOARD_APP: Record<string, string> = { ArrestsDetail: 'arrests', Laws: 'laws', MailList: 'mail' }


const PLATE = /\b\d{1,2}[A-Z]{3}\d{3}\b/
const CASE_NO = /\b(?:[A-Z]{2}-\d{4}-\d{4}|[A-Z]{2,4}-\d{2}-\d{4}|[A-Z]{2}-\d{4})\b/

/** «Tyrone Webb · CIT-48812», «Bison 87PLN903 · BOLO B-0415», «1207 Grove Street», «Forum Drive Boys» → its Поиск record. */
function findSearchRecord(text: string) {
  const recs = SEARCH_DB as unknown as { id: string; title: string; code?: string; plate?: string }[]
  const plate = PLATE.exec(text)?.[0]
  if (plate) return recs.find((r) => r.plate === plate)
  const code = /\b(?:CIT|SN)-\d+\b/i.exec(text)?.[0]?.toUpperCase()
  if (code) {
    const hit = recs.find((r) => (r.code ?? '').toUpperCase() === code)
    if (hit) return hit
  }
  const head = text.split(' · ')[0].trim().toLowerCase()
  if (!head) return undefined
  return recs.find((r) => r.title.toLowerCase() === head) ?? recs.find((r) => r.title.toLowerCase().startsWith(head) || head.startsWith(r.title.toLowerCase()))
}

/** Opens the file dialog for one image and hands it over as a data URL. */
function pickImage(onPick: (url: string) => void) {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = () => {
    const file = input.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onPick(String(reader.result))
    reader.readAsDataURL(file)
  }
  input.click()
}

/** The new-BOLO form on a person sent from Поиск («Объявить в розыск»). */
function newFormFor(s: BoloSubject): Record<string, unknown> {
  return {
    view: 'new', dlg: null, menu: false, pick: null,
    // a vehicle from Поиск opens the vehicle form with its DMV card
    nObj: s.isVeh ? 2 : 0, nBas: s.isVeh ? 0 : s.vid, nPc: {}, nPcQ: '', armed: s.armed, nPrio: s.vid === 1 ? 2 : 1, nTerm: 2, nDup: false,
    nDesc: null, nInstr: null, nPlace: null, nPlaceTxt: null, nEx: {}, nLinks: null, nRec: null, nRecNone: false, nTried: false, nPhotoN: 2,
    nSubject: { ...s, photo: s.isVeh ? null : (s.photo ?? ownPhoto(s.recId, s.name)) },
  }
}

/** b409 / B-0409 / 0409 → the record and the sidebar section it is listed in. */
function resolveBolo(ref: string, made: { id: string; no: string; status: string; kind: string }[] = []) {
  const r = String(ref || '').trim()
  if (!r) return null
  const num = r.replace(/^B-?/i, '').replace(/^0+/, '')
  const rec = ([] as { id: string; no: string; status: string; kind: string }[])
    .concat(made, BOLOS as never[], EVENTS as never[])
    .find((b) => b.id === r || b.no === r || b.no.replace(/^B-0*/, '') === num)
  if (!rec) return null
  const nav = rec.status === 'closed' ? 'closed' : rec.status === 'expired' ? 'expired' : rec.kind === 'event' ? 'alerts' : 'active'
  return { sel: rec.id, nav }
}

/** One BOLO desk per session: published BOLOs, acks, closes and sightings
 * survive closing the window (like casesStore); every open window re-renders. */
let shared: { logic: BoloLogicApi; subs: Set<() => void> } | null = null

/**
 * BOLO — a literal port of the reference component: `boloLogic.ts` holds its
 * data and render logic verbatim, the generated `Bolo*.tsx` files hold its
 * markup, and `boloTerrain.tsx` puts every map it draws onto the real San
 * Andreas map. This shell hosts the logic instance, feeds it requests from
 * other modules (Поиск → new BOLO, a BOLO deep link) and routes its links to
 * the module windows that own the records.
 */
export function BoloApp({ initialParams }: ModuleContentProps) {
  const { openWindow } = useWindowManager()
  const [, rerender] = useReducer((n: number) => n + 1, 0)
  const logicRef = useRef<BoloLogicApi | null>(null)
  const firstReq = initialParams?.boloRequest as BoloNewRequest | undefined

  const openApp = (id: string, params?: Record<string, unknown>, instanceKey?: string) => {
    const app = apps.find((a) => a.id === id)
    if (app) openWindow(app, params || instanceKey ? { instanceKey, initialParams: params } : undefined)
  }
  const openRef = useRef(openApp)
  openRef.current = openApp

  if (!logicRef.current && shared) {
    // reopened: the same desk, without the dialogs / pop-ups that were open
    shared.logic.state = { ...shared.logic.state, dlg: null, pick: null, menu: false, menuAcc: false, menuVid: false, identPick: false, incoming: false, toast: null, view: shared.logic.state.view === 'new' ? 'new' : 'feed' }
    logicRef.current = shared.logic
  }
  if (!logicRef.current) {
    const logic = new BoloLogic({
      // the person / vehicle title and record links («Личное дело», «Карточка DMV», «Дело» …)
      onLink: (kind: string, label: string) => {
        const text = String(label ?? '')
        if (kind === 'case') {
          const no = CASE_NO.exec(text)?.[0]
          const c = no ? getCases().list.find((x) => x.no === no) : undefined
          if (c) {
            requestOpenCase(c.id)
            openRef.current('cases', { entityType: 'case', entityId: c.id })
          } else openRef.current('cases')
          return
        }
        if (kind === 'doc' && /R-\d{5}/.test(text)) return openRef.current('reports')
        if (kind === 'doc' && /\bW-\d{4}/.test(text)) return openRef.current('warrants')
        if (kind === 'doc' && /\bA-\d{4}-\d{4}/.test(text)) return openRef.current('arrests')
        if (kind === 'call') return openRef.current('calls')
        // people, vehicles, homes, organisations → straight to that record's card in Поиск
        const q = PLATE.exec(text)?.[0] ?? text.split(' · ')[0].trim()
        const rec = findSearchRecord(text)
        // a window per record (the keys Дела and Отчёты use), so an already open Поиск doesn't just come to the front
        if (rec) openRef.current('search', { entityId: rec.id, label: q }, `rec:${rec.id}`)
        else openRef.current('search', q ? { label: q } : undefined, q ? `q:${q}` : undefined)
      },
    }) as unknown as BoloLogicApi
    shared = { logic, subs: new Set() }
    const sh = shared
    logic.__onChange = () => sh.subs.forEach((f) => f())
    logicRef.current = logic
    // The reference's «notify» state: a high-priority incoming BOLO pops up once per session, shortly after opening.
    window.setTimeout(() => {
      if (logic.state.view === 'feed') logic.setState({ incoming: true })
    }, 600)
  }
  const logic = logicRef.current!
  useEffect(() => {
    const subs = shared?.subs
    subs?.add(rerender)
    return () => {
      subs?.delete(rerender)
    }
  }, [])

  // opened on a record (Дела, Поиск …): id or number, in the section that lists it
  const [firstOpen] = useState(() => {
    if (firstReq) {
      logic.state = { ...logic.state, ...newFormFor(firstReq.subject) }
      return null
    }
    const ref = initialParams?.entityType === 'bolo' ? String(initialParams.entityId ?? '') : String(initialParams?.label ?? '')
    const hit = resolveBolo(ref, (logic.state.made as never[]) ?? [])
    if (hit) logic.state = { ...logic.state, view: 'feed', q: '', src: 'all', ...hit }
    return hit
  })
  void firstOpen

  // «Объявить в розыск» from Поиск while this window is open → the new-BOLO form on that person / vehicle
  const boloReq = useBoloRequest()
  const [seenReq, setSeenReq] = useState(() => Math.max(boloReq?.n ?? 0, firstReq?.n ?? 0))
  useEffect(() => {
    if (!boloReq || boloReq.n <= seenReq) return
    setSeenReq(boloReq.n)
    logic.setState(newFormFor(boloReq.subject))
  }, [boloReq, seenReq, logic])

  // «открыть ориентировку» from another module while this window is open → switch to it
  const openReq = useBoloOpenRequest()
  const [seenOpen, setSeenOpen] = useState(() => openReq?.n ?? 0)
  useEffect(() => {
    if (!openReq || openReq.n <= seenOpen) return
    setSeenOpen(openReq.n)
    const hit = resolveBolo(openReq.id, (logic.state.made as never[]) ?? [])
    if (hit) logic.setState({ view: 'feed', q: '', src: 'all', dlg: null, pick: null, menu: false, ...hit })
  }, [openReq, seenOpen, logic])

  // the incoming pop-up hides itself after ~10 s
  const incomingOn = !!logic.state.incoming
  useEffect(() => {
    if (!incomingOn) return
    const t = window.setTimeout(() => logic.setState({ incoming: false }), 10000)
    return () => window.clearTimeout(t)
  }, [incomingOn, logic])

  // desktop tile counter: active BOLOs not read / acknowledged yet
  const S = logic.state as { closed: Record<string, string>; acked: Record<string, boolean>; made?: BoloRec[] }
  const unread = ([] as BoloRec[])
    .concat(S.made ?? [], BOLOS as BoloRec[], EVENTS as BoloRec[])
    .filter((b) => b.status === 'open' && !S.closed[b.id] && b.unread && !S.acked[b.id]).length
  useEffect(() => {
    setAppBadge('bolo', unread)
  }, [unread])

  // «Приблизить» / «Отдалить» on the map picker drive the real map's zoom
  const mapApi = useRef<TerrainApi | null>(null)
  const onMapApi = useCallback((api: TerrainApi | null) => {
    mapApi.current = api
  }, [])

  // photos full size: a tile opens that photo, the card's main photo opens it with the rest
  const [photoView, setPhotoView] = useState<{ photos: BoloPhoto[]; i: number } | null>(null)

  const v = logic.renderVals()
  v.__openPhoto = (photos: BoloPhoto[] | undefined, i: number) => setPhotoView({ photos: photos ?? [], i })
  const b = v.b as { id: string; isPerson: boolean; isVeh: boolean; mainImg: string; carImg: string; photoCap: string; photos: BoloPhoto[]; needAck: boolean }
  const heroImg = b.isPerson ? b.mainImg || null : b.isVeh ? b.carImg || null : null
  const heroList: BoloPhoto[] = heroImg ? [{ cap: b.photoCap, img: heroImg, hasImg: true }, ...b.photos.filter((p) => p.img !== heroImg)] : b.photos
  v.__openHero = heroList.length ? () => setPhotoView({ photos: heroList, i: 0 }) : undefined
  v.__heroCursor = heroList.length ? 'zoom-in' : 'default'
  // typing into the event form's empty «Новая подпись / Значение» row adds a point — keep typing in it
  const alFocus = v.alFocus as { j: number; n: number } | null
  const rootRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!alFocus) return
    const rows = rootRef.current?.querySelectorAll<HTMLInputElement>('input[aria-label="Подпись пункта"]')
    const row = rows?.[rows.length - 1]?.parentElement
    const input = row?.querySelectorAll<HTMLInputElement>('input')[alFocus.j]
    if (!input) return
    input.focus()
    input.setSelectionRange(input.value.length, input.value.length)
  }, [alFocus?.n])
  // «Добавить фото» / «Перетащите или выберите»: a real picture from the computer
  // …with a caption first, like the card's own photos («Татуировка FDB на шее»)
  const addPhoto = v.addPhoto as (url: string, cap?: string) => void
  const addPhotoNew = v.addPhotoNew as (url: string, cap?: string) => void
  const [capFor, setCapFor] = useState<{ url: string; add: (url: string, cap: string) => void; kind: string } | null>(null)
  const kindNow = String((v.b as { isVeh?: boolean; isEvent?: boolean }).isVeh ? 'veh' : (v.b as { isEvent?: boolean }).isEvent ? 'event' : 'person')
  const newKind = ['person', 'person', 'veh', 'event'][Number(logic.state.nObj ?? 0)] ?? 'person'
  v.addPhoto = () => pickImage((url) => setCapFor({ url, add: addPhoto, kind: kindNow }))
  v.addPhotoNew = () => pickImage((url) => setCapFor({ url, add: addPhotoNew, kind: newKind }))
  /** «B-0409» of the open card */
  const selNo = () => {
    const st = logicRef.current!.state
    const all = ([] as { id: string; no: string }[]).concat((st.made as never[]) ?? [], BOLOS as never[], EVENTS as never[])
    return all.find((x) => x.id === st.sel)?.no ?? 'B-0000'
  }
  // «Скачать PDF»: the poster sheet is saved to the computer as BOLO-0409.pdf (no print dialog)
  const ppPdf = v.ppPdf as () => void
  v.ppPdf = () => {
    const sheet = rootRef.current?.querySelector<HTMLElement>('[data-bolo-sheet]')
    if (!sheet) return
    downloadElementPdf(sheet, `BOLO-${selNo().slice(2)}.pdf`).then(ppPdf, (err) => console.error('PDF', err))
  }
  // the poster: when the A4 body runs out of room (staff note, reward …) the description is cut to whole lines with «…»
  useLayoutEffect(() => {
    const narr = rootRef.current?.querySelector<HTMLElement>('[data-bolo-narr]')
    const body = narr?.closest<HTMLElement>('[data-bolo-body]')
    if (!narr || !body) return
    const clamp = () => {
      narr.style.webkitLineClamp = ''
      if (narr.scrollHeight > narr.clientHeight + 1) narr.style.webkitLineClamp = String(Math.max(1, Math.floor(narr.clientHeight / 14.5)))
    }
    const fits = () => body.scrollHeight <= body.clientHeight + 1
    // 1) the description gives way; 2) the blocks move closer; 3) the description makes room entirely
    body.style.gap = ''
    narr.style.display = ''
    clamp()
    if (fits()) return
    body.style.gap = '4px'
    clamp()
    if (fits()) return
    narr.style.display = 'none'
  })
  // the sticky «Ознакомлен» bar shows while the card's own button is scrolled out of view
  const [ackInView, setAckInView] = useState(true)
  const viewName = String(logic.state.view)
  useEffect(() => {
    const el = rootRef.current?.querySelector('[data-ack-inline]')
    if (!el) return setAckInView(true)
    const io = new IntersectionObserver(([e]) => setAckInView(e.isIntersecting), { root: el.closest('.bolo-detail'), threshold: 0.6 })
    io.observe(el)
    return () => io.disconnect()
  }, [b.id, b.needAck, viewName])
  v.__ackSticky = !ackInView
  // «Где замечен»: a sighting made by mistake is deleted (asking why)
  const [seenDelFor, setSeenDelFor] = useState<{ key: string; n: string; place: string; when: string; who: string } | null>(null)
  v.__seenDel = (s: { key: string; n: string; place: string; when: string; who: string }) => setSeenDelFor(s)
  v.__mapApi = onMapApi
  v.__mapZoom = (dir: 1 | -1) => mapApi.current?.zoom(dir)
  v.__go = (href: string) => (event: MouseEvent) => {
    event.preventDefault()
    const board = String(href || '').replace(/\.dc\.html$/, '')
    // «Написать» in «С кем связаться»: a letter to that contact about this BOLO
    if (board === 'MailList') {
      const bb = v.b as { ctName?: string; id?: string; title?: string }
      const to = /[A-Z][a-z]+(?: [A-Z][a-z'-]+)+$/.exec(String(bb.ctName ?? ''))?.[0] ?? String(bb.ctName ?? '')
      return composeMail(openWindow, { to, subject: `${bb.id ?? selNo()} · ${bb.title ?? ''}` })
    }
    if (BOARD_APP[board]) openApp(BOARD_APP[board])
  }
  // «Опубликовать» with missing fields: scroll to the first error
  const publish = v.publish as () => void
  v.publish = () => {
    publish()
    window.setTimeout(() => rootRef.current?.querySelector('[data-bolo-err]')?.scrollIntoView({ block: 'center', behavior: 'smooth' }), 30)
  }

  // the ⋯ menu closes on a click outside it
  const menuOpen = !!v.menuOpen
  useEffect(() => {
    if (!menuOpen) return
    const down = (e: PointerEvent) => {
      const t = e.target as Element | null
      if (t?.closest('[role="menu"]') || t?.closest('button[aria-label="Ещё"]')) return
      logic.setState({ menu: false, menuAcc: false, menuVid: false })
    }
    document.addEventListener('pointerdown', down, true)
    return () => document.removeEventListener('pointerdown', down, true)
  }, [menuOpen, logic])

  // Esc closes the topmost overlay
  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== 'Escape' || photoView) return
    const s = logic.state
    if (s.identPick) logic.setState({ identPick: false })
    else if (s.pick) v.pickCancel()
    else if (s.dlg === 'seen') v.closeSeen()
    else if (s.dlg === 'update') v.cancelUpd()
    else if (s.dlg === 'close') v.cancelClose()
    else if (s.menu) logic.setState({ menu: false, menuAcc: false, menuVid: false })
    else if (v.incoming) v.dismissIncoming()
    else return
    e.stopPropagation()
  }

  return (
    <div
      ref={rootRef}
      onKeyDown={onKeyDown}
      onMouseOver={showClippedTitle}
      className="bolo-root"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        overflow: 'hidden',
        background: v.c.content,
        color: v.c.text,
        fontSize: '14px',
        lineHeight: '20px',
        fontFamily: "'Segoe UI Variable Text', 'Segoe UI', Inter, system-ui, sans-serif",
      }}
    >
      <BoloShell $v={v} />
      {v.identPicking ? <BoloIdentifyDialog $v={v} /> : null}
      {seenDelFor ? (
        <BoloSeenDelete
          $v={v}
          row={seenDelFor}
          onCancel={() => setSeenDelFor(null)}
          onDelete={(why) => {
            ;(v.seenDelete as (key: string, why: string) => void)(seenDelFor.key, why)
            setSeenDelFor(null)
          }}
        />
      ) : null}
      {capFor ? (
        <BoloPhotoCaption
          $v={v}
          url={capFor.url}
          kind={capFor.kind}
          onCancel={() => setCapFor(null)}
          onSave={(cap) => {
            capFor.add(capFor.url, cap)
            setCapFor(null)
          }}
        />
      ) : null}
      {photoView ? (
        <BoloPhotoViewer photos={photoView.photos} index={photoView.i} onIndex={(i) => setPhotoView({ ...photoView, i })} onClose={() => setPhotoView(null)} />
      ) : null}
    </div>
  )
}
