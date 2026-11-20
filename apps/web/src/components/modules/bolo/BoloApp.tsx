import { useEffect, useMemo, useState } from 'react'
import type { ModuleContentProps } from '../registry'
import { mockBolos } from '../../../lib/mockData/bolos'
import type { Bolo, BoloAgency } from '../../../types'
import { useEntityNavigation } from '../../../windows/useEntityNavigation'
import { setAppBadge } from '../../../windows/appBadges'
import { BoloCloseDialog, BoloIncomingBanner, BoloMenu, BoloSeenDialog, BoloToast, BoloUpdateDialog } from './BoloDialogs'
import { Feed } from './BoloFeed'
import { BoloMap, BoloMapPicker } from './BoloMap'
import { BoloNew } from './BoloNew'
import { BoloPoster } from './BoloPoster'
import { ICN, PathIcon, PlusIcon } from './icons'
import { useBoloRequest, type BoloNewRequest, type BoloSubject } from './boloRequests'

export type BoloView = 'feed' | 'map' | 'new' | 'poster'
export type BoloPick = 'new' | 'seen' | 'map' | null

export const SRC: Record<BoloAgency, [string, string, 'blue' | 'green' | 'amber' | 'grey']> = {
  lspd: ['LSPD', 'Полиция Лос-Сантоса', 'blue'],
  lssd: ['LSSD', 'Шериф округа', 'green'],
  sahp: ['SAHP', 'Дорожный патруль', 'amber'],
  fib: ['FIB', 'Федеральное бюро', 'grey'],
}
export const TONE: Record<'red' | 'amber' | 'green' | 'grey' | 'blue', [string, string]> = {
  red: ['rgba(232,17,35,0.2)', '#FF99A4'],
  amber: ['rgba(255,185,0,0.16)', '#FCE100'],
  green: ['rgba(16,124,16,0.28)', '#6CCB5F'],
  grey: ['rgba(255,255,255,0.08)', '#C8C8C8'],
  blue: ['rgba(0,120,212,0.25)', '#99D9FF'],
}

export const C = {
  mica: '#1D2027', frame: '#3B3B3B', content: '#272727', card: '#303030', btn: '#3A3A3A',
  search: 'rgba(255,255,255,0.06)', stroke: '#3A3A3A', stroke2: '#555555', text: '#FFFFFF', text2: '#C2C2C2',
  sel: 'rgba(255,255,255,0.08)', link: '#8FD8FF', flyout: '#2C2C2C', track: 'rgba(255,255,255,0.1)', rail: '#242424',
  field: 'rgba(255,255,255,0.06)', dialog: '#2B2B2B', dialogFoot: '#202020',
  mug: '#3A3F47', mugLine: 'rgba(255,255,255,0.07)', mugFig: 'rgba(255,255,255,0.16)',
  photoSky: '#36414E', photoGround: '#2A2F35',
  mapWater: '#9CC0FA', mapLabel: '#3C4043',
}
export const ACCENT = '#60CDFF'
export const ON_ACCENT = '#000000'

export interface BoloUIState {
  view: BoloView
  nav: string
  src: BoloAgency | 'all'
  query: string
  sel: string | null
  acked: Record<string, boolean>
  closedMap: Record<string, string>
  updatedMap: Record<string, string>
  extMap: Record<string, string>
  extraSeenMap: Record<string, { place?: string; text?: string; x: number; y: number }>
  seenUpdMap: Record<string, boolean>
  menu: boolean
  dlg: 'seen' | 'update' | 'close' | null
  arrest: boolean
  updWhat: Record<number, boolean>
  updText: string | null
  updNotify: boolean
  updReack: boolean
  backup: boolean
  dir: number
  how: Record<number, boolean>
  closeWhy: number
  toast: string | null
  mapF: 'all' | 'high' | '24'
  pick: BoloPick
  pin: { x: number; y: number } | null
  acc: number
  nPlace: { x: number; y: number; acc: number } | null
  seenPin: { x: number; y: number } | null
  addedPhoto: Record<string, boolean>
  poster: { tpl: string | null; photos: boolean; desc: boolean; reward: boolean; rewardSum: string; contact: boolean; bw: boolean; aud: 'public' | 'internal'; title: string }
  notif: number
  incoming: boolean
  nType: number
  nVid: number
  nAcc: number
  nPc: Record<string, boolean>
  nPcQ: string
  nCt: number
  nPrio: number
  armed: boolean
  nTerm: number
  nZone: Record<number, boolean>
  nSend: Record<number, boolean>
  nDup: boolean
  nPhotoN: number
  nInstruction: string
  /** who the new BOLO is about when another module started it (Поиск → «Объявить в розыск»); null = the form's own example */
  nSubject: BoloSubject | null
}

