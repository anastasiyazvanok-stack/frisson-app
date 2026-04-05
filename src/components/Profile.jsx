import { useState } from "react";
import { THEMES, getEnergyLevel } from "../data/themes";
import { TEST_QUESTIONS } from "../data/content";
import { FONT_SERIF, FONT_SANS } from "../utils/helpers";
import Orb from "./Orb";
import { VERSION } from "../App";

export default function Profile({ setScreen, theme, eScore, setEScore, eHist, setEHist, pLog, gems = 0 }) {
  const T = THEMES[theme] || THEMES.full;
  const [showT, setShowT] = useState(false);
  const [tI, setTI] = useState(0);
  const [tA, setTA] = useState([]);
  const lv = eScore !== null ? getEnergyLevel(eScore) : null;
  const circ = 2 * Math.PI * 32;

  if (showT) return (
    <div style={{ minHeight: "100%", background: T.bg, padding: "50px 24px 40px", transition: "background .6s" }}>
      <div onClick={() => setShowT(false)} style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer", marginBottom: 24 }}>
        <span style={{ fontSize: 14, color: "rgba(242,232,226,.4)" }}>←</span><span style={{ fontSize: 11, letterSpacing: ".15em", textTransform: "uppercase", color: "rgba(242,232,226,.4)", fontFamily: FONT_SANS }}>Отмена</span>
      </div>
      <div style={{ height: 2, background: "rgba(255,255,255,.06)", borderRadius: 2, overflow: "hidden", marginBottom: 22 }}><div style={{ height: "100%", background: T.accent, width: `${(tI / TEST_QUESTIONS.length) * 100}%`, transition: "width .5s ease", borderRadius: 2 }} /></div>
      <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(242,232,226,.4)", textAlign: "center", marginBottom: 12 }}>Вопрос {tI + 1} из {TEST_QUESTIONS.length}</div>
      <div style={{ fontFamily: FONT_SERIF, fontSize: 22, lineHeight: 1.55, color: "rgba(242,232,226,.95)", textAlign: "center", marginBottom: 28, fontWeight: 300 }}>{TEST_QUESTIONS[tI].q}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {TEST_QUESTIONS[tI].o.map((opt, i) => (
          <div key={i} onClick={() => { const n = [...tA]; n[tI] = i + 1; setTA(n); }} style={{ padding: "13px 17px", borderRadius: 13, display: "flex", alignItems: "center", gap: 13, cursor: "pointer", background: tA[tI] === i + 1 ? T.dim : T.card, border: `1px solid ${tA[tI] === i + 1 ? T.accent : T.border}`, transition: "all .25s" }}>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 20, color: T.accent, width: 22, textAlign: "center", flexShrink: 0 }}>{i + 1}</div>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 14.5, color: "rgba(230,218,210,.85)" }}>{opt}</div>
          </div>
        ))}
      </div>
      <div onClick={() => {
        if (!tA[tI]) return;
        if (tI < TEST_QUESTIONS.length - 1) { setTI(tI + 1); }
        else {
          const raw = tA.reduce((s, v) => s + (v || 1), 0);
          const sc = Math.round((raw / (TEST_QUESTIONS.length * 5)) * 100);
          setEScore(sc);
          setEHist((h) => [...h, { score: sc, date: new Date().getDate() + " " + ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"][new Date().getMonth()] }].slice(-6));
          setShowT(false);
        }
      }} style={{ width: "100%", padding: 13, borderRadius: 26, textAlign: "center", background: tA[tI] ? T.dim : "rgba(255,255,255,.02)", border: `1px solid ${tA[tI] ? T.border : "rgba(255,255,255,.05)"}`, fontFamily: FONT_SANS, fontSize: 11, letterSpacing: ".22em", textTransform: "uppercase", color: tA[tI] ? "rgba(242,232,226,.8)" : "rgba(242,232,226,.2)", cursor: tA[tI] ? "pointer" : "default" }}>{tI === TEST_QUESTIONS.length - 1 ? "Посмотреть результат →" : "Следующий вопрос →"}</div>
    </div>
  );

  const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  const pd = pLog.slice(-7);

  return (
    <div style={{ minHeight: "100%", background: T.bg, paddingBottom: 20, position: "relative", transition: "background .6s" }}>
      <Orb style={{ top: -50, left: "50%", transform: "translateX(-50%)" }} color={T.o1} opacity={0.15} w={260} h={260} />
      <div style={{ padding: "50px 24px 22px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".25em", textTransform: "uppercase", color: T.accent, marginBottom: 8 }}>Внутренний мир</div>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#280d18,#1a0812)", border: `1.5px solid ${T.border}`, margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_SERIF, fontSize: 26, color: T.accent }}>AN</div>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 24, marginBottom: 4, color: "rgba(242,232,226,.95)" }}>Anastasiya</div>
        <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: T.accent, marginBottom: 18 }}>✦ Начало пути</div>
        <div onClick={() => setScreen("sub")} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 20px", borderRadius: 22, background: T.dim, border: `1px solid ${T.border}`, cursor: "pointer", marginBottom: 18, fontFamily: FONT_SANS, fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(242,232,226,.75)" }}>♛ &nbsp;Активировать подписку</div>
      </div>

      <div style={{ margin: "0 24px 18px", background: T.dim, border: `1px solid ${T.border}`, borderRadius: 20, overflow: "hidden", position: "relative", zIndex: 1, transition: "background .6s" }}>
        {eScore === null ? (
          <div style={{ padding: 22, textAlign: "center" }}>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 18, color: "rgba(242,232,226,.9)", marginBottom: 8, lineHeight: 1.4 }}>Замерьте свою психологическую энергию</div>
            <div style={{ fontSize: 11, color: "rgba(242,232,226,.4)", lineHeight: 1.6, marginBottom: 18, fontFamily: FONT_SANS }}>7 вопросов · 3 минуты · Бесплатно</div>
            <div onClick={() => { setShowT(true); setTI(0); setTA([]); }} style={{ display: "inline-block", padding: "12px 30px", borderRadius: 14, background: T.dim, border: `1px solid ${T.border}`, fontFamily: FONT_SANS, fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(242,232,226,.85)", cursor: "pointer" }}>Пройти тест →</div>
          </div>
        ) : (
          <div>
            <div style={{ padding: "18px 20px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(242,232,226,.4)", marginBottom: 5 }}>Психологическая энергия</div>
                <div style={{ fontFamily: FONT_SERIF, fontSize: 20, color: "rgba(242,232,226,.95)" }}>{eScore} / 100</div>
                <div style={{ fontFamily: FONT_SERIF, fontSize: 15, color: T.accent, marginTop: 3 }}>{lv.l}</div>
              </div>
              <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
                <svg width="72" height="72" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="36" cy="36" r="32" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="6" />
                  <circle cx="36" cy="36" r="32" fill="none" stroke={T.accent} strokeWidth="6" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ - (circ * eScore / 100)} style={{ transition: "stroke-dashoffset 1.4s ease" }} />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ fontFamily: FONT_SERIF, fontSize: 20, fontWeight: 300, lineHeight: 1, color: "rgba(242,232,226,.95)" }}>{eScore}</div>
                  <div style={{ fontSize: 8, color: "rgba(242,232,226,.35)", fontFamily: FONT_SANS }}>/100</div>
                </div>
              </div>
            </div>
            <div style={{ padding: "0 20px 18px" }}><div onClick={() => { setShowT(true); setTI(0); setTA([]); }} style={{ textAlign: "center", fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: T.accent, cursor: "pointer", fontFamily: FONT_SANS }}>↻ Повторить тест</div></div>
          </div>
        )}
      </div>

      <div style={{ margin: "0 24px 18px", padding: 20, background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(242,232,226,.4)", marginBottom: 4 }}>График энергии</div>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 18, color: "rgba(242,232,226,.9)", marginBottom: 16 }}>Динамика роста</div>
        {eHist.length < 1 ? <div style={{ padding: "18px 0", textAlign: "center", fontFamily: FONT_SERIF, fontSize: 14, color: "rgba(242,232,226,.3)" }}>Пройдите тест — здесь появится ваш график</div> : (() => {
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
              <defs><linearGradient id="eg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={`${T.accent}66`} /><stop offset="100%" stopColor={`${T.accent}00`} /></linearGradient></defs>
              <path d={area} fill="url(#eg)" />
              <path d={line} fill="none" stroke={T.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              {pts.map((p, i) => <g key={i}><circle cx={p.x} cy={p.y} r={i === pts.length - 1 ? 5 : 3} fill={i === pts.length - 1 ? T.accent : `${T.accent}88`} /><text x={p.x} y={H - 2} textAnchor="middle" fill="rgba(242,232,226,.3)" fontSize="8" fontFamily={FONT_SANS}>{sdates[i]}</text><text x={p.x} y={p.y - 8} textAnchor="middle" fill={i === pts.length - 1 ? "rgba(242,232,226,.85)" : "rgba(242,232,226,.45)"} fontSize="9" fontFamily={FONT_SANS}>{safe[i]}</text></g>)}
            </svg>
          );
        })()}
      </div>

      <div style={{ margin: "0 24px 18px", padding: 20, background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(242,232,226,.4)", marginBottom: 4 }}>Практики</div>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 18, color: "rgba(242,232,226,.9)", marginBottom: 16 }}>Активность за неделю</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 60 }}>
          {days.map((d, i) => { const v = pd[i] || 0; const h = Math.max(4, v * 20); return (<div key={d} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}><div style={{ width: "100%", borderRadius: "3px 3px 0 0", height: h, transition: "height .8s ease", background: v > 0 ? T.accent : "rgba(255,255,255,.06)" }} /><div style={{ fontSize: 8, color: "rgba(242,232,226,.3)", fontFamily: FONT_SANS }}>{d}</div></div>); })}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, margin: "0 24px 18px", position: "relative", zIndex: 1 }}>
        {[["0", "Медитаций"], ["0", "Минут"], ["0", "Дней подряд"], [`${gems} ⟡`, "Кристаллов"]].map((pr, i) => (
          <div key={i} style={{ padding: "16px 14px", background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, textAlign: "center" }}>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 32, fontWeight: 300, lineHeight: 1, marginBottom: 4, color: "rgba(242,232,226,.95)" }}>{pr[0]}</div>
            <div style={{ fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(242,232,226,.4)", fontFamily: FONT_SANS }}>{pr[1]}</div>
          </div>
        ))}
      </div>

      <div style={{ margin: "0 24px 14px", padding: 20, background: T.dim, border: `1px solid ${T.border}`, borderRadius: 18, position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 14 }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: "rgba(125,23,54,.35)", border: "1px solid rgba(125,23,54,.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🎓</div>
          <div><div style={{ fontFamily: FONT_SERIF, fontSize: 15, color: "rgba(242,232,226,.9)", marginBottom: 2 }}>Анастасия Званок</div><div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".12em", textTransform: "uppercase", color: T.accent }}>Автор · Психолог</div></div>
        </div>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 14, lineHeight: 1.75, color: "rgba(230,218,210,.7)", marginBottom: 12 }}>Магистр Клинической Психологии с европейским образованием. Помогаю женщинам выйти из внутреннего дефицита в ресурс, самоценность и наполненность.</div>
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          {["Магистратура", "Европейский диплом", "Женская психология"].map((t) => (
            <div key={t} style={{ padding: "4px 10px", background: "rgba(125,23,54,.28)", border: "1px solid rgba(125,23,54,.35)", borderRadius: 20, fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(242,232,226,.6)", fontFamily: FONT_SANS }}>{t}</div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", paddingBottom: 24, position: "relative", zIndex: 1 }}>
        <span style={{ fontFamily: FONT_SANS, fontSize: 9, color: "rgba(242,232,226,.2)", letterSpacing: ".1em" }}>v{VERSION}</span>
      </div>
    </div>
  );
}
