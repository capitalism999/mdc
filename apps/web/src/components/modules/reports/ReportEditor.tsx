import type { PenalCode, Person, Report, Vehicle, Weapon } from '../../../types'
import { EntityChip } from '../shared/EntityChip'
import { AttachPicker } from '../shared/AttachPicker'
import { BackHeader, SectionCard } from '../shared/ui'
import { BackIcon, VehicleIcon, WeaponIcon } from '../people/icons'
import { CaseIcon, DispatchIcon, ReportIcon } from '../shared/entityIcons'

const ROLE_OPTIONS = ['Подозреваемый', 'Потерпевший', 'Свидетель', 'Нарушитель']
const VEHICLE_ROLE_OPTIONS = ['Транспорт подозреваемого', 'Транспорт потерпевшего', 'На месте происшествия']

interface ReportEditorProps {
  report: Report
  people: Person[]
  vehicles: Vehicle[]
  weapons: Weapon[]
  penalCodes: PenalCode[]
  onChange: (updated: Report) => void
  onBack: () => void
}

/**
 * Draft report editor — narrative + composable attachments (persons,
 * vehicles, weapons, charges) via `<AttachPicker>`. State lives in
 * `ReportsApp` (local-only, mirrors the rest of this mock prototype — no
 * write-back endpoint exists yet).
 */
