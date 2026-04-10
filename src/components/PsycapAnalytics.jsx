import { useState } from "react";
import { getPsycapStats } from "../data/psycap";
import { FONT_SERIF, FONT_SANS } from "../utils/helpers";

export default function PsycapAnalytics({ T, setScreen, eScore, goToScenario }) {
  const stats = getPsycapStats();
  const [showHow, setShowHow] = useState(false);
  const { dims, avg, weeklyGrowth, strongest, weakest, recommendation, sessionsThisWeek, totalSessions, topPractices } = stats;
  const trendIcon = weeklyGrowth > 0 ? "↑" : weeklyGrowth < 0 ? "↓" : "→";
  const trendColor = weeklyGrowth > 0 ? "#4FAE92" : weeklyGrowth < 0 ? "#D4453C" : `rgba(var(--txt),.4)`;

  return (
    <div style={{ margin: "0 24px 18px", padding: "20px 18px", background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, position: "relative", zIndex: 1 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 4 }}>
        <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: `rgba(var(--txt),.4)` }}>Психологический капитал</div>
        <div style={{ fontFamily: FONT_SANS, fontSize: 9, color: trendColor }}>{trendIcon} {weeklyGrowth > 0 ? "+" : ""}{weeklyGrowth} за неделю</div>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 26, color: `rgba(var(--txt),.95)` }}>{avg}<span style={{ fontSize: 14, color: `rgba(var(--txt),.4)` }}>/100</span></div>
        <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".15em", textTransform: "uppercase", color: `rgba(var(--txt),.45)` }}>HEROF · средний</div>
      </div>
      <div onClick={() => setShowHow(!showHow)} style={{ fontFamily: FONT_SANS, fontSize: 10, color: T.accent, cursor: "pointer", marginBottom: 14 }}>
        {showHow ? "Скрыть ↑" : "Как это считается? ↓"}
      </div>

      {/* Explanation block */}
      {showHow && (
        <div style={{ padding: "12px 14px", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 12, marginBottom: 14, fontFamily: FONT_SERIF, fontSize: 12, lineHeight: 1.65, color: `rgba(var(--txt),.7)` }}>
          <div style={{ marginBottom: 8 }}>Каждая практика на орбите и запись в дневнике добавляют очки в одну или несколько из 5 областей:</div>
          <div style={{ fontSize: 11, color: `rgba(var(--txt),.55)` }}>
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
      <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 16 }}>
        {dims.map((d) => (
          <div key={d.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
              <span style={{ fontFamily: FONT_SERIF, fontSize: 13, color: `rgba(var(--txt),.85)` }}>{d.label}</span>
              <span style={{ fontFamily: FONT_SANS, fontSize: 11, color: d.hex, fontWeight: 500 }}>{d.value}/100</span>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,.05)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${d.value}%`, background: `linear-gradient(90deg, ${d.hex}66, ${d.hex})`, borderRadius: 3, transition: "width 1.2s ease", boxShadow: `0 0 8px ${d.hex}44` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Strength callout */}
      <div style={{ padding: "12px 14px", background: `${strongest.hex}10`, border: `1px solid ${strongest.hex}30`, borderRadius: 12, marginBottom: 8 }}>
        <div style={{ fontFamily: FONT_SANS, fontSize: 8, letterSpacing: 2, textTransform: "uppercase", color: strongest.hex, marginBottom: 4 }}>✦ Ваша сила</div>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 13, color: `rgba(var(--txt),.85)`, lineHeight: 1.4 }}>{strongest.label} — ваша опора. {strongest.desc.toLowerCase()}.</div>
      </div>

      {/* Weakness + recommendation */}
      <div style={{ padding: "12px 14px", background: `${weakest.hex}10`, border: `1px solid ${weakest.hex}30`, borderRadius: 12, marginBottom: 14 }}>
        <div style={{ fontFamily: FONT_SANS, fontSize: 8, letterSpacing: 2, textTransform: "uppercase", color: weakest.hex, marginBottom: 4 }}>↗ Что развивать</div>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 13, color: `rgba(var(--txt),.85)`, lineHeight: 1.5, marginBottom: 8 }}>
          <b>{weakest.label}</b> — {recommendation.text}
        </div>
        <div onClick={() => goToScenario ? goToScenario(recommendation.scenario) : setScreen && setScreen("orbit")} style={{ display: "inline-block", padding: "6px 12px", borderRadius: 10, background: `${weakest.hex}22`, border: `1px solid ${weakest.hex}44`, fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: weakest.hex, cursor: "pointer" }}>
          Открыть «{recommendation.label}» →
        </div>
      </div>

      {/* Practice breakdown */}
      {topPractices.length > 0 && (
        <div style={{ padding: "12px 14px", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 12, marginBottom: 14 }}>
          <div style={{ fontFamily: FONT_SANS, fontSize: 8, letterSpacing: 2, textTransform: "uppercase", color: `rgba(var(--txt),.4)`, marginBottom: 8 }}>Топ практик</div>
          {topPractices.map((p) => (
            <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4, fontFamily: FONT_SERIF, fontSize: 12, color: `rgba(var(--txt),.75)` }}>
              <span>{p.name}</span>
              <span style={{ color: T.accent }}>×{p.count}</span>
            </div>
          ))}
        </div>
      )}

      {/* Energy correlation */}
      {eScore !== null && eScore !== undefined && (
        <div style={{ padding: "10px 14px", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 12, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: FONT_SANS, fontSize: 8, letterSpacing: 2, textTransform: "uppercase", color: `rgba(var(--txt),.4)`, marginBottom: 2 }}>Энергия / Капитал</div>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 12, color: `rgba(var(--txt),.7)` }}>Тест: {eScore} · Капитал: {avg}</div>
          </div>
          <div style={{ width: 60, height: 4, borderRadius: 2, background: "rgba(255,255,255,.05)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.round((eScore + avg) / 2)}%`, background: T.accent, borderRadius: 2 }} />
          </div>
        </div>
      )}

      {/* Footer stats */}
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT_SANS, fontSize: 9, color: `rgba(var(--txt),.4)` }}>
        <span>Всего практик: {totalSessions}</span>
        <span>За неделю: {sessionsThisWeek}</span>
      </div>
    </div>
  );
}
