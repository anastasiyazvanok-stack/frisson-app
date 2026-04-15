import { useState } from "react";
// THEMES passed via props
import { getStates } from "../data/situations";
import { TYPE, SP, RAD, OP, EASE, FONT_SERIF, FONT_SANS, tx, label, body, heading, card as cardStyle, section } from "../utils/design";
import Orb from "./Orb";
import { t as tr } from "../utils/i18n";

export default function Situations({ setScreen, theme, goToMed, THEMES, lang = "ru" }) {
  const T = THEMES[theme] || THEMES.full;
  const L = (k) => tr(lang, k);
  const STATES = getStates(lang);
  const [openItem, setOpenItem] = useState(null);

  // Extract meditation title from rec string like 'Медитация «Доверие к миру»'
  const extractTitle = (rec) => {
    const m = rec.match(/[«"]([^»"]+)[»"]/);
    return m ? m[1] : null;
  };

  return (
    <div style={{ minHeight: "100%", background: T.bg, paddingBottom: 100, position: "relative", transition: "background .6s" }}>
      <Orb style={{ top: -40, right: -60 }} color={T.o1} opacity={OP.bgMedium} w={220} h={220} />
      <div style={{ padding: `50px ${SP.xl}px ${SP.lg + 2}px`, position: "relative", zIndex: 1 }}>
        <div onClick={() => setScreen("home")} style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer", marginBottom: SP.xl - 2 }}>
          <span style={{ fontSize: TYPE.base, color: tx("var(--txt)", OP.tertiary + 0.08) }}>←</span>
          <span style={{ ...label(TYPE.sm), color: tx("var(--txt)", OP.tertiary + 0.08) }}>{L("back")}</span>
        </div>
        <div style={{ ...label(9), letterSpacing: ".25em", color: T.accent, marginBottom: SP.sm }}>{L("sit_navigator")}</div>
        <div style={{ ...heading(TYPE.xxl), color: tx("var(--txt)", OP.primary + 0.03), marginBottom: SP.sm, whiteSpace: "pre-line" }}>{L("sit_title")}</div>
        <div style={{ fontSize: TYPE.sm, color: tx("var(--txt)", OP.tertiary + 0.08), lineHeight: 1.6, fontFamily: FONT_SANS }}>{L("sit_hint")}</div>
      </div>

      <div style={{ padding: `0 ${SP.xl}px`, position: "relative", zIndex: 1 }}>
        {STATES.map((st, si) => (
          <div key={si} style={{ marginBottom: SP.page }}>
            {/* State header */}
            <div style={{ display: "flex", alignItems: "center", gap: SP.md - 2, marginBottom: SP.md - 2 }}>
              <div style={{ width: SP.md - 2, height: SP.md - 2, borderRadius: RAD.full, background: st.hex, boxShadow: `0 0 ${SP.sm}px ${st.hex}66`, flexShrink: 0 }} />
              <div style={{ ...body(TYPE.lg), color: st.hex }}>{st.title}</div>
            </div>

            {/* All problems visible */}
            {st.items.map((item, ii) => {
              const key = `${si}-${ii}`;
              const isOpen = openItem === key;
              return (
                <div key={ii} className="list-item" style={{ marginBottom: 6, animationDelay: `${ii * 0.04}s` }}>
                  <div
                    onClick={() => setOpenItem(isOpen ? null : key)}
                    className="press-card"
                    style={{
                      padding: `13px ${SP.lg}px`, cursor: "pointer",
                      background: isOpen ? `${st.hex}14` : T.card,
                      border: `1px solid ${isOpen ? st.hex + "40" : T.border}`,
                      borderRadius: isOpen ? "13px 13px 0 0" : 13,
                      display: "flex", alignItems: "flex-start", gap: SP.md - 2,
                      transition: EASE.fast,
                    }}
                  >
                    <div style={{ ...body(15), color: isOpen ? st.hex : tx("var(--txt)", OP.tertiary + 0.03), marginTop: 1, flexShrink: 0, transition: EASE.fast }}>→</div>
                    <div style={{ ...body(TYPE.base), color: isOpen ? tx("var(--txt)", OP.primary + 0.03) : tx("var(--txt)", 0.75), transition: EASE.fast }}>{item.problem}</div>
                  </div>

                  {isOpen && (
                    <div style={{
                      padding: `${SP.md - 2}px ${SP.md}px`,
                      background: `${st.hex}0c`, border: `1px solid ${st.hex}30`, borderTop: "none",
                      borderRadius: "0 0 13px 13px",
                    }}>
                      {item.rec.split(" · ").map((r, ri) => {
                        const title = extractTitle(r);
                        const canGo = title && goToMed;
                        return (
                          <div key={ri} onClick={canGo ? () => goToMed(title, "situations") : undefined} style={{ display: "flex", alignItems: "center", gap: SP.md - 2, padding: `${SP.sm}px 6px`, marginBottom: 2, cursor: canGo ? "pointer" : "default", borderRadius: SP.md - 2, background: "transparent", transition: EASE.fast }}>
                            <div style={{ width: 30, height: 30, borderRadius: RAD.full, background: `${st.hex}22`, border: `1px solid ${st.hex}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: TYPE.xs, color: st.hex, flexShrink: 0 }}>▶</div>
                            <div style={{ flex: 1 }}>
                              <div style={{ ...body(13.5), color: tx("var(--txt)", OP.primary - 0.02), lineHeight: 1.45 }}>{r}</div>
                              {canGo && <div style={{ ...label(8), letterSpacing: ".1em", color: st.hex, marginTop: 3 }}>{L("sit_go_practice")}</div>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        <div onClick={() => setScreen("sub")} style={{ marginTop: SP.sm, padding: `${SP.md + 2}px ${SP.lg + 2}px`, background: T.dim, border: `1px solid ${T.border}`, borderRadius: RAD.md, textAlign: "center", cursor: "pointer" }}>
          <div style={{ ...body(TYPE.base), color: tx("var(--txt)", 0.65) }}>{L("sit_open_lib")}</div>
          <div style={{ ...label(9), letterSpacing: ".14em", color: T.accent, marginTop: 5 }}>Frisson Premium →</div>
        </div>
      </div>
    </div>
  );
}
