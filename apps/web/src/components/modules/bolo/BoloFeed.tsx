import type { Bolo } from '../../../types'
import type { EntityType } from '../../../windows/useEntityNavigation'
import { ACCENT, C, ON_ACCENT, SRC, TONE, type BoloUIState, pluralOf, statusOf } from './BoloApp'
import { PHB, PHI, PathIcon, PlusIcon, SearchIcon, ShieldWarnIcon } from './icons'
import { MapThumb } from '../shared/sanAndreasMap'

interface FeedProps {
  state: BoloUIState
  patch: (p: Partial<BoloUIState>) => void
  toast: (key: string) => void
  /** Items matching the current sidebar nav category, before the agency
   * (`src`) filter — used to show a correct count per agency chip
   * regardless of which chip is currently active. */
  navFiltered: Bolo[]
  list: Bolo[]
  selected: Bolo
  navLabel: string
  openEntity: (type: EntityType, id: string, label?: string) => void
}

function chipsOf(b: Bolo, closedMap: BoloUIState['closedMap'], full: boolean) {
  const st = statusOf(b, closedMap)
  const KIND: Record<Bolo['kind'], string> = { person: 'Человек', veh: 'Транспорт', missing: 'Пропавший', unknown: 'Неизвестный' }
  const PRIO: Record<Bolo['prio'], [string, keyof typeof TONE]> = { high: ['Высокий', 'red'], mid: ['Средний', 'amber'], low: ['Низкий', 'grey'] }
  if (st === 'closed') {
    const out: { t: string; tone: keyof typeof TONE }[] = [{ t: full ? `Закрыта · ${closedMap[b.id] || b.closedHow || ''}` : 'Закрыта', tone: 'green' }]
    if (full) out.push({ t: KIND[b.kind], tone: 'grey' })
    return out
  }
  if (st === 'expired') return [{ t: 'Срок истёк', tone: 'grey' as const }]
  const out: { t: string; tone: keyof typeof TONE }[] = [{ t: PRIO[b.prio][0] + (full ? ' приоритет' : ''), tone: PRIO[b.prio][1] }]
  if (b.armed) out.push({ t: 'Вооружён и опасен', tone: 'red' })
  if (full || b.kind === 'missing') out.push({ t: KIND[b.kind], tone: b.kind === 'missing' ? 'blue' : 'grey' })
  return out
}

function Chip({ t, tone }: { t: string; tone: keyof typeof TONE }) {
  return (
    <span className="inline-flex h-[22px] shrink-0 items-center whitespace-nowrap rounded-[11px] px-[9px] text-[12px] font-semibold" style={{ background: TONE[tone][0], color: TONE[tone][1] }}>
      {t}
    </span>
  )
}

function Thumb({ b, size }: { b: Bolo; size: number }) {
  const bg = b.kind === 'veh' ? C.photoSky : C.mug
  return (
    <span className="relative shrink-0 overflow-hidden rounded-[8px]" style={{ width: size, height: size, background: bg }}>
      {b.kind === 'veh' && (
        <svg width={size * 0.88} height={size * 0.54} viewBox="0 0 100 60" className="absolute left-[8%] top-[22%]" aria-hidden="true">
          <path d="M6 46v-5l4-3 9-10c2-2 5-4 9-4h30c4 0 7 2 10 5l7 7 14 2c3 1 5 3 5 6v2z" fill={b.carColor ?? '#888'} />
          <circle cx="25" cy="46" r="7" fill="#1A1D21" />
          <circle cx="76" cy="46" r="7" fill="#1A1D21" />
        </svg>
      )}
      {(b.kind === 'person' || b.kind === 'missing') && (
        <svg width={size * 0.85} height={size * 0.96} viewBox="0 0 96 112" className="absolute bottom-0 left-[8%]" aria-hidden="true">
          <circle cx="48" cy="38" r="22" fill="rgba(255,255,255,0.16)" />
          <path d="M8 112c0-26 18-42 40-42s40 16 40 42z" fill="rgba(255,255,255,0.16)" />
        </svg>
      )}
      {b.kind === 'unknown' && (
        <span className="absolute left-0 right-0 top-[18%] text-center text-[18px] font-bold" style={{ color: C.text }}>
          ?
        </span>
      )}
    </span>
  )
}

