import { useState } from "react";
import { THEMES, getEnergyLevel } from "../data/themes";
import { SECTIONS, RECOMMENDATIONS, MOOD_MESSAGES } from "../data/content";
import { getMoon, useGreeting, FONT_SERIF, FONT_SANS } from "../utils/helpers";
import Orb from "./Orb";

export default function Home({ setScreen, theme, setTheme, eScore, pLog, setLibSec }) {
  const T = THEMES[theme] || THEMES.full;
  const moon = getMoon();
  const gr = useGreeting();
  const lv = eScore !== null ? getEnergyLevel(eScore) : null;
  const [msgI] = useState(() => Math.floor(Math.random() * 3));
  const msg = (MOOD_MESSAGES[theme] || MOOD_MESSAGES.full)[msgI];
  const spd = theme === "power" ? "4s" : theme === "empty" ? "14s" : "8s";

  const cards = [
    { sub: "Ресурс", title: "Наполниться", sec: "resource", bg: "#110500", blobs: [{ x: "55%", y: "20%", w: 100, h: 100, c: "rgba(184,64,16,.3)" }] },
    { sub: "Женское", title: "Женственность", sec: "feminine", bg: "#0e0412", blobs: [{ x: "50%", y: "25%", w: 90, h: 90, c: "rgba(143,74,145,.3)" }] },
    { sub: "Реализация", title: "Получать", sec: "receiving", bg: "#100a00", blobs: [{ x: "48%", y: "22%", w: 95, h: 95, c: "rgba(196,120,8,.25)" }] },
    { sub: "Новый уровень", title: "Расти", sec: "newlevel", bg: "#080c14", blobs: [{ x: "44%", y: "24%", w: 100, h: 100, c: "rgba(10,92,92,.3)" }] },
  ];

  return (
    <div style={{ minHeight: "100%", background: T.bg, paddingBottom: 100, position: "relative", transition: "background .8s" }}>
      <Orb style={{ top: -60, right: -80 }} color={T.o1} opacity={0.16} w={280} h={280} />
      <Orb style={{ bottom: 300, left: -60 }} color={T.o2} opacity={0.1} w={200} h={200} delay={3} />

      {/* Greeting */}
      <div className="fu1" style={{ padding: "50px 24px 14px", position: "relative", zIndex: 1, textAlign: "center" }}>
        <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: `rgba(${T.ar},.5)`, marginBottom: 8 }}>{gr}</div>
        <div style={{ fontSize: 42, margin: "4px 0", lineHeight: 1 }}>{moon.e}</div>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 26, fontWeight: 300, lineHeight: 1.25, color: T.text, marginTop: 12, transition: "color .8s" }}>{msg}</div>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 15, color: `rgba(${T.ar},.7)`, lineHeight: 1.5, transition: "color .8s", marginTop: 8 }}>{moon.l}</div>
      </div>

      {/* Theme picker */}
      <div className="fu2" style={{ margin: "16px 24px", position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: `rgba(${T.ar},.4)`, marginBottom: 10 }}>моё состояние</div>
        <div style={{ display: "flex", gap: 8 }}>
          {Object.entries(THEMES).map(([k, m]) => (
            <div key={k} onClick={() => setTheme(k)} className="pc" style={{
              flex: 1, padding: "12px 8px", borderRadius: 14, textAlign: "center", cursor: "pointer",
              background: theme === k ? T.card : "rgba(255,255,255,.03)",
              border: `1px solid ${theme === k ? T.border : "rgba(255,255,255,.04)"}`,
              transition: "all .4s",
            }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{m.e}</div>
              <div style={{ fontSize: 8, letterSpacing: ".1em", textTransform: "uppercase", color: theme === k ? T.accent : "rgba(242,232,226,.25)", fontFamily: FONT_SANS, transition: "color .4s" }}>{m.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Energy score */}
      <div className="fu2" onClick={() => setScreen("profile")} style={{
        margin: "0 24px 18px", padding: "16px 18px", background: T.dim,
        border: `1px solid ${T.border}`, borderRadius: 16, display: "flex",
        alignItems: "center", gap: 14, cursor: "pointer",
      }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, background: T.dim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, border: `1px solid ${T.border}` }}>⟡</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: `rgba(${T.ar},.4)` }}>энергия</div>
          <div style={{ fontFamily: FONT_SERIF, fontSize: 18, color: T.text }}>{lv ? `${eScore} — ${lv.l}` : "Пройти тест"}</div>
          <div style={{ height: 2.5, background: "rgba(255,255,255,.06)", borderRadius: 2, marginTop: 6, overflow: "hidden" }}>
            <div style={{ height: "100%", width: eScore ? `${eScore}%` : "0%", background: T.accent, borderRadius: 2, transition: "width .8s" }} />
          </div>
        </div>
        <div style={{ fontSize: 10, color: T.accent, fontFamily: FONT_SANS }}>→</div>
      </div>

      {/* Section cards */}
      <div className="fu3" style={{ padding: "0 24px 22px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: `rgba(${T.ar},.4)` }}>разделы</div>
          <span onClick={() => setScreen("library")} style={{ fontSize: 10, color: T.accent, cursor: "pointer", fontFamily: FONT_SANS }}>Все →</span>
        </div>
        <div style={{ display: "flex", gap: 11, overflowX: "auto", margin: "0 -24px", padding: "4px 24px 4px" }}>
          {cards.map((card) => (
            <div key={card.title} onClick={() => { setLibSec(card.sec); setScreen("library"); }} className="pc" style={{
              width: 145, minWidth: 145, height: 170, borderRadius: 18, position: "relative",
              overflow: "hidden", background: card.bg, cursor: "pointer",
              border: `1px solid rgba(255,255,255,.06)`,
            }}>
              {card.blobs.map((b, i) => (
                <div key={i} style={{ position: "absolute", left: b.x, top: b.y, width: b.w, height: b.h, borderRadius: "50%", background: b.c, filter: "blur(30px)" }} />
              ))}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.6), transparent)" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px 14px 16px" }}>
                <div style={{ fontFamily: FONT_SANS, fontSize: 8, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(255,255,255,.35)", marginBottom: 6 }}>{card.sub}</div>
                <div style={{ fontFamily: FONT_SERIF, fontSize: 21, color: "rgba(255,255,255,.94)", fontWeight: 300 }}>{card.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Situations link */}
      <div className="fu3" onClick={() => setScreen("situations")} style={{
        margin: "0 24px 20px", padding: "18px 20px", background: T.card,
        border: `1px solid ${T.border}`, borderRadius: 16,
        display: "flex", alignItems: "center", gap: 14, cursor: "pointer",
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: FONT_SERIF, fontSize: 17, color: T.text, marginBottom: 3 }}>Что меня беспокоит?</div>
          <div style={{ fontSize: 11, color: "rgba(242,232,226,.42)", fontFamily: FONT_SANS, lineHeight: 1.4 }}>Найти практику под ситуацию</div>
        </div>
        <div style={{ fontSize: 18, color: T.accent }}>→</div>
      </div>

      {/* Recommendations */}
      <div className="fu4" style={{ padding: "0 24px 22px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: `rgba(${T.ar},.4)` }}>рекомендации</div>
          <span onClick={() => setScreen("library")} style={{ fontSize: 10, color: T.accent, cursor: "pointer", fontFamily: FONT_SANS }}>Все →</span>
        </div>
        {(RECOMMENDATIONS[theme] || RECOMMENDATIONS.full).map((r) => {
          const sec = SECTIONS.find((s) => s.id === r.sec);
          const lc = r.free ? "rgba(160,138,65,.85)" : (sec && sec.color) || T.accent;
          return (
            <div key={r.t} onClick={() => setScreen("library")} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
              background: T.card, border: `1px solid ${T.border}`, borderRadius: 14,
              marginBottom: 8, position: "relative", cursor: "pointer",
            }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 2.5, background: lc, borderRadius: "2px 0 0 2px" }} />
              <div style={{ width: 34, height: 34, borderRadius: 10, background: `${lc}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: lc }}>◦</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: FONT_SERIF, fontSize: 13, color: "rgba(242,232,226,.9)", marginBottom: 2 }}>{r.t}</div>
                <div style={{ fontSize: 9.5, color: lc, fontFamily: FONT_SANS, letterSpacing: ".04em" }}>{r.s}</div>
              </div>
              {r.free ? (
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${lc}22`, border: `1px solid ${lc}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: lc }}>▶</div>
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(242,232,226,.3)" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
              )}
            </div>
          );
        })}
      </div>

      {/* Subscription CTA */}
      <div className="fu4" onClick={() => setScreen("sub")} style={{
        margin: "0 24px 22px", borderRadius: 20, overflow: "hidden",
        background: T.card, border: `1px solid ${T.border}`, position: "relative", cursor: "pointer",
      }}>
        <Orb style={{ top: -60, right: -60 }} color={T.o1} opacity={0.3} w={200} h={200} />
        <div style={{ position: "relative", zIndex: 1, padding: "24px 22px 20px" }}>
          <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: `rgba(${T.ar},.4)`, marginBottom: 8 }}>подписка frisson</div>
          <div style={{ fontFamily: FONT_SERIF, fontSize: 26, fontWeight: 300, lineHeight: 1.2, color: T.text, marginBottom: 8 }}>Полный доступ ко всем практикам</div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,.07)", paddingTop: 14, marginBottom: 12 }}>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 30, fontWeight: 300, color: T.text, lineHeight: 1, marginBottom: 4 }}>99 zł / мес</div>
            <div style={{ fontSize: 11, color: T.accent, fontFamily: FONT_SANS }}>или 900 zł / год — выгода 24%</div>
          </div>
          <div style={{ width: "100%", padding: 12, borderRadius: 13, textAlign: "center", background: `linear-gradient(135deg, ${T.o1}, ${T.o2})`, fontFamily: FONT_SANS, fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(245,235,230,.9)" }}>Попробовать</div>
        </div>
      </div>

      {/* Journal link */}
      <div className="fu5" onClick={() => setScreen("journal")} style={{
        margin: "0 24px 24px", padding: "18px 20px", background: T.card,
        border: `1px solid ${T.border}`, borderRadius: 16,
        display: "flex", alignItems: "center", gap: 14, cursor: "pointer",
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: FONT_SERIF, fontSize: 16.5, color: T.text, marginBottom: 2 }}>Дневник</div>
          <div style={{ fontSize: 10.5, color: "rgba(242,232,226,.4)", fontFamily: FONT_SANS }}>Сегодня у вас новый день</div>
        </div>
        <div style={{ fontSize: 15, color: "rgba(160,138,65,.5)" }}>→</div>
      </div>
    </div>
  );
}
