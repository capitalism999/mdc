/* Generated 1:1 from the design reference (project/Reports.dc.html) — markup, styles and copy are a literal port. */
import { Fragment } from 'react'
import { __a, __h, __s, type ReportsVals } from './reportsRuntime'

export function ReportsSidebar({ $v }: { $v: ReportsVals }) {
  return (
    <aside style={{ width: "248px", flexShrink: "0", display: "flex", flexDirection: "column", background: $v.c?.mica, borderRight: `1px solid ${__s($v.c?.stroke)}` }}>
      {/* MDT: the reference's «Отчёты» title row is dropped — the window title bar already names the app */}
      <div style={{ padding: "12px 12px 12px 12px" }}>
        {" "}
        <button data-create="" className="btn acc" onClick={$v.goNew} style={{ width: "100%", height: "36px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: $v.accent, color: $v.onAccent, fontWeight: "600" }}>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <path d="M10 4v12M4 10h12"></path>
          </svg>
          {"Новый отчёт"}
        </button>
        {" "}
      </div>
      <nav className="scroll" style={{ flex: "1", minHeight: "0", overflowY: "auto", display: "flex", flexDirection: "column", gap: "2px", padding: "0 8px 12px 8px" }}>
        {__a($v.nav).map((n: any, $i0: number) => (
          <Fragment key={$i0}>
            {/* MDT: category heading («Сержант», «Бланки») */}
            {n?.isHead ? (
              <span style={{ display: "block", padding: "14px 12px 4px 12px", marginTop: "6px", borderTop: `1px solid ${__s($v.c?.stroke)}`, fontSize: "11px", lineHeight: "16px", fontWeight: "600", letterSpacing: ".6px", textTransform: "uppercase", color: $v.c?.text2 }}>
                {__h(n?.t)}
              </span>
            ) : null}
            {n?.isItem ? (
            <button className="btn hv" onClick={n?.pick} style={{ position: "relative", height: "34px", flexShrink: "0", borderRadius: "6px", display: "flex", alignItems: "center", gap: "12px", padding: "0 12px", background: n?.bg }}>
              <span style={{ position: "absolute", left: "0", top: "9px", width: "3px", height: "16px", borderRadius: "2px", background: $v.accent, opacity: n?.op }}></span>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: $v.c?.text2 }}>
                <path d={n?.icon}></path>
              </svg>
              <span className="ell" style={{ flex: "1", fontWeight: n?.fw }}>
                {__h(n?.t)}
              </span>
              <span className="num" style={{ fontSize: "12px", fontWeight: n?.cfw, color: n?.cc }}>
                {__h(n?.count)}
              </span>
            </button>
            ) : null}
          </Fragment>
        ))}
      </nav>
    </aside>
  )
}
