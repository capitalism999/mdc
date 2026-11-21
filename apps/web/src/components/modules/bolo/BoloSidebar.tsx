/* Generated 1:1 from the design reference (project/BOLO.dc.html) — markup, styles and copy are a literal port. */
import { Fragment } from 'react'
import { __a, __h, __s, type BoloVals } from './boloRuntime'

export function BoloSidebar({ $v }: { $v: BoloVals }) {
  return (
    <aside className="bolo-side" style={{ width: "248px", flexShrink: "0", display: "flex", flexDirection: "column", background: $v.c?.mica, borderRight: `1px solid ${__s($v.c?.stroke)}` }}>
      <div style={{ padding: "12px 12px 12px 12px" }}>
        {" "}
        <button data-create="" className="btn acc" onClick={$v.goNew} style={{ width: "100%", height: "36px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: $v.accent, color: $v.onAccent, fontWeight: "600" }}>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <path d="M10 4v12M4 10h12"></path>
          </svg>
          {" Новая ориентировка "}
        </button>
        {" "}
      </div>
      <nav className="scroll" style={{ flex: "1", minHeight: "0", display: "flex", flexDirection: "column", gap: "2px", padding: "0 8px" }}>
        {__a($v.navGroups).map((ng: any, $i0: number) => (
          <Fragment key={$i0}>
            <div style={{ padding: "12px 12px 4px 12px", fontSize: "12px", fontWeight: "600", color: $v.c?.text2 }}>
              {__h(ng?.title)}
            </div>
            {__a(ng?.items).map((n: any, $i1: number) => (
              <Fragment key={$i1}>
                <button className="btn hv" onClick={n?.pick} style={{ position: "relative", height: "34px", flexShrink: "0", borderRadius: "6px", display: "flex", alignItems: "center", gap: "12px", padding: "0 12px", background: n?.bg }}>
                  <span style={{ position: "absolute", left: "0", top: "9px", width: "3px", height: "16px", borderRadius: "2px", background: $v.accent, opacity: n?.op }}></span>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: n?.ic }}>
                    <path d={n?.icon}></path>
                  </svg>
                  <span style={{ flex: "1", fontWeight: n?.fw }}>
                    {__h(n?.name)}
                  </span>
                  <span className="num" style={{ fontSize: "12px", fontWeight: n?.cfw, color: n?.cc }}>
                    {__h(n?.count)}
                  </span>
                </button>
              </Fragment>
            ))}
          </Fragment>
        ))}
      </nav>
      <div style={{ margin: "8px 12px 12px 12px", padding: "12px", borderRadius: "8px", background: $v.c?.card, display: "flex", flexDirection: "column", gap: "8px" }}>
        <button className="btn" onClick={$v.notifToggle} aria-expanded={!!$v.notifOpen} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "600", color: $v.c?.text2, textAlign: "left" }}>
          <span style={{ flex: "1" }}>{"Уведомления о новых"}</span>
          {!$v.notifOpen ? <span style={{ fontWeight: "400" }}>{__h($v.notifCur)}</span> : null}
          <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d={$v.notifChevron}></path>
          </svg>
        </button>
        {$v.notifOpen ? (
        <>
        <div style={{ display: "flex", gap: "2px", padding: "2px", borderRadius: "6px", background: $v.c?.search }}>
          {__a($v.notifOpts).map((o: any, $i0: number) => (
            <Fragment key={$i0}>
              <button className="btn" onClick={o?.pick} style={{ flex: "1", height: "26px", borderRadius: "5px", background: o?.bg, color: o?.fg, fontSize: "12px", fontWeight: o?.fw, textAlign: "center", whiteSpace: "nowrap" }}>
                {__h(o?.t)}
              </button>
            </Fragment>
          ))}
        </div>
        <span style={{ fontSize: "12px", lineHeight: "16px", color: $v.c?.text2 }}>
          {__h($v.notifText)}
        </span>
        </>
        ) : null}
      </div>
    </aside>
  )
}
