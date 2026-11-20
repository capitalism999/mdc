/* Generated 1:1 from the design reference (project/Search.dc.html) — markup, styles and copy are a literal port. */
import { Fragment } from 'react'
import { personPhoto } from '../../shared/personPhotos'
import { __a, __h, __s, type SearchVals } from '../searchRuntime'

export function PlainRecord({ $v }: { $v: SearchVals }) {
  if (!$v.rec?.isPlain) return null
  return (
    <>
      {" "}
      <div style={{ maxWidth: "860px", display: "flex", flexDirection: "column", gap: "16px" }}>
        {$v.rec?.empMark ? (
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "12px", background: "rgba(0,120,212,0.25)", color: "#99D9FF" }}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
              <path d="M10 2.5l6 2v5c0 4-2.6 6.6-6 8-3.4-1.4-6-4-6-8v-5z"></path>
            </svg>
            <span style={{ flex: "1", fontWeight: "600" }}>
              {"Сотрудник правоохранительных органов"}
            </span>
            <a href="#" onClick={$v.__go("Agency")} className="btn lnk" style={{ fontSize: "12px", color: "#8FD8FF", textDecoration: "none" }}>
              {"Открыть в Агентстве"}
            </a>
          </div>
        ) : null}
        {$v.rec?.hasAlert ? (
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "12px", background: $v.rec?.alertBg, color: $v.rec?.alertFg }}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
              <path d="M10 3l8 14H2z"></path>
              <path d="M10 8.5v3.5M10 14.5v.2"></path>
            </svg>
            <span style={{ flex: "1", fontWeight: "600" }}>
              {__h($v.rec?.alert)}
            </span>
          </div>
        ) : null}
        {$v.bolo?.has ? (
          <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "12px 16px", borderRadius: "12px", background: $v.bolo?.bg }}>
            <span style={{ width: "36px", height: "36px", flexShrink: "0", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", background: $v.bolo?.iconBg, color: "#FFFFFF" }}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={$v.bolo?.icon}></path>
              </svg>
            </span>
            <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "2px", lineHeight: "19px" }}>
              <span style={{ fontWeight: "700", color: $v.bolo?.fg }}>
                {__a($v.bolo?.titleP).map((qp: any, $i0: number) => (
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
              <span style={{ fontSize: "13px" }}>
                {__a($v.bolo?.textP).map((qp: any, $i0: number) => (
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
            </span>
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
              <a href="#" onClick={$v.__go("MailList")} className="hv" style={{ flexShrink: "0", height: "32px", padding: "0 12px", borderRadius: "6px", display: "flex", alignItems: "center", background: $v.c?.btn, color: $v.c?.text, fontSize: "13px", textDecoration: "none", whiteSpace: "nowrap" }}>
                {"Написать "}{__h($v.bolo?.ctShort)}
              </a>
            ) : null}
          </div>
        ) : null}
        <div style={{ display: "flex", gap: "20px", padding: "18px", borderRadius: "12px", background: $v.c?.card }}>
          {$v.rec?.isPerson ? (
            <div style={{ position: "relative", width: "124px", height: "156px", flexShrink: "0", borderRadius: "10px", overflow: "hidden", backgroundColor: $v.c?.mug, backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent 19px, ${__s($v.c?.mugLine)} 19px, ${__s($v.c?.mugLine)} 20px)` }}>
              {" "}
              <img src={personPhoto($v.rec?.id)} alt="Фото" style={{ position: "absolute", left: "0", top: "0", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 12%", display: "block" }} />
              {" "}
            </div>
          ) : null}
          {$v.rec?.isVehicle ? (
            <div style={{ position: "relative", width: "260px", height: "156px", flexShrink: "0", borderRadius: "10px", overflow: "hidden", background: `linear-gradient(180deg, ${__s($v.c?.photoSky)} 0%, ${__s($v.c?.photoSky)} 62%, ${__s($v.c?.photoGround)} 62%, ${__s($v.c?.photoGround)} 100%)` }}>
              {" "}
              <img src="/assets/search/9c4359f8cb243131e90b0261de58cce8.png" alt="Фото" width="220" height="132" style={{ position: "absolute", left: "20px", top: "8px", objectFit: "contain", display: "block", width: "220px", height: "132px" }} />
              {" "}
            </div>
          ) : null}
          {$v.rec?.isWeapon ? (
            <div style={{ width: "156px", height: "156px", flexShrink: "0", borderRadius: "10px", background: $v.c?.mug, color: $v.c?.mugFig2, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="96" height="96" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                <path d="M2.5 6.5h13l1.5 2.5h-6l-1 2h-2.5l-1.5 4.5H3l1.5-5.5H2.5z"></path>
              </svg>
            </div>
          ) : null}
          {$v.rec?.isOrg ? (
            <div style={{ width: "156px", height: "156px", flexShrink: "0", borderRadius: "12px", background: "#8A3B5C", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="72" height="72" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                <circle cx="7.5" cy="7" r="2.6"></circle>
                <circle cx="13.5" cy="7.5" r="2.2"></circle>
                <path d="M2.5 16a5 5 0 0110 0M12.5 12.2a4 4 0 015 3.8"></path>
              </svg>
            </div>
          ) : null}
          {$v.rec?.isPlace ? (
            <div style={{ width: "156px", height: "156px", flexShrink: "0", borderRadius: "12px", background: "#3E8EDE", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="72" height="72" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                <path d="M3 9l7-5.5L17 9v8H3z"></path>
                <path d="M8 17v-5h4v5"></path>
              </svg>
            </div>
          ) : null}
          {$v.rec?.isLaw ? (
            <div style={{ width: "156px", height: "156px", flexShrink: "0", borderRadius: "12px", background: "#5C4B8A", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="72" height="72" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                <path d="M10 3v14M6.5 17h7M4 6h12"></path>
                <path d="M6 6l-2.5 5.5a2.5 2.5 0 005 0zM14 6l-2.5 5.5a2.5 2.5 0 005 0z"></path>
              </svg>
            </div>
          ) : null}
          <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.4px", color: $v.c?.text2 }}>
              {__h($v.rec?.kindLabel)}
            </div>
            {$v.rec?.isVehicle ? (
              <span className="lp" role="img" aria-label={`Номер ${__s($v.rec?.plate)}`}>
                <span>
                  {__h($v.rec?.plate)}
                </span>
              </span>
            ) : null}
            <h1 style={{ margin: "0", fontSize: "26px", lineHeight: "32px", fontWeight: "700" }}>
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
              {$v.tg?.canEdit ? (
                <button className="btn lnk" onClick={$v.tg?.edit} style={{ fontSize: "12px", color: $v.c?.link }}>
                  {"Изменить данные"}
                </button>
              ) : null}
            </div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "2px" }}>
              {__a($v.rec?.badges).map((b: any, $i0: number) => (
                <Fragment key={$i0}>
                  <span style={{ padding: "2px 10px", borderRadius: "10px", fontSize: "12px", fontWeight: "600", background: b?.bg, color: b?.fg }}>
                    {__a(b?.textP).map((qp: any, $i1: number) => (
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
            {$v.rec?.hasAgency ? (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingTop: "4px" }}>
                {__a($v.rec?.agencyLinks).map((ol: any, $i0: number) => (
                  <Fragment key={$i0}>
                    <button className="btn hv" onClick={ol?.go} style={{ height: "44px", padding: "0 18px 0 8px", borderRadius: "10px", display: "flex", alignItems: "center", gap: "10px", background: ol?.color, color: "#FFFFFF", fontSize: "14px", fontWeight: "700", whiteSpace: "nowrap" }}>
                      <span style={{ width: "30px", height: "30px", borderRadius: "50%", background: "rgba(255,255,255,0.14)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: "0" }}>
                        {ol?.hasLogo ? (
                          <img src={ol?.logo} alt="" width="26" height="26" style={{ width: "26px", height: "26px", objectFit: "contain" }} />
                        ) : null}
                      </span>
                      {__h(ol?.name)}
                    </button>
                  </Fragment>
                ))}
              </div>
            ) : null}
            <div style={{ flex: "1" }}></div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <a href="#" onClick={$v.__go("Cases")} className="hv" style={{ height: "32px", padding: "0 12px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", textDecoration: "none", background: $v.c?.btn }}>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2.5" y="6" width="15" height="10.5" rx="2"></rect>
                  <path d="M7 6V4h6v2M2.5 10.5h15"></path>
                </svg>
                {"Добавить в дело"}
              </a>
              <a href="#" onClick={$v.__go("BOLONew")} className="hv" style={{ height: "32px", padding: "0 12px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", background: $v.c?.btn, textDecoration: "none", color: "inherit" }}>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                  <path d="M10 3l8 14H2z"></path>
                  <path d="M10 8.5v3.5M10 14.5v.2"></path>
                </svg>
                {"Создать BOLO"}
              </a>
              <button className="btn hv" onClick={$v.dl?.print} style={{ height: "32px", padding: "0 12px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", background: $v.c?.btn }}>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                  <path d="M5.5 7.5V3h9v4.5"></path>
                  <rect x="2.5" y="7.5" width="15" height="7" rx="1.5"></rect>
                  <path d="M5.5 12h9v5h-9z"></path>
                </svg>
                {"Распечатать"}
              </button>
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "16px", alignItems: "start" }}>
          {__a($v.rec?.sections).map((s: any, $i0: number) => (
            <Fragment key={$i0}>
              <div>
                {" "}
                <div style={{ display: "flex", alignItems: "center", margin: "0 0 6px 4px" }}>
                  <span style={{ flex: "1", fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                    {__a(s?.titleP).map((qp: any, $i1: number) => (
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
                  <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                    {__h(s?.count)}
                  </span>
                </div>
                {" "}
                <div style={{ borderRadius: "12px", background: $v.c?.card, padding: "0 14px" }}>
                  {" "}
                  {__a(s?.rows).map((rw: any, $i1: number) => (
                    <Fragment key={$i1}>
                      {" "}
                      <div style={{ display: "flex", gap: "12px", padding: "10px 0", borderBottom: `1px solid ${__s(rw?.sep)}`, fontSize: "13px" }}>
                        <span style={{ width: "128px", flexShrink: "0", color: $v.c?.text2 }}>
                          {__a(rw?.kP).map((qp: any, $i2: number) => (
                            <Fragment key={$i2}>
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
                        <span style={{ flex: "1", minWidth: "0", textAlign: "right", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "6px" }}>
                          {rw?.hasDot ? (
                            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: rw?.dot, flexShrink: "0" }}></span>
                          ) : null}
                          {rw?.isRec ? (
                            <button className="btn lnk" onClick={rw?.go} style={{ fontSize: "13px", color: $v.c?.link, textDecoration: "underline", textDecorationColor: $v.c?.linkLine, textUnderlineOffset: "3px", textAlign: "right" }}>
                              {__a(rw?.vP).map((qp: any, $i2: number) => (
                                <Fragment key={$i2}>
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
                          {rw?.isCase ? (
                            <a href="#" onClick={$v.__go("Cases")} className="lnk" style={{ fontSize: "13px", color: $v.c?.link, textDecoration: "underline", textDecorationColor: $v.c?.linkLine, textUnderlineOffset: "3px" }}>
                              {__a(rw?.vP).map((qp: any, $i2: number) => (
                                <Fragment key={$i2}>
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
                            </a>
                          ) : null}
                          {rw?.plain ? (
                            <span>
                              {__a(rw?.vP).map((qp: any, $i2: number) => (
                                <Fragment key={$i2}>
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
            </Fragment>
          ))}
        </div>
      </div>
      {" "}
    </>
  )
}
