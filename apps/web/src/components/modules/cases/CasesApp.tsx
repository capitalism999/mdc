import { useEffect, useState } from 'react'
import type { ModuleContentProps } from '../registry'
import { getBolos } from '../../../lib/endpoints/bolos'
import { getCases } from '../../../lib/endpoints/cases'
import { getEvidence } from '../../../lib/endpoints/evidence'
import { getPeople } from '../../../lib/endpoints/people'
import { getReports } from '../../../lib/endpoints/reports'
import { getVehicles } from '../../../lib/endpoints/vehicles'
import { getWarrants } from '../../../lib/endpoints/warrants'
import { getWeapons } from '../../../lib/endpoints/weapons'
import type { Bolo, CaseFile, Evidence, Person, Report, Vehicle, WarrantFile, Weapon } from '../../../types'
import { useWindowManager } from '../../../windows/WindowManagerContext'
import { CaseBoard } from './CaseBoard'
import { CaseSearch } from './CaseSearch'

type View = { kind: 'search' } | { kind: 'board'; caseId: string }

function buildBreadcrumb(view: View, cases: CaseFile[]): string[] {
  if (view.kind === 'search') return ['Дела']
  const c = cases.find((x) => x.id === view.caseId)
  return ['Дела', c ? c.caseNumber : view.caseId]
}

/**
 * "Дела" module — the central hub. List → `CaseBoard` (tabbed attach-board).
 * Deep-links via `initialParams.entityId` (e.g. `<EntityChip type="case">`
 * from a report/warrant/BOLO/evidence card).
 */
export function CasesApp({ windowId, initialParams }: ModuleContentProps) {
  const { updateBreadcrumb } = useWindowManager()
  const [cases, setCases] = useState<CaseFile[]>([])
  const [people, setPeople] = useState<Person[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [weapons, setWeapons] = useState<Weapon[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [evidence, setEvidence] = useState<Evidence[]>([])
  const [warrants, setWarrants] = useState<WarrantFile[]>([])
  const [bolos, setBolos] = useState<Bolo[]>([])
  const [view, setView] = useState<View>(() => {
    const entityId = initialParams?.entityType === 'case' ? (initialParams.entityId as string) : undefined
    return entityId ? { kind: 'board', caseId: entityId } : { kind: 'search' }
  })

  useEffect(() => {
    getCases().then(setCases)
    getPeople().then(setPeople)
    getVehicles().then(setVehicles)
    getWeapons().then(setWeapons)
    getReports().then(setReports)
    getEvidence().then(setEvidence)
    getWarrants().then(setWarrants)
    getBolos().then(setBolos)
  }, [])

  useEffect(() => {
    updateBreadcrumb(windowId, buildBreadcrumb(view, cases))
  }, [windowId, view, cases, updateBreadcrumb])

  if (view.kind === 'search') {
    return <CaseSearch cases={cases} onSelect={(c) => setView({ kind: 'board', caseId: c.id })} />
  }

  const caseFile = cases.find((c) => c.id === view.caseId)
  if (!caseFile) {
    return <div className="flex h-full items-center justify-center text-[14px] text-ink/40">Дело не найдено</div>
  }

  return (
    <CaseBoard
      caseFile={caseFile}
      people={people}
      vehicles={vehicles}
      weapons={weapons}
      reports={reports}
      evidence={evidence}
      warrants={warrants}
      bolos={bolos}
      onChange={(updated) => setCases((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))}
      onBack={() => setView({ kind: 'search' })}
    />
  )
}
