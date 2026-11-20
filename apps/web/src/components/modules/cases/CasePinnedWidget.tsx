import type { CasePinned } from '../../../types'
import { CASE_PEOPLE } from '../../../lib/mockData/caseFiles'

/** Pinned announcement on a case overview — anyone on the case can write one
 * (title + optional description, e.g. «ЗАВТРА ОБЫСК!» + details), pick its
 * colour, edit or take it down. With none, a quiet dashed slot shows that one
 * can be added. */
const TONES: Record<CasePinned['tone'], { bg: string; dot: string; fg: string; label: string }> = {
  red: { bg: 'rgba(232,17,35,0.14)', dot: '#E81123', fg: '#FF99A4', label: 'Срочно' },
  amber: { bg: 'rgba(255,185,0,0.12)', dot: '#FFB900', fg: '#FCE100', label: 'Важно' },
  blue: { bg: 'rgba(0,120,212,0.16)', dot: '#0078D4', fg: '#99D9FF', label: 'Инфо' },
}

export interface PinDraft {
  title: string
  text: string
  tone: CasePinned['tone']
}

interface Props {
  pinned: CasePinned | null
  editing: PinDraft | null
  onEdit: () => void
  onChange: (v: PinDraft) => void
  onCancel: () => void
  onSave: () => void
  onRemove: () => void
}

function PinIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
      <path d="M12.5 2.5l5 5-3 1-3.5 3.5.5 3.5-1.5 1.5-3-3-4 4M7 10l3 3" />
    </svg>
  )
}

export function CasePinnedWidget({ pinned, editing, onEdit, onChange, onCancel, onSave, onRemove }: Props) {
  if (editing) {
    const t = TONES[editing.tone]
    const keys = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) onSave()
      if (e.key === 'Escape') onCancel()
    }
    return (
      <div className="flex flex-col gap-2.5 rounded-[12px] p-3.5" style={{ background: t.bg }}>
        <span className="flex items-center gap-2 text-[13px] font-semibold" style={{ color: t.fg }}>
          <PinIcon />
          <span className="flex-1">{pinned ? 'Изменить объявление' : 'Новое объявление по делу'}</span>
          <span className="text-[12px] font-normal text-[#C2C2C2]">Увидят все, у кого есть доступ</span>
        </span>
        <input
          autoFocus
          value={editing.title}
          onChange={(e) => onChange({ ...editing, title: e.target.value })}
          onKeyDown={(e) => {
            keys(e)
            if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey) onSave()
          }}
          placeholder="Заголовок, например: СЕГОДНЯ ОБЫСК!"
          aria-label="Заголовок объявления"
          className="h-9 rounded-[8px] bg-black/25 px-3 text-[15px] font-semibold text-white outline-none placeholder:font-normal placeholder:text-[#C2C2C2]/60"
        />
        <textarea
          value={editing.text}
          onChange={(e) => onChange({ ...editing, text: e.target.value })}
          onKeyDown={keys}
          rows={2}
          placeholder="Описание (необязательно): время сбора, адрес, что взять"
          aria-label="Описание объявления"
          className="resize-none rounded-[8px] bg-black/25 px-3 py-2 text-[13px] leading-5 text-white outline-none placeholder:text-[#C2C2C2]/60"
        />
        <div className="flex items-center gap-1.5">
          {(Object.keys(TONES) as CasePinned['tone'][]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => onChange({ ...editing, tone: k })}
              className="flex h-7 items-center gap-1.5 rounded-full px-2.5 text-[12px]"
              style={{ background: editing.tone === k ? 'rgba(255,255,255,0.14)' : 'transparent', boxShadow: editing.tone === k ? 'inset 0 0 0 1px rgba(255,255,255,0.25)' : 'none' }}
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: TONES[k].dot }} />
              {TONES[k].label}
            </button>
          ))}
          <span className="flex-1" />
          {pinned && (
            <button type="button" onClick={onRemove} className="h-8 rounded-[6px] px-3 text-[13px] text-[#FF99A4] hover:bg-white/10">
              Снять
            </button>
          )}
          <button type="button" onClick={onCancel} className="h-8 rounded-[6px] bg-[#3A3A3A] px-3 text-[13px] hover:brightness-125">
            Отмена
          </button>
          <button type="button" onClick={onSave} disabled={!editing.title.trim()} className="h-8 rounded-[6px] bg-[#60CDFF] px-3 text-[13px] font-semibold text-black enabled:hover:brightness-110 disabled:opacity-40">
            Закрепить
          </button>
        </div>
      </div>
    )
  }

  if (!pinned) {
    return (
      <button type="button" onClick={onEdit} className="flex h-11 items-center gap-2 rounded-[12px] border border-dashed border-[#4A4A4A] px-3.5 text-left text-[13px] text-[#C2C2C2] hover:border-[#6A6A6A] hover:bg-white/[0.03] hover:text-white">
        <PinIcon />
        <span className="flex-1">Закрепить объявление для всех по делу</span>
        <span className="hidden text-[12px] text-[#9A9A9A] 2xl:inline">например, «Сегодня обыск!»</span>
      </button>
    )
  }

  const t = TONES[pinned.tone]
  const who = CASE_PEOPLE[pinned.who]
  return (
    <div className="flex items-start gap-3 rounded-[12px] px-4 py-3" style={{ background: t.bg }}>
      <span className="mt-0.5 shrink-0" style={{ color: t.fg }}>
        <PinIcon className="h-[18px] w-[18px]" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[15px] font-semibold leading-[21px] text-white">{pinned.title}</div>
        {pinned.text && <div className="mt-0.5 text-[13px] leading-[19px] text-[#E0E0E0]">{pinned.text}</div>}
        <div className="mt-1.5 flex items-center gap-1.5 text-[12px] text-[#C2C2C2]">
          <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full text-[9px] font-semibold text-white" style={{ background: who?.color ?? '#5C6B70' }}>
            {who?.initials ?? '?'}
          </span>
          {who?.name ?? pinned.who} · {pinned.when}
        </div>
      </div>
      <button type="button" onClick={onEdit} className="h-7 shrink-0 rounded-[6px] px-2.5 text-[12px] text-[#C2C2C2] hover:bg-white/10 hover:text-white">
        Изменить
      </button>
    </div>
  )
}
