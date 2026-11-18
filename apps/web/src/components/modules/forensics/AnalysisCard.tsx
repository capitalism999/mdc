import type { Evidence, ForensicAnalysis, Person, Weapon } from '../../../types'
import { EntityChip } from '../shared/EntityChip'
import { BackHeader, Field, SectionCard, StatusPill } from '../shared/ui'
import { BackIcon } from '../people/icons'
import { ForensicsIcon } from '../shared/entityIcons'

interface AnalysisCardProps {
  analysis: ForensicAnalysis
  evidence: Evidence[]
  people: Person[]
  weapons: Weapon[]
  onBack: () => void
}

/** Lab result card — status + match outcome, with an `<EntityChip>` straight
 * to the matched person/weapon when `matchFound` is true. */
export function AnalysisCard({ analysis, evidence, people, weapons, onBack }: AnalysisCardProps) {
  const sourceEvidence = evidence.find((e) => e.id === analysis.evidenceId)
  const matchedPerson = analysis.matchedPersonId ? people.find((p) => p.id === analysis.matchedPersonId) : undefined
  const matchedWeapon = analysis.matchedWeaponId ? weapons.find((w) => w.id === analysis.matchedWeaponId) : undefined

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <BackHeader title={analysis.analysisNumber} subtitle={analysis.analysisType} onBack={onBack} icon={<BackIcon />} />

      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-2">
          <StatusPill status={analysis.status} positive={analysis.status === 'Завершён'} />
        </div>

        <SectionCard title="Экспертиза" icon={<ForensicsIcon />}>
          <div className="flex flex-col gap-1.5">
            <Field label="Тип" value={analysis.analysisType} />
            <div className="flex items-center justify-between gap-3 text-[13px]">
              <span className="text-ink/40">Вещдок</span>
              {sourceEvidence ? (
                <EntityChip type="evidence" id={sourceEvidence.id} label={sourceEvidence.evidenceNumber} sublabel={sourceEvidence.description} />
              ) : (
                <span className="text-ink/90">{analysis.evidenceId}</span>
              )}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Результат" icon={<ForensicsIcon />}>
          <div className="flex flex-col gap-2">
            <p className="text-[13px] leading-relaxed text-ink/80">{analysis.resultSummary}</p>
            {analysis.matchFound && (
              <div className="flex flex-col gap-1.5 rounded-[6px] bg-[#3fb97f]/10 p-2.5">
                <span className="text-[11px] font-semibold text-[#3fb97f]">Совпадение найдено</span>
                {analysis.matchedPersonId && (
                  <EntityChip
                    type="person"
                    id={analysis.matchedPersonId}
                    label={matchedPerson ? `${matchedPerson.firstName} ${matchedPerson.lastName}` : analysis.matchedPersonId}
                  />
                )}
                {analysis.matchedWeaponId && (
                  <EntityChip
                    type="weapon"
                    id={analysis.matchedWeaponId}
                    label={matchedWeapon ? `${matchedWeapon.make} ${matchedWeapon.model}` : analysis.matchedWeaponId}
                    sublabel={matchedWeapon?.serialNumber}
                  />
                )}
              </div>
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  )
}
