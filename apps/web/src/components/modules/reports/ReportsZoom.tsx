import type { ReportsVals } from './reportsRuntime'

/**
 * MDT addition (not in the reference): a floating zoom bar for the paper
 * blank, like a PDF viewer's — stays at the bottom of the sheet column while
 * it scrolls. Ctrl + mouse wheel zooms too (wired in `ReportsApp`).
 */
export function ReportsZoomBar({ $v }: { $v: ReportsVals }) {
  const btn = {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as const
  return (
    <div
      role="toolbar"
      aria-label="Масштаб бланка"
      style={{
        position: 'sticky',
        bottom: '16px',
        zIndex: 5,
        flexShrink: 0,
        alignSelf: 'center',
        display: 'flex',
        alignItems: 'center',
        gap: '2px',
        padding: '3px',
        borderRadius: '8px',
        background: $v.c?.flyout,
        border: `1px solid ${$v.c?.stroke}`,
        boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
        color: $v.c?.text,
      }}
    >
      <button className="btn hv" onClick={$v.__zoomOut} disabled={!$v.__canOut} aria-label="Уменьшить" title="Уменьшить (Ctrl + колесо вниз)" style={{ ...btn, opacity: $v.__canOut ? 1 : 0.4 }}>
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <path d="M4 10h12" />
        </svg>
      </button>
      <button className="btn hv" onClick={$v.__zoomReset} aria-label="Масштаб 100%" title="Сбросить до 100%" style={{ height: '32px', minWidth: '56px', padding: '0 6px', borderRadius: '6px', fontSize: '13px', fontWeight: 600, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>
        {Math.round($v.__zoom * 100)}%
      </button>
      <button className="btn hv" onClick={$v.__zoomIn} disabled={!$v.__canIn} aria-label="Увеличить" title="Увеличить (Ctrl + колесо вверх)" style={{ ...btn, opacity: $v.__canIn ? 1 : 0.4 }}>
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <path d="M10 4v12M4 10h12" />
        </svg>
      </button>
      <span aria-hidden="true" style={{ width: '1px', height: '20px', margin: '0 4px', background: $v.c?.stroke2 }} />
      <button className="btn hv" onClick={$v.__zoomFit} title="Подогнать бланк по ширине" style={{ height: '32px', padding: '0 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', whiteSpace: 'nowrap' }}>
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 10h14M6 7l-3 3 3 3M14 7l3 3-3 3" />
        </svg>
        По ширине
      </button>
    </div>
  )
}
