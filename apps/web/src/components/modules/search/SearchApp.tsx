import { useEffect, useReducer, useRef, useState, type ChangeEvent, type KeyboardEvent, type MouseEvent } from 'react'
import { getMdcTags, setMdcTags, subscribeMdcTags } from './mdcStore'
import { apps } from '../../../data/apps'
import { mockProfile } from '../../../lib/mockData/profile'
import { useWindowManager } from '../../../windows/WindowManagerContext'
import type { ModuleContentProps } from '../registry'
import { SearchShell } from './SearchShell'
import { SEARCH_BOLOREF, SEARCH_DB, SEARCH_RICH, SEARCH_RICHV, SEARCH_RICHW, SEARCH_TAG_SEED, SEARCH_UC_OP, SearchLogic, rememberSearchQuery } from './searchLogic'
import { canSeeCase, findCaseMention, getCases, myWritableCases, requestAddToCase, requestOpenCase, type CaseAddKind } from '../cases/casesStore'
import { requestNewBolo, requestOpenBolo, type BoloSubject } from '../bolo/boloRequests'
import type { SearchVals } from './searchRuntime'
import { SearchPrintSheet, type PrintDossier, type PrintRec } from './SearchPrintSheet'
import { composeMail } from '../mail/mailStore'
import './search.css'
import { showClippedTitle } from '../shared/clippedTitle'

/** Boards the reference links to → the module window that hosts them. */
const BOARD_APP: Record<string, string> = {
  Agency: 'admin',
  BOLO: 'bolo',
  BOLONew: 'bolo',
  BOLOSeen: 'bolo',
  BOLOVeh: 'bolo',
  Cases: 'cases',
  MailList: 'mail',
  Warrants: 'warrants',
  WarrantsNew: 'warrants',
}

interface SearchLogicApi {
  state: Record<string, unknown>
  __onChange: (() => void) | null
  setState(patch: Record<string, unknown>): void
  renderVals(): SearchVals
}

interface SearchDbRec {
  id: string
  type: string
  title: string
  code?: string
  sub?: string
  plate?: string
  serial?: string
}

interface SearchBoloRef {
  no: string
  restricted?: boolean
  ct?: string
}

/** «Добавить в дело» choices: the cases the user can add to, then «Новое дело». */
function caseChoices(): [string, string][] {
  return [...myWritableCases().map((f): [string, string] => [f.no, `${f.short} · ${f.status}`]), ['Новое дело', 'Создать дело и привязать карточку']]
}

