import { useReducer, useRef, type ChangeEvent, type MouseEvent } from 'react'
import { apps } from '../../../data/apps'
import { useWindowManager } from '../../../windows/WindowManagerContext'
import { getCases, requestOpenCase } from '../cases/casesStore'
import type { ModuleContentProps } from '../registry'
import { ReportsShell } from './ReportsShell'
import { REPORTS, ReportsLogic } from './reportsLogic'
import type { ReportsVals } from './reportsRuntime'
import './reports.css'

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

const PLATE = /\b\d{1,2}[A-Z]{3}\d{3}\b/

/**
 * Отчёты — a literal port of the reference component: `reportsLogic.ts`
 * holds its data and render logic verbatim, the generated `Reports*.tsx`
 * files hold its markup. This shell only hosts the logic instance and routes
 * the reference's board links: report links stay in this window, the rest
 * open the module window that owns the record.
 */
export function ReportsApp(_props: ModuleContentProps) {
  const { openWindow } = useWindowManager()
  const [, rerender] = useReducer((n: number) => n + 1, 0)
  const logicRef = useRef<ReportsLogicApi | null>(null)

  if (!logicRef.current) {
    const logic = new ReportsLogic({}) as unknown as ReportsLogicApi
    logic.__onChange = rerender
    logicRef.current = logic
  }
  const logic = logicRef.current

  const v = logic.renderVals()
  // The reviewer's comment: the reference leaves the field unbound, while its
  // logic already shows `retNote` as the «Возвращён» note — bind the two.
  v.__retNote = logic.state.retNote ?? ''
  v.__onRetNote = (event: ChangeEvent<HTMLTextAreaElement>) => logic.setState({ retNote: event.target.value })
  v.__go =(href: string, label?: string) => (event: MouseEvent) => {
    event.preventDefault()
    const board = String(href || '').replace(/\.dc\.html$/, '')
    const text = String(label ?? '')
    // «R-11031 · …» → that report, in this window
    const rid = /R-\d{5}/.exec(text)?.[0]
    const rec = rid ? (REPORTS as { id: string; no: string }[]).find((r) => r.no === rid) : undefined
    if (board === 'Reports' || board === 'ReportsReview') {
      if (board === 'ReportsReview') logic.setState({ view: 'review', rvTab: 'paper', sel: rec?.id ?? 'r11034' })
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
      openWindow(app, q ? { initialParams: { label: q } } : undefined)
      return
    }
    openWindow(app)
  }

  return (
    <div
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
    </div>
  )
}