export function Feed({ state, patch, toast, navFiltered, list, selected, navLabel, openEntity }: FeedProps) {
  const st = statusOf(selected, state.closedMap)
  const srcFilters = (['all', 'lspd', 'lssd', 'sahp', 'fib'] as const).map((k) => ({
    k,
    label: k === 'all' ? 'Все' : SRC[k][0],
    n: navFiltered.filter((b) => k === 'all' || b.src === k).length,
  }))

  const extraSeen = state.extraSeenMap[selected.id]
  const seen = extraSeen
    ? [...selected.sightings, { place: extraSeen.place || 'Grove St / Forum Dr, Davis', when: '17.11, 16:12', text: (extraSeen.text || 'Пешком, в красной бандане, зашёл во двор дома 1207.') + (state.backup ? ' Запрошена поддержка.' : ''), who: `Вы · ${/* self */ 'Thorne Watts'}`, x: extraSeen.x, y: extraSeen.y }]
    : selected.sightings
  const trColor = selected.prio === 'high' ? TONE.red[1] : TONE.amber[1]
  const ack = selected.acknowledgedOf + (state.acked[selected.id] ? 1 : 0)
  const ackPct = Math.round((ack / selected.acknowledgedTotal) * 100)

  const pendingUpdate = st === 'open' && selected.pendingUpdate && !state.seenUpdMap[selected.id]
  const expiring = st === 'open' && selected.expiresSoon && !state.extMap[selected.id]
  const showArrest = st === 'open' && state.arrest && selected.id === 'b412'

  const history = (selected.history ?? [{ when: selected.created, who: selected.author, what: 'Создана' }])
    .concat(state.extMap[selected.id] ? [{ when: '17.11, 16:30', who: 'Thorne Watts', what: `Продлена до ${state.extMap[selected.id]}` }] : [])
    .concat(state.updatedMap[selected.id] ? [{ when: '17.11, 16:30', who: 'Thorne Watts', what: state.updatedMap[selected.id] }] : [])
    .concat(state.closedMap[selected.id] ? [{ when: '17.11, 16:30', who: 'Thorne Watts', what: `Закрыта: ${state.closedMap[selected.id].toLowerCase()}` }] : [])
    .slice()
    .reverse()

  function goLink(l: Bolo['links'][number]) {
    if (l.kind === 'bolo' && l.id) patch({ sel: l.id, nav: 'active' })
    else if ((l.kind === 'person' || l.kind === 'car' || l.kind === 'case') && l.id) {
      openEntity(l.kind === 'car' ? 'vehicle' : (l.kind as EntityType), l.id, l.value)
    }
  }

  return (
    <div className="flex min-h-0 flex-1">
      {/* list */}
      <div className="flex w-[380px] shrink-0 flex-col" style={{ borderRight: `1px solid ${C.stroke}` }}>
        <div className="flex flex-col gap-2.5 px-4 pb-2.5 pt-3.5">
          <div className="flex items-baseline gap-2">
            <span className="text-[20px] font-semibold leading-7">{navLabel}</span>
            <span className="text-[13px]" style={{ color: C.text2 }}>
              {list.length} {pluralOf(list.length, 'ориентировка', 'ориентировки', 'ориентировок')}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {srcFilters.map((f) => (
              <button
                key={f.k}
                type="button"
                onClick={() => patch({ src: f.k })}
                className="flex h-[26px] items-center gap-1 whitespace-nowrap rounded-[13px] px-2.5 text-[12px] hover:brightness-110"
                style={{ background: state.src === f.k ? '#FFFFFF' : C.card, color: state.src === f.k ? '#1B1B1B' : C.text, fontWeight: state.src === f.k ? 600 : 400 }}
              >
                {f.label}
                <span className="opacity-65">{f.n}</span>
              </button>
            ))}
          </div>
          <label className="flex h-8 items-center gap-2 rounded-[6px] px-2.5" style={{ background: C.search, color: C.text2 }}>
            <SearchIcon />
            <input
              type="search"
              value={state.query}
              onChange={(e) => patch({ query: e.target.value })}
              placeholder="Имя, номер машины, приметы"
              aria-label="Поиск по ориентировкам"
              className="min-w-0 flex-1 bg-transparent text-[14px] outline-none"
              style={{ color: C.text }}
            />
          </label>
        </div>
        <div className="scroll flex-1 overflow-y-auto px-2 pb-3">
          {list.length === 0 ? (
            <div className="px-3 py-6" style={{ color: C.text2 }}>
              Ничего не найдено
            </div>
          ) : (
            list.map((b) => {
              const unread = !!b.unread && !state.acked[b.id]
              const bst = statusOf(b, state.closedMap)
              const chips = chipsOf(b, state.closedMap, false)
                .concat(bst === 'open' && b.expiresSoon && !state.extMap[b.id] ? [{ t: `Истекает ${b.expiresSoon[1]}`, tone: 'amber' as const }] : [])
                .concat(bst === 'open' && ((b.pendingUpdate && !state.seenUpdMap[b.id]) || state.updatedMap[b.id]) ? [{ t: 'Обновлена', tone: 'blue' as const }] : [])
                .slice(0, 3)
              const bar = bst !== 'open' ? 'transparent' : b.prio === 'high' ? TONE.red[1] : b.prio === 'mid' ? TONE.amber[1] : 'transparent'
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => patch({ sel: b.id })}
                  className="relative mb-0.5 flex w-full gap-3 rounded-[8px] p-2.5 text-left hover:shadow-[inset_0_0_0_999px_rgba(255,255,255,0.06)]"
                  style={{ background: b.id === selected.id ? C.sel : 'transparent' }}
                >
                  <span className="absolute left-0 top-[14px] h-6 w-[3px] rounded-[2px]" style={{ background: bar }} />
                  <Thumb b={b} size={52} />
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="flex items-center gap-1.5">
                      {unread && <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: ACCENT }} />}
                      <span className="min-w-0 flex-1 truncate font-semibold">{b.title}</span>
                      <span className="text-[12px] tabular-nums" style={{ color: C.text2 }}>
                        {b.ago}
                      </span>
                    </span>
                    <span className="flex min-w-0 items-center gap-1.5">
                      <span className="shrink-0 text-[10px] font-bold tracking-wide" style={{ color: TONE[SRC[b.src][2]][1] }}>
                        {SRC[b.src][0]}
                      </span>
                      <span className="truncate text-[12px]" style={{ color: C.text2 }}>
                        {b.no} · {b.sub}
                      </span>
                    </span>
                    <span className="flex gap-1 pt-0.5">
                      {chips.map((c) => (
                        <Chip key={c.t} {...c} />
                      ))}
                    </span>
                  </span>
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* detail */}
      <div className="relative flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2 px-5 pb-3 pt-3.5" style={{ borderBottom: `1px solid ${C.stroke}` }}>
          <span className="flex h-[22px] items-center gap-1.5 rounded-[4px] px-2 text-[12px] font-bold tracking-wide" style={{ background: TONE[SRC[selected.src][2]][0], color: TONE[SRC[selected.src][2]][1] }} title={SRC[selected.src][1]}>
            {SRC[selected.src][0]}
          </span>
          <span className="whitespace-nowrap text-[13px] tabular-nums" style={{ color: C.text2 }}>
            {selected.no}
          </span>
          {chipsOf(selected, state.closedMap, true).map((c) => (
            <Chip key={c.t} {...c} />
          ))}
          <span className="flex-1" />
          {st === 'open' && (
            <>
              <button type="button" onClick={() => patch({ dlg: 'close' })} className="flex h-8 items-center gap-2 rounded-[6px] px-3 hover:brightness-110" style={{ background: C.btn }}>
                <PathIcon d="M4 10.5l3.5 3.5L16 5.5" className="h-[15px] w-[15px]" />
                {selected.kind === 'missing' ? 'Найден' : selected.kind === 'veh' ? 'Найдена' : 'Задержан'}
              </button>
              <button type="button" onClick={() => patch({ dlg: 'seen' })} className="flex h-8 items-center gap-2 rounded-[6px] px-3.5 font-semibold hover:brightness-110" style={{ background: ACCENT, color: ON_ACCENT }}>
                <PathIcon d="M1.5 10S4.5 4.5 10 4.5 18.5 10 18.5 10 15.5 15.5 10 15.5 1.5 10 1.5 10z" className="h-[15px] w-[15px]" />
                Замечен
              </button>
            </>
          )}
          <button type="button" onClick={() => patch({ view: 'poster' })} aria-label="Листовка для печати" title="Листовка для печати (PDF)" className="flex h-8 w-8 items-center justify-center rounded-[6px] hover:bg-white/10">
            <PathIcon d="M5.5 7.5V3h9v4.5M2.5 7.5h15v7h-15zM5.5 12h9v5h-9z" className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => patch({ menu: !state.menu })} aria-label="Ещё" title="Обновить, продлить, доступ" className="flex h-8 w-8 items-center justify-center rounded-[6px] hover:bg-white/10">
            <PathIcon d="M4.5 10h.01M10 10h.01M15.5 10h.01" className="h-4 w-4" />
          </button>
        </div>

        <div className="scroll flex-1 overflow-y-auto p-7">
          <div className="flex flex-col gap-3.5">
            {st !== 'open' && (
              <div className="flex items-center gap-3 rounded-[10px] px-4 py-3" style={{ background: st === 'closed' ? TONE.green[0] : TONE.grey[0] }}>
                <PathIcon d="M4 10.5l3.5 3.5L16 5.5" className="h-[18px] w-[18px]" style={{ color: st === 'closed' ? TONE.green[1] : C.text2 }} />
                <span className="flex flex-1 flex-col leading-[18px]">
                  <span className="font-semibold" style={{ color: st === 'closed' ? TONE.green[1] : C.text2 }}>
                    {st === 'closed' ? `Закрыта: ${(state.closedMap[selected.id] || selected.closedHow || '').toLowerCase()}` : 'Срок действия истёк 12.11'}
                  </span>
                  <span className="text-[12px]" style={{ color: C.text2 }}>
                    {st === 'closed'
                      ? selected.closedBy
                        ? `${selected.closedBy} · ${selected.closedAt} · арест A-2026-1187`
                        : 'Thorne Watts · только что · все на смене получили уведомление'
                      : 'Никто не продлил. Можно создать заново из этой карточки.'}
                  </span>
                </span>
              </div>
            )}

            {showArrest && (
              <div className="flex items-center gap-3 rounded-[10px] px-4 py-3" style={{ background: TONE.green[0] }}>
                <PathIcon d="M10 9a3.2 3.2 0 100-6.4A3.2 3.2 0 0010 9zM3.5 17.5c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M13.5 14l1.5 1.5 3-3" className="h-[18px] w-[18px]" style={{ color: TONE.green[1] }} />
                <span className="flex flex-1 flex-col leading-[18px]">
                  <span className="font-semibold" style={{ color: TONE.green[1] }}>
                    Tyrone Webb оформлен: арест A-2026-1203
                  </span>
                  <span className="text-[12px]" style={{ color: C.text2 }}>
                    17.11, 16:20 · Kara Mendez · Mission Row. Ориентировка ещё открыта.
                  </span>
                </span>
                <button type="button" onClick={() => patch({ arrest: false })} className="shrink-0 whitespace-nowrap rounded-[6px] px-3 py-2 hover:brightness-110" style={{ background: C.btn }}>
                  Не тот человек
                </button>
                <button type="button" onClick={() => patch({ dlg: 'close', closeWhy: 0, arrest: false })} className="shrink-0 whitespace-nowrap rounded-[6px] px-3.5 py-2 font-semibold hover:brightness-110" style={{ background: ACCENT, color: ON_ACCENT }}>
                  Закрыть как задержан
                </button>
              </div>
            )}

            {expiring && selected.expiresSoon && (
              <div className="flex items-center gap-3 rounded-[10px] px-4 py-3" style={{ background: TONE.amber[0] }}>
                <PathIcon d="M10 17.5a7.5 7.5 0 100-15 7.5 7.5 0 000 15zM10 6v4l2.5 1.5" className="h-[18px] w-[18px]" style={{ color: TONE.amber[1] }} />
                <span className="flex flex-1 flex-col leading-[18px]">
                  <span className="font-semibold" style={{ color: TONE.amber[1] }}>
                    Истекает {selected.expiresSoon[0]}, {selected.expiresSoon[1]}
                  </span>
                  <span className="text-[12px]" style={{ color: C.text2 }}>
                    Автору ушло напоминание в Почту. Продлить может автор, ведущий по делу или сержант смены.
                  </span>
                </span>
                <span className="shrink-0 text-[13px]" style={{ color: C.text2 }}>
                  Продлить
                </span>
                {[
                  ['+24 ч', '18.11, 20:00'],
                  ['+3 дня', '20.11, 20:00'],
                  ['+7 дней', '24.11, 20:00'],
                ].map(([t, v]) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      patch({ extMap: { ...state.extMap, [selected.id]: v } })
                      toast('ext')
                    }}
                    className="shrink-0 whitespace-nowrap rounded-[6px] px-3 py-2 font-semibold hover:brightness-110"
                    style={{ background: C.btn }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}

            {pendingUpdate && selected.pendingUpdate && (
              <div className="flex items-center gap-3 rounded-[10px] px-4 py-3" style={{ background: TONE.blue[0] }}>
                <PathIcon d="M4 14.5V16h1.5L15 6.5 13.5 5zM12 6.5l1.5 1.5" className="h-[18px] w-[18px]" style={{ color: TONE.blue[1] }} />
                <span className="flex flex-1 flex-col leading-[18px]">
                  <span className="font-semibold" style={{ color: TONE.blue[1] }}>
                    Обновлена {selected.pendingUpdate[0]}
                  </span>
                  <span className="text-[13px]">{selected.pendingUpdate[1]}</span>
                </span>
                <button type="button" onClick={() => patch({ seenUpdMap: { ...state.seenUpdMap, [selected.id]: true } })} className="shrink-0 rounded-[6px] px-3 py-2 hover:brightness-110" style={{ background: C.btn }}>
                  Понятно
                </button>
              </div>
            )}

            {/* hero */}
            <div className="flex gap-5">
              <span className="relative shrink-0 overflow-hidden rounded-[12px]" style={{ width: selected.kind === 'veh' ? 248 : 136, height: 168, background: selected.kind === 'veh' ? `linear-gradient(180deg, ${C.photoSky} 0%, ${C.photoSky} 62%, ${C.photoGround} 62%, ${C.photoGround} 100%)` : C.mug }}>
                <Thumb b={selected} size={168} />
                <span className="absolute inset-x-0 bottom-0 px-2.5 py-0.5 text-[11px]" style={{ background: 'rgba(0,0,0,0.55)', color: '#fff' }}>
                  {selected.kind === 'veh' ? 'Фото из реестра DMV' : selected.kind === 'unknown' ? 'Фото нет' : selected.kind === 'missing' ? 'От родственников' : 'Из личного дела'}
                </span>
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <span className="text-[12px] font-semibold tracking-wide" style={{ color: TONE[VID_TONE(selected.vid)][1] }}>
                  {VID_LABEL(selected.vid).toUpperCase()} · {selected.reason}
                </span>
                {selected.plate && (
                  <span className="flex h-[38px] w-[120px] items-center justify-center rounded-[6px] text-[22px] font-bold" style={{ background: '#F2F2EE', color: '#2C307E', letterSpacing: '0.03em' }}>
                    {selected.plate}
                  </span>
                )}
                <span className="flex flex-wrap items-baseline gap-2.5">
                  <span className="text-[28px] font-bold leading-9">{selected.title}</span>
                  <span style={{ color: C.text2 }}>{selected.plate ? selected.sub.replace(`${selected.plate} · `, '') : selected.sub}</span>
                </span>
                <div className="grid grid-cols-3 gap-x-4 gap-y-2 pt-1.5">
                  {selected.facts.map((f) => (
                    <span key={f.label} className="flex min-w-0 flex-col leading-[18px]">
                      <span className="text-[12px]" style={{ color: C.text2 }}>
                        {f.label}
                      </span>
                      {f.linkBoloId ? (
                        <button type="button" onClick={() => patch({ sel: f.linkBoloId, nav: 'active' })} className="truncate text-left font-semibold hover:underline" style={{ color: C.link }}>
                          {state.extMap[selected.id] && /Действует до/.test(f.label) ? state.extMap[selected.id] : f.value}
                        </button>
                      ) : (
                        <span className="truncate font-semibold">{state.extMap[selected.id] && /Действует до/.test(f.label) ? state.extMap[selected.id] : f.value}</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* instruction */}
            <div className="flex gap-3 rounded-[10px] px-4 py-3" style={{ background: st !== 'open' ? C.card : selected.armed ? TONE.red[0] : TONE.amber[0] }}>
              <ShieldWarnIcon className="mt-px shrink-0 h-[18px] w-[18px]" style={{ color: st !== 'open' ? C.text2 : selected.armed ? TONE.red[1] : TONE.amber[1] }} />
              <span className="flex flex-col gap-0.5 leading-[19px]">
                <span className="font-semibold" style={{ color: st !== 'open' ? C.text2 : selected.armed ? TONE.red[1] : TONE.amber[1] }}>
                  {st === 'open' ? 'При обнаружении' : 'Действий не требуется'}
                </span>
                <span className="text-[13px]">
                  {st === 'open' ? selected.instruction : st === 'closed' ? 'Ориентировка закрыта. Отметки «Замечен» больше не принимаются.' : 'Срок истёк, никто не продлил. Можно создать новую из этой карточки.'}
                </span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="flex flex-col gap-2 rounded-[10px] px-4 py-3" style={{ background: C.card }}>
                <span className="font-semibold">Статья Penal Code</span>
                {selected.penalCodes.length > 0 ? (
                  <div className="flex flex-col gap-1">
                    {selected.penalCodes.map((n) => (
                      <span key={n} className="flex min-w-0 items-baseline gap-2">
                        <span className="shrink-0 whitespace-nowrap font-bold tabular-nums" style={{ color: C.link }}>
                          PC {n}
                        </span>
                        <span className="truncate text-[13px]">{PCN[n] ?? ''}</span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-[13px]" style={{ color: C.text2 }}>
                    {selected.vid === 'missing' ? 'Не применяется: пропавший без вести' : 'Статья не указана: человек не обвиняется'}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2 rounded-[10px] px-4 py-3" style={{ background: C.card }}>
                <span className="font-semibold">С кем связаться</span>
                <div className="flex items-center gap-2.5">
                  <span className="flex min-w-0 flex-1 flex-col leading-[18px]">
                    <span className="truncate font-semibold" style={{ color: C.link }}>
                      {selected.contact.name}
                    </span>
                    <span className="truncate text-[12px]" style={{ color: C.text2 }}>
                      <span className="tabular-nums" style={{ color: C.text }}>
                        {selected.contact.phone}
                      </span>{' '}
                      · {selected.contact.role}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="flex flex-col gap-2.5 rounded-[10px] px-4 py-3.5" style={{ background: C.card }}>
                <span className="font-semibold">Приметы</span>
                <span className="text-[13px] leading-5">{selected.description}</span>
                <span className="flex flex-wrap gap-1.5">
                  {selected.tags.map((t) => (
                    <span key={t} className="inline-flex h-[22px] items-center whitespace-nowrap rounded-[11px] px-[9px] text-[12px]" style={{ background: C.btn }}>
                      {t}
                    </span>
                  ))}
                </span>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {selected.photos.concat(state.addedPhoto[selected.id] ? [{ caption: 'Добавлено вами · только что', icon: 'cam' as const }] : []).map((p, i) => (
                    <span key={i} title={p.caption} className="relative block aspect-[4/3] overflow-hidden rounded-[8px]" style={{ background: `linear-gradient(160deg, ${PHB[p.icon][0]}, ${PHB[p.icon][1]})` }}>
                      <PathIcon d={PHI[p.icon]} className="absolute left-1/2 top-[42%] h-7 w-7 -translate-x-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.45)' }} />
                      <span className="absolute inset-x-0 bottom-0 truncate px-1.5 text-[10px]" style={{ background: 'rgba(0,0,0,0.55)', color: '#fff' }}>
                        {p.caption}
                      </span>
                    </span>
                  ))}
                  {st === 'open' && (
                    <button
                      type="button"
                      onClick={() => {
                        patch({ addedPhoto: { ...state.addedPhoto, [selected.id]: true } })
                        toast('photo')
                      }}
                      className="flex aspect-[4/3] flex-col items-center justify-center gap-1 rounded-[8px] border border-dashed text-[12px] hover:bg-white/5"
                      style={{ borderColor: C.stroke2, color: C.text2 }}
                    >
                      <PlusIcon className="h-4 w-4" />
                      Добавить фото
                    </button>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-0.5 rounded-[10px] px-4 py-3.5" style={{ background: C.card }}>
                <span className="pb-1 font-semibold">Связано</span>
                {selected.links.map((l) => (
                  <button key={l.label + l.value} type="button" onClick={() => goLink(l)} className="-mx-2 flex items-center gap-2.5 rounded-[6px] px-2 py-1.5 text-left hover:bg-white/5">
                    <span className="shrink-0" style={{ color: C.text2 }}>
                      <PathIcon d={LINK_ICON(l.kind)} className="h-4 w-4" />
                    </span>
                    <span className="w-[92px] shrink-0 text-[12px]" style={{ color: C.text2 }}>
                      {l.label}
                    </span>
                    <span className="min-w-0 flex-1 truncate" style={{ color: l.id ? C.link : C.text }}>
                      {l.value}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* sightings */}
            <div className="flex flex-col gap-3 rounded-[10px] px-4 py-3.5" style={{ background: C.card }}>
              <div className="flex items-baseline gap-2">
                <span className="font-semibold">Где замечен</span>
                <span className="text-[12px]" style={{ color: C.text2 }}>
                  {seen.length ? `${seen.length} ${pluralOf(seen.length, 'отметка', 'отметки', 'отметок')} · последняя ${seen[seen.length - 1].when}` : 'Пока никто не отмечал'}
                </span>
              </div>
              <div className="flex gap-3.5">
                <div className="relative h-[240px] w-[300px] shrink-0 overflow-hidden rounded-[10px]" style={{ background: C.mapWater }}>
                  <MapThumb points={seen}>
                  {seen.map((s, i) => {
                    const last = i === seen.length - 1
                    return (
                      <span
                        key={i}
                        className="absolute flex items-center justify-center rounded-full text-[10px] font-bold text-black"
                        style={{
                          left: `${s.x}%`, top: `${s.y}%`, width: last ? 20 : 16, height: last ? 20 : 16, transform: 'translate(-50%, -50%)',
                          background: last && st === 'open' ? trColor : '#9AA0A6', border: `2px solid ${C.card}`,
                          boxShadow: last && st === 'open' ? `0 0 0 4px ${TONE[selected.prio === 'high' ? 'red' : 'amber'][0]}` : 'none',
                        }}
                      >
                        {i + 1}
                      </span>
                    )
                  })}
                  </MapThumb>
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  {seen
                    .slice()
                    .reverse()
                    .map((s, i, arr) => (
                      <div key={i} className="flex gap-2.5">
                        <span className="flex w-5 shrink-0 flex-col items-center">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-black" style={{ background: i === 0 && st === 'open' ? trColor : C.stroke2 }}>
                            {seen.length - i}
                          </span>
                          <span className="w-[1.5px] flex-1" style={{ background: i === arr.length - 1 ? 'transparent' : C.stroke }} />
                        </span>
                        <span className="flex flex-1 flex-col gap-0.5 pb-3 leading-[18px]">
                          <span className="flex items-baseline gap-2">
                            <span className="font-semibold">{s.place}</span>
                            <span className="text-[12px] tabular-nums" style={{ color: C.text2 }}>
                              {s.when}
                            </span>
                          </span>
                          <span className="text-[13px]" style={{ color: C.text2 }}>
                            {s.text}
                          </span>
                          <span className="self-start text-[12px]" style={{ color: C.link }}>
                            {s.who}
                          </span>
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* acknowledgement */}
            <div className="flex items-center gap-4 rounded-[10px] px-4 py-3.5" style={{ background: C.card }}>
              <span className="flex flex-1 flex-col gap-2">
                <span className="flex items-baseline gap-2">
                  <span className="font-semibold">Ознакомились</span>
                  <span className="text-[13px] tabular-nums" style={{ color: C.text2 }}>
                    {ack} из {selected.acknowledgedTotal} на смене
                  </span>
                </span>
                <span className="block h-1.5 overflow-hidden rounded-[3px]" style={{ background: C.track }}>
                  <span className="block h-full" style={{ width: `${ackPct}%`, background: TONE.green[1] }} />
                </span>
                <span className="text-[12px]" style={{ color: C.text2 }}>
                  Создал {selected.author} ({SRC[selected.src][0]}) · {selected.created} · {selected.no}
                </span>
              </span>
              {st === 'open' && !state.acked[selected.id] && selected.unread ? (
                <button type="button" onClick={() => patch({ acked: { ...state.acked, [selected.id]: true } })} className="shrink-0 rounded-[6px] px-4 py-2 font-semibold hover:brightness-110" style={{ background: C.btn }}>
                  Ознакомлен
                </button>
              ) : (
                <span className="flex items-center gap-1.5 text-[13px]" style={{ color: TONE.green[1] }}>
                  <PathIcon d="M4 10.5l3.5 3.5L16 5.5" className="h-3.5 w-3.5" />
                  {state.acked[selected.id] ? 'Вы ознакомились · только что' : `Вы ознакомились · ${selected.created}`}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2.5 rounded-[10px] px-4 py-3.5" style={{ background: C.card }}>
              <span className="font-semibold">История изменений</span>
              <div className="flex flex-col">
                {history.map((h, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="flex w-2.5 shrink-0 flex-col items-center">
                      <span className="mt-1.5 h-2 w-2 rounded-full" style={{ background: i === 0 ? ACCENT : C.stroke2 }} />
                      <span className="w-px flex-1" style={{ background: i === history.length - 1 ? 'transparent' : C.stroke }} />
                    </span>
                    <span className="flex flex-1 flex-col pb-2.5 leading-[19px]">
                      <span className="text-[13px]">{h.what}</span>
                      <span className="text-[12px] tabular-nums" style={{ color: C.text2 }}>
                        {h.when} · {h.who}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const VID: Record<Bolo['vid'], [string, keyof typeof TONE]> = {
  wanted: ['Разыскивается', 'red'], special: ['Особый розыск', 'red'], poi: ['Лицо, представляющее интерес', 'amber'], missing: ['Пропал без вести', 'blue'], alert: ['Оповещение населения', 'amber'],
}
function VID_LABEL(v: Bolo['vid']) {
  return VID[v][0]
}
function VID_TONE(v: Bolo['vid']) {
  return VID[v][1]
}

const PCN: Record<string, string> = {
  '207': 'Нападение со смертоносным оружием', '215': 'Ограбление', '216': 'Вооружённое ограбление', '302': 'Кража со взломом',
  '304': 'Крупная кража', '306': 'Угон транспортного средства', '313': 'Кража регистрационных знаков', '702': 'Хранение запрещённого огнестрельного оружия',
}

function LINK_ICON(kind: Bolo['links'][number]['kind']) {
  const M: Record<string, string> = {
    home: 'M3 9.5L10 3.5l7 6M5 8v8.5h10V8M8.5 16.5v-4h3v4',
    person: 'M10 9a3.2 3.2 0 100-6.4A3.2 3.2 0 0010 9zM3.5 17.5c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6',
    car: 'M3 13v-3l2-4h10l2 4v3zM3 13v2h2v-2M15 13v2h2v-2M6 10.5h.5M13.5 10.5h.5',
    doc: 'M5 2.5h7l3 3v12H5zM8 9h4M8 12h4M8 15h2',
    case: 'M2.5 6h15v10.5h-15zM7 6V4h6v2M2.5 10h15',
    bolo: 'M10 3.5a6.5 6.5 0 100 13 6.5 6.5 0 100-13zM10 8a2 2 0 100 4 2 2 0 100-4z',
    org: 'M3 17h14M5 17V8l5-4 5 4v9M8 17v-4h4v4',
    call: 'M5 3h3l1.5 4-2 1.2a9 9 0 004.3 4.3L13 10.5l4 1.5v3a2 2 0 01-2 2A12.5 12.5 0 013 5a2 2 0 012-2z',
  }
  return M[kind] ?? M.doc
}

