import { request } from '../api'
import { mockFtpFiles } from '../mockData/ftpFiles'
import type { FtpFile } from '../../types'

export function getFtpFiles() {
  return request<FtpFile[]>('/ftp', mockFtpFiles)
}
