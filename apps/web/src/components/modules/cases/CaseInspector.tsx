import { useEffect, useState, type ReactNode } from 'react'
import { PhotoCover, PhotosSection } from './CasePhotos'
import { PlaceTypeIcon } from './placeIcons'
import type { CaseLogRow, CasePlaceArea, CasePlaceLink, CasePlaceType, CaseTone, CaseTreeItem } from '../../../types'
import { ItemHistory } from './CaseItemHistory'
import { CaseNotePreview } from './CaseNotePreview'
import { PlaceEditForm, type PlaceFormResult, PlaceLinksSection, RecordPlacesSection } from './CasePlaceCard'
import { PLACE_TYPE_COLOR, PLACE_TYPE_LABEL, areaLabel, placeArea, placeWhen, nowStamp } from './casePlaces'
import { ITEM_STATUSES, StatusMenu } from './caseStatus'
import { ItemActionsMenu } from './CaseItemActions'
import { InfoRows, type LinkOption } from './CaseInfoRows'
import { CASE_PEOPLE } from '../../../lib/mockData/caseFiles'
import { KindIcon, RootIcon } from './icons'
import { LicensePlate } from '../shared/LicensePlate'
import { findMdc } from './caseMdc'
import { MdcEmployeeDetails, MdcHeaderFlags, MdcMissing, MdcPersonDetails, MdcVehicleDetails, VehiclePhotos } from './CaseMdcPanel'
import { ownPhoto } from '../shared/personPhotos'

export interface InspectorNote {
  path: number[]
  depth: number
  who: string
  when: string
  text: string
}


const KC: Record<string, string> = { evidence: '#B26A00', media: '#B4009E', exam: '#7A57B0', doc: '#03787C', event: '#5C6B70', vehicle: '#C25A1C', place: '#2E8B57', surv: '#B83B5E', note: '#B8860B' }

interface CaseInspectorProps {
  view: 'place-form' | 'item' | 'folder-info' | 'empty'
  accent: string
  onAccent: string

  draftPinLabel: string
  onSavePlace: (p: PlaceFormResult) => void
  onCancelPlace: () => void

  item: CaseTreeItem | null
  itemNotes: InspectorNote[]
  replyToName: string | null
  draft: string
  onDraftChange: (v: string) => void
  onSubmitNote: () => void
  onReply: (note: InspectorNote) => void
  onCancelReply: () => void
  /** Case number the inspector is showing (to leave it out of "Другие дела"). */
  caseNo: string
  /** Open an MDC record in Поиск (by record id), or search Поиск for `label`. */
  onOpenMdc: (recordId: string | null, label: string) => void
  onOpenBolo: () => void
  onChangeItemStatus: (itemId: string, status: string, tone: CaseTone) => void
  onMoveItem: (itemId: string) => void
  onEditItemInfo: (itemId: string, key: string, newKey: string, value: string, refs: string[]) => void
  onOpenRecord: (recordId: string) => void
  onAddPhotos: (itemId: string, files: FileList | null) => void
  onRemovePhoto: (itemId: string, index: number) => void
  onEditPlace: (itemId: string, patch: { title: string; sub: string; placeType: CasePlaceType; when: string; area: CasePlaceArea | null }) => void
  /** live zone being edited (shared with the map) */
  areaDraft: (CasePlaceArea & { id: string }) | null
  onAreaDraft: (d: (CasePlaceArea & { id: string }) | null) => void
  onRepositionPlace: (itemId: string) => void
  onEditEvent: (itemId: string) => void
  onSetPlaceLinks: (placeId: string, links: CasePlaceLink[], change: string) => void
  /** for person / evidence cards: places linked to them */
  linkedPlaces: { place: CaseTreeItem; role: string; folderId: string }[]
  onOpenPlace: (folderId: string, placeId: string) => void
  onAddItemInfo: (itemId: string, key: string, value: string, refs: string[]) => void
  onRemoveItemInfo: (itemId: string, key: string) => void
  linkOptions: LinkOption[]
  autoLinks: AutoLinks
  /** journal rows about the selected record, newest first */
  history: CaseLogRow[]
  onRemoveItem: (itemId: string) => void
  renderLinkedText: (text: string, refIds?: string[]) => ReactNode

