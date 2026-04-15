import { useState, useEffect } from "react";
import { FONT_SERIF, FONT_SANS, TYPE, SP, RAD, OP, EASE, tx, label, body, heading } from "../utils/design";
import { getAxes, getPsycap, getOverallScore, getMonthlyDelta, getRecommendation, getScoreHistory, getEventsByDay, getLastAxisActivity, logWeeklyCheckin, MED_TAGS, LAYER_AXES } from "../data/psycap";
import { t as tr, MONTHS_SHORT } from "../utils/i18n";

const EVENT_ICONS = {
  meditation: "◦",
  diary: "✎",
  orbit: "◈",
  test: "⚡",
  checkin: "✦",
};

const EVENT_LABELS_DICT = {
  ru: { meditation: "Медитация", diary: "Дневник", orbit: "Орбита", test: "Тест энергии", checkin: "Чекин" },
  en: { meditation: "Meditation", diary: "Journal", orbit: "Orbit", test: "Energy test", checkin: "Check-in" },
};

const MONTHS_LONG = {
  ru: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};

function fmtDay(dayStr, lang) {
  const d = new Date(dayStr);
  const day = d.getDate();
  const mon = (MONTHS_LONG[lang] || MONTHS_LONG.ru)[d.getMonth()];
  return lang === "en" ? `${mon} ${day}` : `${day} ${mon}`;
}

