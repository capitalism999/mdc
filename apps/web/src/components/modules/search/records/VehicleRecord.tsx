/* Generated 1:1 from the design reference (project/Search.dc.html) — markup, styles and copy are a literal port. */
import { Fragment } from 'react'
import { personPhoto } from '../../shared/personPhotos'
import { RecordMoreMenu } from './RecordMoreMenu'
import { __a, __h, __s, type SearchVals } from '../searchRuntime'

export function VehicleRecord({ $v }: { $v: SearchVals }) {
  if (!$v.rec?.isRichV) return null
  return (
    <>
      {" "}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "1180px" }}>
        <div style={{ display: "flex", gap: "20px", alignItems: "stretch" }}>
          <div style={{ position: "relative", width: "248px", minHeight: "150px", flexShrink: "0", borderRadius: "12px", overflow: "hidden", background: `linear-gradient(180deg, ${__s($v.c?.photoSky)} 0%, ${__s($v.c?.photoSky)} 62%, ${__s($v.c?.photoGround)} 62%, ${__s($v.c?.photoGround)} 100%)` }}>
            {" "}
            <img src={$v.rec?.carImg} alt="Фото" width="228" height="93" style={{ position: "absolute", left: "10px", top: "calc(62% - 74px)", objectFit: "contain", display: "block", width: "228px", height: "93px" }} />
            {" "}
          </div>
          <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "6px", paddingBottom: "2px" }}>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {__a($v.v?.status).map((st: any, $i0: number) => (
                <Fragment key={$i0}>
                  <span style={{ padding: "2px 10px", borderRadius: "10px", fontSize: "12px", fontWeight: "600", background: st?.bg, color: st?.fg }}>
                    {__a(st?.textP).map((qp: any, $i1: number) => (
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
                  </span>
                </Fragment>
              ))}
            </div>
            <span className="lp" role="img" aria-label={`Номер ${__s($v.rec?.plate)}`}>
              <span>
                {__h($v.rec?.plate)}
              </span>
            </span>
            <h1 style={{ margin: "0", fontSize: "30px", lineHeight: "38px", fontWeight: "700", letterSpacing: "-0.2px" }}>
              {__a($v.rec?.titleP).map((qp: any, $i0: number) => (
                <Fragment key={$i0}>
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
            </h1>
            <div style={{ color: $v.c?.text2 }}>
              {__a($v.rec?.subP).map((qp: any, $i0: number) => (
                <Fragment key={$i0}>
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
            <div style={{ display: "flex", alignItems: "center", gap: "6px", minHeight: "26px", marginTop: "2px" }}>
              {__a($v.tg?.items).map((tgi: any, $i0: number) => (
                <Fragment key={$i0}>
                  <button className="btn hv" onClick={tgi?.open} title={tgi?.title} style={{ height: "24px", padding: "0 10px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: "600", whiteSpace: "nowrap", background: tgi?.bg, color: tgi?.fg }}>
                    {tgi?.lock ? (
                      <svg width="11" height="11" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="4" y="9" width="12" height="8" rx="2"></rect>
                        <path d="M7 9V6a3 3 0 016 0v3"></path>
                      </svg>
                    ) : null}
                    {__h(tgi?.name)}
                  </button>
                </Fragment>
              ))}
              <button className="btn lnk" onClick={$v.tg?.add} style={{ fontSize: "12px", color: $v.c?.link }}>
                {__h($v.tg?.addLabel)}
              </button>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <a href="#" onClick={$v.__go("BOLOVeh")} className="hv" style={{ height: "34px", padding: "0 14px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", background: $v.c?.btn, textDecoration: "none", color: "inherit" }}>
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
              <path d="M10 3l8 14H2z"></path>
              <path d="M10 8.5v3.5M10 14.5v.2"></path>
            </svg>
            {__h($v.v?.wantedAction)}
          </a>
          <button className="btn hv" onClick={$v.dl?.vfine} style={{ height: "34px", padding: "0 14px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", background: $v.c?.btn }}>
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
              <rect x="3" y="4" width="14" height="12" rx="2"></rect>
              <path d="M3 8h14M7 12h3"></path>
            </svg>
            {"Выписать штраф"}
          </button>
          <a href="#" onClick={$v.__toCase} className="hv" style={{ height: "34px", padding: "0 14px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", textDecoration: "none", background: $v.c?.btn }}>
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
              <rect x="2.5" y="6" width="15" height="10.5" rx="2"></rect>
              <path d="M7 6V4h6v2M2.5 10.5h15"></path>
            </svg>
            {"Добавить в дело"}
          </a>
          <button className="btn hv" onClick={$v.dl?.share} style={{ height: "34px", padding: "0 14px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", background: $v.c?.btn }}>
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
              <path d="M8.5 11.5a3 3 0 004.2 0l2.6-2.6a3 3 0 00-4.2-4.2l-1 1"></path>
              <path d="M11.5 8.5a3 3 0 00-4.2 0l-2.6 2.6a3 3 0 004.2 4.2l1-1"></path>
            </svg>
            {"Поделиться"}
          </button>
          <RecordMoreMenu $v={$v} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.75fr) minmax(0, 1fr)", gap: "20px", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", minWidth: "0" }}>
            {$v.v?.hasWanted ? (
              <div>
                {" "}
                <div style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2, margin: "0 0 8px 4px" }}>
                  {__h($v.v?.wantedTitle)}
                </div>
                {" "}
                <div style={{ display: "flex", gap: "14px", padding: "14px 16px", borderRadius: "12px", background: $v.v?.wantedBg }}>
                  <span style={{ width: "32px", height: "32px", flexShrink: "0", borderRadius: "8px", background: $v.v?.wantedIcon, color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                      <path d="M10 3l8 14H2z"></path>
                      <path d="M10 8.5v3.5M10 14.5v.2"></path>
                    </svg>
                  </span>
                  <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "2px", lineHeight: "19px" }}>
                    <span style={{ fontSize: "14px", fontWeight: "600" }}>
                      {__h($v.v?.wantedText)}
                    </span>
                    <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                      {"Подал "}
                      <button onClick={$v.v?.wantedByGo} className="btn lnk" style={{ font: "inherit", color: $v.c?.link }}>
                        {__h($v.v?.wantedBy)}
                      </button>
                      {" · "}
                      {$v.v?.wantedDeptLink ? (
                        <button onClick={$v.v?.wantedDeptGo} className="btn lnk" style={{ font: "inherit", color: $v.c?.link }}>
                          {__h($v.v?.wantedDept)}
                        </button>
                      ) : (
                        <span>{__h($v.v?.wantedDept)}</span>
                      )}
                      {" · "}{__h($v.v?.wantedDate)}
                    </span>
                  </span>
                  {$v.bolo?.has ? (
                    <span style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: "0" }}>
                      {$v.bolo?.full ? (
                        <>
                        <a href="#" onClick={$v.__go("BOLO")} className="hv" style={{ flexShrink: "0", height: "32px", padding: "0 12px", borderRadius: "6px", display: "flex", alignItems: "center", background: $v.c?.btn, color: $v.c?.text, fontSize: "13px", textDecoration: "none", whiteSpace: "nowrap" }}>
                          {"Открыть "}{__h($v.bolo?.no)}
                        </a>
                        <a href="#" onClick={$v.__go("BOLOSeen")} className="hv" style={{ flexShrink: "0", height: "32px", padding: "0 12px", borderRadius: "6px", display: "flex", alignItems: "center", background: "#FFFFFF", color: "#1B1B1B", fontSize: "13px", fontWeight: "600", textDecoration: "none", whiteSpace: "nowrap" }}>
                          {"Замечен"}
                        </a>
                        </>
                      ) : null}
                      {$v.bolo?.restricted ? (
                        <a href="#" onClick={$v.__go("MailBolo")} className="hv" style={{ flexShrink: "0", height: "32px", padding: "0 12px", borderRadius: "6px", display: "flex", alignItems: "center", background: $v.c?.btn, color: $v.c?.text, fontSize: "13px", textDecoration: "none", whiteSpace: "nowrap" }}>
                          {"Написать "}{__h($v.bolo?.ctShort)}
                        </a>
                      ) : null}
                    </span>
                  ) : null}
                </div>
                {" "}
              </div>
            ) : null}
            <div>
              {" "}
              <div style={{ display: "flex", alignItems: "center", margin: "0 0 8px 4px" }}>
                <span style={{ flex: "1", fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                  {"Данные DMV"}
                </span>
                <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                  {"Регистрационный талон "}{__h($v.v?.talon)}
                </span>
              </div>
              {" "}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", borderRadius: "12px", background: $v.c?.card, overflow: "hidden" }}>
                {__a($v.v?.dmv).map((dm: any, $i0: number) => (
                  <Fragment key={$i0}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px", padding: "12px 16px", borderRight: `1px solid ${__s(dm?.sep)}` }}>
                      <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                        {__a(dm?.kP).map((qp: any, $i1: number) => (
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
                      </span>
                      <span style={{ fontWeight: "600", fontSize: "13px" }}>
                        {__a(dm?.vP).map((qp: any, $i1: number) => (
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
                      </span>
                    </div>
                  </Fragment>
                ))}
              </div>
              {" "}
            </div>
            <div>
              {" "}
              <div style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2, margin: "0 0 8px 4px" }}>
                {"История владельцев · "}{__h($v.v?.ownersCount)}
              </div>
              {" "}
              <div style={{ borderRadius: "12px", background: $v.c?.card, overflow: "hidden" }}>
                {" "}
                {__a($v.v?.owners).map((ow: any, $i0: number) => (
                  <Fragment key={$i0}>
                    {" "}
                    <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "0 16px" }}>
                      <span style={{ width: "22px", flexShrink: "0", fontSize: "12px", color: $v.c?.text2 }}>
                        {__h(ow?.n)}
                      </span>
                      <span style={{ flex: "1", minWidth: "0", display: "flex", alignItems: "center", gap: "12px", padding: "11px 0", borderBottom: `1px solid ${__s(ow?.sep)}` }}>
                        <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", lineHeight: "19px" }}>
                          <span>
                            {ow?.isLink ? (
                              <button onClick={ow?.go} className="btn lnk" style={{ font: "inherit", fontWeight: "600", color: $v.c?.link }}>
                                {__h(ow?.name)}
                              </button>
                            ) : null}
                            {ow?.plain ? (
                              <span style={{ fontWeight: "600" }}>
                                {__h(ow?.name)}
                              </span>
                            ) : null}
                          </span>
                          <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                            {__h(ow?.basis)}
                          </span>
                        </span>
                        <span style={{ fontSize: "12px", color: $v.c?.text2, flexShrink: "0" }}>
                          {__h(ow?.from)}{" — "}
                          <span style={{ color: ow?.toColor }}>
                            {__h(ow?.to)}
                          </span>
                        </span>
                      </span>
                    </div>
                    {" "}
                  </Fragment>
                ))}
                {" "}
              </div>
              {" "}
            </div>
            <div>
              {" "}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "0 0 8px 4px" }}>
                <span style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                  {"Штрафы по машине · "}{__h($v.v?.fineCount)}
                </span>
                <span style={{ flex: "1" }}></span>
                <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                  {"Не оплачено: "}
                  <span style={{ color: $v.c?.text, fontWeight: "600" }}>
                    {__h($v.v?.debt)}
                  </span>
                </span>
              </div>
              {" "}
              <div style={{ borderRadius: "12px", background: $v.c?.card, overflow: "hidden" }}>
                {" "}
                {__a($v.v?.fines).map((fn: any, $i0: number) => (
                  <Fragment key={$i0}>
                    {" "}
                    <div style={{ display: "flex", gap: "14px", padding: "0 16px" }}>
                      <span style={{ width: "64px", flexShrink: "0", paddingTop: "13px", fontSize: "12px", lineHeight: "17px" }}>
                        {__h(fn?.date)}
                        {fn?.time ? <span style={{ display: "block", color: $v.c?.text2 }}>{__h(fn?.time)}</span> : null}
                      </span>
                      <span style={{ flex: "1", minWidth: "0", display: "flex", alignItems: "center", gap: "12px", padding: "12px 0", borderBottom: `1px solid ${__s(fn?.sep)}` }}>
                        <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "2px", lineHeight: "19px" }}>
                          <span style={{ fontSize: "14px" }}>
                            <button onClick={fn?.lawGo} className="btn lnk" style={{ font: "inherit", fontWeight: "600", color: $v.c?.link }}>
                              {__h(fn?.code)}
                            </button>
                            {" "}{__h(fn?.name)}
                          </span>
                          <span className="ell" style={{ fontSize: "12px", color: $v.c?.text2 }}>
                            {fn?.whoLink ? (
                              <button onClick={fn?.whoGo} className="btn lnk" style={{ font: "inherit", color: $v.c?.link }}>
                                {__h(fn?.who)}
                              </button>
                            ) : null}
                            {fn?.whoPlain ? (
                              <>
                              {__h(fn?.who)}
                              </>
                            ) : null}
                            {" · квитанция "}{__h(fn?.receipt)}
                          </span>
                        </span>
                        <span style={{ fontWeight: "600", flexShrink: "0" }}>
                          {__h(fn?.sum)}
                        </span>
                        <span style={{ width: "96px", flexShrink: "0", display: "flex", justifyContent: "flex-end" }}>
                          <span style={{ padding: "2px 10px", borderRadius: "10px", fontSize: "12px", fontWeight: "600", background: fn?.chipBg, color: fn?.chipFg }}>
                            {__h(fn?.status)}
                          </span>
                        </span>
                      </span>
                    </div>
                    {" "}
                  </Fragment>
                ))}
                {" "}
                {$v.v?.noFines ? (
                  <div style={{ padding: "14px 16px", fontSize: "13px", color: $v.c?.text2 }}>
                    {"Штрафов по этой машине нет."}
                  </div>
                ) : null}
                {" "}
              </div>
              {" "}
            </div>
            <div>
              {" "}
              <div style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2, margin: "0 0 8px 4px" }}>
                {"Комментарии · "}{__h($v.v?.comCount)}
              </div>
              {" "}
              <div style={{ borderRadius: "12px", background: $v.c?.card, overflow: "hidden" }}>
                {" "}
                {__a($v.v?.comments).map((cm: any, $i0: number) => (
                  <Fragment key={$i0}>
                    {" "}
                    <div style={{ display: "flex", gap: "10px", padding: "12px 16px", borderBottom: `1px solid ${__s($v.c?.stroke)}` }}>
                      <span style={{ width: "26px", height: "26px", flexShrink: "0", borderRadius: "50%", background: cm?.color, color: "#FFFFFF", fontSize: "10px", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {__h(cm?.init)}
                      </span>
                      <span style={{ display: "flex", flexDirection: "column", lineHeight: "18px", minWidth: "0" }}>
                        <span style={{ fontSize: "12px" }}>
                          <button onClick={cm?.go} className="btn lnk" style={{ font: "inherit", fontWeight: "600", color: $v.c?.link }}>
                            {__h(cm?.who)}
                          </button>
                          {" "}
                          <span style={{ color: $v.c?.text2 }}>
                            {__h(cm?.when)}
                          </span>
                        </span>
                        <span style={{ fontSize: "13px", overflowWrap: "anywhere" }}>
                          {__a(cm?.textP).map((qp: any, $i1: number) => (
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
                        </span>
                      </span>
                    </div>
                    {" "}
                  </Fragment>
                ))}
                {" "}
                <label style={{ display: "flex", alignItems: "center", gap: "8px", margin: "10px 12px 12px 12px", height: "36px", boxSizing: "border-box", padding: "0 4px 0 10px", borderRadius: "8px", background: $v.c?.btn, color: $v.c?.text2 }}>
                  <input type="text" value={$v.__cmDraft} onChange={$v.__cmSet} onKeyDown={$v.__cmKey} placeholder="Комментарий по машине…" aria-label="Комментарий" style={{ flex: "1", minWidth: "0", border: "0", background: "transparent", fontSize: "13px", color: $v.c?.text }} />
                  <button className="btn acc" onClick={$v.__cmAdd} aria-label="Добавить комментарий" style={{ width: "28px", height: "28px", borderRadius: "6px", background: $v.accent, color: $v.onAccent, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M10 16V4M5 9l5-5 5 5"></path>
                    </svg>
                  </button>
                </label>
                {" "}
              </div>
              {" "}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", minWidth: "0" }}>
            <div>
              {" "}
              <div style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2, margin: "0 0 8px 4px" }}>
                {"Сведения"}
              </div>
              {" "}
              <div style={{ borderRadius: "12px", background: $v.c?.card, padding: "0 14px" }}>
                {" "}
                {__a($v.v?.info).map((f: any, $i0: number) => (
                  <Fragment key={$i0}>
                    {" "}
                    <div style={{ display: "flex", gap: "12px", padding: "10px 0", borderBottom: `1px solid ${__s(f?.sep)}`, fontSize: "13px" }}>
                      <span style={{ width: "110px", flexShrink: "0", color: $v.c?.text2 }}>
                        {__a(f?.kP).map((qp: any, $i1: number) => (
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
                      </span>
                      <span style={{ flex: "1", minWidth: "0", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "6px", textAlign: "right" }}>
                        {f?.hasSw ? (
                          <span style={{ width: "10px", height: "10px", borderRadius: "3px", background: f?.sw, boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.25)" }}></span>
                        ) : null}
                        {f?.isLink ? (
                          <button onClick={f?.go} className="btn lnk" style={{ font: "inherit", color: $v.c?.link }}>
                            {__a(f?.vP).map((qp: any, $i1: number) => (
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
                          </button>
                        ) : null}
                        {f?.plain ? (
                          <span>
                            {__a(f?.vP).map((qp: any, $i1: number) => (
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
                          </span>
                        ) : null}
                      </span>
                    </div>
                    {" "}
                  </Fragment>
                ))}
                {" "}
              </div>
              {" "}
            </div>
            <div>
              {" "}
              <div style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2, margin: "0 0 8px 4px" }}>
                {"Владелец"}
              </div>
              {" "}
              <div style={{ borderRadius: "12px", background: $v.c?.card, overflow: "hidden" }}>
                {" "}
                <button onClick={$v.v?.ownerGo} className="btn hv" style={{ width: "100%", boxSizing: "border-box", display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px" }}>
                  <span style={{ position: "relative", width: "48px", height: "60px", flexShrink: "0", borderRadius: "8px", overflow: "hidden", background: $v.c?.mug }}>
                    <img src={personPhoto($v.v?.ownerId)} alt="Фото" style={{ position: "absolute", left: "0", top: "0", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 12%", display: "block" }} />
                  </span>
                  <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", lineHeight: "19px" }}>
                    <span style={{ fontWeight: "600", color: $v.c?.link }}>
                      {__h($v.v?.ownerName)}
                    </span>
                    <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                      {__h($v.v?.ownerSub)}
                    </span>
                  </span>
                  <svg width="11" height="11" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: $v.c?.text2 }}>
                    <path d="M8 5l5 5-5 5"></path>
                  </svg>
                </button>
                {" "}
                {__a($v.v?.ownerFlags).map((of: any, $i0: number) => (
                  <Fragment key={$i0}>
                    {" "}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 14px", borderTop: `1px solid ${__s($v.c?.stroke)}`, fontSize: "13px" }}>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: of?.dot }}></span>
                      <span style={{ flex: "1" }}>
                        {__a(of?.textP).map((qp: any, $i1: number) => (
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
                      </span>
                    </div>
                    {" "}
                  </Fragment>
                ))}
                {" "}
                {$v.v?.hasBiz ? (
                  <>
                  {" "}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 14px", borderTop: `1px solid ${__s($v.c?.stroke)}`, fontSize: "13px" }}>
                    <span style={{ color: $v.c?.text2 }}>
                      {"Используется бизнесом"}
                    </span>
                    <span style={{ flex: "1" }}></span>
                    <button onClick={$v.v?.bizGo} className="btn lnk" style={{ font: "inherit", color: $v.c?.link }}>
                      {__h($v.v?.biz)}
                    </button>
                  </div>
                  {" "}
                  </>
                ) : null}
                {" "}
              </div>
              {" "}
            </div>
            <div>
              {" "}
              <div style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2, margin: "0 0 8px 4px" }}>
                {"Упоминания в делах"}
              </div>
              {" "}
              <div style={{ borderRadius: "12px", background: $v.c?.card, overflow: "hidden" }}>
                {" "}
                {__a($v.v?.cases).map((cs: any, $i0: number) => (
                  <Fragment key={$i0}>
                    {" "}
                    <a href="#" onClick={$v.__case(cs?.no)} className="hv" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", textDecoration: "none", color: $v.c?.text }}>
                      <span style={{ width: "32px", height: "32px", flexShrink: "0", borderRadius: "8px", background: "#3A4E72", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" aria-hidden="true">
                          <rect x="2.5" y="6" width="15" height="10.5" rx="2"></rect>
                          <path d="M7 6V4h6v2M2.5 10.5h15"></path>
                        </svg>
                      </span>
                      <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", lineHeight: "18px" }}>
                        <span style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.link }}>
                          {__h(cs?.no)}
                        </span>
                        <span className="ell" style={{ fontSize: "12px", color: $v.c?.text2 }}>
                          {__h(cs?.role)}
                        </span>
                        {$v.__caseWhere?.(cs?.no) ? (
                          <span className="ell" title={$v.__caseWhere(cs?.no)} style={{ fontSize: "12px", color: $v.c?.text2, display: "flex", alignItems: "center", gap: "4px" }}>
                            <svg width="11" height="11" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}><path d="M5 3v8a3 3 0 003 3h8M12.5 10.5L16 14l-3.5 3.5" /></svg>
                            {__h($v.__caseWhere(cs?.no))}
                          </span>
                        ) : null}
                      </span>
                    </a>
                    {" "}
                  </Fragment>
                ))}
                {" "}
              </div>
              {" "}
            </div>
          </div>
        </div>
      </div>
      {" "}
    </>
  )
}
