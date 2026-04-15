import { useState, useEffect } from "react";
// THEMES passed via props
import {
  TYPE, SP, RAD, OP, LS, EASE, LH,
  FONT_SERIF, FONT_SANS,
  tx, label, body, heading,
  card as cardStyle, section,
} from "../utils/design";
import { logDiary } from "../data/psycap";
import { t as tr, MONTHS_SHORT } from "../utils/i18n";

const STORAGE_KEY = "frisson_journal";

const MONTHS_LONG = {
  ru: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { intent: [], grat: [], goals: [], reflect: [] }; }
  catch { return { intent: [], grat: [], goals: [], reflect: [] }; }
}
function save(data) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }

function fmtDate(ts, lang) {
  const d = new Date(ts);
  const day = d.getDate();
  const mon = (MONTHS_SHORT[lang] || MONTHS_SHORT.ru)[d.getMonth()];
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${day} ${mon} · ${h}:${m}`;
}

function todayStr(lang) {
  const d = new Date();
  const day = d.getDate();
  const mon = (MONTHS_LONG[lang] || MONTHS_LONG.ru)[d.getMonth()];
  if (lang === "en") return `${mon} ${day}, ${d.getFullYear()}`;
  return `${day} ${mon} ${d.getFullYear()}`;
}

export default function Journal({ theme, addGems, THEMES, lang = "ru" }) {
  const T = THEMES[theme] || THEMES.full;
  const L = (k) => tr(lang, k);
  const MOODS = [["🌑", L("jr_mood_empty")], ["🌒", L("jr_mood_quiet")], ["🌕", L("jr_mood_full")], ["🔥", L("jr_mood_power")]];
  const [tab, setTab] = useState("intent");
  const [data, setData] = useState(load);
  const [text, setText] = useState("");
  const [mood, setMood] = useState(null);
  const [goalText, setGoalText] = useState("");
  const [crystals, setCrystals] = useState([]);

  useEffect(() => { save(data); }, [data]);

  const pop = () => { const id = Date.now(); setCrystals((p) => [...p, { id, x: Math.random() * 60 + 20 }]); setTimeout(() => setCrystals((p) => p.filter((c) => c.id !== id)), 1200); };

  const award = (n) => { if (addGems) addGems(n); };

  const addEntry = (section) => {
    if (!text.trim()) return;
    const entry = { id: Date.now(), text: text.trim(), ts: Date.now() };
    setData((d) => ({ ...d, [section]: [entry, ...d[section]] }));
    setText("");
    award(1);
    logDiary(text, []);
    pop();
  };

  const addReflect = () => {
    if (!text.trim() && mood === null) return;
    const entry = { id: Date.now(), text: text.trim(), ts: Date.now(), mood };
    setData((d) => ({ ...d, reflect: [entry, ...d.reflect] }));
    setText("");
    setMood(null);
    award(1);
    logDiary(text, []);
    pop();
  };

  const addGoal = () => {
    if (!goalText.trim()) return;
    const entry = { id: Date.now(), text: goalText.trim(), ts: Date.now(), done: false };
    setData((d) => ({ ...d, goals: [entry, ...d.goals] }));
    setGoalText("");
    award(1);
    logDiary(goalText, []);
    pop();
  };

  const delEntry = (section, id) => {
    setData((d) => ({ ...d, [section]: d[section].filter((e) => e.id !== id) }));
  };

  const toggleGoal = (id) => {
    setData((d) => {
      const goal = d.goals.find((g) => g.id === id);
      if (goal && !goal.done) award(2);
      return { ...d, goals: d.goals.map((g) => g.id === id ? { ...g, done: !g.done } : g) };
    });
  };

  const taStyle = {
    width: "100%", minHeight: 100, background: "transparent", border: "none",
    outline: "none", resize: "vertical", padding: `${SP.md}px ${SP.lg}px`,
    ...body(TYPE.lg), color: tx("var(--txt)", OP.primary), lineHeight: LH.loose,
    WebkitAppearance: "none", display: "block",
  };

  const saveBtnStyle = (active) => ({
    padding: `${SP.sm - 1}px ${SP.lg + 2}px`, borderRadius: RAD.lg,
    background: active ? T.dim : `rgba(255,255,255,${OP.bgSubtle - 0.02})`,
    border: `1px solid ${active ? T.accent : `rgba(255,255,255,${OP.bgSubtle})`}`,
    ...label(TYPE.xs), color: active ? tx("var(--txt)", OP.primary) : tx("var(--txt)", OP.tertiary - 0.07),
    cursor: active ? "pointer" : "default", transition: EASE.fast,
  });

  const entryCard = {
    display: "flex", gap: SP.md, padding: `${SP.md + 2}px ${SP.lg}px`,
    background: T.card, border: `1px solid ${T.border}`,
    borderRadius: RAD.md + 1, marginBottom: SP.sm,
  };

  const entryTimestamp = {
    ...label(TYPE.xs - 2), letterSpacing: LS.wide,
    color: tx("var(--txt)", OP.tertiary), marginBottom: SP.xs + 1,
  };

  const entryText = {
    ...body(TYPE.base + 1), lineHeight: LH.loose - 0.05,
    color: tx("var(--txt)", OP.primary),
  };

  const deleteBtn = {
    cursor: "pointer", fontSize: TYPE.base, color: tx("var(--txt)", OP.disabled),
    flexShrink: 0, alignSelf: "flex-start",
  };

  const sectionLabel = (mb = SP.sm) => ({
    ...label(TYPE.xs - 1), letterSpacing: LS.wide,
    color: T.accent, marginBottom: mb,
  });

  const inputCard = {
    background: T.card, border: `1px solid ${T.border}`,
    borderRadius: RAD.lg - 4, overflow: "hidden", marginBottom: SP.md + 2,
  };

  const inputFooter = {
    padding: `${SP.sm}px ${SP.md}px`, display: "flex",
    justifyContent: "flex-end", borderTop: `1px solid ${T.border}`,
  };

  return (
    <div style={{ minHeight: "100%", background: T.bg, paddingBottom: 100, position: "relative", transition: EASE.slow }}>
      {crystals.map((cr) => (
        <div key={cr.id} style={{ position: "fixed", bottom: 140, left: `${cr.x}%`, zIndex: 999, pointerEvents: "none", animation: "gemBurst 2s ease forwards", textAlign: "center" }}>
          <div style={{ fontSize: TYPE.xxl, color: "#F0D060", animation: "gemGlow .8s ease-in-out 2" }}>+1 ⟡</div>
        </div>
      ))}

      <div style={{ padding: `50px ${SP.xl}px ${SP.lg + 2}px`, position: "relative", zIndex: 1 }}>
        <div style={{ ...label(TYPE.xs - 1), letterSpacing: ".25em", color: T.accent, marginBottom: SP.xs + 2 }}>{todayStr(lang)}</div>
        <div style={{ ...heading(TYPE.xxl + 4), color: tx("var(--txt)", OP.primary + 0.03), marginBottom: SP.page }}>{L("jr_journal")}</div>
        <div style={{ display: "flex", background: T.card, border: `1px solid ${T.border}`, borderRadius: RAD.md - 1, padding: 3 }}>
          {[{ id: "intent", l: L("jr_tab_intent") }, { id: "grat", l: L("jr_tab_grat") }, { id: "goals", l: L("jr_tab_goals") }, { id: "reflect", l: L("jr_tab_reflect") }].map((t) => (
            <div key={t.id} onClick={() => { setTab(t.id); setText(""); }} style={{
              flex: 1, padding: `${TYPE.xs}px ${SP.xs}px`, textAlign: "center",
              ...label(TYPE.xs), letterSpacing: ".04em",
              borderRadius: RAD.sm + 3, cursor: "pointer",
              background: tab === t.id ? T.dim : "transparent",
              color: tab === t.id ? tx("var(--txt)", OP.primary) : tx("var(--txt)", OP.tertiary + 0.06),
              transition: EASE.normal, minHeight: 40,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{t.l}</div>
          ))}
        </div>
      </div>

      <div style={{ margin: `0 ${SP.xl}px ${SP.lg + 2}px`, padding: `${SP.lg + 1}px ${SP.page}px`, background: T.dim, border: `1px solid ${T.border}`, borderRadius: RAD.lg - 2, position: "relative", zIndex: 1 }}>
        <div style={sectionLabel(SP.sm)}>{L("jr_question")}</div>
        <div style={{ ...body(TYPE.lg), lineHeight: LH.loose - 0.05, color: tx("var(--txt)", OP.primary - 0.1) }}>
          {tab === "intent" && L("jr_q_intent")}
          {tab === "grat" && L("jr_q_grat")}
          {tab === "goals" && L("jr_q_goals")}
          {tab === "reflect" && L("jr_q_reflect")}
        </div>
      </div>

      <div style={{ padding: `0 ${SP.xl}px`, position: "relative", zIndex: 1 }}>

        {tab === "intent" && <>
          <div style={{ padding: `${SP.md + 2}px ${SP.lg + 2}px`, marginBottom: SP.md + 2, background: `linear-gradient(135deg,${T.dim},rgba(255,255,255,.02))`, border: `1px solid ${T.border}`, borderRadius: RAD.lg - 2 }}>
            <div style={sectionLabel(SP.sm)}>{L("jr_intent_format")}</div>
            <div style={{ ...body(TYPE.base), lineHeight: LH.loose + 0.05, color: tx("var(--txt)", OP.secondary + 0.2) }}>{L("jr_intent_hint_pre")}<span style={{ color: T.accent }}>{L("jr_intent_hint_accent")}</span>{L("jr_intent_hint_post")}</div>
          </div>
          <div style={inputCard}>
            <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={L("jr_intent_ph")} rows={3} style={taStyle} />
            <div style={inputFooter}>
              <div onClick={() => addEntry("intent")} style={saveBtnStyle(text.trim())}>{L("jr_save")}</div>
            </div>
          </div>
          {data.intent.map((e) => (
            <div key={e.id} style={entryCard}>
              <div style={{ flex: 1 }}>
                <div style={entryTimestamp}>{fmtDate(e.ts, lang)}</div>
                <div style={entryText}>{e.text}</div>
              </div>
              <div onClick={() => delEntry("intent", e.id)} style={deleteBtn}>×</div>
            </div>
          ))}
        </>}

        {tab === "grat" && <>
          <div style={inputCard}>
            <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={L("jr_grat_ph")} rows={3} style={taStyle} />
            <div style={inputFooter}>
              <div onClick={() => addEntry("grat")} style={saveBtnStyle(text.trim())}>{L("jr_save")}</div>
            </div>
          </div>
          {data.grat.map((e) => (
            <div key={e.id} style={entryCard}>
              <div style={{ flex: 1 }}>
                <div style={entryTimestamp}>{fmtDate(e.ts, lang)}</div>
                <div style={entryText}>{e.text}</div>
              </div>
              <div onClick={() => delEntry("grat", e.id)} style={deleteBtn}>×</div>
            </div>
          ))}
        </>}

        {tab === "goals" && <>
          <div style={{ padding: `${SP.lg}px ${SP.lg + 2}px`, marginBottom: SP.md + 2, background: `linear-gradient(135deg,${T.dim},rgba(255,255,255,.02))`, border: `1px solid ${T.border}`, borderRadius: RAD.lg - 2 }}>
            <div style={{ ...label(TYPE.xs - 1), letterSpacing: ".22em", color: T.accent, marginBottom: TYPE.xs }}>{L("jr_before_goals")}</div>
            <div style={{ ...body(TYPE.lg), color: tx("var(--txt)", OP.primary), marginBottom: SP.xs }}>{L("jr_true_goals")}</div>
            <div style={{ ...label(TYPE.sm - 1), letterSpacing: LS.normal, textTransform: "none", color: tx("var(--txt)", OP.secondary - 0.1), lineHeight: LH.normal }}>{L("jr_goals_hint")}</div>
          </div>
          <div style={inputCard}>
            <input value={goalText} onChange={(e) => setGoalText(e.target.value)} placeholder={L("jr_goal_ph")} onKeyDown={(e) => e.key === "Enter" && addGoal()} style={{
              width: "100%", background: "transparent", border: "none", outline: "none",
              padding: `${SP.md + 2}px ${SP.lg}px`, ...body(TYPE.lg),
              color: tx("var(--txt)", OP.primary), WebkitAppearance: "none",
            }} />
            <div style={inputFooter}>
              <div onClick={addGoal} style={saveBtnStyle(goalText.trim())}>{L("jr_add")}</div>
            </div>
          </div>
          {data.goals.map((g) => (
            <div key={g.id} style={{
              display: "flex", alignItems: "center", gap: SP.md + 1,
              padding: `${SP.md + 2}px ${SP.lg}px`,
              background: g.done ? T.dim : T.card, border: `1px solid ${T.border}`,
              borderRadius: RAD.md, marginBottom: SP.sm, transition: EASE.normal,
            }}>
              <div onClick={() => toggleGoal(g.id)} style={{
                width: TYPE.xxl, height: TYPE.xxl, borderRadius: RAD.full, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: g.done ? T.dim : `rgba(255,255,255,${OP.bgSubtle - 0.01})`,
                border: `1.5px solid ${g.done ? T.accent : `rgba(255,255,255,${OP.bgMedium + 0.03})`}`,
                fontSize: TYPE.sm + 1, color: tx("var(--txt)", OP.primary), cursor: "pointer",
              }}>{g.done ? "✦" : "○"}</div>
              <div style={{ flex: 1 }}>
                <div style={entryTimestamp}>{fmtDate(g.ts, lang)}</div>
                <div style={{
                  ...body(TYPE.sm + 1), color: tx("var(--txt)", OP.primary),
                  lineHeight: LH.tight + 0.15,
                  textDecoration: g.done ? "line-through" : "none",
                  opacity: g.done ? OP.secondary - 0.05 : 1,
                }}>{g.text}</div>
              </div>
              <div onClick={() => delEntry("goals", g.id)} style={{ ...deleteBtn, alignSelf: "center" }}>×</div>
            </div>
          ))}
        </>}

        {tab === "reflect" && <>
          <div style={{ padding: SP.lg + 2, background: T.card, border: `1px solid ${T.border}`, borderRadius: RAD.lg - 2, marginBottom: SP.md + 2 }}>
            <div style={{ ...label(TYPE.xs - 1), letterSpacing: ".18em", color: tx("var(--txt)", OP.tertiary + 0.06), marginBottom: SP.md }}>{L("jr_state_after")}</div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {MOODS.map((pr, i) => (
                <div key={i} onClick={() => setMood(mood === i ? null : i)} style={{
                  textAlign: "center", cursor: "pointer",
                  opacity: mood === i ? 1 : OP.tertiary + 0.08,
                  transition: EASE.fast,
                  transform: mood === i ? "scale(1.15)" : "scale(1)",
                }}>
                  <div style={{ fontSize: TYPE.xxl - 2 }}>{pr[0]}</div>
                  <div style={{
                    ...label(TYPE.xs - 2), letterSpacing: ".1em",
                    color: mood === i ? T.accent : tx("var(--txt)", OP.tertiary + 0.03),
                    marginTop: SP.xs + 1,
                  }}>{pr[1]}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ ...label(TYPE.xs - 1), letterSpacing: ".18em", color: tx("var(--txt)", OP.tertiary + 0.08), marginBottom: SP.sm }}>{L("jr_insights")}</div>
          <div style={inputCard}>
            <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={L("jr_reflect_ph")} rows={3} style={taStyle} />
            <div style={inputFooter}>
              <div onClick={addReflect} style={saveBtnStyle(text.trim() || mood !== null)}>{L("jr_save")}</div>
            </div>
          </div>
          {data.reflect.map((e) => (
            <div key={e.id} style={entryCard}>
              <div style={{ flex: 1 }}>
                <div style={entryTimestamp}>{fmtDate(e.ts, lang)}</div>
                {e.mood !== undefined && e.mood !== null && (
                  <div style={{ fontSize: SP.lg + 2, marginBottom: SP.xs + 2 }}>{MOODS[e.mood]?.[0]} <span style={{ ...label(TYPE.xs - 2), color: tx("var(--txt)", OP.tertiary + 0.03), verticalAlign: "middle" }}>{MOODS[e.mood]?.[1]}</span></div>
                )}
                {e.text && <div style={entryText}>{e.text}</div>}
              </div>
              <div onClick={() => delEntry("reflect", e.id)} style={deleteBtn}>×</div>
            </div>
          ))}
        </>}
      </div>
    </div>
  );
}
