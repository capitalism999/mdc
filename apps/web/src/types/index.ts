export interface OfficerProfile {
  id: string
  badgeNumber: string
  rank: string
  name: string
}

export interface AppTile {
  id: string
  label: string
  icon: string
  /** `'bare'` opts a module out of the generic OS window chrome (title bar
   * with breadcrumb strip) so it can render its own full-bleed title row —
   * used by modules redesigned to match a reference that doesn't have a
   * breadcrumb bar (e.g. Почта). Omitted = the standard chrome. */
  chrome?: 'bare'
  /** Overrides the default desktop-ratio sizing a window opens at, for a
   * module whose reference design has one fixed proportions. */
  defaultSize?: { width: number; height: number }
  /** Module hasn't been rebuilt for the new design yet — its desktop icon
   * renders greyed out and its window shows a "в разработке" placeholder
   * instead of the module's real (pre-redesign) content. */
  stub?: boolean
}

export interface MailAttachment {
  name: string
  size: number
  type: string
  url: string
}

export interface MailMessage {
  id: string
  from: string
  /** Sender's role/department line shown under their name in the reader
   * (e.g. "Детектив-сержант, отдел расследований"). */
  role?: string
  to: string
  subject: string
  preview: string
  body: string
  time: string
  read: boolean
  pinned?: boolean
  important?: boolean
  folder: 'inbox' | 'sent' | 'drafts' | 'archive' | 'trash'
  kind: 'system' | 'player'
  attachments?: MailAttachment[]
}

export interface PersonVehicle {
  vehicleId: string
  plate: string
  model: string
}

export interface PersonWeapon {
  weaponId: string
  serial: string
  name: string
}

export interface PersonBusiness {
  name: string
  ern: string
}

export interface PersonProperty {
  id: string
  address: string
  type: string
}

export interface PersonNote {
  id: string
  author: string
  time: string
  text: string
}

export interface ArrestRecord {
  id: string
  date: string
  pc: string
  charge: string
  officer: string
  department: string
  caseStatus: 'Открыто' | 'В суде' | 'Закрыто'
  sentence?: string
  /** Link into the global "Аресты" journal (`mockData/arrests.ts`), if this
   * denormalized entry has a corresponding full arrest file. */
  arrestFileId?: string
  /** Link into the "Законы" reference table (`mockData/penalCodes.ts`). */
  penalCodeId?: string
}

export interface Warrant {
  id: string
  reason: string
  status: 'Активен' | 'Закрыт'
  date: string
  /** Link into the global "Ордера" registry (`mockData/warrants.ts`). */
  warrantFileId?: string
}

export interface Fine {
  id: string
  reason: string
  amount: number
  status: 'Оплачен' | 'Не оплачен' | 'Просрочен'
  date: string
  dueDate: string
}

export interface Associate {
  personId?: string
  name: string
  relation: string
}

export interface Incident {
  id: string
  date: string
  type: string
  description: string
}

/**
 * A civilian/officer record in the "Люди" module. Search is multi-field
 * (see `SEARCH_CATEGORIES` in `people/SearchHome.tsx`) — officers rarely
 * know a name up front, so phone/document/weapon/vehicle/business/
 * biometric lookups all resolve back to a `Person`.
 */
export interface Person {
  id: string
  firstName: string
  lastName: string
  alias?: string
  dob: string
  gender: 'М' | 'Ж'
  photo?: string
  maritalStatus: string
  dangerTag?: string
  phone: string
  address: string
  job: string
  idNumber: string
  biometricId: string
  bloodType: string
  residency: 'resident' | 'migrant'
  wanted: boolean
  driverLicense: { number: string; status: 'Действительны' | 'Приостановлены' | 'Отсутствуют' }
  weaponLicense: { number: string; status: 'Действительна' | 'Приостановлена' | 'Отсутствует' }
  bankAccount: { number: string; balance: number }
  vehicles: PersonVehicle[]
  weapons: PersonWeapon[]
  businesses: PersonBusiness[]
  properties: PersonProperty[]
  notes: PersonNote[]
  arrests: ArrestRecord[]
  warrants: Warrant[]
  fines: Fine[]
  associates: Associate[]
  incidents: Incident[]
}

/** DMV registry entry (`mockData/vehicles.ts`). Referenced by `PersonVehicle.vehicleId`. */
export interface Vehicle {
  id: string
  plate: string
  vin: string
  ownerId?: string
  ownerName: string
  make: string
  model: string
  year: number
  color: string
  vehicleClass: string
  registrationStatus: 'Зарегистрирован' | 'Просрочен' | 'Снят с учёта'
  insuranceStatus: 'Есть' | 'Отсутствует' | 'Просрочена'
  stolenFlag: boolean
  impoundFlag: boolean
}

