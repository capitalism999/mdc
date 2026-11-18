import type { FtpFile } from '../../types'

/**
 * "FTP" — shared department file server: a flat list of folders/files,
 * nested via `parentId`. Deliberately a static mock browse tree (no actual
 * upload/download against a backend yet).
 */
export const mockFtpFiles: FtpFile[] = [
  { id: 'f1', parentId: null, kind: 'folder', name: 'Ориентировки', updatedAt: 'Сегодня, 09:12', updatedBy: 'Thorne Watts' },
  { id: 'f2', parentId: null, kind: 'folder', name: 'Бланки и формы', updatedAt: 'Вчера, 17:40', updatedBy: 'Admin' },
  { id: 'f3', parentId: null, kind: 'folder', name: 'Видео с нагрудных камер', updatedAt: '2 дня назад', updatedBy: 'Thorne Watts' },
  { id: 'f4', parentId: null, kind: 'folder', name: 'Архив дел', updatedAt: '5 дней назад', updatedBy: 'Admin' },
  { id: 'f5', parentId: null, kind: 'file', name: 'Устав_департамента_2026.pdf', size: '1.2 MB', updatedAt: '2026-01-04', updatedBy: 'Admin' },

  { id: 'f1-1', parentId: 'f1', kind: 'file', name: 'BOLO_Sultan_RS_угон.pdf', size: '340 KB', updatedAt: 'Сегодня, 09:12', updatedBy: 'Thorne Watts' },
  { id: 'f1-2', parentId: 'f1', kind: 'file', name: 'Розыск_Lamar_Davis.pdf', size: '280 KB', updatedAt: 'Вчера, 14:05', updatedBy: 'K. Reyes' },

  { id: 'f2-1', parentId: 'f2', kind: 'file', name: 'Бланк_рапорта.docx', size: '48 KB', updatedAt: '2025-11-02', updatedBy: 'Admin' },
  { id: 'f2-2', parentId: 'f2', kind: 'file', name: 'Форма_ареста.docx', size: '52 KB', updatedAt: '2025-11-02', updatedBy: 'Admin' },
  { id: 'f2-3', parentId: 'f2', kind: 'file', name: 'Запрос_ордера.docx', size: '44 KB', updatedAt: '2025-12-18', updatedBy: 'Admin' },

  { id: 'f3-1', parentId: 'f3', kind: 'file', name: 'Fleeca_ограбление_cam1.mp4', size: '184 MB', updatedAt: '2 дня назад', updatedBy: 'Thorne Watts' },
  { id: 'f3-2', parentId: 'f3', kind: 'file', name: 'Fleeca_ограбление_cam2.mp4', size: '201 MB', updatedAt: '2 дня назад', updatedBy: 'Thorne Watts' },

  { id: 'f4-1', parentId: 'f4', kind: 'folder', name: '2025', updatedAt: '5 дней назад', updatedBy: 'Admin' },
  { id: 'f4-1-1', parentId: 'f4-1', kind: 'file', name: 'Дело_CF-2025-114.pdf', size: '1.8 MB', updatedAt: '5 дней назад', updatedBy: 'Admin' },
]
