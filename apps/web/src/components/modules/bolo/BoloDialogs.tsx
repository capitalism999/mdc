/* Generated 1:1 from the design reference (project/BOLO.dc.html) — markup, styles and copy are a literal port. */
import { Fragment } from 'react'
import { __a, __h, __s, type BoloVals } from './boloRuntime'
import { BoloTerrain } from './boloTerrain'
import { BoloArrestPicker, BoloCloseNote, BoloUpdateEditors } from './boloPickers'

export function BoloSeenDialog({ $v }: { $v: BoloVals }) {
  if (!$v.seenDlg) return null
  return (
    <>
      <div onClick={(e) => { if (e.target === e.currentTarget) $v.closeSeen() }} data-ov="" style={{ position: "absolute", inset: "0", zIndex: "20", background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div role="dialog" aria-label="Отметить: замечен" style={{ width: "640px", boxSizing: "border-box", borderRadius: "10px", background: $v.c?.dialog, border: `1px solid ${__s($v.c?.stroke)}`, boxShadow: "0 32px 64px rgba(0,0,0,0.55)", overflow: "hidden" }}>
          {" "}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "24px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "20px", lineHeight: "28px", fontWeight: "600" }}>
                {"Замечен: "}{__h($v.b?.title)}
              </span>
              <span style={{ fontSize: "13px", color: $v.c?.text2 }}>
                {__h($v.b?.id)}{" · отметку увидят все на смене и автор ориентировки"}
              </span>
            </div>
            <div style={{ display: "flex", gap: "14px" }}>
              <div style={{ position: "relative", width: "220px", height: "170px", flexShrink: "0", borderRadius: "10px", overflow: "hidden", background: $v.c?.mapWater }}>
                <BoloTerrain $v={$v} mode="seen" pts={undefined}>
                </BoloTerrain>
                <span style={{ position: "absolute", left: "6px", right: "6px", bottom: "6px", display: "none" }}></span>
                <span style={{ position: "absolute", right: "6px", top: "6px", padding: "2px 6px", borderRadius: "4px", background: "rgba(0,0,0,0.5)", color: "#FFFFFF", fontSize: "10px" }}>
                  {__h($v.seenSrcTag)}
                </span>
                <button className="btn" onClick={$v.pickForSeen} style={{ position: "absolute", left: "6px", right: "6px", bottom: "6px", height: "28px", borderRadius: "6px", background: "rgba(0,0,0,0.6)", color: "#FFFFFF", fontSize: "12px", fontWeight: "600", textAlign: "center" }}>
                  {"Уточнить на карте"}
                </button>
              </div>
              <div style={{ flex: "1", display: "flex", flexDirection: "column", gap: "10px" }}>
                <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: $v.c?.text2 }}>
                    {"Где"}
                  </span>
                  <input type="text" value={$v.sfv('place', $v.seenPlaceText)} onChange={$v.sfon('place')} style={{ height: "32px", boxSizing: "border-box", padding: "0 10px", borderRadius: "6px", border: "0", borderBottom: `1px solid ${__s($v.c?.stroke2)}`, background: $v.c?.field, color: $v.c?.text }} />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: $v.c?.text2 }}>
                    {"Когда"}
                  </span>
                  <input type="text" value={$v.sfv('when', 'Сейчас · ' + $v.__now)} onChange={$v.sfon('when')} style={{ height: "32px", boxSizing: "border-box", padding: "0 10px", borderRadius: "6px", border: "0", borderBottom: `1px solid ${__s($v.c?.stroke2)}`, background: $v.c?.field, color: $v.c?.text }} />
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: $v.c?.text2 }}>
                    {"Куда двигался"}
                  </span>
                  <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                    {__a($v.dirs).map((o: any, $i0: number) => (
                      <Fragment key={$i0}>
                        <button className="btn hv" onClick={o?.pick} style={{ height: "28px", padding: "0 10px", borderRadius: "14px", background: o?.bg, color: o?.fg, fontSize: "12px", fontWeight: o?.fw, whiteSpace: "nowrap" }}>
                          {__h(o?.t)}
                        </button>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "12px", fontWeight: "600", color: $v.c?.text2 }}>
                {"Как выглядел"}
              </span>
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                {__a($v.how).map((o: any, $i0: number) => (
                  <Fragment key={$i0}>
                    <button className="btn hv" onClick={o?.pick} style={{ height: "28px", padding: "0 10px", borderRadius: "14px", background: o?.bg, color: o?.fg, fontSize: "12px", fontWeight: o?.fw, whiteSpace: "nowrap" }}>
                      {__h(o?.t)}
                    </button>
                  </Fragment>
                ))}
              </div>
            </div>
            <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "12px", fontWeight: "600", color: $v.c?.text2 }}>
                {"Комментарий"}
              </span>
              <textarea rows={2} style={{ resize: "none", boxSizing: "border-box", padding: "8px 10px", borderRadius: "6px", border: "0", borderBottom: `1px solid ${__s($v.c?.stroke2)}`, background: $v.c?.field, fontSize: "14px", lineHeight: "20px", color: $v.c?.text }} value={$v.sfv('note', '')} onChange={$v.sfon('note')} placeholder="Что видели: одежда, с кем, что делал" />
            </label>
            <button className="btn" onClick={$v.toggleBackup} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", borderRadius: "8px", background: $v.backupBg }}>
              <span style={{ position: "relative", width: "40px", height: "20px", boxSizing: "border-box", flexShrink: "0", borderRadius: "10px", background: $v.bTogBg, border: `1px solid ${__s($v.bTogBorder)}` }}>
                <span style={{ position: "absolute", top: "2px", left: "2px", width: "14px", height: "14px", borderRadius: "50%", background: $v.bKnob, transform: `translateX(${__s($v.bX)})` }}></span>
              </span>
              <span style={{ display: "flex", flexDirection: "column", lineHeight: "17px" }}>
                <span style={{ fontWeight: "600", color: $v.backupFg }}>
                  {"Нужна поддержка"}
                </span>
                <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                  {"Диспетчер получит вызов с вашей позицией, ближайшие экипажи — уведомление"}
                </span>
              </span>
            </button>
          </div>
          {" "}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", padding: "14px 24px", background: $v.c?.dialogFoot, borderTop: `1px solid ${__s($v.c?.stroke)}` }}>
            <button className="btn hv" onClick={$v.closeSeen} style={{ width: "120px", height: "34px", borderRadius: "6px", background: $v.c?.btn, textAlign: "center" }}>
              {"Отмена"}
            </button>
            <button className="btn acc" onClick={$v.sendSeen} style={{ width: "200px", height: "34px", borderRadius: "6px", background: $v.accent, color: $v.onAccent, fontWeight: "600", textAlign: "center" }}>
              {"Отправить отметку"}
            </button>
          </div>
          {" "}
        </div>
      </div>
    </>
  )
}