  folderIcon: 'root' | 'folder'
  folderColor: string
  folderName: string
  folderSummary: string
  folderRows: [string, ReactNode][]
}

export interface AutoLinks {
  warrants: { code: string; sub: string }[]
  bolo: { no: string; label: string; lastSeen?: string; lastSeenBy?: string } | null
}

/** Folder / case properties: short values, label left and value right. */
function PropRows({ rows, renderLinkedText }: { rows: [string, ReactNode][]; renderLinkedText: (text: string) => ReactNode }) {
  return (
    <div className="rounded-[12px] bg-[#303030] px-3.5">
      {rows.map(([k, v], i) => (
        <div key={k} className={`flex items-start gap-3 py-2.5 text-[13px] ${i === rows.length - 1 ? '' : 'border-b border-[#3A3A3A]'}`}>
          <span className="w-[104px] shrink-0 leading-[20px] text-[#C2C2C2]">{k}</span>
          <span className="min-w-0 flex-1 text-right leading-[20px]">{typeof v === 'string' ? renderLinkedText(v) : v}</span>
        </div>
      ))}
    </div>
  )
}

/** Typical «По делу» fields per record kind, offered when adding one. */
const FIELD_SUGGESTIONS: Partial<Record<CaseTreeItem['kind'], string[]>> = {
  person: ['Роль', 'Задержан', 'Задержал', 'Обвинение', 'Адвокат', 'Вооружён', 'Последний раз видели', 'Опросил', 'Протокол', 'Телефон', 'Приметы', 'Слушание'],
  vehicle: ['Роль', 'Где стоит', 'Последний раз замечена', 'Изъята', 'Номера', 'Приметы', 'Проверил'],
  evidence: ['Изъял', 'Где найдено', 'Экспертиза', 'Хранение'],
  doc: ['Судья', 'Статьи', 'Срок', 'Подписал'],
  exam: ['Эксперт', 'Объект', 'Результат'],
  surv: ['Ответственный', 'Ордер', 'Период'],
  media: ['Источник', 'Длительность', 'Снял'],
  event: ['Где', 'Кто', 'Итог'],
}

/** Info keys that, for an MDC-linked participant, are shown from MDC itself —
 * hidden from "По делу" so nothing is listed twice. */
const MDC_OWNED_KEYS = new Set(['Запись MDC', 'Дата рождения', 'Адрес', 'Телефон', 'Судимости', 'ТС', 'Номер', 'Владелец'])

