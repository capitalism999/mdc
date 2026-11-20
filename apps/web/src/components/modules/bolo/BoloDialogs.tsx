import type { ReactNode } from 'react'
import type { Bolo } from '../../../types'
import { ACCENT, C, ON_ACCENT, TONE, type BoloUIState } from './BoloApp'
import { nearestPlace } from './BoloMap'
import { CloseIcon, PathIcon } from './icons'
import { MapThumb } from '../shared/sanAndreasMap'

interface DlgProps {
  state: BoloUIState
  patch: (p: Partial<BoloUIState>) => void
  toast: (key: string) => void
  selected: Bolo
}

function Toggle({ on }: { on: boolean }) {
  return (
    <span className="relative h-5 w-10 shrink-0 rounded-[10px] box-border" style={{ background: on ? TONE.red[1] : 'transparent', border: `1px solid ${on ? TONE.red[1] : C.stroke2}` }}>
      <span className="absolute left-0.5 top-0.5 h-3.5 w-3.5 rounded-full transition-transform" style={{ background: on ? '#000' : C.text2, transform: on ? 'translateX(20px)' : 'translateX(0)' }} />
    </span>
  )
}

function DialogShell({ title, sub, width, children, foot }: { title: string; sub: string; width: number; children: ReactNode; foot: ReactNode }) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div role="dialog" aria-label={title} className="box-border overflow-hidden rounded-[10px]" style={{ width, background: C.dialog, border: `1px solid ${C.stroke}`, boxShadow: '0 32px 64px rgba(0,0,0,0.55)' }}>
        <div className="flex flex-col gap-3.5 p-6">
          <div className="flex flex-col gap-0.5">
            <span className="text-[20px] font-semibold leading-7">{title}</span>
            <span className="text-[13px]" style={{ color: C.text2 }}>
              {sub}
            </span>
          </div>
          {children}
        </div>
        <div className="flex justify-end gap-2 p-3.5 px-6" style={{ background: C.dialogFoot, borderTop: `1px solid ${C.stroke}` }}>
          {foot}
        </div>
      </div>
    </div>
  )
}

const DIRS = ['На север', 'На юг', 'На восток', 'На запад', 'Стоит на месте']
const HOWS = ['Пешком', 'В Bravado Bison', 'В другой машине']

