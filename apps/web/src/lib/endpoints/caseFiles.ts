import { request } from '../api'
import { mockCaseFiles, mockCaseList } from '../mockData/caseFiles'
import type { CaseFileDetail, CaseListRow } from '../../types'

export function getCaseList() {
  return request<CaseListRow[]>('/cases/list', mockCaseList)
}

export function getCaseFiles() {
  return request<Record<string, CaseFileDetail>>('/cases/files', mockCaseFiles)
}
