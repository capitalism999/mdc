import type { PenalCode, Person, Report, Vehicle, Weapon } from '../../../types'
import { EntityChip } from '../shared/EntityChip'
import { BackHeader, EmptyState, Field, SectionCard, StatusPill } from '../shared/ui'
import { BackIcon, VehicleIcon, WeaponIcon } from '../people/icons'
import { CaseIcon, DispatchIcon, EvidenceIcon, ReportIcon } from '../shared/entityIcons'

interface ReportCardProps {
  report: Report
  people: Person[]
  vehicles: Vehicle[]
  weapons: Weapon[]
  penalCodes: PenalCode[]
  onBack: () => void
}

/** Read-only view of a submitted/approved report. Drafts are opened in
 * `ReportEditor` instead (see `ReportsApp`'s view switch). */
export function ReportCard({ report, people, vehicles, weapons, penalCodes, onBack }: ReportCardProps) {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <BackHeader title={report.reportNumber} subtitle={report.title} onBack={onBack} icon={<BackIcon />} />

      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center justify-between">
          <StatusPill status={report.status} positive={report.status === 'Утверждён'} />
        </div>

        <SectionCard title="Рапорт" icon={<ReportIcon />}>
          <div className="flex flex-col gap-1.5">
            <Field label="Номер" value={report.reportNumber} />
            <Field label="Тип" value={report.reportType} />
            <Field label="Дата инцидента" value={report.incidentDate} />
            <Field label="Автор" value={report.authorName} />
            {report.dispatchCallId && (
              <div className="flex items-center justify-between gap-3 text-[13px]">
                <span className="text-ink/40">Вызов</span>
                <EntityChip type="dispatchCall" id={report.dispatchCallId} label={report.dispatchCallId} />
              </div>
            )}
          </div>
        </SectionCard>

        <SectionCard title="Описание" icon={<ReportIcon />}>
          <p className="text-[13px] leading-relaxed text-ink/80">{report.narrative}</p>
        </SectionCard>

        <SectionCard title="Причастные лица" icon={<DispatchIcon />}>
          {report.persons.length === 0 ? (
            <EmptyState label="Лица не указаны" />
          ) : (
            <div className="flex flex-col gap-1.5">
              {report.persons.map((link) => {
                const person = people.find((p) => p.id === link.personId)
                return (
                  <div key={link.personId} className="flex items-center justify-between gap-3 text-[13px]">
                    {person ? (
                      <EntityChip type="person" id={person.id} label={`${person.firstName} ${person.lastName}`} />
                    ) : (
                      <span className="text-ink/90">{link.personId}</span>
                    )}
                    <span className="text-ink/40">{link.role}</span>
                  </div>
                )
              })}
            </div>
          )}
        </SectionCard>

        {report.vehicles.length > 0 && (
          <SectionCard title="Транспорт" icon={<VehicleIcon />}>
            <div className="flex flex-col gap-1.5">
              {report.vehicles.map((link) => {
                const vehicle = vehicles.find((v) => v.id === link.vehicleId)
                return (
                  <div key={link.vehicleId} className="flex items-center justify-between gap-3 text-[13px]">
                    {vehicle ? (
                      <EntityChip type="vehicle" id={vehicle.id} label={`${vehicle.make} ${vehicle.model}`} sublabel={vehicle.plate} />
                    ) : (
                      <span className="text-ink/90">{link.vehicleId}</span>
                    )}
                    <span className="text-ink/40">{link.role}</span>
                  </div>
                )
              })}
            </div>
          </SectionCard>
        )}

        {report.weapons.length > 0 && (
          <SectionCard title="Оружие" icon={<WeaponIcon />}>
            <div className="flex flex-col gap-1.5">
              {report.weapons.map((id) => {
                const weapon = weapons.find((w) => w.id === id)
                return <EntityChip key={id} type="weapon" id={id} label={weapon ? `${weapon.make} ${weapon.model}` : id} sublabel={weapon?.serialNumber} />
              })}
            </div>
          </SectionCard>
        )}

        {report.charges.length > 0 && (
          <SectionCard title="Обвинения" icon={<CaseIcon />}>
            <div className="flex flex-col gap-2">
              {report.charges.map((c, i) => {
                const person = people.find((p) => p.id === c.personId)
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
                    {person && <span className="text-[12px] text-ink/40">{person.firstName} {person.lastName}</span>}
                  </div>
                )
              })}
            </div>
          </SectionCard>
        )}

        {report.evidenceIds.length > 0 && (
          <SectionCard title="Вещественные доказательства" icon={<EvidenceIcon />}>
            <div className="flex flex-col gap-1.5">
              {report.evidenceIds.map((id) => (
                <EntityChip key={id} type="evidence" id={id} label={`Вещдок ${id}`} />
              ))}
            </div>
          </SectionCard>
        )}

        {report.relatedCaseId && (
          <SectionCard title="Связанные записи" icon={<CaseIcon />}>
            <EntityChip type="case" id={report.relatedCaseId} label={`Дело ${report.relatedCaseId}`} />
          </SectionCard>
        )}
      </div>
    </div>
  )
}
