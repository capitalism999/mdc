import type { ArrestFile, PenalCode, Person } from '../../../types'
import { EntityChip } from '../shared/EntityChip'
import { BackHeader, EmptyState, Field, SectionCard, StatusPill, formatMoney } from '../shared/ui'
import { ArrestIcon, BackIcon, WeaponIcon } from '../people/icons'
import { CaseIcon } from '../shared/entityIcons'

interface ArrestCardProps {
  arrest: ArrestFile
  people: Person[]
  penalCodes: PenalCode[]
  onBack: () => void
}

export function ArrestCard({ arrest, people, penalCodes, onBack }: ArrestCardProps) {
  const arrestee = people.find((p) => p.id === arrest.arresteeId)

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <BackHeader title={arrest.arrestNumber} subtitle={arrest.arrestingOfficer} onBack={onBack} icon={<BackIcon />} />

      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-2">
          <StatusPill status={arrest.status} positive={arrest.status === 'Закрыто'} />
        </div>

        <SectionCard title="Арест" icon={<ArrestIcon />}>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-3 text-[13px]">
              <span className="text-ink/40">Задержанный</span>
              {arrestee ? (
                <EntityChip type="person" id={arrestee.id} label={`${arrestee.firstName} ${arrestee.lastName}`} />
              ) : (
                <span className="text-ink/90">{arrest.arresteeId}</span>
              )}
            </div>
            <Field label="Задержал" value={arrest.arrestingOfficer} />
          </div>
        </SectionCard>

        <SectionCard title="Обвинения" icon={<CaseIcon />}>
          {arrest.charges.length === 0 ? (
            <EmptyState label="Обвинения не указаны" />
          ) : (
            <div className="flex flex-col gap-2">
              {arrest.charges.map((c, i) => {
                const code = penalCodes.find((p) => p.id === c.penalCodeId)
                return (
                  <div key={i} className="rounded-[6px] bg-black/30 p-2.5 text-[13px]">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      {code ? (
                        <EntityChip type="penalCode" id={code.id} label={code.code} sublabel={code.title} />
                      ) : (
                        <span className="text-ink/90">{c.penalCodeId}</span>
                      )}
                      <span className="text-ink/40">×{c.count}</span>
                    </div>
                    <div className="flex items-center justify-between text-[12px] text-ink/40">
                      <span>{formatMoney(c.fineAmount)}</span>
                      <span>{c.jailTime} мес.</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </SectionCard>

        {arrest.seizedWeaponIds.length > 0 && (
          <SectionCard title="Изъятое" icon={<WeaponIcon />}>
            <div className="flex flex-col gap-1.5">
              {arrest.seizedWeaponIds.map((id) => (
                <EntityChip key={id} type="weapon" id={id} label={`Оружие ${id}`} />
              ))}
            </div>
          </SectionCard>
        )}

        {(arrest.relatedReportId || arrest.relatedCaseId || arrest.relatedWarrantId || arrest.relatedBoloId) && (
          <SectionCard title="Связанные записи" icon={<CaseIcon />}>
            <div className="flex flex-col gap-1.5">
              {arrest.relatedWarrantId && <EntityChip type="warrant" id={arrest.relatedWarrantId} label={`Ордер ${arrest.relatedWarrantId}`} />}
              {arrest.relatedReportId && <EntityChip type="report" id={arrest.relatedReportId} label={`Рапорт ${arrest.relatedReportId}`} />}
              {arrest.relatedCaseId && <EntityChip type="case" id={arrest.relatedCaseId} label={`Дело ${arrest.relatedCaseId}`} />}
              {arrest.relatedBoloId && <EntityChip type="bolo" id={arrest.relatedBoloId} label={`BOLO ${arrest.relatedBoloId}`} />}
            </div>
          </SectionCard>
        )}
      </div>
    </div>
  )
}
