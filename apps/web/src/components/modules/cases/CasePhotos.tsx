import { useEffect, useRef, useState } from 'react'
import type { CasePhoto } from '../../../types'

/** Photos of a case record (map places): thumbnail grid with «Добавить фото»,
 * and a full-screen viewer (prev / next, delete). Files are read locally
 * as data URLs and kept with the record. */

export function readImages(files: FileList | null): Promise<{ src: string; name: string }[]> {
  const list = Array.from(files ?? []).filter((f) => f.type.startsWith('image/'))
  return Promise.all(
    list.map(
      (f) =>
        new Promise<{ src: string; name: string }>((resolve) => {
          const r = new FileReader()
          r.onload = () => resolve({ src: String(r.result), name: f.name })
          r.readAsDataURL(f)
        }),
    ),
  )
}

function Viewer({ photos, start, onRemove, onClose }: { photos: CasePhoto[]; start: number; onRemove: (i: number) => void; onClose: () => void }) {
  const [i, setI] = useState(start)
  const n = photos.length
  const go = (d: number) => setI((p) => (p + d + n) % n)
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', key, true)
    return () => window.removeEventListener('keydown', key, true)
  })
  useEffect(() => {
    if (i >= n) setI(Math.max(0, n - 1))
    if (n === 0) onClose()
  }, [i, n, onClose])
  const p = photos[Math.min(i, n - 1)]
  if (!p) return null
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black/85"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="flex h-12 shrink-0 items-center gap-3 px-4 text-white">
        <span className="min-w-0 flex-1 truncate text-[13px]">
          <span className="font-semibold">{p.name}</span>
          <span className="text-[#C2C2C2]">
            {' '}
            · {p.who}, {p.when}
          </span>
        </span>
        <span className="text-[12px] tabular-nums text-[#C2C2C2]">
          {Math.min(i, n - 1) + 1} / {n}
        </span>
        <button type="button" onClick={() => onRemove(Math.min(i, n - 1))} className="h-8 rounded-[6px] px-3 text-[13px] text-[#FF99A4] hover:bg-white/10">
          Удалить фото
        </button>
        <button type="button" onClick={onClose} aria-label="Закрыть" className="flex h-8 w-8 items-center justify-center rounded-[6px] hover:bg-white/10">
          <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M5 5l10 10M15 5L5 15" />
          </svg>
        </button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-16 pb-6" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
        <img src={p.src} alt={p.name} className="max-h-full max-w-full rounded-[8px] object-contain shadow-[0_10px_40px_rgba(0,0,0,0.6)]" />
        {n > 1 &&
          (
            [
              [-1, 'left-4', 'Предыдущее фото', 'M12.5 4.5L7 10l5.5 5.5'],
              [1, 'right-4', 'Следующее фото', 'M7.5 4.5L13 10l-5.5 5.5'],
            ] as const
          ).map(([d, pos, label, path]) => (
            <button key={d} type="button" onClick={() => go(d)} aria-label={label} className={`absolute ${pos} top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20`}>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={path} />
              </svg>
            </button>
          ))}
      </div>
    </div>
  )
}

/** Cover of a record's photos with paging (arrows on hover, dots, «i / N»);
 * clicking the photo opens the full viewer at that photo. */
export function PhotoCover({ photos, onOpen }: { photos: CasePhoto[]; onOpen: (i: number) => void }) {
  const [i, setI] = useState(0)
  const n = photos.length
  const cur = Math.min(i, n - 1)
  const go = (d: number) => setI((p) => (Math.min(p, n - 1) + d + n) % n)
  return (
    <div className="group/cv relative h-[150px] w-full overflow-hidden rounded-[10px] bg-black/30">
      <button type="button" onClick={() => onOpen(cur)} className="block h-full w-full" title="Открыть фото">
        <img src={photos[cur].src} alt={photos[cur].name} className="h-full w-full object-cover" draggable={false} />
      </button>
      {n > 1 && (
        <>
          {(
            [
              [-1, 'left-1.5', 'Предыдущее фото', 'M12.5 4.5L7 10l5.5 5.5'],
              [1, 'right-1.5', 'Следующее фото', 'M7.5 4.5L13 10l-5.5 5.5'],
            ] as const
          ).map(([d, pos, label, path]) => (
            <button key={d} type="button" onClick={() => go(d)} aria-label={label} className={`absolute ${pos} top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white opacity-0 transition-opacity hover:bg-black/65 focus:opacity-100 group-hover/cv:opacity-100`}>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={path} />
              </svg>
            </button>
          ))}
          <span className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
            {photos.map((_, k) => (
              <button key={k} type="button" onClick={() => setI(k)} aria-label={`Фото ${k + 1}`} className="h-1.5 rounded-full transition-all" style={{ width: k === cur ? 16 : 6, background: k === cur ? '#FFFFFF' : 'rgba(255,255,255,0.5)' }} />
            ))}
          </span>
          <span className="absolute bottom-1.5 right-2 rounded-[6px] bg-black/55 px-1.5 text-[11px] tabular-nums text-white">
            {cur + 1} / {n}
          </span>
        </>
      )}
    </div>
  )
}

export function PhotosSection({ photos, onAdd, onRemove, viewerIndex, setViewerIndex }: { photos: CasePhoto[]; onAdd: (files: FileList | null) => void; onRemove: (i: number) => void; viewerIndex: number | null; setViewerIndex: (i: number | null) => void }) {
  const input = useRef<HTMLInputElement>(null)
  const [drag, setDrag] = useState(false)
  return (
    <div>
      <div className="mb-1.5 ml-1 flex items-center text-[13px] font-semibold text-[#C2C2C2]">
        <span className="flex-1">Фото · {photos.length}</span>
      </div>
      <div
        className="rounded-[12px] bg-[#303030] p-2"
        style={{ boxShadow: drag ? 'inset 0 0 0 1.5px #60CDFF' : 'none' }}
        onDragOver={(e) => {
          e.preventDefault()
          setDrag(true)
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDrag(false)
          onAdd(e.dataTransfer.files)
        }}
      >
        {photos.length > 0 && (
          <div className="mb-2 grid grid-cols-3 gap-1.5">
            {photos.map((p, i) => (
              <button key={i} type="button" onClick={() => setViewerIndex(i)} title={`${p.name} · ${p.who}, ${p.when}`} className="aspect-square overflow-hidden rounded-[6px] bg-black/30 hover:brightness-110">
                <img src={p.src} alt={p.name} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
        <button type="button" onClick={() => input.current?.click()} className="flex h-9 w-full items-center justify-center gap-1.5 rounded-[8px] border border-dashed border-[#4A4A4A] text-[13px] text-[#C2C2C2] hover:border-[#6A6A6A] hover:text-white">
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="2.5" y="5" width="15" height="11" rx="2" />
            <circle cx="10" cy="10.5" r="3" />
            <path d="M7.5 5l1-1.5h3l1 1.5" />
          </svg>
          {photos.length ? 'Добавить ещё' : 'Добавить фото'}
          <span className="text-[11px] text-[#9A9A9A]">или перетащите сюда</span>
        </button>
        <input
          ref={input}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            onAdd(e.target.files)
            e.target.value = ''
          }}
        />
      </div>
      {viewerIndex !== null && photos.length > 0 && <Viewer photos={photos} start={viewerIndex} onRemove={onRemove} onClose={() => setViewerIndex(null)} />}
    </div>
  )
}
