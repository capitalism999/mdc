/* Generated 1:1 from the design reference (project/Search.dc.html) — markup, styles and copy are a literal port. */
import { Fragment, useEffect, useRef } from 'react'
import { __a, __h, __s, type SearchVals } from './searchRuntime'

export function SearchDialog({ $v }: { $v: SearchVals }) {
  // MDT: focus moves into the dialog (first field, else the dialog itself) so Esc / typing work at once
  const boxRef = useRef<HTMLDivElement>(null)
  const open = !!$v.dlg?.open
  const title = String($v.dlg?.title ?? '')
  useEffect(() => {
    if (!open) return
    const box = boxRef.current
    const field = box?.querySelector<HTMLElement>('input, textarea')
    ;(field ?? box)?.focus()
  }, [open, title])
  if (!open) return null
  return (
    <>
      {" "}
      <div onMouseDown={(e) => { if (e.target === e.currentTarget) $v.dlg?.close() /* MDT: click outside closes */ }} style={{ position: "fixed", left: "0", top: "0", right: "0", bottom: "0", zIndex: "20", background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div ref={boxRef} tabIndex={-1} role="dialog" aria-modal="true" className="scroll" aria-label={$v.dlg?.title} style={{ width: $v.dlg?.dlgW, maxHeight: "80vh", borderRadius: "14px", background: $v.c?.card, boxShadow: "0 16px 48px rgba(0,0,0,0.6)", padding: "20px", display: "flex", flexDirection: "column", gap: "14px", color: $v.c?.text }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            <div style={{ flex: "1", minWidth: "0", fontSize: "18px", fontWeight: "700" }}>
              {__h($v.dlg?.title)}
            </div>
            <button className="btn hv" onClick={$v.dlg?.close} aria-label="Закрыть диалог" style={{ width: "28px", height: "28px", flexShrink: "0", margin: "-4px -6px 0 0", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", color: $v.c?.text2 }}>
              <svg width="11" height="11" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                <path d="M5 5l10 10M15 5L5 15"></path>
              </svg>
            </button>
          </div>
          <div style={{ fontSize: "13px", lineHeight: "19px", color: $v.c?.text2 }}>
            {__h($v.dlg?.wText || $v.dlg?.text)}
          </div>
          {$v.dlg?.hasSearch ? (
            <input type="text" value={__s($v.dlg?.sVal)} onChange={$v.dlg?.setS} placeholder="Поиск статьи: код или название" aria-label="Поиск статьи" style={{ height: "38px", boxSizing: "border-box", padding: "0 12px", borderRadius: "8px", border: "0", background: $v.c?.search, fontSize: "14px", color: $v.c?.text }} />
          ) : null}
          {$v.dlg?.emptyList ? (
            <div style={{ fontSize: "13px", color: $v.c?.text2 }}>
              {"Ничего не найдено. Статья должна быть из кодекса с наказанием в виде штрафа."}
            </div>
          ) : null}
          {$v.dlg?.hasChoices ? (
            <div className="scroll" style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "252px", paddingRight: "4px" }}>
              {__a($v.dlg?.choices).map((ch: any, $i0: number) => (
                <Fragment key={$i0}>
                  <button className="btn hv" onClick={ch?.pick} style={{ minHeight: "40px", padding: "8px 12px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "10px", textAlign: "left", fontSize: "13px", background: ch?.bg, boxShadow: `inset 0 0 0 1px ${__s(ch?.ring)}` }}>
                    <span style={{ width: "20px", height: "20px", flexShrink: "0", borderRadius: "50%", boxSizing: "border-box", border: ch?.rb, background: ch?.rbg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ width: ch?.dsz, height: ch?.dsz, borderRadius: "50%", background: ch?.dc }}></span>
                    </span>
                    <span style={{ flex: "1", minWidth: "0" }}>
                      {__h(ch?.label)}
                    </span>
                    <span style={{ color: $v.c?.text2, whiteSpace: "nowrap" }}>
                      {__h(ch?.note)}
                    </span>
                  </button>
                </Fragment>
              ))}
            </div>
          ) : null}
          {$v.dlg?.hasInput ? (
            <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", color: $v.c?.text2 }}>
              {__h($v.dlg?.inLabel)}{" "}
              <input type="text" value={__s($v.dlg?.inVal)} onChange={$v.dlg?.setIn} placeholder={$v.dlg?.inHint} aria-label={$v.dlg?.inLabel} style={{ height: "38px", boxSizing: "border-box", padding: "0 12px", borderRadius: "8px", border: "0", background: $v.c?.search, boxShadow: `inset 0 0 0 1px ${__s($v.dlg?.inRing)}`, fontSize: "14px", color: $v.c?.text }} />
              <span style={{ minHeight: "16px", color: $v.dlg?.inNoteC }}>
                {__h($v.dlg?.inNote)}
              </span>
            </label>
          ) : null}
          {$v.dlg?.hasAmt ? (
            <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", color: $v.c?.text2 }}>
              {"Сумма штрафа "}
              <input type="text" value={__s($v.dlg?.amtVal)} onChange={$v.dlg?.setAmt} placeholder={$v.dlg?.amtHint} aria-label="Сумма штрафа" style={{ height: "38px", boxSizing: "border-box", padding: "0 12px", borderRadius: "8px", border: "0", background: $v.c?.search, boxShadow: `inset 0 0 0 1px ${__s($v.dlg?.amtRing)}`, fontSize: "14px", color: $v.c?.text }} />
              <span style={{ minHeight: "16px", color: $v.dlg?.amtNoteC }}>
                {__h($v.dlg?.amtNote)}
              </span>
            </label>
          ) : null}
          {$v.dlg?.hasHist ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {__a($v.dlg?.hist).map((hr: any, $i0: number) => (
                <Fragment key={$i0}>
                  <div style={{ display: "flex", gap: "12px", fontSize: "13px", lineHeight: "18px" }}>
                    <span style={{ width: "92px", flexShrink: "0", color: $v.c?.text2 }}>
                      {__h(hr?.when)}
                    </span>
                    <span style={{ flex: "1", minWidth: "0" }}>
                      {__h(hr?.what)}
                    </span>
                  </div>
                </Fragment>
              ))}
            </div>
          ) : null}
          {$v.dlg?.hasForm ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {__a($v.dlg?.formTypes).map((ft: any, $i0: number) => (
                  <Fragment key={$i0}>
                    <button className="btn pb" onClick={ft?.pick} style={{ height: "28px", padding: "0 12px", borderRadius: "14px", fontSize: "12px", whiteSpace: "nowrap", background: ft?.bg, color: ft?.fg }}>
                      {__h(ft?.label)}
                    </button>
                  </Fragment>
                ))}
              </div>
              {/* MDT: «Изменить данные» — what the chosen field holds now */}
              {$v.dlg?.gNow != null ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "10px 12px", borderRadius: "8px", background: $v.c?.card, boxShadow: `inset 0 0 0 1px ${__s($v.c?.stroke)}` }}>
                  <span style={{ fontSize: "12px", color: $v.c?.text2 }}>{"Сейчас записано"}</span>
                  <span style={{ fontSize: "14px", fontWeight: "600", color: $v.c?.text, wordBreak: "break-word" }}>{__h($v.dlg?.gNow || "— не указано")}</span>
                </div>
              ) : null}
              {__a($v.dlg?.formFields).map((ff: any, $i0: number) => (
                <Fragment key={$i0}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", color: $v.c?.text2 }}>
                    <span>
                      {__h(ff?.label)}
                    </span>
                    {ff?.isChips ? (
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {__a(ff?.chips).map((fc: any, $i1: number) => (
                          <Fragment key={$i1}>
                            <button className="btn pb" onClick={fc?.pick} style={{ height: "28px", padding: "0 12px", borderRadius: "14px", fontSize: "12px", whiteSpace: "nowrap", background: fc?.bg, color: fc?.fg }}>
                              {__h(fc?.label)}
                            </button>
                          </Fragment>
                        ))}
                      </div>
                    ) : null}
                    {ff?.isText ? (
                      <input type="text" value={__s(ff?.val)} onChange={ff?.set} placeholder={ff?.hint} aria-label={ff?.label} style={{ height: "38px", boxSizing: "border-box", padding: "0 12px", borderRadius: "8px", border: "0", background: $v.c?.search, fontSize: "14px", color: $v.c?.text }} />
                    ) : null}
                    {ff?.isPerson ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        {ff?.chosen ? (
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", height: "38px", padding: "0 12px", borderRadius: "8px", background: $v.c?.search, fontSize: "14px", color: $v.c?.text }}>
                            <span style={{ flex: "1", minWidth: "0" }}>
                              {__h(ff?.pName)}
                            </span>
                            <button className="btn lnk" onClick={ff?.pClear} style={{ fontSize: "12px", color: $v.c?.link }}>
                              {"Изменить"}
                            </button>
                          </div>
                        ) : null}
                        {ff?.notChosen ? (
                          <>
                          <input type="text" value={__s(ff?.pQ)} onChange={ff?.pSet} placeholder={ff?.pPh || "Имя, фамилия или жетон сотрудника"} aria-label={ff?.label} style={{ height: "38px", boxSizing: "border-box", padding: "0 12px", borderRadius: "8px", border: "0", background: $v.c?.search, fontSize: "14px", color: $v.c?.text }} />
                          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            {__a(ff?.pList).map((pp: any, $i1: number) => (
                              <Fragment key={$i1}>
                                <button className="btn hv" onClick={pp?.pick} style={{ minHeight: "38px", padding: "6px 12px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "10px", textAlign: "left", fontSize: "13px", color: $v.c?.text }}>
                                  <span style={{ flex: "1", minWidth: "0" }}>
                                    {__h(pp?.name)}
                                  </span>
                                  <span style={{ color: $v.c?.text2, fontSize: "12px", whiteSpace: "nowrap" }}>
                                    {__h(pp?.sub)}
                                  </span>
                                </button>
                              </Fragment>
                            ))}
                            {ff?.pEmpty ? (
                              <span style={{ padding: "4px 12px" }}>
                                {"Сотрудник не найден"}
                              </span>
                            ) : null}
                            {ff?.pHint ? (
                              <span style={{ padding: "0 2px" }}>
                                {ff?.pHintText || "Введите имя, чтобы выбрать сотрудника (появится ссылка на карточку), или впишите своё значение, например «Штаб LSPD»."}
                              </span>
                            ) : null}
                            {ff?.pNoMe ? null : (
                              <button className="btn lnk" onClick={ff?.pMe} style={{ alignSelf: "flex-start", fontSize: "12px", color: $v.c?.link }}>
                                {"Это я"}
                              </button>
                            )}
                          </div>
                          </>
                        ) : null}
                      </div>
                    ) : null}
                    {ff?.isRange ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span>
                            {"с"}
                          </span>
                          <input type="text" value={__s(ff?.fromVal)} onChange={ff?.setFrom} placeholder="дд.мм.гггг" maxLength={10} aria-label="Действует с" style={{ flex: "1", minWidth: "0", height: "38px", boxSizing: "border-box", padding: "0 12px", borderRadius: "8px", border: "0", background: $v.c?.search, fontSize: "14px", color: $v.c?.text }} />
                          <span>
                            {"по"}
                          </span>
                          <input type="text" value={__s(ff?.toVal)} onChange={ff?.setTo} placeholder="дд.мм.гггг" maxLength={10} aria-label="Действует по" style={{ flex: "1", minWidth: "0", height: "38px", boxSizing: "border-box", padding: "0 12px", borderRadius: "8px", border: "0", background: $v.c?.search, fontSize: "14px", color: $v.c?.text }} />
                        </div>
                        <span style={{ color: ff?.rHintC }}>
                          {__h(ff?.rHint)}
                        </span>
                      </div>
                    ) : null}
                    {ff?.isToggle ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <button className="btn" role="switch" aria-label={ff?.tLabel} onClick={ff?.tSet} style={{ position: "relative", width: "40px", height: "22px", flexShrink: "0", borderRadius: "11px", background: ff?.tBg }}>
                          <span style={{ position: "absolute", top: "2px", left: ff?.tKnob, width: "18px", height: "18px", borderRadius: "50%", background: ff?.tKnobBg }}></span>
                        </button>
                        <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <span style={{ fontSize: "13px", color: $v.c?.text }}>
                            {__h(ff?.tLabel)}
                          </span>
                          <span>
                            {__h(ff?.tNote)}
                          </span>
                        </span>
                      </div>
                    ) : null}
                    {ff?.isAward ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        {__a(ff?.awList).map((al: any, $i1: number) => (
                          <Fragment key={$i1}>
                            <button className="btn hv" onClick={al?.pick} style={{ minHeight: "52px", padding: "6px 12px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "12px", textAlign: "left", fontSize: "13px", color: $v.c?.text, background: al?.bg, boxShadow: `inset 0 0 0 1px ${__s(al?.ring)}` }}>
                              <span style={{ width: "44px", display: "flex", justifyContent: "center", flexShrink: "0" }}>
                                {al?.isMed ? (
                                  <svg width="28" height="40" viewBox="0 0 28 40" aria-hidden="true" style={{ flexShrink: "0" }}>
                                    <rect x="4" y="0" width="10" height="17" fill={al?.c1}></rect>
                                    <rect x="14" y="0" width="10" height="17" fill={al?.c2}></rect>
                                    <circle cx="14" cy="28" r="10" fill="#D4AF37" stroke="#A8832A" strokeWidth="1.5"></circle>
                                    <circle cx="14" cy="28" r="6" fill="none" stroke="#F3DE8A" strokeWidth="1.5"></circle>
                                  </svg>
                                ) : null}
                                {al?.isRib ? (
                                  <svg width="44" height="16" viewBox="0 0 44 16" aria-hidden="true" style={{ flexShrink: "0" }}>
                                    <rect x="0" y="0" width="15" height="16" fill={al?.c1}></rect>
                                    <rect x="15" y="0" width="14" height="16" fill={al?.c2}></rect>
                                    <rect x="29" y="0" width="15" height="16" fill={al?.c3}></rect>
                                    <rect x="0.5" y="0.5" width="43" height="15" fill="none" stroke="rgba(255,255,255,0.18)"></rect>
                                  </svg>
                                ) : null}
                              </span>
                              <span style={{ flex: "1", minWidth: "0" }}>
                                {__h(al?.label)}
                              </span>
                            </button>
                          </Fragment>
                        ))}
                        <span>
                          {"Список наград ведётся в разделе «Администрирование»: там создаются новые медали и планки, здесь они только выдаются."}
                        </span>
                      </div>
                    ) : null}
                    {ff?.isArea ? (
                      <textarea value={__s(ff?.val)} onChange={ff?.set} placeholder={ff?.hint} aria-label={ff?.label} style={{ height: "84px", resize: "none", boxSizing: "border-box", padding: "8px 10px", borderRadius: "8px", border: "0", background: $v.c?.search, font: "inherit", fontSize: "13px", lineHeight: "18px", color: $v.c?.text }} />
                    ) : null}
                  </div>
                </Fragment>
              ))}
            </div>
          ) : null}
          {$v.dlg?.hasVeh ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {__a($v.dlg?.vehModes).map((vm: any, $i0: number) => (
                  <Fragment key={$i0}>
                    <button className="btn pb" onClick={vm?.pick} style={{ height: "28px", padding: "0 12px", borderRadius: "14px", fontSize: "12px", whiteSpace: "nowrap", background: vm?.bg, color: vm?.fg }}>
                      {__h(vm?.label)}
                    </button>
                  </Fragment>
                ))}
              </div>
              {$v.dlg?.vehCur ? (
                <div style={{ fontSize: "12px", color: $v.c?.text2 }}>
                  {"Сейчас закреплено: "}
                  <span style={{ color: $v.c?.text }}>
                    {__h($v.dlg?.vehCur)}
                  </span>
                </div>
              ) : null}
              {$v.dlg?.vehAssign ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", color: $v.c?.text2 }}>
                  <span>
                    {"ID машины *"}
                  </span>
                  {$v.dlg?.vehChosen ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", height: "38px", padding: "0 12px", borderRadius: "8px", background: $v.c?.search, fontSize: "14px", color: $v.c?.text }}>
                      <span style={{ flex: "1", minWidth: "0" }}>
                        {__h($v.dlg?.vehName)}
                      </span>
                      <button className="btn lnk" onClick={$v.dlg?.vehClear} style={{ fontSize: "12px", color: $v.c?.link }}>
                        {"Изменить"}
                      </button>
                    </div>
                  ) : null}
                  {$v.dlg?.vehNot ? (
                    <>
                    <input type="text" value={__s($v.dlg?.vehQ)} onChange={$v.dlg?.setVehQ} placeholder="Номер машины или модель" aria-label="ID машины" style={{ height: "38px", boxSizing: "border-box", padding: "0 12px", borderRadius: "8px", border: "0", background: $v.c?.search, fontSize: "14px", color: $v.c?.text }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      {__a($v.dlg?.vehList).map((vh: any, $i0: number) => (
                        <Fragment key={$i0}>
                          <button className="btn hv" onClick={vh?.pick} style={{ minHeight: "38px", padding: "6px 12px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "10px", textAlign: "left", fontSize: "13px", color: $v.c?.text }}>
                            <span style={{ flex: "1", minWidth: "0" }}>
                              {__h(vh?.name)}
                            </span>
                            <span style={{ color: $v.c?.text2, fontSize: "12px", whiteSpace: "nowrap" }}>
                              {__h(vh?.id)}
                            </span>
                          </button>
                        </Fragment>
                      ))}
                      {$v.dlg?.vehEmpty ? (
                        <span style={{ padding: "4px 12px" }}>
                          {"Свободных машин с таким ID нет"}
                        </span>
                      ) : null}
                    </div>
                    </>
                  ) : null}
                </div>
              ) : null}
              {$v.dlg?.vehOff ? (
                <div style={{ fontSize: "13px", lineHeight: "19px", color: $v.c?.text2 }}>
                  {"Машина станет свободной и появится в списке для других сотрудников."}
                </div>
              ) : null}
            </div>
          ) : null}
          {$v.dlg?.hasCam ? (
            <div style={{ display: "flex", gap: "14px", alignItems: "stretch" }}>
              <div style={{ width: "270px", flexShrink: "0", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <button className="btn hv" onClick={$v.dlg?.camPrev} aria-label="Предыдущий день" style={{ width: "30px", height: "30px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", opacity: $v.dlg?.camPrevOp }}>
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12.5 4.5L7 10l5.5 5.5"></path>
                    </svg>
                  </button>
                  <span style={{ flex: "1", textAlign: "center", fontSize: "13px", fontWeight: "600" }}>
                    {__h($v.dlg?.camDay)}
                  </span>
                  <button className="btn hv" onClick={$v.dlg?.camNext} aria-label="Следующий день" style={{ width: "30px", height: "30px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", opacity: $v.dlg?.camNextOp }}>
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M7.5 4.5L13 10l-5.5 5.5"></path>
                    </svg>
                  </button>
                </div>
                <span style={{ fontSize: "12px", color: $v.c?.text2, textAlign: "center" }}>
                  {__h($v.dlg?.camCount)}
                </span>
                <div className="scroll" style={{ maxHeight: "340px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "4px", paddingRight: "4px" }}>
                  {$v.dlg?.camEmptyDay ? (
                    <span style={{ padding: "12px 8px", fontSize: "13px", color: $v.c?.text2 }}>
                      {"В этот день смен не было"}
                    </span>
                  ) : null}
                  {__a($v.dlg?.camList).map((cm: any, $i0: number) => (
                    <Fragment key={$i0}>
                      <button className="btn hv" onClick={cm?.pick} style={{ padding: "8px 10px", borderRadius: "8px", textAlign: "left", display: "flex", flexDirection: "column", gap: "2px", color: $v.c?.text, background: cm?.bg, boxShadow: `inset 0 0 0 1px ${__s(cm?.ring)}` }}>
                        <span style={{ display: "flex", gap: "8px", fontSize: "13px" }}>
                          <span style={{ flex: "1" }}>
                            {__h(cm?.time)}
                          </span>
                          <span style={{ color: $v.c?.text2 }}>
                            {__h(cm?.dur)}
                          </span>
                        </span>
                        <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                          {__h(cm?.sub)}
                        </span>
                      </button>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontSize: "12px", color: $v.c?.text2 }}>
                  {__h($v.dlg?.camMeta)}
                </span>
                <input type="text" value={__s($v.dlg?.camQ)} onChange={$v.dlg?.setCamQ} placeholder="Поиск по тексту записи" aria-label="Поиск по записи" style={{ height: "34px", boxSizing: "border-box", padding: "0 12px", borderRadius: "8px", border: "0", background: $v.c?.search, fontSize: "13px", color: $v.c?.text }} />
                <div className="scroll" style={{ maxHeight: "340px", minHeight: "120px", overflowY: "auto", borderRadius: "8px", background: "#1D2027", padding: "12px 14px", display: "flex", flexDirection: "column", gap: "5px", fontFamily: "Consolas, 'Courier New', monospace", fontSize: "12.5px", lineHeight: "18px" }}>
                  {__a($v.dlg?.camLines).map((cl: any, $i0: number) => (
                    <Fragment key={$i0}>
                      <div style={{ color: cl?.color }}>
                        <span style={{ color: "#8A8A8A" }}>
                          {__h(cl?.time)}
                        </span>
                        {" "}{__h(cl?.text)}
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
          {$v.dlg?.askReason ? (
            <textarea value={__s($v.dlg?.reason)} onChange={$v.dlg?.setReason} placeholder={$v.dlg?.reasonPh} aria-label={$v.dlg?.reasonLabel} style={{ height: "72px", resize: "none", boxSizing: "border-box", padding: "8px 10px", borderRadius: "8px", border: "0", background: $v.c?.search, font: "inherit", fontSize: "13px", lineHeight: "18px", color: $v.c?.text }} />
          ) : null}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
            {$v.dlg?.hasCancel ? (
              <button className="btn hv" onClick={$v.dlg?.close} style={{ height: "34px", padding: "0 16px", borderRadius: "8px", fontSize: "13px", background: $v.c?.btn }}>
                {__h($v.dlg?.cancelText)}
              </button>
            ) : null}
            <button className="btn pb" onClick={$v.dlg?.confirm} style={{ height: "34px", padding: "0 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", background: $v.dlg?.primBg, color: $v.dlg?.primFg, opacity: $v.dlg?.primOp }}>
              {__h($v.dlg?.primary)}
            </button>
          </div>
        </div>
      </div>
      {" "}
    </>
  )
}

export function SearchToast({ $v }: { $v: SearchVals }) {
  if (!$v.dlg?.hasToast) return null
  return (
    <>
      {" "}
      <div style={{ position: "fixed", left: "50%", bottom: "72px", transform: "translateX(-50%)", zIndex: "21", display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px 10px 16px", borderRadius: "10px", background: "#2F6B3A", color: "#FFFFFF", fontSize: "13px", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>
        <span>
          {__h($v.dlg?.toast)}
        </span>
        <button className="btn" onClick={$v.dlg?.closeToast} aria-label="Закрыть" style={{ color: "#FFFFFF", fontSize: "16px", lineHeight: "1" }}>
          {"×"}
        </button>
      </div>
      {" "}
    </>
  )
}
