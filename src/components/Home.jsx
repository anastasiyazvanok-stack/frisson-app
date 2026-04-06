import { useState } from "react";
import { THEMES, getEnergyLevel } from "../data/themes";
import { SECTIONS, RECOMMENDATIONS, MOOD_MESSAGES } from "../data/content";
import { getMoon, useGreeting, FONT_SERIF, FONT_SANS } from "../utils/helpers";
import Orb from "./Orb";
import Lock from "./Lock";
import { VERSION } from "../App";

export default function Home({ setScreen, theme, setTheme, eScore, pLog, setLibSec }) {
  const T = THEMES[theme] || THEMES.full;
  const moon = getMoon();
  const gr = useGreeting();
  const lv = eScore !== null ? getEnergyLevel(eScore) : null;
  const [msgI] = useState(() => Math.floor(Math.random() * 3));
  const msg = (MOOD_MESSAGES[theme] || MOOD_MESSAGES.full)[msgI];
  const spd = theme === "power" ? "4s" : theme === "empty" ? "14s" : "8s";

  const cards = [
    { sub: "Ресурс", title: "Наполниться", sec: "resource", bg: "#110500", blobs: [{ x: "55%", y: "20%", w: 165, h: 135, c: "rgba(196,80,12,.92)", b: 22 }, { x: "10%", y: "60%", w: 135, h: 108, c: "rgba(128,144,192,.5)", b: 18 }, { x: "74%", y: "68%", w: 104, h: 82, c: "rgba(212,144,10,.7)", b: 16 }] },
    { sub: "Женское", title: "Женственность", sec: "feminine", bg: "#0e0412", blobs: [{ x: "50%", y: "25%", w: 162, h: 148, c: "rgba(176,32,160,.9)", b: 22 }, { x: "12%", y: "62%", w: 130, h: 106, c: "rgba(128,144,192,.6)", b: 18 }, { x: "72%", y: "66%", w: 110, h: 88, c: "rgba(196,80,12,.55)", b: 16 }] },
    { sub: "Реализация", title: "Получать", sec: "receiving", bg: "#100a00", blobs: [{ x: "48%", y: "22%", w: 158, h: 128, c: "rgba(212,144,10,.92)", b: 22 }, { x: "12%", y: "60%", w: 134, h: 104, c: "rgba(196,80,12,.72)", b: 18 }, { x: "74%", y: "66%", w: 106, h: 84, c: "rgba(128,144,192,.45)", b: 16 }] },
    { sub: "Новый уровень", title: "Расти", sec: "newlevel", bg: "#080c14", blobs: [{ x: "44%", y: "24%", w: 160, h: 132, c: "rgba(96,112,180,.88)", b: 22 }, { x: "10%", y: "58%", w: 136, h: 108, c: "rgba(138,40,16,.7)", b: 18 }, { x: "72%", y: "66%", w: 108, h: 84, c: "rgba(212,144,10,.6)", b: 16 }] },
  ];

  return (
    <div style={{ minHeight: "100%", background: T.bg, paddingBottom: 100, position: "relative", transition: "background .6s" }}>
      <Orb style={{ top: -60, right: -80 }} color={T.o1} opacity={0.16} w={280} h={280} />
      <Orb style={{ bottom: 300, left: -60 }} color={T.o2} opacity={0.1} w={200} h={200} delay={3} />

      <div className="fu1" style={{ padding: "50px 24px 14px", position: "relative", zIndex: 1, textAlign: "center" }}>
        <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(242,232,226,.38)", marginBottom: 6 }}>{moon.n}</div>
        <div style={{ position: "relative", display: "inline-block", margin: "4px 0" }}>
          <div className="moon-halo" style={{ position: "absolute", inset: -14, borderRadius: "50%", background: `radial-gradient(circle, rgba(${T.ar},.5), transparent 70%)`, filter: "blur(14px)", pointerEvents: "none" }} />
          <div style={{ fontSize: 42, lineHeight: 1, position: "relative" }}>{moon.e}</div>
        </div>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 26, fontWeight: 300, lineHeight: 1.25, color: T.text, marginBottom: 6 }}>{gr},<br/><span style={{ color: T.accent }}>Anastasiya</span></div>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 15, color: `rgba(${T.ar},.7)`, lineHeight: 1.5, transition: "color .6s" }}>{msg}</div>
        <div style={{ fontFamily: FONT_SANS, fontSize: 9, color: "rgba(242,232,226,.15)", marginTop: 10 }}>Frisson v{VERSION}</div>
      </div>

      <div className="fu2" style={{ margin: "16px 24px", position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(242,232,226,.35)", marginBottom: 10, textAlign: "center" }}>Как ты сейчас?</div>
        <div style={{ display: "flex", gap: 8 }}>
          {Object.entries(THEMES).map(([k, m]) => (
            <div key={k} onClick={() => setTheme(k)} className="pc" style={{
              flex: 1, padding: "11px 4px", borderRadius: 16, textAlign: "center", cursor: "pointer",
              background: theme === k ? `rgba(${m.ar},.22)` : "rgba(255,255,255,.03)",
              border: `1.5px solid ${theme === k ? m.accent : "rgba(255,255,255,.07)"}`,
              boxShadow: theme === k ? `0 0 18px rgba(${m.ar},.35)` : "none",
              transition: "all .4s",
            }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{m.e}</div>
              <div style={{ fontSize: 8, letterSpacing: ".1em", textTransform: "uppercase", color: theme === k ? m.accent : "rgba(242,232,226,.35)", fontFamily: FONT_SANS }}>{m.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="fu2" onClick={() => setScreen("profile")} style={{ margin: "0 24px 18px", padding: "13px 17px", background: T.card, border: `1px solid ${T.border}`, borderRadius: 17, display: "flex", alignItems: "center", gap: 13, cursor: "pointer", position: "relative", zIndex: 1, transition: "background .6s,border-color .6s" }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, background: T.dim, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_SERIF, fontSize: 16, color: T.accent, flexShrink: 0 }}>◈</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(242,232,226,.38)", marginBottom: 3 }}>Психологическая энергия</div>
          <div style={{ fontFamily: FONT_SERIF, fontSize: 18, color: T.text }}>{lv ? `${eScore} — ${lv.l}` : "Пройдите тест в профиле"}</div>
          <div style={{ height: 2.5, background: "rgba(255,255,255,.06)", borderRadius: 2, marginTop: 7, overflow: "hidden" }}><div style={{ height: "100%", borderRadius: 2, background: T.accent, width: lv ? `${eScore}%` : "0%", transition: "width 1.2s ease" }} /></div>
        </div>
        <div style={{ fontSize: 10, color: T.accent, fontFamily: FONT_SANS }}>→</div>
      </div>

      <div className="fu3" style={{ padding: "0 24px 22px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(242,232,226,.38)" }}>Состояния</div>
          <span onClick={() => setScreen("library")} style={{ fontSize: 10, color: T.accent, cursor: "pointer", fontFamily: FONT_SANS }}>Все →</span>
        </div>
        <div style={{ display: "flex", gap: 11, overflowX: "auto", margin: "0 -24px", padding: "4px 24px 8px" }}>
          {cards.map((card, idx) => (
            <div key={card.title} onClick={() => { setLibSec(card.sec); setScreen("library"); }} className="pc card-float" style={{ minWidth: 148, height: 192, borderRadius: 22, position: "relative", overflow: "hidden", flexShrink: 0, cursor: "pointer", background: card.bg, border: "1px solid rgba(255,255,255,.07)", animationDelay: `${idx * 0.6}s` }}>
              {card.blobs.map((b, i) => (
                <div key={i} style={{ position: "absolute", left: b.x, top: b.y, width: b.w, height: b.h, transform: "translate(-50%,-50%)", borderRadius: `${48 + i * 7}% ${52 - i * 5}% ${55 - i * 3}% ${45 + i * 4}% / ${44 + i * 6}% ${56 - i * 4}% ${48 + i * 5}% ${52 - i * 3}%`, background: b.c, filter: `blur(${b.b}px)` }} />
              ))}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,.88) 0%,rgba(0,0,0,.2) 50%,transparent 80%)" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px 14px 16px" }}>
                <div style={{ fontFamily: FONT_SANS, fontSize: 8, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(255,255,255,.42)", marginBottom: 5 }}>{card.sub}</div>
                <div style={{ fontFamily: FONT_SERIF, fontSize: 21, color: "rgba(255,255,255,.94)", fontWeight: 300, lineHeight: 1.1 }}>{card.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fu3" onClick={() => setScreen("situations")} style={{ margin: "0 24px 20px", padding: "18px 20px", background: T.dim, border: `1px solid ${T.border}`, borderRadius: 18, display: "flex", alignItems: "center", gap: 14, cursor: "pointer", position: "relative", zIndex: 1, transition: "background .6s" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: FONT_SERIF, fontSize: 17, color: T.text, marginBottom: 3 }}>Что меня беспокоит прямо сейчас?</div>
          <div style={{ fontSize: 11, color: "rgba(242,232,226,.42)", fontFamily: FONT_SANS, lineHeight: 1.45 }}>Выберите ситуацию — получите практики именно для вас</div>
        </div>
        <div style={{ fontSize: 18, color: T.accent }}>→</div>
      </div>

      <div className="fu4" style={{ padding: "0 24px 22px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(242,232,226,.38)" }}>Для тебя сейчас</div>
          <span onClick={() => setScreen("library")} style={{ fontSize: 10, color: T.accent, cursor: "pointer", fontFamily: FONT_SANS }}>Все →</span>
        </div>
        {(RECOMMENDATIONS[theme] || RECOMMENDATIONS.full).map((r) => {
          const sec = SECTIONS.find((s) => s.id === r.sec);
          const lc = r.free ? "rgba(160,130,50,.8)" : (sec?.color || T.accent);
          return (
            <div key={r.t} onClick={() => setScreen("library")} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, marginBottom: 7, cursor: "pointer", position: "relative", overflow: "hidden", transition: "background .6s" }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 2.5, background: lc, borderRadius: "2px 0 0 2px" }} />
              <div style={{ width: 34, height: 34, borderRadius: 10, background: `${lc}22`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: FONT_SERIF, fontSize: 16, color: lc }}>◦</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: FONT_SERIF, fontSize: 13, color: "rgba(242,232,226,.9)", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.t}</div>
                <div style={{ fontSize: 9.5, color: lc, fontFamily: FONT_SANS, letterSpacing: ".04em" }}>{r.s}</div>
              </div>
              {r.free ? <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${lc}22`, border: `1px solid ${lc}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "rgba(242,232,226,.7)" }}>▶</div> : <Lock />}
            </div>
          );
        })}
      </div>

      <div className="fu4" onClick={() => setScreen("sub")} style={{ margin: "0 24px 22px", borderRadius: 22, overflow: "hidden", cursor: "pointer", background: `linear-gradient(145deg,${T.gF},${T.gT})`, border: `1.5px solid ${T.border}`, position: "relative", zIndex: 1, transition: "background .6s" }}>
        <Orb style={{ top: -60, right: -60 }} color={T.o1} opacity={0.3} w={200} h={200} />
        <div style={{ position: "relative", zIndex: 1, padding: "24px 22px 20px" }}>
          <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: T.accent, marginBottom: 10 }}>Frisson Premium</div>
          <div style={{ fontFamily: FONT_SERIF, fontSize: 26, fontWeight: 300, lineHeight: 1.2, color: T.text, marginBottom: 12 }}>Полная библиотека<br/>практик — открыта</div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,.07)", paddingTop: 14, marginBottom: 14 }}>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 30, fontWeight: 300, color: T.text, lineHeight: 1, marginBottom: 4 }}>150 <span style={{ fontSize: 13, color: "rgba(242,232,226,.4)", fontFamily: FONT_SANS }}>zł / мес</span></div>
            <div style={{ fontSize: 11, color: T.accent, fontFamily: FONT_SANS }}>или 900 zł / год — выгода 50%</div>
          </div>
          <div style={{ width: "100%", padding: 12, borderRadius: 13, textAlign: "center", background: T.dim, border: `1px solid ${T.border}`, fontFamily: FONT_SANS, fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(242,232,226,.88)" }}>Открыть доступ</div>
        </div>
      </div>

      <div className="fu5" onClick={() => setScreen("journal")} style={{ margin: "0 24px 24px", padding: "17px 20px", background: "linear-gradient(135deg,rgba(160,130,50,.1),rgba(125,23,54,.08))", border: "1px solid rgba(160,138,65,.18)", borderRadius: 18, display: "flex", alignItems: "center", gap: 13, cursor: "pointer", position: "relative", zIndex: 1 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: FONT_SERIF, fontSize: 16.5, color: T.text, marginBottom: 2 }}>Дневник</div>
          <div style={{ fontSize: 10.5, color: "rgba(242,232,226,.4)", fontFamily: FONT_SANS }}>Сегодня у вас нет записи</div>
        </div>
        <div style={{ fontSize: 15, color: "rgba(160,138,65,.5)" }}>→</div>
      </div>
    </div>
  );
}
