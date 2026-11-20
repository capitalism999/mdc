import type { Bolo } from '../../../types'
import { ACCENT, C, ON_ACCENT, type BoloUIState } from './BoloApp'
import { PathIcon } from './icons'

interface PosterProps {
  bolo: Bolo
  state: BoloUIState
  patch: (p: Partial<BoloUIState>) => void
  toast: (key: string) => void
}

type Tpl = 'wanted' | 'special' | 'poi' | 'alert' | 'identify' | 'missing' | 'stolen'

const T2: Record<Tpl, [string, string, string, string]> = {
  wanted: ['РАЗЫСКИВАЕТСЯ', 'WANTED', '#B3121D', 'Вы видели этого человека?'],
  special: ['ОСОБЫЙ РОЗЫСК', 'MOST WANTED', '#B3121D', 'Вы видели этого человека?'],
  poi: ['ЛИЦО, ПРЕДСТАВЛЯЮЩЕЕ ИНТЕРЕС', 'PERSON OF INTEREST', '#8A1C1C', 'Знаете, где этот человек?'],
  alert: ['ОПОВЕЩЕНИЕ НАСЕЛЕНИЯ', 'COMMUNITY ALERT', '#B36B00', 'Есть информация?'],
  identify: ['ПОМОГИТЕ ОПОЗНАТЬ', 'ATTEMPT TO IDENTIFY', '#B3121D', 'Узнаёте этого человека?'],
  missing: ['ПРОПАЛ ЧЕЛОВЕК', 'MISSING PERSON', '#1F4E9C', 'Вы видели этого человека?'],
  stolen: ['УГНАН АВТОМОБИЛЬ', 'STOLEN VEHICLE', '#B36B00', 'Вы видели эту машину?'],
}
const TPL_LABELS: [Tpl, string][] = [
  ['wanted', 'Розыск'], ['special', 'Особый розыск'], ['poi', 'Лицо интереса'], ['identify', 'Опознать'], ['missing', 'Пропал'], ['stolen', 'Угон'], ['alert', 'Оповещение'],
]
const AGENCY: Record<string, [string, string, string]> = {
  lspd: ['LOS SANTOS POLICE DEPARTMENT', '#14233F', '#C9A54B'],
  lssd: ['LOS SANTOS COUNTY SHERIFF', '#2F3A23', '#D2A64A'],
  sahp: ['SAN ANDREAS HIGHWAY PATROL', '#3A3A3A', '#E0B23C'],
  fib: ['FEDERAL INVESTIGATION BUREAU', '#1C1C1C', '#BFBFBF'],
}

function autoTpl(b: Bolo): Tpl {
  if (b.vid === 'missing') return 'missing'
  if (b.vid === 'alert') return 'alert'
  if (b.vid === 'special') return 'special'
  if (b.vid === 'poi') return b.kind === 'unknown' ? 'identify' : 'poi'
  if (b.kind === 'veh') return /угон/i.test(b.reason) ? 'stolen' : 'wanted'
  return 'wanted'
}

