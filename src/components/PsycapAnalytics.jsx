import { useState } from "react";
import { getPsycapStats } from "../data/psycap";
import { FONT_SERIF, FONT_SANS, TYPE, SP, RAD, OP, EASE, tx, label, body, heading } from "../utils/design";

export default function PsycapAnalytics({ T, setScreen, eScore, goToScenario }) {
  const stats = getPsycapStats();
  const [showHow, setShowHow] = useState(false);
  const { dims, avg, weeklyGrowth, strongest, weakest, recommendation, sessionsThisWeek, totalSessions, topPractices } = stats;
  const trendIcon = weeklyGrowth > 0 ? "↑" : weeklyGrowth < 0 ? "↓" : "→";
  const trendColor = weeklyGrowth > 0 ? "#7FA786" : weeklyGrowth < 0 ? "#C25A66" : `rgba(var(--txt),.4)`;

  return (
    <div style={{ margin: `0 ${SP.xl}px ${SP.lg + 2}px`, padding: `${SP.page}px ${SP.lg + 2}px`, background: T.card, border: `1px solid ${T.border}`, borderRadius: RAD.lg, position: "relative", zIndex: 1 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: SP.xs }}>
        <div style={{ ...label(TYPE.xs - 1), color: `rgba(var(--txt),${OP.tertiary + 0.08})`, letterSpacing: ".22em" }}>Психологический капитал</div>
        <div style={{ fontFamily: FONT_SANS, fontSize: TYPE.xs - 1, color: trendColor }}>{trendIcon} {weeklyGrowth > 0 ? "+" : ""}{weeklyGrowth} за неделю</div>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: SP.sm + 2, marginBottom: SP.xs }}>
        <div style={{ fontFamily: FONT_SERIF, fontSize: TYPE.xxl - 2, color: `rgba(var(--txt),${OP.primary})` }}>{avg}<span style={{ fontSize: TYPE.base, color: `rgba(var(--txt),${OP.tertiary + 0.08})` }}>/100</span></div>
        <div style={{ ...label(TYPE.xs - 1), color: `rgba(var(--txt),${OP.secondary - 0.1})`, letterSpacing: ".15em" }}>HEROF · средний</div>
      </div>
      <div onClick={() => setShowHow(!showHow)} style={{ fontFamily: FONT_SANS, fontSize: TYPE.xs, color: T.accent, cursor: "pointer", marginBottom: SP.md + 2 }}>
        {showHow ? "Скрыть ↑" : "Как это считается? ↓"}
      </div>

      {/* Explanation block */}
      {showHow && (
        <div style={{ padding: `${SP.md}px ${SP.md + 2}px`, background: `rgba(255,255,255,.03)`, border: `1px solid rgba(255,255,255,${OP.bgSubtle})`, borderRadius: RAD.sm + 4, marginBottom: SP.md + 2, ...body(TYPE.sm), lineHeight: 1.65, color: `rgba(var(--txt),.7)` }}>
          <div style={{ marginBottom: SP.sm }}>Каждая практика на орбите и запись в дневнике добавляют очки в одну или несколько из 5 областей:</div>
          <div style={{ fontSize: TYPE.sm - 1, color: `rgba(var(--txt),${OP.secondary})` }}>
            • <b>Сила</b> → Самоэффективность<br/>
            • <b>Тревога/Страх</b> → Стойкость<br/>
            • <b>Любовь</b> → Надежда + Оптимизм<br/>
            • <b>Изобилие</b> → Надежда + Оптимизм<br/>
            • <b>Женственность</b> → Женственность<br/>
            • <b>Психологический капитал</b> → все четыре HERO<br/>
            • <b>Намерения/Цели/Благодарность</b> → дневниковые записи тоже растят капитал
          </div>
        </div>
      )}

      {/* HEROF Bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: TYPE.sm - 1, marginBottom: SP.lg }}>
        {dims.map((d) => (
          <div key={d.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: SP.xs }}>
              <span style={{ ...body(TYPE.sm + 1), color: `rgba(var(--txt),.85)` }}>{d.label}</span>
              <span style={{ fontFamily: FONT_SANS, fontSize: TYPE.sm - 1, color: d.hex, fontWeight: 500 }}>{d.value}/100</span>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: `rgba(255,255,255,.05)`, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${d.value}%`, background: `linear-gradient(90deg, ${d.hex}66, ${d.hex})`, borderRadius: 3, transition: "width 1.2s ease", boxShadow: `0 0 8px ${d.hex}44` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Strength callout */}
      <div style={{ padding: `${SP.md}px ${SP.md + 2}px`, background: `${strongest.hex}10`, border: `1px solid ${strongest.hex}30`, borderRadius: RAD.sm + 4, marginBottom: SP.sm }}>
        <div style={{ ...label(TYPE.xs - 2), color: strongest.hex, letterSpacing: "2px", marginBottom: SP.xs }}>✦ Ваша сила</div>
        <div style={{ ...body(TYPE.sm + 1), color: `rgba(var(--txt),.85)`, lineHeight: 1.4 }}>{strongest.label} — ваша опора. {strongest.desc.toLowerCase()}.</div>
      </div>

      {/* Weakness + recommendation */}
      <div style={{ padding: `${SP.md}px ${SP.md + 2}px`, background: `${weakest.hex}10`, border: `1px solid ${weakest.hex}30`, borderRadius: RAD.sm + 4, marginBottom: SP.md + 2 }}>
        <div style={{ ...label(TYPE.xs - 2), color: weakest.hex, letterSpacing: "2px", marginBottom: SP.xs }}>↗ Что развивать</div>
        <div style={{ ...body(TYPE.sm + 1), color: `rgba(var(--txt),.85)`, lineHeight: 1.5, marginBottom: SP.sm }}>
          <b>{weakest.label}</b> — {recommendation.text}
        </div>
        <div onClick={() => goToScenario ? goToScenario(recommendation.scenario) : setScreen && setScreen("orbit")} style={{ display: "inline-block", padding: `6px ${SP.md}px`, borderRadius: SP.sm + 2, background: `${weakest.hex}22`, border: `1px solid ${weakest.hex}44`, ...label(TYPE.xs - 1), letterSpacing: ".1em", color: weakest.hex, cursor: "pointer" }}>
          Открыть «{recommendation.label}» →
        </div>
      </div>

      {/* Practice breakdown */}
      {topPractices.length > 0 && (
        <div style={{ padding: `${SP.md}px ${SP.md + 2}px`, background: "rgba(255,255,255,.03)", border: `1px solid rgba(255,255,255,${OP.bgSubtle})`, borderRadius: RAD.sm + 4, marginBottom: SP.md + 2 }}>
          <div style={{ ...label(TYPE.xs - 2), color: `rgba(var(--txt),${OP.tertiary + 0.08})`, letterSpacing: "2px", marginBottom: SP.sm }}>Топ практик</div>
          {topPractices.map((p) => (
            <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: SP.xs, ...body(TYPE.sm), color: `rgba(var(--txt),.75)` }}>
              <span>{p.name}</span>
              <span style={{ color: T.accent }}>×{p.count}</span>
            </div>
          ))}
        </div>
      )}

      {/* Energy correlation */}
      {eScore !== null && eScore !== undefined && (
        <div style={{ padding: `${SP.sm + 2}px ${SP.md + 2}px`, background: "rgba(255,255,255,.03)", border: `1px solid rgba(255,255,255,${OP.bgSubtle})`, borderRadius: RAD.sm + 4, marginBottom: SP.md + 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ ...label(TYPE.xs - 2), color: `rgba(var(--txt),${OP.tertiary + 0.08})`, letterSpacing: "2px", marginBottom: 2 }}>Энергия / Капитал</div>
            <div style={{ ...body(TYPE.sm), color: `rgba(var(--txt),.7)` }}>Тест: {eScore} · Капитал: {avg}</div>
          </div>
          <div style={{ width: 60, height: SP.xs, borderRadius: 2, background: "rgba(255,255,255,.05)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.round((eScore + avg) / 2)}%`, background: T.accent, borderRadius: 2 }} />
          </div>
        </div>
      )}

      {/* Footer stats */}
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT_SANS, fontSize: TYPE.xs - 1, color: `rgba(var(--txt),${OP.tertiary + 0.08})` }}>
        <span>Всего практик: {totalSessions}</span>
        <span>За неделю: {sessionsThisWeek}</span>
      </div>
    </div>
  );
}
