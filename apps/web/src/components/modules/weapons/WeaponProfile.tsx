import type { Weapon } from '../../../types'
import { EntityChip } from '../shared/EntityChip'
import { BackHeader, Field, SectionCard, StatusPill } from '../shared/ui'
import { BackIcon, DocumentIcon, WeaponIcon } from '../people/icons'

interface WeaponProfileProps {
  weapon: Weapon
  onBack: () => void
}

export function WeaponProfile({ weapon, onBack }: WeaponProfileProps) {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <BackHeader title={`${weapon.make} ${weapon.model}`} subtitle={`№ ${weapon.serialNumber}`} onBack={onBack} icon={<BackIcon />} />

      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-2">
          {weapon.stolenFlag && <StatusPill status="В угоне" positive={false} />}
          {weapon.seizedFlag && <StatusPill status="Изъято" positive={false} />}
          <StatusPill status={weapon.registrationStatus} positive={weapon.registrationStatus === 'Зарегистрировано'} />
        </div>

        <SectionCard title="Оружие" icon={<WeaponIcon />}>
          <div className="flex flex-col gap-1.5">
            <Field label="Тип" value={weapon.weaponType} />
            <Field label="Производитель" value={weapon.make} />
            <Field label="Модель" value={weapon.model} />
            <Field label="Калибр" value={weapon.caliber} />
            <Field label="Серийный номер" value={weapon.serialNumber} />
          </div>
        </SectionCard>

        <SectionCard title="Регистрация" icon={<DocumentIcon />}>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-3 text-[13px]">
              <span className="text-ink/40">Владелец</span>
              {weapon.registeredOwnerId ? (
                <EntityChip type="person" id={weapon.registeredOwnerId} label={weapon.registeredOwnerName} />
              ) : (
                <span className="text-ink/90">{weapon.registeredOwnerName}</span>
              )}
            </div>
            <Field label="Статус регистрации" value={weapon.registrationStatus} />
            {weapon.seizedInArrestId && (
              <div className="flex items-center justify-between gap-3 text-[13px]">
                <span className="text-ink/40">Изъято при аресте</span>
                <EntityChip type="arrest" id={weapon.seizedInArrestId} label={weapon.seizedInArrestId} />
              </div>
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  )
}
