export interface OfficerProfile {
  id: string
  badgeNumber: string
  rank: string
  name: string
  /** the character's agency — what headers, prints and authorship show */
  agency?: 'lssd' | 'lspd' | 'dao' | 'court'
  /** «LOS SANTOS COUNTY SHERIFF'S DEPARTMENT» */
  agencyName?: string
  /** «LSSD» */
  agencyShort?: string
  /** the agency in Russian text («Департамент шерифа округа Лос-Сантос») */
  agencyRu?: string
  /** employee number on blanks («20388») */
  employeeNo?: string
  /** «Davis Sheriff's Station» */
  station?: string
  /** «Patrol Deputy» */
  position?: string
  /** agency star / badge, and the seal shown next to it on paper */
  logo?: string
  seal?: string
  /** avatar / accent colour of the agency */
  color?: string
  /** portrait photo (falls back to initials) */
  photo?: string
  /** desktop wallpaper glow colour of the agency */
  wallpaper?: string
  /** large emblem on the desktop (the agency's badge / seal) */
  emblem?: string
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
  /** «Копия» recipients, comma-separated like `to`. */
  cc?: string
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
 * A civilian/officer record looked up via the "Поиск" module. Search is
 * multi-field (see `search` in `search/searchData.ts`) — officers rarely
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

export type BoloAgency = 'lspd' | 'lssd' | 'sahp' | 'fib'
export type BoloKind = 'person' | 'veh' | 'missing' | 'unknown'
export type BoloPriority = 'high' | 'mid' | 'low'
export type BoloStatus = 'open' | 'closed' | 'expired'
/** `wanted`/`special` are danger-flagged ("red"); `poi`/`alert` are
 * caution-flagged ("amber"); `missing` is informational ("blue"). */
export type BoloVid = 'wanted' | 'special' | 'poi' | 'missing' | 'alert'
export type BoloPhotoIcon = 'mug' | 'cam' | 'car' | 'tattoo' | 'obj'
/** Only `bolo`/`person`/`vehicle`/`case` kinds carry a real cross-link id
 * (see `useEntityNavigation`) — the rest (`home`/`org`/`doc`/`call`) have no
 * module to open yet and render as plain labelled text, matching the
 * reference's own `go()` no-op for those kinds. */
export type BoloLinkKind = 'person' | 'home' | 'car' | 'bolo' | 'doc' | 'case' | 'org' | 'call'

export interface BoloFact {
  label: string
  value: string
  /** Present only when this fact is itself a cross-link (e.g. "Транспорт" →
   * the linked vehicle's own BOLO id). */
  linkBoloId?: string
}

export interface BoloPhoto {
  caption: string
  icon: BoloPhotoIcon
}

export interface BoloLink {
  label: string
  value: string
  kind: BoloLinkKind
  /** Real cross-link target id — set for `bolo`/`person`/`car`/`case` kinds
   * that resolve to an actual record elsewhere in the mock data. */
  id?: string
}

export interface BoloSighting {
  place: string
  when: string
  text: string
  who: string
  /** Map position, percent of the terrain SVG's viewBox. */
  x: number
  y: number
}

export interface BoloHistoryEntry {
  when: string
  who: string
  what: string
}

/** Poster-specific overrides for a BOLO's printable listovka, when the
 * defaults derived from the BOLO record itself aren't quite right. */
export interface BoloPosterOverrides {
  unit?: string
  caseNo?: string
  wantedFor?: string
  mainCap?: string
  facts?: [string, string][]
  incident?: [string, string][]
  narr?: string
  contact?: string
  name?: string
}

/** BOLO ("Be On the Look Out") alert (`mockData/bolos.ts`) — the single
 * record backing every view of the BOLO module (feed card, detail, map pin,
 * poster). */
export interface Bolo {
  id: string
  no: string
  src: BoloAgency
  kind: BoloKind
  vid: BoloVid
  prio: BoloPriority
  status: BoloStatus
  armed: boolean
  title: string
  sub: string
  plate?: string
  carColor?: string
  reason: string
  penalCodes: string[]
  contact: { name: string; role: string; phone: string }
  facts: BoloFact[]
  description: string
  tags: string[]
  instruction: string
  photos: BoloPhoto[]
  links: BoloLink[]
  sightings: BoloSighting[]
  acknowledgedOf: number
  acknowledgedTotal: number
  author: string
  created: string
  ago: string
  unread?: boolean
  /** Set once closed/expired. */
  closedHow?: string
  closedBy?: string
  closedAt?: string
  /** `[when-text, relative-text]` — present only while the BOLO is close
   * enough to expiry to show the inline extend banner. */
  expiresSoon?: [string, string]
  /** `[iso-ish-date, summary]` — present only when there's an unseen
   * "what changed" update banner to show. */
  pendingUpdate?: [string, string]
  /** Draft text offered when opening the Update dialog. */
  updateDraft?: string
  history?: BoloHistoryEntry[]
  poster?: BoloPosterOverrides
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
 * implementation of "вкладывать людей, места и т.п." Persons, vehicles and
 * weapons are attached by id.
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

/** A tone drives both a status chip's color and its matching dot/accent —
 * shared across the case-file tree, the home list, and the access dialog's
 * classification badges. */
export type CaseTone = 'red' | 'amber' | 'green' | 'grey' | 'blue'

export type CasePlaceType = 'crime' | 'home' | 'find' | 'seen' | 'witness' | 'other'

/** One record inside a case-file folder — a person (with initials/avatar
 * color) or any other entity kind (evidence/media/exam/doc/event/vehicle/
 * place/surv), each with its own icon and inspector layout. `chain` backs
 * the physical-evidence chain-of-custody timeline; `px`/`py` (percent
 * coordinates on the Места map) only apply to `kind: 'place'`. */
/** A place ↔ record link: `id` of a person or evidence item of the case and
 * the person's role there (живёт / замечен / свидетель / работает / другое;
 * evidence: «найдено здесь»). */
export interface CasePlaceLink {
  id: string
  role: string
}

export interface CasePlaceArea {
  shape: 'circle' | 'square'
  r: number
}

export interface CasePhoto {
  src: string
  name: string
  when: string
  who: string
}

export interface CaseTreeItem {
  id: string
  kind: 'person' | 'vehicle' | 'place' | 'evidence' | 'media' | 'exam' | 'doc' | 'event' | 'surv' | 'note'
  /** kind 'note': the officer note (Заметки) attached here as a file */
  noteId?: string
  title: string
  sub: string
  status: string
  tone: CaseTone
  date: string
  info: [string, string][]
  note: string
  chain?: [string, string][]
  initials?: string
  color?: string
  placeType?: CasePlaceType
  /** Explicit links picked for a field: field key → ids of case records it refers to. */
  refs?: Record<string, string[]>
  /** Photos attached to the record (e.g. a map place), newest last. */
  photos?: CasePhoto[]
  /** Places: when it happened, «DD.MM.YYYY, HH:MM» (falls back to `date`). */
  when?: string
  /** Places: how exact the pin is — 0 точно, 1 ~200 м, 2 район. */
  accuracy?: 0 | 1 | 2
  /** Uncertainty zone around the pin: circle or square, radius (half side) in % of the map image height. */
  area?: CasePlaceArea
  /** Places: people / evidence of the case tied to this place. */
  placeLinks?: CasePlaceLink[]
  px?: number
  py?: number
}

/** One node of a case's folder tree (`root` → Участники/Транспорт/Места/
 * Улики/Наблюдение/Экспертизы/Документы/Хронология/Журнал). `view: 'map'`
 * renders Места as the map instead of a plain item list; `view: 'log'`
 * renders Журнал from `log` instead of `items`. */
export interface CaseTreeNode {
  id: string
  name: string
  color?: string
  desc?: string
  view?: 'map' | 'log'
  children?: CaseTreeNode[]
  items?: CaseTreeItem[]
  log?: CaseLogRow[]
}

export interface CaseLogRow {
  when: string
  who: string
  action: 'Добавление' | 'Изменение' | 'Перемещение' | 'Удаление'
  where: string
  detail: string
}

export interface CaseNote {
  who: string
  when: string
  text: string
  replies?: CaseNote[]
}

/** 'manager' — like the lead for access: grants and changes other people's rights. */
export type CaseAccessRole = 'lead' | 'manager' | 'member' | 'observer' | 'viewer'
export type CaseSectionLevel = 'all' | 'members' | 'managers' | 'lead'

export interface CaseAccessMember {
  name: string
  role: CaseAccessRole
  sub: string
}

export interface CaseAccessState {
  grif: 'normal' | 'conf' | 'secret'
  members: CaseAccessMember[]
  /** Per-top-level-folder-id access override ('all' = no restriction). */
  sections: Record<string, CaseSectionLevel>
}

/**
 * Full "кейс-файл" detail for one case — the rich, nested-folder browser
 * view opened from `CasesHome`. Separate from `CaseFile` (the flat attach-
 * by-id record other modules, e.g. Заметки's case-link picker, point to):
 * not every case in `CasesHome`'s list has one of these yet, matching the
 * reference (only 2 of its 8 home-list rows have a real file behind them).
 */
export interface CasePinned {
  title: string
  /** optional details under the title */
  text: string
  /** key into CASE_PEOPLE */
  who: string
  when: string
  tone: 'red' | 'amber' | 'blue'
}

export interface CaseFileDetail {
  id: string
  /** owning agency (default LSPD); other agencies see it only with access granted */
  agency?: CaseAgency
  no: string
  short: string
  title: string
  status: string
  tone: CaseTone
  /** last change: full date and time */
  updated: string
  /** who made the last change (English full name) */
  updatedBy: string
  related?: string
  meta: [string, string][]
  /** Lead investigator: in-game (English) full name + rank shown under it. */
  lead: { name: string; rank: string }
  /** Charges: penal code + what the crime actually is. */
  charges: [string, string][]
  /** Pinned announcement anyone on the case can write («СЕГОДНЯ ОБЫСК!»);
   * `null` = none yet (the overview then offers to add one). */
  pinned: CasePinned | null
  recent: { when: string; what: string; where: string; who: string }[]
  tree: CaseTreeNode
  access: CaseAccessState
  notes: Record<string, CaseNote[]>
}

/** One row of the "Дела" home list (`CasesHome`) — every case in the
 * department shows up here even if it has no `CaseFileDetail` yet. */
/** Whose case base a case belongs to (LSPD / LSSD / прокуратура / суд). */
export type CaseAgency = 'lspd' | 'lssd' | 'dao' | 'court'

export interface CaseListRow {
  id: string
  /** owning agency (default LSPD) */
  agency?: CaseAgency
  grif?: 'conf' | 'secret'
  no: string
  title: string
  status: string
  group: 'work' | 'search' | 'court' | 'closed'
  tone: CaseTone
  lead: string
  updated: string
  ppl: number
  evd: number
  exp: number
  mine: boolean
  recent: boolean
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

/** The four fixed "Заметки" folders — not user-creatable, matching the
 * reference design's closed set (no free-text category). */
export type NoteFolder = 'cases' | 'plates' | 'shifts' | 'personal'

/** One typed block of a note's body — paragraph/heading/bullet render as
 * plain typography, `checklist` carries a real toggleable `done` state,
 * `quote` is the monospace scratch-block style (used for things like a
 * plate-number list). */
export interface NoteBlock {
  id: string
  type: 'paragraph' | 'heading' | 'bullet' | 'checklist' | 'quote' | 'image'
  text: string
  done?: boolean
  /** type 'image': the picture (data URL) and its file name */
  src?: string
  name?: string
}

/**
 * "Заметки" standalone officer notepad entry (`mockData/standaloneNotes.ts`).
 * Distinct from `PersonNote` (which lives inside a person's profile) — this
 * is a personal scratchpad not tied to any one profile, with an optional
 * single link out to a case.
 */
export interface OfficerNote {
  id: string
  title: string
  folder: NoteFolder
  blocks: NoteBlock[]
  isPinned: boolean
  author: string
  /** Short form grouped by date prefix ("Сегодня, 10:12" / "Вчера, ..."),
   * same convention as `MailMessage.time`. */
  time: string
  /** Full form shown centered above the title in the reader ("15 ноября
   * 2026 г. в 15:20"). */
  dateFull: string
  /** Cosmetic case-number label shown next to the title in list rows
   * ("SW-2611") — purely a display string, independent of `linkedCaseId`
   * (the real cross-link, set only via the case picker). */
  caseNo?: string
  linkedCaseId?: string
  /** «Сделать себе копию»: whose note this was copied from (author · title) */
  copiedFrom?: string
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
