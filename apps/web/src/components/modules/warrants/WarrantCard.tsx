import type { PenalCode, Person, WarrantFile } from '../../../types'
import { EntityChip } from '../shared/EntityChip'
import { BackHeader, EmptyState, Field, SectionCard, StatusPill } from '../shared/ui'
import { BackIcon, WarrantIcon } from '../people/icons'
import { CaseIcon } from '../shared/entityIcons'

interface WarrantCardProps {
  warrant: WarrantFile
  people: Person[]
  penalCodes: PenalCode[]
  onBack: () => void
}

export function WarrantCard({ warrant, people, penalCodes, onBack }: WarrantCardProps) {
  const subject = people.find((p) => p.id === warrant.subjectPersonId)

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <BackHeader title={warrant.warrantNumber} subtitle={warrant.warrantType} onBack={onBack} icon={<BackIcon />} />

      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-2">
          <StatusPill status={warrant.status} positive={warrant.status !== 'Активен'} />
        </div>

        <SectionCard title="Ордер" icon={<WarrantIcon />}>
          <div className="flex flex-col gap-1.5">
            <Field label="Номер" value={warrant.warrantNumber} />
            <Field label="Тип" value={warrant.warrantType} />
            <Field label="Судья" value={warrant.issuingJudge} />
            <div className="flex items-center justify-between gap-3 text-[13px]">
              <span className="text-ink/40">Субъект</span>
              {subject ? (
                <EntityChip type="person" id={subject.id} label={`${subject.firstName} ${subject.lastName}`} />
              ) : (
                <span className="text-ink/90">{warrant.subjectPersonId}</span>
              )}
            </div>
            <Field label="Причина" value={warrant.reason} />
          </div>
        </SectionCard>

        <SectionCard title="Обвинения" icon={<CaseIcon />}>
          {warrant.charges.length === 0 ? (
            <EmptyState label="Обвинения не указаны" />
          ) : (
            <div className="flex flex-col gap-1.5">
              {warrant.charges.map((c, i) => {
                const code = penalCodes.find((p) => p.id === c.penalCodeId)
                return (
                  <div key={i} className="flex items-center justify-between gap-3 text-[13px]">
                    {code ? (
                      <EntityChip type="penalCode" id={code.id} label={code.code} sublabel={code.title} />
                    ) : (
                      <span className="text-ink/90">{c.penalCodeId}</span>
                    )}
                    <span className="text-ink/40">×{c.count}</span>
                  </div>
                )
              })}
            </div>
          )}
        </SectionCard>

        {(warrant.relatedCaseId || warrant.relatedArrestId) && (
          <SectionCard title="Связанные записи" icon={<CaseIcon />}>
            <div className="flex flex-col gap-1.5">
              {warrant.relatedCaseId && <EntityChip type="case" id={warrant.relatedCaseId} label={`Дело ${warrant.relatedCaseId}`} />}
              {warrant.relatedArrestId && <EntityChip type="arrest" id={warrant.relatedArrestId} label={`Арест ${warrant.relatedArrestId}`} />}
            </div>
          </SectionCard>
        )}
      </div>
    </div>
  )
}
