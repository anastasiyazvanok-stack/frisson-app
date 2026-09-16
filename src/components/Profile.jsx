import { useState } from "react";
import { getEnergyLevel, themeLabel } from "../data/themes";
import { TYPE, SP, RAD, OP, LS, EASE, LH, FONT_SERIF, FONT_SANS, tx, label, body, heading, card as cardStyle, section } from "../utils/design";
import Orb from "./Orb";
import { LensMark } from "./Brand";
import { t as tr, MONTHS_SHORT, DAYS_SHORT } from "../utils/i18n";

import { VERSION } from "../App";

import { getAchievements, resetMedStats } from "../data/activity";
import { logEnergyTest, getOverallScore, getPsycap } from "../data/psycap";
import { authHeader } from "../lib/supabase";
import PsycapTracker from "./PsycapTracker";
import EnergyTest from "./EnergyTest";

export default function Profile({ setScreen, theme, eScore, setEScore, eHist, setEHist, pLog, gems = 0, THEMES, activity, eScoreHistory, goToScenario, lang = "ru", setLang, onSignOut, onAdmin }) {
  const T = THEMES[theme] || THEMES.full;
  const L = (k, ...a) => tr(lang, k, ...a);
  const [showT, setShowT] = useState(false);
  const [aiInsight, setAiInsight] = useState(null);
  const [aiInsightLoading, setAiInsightLoading] = useState(false);
  const [statsOverride, setStatsOverride] = useState(null);
  const [pcOpen, setPcOpen] = useState(false);
  const lv = eScore !== null ? getEnergyLevel(eScore, lang) : null;
  const circ = 2 * Math.PI * 16;
  const ACHIEVEMENTS = getAchievements(lang);

  const completeTest = (sc) => {
    setEScore(sc);
    logEnergyTest(sc);
    const months = MONTHS_SHORT[lang] || MONTHS_SHORT.ru;
    setEHist((h) => [...h, { score: sc, date: new Date().getDate() + " " + months[new Date().getMonth()] }].slice(-6));
    setShowT(false);
  };

  if (showT) return <EnergyTest T={T} lang={lang} onComplete={completeTest} onCancel={() => setShowT(false)} />;

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
        {setLang && (
          <div onClick={() => setLang(lang === "ru" ? "en" : "ru")} className="press-card" style={{
            position: "absolute", top: SP.lg, right: SP.page, zIndex: 2, cursor: "pointer",
            padding: "5px 11px", borderRadius: RAD.full,
            background: `rgba(${T.ar},.08)`, border: `1px solid rgba(${T.ar},.2)`,
            ...label(TYPE.xs - 1), letterSpacing: ".1em", color: T.accent,
          }}>{lang.toUpperCase()}</div>
        )}
        <div style={{ ...label(TYPE.xs), letterSpacing: ".25em", color: T.accent, marginBottom: SP.sm }}>{L("inner_world")}</div>
        <div style={{ position: "relative", width: 80, height: 80, margin: `0 auto ${SP.md}px` }}>
          <div style={{ position: "absolute", inset: -12, borderRadius: "50%", background: `radial-gradient(circle, ${T.accent}22 0%, transparent 70%)`, pointerEvents: "none" }} />
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#3B1533,#1D1015)", border: `2px solid ${T.accent}44`, boxShadow: `0 0 20px ${T.accent}22`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_SERIF, fontSize: 26, color: T.accent, position: "relative" }}>
            {activity?.name ? activity.name.slice(0, 2).toUpperCase() : <LensMark size={30} color={T.accent} />}
          </div>
        </div>
        <div style={{ fontFamily: FONT_SERIF, fontSize: SP.xl, marginBottom: SP.xs, color: tx("var(--txt)", OP.primary) }}>{activity?.name || "NECTAR"}</div>
        <div style={{ ...label(TYPE.xs), letterSpacing: ".22em", color: T.accent, marginBottom: 18 }}>{L("path_begin")}</div>
        <div onClick={() => setScreen("sub")} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: `9px ${SP.page}px`, borderRadius: RAD.lg + 2, background: T.dim, border: `1px solid ${T.border}`, cursor: "pointer", marginBottom: 18, ...label(TYPE.xs), letterSpacing: ".14em", color: tx("var(--txt)", 0.75) }}>{L("activate_sub")}</div>
      </div>

      {/* Energy test — compact button, not a full card: tap anywhere to take/retake it */}
      <div className="glass-card press-card" onClick={() => setShowT(true)} style={{ ...section(18), background: `rgba(${T.ar},.05)`, border: `1px solid rgba(${T.ar},.12)`, borderRadius: RAD.lg, padding: `${SP.md}px ${SP.lg}px`, display: "flex", alignItems: "center", gap: SP.md, cursor: "pointer", transition: EASE.slow }}>
        <div style={{ position: "relative", width: 38, height: 38, flexShrink: 0 }}>
          {eScore !== null ? (
            <>
              <svg width="38" height="38" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="19" cy="19" r="16" fill="none" stroke={`rgba(255,255,255,${OP.bgSubtle})`} strokeWidth="3.5" />
                <circle cx="19" cy="19" r="16" fill="none" stroke={T.accent} strokeWidth="3.5" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ - (circ * eScore / 100)} style={{ transition: "stroke-dashoffset 1.4s ease" }} />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_SANS, fontSize: TYPE.xs, fontWeight: 600, color: tx("var(--txt)", OP.primary) }}>{eScore}</div>
            </>
          ) : (
            <div style={{ width: "100%", height: "100%", borderRadius: "50%", border: `1.5px dashed rgba(${T.ar},.4)` }} />
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ ...label(TYPE.xs), color: tx("var(--txt)", OP.tertiary), marginBottom: 2 }}>{L("psych_energy")}</div>
          <div style={{ ...body(TYPE.sm + 1), color: eScore !== null ? T.accent : tx("var(--txt)", 0.85), overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{eScore !== null ? lv.l : L("test_meta")}</div>
        </div>
        <div style={{ ...label(TYPE.xs), color: T.accent, whiteSpace: "nowrap", flexShrink: 0 }}>{eScore !== null ? L("retake_test") : L("take_test")}</div>
      </div>

      {/* Psychological Capital Tracker — collapsed by default, arrow expands it */}
      <div className="glass-card" style={{ ...section(pcOpen ? SP.lg : 18), background: `rgba(${T.ar},.05)`, border: `1px solid rgba(${T.ar},.12)`, borderRadius: RAD.lg, overflow: "hidden", transition: EASE.slow }}>
        <div className="press-card" onClick={() => setPcOpen((v) => !v)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: `${SP.md}px ${SP.lg}px`, cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: SP.sm }}>
            <div style={{ ...label(TYPE.xs - 1), color: `rgba(var(--txt),${OP.tertiary + 0.08})`, letterSpacing: ".22em" }}>{L("pc_header")}</div>
            <div style={{ ...body(TYPE.sm), color: T.accent }}>{getOverallScore()} {L("of")} 100</div>
          </div>
          <span style={{ fontSize: TYPE.base, color: T.accent, transform: pcOpen ? "rotate(180deg)" : "none", transition: EASE.normal, display: "inline-block" }}>⌄</span>
        </div>
        {pcOpen && (
          <div style={{ padding: `0 ${SP.lg}px ${SP.lg}px` }}>
            <PsycapTracker T={T} setScreen={setScreen} goToScenario={goToScenario} lang={lang} embedded />
          </div>
        )}
      </div>

      {/* AI Coach + Weekly Insight */}
      <div style={{ ...section(SP.base), display: "flex", flexDirection: "column", gap: SP.sm }}>
        {/* Go to AI Coach */}
        <div onClick={() => setScreen("coach")} className="press-card" style={{ padding: `${SP.lg}px ${SP.page}px`, background: "linear-gradient(135deg, rgba(142,118,184,.12), rgba(227,154,60,.08))", border: "1px solid rgba(142,118,184,.25)", borderRadius: RAD.lg, display: "flex", alignItems: "center", gap: SP.md, cursor: "pointer", position: "relative", overflow: "hidden" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, rgba(142,118,184,.4), rgba(227,154,60,.3))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 18 }}>✦</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONT_SERIF, fontSize: TYPE.base + 1, color: tx("var(--txt)", 0.92), marginBottom: 2 }}>{lang === "ru" ? "Поговорить с Анастасией" : "Talk to Anastasia"}</div>
            <div style={{ ...label(TYPE.xs), color: "rgba(142,118,184,.7)", letterSpacing: ".15em" }}>{lang === "ru" ? "ИИ-коуч · NECTAR" : "AI coach · NECTAR"}</div>
          </div>
          <div style={{ fontSize: 18, color: "rgba(142,118,184,.5)" }}>→</div>
        </div>

        {/* Weekly AI Insight */}
        <div className="press-card" style={{ padding: `${SP.lg}px ${SP.page}px`, background: `rgba(${T.ar},.05)`, border: `1px solid rgba(${T.ar},.12)`, borderRadius: RAD.lg, position: "relative", overflow: "hidden" }}>
          {aiInsight ? (
            <div>
              <div style={{ ...label(TYPE.xs), letterSpacing: ".2em", color: T.accent, marginBottom: SP.sm }}>{lang === "ru" ? "✦ ИНСАЙТ НЕДЕЛИ" : "✦ WEEKLY INSIGHT"}</div>
              <div style={{ fontFamily: FONT_SANS, fontSize: TYPE.sm + 1, fontWeight: 300, lineHeight: 1.7, color: tx("var(--txt)", 0.82) }}>{aiInsight}</div>
              <div onClick={() => setAiInsight(null)} style={{ ...label(TYPE.xs), color: tx("var(--txt)", 0.3), marginTop: SP.md, cursor: "pointer" }}>{lang === "ru" ? "Обновить" : "Refresh"}</div>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: SP.md }}>
              <div style={{ flex: 1 }}>
                <div style={{ ...label(TYPE.xs), letterSpacing: ".2em", color: tx("var(--txt)", OP.tertiary), marginBottom: SP.xs }}>{lang === "ru" ? "ИНСАЙТ НЕДЕЛИ" : "WEEKLY INSIGHT"}</div>
                <div style={{ fontFamily: FONT_SANS, fontSize: TYPE.sm + 1, fontWeight: 300, color: tx("var(--txt)", 0.65), lineHeight: 1.5 }}>{lang === "ru" ? "Персональный анализ твоего прогресса от ИИ" : "AI-powered personal progress analysis"}</div>
              </div>
              <div onClick={async () => {
                setAiInsightLoading(true);
                try {
                  const psycap = getPsycap();
                  const res = await fetch("/api/ai-insights", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", ...(await authHeader()) },
                    body: JSON.stringify({
                      capital: { axes: psycap?.axes, overall: getOverallScore() },
                      activity: { totalMeds: activity?.totalMeds, totalMinutes: activity?.totalMedMinutes ?? activity?.totalMinutes, totalMedMinutes: activity?.totalMedMinutes, streak: activity?.streak },
                      lang,
                    }),
                  });
                  if (res.ok) { const { insight } = await res.json(); setAiInsight(insight); }
                } catch {}
                setAiInsightLoading(false);
              }} style={{ width: 44, height: 44, borderRadius: "50%", background: aiInsightLoading ? `rgba(${T.ar},.08)` : T.accent + "22", border: `1px solid ${aiInsightLoading ? `rgba(${T.ar},.15)` : T.accent + "55"}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: aiInsightLoading ? "default" : "pointer", flexShrink: 0, fontSize: 20, transition: EASE.normal }}>
                {aiInsightLoading ? <div style={{ width: 14, height: 14, border: `2px solid ${T.accent}44`, borderTopColor: T.accent, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> : "✦"}
              </div>
            </div>
          )}
        </div>
      </div>

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
        const src = statsOverride || activity;
        const totalMeds = src?.totalMeds || 0;
        const totalMedMinutes = src?.totalMedMinutes || 0;
        const avgMin = totalMeds > 0 ? Math.round(totalMedMinutes / totalMeds) : 0;
        // Detect legacy data: average < 1 min/session with >3 sessions = inflated counter from before the fix
        const dataCorrupted = totalMeds > 3 && totalMedMinutes > 0 && avgMin < 1;
        const stats = [
          [`${totalMeds}`, L("stat_meds")],
          [`${totalMedMinutes}`, lang === "ru" ? "мин медитации" : "med minutes"],
          [`${src?.streak || 0}`, L("stat_streak")],
          [avgMin > 0 ? `${avgMin}` : "—", lang === "ru" ? "ср. минут" : "avg min"],
        ];
        return (
          <div style={{ ...section(18) }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
              {stats.map((pr, i) => (
                <div key={i} className="glass-card" style={{ padding: `${SP.lg}px ${SP.base}px`, background: `rgba(${T.ar},.05)`, border: `1px solid rgba(${T.ar},.12)`, borderRadius: RAD.lg, textAlign: "center", boxShadow: `inset 0 1px 0 rgba(255,255,255,.06)`, position: "relative", overflow: "hidden" }}>
                  <div style={{ ...heading(SP.xxl), lineHeight: 1, marginBottom: SP.xs, color: tx("var(--txt)", OP.primary) }}>{pr[0]}</div>
                  <div style={{ ...label(TYPE.xs), letterSpacing: ".14em", color: tx("var(--txt)", OP.tertiary) }}>{pr[1]}</div>
                </div>
              ))}
            </div>
            {dataCorrupted && (
              <div style={{ marginTop: 10, padding: `10px ${SP.md}px`, background: `rgba(${T.ar},.04)`, border: `1px solid rgba(${T.ar},.1)`, borderRadius: RAD.md, display: "flex", alignItems: "center", justifyContent: "space-between", gap: SP.md }}>
                <div style={{ ...body(TYPE.sm), color: tx("var(--txt)", 0.45), lineHeight: 1.4 }}>
                  {lang === "ru" ? "Данные счётчика медитаций неточны после обновления" : "Meditation counter data is inaccurate after the update"}
                </div>
                <div
                  onClick={() => { const d = resetMedStats(); setStatsOverride(d); }}
                  style={{ ...label(TYPE.xs), letterSpacing: ".1em", color: T.accent, cursor: "pointer", flexShrink: 0, padding: `4px 10px`, border: `1px solid ${T.accent}44`, borderRadius: RAD.sm }}
                >
                  {lang === "ru" ? "Сбросить" : "Reset"}
                </div>
              </div>
            )}
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

      {(onAdmin || onSignOut) && (
        <div style={{ textAlign: "center", paddingBottom: SP.sm, paddingTop: SP.sm, position: "relative", zIndex: 1, display: "flex", justifyContent: "center", gap: SP.xl }}>
          {onAdmin && (
            <span onClick={onAdmin} style={{ fontFamily: FONT_SANS, fontSize: TYPE.xs + 1, color: tx("var(--txt)", 0.36), cursor: "pointer", textDecoration: "underline", letterSpacing: ".08em" }}>
              ⚙ Admin
            </span>
          )}
          {onSignOut && (
            <span onClick={onSignOut} style={{ fontFamily: FONT_SANS, fontSize: TYPE.xs + 1, color: tx("var(--txt)", 0.28), cursor: "pointer", textDecoration: "underline", letterSpacing: ".08em" }}>
              {lang === "ru" ? "Выйти из аккаунта" : "Sign out"}
            </span>
          )}
        </div>
      )}

      <div style={{ textAlign: "center", paddingBottom: SP.xl, position: "relative", zIndex: 1 }}>
        <span style={{ ...label(TYPE.xs), color: tx("var(--txt)", OP.disabled), letterSpacing: ".1em" }}>v{VERSION}</span>
      </div>
    </div>
  );
}
