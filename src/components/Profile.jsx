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
    <div style={{ minHeight: "100%", background: T.bg, padding: `50px ${SP.xl}px 40px`, transition: EASE.slow }}>
      <div onClick={() => setShowT(false)} style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer", marginBottom: SP.xl }}>
        <span style={{ fontSize: TYPE.base, color: tx("var(--txt)", OP.tertiary) }}>←</span>
        <span style={{ ...label(TYPE.sm), color: tx("var(--txt)", OP.tertiary) }}>{L("cancel")}</span>
      </div>
      <div style={{ height: 2, background: `rgba(255,255,255,${OP.bgSubtle})`, borderRadius: 2, overflow: "hidden", marginBottom: SP.xl }}>
        <div style={{ height: "100%", background: T.accent, width: `${(tI / TEST_QUESTIONS.length) * 100}%`, transition: "width .5s ease", borderRadius: 2 }} />
      </div>
      <div style={{ ...label(TYPE.xs), letterSpacing: ".22em", color: tx("var(--txt)", OP.tertiary), textAlign: "center", marginBottom: SP.md }}>{L("question_of", tI + 1, TEST_QUESTIONS.length)}</div>
      <div style={{ ...heading(TYPE.xl), color: tx("var(--txt)", OP.primary), textAlign: "center", marginBottom: SP.xxl, lineHeight: 1.55 }}>{TEST_QUESTIONS[tI].q}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: SP.sm, marginBottom: SP.xl }}>
        {TEST_QUESTIONS[tI].o.map((opt, i) => (
          <div key={i} onClick={() => { const n = [...tA]; n[tI] = i + 1; setTA(n); }} style={{ padding: `13px ${SP.lg + 1}px`, borderRadius: 13, display: "flex", alignItems: "center", gap: 13, cursor: "pointer", background: tA[tI] === i + 1 ? T.dim : T.card, border: `1px solid ${tA[tI] === i + 1 ? T.accent : T.border}`, transition: EASE.normal }}>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 20, color: T.accent, width: TYPE.xl, textAlign: "center", flexShrink: 0 }}>{i + 1}</div>
            <div style={{ ...body(14.5), color: tx("var(--txt)", 0.85) }}>{opt}</div>
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
          logEnergyTest(sc);
          const months = MONTHS_SHORT[lang] || MONTHS_SHORT.ru;
          setEHist((h) => [...h, { score: sc, date: new Date().getDate() + " " + months[new Date().getMonth()] }].slice(-6));
          setShowT(false);
        }
      }} style={{ width: "100%", padding: 13, borderRadius: RAD.lg + 6, textAlign: "center", background: tA[tI] ? T.dim : `rgba(255,255,255,.02)`, border: `1px solid ${tA[tI] ? T.border : "rgba(255,255,255,.05)"}`, ...label(TYPE.sm), letterSpacing: ".22em", color: tA[tI] ? tx("var(--txt)", 0.8) : tx("var(--txt)", OP.disabled), cursor: tA[tI] ? "pointer" : "default" }}>{tI === TEST_QUESTIONS.length - 1 ? L("see_result") : L("next_question")}</div>
    </div>
  );

  const days = DAYS_SHORT[lang] || DAYS_SHORT.ru;
  const pd = pLog.slice(-7);

  return (
    <div style={{ minHeight: "100%", background: T.bg, paddingBottom: SP.page, position: "relative", transition: EASE.slow }}>
      <Orb style={{ top: -50, left: "50%", transform: "translateX(-50%)" }} color={T.o1} opacity={0.15} w={260} h={260} />
      <div style={{ padding: `50px ${SP.xl}px ${SP.xl - 2}px`, textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ ...label(TYPE.xs), letterSpacing: ".25em", color: T.accent, marginBottom: SP.sm }}>{L("inner_world")}</div>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#280d18,#1a0812)", border: `1.5px solid ${T.border}`, margin: `0 auto ${SP.md}px`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_SERIF, fontSize: 26, color: T.accent }}>{(activity?.name || "F").slice(0,2).toUpperCase()}</div>
        <div style={{ fontFamily: FONT_SERIF, fontSize: SP.xl, marginBottom: SP.xs, color: tx("var(--txt)", OP.primary) }}>{activity?.name || "Frisson"}</div>
        <div style={{ ...label(TYPE.xs), letterSpacing: ".22em", color: T.accent, marginBottom: 18 }}>{L("path_begin")}</div>
        <div onClick={() => setScreen("sub")} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: `9px ${SP.page}px`, borderRadius: RAD.lg + 2, background: T.dim, border: `1px solid ${T.border}`, cursor: "pointer", marginBottom: 18, ...label(TYPE.xs), letterSpacing: ".14em", color: tx("var(--txt)", 0.75) }}>{L("activate_sub")}</div>
      </div>

      {/* ─── Language Toggle ─── */}
      {setLang && (
        <div style={{ ...section(SP.md), padding: `${SP.md}px ${SP.page}px`, background: T.card, border: `1px solid ${T.border}`, borderRadius: RAD.lg, display: "flex", alignItems: "center", justifyContent: "space-between", gap: SP.md }}>
          <div style={{ ...label(TYPE.xs), letterSpacing: ".22em", color: tx("var(--txt)", OP.tertiary) }}>{L("language")}</div>
          <div style={{ display: "flex", gap: SP.xs, background: T.dim, border: `1px solid ${T.border}`, borderRadius: RAD.md, padding: 3 }}>
            {[["ru", "Русский"], ["en", "English"]].map(([code, name]) => (
              <div key={code} onClick={() => setLang(code)} style={{ padding: `${SP.xs}px ${SP.md}px`, borderRadius: RAD.sm, cursor: "pointer", background: lang === code ? T.accent + "24" : "transparent", border: `1px solid ${lang === code ? T.accent + "55" : "transparent"}`, ...label(TYPE.xs), letterSpacing: ".12em", color: lang === code ? T.accent : tx("var(--txt)", OP.secondary), transition: EASE.normal }}>{name}</div>
            ))}
          </div>
        </div>
      )}

      <div style={{ ...section(18), background: T.dim, border: `1px solid ${T.border}`, borderRadius: RAD.lg, overflow: "hidden", transition: EASE.slow }}>
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
                  <circle cx="36" cy="36" r="32" fill="none" stroke={T.accent} strokeWidth="5" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ - (circ * eScore / 100)} style={{ transition: "stroke-dashoffset 1.4s ease" }} />
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

      <div style={{ ...section(18), padding: SP.page, background: T.card, border: `1px solid ${T.border}`, borderRadius: RAD.lg }}>
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

      <div style={{ ...section(18), padding: SP.page, background: T.card, border: `1px solid ${T.border}`, borderRadius: RAD.lg }}>
        <div style={{ ...label(TYPE.xs), letterSpacing: ".22em", color: tx("var(--txt)", OP.tertiary), marginBottom: SP.xs }}>{L("practices")}</div>
        <div style={{ ...body(18), color: tx("var(--txt)", 0.9), marginBottom: SP.lg }}>{L("weekly_activity")}</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 60 }}>
          {days.map((d, i) => { const v = pd[i] || 0; const h = Math.max(4, v * 20); return (<div key={d} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: SP.xs }}><div style={{ width: "100%", borderRadius: "3px 3px 0 0", height: h, transition: "height .8s ease", background: v > 0 ? T.accent : `rgba(255,255,255,${OP.bgSubtle})` }} /><div style={{ fontSize: SP.sm, color: tx("var(--txt)", 0.3), fontFamily: FONT_SANS }}>{d}</div></div>); })}
        </div>
      </div>

      {/* Psychological Capital Tracker */}
      <PsycapTracker T={T} setScreen={setScreen} goToScenario={goToScenario} lang={lang} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, ...section(18) }}>
        {[[`${activity?.totalMeds || 0}`, L("stat_meds")], [`${activity?.totalMinutes || 0}`, L("stat_minutes")], [`🔥 ${activity?.streak || 0}`, L("stat_streak")], [`${gems} ⟡`, L("stat_gems")]].map((pr, i) => (
          <div key={i} style={{ padding: `${SP.lg}px ${SP.base}px`, background: T.card, border: `1px solid ${T.border}`, borderRadius: SP.lg, textAlign: "center" }}>
            <div style={{ ...heading(SP.xxl), lineHeight: 1, marginBottom: SP.xs, color: tx("var(--txt)", OP.primary) }}>{pr[0]}</div>
            <div style={{ ...label(TYPE.xs), letterSpacing: ".14em", color: tx("var(--txt)", OP.tertiary) }}>{pr[1]}</div>
          </div>
        ))}
      </div>

      {/* Energy insights */}
      {eScore !== null && eScoreHistory && eScoreHistory.length >= 2 && (() => {
        const prev = eScoreHistory[eScoreHistory.length - 2]?.score;
        const diff = eScore - prev;
        const trend = diff > 0 ? "↑" : diff < 0 ? "↓" : "→";
        const trendColor = diff > 0 ? "#4FAE92" : diff < 0 ? "#D4453C" : T.accent;
        const msg = diff > 5 ? L("great_growth") : diff > 0 ? L("growing") : diff < -5 ? L("resource_dropped") : diff < 0 ? L("slight_drop") : L("stable_level");
        return (
          <div style={{ ...section(SP.base), padding: `${SP.base}px 18px`, background: `${trendColor}12`, border: `1px solid ${trendColor}30`, borderRadius: SP.lg }}>
            <div style={{ display: "flex", alignItems: "center", gap: SP.sm, marginBottom: 6 }}>
              <span style={{ fontSize: 20, color: trendColor }}>{trend}</span>
              <span style={{ fontFamily: FONT_SERIF, fontSize: 15, color: trendColor }}>{diff > 0 ? "+" : ""}{diff} {L("points")}</span>
              <span style={{ ...label(TYPE.xs), color: tx("var(--txt)", OP.tertiary) }}>{L("points_since_last")}</span>
            </div>
            <div style={{ ...body(13), color: tx("var(--txt)", 0.7) }}>{msg}</div>
          </div>
        );
      })()}

      {/* Achievements */}
      {(() => {
        const earned = activity?.achievements || [];
        return (
          <div style={{ ...section(SP.base), padding: `${SP.lg}px 18px`, background: T.card, border: `1px solid ${T.border}`, borderRadius: 18 }}>
            <div style={{ ...label(TYPE.xs), letterSpacing: ".22em", color: tx("var(--txt)", OP.tertiary), marginBottom: TYPE.xs }}>{L("achievements")} · {earned.length} {L("of")} {ACHIEVEMENTS.length}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: SP.sm }}>
              {ACHIEVEMENTS.map((a) => {
                const done = earned.includes(a.id);
                return (
                  <div key={a.id} style={{ padding: `${SP.sm}px ${SP.md}px`, borderRadius: SP.md, background: done ? `${T.accent}18` : tx("var(--txt)", 0.03), border: `1px solid ${done ? T.accent + "33" : tx("var(--txt)", 0.08)}` }}>
                    <div style={{ fontFamily: FONT_SERIF, fontSize: TYPE.sm, color: done ? T.accent : tx("var(--txt)", 0.25) }}>{a.label}</div>
                    <div style={{ fontFamily: FONT_SANS, fontSize: SP.sm, color: done ? tx("var(--txt)", OP.secondary) : tx("var(--txt)", 0.15) }}>{a.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      <div style={{ ...section(SP.base), padding: SP.page, background: T.dim, border: `1px solid ${T.border}`, borderRadius: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: SP.base }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: "rgba(125,23,54,.35)", border: "1px solid rgba(125,23,54,.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🎓</div>
          <div>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 15, color: tx("var(--txt)", 0.9), marginBottom: 2 }}>{L("author_name")}</div>
            <div style={{ ...label(TYPE.xs), letterSpacing: ".12em", color: T.accent }}>{L("author_role")}</div>
          </div>
        </div>
        <div style={{ ...body(TYPE.base), lineHeight: LH.loose, color: tx("var(--txt)", 0.7), marginBottom: SP.md }}>{L("author_bio")}</div>
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          {[L("author_tag1"), L("author_tag2"), L("author_tag3")].map((t) => (
            <div key={t} style={{ padding: `${SP.xs}px ${TYPE.xs}px`, background: "rgba(125,23,54,.28)", border: "1px solid rgba(125,23,54,.35)", borderRadius: RAD.lg, ...label(TYPE.xs), letterSpacing: ".1em", color: tx("var(--txt)", 0.6) }}>{t}</div>
          ))}
        </div>
      </div>

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
