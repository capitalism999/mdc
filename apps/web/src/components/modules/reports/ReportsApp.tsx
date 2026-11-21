import { useEffect, useLayoutEffect, useReducer, useRef, useState, type ChangeEvent, type MouseEvent } from 'react'
import { apps } from '../../../data/apps'
import { mockProfile } from '../../../lib/mockData/profile'
import { useWindowManager } from '../../../windows/WindowManagerContext'
import { getCases, requestOpenCase } from '../cases/casesStore'
import { SEARCH_DB } from '../search/searchLogic'
import type { ModuleContentProps } from '../registry'
import { ReportsPicker } from './ReportsPicker'
import { ReportsShell } from './ReportsShell'
import { REPORTS, ReportsLogic } from './reportsLogic'
import type { ReportsVals } from './reportsRuntime'
import './reports.css'
import { showClippedTitle } from '../shared/clippedTitle'

interface ReportsLogicApi {
  state: Record<string, unknown>
  __onChange: (() => void) | null
  setState(patch: Record<string, unknown>): void
  renderVals(): ReportsVals
}

/** Boards the reference links to → the module window that hosts them. */
const BOARD_APP: Record<string, string> = {
  Cases: 'cases',
  CasesEvd: 'cases',
  SurveillanceCam: 'cases',
  ArrestsDetail: 'arrests',
  ArrestsLog: 'arrests',
  Warrants: 'warrants',
  Watch: 'calls',
  Main: 'calls',
  WatchApprovals: 'calls',
  SearchPerson: 'search',
  SearchVehicle: 'search',
  BOLOArrested: 'bolo',
  FTPSign: 'ftp',
}

/** A report record as the logic keeps it (only what this shell reads). */
interface ReportRec {
  id: string
  no: string
  type: string
  title: string
  sub: string
  by: string
}

const PLATE = /\b\d{1,2}[A-Z]{3}\d{3}\b/

/** The reports themselves — statuses, reports made here, deletions, links,
 * history, review notes — are one desk for every Отчёты window (and survive
 * closing it, like casesStore): a report signed in the main window shows as
 * signed in a «Отчёты · R-…» window at once. What each window shows (view,
 * selection, the form being filled) stays its own. */
const SHARED_KEYS = ['st', 'made', 'gone', 'lnx', 'tlx', 'updx', 'notes', 'ed'] as const
const desk: { data: Record<string, unknown> | null; subs: Set<(src: ReportsLogicApi) => void> } = { data: null, subs: new Set() }
const pickShared = (s: Record<string, unknown>) => Object.fromEntries(SHARED_KEYS.filter((k) => k in s).map((k) => [k, s[k]]))

/** Blank zoom steps, 33%…300%. */
const ZOOMS = [0.33, 0.4, 0.5, 0.67, 0.75, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2, 2.5, 3]

/**
 * Отчёты — a literal port of the reference component: `reportsLogic.ts`
 * holds its data and render logic verbatim, the generated `Reports*.tsx`
 * files hold its markup. This shell only hosts the logic instance and routes
 * the reference's board links: report links stay in this window, the rest
 * open the module window that owns the record.
 */
