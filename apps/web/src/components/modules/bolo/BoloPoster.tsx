/* Generated 1:1 from the design reference (project/BOLO.dc.html) — markup, styles and copy are a literal port. */
import { Fragment } from 'react'
import { __a, __h, __s, type BoloVals } from './boloRuntime'

export function BoloPoster({ $v }: { $v: BoloVals }) {
  if (!$v.isPoster) return null
  return (
    <>
      <div style={{ flex: "1", minHeight: "0", display: "flex", marginTop: "-40px" }}>
        <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "16px 24px 12px 24px" }}>
            <button className="btn hv" onClick={$v.goFeed} aria-label="Назад" style={{ width: "32px", height: "32px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12.5 4.5L7 10l5.5 5.5"></path>
              </svg>
            </button>
            <span style={{ fontSize: "20px", lineHeight: "28px", fontWeight: "600" }}>
              {"Листовка"}
            </span>
            <span style={{ fontSize: "13px", color: $v.c?.text2 }}>
              {__h($v.b?.id)}{" · "}{__h($v.b?.title)}{" · A4, предпросмотр"}
            </span>
          </div>
          <div className="scroll" style={{ flex: "1", minHeight: "0", display: "flex", justifyContent: "center", padding: "4px 24px 24px 24px", background: $v.c?.rail }}>
            <div data-bolo-sheet="" style={{ position: "relative", width: "520px", height: "735px", flexShrink: "0", boxSizing: "border-box", display: "flex", flexDirection: "column", background: "#FAF9F5", color: "#141414", boxShadow: "0 10px 30px rgba(0,0,0,0.5)", fontFamily: "Inter, 'Segoe UI', sans-serif", overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px 26px 10px 26px" }}>
                {$v.pp?.hasLogo ? (
                  <img src={$v.pp?.logo} alt={$v.pp?.agency} width="56" height="56" style={{ display: "block", flexShrink: "0", objectFit: "contain", filter: $v.pp?.logoF, width: "56px", height: "56px" }} />
                ) : null}
                {$v.pp?.noLogo ? (
                  <span style={{ width: "56px", height: "56px", flexShrink: "0", display: "flex", alignItems: "center", justifyContent: "center", color: "#141414" }}>
                    <svg width="40" height="40" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d={$v.pp?.seal}></path>
                    </svg>
                  </span>
                ) : null}
                <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "3px" }}>
                  <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "15px", lineHeight: "18px", fontWeight: "700", letterSpacing: "1.2px" }}>
                    {__h($v.pp?.agency)}
                  </span>
                  <span style={{ fontSize: "9.5px", letterSpacing: ".3px", color: "#444444" }}>
                    {__h($v.pp?.unit)}
                  </span>
                </span>
                {$v.pp?.hasCiv ? (
                  <img src={$v.pp?.civSeal} alt={$v.pp?.civName} width="56" height="56" style={{ display: "block", flexShrink: "0", objectFit: "contain", filter: $v.pp?.logoF, width: "56px", height: "56px" }} />
                ) : null}
                {$v.pp?.noCiv ? (
                  <span style={{ width: "56px", flexShrink: "0" }}></span>
                ) : null}
              </div>
              <div style={{ margin: "0 26px", borderTop: "1px solid #000000" }}></div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 26px 0 26px", fontSize: "8.5px", letterSpacing: ".5px", color: "#444444" }}>
                <span style={{ fontWeight: "700" }}>
                  {__h($v.pp?.kindTag)}
                </span>
                <span>
                  {__h($v.pp?.date)}
                </span>
              </div>
              <div data-bolo-body="" style={{ flex: "1", minHeight: "0", display: "flex", flexDirection: "column", gap: "8px", padding: "6px 26px 0 26px" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "2px" }}>
                  <span style={{ fontFamily: "'PosterHead', 'Arial Narrow', Impact, sans-serif", fontSize: $v.pp?.titleSize, lineHeight: "1.1", fontWeight: "700", letterSpacing: ".5px", whiteSpace: $v.pp?.titleWs, maxWidth: "100%", color: $v.pp?.ink }}>
                    {__h($v.pp?.title)}
                  </span>
                  <span style={{ paddingTop: "4px", fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "12px", fontStyle: "italic" }}>
                    {__h($v.pp?.wantedFor)}
                  </span>
                </div>
                {$v.pp?.notBulletin ? (
                  <>
                  <div style={{ display: "flex", gap: "16px", paddingTop: "2px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px", flexShrink: "0" }}>
                      <span style={{ position: "relative", width: $v.pp?.photoW, height: $v.pp?.photoH, display: "block", background: "#DCDAD4", border: "1px solid #141414" }}>
                        {" "}
                        {$v.b?.isVeh ? (
                          <img src={$v.b?.carImg} alt="Фото" width="88%" height="70%" style={{ position: "absolute", left: "6%", top: "15%", objectFit: "contain", display: "block", filter: $v.pp?.logoF, width: "88%", height: "70%" }} />
                        ) : null}
                        {" "}
                        {$v.b?.isPerson ? (
                          <img src={$v.b?.mainImg || $v.sil} alt="Фото" style={{ position: "absolute", left: "0", top: "0", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 12%", display: "block", filter: $v.pp?.photoF }} />
                        ) : null}
                        {" "}
                        {$v.b?.unknown ? (
                          <span style={{ position: "absolute", left: "0", right: "0", top: "30%", textAlign: "center", fontSize: "54px", fontWeight: "900", color: "#8A877F" }}>
                            {"?"}
                          </span>
                        ) : null}
                        {" "}
                        {$v.b?.isEvent ? (
                          <svg width="70%" height="70%" viewBox="0 0 20 20" fill="none" stroke="#6F6C65" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ position: "absolute", left: "15%", top: "15%" }}>
                            <path d="M3 9.5L10 4l7 5.5M5 8v5M15 8v5"></path>
                            <path d="M2 14.5c1.3 0 1.3 1 2.7 1s1.3-1 2.6-1 1.3 1 2.7 1 1.3-1 2.6-1 1.3 1 2.7 1 1.4-1 2.7-1M2 17.5c1.3 0 1.3 1 2.7 1s1.3-1 2.6-1 1.3 1 2.7 1 1.3-1 2.6-1 1.3 1 2.7 1 1.4-1 2.7-1"></path>
                          </svg>
                        ) : null}
                        {" "}
                      </span>
                      <span style={{ fontSize: "8px", fontStyle: "italic", color: "#555555", width: $v.pp?.photoW }}>
                        {__h($v.pp?.mainCap)}
                      </span>
                      {$v.pp?.showPhotos ? (
                        <span style={{ display: "flex", gap: "6px", width: $v.pp?.photoW, paddingTop: "2px" }}>
                          {__a($v.pp?.extra).map((ex: any, $i0: number) => (
                            <Fragment key={$i0}>
                              <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "2px" }}>
                                <span style={{ position: "relative", overflow: "hidden", height: "40px", background: "#DCDAD4", border: "1px solid #141414", display: "flex", alignItems: "center", justifyContent: "center", color: "#6F6C65" }}>
                                  {ex?.hasImg ? (
                                    <img src={ex?.img} alt={ex?.cap} style={{ position: "absolute", left: "0", top: "0", width: "100%", height: "100%", objectFit: "cover", display: "block", filter: $v.pp?.photoF }} />
                                  ) : null}
                                  {ex?.noImg ? (
                                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                      <path d={ex?.icon}></path>
                                    </svg>
                                  ) : null}
                                </span>
                                <span className="ell" style={{ fontSize: "7.5px", fontStyle: "italic", color: "#555555" }}>
                                  {__h(ex?.cap)}
                                </span>
                              </span>
                            </Fragment>
                          ))}
                        </span>
                      ) : null}
                    </div>
                    <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "6px" }}>
                      {$v.b?.hasPlate ? (
                        <span className="lp" role="img" aria-label={`Номер ${__s($v.b?.plate)}`} style={{ width: "100px", height: "50px" }}>
                          <span style={{ fontSize: "27px" }}>
                            {__h($v.b?.plate)}
                          </span>
                        </span>
                      ) : null}
                      <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "21px", lineHeight: "24px", fontWeight: "700", letterSpacing: ".5px", textTransform: "uppercase" }}>
                        {__h($v.pp?.name)}
                      </span>
                      <span style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #141414" }}>
                        {__a($v.pp?.facts).map((f: any, $i0: number) => (
                          <Fragment key={$i0}>
                            <span style={{ display: "flex", gap: "8px", fontSize: "10.5px", lineHeight: "14px", padding: "3px 0", borderBottom: "1px dotted #9A968C" }}>
                              <span style={{ width: "76px", flexShrink: "0", color: "#555555" }}>
                                {__h(f?.k)}
                              </span>
                              <span style={{ fontWeight: "600" }}>
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
                            </span>
                          </Fragment>
                        ))}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", borderTop: "1px solid #141414", borderBottom: "1px solid #141414" }}>
                    {__a($v.pp?.incident).map((iv: any, $i0: number) => (
                      <Fragment key={$i0}>
                        <span style={{ display: "flex", flexDirection: "column", gap: "1px", padding: "4px 8px", borderLeft: iv?.sep }}>
                          <span style={{ fontSize: "8px", letterSpacing: ".6px", color: "#555555" }}>
                            {__h(iv?.k)}
                          </span>
                          <span className="ell" style={{ fontSize: "10.5px", fontWeight: "700" }}>
                            {__a(iv?.vP).map((qp: any, $i1: number) => (
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
                      </Fragment>
                    ))}
                  </div>
                  </>
                ) : null}
                {$v.pp?.isBulletin ? (
                  <>
                  <div style={{ display: "flex", flexDirection: "column", gap: "7px", fontSize: "11px", lineHeight: "16px" }}>
                    {__a($v.pp?.paras).map((pa: any, $i0: number) => (
                      <Fragment key={$i0}>
                        <span>
                          {__h(pa?.t)}
                        </span>
                      </Fragment>
                    ))}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingTop: "12px" }}>
                    <span style={{ fontFamily: "'PosterHead', 'Arial Narrow', Impact, sans-serif", fontSize: "17px", lineHeight: "20px", fontWeight: "700", letterSpacing: ".5px", color: $v.pp?.ink, textTransform: "uppercase" }}>
                      {__h($v.pp?.listTitle)}
                    </span>
                    {__a($v.pp?.recs).map((rc: any, $i0: number) => (
                      <Fragment key={$i0}>
                        <span style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "11px", lineHeight: "15px" }}>
                          <span style={{ width: "18px", flexShrink: "0", marginTop: "-1px", fontFamily: "'PosterHead', 'Arial Narrow', Impact, sans-serif", fontSize: "15px", lineHeight: "15px", fontWeight: "700", color: $v.pp?.ink }}>
                            {__h(rc?.n)}
                          </span>
                          <span>
                            {__h(rc?.t)}
                          </span>
                        </span>
                      </Fragment>
                    ))}
                  </div>
                  </>
                ) : null}
                {$v.pp?.isEvent ? (
                  <span style={{ padding: "8px 12px", border: `2px solid ${__s($v.pp?.ink)}`, fontSize: "10.5px", lineHeight: "15px" }}>
                    <b style={{ display: "block", letterSpacing: "1px", color: $v.pp?.ink, paddingBottom: "2px" }}>
                      {"ЧТО ДЕЛАТЬ"}
                    </b>
                    {__h($v.pp?.narr)}
                  </span>
                ) : null}
                {$v.pp?.notEventDesc ? (
                  <span data-bolo-narr="" style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "10.5px", lineHeight: "14.5px" }}>
                    {__a($v.pp?.narrP).map((qp: any, $i0: number) => (
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
                  </span>
                ) : null}
                {$v.pp?.armed ? (
                  <span style={{ padding: "5px 10px", border: `2px solid ${__s($v.pp?.ink)}`, color: $v.pp?.ink, textAlign: "center", fontSize: "10.5px", lineHeight: "14px" }}>
                    <b style={{ letterSpacing: ".6px" }}>
                      {"ВООРУЖЁН И ОПАСЕН"}
                    </b>
                    {" · не задерживайте сами, звоните 911"}
                  </span>
                ) : null}
                {$v.pp?.internal ? (
                  <span style={{ padding: "6px 10px", border: "1px dashed #141414", fontSize: "10.5px", lineHeight: "14px" }}>
                    <b>
                      {"ДЛЯ СОТРУДНИКОВ:"}
                    </b>
                    {" "}{__h($v.b?.instr)}
                  </span>
                ) : null}
                <span style={{ flex: "1" }}></span>
              </div>
              <div style={{ display: "flex", gap: "16px", alignItems: "flex-end", margin: "14px 26px 0 26px", padding: "10px 0 8px 0", borderTop: "1px solid #000000" }}>
                <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "3px" }}>
                  <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "13px", fontWeight: "700" }}>
                    {__h($v.pp?.ask)}
                  </span>
                  <span style={{ fontSize: "10px", lineHeight: "14px" }}>
                    {__h($v.pp?.contact)}
                  </span>
                  {$v.pp?.showTips ? (
                    <span style={{ fontSize: "10px", lineHeight: "14px" }}>
                      {"Анонимно: "}
                      <b>
                        {"Crime Stoppers · 555-TIPS (8477)"}
                      </b>
                    </span>
                  ) : null}
                </span>
                {$v.pp?.showReward ? (
                  <span style={{ flexShrink: "0", display: "flex", flexDirection: "column", alignItems: "flex-end", textAlign: "right", maxWidth: "150px" }}>
                    <span style={{ fontSize: "8.5px", fontWeight: "700", letterSpacing: "1.5px" }}>
                      {"НАГРАДА ДО"}
                    </span>
                    <span style={{ fontFamily: "'PosterHead', 'Arial Narrow', Impact, sans-serif", fontSize: "32px", lineHeight: "36px", fontWeight: "700" }}>
                      {__h($v.pp?.reward)}
                    </span>
                    <span style={{ fontSize: "7.5px", lineHeight: "10px", color: "#444444" }}>
                      {__h($v.pp?.rewardFor)}
                    </span>
                  </span>
                ) : null}
              </div>
              <div style={{ display: "flex", gap: "8px", padding: "5px 26px 8px 26px", borderTop: "1px solid #C9C5BB", fontSize: "7.5px", letterSpacing: ".3px", color: "#555555" }}>
                {$v.pp?.hasCiv ? (
                  <>
                  <span style={{ fontWeight: "700", color: "#333333" }}>
                    {__h($v.pp?.civName)}
                  </span>
                  <span>
                    {"·"}
                  </span>
                  </>
                ) : null}
                <span style={{ flex: "1" }}>
                  {__h($v.pp?.footL)}
                </span>
                {$v.pp?.hasApproved ? (
                  <span>
                    {__h($v.pp?.approved)}
                  </span>
                ) : null}
                {$v.pp?.notBulletin ? (
                  <span>
                    {__h($v.pp?.footR)}
                  </span>
                ) : null}
              </div>
              {$v.pp?.stamp ? (
                <span style={{ position: "absolute", left: "50%", top: "42%", transform: "translate(-50%, -50%) rotate(-14deg)", padding: "6px 22px", border: "5px solid #B3121D", borderRadius: "6px", color: "#B3121D", fontSize: "46px", fontWeight: "900", letterSpacing: "3px", background: "rgba(250,249,245,0.6)", whiteSpace: "nowrap" }}>
                  {__h($v.pp?.stampText)}
                </span>
              ) : null}
            </div>
          </div>
        </div>
        <div style={{ width: "320px", flexShrink: "0", borderLeft: `1px solid ${__s($v.c?.stroke)}`, background: $v.c?.content, display: "flex", flexDirection: "column" }}>
          <div className="scroll" style={{ flex: "1", minHeight: "0", padding: "58px 18px 16px 18px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontSize: "12px", fontWeight: "600", color: $v.c?.text2 }}>
                {"Шаблон"}
              </span>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                {__a($v.ppTpls).map((o: any, $i0: number) => (
                  <Fragment key={$i0}>
                    <button className="btn hv" onClick={o?.pick} style={{ height: "34px", padding: "0 6px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", borderRadius: "6px", background: o?.bg, boxShadow: o?.ring, fontSize: "13px", fontWeight: o?.fw, textAlign: "center" }}>
                      {__h(o?.t)}
                    </button>
                  </Fragment>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontSize: "12px", fontWeight: "600", color: $v.c?.text2 }}>
                {"Для кого"}
              </span>
              <div style={{ display: "flex", gap: "2px", padding: "3px", borderRadius: "8px", background: $v.c?.card }}>
                {__a($v.ppAud).map((o: any, $i0: number) => (
                  <Fragment key={$i0}>
                    <button className="btn" onClick={o?.pick} style={{ flex: "1", height: "28px", borderRadius: "6px", background: o?.bg, color: o?.fg, fontSize: "13px", fontWeight: o?.fw, textAlign: "center" }}>
                      {__h(o?.t)}
                    </button>
                  </Fragment>
                ))}
              </div>
              <span style={{ fontSize: "12px", lineHeight: "16px", color: $v.c?.text2 }}>
                {__h($v.ppAudText)}
              </span>
            </div>
            <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontSize: "12px", fontWeight: "600", color: $v.c?.text2 }}>
                {"Заголовок"}
              </span>
              <input type="text" value={__s($v.pp?.title)} onChange={$v.onPpTitle} style={{ height: "34px", boxSizing: "border-box", padding: "0 10px", borderRadius: "6px", border: "0", borderBottom: `1px solid ${__s($v.c?.stroke2)}`, background: $v.c?.field, fontSize: "14px", fontWeight: "700", color: $v.c?.text }} />
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "12px", fontWeight: "600", color: $v.c?.text2, paddingBottom: "4px" }}>
                {"Что показать"}
              </span>
              {__a($v.ppToggles).map((o: any, $i0: number) => (
                <Fragment key={$i0}>
                  <button className="btn" onClick={o?.pick} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "6px 0" }}>
                    <span style={{ flex: "1", display: "flex", flexDirection: "column", lineHeight: "17px" }}>
                      <span>
                        {__h(o?.t)}
                      </span>
                      <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                        {__a(o?.subP).map((qp: any, $i1: number) => (
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
                    <span style={{ position: "relative", width: "40px", height: "20px", boxSizing: "border-box", flexShrink: "0", borderRadius: "10px", background: o?.bg, border: `1px solid ${__s(o?.border)}` }}>
                      <span style={{ position: "absolute", top: "2px", left: "2px", width: "14px", height: "14px", borderRadius: "50%", background: o?.knob, transform: `translateX(${__s(o?.x)})` }}></span>
                    </span>
                  </button>
                </Fragment>
              ))}
            </div>
            {$v.pp?.showReward ? (
              <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontSize: "12px", fontWeight: "600", color: $v.c?.text2 }}>
                  {"Сумма награды"}
                </span>
                <input type="text" value={__s($v.pp?.reward)} onChange={$v.onPpReward} style={{ height: "34px", boxSizing: "border-box", padding: "0 10px", borderRadius: "6px", border: "0", borderBottom: `1px solid ${__s($v.c?.stroke2)}`, background: $v.c?.field, fontSize: "14px", color: $v.c?.text }} />
              </label>
            ) : null}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontSize: "12px", fontWeight: "600", color: $v.c?.text2 }}>
                {"Печать"}
              </span>
              <div style={{ display: "flex", gap: "2px", padding: "3px", borderRadius: "8px", background: $v.c?.card }}>
                {__a($v.ppColor).map((o: any, $i0: number) => (
                  <Fragment key={$i0}>
                    <button className="btn" onClick={o?.pick} style={{ flex: "1", height: "28px", borderRadius: "6px", background: o?.bg, color: o?.fg, fontSize: "13px", fontWeight: o?.fw, textAlign: "center" }}>
                      {__h(o?.t)}
                    </button>
                  </Fragment>
                ))}
              </div>
            </div>
            <span style={{ fontSize: "12px", lineHeight: "17px", color: $v.c?.text2 }}>
              {"Листовка собирается из ориентировки: фото, приметы и данные обновятся сами, если ориентировку изменят."}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "14px 18px 16px 18px", borderTop: `1px solid ${__s($v.c?.stroke)}` }}>
            <button className="btn acc" onClick={$v.ppPdf} style={{ height: "36px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: $v.accent, color: $v.onAccent, fontWeight: "600" }}>
              <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M10 3v10M6 9l4 4 4-4M4 16.5h12"></path>
              </svg>
              {"Скачать PDF"}
            </button>
            <div style={{ display: "flex", gap: "8px" }}>
              <button className="btn hv" onClick={$v.ppPrint} style={{ flex: "1", height: "34px", borderRadius: "6px", background: $v.c?.btn, textAlign: "center" }}>
                {"Распечатать"}
              </button>
              <button className="btn hv" onClick={$v.ppMail} style={{ flex: "1", height: "34px", borderRadius: "6px", background: $v.c?.btn, textAlign: "center" }}>
                {"В Почту участку"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
