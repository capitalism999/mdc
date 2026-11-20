import { useState } from 'react'
import type { Bolo } from '../../../types'
import { ACCENT, C, ON_ACCENT, TONE, type BoloUIState } from './BoloApp'
import { nearestPlace } from './BoloMap'
import { CloseIcon, PathIcon, PlusIcon } from './icons'
import { ownPhoto } from '../shared/personPhotos'

interface NewProps {
  state: BoloUIState
  patch: (p: Partial<BoloUIState>) => void
  onPublish: (b: Bolo) => void
}

const N_TYPES = [
  ['Человек', 'M10 9a3.2 3.2 0 100-6.4A3.2 3.2 0 0010 9zM3.5 17.5c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6'],
  ['Транспорт', 'M3 13v-3l2-4h10l2 4v3zM3 13v2h2v-2M15 13v2h2v-2M6 10.5h.5M13.5 10.5h.5'],
  ['Пропавший', 'M10 17.5a7.5 7.5 0 100-15 7.5 7.5 0 000 15zM7.8 7.8a2.3 2.3 0 114.4 1c-.5.9-2.2 1.3-2.2 2.7M10 14h.01'],
  ['Другое', 'M5 2.5h7l3 3v12H5zM8 9h4M8 12h4M8 15h2'],
]
const VIDS: ['wanted' | 'special' | 'poi' | 'missing' | 'alert', string][] = [
  ['wanted', 'Разыскивается'], ['special', 'Особый розыск'], ['poi', 'Лицо, представляющее интерес'], ['missing', 'Пропал без вести'], ['alert', 'Оповещение населения'],
]
const VID_HINT = [
  'Обычный розыск: подозреваемый, ордер, угнанная машина.',
  'Опасный или приоритетный: метка в рации, всплывает у всех на смене со звуком.',
  'Не обвиняется, но нужен для разговора: свидетель, возможный участник.',
  'Человек пропал, ищем, чтобы помочь. Статья не нужна.',
  'Предупреждение жителям: мошенники, опасный район, сбежавшее животное.',
]
const PCN: Record<string, string> = {
  '207': 'Нападение со смертоносным оружием', '215': 'Ограбление', '216': 'Вооружённое ограбление', '302': 'Кража со взломом',
  '304': 'Крупная кража', '306': 'Угон транспортного средства', '313': 'Кража регистрационных знаков', '702': 'Хранение запрещённого огнестрельного оружия',
}
const CTS: [string, string, string][] = [
  ['Thorne Watts', 'Deputy Sheriff (Bonus I) · Mission Row', '555-0121'],
  ['Raul Moreno', 'Detective Sergeant · LSPD, отдел расследований', '555-0142'],
  ['Kevin Ortega', 'Deputy Sheriff · LSSD, Sandy Shores', '555-0177'],
]
const TERMS = ['24 часа', '3 дня', '7 дней', 'До отмены']
const ZONES = ['Весь округ', 'Los Santos', 'Sandy Shores', 'Paleto Bay', 'Vespucci и Del Perro']
const ACCS = [
  ['Все агентства', 'LSPD, LSSD, SAHP, FIB видят и получают уведомление'],
  ['Только LSPD', 'Другие агентства не видят карточку'],
  ['Отдел расследований', 'Видят детективы. Патруль при пробивке номера видит только «есть закрытая ориентировка» и контакт'],
  ['Выбранные сотрудники', 'Только те, кого вы добавите'],
]

function Toggle({ on, tone = ACCENT }: { on: boolean; tone?: string }) {
  return (
    <span className="relative h-5 w-10 shrink-0 rounded-[10px] box-border" style={{ background: on ? tone : 'transparent', border: `1px solid ${on ? tone : C.stroke2}` }}>
      <span className="absolute left-0.5 top-0.5 h-3.5 w-3.5 rounded-full transition-transform" style={{ background: on ? '#000' : C.text2, transform: on ? 'translateX(20px)' : 'translateX(0)' }} />
    </span>
  )
}

