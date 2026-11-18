import type { DispatchCall, Person, Vehicle } from '../../../types'
import { EntityChip } from '../shared/EntityChip'
import { BackHeader, Field, SectionCard, StatusPill } from '../shared/ui'
import { BackIcon } from '../people/icons'
import { DispatchIcon, ReportIcon, CaseIcon } from '../shared/entityIcons'
import { apps } from '../../../data/apps'
import { useWindowManager } from '../../../windows/WindowManagerContext'

const PRIORITY_CLASS: Record<DispatchCall['priority'], string> = {
  Высокий: 'bg-[#e8637a]/20 text-[#ff8ba0]',
  Средний: 'bg-[#e0a63f]/20 text-[#e0a63f]',
  Низкий: 'bg-ink/10 text-ink/50',
}

interface CallCardProps {
  call: DispatchCall
  people: Person[]
  vehicles: Vehicle[]
  onBack: () => void
}

/**
 * "Вызовы" detail card. "Создать рапорт" opens the Рапорты module directly
 * (via `openWindow`, not `useEntityNavigation` — this creates a new record
 * rather than navigating to an existing entity) with
 * `initialParams: { dispatchCallId }` to pre-fill the new report.
 */
export function CallCard({ call, people, vehicles, onBack }: CallCardProps) {
  const { openWindow } = useWindowManager()
  const relatedPerson = call.relatedPersonId ? people.find((p) => p.id === call.relatedPersonId) : undefined
  const relatedVehicle = call.relatedVehiclePlate ? vehicles.find((v) => v.plate === call.relatedVehiclePlate) : undefined

  function handleCreateReport() {
    const reportsApp = apps.find((a) => a.id === 'reports')
    if (!reportsApp) return
    openWindow(reportsApp, { initialParams: { dispatchCallId: call.id } })
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <BackHeader title={call.callNumber} subtitle={call.natureCode} onBack={onBack} icon={<BackIcon />} />

      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${PRIORITY_CLASS[call.priority]}`}>{call.priority}</span>
          <StatusPill status={call.status} positive={call.status === 'Завершён'} />
        </div>

        <SectionCard title="Вызов" icon={<DispatchIcon />}>
          <div className="flex flex-col gap-1.5">
            <Field label="Номер" value={call.callNumber} />
            <Field label="Характер" value={call.natureCode} />
            <Field label="Адрес" value={call.locationStreet} />
            <Field label="Заявитель" value={call.callerName} />
          </div>
        </SectionCard>

        {(relatedPerson || call.relatedVehiclePlate) && (
          <SectionCard title="Связанные записи" icon={<CaseIcon />}>
            <div className="flex flex-col gap-1.5">
              {relatedPerson && (
                <EntityChip type="person" id={relatedPerson.id} label={`${relatedPerson.firstName} ${relatedPerson.lastName}`} />
              )}
              {call.relatedVehiclePlate &&
                (relatedVehicle ? (
                  <EntityChip type="vehicle" id={relatedVehicle.id} label={`${relatedVehicle.make} ${relatedVehicle.model}`} sublabel={relatedVehicle.plate} />
                ) : (
                  <span className="text-[13px] text-ink/60">{call.relatedVehiclePlate}</span>
                ))}
            </div>
          </SectionCard>
        )}

        {(call.linkedReportId || call.linkedCaseId) && (
          <SectionCard title="Оформлено" icon={<ReportIcon />}>
            <div className="flex flex-col gap-1.5">
              {call.linkedReportId && <EntityChip type="report" id={call.linkedReportId} label={`Рапорт ${call.linkedReportId}`} />}
              {call.linkedCaseId && <EntityChip type="case" id={call.linkedCaseId} label={`Дело ${call.linkedCaseId}`} />}
            </div>
          </SectionCard>
        )}

        {!call.linkedReportId && (
          <button
            type="button"
            onClick={handleCreateReport}
            className="flex items-center justify-center gap-2 rounded-[8px] bg-[#48adec] px-4 py-2.5 text-[13px] font-semibold text-black transition-colors hover:bg-[#5fbaf0]"
          >
            <ReportIcon />
            Создать рапорт
          </button>
        )}
      </div>
    </div>
  )
}
