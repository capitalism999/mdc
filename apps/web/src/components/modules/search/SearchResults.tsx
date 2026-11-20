/* Generated 1:1 from the design reference (project/Search.dc.html) — markup, styles and copy are a literal port. */
import { personPhoto } from '../shared/personPhotos'
import { Fragment } from 'react'
import { __a, __h, __s, type SearchVals } from './searchRuntime'

export function SearchResults({ $v }: { $v: SearchVals }) {
  if (!$v.listMode) return null
  return (
    <>
      <section aria-label="Результаты" className="scroll" style={{ flex: "1", minHeight: "0", boxSizing: "border-box", padding: "4px 24px 24px 24px", borderTop: `1px solid ${__s($v.c?.stroke)}` }}>
        {" "}
        <div style={{ maxWidth: "none", margin: "0" }}>
          {" "}
          {$v.showRes ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 4px 0 4px" }}>
              <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                {"Статус человека"}
              </span>
              <div style={{ display: "flex", padding: "2px", borderRadius: "8px", background: $v.c?.card, boxShadow: `inset 0 0 0 1px ${__s($v.c?.stroke)}` }}>
                {__a($v.resOpts).map((o: any, $i0: number) => (
                  <Fragment key={$i0}>
                    <button className="btn hv" onClick={o?.pick} style={{ height: "28px", padding: "0 14px", borderRadius: "6px", fontSize: "13px", fontWeight: o?.fw, background: o?.bg, whiteSpace: "nowrap" }}>
                      {__h(o?.name)}
                    </button>
                  </Fragment>
                ))}
              </div>
            </div>
          ) : null}
          {" "}
          <div style={{ fontSize: "12px", color: $v.c?.text2, padding: "12px 4px 4px 4px" }}>
            {__a($v.summaryP).map((qp: any, $i0: number) => (
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
          {" "}
          {__a($v.groups).map((g: any, $i0: number) => (
            <Fragment key={$i0}>
              {" "}
              <div style={{ padding: "14px 4px 6px 4px", fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                {__h(g?.label)}
              </div>
              {" "}
              <div style={{ borderRadius: "12px", background: $v.c?.card, overflow: "hidden" }}>
                {" "}
                {__a(g?.items).map((it: any, $i1: number) => (
                  <Fragment key={$i1}>
                    {" "}
                    <button className="btn hv" onClick={it?.pick} style={{ width: "100%", boxSizing: "border-box", display: "flex", alignItems: "center", gap: "14px", padding: "0 16px" }}>
                      {it?.isPerson ? (
                        <span style={{ position: "relative", width: "44px", height: "44px", flexShrink: "0", borderRadius: "8px", overflow: "hidden", background: it?.color }}>
                          <img src={personPhoto(it?.id)} alt="Фото" style={{ position: "absolute", left: "0", top: "0", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 12%", display: "block" }} />
                        </span>
                      ) : null}
                      {it?.isVehicle ? (
                        <span className="lpm" role="img" aria-label={`Номер ${__s(it?.plate)}`}>
                          <span>
                            {__h(it?.plate)}
                          </span>
                        </span>
                      ) : null}
                      {it?.isWeapon ? (
                        <span style={{ width: "38px", height: "38px", flexShrink: "0", borderRadius: "8px", background: "#6B4E2E", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                            <path d="M2.5 6.5h13l1.5 2.5h-6l-1 2h-2.5l-1.5 4.5H3l1.5-5.5H2.5z"></path>
                          </svg>
                        </span>
                      ) : null}
                      {it?.isOrg ? (
                        <span style={{ width: "38px", height: "38px", flexShrink: "0", borderRadius: "8px", background: "#8A3B5C", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                            <circle cx="7.5" cy="7" r="2.6"></circle>
                            <circle cx="13.5" cy="7.5" r="2.2"></circle>
                            <path d="M2.5 16a5 5 0 0110 0M12.5 12.2a4 4 0 015 3.8"></path>
                          </svg>
                        </span>
                      ) : null}
                      {it?.isPlace ? (
                        <span style={{ width: "38px", height: "38px", flexShrink: "0", borderRadius: "8px", background: "#3E8EDE", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                            <path d="M3 9l7-5.5L17 9v8H3z"></path>
                            <path d="M8 17v-5h4v5"></path>
                          </svg>
                        </span>
                      ) : null}
                      {it?.isLaw ? (
                        <span style={{ width: "38px", height: "38px", flexShrink: "0", borderRadius: "8px", background: "#5C4B8A", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                            <path d="M10 3v14M6.5 17h7M4 6h12"></path>
                            <path d="M6 6l-2.5 5.5a2.5 2.5 0 005 0zM14 6l-2.5 5.5a2.5 2.5 0 005 0z"></path>
                          </svg>
                        </span>
                      ) : null}
                      <span style={{ flex: "1", minWidth: "0", display: "flex", alignItems: "center", gap: "10px", padding: "12px 0", borderBottom: `1px solid ${__s(it?.sep)}` }}>
                        <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", lineHeight: "19px" }}>
                          <span className="ell" style={{ fontWeight: "600" }}>
                            {__a(it?.titleP).map((qp: any, $i2: number) => (
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
                          <span className="ell" style={{ fontSize: "12px", color: $v.c?.text2 }}>
                            {__a(it?.subP).map((qp: any, $i2: number) => (
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
                        </span>
                        {__a(it?.flags).map((f: any, $i2: number) => (
                          <Fragment key={$i2}>
                            <span style={{ padding: "1px 8px", borderRadius: "10px", fontSize: "11px", fontWeight: "600", background: f?.bg, color: f?.fg, flexShrink: "0" }}>
                              {__a(f?.textP).map((qp: any, $i3: number) => (
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
                        <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: $v.c?.text2, flexShrink: "0" }}>
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
            </Fragment>
          ))}
          {" "}
          {$v.noResults ? (
            <>
            {" "}
            <div style={{ padding: "64px 16px", textAlign: "center", color: $v.c?.text2 }}>
              {" "}
              <div style={{ fontSize: "15px", fontWeight: "600", color: $v.c?.text, marginBottom: "4px" }}>
                {"Ничего не найдено"}
              </div>
              {" Проверьте написание или выберите «Все» слева. "}
            </div>
            {" "}
            </>
          ) : null}
          {" "}
        </div>
        {" "}
      </section>
    </>
  )
}
