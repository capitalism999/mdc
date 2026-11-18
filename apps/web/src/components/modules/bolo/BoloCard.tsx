import type { Bolo } from '../../../types'
import { EntityChip } from '../shared/EntityChip'
import { BackHeader, Field, SectionCard, StatusPill } from '../shared/ui'
import { BackIcon, WantedIcon } from '../people/icons'

interface BoloCardProps {
  bolo: Bolo
  onBack: () => void
}

export function BoloCard({ bolo, onBack }: BoloCardProps) {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <BackHeader title={bolo.title} subtitle={bolo.boloType} onBack={onBack} icon={<BackIcon />} />

      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-2">
          <StatusPill status={bolo.status} positive={bolo.status === 'Закрыт'} />
          <StatusPill status={`Приоритет: ${bolo.priority}`} positive={bolo.priority === 'Низкий'} />
          <StatusPill status={`Опасность: ${bolo.dangerLevel}`} positive={bolo.dangerLevel === 'Низкий'} />
        </div>

        <SectionCard title="Описание" icon={<WantedIcon />}>
          <div className="flex flex-col gap-1.5">
            <Field label="Последняя локация" value={bolo.lastKnownLocation} />
            <p className="text-[13px] text-ink/80">{bolo.reason}</p>
          </div>
        </SectionCard>

        {(bolo.personId || bolo.vehicleId || bolo.caseId) && (
          <SectionCard title="Связанные записи" icon={<WantedIcon />}>
            <div className="flex flex-col gap-1.5">
              {bolo.personId && <EntityChip type="person" id={bolo.personId} label="Открыть профиль лица" />}
              {bolo.vehicleId && <EntityChip type="vehicle" id={bolo.vehicleId} label="Открыть карточку ТС" />}
              {bolo.caseId && <EntityChip type="case" id={bolo.caseId} label={`Дело ${bolo.caseId}`} />}
            </div>
          </SectionCard>
        )}
      </div>
    </div>
  )
}
