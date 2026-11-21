/* Generated 1:1 from the design reference (project/BOLO.dc.html) — markup, styles and copy are a literal port. */
import { Fragment } from 'react'
import { __a, __h, __s, type BoloVals } from './boloRuntime'
import { BoloTerrain } from './boloTerrain'

export function BoloFeed({ $v }: { $v: BoloVals }) {
  if (!$v.isFeed) return null
  return (
    <>
      <div style={{ flex: "1", minHeight: "0", display: "flex", marginTop: "-40px" }}>
        <div className="bolo-list" style={{ width: "380px", flexShrink: "0", display: "flex", flexDirection: "column", borderRight: `1px solid ${__s($v.c?.stroke)}` }}>
          <div style={{ padding: "14px 16px 10px 20px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
              <span style={{ fontSize: "20px", lineHeight: "28px", fontWeight: "600" }}>
                {__h($v.listTitle)}
              </span>
              <span style={{ fontSize: "13px", color: $v.c?.text2 }}>
                {__h($v.listCount)}
              </span>
            </div>
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
              {__a($v.srcFilters).map((sf: any, $i0: number) => (
                <Fragment key={$i0}>
                  <button className="btn hv" onClick={sf?.pick} title={sf?.title} style={{ height: "26px", padding: "0 10px", borderRadius: "13px", display: "flex", alignItems: "center", gap: "5px", background: sf?.bg, color: sf?.fg, fontSize: "12px", fontWeight: sf?.fw, whiteSpace: "nowrap" }}>
                    {__h(sf?.t)}
                    <span style={{ opacity: ".65" }}>
                      {__h(sf?.n)}
                    </span>
                  </button>
                </Fragment>
              ))}
            </div>
            <label style={{ height: "32px", boxSizing: "border-box", display: "flex", alignItems: "center", gap: "8px", padding: "0 10px", borderRadius: "6px", background: $v.c?.search, color: $v.c?.text2 }}>
              <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                <circle cx="8.5" cy="8.5" r="5.5"></circle>
                <path d="M12.5 12.5l4.5 4.5"></path>
              </svg>
              <input type="search" value={__s($v.q)} onChange={$v.onQ} placeholder="Имя, номер машины, приметы" aria-label="Поиск по ориентировкам" style={{ flex: "1", minWidth: "0", border: "0", background: "transparent", fontSize: "14px", color: $v.c?.text }} />
            </label>
          </div>
          <div className="scroll" style={{ flex: "1", minHeight: "0", padding: "0 16px 12px 20px", display: "flex", flexDirection: "column", gap: "2px" }}>
            {__a($v.rows).map((r: any, $i0: number) => (
              <Fragment key={$i0}>
                <button className="btn hv" onClick={r?.pick} style={{ position: "relative", width: "100%", boxSizing: "border-box", display: "flex", gap: "12px", padding: "10px", borderRadius: "8px", background: r?.bg }}>
                  <span style={{ position: "relative", width: "52px", height: "52px", flexShrink: "0", borderRadius: "8px", overflow: "hidden", background: r?.thumbBg }}>
                    {" "}
                    {r?.isVeh ? (
                      <img src={r?.carImg} alt="Фото" width="46" height="28" style={{ position: "absolute", left: "3px", top: "12px", objectFit: "contain", display: "block", width: "46px", height: "28px" }} />
                    ) : null}
                    {" "}
                    {r?.isPerson ? (
                      <img src={r?.img || $v.sil} alt="Фото" style={{ position: "absolute", left: "0", top: "0", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 12%", display: "block" }} />
                    ) : null}
                    {" "}
                    {r?.unknown ? (
                      <span style={{ position: "absolute", left: "0", right: "0", top: "10px", textAlign: "center", fontSize: "18px", fontWeight: "700", color: $v.c?.text }}>
                        {"?"}
                      </span>
                    ) : null}
                    {r?.isEvent ? (
                      <svg width="26" height="26" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ position: "absolute", left: "13px", top: "13px", color: $v.c?.text2 }}>
                        <path d={r?.evIcon}></path>
                      </svg>
                    ) : null}
                    {" "}
                  </span>
                  <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "3px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      {r?.unread ? (
                        <span style={{ width: "8px", height: "8px", flexShrink: "0", borderRadius: "50%", background: $v.accent }}></span>
                      ) : null}
                      <span className="ell" style={{ flex: "1", minWidth: "0", fontWeight: r?.fw }}>
                        {__h(r?.title)}
                      </span>
                      <span className="num" style={{ fontSize: "12px", color: $v.c?.text2 }}>
                        {__h(r?.ago)}
                      </span>
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "6px", minWidth: "0" }}>
                      <span style={{ flexShrink: "0", fontSize: "10px", fontWeight: "700", letterSpacing: ".4px", color: r?.srcFg }}>
                        {__h(r?.src)}
                      </span>
                      <span className="ell" style={{ fontSize: "12px", color: $v.c?.text2 }}>
                        {__a(r?.subP).map((qp: any, $i1: number) => (
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
                    <span style={{ display: "flex", flexWrap: "wrap", gap: "4px", paddingTop: "2px" }}>
                      {__a(r?.chips).map((ch: any, $i1: number) => (
                        <Fragment key={$i1}>
                          <span className="chip" style={{ height: "20px", fontSize: "11px", padding: "0 7px", background: ch?.bg, color: ch?.fg }}>
                            {__h(ch?.t)}
                          </span>
                        </Fragment>
                      ))}
                    </span>
                  </span>
                </button>
              </Fragment>
            ))}
            {$v.noRows ? (
              <div style={{ padding: "24px 12px", color: $v.c?.text2 }}>
                {"Ничего не найдено"}
              </div>
            ) : null}
          </div>
        </div>
        <div style={{ position: "relative", flex: "1", minWidth: "0", minHeight: "0", overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {$v.noRows ? (
            <div style={{ position: "absolute", inset: "0", zIndex: "7", background: $v.c?.content, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", padding: "24px", textAlign: "center" }}>
              <svg width="40" height="40" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" aria-hidden="true" style={{ color: $v.c?.text2 }}>
                <circle cx="9" cy="9" r="5.5"></circle>
                <path d="M13 13l4 4"></path>
              </svg>
              <span style={{ fontSize: "16px", fontWeight: "600" }}>{"Ничего не найдено"}</span>
              <span style={{ fontSize: "13px", color: $v.c?.text2, maxWidth: "320px" }}>{$v.filtered ? "Под поиск и фильтры не подходит ни одна ориентировка." : "В этом разделе пока нет ориентировок."}</span>
              {$v.filtered ? (
                <button className="btn hv" onClick={$v.resetFilters} style={{ height: "32px", padding: "0 14px", borderRadius: "6px", background: $v.c?.btn, fontWeight: "600" }}>
                  {"Сбросить фильтры"}
                </button>
              ) : null}
            </div>
          ) : null}
          {$v.b?.needAck && $v.__ackSticky && !$v.noRows ? (
            <div style={{ position: "absolute", left: "28px", right: "28px", bottom: "16px", zIndex: "6", display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px 10px 16px", borderRadius: "10px", background: $v.c?.flyout, border: `1px solid ${__s($v.c?.stroke)}`, boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
              <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", lineHeight: "18px" }}>
                <span className="ell" style={{ fontWeight: "600" }}>{"Ознакомьтесь с ориентировкой"}</span>
                <span className="ell" style={{ fontSize: "12px", color: $v.c?.text2 }}>{__h($v.b?.ackText)}</span>
              </span>
              <button className="btn acc" onClick={$v.ack} style={{ flexShrink: "0", height: "32px", padding: "0 16px", borderRadius: "6px", background: $v.accent, color: $v.onAccent, fontWeight: "600" }}>
                {"Ознакомлен"}
              </button>
            </div>
          ) : null}
          <div style={{ height: "40px", flexShrink: "0" }}></div>
          <div className="scroll bolo-detail" style={{ flex: "1", minHeight: "0", padding: "0 28px 28px 28px", display: "flex", flexDirection: "column", gap: "20px" }}>
            {$v.b?.closed ? (
              <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "10px", background: $v.b?.closedBg }}>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: $v.b?.closedFg }}>
                  <path d={$v.b?.closedIcon}></path>
                </svg>
                <span style={{ flex: "1", display: "flex", flexDirection: "column", lineHeight: "18px" }}>
                  <span style={{ fontWeight: "600", color: $v.b?.closedFg }}>
                    {__h($v.b?.closedTitle)}
                  </span>
                  <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                    {__h($v.b?.closedText)}
                  </span>
                </span>
                {$v.canRecreate ? (
                  <button className="btn hv" onClick={$v.recreate} style={{ flexShrink: 0, height: "30px", padding: "0 12px", borderRadius: "6px", background: $v.c?.btn, color: $v.c?.text, fontSize: "13px", whiteSpace: "nowrap" }}>
                    {"Создать заново"}
                  </button>
                ) : null}
              </div>
            ) : null}
            {$v.b?.showArrest ? (
              <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "10px", background: $v.greenBg }}>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: "0", color: $v.T?.green }}>
                  <path d="M10 9a3.2 3.2 0 100-6.4A3.2 3.2 0 0010 9zM3.5 17.5c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M13.5 14l1.5 1.5 3-3"></path>
                </svg>
                <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", lineHeight: "18px" }}>
                  <span style={{ fontWeight: "600", color: $v.T?.green }}>
                    {"Tyrone Webb оформлен: арест "}
                    <a href="#" onClick={$v.__go("ArrestsDetail.dc.html")} className="lnk" style={{ color: $v.c?.link, textDecoration: "none" }}>
                      {"A-2026-1203"}
                    </a>
                  </span>
                  <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                    {"17.11, 16:20 · Carlos Mendez · Mission Row. Ориентировка ещё открыта."}
                  </span>
                </span>
                <button className="btn hv" onClick={$v.b?.arrestNo} style={{ flexShrink: "0", height: "32px", padding: "0 12px", borderRadius: "6px", background: $v.c?.btn, whiteSpace: "nowrap" }}>
                  {"Не тот человек"}
                </button>
                <button className="btn" onClick={$v.b?.arrestClose} style={{ flexShrink: "0", height: "32px", padding: "0 14px", borderRadius: "6px", background: $v.accent, color: $v.onAccent, fontWeight: "600", whiteSpace: "nowrap" }}>
                  {"Закрыть как задержан"}
                </button>
              </div>
            ) : null}
            {$v.b?.showExp ? (
              <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "10px", background: $v.amberBg }}>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: "0", color: $v.amberFg }}>
                  <path d="M10 17.5a7.5 7.5 0 100-15 7.5 7.5 0 000 15zM10 6v4l2.5 1.5"></path>
                </svg>
                <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", lineHeight: "18px" }}>
                  <span style={{ fontWeight: "600", color: $v.amberFg }}>
                    {__h($v.b?.expTitle)}
                  </span>
                  <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                    {"Автору ушло напоминание в Почту. Продлить может автор, ведущий по делу или сержант смены."}
                  </span>
                </span>
                <span style={{ flexShrink: "0", fontSize: "13px", color: $v.c?.text2 }}>
                  {"Продлить"}
                </span>
                {__a($v.b?.expBtns).map((e: any, $i0: number) => (
                  <Fragment key={$i0}>
                    <button className="btn hv" onClick={e?.go} style={{ flexShrink: "0", height: "32px", padding: "0 12px", borderRadius: "6px", background: $v.c?.btn, fontWeight: "600", whiteSpace: "nowrap" }}>
                      {__h(e?.t)}
                    </button>
                  </Fragment>
                ))}
              </div>
            ) : null}
            {$v.b?.showUpd ? (
              <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "10px", background: $v.blueBg }}>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: "0", color: $v.blueFg }}>
                  <path d="M4 14.5V16h1.5L15 6.5 13.5 5zM12 6.5l1.5 1.5"></path>
                </svg>
                <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", lineHeight: "18px" }}>
                  <span style={{ fontWeight: "600", color: $v.blueFg }}>
                    {__h($v.b?.updTitle)}
                  </span>
                  <span style={{ fontSize: "13px" }}>
                    {__h($v.b?.updText)}
                  </span>
                </span>
                <button className="btn hv" onClick={$v.b?.updOk} style={{ flexShrink: "0", height: "32px", padding: "0 12px", borderRadius: "6px", background: $v.c?.btn, whiteSpace: "nowrap" }}>
                  {"Понятно"}
                </button>
              </div>
            ) : null}
            <div style={{ display: "flex", gap: "24px", alignItems: "stretch" }}>
              <span onClick={$v.__openHero} role={$v.__openHero ? "button" : undefined} tabIndex={$v.__openHero ? 0 : undefined} aria-label={$v.__openHero ? "Открыть фото во весь экран" : undefined} onKeyDown={(e) => { if ($v.__openHero && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); $v.__openHero() } }} style={{ cursor: $v.__heroCursor, position: "relative", width: $v.b?.photoW, height: "172px", flexShrink: "0", borderRadius: "12px", overflow: "hidden", background: $v.b?.photoBg, backgroundImage: $v.b?.photoLines }}>
                {" "}
                {$v.b?.isVeh ? (
                  <img src={$v.b?.carImg} alt="Фото" width="210" height="126" style={{ position: "absolute", left: "19px", top: "20px", objectFit: "contain", display: "block", width: "210px", height: "126px" }} />
                ) : null}
                {" "}
                {$v.b?.isPerson ? (
                  <img src={$v.b?.mainImg || $v.sil} alt="Фото" style={{ position: "absolute", left: "0", top: "0", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 12%", display: "block" }} />
                ) : null}
                {" "}
                {$v.b?.unknown ? (
                  <span style={{ position: "absolute", left: "0", right: "0", top: "48px", textAlign: "center", fontSize: "34px", fontWeight: "700", color: $v.c?.text }}>
                    {"?"}
                  </span>
                ) : null}
                {$v.b?.isEvent ? (
                  <svg width="64" height="64" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", color: $v.c?.text2 }}>
                    <path d={$v.b?.evIcon}></path>
                  </svg>
                ) : null}
                {" "}
              </span>
              <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "14px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
                    {__a($v.b?.chips).map((ch: any, $i0: number) => (
                      <Fragment key={$i0}>
                        <span className="chip" style={{ background: ch?.bg, color: ch?.fg }}>
                          {__h(ch?.t)}
                        </span>
                      </Fragment>
                    ))}
                  </div>
                  <span style={{ fontSize: "12px", fontWeight: "600", letterSpacing: ".4px", color: $v.b?.reasonColor }}>
                    {__h($v.b?.reason)}
                  </span>
                  {$v.b?.hasPlate ? (
                    <span className="lp" role="img" aria-label={`Номер ${__s($v.b?.plate)}`}>
                      <span>
                        {__h($v.b?.plate)}
                      </span>
                    </span>
                  ) : null}
                  <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2px" }}>
                    {$v.b?.titleLink ? (
                      <button className="btn lnk" onClick={$v.b?.titleGo} style={{ fontSize: "30px", lineHeight: "38px", fontWeight: "700", color: $v.c?.text }}>
                        {__h($v.b?.title)}
                      </button>
                    ) : null}
                    {$v.b?.titlePlain ? (
                      <span style={{ fontSize: "30px", lineHeight: "38px", fontWeight: "700" }}>
                        {__h($v.b?.title)}
                      </span>
                    ) : null}
                    <span style={{ color: $v.c?.text2 }}>
                      {__a($v.b?.subtitleP).map((qp: any, $i0: number) => (
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
                </div>
                <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "8px", alignSelf: "flex-start", flexWrap: "wrap" }}>
                  {$v.b?.open ? (
                    <>
                    <button className="btn hv" onClick={$v.closeBolo} style={{ height: "34px", padding: "0 14px", borderRadius: "8px", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px", background: $v.c?.btn }}>
                      <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M4 10.5l3.5 3.5L16 5.5"></path>
                      </svg>
                      {" "}{__h($v.b?.closeLabel)}{" "}
                    </button>
                    {$v.b?.notEv ? (
                      <button className="btn acc" onClick={$v.openSeen} style={{ height: "34px", padding: "0 16px", borderRadius: "8px", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px", background: $v.accent, color: $v.onAccent, fontWeight: "600" }}>
                        <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M1.5 10S4.5 4.5 10 4.5 18.5 10 18.5 10 15.5 15.5 10 15.5 1.5 10 1.5 10z"></path>
                          <circle cx="10" cy="10" r="2.5"></circle>
                        </svg>
                        {" Замечен "}
                      </button>
                    ) : null}
                    </>
                  ) : null}
                  <button className="btn hv" onClick={$v.goPoster} aria-label="Листовка для печати" title="Листовка для печати (PDF)" style={{ width: "34px", height: "34px", borderRadius: "8px", background: $v.c?.btn, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                      <path d="M5.5 7.5V3h9v4.5"></path>
                      <rect x="2.5" y="7.5" width="15" height="7" rx="1.5"></rect>
                      <path d="M5.5 12h9v5h-9z"></path>
                    </svg>
                  </button>
                  <button className="btn hv" onClick={$v.toggleMenu} aria-label="Ещё" title="Обновить, продлить, доступ" style={{ width: "34px", height: "34px", borderRadius: "8px", background: $v.c?.btn, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <circle cx="4.5" cy="10" r="1.4"></circle>
                      <circle cx="10" cy="10" r="1.4"></circle>
                      <circle cx="15.5" cy="10" r="1.4"></circle>
                    </svg>
                  </button>
                  {$v.menuOpen ? (
                    <div role="menu" style={{ position: "absolute", right: "0", top: "42px", zIndex: "15", width: "280px", boxSizing: "border-box", padding: "4px", borderRadius: "8px", background: $v.c?.flyout, border: `1px solid ${__s($v.c?.stroke)}`, boxShadow: "0 16px 32px rgba(0,0,0,0.45)" }}>
                      {" "}
                      {__a($v.menuItems).map((m: any, $i0: number) => (
                        <Fragment key={$i0}>
                          {" "}
                          <button className="btn hv" role="menuitem" onClick={m?.go} style={{ width: "100%", height: "34px", padding: "0 10px", borderRadius: "4px", display: "flex", alignItems: "center", gap: "10px", textAlign: "left", whiteSpace: "nowrap" }}>
                            <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: "0", color: $v.c?.text2 }}>
                              <path d={m?.icon}></path>
                            </svg>
                            <span className="ell">
                              {__h(m?.t)}
                            </span>
                          </button>
                          {" "}
                        </Fragment>
                      ))}
                      {" "}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            {$v.b?.showInstr ? (
              <div style={{ display: "flex", gap: "12px", padding: "12px 16px", borderRadius: "10px", background: $v.b?.instrBg }}>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: $v.b?.instrFg, flexShrink: "0", marginTop: "1px" }}>
                  <path d="M10 3l8 14H2z"></path>
                  <path d="M10 8.5v3.5M10 14.5h.01"></path>
                </svg>
                <span style={{ display: "flex", flexDirection: "column", gap: "2px", lineHeight: "19px" }}>
                  <span style={{ fontWeight: "600", color: $v.b?.instrFg }}>
                    {__h($v.b?.instrTitle)}
                  </span>
                  <span style={{ fontSize: "13px" }}>
                    {__h($v.b?.instr)}
                  </span>
                </span>
              </div>
            ) : null}
            <div className="bolo-cols" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 360px", gap: "24px", alignItems: "start" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px", minWidth: "0" }}>
                {$v.b?.notEv ? (
                  <div>
                    {" "}
                    <div style={{ display: "flex", alignItems: "baseline", gap: "8px", margin: "0 0 8px 4px" }}>
                      <span style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                        {"Приметы"}
                      </span>
                    </div>
                    {" "}
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "14px 16px", borderRadius: "12px", background: $v.c?.card }}>
                      <span style={{ fontSize: "13px", lineHeight: "20px" }}>
                        {__a($v.b?.descP).map((qp: any, $i0: number) => (
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
                      <span style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {__a($v.b?.tags).map((tg: any, $i0: number) => (
                          <Fragment key={$i0}>
                            <span className="chip" style={{ fontWeight: "400", background: $v.c?.btn }}>
                              {__h(tg?.t)}
                            </span>
                          </Fragment>
                        ))}
                      </span>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "8px", paddingTop: "4px" }}>
                        {__a($v.b?.photos).map((ph: any, $i0: number) => (
                          <Fragment key={$i0}>
                            <button className="btn" title={ph?.cap} onClick={() => $v.__openPhoto($v.b?.photos, $i0)} style={{ display: "block", cursor: "zoom-in" }}>
                              <span style={{ position: "relative", width: "100%", aspectRatio: "4 / 3", borderRadius: "8px", overflow: "hidden", display: "block", background: ph?.bg }}>
                                {" "}
                                {ph?.hasImg ? (
                                  <img src={ph?.img} alt={ph?.cap} style={{ position: "absolute", left: "0", top: "0", width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                                ) : null}
                                {ph?.noImg ? (
                                  <svg width="28" height="28" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ position: "absolute", left: "50%", top: "42%", transform: "translate(-50%, -50%)", color: "rgba(255,255,255,0.45)" }}>
                                    <path d={ph?.icon}></path>
                                  </svg>
                                ) : null}
                                {" "}
                                <span className="ell" style={{ position: "absolute", left: "0", right: "0", bottom: "0", padding: "2px 6px", background: "rgba(0,0,0,0.55)", color: "#FFFFFF", fontSize: "10px" }}>
                                  {__h(ph?.cap)}
                                </span>
                                {" "}
                              </span>
                            </button>
                          </Fragment>
                        ))}
                        {$v.b?.open ? (
                          <button className="btn hv" onClick={$v.addPhoto} style={{ aspectRatio: "4 / 3", borderRadius: "8px", border: `1px dashed ${__s($v.c?.stroke2)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", color: $v.c?.text2, fontSize: "12px" }}>
                            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <path d="M3 6.5h3l1.5-2h5l1.5 2h3v10H3z"></path>
                              <circle cx="10" cy="11" r="3"></circle>
                            </svg>
                            {" Добавить фото "}
                          </button>
                        ) : null}
                      </div>
                    </div>
                    {" "}
                  </div>
                ) : null}
                {$v.b?.isEv ? (
                  <>
                  <div>
                    {" "}
                    <div style={{ display: "flex", alignItems: "baseline", gap: "8px", margin: "0 0 8px 4px" }}>
                      <span style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                        {__h($v.b?.evTitle)}
                      </span>
                    </div>
                    {" "}
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "14px 16px", borderRadius: "12px", background: $v.c?.card, fontSize: "13px", lineHeight: "20px" }}>
                      {__a($v.b?.evParas).map((pa: any, $i0: number) => (
                        <Fragment key={$i0}>
                          <span>
                            {__h(pa?.t)}
                          </span>
                        </Fragment>
                      ))}
                    </div>
                    {" "}
                  </div>
                  {$v.b?.evHasRecs ? (
                    <div>
                      {" "}
                      <div style={{ display: "flex", alignItems: "baseline", gap: "8px", margin: "0 0 8px 4px" }}>
                        <span style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                          {__h($v.b?.evRecTitle)}
                        </span>
                      </div>
                      {" "}
                      <div style={{ padding: "4px 14px", borderRadius: "12px", background: $v.c?.card }}>
                        {" "}
                        {__a($v.b?.evRecs).map((rc: any, $i0: number) => (
                          <Fragment key={$i0}>
                            <div style={{ display: "flex", gap: "12px", padding: "9px 0", borderBottom: `1px solid ${__s(rc?.sep)}`, fontSize: "13px", lineHeight: "19px" }}>
                              <span className="num" style={{ width: "20px", flexShrink: "0", fontWeight: "700", color: $v.T?.red }}>
                                {__h(rc?.n)}
                              </span>
                              <span>
                                {__h(rc?.t)}
                              </span>
                            </div>
                          </Fragment>
                        ))}
                        {" "}
                      </div>
                      {" "}
                    </div>
                  ) : null}
                  </>
                ) : null}
                {$v.b?.notEv ? (
                  <div>
                    {" "}
                    <div style={{ display: "flex", alignItems: "baseline", gap: "8px", margin: "0 0 8px 4px" }}>
                      <span style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                        {"Где замечен"}
                      </span>
                      <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                        {__h($v.b?.seenCount)}
                      </span>
                    </div>
                    {" "}
                    <div style={{ padding: "14px 16px", borderRadius: "12px", background: $v.c?.card }}>
                      {" "}
                      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        <div style={{ position: "relative", width: "100%", height: "220px", flexShrink: "0", borderRadius: "10px", overflow: "hidden", background: $v.c?.mapWater }}>
                          <BoloTerrain $v={$v} mode="thumb" pts={$v.b?.pins}>
                            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none' }}>
                              <polyline points={$v.b?.trail} fill="none" stroke={$v.b?.trailColor} strokeWidth="4" strokeDasharray="8 6" vectorEffect="non-scaling-stroke"></polyline>
                            </svg>
                            {__a($v.b?.pins).map((p: any, $i0: number) => (
                              <Fragment key={$i0}>
                                {" "}
                                <span style={{ position: "absolute", left: p?.x, top: p?.y, width: p?.s, height: p?.s, transform: "translate(-50%, -50%)", borderRadius: "50%", background: p?.bg, border: `2px solid ${__s($v.c?.card)}`, boxShadow: `0 0 0 ${__s(p?.halo)} ${__s(p?.haloC)}`, display: "flex", alignItems: "center", justifyContent: "center", color: "#000000", fontSize: "10px", fontWeight: "700" }}>
                                  {__h(p?.n)}
                                </span>
                                {" "}
                              </Fragment>
                            ))}
                          </BoloTerrain>
                        </div>
                        <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column" }}>
                          {__a($v.b?.seen).map((s: any, $i0: number) => (
                            <Fragment key={$i0}>
                              <div style={{ display: "flex", gap: "10px" }}>
                                <span style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "20px" }}>
                                  <span style={{ width: "20px", height: "20px", flexShrink: "0", borderRadius: "50%", background: s?.dot, color: "#000000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "700" }}>
                                    {__h(s?.n)}
                                  </span>
                                  <span style={{ flex: "1", width: "1.5px", minHeight: "10px", background: s?.line }}></span>
                                </span>
                                <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "2px", paddingBottom: "12px", lineHeight: "18px" }}>
                                  <span style={{ display: "flex", gap: "8px", alignItems: "baseline" }}>
                                    <span style={{ fontWeight: "600" }}>
                                      {__h(s?.place)}
                                    </span>
                                    <span className="num" style={{ fontSize: "12px", color: $v.c?.text2 }}>
                                      {__h(s?.when)}
                                    </span>
                                    <button className="btn hv" onClick={() => $v.__seenDel(s)} aria-label={"Удалить отметку " + s?.n} title="Удалить отметку" style={{ marginLeft: "auto", flexShrink: "0", width: "24px", height: "24px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", color: $v.c?.text2 }}>
                                      <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 6h12M8 6V4h4v2M6 6l1 10h6l1-10" /></svg>
                                    </button>
                                  </span>
                                  <span style={{ fontSize: "13px", color: $v.c?.text2 }}>
                                    {__a(s?.textP).map((qp: any, $i1: number) => (
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
                                  <button className="btn lnk" onClick={s?.go} style={{ alignSelf: "flex-start", fontSize: "12px", color: $v.c?.link }}>
                                    {__h(s?.who)}
                                  </button>
                                </span>
                              </div>
                            </Fragment>
                          ))}
                        </div>
                      </div>
                      {" "}
                    </div>
                    {" "}
                  </div>
                ) : null}
                <div>
                  {" "}
                  <div style={{ display: "flex", alignItems: "baseline", gap: "8px", margin: "0 0 8px 4px" }}>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                      {"История изменений"}
                    </span>
                  </div>
                  {" "}
                  <div style={{ padding: "14px 16px 4px 16px", borderRadius: "12px", background: $v.c?.card }}>
                    {" "}
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {__a($v.b?.hist).map((h: any, $i0: number) => (
                        <Fragment key={$i0}>
                          <div style={{ display: "flex", gap: "12px" }}>
                            <span style={{ width: "10px", flexShrink: "0", display: "flex", flexDirection: "column", alignItems: "center" }}>
                              <span style={{ width: "8px", height: "8px", marginTop: "6px", borderRadius: "50%", background: h?.dot }}></span>
                              <span style={{ flex: "1", width: "1px", background: h?.line }}></span>
                            </span>
                            <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", paddingBottom: "10px", lineHeight: "19px" }}>
                              <span style={{ fontSize: "13px" }}>
                                {__h(h?.what)}
                              </span>
                              <span className="num" style={{ fontSize: "12px", color: $v.c?.text2 }}>
                                {__h(h?.when)}{" · "}{__h(h?.who)}
                              </span>
                            </span>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                    {" "}
                  </div>
                  {" "}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px", minWidth: "0" }}>
                <div>
                  {" "}
                  <div style={{ display: "flex", alignItems: "baseline", gap: "8px", margin: "0 0 8px 4px" }}>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                      {"Сведения"}
                    </span>
                  </div>
                  {" "}
                  <div style={{ padding: "0 14px", borderRadius: "12px", background: $v.c?.card }}>
                    {" "}
                    {__a($v.b?.facts).map((f: any, $i0: number) => (
                      <Fragment key={$i0}>
                        {" "}
                        <div style={{ display: "flex", gap: "12px", padding: "10px 0", borderBottom: `1px solid ${__s(f?.sep)}`, fontSize: "13px" }}>
                          <span style={{ width: "118px", flexShrink: "0", color: $v.c?.text2 }}>
                            {__h(f?.k)}
                          </span>
                          <span style={{ flex: "1", minWidth: "0", textAlign: "right", lineHeight: "18px" }}>
                            {" "}
                            {f?.isLink ? (
                              <button className="btn lnk" onClick={f?.go} style={{ font: "inherit", color: $v.c?.link, textAlign: "right" }}>
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
                            {" "}
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
                            {" "}
                          </span>
                        </div>
                        {" "}
                      </Fragment>
                    ))}
                    {" "}
                  </div>
                  {" "}
                </div>
                {$v.b?.notEv ? (
                  <div>
                    {" "}
                    <div style={{ display: "flex", alignItems: "baseline", gap: "8px", margin: "0 0 8px 4px" }}>
                      <span style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                        {"Статья Penal Code"}
                      </span>
                    </div>
                    {" "}
                    <div style={{ padding: "12px 14px", borderRadius: "12px", background: $v.c?.card }}>
                      {" "}
                      {$v.b?.hasPc ? (
                        <>
                        {" "}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          {__a($v.b?.pcs).map((p: any, $i0: number) => (
                            <Fragment key={$i0}>
                              <a href="#" onClick={$v.__go("Laws.dc.html")} className="lnk" style={{ display: "flex", alignItems: "baseline", gap: "8px", minWidth: "0", textDecoration: "none", color: $v.c?.text }}>
                                <span className="num" style={{ flexShrink: "0", fontWeight: "700", color: $v.c?.link, whiteSpace: "nowrap" }}>
                                  {__h(p?.n)}
                                </span>
                                <span className="ell" style={{ fontSize: "13px" }}>
                                  {__h(p?.t)}
                                </span>
                              </a>
                            </Fragment>
                          ))}
                        </div>
                        {" "}
                        </>
                      ) : null}
                      {" "}
                      {$v.b?.noPc ? (
                        <span style={{ fontSize: "13px", color: $v.c?.text2 }}>
                          {__h($v.b?.noPcText)}
                        </span>
                      ) : null}
                      {" "}
                    </div>
                    {" "}
                  </div>
                ) : null}
                <div>
                  {" "}
                  <div style={{ display: "flex", alignItems: "baseline", gap: "8px", margin: "0 0 8px 4px" }}>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                      {"С кем связаться"}
                    </span>
                  </div>
                  {" "}
                  <div style={{ padding: "12px 14px", borderRadius: "12px", background: $v.c?.card }}>
                    {" "}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", lineHeight: "18px" }}>
                        <span className="lnk ell" style={{ fontWeight: "600", color: $v.c?.link }}>
                          {__h($v.b?.ctName)}
                        </span>
                        <span className="ell" style={{ fontSize: "12px", color: $v.c?.text2 }}>
                          <span className="num" style={{ color: $v.c?.text }}>
                            {__h($v.b?.ctPhone)}
                          </span>
                          {" · "}{__h($v.b?.ctRole)}
                        </span>
                      </span>
                      <a href="#" onClick={$v.__go("MailList.dc.html")} className="btn hv" style={{ flexShrink: "0", height: "28px", padding: "0 10px", borderRadius: "6px", display: "flex", alignItems: "center", gap: "6px", background: $v.c?.btn, color: $v.c?.text, fontSize: "13px", textDecoration: "none", whiteSpace: "nowrap" }}>
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <rect x="2.5" y="4.5" width="15" height="11" rx="1.5"></rect>
                          <path d="M3 5.5l7 5.5 7-5.5"></path>
                        </svg>
                        {"Написать"}
                      </a>
                    </div>
                    {" "}
                  </div>
                  {" "}
                </div>
                {$v.b?.hasLinks ? (
                  <div>
                    {" "}
                    <div style={{ display: "flex", alignItems: "baseline", gap: "8px", margin: "0 0 8px 4px" }}>
                      <span style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                        {"Связано"}
                      </span>
                    </div>
                    {" "}
                    <div style={{ padding: "0 14px", borderRadius: "12px", background: $v.c?.card }}>
                      {" "}
                      {__a($v.b?.links).map((l: any, $i0: number) => (
                        <Fragment key={$i0}>
                          {" "}
                          <button className="btn hv" onClick={l?.go} style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderBottom: `1px solid ${__s(l?.sep)}`, fontSize: "13px", textAlign: "left" }}>
                            <span style={{ width: "96px", flexShrink: "0", color: $v.c?.text2 }}>
                              {__h(l?.k)}
                            </span>
                            <span className="lnk" style={{ flex: "1", minWidth: "0", textAlign: "right", color: $v.c?.link }}>
                              {__a(l?.vP).map((qp: any, $i1: number) => (
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
                          </button>
                          {" "}
                        </Fragment>
                      ))}
                      {" "}
                    </div>
                    {" "}
                  </div>
                ) : null}
                <div>
                  {" "}
                  <div style={{ display: "flex", alignItems: "baseline", gap: "8px", margin: "0 0 8px 4px" }}>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                      {"Ознакомились"}
                    </span>
                  </div>
                  {" "}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: "12px", padding: "12px 14px", borderRadius: "12px", background: $v.c?.card }}>
                    <span style={{ flex: "1", display: "flex", flexDirection: "column", gap: "8px" }}>
                      <span style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                        <span className="num" style={{ fontSize: "13px", color: $v.c?.text2 }}>
                          {__h($v.b?.ackText)}
                        </span>
                      </span>
                      <span style={{ height: "6px", borderRadius: "3px", background: $v.c?.track, overflow: "hidden" }}>
                        <span style={{ display: "block", width: $v.b?.ackPct, height: "100%", background: $v.T?.green }}></span>
                      </span>
                      <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                        {__h($v.b?.meta)}
                      </span>
                    </span>
                    {$v.b?.needAck ? (
                      <button data-ack-inline="" className="btn acc" onClick={$v.ack} style={{ alignSelf: "flex-start", height: "34px", padding: "0 16px", borderRadius: "6px", background: $v.c?.btn, fontWeight: "600" }}>
                        {"Ознакомлен"}
                      </button>
                    ) : null}
                    {$v.b?.acked ? (
                      <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: $v.T?.green }}>
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M4 10.5l3.5 3.5L16 5.5"></path>
                        </svg>
                        {__h($v.b?.ackedText)}
                      </span>
                    ) : null}
                  </div>
                  {" "}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
