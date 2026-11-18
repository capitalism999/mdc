import { useState } from 'react'
import type { Bolo, CaseFile, Evidence, Person, Report, Vehicle, WarrantFile, Weapon } from '../../../types'
import { EntityChip } from '../shared/EntityChip'
import { AttachPicker } from '../shared/AttachPicker'
import { BackHeader, EmptyState, Field, SectionCard, StatusPill } from '../shared/ui'
import { BackIcon, VehicleIcon, WantedIcon, WarrantIcon, WeaponIcon } from '../people/icons'
import { CaseIcon, EvidenceIcon, ReportIcon } from '../shared/entityIcons'

const PERSON_ROLE_OPTIONS = ['Подозреваемый', 'Потерпевший', 'Свидетель']
const VEHICLE_ROLE_OPTIONS = ['Транспорт побега', 'На месте происшествия']
const WEAPON_ROLE_OPTIONS = ['Орудие преступления', 'Изъято']

type Tab = 'overview' | 'persons' | 'vehicles' | 'weapons' | 'reports' | 'evidence' | 'warrants' | 'bolos' | 'locations'

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Обзор' },
  { id: 'persons', label: 'Люди' },
  { id: 'vehicles', label: 'ТС' },
  { id: 'weapons', label: 'Оружие' },
  { id: 'reports', label: 'Рапорты' },
  { id: 'evidence', label: 'Вещдоки' },
  { id: 'warrants', label: 'Ордера' },
  { id: 'bolos', label: 'BOLO' },
  { id: 'locations', label: 'Локации' },
]

interface CaseBoardProps {
  caseFile: CaseFile
  people: Person[]
  vehicles: Vehicle[]
  weapons: Weapon[]
  reports: Report[]
  evidence: Evidence[]
  warrants: WarrantFile[]
  bolos: Bolo[]
  onChange: (updated: CaseFile) => void
  onBack: () => void
}

/**
 * The central hub screen: tabbed board over every cross-reference a case
 * can hold. Each list tab is a set of `<EntityChip>` rows + `<AttachPicker>`
 * — the direct implementation of "вкладывать людей, места и т.п.".
 */
