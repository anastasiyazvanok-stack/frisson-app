import { getPracticeCatalog } from '../data/practiceCatalog.js';
import { getPracticeState, formatTime } from '../lib/practiceState.js';
import { userStorage as localStorage } from "../lib/userStorage.js";
import { useState, useEffect, useRef, useCallback } from "react";
import { getEnergyLevel, themeLabel } from "../data/themes";
import { getSections, getRecommendations, getMoodMessages } from "../data/content";
import { getMoon, useGreeting } from "../utils/helpers";
import { t as tr, MONTHS_SHORT } from "../utils/i18n";
import { logEnergyTest } from "../data/psycap";
import EnergyTest from "./EnergyTest";
import { TYPE, SP, RAD, OP, LS, EASE, LH, FONT_SERIF, FONT_SANS, tx, label, body, heading, card as cardStyle, section } from "../utils/design";
import { AUDIO_URLS } from "../data/audioUrls";
import Orb from "./Orb";
import { LensMark } from "./Brand";
import { VERSION } from "../App";

export default function Home({ setScreen, theme, setTheme, eScore, setEScore, setEHist, pLog, setLibSec, THEMES, activity, userName, doMarkPractice, lang = "ru", goToMed }) {
  const T = THEMES[theme] || THEMES.full;
  const L = (k, ...a) => tr(lang, k, ...a);
  const moon = getMoon(lang);
  const gr = useGreeting(lang);
  const lv = eScore !== null ? getEnergyLevel(eScore, lang) : null;
  const [showTest, setShowTest] = useState(false);
  const MOOD_MESSAGES = getMoodMessages(lang);
  const SECTIONS = getSections(lang);
  const RECOMMENDATIONS = getRecommendations(lang);
  const msgList = MOOD_MESSAGES[theme] || MOOD_MESSAGES.full;
  const [msg, setMsg] = useState(() => msgList[Math.floor(Math.random() * msgList.length)]);
  const [showInfo, setShowInfo] = useState(false);
  const recsRef = useRef(null);

  const personal = getPracticeState();
  const catalog = getPracticeCatalog(lang);
  const recent = catalog.filter(m => personal.completed[m.id]).sort((a,b) => personal.completed[b.id].at-personal.completed[a.id].at).slice(0,3);
  const resume = catalog.filter(m => m.audio_url && personal.progress[m.id]?.position > 5).sort((a,b) => personal.progress[b.id].at-personal.progress[a.id].at)[0];
  // ─── Today's journal entry preview ───────────────────────────────────────
  const todayJournal = (() => {
    try {
      const d = JSON.parse(localStorage.getItem("frisson_journal")) || {};
      const today = new Date().toDateString();
      const all = [...(d.intent || []), ...(d.grat || []), ...(d.reflect || [])];
      const todayEntries = all.filter(e => e.ts && new Date(e.ts).toDateString() === today);
      if (!todayEntries.length) return null;
      todayEntries.sort((a, b) => b.ts - a.ts);
      return todayEntries[0].text?.slice(0, 60) || null;
    } catch { return null; }
  })();

  useEffect(() => {
    const list = getMoodMessages(lang)[theme] || getMoodMessages(lang).full;
    setMsg(list[Math.floor(Math.random() * list.length)]);
  }, [theme, lang]);

  const cards = [
    // One warm/cool family per card — brandbook: gold and lavender never share a gradient.
    { sub: L("card_sub_resource"), title: L("card_title_fill"), sec: "resource", bg: "#1D1015", blobs: [{ x: "55%", y: "20%", w: 175, h: 145, c: "rgba(178,70,31,.98)", b: 22 }, { x: "10%", y: "60%", w: 140, h: 115, c: "rgba(208,86,42,.85)", b: 18 }, { x: "74%", y: "68%", w: 110, h: 88, c: "rgba(227,154,60,.92)", b: 16 }] },
    { sub: L("card_sub_feminine"), title: L("card_title_fem"), sec: "feminine", bg: "#1A0A18", blobs: [{ x: "50%", y: "25%", w: 170, h: 155, c: "rgba(92,28,46,.98)", b: 22 }, { x: "12%", y: "62%", w: 140, h: 115, c: "rgba(59,21,51,.9)", b: 18 }, { x: "72%", y: "66%", w: 115, h: 92, c: "rgba(142,118,184,.82)", b: 16 }] },
    { sub: L("card_sub_receiving"), title: L("card_title_receive"), sec: "receiving", bg: "#1C0E06", blobs: [{ x: "48%", y: "22%", w: 165, h: 135, c: "rgba(243,206,114,.98)", b: 22 }, { x: "12%", y: "60%", w: 140, h: 110, c: "rgba(178,70,31,.92)", b: 18 }, { x: "74%", y: "66%", w: 112, h: 88, c: "rgba(227,154,60,.86)", b: 16 }] },
    { sub: L("card_sub_newlevel"), title: L("card_title_grow"), sec: "newlevel", bg: "#14101E", blobs: [{ x: "44%", y: "24%", w: 170, h: 140, c: "rgba(142,118,184,.98)", b: 22 }, { x: "10%", y: "58%", w: 142, h: 114, c: "rgba(185,169,218,.86)", b: 18 }, { x: "72%", y: "66%", w: 112, h: 88, c: "rgba(59,21,51,.9)", b: 16 }] },
  ];

  const streak = activity?.streak || 0;
  const circ = 2 * Math.PI * 38;

  const completeTest = (sc) => {
    setEScore(sc);
    logEnergyTest(sc);
    const months = MONTHS_SHORT[lang] || MONTHS_SHORT.ru;
    setEHist((h) => [...h, { score: sc, date: new Date().getDate() + " " + months[new Date().getMonth()] }].slice(-6));
    setShowTest(false);
  };

  if (showTest) return <EnergyTest T={T} lang={lang} onComplete={completeTest} onCancel={() => setShowTest(false)} />;

  return (
    <div style={{ minHeight: "100%", background: T.bg, paddingBottom: 100, position: "relative", transition: EASE.slow }}>
      <Orb style={{ top: -80, right: -100 }} color={T.o1} opacity={0.16} w={320} h={320} />
      <Orb style={{ bottom: 280, left: -80 }} color={T.o2} opacity={0.2} w={260} h={260} delay={3} />
      <Orb style={{ top: "40%", left: "50%", transform: "translateX(-50%)" }} color={T.o1} opacity={0.06} w={400} h={400} delay={6} />

      {/* ─── Info overlay ─── */}
      {showInfo && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(14,8,16,.96)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
          <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", padding: `50px ${SP.xl}px 60px` }}>
            <div style={{ width: "100%", maxWidth: 340 }}>
              <button type="button" onClick={() => setShowInfo(false)} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: `0 0 ${SP.xl}px`, touchAction: "manipulation", WebkitAppearance: "none" }}>
                <span style={{ fontSize: TYPE.base, color: `rgba(${T.ar},.5)` }}>←</span>
                <span style={{ ...label(TYPE.xs), color: `rgba(${T.ar},.5)`, letterSpacing: ".15em" }}>{lang === "ru" ? "Назад" : "Back"}</span>
              </button>
              <div style={{ ...label(TYPE.xs), letterSpacing: ".3em", color: T.accent, marginBottom: SP.sm, textAlign: "center" }}>✦ NECTAR ✦</div>
              <div style={{ ...heading(TYPE.xxl + 2), color: T.text, marginBottom: SP.xl, textAlign: "center", whiteSpace: "pre-line" }}>{lang === "ru" ? "Твоё пространство\nвнутреннего капитала" : "Your space of\ninner capital"}</div>
              {[
                { title: lang === "ru" ? "Что это?" : "What is it?", text: lang === "ru" ? "NECTAR — это приложение для работы с твоим внутренним ресурсом. Медитации, практики, дневник и трекер состояния помогают укреплять женственность, уходить из тревоги и наполняться каждый день." : "NECTAR is an app for working with your inner resource. Meditations, practices, journal and state tracker help strengthen femininity, release anxiety and fill up every day." },
                { title: lang === "ru" ? "Как пользоваться?" : "How to use?", text: lang === "ru" ? "1. Выбери настроение вверху — медитации подберутся под тебя\n2. Перейди в Библиотеку — слушай медитации\n3. Открой Орбиту — выбери сценарий и начни практику\n4. Веди Дневник — записывай состояния\n5. В Профиле отслеживай свою динамику" : "1. Choose your mood above — meditations will be tailored for you\n2. Go to Library — listen to meditations\n3. Open Orbit — choose a scenario and start practice\n4. Keep a Journal — record your states\n5. In Profile track your dynamics" },
                { title: lang === "ru" ? "Тест на ресурс" : "Resource test", text: lang === "ru" ? "Каждый день в Профиле проходи тест на психологическую энергию. Он сбрасывается каждое утро — так ты видишь свою динамику в реальном времени." : "Each day in Profile take the psychological energy test. It resets every morning — so you see your dynamics in real time." },
              ].map((item, i) => (
                <div key={i} style={{ padding: `${SP.md}px ${SP.lg}px`, background: `rgba(${T.ar},.06)`, border: `1px solid rgba(${T.ar},.12)`, borderRadius: RAD.lg, marginBottom: SP.md }}>
                  <div style={{ ...label(TYPE.xs), color: T.accent, letterSpacing: ".18em", marginBottom: SP.sm }}>{item.title}</div>
                  <div style={{ fontFamily: FONT_SERIF, fontSize: TYPE.sm + 1, lineHeight: 1.7, color: `rgba(${T.ar},.75)`, whiteSpace: "pre-line" }}>{item.text}</div>
                </div>
              ))}
              <button type="button" onClick={() => setShowInfo(false)} style={{ width: "100%", marginTop: SP.md, padding: `${SP.lg}px 0`, borderRadius: RAD.lg, background: T.dim, border: `1px solid ${T.border}`, ...label(TYPE.sm), letterSpacing: ".2em", color: T.text, cursor: "pointer", touchAction: "manipulation", WebkitAppearance: "none" }}>{lang === "ru" ? "Понятно" : "Got it"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Header ─── */}
      <div className="fu1" style={{ padding: `52px ${SP.page}px ${SP.xl}px`, position: "relative", zIndex: 1, textAlign: "center" }}>
        <div style={{ position: "absolute", top: SP.xl, right: SP.page }}>
          <button type="button" onClick={() => setShowInfo(true)} style={{ width: 30, height: 30, borderRadius: "50%", border: `1px solid rgba(${T.ar},.2)`, background: `rgba(${T.ar},.06)`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontFamily: FONT_SERIF, fontSize: 14, color: `rgba(${T.ar},.5)`, touchAction: "manipulation", WebkitAppearance: "none", padding: 0 }}>i</button>
        </div>
        <LensMark size={28} color={`rgb(${T.ar})`} opacity={0.35} style={{ marginBottom: SP.md }} />
        <div style={{ ...label(TYPE.xs), color: tx("var(--txt)", OP.tertiary - 0.04), letterSpacing: ".3em", marginBottom: SP.sm }}>{moon.n}</div>
        <div style={{ position: "relative", display: "inline-block", margin: `${SP.xs}px 0 ${SP.md}px` }}>
          <div className="moon-halo" style={{ position: "absolute", inset: -18, borderRadius: RAD.full, background: `radial-gradient(circle, rgba(${T.ar},.45), transparent 65%)`, filter: "blur(16px)", pointerEvents: "none" }} />
          <div style={{ fontSize: 44, lineHeight: 1, position: "relative", filter: `drop-shadow(0 0 8px rgba(${T.ar},.4))` }}>{moon.e}</div>
        </div>
        <div style={{ ...heading(30), color: T.text, marginBottom: SP.sm, letterSpacing: "0.01em" }}>{gr},<br/><span style={{ color: T.accent, filter: `drop-shadow(0 0 16px ${T.accent}44)` }}>{userName || "NECTAR"}</span></div>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 15, fontStyle: "italic", fontWeight: 300, lineHeight: 1.65, color: `rgba(${T.ar},.55)`, transition: EASE.slow, maxWidth: 300, margin: "0 auto", letterSpacing: "0.02em" }}>{msg}</div>
        <div style={{ ...label(TYPE.xs), color: `rgba(${T.ar},.14)`, marginTop: SP.md, letterSpacing: ".25em" }}>NECTAR v{VERSION}</div>
      </div>

      {/* ─── Energy Card ─── */}
      <div className="fu1 press-card glass-card" onClick={() => (lv ? setScreen("profile") : setShowTest(true))} style={{
        ...section(SP.lg), padding: `${SP.lg + 2}px ${SP.lg}px`,
        background: `rgba(${T.ar},.05)`, border: `1px solid rgba(${T.ar},.12)`,
        borderRadius: RAD.lg, display: "flex", alignItems: "center", gap: SP.lg, cursor: "pointer",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", right: -20, top: -20, width: 80, height: 80, borderRadius: "50%", background: `radial-gradient(circle, ${T.accent}18, transparent 70%)`, filter: "blur(14px)", pointerEvents: "none" }} />
        {lv ? (
          <div style={{ position: "relative", width: 48, height: 48, flexShrink: 0 }}>
            <svg width="48" height="48" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="24" cy="24" r="20" fill="none" stroke={`rgba(${T.ar},.08)`} strokeWidth="3" />
              <circle cx="24" cy="24" r="20" fill="none" stroke={T.accent} strokeWidth="3" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 20} strokeDashoffset={2 * Math.PI * 20 - (2 * Math.PI * 20 * eScore / 100)}
                style={{ transition: "stroke-dashoffset 1.4s ease", filter: `drop-shadow(0 0 4px ${T.accent}66)` }} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_SERIF, fontSize: 16, fontWeight: 300, color: T.text }}>{eScore}</div>
          </div>
        ) : (
          <div style={{ width: 48, height: 48, borderRadius: RAD.md, background: `rgba(${T.ar},.08)`, border: `1px solid rgba(${T.ar},.12)`, display: "flex", alignItems: "center", justifyContent: "center", ...body(TYPE.xl), color: T.accent, flexShrink: 0 }}>◈</div>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ ...label(TYPE.xs), color: tx("var(--txt)", OP.tertiary), marginBottom: SP.xs }}>{L("psych_energy")}</div>
          <div style={{ ...body(TYPE.lg), color: T.text }}>{lv ? lv.l : L("take_test")}</div>
          {lv && <div style={{ height: 3, background: `rgba(255,255,255,.05)`, borderRadius: 2, marginTop: SP.sm, overflow: "hidden" }}>
            <div className="pulse-glow" style={{ height: "100%", borderRadius: 2, background: `linear-gradient(90deg, ${T.accent}88, ${T.accent})`, width: `${eScore}%`, transition: "width 1.2s ease", "--glow-color": `${T.accent}55` }} />
          </div>}
        </div>
        <div style={{ width: 28, height: 28, borderRadius: RAD.full, background: `rgba(${T.ar},.08)`, border: `1px solid rgba(${T.ar},.14)`, display: "flex", alignItems: "center", justifyContent: "center", ...body(TYPE.sm), color: T.accent, flexShrink: 0 }}>→</div>
      </div>

      {/* ─── Mood Picker ─── */}
      <div className="fu2" style={{ ...section(SP.lg) }}>
        <div style={{ ...label(TYPE.xs), color: tx("var(--txt)", OP.tertiary - 0.04), marginBottom: SP.md, textAlign: "center", letterSpacing: ".25em" }}>{L("how_are_you")}</div>
        <div style={{ display: "flex", gap: 8 }}>
          {Object.entries(THEMES).map(([k, m]) => {
            const on = theme === k;
            // Themes with a second accent (currently only "full") get a richer two-tone
            // treatment on their chip instead of one flat wash — warm amber→gold instead of
            // a single muted fill.
            const rich = on && m.ar2;
            return (
              <div key={k} onClick={() => setTheme(k)} className="pc" style={{
                flex: 1, padding: `${SP.md + 2}px ${SP.xs}px ${SP.md}px`, borderRadius: RAD.lg - 2, textAlign: "center", cursor: "pointer",
                background: rich ? `linear-gradient(135deg, rgba(${m.ar},.42), rgba(${m.ar2},.32))` : on ? `rgba(${m.ar},.14)` : `rgba(255,255,255,.02)`,
                border: `1.5px solid ${rich ? m.accent2 + "CC" : on ? m.accent + "66" : "rgba(255,255,255,.06)"}`,
                boxShadow: rich
                  ? `0 0 34px rgba(${m.ar},.55), 0 0 18px rgba(${m.ar2},.45), inset 0 0 16px rgba(${m.ar2},.22)`
                  : on ? `0 0 20px rgba(${m.ar},.25), inset 0 0 12px rgba(${m.ar},.08)` : "none",
                transition: "all .3s cubic-bezier(.34,1.56,.64,1)",
                position: "relative", overflow: "hidden",
              }}>
                {on && <div style={{ position: "absolute", top: -6, left: "50%", transform: "translateX(-50%)", width: 20, height: 2, borderRadius: 2, background: rich ? m.accent2 : m.accent, boxShadow: `0 0 6px ${rich ? m.accent2 : m.accent}` }} />}
                <div style={{ fontSize: 24, marginBottom: SP.xs, transition: "transform .3s cubic-bezier(.34,1.56,.64,1)", transform: on ? "scale(1.15)" : "scale(1)", filter: rich ? `drop-shadow(0 0 10px rgba(${m.ar2},.85))` : on ? `drop-shadow(0 0 6px rgba(${m.ar},.5))` : "none" }}>{m.e}</div>
                <div style={{ ...label(TYPE.xs), fontSize: 9, color: rich ? m.accent2 : on ? m.accent : tx("var(--txt)", OP.tertiary), transition: "color .3s ease" }}>{themeLabel(k, lang)}</div>
              </div>
            );
          })}
        </div>
      </div>

      {(resume || recent.length > 0) && <section style={{ position: 'relative', zIndex: 1, padding: '0 24px 24px', color: tx('var(--txt)', .9) }}>
        {resume && <button type="button" onClick={() => goToMed(resume.id, 'home')} style={{ width: '100%', textAlign: 'left', padding: 18, borderRadius: 18, border: `1px solid rgba(${T.ar},.35)`, background: `rgba(${T.ar},.12)`, color: 'inherit', marginBottom: 22, cursor: 'pointer' }}>
          <div style={{ ...label(11), color: T.accent, marginBottom: 8 }}>{lang === 'ru' ? 'Продолжить практику' : 'Continue practice'} →</div>
          <div style={{ ...body(17) }}>{resume.title}</div>
          <div style={{ ...body(12), marginTop: 6, opacity: .7 }}>{formatTime(personal.progress[resume.id].position)}</div>
        </button>}
        {recent.length > 0 && <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ ...body(19) }}>{lang === 'ru' ? 'Вы уже прослушали' : 'You have listened to'}</div>
            <button type="button" onClick={() => { setLibSec('listened'); setScreen('library'); }} style={{ border: 0, background: 'transparent', color: T.accent, minHeight: 44, cursor: 'pointer' }}>{lang === 'ru' ? 'Показать все' : 'View all'}</button>
          </div>
          {recent.map(m => <button key={m.id} type="button" onClick={() => goToMed(m.id, 'home')} style={{ width: '100%', textAlign: 'left', padding: '14px 16px', marginBottom: 8, borderRadius: 14, border: `1px solid rgba(${T.ar},.15)`, background: `rgba(${T.ar},.04)`, color: 'inherit', fontFamily: FONT_SERIF, fontSize: 17, cursor: 'pointer' }}>✓ {m.title}</button>)}
        </>}
      </section>}
      {/* ─── Recommendations ─── */}
      <div ref={recsRef} className="fu3" style={{ padding: `0 ${SP.page}px ${SP.xl}px`, position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: SP.md }}>
          <div style={{ ...label(TYPE.xs), color: tx("var(--txt)", OP.tertiary), letterSpacing: ".2em" }}>{L("for_you_now")}</div>
          <span onClick={() => setScreen("library")} style={{ ...label(TYPE.xs), color: T.accent, cursor: "pointer" }}>{L("all")}</span>
        </div>
        {(RECOMMENDATIONS[theme] || RECOMMENDATIONS.full).map((r, ri) => {
          const sec = SECTIONS.find((s) => s.id === r.sec);
          const lc = r.free ? "rgba(243,206,114,.8)" : (sec?.color || T.accent);
          const isActive = false;
          const hasAudio = !!AUDIO_URLS[r.t];
          return (
            <div key={r.t} onClick={() => goToMed ? goToMed(r.t) : setScreen("library")} className="press-card glass-card" style={{
              display: "flex", alignItems: "center", gap: SP.md,
              padding: `${SP.md + 2}px ${SP.lg}px`,
              background: isActive ? `${lc}10` : `rgba(${T.ar},.04)`,
              border: `1px solid ${isActive ? lc + "44" : `rgba(${T.ar},.1)`}`,
              borderRadius: RAD.lg - 4, marginBottom: 8,
              cursor: "pointer", position: "relative", overflow: "hidden",
              animationDelay: `${ri * 0.06}s`,
            }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 2.5, background: `linear-gradient(to bottom, ${lc}, ${lc}33)`, borderRadius: "3px 0 0 3px" }} />
              <div style={{ width: 36, height: 36, borderRadius: RAD.md, background: `${lc}12`, border: `1px solid ${lc}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, ...body(TYPE.lg), color: lc }}>◦</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ ...body(TYPE.base), color: tx("var(--txt)", OP.primary), overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.t}</div>
                <div style={{ ...label(TYPE.xs), color: lc, marginTop: 2 }}>{r.s}</div>
              </div>
              <div
                onClick={(e) => { e.stopPropagation(); if (goToMed) goToMed(r.t); else setScreen("library"); }}
                style={{ width: 32, height: 32, borderRadius: RAD.full, background: `${lc}14`, border: `1px solid ${lc}55`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer" }}
              >
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 1.5L9.5 5.5L2 9.5V1.5Z" fill={lc}/></svg>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Section Cards ─── */}
      <div className="fu4" style={{ padding: `0 ${SP.page}px ${SP.xl}px`, position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: SP.md }}>
          <div style={{ ...label(TYPE.xs), color: tx("var(--txt)", OP.tertiary), letterSpacing: ".2em" }}>{L("states")}</div>
          <span onClick={() => setScreen("library")} style={{ ...label(TYPE.xs), color: T.accent, cursor: "pointer" }}>{L("all")}</span>
        </div>
        <div className="snap-x" style={{ display: "flex", gap: SP.md, overflowX: "auto", margin: `0 -${SP.page}px`, padding: `${SP.xs}px ${SP.page}px ${SP.sm}px` }}>
          {cards.map((c) => (
            <div key={c.title} onClick={() => { setLibSec(c.sec); setScreen("library"); }} className="pc" style={{
              minWidth: 165, height: 200, borderRadius: RAD.lg + 2, position: "relative", overflow: "hidden", flexShrink: 0, cursor: "pointer", background: c.bg,
              border: "1px solid rgba(255,255,255,.08)",
              boxShadow: "0 8px 32px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.06)",
            }}>
              {c.blobs.map((b, i) => (
                <div key={i} style={{ position: "absolute", left: b.x, top: b.y, width: b.w, height: b.h, transform: "translate(-50%,-50%)", borderRadius: `${48 + i * 7}% ${52 - i * 5}% ${55 - i * 3}% ${45 + i * 4}% / ${44 + i * 6}% ${56 - i * 4}% ${48 + i * 5}% ${52 - i * 3}%`, background: b.c, filter: `blur(${b.b}px)`, animation: `breathe ${8 + i * 2}s ${i * 1.5}s ease-in-out infinite` }} />
              ))}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,.88) 0%,rgba(0,0,0,.2) 45%,transparent 75%)" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(255,255,255,.04),transparent 50%)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: `${SP.lg}px ${SP.lg}px ${SP.lg + 2}px` }}>
                <div style={{ ...label(TYPE.xs), color: "rgba(255,255,255,.35)", marginBottom: SP.sm, letterSpacing: ".2em" }}>{c.sub}</div>
                <div style={{ ...heading(TYPE.xl + 1), color: "rgba(255,255,255,.94)", letterSpacing: "0.01em" }}>{c.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Situations CTA ─── */}
      <div className="fu3 press-card glass-card" onClick={() => setScreen("situations")} style={{
        ...section(SP.lg), padding: `${SP.lg + 4}px ${SP.page}px`,
        background: `rgba(${T.ar},.05)`, border: `1px solid rgba(${T.ar},.12)`,
        borderRadius: RAD.lg, display: "flex", alignItems: "center", gap: SP.lg, cursor: "pointer",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", left: -20, bottom: -20, width: 80, height: 80, borderRadius: "50%", background: `radial-gradient(circle, ${T.accent}12, transparent 70%)`, filter: "blur(14px)", pointerEvents: "none" }} />
        <div style={{ flex: 1 }}>
          <div style={{ ...body(TYPE.lg), color: T.text, marginBottom: SP.xs }}>{L("what_worries")}</div>
          <div style={{ ...label(TYPE.xs), color: tx("var(--txt)", OP.tertiary), textTransform: "none", letterSpacing: LS.normal, lineHeight: LH.normal }}>{L("situation_hint")}</div>
        </div>
        <div style={{ width: 28, height: 28, borderRadius: RAD.full, background: `rgba(${T.ar},.08)`, border: `1px solid rgba(${T.ar},.14)`, display: "flex", alignItems: "center", justifyContent: "center", ...body(TYPE.sm), color: T.accent, flexShrink: 0 }}>→</div>
      </div>

      {/* ─── Premium CTA ─── */}
      <div className="fu4 press-card" onClick={() => setScreen("sub")} style={{
        ...section(SP.xl), borderRadius: RAD.lg + 4, overflow: "hidden", cursor: "pointer",
        background: `linear-gradient(145deg,${T.gF},${T.gT})`,
        border: `1.5px solid rgba(${T.ar},.18)`,
        position: "relative",
        boxShadow: `0 8px 40px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.06)`,
      }}>
        <Orb style={{ top: -70, right: -70 }} color={T.o1} opacity={0.3} w={220} h={220} />
        <Orb style={{ bottom: -40, left: -40 }} color={T.o2} opacity={0.15} w={160} h={160} delay={4} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,255,255,.03), transparent 40%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, padding: `${SP.xl + 4}px ${SP.xl}px` }}>
          <div style={{ ...label(TYPE.xs), color: T.accent, marginBottom: SP.md, letterSpacing: ".3em" }}>{L("premium")}</div>
          <div style={{ ...heading(TYPE.xxl + 2), color: T.text, marginBottom: SP.xl, whiteSpace: "pre-line", letterSpacing: "0.01em" }}>{L("premium_title")}</div>
          <div style={{ borderTop: `1px solid rgba(255,255,255,.07)`, paddingTop: SP.lg, marginBottom: SP.lg }}>
            <div style={{ ...heading(32), color: T.text, lineHeight: 1, marginBottom: SP.sm }}>150 <span style={{ ...label(TYPE.sm), color: tx("var(--txt)", OP.tertiary), fontWeight: 300 }}>{L("per_month")}</span></div>
            <div style={{ ...label(TYPE.xs), color: T.accent, letterSpacing: ".15em" }}>{L("yearly_discount")}</div>
          </div>
          <div className="premium-shimmer" style={{
            width: "100%", padding: SP.md + 2, borderRadius: RAD.lg,
            textAlign: "center",
            background: `linear-gradient(135deg, ${T.accent}22, ${T.accent}11, ${T.accent}22)`,
            backgroundSize: "200% 100%",
            border: `1px solid ${T.accent}33`,
            ...label(TYPE.sm), color: tx("var(--txt)", OP.primary),
            boxShadow: `0 0 16px ${T.accent}18`,
          }}>{L("open_access")}</div>
        </div>
      </div>

      {/* ─── Journal CTA ─── */}
      <div className="fu5 press-card glass-card" onClick={() => setScreen("journal")} style={{
        ...section(SP.xl), padding: `${SP.lg + 4}px ${SP.page}px`,
        background: "linear-gradient(135deg,rgba(243,206,114,.06),rgba(92,28,46,.04))",
        border: "1px solid rgba(243,206,114,.14)",
        borderRadius: RAD.lg, display: "flex", alignItems: "center", gap: SP.md, cursor: "pointer",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", right: -20, top: -20, width: 60, height: 60, borderRadius: "50%", background: "radial-gradient(circle, rgba(243,206,114,.12), transparent 70%)", filter: "blur(12px)", pointerEvents: "none" }} />
        <div style={{ width: 36, height: 36, borderRadius: RAD.md, background: "rgba(243,206,114,.08)", border: "1px solid rgba(243,206,114,.18)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_SERIF, fontSize: 16, color: "rgba(243,206,114,.6)", flexShrink: 0 }}>✎</div>
        <div style={{ flex: 1 }}>
          <div style={{ ...body(TYPE.lg), color: T.text, marginBottom: SP.xs }}>{L("journal")}</div>
          <div style={{ ...label(TYPE.xs), color: tx("var(--txt)", todayJournal ? OP.secondary : OP.tertiary), textTransform: "none", letterSpacing: LS.normal }}>
            {todayJournal ? `${todayJournal}${todayJournal.length >= 60 ? "…" : ""}` : L("no_entry_today")}
          </div>
        </div>
        <div style={{ width: 28, height: 28, borderRadius: RAD.full, background: "rgba(243,206,114,.06)", border: "1px solid rgba(243,206,114,.14)", display: "flex", alignItems: "center", justifyContent: "center", ...body(TYPE.sm), color: "rgba(243,206,114,.4)", flexShrink: 0 }}>→</div>
      </div>
    </div>
  );
}