function fmtTime(ts) {
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

// ── OVERVIEW TAB ────────────────────────────────────────────────────────
function Overview({ T, data, score, delta, rec, goToScenario, setScreen, expandedAxis, setExpandedAxis, lang, L, AXES }) {
  const radius = 60;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;

  return (
    <div>
      {/* Animated ring */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: SP.xl }}>
        <div style={{ position: "relative", width: 160, height: 160 }}>
          <svg width="160" height="160" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="80" cy="80" r={radius} fill="none" stroke="rgba(var(--txt),.07)" strokeWidth="8" />
            <circle cx="80" cy="80" r={radius} fill="none" stroke={T.accent} strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circ} strokeDashoffset={offset} style={{ transition: "stroke-dashoffset 1.4s ease" }} />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 48, fontWeight: 300, color: `rgba(var(--txt),${OP.primary})`, lineHeight: 1 }}>{score}</div>
            <div style={{ ...label(TYPE.xs), color: `rgba(var(--txt),${OP.tertiary + 0.08})`, letterSpacing: ".2em", marginTop: SP.xs }}>{L("pc_of_100")}</div>
          </div>
        </div>
        {delta !== 0 && (
          <div style={{ fontFamily: FONT_SANS, fontSize: TYPE.sm - 1, marginTop: SP.sm + 2, color: delta > 0 ? "#4FAE92" : "#D4453C" }}>
            {delta > 0 ? "+" : ""}{delta} {L("pc_per_month")}
          </div>
        )}
      </div>

      {/* 6 Axis bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: SP.md, marginBottom: SP.page }}>
        {AXES.map((a) => {
          const value = data.axes[a.id];
          const isExpanded = expandedAxis === a.id;
          const lastTs = getLastAxisActivity(a.id);
          const lastStr = lastTs ? (lang === "en" ? `${Math.floor((Date.now() - lastTs) / 86400000)}d ago` : `${Math.floor((Date.now() - lastTs) / 86400000)} дн назад`) : L("pc_never");
          // Find meditations that feed this axis
          const meds = Object.entries(MED_TAGS).filter(([, axes]) => axes.includes(a.id)).map(([name]) => name);
          return (
            <div key={a.id}>
              <div onClick={() => setExpandedAxis(isExpanded ? null : a.id)} style={{ cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
                  <span style={{ ...body(TYPE.base), color: "rgba(var(--txt),.88)" }}>{a.label}</span>
                  <span style={{ fontFamily: FONT_SANS, fontSize: TYPE.sm, color: a.hex, fontWeight: 500 }}>{value}</span>
                </div>
                <div style={{ height: 7, borderRadius: SP.xs, background: "rgba(var(--txt),.05)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${value}%`, background: `linear-gradient(90deg, ${a.hex}77, ${a.hex})`, borderRadius: SP.xs, transition: "width 1.2s ease", boxShadow: `0 0 10px ${a.hex}55` }} />
                </div>
              </div>
              {isExpanded && (
                <div style={{ marginTop: SP.sm + 2, padding: `${SP.md}px ${SP.md + 2}px`, background: `${a.hex}0c`, border: `1px solid ${a.hex}28`, borderRadius: RAD.sm + 4, animation: "fadeUp .25s ease both" }}>
                  <div style={{ ...body(TYPE.sm), color: "rgba(var(--txt),.75)", lineHeight: 1.6, marginBottom: SP.sm }}>{a.desc}</div>
                  {meds.length > 0 && (
                    <>
                      <div style={{ ...label(TYPE.xs - 2), color: `${a.hex}aa`, letterSpacing: "1.5px", marginBottom: SP.xs }}>{L("pc_develop")}</div>
                      <div style={{ ...body(TYPE.sm - 1), color: `rgba(var(--txt),${OP.secondary + 0.05})`, lineHeight: 1.5, marginBottom: SP.sm }}>
                        {meds.slice(0, 3).join(" · ")}
                      </div>
                    </>
                  )}
                  <div style={{ fontFamily: FONT_SANS, fontSize: TYPE.xs - 1, color: `rgba(var(--txt),${OP.tertiary})` }}>{L("pc_last_activity")}: {lastStr}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Smart recommendation */}
      <div style={{ padding: `${SP.lg}px ${SP.lg + 2}px`, background: `${rec.axis.hex}12`, border: `1px solid ${rec.axis.hex}30`, borderRadius: RAD.md + 2 }}>
        <div style={{ ...label(TYPE.xs - 1), color: rec.axis.hex, letterSpacing: "2px", marginBottom: 6 }}>{L("pc_recommended")}</div>
        <div style={{ ...body(TYPE.base), color: "rgba(var(--txt),.88)", lineHeight: 1.5, marginBottom: SP.sm + 2 }}>{rec.text}</div>
        <div style={{ display: "flex", gap: SP.sm }}>
          <div onClick={() => setScreen("library")} style={{ cursor: "pointer", padding: `7px ${SP.md + 2}px`, borderRadius: RAD.sm + 4, background: `${rec.axis.hex}22`, border: `1px solid ${rec.axis.hex}44`, ...label(TYPE.xs - 1), letterSpacing: ".1em", color: rec.axis.hex }}>{L("pc_to_library")}</div>
          {goToScenario && <div onClick={() => goToScenario(rec.scenario)} style={{ cursor: "pointer", padding: `7px ${SP.md + 2}px`, borderRadius: RAD.sm + 4, background: `${rec.axis.hex}22`, border: `1px solid ${rec.axis.hex}44`, ...label(TYPE.xs - 1), letterSpacing: ".1em", color: rec.axis.hex }}>{L("pc_to_orbit")}</div>}
        </div>
      </div>
    </div>
  );
}

