import type { SearchVals } from '../searchRuntime'

const item = { height: '36px', padding: '0 12px', gap: '10px', borderRadius: '6px', width: '100%', boxSizing: 'border-box', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', fontSize: '13px', textAlign: 'left', color: 'inherit' } as const

/**
 * «⋯ Ещё действия» for the cards that had no menu (транспорт, оружие,
 * организация, недвижимость, простая запись) — the same button and panel as
 * the person's card, so «Изменить данные» lives in the same place everywhere
 * instead of a link next to «Повесить тег».
 */
export function RecordMoreMenu({ $v }: { $v: SearchVals }) {
  return (
    <div style={{ position: 'relative' }}>
      <button className="btn hv" onClick={$v.menuToggle} aria-label="Ещё действия" title="Ещё действия" style={{ height: '34px', width: '38px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: $v.c?.btn }}>
        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <circle cx="4.5" cy="10" r="1.6" />
          <circle cx="10" cy="10" r="1.6" />
          <circle cx="15.5" cy="10" r="1.6" />
        </svg>
      </button>
      {$v.menuOpen ? (
        <div role="menu" style={{ position: 'absolute', right: 0, top: '40px', zIndex: 5, width: '250px', padding: '4px', borderRadius: '10px', background: $v.c?.card, border: `1px solid ${$v.c?.stroke}`, boxShadow: '0 8px 24px rgba(0,0,0,0.45)', display: 'flex', flexDirection: 'column' }}>
          {$v.tg?.canEdit ? (
            <button role="menuitem" className="btn hv" onClick={$v.tg?.edit} style={item}>
              <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true" style={{ flexShrink: 0 }}>
                <path d="M3 17l1-4L14 3l3 3L7 16zM12 5l3 3" />
              </svg>
              Изменить данные
            </button>
          ) : null}
          <button role="menuitem" className="btn hv" onClick={$v.dl?.print} style={item}>
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true" style={{ flexShrink: 0 }}>
              <path d="M5.5 7.5V3h9v4.5" />
              <rect x="2.5" y="7.5" width="15" height="7" rx="1.5" />
              <path d="M5.5 12h9v5h-9z" />
            </svg>
            Распечатать
          </button>
          <button role="menuitem" className="btn hv" onClick={$v.dl?.showHist} style={item}>
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true" style={{ flexShrink: 0 }}>
              <circle cx="10" cy="10" r="7" />
              <path d="M10 6v4l3 2" />
            </svg>
            История изменений
          </button>
        </div>
      ) : null}
    </div>
  )
}
