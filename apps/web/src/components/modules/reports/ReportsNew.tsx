/* Generated 1:1 from the design reference (project/Reports.dc.html) — markup, styles and copy are a literal port. */
import { Fragment } from 'react'
import { __a, __h, __s, type ReportsVals } from './reportsRuntime'
import { ReportsZoomBar } from './ReportsZoom'

export function ReportsNew({ $v }: { $v: ReportsVals }) {
  if (!$v.isNew) return null
  return (
    <>
      <div style={{ flex: "1", minHeight: "0", display: "flex", marginTop: "-40px" }}>
        <div style={{ width: "540px", flexShrink: "0", display: "flex", flexDirection: "column", borderRight: `1px solid ${__s($v.c?.stroke)}` }}>
          <div className="scroll" style={{ flex: "1", minHeight: "0", padding: "18px 22px 16px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button className="btn hv" onClick={$v.goList} aria-label="Назад" style={{ width: "32px", height: "32px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12.5 4.5L7 10l5.5 5.5"></path>
                </svg>
              </button>
              <span style={{ fontSize: "22px", lineHeight: "30px", fontWeight: "600" }}>
                {"Новый отчёт"}
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "8px" }}>
              {__a($v.nTypes).map((t: any, $i0: number) => (
                <Fragment key={$i0}>
                  <button className="btn hv" onClick={t?.pick} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 12px", borderRadius: "8px", background: t?.bg, boxShadow: t?.ring }}>
                    <span style={{ width: "32px", height: "32px", flexShrink: "0", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", background: t?.icBg, color: t?.ic }}>
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d={t?.icon}></path>
                      </svg>
                    </span>
                    <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", lineHeight: "17px" }}>
                      <span className="ell" style={{ fontWeight: "600" }}>
                        {__h(t?.t)}
                      </span>
                      <span className="ell" style={{ fontSize: "11px", color: $v.c?.text2 }}>
                        {__h(t?.sub)}
                      </span>
                    </span>
                  </button>
                </Fragment>
              ))}
            </div>
            {__a($v.form).map((sec: any, $i0: number) => (
              <Fragment key={$i0}>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "14px 16px", borderRadius: "10px", background: $v.c?.card }}>
                  <span style={{ fontWeight: "600" }}>
                    {__h(sec?.t)}
                  </span>
                  <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "10px 12px" }}>
                    {__a(sec?.fs).map((f: any, $i1: number) => (
                      <Fragment key={$i1}>
                        <div style={{ gridColumn: f?.col, display: "flex", flexDirection: "column", gap: "4px", minWidth: "0" }}>
                          <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                            {__h(f?.l)}
                          </span>
                          {f?.isText ? (
                            <input value={__s(f?.v)} onChange={f?.on} style={{ boxSizing: "border-box", height: "32px", padding: "0 10px", borderRadius: "6px", border: "0", borderBottom: `1px solid ${__s($v.c?.stroke2)}`, background: $v.c?.field, fontSize: "13px" }} />
                          ) : null}
                          {f?.isEnt ? (
                            <div style={{ display: "flex", gap: "4px" }}>
                              {f?.entOn ? (
                                <>
                                <a href="#" onClick={$v.__go(f?.href, f?.v)} className="hv" style={{ flex: "1", minWidth: "0", display: "flex", alignItems: "center", gap: "8px", height: "32px", padding: "0 10px", borderRadius: "6px", background: $v.c?.btn, textDecoration: "none", color: $v.c?.link, fontSize: "13px" }}>
                                  <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: "0" }}>
                                    <path d="M8.5 11.5a3.5 3.5 0 005 0l3-3a3.5 3.5 0 00-5-5l-1 1M11.5 8.5a3.5 3.5 0 00-5 0l-3 3a3.5 3.5 0 005 5l1-1"></path>
                                  </svg>
                                  <span className="ell" style={{ flex: "1" }}>
                                    {__h(f?.v)}
                                  </span>
                                </a>
                                <button className="btn hv" onClick={f?.detach} style={{ height: "32px", padding: "0 12px", borderRadius: "6px", background: $v.c?.btn, color: $v.c?.text2, fontSize: "12px", whiteSpace: "nowrap" }}>
                                  {"Открепить"}
                                </button>
                                </>
                              ) : null}
                              {f?.entOff ? (
                                <>
                                <input value={__s(f?.v)} onChange={f?.on} placeholder="Ввести вручную" style={{ flex: "1", minWidth: "0", boxSizing: "border-box", height: "32px", padding: "0 10px", borderRadius: "6px", border: "0", borderBottom: `1px solid ${__s($v.c?.stroke2)}`, background: $v.c?.field, fontSize: "13px" }} />
                                <button className="btn hv" onClick={f?.attach} style={{ height: "32px", padding: "0 12px", borderRadius: "6px", background: $v.c?.btn, color: $v.c?.link, fontSize: "12.5px", whiteSpace: "nowrap" }}>
                                  {"Из системы"}
                                </button>
                                </>
                              ) : null}
                            </div>
                          ) : null}
                          {f?.isPick ? (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                              {__a(f?.opts).map((o: any, $i2: number) => (
                                <Fragment key={$i2}>
                                  <button className="btn" onClick={o?.pick} style={{ height: "28px", padding: "0 11px", borderRadius: "14px", background: o?.bg, color: o?.fg, fontSize: "12.5px", fontWeight: o?.fw, boxShadow: o?.ring, whiteSpace: "nowrap" }}>
                                    {__h(o?.t)}
                                  </button>
                                </Fragment>
                              ))}
                            </div>
                          ) : null}
                          {f?.isChecks ? (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                              {__a(f?.opts).map((o: any, $i2: number) => (
                                <Fragment key={$i2}>
                                  <button className="btn" onClick={o?.pick} style={{ height: "28px", padding: "0 11px", borderRadius: "6px", background: o?.bg, color: o?.fg, fontSize: "12.5px", fontWeight: o?.fw, boxShadow: o?.ring, whiteSpace: "nowrap" }}>
                                    {__h(o?.mark)}{" "}{__h(o?.t)}
                                  </button>
                                </Fragment>
                              ))}
                            </div>
                          ) : null}
                          {f?.isYn ? (
                            <button className="btn" onClick={f?.on} style={{ display: "flex", alignItems: "center", gap: "10px", height: "32px" }}>
                              <span style={{ position: "relative", width: "38px", height: "20px", flexShrink: "0", borderRadius: "10px", background: f?.swBg }}>
                                <span style={{ position: "absolute", top: "3px", left: f?.swX, width: "14px", height: "14px", borderRadius: "7px", background: f?.swKn }}></span>
                              </span>
                              <span style={{ fontSize: "13px" }}>
                                {__h(f?.ynT)}
                              </span>
                            </button>
                          ) : null}
                          {f?.isLong ? (
                            <textarea rows={f?.rows} onChange={f?.on} style={{ resize: "none", boxSizing: "border-box", padding: "8px 10px", borderRadius: "6px", border: "0", borderBottom: `1px solid ${__s($v.c?.stroke2)}`, background: $v.c?.field, fontSize: "13px", lineHeight: "19px" }} value={__s(f?.v)} />
                          ) : null}
                          {f?.isTable ? (
                            <div style={{ borderRadius: "6px", background: $v.c?.field, fontSize: "12.5px", lineHeight: "17px", overflow: "hidden" }}>
                              {" "}
                              <div style={{ display: "grid", gridTemplateColumns: f?.gt, color: $v.c?.text2, fontSize: "11px", borderBottom: `1px solid ${__s($v.c?.stroke)}` }}>
                                {__a(f?.cols).map((cl: any, $i2: number) => (
                                  <Fragment key={$i2}>
                                    <span style={{ padding: "5px 8px" }}>
                                      {__h(cl?.t)}
                                    </span>
                                  </Fragment>
                                ))}
                                <span></span>
                              </div>
                              {" "}
                              {f?.empty ? (
                                <div style={{ padding: "8px", color: $v.c?.text2, fontSize: "12px" }}>
                                  {"Строк нет. Так тоже можно."}
                                </div>
                              ) : null}
                              {" "}
                              {__a(f?.trs).map((tr: any, $i2: number) => (
                                <Fragment key={$i2}>
                                  <div style={{ display: "grid", gridTemplateColumns: f?.gt, borderTop: `1px solid ${__s($v.c?.stroke)}`, alignItems: "center" }}>
                                    {__a(tr?.cells).map((ce: any, $i3: number) => (
                                      <Fragment key={$i3}>
                                        <input value={__s(ce?.t)} onChange={ce?.on} style={{ boxSizing: "border-box", minWidth: "0", height: "28px", padding: "0 8px", border: "0", background: "transparent", fontSize: "12.5px" }} />
                                      </Fragment>
                                    ))}
                                    {f?.ed ? (
                                      <button className="btn hv" aria-label="Удалить строку" onClick={tr?.rm} style={{ width: "28px", height: "28px", color: $v.c?.text2, fontSize: "15px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        {"×"}
                                      </button>
                                    ) : null}
                                    {f?.fixed ? (
                                      <span></span>
                                    ) : null}
                                  </div>
                                </Fragment>
                              ))}
                              {" "}
                              {f?.ed ? (
                                <button className="btn hv" onClick={f?.addRow} style={{ width: "100%", height: "28px", padding: "0 8px", color: $v.c?.link, fontSize: "12px", borderTop: `1px solid ${__s($v.c?.stroke)}` }}>
                                  {"+ Добавить строку"}
                                </button>
                              ) : null}
                              {" "}
                            </div>
                          ) : null}
                          {f?.isDiag ? (
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              {f?.hasShot ? (
                                <>
                                <span className="ell" style={{ flex: "1", minWidth: "0", display: "flex", alignItems: "center", height: "32px", padding: "0 10px", borderRadius: "6px", background: $v.c?.field, fontSize: "13px" }}>
                                  {__h(f?.shotName)}
                                </span>
                                <label className="hv" style={{ height: "32px", padding: "0 12px", borderRadius: "6px", background: $v.c?.btn, fontSize: "12.5px", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", cursor: "pointer" }}>
                                  <input type="file" accept="image/*" onChange={f?.onFile} style={{ display: "none" }} />
                                  {"Заменить"}
                                </label>
                                <button className="btn hv" onClick={f?.removeShot} style={{ height: "32px", padding: "0 12px", borderRadius: "6px", background: $v.c?.btn, color: $v.c?.text2, fontSize: "12.5px", whiteSpace: "nowrap" }}>
                                  {"Убрать"}
                                </button>
                                </>
                              ) : null}
                              {f?.noShot ? (
                                <>
                                <span style={{ flex: "1", fontSize: "13px", color: $v.c?.text2 }}>
                                  {"Фото места ДТП, например из игры. Если не нужно, оставьте пустым."}
                                </span>
                                <label className="hv" style={{ height: "32px", padding: "0 12px", borderRadius: "6px", background: $v.c?.btn, fontSize: "12.5px", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", cursor: "pointer" }}>
                                  <input type="file" accept="image/*" onChange={f?.onFile} style={{ display: "none" }} />
                                  {"Прикрепить фото"}
                                </label>
                                </>
                              ) : null}
                            </div>
                          ) : null}
                          {f?.isAdd ? (
                            <button className="btn hv" onClick={f?.add} style={{ alignSelf: "flex-start", height: "32px", padding: "0 14px", borderRadius: "6px", background: $v.c?.btn, fontSize: "12.5px", whiteSpace: "nowrap" }}>
                              {"+ Добавить из системы"}
                            </button>
                          ) : null}
                          {f?.h ? (
                            <span style={{ fontSize: "11px", lineHeight: "15px", color: $v.c?.text2 }}>
                              {__h(f?.h)}
                            </span>
                          ) : null}
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </Fragment>
            ))}
          </div>
          <div style={{ flexShrink: "0", padding: "12px 22px 14px 24px", display: "flex", flexDirection: "column", gap: "10px", borderTop: `1px solid ${__s($v.c?.stroke)}` }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "10px 12px", borderRadius: "8px", background: $v.c?.card }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ fontWeight: "600", fontSize: "13px" }}>
                  {"Маршрут отчёта"}
                </span>
                <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                  {"после отправки отчёт пройдёт по шагам слева направо"}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                {__a($v.nSteps).map((st: any, $i0: number) => (
                  <Fragment key={$i0}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {st?.arrow ? (
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: "#8A8A8A", flexShrink: "0" }}>
                          <path d="M4 10h11M11 6l4 4-4 4"></path>
                        </svg>
                      ) : null}
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "5px 12px 5px 6px", borderRadius: "18px", background: st?.bg }}>
                        <span style={{ width: "22px", height: "22px", flexShrink: "0", borderRadius: "11px", background: st?.nb, color: st?.nf, fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {__h(st?.n)}
                        </span>
                        <span style={{ display: "flex", flexDirection: "column", lineHeight: "15px" }}>
                          <span style={{ fontSize: "13px", fontWeight: "600", color: st?.fg }}>
                            {__h(st?.r)}
                          </span>
                          {st?.c ? (
                            <span style={{ fontSize: "11px", color: $v.c?.text2 }}>
                              {__h(st?.c)}
                            </span>
                          ) : null}
                        </span>
                      </div>
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button className="btn hv" onClick={$v.saveDraft} style={{ height: "34px", padding: "0 16px", borderRadius: "6px", background: $v.c?.btn, whiteSpace: "nowrap", textAlign: "center" }}>
                {"Сохранить черновик"}
              </button>
              <button className="btn acc" onClick={$v.submitNew} style={{ flex: "1", height: "34px", borderRadius: "6px", background: $v.accent, color: $v.onAccent, fontWeight: "600", textAlign: "center" }}>
                {"Отправить на утверждение"}
              </button>
            </div>
          </div>
        </div>
        <div className="scroll" data-paper-scroll="1" style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", alignItems: "center", padding: "50px 0 24px 0", gap: "10px", background: $v.c?.rail }}>
          <span style={{ alignSelf: "flex-start", marginLeft: "40px", fontSize: "12px", color: $v.c?.text2 }}>
            {"Так бланк выглядит на бумаге. Заполняется по мере ввода."}
          </span>
          <div style={{ alignSelf: "stretch", flexShrink: "0", padding: "0 24px" }}><div style={{ zoom: $v.__zoom, margin: "0 auto", position: "relative", width: "560px", flexShrink: "0", boxSizing: "border-box", display: "flex", flexDirection: "column", minHeight: "792px", background: "#FFFFFF", color: "#111111", boxShadow: "0 10px 30px rgba(0,0,0,0.5)", fontFamily: "Tahoma, Arial, 'Segoe UI', sans-serif", padding: "16px 22px 14px 22px" }}>
            {$v.pNew?.lp ? (
              <div style={{ display: "flex", alignItems: "stretch", border: "1.5px solid #111111", marginBottom: "2px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 8px", flex: "1", minWidth: "0" }}>
                  <img src={$v.pNew?.agLogo} alt={$v.pNew?.agTag} width="46" height="46" style={{ display: "block", objectFit: "contain", flexShrink: "0", width: "46px", height: "46px" }} />
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: "0" }}>
                    <span style={{ fontSize: "7.5px", lineHeight: "9px", letterSpacing: "1px", fontWeight: "700" }}>
                      {__h($v.pNew?.agName)}
                    </span>
                    <span style={{ fontSize: "13px", lineHeight: "16px", fontWeight: "700", textTransform: "uppercase" }}>
                      {__h($v.pNew?.title)}
                    </span>
                    <span style={{ fontSize: "8px", lineHeight: "10px", letterSpacing: "1.4px", color: "#555555", textTransform: "uppercase" }}>
                      {__h($v.pNew?.en)}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
            {$v.pNew?.ls ? (
              <>
              <span style={{ textAlign: "center", fontFamily: "'Times New Roman', Georgia, serif", fontSize: "17px", lineHeight: "22px" }}>
                {__h($v.pNew?.agName)}
              </span>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0 10px 0", borderBottom: "1px solid #C8C8C8", fontSize: "8px", lineHeight: "12px" }}>
                <span style={{ width: "140px", display: "flex", flexDirection: "column", paddingLeft: "36px" }}>
                  <span style={{ fontWeight: "700" }}>
                    {__h($v.pNew?.head1)}
                  </span>
                  <span>
                    {__h($v.pNew?.head2)}
                  </span>
                </span>
                <img src={$v.pNew?.agLogo} alt={$v.pNew?.agTag} width="66" height="66" style={{ display: "block", objectFit: "contain", width: "66px", height: "66px" }} />
                <span style={{ width: "140px", textAlign: "right", display: "flex", flexDirection: "column", paddingRight: "36px" }}>
                  <span>
                    {__h($v.pNew?.ag1)}
                  </span>
                  <span>
                    {__h($v.pNew?.ag2)}
                  </span>
                  <span>
                    {__h($v.pNew?.ag3)}
                  </span>
                </span>
              </div>
              </>
            ) : null}
            {$v.pNew?.stamp ? (
              <span style={{ position: "absolute", right: "16px", bottom: "12px", padding: "1px 7px", border: `1.5px solid ${__s($v.pNew?.stampC)}`, borderRadius: "3px", color: $v.pNew?.stampC, fontSize: "8.5px", lineHeight: "12px", fontWeight: "700", letterSpacing: "1.2px", opacity: ".85" }}>
                {__h($v.pNew?.stampT)}
              </span>
            ) : null}
            {$v.pNew?.ls ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", paddingTop: "14px" }}>
                <span style={{ fontSize: "15px", lineHeight: "19px", fontWeight: "700", letterSpacing: ".6px", textTransform: "uppercase", textAlign: "center" }}>
                  {__h($v.pNew?.title)}
                </span>
                <span style={{ fontSize: "8px", lineHeight: "10px", letterSpacing: "1.4px", color: "#555555" }}>
                  {__h($v.pNew?.en)}
                </span>
              </div>
            ) : null}
            <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "5px", paddingTop: "8px", fontSize: "8.5px", lineHeight: "12px" }}>
              {__a($v.pNew?.blocks).map((b: any, $i0: number) => (
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
                  {__h($v.pNew?.fr)}
                </span>
                <span>
                  {"Los Santos County Sheriff's Department"}
                </span>
                <span>
                  {"2026"}
                </span>
              </div>
            </div>
          </div></div>
          <ReportsZoomBar $v={$v} />
        </div>
      </div>
    </>
  )
}