export function ReportsApp({ initialParams }: ModuleContentProps) {
  const { openWindow } = useWindowManager()
  const [, rerender] = useReducer((n: number) => n + 1, 0)
  const logicRef = useRef<ReportsLogicApi | null>(null)

  if (!logicRef.current) {
    // a dedicated window for one report («Отчёты · R-11034»), opened from a
    // link in the new-report form so the form itself stays where it is
    const peek = typeof initialParams?.peek === 'string' ? initialParams.peek : undefined
    const logic = new ReportsLogic(peek ? { view: 'doc', sel: peek, ag: mockProfile.agency === 'lspd' ? 'lspd' : 'lssd' } : { ag: mockProfile.agency === 'lspd' ? 'lspd' : 'lssd' }) /* MDT: the blank of the active character's department */ as unknown as ReportsLogicApi
    const rec = initialParams?.rec as { id: string } | undefined
    if (desk.data) logic.state = { ...logic.state, ...desk.data }
    else if (peek && rec) logic.state = { ...logic.state, made: [rec] }
    desk.data = pickShared(logic.state)
    // every change to the shared part reaches the other open Отчёты windows
    const own = logic.setState.bind(logic)
    logic.setState = (patch: Record<string, unknown>) => {
      own(patch)
      if (!SHARED_KEYS.some((k) => k in patch)) return
      desk.data = pickShared(logic.state)
      desk.subs.forEach((fn) => fn(logic))
    }
    logic.__onChange = rerender
    logicRef.current = logic
  }
  const logic = logicRef.current
  useEffect(() => {
    const onShared = (src: ReportsLogicApi) => {
      if (src === logic || !desk.data) return
      logic.state = { ...logic.state, ...desk.data }
      rerender()
    }
    desk.subs.add(onShared)
    return () => {
      desk.subs.delete(onShared)
    }
  }, [logic])

  // Blank zoom (MDT addition): bar under the sheet + Ctrl + mouse wheel.
  // Each screen (new report / report blank / builder) keeps its own zoom; until
  // the user zooms, the sheet starts fitted to the column (never above 100%).
  const rootRef = useRef<HTMLDivElement>(null)
  const [zooms, setZooms] = useState<Record<string, { mode: 'auto' | 'fit' | 'manual'; z: number }>>({})
  const [colW, setColW] = useState(0)
  const v = logic.renderVals()
  const viewKey = v.isNew ? 'new' : v.isBuilder ? 'builder' : v.isPaper ? 'paper' : ''
  useLayoutEffect(() => {
    const col = viewKey ? rootRef.current?.querySelector<HTMLElement>('[data-paper-scroll]') : null
    if (!col) return
    const measure = () => setColW(col.clientWidth)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(col)
    return () => ro.disconnect()
  }, [viewKey])
  // sheet is 560px wide; leave the wrapper's 24px gutters on each side
  const fitZ = colW ? Math.min(ZOOMS[ZOOMS.length - 1], Math.max(ZOOMS[0], Math.floor(((colW - 48) / 560) * 100) / 100)) : 1
  const zm = zooms[viewKey] ?? { mode: 'auto' as const, z: 1 }
  const zoom = zm.mode === 'manual' ? zm.z : zm.mode === 'fit' ? fitZ : Math.min(1, fitZ)
  const zoomRef = useRef({ zoom, viewKey })
  zoomRef.current = { zoom, viewKey }
  const setMode = (mode: 'auto' | 'fit' | 'manual', z = 1) => {
    const key = zoomRef.current.viewKey
    setZooms((prev) => ({ ...prev, [key]: { mode, z } }))
  }
  const stepZoom = (dir: 1 | -1) => {
    const z = zoomRef.current.zoom
    const next = dir > 0 ? ZOOMS.find((s) => s > z + 0.001) : [...ZOOMS].reverse().find((s) => s < z - 0.001)
    if (next) setMode('manual', next)
  }
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const onWheel = (event: WheelEvent) => {
      if (!(event.ctrlKey || event.metaKey)) return
      if (!(event.target as Element | null)?.closest?.('[data-paper-scroll]')) return
      event.preventDefault()
      stepZoom(event.deltaY < 0 ? 1 : -1)
    }
    root.addEventListener('wheel', onWheel, { passive: false })
    return () => root.removeEventListener('wheel', onWheel)
    // stepZoom reads the live zoom through zoomRef
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  v.__zoom = zoom
  v.__canIn = zoom < ZOOMS[ZOOMS.length - 1] - 0.001
  v.__canOut = zoom > ZOOMS[0] + 0.001
  v.__zoomIn = () => stepZoom(1)
  v.__zoomOut = () => stepZoom(-1)
  v.__zoomReset = () => setMode('manual', 1)
  v.__zoomFit = () => setMode('fit')

  // reports of this window (made here, not deleted) — for the picker and links
  const gone = (logic.state.gone as Record<string, boolean> | undefined) ?? {}
  const made = ((logic.state.made as ReportRec[] | undefined) ?? []).filter((r) => !gone[r.id])
  // the picker lists every report under its current title (an edited draft shows its new name)
  const edits = (logic.state.ed as Record<string, { title?: string; sub?: string }> | undefined) ?? {}
  const pickerReports = [...made, ...(REPORTS as ReportRec[]).filter((r) => !gone[r.id])].map((r) =>
    edits[r.id] ? { ...r, title: edits[r.id].title || r.title, sub: edits[r.id].sub || r.sub } : r,
  )
  // The reviewer's comment: the reference leaves the field unbound, while its
  // logic already shows `retNote` as the «Возвращён» note — bind the two.
  v.__retNote = logic.state.retNote ?? ''
  v.__onRetNote = (event: ChangeEvent<HTMLTextAreaElement>) => logic.setState({ retNote: event.target.value, noteErr: false })
  v.__go = (href: string, label?: string) => (event: MouseEvent) => {
    event.preventDefault()
    const board = String(href || '').replace(/\.dc\.html$/, '')
    const text = String(label ?? '')
    // «R-11031 · …» → that report: the reference's reports plus the ones made here
    const rid = /R-\d{5}/.exec(text)?.[0]
    const rec = rid ? [...made, ...(REPORTS as ReportRec[])].find((r) => r.no === rid && !gone[r.id]) : undefined
    if (board === 'Reports' || board === 'ReportsReview') {
      if (!rec && board === 'Reports') return
      const st = logic.state
      // from the new-report form: the report opens in its own window, the form stays
      if (st.view === 'new') {
        const self = apps.find((a) => a.id === 'reports')
        const target = rec ?? (REPORTS as ReportRec[]).find((r) => r.id === 'r11034')
        if (self && target) {
          const own = made.find((r) => r.id === target.id)
          openWindow(self, { instanceKey: 'reports:' + target.no, initialParams: { label: target.no, peek: target.id, rec: own } })
        }
        return
      }
      const back = { view: st.view, nav: st.nav, sel: st.sel, rvTab: st.rvTab }
      if (board === 'ReportsReview') logic.setState({ view: 'review', rvTab: 'paper', sel: rec?.id ?? 'r11034', retNote: '', noteErr: false, back })
      // «R-… · бланк PDF» → that report's blank
      else if (rec && /PDF/.test(text)) logic.setState({ view: 'doc', sel: rec.id, back })
      else if (rec) logic.setState({ view: 'list', sel: rec.id })
      return
    }
    const app = apps.find((a) => a.id === BOARD_APP[board])
    if (!app) return
    if (app.id === 'cases') {
      const no = /[A-Z]{2}-\d{4}-\d{4}/.exec(text)?.[0]
      const c = no ? getCases().list.find((x) => x.no === no) : undefined
      if (c) {
        requestOpenCase(c.id)
        openWindow(app, { initialParams: { entityType: 'case', entityId: c.id } })
        return
      }
    }
    if (app.id === 'search') {
      const q = PLATE.exec(text)?.[0] ?? text.split(' · ')[0].trim()
      if (!q) {
        openWindow(app)
        return
      }
      // a window per record (same keys as «Дела» uses), so an already open
      // Поиск doesn't just come to the front and ignore the link
      const recs = SEARCH_DB as unknown as { id: string; title: string; plate?: string }[]
      const hit = recs.find((r) => r.plate === q || r.title === q)
      openWindow(app, { instanceKey: hit ? `rec:${hit.id}` : `q:${q}`, initialParams: { entityId: hit?.id, label: q } })
      return
    }
    openWindow(app)
  }

  return (
    <div
      ref={rootRef}
      onMouseOver={showClippedTitle}
      className="reports-root"
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
      <ReportsShell $v={v} />
      <ReportsPicker $v={v} made={pickerReports} />
    </div>
  )
}
