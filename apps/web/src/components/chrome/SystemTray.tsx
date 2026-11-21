import { useEffect, useState } from 'react'

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
}

/**
 * Right side of the task bar: WiFi/speaker glyphs (Segoe Fluent Icons) and a
 * live clock, matching the Windows-style system tray from the design.
 */
export function SystemTray() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex h-full items-center gap-4 px-2.5 text-ink">
      <div className="flex items-center gap-2">
        <span className="icon-font flex w-3.5 items-center justify-center overflow-hidden text-[13px]">{'\uE701'}</span>
        <span className="icon-font flex w-3.5 items-center justify-center overflow-hidden text-[13px]">{'\uE15D'}</span>
      </div>
      <div className="flex flex-col items-end gap-0 leading-tight" title={now.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}>
        <span className="text-[11px]">{formatTime(now)}</span>
        <span className="text-[11px] text-ink/70">{formatDate(now)}</span>
      </div>
    </div>
  )
}
