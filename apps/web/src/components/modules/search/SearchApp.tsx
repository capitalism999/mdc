import { useEffect, useReducer, useRef, type ChangeEvent, type KeyboardEvent, type MouseEvent } from 'react'
import { getMdcTags, setMdcTags, subscribeMdcTags } from './mdcStore'
import { apps } from '../../../data/apps'
import { useWindowManager } from '../../../windows/WindowManagerContext'
import type { ModuleContentProps } from '../registry'
import { SearchShell } from './SearchShell'
import { SEARCH_DB, SEARCH_RICHV, SEARCH_TAG_SEED, SearchLogic } from './searchLogic'
import { myWritableCases, requestAddToCase, requestOpenCase } from '../cases/casesStore'
import { requestNewBolo } from '../bolo/boloRequests'
import type { SearchVals } from './searchRuntime'
import './search.css'

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
}

/** «Добавить в дело» choices: the cases the user can add to, then «Новое дело». */
function caseChoices(): [string, string][] {
  return [...myWritableCases().map((f): [string, string] => [f.no, `${f.short} · ${f.status}`]), ['Новое дело', 'Создать дело и привязать карточку']]
}

interface SearchRecordRef {
  id: string
  plate?: string
  serial?: string
  title: string
}

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
    logic.state = { ...logic.state, vw: 'std', ...(getMdcTags() ? { tg: getMdcTags() } : {}) }
    const entityId = initialParams?.entityId as string | undefined
    const label = initialParams?.label as string | undefined
    const rec = (SEARCH_DB as SearchRecordRef[]).find((r) => r.id === entityId)
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

  const v = logic.renderVals()
  v.__go = (board: string) => (event: MouseEvent) => {
    event.preventDefault()
    const app = apps.find((a) => a.id === BOARD_APP[board])
    if (app) openWindow(app)
  }
  v.__vwToggle = () => logic.setState({ vw: logic.state.vw === 'cur' ? 'std' : 'cur' })

  // «Объявить в розыск»: straight to BOLO's full new-BOLO form on this person
  // (kind, articles, priority are chosen there — no intermediate dialog).
  // «Добавить в дело»: the reference's dialog picks the case, then «Дела» adds the record.
  v.__wanted = (event: MouseEvent) => {
    event.preventDefault()
    const rec = (SEARCH_DB as SearchDbRec[]).find((r) => r.id === logic.state.sel)
    if (rec) startBolo(rec, 0, '')
  }
  v.__toCase = (event: MouseEvent) => {
    event.preventDefault()
    v.dl?.tocase()
  }
  if (v.dlg?.confirm) {
    const confirm = v.dlg.confirm
    v.dlg.confirm = () => {
      const dl = logic.state.dl as string | null
      const cur = Number(logic.state.dc ?? 0)
      const reason = String(logic.state.dr ?? '').trim()
      const rec = (SEARCH_DB as SearchDbRec[]).find((r) => r.id === logic.state.sel)
      confirm()
      // the dialog stays open when its own checks fail (e.g. no reason) — then nothing happens
      if (logic.state.dl || !rec) return
      // (weapon card: its own «Объявить в розыск» still goes through the dialog)
      // dialog choices: Особый розыск · Розыск · Проверка и опрос → BOLO kinds special · wanted · poi
      if (dl === 'wanted') startBolo(rec, [1, 0, 2][cur] ?? 0, reason)
      if (dl === 'tocase') addToCase(rec, cur)
    }
  }

  /** Opens BOLO's new-BOLO form prefilled with this person; `vid` = BOLO kind (0 разыскивается, 1 особый розыск, 2 лицо, представляющее интерес). */
  function startBolo(rec: SearchDbRec, vid: number, reason: string) {
    const app = apps.find((a) => a.id === 'bolo')
    if (!app) return
    if (rec.type !== 'person') {
      openWindow(app)
      return
    }
    const tags = ((logic.state.tg as Record<string, { n: string }[]> | undefined)?.[rec.id] ?? (SEARCH_TAG_SEED as Record<string, { n: string }[]>)[rec.id] ?? []).map((t) => t.n)
    const req = requestNewBolo({ recId: rec.id, name: rec.title, code: rec.code ?? '', sub: rec.sub ?? '', vid, reason, armed: tags.includes('Вооружён') })
    openWindow(app, { initialParams: { boloRequest: req } })
  }

  function addToCase(rec: SearchDbRec, cur: number) {
    const app = apps.find((a) => a.id === 'cases')
    if (!app) return
    const cases = myWritableCases()
    const target = cases[cur] ?? null // past the cases: «Новое дело»
    if (rec.type === 'person' || rec.type === 'vehicle') {
      const req = requestAddToCase(target?.id ?? null, rec.id, rec.type)
      openWindow(app, { initialParams: { addRequest: req } })
      return
    }
    // org / place / weapon: no add form in «Дела» for these yet — open the chosen case
    if (target) {
      requestOpenCase(target.id)
      openWindow(app, { initialParams: { entityType: 'case', entityId: target.id } })
    } else openWindow(app)
  }
  // The reference leaves these two controls without handlers; back them with
  // its own "Объявить в розыск" dialog / BOLO link and a real comment list.
  v.__weaponWanted = (event: MouseEvent) =>
    v.w?.wantedAction === 'Объявить в розыск' ? v.dl?.wanted() : v.__go('BOLO')(event)
  const cmDraft = String(logic.state.cmDraft ?? '')
  const addComment = () => {
    const sel = logic.state.sel as string | null
    const text = cmDraft.trim()
    const rec = sel ? (SEARCH_RICHV as Record<string, { comments: string[][] }>)[sel] : undefined
    if (!rec || !text) return
    const now = new Date()
    const when = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}, ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    rec.comments = [...rec.comments, ['Thorne Watts', when, text]]
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
    }
  }

  return (
    <div
      ref={rootRef}
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
    </div>
  )
}
