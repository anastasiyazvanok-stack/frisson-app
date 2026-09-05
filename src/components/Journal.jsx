import { aiFetch } from "../lib/ai.js";
import { userStorage as localStorage } from "../lib/userStorage.js";
import { useState, useEffect } from "react";
import {
  TYPE, SP, RAD, OP, LS, EASE, LH,
  FONT_SERIF, FONT_SANS,
  tx, label, body, heading,
} from "../utils/design";
import { logDiary, detectDiaryAxes } from "../data/psycap";
import { t as tr, MONTHS_SHORT } from "../utils/i18n";
import Orb from "./Orb";

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

const TAB_COLORS = {
  intent:  { hex: "#C8A8F0", rgb: "200,168,240" },
  grat:    { hex: "#F0C8A8", rgb: "240,200,168" },
  goals:   { hex: "#A8D8C8", rgb: "168,216,200" },
  reflect: { hex: "#A8C0F0", rgb: "168,192,240" },
};

const TAB_EMPTY = {
  ru: {
    intent:  { icon: "✦", title: "Ещё нет намерений", hint: "Каждое утро начинается с выбора" },
    grat:    { icon: "◈", title: "Ещё нет записей", hint: "Благодарность открывает больше" },
    goals:   { icon: "◇", title: "Ещё нет целей", hint: "Запиши, к чему ты движешься" },
    reflect: { icon: "◉", title: "Ещё нет рефлексий", hint: "Конец дня — время для себя" },
  },
  en: {
    intent:  { icon: "✦", title: "No intentions yet", hint: "Every morning starts with a choice" },
    grat:    { icon: "◈", title: "No entries yet", hint: "Gratitude opens up more" },
    goals:   { icon: "◇", title: "No goals yet", hint: "Write where you're heading" },
    reflect: { icon: "◉", title: "No reflections yet", hint: "End of day — time for yourself" },
  },
};