export function BoloUpdateDialog({ $v }: { $v: BoloVals }) {
  if (!$v.updDlg) return null
  return (
    <>
      <div onClick={(e) => { if (e.target === e.currentTarget) $v.cancelUpd() }} data-ov="" style={{ position: "absolute", inset: "0", zIndex: "20", background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div role="dialog" aria-label="Обновить ориентировку" style={{ width: "560px", boxSizing: "border-box", borderRadius: "10px", background: $v.c?.dialog, border: `1px solid ${__s($v.c?.stroke)}`, boxShadow: "0 32px 64px rgba(0,0,0,0.55)", overflow: "hidden" }}>
          {" "}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "24px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "20px", lineHeight: "28px", fontWeight: "600" }}>
                {"Обновить ориентировку"}
              </span>
              <span style={{ fontSize: "13px", color: $v.c?.text2 }}>
                {__h($v.b?.id)}{" · "}{__h($v.b?.title)}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                {"Что изменилось"}
              </span>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {__a($v.updWhat).map((o: any, $i0: number) => (
                  <Fragment key={$i0}>
                    <button className="btn hv" onClick={o?.pick} style={{ height: "30px", padding: "0 12px", borderRadius: "15px", background: o?.bg, color: o?.fg, fontSize: "13px", fontWeight: o?.fw, whiteSpace: "nowrap" }}>
                      {__h(o?.t)}
                    </button>
                  </Fragment>
                ))}
              </div>
            </div>
            <BoloUpdateEditors $v={$v} />
            <label style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontSize: "13px", fontWeight: "600", color: $v.c?.text2 }}>
                {"Коротко для смены"}
              </span>
              <textarea rows={3} onChange={$v.onUpdText} placeholder="Что нового, одной-двумя фразами" style={{ resize: "none", boxSizing: "border-box", padding: "8px 10px", borderRadius: "6px", border: "0", borderBottom: `1px solid ${__s($v.c?.stroke2)}`, background: $v.c?.field, fontSize: "14px", lineHeight: "20px", color: $v.c?.text }} value={__s($v.updTextVal)} />
              <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                {"Выберите выше, что изменилось, — поля откроются для правки и сразу попадут в карточку и листовку. Этот текст уйдёт в уведомление и историю."}
              </span>
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {__a($v.updChecks).map((o: any, $i0: number) => (
                <Fragment key={$i0}>
                  <button className="btn" onClick={o?.pick} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "5px 0", textAlign: "left" }}>
                    <span style={{ width: "18px", height: "18px", boxSizing: "border-box", flexShrink: "0", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", background: o?.bg, border: `1px solid ${__s(o?.border)}`, color: $v.onAccent }}>
                      {o?.on ? (
                        <svg width="11" height="11" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M4.5 10.5l3.5 3.5 7.5-8"></path>
                        </svg>
                      ) : null}
                    </span>
                    <span style={{ display: "flex", flexDirection: "column", lineHeight: "18px" }}>
                      <span>
                        {__h(o?.t)}
                      </span>
                      <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                        {__a(o?.subP).map((qp: any, $i1: number) => (
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
                  </button>
                </Fragment>
              ))}
            </div>
          </div>
          {" "}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", padding: "14px 24px", background: $v.c?.dialogFoot, borderTop: `1px solid ${__s($v.c?.stroke)}` }}>
            <button className="btn hv" onClick={$v.cancelUpd} style={{ width: "120px", height: "34px", borderRadius: "6px", background: $v.c?.btn, textAlign: "center" }}>
              {"Отмена"}
            </button>
            <button className="btn acc" onClick={$v.confirmUpd} style={{ width: "160px", height: "34px", borderRadius: "6px", background: $v.accent, color: $v.onAccent, fontWeight: "600", textAlign: "center" }}>
              {"Обновить"}
            </button>
          </div>
          {" "}
        </div>
      </div>
    </>
  )
}

export function BoloCloseDialog({ $v }: { $v: BoloVals }) {
  if (!$v.closeDlg) return null
  return (
    <>
      <div onClick={(e) => { if (e.target === e.currentTarget) $v.cancelClose() }} data-ov="" style={{ position: "absolute", inset: "0", zIndex: "20", background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div role="dialog" aria-label="Закрыть ориентировку" style={{ width: "520px", boxSizing: "border-box", borderRadius: "10px", background: $v.c?.dialog, border: `1px solid ${__s($v.c?.stroke)}`, boxShadow: "0 32px 64px rgba(0,0,0,0.55)", overflow: "hidden" }}>
          {" "}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "24px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "20px", lineHeight: "28px", fontWeight: "600" }}>
                {"Закрыть ориентировку"}
              </span>
              <span style={{ fontSize: "13px", color: $v.c?.text2 }}>
                {__h($v.b?.id)}{" · "}{__h($v.b?.title)}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {__a($v.closeReasons).map((o: any, $i0: number) => (
                <Fragment key={$i0}>
                  <button className="btn hv" onClick={o?.pick} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", background: o?.bg, boxShadow: o?.ring }}>
                    <span style={{ width: "16px", height: "16px", boxSizing: "border-box", borderRadius: "50%", border: o?.radio }}></span>
                    <span style={{ flex: "1", display: "flex", flexDirection: "column", lineHeight: "18px" }}>
                      <span style={{ fontWeight: "600" }}>
                        {__h(o?.t)}
                      </span>
                      <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                        {__a(o?.subP).map((qp: any, $i1: number) => (
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
                  </button>
                </Fragment>
              ))}
            </div>
            {$v.closeArrestOn ? <BoloArrestPicker $v={$v} /> : null}
            {$v.closeNoteOn ? <BoloCloseNote $v={$v} /> : null}
            <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
              {"Связанные ориентировки, например на машину, предложим закрыть следующим шагом."}
            </span>
          </div>
          {" "}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", padding: "14px 24px", background: $v.c?.dialogFoot, borderTop: `1px solid ${__s($v.c?.stroke)}` }}>
            <button className="btn hv" onClick={$v.cancelClose} style={{ width: "120px", height: "34px", borderRadius: "6px", background: $v.c?.btn, textAlign: "center" }}>
              {"Отмена"}
            </button>
            <button className="btn acc" onClick={$v.confirmClose} style={{ width: "160px", height: "34px", borderRadius: "6px", background: $v.accent, color: $v.onAccent, fontWeight: "600", textAlign: "center" }}>
              {"Закрыть"}
            </button>
          </div>
          {" "}
        </div>
      </div>
    </>
  )
}

export function BoloIncoming({ $v }: { $v: BoloVals }) {
  if (!$v.incoming) return null
  return (
    <>
      <div role="alert" style={{ position: "absolute", right: "20px", top: "52px", zIndex: "40", width: "380px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "10px", padding: "14px 16px", borderRadius: "10px", background: $v.c?.flyout, border: `1px solid ${__s($v.c?.stroke)}`, boxShadow: "0 16px 40px rgba(0,0,0,0.55)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: "18px", height: "18px", borderRadius: "5px", background: "#C42B1C", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="10" cy="10" r="6.5"></circle>
              <circle cx="10" cy="10" r="2"></circle>
            </svg>
          </span>
          <span style={{ flex: "1", fontSize: "12px", color: $v.c?.text2 }}>
            {"Новая ориентировка от LSSD · сейчас"}
          </span>
          <button className="btn hv" onClick={$v.dismissIncoming} aria-label="Скрыть" style={{ width: "24px", height: "24px", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", color: $v.c?.text2 }}>
            <svg width="10" height="10" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M4 4l12 12M16 4L4 16"></path>
            </svg>
          </button>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <span style={{ position: "relative", width: "52px", height: "52px", flexShrink: "0", borderRadius: "8px", overflow: "hidden", background: $v.c?.mug }}>
            <span style={{ position: "absolute", left: "0", right: "0", top: "12px", textAlign: "center", fontSize: "20px", fontWeight: "700" }}>
              {"?"}
            </span>
          </span>
          <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "3px" }}>
            <span style={{ fontWeight: "600" }}>
              {"Неизвестный в балаклаве"}
            </span>
            <span style={{ fontSize: "12px", lineHeight: "16px", color: $v.c?.text2 }}>
              {"B-0420 · вооружённое ограбление Fleeca Bank, Great Ocean Hwy. Тёмный седан без номеров, на север."}
            </span>
            <span style={{ display: "flex", gap: "4px", paddingTop: "2px" }}>
              <span className="chip" style={{ height: "20px", fontSize: "11px", padding: "0 7px", background: $v.redBg, color: $v.redFg }}>
                {"Высокий"}
              </span>
              <span className="chip" style={{ height: "20px", fontSize: "11px", padding: "0 7px", background: $v.redBg, color: $v.redFg }}>
                {"Вооружён и опасен"}
              </span>
            </span>
          </span>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button className="btn hv" onClick={$v.ackIncoming} style={{ flex: "1", height: "32px", borderRadius: "6px", background: $v.c?.btn, textAlign: "center" }}>
            {"Ознакомлен"}
          </button>
          <button className="btn acc" onClick={$v.openIncoming} style={{ flex: "1", height: "32px", borderRadius: "6px", background: $v.accent, color: $v.onAccent, fontWeight: "600", textAlign: "center" }}>
            {"Открыть"}
          </button>
        </div>
      </div>
    </>
  )
}

export function BoloToast({ $v }: { $v: BoloVals }) {
  if (!$v.toast) return null
  return (
    <>
      <div role="status" style={{ position: "absolute", right: "24px", bottom: "24px", zIndex: "30", width: "360px", boxSizing: "border-box", display: "flex", gap: "12px", padding: "14px 16px", borderRadius: "8px", background: $v.c?.flyout, border: `1px solid ${__s($v.c?.stroke)}`, boxShadow: "0 12px 32px rgba(0,0,0,0.45)" }}>
        <span style={{ width: "28px", height: "28px", flexShrink: "0", borderRadius: "50%", background: $v.greenBg, color: $v.T?.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4.5 10.5l3.5 3.5 7.5-8"></path>
          </svg>
        </span>
        <span style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontWeight: "600" }}>
            {__h($v.toastTitle)}
          </span>
          <span style={{ fontSize: "13px", color: $v.c?.text2 }}>
            {__h($v.toastText)}
          </span>
        </span>
      </div>
    </>
  )
}
