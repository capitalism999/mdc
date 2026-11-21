/* Generated 1:1 from the design reference (project/Reports.dc.html) — markup, styles and copy are a literal port. */
import { Fragment } from 'react'
import { __a, __h, __s, type ReportsVals } from './reportsRuntime'

export function ReportsTypes({ $v }: { $v: ReportsVals }) {
  if (!$v.isTypes) return null
  return (
    <>
      <div style={{ flex: "1", minHeight: "0", display: "flex", flexDirection: "column", marginTop: "-40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "18px 28px 12px 32px" }}>
          <span style={{ flex: "1", display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ fontSize: "22px", lineHeight: "30px", fontWeight: "600" }}>
              {"Типы отчётов"}
            </span>
            <span style={{ fontSize: "13px", color: $v.c?.text2 }}>
              {"Каждый тип это бланк: набор полей, внешний вид на бумаге и маршрут подписей. Свои типы создаёт командир отдела."}
            </span>
          </span>
          <button className="btn acc" onClick={$v.goBuilderNew} style={{ height: "34px", padding: "0 16px", marginRight: "130px", borderRadius: "6px", display: "flex", alignItems: "center", gap: "8px", background: $v.accent, color: $v.onAccent, fontWeight: "600", whiteSpace: "nowrap" }}>
            <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <path d="M10 4v12M4 10h12"></path>
            </svg>
            {"Новый тип"}
          </button>
        </div>
        <div className="scroll" style={{ flex: "1", minHeight: "0", padding: "4px 28px 24px 32px", display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "14px", alignContent: "start", gridAutoRows: "1fr" /* MDT: equal-height cards */ }}>
          {__a($v.tcards).map((t: any, $i0: number) => (
            <Fragment key={$i0}>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "16px 18px", borderRadius: "10px", background: $v.c?.card }}>
                <div style={{ display: "flex", gap: "12px" }}>
                  <span style={{ width: "40px", height: "40px", flexShrink: "0", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", background: t?.icBg, color: t?.icFg }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d={t?.icon}></path>
                    </svg>
                  </span>
                  <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", lineHeight: "20px" }}>
                    <span style={{ fontSize: "16px", fontWeight: "600" }}>
                      {__h(t?.name)}
                    </span>
                    <span style={{ fontSize: "12px", color: $v.c?.text2, letterSpacing: ".4px" }}>
                      {__h(t?.en)}
                    </span>
                  </span>
                  <span className="chip" style={{ height: "22px", alignSelf: "flex-start", background: $v.c?.btn, color: $v.c?.text2, fontWeight: "500" }}>
                    {__h(t?.pre)}
                  </span>
                </div>
                <span style={{ fontSize: "13px", lineHeight: "19px", color: $v.c?.text2 }}>
                  {__h(t?.about)}
                </span>
                <div style={{ display: "flex", gap: "18px", fontSize: "12px", color: $v.c?.text2 }}>
                  <span>
                    <span className="num" style={{ color: $v.c?.text, fontWeight: "600" }}>
                      {__h(t?.nf)}
                    </span>
                    {" "}{__h(t?.nfW)}
                  </span>
                  <span>
                    <span className="num" style={{ color: $v.c?.text, fontWeight: "600" }}>
                      {__h(t?.ns)}
                    </span>
                    {" "}{__h(t?.nsW)}
                  </span>
                  <span>
                    <span className="num" style={{ color: $v.c?.text, fontWeight: "600" }}>
                      {__h(t?.cnt)}
                    </span>
                    {" "}{__h(t?.cntW)}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "5px", flexWrap: "wrap", fontSize: "12px", color: $v.c?.text2 }}>
                  {__a(t?.route).map((s: any, $i1: number) => (
                    <Fragment key={$i1}>
                      <span className="chip" style={{ height: "22px", background: s?.bg, color: s?.fg, fontWeight: "500" }}>
                        {__h(s?.t)}
                      </span>
                    </Fragment>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "8px", paddingTop: "2px", marginTop: "auto" }}>
                  <button className="btn acc" onClick={t?.make} style={{ height: "32px", padding: "0 14px", borderRadius: "6px", background: $v.accent, color: $v.onAccent, fontWeight: "600", whiteSpace: "nowrap" }}>
                    {"Создать отчёт"}
                  </button>
                  <button className="btn hv" onClick={t?.edit} style={{ height: "32px", padding: "0 14px", borderRadius: "6px", background: $v.c?.btn, whiteSpace: "nowrap" }}>
                    {"Настроить бланк"}
                  </button>
                </div>
              </div>
            </Fragment>
          ))}
          <button className="btn hv" onClick={$v.goBuilderNew} style={{ minHeight: "190px", borderRadius: "10px", border: `1.5px dashed ${__s($v.c?.stroke2)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", color: $v.c?.text2, textAlign: "center" }}>
            <svg width="26" height="26" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              <path d="M10 4v12M4 10h12"></path>
            </svg>
            <span style={{ fontWeight: "600", color: $v.c?.text }}>
              {"Свой тип отчёта"}
            </span>
            <span style={{ fontSize: "12px", maxWidth: "260px", lineHeight: "17px" }}>
              {"Например, карточка полевого опроса, отчёт о досмотре или жалоба на сотрудника"}
            </span>
          </button>
        </div>
      </div>
    </>
  )
}