// ── GROWTH TAB ──────────────────────────────────────────────────────────
function Growth({ T, lang, L, EVENT_LABELS }) {
  const [range, setRange] = useState("month");
  const ranges = {
    week: { ms: 7 * 86400000, label: L("pc_week") },
    month: { ms: 30 * 86400000, label: L("pc_month") },
    all: { ms: 365 * 86400000, label: L("pc_all_time") },
  };
  const [selectedPt, setSelectedPt] = useState(null);
  const history = getScoreHistory(ranges[range].ms);

  const W = 320, H = 140, pad = 10;
  const minScore = Math.min(...history.map((p) => p.score), 0);
  const maxScore = Math.max(...history.map((p) => p.score), 100);
  const scale = (v) => H - pad - ((v - minScore) / Math.max(1, maxScore - minScore)) * (H - pad * 2);
  const pts = history.map((p, i) => ({
    x: pad + (i / Math.max(1, history.length - 1)) * (W - pad * 2),
    y: scale(p.score),
    ...p,
  }));
  const line = "M" + pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join("L");
  const area = line + `L${pts[pts.length - 1]?.x || W - pad},${H - pad}L${pts[0]?.x || pad},${H - pad}Z`;

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: "flex", background: "rgba(var(--txt),.04)", border: `1px solid ${T.border}`, borderRadius: RAD.sm + 4, padding: 3, marginBottom: SP.lg }}>
        {Object.entries(ranges).map(([k, v]) => (
          <div key={k} onClick={() => setRange(k)} style={{ flex: 1, padding: "9px 0", textAlign: "center", ...label(TYPE.xs), letterSpacing: ".1em", borderRadius: RAD.sm + 1, cursor: "pointer", background: range === k ? T.accent + "22" : "transparent", color: range === k ? T.accent : `rgba(var(--txt),${OP.secondary})`, transition: EASE.fast }}>{v.label}</div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ padding: `${SP.lg}px ${SP.sm + 2}px`, background: "rgba(var(--txt),.03)", border: `1px solid ${T.border}`, borderRadius: RAD.md + 2, marginBottom: SP.lg }}>
        <svg width="100%" viewBox={`0 0 ${W} ${H + 20}`} style={{ display: "block" }}>
          <defs>
            <linearGradient id="pchart" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={T.accent} stopOpacity="0.4" />
              <stop offset="100%" stopColor={T.accent} stopOpacity="0" />
            </linearGradient>
          </defs>
          {history.length >= 2 && (
            <>
              <path d={area} fill="url(#pchart)" />
              <path d={line} fill="none" stroke={T.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              {pts.map((p, i) => p.event && (
                <circle key={i} cx={p.x} cy={p.y} r={4} fill={T.accent} style={{ cursor: "pointer" }} onClick={() => setSelectedPt(p)} />
              ))}
            </>
          )}
          {history.length < 2 && (
            <text x={W / 2} y={H / 2} textAnchor="middle" fill="rgba(200,175,158,.4)" fontSize={TYPE.sm} fontFamily={FONT_SERIF}>{L("pc_no_data")}</text>
          )}
        </svg>
      </div>

      {/* Selected point details */}
      {selectedPt?.event && (
        <div style={{ padding: `${SP.md}px ${SP.md + 2}px`, background: T.card, border: `1px solid ${T.border}`, borderRadius: RAD.sm + 4, marginBottom: SP.md }}>
          <div style={{ ...label(TYPE.xs - 1), color: T.accent, letterSpacing: "2px", marginBottom: SP.xs }}>{EVENT_LABELS[selectedPt.event.type]}</div>
          <div style={{ ...body(TYPE.base), color: "rgba(var(--txt),.88)", marginBottom: SP.xs }}>{selectedPt.event.name}</div>
          <div style={{ fontFamily: FONT_SANS, fontSize: TYPE.xs, color: `rgba(var(--txt),${OP.secondary - 0.1})` }}>+{selectedPt.event.points} · {fmtTime(selectedPt.event.ts)}</div>
        </div>
      )}

      <div style={{ ...body(TYPE.sm), color: `rgba(var(--txt),${OP.secondary})`, lineHeight: 1.6, textAlign: "center", fontStyle: "italic" }}>
        {L("pc_chart_hint")}
      </div>
    </div>
  );
}

