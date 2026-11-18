import type { PenalCode } from '../../../types'
import { BackHeader, Field, SectionCard, StatusPill } from '../shared/ui'
import { BackIcon } from '../people/icons'
import { PenalCodeIcon } from '../shared/entityIcons'

const CLASS_LABEL: Record<PenalCode['class'], string> = {
  felony: 'Фелония',
  misdemeanor: 'Мисдиминор',
  infraction: 'Проступок',
  provision: 'Положение',
}

function formatJailTime(minutes: number): string {
  if (minutes <= 0) return 'Без лишения свободы'
  const days = Math.floor(minutes / 1440)
  const hours = Math.floor((minutes % 1440) / 60)
  const mins = minutes % 60
  const parts: string[] = []
  if (days > 0) parts.push(`${days} д`)
  if (hours > 0) parts.push(`${hours} ч`)
  if (mins > 0) parts.push(`${mins} мин`)
  return parts.join(' ')
}

/** Sentencing-clause paragraphs ("Наказывается как ...") are highlighted by
 * severity so the reader can spot the applicable penalty at a glance. */
const SENTENCING_COLORS: { pattern: RegExp; className: string }[] = [
  { pattern: /фелони/i, className: 'border-[#e8637a]/30 bg-[#e8637a]/10 text-[#ff8ba0]' },
  { pattern: /мисдиминор/i, className: 'border-[#e0a93f]/30 bg-[#e0a93f]/10 text-[#f0c15c]' },
  { pattern: /проступок/i, className: 'border-[#3fb97f]/30 bg-[#3fb97f]/10 text-[#5fd99b]' },
]

function renderDescription(text: string, textSize: string) {
  return text.split(/\n{2,}/).map((paragraph, i) => {
    const isSentencing = /^Наказывается как/i.test(paragraph.trim())
    const color = isSentencing ? SENTENCING_COLORS.find((c) => c.pattern.test(paragraph)) : undefined
    return (
      <p
        key={i}
        className={`whitespace-pre-line ${textSize} leading-relaxed ${
          color ? `rounded-[8px] border px-3 py-2 font-medium ${color.className}` : 'text-ink/70'
        }`}
      >
        {paragraph}
      </p>
    )
  })
}

interface PenalCodeCardProps {
  code: PenalCode
  /** Omit in two-pane "document" mode (no back navigation — selection lives
   * in the sidebar); provided in single-pane mode to render a back header. */
  onBack?: () => void
}

/** "Законы" detail card — statute details and full article text. */
export function PenalCodeCard({ code, onBack }: PenalCodeCardProps) {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {onBack ? (
        <BackHeader title={code.code} subtitle={code.title} onBack={onBack} icon={<BackIcon />} />
      ) : (
        <div className="border-b border-ink/10 px-8 pt-7 pb-5">
          <p className="text-[11px] font-medium uppercase tracking-wide text-ink/40">{code.category}</p>
          <h1 className="mt-1 text-[20px] font-semibold text-ink">
            Статья {code.code}. {code.title}
          </h1>
          <div className="mt-2">
            <StatusPill status={CLASS_LABEL[code.class]} positive={code.class === 'infraction'} />
          </div>
        </div>
      )}

      <div className={onBack ? 'flex flex-col gap-3 p-4' : 'flex flex-col gap-3 p-8'}>
        {onBack && (
          <div className="flex items-center gap-2">
            <StatusPill status={CLASS_LABEL[code.class]} positive={code.class === 'infraction'} />
          </div>
        )}

        <SectionCard title="Статья" icon={<PenalCodeIcon />}>
          <div className="flex flex-col gap-1.5">
            <Field label="Код" value={code.code} />
            <Field label="Название" value={code.title} />
            <Field label="Раздел" value={code.category} />
            {code.class !== 'provision' && (
              <>
                <Field label="Штраф по умолчанию" value={`$${code.fineDefault.toLocaleString('ru-RU')}`} />
                <Field label="Срок по умолчанию" value={formatJailTime(code.jailDefault)} />
                <Field label="Баллы" value={String(code.points)} />
              </>
            )}
          </div>
        </SectionCard>

        <SectionCard title="Текст статьи" icon={<PenalCodeIcon />}>
          <div className="flex flex-col gap-2.5">{renderDescription(code.description, onBack ? 'text-[13px]' : 'text-[14px]')}</div>
        </SectionCard>
      </div>
    </div>
  )
}
