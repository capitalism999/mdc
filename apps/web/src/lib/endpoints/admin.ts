import { request } from '../api'
import { mockAnnouncements } from '../mockData/announcements'
import { mockAuditLog } from '../mockData/auditLog'
import { mockOfficers } from '../mockData/officers'
import { mockRoles } from '../mockData/roles'
import type { Announcement, AuditLogEntry, Officer, Role } from '../../types'

export function getOfficers() {
  return request<Officer[]>('/officers', mockOfficers)
}

export function getRoles() {
  return request<Role[]>('/roles', mockRoles)
}

export function getAuditLog() {
  return request<AuditLogEntry[]>('/audit-log', mockAuditLog)
}

export function getAnnouncements() {
  return request<Announcement[]>('/announcements', mockAnnouncements)
}
