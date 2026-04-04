import { useState } from "react";
import { THEMES } from "../data/themes";
import { SECTIONS, SITUATIONS } from "../data/content";
import { FONT_SERIF, FONT_SANS } from "../utils/helpers";
import Orb from "./Orb";

export default function Situations({ setScreen, theme }) {
  const T = THEMES[theme] || THEMES.full;
  const [sel, setSel] = useState([]);

  return (
    <div style={{ minHeight: "100%", background: T.bg, paddingBottom: 20, position: "relative", transition: "background .8s" }}>
      <Orb style={{ top: -40, right: -60 }} color={T.o1} opacity={0.12} w={220} h={220} />

      <div style={{ padding: "50px 24px 18px", position: "relative", zIndex: 1 }}>
        <div onClick={() => setScreen("home")} style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer", marginBottom: 18 }}>
          <span style={{ fontSize: 14, color: "rgba(242,232,226,.4)" }}>←</span>
          <span style={{ fontSize: 11, letterSpacing: ".15em", textTransform: "uppercase", color: "rgba(242,232,226,.35)", fontFamily: FONT_SANS }}>Главная</span>
        </div>
        <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".25em", textTransform: "uppercase", color: `rgba(${T.ar},.4)`, marginBottom: 6 }}>навигатор</div>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 28, fontWeight: 300, lineHeight: 1.2, color: "rgba(242,232,226,.95)", marginBottom: 10 }}>Что меня беспокоит?</div>
        <div style={{ fontSize: 12, color: "rgba(242,232,226,.4)", lineHeight: 1.6, fontFamily: FONT_SANS }}>Выберите ситуации — получите подборку практик</div>
      </div>

      <div style={{ padding: "0 24px", position: "relative", zIndex: 1 }}>
        {SITUATIONS.map((s) => (
          <div key={s.title} onClick={() => setSel((p) => p.includes(s.title) ? p.filter((x) => x !== s.title) : [...p, s.title])} style={{
            padding: "16px 18px", background: sel.includes(s.title) ? T.card : "rgba(255,255,255,.02)",
            border: `1px solid ${sel.includes(s.title) ? T.accent + "44" : "rgba(255,255,255,.06)"}`,
            borderRadius: 14, marginBottom: 8, cursor: "pointer", transition: "all .3s",
          }}>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 16, color: "rgba(242,232,226,.92)", marginBottom: 3 }}>{s.title}</div>
            <div style={{ fontSize: 11, color: "rgba(242,232,226,.4)", lineHeight: 1.45, fontFamily: FONT_SANS }}>{s.desc}</div>
          </div>
        ))}

        {sel.length > 0 && (() => {
          const allRecs = sel.flatMap((t) => { const s = SITUATIONS.find((x) => x.title === t); return s && s.recs ? s.recs : []; });
          const recs = [...new Set(allRecs)].slice(0, 4);
          const MEDS_ALL = SECTIONS.flatMap((s) => s.meds);

          return (
            <div style={{ marginTop: 8 }}>
              <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${T.accent}55, transparent)`, marginBottom: 18 }} />
              <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: `rgba(${T.ar},.4)`, marginBottom: 14 }}>рекомендованные практики</div>
              {recs.map((r) => {
                const med = MEDS_ALL.find((m) => m.title === r);
                const sec = SECTIONS.find((s) => s.meds && s.meds.some((m) => m.title === r));
                const lc = med && med.free ? "rgba(160,138,65,.85)" : (sec && sec.color) || T.accent;
                return (
                  <div key={r} style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
                    background: T.card, border: `1px solid ${T.border}`, borderRadius: 14,
                    marginBottom: 8, position: "relative", cursor: "pointer",
                  }}>
                    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 2.5, background: lc, borderRadius: "2px 0 0 2px" }} />
                    <div style={{ flex: 1, paddingLeft: 4 }}>
                      <div style={{ fontFamily: FONT_SERIF, fontSize: 14, color: "rgba(242,232,226,.92)", marginBottom: 2 }}>{r}</div>
                      <div style={{ fontSize: 9.5, color: lc, fontFamily: FONT_SANS, letterSpacing: ".04em" }}>{med ? `${med.dur} · ${sec?.title}` : ""}</div>
                    </div>
                    {med && !med.free && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(242,232,226,.3)" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>}
                    {med && med.free && <div style={{ width: 26, height: 26, borderRadius: "50%", background: `${lc}22`, border: `1px solid ${lc}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: lc }}>▶</div>}
                  </div>
                );
              })}
              <div onClick={() => setScreen("sub")} style={{ marginTop: 4, padding: "14px 18px", background: T.dim, border: `1px solid ${T.border}`, borderRadius: 14, textAlign: "center", cursor: "pointer" }}>
                <div style={{ fontFamily: FONT_SERIF, fontSize: 14, color: "rgba(242,232,226,.65)" }}>Открыть все практики</div>
                <div style={{ fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase", color: T.accent, fontFamily: FONT_SANS, marginTop: 4 }}>Подписка Frisson →</div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
