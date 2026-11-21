/* Generated 1:1 from the design reference (project/Search.dc.html) — markup, styles and copy are a literal port. */
import { Fragment } from 'react'
import { __a, __h, __s, type SearchVals } from './searchRuntime'
import { SearchSidebar } from './SearchSidebar'
import { SearchHome } from './SearchHome'
import { SearchResults } from './SearchResults'
import { EmployeeRecord } from './records/EmployeeRecord'
import { PersonRecord } from './records/PersonRecord'
import { OrgRecord } from './records/OrgRecord'
import { PlaceRecord } from './records/PlaceRecord'
import { WeaponRecord } from './records/WeaponRecord'
import { VehicleRecord } from './records/VehicleRecord'
import { PlainRecord } from './records/PlainRecord'
import { SearchDialog, SearchToast } from './SearchDialogs'

export function SearchShell({ $v }: { $v: SearchVals }) {
  return (
    <>
      <SearchSidebar $v={$v} />
      <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column" }}>
        <div style={{ height: "40px", flexShrink: "0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", paddingLeft: "20px", minWidth: "0" }}>
            <button className="btn hv" onClick={$v.goBack} aria-label="Назад" style={{ width: "32px", height: "28px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", opacity: $v.backOp }}>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12.5 4.5L7 10l5.5 5.5"></path>
              </svg>
            </button>
            <button className="btn hv" onClick={$v.goFwd} aria-label="Вперёд" style={{ width: "32px", height: "28px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", opacity: $v.fwdOp }}>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7.5 4.5L13 10l-5.5 5.5"></path>
              </svg>
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "2px", marginLeft: "8px", fontSize: "13px", whiteSpace: "nowrap", overflow: "hidden" }}>
              {__a($v.crumbs).map((cr: any, $i0: number) => (
                <Fragment key={$i0}>
                  {cr?.sep ? (
                    <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: "0.5", flexShrink: "0" }} aria-hidden="true">
                      <path d="M7.5 4.5L13 10l-5.5 5.5"></path>
                    </svg>
                  ) : null}
                  <button className="btn hv" onClick={cr?.go} style={{ height: "28px", padding: "0 8px", borderRadius: "6px", fontSize: "13px", fontWeight: cr?.fw, color: cr?.fg, whiteSpace: "nowrap", maxWidth: "320px", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {__h(cr?.text)}
                  </button>
                </Fragment>
              ))}
            </div>
          </div>
        </div>
        {$v.showBar ? (
          <div style={{ padding: "0 24px 14px 24px" }}>
            {" "}
            <label style={{ height: "44px", boxSizing: "border-box", display: "flex", alignItems: "center", gap: "10px", padding: "0 6px 0 14px", borderRadius: "10px", background: $v.c?.search, boxShadow: `inset 0 0 0 1px ${__s($v.c?.stroke)}`, color: $v.c?.text2 }}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
                <circle cx="8.5" cy="8.5" r="5.5"></circle>
                <path d="M12.5 12.5l4.5 4.5"></path>
              </svg>
              <input type="text" value={__s($v.q)} onChange={$v.onQ} placeholder={$v.ph} aria-label="Поиск по базе" style={{ flex: "1", minWidth: "0", border: "0", background: "transparent", fontSize: "15px", color: $v.c?.text }} />
              {$v.hasQ ? (
                <button className="btn hv" onClick={$v.clearQ} aria-label="Очистить" style={{ width: "32px", height: "32px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="11" height="11" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                    <path d="M5 5l10 10M15 5L5 15"></path>
                  </svg>
                </button>
              ) : null}
            </label>
            {" "}
          </div>
        ) : null}
        <SearchHome $v={$v} />
        <SearchResults $v={$v} />
        {$v.recMode ? (
          <main key={__s($v.rec?.id) /* MDT: a newly opened record starts at the top */} className="scroll" style={{ flex: "1", minHeight: "0", boxSizing: "border-box", padding: "0 24px 28px 24px", borderTop: `1px solid ${__s($v.c?.stroke)}` }}>
            {" "}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", height: "44px" }}>
              <button className="btn hv" onClick={$v.backToList} style={{ height: "30px", padding: "0 10px 0 6px", borderRadius: "6px", display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", color: $v.c?.text2 }}>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12.5 4.5L7 10l5.5 5.5"></path>
                </svg>
                {"Результаты · "}
                {__a($v.summaryShortP).map((qp: any, $i0: number) => (
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
              </button>
            </div>
            {" "}
            {" "}
            <EmployeeRecord $v={$v} />
            {" "}
            <PersonRecord $v={$v} />
            {" "}
            {" "}
            <OrgRecord $v={$v} />
            {" "}
            {" "}
            <PlaceRecord $v={$v} />
            {" "}
            {" "}
            <WeaponRecord $v={$v} />
            {" "}
            {" "}
            <VehicleRecord $v={$v} />
            {" "}
            {" "}
            <PlainRecord $v={$v} />
            {" "}
            <SearchDialog $v={$v} />
            {" "}
            <SearchToast $v={$v} />
            {" "}
          </main>
        ) : null}
      </div>
    </>
  )
}