export function BoloSeenDialog({ state, patch, toast, selected }: DlgProps) {
  const place = state.seenPin ? nearestPlace(state.seenPin.x, state.seenPin.y) : 'Grove St / Forum Dr, Davis'
  const pinPos = state.seenPin ?? { x: 46, y: 76 }

  function send() {
    const pin = state.seenPin ?? { x: 46, y: 76 }
    patch({
      extraSeenMap: { ...state.extraSeenMap, [selected.id]: { x: pin.x, y: pin.y, place } },
      dlg: null,
    })
    toast(state.backup ? 'backup' : 'seen')
  }

  return (
    <DialogShell
      title={`Замечен: ${selected.title}`}
      sub={`${selected.no} · отметку увидят все на смене и автор ориентировки`}
      width={640}
      foot={
        <>
          <button type="button" onClick={() => patch({ dlg: null })} className="h-[34px] w-[120px] rounded-[6px] text-center hover:brightness-110" style={{ background: C.btn }}>
            Отмена
          </button>
          <button type="button" onClick={send} className="h-[34px] w-[200px] rounded-[6px] text-center font-semibold hover:brightness-110" style={{ background: ACCENT, color: ON_ACCENT }}>
            Отправить отметку
          </button>
        </>
      }
    >
      <div className="flex gap-3.5">
        <div className="relative h-[170px] w-[220px] shrink-0 overflow-hidden rounded-[10px]" style={{ background: C.mapWater }}>
          <MapThumb points={[pinPos]} maxZoom={6}>
            <span className="absolute h-[22px] w-[22px] -translate-x-1/2 -translate-y-full rotate-[-45deg] rounded-[50%_50%_50%_0]" style={{ left: `${pinPos.x}%`, top: `${pinPos.y}%`, background: ACCENT, border: '2px solid #fff' }} />
          </MapThumb>
          <button
            type="button"
            onClick={() => patch({ pick: 'seen', dlg: null, pin: state.seenPin ?? { x: 46, y: 76 } })}
            className="absolute inset-x-1.5 bottom-1.5 h-7 rounded-[6px] text-center text-[12px] font-semibold text-white hover:brightness-125"
            style={{ background: 'rgba(0,0,0,0.6)' }}
          >
            Уточнить на карте
          </button>
        </div>
        <div className="flex flex-1 flex-col gap-2.5">
          <label className="flex flex-col gap-1">
            <span className="text-[12px] font-semibold" style={{ color: C.text2 }}>
              Где
            </span>
            <input value={place} readOnly className="h-8 rounded-[6px] px-2.5" style={{ background: C.field, borderBottom: `1px solid ${C.stroke2}`, color: C.text }} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[12px] font-semibold" style={{ color: C.text2 }}>
              Когда
            </span>
            <input readOnly value="Сейчас · 17.11, 16:12" className="h-8 rounded-[6px] px-2.5" style={{ background: C.field, borderBottom: `1px solid ${C.stroke2}`, color: C.text }} />
          </label>
          <div className="flex flex-col gap-1">
            <span className="text-[12px] font-semibold" style={{ color: C.text2 }}>
              Куда двигался
            </span>
            <div className="flex flex-wrap gap-1">
              {DIRS.map((t, i) => (
                <button key={t} type="button" onClick={() => patch({ dir: i })} className="h-7 whitespace-nowrap rounded-[14px] px-2.5 text-[12px] hover:shadow-[inset_0_0_0_999px_rgba(255,255,255,0.08)]" style={{ background: state.dir === i ? C.btn : 'transparent', fontWeight: state.dir === i ? 600 : 400 }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[12px] font-semibold" style={{ color: C.text2 }}>
          Как выглядел
        </span>
        <div className="flex flex-wrap gap-1">
          {HOWS.map((t, i) => {
            const on = !!state.how[i]
            return (
              <button
                key={t}
                type="button"
                onClick={() => patch({ how: { ...state.how, [i]: !on } })}
                className="h-7 whitespace-nowrap rounded-[14px] px-2.5 text-[12px] hover:shadow-[inset_0_0_0_999px_rgba(255,255,255,0.08)]"
                style={{ background: on ? C.btn : 'transparent', fontWeight: on ? 600 : 400 }}
              >
                {t}
              </button>
            )
          })}
        </div>
      </div>
      <label className="flex flex-col gap-1">
        <span className="text-[12px] font-semibold" style={{ color: C.text2 }}>
          Комментарий
        </span>
        <textarea rows={2} defaultValue="Пешком, в красной бандане, зашёл во двор дома 1207." className="resize-none rounded-[6px] px-2.5 py-2 text-[14px] leading-5" style={{ background: C.field, borderBottom: `1px solid ${C.stroke2}`, color: C.text }} />
      </label>
      <button type="button" onClick={() => patch({ backup: !state.backup })} className="flex items-center gap-3 rounded-[8px] p-2.5 hover:brightness-110" style={{ background: state.backup ? TONE.red[0] : C.card }}>
        <Toggle on={state.backup} />
        <span className="flex flex-col text-left leading-[17px]">
          <span className="font-semibold" style={{ color: state.backup ? TONE.red[1] : C.text }}>
            Нужна поддержка
          </span>
          <span className="text-[12px]" style={{ color: C.text2 }}>
            Диспетчер получит вызов с вашей позицией, ближайшие экипажи — уведомление
          </span>
        </span>
      </button>
    </DialogShell>
  )
}

const UPD_WHAT = ['Фото', 'Транспорт', 'Последнее место', 'Приметы', 'Инструкция', 'Вид или статья']

export function BoloUpdateDialog({ state, patch, toast, selected }: DlgProps) {
  const ack = selected.acknowledgedOf + (state.acked[selected.id] ? 1 : 0)
  const textVal = state.updText === null ? selected.updateDraft ?? '' : state.updText

  function confirm() {
    const chosen = UPD_WHAT.filter((_, i) => state.updWhat[i]).map((t) => t.toLowerCase())
    const summary = `Обновлено: ${chosen.join(', ') || 'описание'}${textVal ? `. ${textVal}` : ''}`
    patch({ updatedMap: { ...state.updatedMap, [selected.id]: summary }, dlg: null, updText: null })
    toast('upd')
  }

  return (
    <DialogShell
      title="Обновить ориентировку"
      sub={`${selected.no} · ${selected.title}`}
      width={560}
      foot={
        <>
          <button type="button" onClick={() => patch({ dlg: null, updText: null })} className="h-[34px] w-[120px] rounded-[6px] text-center hover:brightness-110" style={{ background: C.btn }}>
            Отмена
          </button>
          <button type="button" onClick={confirm} className="h-[34px] w-[160px] rounded-[6px] text-center font-semibold hover:brightness-110" style={{ background: ACCENT, color: ON_ACCENT }}>
            Обновить
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold">Что изменилось</span>
        <div className="flex flex-wrap gap-1.5">
          {UPD_WHAT.map((t, i) => {
            const on = !!state.updWhat[i]
            return (
              <button
                key={t}
                type="button"
                onClick={() => patch({ updWhat: { ...state.updWhat, [i]: !on } })}
                className="h-[30px] whitespace-nowrap rounded-[15px] px-3 text-[13px] hover:brightness-110"
                style={{ background: on ? '#FFFFFF' : C.btn, color: on ? '#1B1B1B' : C.text, fontWeight: on ? 600 : 400 }}
              >
                {t}
              </button>
            )
          })}
        </div>
      </div>
      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold">Коротко для смены</span>
        <textarea
          rows={3}
          value={textVal}
          onChange={(e) => patch({ updText: e.target.value })}
          placeholder="Что нового, одной-двумя фразами"
          className="resize-none rounded-[6px] px-2.5 py-2 text-[14px] leading-5"
          style={{ background: C.field, borderBottom: `1px solid ${C.stroke2}`, color: C.text }}
        />
        <span className="text-[12px]" style={{ color: C.text2 }}>
          Сами поля карточки правятся в форме ориентировки, этот текст попадёт в уведомление и историю.
        </span>
      </label>
      <div className="flex flex-col gap-1">
        {(
          [
            ['updNotify', `Уведомить ознакомившихся · ${ack}`, 'Всплывёт у них с пометкой «Обновлена»'],
            ['updReack', 'Попросить ознакомиться заново', 'Счётчик «Ознакомились» начнётся с нуля'],
          ] as const
        ).map(([key, t, sub]) => {
          const on = !!state[key]
          return (
            <button key={key} type="button" onClick={() => patch({ [key]: !on } as Partial<BoloUIState>)} className="-mx-1.5 flex items-center gap-2.5 rounded-[6px] px-1.5 py-1.5 text-left hover:bg-white/5">
              <span className="box-border flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[4px]" style={{ background: on ? ACCENT : 'transparent', border: `1px solid ${on ? ACCENT : C.stroke2}`, color: ON_ACCENT }}>
                {on && <PathIcon d="M4.5 10.5l3.5 3.5 7.5-8" className="h-[11px] w-[11px]" />}
              </span>
              <span className="flex flex-col leading-[18px]">
                <span>{t}</span>
                <span className="text-[12px]" style={{ color: C.text2 }}>
                  {sub}
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </DialogShell>
  )
}

export function BoloCloseDialog({ state, patch, toast, selected }: DlgProps) {
  const reasons =
    selected.kind === 'missing'
      ? [['Найден', 'Жив, передан родственникам или EMS'], ['Вернулся сам', 'По сообщению родственников'], ['Ошибка или дубль', 'Ориентировка создана по ошибке']]
      : selected.kind === 'veh'
        ? [['Найдена', 'Машина обнаружена, на штрафстоянке или у владельца'], ['Отменена владельцем', 'Заявление отозвано'], ['Ошибка или дубль', 'Ориентировка создана по ошибке']]
        : [['Задержан', 'Привяжите арест, чтобы ссылка появилась в карточке'], ['Снят с розыска', 'Ордер отозван или основание отпало'], ['Ошибка или дубль', 'Ориентировка создана по ошибке']]

  function confirm() {
    const labels = selected.kind === 'missing' ? ['Найден', 'Вернулся сам', 'Ошибка'] : selected.kind === 'veh' ? ['Найдена', 'Отменена владельцем', 'Ошибка'] : ['Задержан', 'Снят с розыска', 'Ошибка']
    patch({ closedMap: { ...state.closedMap, [selected.id]: labels[state.closeWhy] }, dlg: null })
    toast('closed')
  }

  return (
    <DialogShell
      title="Закрыть ориентировку"
      sub={`${selected.no} · ${selected.title}`}
      width={520}
      foot={
        <>
          <button type="button" onClick={() => patch({ dlg: null })} className="h-[34px] w-[120px] rounded-[6px] text-center hover:brightness-110" style={{ background: C.btn }}>
            Отмена
          </button>
          <button type="button" onClick={confirm} className="h-[34px] w-[160px] rounded-[6px] text-center font-semibold hover:brightness-110" style={{ background: ACCENT, color: ON_ACCENT }}>
            Закрыть
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-1.5">
        {reasons.map((r, i) => {
          const on = state.closeWhy === i
          return (
            <button key={r[0]} type="button" onClick={() => patch({ closeWhy: i })} className="flex items-center gap-2.5 rounded-[8px] p-2.5 hover:brightness-110" style={{ background: on ? C.sel : C.card, boxShadow: on ? `inset 0 0 0 1px ${C.stroke2}` : 'none' }}>
              <span className="box-border h-4 w-4 shrink-0 rounded-full" style={{ border: on ? `5px solid ${ACCENT}` : `1.5px solid ${C.stroke2}` }} />
              <span className="flex flex-col text-left leading-[18px]">
                <span className="font-semibold">{r[0]}</span>
                <span className="text-[12px]" style={{ color: C.text2 }}>
                  {r[1]}
                </span>
              </span>
            </button>
          )
        })}
      </div>
      <span className="text-[12px]" style={{ color: C.text2 }}>
        Связанные ориентировки, например на машину, предложим закрыть следующим шагом.
      </span>
    </DialogShell>
  )
}

export function BoloMenu({ state, patch, toast, selected }: DlgProps) {
  const items = [
    { t: 'Обновить ориентировку', d: 'M4 14.5V16h1.5L15 6.5 13.5 5zM12 6.5l1.5 1.5', go: () => patch({ menu: false, dlg: 'update' }) },
    { t: 'Продлить на 24 ч', d: 'M10 17.5a7.5 7.5 0 100-15 7.5 7.5 0 000 15zM10 6v4l2.5 1.5', go: () => { patch({ menu: false, extMap: { ...state.extMap, [selected.id]: '18.11, 20:00' } }); toast('ext') } },
    { t: `Доступ: все агентства`, d: 'M5.5 9V6.5a4.5 4.5 0 019 0V9M4 9h12v8.5H4z', go: () => patch({ menu: false }) },
    { t: 'Скопировать текст для рации', d: 'M7 7h9v10H7zM4 13V3h9', go: () => { patch({ menu: false }); toast('radio') } },
  ]
  return (
    <div role="menu" className="absolute right-5 top-[84px] z-10 box-border w-[280px] rounded-[8px] p-1" style={{ background: C.flyout, border: `1px solid ${C.stroke}`, boxShadow: '0 16px 32px rgba(0,0,0,0.45)' }}>
      {items.map((m) => (
        <button key={m.t} role="menuitem" type="button" onClick={m.go} className="flex h-[34px] w-full items-center gap-2.5 whitespace-nowrap rounded-[4px] px-2.5 text-left hover:bg-white/10">
          <PathIcon d={m.d} className="h-[15px] w-[15px] shrink-0" style={{ color: C.text2 }} />
          <span className="truncate">{m.t}</span>
        </button>
      ))}
    </div>
  )
}

export function BoloIncomingBanner({ patch, acked }: { patch: (p: Partial<BoloUIState>) => void; acked: Record<string, boolean> }) {
  return (
    <div role="alert" className="absolute right-5 top-[52px] z-30 box-border flex w-[380px] flex-col gap-2.5 rounded-[10px] p-4" style={{ background: C.flyout, border: `1px solid ${C.stroke}`, boxShadow: '0 16px 40px rgba(0,0,0,0.55)' }}>
      <div className="flex items-center gap-2">
        <span className="flex h-[18px] w-[18px] items-center justify-center rounded-[5px]" style={{ background: '#C42B1C', color: '#fff' }}>
          <PathIcon d="M10 3.5a6.5 6.5 0 100 13 6.5 6.5 0 100-13zM10 8a2 2 0 100 4 2 2 0 100-4z" className="h-3 w-3" />
        </span>
        <span className="flex-1 text-[12px]" style={{ color: C.text2 }}>
          Новая ориентировка от FIB · сейчас
        </span>
        <button type="button" onClick={() => patch({ incoming: false })} aria-label="Скрыть" className="flex h-6 w-6 items-center justify-center rounded-[4px] hover:bg-white/10" style={{ color: C.text2 }}>
          <CloseIcon className="h-2.5 w-2.5" />
        </button>
      </div>
      <div className="flex gap-3">
        <span className="relative h-[52px] w-[52px] shrink-0 overflow-hidden rounded-[8px]" style={{ background: C.mug }}>
          <span className="absolute inset-x-0 top-3 text-center text-[20px] font-bold">?</span>
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="font-semibold">Неизвестный в балаклаве</span>
          <span className="text-[12px] leading-4" style={{ color: C.text2 }}>
            B-0420 · вооружённое ограбление Fleeca Bank, Great Ocean Hwy. Тёмный седан без номеров, на север.
          </span>
          <span className="flex gap-1 pt-0.5">
            <span className="inline-flex h-5 items-center rounded-[10px] px-[7px] text-[11px]" style={{ background: TONE.red[0], color: TONE.red[1] }}>
              Высокий
            </span>
            <span className="inline-flex h-5 items-center rounded-[10px] px-[7px] text-[11px]" style={{ background: TONE.red[0], color: TONE.red[1] }}>
              Вооружён и опасен
            </span>
          </span>
        </span>
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={() => patch({ incoming: false, acked: { ...acked, b420: true } })} className="h-8 flex-1 rounded-[6px] text-center hover:brightness-110" style={{ background: C.btn }}>
          Ознакомлен
        </button>
        <button type="button" onClick={() => patch({ incoming: false, view: 'feed', nav: 'active', sel: 'b420' })} className="h-8 flex-1 rounded-[6px] text-center font-semibold hover:brightness-110" style={{ background: ACCENT, color: ON_ACCENT }}>
          Открыть
        </button>
      </div>
    </div>
  )
}

const TOAST_COPY: Record<string, { title: string; text: (b: Bolo) => string }> = {
  seen: { title: 'Отметка отправлена', text: () => 'Автор ориентировки и все на смене увидят её на карте.' },
  backup: { title: 'Отметка и запрос поддержки отправлены', text: () => 'Диспетчер создал вызов с вашей позицией.' },
  closed: { title: 'Ориентировка закрыта', text: () => 'Все на смене получили уведомление, карточка ушла в архив.' },
  pub: { title: 'Ориентировка опубликована', text: () => 'Разослано на смену, диспетчер получил текст для рации.' },
  photo: { title: 'Фото добавлено', text: () => 'Его увидят все, кто откроет ориентировку.' },
  pdf: { title: 'PDF готов', text: (b) => `BOLO-${b.no.slice(2)}.pdf сохранён, можно печатать.` },
  mail: { title: 'Листовка отправлена', text: () => 'PDF ушёл в Почту участку для печати.' },
  ext: { title: 'Ориентировка продлена', text: () => 'Срок обновлён в карточке, смена получила уведомление.' },
  upd: { title: 'Ориентировка обновлена', text: () => 'Ознакомившиеся получили уведомление «Обновлена».' },
  radio: { title: 'Текст скопирован', text: () => 'Вставьте в рацию или зачитайте на канале.' },
}

export function BoloToast({ toastKey, selected }: { toastKey: string; selected: Bolo }) {
  const copy = TOAST_COPY[toastKey]
  if (!copy) return null
  return (
    <div role="status" className="absolute bottom-6 right-6 z-30 box-border flex w-[360px] gap-3 rounded-[8px] p-3.5" style={{ background: C.flyout, border: `1px solid ${C.stroke}`, boxShadow: '0 12px 32px rgba(0,0,0,0.4)' }}>
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full" style={{ background: TONE.green[0], color: TONE.green[1] }}>
        <PathIcon d="M4.5 10.5l3.5 3.5 7.5-8" className="h-3.5 w-3.5" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="font-semibold">{copy.title}</span>
        <span className="text-[13px]" style={{ color: C.text2 }}>
          {copy.text(selected)}
        </span>
      </span>
    </div>
  )
}
