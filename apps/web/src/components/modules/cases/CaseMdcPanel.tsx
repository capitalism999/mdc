import { useState, type ReactNode } from 'react'
import { LicensePlate } from '../shared/LicensePlate'
import { mdcIdByTitle, mdcSection, type MdcFine, type MdcLink, type MdcRow, type MdcTone } from './caseMdc'
import { useMdcTags, type MdcTag } from '../search/mdcStore'
import { SEARCH_TAG_SEED, SEARCH_TAG_TONE } from '../search/searchLogic'

const TAG_SEED = SEARCH_TAG_SEED as unknown as Record<string, MdcTag[]>
const TAG_TONE = SEARCH_TAG_TONE as unknown as Record<string, MdcTone>

/**
 * The MDC half of the case inspector: everything the department database
 * (Поиск) knows about a participant or vehicle, pulled live from it — status
 * banners, BOLO, documents, licences, criminal history, fines, vehicles,
 * weapons, biometrics, other cases, MDC notes; for officers their service
 * file. Every linked name/plate/serial opens that record in Поиск.
 */

export const MDC_TONE: Record<MdcTone, { bg: string; fg: string }> = {
  red: { bg: 'rgba(232,17,35,0.2)', fg: '#FF99A4' },
  amber: { bg: 'rgba(255,185,0,0.16)', fg: '#FCE100' },
  green: { bg: 'rgba(16,124,16,0.28)', fg: '#6CCB5F' },
  grey: { bg: 'rgba(255,255,255,0.08)', fg: '#C8C8C8' },
  blue: { bg: 'rgba(0,120,212,0.25)', fg: '#99D9FF' },
}

const CAR_PHOTO = '/assets/search/9c4359f8cb243131e90b0261de58cce8.png'

type OpenRec = (id: string, label?: string) => void

