/* Generated 1:1 from the design reference (project/Search.dc.html) — markup, styles and copy are a literal port. */
import { Fragment } from 'react'
import { __a, __h, __s, type SearchVals } from './searchRuntime'

export function SearchSidebar({ $v }: { $v: SearchVals }) {
  return (
    <aside style={{ width: "260px", flexShrink: "0", display: "flex", flexDirection: "column", background: $v.c?.mica, borderRight: `1px solid ${__s($v.c?.stroke)}` }}>
      <div style={{ height: "40px", flexShrink: "0", display: "flex", alignItems: "center", gap: "10px", paddingLeft: "14px" }}>
        <div style={{ width: "18px", height: "18px", borderRadius: "5px", background: "#2F6F73", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <circle cx="8.5" cy="8.5" r="5"></circle>
            <path d="M12.5 12.5l4.5 4.5"></path>
          </svg>
        </div>
        <div style={{ fontSize: "12px" }}>
          {"Поиск"}
        </div>
      </div>
      <div style={{ padding: "6px 10px 0 10px" }}>
        {" "}
        <div style={{ padding: "6px 12px 6px 12px", fontSize: "12px", fontWeight: "600", color: $v.c?.text2 }}>
          {"Искать среди"}
        </div>
        {" "}
        {__a($v.types).map((t: any, $i0: number) => (
          <Fragment key={$i0}>
            {" "}
            <button className="btn hv" onClick={t?.pick} style={{ position: "relative", width: "100%", height: "36px", boxSizing: "border-box", borderRadius: "6px", display: "flex", alignItems: "center", gap: "12px", padding: "0 12px", marginBottom: "1px", background: t?.bg, fontWeight: t?.fw }}>
              <span style={{ position: "absolute", left: "0", top: "10px", width: "3px", height: "16px", borderRadius: "2px", background: $v.accent, opacity: t?.op }}></span>
              {t?.iAll ? (
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="6" height="6" rx="1.5"></rect>
                  <rect x="11" y="3" width="6" height="6" rx="1.5"></rect>
                  <rect x="3" y="11" width="6" height="6" rx="1.5"></rect>
                  <rect x="11" y="11" width="6" height="6" rx="1.5"></rect>
                </svg>
              ) : null}
              {t?.iPerson ? (
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                  <circle cx="10" cy="7" r="3.2"></circle>
                  <path d="M3.5 17a6.5 6.5 0 0113 0"></path>
                </svg>
              ) : null}
              {t?.iVehicle ? (
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                  <path d="M3 13.5V10l1.8-4.2A1.5 1.5 0 016.2 5h7.6a1.5 1.5 0 011.4.8L17 10v3.5"></path>
                  <path d="M2.5 13.5h15v2h-15z"></path>
                  <circle cx="6" cy="15.5" r="1.3"></circle>
                  <circle cx="14" cy="15.5" r="1.3"></circle>
                </svg>
              ) : null}
              {t?.iWeapon ? (
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                  <path d="M2.5 6.5h13l1.5 2.5h-6l-1 2h-2.5l-1.5 4.5H3l1.5-5.5H2.5z"></path>
                </svg>
              ) : null}
              {t?.iOrg ? (
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                  <circle cx="7.5" cy="7" r="2.6"></circle>
                  <circle cx="13.5" cy="7.5" r="2.2"></circle>
                  <path d="M2.5 16a5 5 0 0110 0M12.5 12.2a4 4 0 015 3.8"></path>
                </svg>
              ) : null}
              {t?.iPlace ? (
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                  <path d="M3 9l7-5.5L17 9v8H3z"></path>
                  <path d="M8 17v-5h4v5"></path>
                </svg>
              ) : null}
              {t?.iLaw ? (
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                  <path d="M10 3v14M6.5 17h7M4 6h12"></path>
                  <path d="M6 6l-2.5 5.5a2.5 2.5 0 005 0zM14 6l-2.5 5.5a2.5 2.5 0 005 0z"></path>
                </svg>
              ) : null}
              <span style={{ flex: "1" }}>
                {__h(t?.name)}
              </span>
              <span style={{ fontSize: "12px", color: $v.c?.text2, fontWeight: "400" }}>
                {__h(t?.count)}
              </span>
            </button>
            {" "}
          </Fragment>
        ))}
        {" "}
      </div>
      <div style={{ padding: "14px 10px 0 10px" }}>
        {" "}
        <div style={{ padding: "6px 12px", fontSize: "12px", fontWeight: "600", color: $v.c?.text2 }}>
          {"Недавние запросы"}
        </div>
        {" "}
        {__a($v.recent).map((r: any, $i0: number) => (
          <Fragment key={$i0}>
            {" "}
            <button className="btn hv" onClick={r?.pick} style={{ width: "100%", height: "32px", boxSizing: "border-box", borderRadius: "6px", display: "flex", alignItems: "center", gap: "10px", padding: "0 12px", fontSize: "13px" }}>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true" style={{ color: $v.c?.text2 }}>
                <circle cx="10" cy="10" r="7"></circle>
                <path d="M10 6v4l2.5 1.5"></path>
              </svg>
              <span className="ell" style={{ flex: "1" }}>
                {__a(r?.textP).map((qp: any, $i1: number) => (
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
      <div style={{ flex: "1" }}></div>
      <div style={{ margin: "0 14px 14px 14px", padding: "12px", borderRadius: "10px", background: $v.c?.card, fontSize: "12px", lineHeight: "18px", color: $v.c?.text2 }}>
        {" "}
        <div style={{ fontWeight: "600", color: $v.c?.text, marginBottom: "4px" }}>
          {"Что можно искать"}
        </div>
        {" Имя и фамилию, номер записи (CIT-…), номер машины, VIN, серийный номер оружия, телефон или адрес. "}
      </div>
    </aside>
  )
}