/** Penal code registry entry (`mockData/penalCodes.ts`) — reference-only
 * table maintained via Админ, cited by charges everywhere (arrests,
 * warrants, reports, cases). Sourced from the full "Penal Code of San
 * Andreas" text; `class: 'provision'` covers non-chargeable procedural/
 * definitional articles (Sections VIII-XV) that have no fine/jail. */
export interface PenalCode {
  id: string
  code: string
  title: string
  category: string
  class: 'felony' | 'misdemeanor' | 'infraction' | 'provision'
  fineDefault: number
  /** Minimum jail term in minutes (0 if the statute carries no jail time). */
  jailDefault: number
  points: number
  /** Full statute body text (subsections, notes, and the punishment clause). */
  description: string
}

/** Weapons registry entry (`mockData/weapons.ts`). Referenced by `PersonWeapon.weaponId`. */
export interface Weapon {
  id: string
  serialNumber: string
  weaponType: string
  make: string
  model: string
  caliber: string
  registeredOwnerId?: string
  registeredOwnerName: string
  registrationStatus: 'Зарегистрировано' | 'Не зарегистрировано' | 'Изъято'
  stolenFlag: boolean
  seizedFlag: boolean
  seizedInArrestId?: string
}

export interface WarrantCharge {
  penalCodeId: string
  count: number
}

/**
 * Global "Ордера" registry entry (`mockData/warrants.ts`) — the full
 * warrant file referenced by `Warrant.warrantFileId` on a person's
 * denormalized profile list.
 */
export interface WarrantFile {
  id: string
  warrantNumber: string
  warrantType: string
  status: 'Активен' | 'Исполнен' | 'Истёк'
  subjectPersonId: string
  reason: string
  issuingJudge: string
  charges: WarrantCharge[]
  relatedCaseId?: string
  relatedArrestId?: string
}

/** BOLO ("Be On the Look Out") alert (`mockData/bolos.ts`). */
export interface Bolo {
  id: string
  title: string
  boloType: string
  status: 'Активен' | 'Закрыт'
  priority: 'Низкий' | 'Средний' | 'Высокий'
  personId?: string
  vehicleId?: string
  reason: string
  dangerLevel: 'Низкий' | 'Средний' | 'Высокий' | 'Критический'
  lastKnownLocation: string
  caseId?: string
}

export interface ArrestCharge {
  penalCodeId: string
  count: number
  fineAmount: number
  jailTime: number
}

/**
 * Global "Аресты" journal entry (`mockData/arrests.ts`) — the full arrest
 * file referenced by `ArrestRecord.arrestFileId` on a person's denormalized
 * profile list, and by `Weapon.seizedInArrestId`.
 */
export interface ArrestFile {
  id: string
  arrestNumber: string
  arresteeId: string
  arrestingOfficer: string
  status: 'Открыто' | 'В суде' | 'Закрыто'
  charges: ArrestCharge[]
  seizedWeaponIds: string[]
  relatedReportId?: string
  relatedCaseId?: string
  relatedWarrantId?: string
  relatedBoloId?: string
}

export interface ReportPersonLink {
  personId: string
  role: string
}

export interface ReportVehicleLink {
  vehicleId: string
  role: string
}

export interface ReportCharge {
  personId: string
  penalCodeId: string
  count: number
}

/**
 * "Рапорты" entry (`mockData/reports.ts`) — the first module with
 * composable attachments (persons/vehicles/weapons/charges/evidence by id).
 * This attach-by-id pattern is reused almost 1:1 by `CaseFile` (Дела).
 * `dispatchCallId` links back to the CAD call this report was created from
 * (see `DispatchCall`'s "Создать рапорт" action).
 */
export interface Report {
  id: string
  reportNumber: string
  title: string
  reportType: string
  narrative: string
  status: 'Черновик' | 'Отправлен' | 'Утверждён'
  authorName: string
  incidentDate: string
  dispatchCallId?: string
  persons: ReportPersonLink[]
  vehicles: ReportVehicleLink[]
  weapons: string[]
  charges: ReportCharge[]
  evidenceIds: string[]
  relatedCaseId?: string
}

export interface CasePersonLink {
  personId: string
  role: string
}

export interface CaseVehicleLink {
  vehicleId: string
  role: string
}

export interface CaseWeaponLink {
  weaponId: string
  role: string
}

export interface CaseLocation {
  address: string
  type: string
  description: string
}

/**
 * "Дела" central hub entry (`mockData/cases.ts`) — aggregates everything the
 * rest of the system produces: reports, evidence, warrants, BOLOs, gangs,
 * plus attached persons/vehicles/weapons/locations. This is the direct
 * implementation of "вкладывать людей, места и т.п." Uses the same
 * attach-by-id pattern as `Report`.
 */