function Section({ title, aside, children }: { title: ReactNode; aside?: ReactNode; children: ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 ml-1 flex items-center gap-2 text-[13px] font-semibold text-[#C2C2C2]">
        <span className="min-w-0 flex-1 truncate">{title}</span>
        {aside}
      </div>
      <div className="rounded-[12px] bg-[#303030] px-3.5">{children}</div>
    </div>
  )
}

function Dot({ tone }: { tone: MdcTone | null | undefined }) {
  if (!tone) return null
  return <span className="mr-1.5 inline-block h-2 w-2 shrink-0 rounded-full align-middle" style={{ background: MDC_TONE[tone].fg }} />
}

function Chip({ tone, children }: { tone: MdcTone; children: ReactNode }) {
  return (
    <span className="whitespace-nowrap rounded-[10px] px-2 py-px text-[11px] font-semibold" style={{ background: MDC_TONE[tone].bg, color: MDC_TONE[tone].fg }}>
      {children}
    </span>
  )
}

/** One field: label above (12px), value below; a status chip sits on the
 * value line, a text note under it — same look as the case's «По делу». */
function Row({ k, v, sub, tone, onClick, last }: { k: string; v: ReactNode; sub?: ReactNode; tone?: MdcTone | null; onClick?: () => void; last?: boolean }) {
  const textSub = typeof sub === 'string'
  const body = (
    <>
      <span className="text-[12px] leading-4 text-[#C2C2C2]">{k}</span>
      <span className="flex flex-wrap items-center gap-x-2 gap-y-1 leading-[20px]">
        <span className={onClick ? 'text-[#99D9FF] group-hover:underline' : ''}>
          <Dot tone={tone} />
          {v}
        </span>
        {sub && !textSub && sub}
      </span>
      {sub && textSub && <span className="text-[12px] leading-4 text-[#C2C2C2]">{sub}</span>}
    </>
  )
  const cls = `flex w-full flex-col gap-1 py-2.5 text-left text-[13px] ${last ? '' : 'border-b border-[#3A3A3A]'}`
  return onClick ? (
    <button type="button" onClick={onClick} className={`group ${cls}`}>
      {body}
    </button>
  ) : (
    <div className={cls}>{body}</div>
  )
}

function rowsOf(rows: MdcRow[], open: OpenRec) {
  return rows.map((r, i) => (
    <Row key={r.k + i} k={r.k} v={r.v} tone={r.dot} last={i === rows.length - 1} onClick={r.link?.[0] === 'rec' && r.link[1] ? () => open(r.link![1]!, r.v) : undefined} />
  ))
}

const FINE_ST: Record<MdcFine['st'], [string, MdcTone]> = { paid: ['Оплачен', 'green'], unpaid: ['Не оплачен', 'amber'], overdue: ['Просрочен', 'red'] }

function Fines({ fines }: { fines: MdcFine[] }) {
  if (!fines.length) return null
  const due = fines.filter((f) => f.st !== 'paid')
  const sum = due.reduce((s, f) => s + f.sum, 0)
  const overdue = fines.filter((f) => f.st === 'overdue').length
  return (
    <Section title={`Штрафы · ${fines.length}`} aside={due.length ? <Chip tone={overdue ? 'red' : 'amber'}>Долг ${sum.toLocaleString('ru-RU')}</Chip> : <Chip tone="green">Всё оплачено</Chip>}>
      {fines.map((f, i) => (
        <div key={f.date + f.code + i} className={`flex gap-2.5 py-2.5 text-[13px] ${i === fines.length - 1 ? '' : 'border-b border-[#3A3A3A]'}`}>
          <span className="min-w-0 flex-1">
            <span className="block">
              {f.name} <span className="text-[#C2C2C2]">· {f.code}</span>
            </span>
            <span className="block text-[12px] text-[#C2C2C2]">
              {f.date} · {f.who}
            </span>
          </span>
          <span className="flex shrink-0 flex-col items-end gap-1">
            <span className="font-semibold tabular-nums">${f.sum}</span>
            <Chip tone={FINE_ST[f.st][1]}>{FINE_ST[f.st][0]}</Chip>
          </span>
        </div>
      ))}
    </Section>
  )
}

function OtherCases({ rows, caseNo }: { rows: [string, string][]; caseNo: string }) {
  const other = rows.filter(([no]) => no !== caseNo)
  if (!other.length) return null
  return (
    <Section title="Другие дела">
      {other.map(([no, what], i) => (
        <Row key={no} k={no} v={what} last={i === other.length - 1} />
      ))}
    </Section>
  )
}

/** Status strip + flags for the header card (under the name). */
export function MdcHeaderFlags({ link, onOpenBolo }: { link: MdcLink; onOpenBolo: () => void }) {
  const { rec, bolo, veh } = link
  // Tags («Опасен», «Вооружён»…) — shared with every Поиск window, live.
  const shared = useMdcTags()
  const tags = (shared ?? {})[rec.id] ?? TAG_SEED[rec.id] ?? []
  // One «important» card instead of a pile of chips: the MDC state (custody,
  // warrant…) and the warning tags as a single line. Informational badges
  // (resident, priors, licences) live in the MDC sections below.
  const warnTone: MdcTone = tags.some((t) => TAG_TONE[t.n] === 'red') ? 'red' : (rec.alertTone ?? (tags.length ? (TAG_TONE[tags[0].n] ?? 'amber') : 'amber'))
  const cardTone: MdcTone = rec.alert ? (rec.alertTone ?? 'amber') : warnTone
  return (
    <div className="flex w-full flex-col gap-2">
      {(rec.alert || tags.length > 0) && (
        <div className="flex gap-2 rounded-[8px] px-2.5 py-2 text-left text-[12px] leading-[17px]" style={{ background: MDC_TONE[cardTone].bg }}>
          <svg className="mt-px shrink-0" width="14" height="14" viewBox="0 0 20 20" fill="none" stroke={MDC_TONE[cardTone].fg} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10 3l8 14H2zM10 8.5v4M10 14.8v.2" />
          </svg>
          <span className="min-w-0 flex-1">
            {rec.alert && <span className="block font-semibold text-white">{rec.alert}</span>}
            {tags.length > 0 && (
              <span className="block" style={{ color: MDC_TONE[warnTone].fg }}>
                {tags.map((t, i) => (
                  <span key={t.n} title={`Тег MDC · ${t.by}, ${t.d}${t.a > 0 ? ' · ограниченный доступ' : ''}${t.note ? ` · ${t.note}` : ''}`}>
                    {i > 0 && <span className="text-[#9A9A9A]"> · </span>}
                    {t.n}
                  </span>
                ))}
              </span>
            )}
          </span>
        </div>
      )}
      {bolo && !bolo.restricted && (
        <button type="button" onClick={onOpenBolo} className="rounded-[8px] px-2.5 py-2 text-left text-[12px] leading-[17px] hover:brightness-110" style={{ background: MDC_TONE.red.bg }}>
          <span className="flex items-center gap-1.5 font-semibold text-[#FF99A4]">
            <span className="flex-1">
              {bolo.vid ?? 'Ориентировка'} · BOLO {bolo.no}
            </span>
            {bolo.armed && <Chip tone="red">Вооружён</Chip>}
          </span>
          {bolo.why && <span className="block text-white">За {bolo.why}</span>}
          {bolo.instr && <span className="mt-0.5 block text-[#C2C2C2]">{bolo.instr}</span>}
        </button>
      )}
      {bolo?.restricted && (
        <div className="rounded-[8px] px-2.5 py-1.5 text-left text-[12px] leading-[17px]" style={{ background: MDC_TONE.grey.bg, color: '#C8C8C8' }}>
          Закрытая ориентировка {bolo.no} · доступ: {bolo.access}. Куратор — {bolo.ct}.
        </div>
      )}
      {veh?.wanted && !bolo && (
        <div className="rounded-[8px] px-2.5 py-1.5 text-left text-[12px] leading-[17px]" style={{ background: MDC_TONE[veh.wanted.tone ?? 'amber'].bg }}>
          <span className="block font-semibold" style={{ color: MDC_TONE[veh.wanted.tone ?? 'amber'].fg }}>
            {veh.wanted.title}
          </span>
          <span className="block text-white">{veh.wanted.text}</span>
          <span className="block text-[#C2C2C2]">
            {veh.wanted.by}
            {veh.wanted.date ? ` · ${veh.wanted.date}` : ''}
          </span>
        </div>
      )}
    </div>
  )
}

/** Header-section title that explains what the record number is. */
function DossierTitle({ label, code }: { label: string; code?: string }) {
  return (
    <>
      {label}
      {code && <span className="ml-1.5 font-normal text-[#9A9A9A]">· {code}</span>}
    </>
  )
}

export function MdcPersonDetails({ link, caseNo, open }: { link: MdcLink; caseNo: string; open: OpenRec }) {
  const { rec, rich } = link
  const svc = mdcSection(rec, 'Сведения')
  const svcVal = (k: string) => svc.find((r) => r.k === k)?.v
  const cases = mdcSection(rec, 'Упоминания в делах').map((r) => [r.k, r.v] as [string, string])

  if (!rich) {
    // Record without an extended dossier: show its own sections as stored.
    return (
      <>
        {(rec.sections ?? [])
          .filter(([t]) => t !== 'Упоминания в делах')
          .map(([t, rows], idx) => (
            <Section key={t} title={idx === 0 ? <DossierTitle label="Досье MDC" code={rec.code} /> : t}>
              {rowsOf(rows, open)}
            </Section>
          ))}
        <OtherCases rows={cases} caseNo={caseNo} />
      </>
    )
  }

  const info = (k: string) => rich.info.find((r) => r[0] === k)
  const idDoc = info('ID документ')
  const work = info('Занятость')
  const bank = info('Банковские счета')
  const family = info('Семья')
  const basis = info('Основание')
  const identity: { k: string; v: string; sub?: string; tone?: MdcTone; click?: () => void }[] = [
    idDoc && { k: 'Документ', v: idDoc[1], sub: idDoc[3] },
    info('Дата рождения') && { k: 'Дата рождения', v: info('Дата рождения')![1] },
    info('Пол') && { k: 'Пол', v: info('Пол')![1] },
    info('Правовой статус') && { k: 'Статус', v: info('Правовой статус')![1], sub: basis ? `${basis[1]} · ${basis[3]}` : undefined },
    svcVal('Рост и приметы') && { k: 'Приметы', v: svcVal('Рост и приметы')! },
    { k: 'Телефон', v: rich.phone },
    svcVal('Адрес') && { k: 'Адрес', v: svcVal('Адрес')! },
    work && { k: 'Работа', v: work[1], sub: work[3] || undefined },
    family && { k: 'Семья', v: family[1], sub: family[3] || undefined, click: mdcIdByTitle(family[1]) ? () => open(mdcIdByTitle(family[1])!, family[1]) : undefined },
    bank && { k: 'Счёт', v: bank[1], sub: bank[3] },
  ].filter(Boolean) as { k: string; v: string; sub?: string; tone?: MdcTone; click?: () => void }[]

  const licences = mdcSection(rec, 'Лицензии')

  return (
    <>
      <Section title={<DossierTitle label="Личность" code={rec.code} />}>
        {identity.map((r, i) => (
          <Row key={r.k} k={r.k} v={r.v} sub={r.sub} tone={r.tone} onClick={r.click} last={i === identity.length - 1} />
        ))}
      </Section>

      {(rich.gang || rich.orgs.length > 0) && (
        <Section title="Связи">
          {rich.gang && <Row k="Банда" v={rich.gang[0]} sub={rich.gang[1]} tone="red" onClick={() => open('o_fdb', rich.gang![0])} last={!rich.orgs.some(([n]) => n !== rich.gang![0])} />}
          {rich.orgs
            .filter(([n]) => n !== rich.gang?.[0])
            .map(([n], i, arr) => (
              <Row key={n} k="Организация" v={n} last={i === arr.length - 1} />
            ))}
        </Section>
      )}

      {licences.length > 0 && <Section title="Лицензии">{rowsOf(licences, open)}</Section>}

      <Section title={`Криминальная история · ${rich.crimes.length}`} aside={rich.strikes ? <Chip tone="amber">Страйков: {rich.strikes}</Chip> : undefined}>
        {rich.crimes.length === 0 && <div className="py-2.5 text-[13px] text-[#C2C2C2]">Записей нет</div>}
        {rich.crimes.map((c, i) => (
          <div key={c.date + c.tag} className={`flex flex-col gap-1 py-2.5 text-[13px] ${i === rich.crimes.length - 1 ? '' : 'border-b border-[#3A3A3A]'}`}>
            <span className="flex items-center gap-1.5">
              <Chip tone={c.tag === 'РОЗЫСК' ? 'red' : c.tag === 'АРЕСТ' ? 'amber' : 'grey'}>{c.tag}</Chip>
              <span className="flex-1 text-[12px] text-[#C2C2C2]">
                {c.date}, {c.time}
              </span>
              <Chip tone={c.active ? 'red' : 'grey'}>{c.status}</Chip>
            </span>
            {c.charges.map(([code, name, cat]) => (
              <span key={code} className="leading-[18px]">
                <span className="font-semibold">{code}</span> {name}
                <span className="text-[12px] text-[#C2C2C2]"> · {cat.toLowerCase()}</span>
              </span>
            ))}
            <span className="text-[12px] text-[#C2C2C2]">{c.who}</span>
          </div>
        ))}
      </Section>

      <Fines fines={rich.fines} />

      {rich.vehicles.length > 0 && (
        <Section title={`Транспорт · ${rich.vehicles.length}`}>
          {rich.vehicles.map(([plate, model, , st, , id], i) => {
            const vid = id || mdcIdByTitle(plate)
            const body = (
              <>
                <LicensePlate plate={plate} size="md" />
                <span className="min-w-0 flex-1 text-left">
                  <span className={`block truncate ${vid ? 'text-[#99D9FF] group-hover:underline' : ''}`}>{model}</span>
                  {st && <Chip tone={st === 'РОЗЫСК' ? 'red' : 'grey'}>{st}</Chip>}
                </span>
              </>
            )
            const cls = `flex w-full items-center gap-3 py-2.5 text-[13px] ${i === rich.vehicles.length - 1 ? '' : 'border-b border-[#3A3A3A]'}`
            return vid ? (
              <button key={plate} type="button" onClick={() => open(vid, plate)} className={`group ${cls}`}>
                {body}
              </button>
            ) : (
              <div key={plate} className={cls}>
                {body}
              </div>
            )
          })}
        </Section>
      )}

      {rich.weapons.length > 0 && (
        <Section title={`Оружие · ${rich.weapons.length}`}>
          {rich.weapons.map(([model, serial, st, id], i) => (
            <Row
              key={serial}
              k={serial}
              v={model}
              sub={<Chip tone={/ДЕЙСТВУЕТ/.test(st) ? 'green' : 'red'}>{st}</Chip>}
              onClick={id ? () => open(id, serial) : undefined}
              last={i === rich.weapons.length - 1}
            />
          ))}
        </Section>
      )}

      {rich.property.length > 0 && (
        <Section title="Недвижимость">
          {rich.property.map(([addr, role], i) => (
            <Row key={addr} k={role} v={addr} last={i === rich.property.length - 1} />
          ))}
        </Section>
      )}

      <Section title="Биометрия">
        <Row k="Отпечатки" v={rich.fp} sub={rich.fpNote} />
        <Row k="ДНК" v={rich.dna} last />
      </Section>

      <OtherCases rows={cases} caseNo={caseNo} />

      {rich.notes.length > 0 && (
        <Section title={`Заметки в MDC · ${rich.notes.length}`}>
          {rich.notes.map(([who, init, color, when, text], i) => (
            <div key={i} className={`flex gap-2.5 py-2.5 ${i === rich.notes.length - 1 ? '' : 'border-b border-[#3A3A3A]'}`}>
              <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white" style={{ background: color }}>
                {init}
              </span>
              <span className="min-w-0 flex-1 text-[13px] leading-[19px]">
                <span className="font-semibold">{who}</span> <span className="text-[11px] text-[#C2C2C2]">{when}</span>
                <span className="block">{text}</span>
              </span>
            </div>
          ))}
        </Section>
      )}
    </>
  )
}

export function MdcEmployeeDetails({ link }: { link: MdcLink }) {
  const { rec, emp } = link
  if (!emp) return null
  const onDuty = /^на смене/.test(emp.now)
  const rows: [string, string, MdcTone?][] = [
    ['Полное имя', emp.full],
    ['Звание', emp.rank],
    ['Должность', emp.pos],
    ['Подразделение', emp.unit],
    ['Жетон', emp.badge],
    ['Позывной', emp.radio],
    ['Телефон', emp.phone],
    ['Сейчас', emp.now, onDuty ? 'green' : 'grey'],
    ['В департаменте', `с ${emp.since}`],
  ]
  if (emp.ftp) rows.push(['Обучение', emp.ftp, 'amber'])
  return (
    <>
      <Section title={<DossierTitle label="Служба" code={rec.code} />}>
        {rows.map(([k, v, tone], i) => (
          <Row key={k} k={k} v={v} tone={tone} last={i === rows.length - 1} />
        ))}
      </Section>
      {emp.certs.length > 0 && (
        <Section title="Допуски">
          {emp.certs.map(([name, until, tone, by], i) => (
            <Row key={name} k={name} v={until} sub={by} tone={tone as MdcTone} last={i === emp.certs.length - 1} />
          ))}
        </Section>
      )}
      {emp.gear.length > 0 && (
        <Section title="Закреплено">
          {emp.gear.map(([k, v], i) => (
            <Row key={k} k={k} v={v} last={i === emp.gear.length - 1} />
          ))}
        </Section>
      )}
      {emp.journal.length > 0 && (
        <Section title="Последнее в личном деле">
          {emp.journal.slice(0, 2).map(([date, kind, title, text, by], i, arr) => (
            <div key={date + title} className={`flex flex-col gap-0.5 py-2.5 text-[13px] ${i === arr.length - 1 ? '' : 'border-b border-[#3A3A3A]'}`}>
              <span className="flex items-center gap-1.5">
                <Chip tone={kind === 'award' ? 'green' : kind === 'warn' ? 'red' : kind === 'train' ? 'blue' : 'grey'}>{title}</Chip>
                <span className="text-[12px] text-[#C2C2C2]">{date}</span>
              </span>
              <span className="leading-[18px]">{text}</span>
              <span className="text-[12px] text-[#C2C2C2]">{by}</span>
            </div>
          ))}
        </Section>
      )}
    </>
  )
}

export function MdcVehicleDetails({ link, caseNo, open }: { link: MdcLink; caseNo: string; open: OpenRec }) {
  const { rec, veh } = link
  const reg = mdcSection(rec, 'Регистрация')
  const regVal = (k: string) => reg.find((r) => r.k === k)?.v
  const insTone = mdcSection(rec, 'Страховка').find((r) => r.dot)?.dot ?? null
  const cases = [...(veh?.cases ?? []), ...mdcSection(rec, 'Упоминания в делах').map((r) => [r.k, r.v] as [string, string])].filter(([no], i, a) => a.findIndex(([n]) => n === no) === i)
  if (!veh) {
    return (
      <>
        {(rec.sections ?? [])
          .filter(([t]) => t !== 'Упоминания в делах')
          .map(([t, rows], idx) => (
            <Section key={t} title={idx === 0 ? <DossierTitle label="Регистрация MDC" code={rec.plate} /> : t}>
              {rowsOf(rows, open)}
            </Section>
          ))}
        <OtherCases rows={cases} caseNo={caseNo} />
      </>
    )
  }
  const ownerId = veh.owner || null
  const regRows: { k: string; v: ReactNode; tone?: MdcTone | null }[] = [
    { k: 'Модель', v: `${veh.make} ${veh.model} · ${veh.type.toLowerCase()}` },
    {
      k: 'Цвет',
      v: (
        <>
          <span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full align-middle shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35)]" style={{ background: veh.color[1] }} />
          {veh.color[0]}
        </>
      ),
    },
    regVal('VIN') ? { k: 'VIN', v: regVal('VIN')! } : null,
    regVal('Регистрация до') ? { k: 'Регистрация', v: `до ${regVal('Регистрация до')}` } : null,
    { k: 'Талон DMV', v: veh.talon },
    { k: 'Страховка', v: veh.insurance, tone: insTone },
    ...veh.dmv.filter(([k]) => k === 'Последний осмотр' || k === 'Пробег').map(([k, v]) => ({ k, v })),
  ].filter(Boolean) as { k: string; v: ReactNode; tone?: MdcTone | null }[]
  return (
    <>
      <Section title={<DossierTitle label="Регистрация MDC" code={rec.plate} />}>
        {regRows.map((r, i) => (
          <Row key={r.k} k={r.k} v={r.v} tone={r.tone} last={i === regRows.length - 1} />
        ))}
      </Section>
      <Section title="Владельцы">
        {veh.owners.map(([name, from, to, how], i) => {
          const id = i === 0 && ownerId ? ownerId : mdcIdByTitle(name)
          return <Row key={name + from} k={to === 'сейчас' ? 'Сейчас' : `${from} – ${to}`} v={name} sub={to === 'сейчас' ? `с ${from} · ${how}` : how} onClick={id ? () => open(id, name) : undefined} last={i === veh.owners.length - 1} />
        })}
        {veh.biz && <Row k="Бизнес" v={veh.biz} last />}
      </Section>
      <Fines fines={veh.fines} />
      <OtherCases rows={cases} caseNo={caseNo} />
    </>
  )
}