// ── FEED TAB ────────────────────────────────────────────────────────────
function Feed({ T, lang, L, AXES, EVENT_LABELS }) {
  const days = getEventsByDay();
  if (days.length === 0) {
    return (
      <div style={{ padding: SP.xxl, textAlign: "center", ...body(TYPE.base), color: `rgba(var(--txt),${OP.tertiary + 0.08})`, fontStyle: "italic" }}>
        {L("pc_feed_empty")}
      </div>
    );
  }
  return (
    <div>
      {days.slice(0, 30).map(({ day, events }) => (
        <div key={day} style={{ marginBottom: SP.lg + 2 }}>
          <div style={{ ...label(TYPE.xs - 1), color: `rgba(var(--txt),${OP.tertiary + 0.08})`, letterSpacing: "2px", marginBottom: SP.sm }}>{fmtDay(day, lang)}</div>
          {events.map((e, i) => (
            <div key={i} style={{ display: "flex", gap: SP.md, padding: `${SP.md}px ${SP.md + 2}px`, background: T.card, border: `1px solid ${T.border}`, borderRadius: RAD.md - 1, marginBottom: 6 }}>
              <div style={{ width: SP.xxl, height: SP.xxl, borderRadius: RAD.sm, background: `${T.accent}18`, border: `1px solid ${T.accent}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: SP.lg, color: T.accent, flexShrink: 0 }}>{EVENT_ICONS[e.type] || "·"}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 3 }}>
                  <span style={{ ...body(TYPE.sm + 1), color: "rgba(var(--txt),.88)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 200 }}>{e.name}</span>
                  <span style={{ fontFamily: FONT_SANS, fontSize: TYPE.xs - 1, color: `rgba(var(--txt),${OP.tertiary})`, flexShrink: 0, marginLeft: SP.sm }}>{fmtTime(e.ts)}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <span style={{ ...label(TYPE.xs - 2), color: `rgba(var(--txt),${OP.tertiary})`, letterSpacing: "1.5px" }}>{EVENT_LABELS[e.type]}</span>
                  {e.points > 0 && <span style={{ fontFamily: FONT_SANS, fontSize: TYPE.xs - 1, color: T.accent }}>+{e.points}</span>}
                  {e.axes.slice(0, 3).map((axId) => {
                    const ax = AXES.find((a) => a.id === axId);
                    return ax ? <span key={axId} style={{ fontFamily: FONT_SANS, fontSize: TYPE.xs - 2, padding: `2px 6px`, borderRadius: 6, background: `${ax.hex}15`, color: ax.hex }}>{ax.short}</span> : null;
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ── WEEKLY CHECK-IN MODAL ───────────────────────────────────────────────
function WeeklyCheckin({ T, onClose, L, AXES }) {
  const [values, setValues] = useState({ safety: 50, worth: 50, feminine: 50, trust: 50 });
  const sliderAxes = AXES.filter((a) => ["safety", "worth", "feminine", "trust"].includes(a.id));

  const save = () => {
    logWeeklyCheckin(values);
    localStorage.setItem("frisson_checkin_last", String(Date.now()));
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(6,2,8,.88)", backdropFilter: "blur(16px)", display: "flex", alignItems: "center", justifyContent: "center", padding: SP.xl }}>
      <div style={{ width: "100%", maxWidth: 380, background: "#14102a", border: `1px solid ${T.border}`, borderRadius: RAD.lg, padding: SP.xl }}>
        <div style={{ ...label(TYPE.xs - 1), color: T.accent, letterSpacing: "2px", marginBottom: 6, textAlign: "center" }}>{L("pc_weekly_checkin")}</div>
        <div style={{ ...heading(TYPE.xl - 2), color: `rgba(var(--txt),${OP.primary})`, marginBottom: 6, textAlign: "center" }}>{L("pc_how_now")}</div>
        <div style={{ ...body(TYPE.sm), color: `rgba(var(--txt),${OP.secondary})`, marginBottom: SP.xl, textAlign: "center", fontStyle: "italic" }}>{L("pc_30sec")}</div>

        {sliderAxes.map((a) => (
          <div key={a.id} style={{ marginBottom: SP.lg + 2 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ ...body(TYPE.sm + 1), color: "rgba(var(--txt),.85)" }}>{a.short}</span>
              <span style={{ fontFamily: FONT_SANS, fontSize: TYPE.sm - 1, color: a.hex }}>{values[a.id]}</span>
            </div>
            <input
              type="range" min="0" max="100" value={values[a.id]}
              onChange={(e) => setValues((v) => ({ ...v, [a.id]: parseInt(e.target.value) }))}
              style={{ width: "100%", accentColor: a.hex }}
            />
          </div>
        ))}

        <div style={{ display: "flex", gap: SP.sm + 2, marginTop: SP.page }}>
          <button onClick={onClose} type="button" style={{ flex: 1, padding: SP.md + 2, background: "rgba(var(--txt),.05)", border: "1px solid rgba(var(--txt),.1)", borderRadius: RAD.sm + 4, ...label(TYPE.sm - 1), letterSpacing: ".1em", color: `rgba(var(--txt),${OP.secondary})`, cursor: "pointer" }}>{L("pc_later")}</button>
          <button onClick={save} type="button" style={{ flex: 2, padding: SP.md + 2, background: T.accent + "44", border: `1px solid ${T.accent}`, borderRadius: RAD.sm + 4, ...label(TYPE.sm - 1), letterSpacing: ".1em", color: "#fff", cursor: "pointer" }}>{L("save")}</button>
        </div>
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ──────────────────────────────────────────────────────
export default function PsycapTracker({ T, setScreen, goToScenario, lang = "ru" }) {
  const L = (k, ...a) => tr(lang, k, ...a);
  const AXES = getAxes(lang);
  const EVENT_LABELS = EVENT_LABELS_DICT[lang] || EVENT_LABELS_DICT.ru;
  const [tab, setTab] = useState("overview");
  const [data, setData] = useState(getPsycap);
  const [expandedAxis, setExpandedAxis] = useState(null);
  const [showCheckin, setShowCheckin] = useState(false);

  // Check if weekly checkin is due
  const lastCheckin = parseInt(localStorage.getItem("frisson_checkin_last")) || 0;
  const checkinDue = Date.now() - lastCheckin > 7 * 86400000;

  useEffect(() => {
    // Refresh data when switching tabs
    setData(getPsycap());
  }, [tab]);

  const score = getOverallScore();
  const delta = getMonthlyDelta();
  const rec = getRecommendation(lang);

  return (
    <div style={{ margin: `0 ${SP.xl}px ${SP.lg + 2}px`, padding: `${SP.page}px ${SP.lg + 2}px`, background: T.card, border: `1px solid ${T.border}`, borderRadius: RAD.lg, position: "relative", zIndex: 1 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: SP.md + 2 }}>
        <div style={{ ...label(TYPE.xs - 1), color: `rgba(var(--txt),${OP.tertiary + 0.08})`, letterSpacing: ".22em" }}>{L("pc_header")}</div>
        {checkinDue && (
          <div onClick={() => setShowCheckin(true)} style={{ ...label(TYPE.xs - 1), letterSpacing: ".1em", color: T.accent, cursor: "pointer", padding: `${SP.xs}px ${SP.sm + 2}px`, borderRadius: SP.sm + 2, background: `${T.accent}18`, border: `1px solid ${T.accent}33` }}>{L("pc_checkin_cta")}</div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", background: "rgba(var(--txt),.04)", border: `1px solid ${T.border}`, borderRadius: RAD.sm + 4, padding: 3, marginBottom: SP.lg + 2 }}>
        {[{ id: "overview", l: L("pc_overview") }, { id: "growth", l: L("pc_growth") }, { id: "feed", l: L("pc_feed") }].map((t) => (
          <div key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: "9px 0", textAlign: "center", ...label(TYPE.xs), letterSpacing: ".1em", borderRadius: RAD.sm + 1, cursor: "pointer", background: tab === t.id ? T.accent + "22" : "transparent", color: tab === t.id ? T.accent : `rgba(var(--txt),${OP.secondary})`, transition: EASE.fast }}>{t.l}</div>
        ))}
      </div>

      {/* Content */}
      {tab === "overview" && <Overview T={T} data={data} score={score} delta={delta} rec={rec} goToScenario={goToScenario} setScreen={setScreen} expandedAxis={expandedAxis} setExpandedAxis={setExpandedAxis} lang={lang} L={L} AXES={AXES} />}
      {tab === "growth" && <Growth T={T} lang={lang} L={L} EVENT_LABELS={EVENT_LABELS} />}
      {tab === "feed" && <Feed T={T} lang={lang} L={L} AXES={AXES} EVENT_LABELS={EVENT_LABELS} />}

      {/* Weekly check-in modal */}
      {showCheckin && <WeeklyCheckin T={T} onClose={() => setShowCheckin(false)} L={L} AXES={AXES} />}
    </div>
  );
}