export function CaseInspector({
  view,
  accent,
  onAccent,
  draftPinLabel,
  onSavePlace,
  onCancelPlace,
  item,
  itemNotes,
  replyToName,
  draft,
  onDraftChange,
  onSubmitNote,
  onReply,
  onCancelReply,
  caseNo,
  onOpenMdc,
  onOpenBolo,
  onChangeItemStatus,
  onMoveItem,
  onEditItemInfo,
  onOpenRecord,
  onAddPhotos,
  onRemovePhoto,
  onEditPlace,
  areaDraft,
  onAreaDraft,
  onRepositionPlace,
  onEditEvent,
  onSetPlaceLinks,
  linkedPlaces,
  onOpenPlace,
  onAddItemInfo,
  onRemoveItemInfo,
  linkOptions,
  autoLinks,
  history,
  onRemoveItem,
  renderLinkedText,
  folderIcon,
  folderColor,
  folderName,
  folderSummary,
  folderRows,
}: CaseInspectorProps) {
  const [viewer, setViewer] = useState<number | null>(null)
  const [newType, setNewType] = useState<CasePlaceType>('other')
  const [editingPlace, setEditingPlace] = useState(false)
  useEffect(() => {
    setViewer(null)
    setEditingPlace(false)
    onAreaDraft(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.id])
  /** Start editing a place: its zone becomes a live draft the map can resize. */
  const startEditPlace = () => {
    if (!item) return
    setEditingPlace(true)
    onAreaDraft({ id: item.id, ...(placeArea(item) ?? { shape: 'circle', r: 0 }) })
  }
  const stopEditPlace = () => {
    setEditingPlace(false)
    onAreaDraft(null)
  }
  if (view === 'place-form') {
    const draftItem: CaseTreeItem = { id: 'new', kind: 'place', title: '', sub: '', status: '', tone: 'grey', date: '', info: [], note: '', placeType: newType, when: nowStamp() }
    return (
      <aside aria-label="Сведения" className="scroll flex w-[340px] shrink-0 flex-col gap-4 overflow-y-auto py-2 pl-1 pr-5 pb-6">
        <div className="relative flex flex-col items-center gap-2.5 rounded-[12px] bg-[#303030] px-4 py-5 text-center">
          <span className="flex h-[72px] w-[72px] items-center justify-center rounded-[18px] text-white" style={{ background: PLACE_TYPE_COLOR[newType] }}>
            <PlaceTypeIcon type={newType} size={34} strokeWidth={1.8} />
          </span>
          <span className="flex flex-col leading-[20px]">
            <span className="text-[16px] font-semibold">Новое место</span>
            <span className="text-[12px] text-[#C2C2C2]">{draftPinLabel}</span>
          </span>
          <PlaceEditForm
            key="new-place"
            item={draftItem}
            titlePlaceholder="Например, гараж на Grove St"
            withPhotos
            area={areaDraft?.id === 'new' ? { shape: areaDraft.shape, r: areaDraft.r } : { shape: 'circle', r: 0 }}
            onAreaChange={(a) => onAreaDraft({ id: 'new', ...a })}
            onTypeChange={setNewType}
            onCancel={onCancelPlace}
            onSave={(p) => {
              onSavePlace(p)
              setNewType('other')
            }}
            saveLabel="Создать"
          />
        </div>
        <div className="px-2 text-[12px] text-[#C2C2C2]">Метку можно передвинуть: нажмите на карту ещё раз в другом месте.</div>
      </aside>
    )
  }

  if (view === 'item' && item) {
    const isPerson = item.kind === 'person'
    const isVehicle = item.kind === 'vehicle'
    const isPlace = item.kind === 'place'
    const link = isPerson || isVehicle ? findMdc(item) : null
    const plate = item.info.find(([k, v]) => k === 'Номер' && /^\d{1,2}[A-Z]{3}\d{3}$/.test(v))?.[1]
    const unidentified = isPerson && !link && /^(Неизвестн|Неустановл)/.test(item.title)
    const confidential = isPerson && !link && (item.status === 'Конфиденциально' || item.info.some(([k]) => k === 'Куратор'))
    const hideAuto = (k: string) => (autoLinks.warrants.length > 0 && /^Ордер/.test(k)) || (!!autoLinks.bolo && k === 'Ориентировка') || (!!autoLinks.bolo?.lastSeen && /^Последний раз/.test(k))
    const caseRows = (link ? item.info.filter(([k]) => !MDC_OWNED_KEYS.has(k)) : item.info).filter(([k]) => !hideAuto(k))
    const autoRows = [
      ...(autoLinks.warrants.length ? [{ k: autoLinks.warrants.length > 1 ? 'Ордера' : 'Ордер', hint: 'Найден автоматически среди документов дела', v: <span className="flex flex-col gap-1">{autoLinks.warrants.map((w) => <span key={w.code}>{renderLinkedText(w.code)} <span className="text-[#C2C2C2]">{w.sub}</span></span>)}</span> }] : []),
      ...(autoLinks.bolo?.lastSeen ? [{ k: isVehicle ? 'Последний раз замечена' : 'Последний раз видели', hint: 'Последняя отметка «Замечен» в ориентировке BOLO', v: <span>{autoLinks.bolo.lastSeen}{autoLinks.bolo.lastSeenBy && <span className="block text-[12px] text-[#C2C2C2]">отметил {autoLinks.bolo.lastSeenBy}</span>}</span> }] : []),
      ...(autoLinks.bolo ? [{ k: 'Ориентировка', hint: 'Подтянуто из реестра BOLO', v: <span>{renderLinkedText(autoLinks.bolo.no)} <span className="text-[#C2C2C2]">{autoLinks.bolo.label}</span></span> }] : []),
    ]
    const photo = isPerson ? ownPhoto(link?.rec.id, item.title) : null

    return (
      <aside aria-label="Сведения" className="scroll flex w-[340px] shrink-0 flex-col gap-4 overflow-y-auto py-2 pl-1 pr-5 pb-6">
        <div className="relative flex flex-col items-center gap-2.5 rounded-[12px] bg-[#303030] px-4 py-5 text-center">
          <ItemActionsMenu
            canMove={!isPlace}
            onMove={() => onMoveItem(item.id)}
            onRemove={() => onRemoveItem(item.id)}
            removeLabel={isPlace ? 'Удалить метку' : item.kind === 'event' ? 'Удалить событие' : 'Убрать из дела'}
            overCover={isPlace && !!item.photos?.length}
            actions={
              isPlace
                ? [
                    { label: 'Изменить метку', onClick: startEditPlace, icon: <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12.5 4.5l3 3L7 16H4v-3z" /></svg> },
                    { label: 'Переставить на карте', onClick: () => onRepositionPlace(item.id), icon: <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><circle cx="10" cy="10" r="6" /><path d="M10 1.5v4M10 14.5v4M1.5 10h4M14.5 10h4" /></svg> },
                  ]
                : item.kind === 'event'
                  ? [{ label: 'Изменить событие', onClick: () => onEditEvent(item.id), icon: <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12.5 4.5l3 3L7 16H4v-3z" /></svg> }]
                  : []
            }
          />
          {isPerson ? (
            <div
              className="relative h-[164px] w-[132px] overflow-hidden rounded-[10px] bg-[#3A3F47]"
              style={{ backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0, transparent 19px, rgba(255,255,255,0.07) 19px, rgba(255,255,255,0.07) 20px)' }}
            >
              {photo ? (
                <img src={photo} alt="Фото" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
              ) : (
                <svg width="96" height="112" viewBox="0 0 96 112" aria-hidden="true" className="absolute bottom-[22px] left-[18px]">
                  <circle cx="48" cy="38" r="22" fill="rgba(255,255,255,0.16)" />
                  <path d="M8 112c0-26 18-42 40-42s40 16 40 42z" fill="rgba(255,255,255,0.16)" />
                </svg>
              )}
              {unidentified && <span className="absolute bottom-0 left-0 right-0 flex h-[22px] items-center justify-center bg-black/55 text-[10px] font-semibold tracking-wide text-white">ЛИЧНОСТЬ НЕ УСТАНОВЛЕНА</span>}
            </div>
          ) : isVehicle ? (
            <VehiclePhotos known={!!plate} />
          ) : item.kind === 'place' && item.photos?.length ? (
            <PhotoCover photos={item.photos} onOpen={setViewer} />
          ) : (
            <span className="flex h-[72px] w-[72px] items-center justify-center rounded-[18px] text-white" style={{ background: item.kind === 'place' && item.placeType ? PLACE_TYPE_COLOR[item.placeType] : KC[item.kind] }}>
              {item.kind === 'place' ? <PlaceTypeIcon type={item.placeType} size={34} strokeWidth={1.8} /> : <KindIcon kind={item.kind} className="h-8 w-8" />}
            </span>
          )}
          {isVehicle && plate && <LicensePlate plate={plate} />}
          {isPlace && editingPlace ? (
            <PlaceEditForm
              item={item}
              area={areaDraft?.id === item.id ? { shape: areaDraft.shape, r: areaDraft.r } : (placeArea(item) ?? { shape: 'circle', r: 0 })}
              onAreaChange={(a) => onAreaDraft({ id: item.id, ...a })}
              onCancel={stopEditPlace}
              onSave={(p) => {
                onEditPlace(item.id, p)
                stopEditPlace()
              }}
              onReposition={() => {
                stopEditPlace()
                onRepositionPlace(item.id)
              }}
            />
          ) : (
            <div>
              <div className="text-[18px] font-semibold leading-6">{item.title}</div>
              <div className="text-[13px] text-[#C2C2C2]">{item.info.find(([k]) => k === 'Роль')?.[1] ?? item.sub}</div>
              {isPlace && (
                <div className="mt-1 flex flex-wrap items-center justify-center gap-x-2 text-[12px] text-[#C2C2C2]">
                  <span className="inline-flex items-center gap-1">
                    <svg width="11" height="11" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                      <circle cx="10" cy="10" r="7" />
                      <path d="M10 6v4l2.5 2" />
                    </svg>
                    {placeWhen(item)}
                  </span>
                  {placeArea(item) && <span>· зона: {areaLabel(placeArea(item))}</span>}
                </div>
              )}
              {isPlace && (
                <span className="mt-2 inline-flex items-center gap-1.5 rounded-[10px] bg-white/[0.08] px-2.5 py-0.5 text-[12px] font-semibold text-[#C8C8C8]">
                  <span style={{ color: item.placeType ? PLACE_TYPE_COLOR[item.placeType] : '#2E8B57' }}>
                    <PlaceTypeIcon type={item.placeType} size={12} strokeWidth={2.4} />
                  </span>
                  {item.placeType ? PLACE_TYPE_LABEL[item.placeType] : item.status}
                </span>
              )}
            </div>
          )}
          {isPlace ? null : ITEM_STATUSES[item.kind] ? (
            <StatusMenu status={item.status} tone={item.tone} options={ITEM_STATUSES[item.kind]!} onChange={(st, tone) => onChangeItemStatus(item.id, st, tone)} align="center" label="Статус записи" />
          ) : (
            <span className="rounded-[10px] px-3 py-0.5 text-[12px] font-semibold" style={{ background: 'rgba(255,255,255,0.08)', color: '#C8C8C8' }}>
              {item.status}
            </span>
          )}
          {link && <MdcHeaderFlags link={link} onOpenBolo={onOpenBolo} />}
          {link && (
            <div className="mt-1 flex w-full gap-2">
              <button type="button" onClick={() => onOpenMdc(link.rec.id, link.rec.plate ?? link.rec.title)} className="flex h-[34px] flex-1 items-center justify-center gap-1.5 rounded-[8px] bg-[#3A3A3A] text-[13px] hover:brightness-125">
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 3.5h5.5V9M16.5 3.5L9 11M14 12v4.5H3.5V6H8" />
                </svg>
                {isVehicle ? 'Карточка ТС в Поиске' : 'Полное досье в Поиске'}
              </button>
            </div>
          )}
        </div>

        {item.kind === 'note' && <CaseNotePreview noteId={item.noteId} />}

        <div>
          <div className="mb-1.5 ml-1 text-[13px] font-semibold text-[#C2C2C2]">{isPerson || isVehicle ? 'По делу' : 'Сведения'}</div>
          <InfoRows
            rows={caseRows}
            renderLinkedText={renderLinkedText}
            rowRefs={item.refs ?? {}}
            onEdit={(k, nk, v, refs) => onEditItemInfo(item.id, k, nk, v, refs)}
            onOpenRef={onOpenRecord}
            onAdd={(k, v, refs) => onAddItemInfo(item.id, k, v, refs)}
            onRemove={(k) => onRemoveItemInfo(item.id, k)}
            lockedKeys={['Добавил', 'Тип', 'Автор', 'Прикрепил']}
            suggestions={FIELD_SUGGESTIONS[item.kind] ?? []}
            linkOptions={linkOptions}
            autoRows={autoRows}
          />
        </div>

        {isPlace && <PlaceLinksSection links={item.placeLinks ?? []} options={linkOptions} onChange={(l, change) => onSetPlaceLinks(item.id, l, change)} onOpen={onOpenRecord} />}
        {isPlace && <PhotosSection photos={item.photos ?? []} onAdd={(files) => onAddPhotos(item.id, files)} onRemove={(i) => onRemovePhoto(item.id, i)} viewerIndex={viewer} setViewerIndex={setViewer} />}
        {(isPerson || item.kind === 'evidence') && <RecordPlacesSection places={linkedPlaces} onOpen={onOpenPlace} />}

        <div>
          <div className="mb-1.5 ml-1 flex items-center text-[13px] font-semibold text-[#C2C2C2]">
            <span className="flex-1">Заметки · {itemNotes.length}</span>
          </div>
          <div className="flex flex-col gap-2.5 rounded-[12px] bg-[#303030] p-2">
            {itemNotes.map((n) => {
              const pp = CASE_PEOPLE[n.who]
              return (
                <div key={n.path.join('.')} className="flex gap-2.5 border-t border-[#3A3A3A] pt-2.5 mx-1.5 first:border-t-0 first:pt-1.5" style={{ marginLeft: n.depth ? n.depth * 20 : 0 }}>
                  <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white" style={{ background: pp?.color ?? '#5C6B70' }}>
                    {pp?.initials ?? (n.who.replace(/[^А-ЯA-Z]/g, '').slice(0, 2) || '?')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-1.5 leading-[18px]">
                      <span className="truncate text-[13px] font-semibold">{pp?.name ?? n.who}</span>
                      <span className="shrink-0 text-[11px] text-[#C2C2C2]">{n.when}</span>
                    </div>
                    <div className="text-[13px] leading-[19px]">{n.text}</div>
                    <button type="button" onClick={() => onReply(n)} className="-ml-1 mt-0.5 h-[22px] rounded-[4px] px-1 text-[12px] text-[#C2C2C2] hover:bg-white/10">
                      Ответить
                    </button>
                  </div>
                </div>
              )
            })}
            {replyToName && (
              <div className="mx-1.5 flex items-center gap-1.5 text-[12px] text-[#C2C2C2]">
                <span className="flex-1">Ответ для {replyToName}</span>
                <button type="button" onClick={onCancelReply} aria-label="Отменить ответ" className="flex h-5 w-5 items-center justify-center rounded-[4px] hover:bg-white/10">
                  <svg width="9" height="9" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                    <path d="M5 5l10 10M15 5L5 15" />
                  </svg>
                </button>
              </div>
            )}
            <label className="flex h-9 items-center gap-1.5 rounded-[8px] bg-[#3A3A3A] py-0 pl-2.5 pr-1 text-[#C2C2C2]">
              <input
                value={draft}
                onChange={(e) => onDraftChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onSubmitNote()
                }}
                placeholder={replyToName ? 'Ответ…' : 'Добавить заметку…'}
                aria-label="Новая заметка"
                className="min-w-0 flex-1 bg-transparent text-[13px] text-white outline-none"
              />
              <button type="button" onClick={onSubmitNote} aria-label="Добавить заметку" style={{ background: accent, color: onAccent }} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px]">
                <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 16V4M5 9l5-5 5 5" />
                </svg>
              </button>
            </label>
          </div>
        </div>

        {(isPerson || isVehicle) && (
          <div className="-mb-1 mt-1 flex items-center gap-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-[#9A9A9A]">
            <span className="h-px flex-1 bg-[#3A3A3A]" />
            Данные MDC · обновляются из Поиска
            <span className="h-px flex-1 bg-[#3A3A3A]" />
          </div>
        )}
        {link && isPerson && link.emp && <MdcEmployeeDetails link={link} />}
        {link && isPerson && !link.emp && <MdcPersonDetails link={link} caseNo={caseNo} open={(id, label) => onOpenMdc(id, label ?? '')} />}
        {link && isVehicle && <MdcVehicleDetails link={link} caseNo={caseNo} open={(id, label) => onOpenMdc(id, label ?? '')} />}
        {!link && isPerson && !unidentified && !confidential && (
          <MdcMissing
            title="Нет записи в MDC"
            text="Участник пока не связан с записью в базе. Найдите его в Поиске, чтобы здесь появились документы, лицензии, судимости и транспорт."
            action={{ label: 'Найти в Поиске', onClick: () => onOpenMdc(null, item.title) }}
          />
        )}
        {!link && isPerson && unidentified && <MdcMissing title="Личность не установлена" text="Когда личность установят, свяжите участника с записью в MDC — данные подтянутся сюда автоматически." />}
        {!link && isPerson && confidential && <MdcMissing title="Данные скрыты" text="Личность источника известна только куратору и в MDC не показывается." />}
        {!link && isVehicle && (
          <MdcMissing
            title={plate ? `Номер ${plate} не найден в MDC` : 'Номер не установлен'}
            text={plate ? 'ТС не зарегистрировано в DMV или номер подменён. Проверьте VIN при осмотре.' : 'Регистрация появится, когда номер или VIN установят.'}
            action={plate ? { label: 'Проверить в Поиске', onClick: () => onOpenMdc(null, plate) } : undefined}
          />
        )}

        {item.chain && item.chain.length > 0 && (
          <div>
            <div className="mb-1.5 ml-1 text-[13px] font-semibold text-[#C2C2C2]">Цепочка хранения</div>
            <div className="rounded-[12px] bg-[#303030] px-3.5 pb-1 pt-3.5">
              {item.chain.map(([t, v], i) => (
                <div key={t + v} className="flex gap-3">
                  <span className="flex w-2.5 flex-col items-center">
                    <span className="mt-[5px] h-2.5 w-2.5 rounded-full" style={{ background: accent }} />
                    {i < item.chain!.length - 1 && <span className="w-[2px] flex-1 bg-[#4A4A4A]" />}
                  </span>
                  <span className="flex flex-1 flex-col pb-3">
                    <span className="text-[13px]">{v}</span>
                    <span className="text-[12px] text-[#C2C2C2]">{t}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <ItemHistory history={history} fallbackBy={item.info.find(([k]) => k === 'Добавил')?.[1]} fallbackDate={item.date} />
      </aside>
    )
  }

  if (view === 'folder-info') {
    return (
      <aside aria-label="Сведения" className="scroll flex w-[340px] shrink-0 flex-col gap-4 overflow-y-auto py-2 pl-1 pr-5 pb-6">
        <div className="flex flex-col items-center gap-2.5 rounded-[12px] bg-[#303030] px-4 py-5 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-[16px] text-white" style={{ background: folderColor }}>
            {folderIcon === 'root' ? <RootIcon className="h-[30px] w-[30px]" /> : (
              <svg width="30" height="30" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
                <path d="M2.5 5.5v10h15v-8h-7l-2-2z" />
              </svg>
            )}
          </span>
          <div>
            <div className="text-[18px] font-semibold leading-6">{folderName}</div>
            <div className="text-[13px] text-[#C2C2C2]">{folderSummary}</div>
          </div>
        </div>
        <div>
          <div className="mb-1.5 ml-1 text-[13px] font-semibold text-[#C2C2C2]">Свойства</div>
          <PropRows rows={folderRows} renderLinkedText={renderLinkedText} />
        </div>
        <div className="px-3 text-center text-[12px] text-[#C2C2C2]">Выберите запись, чтобы увидеть подробности.</div>
      </aside>
    )
  }

  return <aside aria-label="Сведения" className="w-[340px] shrink-0" />
}
