import { useEffect, useState } from 'react'
import type { ModuleContentProps } from '../registry'
import { getPenalCodes } from '../../../lib/endpoints/penalCodes'
import { getPeople } from '../../../lib/endpoints/people'
import { getReports } from '../../../lib/endpoints/reports'
import { getVehicles } from '../../../lib/endpoints/vehicles'
import { getWeapons } from '../../../lib/endpoints/weapons'
import type { PenalCode, Person, Report, Vehicle, Weapon } from '../../../types'
import { useWindowManager } from '../../../windows/WindowManagerContext'
import { ReportCard } from './ReportCard'
import { ReportEditor } from './ReportEditor'
import { ReportSearch } from './ReportSearch'

type View = { kind: 'search' } | { kind: 'detail'; reportId: string }

let draftCounter = 0

function createDraft(dispatchCallId: string): Report {
  draftCounter += 1
  return {
    id: `draft-${Date.now()}-${draftCounter}`,
    reportNumber: `R-2026-DRAFT-${draftCounter}`,
    title: 'Новый рапорт',
    reportType: 'Инцидент',
    narrative: '',
    status: 'Черновик',
    authorName: 'Текущий офицер',
    incidentDate: new Date().toLocaleDateString('ru-RU'),
    dispatchCallId,
    persons: [],
    vehicles: [],
    weapons: [],
    charges: [],
    evidenceIds: [],
  }
}

function buildBreadcrumb(view: View, reports: Report[]): string[] {
  if (view.kind === 'search') return ['Рапорты']
  const report = reports.find((r) => r.id === view.reportId)
  return ['Рапорты', report ? report.reportNumber : view.reportId]
}

/**
 * "Рапорты" module: journal of reports → editor (drafts) or read-only card
 * (submitted/approved). Deep-links via `initialParams.entityId` (existing
 * report) or `initialParams.dispatchCallId` (creates a brand-new draft —
 * the payoff of the "Создать рапорт" action on a CAD call card).
 */
export function ReportsApp({ windowId, initialParams }: ModuleContentProps) {
  const { updateBreadcrumb } = useWindowManager()
  const [reports, setReports] = useState<Report[]>([])
  const [people, setPeople] = useState<Person[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [weapons, setWeapons] = useState<Weapon[]>([])
  const [penalCodes, setPenalCodes] = useState<PenalCode[]>([])
  const [view, setView] = useState<View>(() => {
    const entityId = initialParams?.entityType === 'report' ? (initialParams.entityId as string) : undefined
    return entityId ? { kind: 'detail', reportId: entityId } : { kind: 'search' }
  })
  const [pendingDispatchCallId] = useState<string | undefined>(
    () => (initialParams?.entityType === undefined && initialParams?.dispatchCallId ? (initialParams.dispatchCallId as string) : undefined),
  )

  useEffect(() => {
    getReports().then(setReports)
    getPeople().then(setPeople)
    getVehicles().then(setVehicles)
    getWeapons().then(setWeapons)
    getPenalCodes().then(setPenalCodes)
  }, [])

  useEffect(() => {
    if (!pendingDispatchCallId) return
    const draft = createDraft(pendingDispatchCallId)
    setReports((prev) => [draft, ...prev])
    setView({ kind: 'detail', reportId: draft.id })
    // Runs once: consumes the one-shot `initialParams.dispatchCallId` signal.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    updateBreadcrumb(windowId, buildBreadcrumb(view, reports))
  }, [windowId, view, reports, updateBreadcrumb])

  if (view.kind === 'search') {
    return <ReportSearch reports={reports} onSelect={(r) => setView({ kind: 'detail', reportId: r.id })} />
  }

  const report = reports.find((r) => r.id === view.reportId)
  if (!report) {
    return <div className="flex h-full items-center justify-center text-[14px] text-ink/40">Рапорт не найден</div>
  }

  function updateReport(updated: Report) {
    setReports((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
  }

  if (report.status === 'Черновик') {
    return (
      <ReportEditor
        report={report}
        people={people}
        vehicles={vehicles}
        weapons={weapons}
        penalCodes={penalCodes}
        onChange={updateReport}
        onBack={() => setView({ kind: 'search' })}
      />
    )
  }

  return (
    <ReportCard
      report={report}
      people={people}
      vehicles={vehicles}
      weapons={weapons}
      penalCodes={penalCodes}
      onBack={() => setView({ kind: 'search' })}
    />
  )
}
