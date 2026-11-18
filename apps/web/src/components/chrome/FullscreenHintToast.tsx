import { useState } from 'react'

/**
 * Windows 11-style toast, shown once per session right when MDC loads —
 * same visual pattern as the reference design's action toasts (rounded
 * card, icon + title + text, bottom-right), but persistent rather than
 * auto-dismissing: this one only goes away when the officer closes it.
 */
export function FullscreenHintToast() {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  return (
    <div
      role="status"
      className="fixed bottom-[52px] right-3 z-[9999] flex w-[360px] items-start gap-3 rounded-[8px] border border-ink/10 bg-bg-chrome-2 p-3.5 shadow-[0_12px_32px_rgba(0,0,0,0.45)]"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#48adec]/20 text-[#48adec]">
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="10" cy="10" r="8" />
          <path d="M10 9v4.5" />
          <circle cx="10" cy="6.3" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 pt-px">
        <span className="text-[14px] font-semibold text-ink">Совет</span>
        <span className="text-[13px] leading-[18px] text-ink/70">
          Нажмите F11 в браузере, чтобы открыть MDT в полноэкранном режиме — так удобнее работать.
        </span>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Закрыть"
        className="shrink-0 rounded-[4px] p-1 text-ink/40 hover:bg-ink/10 hover:text-ink"
      >
        <svg width="11" height="11" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M5 5l10 10M15 5L5 15" />
        </svg>
      </button>
    </div>
  )
}