/** «20.11, 14:05» — the change-history stamp the reference logic writes. */
function histStamp() {
  const d = new Date()
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

/** «B-0415» → BOLO record id «b415». */
function boloId(no: string) {
  return 'b' + String(parseInt(no.split('-')[1] ?? '', 10))
}

const findRec = (id: unknown) => (SEARCH_DB as SearchDbRec[]).find((r) => r.id === id)

/**
 * Поиск — a literal port of the reference component: `searchLogic.ts` holds
 * its data and render logic verbatim, the generated `Search*.tsx`/`records/*`
 * files hold its markup. This shell only hosts the logic instance and wires
 * the reference's board links to our module windows.
 */
export function SearchApp({ initialParams }: ModuleContentProps) {
  const { openWindow } = useWindowManager()
  const [, rerender] = useReducer((n: number) => n + 1, 0)
  const rootRef = useRef<HTMLDivElement>(null)
  const logicRef = useRef<SearchLogicApi | null>(null)

  if (!logicRef.current) {
    // No `accent` prop: the logic then uses its dark fallback (#60CDFF, black
    // on-accent text), the same accent Mail/Cases render with.
    // `caseChoices`: «Добавить в дело» lists the cases the user can add records to.
    const logic = new SearchLogic({ caseChoices: caseChoices }) as unknown as SearchLogicApi
    // Tags are shared across windows (mdcStore): start from the current shared set.
    // Undercover records: only members of the operation's access group see the
    // «Под прикрытием» banner; everyone else gets the ordinary card.
    const inUcGroup = (SEARCH_UC_OP as { group: string[] }).group.includes(mockProfile.name)
    logic.state = { ...logic.state, vw: inUcGroup ? 'cur' : 'std', ...(getMdcTags() ? { tg: getMdcTags() } : {}) }
    const entityId = initialParams?.entityId as string | undefined
    const label = initialParams?.label as string | undefined
    const rec = findRec(entityId)
    if (rec) logic.setState({ q: rec.plate || rec.serial || rec.title, type: 'all', sel: rec.id, open: true, mn: false })
    else if (label) logic.setState({ q: label })
    logic.__onChange = () => {
      // Publish this window's tag edits to every other window / module.
      setMdcTags(logic.state.tg as Parameters<typeof setMdcTags>[0])
      rerender()
    }
    logicRef.current = logic
  }
  const logic = logicRef.current

  // Pull tag edits made in other Поиск windows.
  useEffect(
    () =>
      subscribeMdcTags(() => {
        const shared = getMdcTags()
        if (shared && shared !== logic.state.tg) {
          logic.state = { ...logic.state, tg: shared }
          rerender()
        }
      }),
    [logic],
  )

  // Toasts hide by themselves after a few seconds (and on opening another record — see the logic).
  const toast = String(logic.state.tst ?? '')
  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => {
      if (logic.state.tst === toast) logic.setState({ tst: '' })
    }, 4000)
    return () => window.clearTimeout(t)
  }, [toast, logic])

  // «Ещё действия» closes on a click anywhere outside it.
  const menuOpen = !!logic.state.mn
  useEffect(() => {
    if (!menuOpen) return
    const onDown = (event: PointerEvent) => {
      const wrap = rootRef.current?.querySelector('button[aria-label="Ещё действия"]')?.parentElement
      if (wrap && wrap.contains(event.target as Node)) return
      logic.setState({ mn: false })
    }
    document.addEventListener('pointerdown', onDown, true)
    return () => document.removeEventListener('pointerdown', onDown, true)
  }, [menuOpen, logic])

  const v = logic.renderVals()
  const recId: string | null = v.hasRec ? (v.rec.id as string) : null
  const boloRef = recId ? (SEARCH_BOLOREF as Record<string, SearchBoloRef>)[recId] : undefined

  // the undercover mock-up switch is a design-review aid, not something an officer sees
  v.vwNote = ''

  // «Распечатать»: the printout on an A4 sheet (what the game hands out as an item), not a bare toast
  const [printing, setPrinting] = useState(false)
  if (v.dl) v.dl.print = () => {
    logic.setState({ mn: false })
    setPrinting(true)
  }

  function openApp(id: string, opts?: { instanceKey?: string; initialParams?: Record<string, unknown> }) {
    const app = apps.find((a) => a.id === id)
    if (app) openWindow(app, opts)
  }

  /** Writes a line into this record's change history (and shows a toast). */
  function logLine(line: string, tst: string) {
    if (!recId) return
    const hl = { ...((logic.state.hl as Record<string, string[][]> | undefined) ?? {}) }
    hl[recId] = [[histStamp(), `${line} · Вы`], ...(hl[recId] ?? [])]
    logic.setState({ hl, tst })
  }

  /** Opens BOLO on this record's ориентировка: a new BOLO window starts on it,
   * an open one switches to it (requestOpenBolo). */
  function openBoloCard() {
    if (!boloRef) return openApp('bolo')
    const id = boloId(boloRef.no)
    requestOpenBolo(id)
    openApp('bolo', { initialParams: { entityType: 'bolo', entityId: id } })
  }

  /** Restricted BOLO: the request goes to its curator, nothing else is shown. */
  function requestBoloAccess() {
    if (!boloRef) return
    logLine(`Запрошен доступ к ${boloRef.no} у ${boloRef.ct ?? 'куратора'}`, `Запрос доступа к ${boloRef.no} отправлен: ${boloRef.ct ?? 'куратор'}`)
  }

  function openCase(no: string, itemId?: string) {
    const c = getCases().list.find((x) => x.no === no)
    if (!c) return openApp('cases')
    if (!canSeeCase(c.id)) return logic.setState({ tst: `Дело ${no} другого ведомства: у вас нет к нему доступа` })
    requestOpenCase(c.id, itemId)
    openApp('cases', { initialParams: { entityType: 'case', entityId: c.id, ...(itemId ? { itemId } : {}) } })
  }

  /** What identifies this card inside a case: name, plate, serial, MDC number, evidence number. */
  function mentionTokens(rec: SearchDbRec) {
    const t = [rec.title, rec.code, rec.plate, rec.serial].filter(Boolean) as string[]
    const W = (SEARCH_RICHW as unknown as Record<string, { storage?: string[] | null }>)[rec.id]
    const ev = W?.storage?.[1] ? /E-\d+/.exec(W.storage[1])?.[0] : undefined
    if (ev) t.push(ev)
    return t
  }
  /** «Упоминания в делах»: where the card is in that case («Участники › Подозреваемые › Marcus Tate»). */
  const mentionOf = (no: string) => {
    const rec = findRec(recId)
    return rec ? findCaseMention(no, mentionTokens(rec), rec.title) : null
  }
  v.__caseWhere = (no: unknown) => {
    const c = getCases().list.find((x) => x.no === String(no ?? ''))
    if (c && !canSeeCase(c.id)) return 'Дело другого ведомства — нет доступа'
    const m = mentionOf(String(no ?? ''))
    return m ? m.where : ''
  }

  v.__go = (board: string) => (event: MouseEvent) => {
    event.preventDefault()
    if (board === 'BOLO') return openBoloCard()
    // «Написать»: a letter addressed to the right person, sent straight to the mailbox
    const recTitle = String(findRec(recId)?.title ?? '')
    if (board === 'MailCurator') return composeMail(openWindow, { to: SEARCH_UC_OP.cur[1], subject: `Доступ к карточке: ${recTitle}` })
    if (board === 'MailBolo') return composeMail(openWindow, { to: String(v.bolo?.ctShort ?? ''), subject: boloRef ? `${boloRef.no} · ${recTitle}` : recTitle })
    if (board === 'MailEmp') return composeMail(openWindow, { to: recTitle })
    // «Замечен»: the reference's own «Отметить „Замечен“» dialog (position / map)
    if (board === 'BOLOSeen') return v.dl?.seen()
    if (board === 'BOLOVeh') {
      const action = String(v.v?.wantedAction ?? '')
      if (action === 'Запросить доступ') return requestBoloAccess()
      if (action === 'Снять розыск' && boloRef) return openBoloCard()
      const rec = findRec(recId)
      return rec ? startBolo(rec, 0, '') : openApp('bolo')
    }
    const appId = BOARD_APP[board]
    // «Ордера» is still a stub window: request the warrant through the reference's own dialog
    if (appId === 'warrants' && apps.find((a) => a.id === 'warrants')?.stub) return v.dl?.warr()
    if (appId) openApp(appId)
  }
  v.__case = (no: unknown) => (event: MouseEvent) => {
    event.preventDefault()
    const n = String(no ?? '')
    openCase(n, mentionOf(n)?.itemId)
  }
  v.__vwToggle = () => logic.setState({ vw: logic.state.vw === 'cur' ? 'std' : 'cur' })

  // «Объявить в розыск»: straight to BOLO's full new-BOLO form on this person
  // (kind, articles, priority are chosen there — no intermediate dialog).
  // Someone already in an active BOLO gets «Открыть B-…» instead of a duplicate.
  const activeBolo = boloRef && !boloRef.restricted ? boloRef.no : null
  if (activeBolo) {
    v.__wantedLabel = `Открыть ${activeBolo}`
    v.__boloLabel = `Открыть ${activeBolo}`
  }
  v.__wanted = (event: MouseEvent) => {
    event.preventDefault()
    if (activeBolo) return openBoloCard()
    if (boloRef?.restricted) return requestBoloAccess()
    const rec = findRec(recId)
    if (rec) startBolo(rec, 0, '')
  }
  // «Добавить в дело»: the reference's dialog picks the case, then «Дела» adds the record.
  v.__toCase = (event: MouseEvent) => {
    event.preventDefault()
    v.dl?.tocase()
  }
  if (v.dlg?.open && logic.state.dl === 'tocase' && myWritableCases().length === 0) {
    v.dlg.text = 'У вас нет дел, в которые можно добавлять записи: вы не участник ни одного дела или у вас только просмотр. Можно завести новое дело — карточка сразу попадёт в него.'
  }
  if (v.dlg?.confirm) {
    const confirm = v.dlg.confirm
    v.dlg.confirm = () => {
      const dl = logic.state.dl as string | null
      const cur = Number(logic.state.dc ?? 0)
      const reason = String(logic.state.dr ?? '').trim()
      const rec = findRec(recId)
      confirm()
      // the dialog stays open when its own checks fail (e.g. no reason) — then nothing happens
      if (logic.state.dl || !rec) return
      // dialog choices: Особый розыск · Розыск · Проверка и опрос → BOLO kinds special · wanted · poi
      if (dl === 'wanted') {
        startBolo(rec, [1, 0, 2][cur] ?? 0, reason)
        if (rec.type !== 'person' && rec.type !== 'vehicle') logic.setState({ tst: 'BOLO открыт: оформите ориентировку там' })
      }
      if (dl === 'tocase') addToCase(rec, cur)
      if (dl === 'gang' && cur === 1) openApp('sanggang')
      if (dl === 'seen' && cur === 1) openBoloCard()
      if (dl === 'share' && cur === 2) {
        const link = `SALETS MDT · Поиск · ${rec.title}${rec.code ? ` (${rec.code})` : rec.plate ? ` (${rec.plate})` : ''}`
        void navigator.clipboard?.writeText(link).catch(() => undefined)
        logic.setState({ tst: 'Ссылка на карточку скопирована' })
      }
    }
  }

  /** Opens BOLO's new-BOLO form prefilled with this person / vehicle; `vid` =
   * BOLO kind (0 разыскивается, 1 особый розыск, 2 лицо, представляющее интерес). */
  function startBolo(rec: SearchDbRec, vid: number, reason: string) {
    if (rec.type === 'vehicle') {
      // BOLO takes a vehicle subject as `isVeh` (name = model, code = plate)
      const subject: BoloSubject & { isVeh: true } = { recId: rec.id, name: rec.title, code: rec.plate ?? '', sub: rec.sub ?? '', vid, reason, armed: false, isVeh: true }
      openApp('bolo', { initialParams: { boloRequest: requestNewBolo(subject) } })
      return
    }
    if (rec.type !== 'person') return openApp('bolo')
    const tags = ((logic.state.tg as Record<string, { n: string }[]> | undefined)?.[rec.id] ?? (SEARCH_TAG_SEED as Record<string, { n: string }[]>)[rec.id] ?? []).map((t) => t.n)
    const req = requestNewBolo({ recId: rec.id, name: rec.title, code: rec.code ?? '', sub: rec.sub ?? '', vid, reason, armed: tags.includes('Вооружён') })
    openApp('bolo', { initialParams: { boloRequest: req } })
  }

  function addToCase(rec: SearchDbRec, cur: number) {
    const cases = myWritableCases()
    const target = cases[cur] ?? null // past the cases: «Новое дело»
    const KIND: Record<string, CaseAddKind> = { person: 'person', vehicle: 'vehicle', place: 'place', weapon: 'weapon', org: 'org' }
    const kind = KIND[rec.type]
    if (!kind) return openApp('cases')
    const req = requestAddToCase(target?.id ?? null, rec.id, kind)
    openApp('cases', { initialParams: { addRequest: req } })
    logic.setState({ tst: target ? `Открыто дело ${target.no}: подтвердите добавление в «Делах»` : 'Открыты «Дела»: заполните новое дело — карточка добавится в него сразу после создания' })
  }

  // Weapon card: «Объявить в розыск» goes through the reference's dialog;
  // «Снять с учёта кражи» / «Отметить найденным» are status changes → «Изменить данные», tab «Статус»
  // with «Статус» picked and the new value filled in.
  v.__weaponWanted = (event: MouseEvent) => {
    event.preventDefault()
    if (v.w?.wantedAction === 'Объявить в розыск') return v.dl?.wanted()
    // a stolen / lost weapon: the status change, the right option already picked
    const pick = v.w?.wantedAction === 'Отметить найденным' ? 'Найдено' : 'Снять отметку о краже'
    logic.setState({ dl: 'gedit', dc: 0, dr: '', tst: '', mn: false, mf: { '0.st': pick }, pq: '' })
  }

  // Vehicle comments: the reference leaves the box without a handler — a real list.
  const cmDraft = String(logic.state.cmDraft ?? '')
  const addComment = () => {
    const text = cmDraft.trim()
    const rec = recId ? (SEARCH_RICHV as Record<string, { comments: string[][] }>)[recId] : undefined
    if (!rec || !text) return
    const now = new Date()
    const when = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    rec.comments = [...rec.comments, [mockProfile.name, when, text]]
    logic.setState({ cmDraft: '' })
  }
  v.__cmDraft = cmDraft
  v.__cmSet = (event: ChangeEvent<HTMLInputElement>) => logic.setState({ cmDraft: event.target.value })
  v.__cmKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') addComment()
  }
  v.__cmAdd = addComment

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'f') {
      const input = rootRef.current?.querySelector<HTMLInputElement>('input[aria-label="Поиск по базе"]')
      if (!input) return
      event.preventDefault()
      input.focus()
      input.select()
      return
    }
    if (event.key === 'Escape') {
      if (v.dlg?.open) {
        event.preventDefault()
        v.dlg.close()
      } else if (logic.state.mn) logic.setState({ mn: false })
      return
    }
    // Enter in the search box keeps the query in «Недавние запросы»
    const target = event.target as HTMLElement
    if (event.key === 'Enter' && target.getAttribute('aria-label') === 'Поиск по базе') {
      rememberSearchQuery(String(logic.state.q ?? ''))
      rerender()
    }
  }

  return (
    <div
      ref={rootRef}
      onMouseOver={showClippedTitle}
      onKeyDown={handleKeyDown}
      className="search-root"
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
      <SearchShell $v={v} />
      {printing && recId && findRec(recId) ? (
        <SearchPrintSheet
          $v={v as unknown as { c: Record<string, string>; accent: string; onAccent: string }}
          rec={findRec(recId) as unknown as PrintRec}
          dossier={((SEARCH_RICH as unknown as Record<string, PrintDossier>)[recId] ?? (SEARCH_RICHV as unknown as Record<string, PrintDossier>)[recId]) as PrintDossier | undefined}
          onClose={() => setPrinting(false)}
          onPrint={(full) => {
            setPrinting(false)
            logLine(`Распечатано: ${full ? 'полная справка' : 'краткая карточка'}`, 'Отправлено на принтер участка. В игре вы получите предмет с распечаткой в инвентарь.')
          }}
        />
      ) : null}
    </div>
  )
}
