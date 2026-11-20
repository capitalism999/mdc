/* Generated 1:1 from the design reference (project/Reports.dc.html) — markup, styles and copy are a literal port. */
import { Fragment } from 'react'
import { __a, __h, __s, type ReportsVals } from './reportsRuntime'

export function ReportsBuilder({ $v }: { $v: ReportsVals }) {
  if (!$v.isBuilder) return null
  return (
    <>
      <div style={{ flex: "1", minHeight: "0", display: "flex", marginTop: "-40px" }}>
        <div style={{ width: "590px", flexShrink: "0", display: "flex", flexDirection: "column", borderRight: `1px solid ${__s($v.c?.stroke)}` }}>
          <div className="scroll" style={{ flex: "1", minHeight: "0", padding: "18px 22px 16px 24px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button className="btn hv" onClick={$v.goTypes} aria-label="Назад" style={{ width: "32px", height: "32px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12.5 4.5L7 10l5.5 5.5"></path>
                </svg>
              </button>
              <span style={{ flex: "1", fontSize: "22px", lineHeight: "30px", fontWeight: "600" }}>
                {__h($v.bd?.head)}
              </span>
              <span className="chip" style={{ background: $v.bd?.tagBg, color: $v.bd?.tagFg }}>
                {__h($v.bd?.tag)}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "14px 16px", borderRadius: "10px", background: $v.c?.card }}>
              <span style={{ fontWeight: "600" }}>
                {"Название и вид"}
              </span>
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr) 90px", gap: "10px" }}>
                <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                    {"Название"}
                  </span>
                  <input value={__s($v.bd?.name)} onChange={$v.bd?.onName} style={{ boxSizing: "border-box", height: "32px", padding: "0 10px", borderRadius: "6px", border: "0", borderBottom: `1px solid ${__s($v.c?.stroke2)}`, background: $v.c?.field, fontSize: "13px" }} />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                    {"Заголовок на бланке"}
                  </span>
                  <input value={__s($v.bd?.en)} onChange={$v.bd?.onEn} style={{ boxSizing: "border-box", height: "32px", padding: "0 10px", borderRadius: "6px", border: "0", borderBottom: `1px solid ${__s($v.c?.stroke2)}`, background: $v.c?.field, fontSize: "13px" }} />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                    {"Номер"}
                  </span>
                  <input value={__s($v.bd?.pre)} onChange={$v.bd?.onPre} style={{ boxSizing: "border-box", height: "32px", padding: "0 10px", borderRadius: "6px", border: "0", borderBottom: `1px solid ${__s($v.c?.stroke2)}`, background: $v.c?.field, fontSize: "13px" }} />
                </label>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                  {"Цвет"}
                </span>
                {__a($v.bd?.tones).map((o: any, $i0: number) => (
                  <Fragment key={$i0}>
                    <button className="btn" aria-label={o?.name} onClick={o?.pick} style={{ width: "24px", height: "24px", borderRadius: "12px", background: o?.fg, boxShadow: o?.ring }}></button>
                  </Fragment>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "14px 16px", borderRadius: "10px", background: $v.c?.card }}>
              <span style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                <span style={{ fontWeight: "600" }}>
                  {"Поля бланка"}
                </span>
                <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                  {"порядок как на бумаге"}
                </span>
              </span>
              {__a($v.bd?.secs).map((sec: any, $i0: number) => (
                <Fragment key={$i0}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "8px 10px 10px 10px", borderRadius: "8px", background: $v.c?.field }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <input value={__s(sec?.t)} onChange={sec?.onT} style={{ flex: "1", minWidth: "0", height: "28px", padding: "0 4px", border: "0", background: "transparent", fontWeight: "600", fontSize: "13px" }} />
                      <button className="btn hv" aria-label="Печатать секцию на бланке" onClick={sec?.toggleNp} style={{ height: "24px", padding: "0 8px", borderRadius: "5px", background: sec?.npBg, color: sec?.npFg, fontSize: "11px", whiteSpace: "nowrap" }}>
                        {__h(sec?.npT)}
                      </button>
                      <button className="btn hv" aria-label="Убрать секцию" onClick={sec?.rm} style={{ width: "26px", height: "26px", borderRadius: "5px", display: "flex", alignItems: "center", justifyContent: "center", color: $v.c?.text2 }}>
                        <svg width="11" height="11" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                          <path d="M4 4l12 12M16 4L4 16"></path>
                        </svg>
                      </button>
                    </div>
                    {__a(sec?.fs).map((f: any, $i1: number) => (
                      <Fragment key={$i1}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", height: "34px", padding: "0 4px 0 2px", borderRadius: "6px", background: $v.c?.card }}>
                          <span style={{ display: "flex", flexDirection: "column" }}>
                            <button className="btn hv" aria-label="Выше" onClick={f?.up} style={{ width: "22px", height: "14px", display: "flex", alignItems: "center", justifyContent: "center", color: $v.c?.text2 }}>
                              <svg width="9" height="9" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M4 13l6-6 6 6"></path>
                              </svg>
                            </button>
                            <button className="btn hv" aria-label="Ниже" onClick={f?.dn} style={{ width: "22px", height: "14px", display: "flex", alignItems: "center", justifyContent: "center", color: $v.c?.text2 }}>
                              <svg width="9" height="9" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M4 7l6 6 6-6"></path>
                              </svg>
                            </button>
                          </span>
                          <input value={__s(f?.l)} onChange={f?.onL} style={{ flex: "1", minWidth: "0", height: "28px", padding: "0 6px", border: "0", background: "transparent", fontSize: "13px" }} />
                          <span className="chip" style={{ height: "20px", fontSize: "11px", background: $v.c?.btn, color: $v.c?.text2, fontWeight: "500" }}>
                            {__h(f?.kindT)}
                          </span>
                          <button className="btn hv" onClick={f?.wide} style={{ width: "40px", height: "22px", borderRadius: "5px", fontSize: "11px", color: $v.c?.text2, textAlign: "center" }}>
                            {__h(f?.wT)}
                          </button>
                          <button className="btn hv" aria-label="Убрать поле" onClick={f?.rm} style={{ width: "24px", height: "24px", borderRadius: "5px", display: "flex", alignItems: "center", justifyContent: "center", color: $v.c?.text2 }}>
                            <svg width="10" height="10" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                              <path d="M4 4l12 12M16 4L4 16"></path>
                            </svg>
                          </button>
                        </div>
                      </Fragment>
                    ))}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", paddingTop: "4px" }}>
                      <span style={{ fontSize: "12px", color: $v.c?.text2, alignSelf: "center", marginRight: "2px" }}>
                        {"Добавить"}
                      </span>
                      {__a(sec?.palette).map((p: any, $i1: number) => (
                        <Fragment key={$i1}>
                          <button className="btn hv" onClick={p?.add} style={{ height: "24px", padding: "0 9px", borderRadius: "12px", background: $v.c?.btn, fontSize: "12px", whiteSpace: "nowrap" }}>
                            {__h(p?.t)}
                          </button>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                </Fragment>
              ))}
              <button className="btn hv" onClick={$v.bd?.addSec} style={{ height: "30px", borderRadius: "6px", border: `1px dashed ${__s($v.c?.stroke2)}`, color: $v.c?.link, fontSize: "13px", textAlign: "center" }}>
                {"+ Секция"}
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "14px 16px", borderRadius: "10px", background: $v.c?.card }}>
              <span style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                <span style={{ fontWeight: "600" }}>
                  {"Кто подписывает"}
                </span>
                <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                  {"по порядку, подписи встанут внизу бланка"}
                </span>
              </span>
              {__a($v.bd?.route).map((s: any, $i0: number) => (
                <Fragment key={$i0}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", height: "34px", padding: "0 6px 0 12px", borderRadius: "6px", background: $v.c?.field }}>
                    <span className="num" style={{ width: "16px", fontSize: "12px", color: $v.c?.text2 }}>
                      {__h(s?.n)}
                    </span>
                    <span style={{ width: "150px", flexShrink: "0", fontWeight: "600" }}>
                      {__h(s?.r)}
                    </span>
                    <input value={__s(s?.cond)} onChange={s?.onC} placeholder="всегда" style={{ flex: "1", minWidth: "0", height: "26px", padding: "0 6px", border: "0", background: "transparent", fontSize: "13px", color: $v.c?.text2 }} />
                    <button className="btn hv" aria-label="Убрать шаг" onClick={s?.rm} style={{ width: "24px", height: "24px", borderRadius: "5px", display: "flex", alignItems: "center", justifyContent: "center", color: $v.c?.text2 }}>
                      <svg width="10" height="10" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                        <path d="M4 4l12 12M16 4L4 16"></path>
                      </svg>
                    </button>
                  </div>
                </Fragment>
              ))}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                <span style={{ fontSize: "12px", color: $v.c?.text2, alignSelf: "center", marginRight: "2px" }}>
                  {"Добавить шаг"}
                </span>
                {__a($v.bd?.roles).map((p: any, $i0: number) => (
                  <Fragment key={$i0}>
                    <button className="btn hv" onClick={p?.add} style={{ height: "24px", padding: "0 9px", borderRadius: "12px", background: $v.c?.btn, fontSize: "12px", whiteSpace: "nowrap" }}>
                      {__h(p?.t)}
                    </button>
                  </Fragment>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "14px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontWeight: "600" }}>
                  {"Кто может создавать"}
                </span>
                <div style={{ display: "flex", gap: "2px", padding: "3px", borderRadius: "8px", background: $v.c?.card }}>
                  {__a($v.bd?.who).map((o: any, $i0: number) => (
                    <Fragment key={$i0}>
                      <button className="btn" onClick={o?.pick} style={{ flex: "1", height: "30px", borderRadius: "6px", background: o?.bg, color: o?.fg, fontSize: "13px", fontWeight: o?.fw, textAlign: "center", whiteSpace: "nowrap" }}>
                        {__h(o?.t)}
                      </button>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontWeight: "600" }}>
                  {"Кто видит по умолчанию"}
                </span>
                <div style={{ display: "flex", gap: "2px", padding: "3px", borderRadius: "8px", background: $v.c?.card }}>
                  {__a($v.bd?.vis).map((o: any, $i0: number) => (
                    <Fragment key={$i0}>
                      <button className="btn" onClick={o?.pick} style={{ flex: "1", height: "30px", borderRadius: "6px", background: o?.bg, color: o?.fg, fontSize: "13px", fontWeight: o?.fw, textAlign: "center", whiteSpace: "nowrap" }}>
                        {__h(o?.t)}
                      </button>
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div style={{ flexShrink: "0", padding: "12px 22px 14px 24px", display: "flex", alignItems: "center", gap: "8px", borderTop: `1px solid ${__s($v.c?.stroke)}` }}>
            <span style={{ flex: "1", fontSize: "12px", lineHeight: "16px", color: $v.c?.text2 }}>
              {__h($v.bd?.foot)}
            </span>
            <button className="btn hv" onClick={$v.goTypes} style={{ height: "34px", padding: "0 16px", borderRadius: "6px", background: $v.c?.btn, whiteSpace: "nowrap", textAlign: "center" }}>
              {"Отмена"}
            </button>
            <button className="btn acc" onClick={$v.bd?.publish} style={{ height: "34px", padding: "0 16px", borderRadius: "6px", background: $v.accent, color: $v.onAccent, fontWeight: "600", whiteSpace: "nowrap", textAlign: "center" }}>
              {__h($v.bd?.pubT)}
            </button>
          </div>
        </div>
        <div className="scroll" style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", alignItems: "center", padding: "50px 0 24px 0", gap: "10px", background: $v.c?.rail }}>
          <span style={{ alignSelf: "flex-start", marginLeft: "40px", fontSize: "12px", color: $v.c?.text2 }}>
            {"Чистый бланк, как его получит офицер. Меняется вместе с полями слева."}
          </span>
          <div style={{ position: "relative", width: "560px", flexShrink: "0", boxSizing: "border-box", display: "flex", flexDirection: "column", minHeight: "792px", background: "#FFFFFF", color: "#111111", boxShadow: "0 10px 30px rgba(0,0,0,0.5)", fontFamily: "Tahoma, Arial, 'Segoe UI', sans-serif", padding: "16px 22px 14px 22px" }}>
            {$v.pBld?.lp ? (
              <div style={{ display: "flex", alignItems: "stretch", border: "1.5px solid #111111", marginBottom: "2px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 8px", flex: "1", minWidth: "0" }}>
                  <img src={$v.pBld?.agLogo} alt={$v.pBld?.agTag} width="46" height="46" style={{ display: "block", objectFit: "contain", flexShrink: "0", width: "46px", height: "46px" }} />
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: "0" }}>
                    <span style={{ fontSize: "7.5px", lineHeight: "9px", letterSpacing: "1px", fontWeight: "700" }}>
                      {__h($v.pBld?.agName)}
                    </span>
                    <span style={{ fontSize: "13px", lineHeight: "16px", fontWeight: "700", textTransform: "uppercase" }}>
                      {__h($v.pBld?.title)}
                    </span>
                    <span style={{ fontSize: "8px", lineHeight: "10px", letterSpacing: "1.4px", color: "#555555", textTransform: "uppercase" }}>
                      {__h($v.pBld?.en)}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
            {$v.pBld?.ls ? (
              <>
              <span style={{ textAlign: "center", fontFamily: "'Times New Roman', Georgia, serif", fontSize: "17px", lineHeight: "22px" }}>
                {__h($v.pBld?.agName)}
              </span>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 0 10px 0", borderBottom: "1px solid #C8C8C8", fontSize: "8px", lineHeight: "12px" }}>
                <span style={{ width: "140px", display: "flex", flexDirection: "column", paddingLeft: "36px" }}>
                  <span style={{ fontWeight: "700" }}>
                    {__h($v.pBld?.head1)}
                  </span>
                  <span>
                    {__h($v.pBld?.head2)}
                  </span>
                </span>
                <img src={$v.pBld?.agLogo} alt={$v.pBld?.agTag} width="66" height="66" style={{ display: "block", objectFit: "contain", width: "66px", height: "66px" }} />
                <span style={{ width: "140px", textAlign: "right", display: "flex", flexDirection: "column", paddingRight: "36px" }}>
                  <span>
                    {__h($v.pBld?.ag1)}
                  </span>
                  <span>
                    {__h($v.pBld?.ag2)}
                  </span>
                  <span>
                    {__h($v.pBld?.ag3)}
                  </span>
                </span>
              </div>
              </>
            ) : null}
            {$v.pBld?.stamp ? (
              <span style={{ position: "absolute", right: "16px", bottom: "12px", padding: "1px 7px", border: `1.5px solid ${__s($v.pBld?.stampC)}`, borderRadius: "3px", color: $v.pBld?.stampC, fontSize: "8.5px", lineHeight: "12px", fontWeight: "700", letterSpacing: "1.2px", opacity: ".85" }}>
                {__h($v.pBld?.stampT)}
              </span>
            ) : null}
            {$v.pBld?.ls ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3px", paddingTop: "14px" }}>
                <span style={{ fontSize: "15px", lineHeight: "19px", fontWeight: "700", letterSpacing: ".6px", textTransform: "uppercase", textAlign: "center" }}>
                  {__h($v.pBld?.title)}
                </span>
                <span style={{ fontSize: "8px", lineHeight: "10px", letterSpacing: "1.4px", color: "#555555" }}>
                  {__h($v.pBld?.en)}
                </span>
              </div>
            ) : null}
            <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "5px", paddingTop: "8px", fontSize: "8.5px", lineHeight: "12px" }}>
              {__a($v.pBld?.blocks).map((b: any, $i0: number) => (
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
                  {__h($v.pBld?.fr)}
                </span>
                <span>
                  {"Los Santos County Sheriff's Department"}
                </span>
                <span>
                  {"2026"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