export default function Journal({ theme, addGems, THEMES, lang = "ru", doMarkPractice }) {
  const T = THEMES[theme] || THEMES.full;
  const L = (k) => tr(lang, k);
  const MOODS = [["🌑", L("jr_mood_empty")], ["🌒", L("jr_mood_quiet")], ["🌕", L("jr_mood_full")], ["🔥", L("jr_mood_power")]];
  const [tab, setTab] = useState("intent");
  const [data, setData] = useState(load);
  const [text, setText] = useState("");
  const [mood, setMood] = useState(null);
  const [goalText, setGoalText] = useState("");
  const [crystals, setCrystals] = useState([]);
  const [aiReply, setAiReply] = useState(null);
  const [aiError, setAiError] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  async function getAiReply(entryText) {
    if (!entryText?.trim() || entryText.trim().length < 20) return;
    setAiError(false);
    setAiLoading(true);
    try {
      const res = await aiFetch("/api/ai-diary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: entryText, lang }),
      });
      if (!res.ok) throw new Error("AI unavailable");
      if (res.ok) {
        const { message, axes } = await res.json();
        if (message) {
          setAiReply({ message, axes });
          setTimeout(() => setAiReply(null), 12000);
        }
      }
    } catch { setAiError(true); }
    setAiLoading(false);
  }

  useEffect(() => { save(data); }, [data]);

  const tc = TAB_COLORS[tab];
  const emptyInfo = (TAB_EMPTY[lang] || TAB_EMPTY.ru)[tab];

  const pop = () => {
    const id = Date.now();
    setCrystals((p) => [...p, { id, x: Math.random() * 60 + 20 }]);
    setTimeout(() => setCrystals((p) => p.filter((c) => c.id !== id)), 1200);
  };

  const award = (n) => { if (addGems) addGems(n); };

  const addEntry = (section) => {
    if (!text.trim()) return;
    const saved = text.trim();
    const entry = { id: Date.now(), text: saved, ts: Date.now() };
    setData((d) => ({ ...d, [section]: [entry, ...d[section]] }));
    setText("");
    award(1);
    logDiary(saved, detectDiaryAxes(saved));
    if (doMarkPractice) doMarkPractice(5);
    pop();
    getAiReply(saved);
  };

  const addReflect = () => {
    if (!text.trim() && mood === null) return;
    const saved = text.trim();
    const entry = { id: Date.now(), text: saved, ts: Date.now(), mood };
    setData((d) => ({ ...d, reflect: [entry, ...d.reflect] }));
    setText("");
    setMood(null);
    award(1);
    logDiary(saved || "рефлексия", detectDiaryAxes(saved));
    if (doMarkPractice) doMarkPractice(5);
    pop();
    if (saved) getAiReply(saved);
  };

  const addGoal = () => {
    if (!goalText.trim()) return;
    const entry = { id: Date.now(), text: goalText.trim(), ts: Date.now(), done: false };
    setData((d) => ({ ...d, goals: [entry, ...d.goals] }));
    setGoalText("");
    award(1);
    logDiary(goalText, detectDiaryAxes(goalText));
    if (doMarkPractice) doMarkPractice(5);
    pop();
  };

  const delEntry = (section, id) => {
    setData((d) => ({ ...d, [section]: d[section].filter((e) => e.id !== id) }));
  };

  const toggleGoal = (id) => {
    setData((d) => {
      const goal = d.goals.find((g) => g.id === id);
      if (goal && !goal.done) {
        award(2);
        logDiary(goal.text, detectDiaryAxes(goal.text));
        if (doMarkPractice) doMarkPractice(10);
        pop();
      }
      return { ...d, goals: d.goals.map((g) => g.id === id ? { ...g, done: !g.done } : g) };
    });
  };

  const taStyle = {
    width: "100%", minHeight: 90, background: "transparent", border: "none",
    outline: "none", resize: "none", padding: `${SP.md}px ${SP.lg}px`,
    ...body(TYPE.lg), color: tx("var(--txt)", OP.primary), lineHeight: LH.loose,
    WebkitAppearance: "none", display: "block", boxSizing: "border-box",
    fontFamily: FONT_SANS, colorScheme: "dark",
  };

  const saveBtnStyle = (active) => ({
    padding: `${SP.sm}px ${SP.lg + 2}px`, borderRadius: RAD.lg,
    background: active ? `${tc.hex}22` : `rgba(255,255,255,${OP.bgSubtle - 0.02})`,
    border: `1px solid ${active ? tc.hex + "55" : `rgba(255,255,255,${OP.bgSubtle})`}`,
    ...label(TYPE.xs), color: active ? tc.hex : tx("var(--txt)", OP.tertiary - 0.07),
    cursor: active ? "pointer" : "default", transition: EASE.fast,
  });

  const entryCard = {
    display: "flex", gap: SP.md, padding: `${SP.md + 2}px ${SP.lg}px`,
    background: `rgba(${tc.rgb},.05)`, border: `1px solid rgba(${tc.rgb},.12)`,
    borderRadius: RAD.lg, marginBottom: SP.sm,
    boxShadow: "0 2px 12px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.04)",
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

  const inputCard = {
    background: `rgba(${tc.rgb},.06)`,
    border: `1px solid rgba(${tc.rgb},.18)`,
    borderRadius: RAD.lg, overflow: "hidden", marginBottom: SP.md + 2,
    boxShadow: `0 2px 20px rgba(0,0,0,.25), 0 0 0 1px rgba(${tc.rgb},.06) inset`,
  };

  const inputFooter = {
    padding: `${SP.sm + 1}px ${SP.md}px`, display: "flex",
    justifyContent: "flex-end", borderTop: `1px solid rgba(${tc.rgb},.1)`,
  };

  const sectionLabel = (mb = SP.sm) => ({
    ...label(TYPE.xs - 1), letterSpacing: LS.wide,
    color: tc.hex, marginBottom: mb,
  });

  const totalEntries = data.intent.length + data.grat.length + data.goals.length + data.reflect.length;
  const doneGoals = data.goals.filter((g) => g.done).length;

  const tabs = [
    { id: "intent", l: L("jr_tab_intent") },
    { id: "grat", l: L("jr_tab_grat") },
    { id: "goals", l: L("jr_tab_goals") },
    { id: "reflect", l: L("jr_tab_reflect") },
  ];

  return (
    <div style={{ minHeight: "100%", background: T.bg, paddingBottom: 100, position: "relative", transition: EASE.slow, overflowX: "hidden" }}>

      {/* Orb backgrounds */}
      <Orb style={{ top: -80, left: "50%", transform: "translateX(-50%)" }} color={tc.hex} opacity={0.18} w={320} h={320} />
      <Orb style={{ top: 200, right: -60 }} color={tc.hex} opacity={0.08} w={200} h={200} />
      <Orb style={{ bottom: 160, left: -60 }} color={T.o1} opacity={0.07} w={180} h={180} />

      {aiError && <p role="status">{lang === "ru" ? "Запись сохранена. ИИ-отклик сейчас недоступен." : "Entry saved. AI response is currently unavailable."}</p>}
      {/* AI reply card */}
      {(aiLoading || aiReply) && (
        <div style={{ position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)", zIndex: 200, width: "calc(100% - 48px)", maxWidth: 380, animation: "fadeUp .4s ease both" }}>
          <div style={{ background: "rgba(10,5,18,.92)", border: `1px solid rgba(${tc.rgb},.3)`, borderRadius: RAD.lg + 4, padding: `${SP.lg}px ${SP.xl}px`, backdropFilter: "blur(20px)", boxShadow: `0 8px 40px rgba(0,0,0,.5), 0 0 0 1px rgba(${tc.rgb},.1) inset` }}>
            {aiLoading ? (
              <div style={{ display: "flex", alignItems: "center", gap: SP.md }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: tc.hex, animation: "breathe 1.2s ease-in-out infinite" }} />
                <div style={{ fontFamily: FONT_SANS, fontSize: TYPE.sm, color: `rgba(${tc.rgb},.6)`, fontWeight: 300 }}>
                  {lang === "ru" ? "Анастасия читает..." : "Anastasia is reading..."}
                </div>
              </div>
            ) : (
              <div>
                <div style={{ ...label(TYPE.xs - 1), color: tc.hex, letterSpacing: ".2em", marginBottom: SP.sm }}>
                  ✦ {lang === "ru" ? "Анастасия" : "Anastasia"}
                </div>
                <div style={{ fontFamily: FONT_SANS, fontSize: TYPE.sm + 1, fontWeight: 300, lineHeight: 1.7, color: "rgba(245,235,230,.88)" }}>
                  {aiReply?.message}
                </div>
                <div onClick={() => setAiReply(null)} style={{ marginTop: SP.sm, ...label(TYPE.xs - 1), color: `rgba(${tc.rgb},.4)`, cursor: "pointer", textAlign: "right" }}>
                  {lang === "ru" ? "закрыть" : "close"}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Crystal burst animations */}
      {crystals.map((cr) => (
        <div key={cr.id} style={{ position: "fixed", bottom: 140, left: `${cr.x}%`, zIndex: 999, pointerEvents: "none", animation: "gemBurst 2s ease forwards", textAlign: "center" }}>
          <div style={{ fontSize: TYPE.xxl, color: "#F0D060", animation: "gemGlow .8s ease-in-out 2" }}>+1 ⟡</div>
        </div>
      ))}

      {/* Header */}
      <div style={{ padding: `50px ${SP.xl}px ${SP.lg}px`, position: "relative", zIndex: 1 }}>
        <div style={{ ...label(TYPE.xs - 1), letterSpacing: ".25em", color: tc.hex, marginBottom: SP.xs + 2 }}>{todayStr(lang)}</div>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 34, fontWeight: 300, lineHeight: 1.15, color: tx("var(--txt)", OP.primary + 0.03), marginBottom: SP.lg }}>
          {L("jr_journal")}
        </div>

        {/* Stats row */}
        {totalEntries > 0 && (
          <div style={{ display: "flex", gap: SP.sm, marginBottom: SP.lg }}>
            {[
              { n: data.intent.length, l: lang === "en" ? "intent" : "намер" },
              { n: data.grat.length,   l: lang === "en" ? "grat"  : "благ"  },
              { n: `${doneGoals}/${data.goals.length}`, l: lang === "en" ? "goals" : "целей" },
              { n: data.reflect.length,l: lang === "en" ? "refl"  : "рефл"  },
            ].map((s, i) => (
              <div key={i} style={{
                flex: 1, background: `rgba(${tc.rgb},.07)`, border: `1px solid rgba(${tc.rgb},.14)`,
                borderRadius: RAD.md, padding: `${SP.sm}px ${SP.xs}px`, textAlign: "center",
              }}>
                <div style={{ fontFamily: FONT_SERIF, fontSize: 20, fontWeight: 300, color: tc.hex, lineHeight: 1 }}>{s.n}</div>
                <div style={{ ...label(9), letterSpacing: ".06em", color: tx("var(--txt)", 0.35), marginTop: 3 }}>{s.l}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tab bar */}
        <div style={{ display: "flex", background: `rgba(${tc.rgb},.05)`, border: `1px solid rgba(${tc.rgb},.12)`, borderRadius: RAD.lg, padding: 3 }}>
          {tabs.map((t) => (
            <div key={t.id} onClick={() => { setTab(t.id); setText(""); }} style={{
              flex: 1, padding: `${TYPE.xs}px ${SP.xs}px`, textAlign: "center",
              ...label(TYPE.xs), letterSpacing: ".03em",
              borderRadius: RAD.md, cursor: "pointer",
              background: tab === t.id ? `${TAB_COLORS[t.id].hex}20` : "transparent",
              border: `1px solid ${tab === t.id ? TAB_COLORS[t.id].hex + "44" : "transparent"}`,
              color: tab === t.id ? TAB_COLORS[t.id].hex : tx("var(--txt)", OP.tertiary + 0.06),
              transition: "all .22s cubic-bezier(.34,1.56,.64,1)", minHeight: 40,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{t.l}</div>
          ))}
        </div>
      </div>

      {/* Question card */}
      <div style={{ margin: `0 ${SP.xl}px ${SP.md + 2}px`, padding: `${SP.lg}px ${SP.lg + 2}px`, background: `rgba(${tc.rgb},.07)`, border: `1px solid rgba(${tc.rgb},.16)`, borderRadius: RAD.lg, position: "relative", zIndex: 1, boxShadow: `0 0 20px rgba(${tc.rgb},.08)` }}>
        <div style={sectionLabel(SP.sm - 2)}>{L("jr_question")}</div>
        <div style={{ ...body(TYPE.lg), lineHeight: LH.loose - 0.05, color: tx("var(--txt)", OP.primary - 0.08) }}>
          {tab === "intent" && L("jr_q_intent")}
          {tab === "grat" && L("jr_q_grat")}
          {tab === "goals" && L("jr_q_goals")}
          {tab === "reflect" && L("jr_q_reflect")}
        </div>
      </div>

      <div style={{ padding: `0 ${SP.xl}px`, position: "relative", zIndex: 1 }}>

        {tab === "intent" && <>
          <div style={{ padding: `${SP.md + 1}px ${SP.lg + 2}px`, marginBottom: SP.md + 2, background: `linear-gradient(135deg,rgba(${tc.rgb},.08),rgba(255,255,255,.02))`, border: `1px solid rgba(${tc.rgb},.15)`, borderRadius: RAD.lg - 2 }}>
            <div style={sectionLabel(SP.sm)}>{L("jr_intent_format")}</div>
            <div style={{ ...body(TYPE.base), lineHeight: LH.loose + 0.05, color: tx("var(--txt)", OP.secondary + 0.2) }}>
              {L("jr_intent_hint_pre")}<span style={{ color: tc.hex }}>{L("jr_intent_hint_accent")}</span>{L("jr_intent_hint_post")}
            </div>
          </div>
          <div style={inputCard}>
            <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={L("jr_intent_ph")} rows={3} style={taStyle} />
            <div style={inputFooter}>
              <div onClick={() => addEntry("intent")} style={saveBtnStyle(text.trim())}>{L("jr_save")}</div>
            </div>
          </div>
          {data.intent.length === 0 && <EmptyState info={emptyInfo} color={tc.hex} rgb={tc.rgb} />}
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
          {data.grat.length === 0 && <EmptyState info={emptyInfo} color={tc.hex} rgb={tc.rgb} />}
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
          <div style={inputCard}>
            <input value={goalText} onChange={(e) => setGoalText(e.target.value)} placeholder={L("jr_goal_ph")} onKeyDown={(e) => e.key === "Enter" && addGoal()} style={{
              width: "100%", background: "transparent", border: "none", outline: "none",
              padding: `${SP.md + 2}px ${SP.lg}px`, ...body(TYPE.lg),
              color: tx("var(--txt)", OP.primary), WebkitAppearance: "none",
              boxSizing: "border-box", colorScheme: "dark",
            }} />
            <div style={inputFooter}>
              <div onClick={addGoal} style={saveBtnStyle(goalText.trim())}>{L("jr_add")}</div>
            </div>
          </div>
          {data.goals.length === 0 && <EmptyState info={emptyInfo} color={tc.hex} rgb={tc.rgb} />}
          {data.goals.map((g) => (
            <div key={g.id} style={{
              display: "flex", alignItems: "center", gap: SP.md + 1,
              padding: `${SP.md + 2}px ${SP.lg}px`,
              background: g.done ? `rgba(${tc.rgb},.06)` : `rgba(${tc.rgb},.04)`,
              border: `1px solid rgba(${tc.rgb},${g.done ? .2 : .1})`,
              borderRadius: RAD.md, marginBottom: SP.sm, transition: EASE.normal,
            }}>
              <div onClick={() => toggleGoal(g.id)} style={{
                width: TYPE.xxl, height: TYPE.xxl, borderRadius: RAD.full, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: g.done ? `${tc.hex}22` : `rgba(255,255,255,${OP.bgSubtle - 0.01})`,
                border: `1.5px solid ${g.done ? tc.hex : `rgba(255,255,255,${OP.bgMedium + 0.03})`}`,
                fontSize: TYPE.sm + 1, color: g.done ? tc.hex : tx("var(--txt)", OP.primary), cursor: "pointer",
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
          <div style={{ padding: SP.lg + 2, background: `rgba(${tc.rgb},.06)`, border: `1px solid rgba(${tc.rgb},.15)`, borderRadius: RAD.lg - 2, marginBottom: SP.md + 2 }}>
            <div style={{ ...label(TYPE.xs - 1), letterSpacing: ".18em", color: tc.hex, marginBottom: SP.md }}>{L("jr_state_after")}</div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {MOODS.map((pr, i) => (
                <div key={i} onClick={() => setMood(mood === i ? null : i)} style={{
                  textAlign: "center", cursor: "pointer",
                  opacity: mood === i ? 1 : OP.tertiary + 0.08,
                  transition: EASE.fast,
                  transform: mood === i ? "scale(1.18)" : "scale(1)",
                }}>
                  <div style={{ fontSize: TYPE.xxl - 2 }}>{pr[0]}</div>
                  <div style={{
                    ...label(TYPE.xs - 2), letterSpacing: ".1em",
                    color: mood === i ? tc.hex : tx("var(--txt)", OP.tertiary + 0.03),
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
          {data.reflect.length === 0 && <EmptyState info={emptyInfo} color={tc.hex} rgb={tc.rgb} />}
          {data.reflect.map((e) => (
            <div key={e.id} style={entryCard}>
              <div style={{ flex: 1 }}>
                <div style={entryTimestamp}>{fmtDate(e.ts, lang)}</div>
                {e.mood !== undefined && e.mood !== null && (
                  <div style={{ fontSize: SP.lg + 2, marginBottom: SP.xs + 2 }}>
                    {MOODS[e.mood]?.[0]}{" "}
                    <span style={{ ...label(TYPE.xs - 2), color: tx("var(--txt)", OP.tertiary + 0.03), verticalAlign: "middle" }}>{MOODS[e.mood]?.[1]}</span>
                  </div>
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

function EmptyState({ info, color, rgb }) {
  return (
    <div style={{
      textAlign: "center", padding: `${SP.xl + 4}px ${SP.xl}px`,
      background: `rgba(${rgb},.03)`, border: `1px dashed rgba(${rgb},.18)`,
      borderRadius: RAD.lg, marginBottom: SP.md,
    }}>
      <div style={{ fontSize: 28, color, opacity: 0.5, marginBottom: SP.sm }}>{info.icon}</div>
      <div style={{ fontFamily: FONT_SERIF, fontSize: 17, fontWeight: 300, color: tx("var(--txt)", 0.5), marginBottom: SP.xs }}>{info.title}</div>
      <div style={{ ...body(13), color: tx("var(--txt)", 0.28), lineHeight: LH.loose }}>{info.hint}</div>
    </div>
  );
}
