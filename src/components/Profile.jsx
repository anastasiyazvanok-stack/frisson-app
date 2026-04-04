import { useState } from "react";
import { THEMES, getEnergyLevel } from "../data/themes";
import { TEST_QUESTIONS } from "../data/content";
import { FONT_SERIF, FONT_SANS } from "../utils/helpers";
import Orb from "./Orb";

export default function Profile({ setScreen, theme, eScore, setEScore, eHist, setEHist, pLog }) {
  const T = THEMES[theme] || THEMES.full;
  const [showT, setShowT] = useState(false);
  const [tI, setTI] = useState(0);
  const [tA, setTA] = useState([]);
  const lv = eScore !== null ? getEnergyLevel(eScore) : null;
  const circ = 2 * Math.PI * 32;

  // Test view
  if (showT) return (
    <div style={{ minHeight: "100%", background: T.bg, padding: "50px 24px 40px", transition: "background .8s" }}>
      <div onClick={() => setShowT(false)} style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer", marginBottom: 28 }}>
        <span style={{ fontSize: 14, color: "rgba(242,232,226,.4)" }}>←</span>
        <span style={{ fontSize: 11, letterSpacing: ".15em", textTransform: "uppercase", color: "rgba(242,232,226,.35)", fontFamily: FONT_SANS }}>Назад</span>
      </div>
      <div style={{ height: 2, background: "rgba(255,255,255,.06)", borderRadius: 2, overflow: "hidden", marginBottom: 28 }}>
        <div style={{ height: "100%", width: `${((tI + 1) / TEST_QUESTIONS.length) * 100}%`, background: T.accent, borderRadius: 2, transition: "width .4s" }} />
      </div>
      <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: `rgba(${T.ar},.4)`, marginBottom: 12 }}>вопрос {tI + 1} из {TEST_QUESTIONS.length}</div>
      <div style={{ fontFamily: FONT_SERIF, fontSize: 22, lineHeight: 1.55, color: "rgba(242,232,226,.95)", textAlign: "center", marginBottom: 28 }}>{TEST_QUESTIONS[tI].q}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {TEST_QUESTIONS[tI].o.map((opt, i) => (
          <div key={i} onClick={() => { const n = [...tA]; n[tI] = i + 1; setTA(n); }} className="pc" style={{
            display: "flex", alignItems: "center", gap: 14, padding: "16px 18px",
            borderRadius: 14, cursor: "pointer", transition: "all .3s",
            background: tA[tI] === i + 1 ? T.card : "rgba(255,255,255,.03)",
            border: `1px solid ${tA[tI] === i + 1 ? T.accent + "44" : "rgba(255,255,255,.06)"}`,
          }}>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 20, color: T.accent, width: 22, textAlign: "center", flexShrink: 0 }}>{tA[tI] === i + 1 ? "◉" : "○"}</div>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 14.5, color: "rgba(230,218,210,.85)" }}>{opt}</div>
          </div>
        ))}
      </div>
      <div onClick={() => {
        if (!tA[tI]) return;
        if (tI < TEST_QUESTIONS.length - 1) { setTI(tI + 1); }
        else {
          const raw = tA.reduce((a, b) => a + b, 0);
          const max = TEST_QUESTIONS.length * 5;
          const score = Math.round((raw / max) * 100);
          setEScore(score);
          const d = new Date();
          const dateStr = `${d.getDate()} ${["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"][d.getMonth()]}`;
          setEHist((p) => [...p, { score, date: dateStr }]);
          setShowT(false);
        }
      }} style={{
        width: "100%", padding: 16, borderRadius: 16, textAlign: "center", cursor: tA[tI] ? "pointer" : "default",
        background: tA[tI] ? `linear-gradient(135deg, ${T.o1}, ${T.o2})` : "rgba(255,255,255,.04)",
        border: `1px solid ${tA[tI] ? T.accent + "44" : "rgba(255,255,255,.06)"}`,
        fontFamily: FONT_SANS, fontSize: 13, letterSpacing: ".12em", textTransform: "uppercase",
        color: tA[tI] ? "rgba(245,235,230,.9)" : "rgba(242,232,226,.2)", transition: "all .4s",
      }}>{tI < TEST_QUESTIONS.length - 1 ? "Далее" : "Узнать результат"}</div>
    </div>
  );

  const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  const pd = pLog.slice(-7);

  return (
    <div style={{ minHeight: "100%", background: T.bg, paddingBottom: 20, position: "relative", transition: "background .8s" }}>
      <Orb style={{ top: -50, left: "50%", transform: "translateX(-50%)" }} color={T.o1} opacity={0.14} w={240} h={240} />

      {/* Header */}
      <div style={{ padding: "50px 24px 22px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".25em", textTransform: "uppercase", color: `rgba(${T.ar},.4)`, marginBottom: 14 }}>профиль</div>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: `linear-gradient(135deg, ${T.o1}, ${T.o2})`, margin: "0 auto 14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>✦</div>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 24, marginBottom: 4, color: "rgba(242,232,226,.95)" }}>Frisson</div>
        <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: `rgba(${T.ar},.4)`, marginBottom: 12 }}>ваш путь</div>
        <div onClick={() => setScreen("sub")} style={{
          display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 20px",
          borderRadius: 20, background: T.dim, border: `1px solid ${T.border}`,
          fontFamily: FONT_SANS, fontSize: 10, color: T.accent, cursor: "pointer",
        }}>✦ Подписка</div>
      </div>

      {/* Energy score card */}
      <div style={{ margin: "0 24px 18px", background: T.dim, border: `1px solid ${T.border}`, borderRadius: 18, overflow: "hidden" }}>
        {eScore === null ? (
          <div style={{ padding: 22, textAlign: "center" }}>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 18, color: "rgba(242,232,226,.9)", marginBottom: 8, lineHeight: 1.4 }}>Тест психологической энергии</div>
            <div style={{ fontSize: 11, color: "rgba(242,232,226,.4)", lineHeight: 1.6, marginBottom: 16, fontFamily: FONT_SANS }}>7 вопросов · 2 минуты</div>
            <div onClick={() => { setShowT(true); setTI(0); setTA([]); }} style={{
              display: "inline-block", padding: "12px 28px", borderRadius: 14,
              background: `linear-gradient(135deg, ${T.o1}, ${T.o2})`, border: `1px solid ${T.accent}44`,
              fontFamily: FONT_SANS, fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase",
              color: "rgba(245,235,230,.9)", cursor: "pointer",
            }}>Пройти тест</div>
          </div>
        ) : (
          <div>
            <div style={{ padding: "18px 20px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: `rgba(${T.ar},.4)`, marginBottom: 4 }}>энергия</div>
                <div style={{ fontFamily: FONT_SERIF, fontSize: 20, color: "rgba(242,232,226,.95)" }}>{eScore} из 100</div>
                <div style={{ fontFamily: FONT_SERIF, fontSize: 15, color: T.accent, marginTop: 3 }}>{lv.l}</div>
              </div>
              <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
                <svg width="72" height="72" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="36" cy="36" r="32" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="6" />
                  <circle cx="36" cy="36" r="32" fill="none" stroke={T.accent} strokeWidth="6" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ - (eScore / 100) * circ} style={{ transition: "stroke-dashoffset .8s" }} />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ fontFamily: FONT_SERIF, fontSize: 20, fontWeight: 300, lineHeight: 1, color: "rgba(242,232,226,.95)" }}>{eScore}</div>
                  <div style={{ fontSize: 8, color: "rgba(242,232,226,.35)", fontFamily: FONT_SANS }}>/100</div>
                </div>
              </div>
            </div>
            <div style={{ padding: "0 20px 18px" }}>
              <div onClick={() => { setShowT(true); setTI(0); setTA([]); }} style={{
                width: "100%", padding: 10, borderRadius: 12, textAlign: "center",
                background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.06)",
                fontFamily: FONT_SANS, fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase",
                color: "rgba(242,232,226,.4)", cursor: "pointer",
              }}>Пройти заново</div>
            </div>
          </div>
        )}
      </div>

      {/* Score history chart */}
      <div style={{ margin: "0 24px 18px", padding: 20, background: T.card, border: `1px solid ${T.border}`, borderRadius: 18 }}>
        <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: `rgba(${T.ar},.4)`, marginBottom: 6 }}>динамика</div>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 18, color: "rgba(242,232,226,.9)", marginBottom: 16 }}>История энергии</div>
        {eHist.length < 1 ? (
          <div style={{ padding: "18px 0", textAlign: "center", fontFamily: FONT_SERIF, fontSize: 14, color: "rgba(242,232,226,.3)" }}>Пройдите тест, чтобы увидеть динамику</div>
        ) : (() => {
          const H = 80, W = 300, pL = 26, pB = 20, iW = W - pL - 8, iH = H - 6 - pB;
          const scores = eHist.map((x) => typeof x === "object" ? x.score : x);
          const dates = eHist.map((x) => typeof x === "object" ? x.date : "");
          const safe = scores.length === 1 ? [scores[0], scores[0]] : scores;
          const sdates = dates.length === 1 ? [dates[0], dates[0]] : dates;
          const pts = safe.map((v, i) => ({ x: pL + (i / (safe.length - 1)) * iW, y: 6 + iH - (v / 100) * iH }));
          const line = "M" + pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join("L");
          const area = line + `L${pts[pts.length - 1].x},${H - pB}L${pts[0].x},${H - pB}Z`;
          return (
            <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
              <defs>
                <linearGradient id="eg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={T.accent} stopOpacity="0.2" />
                  <stop offset="100%" stopColor={T.accent} stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={area} fill="url(#eg)" />
              <path d={line} fill="none" stroke={T.accent} strokeWidth="2" strokeLinecap="round" />
              {pts.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r={i === pts.length - 1 ? 5 : 3} fill={T.accent} opacity={i === pts.length - 1 ? 1 : 0.5} />
                  {sdates[i] && <text x={p.x} y={H - 4} textAnchor="middle" fill="rgba(242,232,226,.3)" fontSize="8" fontFamily={FONT_SANS}>{sdates[i]}</text>}
                </g>
              ))}
            </svg>
          );
        })()}
      </div>

      {/* Practice stats */}
      <div style={{ margin: "0 24px 18px", padding: 20, background: T.card, border: `1px solid ${T.border}`, borderRadius: 18 }}>
        <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: `rgba(${T.ar},.4)`, marginBottom: 6 }}>активность</div>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 18, color: "rgba(242,232,226,.9)", marginBottom: 16 }}>Эта неделя</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 60 }}>
          {days.map((d, i) => {
            const v = pd[i] || 0;
            const h = Math.max(4, v * 20);
            return (
              <div key={d} style={{ flex: 1, textAlign: "center" }}>
                <div style={{ height: h, background: v > 0 ? T.accent : "rgba(255,255,255,.06)", borderRadius: 4, marginBottom: 6, transition: "height .4s" }} />
                <div style={{ fontSize: 8, color: "rgba(242,232,226,.3)", fontFamily: FONT_SANS }}>{d}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, margin: "0 24px 18px", position: "relative", zIndex: 1 }}>
        {[["0", "Медитаций"], ["0", "Минут"], ["0", "Дней подряд"], ["0 ⟡", "Кристаллов"]].map((pr, i) => (
          <div key={i} style={{ padding: "16px 14px", background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, textAlign: "center" }}>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 22, color: "rgba(242,232,226,.9)", marginBottom: 2 }}>{pr[0]}</div>
            <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(242,232,226,.35)" }}>{pr[1]}</div>
          </div>
        ))}
      </div>

      {/* Author */}
      <div style={{ margin: "0 24px 14px", padding: 20, background: T.dim, border: `1px solid ${T.border}`, borderRadius: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 14 }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: "rgba(125,23,54,.35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>А</div>
          <div>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 15, color: "rgba(242,232,226,.9)", marginBottom: 2 }}>Анастасия</div>
            <div style={{ fontFamily: FONT_SANS, fontSize: 10, color: "rgba(242,232,226,.45)" }}>Автор Frisson</div>
          </div>
        </div>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 14, lineHeight: 1.75, color: "rgba(230,218,210,.7)", marginBottom: 12 }}>
          Психолог, автор медитаций и программ для женщин. Создатель метода работы с женским психологическим капиталом.
        </div>
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          {["Магистратура", "Европейский диплом", "Женская психология"].map((t) => (
            <div key={t} style={{ padding: "5px 12px", borderRadius: 12, background: "rgba(125,23,54,.12)", border: "1px solid rgba(125,23,54,.2)", fontFamily: FONT_SANS, fontSize: 9, color: "rgba(230,218,210,.5)" }}>{t}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
