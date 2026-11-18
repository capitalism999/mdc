import { useState, type ReactNode } from 'react'
import type { Gang, Person } from '../../../types'
import { EntityChip } from '../shared/EntityChip'
import { GangIcon } from '../shared/entityIcons'
import { Field, formatMoney } from '../shared/ui'
import { getAvatarColor, getInitials } from '../shared/avatar'
import { DriverLicenseCard } from './DriverLicenseCard'
import {
  ArrestIcon,
  AssociateIcon,
  BackIcon,
  BankIcon,
  BiometricIcon,
  BusinessIcon,
  ChevronIcon,
  DocumentIcon,
  FineIcon,
  IncidentIcon,
  NoteAddIcon,
  PhoneIcon,
  PropertyIcon,
  VehicleIcon,
  WantedIcon,
  WarrantIcon,
  WeaponIcon,
} from './icons'
import { RESIDENCY_LABEL } from './SearchHome'

const GENDER_LABEL: Record<Person['gender'], string> = { М: 'Мужчина', Ж: 'Женщина' }

function calcAge(dob: string): number {
  const [d, m, y] = dob.split('.').map(Number)
  const birth = new Date(y ?? 0, (m ?? 1) - 1, d ?? 1)
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const hadBirthdayThisYear = now.getMonth() > birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() >= birth.getDate())
  if (!hadBirthdayThisYear) age--
  return age
}

function pluralizeYears(n: number): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 14) return 'лет'
  if (mod10 === 1) return 'год'
  if (mod10 >= 2 && mod10 <= 4) return 'года'
  return 'лет'
}

/** Flat, sharp-cornered record row used for arrests/warrants/fines/incidents/
 * notes — rows are divided by hairlines instead of each being its own rounded
 * card, matching the dense list style of real CAD/RMS record screens. */
function RecordList({ children }: { children: ReactNode }) {
  return <div className="flex flex-col divide-y divide-ink/10 overflow-hidden rounded-[8px] bg-ink/[0.04]">{children}</div>
}

function RecordRow({ children }: { children: ReactNode }) {
  return <div className="p-2.5 text-[13px]">{children}</div>
}

/** Local, flat-CAD-styled stand-in for the shared `SectionCard` — a bordered
 * panel with an uppercase title bar instead of a rounded translucent card.
 * Kept local to this file (not promoted to `shared/ui.tsx`) since the flat
 * style is currently a trial scoped to the person profile page only. */
function FlatSection({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="shrink-0 overflow-hidden rounded-[8px] bg-ink/[0.04]">
      <div className="flex items-center gap-2 bg-[#48adec]/10 px-3 py-2 text-[12px] font-bold uppercase tracking-wide text-[#48adec]">
        <span className="text-[#48adec]/70">{icon}</span>
        {title}
      </div>
      <div className="p-3">{children}</div>
    </div>
  )
}

/** Same flat header as `FlatSection`, but the body starts collapsed and
 * toggles open via the chevron — used for the record-heavy sections so the
 * profile isn't one long wall of lists by default. */
function CollapsibleSection({
  title,
  icon,
  defaultOpen = false,
  children,
}: {
  title: string
  icon: ReactNode
  defaultOpen?: boolean
  children: ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="shrink-0 overflow-hidden rounded-[8px] bg-ink/[0.04]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 bg-[#48adec]/10 px-3 py-2 text-left text-[12px] font-bold uppercase tracking-wide text-[#48adec]"
      >
        <span className="text-[#48adec]/70">{icon}</span>
        <span className="flex-1">{title}</span>
        <ChevronIcon className={`h-3 w-3 shrink-0 transition-transform ${open ? '' : '-rotate-90'}`} />
      </button>
      {open && <div className="p-3">{children}</div>}
    </div>
  )
}

/** Local, flat-CAD-styled stand-in for the shared `StatusPill` — a sharp
 * solid-filled tag instead of a rounded translucent pill. */
function StatusTag({ status, positive }: { status: string; positive: boolean }) {
  return (
    <span
      className={`shrink-0 rounded-[4px] px-2 py-0.5 text-[11px] font-bold uppercase ${
        positive ? 'bg-[#3fb97f] text-black' : 'bg-[#e8637a] text-black'
      }`}
    >
      {status}
    </span>
  )
}

interface PersonProfileProps {
  person: Person
  gangs: Gang[]
  onBack: () => void
  onAddNote: (personId: string, text: string) => void
  onSelectAssociate: (personId: string) => void
}

/** Property has no dedicated module/card yet (out of scope per plan 0.3) —
 * rendered as a plain row rather than an `EntityChip` until "Жильё" is
 * promoted to its own entity. */
