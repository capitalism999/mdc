import { request } from '../api'
import { mockForensicAnalyses } from '../mockData/forensicAnalyses'
import type { ForensicAnalysis } from '../../types'

export function getForensicAnalyses() {
  return request<ForensicAnalysis[]>('/forensic-analyses', mockForensicAnalyses)
}
