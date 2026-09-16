// Full-screen energy test — extracted so it can be launched from both Home and Profile,
// not only Profile. Purely presentational: the parent owns eScore/eHist/logEnergyTest and
// receives the finished score via onComplete.
import { useState } from "react";
import { getTestQuestions } from "../data/content";
import { TYPE, SP, RAD, OP, FONT_SERIF, tx, label, body } from "../utils/design";
import { t as tr } from "../utils/i18n";
import Orb from "./Orb";

export default function EnergyTest({ T, lang = "ru", onComplete, onCancel }) {
  const L = (k, ...a) => tr(lang, k, ...a);
  const [tI, setTI] = useState(0);
  const [tA, setTA] = useState([]);
  const TEST_QUESTIONS = getTestQuestions(lang);

  return (
    <div style={{ minHeight: "100%", background: T.bg, position: "relative", overflow: "hidden" }}>
      <Orb style={{ top: -60, left: "50%", transform: "translateX(-50%)" }} color={T.o1} opacity={0.14} w={280} h={280} />
      <div style={{ padding: `50px ${SP.xl}px 40px`, position: "relative", zIndex: 1 }}>
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: SP.xl }}>
          <div onClick={onCancel} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
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
            onComplete(sc);
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
}
