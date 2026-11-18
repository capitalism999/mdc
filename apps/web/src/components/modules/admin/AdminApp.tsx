import { useEffect, useState } from 'react'
import type { ModuleContentProps } from '../registry'
import { getAnnouncements, getAuditLog, getOfficers, getRoles } from '../../../lib/endpoints/admin'
import type { Announcement, AuditLogEntry, Officer, Role } from '../../../types'
import { useWindowManager } from '../../../windows/WindowManagerContext'
import { EmptyState, Field, SectionCard, StatusPill } from '../shared/ui'
import { OfficerIcon } from '../shared/entityIcons'

const TABS = [
  { id: 'roster', label: 'Личный состав' },
  { id: 'roles', label: 'Роли' },
  { id: 'audit', label: 'Аудит-лог' },
  { id: 'announcements', label: 'Объявления' },
] as const

type TabId = (typeof TABS)[number]['id']

/**
 * "Админ" module: personnel roster / roles / audit log / announcements.
 * Deliberately shallow per the plan — data-only, no UI-level permission
 * enforcement, since the system has no authentication to check against.
 * Officers don't get their own detail card beyond the roster list.
 */
export function AdminApp({ windowId }: ModuleContentProps) {
  const { updateBreadcrumb } = useWindowManager()
  const [tab, setTab] = useState<TabId>('roster')
  const [officers, setOfficers] = useState<Officer[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])

  useEffect(() => {
    getOfficers().then(setOfficers)
    getRoles().then(setRoles)
    getAuditLog().then(setAuditLog)
    getAnnouncements().then(setAnnouncements)
  }, [])

  useEffect(() => {
    updateBreadcrumb(windowId, ['Админ', TABS.find((t) => t.id === tab)!.label])
  }, [windowId, tab, updateBreadcrumb])

  function officerName(officerId: string) {
    return officers.find((o) => o.id === officerId)?.name ?? officerId
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="flex flex-wrap items-center gap-2 border-b border-ink/10 p-4">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-[8px] px-3.5 py-2 text-[13px] font-medium transition-colors ${
              tab === t.id ? 'bg-[#48adec]/15 text-[#48adec]' : 'bg-ink/5 text-ink/60 hover:bg-ink/10'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 p-4">
        {tab === 'roster' && (
          <SectionCard title="Личный состав" icon={<OfficerIcon />}>
            {officers.length === 0 ? (
              <EmptyState label="Нет данных" />
            ) : (
              <div className="flex flex-col gap-2">
                {officers.map((o) => (
                  <div key={o.id} className="rounded-[6px] bg-black/30 p-2.5">
                    <div className="mb-1.5 flex items-center justify-between gap-3">
                      <span className="text-[13px] font-semibold text-ink/90">
                        {o.name} <span className="text-ink/40">· {o.callsign}</span>
                      </span>
                      <StatusPill status={o.dutyStatus} positive={o.dutyStatus === 'На смене'} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Field label="Жетон" value={o.badgeNumber} />
                      <Field label="Подразделение" value={o.department} />
                      <Field label="Звание" value={o.rank} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        )}

        {tab === 'roles' && (
          <SectionCard title="Роли" icon={<OfficerIcon />}>
            {roles.length === 0 ? (
              <EmptyState label="Нет данных" />
            ) : (
              <div className="flex flex-col gap-2">
                {roles.map((r) => (
                  <div key={r.id} className="rounded-[6px] bg-black/30 p-2.5">
                    <p className="text-[13px] font-semibold text-ink/90">{r.name}</p>
                    <p className="mt-0.5 text-[13px] text-ink/60">{r.description}</p>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {r.permissions.map((p) => (
                        <span key={p} className="rounded-full bg-ink/10 px-2 py-0.5 text-[11px] text-ink/50">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        )}

        {tab === 'audit' && (
          <SectionCard title="Аудит-лог" icon={<OfficerIcon />}>
            {auditLog.length === 0 ? (
              <EmptyState label="Нет данных" />
            ) : (
              <div className="flex flex-col gap-1.5">
                {auditLog.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between gap-3 text-[13px]">
                    <span className="text-ink/80">
                      {officerName(entry.officerId)} — {entry.action}{' '}
                      <span className="text-ink/40">({entry.entityType}:{entry.entityId})</span>
                    </span>
                    <span className="shrink-0 text-ink/40">{entry.timestamp}</span>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        )}

        {tab === 'announcements' && (
          <SectionCard title="Объявления" icon={<OfficerIcon />}>
            {announcements.length === 0 ? (
              <EmptyState label="Нет данных" />
            ) : (
              <div className="flex flex-col gap-2">
                {announcements.map((a) => (
                  <div key={a.id} className="rounded-[6px] bg-black/30 p-2.5">
                    <div className="mb-1 flex items-center justify-between gap-3">
                      <span className="text-[13px] font-semibold text-ink/90">{a.title}</span>
                      {a.priority === 'Важный' && <StatusPill status="Важный" positive={false} />}
                    </div>
                    <p className="text-[13px] text-ink/70">{a.body}</p>
                    <p className="mt-1 text-[11px] text-ink/40">
                      {a.author} · {a.date}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        )}
      </div>
    </div>
  )
}