export interface CaseFile {
  id: string
  caseNumber: string
  title: string
  status: 'Открыто' | 'Активно' | 'Закрыто'
  caseType: string
  leadOfficerName: string
  persons: CasePersonLink[]
  vehicles: CaseVehicleLink[]
  weapons: CaseWeaponLink[]
  reportIds: string[]
  evidenceIds: string[]
  warrantIds: string[]
  boloIds: string[]
  locations: CaseLocation[]
  gangIds: string[]
}

export interface GangMember {
  personId: string
  role: string
  moniker: string
}

export interface GangRivalry {
  gangId: string
  relationship: string
}

export interface GangIntelEntry {
  date: string
  author: string
  note: string
}

/** "SangGang" registry entry (`mockData/gangs.ts`). */
export interface Gang {
  id: string
  name: string
  aliases: string[]
  status: 'Активна' | 'Распущена'
  threatLevel: 'Низкий' | 'Средний' | 'Высокий' | 'Критический'
  territoryDescription: string
  members: GangMember[]
  rivalries: GangRivalry[]
  intelEntries: GangIntelEntry[]
}

export interface CustodyLogEntry {
  officer: string
  action: string
  date: string
}

/**
 * "Экспертизы" evidence locker entry (`mockData/evidence.ts`). `custodyLog`
 * backs the chain-of-custody timeline on `EvidenceCard`.
 */
export interface Evidence {
  id: string
  evidenceNumber: string
  description: string
  evidenceType: string
  status: 'В хранилище' | 'На анализе' | 'Возвращено' | 'Уничтожено'
  collectedBy: string
  collectedDate: string
  custodyLog: CustodyLogEntry[]
  relatedCaseId?: string
  relatedReportId?: string
  relatedArrestId?: string
}

/**
 * Forensic analysis result on a piece of evidence (`mockData/forensicAnalyses.ts`).
 * `matchedPersonId`/`matchedWeaponId` are the "провалиться в карточку"
 * payoff of a lab match.
 */
export interface ForensicAnalysis {
  id: string
  analysisNumber: string
  evidenceId: string
  analysisType: string
  status: 'В очереди' | 'В работе' | 'Завершён'
  matchFound: boolean
  matchedPersonId?: string
  matchedWeaponId?: string
  resultSummary: string
}

/**
 * "Заметки" standalone officer notepad entry (`mockData/standaloneNotes.ts`).
 * Distinct from `PersonNote` (which lives inside a person's profile) — this
 * is a personal scratchpad not tied to any one profile, with an optional
 * single link out to a person/vehicle/case.
 */
export interface OfficerNote {
  id: string
  title: string
  content: string
  category: string
  isPinned: boolean
  author: string
  time: string
  linkedPersonId?: string
  linkedVehicleId?: string
  linkedCaseId?: string
}

/** Personnel roster entry (`mockData/officers.ts`). Deliberately shallow —
 * officers don't get their own detail card beyond this list, since the
 * system has no authentication to enforce roles/permissions against. */
export interface Officer {
  id: string
  name: string
  badgeNumber: string
  callsign: string
  department: string
  rank: string
  dutyStatus: 'На смене' | 'Не на смене' | 'Отстранён'
}

/** Role/permission reference entry (`mockData/roles.ts`) — data only, no
 * UI-level enforcement in this prototype. */
export interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
}

/** Declarative audit trail entry (`mockData/auditLog.ts`) — seeded from mock
 * data rather than produced by real action-logging in this prototype. */
export interface AuditLogEntry {
  id: string
  officerId: string
  action: string
  entityType: string
  entityId: string
  timestamp: string
}

/** Department-wide bulletin (`mockData/announcements.ts`). */
export interface Announcement {
  id: string
  title: string
  body: string
  author: string
  date: string
  priority: 'Обычный' | 'Важный'
}

/** CAD dispatch call (`mockData/dispatchCalls.ts`). The "Создать рапорт"
 * action on a call's card is the first use of `initialParams` to pre-fill
 * a form in another module (Рапорты). */
export interface DispatchCall {
  id: string
  callNumber: string
  natureCode: string
  priority: 'Низкий' | 'Средний' | 'Высокий'
  status: 'В ожидании' | 'Направлен' | 'Завершён'
  callerName: string
  locationStreet: string
  relatedPersonId?: string
  relatedVehiclePlate?: string
  linkedReportId?: string
  linkedCaseId?: string
}

/** Shared file-server entry (`mockData/ftpFiles.ts`) — a flat list of
 * folders/files rendered by the "FTP" module as a simple department file
 * share (bulletins, forms, bodycam exports, etc). `parentId: null` means a
 * top-level item. */
export interface FtpFile {
  id: string
  parentId: string | null
  kind: 'folder' | 'file'
  name: string
  size?: string
  updatedAt: string
  updatedBy: string
}
