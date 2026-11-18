import { useEffect, useState } from 'react'
import type { ModuleContentProps } from '../registry'
import { getFtpFiles } from '../../../lib/endpoints/ftp'
import type { FtpFile } from '../../../types'
import { useWindowManager } from '../../../windows/WindowManagerContext'
import { FileIcon, FolderIcon, UploadIcon } from './icons'

function folderName(files: FtpFile[], id: string) {
  return files.find((f) => f.id === id)?.name ?? id
}

function sortEntries(files: FtpFile[]) {
  return [...files].sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === 'folder' ? -1 : 1
    return a.name.localeCompare(b.name, 'ru')
  })
}

/**
 * "FTP" module: a flat department file share (bulletins, forms, bodycam
 * exports) browsed as nested folders via `FtpFile.parentId`. Read-only
 * aside from adding new file entries to the current folder — there is no
 * real upload/download against a backend yet.
 */
export function FtpApp({ windowId }: ModuleContentProps) {
  const { updateBreadcrumb, setBackHandler, setForwardHandler } = useWindowManager()
  const [files, setFiles] = useState<FtpFile[]>([])
  const [path, setPath] = useState<string[]>([])
  const [forwardStack, setForwardStack] = useState<string[][]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [newFileName, setNewFileName] = useState('')

  useEffect(() => {
    getFtpFiles().then(setFiles)
  }, [])

  const currentFolderId = path[path.length - 1] ?? null

  useEffect(() => {
    updateBreadcrumb(windowId, ['FTP', ...path.map((id) => folderName(files, id))])
  }, [windowId, path, files, updateBreadcrumb])

  useEffect(() => {
    if (path.length === 0) {
      setBackHandler(windowId, null)
      return () => setBackHandler(windowId, null)
    }
    setBackHandler(windowId, () => {
      setForwardStack((stack) => [...stack, path])
      setPath((p) => p.slice(0, -1))
    })
    return () => setBackHandler(windowId, null)
  }, [windowId, path, setBackHandler])

  useEffect(() => {
    if (forwardStack.length === 0) {
      setForwardHandler(windowId, null)
      return () => setForwardHandler(windowId, null)
    }
    const next = forwardStack[forwardStack.length - 1]
    setForwardHandler(windowId, () => {
      setForwardStack((stack) => stack.slice(0, -1))
      setPath(next)
    })
    return () => setForwardHandler(windowId, null)
  }, [windowId, forwardStack, setForwardHandler])

  function openFolder(id: string) {
    setForwardStack([])
    setPath((p) => [...p, id])
  }

  function confirmAddFile() {
    if (!newFileName.trim()) return
    const file: FtpFile = {
      id: `ftp-${Date.now()}`,
      parentId: currentFolderId,
      kind: 'file',
      name: newFileName.trim(),
      updatedAt: 'Только что',
      updatedBy: 'Текущий офицер',
    }
    setFiles((prev) => [...prev, file])
    setNewFileName('')
    setIsAdding(false)
  }

  const entries = sortEntries(files.filter((f) => f.parentId === currentFolderId))

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="flex items-center justify-between gap-3 border-b border-ink/10 p-4">
        <h2 className="text-[16px] font-semibold text-ink">{currentFolderId ? folderName(files, currentFolderId) : 'Общий доступ'}</h2>
        <button
          type="button"
          onClick={() => setIsAdding((v) => !v)}
          className="flex items-center gap-1.5 rounded-[8px] bg-[#48adec]/15 px-3 py-2 text-[13px] font-medium text-[#48adec] hover:bg-[#48adec]/25"
        >
          <UploadIcon className="h-4 w-4" />
          Загрузить файл
        </button>
      </div>

      {isAdding && (
        <div className="flex items-center gap-2 border-b border-ink/10 bg-ink/[0.04] px-4 py-3">
          <input
            autoFocus
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && confirmAddFile()}
            placeholder="Имя файла"
            className="flex-1 rounded-[6px] border border-ink/10 bg-bg-chrome-2 px-3 py-2 text-[13px] text-ink placeholder:text-ink/40 focus:outline-none"
          />
          <button
            type="button"
            onClick={confirmAddFile}
            className="rounded-[6px] bg-[#48adec] px-3 py-2 text-[13px] font-semibold text-black hover:bg-[#62b9ef]"
          >
            Добавить
          </button>
        </div>
      )}

      <div className="flex flex-col gap-1.5 p-4">
        {entries.length === 0 ? (
          <div className="flex flex-1 items-center justify-center py-12 text-[14px] text-ink/40">Папка пуста</div>
        ) : (
          entries.map((entry) =>
            entry.kind === 'folder' ? (
              <button
                key={entry.id}
                type="button"
                onClick={() => openFolder(entry.id)}
                className="flex items-center gap-3 rounded-[8px] bg-ink/5 px-4 py-3 text-left hover:bg-ink/10"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] bg-[#48adec]/15 text-[#48adec]">
                  <FolderIcon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-ink/90">{entry.name}</span>
                <span className="shrink-0 text-[12px] text-ink/40">{entry.updatedAt}</span>
              </button>
            ) : (
              <div key={entry.id} className="flex items-center gap-3 rounded-[8px] bg-ink/[0.04] px-4 py-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] bg-ink/10 text-ink/50">
                  <FileIcon className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1 truncate text-[13px] text-ink/80">{entry.name}</span>
                {entry.size && <span className="shrink-0 text-[12px] text-ink/40">{entry.size}</span>}
                <span className="shrink-0 text-[12px] text-ink/40">{entry.updatedAt}</span>
                <span className="shrink-0 text-[12px] text-ink/30">{entry.updatedBy}</span>
              </div>
            ),
          )
        )}
      </div>
    </div>
  )
}
