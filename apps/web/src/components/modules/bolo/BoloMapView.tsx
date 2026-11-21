/* Generated 1:1 from the design reference (project/BOLO.dc.html) — markup, styles and copy are a literal port. */
import { Fragment } from 'react'
import { __a, __h, __s, type BoloVals } from './boloRuntime'
import { BoloTerrain } from './boloTerrain'

export function BoloMapView({ $v }: { $v: BoloVals }) {
  if (!$v.isMap) return null
  return (
    <>
      <div style={{ flex: "1", minHeight: "0", display: "flex", flexDirection: "column", padding: "0 24px 24px 28px", marginTop: "-8px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", paddingBottom: "14px" }}>
          <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "2px" }}>
            <div style={{ fontSize: "26px", lineHeight: "34px", fontWeight: "600" }}>
              {"Карта ориентировок"}
            </div>
            <div style={{ fontSize: "13px", color: $v.c?.text2 }}>
              {"Последнее место, где видели каждого, и маршрут по отметкам «Замечен» за 24 часа"}
            </div>
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            <button className="btn acc" onClick={$v.pickForMap} style={{ height: "30px", padding: "0 12px", borderRadius: "15px", display: "flex", alignItems: "center", gap: "6px", background: $v.accent, color: $v.onAccent, fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap" }}>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M10 17.5s-5.5-5-5.5-9a5.5 5.5 0 0111 0c0 4-5.5 9-5.5 9z"></path>
                <path d="M10 6v5M7.5 8.5h5"></path>
              </svg>
              {" Отметить «Замечен» "}
            </button>
            {__a($v.mapFilters).map((mf: any, $i0: number) => (
              <Fragment key={$i0}>
                <button className="btn hv" onClick={mf?.pick} style={{ height: "30px", padding: "0 12px", borderRadius: "15px", background: mf?.bg, color: mf?.fg, fontSize: "13px", fontWeight: mf?.fw, whiteSpace: "nowrap" }}>
                  {__h(mf?.t)}
                </button>
              </Fragment>
            ))}
          </div>
        </div>
        <div style={{ flex: "1", minHeight: "0", display: "flex", gap: "14px" }}>
          <div style={{ position: "relative", flex: "1", minWidth: "0", borderRadius: "12px", overflow: "hidden", background: $v.c?.mapWater }}>
            <BoloTerrain $v={$v} mode="full" pts={undefined}>
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none' }}>
                {__a($v.mapTrails).map((mt: any, $i0: number) => (
                  <Fragment key={$i0}>
                    <polyline points={mt?.pts} fill="none" stroke={mt?.color} strokeWidth="2.5" strokeDasharray="6 4" vectorEffect="non-scaling-stroke"></polyline>
                  </Fragment>
                ))}
              </svg>
              {__a($v.mapPins).map((mp: any, $i0: number) => (
                <Fragment key={$i0}>
                  {" "}
                  <button className="btn" onClick={mp?.pick} aria-label={mp?.title} style={{ position: "absolute", left: mp?.x, top: mp?.y, transform: "translate(-50%, -100%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                    <span style={{ padding: "2px 8px", borderRadius: "6px", background: mp?.labelBg, color: $v.c?.text, fontSize: "11px", fontWeight: "600", whiteSpace: "nowrap", boxShadow: "0 2px 6px rgba(0,0,0,0.35)" }}>
                      {__h(mp?.label)}
                    </span>
                    <span style={{ width: mp?.s, height: mp?.s, borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)", background: mp?.bg, border: `2px solid ${__s(mp?.ring)}`, boxShadow: "0 2px 6px rgba(0,0,0,0.4)" }}></span>
                  </button>
                  {" "}
                </Fragment>
              ))}
            </BoloTerrain>
            <div style={{ position: "absolute", right: "12px", bottom: "12px", zIndex: "2", display: "flex", flexDirection: "column", borderRadius: "8px", overflow: "hidden", background: $v.c?.btn }}>
              <button className="btn hv" aria-label="Приблизить" title="Приблизить" onClick={() => $v.__mapZoom(1)} style={{ width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M10 4v12M4 10h12"></path>
                </svg>
              </button>
              <button className="btn hv" aria-label="Отдалить" title="Отдалить" onClick={() => $v.__mapZoom(-1)} style={{ width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M4 10h12"></path>
                </svg>
              </button>
            </div>
            <div style={{ position: "absolute", left: "12px", bottom: "12px", display: "flex", gap: "6px" }}>
              {__a($v.mapLegend).map((lg: any, $i0: number) => (
                <Fragment key={$i0}>
                  <span style={{ height: "26px", padding: "0 10px", borderRadius: "13px", display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", background: $v.c?.btn }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: lg?.c }}></span>
                    {__h(lg?.t)}
                  </span>
                </Fragment>
              ))}
            </div>
          </div>
          <div className="scroll" style={{ width: "300px", flexShrink: "0", display: "flex", flexDirection: "column", gap: "8px" }}>
            {__a($v.mapList).map((ml: any, $i0: number) => (
              <Fragment key={$i0}>
                <button className="btn hv" onClick={ml?.pick} style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "10px 12px", borderRadius: "10px", background: ml?.bg, boxShadow: ml?.ring }}>
                  <span style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: ml?.dot }}></span>
                    <span className="ell" style={{ flex: "1", fontWeight: "600" }}>
                      {__h(ml?.title)}
                    </span>
                    <span className="num" style={{ fontSize: "12px", color: $v.c?.text2 }}>
                      {__h(ml?.id)}
                    </span>
                  </span>
                  <span className="ell" style={{ fontSize: "12px", color: $v.c?.text2 }}>
                    {__a(ml?.lastP).map((qp: any, $i1: number) => (
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
              </Fragment>
            ))}
            <button className="btn hv" onClick={$v.openFromMap} style={{ height: "34px", flexShrink: "0", borderRadius: "6px", background: $v.c?.btn, textAlign: "center" }}>
              {"Открыть ориентировку"}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export function BoloPicker({ $v }: { $v: BoloVals }) {
  if (!$v.pick) return null
  return (
    <>
      <div onClick={(e) => { if (e.target === e.currentTarget) $v.pickCancel() }} style={{ position: "absolute", inset: "0", zIndex: "25", background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div role="dialog" aria-label="Указать на карте" style={{ width: "1060px", height: "780px", boxSizing: "border-box", display: "flex", flexDirection: "column", borderRadius: "10px", background: $v.c?.dialog, border: `1px solid ${__s($v.c?.stroke)}`, boxShadow: "0 32px 64px rgba(0,0,0,0.55)", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px 12px 20px" }}>
            <span style={{ flex: "1", display: "flex", flexDirection: "column", lineHeight: "20px" }}>
              <span style={{ fontSize: "18px", fontWeight: "600" }}>
                {__h($v.pk?.title)}
              </span>
              <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                {__a($v.pk?.subP).map((qp: any, $i0: number) => (
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
            <label style={{ width: "300px", height: "32px", boxSizing: "border-box", display: "flex", alignItems: "center", gap: "8px", padding: "0 10px", borderRadius: "6px", background: $v.c?.search, color: $v.c?.text2 }}>
              <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                <circle cx="8.5" cy="8.5" r="5.5"></circle>
                <path d="M12.5 12.5l4.5 4.5"></path>
              </svg>
              <input type="search" onKeyDown={$v.__placeFind} placeholder="Найти адрес или место" style={{ flex: "1", minWidth: "0", border: "0", background: "transparent", fontSize: "14px", color: $v.c?.text }} />
            </label>
            <button className="btn hv" onClick={$v.pickCancel} aria-label="Закрыть" style={{ width: "32px", height: "32px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <path d="M4 4l12 12M16 4L4 16"></path>
              </svg>
            </button>
          </div>
          <div style={{ position: "relative", flex: "1", minHeight: "0", margin: "0 16px", borderRadius: "10px", overflow: "hidden", background: $v.c?.mapWater }}>
            <BoloTerrain $v={$v} mode="pick" pts={undefined}>
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none' }}>
                <polyline points={$v.pk?.trail} fill="none" stroke={$v.c?.mapLabel} strokeWidth="2" strokeDasharray="6 4" opacity="0.7" vectorEffect="non-scaling-stroke"></polyline>
              </svg>
              {__a($v.pk?.old).map((op: any, $i0: number) => (
                <Fragment key={$i0}>
                  {" "}
                  <span style={{ position: "absolute", left: op?.x, top: op?.y, width: "14px", height: "14px", transform: "translate(-50%, -50%)", borderRadius: "50%", background: "#9AA0A6", border: `2px solid ${__s($v.c?.mapWater)}`, opacity: "0.85" }}></span>
                  {" "}
                </Fragment>
              ))}
              {$v.pk?.hasPin ? (
                <>
                {" "}
                <span style={{ position: "absolute", left: $v.pk?.x, top: $v.pk?.y, height: $v.pk?.r, aspectRatio: "1", display: $v.pk?.hasR ? "block" : "none", transform: "translate(-50%, -50%)", borderRadius: "50%", background: $v.pk?.halo, border: `1px dashed ${__s($v.accent)}` }}></span>
                {" "}
                <span style={{ position: "absolute", left: $v.pk?.x, top: $v.pk?.y, transform: "translate(-50%, calc(-50% - 18px)) rotate(-45deg)", width: "26px", height: "26px", borderRadius: "50% 50% 50% 0", background: $v.accent, border: "2px solid #FFFFFF", boxShadow: "0 3px 8px rgba(0,0,0,0.5)" }}></span>
                {" "}
                </>
              ) : null}
            </BoloTerrain>
            {$v.pk?.noPin ? (
              <>
              {" "}
              <div style={{ position: "absolute", left: "50%", top: "14px", transform: "translateX(-50%)", height: "34px", padding: "0 14px", borderRadius: "17px", display: "flex", alignItems: "center", gap: "8px", background: $v.accent, color: $v.onAccent, fontSize: "13px", fontWeight: "600", boxShadow: "0 4px 12px rgba(0,0,0,0.4)", whiteSpace: "nowrap" }}>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <circle cx="10" cy="10" r="6"></circle>
                  <path d="M10 1.5v4M10 14.5v4M1.5 10h4M14.5 10h4"></path>
                </svg>
                {" Нажмите на карту, где видели "}
              </div>
              {" "}
              </>
            ) : null}
            <div style={{ position: "absolute", right: "12px", bottom: "12px", display: "flex", flexDirection: "column", borderRadius: "8px", overflow: "hidden", background: $v.c?.btn }}>
              <button className="btn hv" aria-label="Приблизить" onClick={() => $v.__mapZoom(1)} style={{ width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M10 4v12M4 10h12"></path>
                </svg>
              </button>
              <button className="btn hv" aria-label="Отдалить" onClick={() => $v.__mapZoom(-1)} style={{ width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M4 10h12"></path>
                </svg>
              </button>
            </div>
            <button className="btn" onClick={$v.pickGps} style={{ position: "absolute", left: "12px", bottom: "12px", height: "32px", padding: "0 12px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "6px", background: $v.c?.btn, fontSize: "13px" }}>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <circle cx="10" cy="10" r="3"></circle>
                <circle cx="10" cy="10" r="7"></circle>
              </svg>
              {" Где я сейчас "}
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "14px 16px 16px 20px" }}>
            <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", lineHeight: "19px" }}>
              <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                {"Место"}
              </span>
              <span className="ell" style={{ fontWeight: "600", color: $v.pk?.placeColor }}>
                {__h($v.pk?.place)}
              </span>
            </span>
            <span style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                {"Насколько точно"}
              </span>
              <span style={{ display: "flex", gap: "2px", padding: "2px", borderRadius: "8px", background: $v.c?.card }}>
                {__a($v.pk?.acc).map((o: any, $i0: number) => (
                  <Fragment key={$i0}>
                    <button className="btn" onClick={o?.pick} style={{ height: "28px", padding: "0 12px", borderRadius: "6px", background: o?.bg, color: o?.fg, fontSize: "13px", fontWeight: o?.fw, whiteSpace: "nowrap" }}>
                      {__h(o?.t)}
                    </button>
                  </Fragment>
                ))}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "8px", paddingTop: "2px" }}>
                <input type="range" min={0} max={12} step={0.1} value={$v.pk?.accR ?? 0} onChange={(e) => $v.pk?.accSet(e.target.value)} aria-label="Радиус зоны" style={{ flex: "1", minWidth: "120px", accentColor: $v.accent }} />
                <span className="num" style={{ minWidth: "88px", fontSize: "12px", color: $v.c?.text2, whiteSpace: "nowrap" }}>{__h($v.pk?.accLabel)}</span>
              </span>
            </span>
            <button className="btn hv" onClick={$v.pickCancel} style={{ width: "110px", height: "36px", borderRadius: "6px", background: $v.c?.btn, textAlign: "center" }}>
              {"Отмена"}
            </button>
            <button className="btn acc" onClick={$v.pickDone} style={{ width: "150px", height: "36px", borderRadius: "6px", background: $v.pk?.okBg, color: $v.pk?.okFg, fontWeight: "600", textAlign: "center" }}>
              {__h($v.pk?.okLabel)}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
