import { useState } from "react";
import { THEMES } from "../data/themes";
import { STATES } from "../data/situations";
import { FONT_SERIF, FONT_SANS } from "../utils/helpers";
import Orb from "./Orb";

export default function Situations({ setScreen, theme }) {
  const T = THEMES[theme] || THEMES.full;
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
        <div style={{ fontSize: 12, color: "rgba(242,232,226,.4)", lineHeight: 1.6, fontFamily: FONT_SANS }}>Нажмите на проблему — откроется практика</div>
      </div>

      <div style={{ padding: "0 24px", position: "relative", zIndex: 1 }}>
        {STATES.map((st, si) => (
          <div key={si} style={{ marginBottom: 20 }}>
            {/* State header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: st.hex, boxShadow: `0 0 8px ${st.hex}66`, flexShrink: 0 }} />
              <div style={{ fontFamily: FONT_SERIF, fontSize: 17, color: st.hex }}>{st.title}</div>
            </div>

            {/* All problems visible */}
            {st.items.map((item, ii) => {
              const key = `${si}-${ii}`;
              const isOpen = openItem === key;
              return (
                <div key={ii} style={{ marginBottom: 6 }}>
                  <div
                    onClick={() => setOpenItem(isOpen ? null : key)}
                    style={{
                      padding: "13px 16px", cursor: "pointer",
                      background: isOpen ? `${st.hex}14` : T.card,
                      border: `1px solid ${isOpen ? st.hex + "40" : T.border}`,
                      borderRadius: isOpen ? "13px 13px 0 0" : 13,
                      display: "flex", alignItems: "flex-start", gap: 10,
                      transition: "all .2s",
                    }}
                  >
                    <div style={{ fontFamily: FONT_SERIF, fontSize: 15, color: isOpen ? st.hex : "rgba(242,232,226,.35)", marginTop: 1, flexShrink: 0, transition: "color .2s" }}>→</div>
                    <div style={{ fontFamily: FONT_SERIF, fontSize: 14, color: isOpen ? "rgba(242,232,226,.95)" : "rgba(242,232,226,.75)", lineHeight: 1.5, transition: "color .2s" }}>{item.problem}</div>
                  </div>

                  {isOpen && (
                    <div style={{
                      padding: "12px 16px",
                      background: `${st.hex}0c`, border: `1px solid ${st.hex}30`, borderTop: "none",
                      borderRadius: "0 0 13px 13px",
                    }}>
                      {item.rec.split(" · ").map((r, ri) => (
                        <div key={ri} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: ri < item.rec.split(" · ").length - 1 ? 10 : 0 }}>
                          <div style={{ width: 30, height: 30, borderRadius: "50%", background: `${st.hex}22`, border: `1px solid ${st.hex}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: st.hex, flexShrink: 0 }}>▶</div>
                          <div style={{ fontFamily: FONT_SERIF, fontSize: 13.5, color: "rgba(242,232,226,.9)", lineHeight: 1.45 }}>{r}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        <div onClick={() => setScreen("sub")} style={{ marginTop: 8, padding: "14px 18px", background: T.dim, border: `1px solid ${T.border}`, borderRadius: 14, textAlign: "center", cursor: "pointer" }}>
          <div style={{ fontFamily: FONT_SERIF, fontSize: 14, color: "rgba(242,232,226,.65)" }}>Открыть полную библиотеку</div>
          <div style={{ fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase", color: T.accent, marginTop: 5, fontFamily: FONT_SANS }}>Frisson Premium →</div>
        </div>
      </div>
    </div>
  );
}
