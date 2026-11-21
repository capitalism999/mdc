/* Generated 1:1 from the design reference (project/Search.dc.html) — markup, styles and copy are a literal port. */
import { Fragment } from 'react'
import { personPhoto } from '../../shared/personPhotos'
import { __a, __css, __h, __s, type SearchVals } from '../searchRuntime'

export function EmployeeRecord({ $v }: { $v: SearchVals }) {
  if (!$v.rec?.isEmp) return null
  return (
    <>
      {" "}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "1180px" }}>
        <div style={{ display: "flex", gap: "20px", alignItems: "stretch" }}>
          <div style={{ position: "relative", width: "170px", minHeight: "170px", flexShrink: "0", borderRadius: "12px", overflow: "hidden", backgroundColor: $v.c?.mug, backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent 17px, ${__s($v.c?.mugLine)} 17px, ${__s($v.c?.mugLine)} 18px)` }}>
            {" "}
            <img src={personPhoto($v.rec?.id)} alt="Фото" style={{ position: "absolute", left: "0", top: "0", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 12%", display: "block" }} />
            {" "}
          </div>
          <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "6px", paddingBottom: "2px" }}>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {__a($v.p?.status).map((st: any, $i0: number) => (
                <Fragment key={$i0}>
                  <span style={{ padding: "2px 10px", borderRadius: "10px", fontSize: "12px", fontWeight: "600", background: st?.bg, color: st?.fg, whiteSpace: "nowrap" }}>
                    {__h(st?.text)}
                  </span>
                </Fragment>
              ))}
            </div>
            <h1 style={{ margin: "0", fontSize: "30px", lineHeight: "38px", fontWeight: "700", letterSpacing: "-0.2px" }}>
              {__h($v.p?.fullName)}
            </h1>
            <div style={{ color: $v.c?.text2 }}>
              {__h($v.p?.rankLine)}
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
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {__a($v.p?.orgLinks).map((ol: any, $i0: number) => (
                <Fragment key={$i0}>
                  <button className="btn lnk" onClick={ol?.go} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: $v.c?.link, textDecoration: "underline", textDecorationColor: $v.c?.linkLine, textUnderlineOffset: "3px", whiteSpace: "nowrap" }}>
                    {ol?.hasLogo ? (
                      <img src={ol?.logo} alt="" width="22" height="22" style={{ width: "22px", height: "22px", objectFit: "contain", display: "block", flexShrink: "0" }} />
                    ) : null}
                    {__h(ol?.name)}
                  </button>
                </Fragment>
              ))}
            </div>
            {$v.p?.hasAwards ? (
              <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginTop: "2px" }}>
                {__a($v.p?.awards).map((aw: any, $i0: number) => (
                  <Fragment key={$i0}>
                    <span title={aw?.name} style={{ display: "flex", alignItems: "center" }}>
                      {aw?.isMed ? (
                        <svg width="16" height="23" viewBox="0 0 28 40" aria-hidden="true" style={{ flexShrink: "0" }}>
                          <rect x="4" y="0" width="10" height="17" fill={aw?.c1}></rect>
                          <rect x="14" y="0" width="10" height="17" fill={aw?.c2}></rect>
                          <circle cx="14" cy="28" r="10" fill="#D4AF37" stroke="#A8832A" strokeWidth="1.5"></circle>
                          <circle cx="14" cy="28" r="6" fill="none" stroke="#F3DE8A" strokeWidth="1.5"></circle>
                        </svg>
                      ) : null}
                      {aw?.isRib ? (
                        <svg width="35" height="13" viewBox="0 0 44 16" aria-hidden="true" style={{ flexShrink: "0" }}>
                          <rect x="0" y="0" width="15" height="16" fill={aw?.c1}></rect>
                          <rect x="15" y="0" width="14" height="16" fill={aw?.c2}></rect>
                          <rect x="29" y="0" width="15" height="16" fill={aw?.c3}></rect>
                          <rect x="0.5" y="0.5" width="43" height="15" fill="none" stroke="rgba(255,255,255,0.18)"></rect>
                        </svg>
                      ) : null}
                    </span>
                  </Fragment>
                ))}
              </div>
            ) : null}
            <div style={{ display: "flex", gap: "8px", alignItems: "flex-start", paddingTop: "8px" }}>
              <button className="btn hv" onClick={$v.dl?.call} style={{ height: "34px", padding: "0 14px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", background: $v.c?.btn }}>
                <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                  <path d="M4 3.5h3l1.5 4-2 1.5a10 10 0 005 5l1.5-2 4 1.5v3a1.5 1.5 0 01-1.5 1.5A14 14 0 012.5 5 1.5 1.5 0 014 3.5z"></path>
                </svg>
                {"Позвонить · "}{__h($v.p?.phone)}
              </button>
              <a href="#" onClick={$v.__go("MailEmp")} className="hv" style={{ height: "34px", padding: "0 14px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", background: $v.c?.btn, textDecoration: "none", color: "inherit" }}>
                <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                  <rect x="2.5" y="4.5" width="15" height="11" rx="2"></rect>
                  <path d="M3 6l7 5 7-5"></path>
                </svg>
                {"Написать"}
              </a>
              <button className="btn hv" onClick={$v.dl?.mark} style={{ height: "34px", padding: "0 14px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", background: $v.c?.btn }}>
                <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                  <path d="M5 2.5h7l3 3v12H5z"></path>
                  <path d="M12 2.5v3h3M7.5 11h5M10 8.5v5"></path>
                </svg>
                {"Внести в личное дело"}
              </button>
              <div style={{ position: "relative" }}>
                {" "}
                <button className="btn hv" onClick={$v.menuToggle} aria-label="Ещё действия" style={{ height: "34px", width: "38px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", background: $v.c?.btn }}>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <circle cx="4.5" cy="10" r="1.6"></circle>
                    <circle cx="10" cy="10" r="1.6"></circle>
                    <circle cx="15.5" cy="10" r="1.6"></circle>
                  </svg>
                </button>
                {" "}
                {$v.menuOpen ? (
                  <>
                  {" "}
                  <div style={{ position: "absolute", right: "0", top: "40px", zIndex: "5", width: "250px", padding: "4px", borderRadius: "10px", background: $v.c?.card, border: `1px solid ${__s($v.c?.stroke)}`, boxShadow: "0 8px 24px rgba(0,0,0,0.45)", display: "flex", flexDirection: "column" }}>
                    <button className="btn hv" onClick={$v.dl?.print} style={{ height: "36px", padding: "0 12px", borderRadius: "6px", width: "100%", boxSizing: "border-box", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", textAlign: "left", color: "inherit" }}>
                      <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                        <path d="M5.5 7.5V3h9v4.5"></path>
                        <rect x="2.5" y="7.5" width="15" height="7" rx="1.5"></rect>
                        <path d="M5.5 12h9v5h-9z"></path>
                      </svg>
                      {"Распечатать личное дело"}
                    </button>
                    {$v.tg?.canEdit ? (
                    <>
                    <button className="btn hv" onClick={$v.tg?.edit} style={{ height: "36px", padding: "0 12px", borderRadius: "6px", width: "100%", boxSizing: "border-box", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", textAlign: "left", color: "inherit" }}>
                      <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true" style={{ flexShrink: "0", marginRight: "10px" }}>
                        <path d="M3 17l1-4L14 3l3 3L7 16zM12 5l3 3"></path>
                      </svg>
                      {"Изменить данные"}
                    </button>
                    </>
                    ) : null}
                    <button className="btn hv" onClick={$v.dl?.showHist} style={{ height: "36px", padding: "0 12px", borderRadius: "6px", width: "100%", boxSizing: "border-box", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", textAlign: "left", color: "inherit" }}>
                      <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                        <circle cx="10" cy="10" r="7"></circle>
                        <path d="M10 6v4l3 2"></path>
                      </svg>
                      {"История изменений"}
                    </button>
                    <div style={{ height: "1px", margin: "4px 8px", background: $v.c?.stroke }}></div>
                    <div style={{ padding: "6px 12px 2px", fontSize: "11px", fontWeight: "600", letterSpacing: "0.4px", textTransform: "uppercase", color: $v.c?.text2 }}>
                      {"Администрирование"}
                    </div>
                    <button className="btn hv" onClick={$v.dl?.rank} style={{ height: "36px", padding: "0 12px", borderRadius: "6px", width: "100%", boxSizing: "border-box", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", textAlign: "left", color: "inherit" }}>
                      <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                        <path d="M10 3l2 4.5 5 .6-3.7 3.4 1 5L10 14l-4.3 2.5 1-5L3 8.1l5-.6z"></path>
                      </svg>
                      {"Изменить ранг"}
                    </button>
                    <button className="btn hv" onClick={$v.dl?.jdel} style={{ height: "36px", padding: "0 12px", borderRadius: "6px", width: "100%", boxSizing: "border-box", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", textAlign: "left", color: "inherit" }}>
                      <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                        <path d="M4 5.5h12M8 5.5V3.5h4v2M5.5 5.5l.7 11h7.6l.7-11M8.5 9v4.5M11.5 9v4.5"></path>
                      </svg>
                      {"Удалить запись из дела"}
                    </button>
                    <button className="btn hv" onClick={$v.dl?.susp} style={{ height: "36px", padding: "0 12px", borderRadius: "6px", width: "100%", boxSizing: "border-box", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", textAlign: "left", color: "inherit" }}>
                      <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                        <circle cx="10" cy="10" r="7"></circle>
                        <path d="M5 5l10 10"></path>
                      </svg>
                      {"Отстранить от службы"}
                    </button>
                  </div>
                  {" "}
                  </>
                ) : null}
                {" "}
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.75fr) minmax(0, 1fr)", gap: "20px", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", minWidth: "0" }}>
            <div>
              {" "}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "0 0 8px 4px" }}>
                <span style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                  {"Табель дежурств"}
                </span>
                <span style={{ flex: "1" }}></span>
                {__a($v.p?.perChips).map((ch: any, $i0: number) => (
                  <Fragment key={$i0}>
                    <button className="btn pb" onClick={ch?.pick} style={{ height: "28px", padding: "0 12px", borderRadius: "14px", fontSize: "12px", background: ch?.bg, color: ch?.fg }}>
                      {__h(ch?.label)}
                    </button>
                  </Fragment>
                ))}
              </div>
              {" "}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: "8px", marginBottom: "8px" }}>
                {__a($v.p?.tiles).map((tl: any, $i0: number) => (
                  <Fragment key={$i0}>
                    <div style={{ borderRadius: "12px", background: $v.c?.card, padding: "12px 14px", display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span style={{ fontSize: "24px", lineHeight: "30px", fontWeight: "700", whiteSpace: "nowrap" }}>
                        {__h(tl?.v)}
                      </span>
                      <span style={{ fontSize: "12px", color: $v.c?.text2, whiteSpace: "nowrap" }}>
                        {__h(tl?.k)}
                      </span>
                    </div>
                  </Fragment>
                ))}
              </div>
              {" "}
              <div style={{ borderRadius: "12px", background: $v.c?.card, overflow: "hidden" }}>
                {" "}
                <div className="scroll" style={__css($v.p?.dutyBox)}>
                  {" "}
                  {__a($v.p?.duty).map((du: any, $i0: number) => (
                    <Fragment key={$i0}>
                      {" "}
                      <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "10px 16px", borderBottom: `1px solid ${__s($v.c?.stroke)}`, fontSize: "13px" }}>
                        <span style={{ width: "44px", flexShrink: "0", color: $v.c?.text2 }}>
                          {__h(du?.date)}
                        </span>
                        <span style={{ flex: "1", minWidth: "0" }}>
                          {__h(du?.what)}
                        </span>
                        <span style={{ color: $v.c?.text2, whiteSpace: "nowrap" }}>
                          {__h(du?.time)}
                        </span>
                        <span style={{ width: "74px", textAlign: "right", fontWeight: "600", whiteSpace: "nowrap" }}>
                          {__h(du?.len)}
                        </span>
                      </div>
                      {" "}
                    </Fragment>
                  ))}
                  {" "}
                </div>
                {" "}
                {$v.p?.dutyMore ? (
                  <>
                  {" "}
                  <button className="btn hv" onClick={$v.p?.dutyToggle} style={{ width: "100%", height: "38px", fontSize: "13px", textAlign: "center", color: $v.c?.link }}>
                    {__h($v.p?.dutyBtn)}
                  </button>
                  {" "}
                  </>
                ) : null}
                {" "}
              </div>
              {" "}
            </div>
            <div>
              {" "}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "0 0 8px 4px" }}>
                <span style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                  {"Журнал личного дела · "}{__h($v.p?.jrCount)}
                </span>
                <span style={{ flex: "1" }}></span>
                <button className="btn lnk" onClick={$v.dl?.mark} style={{ fontSize: "12px", color: $v.c?.link }}>
                  {"Создать запись"}
                </button>
              </div>
              {" "}
              <div style={{ display: "flex", gap: "6px", margin: "0 0 8px 0", flexWrap: "wrap" }}>
                {__a($v.p?.jrChips).map((ch: any, $i0: number) => (
                  <Fragment key={$i0}>
                    <button className="btn pb" onClick={ch?.pick} style={{ height: "28px", padding: "0 12px", borderRadius: "14px", fontSize: "12px", background: ch?.bg, color: ch?.fg, whiteSpace: "nowrap" }}>
                      {__h(ch?.label)}{" "}{__h(ch?.count)}
                    </button>
                  </Fragment>
                ))}
              </div>
              {" "}
              <div style={{ borderRadius: "12px", background: $v.c?.card, overflow: "hidden" }}>
                {" "}
                {__a($v.p?.journal).map((jr: any, $i0: number) => (
                  <Fragment key={$i0}>
                    {" "}
                    <div style={{ display: "flex", gap: "14px", padding: "12px 16px", borderBottom: `1px solid ${__s($v.c?.stroke)}` }}>
                      <span style={{ width: "34px", height: "34px", flexShrink: "0", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", background: jr?.bg, color: jr?.fg }}>
                        <svg width="17" height="17" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                          <path d={jr?.icon}></path>
                        </svg>
                      </span>
                      <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "2px", lineHeight: "19px" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "14px", fontWeight: "600" }}>
                            {__h(jr?.title)}
                          </span>
                          <span style={{ padding: "0 8px", borderRadius: "10px", fontSize: "11px", fontWeight: "600", background: jr?.bg, color: jr?.fg, whiteSpace: "nowrap" }}>
                            {__h(jr?.kind)}
                          </span>
                          <span style={{ flex: "1" }}></span>
                        </span>
                        <span style={{ fontSize: "13px" }}>
                          {__h(jr?.text)}
                        </span>
                        <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                          {__h(jr?.date)}{" · "}
                          {jr?.link ? (
                            <button className="btn lnk" onClick={jr?.go} style={{ font: "inherit", color: $v.c?.link }}>
                              {__h(jr?.who)}
                            </button>
                          ) : null}
                          {jr?.plain ? (
                            <span>
                              {__h(jr?.who)}
                            </span>
                          ) : null}
                          {jr?.vis ? (
                            <span>
                              {" · видна другим организациям"}
                            </span>
                          ) : null}
                        </span>
                      </span>
                    </div>
                    {" "}
                  </Fragment>
                ))}
                {" "}
                {$v.p?.noJournal ? (
                  <>
                  {" "}
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "20px", background: "#1E3A24", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#6CCB5F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4.5 10.5l3.5 3.5 7.5-8"></path>
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: "600" }}>
                        {"Записей нет"}
                      </div>
                      <div style={{ fontSize: "12px", color: $v.c?.text2, marginTop: "2px" }}>
                        {"В этой категории личное дело пусто"}
                      </div>
                    </div>
                  </div>
                  {" "}
                  </>
                ) : null}
                {" "}
              </div>
              {" "}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", minWidth: "0" }}>
            <div>
              {" "}
              <div style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2, margin: "0 0 8px 4px" }}>
                {"Служба"}
              </div>
              {" "}
              <div style={{ borderRadius: "12px", background: $v.c?.card, padding: "0 14px" }}>
                {" "}
                {__a($v.p?.service).map((rw: any, $i0: number) => (
                  <Fragment key={$i0}>
                    {" "}
                    <div style={{ display: "flex", gap: "12px", padding: "10px 0", borderBottom: `1px solid ${__s($v.c?.stroke)}`, fontSize: "13px" }}>
                      <span style={{ width: "108px", flexShrink: "0", color: $v.c?.text2 }}>
                        {__h(rw?.k)}
                      </span>
                      <span style={{ flex: "1", minWidth: "0", textAlign: "right" }}>
                        {" "}
                        {rw?.link ? (
                          <button className="btn lnk" onClick={rw?.go} style={{ fontSize: "13px", color: $v.c?.link }}>
                            {__h(rw?.v)}
                          </button>
                        ) : null}
                        {" "}
                        {rw?.plain ? (
                          <span>
                            {__h(rw?.v)}
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
            <div>
              {" "}
              <div style={{ display: "flex", alignItems: "center", margin: "0 0 8px 4px" }}>
                <span style={{ flex: "1", fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                  {"Квалификации · "}{__h($v.p?.certCount)}
                </span>
                <button className="btn lnk" onClick={$v.qlToggle} style={{ fontSize: "12px", color: $v.c?.link }}>
                  {__h($v.qlBtn)}
                </button>
              </div>
              {" "}
              {$v.qlAdding ? (
                <>
                {" "}
                <div style={{ borderRadius: "12px", background: $v.c?.card, padding: "12px 14px", marginBottom: "8px", display: "flex", flexDirection: "column", gap: "10px", boxShadow: `inset 0 0 0 1px ${__s($v.c?.link)}` }}>
                  <input type="text" value={__s($v.qlName)} onChange={$v.qlSetName} placeholder="Название, например: AR-15" aria-label="Название квалификации" style={{ height: "36px", boxSizing: "border-box", padding: "0 12px", borderRadius: "8px", border: "0", background: $v.c?.search, fontSize: "13px", color: $v.c?.text }} />
                  <input type="text" value={__s($v.qlNote)} onChange={$v.qlSetNote} placeholder="Срок или комментарий, например: до 12.2027" aria-label="Срок или комментарий" style={{ height: "36px", boxSizing: "border-box", padding: "0 12px", borderRadius: "8px", border: "0", background: $v.c?.search, fontSize: "13px", color: $v.c?.text }} />
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                    <button className="btn hv" onClick={$v.qlToggle} style={{ height: "30px", padding: "0 14px", borderRadius: "6px", fontSize: "13px", background: $v.c?.btn }}>
                      {"Отмена"}
                    </button>
                    <button className="btn pb" onClick={$v.qlSave} style={{ height: "30px", padding: "0 14px", borderRadius: "6px", fontSize: "13px", fontWeight: "600", background: "#60CDFF", color: "#0B2B3A" }}>
                      {"Добавить"}
                    </button>
                  </div>
                </div>
                {" "}
                </>
              ) : null}
              {" "}
              <div style={{ borderRadius: "12px", background: $v.c?.card, padding: "0 14px" }}>
                {" "}
                {__a($v.p?.certs).map((ce: any, $i0: number) => (
                  <Fragment key={$i0}>
                    {" "}
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px", padding: "10px 0", borderBottom: `1px solid ${__s($v.c?.stroke)}`, lineHeight: "18px" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ flex: "1", minWidth: "0", fontSize: "13px" }}>
                          {__h(ce?.name)}
                        </span>
                        <span style={{ padding: "1px 8px", borderRadius: "10px", fontSize: "11px", fontWeight: "600", background: ce?.bg, color: ce?.fg, whiteSpace: "nowrap" }}>
                          {__h(ce?.tag)}
                        </span>
                      </span>
                      <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                        {"Добавил(а): "}
                        {ce?.link ? (
                          <button className="btn lnk" onClick={ce?.go} style={{ font: "inherit", color: $v.c?.link }}>
                            {__h(ce?.who)}
                          </button>
                        ) : null}
                        {ce?.plain ? (
                          <span>
                            {__h(ce?.who)}
                          </span>
                        ) : null}
                        {" · "}{__h(ce?.date)}
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
                {"Награды · "}{__h($v.p?.awCount)}
              </div>
              {" "}
              <div style={{ borderRadius: "12px", background: $v.c?.card, padding: "0 14px" }}>
                {" "}
                {$v.p?.noAwards ? (
                  <div style={{ padding: "14px 0", fontSize: "13px", color: $v.c?.text2 }}>
                    {"Наград пока нет"}
                  </div>
                ) : null}
                {" "}
                {__a($v.p?.awards).map((aw: any, $i0: number) => (
                  <Fragment key={$i0}>
                    {" "}
                    <div style={{ display: "flex", gap: "12px", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${__s($v.c?.stroke)}` }}>
                      <div style={{ width: "44px", display: "flex", justifyContent: "center", flexShrink: "0" }}>
                        {aw?.isMed ? (
                          <svg width="28" height="40" viewBox="0 0 28 40" aria-hidden="true" style={{ flexShrink: "0" }}>
                            <rect x="4" y="0" width="10" height="17" fill={aw?.c1}></rect>
                            <rect x="14" y="0" width="10" height="17" fill={aw?.c2}></rect>
                            <circle cx="14" cy="28" r="10" fill="#D4AF37" stroke="#A8832A" strokeWidth="1.5"></circle>
                            <circle cx="14" cy="28" r="6" fill="none" stroke="#F3DE8A" strokeWidth="1.5"></circle>
                          </svg>
                        ) : null}
                        {aw?.isRib ? (
                          <svg width="44" height="16" viewBox="0 0 44 16" aria-hidden="true" style={{ flexShrink: "0" }}>
                            <rect x="0" y="0" width="15" height="16" fill={aw?.c1}></rect>
                            <rect x="15" y="0" width="14" height="16" fill={aw?.c2}></rect>
                            <rect x="29" y="0" width="15" height="16" fill={aw?.c3}></rect>
                            <rect x="0.5" y="0.5" width="43" height="15" fill="none" stroke="rgba(255,255,255,0.18)"></rect>
                          </svg>
                        ) : null}
                      </div>
                      <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "2px", lineHeight: "18px" }}>
                        <span style={{ fontSize: "13px" }}>
                          {__h(aw?.name)}
                        </span>
                        <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                          {__h(aw?.text)}
                        </span>
                        <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                          {"Представил(а): "}
                          {aw?.link ? (
                            <button className="btn lnk" onClick={aw?.go} style={{ fontSize: "12px", color: $v.c?.link }}>
                              {__h(aw?.who)}
                            </button>
                          ) : null}
                          {aw?.plain ? (
                            <span>
                              {__h(aw?.who)}
                            </span>
                          ) : null}
                          {" · "}{__h(aw?.date)}
                        </span>
                      </div>
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
                {"Снаряжение"}
              </div>
              {" "}
              <div style={{ borderRadius: "12px", background: $v.c?.card, padding: "0 14px" }}>
                {" "}
                {__a($v.p?.gear).map((ge: any, $i0: number) => (
                  <Fragment key={$i0}>
                    {" "}
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 0", borderBottom: `1px solid ${__s($v.c?.stroke)}`, lineHeight: "18px" }}>
                      <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "1px" }}>
                        <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                          {__h(ge?.k)}
                        </span>
                        <span style={{ fontSize: "13px" }}>
                          {__h(ge?.v)}
                        </span>
                      </div>
                      {ge?.hasAct ? (
                        <button className="btn lnk" onClick={ge?.act} style={{ flexShrink: "0", fontSize: "12px", color: $v.c?.link }}>
                          {__h(ge?.actLabel)}
                        </button>
                      ) : null}
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
                {"Дела · "}{__h($v.p?.caseCount)}
              </div>
              {" "}
              <div style={{ borderRadius: "12px", background: $v.c?.card, padding: "0 14px" }}>
                {" "}
                {__a($v.p?.cases).map((cs: any, $i0: number) => (
                  <Fragment key={$i0}>
                    {" "}
                    <div style={{ display: "flex", gap: "12px", padding: "10px 0", borderBottom: `1px solid ${__s($v.c?.stroke)}`, fontSize: "13px" }}>
                      <span style={{ flex: "1", minWidth: "0", color: $v.c?.text2 }}>
                        {__h(cs?.role)}
                        {$v.__caseWhere?.(cs?.no) ? <span className="ell" title={$v.__caseWhere(cs?.no)} style={{ display: "block", fontSize: "12px" }}>{"↳ " + $v.__caseWhere(cs?.no)}</span> : null}
                      </span>
                      <a href="#" onClick={$v.__case(cs?.no)} className="lnk" style={{ fontSize: "13px", color: $v.c?.link }}>
                        {__h(cs?.no)}
                      </a>
                    </div>
                    {" "}
                  </Fragment>
                ))}
                {" "}
                {$v.p?.noCases ? (
                  <div style={{ padding: "12px 0", fontSize: "13px", color: $v.c?.text2 }}>
                    {"Дел нет."}
                  </div>
                ) : null}
                {" "}
              </div>
              {" "}
            </div>
            <div>
              {" "}
              <div style={{ display: "flex", alignItems: "center", margin: "0 0 8px 4px" }}>
                <span style={{ flex: "1", fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                  {"Заметки"}
                </span>
                <button className="btn lnk" onClick={$v.noteToggle} style={{ fontSize: "12px", color: $v.c?.link }}>
                  {__h($v.noteBtn)}
                </button>
              </div>
              {" "}
              {$v.noteAdding ? (
                <>
                {" "}
                <div style={{ borderRadius: "12px", background: $v.c?.card, padding: "12px 14px", marginBottom: "8px", display: "flex", flexDirection: "column", gap: "10px", boxShadow: `inset 0 0 0 1px ${__s($v.c?.link)}` }}>
                  <textarea value={__s($v.noteDraft)} onChange={$v.noteSet} placeholder="Заметка видна всем сотрудникам с доступом к этой записи" aria-label="Текст заметки" style={{ height: "72px", resize: "none", boxSizing: "border-box", padding: "8px 10px", borderRadius: "8px", border: "0", background: $v.c?.search, font: "inherit", fontSize: "13px", lineHeight: "18px", color: $v.c?.text }} />
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                    <button className="btn hv" onClick={$v.noteToggle} style={{ height: "30px", padding: "0 14px", borderRadius: "6px", fontSize: "13px", background: $v.c?.btn }}>
                      {"Отмена"}
                    </button>
                    <button className="btn pb" onClick={$v.noteSave} style={{ height: "30px", padding: "0 14px", borderRadius: "6px", fontSize: "13px", fontWeight: "600", background: "#60CDFF", color: "#0B2B3A" }}>
                      {"Сохранить"}
                    </button>
                  </div>
                </div>
                {" "}
                </>
              ) : null}
              {" "}
              <div style={{ borderRadius: "12px", background: $v.c?.card, overflow: "hidden" }}>
                {" "}
                {__a($v.p?.notes).map((nt: any, $i0: number) => (
                  <Fragment key={$i0}>
                    {" "}
                    <div style={{ display: "flex", gap: "10px", padding: "12px 14px" }}>
                      <span style={{ width: "26px", height: "26px", flexShrink: "0", borderRadius: "50%", background: nt?.color, color: "#FFFFFF", fontSize: "10px", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {__h(nt?.init)}
                      </span>
                      <span style={{ display: "flex", flexDirection: "column", lineHeight: "18px", minWidth: "0" }}>
                        <span style={{ fontSize: "12px" }}>
                          <button onClick={nt?.go} className="btn lnk" style={{ font: "inherit", fontWeight: "600", color: $v.c?.link }}>
                            {__h(nt?.who)}
                          </button>
                          {" "}
                          <span style={{ color: $v.c?.text2 }}>
                            {__h(nt?.when)}
                          </span>
                        </span>
                        <span style={{ fontSize: "13px", overflowWrap: "anywhere" }}>
                          {__a(nt?.textP).map((qp: any, $i1: number) => (
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
                {$v.p?.noNotes ? (
                  <div style={{ padding: "12px 14px", fontSize: "13px", color: $v.c?.text2 }}>
                    {"Заметок пока нет."}
                  </div>
                ) : null}
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
