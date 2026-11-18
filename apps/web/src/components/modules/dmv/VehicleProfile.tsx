import type { Vehicle } from '../../../types'
import { EntityChip } from '../shared/EntityChip'
import { BackHeader, Field, SectionCard, StatusPill } from '../shared/ui'
import { BackIcon, DocumentIcon, VehicleIcon } from '../people/icons'

interface VehicleProfileProps {
  vehicle: Vehicle
  onBack: () => void
}

export function VehicleProfile({ vehicle, onBack }: VehicleProfileProps) {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <BackHeader title={`${vehicle.make} ${vehicle.model}`} subtitle={`Гос. номер ${vehicle.plate}`} onBack={onBack} icon={<BackIcon />} />

      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-2">
          {vehicle.stolenFlag && <StatusPill status="В угоне" positive={false} />}
          {vehicle.impoundFlag && <StatusPill status="На штрафстоянке" positive={false} />}
          <StatusPill status={vehicle.registrationStatus} positive={vehicle.registrationStatus === 'Зарегистрирован'} />
        </div>

        <SectionCard title="Транспортное средство" icon={<VehicleIcon />}>
          <div className="flex flex-col gap-1.5">
            <Field label="Марка" value={vehicle.make} />
            <Field label="Модель" value={vehicle.model} />
            <Field label="Год выпуска" value={String(vehicle.year)} />
            <Field label="Цвет" value={vehicle.color} />
            <Field label="Класс" value={vehicle.vehicleClass} />
            <Field label="VIN" value={vehicle.vin} />
            <Field label="Гос. номер" value={vehicle.plate} />
          </div>
        </SectionCard>

        <SectionCard title="Регистрация" icon={<DocumentIcon />}>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-3 text-[13px]">
              <span className="text-ink/40">Владелец</span>
              {vehicle.ownerId ? (
                <EntityChip type="person" id={vehicle.ownerId} label={vehicle.ownerName} />
              ) : (
                <span className="text-ink/90">{vehicle.ownerName}</span>
              )}
            </div>
            <Field label="Статус регистрации" value={vehicle.registrationStatus} />
            <Field label="Страховка" value={vehicle.insuranceStatus} />
          </div>
        </SectionCard>
      </div>
    </div>
  )
}
