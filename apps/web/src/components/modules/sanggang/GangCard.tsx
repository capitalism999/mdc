import type { Gang, Person } from '../../../types'
import { EntityChip } from '../shared/EntityChip'
import { BackHeader, EmptyState, Field, SectionCard, StatusPill } from '../shared/ui'
import { BackIcon } from '../people/icons'
import { GangIcon } from '../shared/entityIcons'

interface GangCardProps {
  gang: Gang
  gangs: Gang[]
  people: Person[]
  onBack: () => void
}

export function GangCard({ gang, gangs, people, onBack }: GangCardProps) {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <BackHeader title={gang.name} subtitle={gang.aliases.join(', ')} onBack={onBack} icon={<BackIcon />} />

      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-2">
          <StatusPill status={gang.status} positive={gang.status === 'Распущена'} />
        </div>

        <SectionCard title="Банда" icon={<GangIcon />}>
          <div className="flex flex-col gap-1.5">
            <Field label="Уровень угрозы" value={gang.threatLevel} />
            <Field label="Территория" value={gang.territoryDescription} />
          </div>
        </SectionCard>

        <SectionCard title="Участники" icon={<GangIcon />}>
          {gang.members.length === 0 ? (
            <EmptyState label="Участники не установлены" />
          ) : (
            <div className="flex flex-col gap-1.5">
              {gang.members.map((m) => {
                const person = people.find((p) => p.id === m.personId)
                return (
                  <div key={m.personId} className="flex items-center justify-between gap-3 text-[13px]">
                    {person ? (
                      <EntityChip type="person" id={person.id} label={`${person.firstName} ${person.lastName}`} sublabel={m.moniker} />
                    ) : (
                      <span className="text-ink/90">{m.moniker}</span>
                    )}
                    <span className="text-ink/40">{m.role}</span>
                  </div>
                )
              })}
            </div>
          )}
        </SectionCard>

        {gang.rivalries.length > 0 && (
          <SectionCard title="Враждующие группировки" icon={<GangIcon />}>
            <div className="flex flex-col gap-1.5">
              {gang.rivalries.map((r) => {
                const rival = gangs.find((g) => g.id === r.gangId)
                return (
                  <div key={r.gangId} className="flex items-center justify-between gap-3 text-[13px]">
                    <EntityChip type="gang" id={r.gangId} label={rival ? rival.name : r.gangId} />
                    <span className="text-ink/40">{r.relationship}</span>
                  </div>
                )
              })}
            </div>
          </SectionCard>
        )}

        {gang.intelEntries.length > 0 && (
          <SectionCard title="Оперативная информация" icon={<GangIcon />}>
            <div className="flex flex-col gap-2">
              {gang.intelEntries.map((entry, i) => (
                <div key={i} className="rounded-[6px] bg-black/30 p-2.5 text-[13px]">
                  <p className="text-ink/80">{entry.note}</p>
                  <p className="mt-1 text-[11px] text-ink/40">{entry.author} · {entry.date}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        )}
      </div>
    </div>
  )
}
