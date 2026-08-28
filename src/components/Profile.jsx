import { useState } from "react";
import { getEnergyLevel, themeLabel } from "../data/themes";
import { getTestQuestions } from "../data/content";
import { TYPE, SP, RAD, OP, LS, EASE, LH, FONT_SERIF, FONT_SANS, tx, label, body, heading, card as cardStyle, section } from "../utils/design";
import Orb from "./Orb";
import { t as tr, MONTHS_SHORT, DAYS_SHORT } from "../utils/i18n";

import { VERSION } from "../App";

import { getAchievements } from "../data/activity";
import { logEnergyTest } from "../data/psycap";
import PsycapTracker from "./PsycapTracker";

export default function Profile({ setScreen, theme, eScore, setEScore, eHist, setEHist, pLog, gems = 0, THEMES, activity, eScoreHistory, goToScenario, lang = "ru", setLang }) {
  const T = THEMES[theme] || THEMES.full;
  const L = (k, ...a) => tr(lang, k, ...a);
  const [showT, setShowT] = useState(false);
  const [tI, setTI] = useState(0);
  const [tA, setTA] = useState([]);
  const lv = eScore !== null ? getEnergyLevel(eScore, lang) : null;
  const circ = 2 * Math.PI * 32;
  const TEST_QUESTIONS = getTestQuestions(lang);
  const ACHIEVEMENTS = getAchievements(lang);

  if (showT) return (
    <div style={{ minHeight: "100%", background: T.bg, position: "relative", overflow: "hidden" }}>
      <Orb style={{ top: -60, left: "50%", transform: "translateX(-50%)" }} color={T.o1} opacity={0.14} w={280} h={280} />
      <div style={{ padding: `50px ${SP.xl}px 40px`, position: "relative", zIndex: 1 }}>
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: SP.xl }}>
          <div onClick={() => setShowT(false)} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <span style={{ fontSize: TYPE.base, color: tx("var(--txt)", OP.tertiary) }}>←</span>
            <span style={{ ...label(TYPE.sm), color: tx("var(--txt)", OP.tertiary) }}>{L("cancel")}</span>
          </div>
          <span style={{ ...label(TYPE.xs), letterSpacing: ".18em", color: tx("var(--txt)", OP.tertiary) }}>{tI + 1} / {TEST_QUESTIONS.length}</span>
        </div>

        {/* Progress dots */}
        <div style={{ display: "flex", gap: 6, marginBottom: SP.xxl, justifyContent: "center" }}>
          {TEST_QUESTIONS.map((_, di) => (
            <div key={di} style={{ height: 3, flex: 1, borderRadius: 2, background: di <= tI ? T.accent : `rgba(255,255,255,.1)`, transition: "background .4s ease", boxShadow: di === tI ? `0 0 6px ${T.accent}88` : "none" }} />
          ))}
        </div>

        {/* Question */}
        <div style={{ fontFamily: FONT_SERIF, fontSize: 22, fontWeight: 300, color: tx("var(--txt)", OP.primary), textAlign: "center", marginBottom: SP.xxl, lineHeight: 1.5, minHeight: 80 }}>
          {TEST_QUESTIONS[tI].q}
        </div>

        {/* Answer options */}
        <div style={{ display: "flex", flexDirection: "column", gap: SP.sm, marginBottom: SP.xl }}>
          {TEST_QUESTIONS[tI].o.map((opt, i) => {
            const selected = tA[tI] === i + 1;
            return (
              <div key={i} className="press-card" onClick={() => { const n = [...tA]; n[tI] = i + 1; setTA(n); }} style={{
                padding: `${SP.md + 2}px ${SP.lg}px`,
                borderRadius: RAD.lg,
                display: "flex", alignItems: "center", gap: SP.md,
                cursor: "pointer",
                background: selected ? `${T.accent}1A` : `rgba(${T.ar},.05)`,
                border: `1.5px solid ${selected ? T.accent : `rgba(${T.ar},.12)`}`,
                boxShadow: selected ? `0 0 16px ${T.accent}22, inset 0 1px 0 rgba(255,255,255,.06)` : "none",
                transition: "all .2s ease",
              }}>
                {/* Radio indicator */}
                <div style={{
                  width: 20, height: 20, borderRadius: RAD.full, flexShrink: 0,
                  border: `1.5px solid ${selected ? T.accent : `rgba(${T.ar},.3)`}`,
                  background: selected ? T.accent : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all .2s ease",
                }}>
                  {selected && <div style={{ width: 7, height: 7, borderRadius: RAD.full, background: "#fff" }} />}
                </div>
                <div style={{ ...body(15), color: selected ? tx("var(--txt)", 0.95) : tx("var(--txt)", 0.78), lineHeight: 1.4, flex: 1, transition: "color .2s ease" }}>{opt}</div>
              </div>
            );
          })}
        </div>

        {/* Next button */}
        <div onClick={() => {
          if (!tA[tI]) return;
          if (tI < TEST_QUESTIONS.length - 1) { setTI(tI + 1); }
          else {
            const raw = tA.reduce((s, v) => s + (v || 1), 0);
            const sc = Math.round((raw / (TEST_QUESTIONS.length * 5)) * 100);
            setEScore(sc);
            logEnergyTest(sc);
            const months = MONTHS_SHORT[lang] || MONTHS_SHORT.ru;
            setEHist((h) => [...h, { score: sc, date: new Date().getDate() + " " + months[new Date().getMonth()] }].slice(-6));
            setShowT(false);
          }
        }} style={{
          width: "100%", padding: 15, borderRadius: RAD.lg + 4, textAlign: "center",
          background: tA[tI] ? T.accent + "22" : `rgba(255,255,255,.02)`,
          border: `1.5px solid ${tA[tI] ? T.accent + "88" : "rgba(255,255,255,.05)"}`,
          boxShadow: tA[tI] ? `0 0 20px ${T.accent}22` : "none",
          ...label(TYPE.sm), letterSpacing: ".2em",
          color: tA[tI] ? tx("var(--txt)", 0.9) : tx("var(--txt)", OP.disabled),
          cursor: tA[tI] ? "pointer" : "default",
          transition: "all .25s ease",
        }}>{tI === TEST_QUESTIONS.length - 1 ? L("see_result") : L("next_question")}</div>
      </div>
    </div>
  );

  const days = DAYS_SHORT[lang] || DAYS_SHORT.ru;
  const pd = pLog.slice(-7);

  return (
    <div style={{ minHeight: "100%", background: T.bg, paddingBottom: SP.page, position: "relative", transition: EASE.slow, overflowX: "hidden" }}>
      {/* Ambient Orbs — spread across full page height for smooth atmosphere */}
      <Orb style={{ top: -80, right: -80 }}                                          color={T.o1} opacity={0.22} w={300} h={300} />
      <Orb style={{ top: -80, left: -80 }}                                           color={T.o2} opacity={0.12} w={240} h={240} delay={2} />
      <Orb style={{ top: "28%", left: "50%", transform: "translateX(-50%)" }}        color={T.o1} opacity={0.07} w={380} h={380} delay={4} />
      <Orb style={{ top: "55%", right: -100 }}                                       color={T.o2} opacity={0.1}  w={260} h={260} delay={6} />
      <Orb style={{ bottom: 120, left: -60 }}                                        color={T.o1} opacity={0.09} w={220} h={220} delay={3} />
      <div style={{ padding: `50px ${SP.xl}px ${SP.xl - 2}px`, textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ ...label(TYPE.xs), letterSpacing: ".25em", color: T.accent, marginBottom: SP.sm }}>{L("inner_world")}</div>
        <div style={{ position: "relative", width: 80, height: 80, margin: `0 auto ${SP.md}px` }}>
          <div style={{ position: "absolute", inset: -12, borderRadius: "50%", background: `radial-gradient(circle, ${T.accent}22 0%, transparent 70%)`, pointerEvents: "none" }} />
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#280d18,#1a0812)", border: `2px solid ${T.accent}44`, boxShadow: `0 0 20px ${T.accent}22`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_SERIF, fontSize: 26, color: T.accent, position: "relative" }}>{(activity?.name || "F").slice(0,2).toUpperCase()}</div>
        </div>
        <div style={{ fontFamily: FONT_SERIF, fontSize: SP.xl, marginBottom: SP.xs, color: tx("var(--txt)", OP.primary) }}>{activity?.name || "Frisson"}</div>
        <div style={{ ...label(TYPE.xs), letterSpacing: ".22em", color: T.accent, marginBottom: 18 }}>{L("path_begin")}</div>
        <div onClick={() => setScreen("sub")} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: `9px ${SP.page}px`, borderRadius: RAD.lg + 2, background: T.dim, border: `1px solid ${T.border}`, cursor: "pointer", marginBottom: 18, ...label(TYPE.xs), letterSpacing: ".14em", color: tx("var(--txt)", 0.75) }}>{L("activate_sub")}</div>
      </div>

      {/* ─── Language Toggle ─── */}
      {setLang && (
        <div className="glass-card" style={{ ...section(SP.md), padding: `${SP.md}px ${SP.page}px`, background: `rgba(${T.ar},.05)`, border: `1px solid rgba(${T.ar},.12)`, borderRadius: RAD.lg, backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: SP.md, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: `radial-gradient(circle, ${T.accent}11 0%, transparent 70%)`, pointerEvents: "none" }} />
          <div style={{ ...label(TYPE.xs), letterSpacing: ".22em", color: tx("var(--txt)", OP.tertiary) }}>{L("language")}</div>
          <div style={{ display: "flex", gap: SP.xs, background: `rgba(${T.ar},.05)`, border: `1px solid rgba(${T.ar},.12)`, borderRadius: RAD.lg, padding: 3 }}>
            {[["ru", "Русский"], ["en", "English"]].map(([code, name]) => (
              <div key={code} className="press-card" onClick={() => setLang(code)} style={{ padding: `${SP.xs}px ${SP.md}px`, borderRadius: RAD.md, cursor: "pointer", background: lang === code ? T.accent + "24" : "transparent", border: `1px solid ${lang === code ? T.accent + "55" : "transparent"}`, ...label(TYPE.xs), letterSpacing: ".12em", color: lang === code ? T.accent : tx("var(--txt)", OP.secondary), transition: EASE.normal }}>{name}</div>
            ))}
          </div>
        </div>
      )}

      <div className="glass-card" style={{ ...section(18), background: `rgba(${T.ar},.05)`, border: `1px solid rgba(${T.ar},.12)`, borderRadius: RAD.lg, overflow: "hidden", transition: EASE.slow, position: "relative" }}>
        {eScore === null ? (
          <div style={{ padding: SP.xl - 2, textAlign: "center" }}>
            <div style={{ ...body(18), color: tx("var(--txt)", 0.9), marginBottom: SP.sm, lineHeight: LH.tight + 0.2 }}>{L("measure_energy")}</div>
            <div style={{ ...label(TYPE.sm), color: tx("var(--txt)", OP.tertiary), lineHeight: LH.loose, marginBottom: 18 }}>{L("test_meta")}</div>
            <div onClick={() => { setShowT(true); setTI(0); setTA([]); }} style={{ display: "inline-block", padding: `${SP.md}px 30px`, borderRadius: RAD.md, background: T.dim, border: `1px solid ${T.border}`, ...label(TYPE.sm), letterSpacing: ".2em", color: tx("var(--txt)", 0.85), cursor: "pointer" }}>{L("take_test")}</div>
          </div>
        ) : (
          <div>
            <div style={{ padding: `${SP.lg}px ${SP.page}px`, display: "flex", alignItems: "center", gap: SP.lg }}>
              <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
                <svg width="72" height="72" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="36" cy="36" r="32" fill="none" stroke={`rgba(255,255,255,${OP.bgSubtle})`} strokeWidth="5" />
                  <circle cx="36" cy="36" r="32" fill="none" stroke={T.accent} strokeWidth="5" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ - (circ * eScore / 100)} style={{ transition: "stroke-dashoffset 1.4s ease", filter: `drop-shadow(0 0 6px ${T.accent}55)` }} />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ ...heading(TYPE.xl), lineHeight: 1, color: tx("var(--txt)", OP.primary) }}>{eScore}</div>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ ...label(TYPE.xs), color: tx("var(--txt)", OP.tertiary), marginBottom: SP.xs }}>{L("psych_energy")}</div>
                <div style={{ ...heading(TYPE.lg), color: tx("var(--txt)", OP.primary) }}>{eScore} {L("of")} 100</div>
                <div style={{ ...body(TYPE.base), color: T.accent, marginTop: SP.xs }}>{lv.l}</div>
              </div>
            </div>
            <div style={{ padding: `0 ${SP.page}px ${SP.md}px` }}>
              <div onClick={() => { setShowT(true); setTI(0); setTA([]); }} style={{ textAlign: "center", ...label(TYPE.xs), color: T.accent, cursor: "pointer" }}>{L("retake_test")}</div>
            </div>
          </div>
        )}
      </div>

      {/* Psychological Capital Tracker */}
      <PsycapTracker T={T} setScreen={setScreen} goToScenario={goToScenario} lang={lang} />

      <div className="glass-card" style={{ ...section(18), padding: SP.page, background: `rgba(${T.ar},.05)`, border: `1px solid rgba(${T.ar},.12)`, borderRadius: RAD.lg, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: `radial-gradient(circle, ${T.accent}11 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ ...label(TYPE.xs), letterSpacing: ".22em", color: tx("var(--txt)", OP.tertiary), marginBottom: SP.xs }}>{L("energy_chart")}</div>
        <div style={{ ...body(18), color: tx("var(--txt)", 0.9), marginBottom: SP.lg }}>{L("growth_dynamics")}</div>
        {eHist.length < 1 ? <div style={{ padding: `18px 0`, textAlign: "center", ...body(TYPE.base), color: tx("var(--txt)", 0.3) }}>{L("empty_chart_hint")}</div> : (() => {
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
              {pts.map((p, i) => <g key={i}><circle cx={p.x} cy={p.y} r={i === pts.length - 1 ? 5 : 3} fill={i === pts.length - 1 ? T.accent : `${T.accent}88`} /><text x={p.x} y={H - 2} textAnchor="middle" fill={tx("var(--txt)", 0.3)} fontSize={SP.sm} fontFamily={FONT_SANS}>{sdates[i]}</text><text x={p.x} y={p.y - 8} textAnchor="middle" fill={i === pts.length - 1 ? tx("var(--txt)", 0.85) : tx("var(--txt)", 0.45)} fontSize={9} fontFamily={FONT_SANS}>{safe[i]}</text></g>)}
            </svg>
          );
        })()}
      </div>

      <div className="glass-card" style={{ ...section(18), padding: SP.page, background: `rgba(${T.ar},.05)`, border: `1px solid rgba(${T.ar},.12)`, borderRadius: RAD.lg, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: `radial-gradient(circle, ${T.accent}11 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ ...label(TYPE.xs), letterSpacing: ".22em", color: tx("var(--txt)", OP.tertiary), marginBottom: SP.xs }}>{L("practices")}</div>
        <div style={{ ...body(18), color: tx("var(--txt)", 0.9), marginBottom: SP.lg }}>{L("weekly_activity")}</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 60 }}>
          {days.map((d, i) => { const v = pd[i] || 0; const h = Math.max(4, v * 20); return (<div key={d} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: SP.xs }}><div style={{ width: "100%", borderRadius: "4px 4px 0 0", height: h, transition: "height .8s ease", background: v > 0 ? T.accent : `rgba(255,255,255,${OP.bgSubtle})`, boxShadow: v > 0 ? `0 0 6px ${T.accent}44` : "none" }} /><div style={{ fontSize: SP.sm, color: tx("var(--txt)", 0.3), fontFamily: FONT_SANS }}>{d}</div></div>); })}
        </div>
      </div>

      {(() => {
        const totalMeds = activity?.totalMeds || 0;
        const totalMinutes = activity?.totalMinutes || 0;
        const avgMin = totalMeds > 0 ? Math.round(totalMinutes / totalMeds) : 0;
        const stats = [
          [`${totalMeds}`, L("stat_meds")],
          [`${totalMinutes}`, L("stat_minutes")],
          [`${activity?.streak || 0}`, L("stat_streak")],
          [avgMin > 0 ? `${avgMin}` : "—", lang === "ru" ? "ср. минут" : "avg min"],
        ];
        return (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, ...section(18) }}>
            {stats.map((pr, i) => (
              <div key={i} className="glass-card" style={{ padding: `${SP.lg}px ${SP.base}px`, background: `rgba(${T.ar},.05)`, border: `1px solid rgba(${T.ar},.12)`, borderRadius: RAD.lg, textAlign: "center", boxShadow: `inset 0 1px 0 rgba(255,255,255,.06)`, position: "relative", overflow: "hidden" }}>
                <div style={{ ...heading(SP.xxl), lineHeight: 1, marginBottom: SP.xs, color: tx("var(--txt)", OP.primary) }}>{pr[0]}</div>
                <div style={{ ...label(TYPE.xs), letterSpacing: ".14em", color: tx("var(--txt)", OP.tertiary) }}>{pr[1]}</div>
              </div>
            ))}
          </div>
        );
      })()}

      {/* Smart insights */}
      {(() => {
        const totalMeds = activity?.totalMeds || 0;
        const streak = activity?.streak || 0;
        const insights = [];
        if (eScore !== null) {
          if (eScore >= 75) insights.push({ icon: "✨", text: lang === "ru" ? "Ресурс высокий — отличное время для новых решений и практик на рост." : "Resource is high — great time for new decisions and growth practices." });
          else if (eScore >= 50) insights.push({ icon: "🌿", text: lang === "ru" ? "Ресурс в среднем диапазоне — позаботься о себе сегодня, выбери медитацию на наполнение." : "Resource is mid-range — take care of yourself today, choose a filling meditation." });
          else insights.push({ icon: "🌙", text: lang === "ru" ? "Ресурс снижен — это сигнал для отдыха и мягкой практики. Ты справишься." : "Resource is low — this is a signal to rest and gentle practice. You've got this." });
        }
        if (streak >= 7) insights.push({ icon: "🔥", text: lang === "ru" ? `${streak} дней подряд — это уже привычка. Продолжай в том же духе!` : `${streak} days in a row — that's already a habit. Keep it up!` });
        else if (streak >= 3) insights.push({ icon: "⚡", text: lang === "ru" ? `${streak} дня практики подряд — ты набираешь темп!` : `${streak} days of practice in a row — you're picking up momentum!` });
        if (totalMeds >= 10) insights.push({ icon: "🎯", text: lang === "ru" ? `${totalMeds} медитаций завершено — глубокая работа с собой.` : `${totalMeds} meditations completed — deep inner work.` });
        if (insights.length === 0) return null;
        return (
          <div style={{ ...section(SP.base) }}>
            {insights.map((ins, i) => (
              <div key={i} style={{ display: "flex", gap: SP.md, padding: `${SP.md}px ${SP.page}px`, background: `rgba(${T.ar},.04)`, border: `1px solid rgba(${T.ar},.09)`, borderRadius: RAD.lg, marginBottom: SP.sm }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{ins.icon}</span>
                <div style={{ ...body(TYPE.base), color: tx("var(--txt)", 0.72), lineHeight: 1.6 }}>{ins.text}</div>
              </div>
            ))}
          </div>
        );
      })()}

      {/* Achievements */}
      {(() => {
        const earned = activity?.achievements || [];
        return (
          <div className="glass-card" style={{ ...section(SP.base), padding: `${SP.lg}px 18px`, background: `rgba(${T.ar},.05)`, border: `1px solid rgba(${T.ar},.12)`, borderRadius: RAD.lg, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: `radial-gradient(circle, ${T.accent}11 0%, transparent 70%)`, pointerEvents: "none" }} />
            <div style={{ ...label(TYPE.xs), letterSpacing: ".22em", color: tx("var(--txt)", OP.tertiary), marginBottom: TYPE.xs }}>{L("achievements")} · {earned.length} {L("of")} {ACHIEVEMENTS.length}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: SP.sm }}>
              {ACHIEVEMENTS.map((a) => {
                const done = earned.includes(a.id);
                return (
                  <div key={a.id} className="press-card" style={{ padding: `${SP.sm}px ${SP.md}px`, borderRadius: SP.md, background: done ? `${T.accent}18` : `rgba(${T.ar},.03)`, border: `1px solid ${done ? T.accent + "44" : `rgba(${T.ar},.08)`}`, boxShadow: done ? `0 0 8px ${T.accent}18` : "none", cursor: "pointer" }}>
                    <div style={{ fontFamily: FONT_SERIF, fontSize: TYPE.sm, color: done ? T.accent : tx("var(--txt)", 0.2) }}>{a.label}</div>
                    <div style={{ fontFamily: FONT_SANS, fontSize: SP.sm, color: done ? tx("var(--txt)", OP.secondary) : tx("var(--txt)", 0.12) }}>{a.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      <div style={{ margin: `${SP.sm}px ${SP.xxl}px 0`, padding: `18px 0`, borderTop: `1px solid ${tx("var(--txt)", OP.bgSubtle)}`, textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ ...body(TYPE.base), fontStyle: "italic", lineHeight: LH.loose, color: tx("var(--txt)", 0.45) }}>{L("oliver_quote")}</div>
        <div style={{ ...label(TYPE.xs), letterSpacing: ".15em", color: tx("var(--txt)", 0.25), marginTop: 6 }}>Mary Oliver</div>
      </div>

      <div style={{ textAlign: "center", paddingBottom: SP.xl, position: "relative", zIndex: 1 }}>
        <span style={{ ...label(TYPE.xs), color: tx("var(--txt)", OP.disabled), letterSpacing: ".1em" }}>v{VERSION}</span>
      </div>
    </div>
  );
}
