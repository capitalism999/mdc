/* Generated 1:1 from the design reference (project/Reports.dc.html) — markup, styles and copy are a literal port. */
import { Fragment } from 'react'
import { __a, __h, __s, type ReportsVals } from './reportsRuntime'

export function ReportsList({ $v }: { $v: ReportsVals }) {
  if (!$v.isList) return null
  return (
    <>
      <div style={{ flex: "1", minHeight: "0", display: "flex", marginTop: "-40px" }}>
        <div style={{ width: "380px", flexShrink: "0", display: "flex", flexDirection: "column", borderRight: `1px solid ${__s($v.c?.stroke)}` }}>
          <div style={{ padding: "18px 18px 10px 20px", display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ fontSize: "20px", lineHeight: "28px", fontWeight: "600" }}>
              {__h($v.listTitle)}
            </span>
            <span style={{ fontSize: "13px", color: $v.c?.text2 }}>
              {__h($v.listSub)}
            </span>
          </div>
          <div className="scroll" style={{ flex: "1", minHeight: "0", padding: "0 8px 8px 8px", display: "flex", flexDirection: "column", gap: "2px" }}>
            {__a($v.rows).map((r: any, $i0: number) => (
              <Fragment key={$i0}>
                <button className="btn hv" onClick={r?.pick} style={{ position: "relative", display: "flex", gap: "12px", padding: "10px 12px", borderRadius: "8px", background: r?.bg }}>
                  <span style={{ position: "absolute", left: "0", top: "14px", width: "3px", height: "24px", borderRadius: "2px", background: $v.accent, opacity: r?.op }}></span>
                  <span style={{ width: "36px", height: "36px", flexShrink: "0", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", background: r?.icBg, color: r?.icFg }}>
                    <svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d={r?.icon}></path>
                    </svg>
                  </span>
                  <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", lineHeight: "18px" }}>
                    <span style={{ display: "flex", gap: "8px", alignItems: "baseline" }}>
                      <span className="ell" style={{ flex: "1", minWidth: "0", fontWeight: "600" }}>
                        {__h(r?.title)}
                      </span>
                      <span className="num" style={{ flexShrink: "0", fontSize: "12px", color: $v.c?.text2 }}>
                        {__h(r?.no)}
                      </span>
                    </span>
                    <span className="ell" style={{ fontSize: "12px", color: $v.c?.text2 }}>
                      {__h(r?.type)}{" · "}{__h(r?.sub)}
                    </span>
                    <span style={{ paddingTop: "4px", display: "flex", gap: "6px" }}>
                      <span className="chip" style={{ height: "20px", fontSize: "11px", background: r?.stBg, color: r?.stFg }}>
                        {__h(r?.st)}
                      </span>
                      <span className="ell" style={{ fontSize: "11px", color: $v.c?.text2, alignSelf: "center" }}>
                        {__h(r?.when)}
                      </span>
                    </span>
                  </span>
                </button>
              </Fragment>
            ))}
          </div>
        </div>
        <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column" }}>
          <div className="scroll" style={{ flex: "1", minHeight: "0", padding: "18px 28px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingRight: "130px" }}>
              <span className="num" style={{ fontSize: "13px", color: $v.c?.text2 }}>
                {__h($v.w?.no)}
              </span>
              <span className="chip" style={{ background: $v.w?.tBg, color: $v.w?.tFg }}>
                {__h($v.w?.type)}
              </span>
              <span className="chip" style={{ background: $v.w?.stBg, color: $v.w?.stFg }}>
                {__h($v.w?.st)}
              </span>
            </div>
            <span style={{ fontSize: "26px", lineHeight: "34px", fontWeight: "700" }}>
              {__h($v.w?.title)}
            </span>
            {$v.w?.hasNote ? (
              <div style={{ display: "flex", gap: "12px", padding: "12px 16px", borderRadius: "10px", background: $v.w?.nBg }}>
                <span style={{ flex: "1", display: "flex", flexDirection: "column", lineHeight: "18px" }}>
                  <span style={{ fontWeight: "600", color: $v.w?.nFg }}>
                    {__h($v.w?.nTitle)}
                  </span>
                  <span style={{ fontSize: "13px" }}>
                    {__h($v.w?.nText)}
                  </span>
                </span>
              </div>
            ) : null}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "10px 18px" }}>
              {__a($v.w?.facts).map((f: any, $i0: number) => (
                <Fragment key={$i0}>
                  <span style={{ display: "flex", flexDirection: "column", lineHeight: "18px", minWidth: "0" }}>
                    <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                      {__h(f?.k)}
                    </span>
                    <span className="ell" style={{ fontWeight: "600" }}>
                      {__h(f?.v)}
                    </span>
                  </span>
                </Fragment>
              ))}
            </div>
            {__a($v.dcd).map((sx: any, $i0: number) => (
              <Fragment key={$i0}>
                <div style={{ flexShrink: "0", borderRadius: "12px", background: $v.c?.card, overflow: "hidden" }}>
                  {" "}
                  <div style={{ padding: "11px 18px", borderBottom: `1px solid ${__s($v.c?.stroke)}` }}>
                    <span style={{ fontSize: "12px", lineHeight: "16px", fontWeight: "700", letterSpacing: ".6px", textTransform: "uppercase", color: $v.c?.text2 }}>
                      {__h(sx?.t)}
                    </span>
                  </div>
                  {" "}
                  <div style={{ padding: "14px 18px 16px 18px", display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "14px 22px" }}>
                    {__a(sx?.items).map((it: any, $i1: number) => (
                      <Fragment key={$i1}>
                        <div style={{ gridColumn: it?.span, display: "flex", flexDirection: "column", gap: "4px", minWidth: "0" }}>
                          <span style={{ fontSize: "12px", lineHeight: "16px", color: $v.c?.text2 }}>
                            {__h(it?.l)}
                          </span>
                          {it?.isTxt ? (
                            <span style={{ fontSize: "14px", lineHeight: "20px", fontWeight: "500", whiteSpace: "pre-wrap" }}>
                              {__h(it?.v)}
                            </span>
                          ) : null}
                          {it?.isTab ? (
                            <div style={{ display: "flex", flexDirection: "column", borderRadius: "8px", overflow: "hidden", background: $v.c?.field }}>
                              <div style={{ display: "grid", gridTemplateColumns: it?.gt, gap: "10px", padding: "7px 12px", fontSize: "11px", lineHeight: "15px", color: $v.c?.text2, background: "rgba(255,255,255,0.03)" }}>
                                {__a(it?.cols).map((co: any, $i2: number) => (
                                  <Fragment key={$i2}>
                                    <span>
                                      {__h(co?.t)}
                                    </span>
                                  </Fragment>
                                ))}
                              </div>
                              {__a(it?.rows).map((rw: any, $i2: number) => (
                                <Fragment key={$i2}>
                                  <div style={{ display: "grid", gridTemplateColumns: it?.gt, gap: "10px", padding: "8px 12px", borderTop: `1px solid ${__s($v.c?.stroke)}`, fontSize: "13px", lineHeight: "18px", minHeight: "18px" }}>
                                    {__a(rw?.cells).map((ce: any, $i3: number) => (
                                      <Fragment key={$i3}>
                                        <span>
                                          {__h(ce?.t)}
                                        </span>
                                      </Fragment>
                                    ))}
                                  </div>
                                </Fragment>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </Fragment>
                    ))}
                  </div>
                  {" "}
                </div>
              </Fragment>
            ))}
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "14px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "12px 14px", borderRadius: "10px", background: $v.c?.card }}>
                <span style={{ fontWeight: "600", paddingBottom: "4px" }}>
                  {"Связано"}
                </span>
                {__a($v.w?.links).map((e: any, $i0: number) => (
                  <Fragment key={$i0}>
                    <a href="#" onClick={$v.__go(e?.href, e?.v)} className="hv" style={{ display: "flex", gap: "10px", padding: "5px 8px", margin: "0 -8px", borderRadius: "6px", textDecoration: "none", color: $v.c?.text, fontSize: "13px", lineHeight: "18px" }}>
                      <span style={{ width: "96px", flexShrink: "0", color: $v.c?.text2 }}>
                        {__h(e?.k)}
                      </span>
                      <span className="ell" style={{ flex: "1", color: $v.c?.link }}>
                        {__h(e?.v)}
                      </span>
                    </a>
                  </Fragment>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", padding: "12px 14px", borderRadius: "10px", background: $v.c?.card }}>
                <span style={{ fontWeight: "600", paddingBottom: "2px" }}>
                  {"Ход"}
                </span>
                {__a($v.w?.tl).map((l: any, $i0: number) => (
                  <Fragment key={$i0}>
                    <div style={{ display: "flex", gap: "12px", fontSize: "13px", lineHeight: "18px" }}>
                      <span className="num" style={{ width: "82px", flexShrink: "0", color: $v.c?.text2 }}>
                        {__h(l?.t)}
                      </span>
                      <span style={{ flex: "1", color: l?.fg, fontWeight: l?.fw }}>
                        {__h(l?.text)}
                      </span>
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 28px", borderTop: `1px solid ${__s($v.c?.stroke)}` }}>
            <button className="btn hv" onClick={$v.w?.openDoc} style={{ height: "34px", padding: "0 14px", borderRadius: "6px", display: "flex", alignItems: "center", gap: "8px", background: $v.c?.btn }}>
              <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 2.5h7l3 3v12H5zM8 9h4M8 12h4"></path>
              </svg>
              {"Бланк"}
            </button>
            <span style={{ flex: "1", fontSize: "12px", color: $v.c?.text2 }}>
              {__h($v.w?.footNote)}
            </span>
            {$v.w?.hasSec ? (
              <button className="btn hv" onClick={$v.w?.sec} style={{ height: "34px", padding: "0 14px", borderRadius: "6px", background: $v.c?.btn, whiteSpace: "nowrap" }}>
                {__h($v.w?.secT)}
              </button>
            ) : null}
            {$v.w?.hasPri ? (
              <button className="btn acc" onClick={$v.w?.pri} style={{ height: "34px", padding: "0 16px", borderRadius: "6px", background: $v.accent, color: $v.onAccent, fontWeight: "600", whiteSpace: "nowrap" }}>
                {__h($v.w?.priT)}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </>
  )
}

export function ReportsToast({ $v }: { $v: ReportsVals }) {
  if (!$v.toast) return null
  return (
    <>
      <div role="status" style={{ position: "absolute", right: "24px", bottom: "24px", zIndex: "30", width: "360px", boxSizing: "border-box", display: "flex", gap: "12px", padding: "14px 16px", borderRadius: "8px", background: $v.c?.flyout, border: `1px solid ${__s($v.c?.stroke)}`, boxShadow: "0 12px 32px rgba(0,0,0,0.45)" }}>
        <span style={{ width: "28px", height: "28px", flexShrink: "0", borderRadius: "50%", background: $v.greenBg, color: $v.greenFg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4.5 10.5l3.5 3.5 7.5-8"></path>
          </svg>
        </span>
        <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontWeight: "600" }}>
            {__h($v.toastTitle)}
          </span>
          <span style={{ fontSize: "13px", color: $v.c?.text2 }}>
            {__h($v.toastText)}
          </span>
        </span>
      </div>
    </>
  )
}
