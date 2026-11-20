import { useState } from 'react'
import type { CaseLogRow } from '../../../types'
import { CASE_PEOPLE } from '../../../lib/mockData/caseFiles'

/** Record provenance in the inspector: who added it and when, who changed it
 * last, and its recent journal entries (from the case journal). */

const ACTION_TONE: Record<CaseLogRow['action'], string> = { Добавление: '#6CCB5F', Изменение: '#FCE100', Перемещение: '#99D9FF', Удаление: '#FF99A4' }

function Avatar({ name }: { name: string }) {
  const p = CASE_PEOPLE[name]
  const initials = p?.initials ?? name.replace(/[^A-ZА-Я]/g, '').slice(0, 2)
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold text-white" style={{ background: p?.color ?? '#5C6B70' }}>
      {initials || '?'}
    </span>
  )
}

export function ItemHistory({ history, fallbackBy, fallbackDate }: { history: CaseLogRow[]; fallbackBy?: string; fallbackDate?: string }) {
  const [all, setAll] = useState(false)
  // newest first: the oldest «Добавление» is the creation, the newest row the last change
  const created = [...history].reverse().find((r) => r.action === 'Добавление') ?? history[history.length - 1]
  const changed = history.find((r) => r !== created)
  const addedBy = created?.who ?? fallbackBy
  const addedWhen = created?.when ?? fallbackDate
  const shown = all ? history : history.slice(0, 3)
  return (
    <div>
      <div className="mb-1.5 ml-1 text-[13px] font-semibold text-[#C2C2C2]">История</div>
      <div className="rounded-[12px] bg-[#303030] px-3.5">
        <div className="flex flex-col gap-2 border-b border-[#3A3A3A] py-2.5 text-[13px]">
          <span className="flex items-center gap-2">
            <span className="w-[72px] shrink-0 text-[12px] text-[#C2C2C2]">Добавил</span>
            {addedBy ? <Avatar name={addedBy} /> : null}
            <span className={`min-w-0 flex-1 truncate ${addedBy ? '' : 'text-[#9A9A9A]'}`}>{addedBy ?? 'не указан'}</span>
            <span className="shrink-0 text-[12px] text-[#C2C2C2]">{addedWhen}</span>
          </span>
          {changed && (
            <span className="flex items-center gap-2">
              <span className="w-[72px] shrink-0 text-[12px] text-[#C2C2C2]">Изменил</span>
              <Avatar name={changed.who} />
              <span className="min-w-0 flex-1 truncate">{changed.who}</span>
              <span className="shrink-0 text-[12px] text-[#C2C2C2]">{changed.when}</span>
            </span>
          )}
        </div>
        {history.length === 0 ? (
          <div className="py-2.5 text-[12px] text-[#9A9A9A]">В журнале дела по этой записи пока ничего нет</div>
        ) : (
          <>
            {shown.map((r, i) => (
              <div key={r.when + r.detail + i} className={`flex flex-col gap-0.5 py-2.5 ${i === shown.length - 1 && history.length <= 3 ? '' : 'border-b border-[#3A3A3A]'}`}>
                <span className="flex items-center gap-1.5 text-[12px] text-[#C2C2C2]">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: ACTION_TONE[r.action] }} />
                  <span style={{ color: ACTION_TONE[r.action] }}>{r.action}</span>
                  <span className="min-w-0 flex-1 truncate">· {r.who}</span>
                  <span className="shrink-0">{r.when}</span>
                </span>
                <span className="text-[13px] leading-[18px]">{r.detail}</span>
              </div>
            ))}
            {history.length > 3 && (
              <button type="button" onClick={() => setAll((v) => !v)} className="flex h-9 w-full items-center text-[12px] text-[#99D9FF] hover:text-white">
                {all ? 'Свернуть' : `Показать все · ${history.length}`}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
