import { useEffect, useState } from 'react'
import type { ModuleContentProps } from '../registry'
import { getEvidence } from '../../../lib/endpoints/evidence'
import { getForensicAnalyses } from '../../../lib/endpoints/forensicAnalyses'
import { getPeople } from '../../../lib/endpoints/people'
import { getWeapons } from '../../../lib/endpoints/weapons'
import type { Evidence, ForensicAnalysis, Person, Weapon } from '../../../types'
import { useWindowManager } from '../../../windows/WindowManagerContext'
import { AnalysisCard } from './AnalysisCard'
import { EvidenceCard } from './EvidenceCard'
import { EvidenceSearch } from './EvidenceSearch'

type View = { kind: 'search' } | { kind: 'evidence'; evidenceId: string } | { kind: 'analysis'; analysisId: string }

function buildBreadcrumb(view: View, evidence: Evidence[], analyses: ForensicAnalysis[]): string[] {
  if (view.kind === 'search') return ['Экспертизы']
  if (view.kind === 'evidence') {
    const item = evidence.find((e) => e.id === view.evidenceId)
    return ['Экспертизы', item ? item.evidenceNumber : view.evidenceId]
  }
  const analysis = analyses.find((a) => a.id === view.analysisId)
  return ['Экспертизы', analysis ? analysis.analysisNumber : view.analysisId]
}

/**
 * "Экспертизы" module: hosts two entity types (evidence + forensic
 * analysis) in the same window family — each `EntityChip` carries its own
 * `entityType` in `initialParams`, so the same app can deep-link into
 * either card.
 */
export function ForensicsApp({ windowId, initialParams }: ModuleContentProps) {
  const { updateBreadcrumb } = useWindowManager()
  const [evidence, setEvidence] = useState<Evidence[]>([])
  const [analyses, setAnalyses] = useState<ForensicAnalysis[]>([])
  const [people, setPeople] = useState<Person[]>([])
  const [weapons, setWeapons] = useState<Weapon[]>([])
  const [view, setView] = useState<View>(() => {
    if (initialParams?.entityType === 'evidence') return { kind: 'evidence', evidenceId: initialParams.entityId as string }
    if (initialParams?.entityType === 'forensicAnalysis') return { kind: 'analysis', analysisId: initialParams.entityId as string }
    return { kind: 'search' }
  })

  useEffect(() => {
    getEvidence().then(setEvidence)
    getForensicAnalyses().then(setAnalyses)
    getPeople().then(setPeople)
    getWeapons().then(setWeapons)
  }, [])

  useEffect(() => {
    updateBreadcrumb(windowId, buildBreadcrumb(view, evidence, analyses))
  }, [windowId, view, evidence, analyses, updateBreadcrumb])

  if (view.kind === 'search') {
    return <EvidenceSearch evidence={evidence} onSelect={(e) => setView({ kind: 'evidence', evidenceId: e.id })} />
  }

  if (view.kind === 'evidence') {
    const item = evidence.find((e) => e.id === view.evidenceId)
    if (!item) return <div className="flex h-full items-center justify-center text-[14px] text-ink/40">Вещдок не найден</div>
    return <EvidenceCard evidence={item} analyses={analyses} onBack={() => setView({ kind: 'search' })} />
  }

  const analysis = analyses.find((a) => a.id === view.analysisId)
  if (!analysis) return <div className="flex h-full items-center justify-center text-[14px] text-ink/40">Экспертиза не найдена</div>
  return <AnalysisCard analysis={analysis} evidence={evidence} people={people} weapons={weapons} onBack={() => setView({ kind: 'search' })} />
}
