import { useState } from "react";
import { THEMES } from "../data/themes";
import { FONT_SERIF, FONT_SANS } from "../utils/helpers";

export default function Journal({ theme }) {
  const T = THEMES[theme] || THEMES.full;
  const [tab, setTab] = useState("intent");
  const [goals, setGoals] = useState([{ t: "Пройти медитацию «Внутренняя опора» 4 раза", done: false, p: 1 }]);
  const [iText, setIText] = useState("");
  const [ints, setInts] = useState(["Я наполненная, спокойная, уверенная в себе"]);
  const [gText, setGText] = useState("");
  const [grats, setGrats] = useState(["Я благодарна себе за то, что я здесь"]);
  const [rText, setRText] = useState("");
  const [crystals, setCrystals] = useState([]);

  const pop = () => {
    const id = Date.now();
    setCrystals((p) => [...p, { id, x: Math.random() * 60 + 20 }]);
    setTimeout(() => setCrystals((p) => p.filter((c) => c.id !== id)), 1200);
  };

  const addI = () => { if (iText.trim()) { setInts((p) => [...p, iText.trim()]); setIText(""); pop(); } };
  const addG = () => { if (gText.trim()) { setGrats((p) => [...p, gText.trim()]); setGText(""); pop(); } };

  const TA = ({ val, set, ph }) => (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden", marginBottom: 14 }}>
      <textarea value={val} onChange={(e) => set(e.target.value)} placeholder={ph} style={{
        width: "100%", minHeight: 80, padding: "14px 16px", background: "transparent", border: "none",
        outline: "none", resize: "none", fontFamily: FONT_SERIF, fontSize: 14, lineHeight: 1.7,
        color: "rgba(242,232,226,.85)", caretColor: T.accent,
      }} />
      <div style={{ padding: "8px 12px", display: "flex", justifyContent: "flex-end", borderTop: `1px solid ${T.border}` }}>
        <div onClick={tab === "reflect" ? () => { if (rText.trim()) { setRText(""); pop(); } } : tab === "intent" ? addI : addG} style={{
          padding: "7px 18px", borderRadius: 10, background: `${T.accent}22`, border: `1px solid ${T.accent}44`,
          fontFamily: FONT_SANS, fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase",
          color: T.accent, cursor: "pointer",
        }}>Сохранить</div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100%", background: T.bg, paddingBottom: 20, position: "relative", transition: "background .8s" }}>
      {crystals.map((cr) => (
        <div key={cr.id} style={{ position: "fixed", bottom: 120, left: `${cr.x}%`, fontSize: 22, animation: "floatUp 1.2s ease-out forwards", pointerEvents: "none", zIndex: 10 }}>✦</div>
      ))}

      <div style={{ padding: "50px 24px 18px", position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".25em", textTransform: "uppercase", color: `rgba(${T.ar},.4)`, marginBottom: 6 }}>дневник</div>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 32, fontWeight: 300, lineHeight: 1.15, color: "rgba(242,232,226,.95)", marginBottom: 18 }}>Мой день</div>

        <div style={{ display: "flex", background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden" }}>
          {[{ id: "intent", l: "Намерения" }, { id: "grat", l: "Благодарность" }, { id: "goals", l: "Цели ✦" }, { id: "reflect", l: "Рефлексия" }].map((t) => (
            <div key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: "12px 4px", textAlign: "center", cursor: "pointer",
              fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".08em", textTransform: "uppercase",
              color: tab === t.id ? T.accent : "rgba(242,232,226,.3)",
              background: tab === t.id ? T.dim : "transparent",
              transition: "all .3s",
            }}>{t.l}</div>
          ))}
        </div>
      </div>

      {/* Prompt */}
      <div style={{ margin: "0 24px 18px", padding: "17px 20px", background: T.dim, border: `1px solid ${T.border}`, borderRadius: 14 }}>
        <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: `rgba(${T.ar},.35)`, marginBottom: 6 }}>подсказка</div>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 17, lineHeight: 1.65, color: "rgba(242,232,226,.82)" }}>
          {tab === "intent" && "«Каким я хочу быть сегодня? Пишу в настоящем времени.»"}
          {tab === "grat" && "«За что ты благодарна сегодня — себе и миру?»"}
          {tab === "goals" && "«Что я создаю в своей жизни прямо сейчас?»"}
          {tab === "reflect" && "«Что происходило внутри меня после практики?»"}
        </div>
      </div>

      <div style={{ padding: "0 24px", position: "relative", zIndex: 1 }}>
        {tab === "intent" && (
          <>
            <div style={{ padding: "14px 18px", marginBottom: 14, background: `linear-gradient(135deg, ${T.card}, ${T.dim})`, borderRadius: 14, border: `1px solid ${T.border}` }}>
              <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: `rgba(${T.ar},.35)`, marginBottom: 8 }}>пример</div>
              <div style={{ fontFamily: FONT_SERIF, fontSize: 14, lineHeight: 1.75, color: "rgba(242,232,226,.5)" }}>Я спокойна. Я наполнена. Я притягиваю лучшее.</div>
            </div>
            {ints.map((txt, i) => (
              <div key={i} style={{ display: "flex", gap: 13, padding: "14px 16px", background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, marginBottom: 8 }}>
                <div style={{ fontFamily: FONT_SERIF, fontSize: 14, color: "rgba(200,160,180,.5)" }}>✦</div>
                <div style={{ fontFamily: FONT_SERIF, fontSize: 14, color: "rgba(242,232,226,.82)", lineHeight: 1.6 }}>{txt}</div>
              </div>
            ))}
            <TA val={iText} set={setIText} ph="Я есть... / У меня уже есть... / Я наполненная..." />
          </>
        )}

        {tab === "grat" && (
          <>
            {grats.map((txt, i) => (
              <div key={i} style={{ display: "flex", gap: 13, padding: "14px 16px", background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, marginBottom: 8 }}>
                <div style={{ fontFamily: FONT_SERIF, fontSize: 14, color: "rgba(160,138,65,.5)" }}>✦</div>
                <div style={{ fontFamily: FONT_SERIF, fontSize: 14, color: "rgba(242,232,226,.82)", lineHeight: 1.6 }}>{txt}</div>
              </div>
            ))}
            <TA val={gText} set={setGText} ph="Я благодарна себе за... / Я благодарна жизни за..." />
          </>
        )}

        {tab === "goals" && (
          <>
            <div style={{ padding: "16px 18px", marginBottom: 14, background: `linear-gradient(135deg, ${T.card}, ${T.dim})`, borderRadius: 14, border: `1px solid ${T.border}` }}>
              <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: `rgba(${T.ar},.35)`, marginBottom: 8 }}>медитационный марафон</div>
              <div style={{ fontFamily: FONT_SERIF, fontSize: 16, color: "rgba(242,232,226,.9)", marginBottom: 4 }}>Путь внутренней силы</div>
              <div style={{ fontFamily: FONT_SANS, fontSize: 11, color: "rgba(242,232,226,.45)", lineHeight: 1.5, marginBottom: 12 }}>18 медитаций · 30 дней · ваш темп</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: T.dim, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>✦</div>
                <div>
                  <div style={{ fontFamily: FONT_SANS, fontSize: 10, color: "rgba(242,232,226,.6)" }}>18 медитаций</div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: `rgba(${T.ar},.4)` }}>мои цели</div>
              <div style={{ fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: T.accent, fontFamily: FONT_SANS, cursor: "pointer" }}>+ Добавить</div>
            </div>
            {goals.map((g, i) => (
              <div key={i} onClick={() => { const n = [...goals]; n[i] = { ...n[i], done: !n[i].done }; setGoals(n); pop(); }} style={{
                display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
                background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, marginBottom: 8, cursor: "pointer",
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: g.done ? `${T.accent}22` : "transparent",
                  border: `1.5px solid ${g.done ? T.accent : "rgba(255,255,255,.12)"}`,
                  color: T.accent, fontSize: 12, transition: "all .3s",
                }}>{g.done && "✓"}</div>
                <div style={{ fontFamily: FONT_SERIF, fontSize: 13, color: "rgba(230,218,210,.88)", flex: 1, lineHeight: 1.5, textDecoration: g.done ? "line-through" : "none", opacity: g.done ? 0.5 : 1 }}>{g.t}</div>
                {g.done && <div style={{ fontSize: 11, color: T.accent, background: T.dim, padding: "3px 8px", borderRadius: 8 }}>✦</div>}
              </div>
            ))}
          </>
        )}

        {tab === "reflect" && (
          <>
            <div style={{ padding: 18, background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, marginBottom: 14 }}>
              <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase", color: `rgba(${T.ar},.35)`, marginBottom: 10 }}>моё состояние</div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {[["🌑", "Пусто"], ["🌘", "Тихо"], ["🌖", "Полна"], ["🔥", "В силе"]].map((pr, i) => (
                  <div key={i} style={{ textAlign: "center", cursor: "pointer" }}>
                    <div style={{ fontSize: 24, marginBottom: 4 }}>{pr[0]}</div>
                    <div style={{ fontFamily: FONT_SANS, fontSize: 8, color: "rgba(242,232,226,.35)" }}>{pr[1]}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase", color: `rgba(${T.ar},.35)`, marginBottom: 10 }}>свободная запись</div>
            <TA val={rText} set={setRText} ph="Что я почувствовала во время практики? Какие образы пришли?" />
          </>
        )}

        {/* History */}
        <div style={{ marginTop: 20 }}>
          <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: `rgba(${T.ar},.35)`, marginBottom: 12 }}>последние записи</div>
          {[["20 мар", "Благодарна за возможность выбирать...", "3 ✦"], ["19 мар", "Сегодня я почувствовала тепло...", "2 ✦"]].map((row, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,.04)" }}>
              <div style={{ fontSize: 10, color: "rgba(242,232,226,.4)", whiteSpace: "nowrap", minWidth: 50, fontFamily: FONT_SANS }}>{row[0]}</div>
              <div style={{ fontFamily: FONT_SERIF, fontSize: 13, color: "rgba(230,218,210,.65)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row[1]}</div>
              <div style={{ fontSize: 11, color: "rgba(160,138,65,.5)", flexShrink: 0 }}>{row[2]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
