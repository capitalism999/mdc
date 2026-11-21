/* Generated 1:1 from the design reference (project/Search.dc.html) — markup, styles and copy are a literal port. */
import { Fragment } from 'react'
import { personPhoto } from '../../shared/personPhotos'
import { __a, __h, __s, type SearchVals } from '../searchRuntime'

export function PersonRecord({ $v }: { $v: SearchVals }) {
  if (!$v.rec?.isRich) return null
  return (
    <>
      {" "}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "1180px" }}>
        {$v.rec?.empMark ? (
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "12px", background: "rgba(0,120,212,0.25)", color: "#99D9FF" }}>
            {$v.rec?.empAg?.hasLogo ? (
              <img src={$v.rec?.empAg?.logo} alt="" width="28" height="28" style={{ width: "28px", height: "28px", objectFit: "contain", display: "block" }} />
            ) : null}
            <span style={{ flex: "1", fontWeight: "600" }}>
              {"Сотрудник · "}
              <button onClick={$v.rec?.empAg?.go} className="btn lnk" style={{ font: "inherit", fontWeight: "600", color: "#8FD8FF" }}>
                {__h($v.rec?.empAg?.name)}
              </button>
            </span>
            <a href="#" onClick={$v.__go("Agency")} className="btn lnk" style={{ fontSize: "12px", color: "#8FD8FF", textDecoration: "none" }}>
              {"Открыть в Агентстве"}
            </a>
          </div>
        ) : null}
        {$v.vwNote ? (
          <button type="button" className="btn hv" onClick={$v.__vwToggle} style={{ display: "block", width: "100%", boxSizing: "border-box", padding: "8px 14px", borderRadius: "8px", border: `1px dashed ${__s($v.c?.stroke)}`, fontSize: "12px", color: $v.c?.text2 }}>
            {__h($v.vwNote)}
          </button>
        ) : null}
        {$v.uc?.has ? (
          <div style={{ display: "flex", gap: "14px", padding: "14px 16px", borderRadius: "12px", background: "rgba(138,99,210,0.22)" }}>
            <span style={{ width: "36px", height: "36px", flexShrink: "0", borderRadius: "8px", background: "#7B4FD0", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                <path d="M2.5 10s2.7-5 7.5-5 7.5 5 7.5 5-2.7 5-7.5 5-7.5-5-7.5-5z"></path>
                <circle cx="10" cy="10" r="2.2"></circle>
              </svg>
            </span>
            <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "4px", lineHeight: "19px" }}>
              <span style={{ fontSize: "14px", fontWeight: "700", color: "#D9C2FF" }}>
                {__h($v.uc?.title)}
              </span>
              <span style={{ fontSize: "13px" }}>
                {__h($v.uc?.lead)}{" "}
                <button onClick={$v.uc?.otherGo} className="btn lnk" style={{ font: "inherit", fontWeight: "600", color: $v.c?.link }}>
                  {__h($v.uc?.otherName)}
                </button>
                {". Куратор: "}
                <button onClick={$v.uc?.curGo} className="btn lnk" style={{ font: "inherit", color: $v.c?.link }}>
                  {__h($v.uc?.curName)}
                </button>
              </span>
              <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                {"Группа доступа · "}{__h($v.uc?.groupCount)}{": "}{__h($v.uc?.group)}
              </span>
              <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                {__h($v.uc?.rule)}
              </span>
              <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                {__h($v.uc?.audit)}
              </span>
            </span>
            <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px", flexShrink: "0" }}>
              <button className="btn lnk" onClick={$v.__go("MailCurator")} style={{ fontSize: "12px", color: $v.c?.link }}>
                {"Связаться с куратором"}
              </button>
              <button className="btn lnk" onClick={$v.dl?.showHist} style={{ fontSize: "12px", color: $v.c?.link }}>
                {"Журнал доступа"}
              </button>
              <button className="btn lnk" onClick={$v.__go("Agency")} style={{ fontSize: "12px", color: $v.c?.link }}>
                {"Изменить группу"}
              </button>
            </span>
          </div>
        ) : null}
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
            <div style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.6px", textTransform: "uppercase", color: $v.c?.text2, whiteSpace: "nowrap" }}>
              {__h($v.p?.caption)}{" · "}{__h($v.p?.code)}
            </div>
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
              {$v.tg?.canEdit ? (
                <button className="btn lnk" onClick={$v.tg?.edit} style={{ fontSize: "12px", color: $v.c?.link }}>
                  {"Изменить данные"}
                </button>
              ) : null}
            </div>
            {$v.p?.hasOrgs ? (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingTop: "4px" }}>
                {__a($v.p?.orgLinks).map((ol: any, $i0: number) => (
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
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "flex-start", paddingTop: "8px" }}>
              <button className="btn hv" onClick={$v.dl?.call} style={{ height: "34px", padding: "0 14px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", background: $v.c?.btn }}>
                <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 3.5h3l1.5 4-2 1.5a10 10 0 005 5l1.5-2 4 1.5v3a1.5 1.5 0 01-1.5 1.5A14 14 0 012.5 5 1.5 1.5 0 014 3.5z"></path>
                </svg>
                {"Позвонить · "}{__h($v.p?.phone)}
              </button>
              <a href="#" onClick={$v.__wanted} className="hv" style={{ height: "34px", padding: "0 14px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", background: $v.c?.btn, textDecoration: "none", color: "inherit" }}>
                <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                  <path d="M10 3l8 14H2z"></path>
                  <path d="M10 8.5v3.5M10 14.5v.2"></path>
                </svg>
                {__h($v.__wantedLabel ?? "Объявить в розыск")}
              </a>
              <a href="#" onClick={$v.__toCase} className="hv" style={{ height: "34px", padding: "0 14px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", textDecoration: "none", background: $v.c?.btn }}>
                <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2.5" y="6" width="15" height="10.5" rx="2"></rect>
                  <path d="M7 6V4h6v2M2.5 10.5h15"></path>
                </svg>
                {"Добавить в дело"}
              </a>
              <button className="btn pb" onClick={$v.dl?.sub} style={{ height: "34px", padding: "0 14px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", whiteSpace: "nowrap", background: $v.dl?.subBg, color: $v.dl?.subFg }}>
                <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                  <path d="M5 14V9a5 5 0 0110 0v5l1.5 1.5h-13zM8.5 17.5h3"></path>
                </svg>
                {__h($v.dl?.subLabel)}
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
                    <a href="#" onClick={$v.__go("WarrantsNew")} className="hv" style={{ height: "36px", padding: "0 12px", borderRadius: "6px", width: "100%", boxSizing: "border-box", whiteSpace: "nowrap", background: "transparent", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", textDecoration: "none", color: "inherit" }}>
                      <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                        <path d="M5 2.5h7l3 3v12H5z"></path>
                        <path d="M12 2.5v3h3M7.5 10h5M7.5 13h3"></path>
                      </svg>
                      {"Подать на ордер"}
                    </a>
                    <button className="btn hv" onClick={$v.dl?.fine} style={{ height: "36px", padding: "0 12px", borderRadius: "6px", width: "100%", boxSizing: "border-box", whiteSpace: "nowrap", background: "transparent", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
                      <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                        <rect x="3" y="4" width="14" height="12" rx="2"></rect>
                        <path d="M3 8h14M7 12h3"></path>
                      </svg>
                      {"Выписать штраф"}
                    </button>
                    <button className="btn hv" onClick={$v.dl?.print} style={{ height: "36px", padding: "0 12px", borderRadius: "6px", width: "100%", boxSizing: "border-box", whiteSpace: "nowrap", background: "transparent", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
                      <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                        <path d="M5.5 7.5V3h9v4.5"></path>
                        <rect x="2.5" y="7.5" width="15" height="7" rx="1.5"></rect>
                        <path d="M5.5 12h9v5h-9z"></path>
                      </svg>
                      {"Распечатать"}
                    </button>
                    <div style={{ height: "1px", margin: "4px 8px", background: $v.c?.stroke }}></div>
                    <div style={{ padding: "6px 12px 2px", fontSize: "11px", fontWeight: "600", letterSpacing: "0.4px", textTransform: "uppercase", color: $v.c?.text2 }}>
                      {"Администрирование"}
                    </div>
                    <button className="btn hv" onClick={$v.dl?.cfine} style={{ height: "36px", padding: "0 12px", borderRadius: "6px", width: "100%", boxSizing: "border-box", whiteSpace: "nowrap", display: "flex", alignItems: "center", fontSize: "13px", textAlign: "left", color: "inherit" }}>
                      <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true" style={{ flexShrink: "0", marginRight: "8px" }}>
                        <circle cx="10" cy="10" r="7"></circle>
                        <path d="M7.5 7.5l5 5M12.5 7.5l-5 5"></path>
                      </svg>
                      {"Отменить штраф"}
                    </button>
                    <button className="btn hv" onClick={$v.dl?.void} style={{ height: "36px", padding: "0 12px", borderRadius: "6px", width: "100%", boxSizing: "border-box", whiteSpace: "nowrap", display: "flex", alignItems: "center", fontSize: "13px", textAlign: "left", color: "inherit" }}>
                      <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true" style={{ flexShrink: "0", marginRight: "8px" }}>
                        <path d="M5 2.5h7l3 3v12H5zM12 2.5v3h3M7.5 11.5h5"></path>
                      </svg>
                      {"Аннулировать запись об аресте"}
                    </button>
                    <button className="btn hv" onClick={$v.dl?.edit} style={{ height: "36px", padding: "0 12px", borderRadius: "6px", width: "100%", boxSizing: "border-box", whiteSpace: "nowrap", display: "flex", alignItems: "center", fontSize: "13px", textAlign: "left", color: "inherit" }}>
                      <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true" style={{ flexShrink: "0", marginRight: "8px" }}>
                        <path d="M3 17l1-4L14 3l3 3L7 16zM12 5l3 3"></path>
                      </svg>
                      {"Изменить данные личности"}
                    </button>
                    <button className="btn hv" onClick={$v.dl?.showHist} style={{ height: "36px", padding: "0 12px", borderRadius: "6px", width: "100%", boxSizing: "border-box", whiteSpace: "nowrap", display: "flex", alignItems: "center", fontSize: "13px", textAlign: "left", color: "inherit" }}>
                      <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true" style={{ flexShrink: "0", marginRight: "8px" }}>
                        <circle cx="10" cy="10" r="7"></circle>
                        <path d="M10 6v4l3 2"></path>
                      </svg>
                      {"История изменений"}
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
              <a href="#" onClick={$v.__go("MailBolo")} className="hv" style={{ flexShrink: "0", height: "32px", padding: "0 12px", borderRadius: "6px", display: "flex", alignItems: "center", background: $v.c?.btn, color: $v.c?.text, fontSize: "13px", textDecoration: "none", whiteSpace: "nowrap" }}>
                {"Написать "}{__h($v.bolo?.ctShort)}
              </a>
            ) : null}
          </div>
        ) : null}
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.75fr) minmax(0, 1fr)", gap: "20px", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", minWidth: "0" }}>
            <div>
              {" "}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "0 0 8px 4px" }}>
                <span style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                  {"Криминальные записи · "}{__h($v.p?.crimCount)}
                </span>
                <span style={{ flex: "1" }}></span>
              </div>
              {" "}
              <div style={{ display: "flex", gap: "6px", margin: "0 0 8px 0" }}>
                {__a($v.p?.crimChips).map((ch: any, $i0: number) => (
                  <Fragment key={$i0}>
                    <button className="btn pb" onClick={ch?.pick} style={{ height: "28px", padding: "0 12px", borderRadius: "14px", fontSize: "12px", background: ch?.bg, color: ch?.fg }}>
                      {__h(ch?.label)}{" "}{__h(ch?.count)}
                    </button>
                  </Fragment>
                ))}
              </div>
              {" "}
              {$v.p?.noCrimes ? (
                <div style={{ borderRadius: "12px", background: $v.c?.card, padding: "16px", color: $v.c?.text2, fontSize: "13px" }}>
                  {"В этой категории записей нет."}
                </div>
              ) : null}
              {" "}
              <div style={{ borderRadius: "12px", background: $v.c?.card, overflow: "hidden" }}>
                {" "}
                {__a($v.p?.crimes).map((cr: any, $i0: number) => (
                  <Fragment key={$i0}>
                    {" "}
                    <div style={{ position: "relative", display: "flex", gap: "14px", padding: "0 16px" }}>
                      <span style={{ width: "64px", flexShrink: "0", paddingTop: "13px", display: "flex", flexDirection: "column", lineHeight: "17px", fontSize: "12px", color: $v.c?.text2 }}>
                        <span style={{ color: $v.c?.text }}>
                          {__h(cr?.date)}
                        </span>
                        {__h(cr?.time)}
                      </span>
                      <span style={{ flex: "1", minWidth: "0", display: "flex", gap: "12px", padding: "12px 0", borderBottom: `1px solid ${__s(cr?.sep)}` }}>
                        <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "3px", lineHeight: "19px" }}>
                          <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                            {__h(cr?.tagText)}
                            {cr?.pinned ? (
                              <>
                              {" · закреплено"}
                              </>
                            ) : null}
                          </span>
                          {__a(cr?.charges).map((cg: any, $i1: number) => (
                            <Fragment key={$i1}>
                              <span style={{ fontSize: "14px" }}>
                                <button onClick={cg?.go} className="btn lnk" style={{ font: "inherit", fontWeight: "600", color: $v.c?.link }}>
                                  {__h(cg?.code)}
                                </button>
                                {" "}{__h(cg?.name)}{" "}
                                <span style={{ fontSize: "12px", color: cg?.kindColor }}>
                                  {"· "}{__h(cg?.kind)}
                                </span>
                              </span>
                            </Fragment>
                          ))}
                          <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                            {cr?.whoLink ? (
                              <button onClick={cr?.whoGo} className="btn lnk" style={{ font: "inherit", color: $v.c?.link, textAlign: "inherit" }}>
                                {__h(cr?.who)}
                              </button>
                            ) : null}
                            {cr?.whoPlain ? (
                              <>
                              {__h(cr?.who)}
                              </>
                            ) : null}
                            {" · "}
                            {cr?.deptLink ? (
                              <button onClick={cr?.deptGo} className="btn lnk" style={{ font: "inherit", color: $v.c?.link, textAlign: "inherit" }}>
                                {__h(cr?.dept)}
                              </button>
                            ) : (
                              <span>{__h(cr?.dept)}</span>
                            )}
                          </span>
                        </span>
                        <span style={{ flexShrink: "0" }}>
                          <span style={{ padding: "2px 10px", borderRadius: "10px", fontSize: "12px", fontWeight: "600", background: cr?.chipBg, color: cr?.chipFg }}>
                            {__h(cr?.status)}
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
                  {"Штрафы · "}{__h($v.p?.fineCount)}
                </span>
                <span style={{ flex: "1" }}></span>
                <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                  {"Не оплачено: "}
                  <span style={{ color: $v.c?.text, fontWeight: "600" }}>
                    {__h($v.p?.finesTotal)}
                  </span>
                </span>
              </div>
              {" "}
              <div style={{ display: "flex", gap: "6px", margin: "0 0 8px 0" }}>
                {__a($v.p?.fineChips).map((ch: any, $i0: number) => (
                  <Fragment key={$i0}>
                    <button className="btn pb" onClick={ch?.pick} style={{ height: "28px", padding: "0 12px", borderRadius: "14px", fontSize: "12px", background: ch?.bg, color: ch?.fg }}>
                      {__h(ch?.label)}{" "}{__h(ch?.count)}
                    </button>
                  </Fragment>
                ))}
              </div>
              {" "}
              <div style={{ borderRadius: "12px", background: $v.c?.card, overflow: "hidden" }}>
                {" "}
                {__a($v.p?.fines).map((fn: any, $i0: number) => (
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
                              <button onClick={fn?.whoGo} className="btn lnk" style={{ font: "inherit", color: $v.c?.link, textAlign: "inherit" }}>
                                {__h(fn?.who)}
                              </button>
                            ) : null}
                            {fn?.whoPlain ? (
                              <>
                              {__h(fn?.who)}
                              </>
                            ) : null}
                            {" · квитанция "}{__h(fn?.receipt)}{" · "}
                            {fn?.vehLink ? (
                              <button onClick={fn?.vehGo} className="btn lnk" style={{ font: "inherit", color: $v.c?.link, textAlign: "inherit" }}>
                                {__a(fn?.vehicleP).map((qp: any, $i1: number) => (
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
                            {fn?.vehPlain ? (
                              <>
                              {__a(fn?.vehicleP).map((qp: any, $i1: number) => (
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
                              </>
                            ) : null}
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
                {$v.p?.noFines ? (
                  <div style={{ padding: "16px", color: $v.c?.text2, fontSize: "13px" }}>
                    {"В этой категории штрафов нет."}
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
                  {"Документы · "}{__h($v.p?.docCount)}
                </span>
                <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                  {"В архиве: "}{__h($v.p?.docArchive)}
                </span>
              </div>
              {" "}
              <div style={{ borderRadius: "12px", background: $v.c?.card, overflow: "hidden" }}>
                {" "}
                {__a($v.p?.docs).map((dc: any, $i0: number) => (
                  <Fragment key={$i0}>
                    {" "}
                    <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "0 16px" }}>
                      <span style={{ width: "36px", height: "36px", flexShrink: "0", borderRadius: "8px", background: dc?.iconBg, color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
                          <rect x="2.5" y="4.5" width="15" height="11" rx="2"></rect>
                          <circle cx="7" cy="9.5" r="1.8"></circle>
                          <path d="M4.5 13.5a2.8 2.8 0 015 0M11.5 8.5h4M11.5 11.5h3"></path>
                        </svg>
                      </span>
                      <span style={{ flex: "1", minWidth: "0", display: "flex", alignItems: "center", gap: "10px", padding: "12px 0", borderBottom: `1px solid ${__s(dc?.sep)}` }}>
                        <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", lineHeight: "19px" }}>
                          <span style={{ fontWeight: "600" }}>
                            {__h(dc?.name)}
                          </span>
                          <span className="ell" style={{ fontSize: "12px", color: $v.c?.text2 }}>
                            {__h(dc?.meta)}
                          </span>
                        </span>
                        <span style={{ padding: "2px 10px", borderRadius: "10px", fontSize: "12px", fontWeight: "600", background: dc?.chipBg, color: dc?.chipFg }}>
                          {__h(dc?.chipTxt)}
                        </span>
                        {dc?.canSus ? (
                          <button className="btn hv" onClick={dc?.sus} style={{ height: "28px", padding: "0 10px", borderRadius: "6px", fontSize: "12px", background: $v.c?.btn }}>
                            {"Приостановить"}
                          </button>
                        ) : null}
                        {dc?.canSei ? (
                          <button className="btn hv" onClick={dc?.sei} style={{ height: "28px", padding: "0 10px", borderRadius: "6px", fontSize: "12px", background: $v.c?.btn }}>
                            {"Изъять"}
                          </button>
                        ) : null}
                        {dc?.canRest ? (
                          <button className="btn hv" onClick={dc?.rest} style={{ height: "28px", padding: "0 10px", borderRadius: "6px", fontSize: "12px", background: $v.c?.btn }}>
                            {__h(dc?.restLabel)}
                          </button>
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
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", minWidth: "0" }}>
            <div>
              {" "}
              <div style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2, margin: "0 0 8px 4px" }}>
                {"Сведения"}
              </div>
              {" "}
              <div style={{ borderRadius: "12px", background: $v.c?.card, padding: "0 14px" }}>
                {" "}
                {__a($v.p?.info).map((f: any, $i0: number) => (
                  <Fragment key={$i0}>
                    {" "}
                    <div style={{ display: "flex", gap: "12px", padding: "10px 0", borderBottom: `1px solid ${__s(f?.sep)}`, fontSize: "13px" }}>
                      <span style={{ width: "118px", flexShrink: "0", color: $v.c?.text2 }}>
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
                      <span style={{ flex: "1", minWidth: "0", textAlign: "right", display: "flex", flexDirection: "column", lineHeight: "18px" }}>
                        <span>
                          {f?.vLink ? (
                            <button onClick={f?.vGo} className="btn lnk" style={{ font: "inherit", color: $v.c?.link, textAlign: "inherit" }}>
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
                          {f?.vPlain ? (
                            <>
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
                            </>
                          ) : null}
                          {f?.hasMore ? (
                            <>
                            {" "}
                            <button onClick={f?.toggle} className="btn hv" style={{ height: "20px", padding: "0 8px", borderRadius: "10px", background: $v.c?.btn, color: $v.c?.text, fontSize: "11px", fontWeight: "600", whiteSpace: "nowrap", verticalAlign: "middle" }}>
                              {__h(f?.moreLabel)}
                            </button>
                            </>
                          ) : null}
                        </span>
                        {f?.open ? (
                          <span style={{ display: "flex", flexDirection: "column", gap: "6px", paddingTop: "8px" }}>
                            {__a(f?.extras).map((ex: any, $i1: number) => (
                              <Fragment key={$i1}>
                                <span style={{ display: "flex", flexDirection: "column", lineHeight: "18px", padding: "6px 10px", borderRadius: "8px", background: $v.c?.btn }}>
                                  <span>
                                    {ex?.link ? (
                                      <button onClick={ex?.go} className="btn lnk" style={{ font: "inherit", color: $v.c?.link, textAlign: "inherit" }}>
                                        {__h(ex?.v)}
                                      </button>
                                    ) : null}
                                    {ex?.plain ? (
                                      <>
                                      {__h(ex?.v)}
                                      </>
                                    ) : null}
                                  </span>
                                  <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                                    {__h(ex?.note)}
                                  </span>
                                </span>
                              </Fragment>
                            ))}
                          </span>
                        ) : null}
                        {f?.hasNote ? (
                          <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                            {f?.nLink ? (
                              <button onClick={f?.nGo} className="btn lnk" style={{ font: "inherit", color: $v.c?.link, textAlign: "inherit" }}>
                                {__h(f?.note)}
                              </button>
                            ) : null}
                            {f?.nPlain ? (
                              <>
                              {__h(f?.note)}
                              </>
                            ) : null}
                          </span>
                        ) : null}
                      </span>
                    </div>
                    {" "}
                  </Fragment>
                ))}
                {" "}
                <div style={{ display: "flex", gap: "12px", padding: "10px 0", fontSize: "13px", alignItems: "center" }}>
                  <span style={{ width: "118px", flexShrink: "0", color: $v.c?.text2 }}>
                    {"SAN GANG"}
                  </span>
                  <span style={{ flex: "1", minWidth: "0", display: "flex", alignItems: "center", justifyContent: "flex-end", flexWrap: "wrap", gap: "2px 10px", textAlign: "right" }}>
                    {$v.p?.inGang ? (
                      <>
                      <button onClick={$v.p?.gangGo} className="btn lnk" style={{ font: "inherit", color: $v.c?.link, textAlign: "inherit", whiteSpace: "nowrap" }}>
                        {__h($v.p?.gang)}
                      </button>
                      <span style={{ color: $v.c?.text2 }}>
                        {", "}{__h($v.p?.gangRole)}
                      </span>
                      </>
                    ) : null}
                    {$v.p?.noGang ? (
                      <>
                      <span style={{ color: $v.c?.text2, whiteSpace: "nowrap" }}>
                        {__h($v.p?.noGangText)}
                      </span>
                      <button className="btn hv" onClick={$v.dl?.gang} style={{ height: "26px", padding: "0 12px", borderRadius: "13px", background: $v.c?.btn, fontSize: "12px", fontWeight: "600", whiteSpace: "nowrap" }}>
                        {"Внести в SAN GANG"}
                      </button>
                      </>
                    ) : null}
                  </span>
                </div>
                {" "}
              </div>
              {" "}
            </div>
            <div>
              {" "}
              <div style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2, margin: "0 0 8px 4px" }}>
                {"Адреса и недвижимость · "}{__h($v.p?.propCount)}
              </div>
              {" "}
              <div style={{ borderRadius: "12px", background: $v.c?.card, overflow: "hidden" }}>
                {" "}
                {__a($v.p?.property).map((pr: any, $i0: number) => (
                  <Fragment key={$i0}>
                    {" "}
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "0 14px" }}>
                      <span style={{ width: "32px", height: "32px", flexShrink: "0", borderRadius: "8px", background: "#3E8EDE", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" aria-hidden="true">
                          <path d="M3 9l7-5.5L17 9v8H3z"></path>
                          <path d="M8 17v-5h4v5"></path>
                        </svg>
                      </span>
                      <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", lineHeight: "18px", padding: "10px 0", borderBottom: `1px solid ${__s(pr?.sep)}` }}>
                        {pr?.isLink ? (
                          <button onClick={pr?.go} className="btn lnk ell" style={{ fontSize: "13px", color: $v.c?.link, textAlign: "left" }}>
                            {__h(pr?.addr)}
                          </button>
                        ) : null}
                        {pr?.plain ? (
                          <span className="ell" style={{ fontSize: "13px" }}>
                            {__h(pr?.addr)}
                          </span>
                        ) : null}
                        <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                          {__h(pr?.role)}
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
              <div style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2, margin: "0 0 8px 4px" }}>
                {"Транспорт · "}{__h($v.p?.vehCount)}
              </div>
              {" "}
              <div style={{ borderRadius: "12px", background: $v.c?.card, overflow: "hidden" }}>
                {" "}
                {__a($v.p?.vehicles).map((vh: any, $i0: number) => (
                  <Fragment key={$i0}>
                    {" "}
                    <button className="btn hv" onClick={vh?.go} style={{ width: "100%", boxSizing: "border-box", display: "flex", alignItems: "center", gap: "12px", padding: "0 14px" }}>
                      <span className="lpm" role="img" aria-label={`Номер ${__s(vh?.plate)}`}>
                        <span>
                          {__h(vh?.plate)}
                        </span>
                      </span>
                      <span style={{ flex: "1", minWidth: "0", display: "flex", alignItems: "center", gap: "8px", padding: "10px 0", borderBottom: `1px solid ${__s(vh?.sep)}` }}>
                        <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", lineHeight: "18px" }}>
                          <span className="ell" style={{ fontSize: "13px", fontWeight: "600" }}>
                            {__h(vh?.model)}
                          </span>
                          <span className="ell" style={{ fontSize: "11px", color: $v.c?.text2 }}>
                            {"VIN "}{__h(vh?.vin)}
                          </span>
                        </span>
                        {vh?.hasTag ? (
                          <span style={{ padding: "1px 8px", borderRadius: "10px", fontSize: "11px", fontWeight: "600", background: vh?.chipBg, color: vh?.chipFg }}>
                            {__h(vh?.tag)}
                          </span>
                        ) : null}
                        <svg width="11" height="11" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: $v.c?.text2 }}>
                          <path d="M8 5l5 5-5 5"></path>
                        </svg>
                      </span>
                    </button>
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
                {"Оружие"}
              </div>
              {" "}
              <div style={{ borderRadius: "12px", background: $v.c?.card, overflow: "hidden" }}>
                {" "}
                {__a($v.p?.weapons).map((wp: any, $i0: number) => (
                  <Fragment key={$i0}>
                    {" "}
                    <button className="btn hv" onClick={wp?.go} style={{ width: "100%", boxSizing: "border-box", display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px" }}>
                      <span style={{ width: "32px", height: "32px", flexShrink: "0", borderRadius: "8px", background: "#6B4E2E", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                          <path d="M2.5 6.5h13l1.5 2.5h-6l-1 2h-2.5l-1.5 4.5H3l1.5-5.5H2.5z"></path>
                        </svg>
                      </span>
                      <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", lineHeight: "18px" }}>
                        <span className="ell" style={{ fontSize: "13px", fontWeight: "600" }}>
                          {__h(wp?.model)}
                        </span>
                        <span style={{ fontSize: "11px", color: $v.c?.text2 }}>
                          {__h(wp?.serial)}
                        </span>
                      </span>
                      {wp?.hasTag ? (
                        <span style={{ padding: "1px 8px", borderRadius: "10px", fontSize: "11px", fontWeight: "600", background: wp?.chipBg, color: wp?.chipFg }}>
                          {__h(wp?.tag)}
                        </span>
                      ) : null}
                    </button>
                    {" "}
                  </Fragment>
                ))}
                {" "}
                {$v.p?.noWeapons ? (
                  <div style={{ padding: "12px 14px", fontSize: "13px", color: $v.c?.text2 }}>
                    {"Легального оружия за человеком не числится."}
                  </div>
                ) : null}
                {" "}
              </div>
              {" "}
            </div>
            <div>
              {" "}
              <div style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2, margin: "0 0 8px 4px" }}>
                {"Биометрия"}
              </div>
              {" "}
              <div style={{ borderRadius: "12px", background: $v.c?.card, padding: "0 14px" }}>
                {" "}
                <div style={{ display: "flex", gap: "12px", padding: "10px 0", borderBottom: `1px solid ${__s($v.c?.stroke)}`, fontSize: "13px" }}>
                  <span style={{ width: "118px", flexShrink: "0", color: $v.c?.text2 }}>
                    {"Отпечатки"}
                  </span>
                  <span style={{ flex: "1", textAlign: "right", display: "flex", flexDirection: "column", lineHeight: "18px" }}>
                    <span style={{ fontWeight: "600", letterSpacing: "1px" }}>
                      {__h($v.p?.fp)}
                    </span>
                    <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                      {__h($v.p?.fpNote)}
                    </span>
                  </span>
                </div>
                {" "}
                <div style={{ display: "flex", gap: "12px", padding: "10px 0", fontSize: "13px" }}>
                  <span style={{ width: "118px", flexShrink: "0", color: $v.c?.text2 }}>
                    {"ДНК"}
                  </span>
                  <span style={{ flex: "1", textAlign: "right" }}>
                    {__h($v.p?.dna)}
                  </span>
                </div>
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