export function ReportEditor({ report, people, vehicles, weapons, penalCodes, onChange, onBack }: ReportEditorProps) {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <BackHeader title={report.reportNumber} subtitle="Черновик" onBack={onBack} icon={<BackIcon />} />

      <div className="flex flex-col gap-3 p-4">
        <SectionCard title="Рапорт" icon={<ReportIcon />}>
          <div className="flex flex-col gap-2">
            <input
              value={report.title}
              onChange={(e) => onChange({ ...report, title: e.target.value })}
              placeholder="Заголовок"
              className="w-full rounded-[6px] bg-ink/5 px-3 py-2 text-[13px] text-ink placeholder:text-ink/30 focus:outline-none"
            />
            {report.dispatchCallId && (
              <div className="flex items-center justify-between gap-3 text-[13px]">
                <span className="text-ink/40">Вызов</span>
                <EntityChip type="dispatchCall" id={report.dispatchCallId} label={report.dispatchCallId} />
              </div>
            )}
          </div>
        </SectionCard>

        <SectionCard title="Описание" icon={<ReportIcon />}>
          <textarea
            value={report.narrative}
            onChange={(e) => onChange({ ...report, narrative: e.target.value })}
            rows={5}
            placeholder="Описание происшествия..."
            className="w-full resize-none rounded-[6px] bg-ink/5 px-3 py-2 text-[13px] text-ink placeholder:text-ink/30 focus:outline-none"
          />
        </SectionCard>

        <SectionCard title="Причастные лица" icon={<DispatchIcon />}>
          <div className="flex flex-col gap-1.5">
            {report.persons.map((link) => {
              const person = people.find((p) => p.id === link.personId)
              return (
                <div key={link.personId} className="flex items-center justify-between gap-2 text-[13px]">
                  {person ? (
                    <EntityChip type="person" id={person.id} label={`${person.firstName} ${person.lastName}`} />
                  ) : (
                    <span className="text-ink/90">{link.personId}</span>
                  )}
                  <select
                    value={link.role}
                    onChange={(e) =>
                      onChange({
                        ...report,
                        persons: report.persons.map((p) => (p.personId === link.personId ? { ...p, role: e.target.value } : p)),
                      })
                    }
                    className="rounded-[4px] bg-ink/5 px-1.5 py-0.5 text-[12px] text-ink/70 focus:outline-none"
                  >
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              )
            })}
            <AttachPicker
              items={people}
              getId={(p) => p.id}
              getLabel={(p) => `${p.firstName} ${p.lastName}`}
              getSublabel={(p) => p.phone}
              excludeIds={report.persons.map((p) => p.personId)}
              placeholder="Поиск человека..."
              onAttach={(p) => onChange({ ...report, persons: [...report.persons, { personId: p.id, role: ROLE_OPTIONS[0] }] })}
            />
          </div>
        </SectionCard>

        <SectionCard title="Транспорт" icon={<VehicleIcon />}>
          <div className="flex flex-col gap-1.5">
            {report.vehicles.map((link) => {
              const vehicle = vehicles.find((v) => v.id === link.vehicleId)
              return (
                <div key={link.vehicleId} className="flex items-center justify-between gap-2 text-[13px]">
                  {vehicle ? (
                    <EntityChip type="vehicle" id={vehicle.id} label={`${vehicle.make} ${vehicle.model}`} sublabel={vehicle.plate} />
                  ) : (
                    <span className="text-ink/90">{link.vehicleId}</span>
                  )}
                  <select
                    value={link.role}
                    onChange={(e) =>
                      onChange({
                        ...report,
                        vehicles: report.vehicles.map((v) => (v.vehicleId === link.vehicleId ? { ...v, role: e.target.value } : v)),
                      })
                    }
                    className="rounded-[4px] bg-ink/5 px-1.5 py-0.5 text-[12px] text-ink/70 focus:outline-none"
                  >
                    {VEHICLE_ROLE_OPTIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              )
            })}
            <AttachPicker
              items={vehicles}
              getId={(v) => v.id}
              getLabel={(v) => `${v.make} ${v.model}`}
              getSublabel={(v) => v.plate}
              excludeIds={report.vehicles.map((v) => v.vehicleId)}
              placeholder="Поиск по гос. номеру или модели..."
              onAttach={(v) => onChange({ ...report, vehicles: [...report.vehicles, { vehicleId: v.id, role: VEHICLE_ROLE_OPTIONS[0] }] })}
            />
          </div>
        </SectionCard>

        <SectionCard title="Оружие" icon={<WeaponIcon />}>
          <div className="flex flex-col gap-1.5">
            {report.weapons.map((id) => {
              const weapon = weapons.find((w) => w.id === id)
              return <EntityChip key={id} type="weapon" id={id} label={weapon ? `${weapon.make} ${weapon.model}` : id} sublabel={weapon?.serialNumber} />
            })}
            <AttachPicker
              items={weapons}
              getId={(w) => w.id}
              getLabel={(w) => `${w.make} ${w.model}`}
              getSublabel={(w) => w.serialNumber}
              excludeIds={report.weapons}
              placeholder="Поиск по серийному номеру..."
              onAttach={(w) => onChange({ ...report, weapons: [...report.weapons, w.id] })}
            />
          </div>
        </SectionCard>

        <SectionCard title="Обвинения" icon={<CaseIcon />}>
          <div className="flex flex-col gap-2">
            {report.charges.map((c, i) => {
              const code = penalCodes.find((p) => p.id === c.penalCodeId)
              return (
                <div key={i} className="flex items-center justify-between gap-2 rounded-[6px] bg-black/30 p-2 text-[13px]">
                  {code ? (
                    <EntityChip type="penalCode" id={code.id} label={code.code} sublabel={code.title} />
                  ) : (
                    <span className="text-ink/90">{c.penalCodeId}</span>
                  )}
                  <button
                    type="button"
                    onClick={() => onChange({ ...report, charges: report.charges.filter((_, idx) => idx !== i) })}
                    className="text-[11px] text-ink/40 hover:text-[#ff8ba0]"
                  >
                    Убрать
                  </button>
                </div>
              )
            })}
            <AttachPicker
              items={penalCodes}
              getId={(p) => p.id}
              getLabel={(p) => p.code}
              getSublabel={(p) => p.title}
              excludeIds={report.charges.map((c) => c.penalCodeId)}
              placeholder="Поиск статьи..."
              onAttach={(p) =>
                onChange({
                  ...report,
                  charges: [...report.charges, { personId: report.persons[0]?.personId ?? '', penalCodeId: p.id, count: 1 }],
                })
              }
            />
          </div>
        </SectionCard>

        <div className="flex items-center gap-2">
          <select
            value={report.status}
            onChange={(e) => onChange({ ...report, status: e.target.value as Report['status'] })}
            className="flex-1 rounded-[6px] bg-ink/5 px-3 py-2 text-[13px] text-ink focus:outline-none"
          >
            <option value="Черновик">Черновик</option>
            <option value="Отправлен">Отправить</option>
          </select>
        </div>
      </div>
    </div>
  )
}
