import { BackHeader, SectionCard } from '../shared/ui'
import { BackIcon } from '../people/icons'
import { PenalCodeIcon } from '../shared/entityIcons'
import { penalCodePreamble } from '../../../lib/mockData/penalCodePreamble'

interface PreambleCardProps {
  /** Omit in two-pane "document" mode (no back navigation — selection lives
   * in the sidebar); provided in single-pane mode to render a back header. */
  onBack?: () => void
}

/** Read-only display of the Penal Code's "Предварительные положения" —
 * general rules, crime types, the Class A/B/C classification, and core
 * legal definitions that precede the numbered statutes. */
export function PreambleCard({ onBack }: PreambleCardProps) {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {onBack ? (
        <BackHeader title={penalCodePreamble.title} subtitle="Общие нормы, предшествующие статьям" onBack={onBack} icon={<BackIcon />} />
      ) : (
        <div className="border-b border-ink/10 px-8 pt-7 pb-5">
          <p className="text-[11px] font-medium uppercase tracking-wide text-ink/40">Уголовный кодекс Сан-Андреас</p>
          <h1 className="mt-1 text-[20px] font-semibold text-ink">{penalCodePreamble.title}</h1>
          <p className="mt-1 text-[13px] text-ink/40">Общие нормы, предшествующие статьям</p>
        </div>
      )}

      <div className={onBack ? 'flex flex-col gap-3 p-4' : 'flex flex-col gap-3 p-8'}>
        {penalCodePreamble.sections.map((s) => (
          <SectionCard key={s.heading} title={s.heading} icon={<PenalCodeIcon />}>
            <p className={`whitespace-pre-line text-ink/70 ${onBack ? 'text-[13px] leading-relaxed' : 'text-[14px] leading-relaxed'}`}>
              {s.body}
            </p>
          </SectionCard>
        ))}
      </div>
    </div>
  )
}