function PropertyRow({ type, address }: { type: string; address: string }) {
  return (
    <div className="flex items-center justify-between gap-3 px-1 py-0.5 text-[13px]">
      <span className="text-ink/80">{type}</span>
      <span className="text-ink/40">{address}</span>
    </div>
  )
}

export function PersonProfile({ person, gangs, onBack, onAddNote, onSelectAssociate }: PersonProfileProps) {
  const [noteText, setNoteText] = useState('')
  const gangAffiliations = gangs
    .map((g) => ({ gang: g, member: g.members.find((m) => m.personId === person.id) }))
    .filter((x): x is { gang: Gang; member: NonNullable<(typeof x)['member']> } => !!x.member)

  const activeRecordsCount =
    person.arrests.filter((a) => a.caseStatus !== 'Закрыто').length +
    person.warrants.filter((w) => w.status === 'Активен').length
  const wantedReason =
    person.warrants.find((w) => w.status === 'Активен')?.reason ??
    person.arrests.find((a) => a.caseStatus !== 'Закрыто')?.charge

  function submitNote() {
    if (!noteText.trim()) return
    onAddNote(person.id, noteText.trim())
    setNoteText('')
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-ink/10 p-4">
        <button
          type="button"
          onClick={onBack}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] bg-ink/10 text-ink hover:bg-ink/20"
        >
          <BackIcon />
        </button>
        <div>
          <h2 className="text-[16px] font-semibold text-ink">Личное дело</h2>
          <p className="text-[12px] text-ink/40">ID {person.idNumber}</p>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex w-[300px] shrink-0 flex-col gap-4 overflow-y-auto border-r border-ink/10 p-4">
          <div className="flex shrink-0 items-center gap-3">
            {person.photo ? (
              <img src={person.photo} alt="" className="h-36 w-36 shrink-0 rounded-[8px] object-cover" />
            ) : (
              <div
                className="flex h-36 w-36 shrink-0 items-center justify-center rounded-[8px] text-[28px] font-semibold text-ink"
                style={{ backgroundColor: getAvatarColor(person.id) }}
              >
                {getInitials(person.firstName, person.lastName)}
              </div>
            )}
            <div className="min-w-0">
              <h2 className="text-[16px] font-semibold text-ink">
                {person.firstName} {person.lastName}
              </h2>
              <p className="mt-0.5 text-[12px] text-ink/40">
                {GENDER_LABEL[person.gender]} · {calcAge(person.dob)} {pluralizeYears(calcAge(person.dob))} · {RESIDENCY_LABEL[person.residency]}
              </p>
            </div>
          </div>

          <FlatSection title="Коды предупреждения" icon={<WantedIcon />}>
            <div className="flex flex-wrap gap-1.5">
              {person.dangerTag && (
                <span className="shrink-0 rounded-[4px] bg-[#e8637a] px-2 py-1 text-[11px] font-bold uppercase text-black">
                  {person.dangerTag}
                </span>
              )}
              <span className="shrink-0 rounded-[4px] border border-[#48adec] px-2 py-1 text-[11px] font-bold uppercase text-[#48adec]">
                {person.job}
              </span>
            </div>
          </FlatSection>

          <FlatSection title="Телефон" icon={<PhoneIcon />}>
            <p className="text-[13px] text-ink/80">{person.phone}</p>
          </FlatSection>

          <FlatSection title="Место проживания" icon={<PropertyIcon />}>
            {person.properties.length === 0 ? (
              <p className="text-[13px] text-ink/80">{person.address}</p>
            ) : (
              <div className="flex flex-col gap-1.5">
                {person.properties.map((p) => (
                  <p key={p.id} className="text-[13px] text-ink/80">
                    {p.type} · {p.address}
                  </p>
                ))}
              </div>
            )}
          </FlatSection>
        </div>

        <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
          {person.wanted && (
            <div className="flex items-center gap-3 rounded-[8px] border border-[#e8637a]/40 border-l-4 border-l-[#e8637a] bg-[#e8637a]/10 px-4 py-2.5">
              <span className="shrink-0 text-[#ff8ba0]">
                <WantedIcon />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-bold uppercase tracking-wide text-[#ff8ba0]">В розыске</p>
                {wantedReason && <p className="truncate text-[12px] text-[#ff8ba0]/70">{wantedReason}</p>}
              </div>
              {activeRecordsCount > 0 && (
                <span className="shrink-0 rounded-[4px] bg-[#e8637a] px-2 py-1 text-[11px] font-bold uppercase text-black">
                  Активных: {activeRecordsCount}
                </span>
              )}
            </div>
          )}

          <FlatSection title="Общие сведения" icon={<DocumentIcon />}>
            <div className="flex flex-col gap-1.5">
              <Field label="Фамилия" value={person.lastName} />
              <Field label="Имя" value={person.firstName} />
              {person.alias && <Field label="Псевдоним" value={person.alias} />}
              <Field label="Дата рождения" value={person.dob} />
              <Field label="Пол" value={person.gender} />
              <Field label="Гражданство и статус" value={RESIDENCY_LABEL[person.residency]} />
              <Field label="Семейное положение" value={person.maritalStatus} />
              <Field label="Телефон" value={person.phone} />
              <Field label="ID/DOC номер" value={person.idNumber} />
            </div>
          </FlatSection>

          <div className="grid grid-cols-2 gap-3">
            <DriverLicenseCard person={person} />
            <FlatSection title="Банковский счёт" icon={<BankIcon />}>
              <div className="flex flex-col gap-1.5">
                <Field label="Номер счёта" value={person.bankAccount.number} />
                <Field label="Баланс" value={formatMoney(person.bankAccount.balance)} />
              </div>
            </FlatSection>
          </div>

          <CollapsibleSection title="Собственность" icon={<PropertyIcon />}>
            <div className="grid grid-cols-2 gap-3">
              <FlatSection title="Транспорт" icon={<VehicleIcon />}>
                {person.vehicles.length === 0 ? (
                  <p className="text-[13px] text-ink/30">Не зарегистрирован</p>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    {person.vehicles.map((v) => (
                      <EntityChip key={v.vehicleId} type="vehicle" id={v.vehicleId} label={v.model} sublabel={v.plate} />
                    ))}
                  </div>
                )}
              </FlatSection>

              <FlatSection title="Жильё" icon={<PropertyIcon />}>
                {person.properties.length === 0 ? (
                  <p className="text-[13px] text-ink/30">Не зарегистрировано</p>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    {person.properties.map((p) => (
                      <PropertyRow key={p.id} type={p.type} address={p.address} />
                    ))}
                  </div>
                )}
              </FlatSection>

              <FlatSection title="Оружие" icon={<WeaponIcon />}>
                <div className="flex flex-col gap-1.5">
                  <Field label="Разрешение" value={`${person.weaponLicense.number} — ${person.weaponLicense.status}`} />
                  {person.weapons.length === 0 ? (
                    <p className="text-[13px] text-ink/30">Не зарегистрировано</p>
                  ) : (
                    person.weapons.map((w) => (
                      <EntityChip key={w.weaponId} type="weapon" id={w.weaponId} label={w.name} sublabel={w.serial} />
                    ))
                  )}
                </div>
              </FlatSection>

              <FlatSection title="Бизнес" icon={<BusinessIcon />}>
                {person.businesses.length === 0 ? (
                  <p className="text-[13px] text-ink/30">Не зарегистрирован</p>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    {person.businesses.map((b) => (
                      <Field key={b.ern} label={b.ern} value={b.name} />
                    ))}
                  </div>
                )}
              </FlatSection>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Биометрия" icon={<BiometricIcon />}>
            <div className="flex flex-col gap-1.5">
              <Field label="Биометрический ID" value={person.biometricId} />
              <Field label="Группа крови" value={person.bloodType} />
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Криминальные записи" icon={<ArrestIcon />}>
            {person.arrests.length === 0 && person.warrants.length === 0 ? (
              <p className="text-[13px] text-ink/30">Не привлекался</p>
            ) : (
              <RecordList>
                {person.arrests.map((a) => (
                  <RecordRow key={a.id}>
                    <div className="mb-1 flex items-center justify-between gap-2 text-[12px] text-ink/40">
                      <span>
                        {a.officer} · {a.department}
                      </span>
                      <span>{a.date}</span>
                    </div>
                    <div className="mb-1 flex items-center justify-between gap-2">
                      {a.arrestFileId ? (
                        <EntityChip type="arrest" id={a.arrestFileId} label={a.pc} sublabel={a.charge} />
                      ) : a.penalCodeId ? (
                        <div className="flex items-center gap-1 text-ink/80">
                          <EntityChip type="penalCode" id={a.penalCodeId} label={a.pc} />— {a.charge}
                        </div>
                      ) : (
                        <p className="text-ink/80">
                          <span className="text-ink/40">{a.pc}</span> — {a.charge}
                        </p>
                      )}
                      <StatusTag status={a.caseStatus} positive={a.caseStatus === 'Закрыто'} />
                    </div>
                    {a.sentence && <p className="text-[12px] text-ink/40">Наказание: {a.sentence}</p>}
                  </RecordRow>
                ))}
                {person.warrants.map((w) => (
                  <RecordRow key={w.id}>
                    <div className="mb-1 flex items-center gap-2 text-[12px] text-ink/40">
                      <WarrantIcon className="shrink-0" />
                      <span>Ордер · {w.date}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      {w.warrantFileId ? (
                        <EntityChip type="warrant" id={w.warrantFileId} label={w.reason} />
                      ) : (
                        <p className="text-ink/80">{w.reason}</p>
                      )}
                      <StatusTag status={w.status} positive={w.status === 'Закрыт'} />
                    </div>
                  </RecordRow>
                ))}
              </RecordList>
            )}
          </CollapsibleSection>

          <CollapsibleSection title="Штрафы" icon={<FineIcon />}>
            {person.fines.length === 0 ? (
              <p className="text-[13px] text-ink/30">Штрафов нет</p>
            ) : (
              <RecordList>
                {person.fines.map((f) => (
                  <RecordRow key={f.id}>
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span className="text-ink/80">{f.reason}</span>
                      <StatusTag status={f.status} positive={f.status === 'Оплачен'} />
                    </div>
                    <div className="flex items-center justify-between text-[12px] text-ink/40">
                      <span>
                        {f.date} · срок оплаты {f.dueDate}
                      </span>
                      <span>{formatMoney(f.amount)}</span>
                    </div>
                  </RecordRow>
                ))}
              </RecordList>
            )}
          </CollapsibleSection>

          <CollapsibleSection title="Лента инцидентов" icon={<IncidentIcon />}>
            {person.incidents.length === 0 ? (
              <p className="text-[13px] text-ink/30">Инцидентов не зафиксировано</p>
            ) : (
              <RecordList>
                {person.incidents.map((i) => (
                  <RecordRow key={i.id}>
                    <div className="mb-1 flex items-center justify-between gap-2 text-[12px] text-ink/40">
                      <span>{i.type}</span>
                      <span>{i.date}</span>
                    </div>
                    <p className="text-ink/80">{i.description}</p>
                  </RecordRow>
                ))}
              </RecordList>
            )}
          </CollapsibleSection>

          <CollapsibleSection title="Связанные лица" icon={<AssociateIcon />}>
            {person.associates.length === 0 ? (
              <p className="text-[13px] text-ink/30">Не выявлены</p>
            ) : (
              <div className="flex flex-col gap-1.5">
                {person.associates.map((a) =>
                  a.personId ? (
                    <button
                      key={a.personId}
                      type="button"
                      onClick={() => onSelectAssociate(a.personId!)}
                      className="flex items-center justify-between gap-3 px-1 py-0.5 text-[13px] hover:bg-ink/10"
                    >
                      <span className="text-[#48adec]">{a.name}</span>
                      <span className="text-ink/40">{a.relation}</span>
                    </button>
                  ) : (
                    <Field key={a.name} label={a.name} value={a.relation} />
                  ),
                )}
              </div>
            )}
          </CollapsibleSection>

          {gangAffiliations.length > 0 && (
            <CollapsibleSection title="Принадлежность к банде" icon={<GangIcon />}>
              <div className="flex flex-col gap-1.5">
                {gangAffiliations.map(({ gang, member }) => (
                  <div key={gang.id} className="flex items-center justify-between gap-3 text-[13px]">
                    <EntityChip type="gang" id={gang.id} label={gang.name} sublabel={member.moniker} />
                    <span className="text-ink/40">{member.role}</span>
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          )}

          <div className="overflow-hidden rounded-[8px] bg-ink/[0.04]">
            <div className="flex items-center gap-2 bg-[#48adec]/10 px-3 py-2 text-[12px] font-bold uppercase tracking-wide text-[#48adec]">
              Заметки офицера
            </div>
            <div className="flex max-h-[280px] flex-col gap-1 overflow-y-auto p-3">
              {person.notes.length === 0 ? (
                <p className="text-[13px] text-ink/30">Заметок нет</p>
              ) : (
                person.notes.map((note) => (
                  <p key={note.id} className="text-[13px] text-ink/80">
                    <span className="text-ink/40">
                      {note.time} {note.author}:
                    </span>{' '}
                    {note.text}
                  </p>
                ))
              )}
            </div>
            <div className="flex items-center gap-2 p-3">
              <input
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitNote()}
                placeholder="Добавить заметку..."
                className="h-9 flex-1 rounded-[4px] border border-ink/10 bg-bg-chrome-2 px-3 text-[13px] text-ink placeholder:text-ink/30 focus:border-[#48adec] focus:outline-none"
              />
              <button
                type="button"
                onClick={submitNote}
                disabled={!noteText.trim()}
                className="flex h-9 items-center gap-1.5 rounded-[4px] bg-[#48adec] px-3 text-[13px] font-semibold text-black hover:bg-[#62b9ef] disabled:cursor-default disabled:opacity-40 disabled:hover:bg-[#48adec]"
              >
                <NoteAddIcon />
                Добавить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