/** Card for a participant/vehicle that has no MDC record. */
export function MdcMissing({ title, text, action }: { title: string; text: string; action?: { label: string; onClick: () => void } }) {
  return (
    <div className="flex flex-col gap-2 rounded-[12px] border border-dashed border-[#4A4A4A] px-3.5 py-3">
      <span className="text-[13px] font-semibold">{title}</span>
      <span className="text-[12px] leading-[17px] text-[#C2C2C2]">{text}</span>
      {action && (
        <button type="button" onClick={action.onClick} className="h-[30px] self-start rounded-[6px] bg-[#3A3A3A] px-3 text-[13px] hover:brightness-125">
          {action.label}
        </button>
      )}
    </div>
  )
}

/** Vehicle photos with paging (prev/next + dots). Known vehicles show the
 * registry render from three angles; an unidentified one shows camera frames
 * of the silhouette. */
export function VehiclePhotos({ known }: { known: boolean }) {
  const [i, setI] = useState(0)
  const n = 3
  const go = (d: number) => setI((p) => (p + d + n) % n)
  const frames = [
    { flip: false, zoom: 1, ox: 50 },
    { flip: true, zoom: 1, ox: 50 },
    { flip: false, zoom: 1.7, ox: 18 },
  ]
  const f = frames[i]
  return (
    <div className="group/ph relative h-[150px] w-full overflow-hidden rounded-[10px]" style={{ background: known ? 'linear-gradient(180deg, #36414E 0%, #36414E 62%, #2A2F35 62%, #2A2F35 100%)' : 'linear-gradient(180deg, #2B3036 0%, #23272C 100%)' }}>
      {known ? (
        <img
          src={CAR_PHOTO}
          alt={`Фото ${i + 1} из ${n}`}
          draggable={false}
          className="absolute left-1/2 top-[10px] h-[126px] w-[210px] object-contain transition-transform duration-200"
          style={{ transform: `translateX(-50%) scale(${f.flip ? -f.zoom : f.zoom}, ${f.zoom})`, transformOrigin: `${f.ox}% 60%` }}
        />
      ) : (
        <svg width="220" height="132" viewBox="0 0 100 60" aria-label={`Кадр ${i + 1} из ${n}`} className="absolute left-1/2 top-[14px] transition-transform duration-200" style={{ transform: `translateX(-50%) scale(${f.flip ? -f.zoom : f.zoom}, ${f.zoom})`, transformOrigin: `${f.ox}% 60%`, filter: 'blur(0.4px)' }}>
          <path d="M6 46v-5l4-3 9-10c2-2 5-4 9-4h30c4 0 7 2 10 5l7 7 14 2c3 1 5 3 5 6v2z" fill="rgba(255,255,255,0.22)" />
          <path d="M24 29l5-4h12v10H18zM45 25h12c3 0 5 1 7 3l5 7H45z" fill="rgba(255,255,255,0.10)" />
          <circle cx="25" cy="46" r="7" fill="#1A1D21" />
          <circle cx="76" cy="46" r="7" fill="#1A1D21" />
        </svg>
      )}
      {(
        [
          [-1, 'left-1.5', 'Предыдущее фото', 'M12.5 4.5L7 10l5.5 5.5'],
          [1, 'right-1.5', 'Следующее фото', 'M7.5 4.5L13 10l-5.5 5.5'],
        ] as const
      ).map(([d, pos, label, path]) => (
        <button
          key={d}
          type="button"
          onClick={() => go(d)}
          aria-label={label}
          className={`absolute ${pos} top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white opacity-70 transition-opacity hover:bg-black/65 group-hover/ph:opacity-100`}
        >
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d={path} />
          </svg>
        </button>
      ))}
      <span className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
        {Array.from({ length: n }, (_, k) => (
          <button key={k} type="button" onClick={() => setI(k)} aria-label={`Фото ${k + 1}`} className="h-1.5 rounded-full transition-all" style={{ width: k === i ? 16 : 6, background: k === i ? '#FFFFFF' : 'rgba(255,255,255,0.45)' }} />
        ))}
      </span>
      <span className="absolute bottom-1.5 right-2 rounded-[6px] bg-black/50 px-1.5 text-[11px] tabular-nums text-white">
        {i + 1} / {n}
      </span>
    </div>
  )
}