export function BoloPoster({ bolo: b, state, patch, toast }: PosterProps) {
  const P = state.poster
  const tpl = (P.tpl as Tpl) || autoTpl(b)
  const title = P.title || T2[tpl][0]
  const ink = P.bw ? '#141414' : T2[tpl][2]
  const AG = AGENCY[b.src]
  const closed = state.closedMap[b.id] || b.status !== 'open'
  const internal = P.aud === 'internal'
  const EX = b.poster ?? {}
  const facts = (EX.facts ?? b.facts.filter((f) => !/Зона|Действует|Создана|Закрыта/.test(f.label)).map((f) => [f.label, f.value] as [string, string])).slice(0, 8)
  const incident = EX.incident ?? [
    ['ДАТА', b.created.split(',')[0] + '.2026'],
    ['ВРЕМЯ', b.created.split(', ')[1] || '—'],
    ['МЕСТО', b.sightings[0]?.place ?? '—'],
  ]

  function patchPoster(p: Partial<typeof P>) {
    patch({ poster: { ...P, ...p } })
  }

  return (
    <div className="flex min-h-0 flex-1">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2.5 px-6 pb-3 pt-4">
          <button type="button" onClick={() => patch({ view: 'feed' })} aria-label="Назад" className="flex h-8 w-8 items-center justify-center rounded-[6px] hover:bg-white/10">
            <PathIcon d="M12.5 4.5L7 10l5.5 5.5" className="h-3.5 w-3.5" />
          </button>
          <span className="text-[20px] font-semibold leading-7">Листовка</span>
          <span className="text-[13px]" style={{ color: C.text2 }}>
            {b.no} · {b.title} · A4, предпросмотр
          </span>
        </div>
        <div className="scroll flex flex-1 justify-center overflow-y-auto px-6 pb-6 pt-1" style={{ background: C.rail }}>
          <div className="relative flex shrink-0 flex-col overflow-hidden" style={{ width: 520, height: 735, background: '#FAF9F5', color: '#141414', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', fontFamily: 'Inter, "Segoe UI", sans-serif' }}>
            <div className="flex items-center gap-3 px-5 py-3.5" style={{ background: P.bw ? '#1A1A1A' : AG[1], color: '#fff' }}>
              <span className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full" style={{ background: P.bw ? '#000' : '#0E1A30', border: `2px solid ${P.bw ? '#fff' : AG[2]}`, color: P.bw ? '#fff' : AG[2] }}>
                <PathIcon d="M10 1.8l6.5 2.6v5.2c0 4.2-2.8 7.2-6.5 8.6-3.7-1.4-6.5-4.4-6.5-8.6V4.4z" className="h-6 w-6" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col leading-[14px]">
                <span className="text-[13px] font-extrabold tracking-[1.4px]">{AG[0]}</span>
                <span className="pt-[3px] text-[9.5px] tracking-[0.4px] opacity-85">{EX.unit || 'Mission Row Station · отдел расследований'}</span>
              </span>
              <span className="flex flex-col items-end gap-0.5 text-right text-[9px] leading-3">
                <span className="font-bold tracking-[0.6px]" style={{ color: P.bw ? '#fff' : AG[2] }}>
                  {internal ? 'ТОЛЬКО ДЛЯ СОТРУДНИКОВ' : 'ДЛЯ РАСПРОСТРАНЕНИЯ'}
                </span>
                <span className="opacity-85">
                  {b.no} · {b.created.split(',')[0]}.2026
                </span>
                <span className="opacity-85">{EX.caseNo || `Дело ${b.no}`}</span>
              </span>
            </div>
            <div className="h-1" style={{ background: P.bw ? '#fff' : AG[2] }} />

            <div className="flex min-h-0 flex-1 flex-col gap-2.5 px-5 pt-3">
              <div className="flex flex-col items-center gap-px text-center">
                <span className="font-black leading-none tracking-[1px]" style={{ fontSize: title.length > 16 ? 32 : 46, color: ink }}>
                  {title}
                </span>
                <span className="text-[10px] font-extrabold tracking-[3px]" style={{ color: ink }}>
                  {T2[tpl][1]}
                  {b.armed && tpl !== 'missing' ? ' · ARMED AND DANGEROUS' : ''}
                </span>
                <span className="pt-[5px] text-[11.5px] font-bold">{EX.wantedFor || `${b.reason.charAt(0)}${b.reason.slice(1).toLowerCase()}${b.penalCodes.length ? ` (${b.penalCodes.map((n) => `PC ${n}`).join(', ')})` : ''}`}</span>
              </div>

              <div className="flex gap-3.5">
                <div className="flex shrink-0 flex-col gap-1">
                  <span className="relative block border-[1.5px] border-[#141414]" style={{ width: b.kind === 'veh' ? 210 : 150, height: b.kind === 'veh' ? 132 : 170, background: '#D3D0C8' }}>
                    {b.kind === 'unknown' && <span className="absolute left-0 right-0 top-[30%] text-center text-[54px] font-black" style={{ color: '#8A877F' }}>?</span>}
                    <span className="absolute inset-x-0 bottom-0 px-1.5 text-[8.5px] text-white" style={{ background: 'rgba(20,20,20,0.75)' }}>
                      {EX.mainCap || b.photos[0]?.caption || 'Фото'}
                    </span>
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  {b.plate && (
                    <span className="flex h-[50px] w-[100px] items-center justify-center text-[27px] font-bold" style={{ background: '#F2F2EE', color: '#2C307E' }}>
                      {b.plate}
                    </span>
                  )}
                  <span className="text-[21px] font-extrabold uppercase leading-6">{EX.name || b.title}</span>
                  <span className="flex flex-col pt-0.5">
                    {facts.map(([k, v]) => (
                      <span key={k} className="flex gap-1.5 border-b border-[#DAD6CC] py-[2.5px] text-[10.5px] leading-[14px]">
                        <span className="w-[78px] shrink-0 pt-px text-[8.5px] font-bold uppercase tracking-[0.5px] text-[#555]">{k}</span>
                        <span className="font-semibold">{v}</span>
                      </span>
                    ))}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 border border-[#141414]">
                {incident.map(([k, v], i) => (
                  <span key={k} className="flex flex-col px-2 py-1" style={{ borderLeft: i ? '1px solid #141414' : '0' }}>
                    <span className="text-[8px] font-bold tracking-[0.6px] text-[#555]">{k}</span>
                    <span className="truncate text-[10.5px] font-bold">{v}</span>
                  </span>
                ))}
              </div>

              {P.desc && (
                <span className="text-[10.5px] leading-[15px]">
                  <span className="text-[8.5px] font-extrabold tracking-[0.8px]">ОБСТОЯТЕЛЬСТВА. </span>
                  {EX.narr || b.description}
                </span>
              )}

              {b.armed && tpl !== 'missing' && (
                <span className="flex items-center gap-2 px-2.5 py-1.5 text-[10.5px] leading-[14px] text-white" style={{ background: '#B3121D' }}>
                  <PathIcon d="M10 3l8 14H2z M10 8.5v3.5M10 14.5h.01" className="h-[18px] w-[18px] shrink-0" />
                  <span>
                    <b>ВНИМАНИЕ: СЧИТАЕТСЯ ВООРУЖЁННЫМ И ОПАСНЫМ.</b> Не пытайтесь задержать самостоятельно. Если увидели — сразу звоните 911.
                  </span>
                </span>
              )}
              {internal && (
                <span className="border-[1.5px] border-dashed border-[#141414] px-2.5 py-1.5 text-[10.5px] leading-[14px]">
                  <b>ДЛЯ СОТРУДНИКОВ:</b> {b.instruction}
                </span>
              )}
              <span className="flex-1" />
            </div>

            <div className="mx-5 flex items-stretch gap-3 border-t-2 border-[#141414] py-2.5">
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-[12.5px] font-extrabold">{closed ? 'Спасибо всем, кто помог.' : T2[tpl][3]}</span>
                <span className="text-[10px] leading-[14px]">{P.contact ? (EX.contact || `Звоните 911 или ${b.contact.name} (${b.contact.role}): ${b.contact.phone}.`) : 'Позвоните 911.'}</span>
                {P.contact && !internal && (
                  <span className="text-[10px] leading-[14px]">
                    Анонимно: <b>Crime Stoppers · 555-TIPS (8477)</b>
                  </span>
                )}
              </span>
              {P.reward && !internal && !closed && (
                <span className="flex w-[118px] shrink-0 flex-col items-center justify-center gap-px px-2 text-center text-white" style={{ background: P.bw ? '#1A1A1A' : AG[1] }}>
                  <span className="text-[8px] font-bold tracking-[1px]" style={{ color: P.bw ? '#fff' : AG[2] }}>
                    НАГРАДА ДО
                  </span>
                  <span className="text-[19px] font-black leading-[22px]">{P.rewardSum}</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 px-5 py-1 text-[7.5px] tracking-[0.3px] text-[#555]" style={{ background: '#EDEBE4' }}>
              <span className="flex-1">{internal ? 'Служебный бюллетень · не для публичного распространения' : `Выпущено: ${b.src === 'lssd' ? 'LSSD · пресс-служба' : b.src === 'fib' ? 'FIB · полевой офис Лос-Сантос' : 'LSPD · пресс-служба'}`}</span>
              <span>Действует до {b.facts.find((f) => /Действует/.test(f.label))?.value ?? '—'}</span>
            </div>

            {closed && (
              <span className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 -rotate-[14deg] whitespace-nowrap rounded-[6px] border-[5px] px-5 py-1.5 text-[46px] font-black tracking-[3px]" style={{ borderColor: '#B3121D', color: '#B3121D', background: 'rgba(250,249,245,0.6)' }}>
                {b.kind === 'missing' ? 'НАЙДЕНА' : b.kind === 'veh' ? 'НАЙДЕН' : 'ЗАДЕРЖАН'}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex w-[320px] shrink-0 flex-col" style={{ borderLeft: `1px solid ${C.stroke}`, background: C.content }}>
        <div className="scroll flex flex-1 flex-col gap-3.5 overflow-y-auto p-4.5">
          <div className="flex flex-col gap-1.5">
            <span className="text-[12px] font-semibold" style={{ color: C.text2 }}>
              Шаблон
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {TPL_LABELS.map(([k, label]) => {
                const on = tpl === k
                return (
                  <button key={k} type="button" onClick={() => patchPoster({ tpl: k, title: '' })} className="h-[34px] truncate rounded-[6px] px-1.5 text-center text-[13px] hover:brightness-110" style={{ background: on ? C.sel : C.card, boxShadow: on ? `inset 0 0 0 2px ${ACCENT}` : 'none', fontWeight: on ? 600 : 400 }}>
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[12px] font-semibold" style={{ color: C.text2 }}>
              Для кого
            </span>
            <div className="flex gap-0.5 rounded-[8px] p-0.5" style={{ background: C.card }}>
              {(['public', 'internal'] as const).map((a) => (
                <button key={a} type="button" onClick={() => patchPoster({ aud: a })} className="h-7 flex-1 rounded-[6px] text-center text-[13px] hover:shadow-[inset_0_0_0_999px_rgba(255,255,255,0.08)]" style={{ background: P.aud === a ? C.btn : 'transparent', fontWeight: P.aud === a ? 600 : 400 }}>
                  {a === 'public' ? 'Для жителей' : 'Служебная'}
                </button>
              ))}
            </div>
            <span className="text-[12px] leading-4" style={{ color: C.text2 }}>
              {internal ? 'Для стенда в участке: без награды и анонимной линии, с инструкцией «При обнаружении».' : 'Для расклейки: награда, анонимная линия, без служебных инструкций.'}
            </span>
          </div>
          <label className="flex flex-col gap-1.5">
            <span className="text-[12px] font-semibold" style={{ color: C.text2 }}>
              Заголовок
            </span>
            <input value={title} onChange={(e) => patchPoster({ title: e.target.value })} className="h-[34px] rounded-[6px] px-2.5 text-[14px] font-bold" style={{ background: C.field, borderBottom: `1px solid ${C.stroke2}`, color: C.text }} />
          </label>
          <div className="flex flex-col gap-0.5">
            <span className="pb-1 text-[12px] font-semibold" style={{ color: C.text2 }}>
              Что показать
            </span>
            {([
              ['photos', 'Дополнительные фото', 'до двух под главным'],
              ['desc', 'Приметы текстом', 'описание из ориентировки'],
              ['reward', 'Награда', 'сумма крупно внизу'],
              ['contact', 'Контакты', 'следователь, участок, анонимная линия'],
            ] as const).map(([key, t, sub]) => {
              const on = !!P[key]
              return (
                <button key={key} type="button" onClick={() => patchPoster({ [key]: !on } as Partial<typeof P>)} className="-mx-1.5 flex items-center gap-2.5 rounded-[6px] px-1.5 py-1.5 text-left hover:bg-white/5">
                  <span className="flex flex-1 flex-col leading-[17px]">
                    <span>{t}</span>
                    <span className="text-[12px]" style={{ color: C.text2 }}>
                      {sub}
                    </span>
                  </span>
                  <span className="relative h-5 w-10 shrink-0 rounded-[10px] box-border" style={{ background: on ? ACCENT : 'transparent', border: `1px solid ${on ? ACCENT : C.stroke2}` }}>
                    <span className="absolute left-0.5 top-0.5 h-3.5 w-3.5 rounded-full transition-transform" style={{ background: on ? ON_ACCENT : C.text2, transform: on ? 'translateX(20px)' : 'translateX(0)' }} />
                  </span>
                </button>
              )
            })}
          </div>
          {P.reward && (
            <label className="flex flex-col gap-1.5">
              <span className="text-[12px] font-semibold" style={{ color: C.text2 }}>
                Сумма награды
              </span>
              <input value={P.rewardSum} onChange={(e) => patchPoster({ rewardSum: e.target.value })} className="h-[34px] rounded-[6px] px-2.5 text-[14px]" style={{ background: C.field, borderBottom: `1px solid ${C.stroke2}`, color: C.text }} />
            </label>
          )}
          <div className="flex flex-col gap-1.5">
            <span className="text-[12px] font-semibold" style={{ color: C.text2 }}>
              Печать
            </span>
            <div className="flex gap-0.5 rounded-[8px] p-0.5" style={{ background: C.card }}>
              {[
                ['Цветная', false],
                ['Чёрно-белая', true],
              ].map(([t, bw]) => (
                <button key={t as string} type="button" onClick={() => patchPoster({ bw: bw as boolean })} className="h-7 flex-1 rounded-[6px] text-center text-[13px] hover:shadow-[inset_0_0_0_999px_rgba(255,255,255,0.08)]" style={{ background: P.bw === bw ? C.btn : 'transparent', fontWeight: P.bw === bw ? 600 : 400 }}>
                  {t as string}
                </button>
              ))}
            </div>
          </div>
          <span className="text-[12px] leading-[17px]" style={{ color: C.text2 }}>
            Листовка собирается из ориентировки: фото, приметы и данные обновятся сами, если ориентировку изменят.
          </span>
        </div>
        <div className="flex flex-col gap-2 p-4.5" style={{ borderTop: `1px solid ${C.stroke}` }}>
          <button type="button" onClick={() => toast('pdf')} className="flex h-9 items-center justify-center gap-2 rounded-[6px] font-semibold hover:brightness-110" style={{ background: ACCENT, color: ON_ACCENT }}>
            <PathIcon d="M10 3v10M6 9l4 4 4-4M4 16.5h12" className="h-[15px] w-[15px]" />
            Скачать PDF
          </button>
          <div className="flex gap-2">
            <button type="button" onClick={() => toast('pdf')} className="h-[34px] flex-1 rounded-[6px] text-center hover:brightness-110" style={{ background: C.btn }}>
              Распечатать
            </button>
            <button type="button" onClick={() => toast('mail')} className="h-[34px] flex-1 rounded-[6px] text-center hover:brightness-110" style={{ background: C.btn }}>
              В Почту участку
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