export function BoloNew({ state, patch, onPublish }: NewProps) {
  const [nPlaceInstr, setNPlaceInstr] = useState(state.nInstruction)
  // Who the BOLO is about: the person sent from Поиск, or the form's own example.
  const subj = state.nSubject
  const sName = subj ? subj.name : 'Daniel Reyes'
  const sCode = subj ? subj.code : 'CIT-60214'
  const sPhoto = subj ? ownPhoto(subj.recId, subj.name) : null
  /** «Мужчина · 12.03.1997 · 29 лет» → «Мужчина, 29 лет» */
  const sSexAge = subj ? subj.sub.split(' · ').filter((_x, i, a) => i === 0 || i === a.length - 1).join(', ') : 'Мужчина, 31 год'
  const [signs, setSigns] = useState(subj ? `${sSexAge}.${subj.reason ? ' ' + subj.reason : ''}` : 'Мужчина, 31 год, 175 см, плотный. Татуировка на левом предплечье, чёрная кепка, светлая толстовка. На записи камеры парковки садится в Zentorno.')
  const zonesOn = ZONES.filter((_, i) => state.nZone[i])
  const prioT = ['Низкий', 'Средний', 'Высокий'][state.nPrio]
  const pcSel = Object.keys(state.nPc).filter((k) => state.nPc[k])
  const pcQ = state.nPcQ.toLowerCase()
  const pcSug = Object.keys(PCN)
    .filter((k) => !state.nPc[k] && (!pcQ || k.indexOf(pcQ) === 0 || PCN[k].toLowerCase().includes(pcQ)))
    .slice(0, 3)
  const isVeh = state.nType === 1
  const placeText = state.nPlace ? `${nearestPlace(state.nPlace.x, state.nPlace.y)}${state.nPlace.acc === 2 ? ' (район)' : state.nPlace.acc === 1 ? ' (±200 м)' : ''} · 17.11, 02:15` : 'Rockford Hills, камера парковки · 17.11, 02:15'

  function publish() {
    const contact = CTS[state.nCt]
    const b: Bolo = {
      id: 'b421', no: 'B-0421', src: 'lspd', kind: state.nType === 0 ? 'person' : isVeh ? 'veh' : state.nType === 2 ? 'missing' : 'unknown',
      vid: VIDS[state.nVid][0], prio: (['low', 'mid', 'high'] as const)[state.nPrio], status: 'open', armed: state.armed,
      title: sName, sub: subj ? `${sCode} · ${subj.vid === 2 ? 'нужен для опроса' : 'разыскивается'}` : 'CIT-60214 · подозреваемый в угоне', reason: subj ? (subj.reason || VIDS[state.nVid][1]).toUpperCase() : 'УГОН PEGASSI ZENTORNO',
      penalCodes: pcSel, contact: { name: contact[0], role: contact[1], phone: contact[2] },
      facts: [
        ...(subj ? [{ label: 'Пол, возраст', value: sSexAge }] : [{ label: 'Пол, возраст', value: 'Мужчина, 31 год' }, { label: 'Рост', value: '175 см' }, { label: 'Одежда', value: 'Чёрная кепка, светлая толстовка' }]),
        { label: 'Зона', value: zonesOn.join(', ') || 'Весь округ' }, { label: 'Действует до', value: TERMS[state.nTerm] },
        ...(subj ? [] : [{ label: 'Связано', value: 'B-0419 · Zentorno', linkBoloId: 'b419' }]),
      ],
      description: subj ? signs : 'Плотного телосложения, татуировка на левом предплечье. На записи камеры парковки в Rockford Hills садится в угнанный Zentorno.',
      tags: subj ? [] : ['Татуировка на предплечье', 'Чёрная кепка'],
      instruction: nPlaceInstr,
      photos: subj ? [{ caption: 'Из личного дела', icon: 'mug' }] : [{ caption: 'Из личного дела', icon: 'mug' }, { caption: 'Камера парковки', icon: 'cam' }],
      links: subj ? [{ label: 'Личное дело', value: `${sName} · ${sCode}`, kind: 'person' }] : [{ label: 'Личное дело', value: 'Daniel Reyes · CIT-60214', kind: 'person' }, { label: 'Транспорт', value: 'Zentorno 5ZEN771 · BOLO B-0419', kind: 'bolo', id: 'b419' }],
      sightings: [{ place: 'Rockford Hills', when: '17.11, 02:15', text: 'Камера парковки.', who: 'Видеозапись', x: state.nPlace?.x ?? 30, y: state.nPlace?.y ?? 61.5 }],
      acknowledgedOf: 0, acknowledgedTotal: 52, author: '12D3 Thorne Watts', created: '17.11, 16:20', ago: 'сейчас', unread: false,
    }
    onPublish(b)
  }

  return (
    <div className="flex min-h-0 flex-1">
      <div className="scroll flex-1 overflow-y-auto px-8 pb-7 pt-4.5">
        <div className="flex flex-col gap-3.5">
          <div className="flex items-center gap-2.5">
            <button type="button" onClick={() => patch({ view: 'feed' })} aria-label="Назад" className="flex h-8 w-8 items-center justify-center rounded-[6px] hover:bg-white/10">
              <PathIcon d="M12.5 4.5L7 10l5.5 5.5" className="h-3.5 w-3.5" />
            </button>
            <span className="text-[22px] font-semibold leading-[30px]">Новая ориентировка</span>
          </div>

          <div className="flex items-center gap-2 rounded-[8px] px-3 py-2 text-[13px]" style={{ background: C.card }}>
            <span style={{ color: C.text2 }}>Источник</span>
            <span className="flex h-[22px] items-center rounded-[4px] px-2 text-[12px] font-bold" style={{ background: TONE.blue[0], color: TONE.blue[1] }}>
              LSPD
            </span>
            <span>Полиция Лос-Сантоса · Mission Row</span>
            <span className="flex-1" />
            <span className="text-[12px]" style={{ color: C.text2 }}>
              берётся из вашей учётной записи
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold">Кого или что ищем</span>
            <div className="flex gap-1.5">
              {N_TYPES.map((t, i) => {
                const on = state.nType === i
                return (
                  <button key={t[0]} type="button" onClick={() => patch({ nType: i })} className="flex h-14 flex-1 flex-col items-center justify-center gap-0.5 rounded-[8px] hover:brightness-110" style={{ background: on ? C.sel : C.card, boxShadow: on ? `inset 0 0 0 2px ${ACCENT}` : 'none' }}>
                    <PathIcon d={t[1]} className="h-[18px] w-[18px]" />
                    <span className="text-[13px]" style={{ fontWeight: on ? 600 : 400 }}>
                      {t[0]}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold">Из базы</span>
            {!state.nDup ? (
              <div className="flex items-center gap-2.5 rounded-[8px] p-2" style={{ background: C.card }}>
                <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-[6px]" style={{ background: C.mug }}>
                  {sPhoto && <img src={sPhoto} alt="" className="absolute inset-0 z-10 h-full w-full object-cover" />}
                  <svg width="32" height="36" viewBox="0 0 96 112" className="absolute bottom-0 left-0.5" aria-hidden="true">
                    <circle cx="48" cy="38" r="22" fill="rgba(255,255,255,0.16)" />
                    <path d="M8 112c0-26 18-42 40-42s40 16 40 42z" fill="rgba(255,255,255,0.16)" />
                  </svg>
                </span>
                <span className="flex min-w-0 flex-1 flex-col leading-[17px]">
                  <span className="font-semibold" style={{ color: C.link }}>
                    {sName} · {sCode}
                  </span>
                  <span className="text-[12px]" style={{ color: C.text2 }}>
                    {subj ? `Из Поиска: ${subj.sub}` : 'Фото, рост, приметы и транспорт подставлены из личного дела'}
                  </span>
                </span>
                <button type="button" onClick={() => patch({ nDup: true, nType: 1 })} className="h-7 rounded-[6px] px-2.5 text-[13px] hover:brightness-110" style={{ background: C.btn }}>
                  Другой
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2.5 rounded-[8px] p-2" style={{ background: C.card }}>
                  <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-[6px]" style={{ background: C.photoSky }}>
                    <svg width="32" height="20" viewBox="0 0 100 60" className="absolute left-0.5 top-2" aria-hidden="true">
                      <path d="M6 46v-5l4-3 9-10c2-2 5-4 9-4h30c4 0 7 2 10 5l7 7 14 2c3 1 5 3 5 6v2z" fill="#E3B505" />
                    </svg>
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col leading-[17px]">
                    <span className="font-semibold" style={{ color: C.link }}>
                      Pegassi Zentorno · 5ZEN771
                    </span>
                    <span className="text-[12px]" style={{ color: C.text2 }}>
                      Из DMV: жёлтый, владелец Lee Han
                    </span>
                  </span>
                  <button type="button" onClick={() => patch({ nDup: false, nType: 0 })} className="h-7 rounded-[6px] px-2.5 text-[13px] hover:brightness-110" style={{ background: C.btn }}>
                    Другой
                  </button>
                </div>
                <div className="flex items-center gap-3 rounded-[8px] px-3.5 py-3" style={{ background: TONE.amber[0] }}>
                  <PathIcon d="M7 7h9v10H7zM4 13V3h9" className="h-[18px] w-[18px] shrink-0" style={{ color: TONE.amber[1] }} />
                  <span className="flex min-w-0 flex-1 flex-col leading-[18px]">
                    <span className="font-semibold" style={{ color: TONE.amber[1] }}>
                      На этот номер уже есть ориентировка B-0419
                    </span>
                    <span className="truncate text-[12px]" style={{ color: C.text2 }}>
                      Разыскивается · угон · LSSD, помощник шерифа Kevin Ortega · 8 ч назад · 30 из 52 ознакомились
                    </span>
                  </span>
                  <button type="button" onClick={() => patch({ view: 'feed', nav: 'active', sel: 'b419', nDup: false })} className="shrink-0 whitespace-nowrap rounded-[6px] px-2.5 py-1.5 text-[13px] hover:brightness-110" style={{ background: C.btn }}>
                    Открыть
                  </button>
                  <button
                    type="button"
                    onClick={() => patch({ view: 'feed', nav: 'active', sel: 'b419', nDup: false, dlg: 'update', updWhat: { 2: true }, updText: 'Подозреваемый: Daniel Reyes (CIT-60214), на записи камеры садится в машину.' })}
                    className="shrink-0 whitespace-nowrap rounded-[6px] px-3 py-1.5 text-[13px] font-semibold hover:brightness-110"
                    style={{ background: ACCENT, color: ON_ACCENT }}
                  >
                    Дополнить её
                  </button>
                </div>
                <button type="button" onClick={() => patch({ nDup: false })} className="self-start text-[13px] hover:underline" style={{ color: C.link }}>
                  Это другая машина, создать отдельную
                </button>
              </div>
            )}
            <span className="text-[12px]" style={{ color: C.text2 }}>
              Если человек или машина неизвестны, оставьте пустым и опишите приметы ниже.
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold">Вид ориентировки</span>
            <div className="flex flex-wrap gap-1.5">
              {VIDS.map((v, i) => {
                const on = state.nVid === i
                return (
                  <button key={v[0]} type="button" onClick={() => patch({ nVid: i })} className="h-[30px] whitespace-nowrap rounded-[15px] px-3 text-[13px] hover:brightness-110" style={{ background: on ? '#FFFFFF' : C.btn, color: on ? '#1B1B1B' : C.text, fontWeight: on ? 600 : 400 }}>
                    {v[1]}
                  </button>
                )
              })}
            </div>
            <span className="text-[12px]" style={{ color: C.text2 }}>
              {VID_HINT[state.nVid]}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div className="flex min-w-0 flex-col gap-1.5">
              <span className="flex items-baseline gap-2">
                <span className="text-[13px] font-semibold">Статья Penal Code</span>
                {state.nVid >= 3 && (
                  <span className="text-[12px]" style={{ color: C.text2 }}>
                    необязательно
                  </span>
                )}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {pcSel.map((k) => (
                  <span key={k} className="flex h-[30px] items-center gap-1.5 whitespace-nowrap rounded-[15px] py-0 pl-3 pr-1" style={{ background: C.btn }}>
                    <span className="font-semibold" style={{ color: C.link }}>
                      PC {k}
                    </span>
                    {PCN[k]}
                    <button
                      type="button"
                      onClick={() => {
                        const m = { ...state.nPc }
                        delete m[k]
                        patch({ nPc: m })
                      }}
                      aria-label="Убрать статью"
                      className="flex h-5 w-5 items-center justify-center rounded-full hover:bg-white/10"
                      style={{ color: C.text2 }}
                    >
                      <CloseIcon className="h-2.5 w-2.5" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                value={state.nPcQ}
                onChange={(e) => patch({ nPcQ: e.target.value })}
                placeholder="Номер или название статьи"
                className="h-[34px] rounded-[6px] px-2.5 text-[14px]"
                style={{ background: C.field, borderBottom: `1px solid ${C.stroke2}`, color: C.text }}
              />
              <div className="flex flex-col overflow-hidden rounded-[6px]" style={{ background: C.card }}>
                {pcSug.map((k) => (
                  <button key={k} type="button" onClick={() => patch({ nPc: { ...state.nPc, [k]: true }, nPcQ: '' })} className="flex h-[30px] min-w-0 items-center gap-2 px-2.5 text-left hover:bg-white/5">
                    <PlusIcon className="h-3 w-3 shrink-0" style={{ color: C.text2 }} />
                    <span className="whitespace-nowrap font-semibold">PC {k}</span>
                    <span className="truncate text-[13px]" style={{ color: C.text2 }}>
                      {PCN[k]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex min-w-0 flex-col gap-1.5">
              <span className="flex items-baseline gap-2">
                <span className="text-[13px] font-semibold">С кем связаться</span>
                <span className="text-[12px]" style={{ color: C.text2 }}>
                  видно в карточке и на листовке
                </span>
              </span>
              <div className="flex flex-col gap-1">
                {CTS.map((ct, i) => {
                  const on = state.nCt === i
                  return (
                    <button key={ct[0]} type="button" onClick={() => patch({ nCt: i })} className="flex items-center gap-2.5 rounded-[8px] px-2.5 py-1.5 text-left hover:brightness-110" style={{ background: on ? C.sel : C.card, boxShadow: on ? `inset 0 0 0 1px ${ACCENT}` : 'none' }}>
                      <span className="box-border h-4 w-4 shrink-0 rounded-full" style={{ border: on ? `5px solid ${ACCENT}` : `1.5px solid ${C.text2}` }} />
                      <span className="flex min-w-0 flex-1 flex-col leading-[17px]">
                        <span className="truncate font-semibold">{ct[0]}</span>
                        <span className="truncate text-[12px]" style={{ color: C.text2 }}>
                          {ct[1]} · {ct[2]}
                        </span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div className="flex flex-col gap-1.5">
              <span className="text-[13px] font-semibold">Приоритет</span>
              <div className="flex gap-0.5 rounded-[8px] p-0.5" style={{ background: C.card }}>
                {['Низкий', 'Средний', 'Высокий'].map((t, i) => {
                  const on = state.nPrio === i
                  const tone = (['grey', 'amber', 'red'] as const)[i]
                  return (
                    <button key={t} type="button" onClick={() => patch({ nPrio: i })} className="h-[30px] flex-1 rounded-[6px] text-center text-[13px] hover:shadow-[inset_0_0_0_999px_rgba(255,255,255,0.08)]" style={{ background: on ? TONE[tone][0] : 'transparent', color: on ? TONE[tone][1] : C.text2, fontWeight: on ? 600 : 400 }}>
                      {t}
                    </button>
                  )
                })}
              </div>
            </div>
            <button type="button" onClick={() => patch({ armed: !state.armed })} className="mt-[22px] flex items-center gap-3 rounded-[8px] px-3 py-2.5 hover:brightness-110" style={{ background: state.armed ? TONE.red[0] : C.card }}>
              <Toggle on={state.armed} tone={TONE.red[1]} />
              <span className="flex flex-col text-left leading-[17px]">
                <span className="font-semibold" style={{ color: state.armed ? TONE.red[1] : C.text }}>
                  Вооружён и опасен
                </span>
                <span className="text-[12px]" style={{ color: C.text2 }}>
                  Метка видна на карточке и в рации
                </span>
              </span>
            </button>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold">Приметы</span>
            <textarea
              rows={3}
              value={signs}
              onChange={(e) => setSigns(e.target.value)}
              className="resize-none rounded-[6px] px-2.5 py-2 text-[14px] leading-5"
              style={{ background: C.field, borderBottom: `1px solid ${C.stroke2}`, color: C.text }}
            />
          </label>

          <div className="flex flex-col gap-1.5">
            <span className="flex items-baseline gap-2">
              <span className="text-[13px] font-semibold">Фото</span>
              <span className="text-[12px]" style={{ color: C.text2 }}>
                первое попадёт на карточку и листовку · до 6 штук
              </span>
            </span>
            <div className="grid grid-cols-6 gap-2">
              {Array.from({ length: state.nPhotoN }).map((_, i) => (
                <span key={i} className="relative block aspect-[4/3] overflow-hidden rounded-[8px]" style={{ background: C.mug }}>
                  {i === 0 && (
                    <span className="absolute left-1 top-1 rounded-[4px] px-1.5 text-[10px] font-bold leading-4" style={{ background: ACCENT, color: ON_ACCENT }}>
                      Главное
                    </span>
                  )}
                </span>
              ))}
              {state.nPhotoN < 3 && (
                <button type="button" onClick={() => patch({ nPhotoN: Math.min(3, state.nPhotoN + 1) })} className="flex aspect-[4/3] flex-col items-center justify-center gap-0.5 rounded-[8px] border border-dashed text-center text-[11px] hover:bg-white/5" style={{ borderColor: C.stroke2, color: C.text2 }}>
                  <PlusIcon className="h-4 w-4" />
                  Перетащите или выберите
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-[1.2fr_1fr] gap-3.5">
            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] font-semibold">Последний раз видели</span>
              <span className="flex gap-1.5">
                <input readOnly value={placeText} className="h-[34px] min-w-0 flex-1 rounded-[6px] px-2.5 text-[14px]" style={{ background: C.field, borderBottom: `1px solid ${C.stroke2}`, color: C.text }} />
                <button
                  type="button"
                  onClick={() => patch({ pick: 'new', pin: state.nPlace ? { x: state.nPlace.x, y: state.nPlace.y } : null })}
                  className="flex h-[34px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[6px] px-3 font-semibold hover:brightness-110"
                  style={{ background: state.nPlace ? TONE.green[0] : C.btn, color: state.nPlace ? TONE.green[1] : C.text }}
                >
                  <PathIcon d="M10 17.5s-5.5-5-5.5-9a5.5 5.5 0 0111 0c0 4-5.5 9-5.5 9z" className="h-[15px] w-[15px]" />
                  {state.nPlace ? 'Точка стоит' : 'На карте'}
                </button>
              </span>
            </label>
            <div className="flex flex-col gap-1.5">
              <span className="text-[13px] font-semibold">Действует</span>
              <div className="flex gap-0.5 rounded-[8px] p-0.5" style={{ background: C.card }}>
                {TERMS.map((t, i) => (
                  <button key={t} type="button" onClick={() => patch({ nTerm: i })} className="h-7 flex-1 whitespace-nowrap rounded-[6px] text-center text-[13px] hover:shadow-[inset_0_0_0_999px_rgba(255,255,255,0.08)]" style={{ background: state.nTerm === i ? C.btn : 'transparent', fontWeight: state.nTerm === i ? 600 : 400 }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold">Зона</span>
            <div className="flex flex-wrap gap-1.5">
              {ZONES.map((z, i) => {
                const on = !!state.nZone[i]
                return (
                  <button key={z} type="button" onClick={() => patch({ nZone: { ...state.nZone, [i]: !on } })} className="h-[30px] whitespace-nowrap rounded-[15px] px-3 text-[13px] hover:brightness-110" style={{ background: on ? '#FFFFFF' : C.btn, color: on ? '#1B1B1B' : C.text, fontWeight: on ? 600 : 400 }}>
                    {z}
                  </button>
                )
              })}
            </div>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold">Что делать при обнаружении</span>
            <input value={nPlaceInstr} onChange={(e) => setNPlaceInstr(e.target.value)} className="h-[34px] rounded-[6px] px-2.5 text-[14px]" style={{ background: C.field, borderBottom: `1px solid ${C.stroke2}`, color: C.text }} />
          </label>

          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold">Кто видит</span>
            <div className="flex gap-0.5 rounded-[8px] p-0.5" style={{ background: C.card }}>
              {ACCS.map((a, i) => (
                <button key={a[0]} type="button" onClick={() => patch({ nAcc: i })} className="h-[30px] flex-1 whitespace-nowrap rounded-[6px] text-center text-[13px] hover:shadow-[inset_0_0_0_999px_rgba(255,255,255,0.08)]" style={{ background: state.nAcc === i ? C.btn : 'transparent', fontWeight: state.nAcc === i ? 600 : 400 }}>
                  {a[0]}
                </button>
              ))}
            </div>
            <span className="text-[12px]" style={{ color: C.text2 }}>
              {ACCS[state.nAcc][1]}
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="pb-1 text-[13px] font-semibold">Рассылка</span>
            {['Всем на смене в MDT, высокий приоритет — всплывающим окном', 'Диспетчер зачитает в рацию', 'Письмо в Почту отделу расследований'].map((t, i) => {
              const on = !!state.nSend[i]
              return (
                <button key={t} type="button" onClick={() => patch({ nSend: { ...state.nSend, [i]: !on } })} className="-mx-1.5 flex items-center gap-2.5 rounded-[6px] px-1.5 py-1 text-left hover:bg-white/5">
                  <span className="box-border flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[4px]" style={{ background: on ? ACCENT : 'transparent', border: `1px solid ${on ? ACCENT : C.stroke2}`, color: ON_ACCENT }}>
                    {on && <PathIcon d="M4.5 10.5l3.5 3.5 7.5-8" className="h-[11px] w-[11px]" />}
                  </span>
                  {t}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex w-[340px] shrink-0 flex-col" style={{ background: C.rail, borderLeft: `1px solid ${C.stroke}` }}>
        <div className="scroll flex flex-1 flex-col gap-3 overflow-y-auto p-4.5">
          <span className="text-[12px] font-semibold" style={{ color: C.text2 }}>
            Так увидят на смене
          </span>
          <div className="flex gap-3 rounded-[10px] p-3" style={{ background: C.card }}>
            <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[8px]" style={{ background: C.mug }}>
              {sPhoto && <img src={sPhoto} alt="" className="absolute inset-0 z-10 h-full w-full object-cover" />}
              <svg width="48" height="54" viewBox="0 0 96 112" className="absolute bottom-0 left-1" aria-hidden="true">
                <circle cx="48" cy="38" r="22" fill="rgba(255,255,255,0.16)" />
                <path d="M8 112c0-26 18-42 40-42s40 16 40 42z" fill="rgba(255,255,255,0.16)" />
              </svg>
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="font-semibold">{sName}</span>
              <span className="text-[12px]" style={{ color: C.text2 }}>
                {VIDS[state.nVid][1]} · {zonesOn.join(', ') || 'зона не выбрана'} · {TERMS[state.nTerm].toLowerCase()}
              </span>
              <span className="flex gap-1 pt-0.5">
                <span className="inline-flex h-5 items-center rounded-[10px] px-[7px] text-[11px]" style={{ background: TONE[(['grey', 'amber', 'red'] as const)[state.nPrio]][0], color: TONE[(['grey', 'amber', 'red'] as const)[state.nPrio]][1] }}>
                  {prioT}
                </span>
                {state.armed && (
                  <span className="inline-flex h-5 items-center rounded-[10px] px-[7px] text-[11px]" style={{ background: TONE.red[0], color: TONE.red[1] }}>
                    Вооружён и опасен
                  </span>
                )}
              </span>
            </span>
          </div>
          <div className="flex flex-col gap-1.5 rounded-[10px] p-3 text-[13px]" style={{ background: C.card }}>
            <span className="text-[12px] font-semibold" style={{ color: C.text2 }}>
              Текст для рации
            </span>
            <span className="leading-[19px]">
              {subj
                ? `Всем экипажам, ориентировка, ${prioT.toLowerCase()} приоритет: ${sName}, ${sSexAge.toLowerCase()}. ${VIDS[state.nVid][1]}${subj.reason ? ': ' + subj.reason : ''}.`
                : `Всем экипажам, ориентировка, ${prioT.toLowerCase()} приоритет: Daniel Reyes, мужчина, 31 год, 175 см, татуировка на левом предплечье, чёрная кепка. Подозревается в угоне жёлтого Zentorno, последний раз Rockford Hills.`}
              {state.armed ? ' Вооружён, соблюдать осторожность.' : ''}
            </span>
          </div>
          <span className="text-[12px] leading-[17px]" style={{ color: C.text2 }}>
            Ориентировка публикуется от вашего имени. Закрыть её могут автор, ведущий по делу и сержанты смены.
          </span>
        </div>
        <div className="flex gap-2 p-4.5" style={{ borderTop: `1px solid ${C.stroke}` }}>
          <button type="button" onClick={() => patch({ view: 'feed' })} className="h-9 flex-1 rounded-[6px] text-center hover:brightness-110" style={{ background: C.btn }}>
            Отмена
          </button>
          <button type="button" onClick={publish} className="h-9 flex-[1.6] rounded-[6px] text-center font-semibold hover:brightness-110" style={{ background: ACCENT, color: ON_ACCENT }}>
            Опубликовать
          </button>
        </div>
      </div>
    </div>
  )
}
