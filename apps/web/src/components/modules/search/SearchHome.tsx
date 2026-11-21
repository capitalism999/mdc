/* Generated 1:1 from the design reference (project/Search.dc.html) — markup, styles and copy are a literal port. */
import { Fragment } from 'react'
import { __a, __h, __s, type SearchVals } from './searchRuntime'
import { SearchSelect } from './SearchSelect'

export function SearchHome({ $v }: { $v: SearchVals }) {
  if (!$v.noQ) return null
  return (
    <>
      <div className="scroll" style={{ flex: "1", minHeight: "0", padding: "8px 24px 32px 24px" }}>
        {" "}
        <div style={{ maxWidth: "none", margin: "0", display: "flex", flexDirection: "column", gap: "24px" }}>
          {$v.showTiles ? (
            <div style={{ position: "relative", overflow: "hidden", borderRadius: "16px", padding: "28px 32px", background: "linear-gradient(120deg, #1F4F53 0%, #24343F 55%, #272727 100%)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "24px" }}>
              <span style={{ width: "64px", height: "64px", flexShrink: "0", borderRadius: "18px", background: "rgba(255,255,255,0.14)", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="30" height="30" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <circle cx="8.5" cy="8.5" r="5"></circle>
                  <path d="M12.5 12.5l4.5 4.5"></path>
                </svg>
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <h1 style={{ margin: "0", fontSize: "26px", lineHeight: "34px", fontWeight: "700" }}>
                  {"Что ищем?"}
                </h1>
                <div style={{ color: "rgba(255,255,255,0.72)" }}>
                  {"Выберите раздел или просто начните вводить имя, номер или адрес."}
                </div>
              </div>
            </div>
          ) : null}
          {$v.showForm ? (
            <div style={{ display: "flex", alignItems: "center", gap: "20px", padding: "8px 4px 0 4px" }}>
              {$v.isPersonForm ? (
                <img src="/assets/search/016e1809dc2a45dae6794f16c160dc5e.png" alt="Печать штата Сан-Андреас" width="84" height="84" style={{ width: "84px", height: "84px", flexShrink: "0", display: "block" }} />
              ) : null}
              {$v.isOtherForm ? (
                <span style={{ width: "84px", height: "84px", borderRadius: "22px", background: $v.hi?.color, color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {$v.hi?.iPerson ? (
                    <svg width="40" height="40" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                      <circle cx="10" cy="7" r="3.2"></circle>
                      <path d="M3.5 17a6.5 6.5 0 0113 0"></path>
                    </svg>
                  ) : null}
                  {$v.hi?.iVehicle ? (
                    <svg width="40" height="40" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                      <path d="M3 13.5V10l1.8-4.2A1.5 1.5 0 016.2 5h7.6a1.5 1.5 0 011.4.8L17 10v3.5"></path>
                      <path d="M2.5 13.5h15v2h-15z"></path>
                      <circle cx="6" cy="15.5" r="1.3"></circle>
                      <circle cx="14" cy="15.5" r="1.3"></circle>
                    </svg>
                  ) : null}
                  {$v.hi?.iWeapon ? (
                    <svg width="40" height="40" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                      <path d="M2.5 6.5h13l1.5 2.5h-6l-1 2h-2.5l-1.5 4.5H3l1.5-5.5H2.5z"></path>
                    </svg>
                  ) : null}
                  {$v.hi?.iOrg ? (
                    <svg width="40" height="40" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                      <circle cx="7.5" cy="7" r="2.6"></circle>
                      <circle cx="13.5" cy="7.5" r="2.2"></circle>
                      <path d="M2.5 16a5 5 0 0110 0M12.5 12.2a4 4 0 015 3.8"></path>
                    </svg>
                  ) : null}
                  {$v.hi?.iPlace ? (
                    <svg width="40" height="40" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                      <path d="M3 9l7-5.5L17 9v8H3z"></path>
                      <path d="M8 17v-5h4v5"></path>
                    </svg>
                  ) : null}
                  {$v.hi?.iLaw ? (
                    <svg width="40" height="40" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                      <path d="M10 3v14M6.5 17h7M4 6h12"></path>
                      <path d="M6 6l-2.5 5.5a2.5 2.5 0 005 0zM14 6l-2.5 5.5a2.5 2.5 0 005 0z"></path>
                    </svg>
                  ) : null}
                </span>
              ) : null}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <h1 style={{ margin: "0", fontSize: "36px", lineHeight: "44px", fontWeight: "700", letterSpacing: "-0.4px", whiteSpace: "nowrap" }}>
                  {__h($v.formTitle)}
                </h1>
                <div style={{ color: $v.c?.text2 }}>
                  {__h($v.formSub)}
                </div>
              </div>
            </div>
          ) : null}
          {$v.showForm ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "20px", borderRadius: "14px", background: $v.c?.card, boxShadow: `inset 0 0 0 1px ${__s($v.c?.stroke)}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                {$v.showSeg ? (
                  <div style={{ display: "flex", padding: "3px", borderRadius: "10px", background: $v.c?.mica, boxShadow: `inset 0 0 0 1px ${__s($v.c?.stroke)}` }}>
                    {__a($v.pmOpts).map((o: any, $i0: number) => (
                      <Fragment key={$i0}>
                        <button className="btn pb" onClick={o?.pick} style={{ height: "36px", padding: "0 28px", borderRadius: "8px", fontSize: "14px", fontWeight: o?.fw, background: o?.bg, color: o?.fg, whiteSpace: "nowrap" }}>
                          {__h(o?.name)}
                        </button>
                      </Fragment>
                    ))}
                  </div>
                ) : null}
                <div style={{ fontSize: "13px", color: $v.c?.text2 }}>
                  {__h($v.pmHint)}
                </div>
              </div>
              <div style={{ fontSize: "13px", color: $v.c?.text2 }}>
                {"Заполните одно поле или несколько. Поиск идёт по всем заполненным сразу, пустые не учитываются."}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px 16px" }}>
                {__a($v.fields).map((f: any, $i0: number) => (
                  <Fragment key={$i0}>
                    <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <span style={{ fontSize: "12px", fontWeight: "600", color: $v.c?.text2, whiteSpace: "nowrap" }}>
                        {__h(f?.name)}
                      </span>
                      {f?.isSel ? (
                        <SearchSelect $v={$v} f={f} />
                      ) : null}
                      {f?.isInp ? (
                        <input type="text" value={__s(f?.val)} onChange={f?.set} placeholder={f?.hint} aria-label={f?.name} style={{ height: "40px", boxSizing: "border-box", padding: "0 12px", borderRadius: "8px", border: "0", background: $v.c?.search, boxShadow: `inset 0 0 0 1px ${__s(f?.ring)}`, fontSize: "14px", color: $v.c?.text }} />
                      ) : null}
                    </label>
                  </Fragment>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingTop: "4px" }}>
                <span style={{ fontSize: "13px", color: $v.c?.text2 }}>
                  {__h($v.filledText)}
                </span>
                <span style={{ flex: "1" }}></span>
                <button className="btn hv" onClick={$v.clearForm} style={{ height: "36px", padding: "0 18px", borderRadius: "8px", background: $v.c?.btn, fontSize: "14px", whiteSpace: "nowrap" }}>
                  {"Очистить"}
                </button>
                <button className="btn" onClick={$v.doFind} style={{ height: "36px", padding: "0 24px", borderRadius: "8px", background: $v.accent, color: "#FFFFFF", fontSize: "14px", fontWeight: "600", whiteSpace: "nowrap" }}>
                  {"Найти"}
                </button>
              </div>
            </div>
          ) : null}
          {$v.showBrowse ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                <span style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                  {__h($v.browseTitle)}
                </span>
                <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                  {__h($v.browseHint)}
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "8px" }}>
                {__a($v.browse).map((bw: any, $i0: number) => (
                  <Fragment key={$i0}>
                    <button className="btn hv" onClick={bw?.pick} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px", borderRadius: "10px", background: $v.c?.card, boxShadow: `inset 0 0 0 1px ${__s($v.c?.stroke)}`, minWidth: "0" }}>
                      <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "2px" }}>
                        <span className="ell" style={{ fontSize: "14px", fontWeight: "600" }}>
                          {__h(bw?.title)}
                        </span>
                        <span className="ell" style={{ fontSize: "12px", color: $v.c?.text2 }}>
                          {__h(bw?.sub)}
                        </span>
                      </span>
                      {bw?.hasBadge ? (
                        <span style={{ flexShrink: "0", padding: "2px 8px", borderRadius: "10px", fontSize: "11px", fontWeight: "600", background: bw?.bBg, color: bw?.bFg, whiteSpace: "nowrap" }}>
                          {__h(bw?.badge)}
                        </span>
                      ) : null}
                    </button>
                  </Fragment>
                ))}
              </div>
            </div>
          ) : null}
          {$v.showTiles ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "12px" }}>
                {__a($v.tiles).map((x: any, $i0: number) => (
                  <Fragment key={$i0}>
                    <button className="btn hv" onClick={x?.pick} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "14px", padding: "18px", borderRadius: "14px", background: $v.c?.card, textAlign: "left", boxShadow: `inset 0 0 0 1px ${__s($v.c?.stroke)}` }}>
                      <span style={{ width: "44px", height: "44px", borderRadius: "12px", background: x?.color, color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {x?.iPerson ? (
                          <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                            <circle cx="10" cy="7" r="3.2"></circle>
                            <path d="M3.5 17a6.5 6.5 0 0113 0"></path>
                          </svg>
                        ) : null}
                        {x?.iVehicle ? (
                          <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                            <path d="M3 13.5V10l1.8-4.2A1.5 1.5 0 016.2 5h7.6a1.5 1.5 0 011.4.8L17 10v3.5"></path>
                            <path d="M2.5 13.5h15v2h-15z"></path>
                            <circle cx="6" cy="15.5" r="1.3"></circle>
                            <circle cx="14" cy="15.5" r="1.3"></circle>
                          </svg>
                        ) : null}
                        {x?.iWeapon ? (
                          <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                            <path d="M2.5 6.5h13l1.5 2.5h-6l-1 2h-2.5l-1.5 4.5H3l1.5-5.5H2.5z"></path>
                          </svg>
                        ) : null}
                        {x?.iOrg ? (
                          <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                            <circle cx="7.5" cy="7" r="2.6"></circle>
                            <circle cx="13.5" cy="7.5" r="2.2"></circle>
                            <path d="M2.5 16a5 5 0 0110 0M12.5 12.2a4 4 0 015 3.8"></path>
                          </svg>
                        ) : null}
                        {x?.iPlace ? (
                          <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                            <path d="M3 9l7-5.5L17 9v8H3z"></path>
                            <path d="M8 17v-5h4v5"></path>
                          </svg>
                        ) : null}
                        {x?.iLaw ? (
                          <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                            <path d="M10 3v14M6.5 17h7M4 6h12"></path>
                            <path d="M6 6l-2.5 5.5a2.5 2.5 0 005 0zM14 6l-2.5 5.5a2.5 2.5 0 005 0z"></path>
                          </svg>
                        ) : null}
                      </span>
                      <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <span style={{ fontSize: "16px", fontWeight: "600" }}>
                          {__h(x?.title)}
                        </span>
                        <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                          {__h(x?.hint)}
                        </span>
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%" }}>
                        <span style={{ padding: "2px 8px", borderRadius: "10px", fontSize: "11px", fontWeight: "600", background: "rgba(255,255,255,0.08)", color: $v.c?.text, whiteSpace: "nowrap" }}>
                          {__h(x?.count)}
                        </span>
                        <span className="ell" style={{ flex: "1", minWidth: "0", fontSize: "12px", color: $v.c?.text2 }}>
                          {__h(x?.sample)}
                        </span>
                      </span>
                    </button>
                  </Fragment>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                  {"Недавние запросы"}
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "nowrap", overflow: "hidden" }}>
                  {__a($v.recent).map((r: any, $i0: number) => (
                    <Fragment key={$i0}>
                      <button className="btn hv" onClick={r?.pick} style={{ height: "32px", padding: "0 14px", borderRadius: "16px", background: $v.c?.card, boxShadow: `inset 0 0 0 1px ${__s($v.c?.stroke)}`, whiteSpace: "nowrap", fontSize: "13px", flexShrink: "0" }}>
                        {__h(r?.text)}
                      </button>
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
        {" "}
      </div>
    </>
  )
}
