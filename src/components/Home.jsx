import { useState, useEffect } from "react";
import { getEnergyLevel, themeLabel } from "../data/themes";
import { getSections, getRecommendations, getMoodMessages } from "../data/content";
import { getMoon, useGreeting } from "../utils/helpers";
import { t as tr } from "../utils/i18n";
import { TYPE, SP, RAD, OP, LS, EASE, LH, FONT_SERIF, FONT_SANS, tx, label, body, heading, card as cardStyle, section } from "../utils/design";
import Orb from "./Orb";
import Lock from "./Lock";
import { VERSION } from "../App";

export default function Home({ setScreen, theme, setTheme, eScore, pLog, setLibSec, THEMES, activity, userName, doMarkPractice, lang = "ru" }) {
  const T = THEMES[theme] || THEMES.full;
  const L = (k, ...a) => tr(lang, k, ...a);
  const moon = getMoon(lang);
  const gr = useGreeting(lang);
  const lv = eScore !== null ? getEnergyLevel(eScore, lang) : null;
  const MOOD_MESSAGES = getMoodMessages(lang);
  const SECTIONS = getSections(lang);
  const RECOMMENDATIONS = getRecommendations(lang);
  const msgList = MOOD_MESSAGES[theme] || MOOD_MESSAGES.full;
  const [msg, setMsg] = useState(() => msgList[Math.floor(Math.random() * msgList.length)]);
  useEffect(() => {
    const list = getMoodMessages(lang)[theme] || getMoodMessages(lang).full;
    setMsg(list[Math.floor(Math.random() * list.length)]);
  }, [theme, lang]);

  const cards = [
    { sub: L("card_sub_resource"), title: L("card_title_fill"), sec: "resource", bg: "#180804", blobs: [{ x: "55%", y: "20%", w: 175, h: 145, c: "rgba(240,120,40,.95)", b: 22 }, { x: "10%", y: "60%", w: 140, h: 115, c: "rgba(160,140,200,.7)", b: 18 }, { x: "74%", y: "68%", w: 110, h: 88, c: "rgba(255,150,80,.8)", b: 16 }] },
    { sub: L("card_sub_feminine"), title: L("card_title_fem"), sec: "feminine", bg: "#1a041c", blobs: [{ x: "50%", y: "25%", w: 170, h: 155, c: "rgba(230,77,168,.95)", b: 22 }, { x: "12%", y: "62%", w: 140, h: 115, c: "rgba(160,80,220,.75)", b: 18 }, { x: "72%", y: "66%", w: 115, h: 92, c: "rgba(255,140,180,.7)", b: 16 }] },
    { sub: L("card_sub_receiving"), title: L("card_title_receive"), sec: "receiving", bg: "#1c0a04", blobs: [{ x: "48%", y: "22%", w: 165, h: 135, c: "rgba(255,175,50,.95)", b: 22 }, { x: "12%", y: "60%", w: 140, h: 110, c: "rgba(220,90,40,.8)", b: 18 }, { x: "74%", y: "66%", w: 112, h: 88, c: "rgba(180,60,120,.6)", b: 16 }] },
    { sub: L("card_sub_newlevel"), title: L("card_title_grow"), sec: "newlevel", bg: "#0c0820", blobs: [{ x: "44%", y: "24%", w: 170, h: 140, c: "rgba(159,123,216,.95)", b: 22 }, { x: "10%", y: "58%", w: 142, h: 114, c: "rgba(200,140,180,.75)", b: 18 }, { x: "72%", y: "66%", w: 112, h: 88, c: "rgba(120,80,200,.7)", b: 16 }] },
  ];

  return (
    <div style={{ minHeight: "100%", background: T.bg, paddingBottom: 100, position: "relative", transition: EASE.slow }}>
      <Orb style={{ top: -60, right: -80 }} color={T.o1} opacity={0.14} w={280} h={280} />
      <Orb style={{ bottom: 300, left: -60 }} color={T.o2} opacity={0.18} w={240} h={240} delay={3} />

      {/* ─── Header ─── */}
      <div className="fu1" style={{ padding: `48px ${SP.page}px ${SP.lg}px`, position: "relative", zIndex: 1, textAlign: "center" }}>
        <img src="./brand/ornament-white.png" alt="" style={{ width: 32, height: "auto", opacity: 0.25, marginBottom: SP.sm }} />
        <div style={{ ...label(TYPE.xs), color: tx("var(--txt)", OP.tertiary), marginBottom: SP.xs }}>{moon.n}</div>
        <div style={{ position: "relative", display: "inline-block", margin: `${SP.xs}px 0` }}>
          <div className="moon-halo" style={{ position: "absolute", inset: -14, borderRadius: RAD.full, background: `radial-gradient(circle, rgba(${T.ar},.4), transparent 70%)`, filter: "blur(14px)", pointerEvents: "none" }} />
          <div style={{ fontSize: 40, lineHeight: 1, position: "relative" }}>{moon.e}</div>
        </div>
        <div style={{ ...heading(TYPE.xxl), color: T.text, marginBottom: SP.xs }}>{gr},<br/><span style={{ color: T.accent }}>{userName || "Frisson"}</span></div>
        <div style={{ ...body(TYPE.base), color: `rgba(${T.ar},.6)`, transition: EASE.slow }}>{msg}</div>
        <div style={{ ...label(TYPE.xs), color: `rgba(${T.ar},.18)`, marginTop: SP.sm }}>Frisson v{VERSION}</div>
      </div>

      {/* ─── Streak + Practice ─── */}
      <div className="fu1" style={{ ...section(SP.lg), display: "flex", gap: SP.sm }}>
        <div style={{ flex: 1, ...cardStyle(T), display: "flex", alignItems: "center", gap: SP.md }}>
          <div style={{ fontSize: 22 }}>🔥</div>
          <div>
            <div style={{ ...heading(TYPE.lg), color: T.text, lineHeight: 1 }}>{activity?.streak || 0}</div>
            <div style={{ ...label(TYPE.xs), color: tx("var(--txt)", OP.tertiary) }}>{(activity?.streak || 0) === 1 ? L("day") : L("day_streak")}</div>
          </div>
        </div>
        <div onClick={() => { if (!activity?.todayDone) doMarkPractice(0); }} style={{ flex: 1, ...cardStyle(T), background: activity?.todayDone ? `${T.accent}14` : T.card, border: `1px solid ${activity?.todayDone ? T.accent + "30" : T.border}`, display: "flex", alignItems: "center", gap: SP.md, cursor: activity?.todayDone ? "default" : "pointer", transition: EASE.normal }}>
          <div style={{ fontSize: 22 }}>{activity?.todayDone ? "✦" : "○"}</div>
          <div>
            <div style={{ ...body(TYPE.sm), color: activity?.todayDone ? T.accent : T.text, lineHeight: LH.tight }}>{activity?.todayDone ? L("practice_done") : L("mark_practice")}</div>
            <div style={{ ...label(TYPE.xs), color: tx("var(--txt)", OP.tertiary) }}>{L("today")}</div>
          </div>
        </div>
      </div>

      {/* ─── Mood Picker ─── */}
      <div className="fu2" style={{ ...section(SP.lg) }}>
        <div style={{ ...label(TYPE.xs), color: tx("var(--txt)", OP.tertiary), marginBottom: SP.md, textAlign: "center" }}>{L("how_are_you")}</div>
        <div style={{ display: "flex", gap: SP.sm }}>
          {Object.entries(THEMES).map(([k, m]) => (
            <div key={k} onClick={() => setTheme(k)} className="pc" style={{
              flex: 1, padding: `${SP.md}px ${SP.xs}px`, borderRadius: RAD.md, textAlign: "center", cursor: "pointer",
              background: theme === k ? `rgba(${m.ar},.18)` : `rgba(255,255,255,.02)`,
              border: `1.5px solid ${theme === k ? m.accent : "rgba(255,255,255,.06)"}`,
              boxShadow: theme === k ? `0 0 16px rgba(${m.ar},.3)` : "none",
              transition: EASE.normal,
            }}>
              <div style={{ fontSize: 22, marginBottom: SP.xs }}>{m.e}</div>
              <div style={{ ...label(TYPE.xs), color: theme === k ? m.accent : tx("var(--txt)", OP.tertiary) }}>{themeLabel(k, lang)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Energy Card ─── */}
      <div className="fu2 press-card" onClick={() => setScreen("profile")} style={{ ...section(SP.lg), ...cardStyle(T), display: "flex", alignItems: "center", gap: SP.md, cursor: "pointer" }}>
        <div style={{ width: 38, height: 38, borderRadius: RAD.sm, background: T.dim, display: "flex", alignItems: "center", justifyContent: "center", ...body(TYPE.lg), color: T.accent, flexShrink: 0 }}>◈</div>
        <div style={{ flex: 1 }}>
          <div style={{ ...label(TYPE.xs), color: tx("var(--txt)", OP.tertiary), marginBottom: SP.xs }}>{L("psych_energy")}</div>
          <div style={{ ...body(TYPE.lg), color: T.text }}>{lv ? `${eScore} — ${lv.l}` : L("take_test_profile")}</div>
          <div style={{ height: 3, background: `rgba(255,255,255,.05)`, borderRadius: 2, marginTop: SP.sm, overflow: "hidden" }}>
            <div className={lv ? "pulse-glow" : ""} style={{ height: "100%", borderRadius: 2, background: T.accent, width: lv ? `${eScore}%` : "0%", transition: "width 1s ease", "--glow-color": `${T.accent}55` }} />
          </div>
        </div>
        <div style={{ ...body(TYPE.sm), color: T.accent }}>→</div>
      </div>

      {/* ─── Section Cards ─── */}
      <div className="fu3" style={{ padding: `0 ${SP.page}px ${SP.xl}px`, position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: SP.md }}>
          <div style={{ ...label(TYPE.xs), color: tx("var(--txt)", OP.tertiary) }}>{L("states")}</div>
          <span onClick={() => setScreen("library")} style={{ ...label(TYPE.xs), color: T.accent, cursor: "pointer" }}>{L("all")}</span>
        </div>
        <div style={{ display: "flex", gap: SP.md, overflowX: "auto", margin: `0 -${SP.page}px`, padding: `${SP.xs}px ${SP.page}px ${SP.sm}px` }}>
          {cards.map((c) => (
            <div key={c.title} onClick={() => { setLibSec(c.sec); setScreen("library"); }} className="pc" style={{ minWidth: 158, height: 190, borderRadius: RAD.lg, position: "relative", overflow: "hidden", flexShrink: 0, cursor: "pointer", background: c.bg, border: "1px solid rgba(255,255,255,.06)" }}>
              {c.blobs.map((b, i) => (
                <div key={i} style={{ position: "absolute", left: b.x, top: b.y, width: b.w, height: b.h, transform: "translate(-50%,-50%)", borderRadius: `${48 + i * 7}% ${52 - i * 5}% ${55 - i * 3}% ${45 + i * 4}% / ${44 + i * 6}% ${56 - i * 4}% ${48 + i * 5}% ${52 - i * 3}%`, background: b.c, filter: `blur(${b.b}px)` }} />
              ))}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,.85) 0%,rgba(0,0,0,.15) 50%,transparent 80%)" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: SP.lg }}>
                <div style={{ ...label(TYPE.xs), color: "rgba(255,255,255,.38)", marginBottom: SP.xs }}>{c.sub}</div>
                <div style={{ ...heading(TYPE.xl), color: "rgba(255,255,255,.92)" }}>{c.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Situations CTA ─── */}
      <div className="fu3 press-card" onClick={() => setScreen("situations")} style={{ ...section(SP.lg), padding: `${SP.lg}px ${SP.page}px`, background: T.dim, border: `1px solid ${T.border}`, borderRadius: RAD.md, display: "flex", alignItems: "center", gap: SP.lg, cursor: "pointer" }}>
        <div style={{ flex: 1 }}>
          <div style={{ ...body(TYPE.lg), color: T.text, marginBottom: SP.xs }}>{L("what_worries")}</div>
          <div style={{ ...label(TYPE.xs), color: tx("var(--txt)", OP.tertiary), textTransform: "none", letterSpacing: LS.normal, lineHeight: LH.normal }}>{L("situation_hint")}</div>
        </div>
        <div style={{ ...body(TYPE.lg), color: T.accent }}>→</div>
      </div>

      {/* ─── Recommendations ─── */}
      <div className="fu4" style={{ padding: `0 ${SP.page}px ${SP.xl}px`, position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: SP.md }}>
          <div style={{ ...label(TYPE.xs), color: tx("var(--txt)", OP.tertiary) }}>{L("for_you_now")}</div>
          <span onClick={() => setScreen("library")} style={{ ...label(TYPE.xs), color: T.accent, cursor: "pointer" }}>{L("all")}</span>
        </div>
        {(RECOMMENDATIONS[theme] || RECOMMENDATIONS.full).map((r) => {
          const sec = SECTIONS.find((s) => s.id === r.sec);
          const lc = r.free ? "rgba(160,130,50,.8)" : (sec?.color || T.accent);
          return (
            <div key={r.t} onClick={() => setScreen("library")} className="press-card" style={{ display: "flex", alignItems: "center", gap: SP.md, ...cardStyle(T), marginBottom: SP.sm, cursor: "pointer", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 2.5, background: lc, borderRadius: "2px 0 0 2px" }} />
              <div style={{ width: 34, height: 34, borderRadius: RAD.sm, background: `${lc}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, ...body(TYPE.lg), color: lc }}>◦</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ ...body(TYPE.base), color: tx("var(--txt)", OP.primary), overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.t}</div>
                <div style={{ ...label(TYPE.xs), color: lc }}>{r.s}</div>
              </div>
              {r.free ? <div style={{ width: 28, height: 28, borderRadius: RAD.full, background: `${lc}18`, border: `1px solid ${lc}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: tx("var(--txt)", OP.secondary) }}>▶</div> : <Lock />}
            </div>
          );
        })}
      </div>

      {/* ─── Premium CTA ─── */}
      <div className="fu4 press-card" onClick={() => setScreen("sub")} style={{ ...section(SP.xl), borderRadius: RAD.lg, overflow: "hidden", cursor: "pointer", background: `linear-gradient(145deg,${T.gF},${T.gT})`, border: `1.5px solid ${T.border}`, position: "relative" }}>
        <Orb style={{ top: -60, right: -60 }} color={T.o1} opacity={0.25} w={200} h={200} />
        <div style={{ position: "relative", zIndex: 1, padding: SP.xl }}>
          <div style={{ ...label(TYPE.xs), color: T.accent, marginBottom: SP.md }}>{L("premium")}</div>
          <div style={{ ...heading(TYPE.xxl), color: T.text, marginBottom: SP.lg, whiteSpace: "pre-line" }}>{L("premium_title")}</div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,.06)", paddingTop: SP.lg, marginBottom: SP.lg }}>
            <div style={{ ...heading(28), color: T.text, lineHeight: 1, marginBottom: SP.xs }}>150 <span style={{ ...label(TYPE.sm), color: tx("var(--txt)", OP.tertiary) }}>{L("per_month")}</span></div>
            <div style={{ ...label(TYPE.xs), color: T.accent }}>{L("yearly_discount")}</div>
          </div>
          <div style={{ width: "100%", padding: SP.md, borderRadius: RAD.md, textAlign: "center", background: T.dim, border: `1px solid ${T.border}`, ...label(TYPE.sm), color: tx("var(--txt)", OP.primary) }}>{L("open_access")}</div>
        </div>
      </div>

      {/* ─── Journal CTA ─── */}
      <div className="fu5 press-card" onClick={() => setScreen("journal")} style={{ ...section(SP.xl), padding: `${SP.lg}px ${SP.page}px`, background: "linear-gradient(135deg,rgba(160,130,50,.08),rgba(125,23,54,.06))", border: "1px solid rgba(160,138,65,.15)", borderRadius: RAD.md, display: "flex", alignItems: "center", gap: SP.md, cursor: "pointer" }}>
        <div style={{ flex: 1 }}>
          <div style={{ ...body(TYPE.lg), color: T.text, marginBottom: SP.xs }}>{L("journal")}</div>
          <div style={{ ...label(TYPE.xs), color: tx("var(--txt)", OP.tertiary), textTransform: "none", letterSpacing: LS.normal }}>{L("no_entry_today")}</div>
        </div>
        <div style={{ ...body(TYPE.base), color: "rgba(160,138,65,.4)" }}>→</div>
      </div>
    </div>
  );
}
