import { useState, useEffect } from "react";
import { THEMES } from "../data/themes";
import { FONT_SERIF, FONT_SANS } from "../utils/helpers";

const STORAGE_KEY = "frisson_journal";

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { intent: [], grat: [], goals: [], reflect: [] }; }
  catch { return { intent: [], grat: [], goals: [], reflect: [] }; }
}
function save(data) { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }

function fmtDate(ts) {
  const d = new Date(ts);
  const day = d.getDate();
  const mon = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"][d.getMonth()];
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${day} ${mon} · ${h}:${m}`;
}

function todayStr() {
  const d = new Date();
  const day = d.getDate();
  const mon = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"][d.getMonth()];
  return `${day} ${mon} ${d.getFullYear()}`;
}

export default function Journal({ theme }) {
  const T = THEMES[theme] || THEMES.full;
  const [tab, setTab] = useState("intent");
  const [data, setData] = useState(load);
  const [text, setText] = useState("");
  const [mood, setMood] = useState(null);
  const [crystals, setCrystals] = useState([]);
  const [goalText, setGoalText] = useState("");

  useEffect(() => { save(data); }, [data]);

  const pop = () => { const id = Date.now(); setCrystals((p) => [...p, { id, x: Math.random() * 60 + 20 }]); setTimeout(() => setCrystals((p) => p.filter((c) => c.id !== id)), 1200); };

  const addEntry = (section, content, extra) => {
    if (!content.trim()) return;
    const entry = { id: Date.now(), text: content.trim(), ts: Date.now(), ...extra };
    setData((d) => ({ ...d, [section]: [entry, ...d[section]] }));
    setText("");
    pop();
  };

  const delEntry = (section, id) => {
    setData((d) => ({ ...d, [section]: d[section].filter((e) => e.id !== id) }));
  };

  const addGoal = () => {
    if (!goalText.trim()) return;
    const entry = { id: Date.now(), text: goalText.trim(), ts: Date.now(), done: false };
    setData((d) => ({ ...d, goals: [entry, ...d.goals] }));
    setGoalText("");
    pop();
  };

  const toggleGoal = (id) => {
    setData((d) => ({ ...d, goals: d.goals.map((g) => g.id === id ? { ...g, done: !g.done } : g) }));
  };

  const addReflect = () => {
    if (!text.trim() && !mood) return;
    const entry = { id: Date.now(), text: text.trim(), ts: Date.now(), mood };
    setData((d) => ({ ...d, reflect: [entry, ...d.reflect] }));
    setText("");
    setMood(null);
    pop();
  };

  const moods = [["🌑", "Пусто"], ["🌒", "Тихо"], ["🌕", "Полна"], ["🔥", "В силе"]];

  const EntryCard = ({ entry, section, accent }) => (
    <div style={{ display: "flex", gap: 12, padding: "14px 16px", background: T.card, border: `1px solid ${T.border}`, borderRadius: 15, marginBottom: 8, position: "relative" }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: FONT_SANS, fontSize: 8, color: "rgba(242,232,226,.3)", marginBottom: 5 }}>{fmtDate(entry.ts)}</div>
        {entry.mood !== undefined && entry.mood !== null && (
          <div style={{ fontSize: 18, marginBottom: 6 }}>{moods[entry.mood]?.[0]} <span style={{ fontFamily: FONT_SANS, fontSize: 8, color: "rgba(242,232,226,.35)", verticalAlign: "middle" }}>{moods[entry.mood]?.[1]}</span></div>
        )}
        <div style={{ fontFamily: FONT_SERIF, fontSize: 15, lineHeight: 1.65, color: "rgba(230,218,210,.85)" }}>{entry.text}</div>
      </div>
      <div onClick={() => delEntry(section, entry.id)} style={{ cursor: "pointer", fontSize: 14, color: "rgba(242,232,226,.2)", flexShrink: 0, padding: "0 2px", alignSelf: "flex-start" }}>×</div>
    </div>
  );

  const TextInput = ({ val, set, ph, onSave }) => (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden", marginBottom: 8 }}>
      <textarea value={val} onChange={(e) => set(e.target.value)} placeholder={ph} style={{ width: "100%", minHeight: 72, background: "transparent", border: "none", outline: "none", resize: "none", padding: "14px 16px", fontFamily: FONT_SERIF, fontSize: 15, color: "rgba(242,232,226,.85)", lineHeight: 1.65 }} />
      <div style={{ padding: "8px 12px", display: "flex", justifyContent: "flex-end", borderTop: `1px solid ${T.border}` }}>
        <div onClick={onSave} style={{ padding: "7px 18px", borderRadius: 20, background: val.trim() ? T.dim : "rgba(255,255,255,.04)", border: `1px solid ${val.trim() ? T.accent : "rgba(255,255,255,.08)"}`, fontFamily: FONT_SANS, fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: val.trim() ? "rgba(242,232,226,.82)" : "rgba(242,232,226,.25)", cursor: val.trim() ? "pointer" : "default", transition: "all .2s" }}>Сохранить →</div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100%", background: T.bg, paddingBottom: 20, position: "relative", transition: "background .6s" }}>
      {crystals.map((cr) => (
        <div key={cr.id} style={{ position: "fixed", bottom: 120, left: `${cr.x}%`, zIndex: 999, pointerEvents: "none", animation: "floatUp 1.1s ease forwards", fontFamily: FONT_SERIF, fontSize: 22, color: T.accent, textShadow: `0 0 12px rgba(${T.ar},.8)` }}>+1 ⟡</div>
      ))}
      <div style={{ padding: "50px 24px 18px", position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".25em", textTransform: "uppercase", color: T.accent, marginBottom: 6 }}>{todayStr()}</div>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 32, fontWeight: 300, lineHeight: 1.15, color: "rgba(242,232,226,.95)", marginBottom: 20 }}>Дневник</div>
        <div style={{ display: "flex", background: T.card, border: `1px solid ${T.border}`, borderRadius: 13, padding: 3 }}>
          {[{ id: "intent", l: "Намерения" }, { id: "grat", l: "Благодарность" }, { id: "goals", l: "Цели ✦" }, { id: "reflect", l: "Рефлексия" }].map((t) => (
            <div key={t.id} onClick={() => { setTab(t.id); setText(""); }} style={{ flex: 1, padding: "10px 4px", textAlign: "center", fontSize: 10, letterSpacing: ".04em", textTransform: "uppercase", fontFamily: FONT_SANS, borderRadius: 11, cursor: "pointer", background: tab === t.id ? T.dim : "transparent", color: tab === t.id ? "rgba(242,232,226,.88)" : "rgba(242,232,226,.38)", transition: "all .3s", minHeight: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>{t.l}</div>
          ))}
        </div>
      </div>

      <div style={{ margin: "0 24px 18px", padding: "17px 20px", background: T.dim, border: `1px solid ${T.border}`, borderRadius: 18, position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: T.accent, marginBottom: 8 }}>✦ Вопрос дня</div>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 17, lineHeight: 1.65, color: "rgba(242,232,226,.82)" }}>
          {tab === "intent" && "«Каким я хочу быть сегодня? Пишу в настоящем времени.»"}
          {tab === "grat" && "«За что ты благодарна сегодня — себе и миру?»"}
          {tab === "goals" && "«Что я создаю в своей жизни прямо сейчас?»"}
          {tab === "reflect" && "«Что происходило внутри меня после практики?»"}
        </div>
      </div>

      <div style={{ padding: "0 24px", position: "relative", zIndex: 1 }}>
        {tab === "intent" && <>
          <div style={{ padding: "14px 18px", marginBottom: 14, background: `linear-gradient(135deg,${T.dim},rgba(255,255,255,.02))`, border: `1px solid ${T.border}`, borderRadius: 18 }}>
            <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: T.accent, marginBottom: 8 }}>✦ Формат намерения</div>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 14, lineHeight: 1.75, color: "rgba(242,232,226,.75)" }}>Пишите в настоящем времени: <span style={{ color: T.accent }}>"Я есть", "У меня уже есть"</span>. Это фиксирует образ желаемого состояния.</div>
          </div>
          <TextInput val={text} set={setText} ph="Я есть... / У меня уже есть... / Я наполненная..." onSave={() => addEntry("intent", text)} />
          {data.intent.map((e) => <EntryCard key={e.id} entry={e} section="intent" accent={T.accent} />)}
        </>}

        {tab === "grat" && <>
          <TextInput val={text} set={setText} ph="Я благодарна себе за... / Я благодарна жизни за..." onSave={() => addEntry("grat", text)} />
          {data.grat.map((e) => <EntryCard key={e.id} entry={e} section="grat" accent="rgba(160,138,65,.8)" />)}
        </>}

        {tab === "goals" && <>
          <div style={{ padding: "16px 18px", marginBottom: 14, background: `linear-gradient(135deg,${T.dim},rgba(255,255,255,.02))`, border: `1px solid ${T.border}`, borderRadius: 18 }}>
            <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: T.accent, marginBottom: 10 }}>✦ Перед тем как писать цели</div>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 16, color: "rgba(242,232,226,.9)", marginBottom: 4 }}>Мои истинные цели</div>
            <div style={{ fontFamily: FONT_SANS, fontSize: 11, color: "rgba(242,232,226,.45)", lineHeight: 1.55 }}>Послушайте эту практику перед тем, как ставить цели.</div>
          </div>
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden", marginBottom: 14 }}>
            <input value={goalText} onChange={(e) => setGoalText(e.target.value)} placeholder="Новая цель..." onKeyDown={(e) => e.key === "Enter" && addGoal()} style={{ width: "100%", background: "transparent", border: "none", outline: "none", padding: "14px 16px", fontFamily: FONT_SERIF, fontSize: 15, color: "rgba(242,232,226,.85)" }} />
            <div style={{ padding: "8px 12px", display: "flex", justifyContent: "flex-end", borderTop: `1px solid ${T.border}` }}>
              <div onClick={addGoal} style={{ padding: "7px 18px", borderRadius: 20, background: goalText.trim() ? T.dim : "rgba(255,255,255,.04)", border: `1px solid ${goalText.trim() ? T.accent : "rgba(255,255,255,.08)"}`, fontFamily: FONT_SANS, fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: goalText.trim() ? "rgba(242,232,226,.82)" : "rgba(242,232,226,.25)", cursor: goalText.trim() ? "pointer" : "default" }}>Добавить →</div>
            </div>
          </div>
          {data.goals.map((g) => (
            <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 13, padding: "14px 16px", background: g.done ? T.dim : T.card, border: `1px solid ${T.border}`, borderRadius: 14, marginBottom: 8, transition: "all .3s" }}>
              <div onClick={() => toggleGoal(g.id)} style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: g.done ? T.dim : "rgba(255,255,255,.05)", border: `1.5px solid ${g.done ? T.accent : "rgba(255,255,255,.15)"}`, fontSize: 13, color: "rgba(242,232,226,.9)", cursor: "pointer" }}>{g.done ? "✦" : "○"}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FONT_SANS, fontSize: 8, color: "rgba(242,232,226,.3)", marginBottom: 3 }}>{fmtDate(g.ts)}</div>
                <div style={{ fontFamily: FONT_SERIF, fontSize: 13, color: "rgba(230,218,210,.88)", lineHeight: 1.35, textDecoration: g.done ? "line-through" : "none", opacity: g.done ? 0.5 : 1 }}>{g.text}</div>
              </div>
              <div onClick={() => delEntry("goals", g.id)} style={{ cursor: "pointer", fontSize: 14, color: "rgba(242,232,226,.2)", flexShrink: 0, padding: "0 2px" }}>×</div>
            </div>
          ))}
        </>}

        {tab === "reflect" && <>
          <div style={{ padding: 18, background: T.card, border: `1px solid ${T.border}`, borderRadius: 18, marginBottom: 14 }}>
            <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(242,232,226,.38)", marginBottom: 12 }}>Состояние после практики</div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {moods.map((pr, i) => (
                <div key={i} onClick={() => setMood(mood === i ? null : i)} style={{ textAlign: "center", cursor: "pointer", opacity: mood === i ? 1 : 0.4, transition: "all .2s", transform: mood === i ? "scale(1.15)" : "scale(1)" }}>
                  <div style={{ fontSize: 26 }}>{pr[0]}</div>
                  <div style={{ fontSize: 8, letterSpacing: ".1em", textTransform: "uppercase", color: mood === i ? T.accent : "rgba(242,232,226,.35)", fontFamily: FONT_SANS, marginTop: 5 }}>{pr[1]}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase", color: "rgba(242,232,226,.4)", marginBottom: 8 }}>✦ Инсайты, мысли, идеи</div>
          <TextInput val={text} set={setText} ph="Что я почувствовала во время практики? Какие образы, мысли, идеи пришли?" onSave={addReflect} />
          {data.reflect.map((e) => <EntryCard key={e.id} entry={e} section="reflect" />)}
        </>}
      </div>
    </div>
  );
}