export function CaseBoard({ caseFile: c, people, vehicles, weapons, reports, evidence, warrants, bolos, onChange, onBack }: CaseBoardProps) {
  const [tab, setTab] = useState<Tab>('overview')

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <BackHeader title={c.caseNumber} subtitle={c.title} onBack={onBack} icon={<BackIcon />} />

      <div className="flex gap-1.5 overflow-x-auto px-4 pb-1 pt-3">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`shrink-0 rounded-[6px] px-3 py-1.5 text-[12px] font-medium transition-colors ${
              tab === t.id ? 'bg-[#48adec] text-black' : 'bg-ink/5 text-ink/50 hover:text-ink/80'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 p-4">
        {tab === 'overview' && (
          <>
            <div className="flex items-center gap-2">
              <StatusPill status={c.status} positive={c.status === 'Закрыто'} />
            </div>
            <SectionCard title="Дело" icon={<CaseIcon />}>
              <div className="flex flex-col gap-1.5">
                <Field label="Номер" value={c.caseNumber} />
                <Field label="Тип" value={c.caseType} />
                <Field label="Ведущий офицер" value={c.leadOfficerName} />
                <Field label="Людей" value={String(c.persons.length)} />
                <Field label="ТС" value={String(c.vehicles.length)} />
                <Field label="Рапортов" value={String(c.reportIds.length)} />
                <Field label="Вещдоков" value={String(c.evidenceIds.length)} />
              </div>
            </SectionCard>
          </>
        )}

        {tab === 'persons' && (
          <SectionCard title="Причастные лица" icon={<WantedIcon />}>
            <div className="flex flex-col gap-1.5">
              {c.persons.length === 0 && <EmptyState label="Лица не прикреплены" />}
              {c.persons.map((link) => {
                const person = people.find((p) => p.id === link.personId)
                return (
                  <div key={link.personId} className="flex items-center justify-between gap-2 text-[13px]">
                    {person ? (
                      <EntityChip type="person" id={person.id} label={`${person.firstName} ${person.lastName}`} />
                    ) : (
                      <span className="text-ink/90">{link.personId}</span>
                    )}
                    <div className="flex items-center gap-2">
                      <select
                        value={link.role}
                        onChange={(e) =>
                          onChange({ ...c, persons: c.persons.map((p) => (p.personId === link.personId ? { ...p, role: e.target.value } : p)) })
                        }
                        className="rounded-[4px] bg-ink/5 px-1.5 py-0.5 text-[12px] text-ink/70 focus:outline-none"
                      >
                        {PERSON_ROLE_OPTIONS.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => onChange({ ...c, persons: c.persons.filter((p) => p.personId !== link.personId) })}
                        className="text-[11px] text-ink/40 hover:text-[#ff8ba0]"
                      >
                        Убрать
                      </button>
                    </div>
                  </div>
                )
              })}
              <AttachPicker
                items={people}
                getId={(p) => p.id}
                getLabel={(p) => `${p.firstName} ${p.lastName}`}
                getSublabel={(p) => p.phone}
                excludeIds={c.persons.map((p) => p.personId)}
                placeholder="Поиск человека..."
                onAttach={(p) => onChange({ ...c, persons: [...c.persons, { personId: p.id, role: PERSON_ROLE_OPTIONS[0] }] })}
              />
            </div>
          </SectionCard>
        )}

        {tab === 'vehicles' && (
          <SectionCard title="Транспорт" icon={<VehicleIcon />}>
            <div className="flex flex-col gap-1.5">
              {c.vehicles.length === 0 && <EmptyState label="ТС не прикреплены" />}
              {c.vehicles.map((link) => {
                const vehicle = vehicles.find((v) => v.id === link.vehicleId)
                return (
                  <div key={link.vehicleId} className="flex items-center justify-between gap-2 text-[13px]">
                    {vehicle ? (
                      <EntityChip type="vehicle" id={vehicle.id} label={`${vehicle.make} ${vehicle.model}`} sublabel={vehicle.plate} />
                    ) : (
                      <span className="text-ink/90">{link.vehicleId}</span>
                    )}
                    <div className="flex items-center gap-2">
                      <select
                        value={link.role}
                        onChange={(e) =>
                          onChange({ ...c, vehicles: c.vehicles.map((v) => (v.vehicleId === link.vehicleId ? { ...v, role: e.target.value } : v)) })
                        }
                        className="rounded-[4px] bg-ink/5 px-1.5 py-0.5 text-[12px] text-ink/70 focus:outline-none"
                      >
                        {VEHICLE_ROLE_OPTIONS.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => onChange({ ...c, vehicles: c.vehicles.filter((v) => v.vehicleId !== link.vehicleId) })}
                        className="text-[11px] text-ink/40 hover:text-[#ff8ba0]"
                      >
                        Убрать
                      </button>
                    </div>
                  </div>
                )
              })}
              <AttachPicker
                items={vehicles}
                getId={(v) => v.id}
                getLabel={(v) => `${v.make} ${v.model}`}
                getSublabel={(v) => v.plate}
                excludeIds={c.vehicles.map((v) => v.vehicleId)}
                placeholder="Поиск по гос. номеру или модели..."
                onAttach={(v) => onChange({ ...c, vehicles: [...c.vehicles, { vehicleId: v.id, role: VEHICLE_ROLE_OPTIONS[0] }] })}
              />
            </div>
          </SectionCard>
        )}

        {tab === 'weapons' && (
          <SectionCard title="Оружие" icon={<WeaponIcon />}>
            <div className="flex flex-col gap-1.5">
              {c.weapons.length === 0 && <EmptyState label="Оружие не прикреплено" />}
              {c.weapons.map((link) => {
                const weapon = weapons.find((w) => w.id === link.weaponId)
                return (
                  <div key={link.weaponId} className="flex items-center justify-between gap-2 text-[13px]">
                    {weapon ? (
                      <EntityChip type="weapon" id={weapon.id} label={`${weapon.make} ${weapon.model}`} sublabel={weapon.serialNumber} />
                    ) : (
                      <span className="text-ink/90">{link.weaponId}</span>
                    )}
                    <div className="flex items-center gap-2">
                      <select
                        value={link.role}
                        onChange={(e) =>
                          onChange({ ...c, weapons: c.weapons.map((w) => (w.weaponId === link.weaponId ? { ...w, role: e.target.value } : w)) })
                        }
                        className="rounded-[4px] bg-ink/5 px-1.5 py-0.5 text-[12px] text-ink/70 focus:outline-none"
                      >
                        {WEAPON_ROLE_OPTIONS.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => onChange({ ...c, weapons: c.weapons.filter((w) => w.weaponId !== link.weaponId) })}
                        className="text-[11px] text-ink/40 hover:text-[#ff8ba0]"
                      >
                        Убрать
                      </button>
                    </div>
                  </div>
                )
              })}
              <AttachPicker
                items={weapons}
                getId={(w) => w.id}
                getLabel={(w) => `${w.make} ${w.model}`}
                getSublabel={(w) => w.serialNumber}
                excludeIds={c.weapons.map((w) => w.weaponId)}
                placeholder="Поиск по серийному номеру..."
                onAttach={(w) => onChange({ ...c, weapons: [...c.weapons, { weaponId: w.id, role: WEAPON_ROLE_OPTIONS[0] }] })}
              />
            </div>
          </SectionCard>
        )}

        {tab === 'reports' && (
          <SectionCard title="Рапорты" icon={<ReportIcon />}>
            <div className="flex flex-col gap-1.5">
              {c.reportIds.length === 0 && <EmptyState label="Рапорты не прикреплены" />}
              {c.reportIds.map((id) => {
                const report = reports.find((r) => r.id === id)
                return (
                  <div key={id} className="flex items-center justify-between gap-2 text-[13px]">
                    <EntityChip type="report" id={id} label={report ? report.reportNumber : id} sublabel={report?.title} />
                    <button
                      type="button"
                      onClick={() => onChange({ ...c, reportIds: c.reportIds.filter((r) => r !== id) })}
                      className="text-[11px] text-ink/40 hover:text-[#ff8ba0]"
                    >
                      Убрать
                    </button>
                  </div>
                )
              })}
              <AttachPicker
                items={reports}
                getId={(r) => r.id}
                getLabel={(r) => r.reportNumber}
                getSublabel={(r) => r.title}
                excludeIds={c.reportIds}
                placeholder="Поиск рапорта..."
                onAttach={(r) => onChange({ ...c, reportIds: [...c.reportIds, r.id] })}
              />
            </div>
          </SectionCard>
        )}

        {tab === 'evidence' && (
          <SectionCard title="Вещественные доказательства" icon={<EvidenceIcon />}>
            <div className="flex flex-col gap-1.5">
              {c.evidenceIds.length === 0 && <EmptyState label="Вещдоки не прикреплены" />}
              {c.evidenceIds.map((id) => {
                const item = evidence.find((e) => e.id === id)
                return (
                  <div key={id} className="flex items-center justify-between gap-2 text-[13px]">
                    <EntityChip type="evidence" id={id} label={item ? item.evidenceNumber : id} sublabel={item?.description} />
                    <button
                      type="button"
                      onClick={() => onChange({ ...c, evidenceIds: c.evidenceIds.filter((e) => e !== id) })}
                      className="text-[11px] text-ink/40 hover:text-[#ff8ba0]"
                    >
                      Убрать
                    </button>
                  </div>
                )
              })}
              <AttachPicker
                items={evidence}
                getId={(e) => e.id}
                getLabel={(e) => e.evidenceNumber}
                getSublabel={(e) => e.description}
                excludeIds={c.evidenceIds}
                placeholder="Поиск вещдока..."
                onAttach={(e) => onChange({ ...c, evidenceIds: [...c.evidenceIds, e.id] })}
              />
            </div>
          </SectionCard>
        )}

        {tab === 'warrants' && (
          <SectionCard title="Ордера" icon={<WarrantIcon />}>
            <div className="flex flex-col gap-1.5">
              {c.warrantIds.length === 0 && <EmptyState label="Ордера не прикреплены" />}
              {c.warrantIds.map((id) => {
                const warrant = warrants.find((w) => w.id === id)
                return (
                  <div key={id} className="flex items-center justify-between gap-2 text-[13px]">
                    <EntityChip type="warrant" id={id} label={warrant ? warrant.warrantNumber : id} sublabel={warrant?.warrantType} />
                    <button
                      type="button"
                      onClick={() => onChange({ ...c, warrantIds: c.warrantIds.filter((w) => w !== id) })}
                      className="text-[11px] text-ink/40 hover:text-[#ff8ba0]"
                    >
                      Убрать
                    </button>
                  </div>
                )
              })}
              <AttachPicker
                items={warrants}
                getId={(w) => w.id}
                getLabel={(w) => w.warrantNumber}
                getSublabel={(w) => w.warrantType}
                excludeIds={c.warrantIds}
                placeholder="Поиск ордера..."
                onAttach={(w) => onChange({ ...c, warrantIds: [...c.warrantIds, w.id] })}
              />
            </div>
          </SectionCard>
        )}

        {tab === 'bolos' && (
          <SectionCard title="BOLO" icon={<WantedIcon />}>
            <div className="flex flex-col gap-1.5">
              {c.boloIds.length === 0 && <EmptyState label="BOLO не прикреплены" />}
              {c.boloIds.map((id) => {
                const bolo = bolos.find((b) => b.id === id)
                return (
                  <div key={id} className="flex items-center justify-between gap-2 text-[13px]">
                    <EntityChip type="bolo" id={id} label={bolo ? bolo.title : id} />
                    <button
                      type="button"
                      onClick={() => onChange({ ...c, boloIds: c.boloIds.filter((b) => b !== id) })}
                      className="text-[11px] text-ink/40 hover:text-[#ff8ba0]"
                    >
                      Убрать
                    </button>
                  </div>
                )
              })}
              <AttachPicker
                items={bolos}
                getId={(b) => b.id}
                getLabel={(b) => b.title}
                getSublabel={(b) => b.boloType}
                excludeIds={c.boloIds}
                placeholder="Поиск BOLO..."
                onAttach={(b) => onChange({ ...c, boloIds: [...c.boloIds, b.id] })}
              />
            </div>
          </SectionCard>
        )}

        {tab === 'locations' && (
          <SectionCard title="Локации" icon={<CaseIcon />}>
            <div className="flex flex-col gap-2">
              {c.locations.length === 0 && <EmptyState label="Локации не указаны" />}
              {c.locations.map((loc, i) => (
                <div key={i} className="flex items-start justify-between gap-2 rounded-[6px] bg-black/30 p-2.5 text-[13px]">
                  <div>
                    <p className="font-medium text-ink/90">{loc.address}</p>
                    <p className="text-[11px] text-ink/40">{loc.type} · {loc.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onChange({ ...c, locations: c.locations.filter((_, idx) => idx !== i) })}
                    className="shrink-0 text-[11px] text-ink/40 hover:text-[#ff8ba0]"
                  >
                    Убрать
                  </button>
                </div>
              ))}
              <NewLocationForm onAdd={(loc) => onChange({ ...c, locations: [...c.locations, loc] })} />
            </div>
          </SectionCard>
        )}
      </div>
    </div>
  )
}

function NewLocationForm({ onAdd }: { onAdd: (loc: { address: string; type: string; description: string }) => void }) {
  const [address, setAddress] = useState('')
  const [type, setType] = useState('')
  const [description, setDescription] = useState('')

  function submit() {
    if (!address.trim()) return
    onAdd({ address: address.trim(), type: type.trim() || 'Прочее', description: description.trim() })
    setAddress('')
    setType('')
    setDescription('')
  }

  return (
    <div className="flex flex-col gap-1.5 rounded-[6px] bg-black/20 p-2">
      <input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Адрес"
        className="rounded-[4px] bg-ink/5 px-2 py-1 text-[12px] text-ink placeholder:text-ink/30 focus:outline-none"
      />
      <input
        value={type}
        onChange={(e) => setType(e.target.value)}
        placeholder="Тип (место преступления, обыск...)"
        className="rounded-[4px] bg-ink/5 px-2 py-1 text-[12px] text-ink placeholder:text-ink/30 focus:outline-none"
      />
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Описание"
        className="rounded-[4px] bg-ink/5 px-2 py-1 text-[12px] text-ink placeholder:text-ink/30 focus:outline-none"
      />
      <button type="button" onClick={submit} className="self-start text-[12px] font-semibold text-[#48adec] hover:underline">
        + Добавить локацию
      </button>
    </div>
  )
}