const INITIAL: BoloUIState = {
  view: 'feed', nav: 'active', src: 'all', query: '', sel: 'b412', acked: {}, closedMap: {}, updatedMap: {}, extMap: {},
  extraSeenMap: {}, seenUpdMap: {}, menu: false, dlg: null, arrest: false, updWhat: { 1: true }, updText: null,
  updNotify: true, updReack: false, backup: false, dir: 0, how: { 0: true }, closeWhy: 0, toast: null, mapF: 'all',
  pick: null, pin: null, acc: 1, nPlace: null, seenPin: null, addedPhoto: {}, notif: 0, incoming: false,
  nType: 0, nVid: 0, nAcc: 0, nPc: { '306': true }, nPcQ: '', nCt: 1, nPrio: 1, armed: false, nTerm: 2, nZone: { 1: true },
  nSend: { 0: true, 1: true }, nDup: false, nPhotoN: 2,
  nInstruction: 'Задержать для допроса по угону, доставить в Mission Row. Сообщить автору.',
  nSubject: null,
  poster: { tpl: null, photos: true, desc: true, reward: true, rewardSum: '$5 000', contact: true, bw: false, aud: 'public', title: '' },
}

interface NavDef {
  id: string
  label: string
  icon: string
  filter: ((b: Bolo, closedMap: Record<string, string>) => boolean) | null
}

export const NAV_GROUPS: { title: string; items: NavDef[] }[] = [
  {
    title: 'Ориентировки',
    items: [
      { id: 'active', label: 'Активные', icon: ICN.list, filter: (b) => b.status === 'open' },
      { id: 'high', label: 'Высокий приоритет', icon: ICN.flame, filter: (b) => b.status === 'open' && b.prio === 'high' },
      { id: 'people', label: 'Люди', icon: ICN.person, filter: (b) => b.status === 'open' && (b.kind === 'person' || b.kind === 'unknown') },
      { id: 'veh', label: 'Транспорт', icon: ICN.car, filter: (b) => b.status === 'open' && b.kind === 'veh' },
      { id: 'missing', label: 'Пропавшие', icon: ICN.help, filter: (b) => b.status === 'open' && b.kind === 'missing' },
      { id: 'map', label: 'Карта', icon: ICN.map, filter: null },
    ],
  },
  { title: 'Мои', items: [{ id: 'mine', label: 'Созданные мной', icon: ICN.me, filter: (b) => b.author.includes('Thorne Watts') }] },
  {
    title: 'Архив',
    items: [
      { id: 'closed', label: 'Закрытые', icon: ICN.check, filter: (b, closedMap) => b.status === 'closed' || !!closedMap[b.id] },
      { id: 'expired', label: 'Истёкшие', icon: ICN.clock, filter: (b) => b.status === 'expired' },
    ],
  },
]

/** Resolves the live status of a BOLO once local-only close actions are
 * taken into account (closing never mutates the mock record itself). */
export function statusOf(b: Bolo, closedMap: Record<string, string>): Bolo['status'] {
  return closedMap[b.id] ? 'closed' : b.status
}

export function pluralOf(n: number, one: string, few: string, many: string) {
  const a = n % 10
  const b = n % 100
  if (a === 1 && b !== 11) return one
  if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return few
  return many
}

/**
 * "BOLO" module — rebuilt 1:1 from the reference's single `BOLO.dc.html`
 * component (every other `BOLO*.dc.html` file in the design is a one-line
 * `<dc-import view="...">` wrapper around this same component with a
 * different initial view/selection, exactly like Mail's Main/MailList/
 * MailSuggest/MailSearch or Заметки's Notes/NotesGallery). Sidebar feed +
 * detail, a standalone map, a new-BOLO wizard, and a printable poster
 * generator, all sharing one state object — mirrored here as one `useState`
 * instead of prop-drilling two dozen callbacks.
 */
/** The new-BOLO form's starting state for a person sent from Поиск. */
function newFormFor(s: BoloSubject): Partial<BoloUIState> {
  return {
    view: 'new',
    dlg: null,
    menu: false,
    nType: 0,
    nVid: s.vid,
    armed: s.armed,
    nDup: false,
    nPc: {},
    nPcQ: '',
    nPrio: s.vid === 1 ? 2 : 1,
    nInstruction: s.vid === 2 ? 'Найти и опросить, без задержания. Сообщить автору.' : 'Задержать и доставить в Mission Row. Сообщить автору.',
    nSubject: s,
  }
}

