import { useState } from "react";
import { THEMES } from "../data/themes";
import { STATES } from "../data/situations";
import { FONT_SERIF, FONT_SANS } from "../utils/helpers";
import Orb from "./Orb";

export default function Situations({ setScreen, theme }) {
  const T = THEMES[theme] || THEMES.full;
  const [openState, setOpenState] = useState(null);
  const [openItem, setOpenItem] = useState(null);

  return (
    <div style={{ minHeight: "100%", background: T.bg, paddingBottom: 100, position: "relative", transition: "background .6s" }}>
      <Orb style={{ top: -40, right: -60 }} color={T.o1} opacity={0.12} w={220} h={220} />
      <div style={{ padding: "50px 24px 18px", position: "relative", zIndex: 1 }}>
        <div onClick={() => setScreen("home")} style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer", marginBottom: 22 }}>
          <span style={{ fontSize: 14, color: "rgba(242,232,226,.4)" }}>←</span>
          <span style={{ fontSize: 11, letterSpacing: ".15em", textTransform: "uppercase", color: "rgba(242,232,226,.4)", fontFamily: FONT_SANS }}>Назад</span>
        </div>
        <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".25em", textTransform: "uppercase", color: T.accent, marginBottom: 8 }}>Навигатор практик</div>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 28, fontWeight: 300, lineHeight: 1.2, color: "rgba(242,232,226,.95)", marginBottom: 8 }}>Что вас беспокоит<br/>прямо сейчас?</div>
        <div style={{ fontSize: 12, color: "rgba(242,232,226,.4)", lineHeight: 1.6, fontFamily: FONT_SANS }}>Выберите состояние — увидите практики</div>
      </div>

      <div style={{ padding: "0 24px", position: "relative", zIndex: 1 }}>
        {STATES.map((st, si) => {
          const isOpen = openState === si;
          return (
            <div key={si} style={{ marginBottom: 6 }}>
              {/* State header */}
              <div
                onClick={() => { setOpenState(isOpen ? null : si); setOpenItem(null); }}
                style={{
                  padding: "15px 18px", borderRadius: isOpen ? "15px 15px 0 0" : 15, cursor: "pointer",
                  background: isOpen ? `${st.hex}18` : T.card,
                  border: `1px solid ${isOpen ? st.hex + "44" : T.border}`,
                  borderBottom: isOpen ? "none" : undefined,
                  display: "flex", alignItems: "center", gap: 12, transition: "all .3s",
                }}
              >
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: st.hex, boxShadow: isOpen ? `0 0 10px ${st.hex}88` : "none", flexShrink: 0, transition: "box-shadow .3s" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: FONT_SERIF, fontSize: 16, color: isOpen ? st.hex : "rgba(242,232,226,.88)", transition: "color .3s" }}>{st.title}</div>
                </div>
                <div style={{ fontSize: 12, color: isOpen ? st.hex : "rgba(242,232,226,.25)", transition: "all .3s", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}>›</div>
              </div>

              {/* Problems list */}
              {isOpen && (
                <div style={{
                  background: `${st.hex}08`, border: `1px solid ${st.hex}22`, borderTop: "none",
                  borderRadius: "0 0 15px 15px", padding: "4px 0 8px", overflow: "hidden",
                }}>
                  {st.items.map((item, ii) => {
                    const itemOpen = openItem === `${si}-${ii}`;
                    return (
                      <div key={ii}>
                        <div
                          onClick={() => setOpenItem(itemOpen ? null : `${si}-${ii}`)}
                          style={{
                            padding: "13px 18px", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 10,
                            background: itemOpen ? `${st.hex}12` : "transparent", transition: "background .2s",
                          }}
                        >
                          <div style={{ fontFamily: FONT_SERIF, fontSize: 13, color: st.hex, flexShrink: 0, marginTop: 1 }}>◦</div>
                          <div style={{ fontFamily: FONT_SERIF, fontSize: 14, color: "rgba(242,232,226,.82)", lineHeight: 1.5 }}>{item.problem}</div>
                        </div>

                        {/* Recommendation dropdown */}
                        {itemOpen && (
                          <div style={{
                            margin: "0 14px 8px", padding: "12px 16px",
                            background: `${st.hex}15`, border: `1px solid ${st.hex}30`,
                            borderRadius: 12, animation: "fadeUp .25s ease both",
                          }}>
                            {item.rec.split(" · ").map((r, ri) => (
                              <div key={ri} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: ri < item.rec.split(" · ").length - 1 ? 10 : 0 }}>
                                <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${st.hex}22`, border: `1px solid ${st.hex}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: st.hex, flexShrink: 0 }}>▶</div>
                                <div>
                                  <div style={{ fontFamily: FONT_SERIF, fontSize: 13, color: "rgba(242,232,226,.9)", lineHeight: 1.4 }}>{r}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        <div onClick={() => setScreen("sub")} style={{ marginTop: 14, padding: "14px 18px", background: T.dim, border: `1px solid ${T.border}`, borderRadius: 14, textAlign: "center", cursor: "pointer" }}>
          <div style={{ fontFamily: FONT_SERIF, fontSize: 14, color: "rgba(242,232,226,.65)" }}>Открыть полную библиотеку</div>
          <div style={{ fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase", color: T.accent, marginTop: 5, fontFamily: FONT_SANS }}>Frisson Premium →</div>
        </div>
      </div>
    </div>
  );
}
