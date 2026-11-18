import type { Evidence, ForensicAnalysis } from '../../../types'
import { EntityChip } from '../shared/EntityChip'
import { BackHeader, EmptyState, Field, SectionCard, StatusPill } from '../shared/ui'
import { BackIcon } from '../people/icons'
import { CaseIcon, EvidenceIcon, ForensicsIcon } from '../shared/entityIcons'

interface EvidenceCardProps {
  evidence: Evidence
  analyses: ForensicAnalysis[]
  onBack: () => void
}

/** Evidence locker detail card — chain-of-custody timeline + linked lab
 * analyses, each a `<EntityChip type="forensicAnalysis">`. */
export function EvidenceCard({ evidence, analyses, onBack }: EvidenceCardProps) {
  const relatedAnalyses = analyses.filter((a) => a.evidenceId === evidence.id)

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <BackHeader title={evidence.evidenceNumber} subtitle={evidence.evidenceType} onBack={onBack} icon={<BackIcon />} />

      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-2">
          <StatusPill status={evidence.status} positive={evidence.status === 'Возвращено'} />
        </div>

        <SectionCard title="Вещественное доказательство" icon={<EvidenceIcon />}>
          <div className="flex flex-col gap-1.5">
            <Field label="Описание" value={evidence.description} />
            <Field label="Тип" value={evidence.evidenceType} />
            <Field label="Изъял" value={evidence.collectedBy} />
            <Field label="Дата изъятия" value={evidence.collectedDate} />
          </div>
        </SectionCard>

        <SectionCard title="Цепочка хранения" icon={<EvidenceIcon />}>
          <div className="flex flex-col gap-2">
            {evidence.custodyLog.map((entry, i) => (
              <div key={i} className="flex items-start gap-2 text-[13px]">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#48adec]" />
                <div className="min-w-0 flex-1">
                  <p className="text-ink/80">{entry.action}</p>
                  <p className="text-[11px] text-ink/40">{entry.officer} · {entry.date}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Экспертизы" icon={<ForensicsIcon />}>
          {relatedAnalyses.length === 0 ? (
            <EmptyState label="Экспертизы не назначены" />
          ) : (
            <div className="flex flex-col gap-1.5">
              {relatedAnalyses.map((a) => (
                <EntityChip key={a.id} type="forensicAnalysis" id={a.id} label={a.analysisNumber} sublabel={a.analysisType} />
              ))}
            </div>
          )}
        </SectionCard>

        {(evidence.relatedReportId || evidence.relatedCaseId || evidence.relatedArrestId) && (
          <SectionCard title="Связанные записи" icon={<CaseIcon />}>
            <div className="flex flex-col gap-1.5">
              {evidence.relatedReportId && <EntityChip type="report" id={evidence.relatedReportId} label={`Рапорт ${evidence.relatedReportId}`} />}
              {evidence.relatedArrestId && <EntityChip type="arrest" id={evidence.relatedArrestId} label={`Арест ${evidence.relatedArrestId}`} />}
              {evidence.relatedCaseId && <EntityChip type="case" id={evidence.relatedCaseId} label={`Дело ${evidence.relatedCaseId}`} />}
            </div>
          </SectionCard>
        )}
      </div>
    </div>
  )
}
