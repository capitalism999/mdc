/* Generated 1:1 from the design reference (project/Reports.dc.html) — markup, styles and copy are a literal port. */
import { Fragment } from 'react'
import { __a, __h, __s, type ReportsVals } from './reportsRuntime'
import { ReportsZoomBar } from './ReportsZoom'

export function ReportsPaper({ $v }: { $v: ReportsVals }) {
  if (!$v.isPaper) return null
  return (
    <>
      <div style={{ flex: "1", minHeight: "0", display: "flex", marginTop: "-40px" }}>
        <div className="scroll" data-paper-scroll="1" style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", padding: "24px 0", background: "#1E1E1E" }}>
          {$v.isReview ? (
            <div style={{ flexShrink: "0", marginTop: "30px", display: "flex", gap: "4px", padding: "3px", borderRadius: "8px", background: $v.c?.btn }}>
              <button className="btn hv" onClick={$v.tabPaper} style={{ height: "28px", padding: "0 14px", borderRadius: "6px", background: $v.tbP, fontSize: "12.5px", fontWeight: "600" }}>
                {"Бланк"}
              </button>
              <button className="btn hv" onClick={$v.tabData} style={{ height: "28px", padding: "0 14px", borderRadius: "6px", background: $v.tbD, fontSize: "12.5px", fontWeight: "600" }}>
                {"Данные отчёта"}
              </button>
            </div>
          ) : null}
          {$v.paperOn ? (
            <div style={{ alignSelf: "stretch", flexShrink: "0", padding: "0 24px" }}><div style={{ zoom: $v.__zoom, margin: "0 auto", position: "relative", width: "560px", flexShrink: "0", boxSizing: "border-box", display: "flex", flexDirection: "column", minHeight: "792px", background: "#FFFFFF", color: "#111111", boxShadow: "0 10px 30px rgba(0,0,0,0.5)", fontFamily: "Tahoma, Arial, 'Segoe UI', sans-serif", padding: "16px 22px 14px 22px" }}>
              {$v.pp?.lp ? (
                <div style={{ display: "flex", alignItems: "stretch", border: "1.5px solid #111111", marginBottom: "2px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 8px", flex: "1", minWidth: "0" }}>
                    <img src={$v.pp?.agLogo} alt={$v.pp?.agTag} width="46" height="46" style={{ display: "block", objectFit: "contain", flexShrink: "0", width: "46px", height: "46px" }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: "0" }}>
                      <span style={{ fontSize: "7.5px", lineHeight: "9px", letterSpacing: "1px", fontWeight: "700" }}>
                        {__h($v.pp?.agName)}
                      </span>
                      <span style={{ fontSize: "13px", lineHeight: "16px", fontWeight: "700", textTransform: "uppercase" }}>
                        {__h($v.pp?.title)}
                      </span>
                      <span style={{ fontSize: "8px", lineHeight: "10px", letterSpacing: "1.4px", color: "#555555", textTransform: "uppercase" }}>
                        {__h($v.pp?.en)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}
              {$v.pp?.ls ? (
                <>
                <span style={{ textAlign: "center", fontFamily: "'Times New Roman', Georgia, serif", fontSize: "17px", lineHeight: "22px" }}>
                  {__h($v.pp?.agName)}
                </span>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0 10px 0", borderBottom: "1px solid #C8C8C8", fontSize: "8px", lineHeight: "12px" }}>
                  <span style={{ width: "140px", display: "flex", flexDirection: "column", paddingLeft: "36px" }}>
                    <span style={{ fontWeight: "700" }}>
                      {__h($v.pp?.head1)}
                    </span>
                    <span>
                      {__h($v.pp?.head2)}
                    </span>
                  </span>
                  <img src={$v.pp?.agLogo} alt={$v.pp?.agTag} width="66" height="66" style={{ display: "block", objectFit: "contain", width: "66px", height: "66px" }} />
                  <span style={{ width: "140px", textAlign: "right", display: "flex", flexDirection: "column", paddingRight: "36px" }}>
                    <span>
                      {__h($v.pp?.ag1)}
                    </span>
                    <span>
                      {__h($v.pp?.ag2)}
                    </span>
                    <span>
                      {__h($v.pp?.ag3)}
                    </span>
                  </span>
                </div>
                </>
              ) : null}
              {$v.pp?.stamp ? (
                <span style={{ position: "absolute", right: "16px", bottom: "12px", padding: "1px 7px", border: `1.5px solid ${__s($v.pp?.stampC)}`, borderRadius: "3px", color: $v.pp?.stampC, fontSize: "8.5px", lineHeight: "12px", fontWeight: "700", letterSpacing: "1.2px", opacity: ".85" }}>
                  {__h($v.pp?.stampT)}
                </span>
              ) : null}
              {$v.pp?.ls ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", paddingTop: "14px" }}>
                  <span style={{ fontSize: "15px", lineHeight: "19px", fontWeight: "700", letterSpacing: ".6px", textTransform: "uppercase", textAlign: "center" }}>
                    {__h($v.pp?.title)}
                  </span>
                  <span style={{ fontSize: "8px", lineHeight: "10px", letterSpacing: "1.4px", color: "#555555" }}>
                    {__h($v.pp?.en)}
                  </span>
                </div>
              ) : null}
              <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "5px", paddingTop: "8px", fontSize: "8.5px", lineHeight: "12px" }}>
                {__a($v.pp?.blocks).map((b: any, $i0: number) => (
                  <Fragment key={$i0}>
                    {b?.isHead ? (
                      <span style={{ display: "block", textAlign: "center", fontSize: "9.5px", fontWeight: "700", letterSpacing: ".3px", textTransform: "uppercase", paddingTop: "14px" }}>
                        {__h(b?.title)}
                      </span>
                    ) : null}
                    {b?.isFacts ? (
                      <div style={{ borderTop: "1px solid #555555", borderLeft: "1px solid #555555" }}>
                        {" "}
                        {__a(b?.rws).map((rw: any, $i1: number) => (
                          <Fragment key={$i1}>
                            {" "}
                            <div style={{ display: "grid", gridTemplateColumns: rw?.gt, fontWeight: "700", fontSize: "8px", textTransform: "uppercase" }}>
                              {__a(rw?.cells).map((ce: any, $i2: number) => (
                                <Fragment key={$i2}>
                                  <div style={{ padding: "3px 5px", borderRight: "1px solid #555555", borderBottom: "1px solid #555555", minWidth: "0" }}>
                                    {__h(ce?.k)}
                                  </div>
                                </Fragment>
                              ))}
                            </div>
                            {" "}
                            <div style={{ display: "grid", gridTemplateColumns: rw?.gt, fontSize: "8.5px" }}>
                              {__a(rw?.cells).map((cv: any, $i2: number) => (
                                <Fragment key={$i2}>
                                  <div style={{ padding: "3px 5px", minHeight: "16px", borderRight: "1px solid #555555", borderBottom: "1px solid #555555", minWidth: "0" }}>
                                    {__h(cv?.v)}
                                  </div>
                                </Fragment>
                              ))}
                            </div>
                            {" "}
                          </Fragment>
                        ))}
                        {" "}
                      </div>
                    ) : null}
                    {b?.isLong ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                        <span style={{ fontSize: "8px", color: "#333333" }}>
                          {__h(b?.label)}
                        </span>
                        <div style={{ border: "1.5px solid #111111", padding: "6px 8px", minHeight: "64px", fontSize: "8.5px", lineHeight: "12.5px" }}>
                          {__a(b?.parts).map((qp: any, $i1: number) => (
                            <Fragment key={$i1}>
                              {qp?.a ? (
                                <>
                                {__h(qp?.t)}
                                </>
                              ) : null}
                              {qp?.b ? (
                                <span className="lpi">
                                  {__h(qp?.t)}
                                </span>
                              ) : null}
                            </Fragment>
                          ))}
                        </div>
                      </div>
                    ) : null}
                    {b?.isChecks ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                        <span style={{ fontSize: "8px", fontWeight: "700", textTransform: "uppercase", padding: "3px 5px", background: "#ECECEC", border: "1px solid #888888" }}>
                          {__h(b?.label)}
                        </span>
                        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)", gap: "2px 8px", padding: "0 5px" }}>
                          {__a(b?.items).map((it: any, $i1: number) => (
                            <Fragment key={$i1}>
                              <span style={{ display: "flex", gap: "4px", fontWeight: it?.fw }}>
                                <span style={{ fontSize: "10px" }}>
                                  {__h(it?.box)}
                                </span>
                                <span>
                                  {__h(it?.t)}
                                </span>
                              </span>
                            </Fragment>
                          ))}
                        </div>
                      </div>
                    ) : null}
                    {b?.isTable ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                        <span style={{ fontSize: "8px", color: "#333333" }}>
                          {__h(b?.label)}
                        </span>
                        <div style={{ borderTop: "1px solid #555555", borderLeft: "1px solid #555555", fontSize: "8.5px" }}>
                          {" "}
                          <div style={{ display: "grid", gridTemplateColumns: b?.gt, fontWeight: "700", fontSize: "8px", textTransform: "uppercase" }}>
                            {__a(b?.cols).map((cl: any, $i1: number) => (
                              <Fragment key={$i1}>
                                <span style={{ padding: "3px 5px", borderRight: "1px solid #555555", borderBottom: "1px solid #555555" }}>
                                  {__h(cl?.t)}
                                </span>
                              </Fragment>
                            ))}
                          </div>
                          {" "}
                          {__a(b?.trs).map((tr: any, $i1: number) => (
                            <Fragment key={$i1}>
                              <div style={{ display: "grid", gridTemplateColumns: b?.gt, minHeight: "18px" }}>
                                {__a(tr?.cells).map((ce: any, $i2: number) => (
                                  <Fragment key={$i2}>
                                    <span style={{ padding: "3px 5px", borderRight: "1px solid #555555", borderBottom: "1px solid #555555", minWidth: "0" }}>
                                      {__a(ce?.p).map((qp: any, $i3: number) => (
                                        <Fragment key={$i3}>
                                          {qp?.a ? (
                                            <>
                                            {__h(qp?.t)}
                                            </>
                                          ) : null}
                                          {qp?.b ? (
                                            <span className="lpi">
                                              {__h(qp?.t)}
                                            </span>
                                          ) : null}
                                        </Fragment>
                                      ))}
                                    </span>
                                  </Fragment>
                                ))}
                              </div>
                            </Fragment>
                          ))}
                          {" "}
                        </div>
                      </div>
                    ) : null}
                    {b?.isDiag ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                        <span style={{ fontSize: "8px", color: "#333333" }}>
                          {__h(b?.label)}
                        </span>
                        {b?.shotImg ? (
                          <img src={b?.shot} style={{ display: "block", width: "100%", maxHeight: "280px", objectFit: "contain", border: "1px solid #555555", background: "#FFFFFF" }} />
                        ) : null}
                        {b?.shotPh ? (
                          <div style={{ height: "150px", border: "1px solid #555555", background: "#E6E6E6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", color: "#555555" }}>
                            {__h(b?.shotName)}
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </Fragment>
                ))}
                <div style={{ flex: "1", minHeight: "8px" }}></div>
                <div style={{ borderTop: "1px solid #C8C8C8", paddingTop: "10px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", textAlign: "center", fontSize: "8.5px" }}>
                  <span>
                    {__h($v.pp?.fr)}
                  </span>
                  <span>
                    {__h($v.pp?.agFoot)}
                  </span>
                  <span>
                    {"2026"}
                  </span>
                </div>
              </div>
            </div></div>
          ) : null}
          {$v.paperOn ? <ReportsZoomBar $v={$v} /> : null}
          {$v.dvOn ? (
            <div style={{ width: "560px", flexShrink: "0", display: "flex", flexDirection: "column", gap: "12px" }}>
              <span style={{ fontSize: "12px", lineHeight: "17px", color: $v.c?.text2 }}>
                {"Все поля отчёта, как их заполнил автор. Служебные и пустые пункты на бланке не печатаются, здесь они помечены."}
              </span>
              {__a($v.dv).map((sx: any, $i0: number) => (
                <Fragment key={$i0}>
                  <div style={{ padding: "14px 16px", borderRadius: "10px", background: $v.c?.card, display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "14px", fontWeight: "600" }}>
                        {__h(sx?.t)}
                      </span>
                      {sx?.np ? (
                        <span style={{ padding: "1px 7px", borderRadius: "4px", background: $v.c?.btn, color: $v.c?.text2, fontSize: "11px" }}>
                          {"не печатается"}
                        </span>
                      ) : null}
                    </div>
                    {__a(sx?.items).map((it: any, $i1: number) => (
                      <Fragment key={$i1}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                              {__h(it?.l)}
                            </span>
                            {it?.hid ? (
                              <span style={{ fontSize: "11px", color: $v.c?.text2, opacity: ".7" }}>
                                {"· на бланке скрыто"}
                              </span>
                            ) : null}
                          </div>
                          {it?.isTxt ? (
                            <span style={{ fontSize: "13px", lineHeight: "19px", whiteSpace: "pre-wrap", color: it?.fg }}>
                              {__h(it?.v)}
                            </span>
                          ) : null}
                          {it?.isTab ? (
                            <div style={{ display: "flex", flexDirection: "column", borderRadius: "6px", overflow: "hidden", background: $v.c?.field }}>
                              <div style={{ display: "grid", gridTemplateColumns: it?.gt, gap: "8px", padding: "6px 10px", fontSize: "11px", color: $v.c?.text2 }}>
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
                                  <div style={{ display: "grid", gridTemplateColumns: it?.gt, gap: "8px", padding: "6px 10px", borderTop: `1px solid ${__s($v.c?.stroke)}`, fontSize: "13px", minHeight: "18px" }}>
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
                </Fragment>
              ))}
            </div>
          ) : null}
        </div>
        <div style={{ width: "340px", flexShrink: "0", display: "flex", flexDirection: "column", borderLeft: `1px solid ${__s($v.c?.stroke)}`, background: $v.c?.rail }}>
          <div className="scroll" style={{ flex: "1", minHeight: "0", padding: "58px 18px 16px 18px", display: "flex", flexDirection: "column", gap: "14px" }}>
            {/* MDT: review header — back to the queue, what is being reviewed */}
            {$v.isReview ? (
              <>
              <button className="btn hv" onClick={$v.rv?.back} style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: $v.c?.link }}>
                <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12.5 4.5L7 10l5.5 5.5"></path>
                </svg>
                {"К очереди"}
              </button>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px", paddingBottom: "4px", borderBottom: `1px solid ${__s($v.c?.stroke)}` }}>
                <span style={{ fontSize: "16px", lineHeight: "22px", fontWeight: "600" }}>
                  <span className="num">{__h($v.rv?.no)}</span>{" · "}{__h($v.rv?.typeT)}
                </span>
                <span style={{ fontSize: "12.5px", color: $v.c?.text2 }}>
                  {__h($v.rv?.by)}{" · "}{__h($v.rv?.waitT)}
                </span>
              </div>
              </>
            ) : null}
            {$v.isDocView ? (
              <>
              <button className="btn hv" onClick={$v.goList} style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: $v.c?.link }}>
                <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12.5 4.5L7 10l5.5 5.5"></path>
                </svg>
                {"К отчёту "}{__h($v.pp?.no)}
              </button>
              <span style={{ fontSize: "13px", color: $v.c?.text2 }}>
                {"Бланк собирается из данных отчёта и подписей. Его можно распечатать (после нажатия в игре вы получите предмет с распечаткой в инвентарь) или приложить к делу."}
              </span>
              </>
            ) : null}
            {$v.isReview ? (
              <>
              <span style={{ fontSize: "12px", fontWeight: "600", color: $v.c?.text2 }}>
                {__h($v.rv?.title)}
              </span>
              {__a($v.rv?.checks).map((k: any, $i0: number) => (
                <Fragment key={$i0}>
                  <span style={{ display: "flex", gap: "8px", fontSize: "13px", lineHeight: "19px" }}>
                    <span style={{ color: k?.c }}>
                      {__h(k?.m)}
                    </span>
                    <span>
                      {__h(k?.t)}
                    </span>
                  </span>
                </Fragment>
              ))}
              <span style={{ fontSize: "12px", fontWeight: "600", color: $v.c?.text2, paddingTop: "4px" }}>
                {"Приложено"}
              </span>
              {__a($v.rv?.att).map((e: any, $i0: number) => (
                <Fragment key={$i0}>
                  <a href={e?.isLink ? "#" : undefined} onClick={e?.isLink ? $v.__go(e?.href, e?.v) : undefined} className={e?.isLink ? "hv" : undefined} style={{ display: "flex", gap: "10px", padding: "5px 8px", margin: "0 -8px", borderRadius: "6px", textDecoration: "none", color: $v.c?.text, fontSize: "13px", lineHeight: "18px" }}>
                    <span style={{ width: "78px", flexShrink: "0", color: $v.c?.text2 }}>
                      {__h(e?.k)}
                    </span>
                    <span className="ell" style={{ flex: "1", color: e?.isLink ? $v.c?.link : $v.c?.text }}>
                      {__h(e?.v)}
                    </span>
                  </a>
                </Fragment>
              ))}
              <label style={{ display: "flex", flexDirection: "column", gap: "6px", paddingTop: "4px" }}>
                <span style={{ fontSize: "12px", fontWeight: "600", color: $v.c?.text2 }}>
                  {__h($v.rv?.noteLabel)}
                </span>
                <textarea rows={3} value={$v.rv?.lock ? __s($v.rv?.sentNote) : __s($v.__retNote)} readOnly={!!$v.rv?.lock} onChange={$v.__onRetNote} placeholder={$v.rv?.lock ? "Без комментария" : $v.rv?.ph} style={{ resize: "none", boxSizing: "border-box", padding: "8px 10px", borderRadius: "6px", border: "0", opacity: $v.rv?.lock ? 0.75 : 1, borderBottom: $v.rv?.noteErr ? "2px solid #FF99A4" : `1px solid ${__s($v.c?.stroke2)}`, background: $v.c?.field, fontSize: "13px", lineHeight: "19px" }} />
              </label>
              </>
            ) : null}
          </div>
          <div style={{ padding: "12px 18px 16px 18px", display: "flex", flexDirection: "column", gap: "8px", borderTop: `1px solid ${__s($v.c?.stroke)}` }}>
            {$v.isDocView ? (
              <>
              <button className="btn hv" onClick={$v.printDoc} style={{ height: "34px", borderRadius: "6px", background: $v.c?.btn, textAlign: "center" }}>
                {"Распечатать"}
              </button>
              <button className="btn acc" onClick={$v.pdfDoc} style={{ height: "36px", borderRadius: "6px", background: $v.accent, color: $v.onAccent, fontWeight: "600", textAlign: "center" }}>
                {"Скачать PDF"}
              </button>
              </>
            ) : null}
            {$v.rv?.can ? (
              <>
              <button className="btn hv" onClick={$v.rvReturn} style={{ height: "34px", borderRadius: "6px", background: $v.c?.btn, textAlign: "center" }}>
                {"Вернуть на доработку"}
              </button>
              <button className="btn acc" onClick={$v.rvSign} style={{ height: "36px", borderRadius: "6px", background: $v.accent, color: $v.onAccent, fontWeight: "600", textAlign: "center" }}>
                {__h($v.rv?.okT)}
              </button>
              </>
            ) : null}
            {$v.rv?.done ? (
              <span style={{ fontSize: "13px", color: $v.c?.text2, textAlign: "center" }}>
                {__h($v.rv?.doneT)}
              </span>
            ) : null}
            {/* MDT: after the decision — on to the next report in the queue */}
            {$v.rv?.done && $v.rv?.next ? (
              <button className="btn acc" onClick={$v.rv?.next} style={{ height: "36px", borderRadius: "6px", background: $v.accent, color: $v.onAccent, fontWeight: "600", textAlign: "center" }}>
                {__h($v.rv?.nextT)}
              </button>
            ) : null}
            {$v.rv?.done && $v.rv?.empty ? (
              <button className="btn hv" onClick={$v.rv?.back} style={{ height: "34px", borderRadius: "6px", background: $v.c?.btn, textAlign: "center" }}>
                {"Очередь пуста · к списку"}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </>
  )
}