export function BoloApp({ initialParams }: ModuleContentProps) {
  const openEntity = useEntityNavigation()
  const [bolos] = useState<Bolo[]>(mockBolos)
  const [created, setCreatedBolo] = useState<Bolo | null>(null)
  const firstReq = initialParams?.boloRequest as BoloNewRequest | undefined
  const [state, setState] = useState<BoloUIState>(() => {
    if (firstReq) return { ...INITIAL, ...newFormFor(firstReq.subject) }
    const entityId = initialParams?.entityType === 'bolo' ? (initialParams.entityId as string) : undefined
    return entityId ? { ...INITIAL, sel: entityId } : INITIAL
  })

  function patch(p: Partial<BoloUIState>) {
    setState((prev) => ({ ...prev, ...p }))
  }

  // «Объявить в розыск» from Поиск while this window is open → the new-BOLO form on that person
  const boloReq = useBoloRequest()
  const [seenReq, setSeenReq] = useState(() => Math.max(boloReq?.n ?? 0, firstReq?.n ?? 0))
  if (boloReq && boloReq.n > seenReq) {
    setSeenReq(boloReq.n)
    setState((prev) => ({ ...prev, ...newFormFor(boloReq.subject) }))
  }

  function toast(key: string) {
    patch({ toast: key })
    window.setTimeout(() => setState((prev) => (prev.toast === key ? { ...prev, toast: null } : prev)), 4000)
  }

  // A high-priority incoming alert shows up once shortly after opening the feed, matching the
  // reference's "notify" entry state — real UI, just locally triggered once instead of over a
  // push backend that doesn't exist yet.
  useEffect(() => {
    const t = window.setTimeout(() => patch({ incoming: true }), 600)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const all = useMemo(() => (created ? [created, ...bolos] : bolos), [bolos, created])

  // desktop tile counter: active BOLOs not read / acknowledged yet
  useEffect(() => {
    setAppBadge('bolo', all.filter((b) => statusOf(b, state.closedMap) === 'open' && b.unread && !state.acked[b.id]).length)
  }, [all, state.closedMap, state.acked])

  const navGroups = useMemo(
    () =>
      NAV_GROUPS.map((g) => ({
        title: g.title,
        items: g.items.map((n) => {
          const on = n.id === 'map' ? state.view === 'map' : state.view !== 'map' && state.nav === n.id
          const count = n.filter ? all.filter((b) => n.filter!(b, state.closedMap)).length : null
          const unread = n.filter ? all.filter((b) => n.filter!(b, state.closedMap) && b.unread && !state.acked[b.id]).length : 0
          return { ...n, on, count, unread }
        }),
      })),
    [all, state.view, state.nav, state.closedMap, state.acked],
  )

  const curDef = NAV_GROUPS.flatMap((g) => g.items).find((n) => n.id === state.nav) ?? NAV_GROUPS[0].items[0]
  const curFilter = curDef.filter!

  const navFiltered = useMemo(() => all.filter((b) => curFilter(b, state.closedMap)), [all, curFilter, state.closedMap])

  const list = useMemo(() => {
    const base = navFiltered.filter((b) => state.src === 'all' || b.src === state.src)
    const q = state.query.trim().toLowerCase()
    const filtered = q
      ? base.filter((b) => `${b.title} ${b.sub} ${b.plate ?? ''} ${b.description} ${b.tags.join(' ')}`.toLowerCase().includes(q))
      : base
    const order: Record<string, number> = { high: 0, mid: 1, low: 2 }
    return filtered.slice().sort((a, b) => order[a.prio] - order[b.prio])
  }, [navFiltered, state.src, state.query])

  const selected = list.find((b) => b.id === state.sel) ?? list[0] ?? all[0]

  if (!selected) return null

  return (
    <div className="relative flex h-full text-[14px] leading-5" style={{ color: C.text }}>
      <aside className="flex w-[248px] shrink-0 flex-col" style={{ background: C.mica, borderRight: `1px solid ${C.stroke}` }}>
        <div className="flex h-10 shrink-0 items-center gap-2.5 pl-3.5">
          <span className="flex h-[18px] w-[18px] items-center justify-center rounded-[5px]" style={{ background: '#C42B1C', color: '#fff' }}>
            <PathIcon d={ICN.bolo} className="h-3 w-3" />
          </span>
          <span className="text-[12px]">BOLO · Ориентировки</span>
        </div>
        <div className="px-3 pb-3 pt-1">
          <button
            type="button"
            onClick={() => patch({ view: 'new', dlg: null, nSubject: null })}
            className="flex h-9 w-full items-center justify-center gap-2 rounded-[6px] font-semibold hover:brightness-110"
            style={{ background: ACCENT, color: ON_ACCENT }}
          >
            <PlusIcon className="h-3.5 w-3.5" />
            Новая ориентировка
          </button>
        </div>
        <nav className="scroll flex flex-1 flex-col gap-0.5 overflow-y-auto px-2">
          {navGroups.map((g) => (
            <div key={g.title}>
              <div className="px-3 pb-1 pt-3 text-[12px] font-semibold" style={{ color: C.text2 }}>
                {g.title}
              </div>
              {g.items.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => (n.id === 'map' ? patch({ view: 'map' }) : patch({ view: 'feed', nav: n.id }))}
                  className="relative flex h-[34px] w-full items-center gap-3 rounded-[6px] px-3 hover:shadow-[inset_0_0_0_999px_rgba(255,255,255,0.06)]"
                  style={{ background: n.on ? C.sel : 'transparent' }}
                >
                  <span className="absolute left-0 top-[9px] h-4 w-[3px] rounded-[2px]" style={{ background: ACCENT, opacity: n.on ? 1 : 0 }} />
                  <PathIcon d={n.icon} className="h-4 w-4" style={{ color: n.id === 'high' ? TONE.red[1] : C.text2 }} />
                  <span className="flex-1 text-left" style={{ fontWeight: n.on ? 600 : 400 }}>
                    {n.label}
                  </span>
                  {n.count !== null && (
                    <span className="text-[12px] tabular-nums" style={{ fontWeight: n.unread ? 700 : 400, color: n.unread ? C.text : C.text2 }}>
                      {n.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="m-3 flex flex-col gap-2 rounded-[8px] p-3" style={{ background: C.card }}>
          <span className="text-[12px] font-semibold" style={{ color: C.text2 }}>
            Уведомления о новых
          </span>
          <div className="flex gap-0.5 rounded-[6px] p-0.5" style={{ background: C.search }}>
            {['Все', 'Высокий', 'Выкл'].map((t, i) => (
              <button
                key={t}
                type="button"
                onClick={() => patch({ notif: i })}
                className="h-[26px] flex-1 rounded-[5px] text-center text-[12px] hover:shadow-[inset_0_0_0_999px_rgba(255,255,255,0.06)]"
                style={{ background: state.notif === i ? C.btn : 'transparent', fontWeight: state.notif === i ? 600 : 400 }}
              >
                {t}
              </button>
            ))}
          </div>
          <span className="text-[12px] leading-4" style={{ color: C.text2 }}>
            {
              [
                'Всплывающее окно на любую новую ориентировку, высокий приоритет — ещё и со звуком.',
                'Всплывающее окно только на высокий приоритет. Остальные — точкой в списке.',
                'Только точка в списке. Высокий приоритет всё равно придёт в Почту.',
              ][state.notif]
            }
          </span>
        </div>
      </aside>

      <main className="relative flex min-w-0 flex-1 flex-col">
        {state.view === 'feed' && (
          <Feed state={state} patch={patch} toast={toast} navFiltered={navFiltered} list={list} selected={selected} navLabel={curDef.label} openEntity={openEntity} />
        )}
        {state.view === 'map' && <BoloMap all={all} state={state} patch={patch} />}
        {state.view === 'new' && (
          <BoloNew
            state={state}
            patch={patch}
            onPublish={(b) => {
              setCreatedBolo(b)
              patch({ view: 'feed', nav: 'mine', sel: b.id, nSubject: null })
              toast('pub')
            }}
          />
        )}
        {state.view === 'poster' && <BoloPoster bolo={selected} state={state} patch={patch} toast={toast} />}

        {state.pick && <BoloMapPicker state={state} patch={patch} all={all} selected={selected} />}
        {state.dlg === 'seen' && <BoloSeenDialog state={state} patch={patch} toast={toast} selected={selected} />}
        {state.dlg === 'update' && <BoloUpdateDialog state={state} patch={patch} toast={toast} selected={selected} />}
        {state.dlg === 'close' && <BoloCloseDialog state={state} patch={patch} toast={toast} selected={selected} />}
        {state.menu && statusOf(selected, state.closedMap) === 'open' && <BoloMenu state={state} patch={patch} toast={toast} selected={selected} />}
        {state.incoming && <BoloIncomingBanner patch={patch} acked={state.acked} />}
        {state.toast && <BoloToast toastKey={state.toast} selected={selected} />}
      </main>
    </div>
  )
}
