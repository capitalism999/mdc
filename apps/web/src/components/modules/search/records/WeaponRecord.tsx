/* Generated 1:1 from the design reference (project/Search.dc.html) — markup, styles and copy are a literal port. */
import { Fragment } from 'react'
import { __a, __h, __s, type SearchVals } from '../searchRuntime'

export function WeaponRecord({ $v }: { $v: SearchVals }) {
  if (!$v.rec?.isRichW) return null
  return (
    <>
      {" "}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "1180px" }}>
        <div style={{ display: "flex", gap: "20px", alignItems: "flex-end" }}>
          <div style={{ position: "relative", width: "248px", height: "150px", flexShrink: "0", borderRadius: "12px", overflow: "hidden", background: $v.c?.mug, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src="/assets/search/998dc94e5db210ac1efc6247a06ef9f1.png" alt="Фото оружия" width="220" height="134" style={{ width: "220px", height: "134px", objectFit: "contain", display: "block" }} />
          </div>
          <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "6px", paddingBottom: "2px" }}>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {__a($v.w?.status).map((st: any, $i0: number) => (
                <Fragment key={$i0}>
                  <span style={{ padding: "2px 10px", borderRadius: "10px", fontSize: "12px", fontWeight: "600", background: st?.bg, color: st?.fg }}>
                    {__h(st?.text)}
                  </span>
                </Fragment>
              ))}
            </div>
            <div style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.6px", textTransform: "uppercase", color: $v.c?.text2 }}>
              {"ОРУЖИЕ · СЕРИЙНЫЙ № "}{__h($v.w?.serial)}
            </div>
            <h1 style={{ margin: "0", fontSize: "30px", lineHeight: "38px", fontWeight: "700", letterSpacing: "-0.2px" }}>
              {__h($v.w?.make)}{" "}{__h($v.w?.model)}
            </h1>
            <div style={{ color: $v.c?.text2 }}>
              {__h($v.w?.kindLine)}
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
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button className="btn hv" onClick={$v.__weaponWanted} style={{ height: "34px", padding: "0 14px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", background: $v.c?.btn }}>
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
              <path d="M10 3l8 14H2z"></path>
              <path d="M10 8.5v4M10 14.6v.1"></path>
            </svg>
            {__h($v.w?.wantedAction)}
          </button>
          <a href="#" onClick={$v.__toCase} className="hv" style={{ height: "34px", padding: "0 14px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", textDecoration: "none", background: $v.c?.btn, color: $v.c?.text }}>
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
              <rect x="2.5" y="6" width="15" height="10.5" rx="2"></rect>
              <path d="M7 6V4.5h6V6"></path>
            </svg>
            {"Добавить в дело"}
          </a>
          <button className="btn hv" onClick={$v.dl?.sub} style={{ height: "34px", padding: "0 14px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", background: $v.c?.btn }}>
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
              <path d="M5 8a5 5 0 0110 0c0 4 1.5 5 1.5 5h-13S5 12 5 8zM8.5 16a1.6 1.6 0 003 0"></path>
            </svg>
            {"Подписаться"}
          </button>
          <button className="btn hv" onClick={$v.dl?.share} style={{ height: "34px", padding: "0 14px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", background: $v.c?.btn }}>
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M8 12l4-4M7.5 9.5L6 11a3 3 0 004.2 4.2l1.3-1.3M12.5 10.5L14 9a3 3 0 00-4.2-4.2L8.5 6.1"></path>
            </svg>
            {"Поделиться"}
          </button>
          <span style={{ alignSelf: "center", fontSize: "12px", color: $v.c?.text2 }}>
            {"Действия записываются от вашего имени, быть на смене не нужно."}
          </span>
        </div>
        {$v.w?.hasAlert ? (
          <div style={{ display: "flex", gap: "14px", padding: "14px 16px", borderRadius: "12px", background: $v.w?.alertBg }}>
            <span style={{ width: "32px", height: "32px", flexShrink: "0", borderRadius: "8px", background: $v.w?.alertIcon, color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                <path d="M10 3l8 14H2z"></path>
                <path d="M10 8.5v4M10 14.6v.1"></path>
              </svg>
            </span>
            <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "2px", lineHeight: "19px" }}>
              <span style={{ fontSize: "14px", fontWeight: "600" }}>
                {__h($v.w?.alertTitle)}
              </span>
              <span style={{ fontSize: "13px", color: $v.c?.text2 }}>
                {__h($v.w?.alertText)}
              </span>
            </span>
          </div>
        ) : null}
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.75fr) minmax(0, 1fr)", gap: "20px", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", minWidth: "0" }}>
            <div>
              {" "}
              <div style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2, margin: "0 0 8px 4px" }}>
                {"Характеристики"}
              </div>
              {" "}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", borderRadius: "12px", background: $v.c?.card, overflow: "hidden" }}>
                {__a($v.w?.grid).map((g: any, $i0: number) => (
                  <Fragment key={$i0}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px", padding: "12px 16px", borderRight: `1px solid ${__s(g?.sep)}` }}>
                      <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                        {__h(g?.k)}
                      </span>
                      <span style={{ fontSize: "15px", fontWeight: "600" }}>
                        {__h(g?.v)}
                      </span>
                    </div>
                  </Fragment>
                ))}
              </div>
              {" "}
            </div>
            <div>
              {" "}
              <div style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2, margin: "0 0 8px 4px" }}>
                {"История владельцев · "}{__h($v.w?.ownersCount)}
              </div>
              {" "}
              <div style={{ borderRadius: "12px", background: $v.c?.card, overflow: "hidden" }}>
                {" "}
                {__a($v.w?.owners).map((ow: any, $i0: number) => (
                  <Fragment key={$i0}>
                    {" "}
                    <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "0 16px" }}>
                      <span style={{ width: "22px", flexShrink: "0", fontSize: "12px", color: $v.c?.text2 }}>
                        {__h(ow?.n)}
                      </span>
                      <span style={{ flex: "1", minWidth: "0", display: "flex", alignItems: "center", gap: "12px", padding: "11px 0", borderBottom: `1px solid ${__s(ow?.sep)}` }}>
                        <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", lineHeight: "19px" }}>
                          <span>
                            {ow?.isLink ? (
                              <button onClick={ow?.go} className="btn lnk" style={{ font: "inherit", fontWeight: "600", color: $v.c?.link }}>
                                {__h(ow?.name)}
                              </button>
                            ) : null}
                            {ow?.plain ? (
                              <span style={{ fontWeight: "600" }}>
                                {__h(ow?.name)}
                              </span>
                            ) : null}
                          </span>
                          <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                            {__h(ow?.basis)}
                          </span>
                        </span>
                        <span style={{ fontSize: "12px", color: $v.c?.text2, whiteSpace: "nowrap" }}>
                          {__h(ow?.from)}{" — "}
                          <span style={{ color: ow?.toColor }}>
                            {__h(ow?.to)}
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
              <div style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2, margin: "0 0 8px 4px" }}>
                {"Баллистика и экспертизы · "}{__h($v.w?.ballCount)}
              </div>
              {" "}
              <div style={{ borderRadius: "12px", background: $v.c?.card, overflow: "hidden" }}>
                {" "}
                {__a($v.w?.ball).map((bl: any, $i0: number) => (
                  <Fragment key={$i0}>
                    {" "}
                    <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "0 16px" }}>
                      <span style={{ width: "78px", flexShrink: "0", fontSize: "12px", color: $v.c?.text2 }}>
                        {__h(bl?.date)}
                      </span>
                      <span style={{ flex: "1", minWidth: "0", display: "flex", alignItems: "center", gap: "12px", padding: "11px 0", borderBottom: `1px solid ${__s(bl?.sep)}` }}>
                        <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", lineHeight: "19px" }}>
                          <span style={{ fontWeight: "600" }}>
                            {__h(bl?.id)}
                          </span>
                          <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                            {bl?.hasGo ? (
                              <button onClick={bl?.go} className="btn lnk" style={{ font: "inherit", color: $v.c?.link }}>
                                {__h(bl?.text)}
                              </button>
                            ) : null}
                            {bl?.noGo ? (
                              <>
                              {__h(bl?.text)}
                              </>
                            ) : null}
                          </span>
                        </span>
                        <span style={{ padding: "2px 10px", borderRadius: "10px", fontSize: "12px", fontWeight: "600", background: bl?.chipBg, color: bl?.chipFg }}>
                          {__h(bl?.chip)}
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
                {"Журнал оружия"}
              </div>
              {" "}
              <div style={{ borderRadius: "12px", background: $v.c?.card, overflow: "hidden" }}>
                {" "}
                {__a($v.w?.jr).map((jr: any, $i0: number) => (
                  <Fragment key={$i0}>
                    {" "}
                    <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "0 16px" }}>
                      <span style={{ width: "78px", flexShrink: "0", fontSize: "12px", color: $v.c?.text2 }}>
                        {__h(jr?.date)}
                      </span>
                      <span style={{ flex: "1", minWidth: "0", display: "flex", alignItems: "center", gap: "10px", padding: "11px 0", borderBottom: `1px solid ${__s(jr?.sep)}` }}>
                        <span style={{ width: "8px", height: "8px", flexShrink: "0", borderRadius: "50%", background: jr?.dot }}></span>
                        <span style={{ flex: "1", lineHeight: "19px" }}>
                          {__h(jr?.text)}
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
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", minWidth: "0" }}>
            <div>
              {" "}
              <div style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2, margin: "0 0 8px 4px" }}>
                {"Сведения"}
              </div>
              {" "}
              <div style={{ borderRadius: "12px", background: $v.c?.card, overflow: "hidden" }}>
                {" "}
                {__a($v.w?.info).map((f: any, $i0: number) => (
                  <Fragment key={$i0}>
                    {" "}
                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "12px", padding: "11px 14px", borderBottom: `1px solid ${__s(f?.sep)}` }}>
                      <span style={{ fontSize: "13px", color: $v.c?.text2 }}>
                        {__h(f?.k)}
                      </span>
                      <span style={{ textAlign: "right" }}>
                        {__h(f?.v)}
                      </span>
                    </div>
                    {" "}
                  </Fragment>
                ))}
                {" "}
              </div>
              {" "}
            </div>
            {$v.w?.hasOwner ? (
              <div>
                {" "}
                <div style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2, margin: "0 0 8px 4px" }}>
                  {"Владелец"}
                </div>
                {" "}
                <button className="btn hv" onClick={$v.w?.ownerGo} style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px", borderRadius: "12px", background: $v.c?.card, textAlign: "left" }}>
                  <span style={{ width: "40px", height: "40px", flexShrink: "0", borderRadius: "50%", background: $v.w?.ownerColor, color: "#FFFFFF", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {__h($v.w?.ownerInit)}
                  </span>
                  <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", lineHeight: "19px" }}>
                    <span style={{ fontWeight: "600", color: $v.c?.link }}>
                      {__h($v.w?.ownerName)}
                    </span>
                    <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                      {__h($v.w?.ownerSub)}
                    </span>
                  </span>
                </button>
                {" "}
              </div>
            ) : null}
            {$v.w?.hasStorage ? (
              <div>
                {" "}
                <div style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2, margin: "0 0 8px 4px" }}>
                  {"Место хранения"}
                </div>
                {" "}
                <div style={{ display: "flex", flexDirection: "column", gap: "2px", padding: "12px 14px", borderRadius: "12px", background: $v.c?.card, lineHeight: "19px" }}>
                  <span style={{ fontWeight: "600" }}>
                    {__h($v.w?.storagePlace)}
                  </span>
                  <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                    {__h($v.w?.storageSub)}
                  </span>
                </div>
                {" "}
              </div>
            ) : null}
            {$v.w?.hasCases ? (
              <div>
                {" "}
                <div style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2, margin: "0 0 8px 4px" }}>
                  {"Упоминания в делах · "}{__h($v.w?.casesCount)}
                </div>
                {" "}
                <div style={{ borderRadius: "12px", background: $v.c?.card, overflow: "hidden" }}>
                  {" "}
                  {__a($v.w?.cases).map((cs: any, $i0: number) => (
                    <Fragment key={$i0}>
                      {" "}
                      <a href="#" onClick={$v.__go("Cases")} className="hv" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px", textDecoration: "none", color: "inherit" }}>
                        <span style={{ width: "32px", height: "32px", flexShrink: "0", borderRadius: "8px", background: "#2B3A55", color: "#99D9FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
                            <rect x="2.5" y="6" width="15" height="10.5" rx="2"></rect>
                            <path d="M7 6V4.5h6V6"></path>
                          </svg>
                        </span>
                        <span style={{ display: "flex", flexDirection: "column", lineHeight: "19px" }}>
                          <span style={{ fontWeight: "600", color: $v.c?.link }}>
                            {__h(cs?.no)}
                          </span>
                          <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                            {__h(cs?.role)}
                          </span>
                        </span>
                      </a>
                      {" "}
                    </Fragment>
                  ))}
                  {" "}
                </div>
                {" "}
              </div>
            ) : null}
          </div>
        </div>
      </div>
      {" "}
    </>
  )
}
