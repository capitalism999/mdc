/* Generated 1:1 from the design reference (project/BOLO.dc.html) — markup, styles and copy are a literal port. */
import { Fragment } from 'react'
import { __a, __h, __s, type BoloVals } from './boloRuntime'
import { BoloLinksEditor, BoloPcPicker, BoloRecordPicker, BoloStaffPicker } from './boloPickers'

export function BoloNew({ $v }: { $v: BoloVals }) {
  if (!$v.isNew) return null
  return (
    <>
      <div style={{ flex: "1", minHeight: "0", display: "flex", marginTop: "-40px" }}>
        <div className="scroll bolo-form" style={{ flex: "1", minWidth: "0", padding: "18px 32px 32px 32px", display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button className="btn hv" onClick={$v.goFeed} aria-label="Назад" style={{ width: "32px", height: "32px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12.5 4.5L7 10l5.5 5.5"></path>
              </svg>
            </button>
            <span style={{ fontSize: "22px", lineHeight: "30px", fontWeight: "600" }}>
              {"Новая ориентировка"}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", borderRadius: "8px", background: $v.c?.card, fontSize: "13px" }}>
              <span style={{ color: $v.c?.text2 }}>
                {"Источник"}
              </span>
              <span style={{ height: "22px", padding: "0 8px", borderRadius: "4px", display: "flex", alignItems: "center", background: $v.lspdBg, color: $v.lspdFg, fontSize: "12px", fontWeight: "700" }}>
                {"LSPD"}
              </span>
              <span>
                {"Полиция Лос-Сантоса · Mission Row"}
              </span>
              <span style={{ flex: "1" }}></span>
              <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                {"берётся из вашей учётной записи"}
              </span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <span style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
              {"Кого или что ищем"}
            </span>
            <div style={{ display: "flex", gap: "6px" }}>
              {__a($v.nObjs).map((o: any, $i0: number) => (
                <Fragment key={$i0}>
                  <button className="btn hv bolo-tile" onClick={o?.pick} style={{ flex: "1", height: "64px", borderRadius: "8px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", background: o?.bg, boxShadow: o?.ring }}>
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d={o?.icon}></path>
                    </svg>
                    <span style={{ fontSize: "13px", fontWeight: o?.fw }}>
                      {__h(o?.t)}
                    </span>
                    <span style={{ fontSize: "11px", color: $v.c?.text2 }}>
                      {__h(o?.sub)}
                    </span>
                  </button>
                </Fragment>
              ))}
            </div>
          </div>
          {$v.showBases ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <span style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                {"Основание"}
              </span>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {__a($v.nBases).map((o: any, $i0: number) => (
                  <Fragment key={$i0}>
                    <button className="btn hv" onClick={o?.pick} style={{ height: "30px", padding: "0 12px", borderRadius: "15px", background: o?.bg, color: o?.fg, fontSize: "13px", fontWeight: o?.fw, whiteSpace: "nowrap" }}>
                      {__h(o?.t)}
                    </button>
                  </Fragment>
                ))}
              </div>
              <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                {__h($v.nBasHint)}
              </span>
            </div>
          ) : null}
          {$v.notAlert ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <span style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                {__h($v.recLabel)}
              </span>
              {$v.recPicking ? <BoloRecordPicker $v={$v} /> : null}
            {$v.recCard && !$v.recPicking ? (
                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", borderRadius: "8px", background: $v.c?.card }}>
                  <span style={{ width: "36px", height: "36px", borderRadius: "6px", background: $v.recBg, position: "relative", overflow: "hidden", flexShrink: "0" }}>
                    {$v.recMug ? (
                      <img src={$v.recImg} alt="Фото" style={{ position: "absolute", left: "0", top: "0", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 12%", display: "block" }} />
                    ) : null}
                    {$v.recCar ? (
                      <img src={$v.recCarImg} alt="Фото" style={{ position: "absolute", left: "2px", top: "8px", width: "32px", height: "20px", objectFit: "contain", display: "block" }} />
                    ) : null}
                  </span>
                  <span style={{ flex: "1", display: "flex", flexDirection: "column", lineHeight: "17px" }}>
                    <span className="lnk" style={{ fontWeight: "600", color: $v.c?.link }}>
                      {__h($v.recName)}
                    </span>
                    <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                      {__h($v.recSub)}
                    </span>
                  </span>
                  <button className="btn hv" onClick={$v.recPickOpen} style={{ flexShrink: 0, height: "28px", padding: "0 10px", borderRadius: "6px", background: $v.c?.btn, fontSize: "13px" }}>
                    {"Другой"}
                  </button>
                  <button className="btn hv" onClick={$v.recClear} title="Без записи из базы" style={{ flexShrink: 0, height: "28px", padding: "0 10px", borderRadius: "6px", background: $v.c?.btn, fontSize: "13px" }}>
                    {"Убрать"}
                  </button>
                </div>
              ) : null}
              {$v.recNone ? (
                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", border: `1px dashed ${__s($v.c?.stroke2)}`, color: $v.c?.text2, fontSize: "13px" }}>
                  <span style={{ width: "36px", height: "36px", borderRadius: "6px", background: $v.c?.mug, flexShrink: "0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "700", color: $v.c?.text }}>
                    {"?"}
                  </span>
                  <span style={{ flex: "1", lineHeight: "18px" }}>
                    {__h($v.recSub)}
                  </span>
                  {$v.recCanPick ? (
                    <button className="btn hv" onClick={$v.recPickOpen} style={{ flexShrink: 0, height: "28px", padding: "0 10px", borderRadius: "6px", background: $v.c?.btn, color: $v.c?.text, fontSize: "13px" }}>
                      {"Выбрать из базы"}
                    </button>
                  ) : null}
                </div>
              ) : null}
              {$v.nDup ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", borderRadius: "8px", background: $v.c?.card }}>
                    <span style={{ width: "36px", height: "36px", borderRadius: "6px", background: $v.c?.photoSky, position: "relative", overflow: "hidden", flexShrink: "0" }}>
                      <svg width="32" height="20" viewBox="0 0 100 60" aria-hidden="true" style={{ position: "absolute", left: "2px", top: "9px" }}>
                        <path d="M6 46v-5l4-3 9-10c2-2 5-4 9-4h30c4 0 7 2 10 5l7 7 14 2c3 1 5 3 5 6v2z" fill="#E3B505"></path>
                      </svg>
                    </span>
                    <span style={{ flex: "1", display: "flex", flexDirection: "column", lineHeight: "17px" }}>
                      <span className="lnk" style={{ fontWeight: "600", color: $v.c?.link }}>
                        {__h($v.dupName)}
                      </span>
                      <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                        {__h($v.dupSub)}
                      </span>
                    </span>
                    <button className="btn hv" onClick={$v.dupToggle} style={{ height: "28px", padding: "0 10px", borderRadius: "6px", background: $v.c?.btn, fontSize: "13px" }}>
                      {"Другой"}
                    </button>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px", borderRadius: "8px", background: $v.amberBg }}>
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: "0", color: $v.amberFg }}>
                      <path d="M7 7h9v10H7zM4 13V3h9"></path>
                    </svg>
                    <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", lineHeight: "18px" }}>
                      <span style={{ fontWeight: "600", color: $v.amberFg }}>
                        {__h($v.dupTitle)}
                      </span>
                      <span className="ell" style={{ fontSize: "12px", color: $v.c?.text2 }}>
                        {__h($v.dupMeta)}
                      </span>
                    </span>
                    <button className="btn hv" onClick={$v.dupOpen} style={{ flexShrink: "0", height: "30px", padding: "0 10px", borderRadius: "6px", background: $v.c?.btn, fontSize: "13px", whiteSpace: "nowrap" }}>
                      {"Открыть"}
                    </button>
                    <button className="btn" onClick={$v.dupAdd} style={{ flexShrink: "0", height: "30px", padding: "0 12px", borderRadius: "6px", background: $v.accent, color: $v.onAccent, fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap" }}>
                      {"Дополнить её"}
                    </button>
                  </div>
                  <button className="btn hv lnk" onClick={$v.dupIgnore} style={{ alignSelf: "flex-start", height: "24px", padding: "0 2px", fontSize: "13px", color: $v.c?.link }}>
                    {"Это другая машина, создать отдельную"}
                  </button>
                </div>
              ) : null}
              <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                {__h($v.recHint)}
              </span>
            </div>
          ) : null}
          {$v.hasExtra ? (
            <div className="bolo-g2" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "24px" }}>
              {__a($v.nExtra).map((ef: any, $i0: number) => (
                <Fragment key={$i0}>
                  <label style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                      {__h(ef?.k)}
                    </span>
                    <input type="text" value={__s(ef?.v)} onChange={ef?.on} placeholder={ef?.ph} style={{ height: "34px", boxSizing: "border-box", padding: "0 10px", borderRadius: "6px", border: "0", borderBottom: `1px solid ${__s($v.c?.stroke2)}`, background: $v.c?.field, fontSize: "14px", color: $v.c?.text }} />
                  </label>
                </Fragment>
              ))}
            </div>
          ) : null}
          {$v.notAlert ? (
            <div className="bolo-g2" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "24px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "0" }}>
                <span style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                    {"Статья Penal Code"}
                  </span>
                </span>
                {$v.pcOff ? (
                  <span style={{ padding: "10px 12px", borderRadius: "8px", border: `1px dashed ${__s($v.c?.stroke2)}`, fontSize: "13px", lineHeight: "18px", color: $v.c?.text2 }}>
                    {__h($v.pcOffText)}
                  </span>
                ) : null}
                {$v.pcOn ? (
                  <>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {__a($v.nPcSel).map((p: any, $i0: number) => (
                      <Fragment key={$i0}>
                        <span className="chip" style={{ height: "30px", borderRadius: "15px", padding: "0 6px 0 12px", gap: "6px", fontWeight: "400", background: $v.c?.btn, whiteSpace: "nowrap" }}>
                          <a href="#" onClick={$v.__go("Laws.dc.html")} className="lnk" style={{ color: $v.c?.link, fontWeight: "600", textDecoration: "none" }}>
                            {__h(p?.n)}
                          </a>
                          {__h(p?.t)}
                          <button className="btn hv" onClick={p?.del} aria-label="Убрать статью" style={{ width: "20px", height: "20px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: $v.c?.text2 }}>
                            <svg width="10" height="10" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                              <path d="M5 5l10 10M15 5L5 15"></path>
                            </svg>
                          </button>
                        </span>
                      </Fragment>
                    ))}
                  </div>
                  <BoloPcPicker $v={$v} />
                  </>
                ) : null}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "0" }}>
                <span style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                    {"С кем связаться"}
                  </span>
                  <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                    {"видно в карточке и на листовке"}
                  </span>
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {__a($v.nCts).map((o: any, $i0: number) => (
                    <Fragment key={$i0}>
                      <button className="btn hv" onClick={o?.pick} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "7px 10px", borderRadius: "8px", background: o?.bg, boxShadow: o?.ring, textAlign: "left" }}>
                        <span style={{ width: "16px", height: "16px", boxSizing: "border-box", flexShrink: "0", borderRadius: "8px", border: o?.radio }}></span>
                        <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", lineHeight: "17px" }}>
                          <span className="ell" style={{ fontWeight: "600" }}>
                            {__h(o?.name)}
                          </span>
                          <span className="ell" style={{ fontSize: "12px", color: $v.c?.text2 }}>
                            {__h(o?.role)}{" · "}
                            <span className="num">
                              {__h(o?.phone)}
                            </span>
                          </span>
                        </span>
                        <span style={{ flexShrink: "0", fontSize: "12px", color: $v.c?.text2, whiteSpace: "nowrap" }}>
                          {__h(o?.tag)}
                        </span>
                      </button>
                    </Fragment>
                  ))}
                  {$v.ctPicking ? (
                    <BoloStaffPicker $v={$v} />
                  ) : (
                    <button className="btn hv lnk" onClick={$v.ctPickOpen} style={{ alignSelf: "flex-start", height: "26px", padding: "0 2px", fontSize: "13px", color: $v.c?.link }}>
                      {"Другой сотрудник…"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : null}
          {$v.notAlert ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2, marginRight: "4px" }}>
                {"Привязать"}
              </span>
              <BoloLinksEditor $v={$v} />
            </div>
          ) : null}
          <div className="bolo-g2" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "24px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <span style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                {"Приоритет"}
              </span>
              <div style={{ display: "flex", gap: "2px", padding: "3px", borderRadius: "8px", background: $v.c?.card }}>
                {__a($v.nPrio).map((o: any, $i0: number) => (
                  <Fragment key={$i0}>
                    <button className="btn" onClick={o?.pick} style={{ flex: "1", height: "30px", borderRadius: "6px", background: o?.bg, color: o?.fg, fontSize: "13px", fontWeight: o?.fw, textAlign: "center" }}>
                      {__h(o?.t)}
                    </button>
                  </Fragment>
                ))}
              </div>
            </div>
            {$v.notAlert ? (
              <>
              {$v.armedOk ? (
                <button className="btn" onClick={$v.toggleArmed} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", marginTop: "22px", borderRadius: "8px", background: $v.armedBg }}>
                  <span style={{ position: "relative", width: "40px", height: "20px", boxSizing: "border-box", flexShrink: "0", borderRadius: "10px", background: $v.armTogBg, border: `1px solid ${__s($v.armTogBorder)}` }}>
                    <span style={{ position: "absolute", top: "2px", left: "2px", width: "14px", height: "14px", borderRadius: "50%", background: $v.armKnob, transform: `translateX(${__s($v.armX)})` }}></span>
                  </span>
                  <span style={{ display: "flex", flexDirection: "column", lineHeight: "17px" }}>
                    <span style={{ fontWeight: "600", color: $v.armedFg }}>
                      {__h($v.armedLabel)}
                    </span>
                    <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                      {"Метка видна на карточке и в рации"}
                    </span>
                  </span>
                </button>
              ) : null}
              </>
            ) : null}
          </div>
          {$v.isIncident ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <span style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                {"Что случилось"}
              </span>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {__a($v.nAks).map((o: any, $i0: number) => (
                  <Fragment key={$i0}>
                    <button className="btn hv" onClick={o?.pick} style={{ height: "30px", padding: "0 12px", borderRadius: "15px", background: o?.bg, color: o?.fg, fontSize: "13px", fontWeight: o?.fw, whiteSpace: "nowrap" }}>
                      {__h(o?.t)}
                    </button>
                  </Fragment>
                ))}
              </div>
            </div>
          ) : null}
          {$v.isIncident ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <label style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <span style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                  {"Заголовок"}
                </span>
                <input type="text" value={$v.fv('alTitle')} onChange={$v.fon('alTitle')} placeholder="Коротко: что и где" style={{ height: "34px", boxSizing: "border-box", padding: "0 10px", borderRadius: "6px", border: "0", borderBottom: `1px solid ${__s($v.c?.stroke2)}`, background: $v.c?.card, color: $v.c?.text, fontSize: "14px" }} />
{$v.nE?.alTitle ? <span data-bolo-err="" style={{ fontSize: "12px", lineHeight: "16px", color: $v.T?.red }}>{$v.nE.alTitle}</span> : null}
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <span style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                  {"Описание"}
                </span>
                <textarea rows={2} style={{ resize: "none", boxSizing: "border-box", padding: "8px 10px", borderRadius: "6px", border: "0", borderBottom: `1px solid ${__s($v.c?.stroke2)}`, background: $v.c?.card, color: $v.c?.text, fontSize: "14px", lineHeight: "20px", fontFamily: "inherit" }} value={$v.fv('alDesc')} onChange={$v.fon('alDesc')} placeholder={$v.fph('alDesc')} />
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <span style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                    {"Пункты"}
                  </span>
                  <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                    {"свои пункты: подпись слева, значение справа · попадут на листовку таблицей"}
                  </span>
                </span>
                <div style={{ display: "flex", flexDirection: "column", borderRadius: "8px", overflow: "hidden", background: $v.c?.card }}>
                  {__a($v.alFacts).map((af: any, $i0: number) => (
                    <Fragment key={$i0}>
                      <div onDragStart={(e) => e.dataTransfer.setData('text/plain', String($i0))} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); $v.alMove(+e.dataTransfer.getData('text/plain'), $i0) }} onDragEnd={(e) => { e.currentTarget.draggable = false }} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0 6px 0 10px", borderBottom: `1px solid ${__s($v.c?.stroke)}` }}>
                        <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" onMouseDown={(e) => { const row = e.currentTarget.parentElement; if (row) row.draggable = true }} style={{ flexShrink: "0", color: $v.c?.text2, cursor: "grab" }}>
                          <circle cx="7" cy="5" r="1.5"></circle>
                          <circle cx="13" cy="5" r="1.5"></circle>
                          <circle cx="7" cy="10" r="1.5"></circle>
                          <circle cx="13" cy="10" r="1.5"></circle>
                          <circle cx="7" cy="15" r="1.5"></circle>
                          <circle cx="13" cy="15" r="1.5"></circle>
                        </svg>
                        <input type="text" value={__s(af?.k)} onChange={af?.onK} placeholder="Подпись" aria-label="Подпись пункта" style={{ width: "200px", flexShrink: "0", height: "38px", border: "0", borderRight: `1px solid ${__s($v.c?.stroke)}`, background: "transparent", color: $v.c?.text2, fontSize: "14px" }} />
                        <input type="text" value={__s(af?.v)} onChange={af?.onV} placeholder="Значение" aria-label={af?.k} style={{ flex: "1", minWidth: "0", height: "38px", border: "0", background: "transparent", color: $v.c?.text, fontSize: "14px" }} />
                        <button className="btn hv" aria-label="Убрать пункт" onClick={af?.del} style={{ width: "28px", height: "28px", flexShrink: "0", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", color: $v.c?.text2 }}>
                          <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                            <path d="M5 5l10 10M15 5L5 15"></path>
                          </svg>
                        </button>
                      </div>
                    </Fragment>
                  ))}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0 6px 0 32px", borderBottom: `1px solid ${__s($v.c?.stroke)}`, opacity: ".6" }}>
                    <input type="text" value="" onChange={(e) => $v.alAddWith(0, e.target.value)} placeholder="Новая подпись" style={{ width: "200px", flexShrink: "0", height: "38px", border: "0", borderRight: `1px solid ${__s($v.c?.stroke)}`, background: "transparent", color: $v.c?.text2, fontSize: "14px" }} />
                    <input type="text" value="" onChange={(e) => $v.alAddWith(1, e.target.value)} placeholder="Значение" style={{ flex: "1", minWidth: "0", height: "38px", border: "0", background: "transparent", color: $v.c?.text, fontSize: "14px" }} />
                  </div>
                  <button className="btn hv" onClick={$v.alAdd} style={{ height: "38px", padding: "0 12px", display: "flex", alignItems: "center", gap: "8px", color: $v.c?.link, fontSize: "13px", textAlign: "left" }}>
                    <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                      <path d="M10 4v12M4 10h12"></path>
                    </svg>
                    {"Добавить пункт"}
                  </button>
                </div>
                <span style={{ display: "flex", gap: "6px", flexWrap: "wrap", fontSize: "12px", color: $v.c?.text2 }}>
                  {"Быстро добавить:"}
                  {__a($v.alQuick).map((aq: any, $i0: number) => (
                    <Fragment key={$i0}>
                      <button className="btn hv" onClick={aq?.add} style={{ height: "22px", padding: "0 8px", borderRadius: "11px", background: $v.c?.btn, color: $v.c?.text, fontSize: "12px" }}>
                        {"+ "}{__h(aq?.t)}
                      </button>
                    </Fragment>
                  ))}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "50%" }}>
                <span style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                  {"Уровень опасности"}
                </span>
                <div style={{ display: "flex", gap: "2px", padding: "3px", borderRadius: "8px", background: $v.c?.card }}>
                  {__a($v.nLvls).map((o: any, $i0: number) => (
                    <Fragment key={$i0}>
                      <button className="btn" onClick={o?.pick} style={{ flex: "1", height: "30px", borderRadius: "6px", background: o?.bg, color: o?.fg, fontSize: "13px", fontWeight: o?.fw, textAlign: "center" }}>
                        {__h(o?.t)}
                      </button>
                    </Fragment>
                  ))}
                </div>
              </div>
              <label style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <span style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                  {"Что делать жителям"}
                </span>
                <textarea rows={3} style={{ resize: "none", boxSizing: "border-box", padding: "8px 10px", borderRadius: "6px", border: "0", borderBottom: `1px solid ${__s($v.c?.stroke2)}`, background: $v.c?.card, color: $v.c?.text, fontSize: "14px", lineHeight: "20px", fontFamily: "inherit" }} value={$v.fv('alTodo')} onChange={$v.fon('alTodo')} placeholder={$v.fph('alTodo')} />
{$v.nE?.alTodo ? <span data-bolo-err="" style={{ fontSize: "12px", lineHeight: "16px", color: $v.T?.red }}>{$v.nE.alTodo}</span> : null}
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <span style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                  {"Куда звонить"}
                </span>
                <input type="text" value={$v.fv('alCall')} onChange={$v.fon('alCall')} placeholder={$v.fph('alCall')} style={{ height: "34px", boxSizing: "border-box", padding: "0 10px", borderRadius: "6px", border: "0", borderBottom: `1px solid ${__s($v.c?.stroke2)}`, background: $v.c?.card, color: $v.c?.text, fontSize: "14px" }} />
              </label>
            </div>
          ) : null}
          {$v.isBulletin ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div className="bolo-g2" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "24px" }}>
                <label style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <span style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                      {"Заголовок листовки"}
                    </span>
                    <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                      {"крупно, красным"}
                    </span>
                  </span>
                  <input type="text" value={$v.fv('bTitle')} onChange={$v.fon('bTitle')} placeholder={$v.fph('bTitle')} style={{ height: "34px", boxSizing: "border-box", padding: "0 10px", borderRadius: "6px", border: "0", borderBottom: `1px solid ${__s($v.c?.stroke2)}`, background: $v.c?.card, color: $v.c?.text, fontSize: "14px" }} />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <span style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                      {"Подзаголовок"}
                    </span>
                    <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                      {"о чём бюллетень"}
                    </span>
                  </span>
                  <input type="text" value={$v.fv('bSub')} onChange={$v.fon('bSub')} placeholder={$v.fph('bSub')} style={{ height: "34px", boxSizing: "border-box", padding: "0 10px", borderRadius: "6px", border: "0", borderBottom: `1px solid ${__s($v.c?.stroke2)}`, background: $v.c?.card, color: $v.c?.text, fontSize: "14px" }} />
{$v.nE?.bSub ? <span data-bolo-err="" style={{ fontSize: "12px", lineHeight: "16px", color: $v.T?.red }}>{$v.nE.bSub}</span> : null}
                </label>
              </div>
              <label style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <span style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                    {"Текст"}
                  </span>
                  <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                    {"абзацы через пустую строку"}
                  </span>
                </span>
                <textarea rows={6} style={{ resize: "none", boxSizing: "border-box", padding: "8px 10px", borderRadius: "6px", border: "0", borderBottom: `1px solid ${__s($v.c?.stroke2)}`, background: $v.c?.card, color: $v.c?.text, fontSize: "14px", lineHeight: "20px", fontFamily: "inherit" }} value={$v.fv('bText')} onChange={$v.fon('bText')} placeholder={$v.fph('bText')} />
{$v.nE?.bText ? <span data-bolo-err="" style={{ fontSize: "12px", lineHeight: "16px", color: $v.T?.red }}>{$v.nE.bText}</span> : null}
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <label style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <span style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                      {"Заголовок списка"}
                    </span>
                    <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                      {"над пунктами на листовке"}
                    </span>
                  </span>
                  <input type="text" value={$v.fv('bListT')} onChange={$v.fon('bListT')} placeholder={$v.fph('bListT')} style={{ height: "34px", boxSizing: "border-box", padding: "0 10px", borderRadius: "6px", border: "0", borderBottom: `1px solid ${__s($v.c?.stroke2)}`, background: $v.c?.card, color: $v.c?.text, fontSize: "14px" }} />
                </label>
                <div style={{ display: "flex", flexDirection: "column", borderRadius: "8px", overflow: "hidden", background: $v.c?.card }}>
                  {__a($v.bulRecs).map((br: any, $i0: number) => (
                    <Fragment key={$i0}>
                      <div onDragStart={(e) => e.dataTransfer.setData('text/plain', String($i0))} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); $v.bulMove(+e.dataTransfer.getData('text/plain'), $i0) }} onDragEnd={(e) => { e.currentTarget.draggable = false }} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0 6px 0 10px", borderBottom: `1px solid ${__s(br?.sep)}` }}>
                        <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" onMouseDown={(e) => { const row = e.currentTarget.parentElement; if (row) row.draggable = true }} style={{ flexShrink: "0", color: $v.c?.text2, cursor: "grab" }}>
                          <circle cx="7" cy="5" r="1.5"></circle>
                          <circle cx="13" cy="5" r="1.5"></circle>
                          <circle cx="7" cy="10" r="1.5"></circle>
                          <circle cx="13" cy="10" r="1.5"></circle>
                          <circle cx="7" cy="15" r="1.5"></circle>
                          <circle cx="13" cy="15" r="1.5"></circle>
                        </svg>
                        <span className="num" style={{ width: "22px", flexShrink: "0", fontWeight: "700", color: $v.T?.red }}>
                          {__h(br?.n)}
                        </span>
                        <input type="text" value={__s(br?.t)} onChange={br?.onT} aria-label={`Пункт ${__s(br?.n)}`} style={{ flex: "1", minWidth: "0", height: "38px", border: "0", background: "transparent", color: $v.c?.text, fontSize: "14px" }} />
                        <button className="btn hv" aria-label="Убрать пункт" onClick={br?.del} style={{ width: "28px", height: "28px", flexShrink: "0", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", color: $v.c?.text2 }}>
                          <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                            <path d="M5 5l10 10M15 5L5 15"></path>
                          </svg>
                        </button>
                      </div>
                    </Fragment>
                  ))}
                  <button className="btn hv" onClick={$v.bulAdd} style={{ height: "38px", padding: "0 12px", display: "flex", alignItems: "center", gap: "8px", color: $v.c?.link, fontSize: "13px", textAlign: "left" }}>
                    <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                      <path d="M10 4v12M4 10h12"></path>
                    </svg>
                    {"Добавить пункт"}
                  </button>
                </div>
                <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                  {"Перетащите за точки, чтобы поменять порядок. Нумерация на листовке обновится сама."}
                </span>
              </div>
              <div className="bolo-g2" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "24px" }}>
                <label style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                    {"Контакты отдела"}
                  </span>
                  <input type="text" value={$v.fv('bCt')} onChange={$v.fon('bCt')} placeholder={$v.fph('bCt')} style={{ height: "34px", boxSizing: "border-box", padding: "0 10px", borderRadius: "6px", border: "0", borderBottom: `1px solid ${__s($v.c?.stroke2)}`, background: $v.c?.card, color: $v.c?.text, fontSize: "14px" }} />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                    {"Утвердил"}
                  </span>
                  <input type="text" value={$v.fv('bAppr')} onChange={$v.fon('bAppr')} placeholder={$v.fph('bAppr')} style={{ height: "34px", boxSizing: "border-box", padding: "0 10px", borderRadius: "6px", border: "0", borderBottom: `1px solid ${__s($v.c?.stroke2)}`, background: $v.c?.card, color: $v.c?.text, fontSize: "14px" }} />
                </label>
              </div>
            </div>
          ) : null}
          {$v.notAlert ? (
            <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                {__h($v.descLabel)}
              </span>
              <textarea rows={3} style={{ resize: "none", boxSizing: "border-box", padding: "8px 10px", borderRadius: "6px", border: "0", borderBottom: `1px solid ${__s($v.c?.stroke2)}`, background: $v.c?.field, fontSize: "14px", lineHeight: "20px", color: $v.c?.text }} value={__s($v.descVal)} onChange={$v.onDesc} placeholder={$v.descPh} />
{$v.nE?.desc ? <span data-bolo-err="" style={{ fontSize: "12px", lineHeight: "16px", color: $v.T?.red }}>{$v.nE.desc}</span> : null}
            </label>
          ) : null}
          {$v.notBulletinNew ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <span style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                <span style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                  {"Фото"}
                </span>
                <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                  {"первое попадёт на карточку и листовку · до 6 штук"}
                </span>
              </span>
              <div className="bolo-g6" style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: "8px" }}>
                {__a($v.nPhotos).map((ph: any, $i0: number) => (
                  <Fragment key={$i0}>
                    <span style={{ position: "relative", display: "block" }}>
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
                      {" "}
                      {ph?.main ? (
                        <span style={{ position: "absolute", left: "4px", top: "4px", padding: "0 6px", borderRadius: "4px", background: $v.accent, color: $v.onAccent, fontSize: "10px", fontWeight: "700", lineHeight: "16px" }}>
                          {"Главное"}
                        </span>
                      ) : null}
                      {" "}
                    </span>
                  </Fragment>
                ))}
                <button className="btn hv" onClick={$v.addPhotoNew} style={{ aspectRatio: "4 / 3", borderRadius: "8px", border: `1px dashed ${__s($v.c?.stroke2)}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2px", color: $v.c?.text2, fontSize: "11px", textAlign: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M10 4v12M4 10h12"></path>
                  </svg>
                  {" Перетащите или выберите "}
                </button>
              </div>
            </div>
          ) : null}
          <div className="bolo-g2" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)", gap: "24px" }}>
            {$v.notAlert ? (
              <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                  {__h($v.placeLabel)}
                </span>
                <span style={{ display: "flex", gap: "6px" }}>
                  <input type="text" value={__s($v.nPlaceVal)} onChange={$v.onPlace} placeholder={$v.placePh} style={{ flex: "1", minWidth: "0", height: "34px", boxSizing: "border-box", padding: "0 10px", borderRadius: "6px", border: "0", borderBottom: `1px solid ${__s($v.c?.stroke2)}`, background: $v.c?.field, fontSize: "14px", color: $v.c?.text }} />
                  <button className="btn hv" onClick={$v.pickForNew} style={{ height: "34px", padding: "0 12px", borderRadius: "6px", display: "flex", alignItems: "center", gap: "6px", background: $v.nPickBg, color: $v.nPickFg, whiteSpace: "nowrap", fontWeight: "600" }}>
                    <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M10 17.5s-5.5-5-5.5-9a5.5 5.5 0 0111 0c0 4-5.5 9-5.5 9z"></path>
                      <circle cx="10" cy="8.5" r="2"></circle>
                    </svg>
                    {" "}{__h($v.nPickLabel)}{" "}
                  </button>
                </span>
{$v.nE?.place ? <span data-bolo-err="" style={{ fontSize: "12px", lineHeight: "16px", color: $v.T?.red }}>{$v.nE.place}</span> : null}
              </label>
            ) : null}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <span style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                {"Действует"}
              </span>
              <div style={{ display: "flex", gap: "2px", padding: "3px", borderRadius: "8px", background: $v.c?.card }}>
                {__a($v.nTerm).map((o: any, $i0: number) => (
                  <Fragment key={$i0}>
                    <button className="btn" onClick={o?.pick} style={{ flex: "1", height: "28px", borderRadius: "6px", background: o?.bg, color: o?.fg, fontSize: "13px", fontWeight: o?.fw, textAlign: "center", whiteSpace: "nowrap" }}>
                      {__h(o?.t)}
                    </button>
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <span style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
              {"Зона"}
            </span>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {__a($v.nZones).map((o: any, $i0: number) => (
                <Fragment key={$i0}>
                  <button className="btn hv" onClick={o?.pick} style={{ height: "30px", padding: "0 12px", borderRadius: "15px", background: o?.bg, color: o?.fg, fontSize: "13px", fontWeight: o?.fw, whiteSpace: "nowrap" }}>
                    {__h(o?.t)}
                  </button>
                </Fragment>
              ))}
            </div>
          </div>
          {$v.notAlert ? (
            <label style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                {__h($v.instrLabel)}
              </span>
              <input type="text" value={__s($v.instrVal)} onChange={$v.onInstr} placeholder={$v.instrPh} style={{ height: "34px", boxSizing: "border-box", padding: "0 10px", borderRadius: "6px", border: "0", borderBottom: `1px solid ${__s($v.c?.stroke2)}`, background: $v.c?.field, fontSize: "14px", color: $v.c?.text }} />
            </label>
          ) : null}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <span style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
              {"Кто видит"}
            </span>
            <div style={{ display: "flex", gap: "2px", padding: "3px", borderRadius: "8px", background: $v.c?.card }}>
              {__a($v.nAccs).map((o: any, $i0: number) => (
                <Fragment key={$i0}>
                  <button className="btn" onClick={o?.pick} style={{ flex: "1", height: "30px", borderRadius: "6px", background: o?.bg, color: o?.fg, fontSize: "13px", fontWeight: o?.fw, textAlign: "center", whiteSpace: "nowrap" }}>
                    {__h(o?.t)}
                  </button>
                </Fragment>
              ))}
            </div>
            <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
              {__h($v.nAccHint)}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "13px", fontWeight: "600", paddingBottom: "4px" }}>
              {"Рассылка"}
            </span>
            {__a($v.nSend).map((o: any, $i0: number) => (
              <Fragment key={$i0}>
                <button className="btn" onClick={o?.pick} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "4px 0" }}>
                  <span style={{ width: "18px", height: "18px", boxSizing: "border-box", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", background: o?.bg, border: `1px solid ${__s(o?.border)}`, color: $v.onAccent }}>
                    {o?.on ? (
                      <svg width="11" height="11" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M4.5 10.5l3.5 3.5 7.5-8"></path>
                      </svg>
                    ) : null}
                  </span>
                  <span>
                    {__h(o?.t)}
                  </span>
                </button>
              </Fragment>
            ))}
          </div>
        </div>
        <div className="bolo-rail" style={{ width: "340px", flexShrink: "0", borderLeft: `1px solid ${__s($v.c?.stroke)}`, background: $v.c?.rail, display: "flex", flexDirection: "column" }}>
          <div className="scroll" style={{ flex: "1", minHeight: "0", padding: "58px 18px 18px 18px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <span style={{ fontSize: "12px", fontWeight: "600", color: $v.c?.text2 }}>
              {"Так увидят на смене"}
            </span>
            <div style={{ display: "flex", gap: "12px", padding: "12px", borderRadius: "10px", background: $v.c?.card }}>
              <span style={{ position: "relative", width: "56px", height: "56px", flexShrink: "0", borderRadius: "8px", overflow: "hidden", background: $v.c?.mug }}>
                {$v.recMug ? (
                  <img src={$v.recImg} alt="Фото" style={{ position: "absolute", left: "0", top: "0", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 12%", display: "block" }} />
                ) : null}
                {$v.recCar ? (
                  <img src={$v.recCarImg} alt="Фото" style={{ position: "absolute", left: "4px", top: "16px", width: "48px", height: "26px", objectFit: "contain", display: "block" }} />
                ) : null}
                {$v.prevUnknown ? (
                  <span style={{ position: "absolute", left: "0", right: "0", top: "13px", textAlign: "center", fontSize: "22px", fontWeight: "700", color: $v.c?.text }}>
                    {"?"}
                  </span>
                ) : null}
                {$v.isAlert ? (
                  <svg width="32" height="32" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ position: "absolute", left: "12px", top: "12px", color: $v.c?.text2 }}>
                    <path d="M3 9.5L10 4l7 5.5M5 8v5M15 8v5"></path>
                    <path d="M2 15c1.3 0 1.3 1 2.7 1s1.3-1 2.6-1 1.3 1 2.7 1 1.3-1 2.6-1 1.3 1 2.7 1 1.4-1 2.7-1"></path>
                  </svg>
                ) : null}
              </span>
              <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "3px" }}>
                <span style={{ fontWeight: "600" }}>
                  {__h($v.prevName)}
                </span>
                <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                  {__h($v.prevSub)}
                </span>
                <span style={{ display: "flex", gap: "4px", flexWrap: "wrap", paddingTop: "2px" }}>
                  {__a($v.prevChips).map((ch: any, $i0: number) => (
                    <Fragment key={$i0}>
                      <span className="chip" style={{ height: "20px", fontSize: "11px", padding: "0 7px", background: ch?.bg, color: ch?.fg }}>
                        {__h(ch?.t)}
                      </span>
                    </Fragment>
                  ))}
                </span>
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", padding: "12px", borderRadius: "10px", background: $v.c?.card, fontSize: "13px" }}>
              <span style={{ fontSize: "12px", fontWeight: "600", color: $v.c?.text2 }}>
                {"Текст для рации"}
              </span>
              <span style={{ lineHeight: "19px" }}>
                {__h($v.radioText)}
              </span>
            </div>
            <span style={{ fontSize: "12px", lineHeight: "17px", color: $v.c?.text2 }}>
              {"Ориентировка публикуется от вашего имени. Закрыть её могут автор, ведущий по делу и сержанты смены."}
            </span>
          </div>
          <div style={{ display: "flex", gap: "8px", padding: "14px 18px 16px 18px", borderTop: `1px solid ${__s($v.c?.stroke)}` }}>
            <button className="btn hv" onClick={$v.goFeed} style={{ flex: "1", height: "36px", borderRadius: "6px", background: $v.c?.btn, textAlign: "center" }}>
              {"Отмена"}
            </button>
            <button className="btn acc" onClick={$v.publish} style={{ flex: "1.6", height: "36px", borderRadius: "6px", background: $v.accent, color: $v.onAccent, fontWeight: "600", textAlign: "center" }}>
              {"Опубликовать"}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
