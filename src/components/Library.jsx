import { useState, useEffect } from "react";
// THEMES passed via props
import { getSections, getComingSoon, getBooks } from "../data/content";
import { TYPE, SP, RAD, OP, LS, EASE, LH, FONT_SERIF, FONT_SANS, tx, label, body, heading, card as cardStyle, section } from "../utils/design";
import { logMeditation } from "../data/psycap";
import Orb from "./Orb";
import Lock from "./Lock";
import { t as tr } from "../utils/i18n";

export default function Library({ setScreen, theme, initSec, initMed, clearMed, medFrom, clearMedFrom, THEMES, doMarkPractice, addGems, lang = "ru" }) {
  const T = THEMES[theme] || THEMES.full;
  const L = (k) => tr(lang, k);
  const SECTIONS = getSections(lang);
  const COMING_SOON = getComingSoon(lang);
  const BOOKS = getBooks(lang);
  const ALL_MEDS = SECTIONS.flatMap((s) => s.meds);
  const [det, setDet] = useState(() => {
    if (initMed) { const m = ALL_MEDS.find((x) => x.title === initMed); return m || null; }
    return null;
  });
  const [play, setPlay] = useState(false);
  const [prog, setProg] = useState(0);
  const [active, setActive] = useState(initSec || "all");

  useEffect(() => { setActive(initSec || "all"); }, [initSec]);
  useEffect(() => {
    if (initMed) {
      const m = ALL_MEDS.find((x) => x.title === initMed);
      if (m) setDet(m);
      if (clearMed) clearMed();
    }
  }, [initMed]);

  if (det) {
    const sec = SECTIONS.find((s) => s.meds && s.meds.some((m) => m.n === det.n));
    const ac = (sec && sec.color) || T.accent;
    return (
      <div style={{ minHeight: "100%", background: T.bg, paddingBottom: SP.page, transition: EASE.slow }}>
        <div onClick={() => {
          setDet(null); setPlay(false); setProg(0);
          if (medFrom) { setScreen(medFrom); if (clearMedFrom) clearMedFrom(); }
        }} style={{ padding: `${SP.page}px ${SP.xl}px ${SP.md}px`, display: "flex", alignItems: "center", gap: 9, cursor: "pointer", borderBottom: `1px solid ${T.border}` }}>
          <span style={{ fontSize: TYPE.base + 1, color: tx("var(--txt)", OP.secondary) }}>←</span>
          <span style={{ ...label(TYPE.sm - 1), color: tx("var(--txt)", OP.secondary) }}>{medFrom ? L("lib_back_to_nav") : L("back")}</span>
        </div>
        <div style={{ position: "relative", height: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: play ? 170 : 135, height: play ? 170 : 135, borderRadius: "50%", background: `radial-gradient(circle at 40% 35%,rgba(255,255,255,.3) 0%,${ac}cc 35%,${ac}44 70%,transparent 100%)`, filter: "blur(2px)", transition: "all 1.2s ease", animation: "breathe 4s ease-in-out infinite", boxShadow: `0 0 60px ${ac}66` }} />
        </div>
        <div style={{ padding: `0 ${SP.xl}px ${SP.xl}px` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: SP.md + 2 }}>
            <div style={{ padding: `5px ${SP.md + 2}px`, borderRadius: RAD.lg, background: `${ac}33`, border: `1px solid ${ac}66`, ...label(TYPE.xs), color: tx("var(--txt)", 0.8) }}>{L("lib_meditation")}</div>
            <div style={{ padding: `5px ${SP.md + 2}px`, borderRadius: RAD.lg, background: `rgba(255,255,255,${OP.bgSubtle})`, border: `1px solid rgba(255,255,255,.1)`, fontFamily: FONT_SANS, fontSize: TYPE.xs, color: tx("var(--txt)", OP.secondary + 0.05) }}>{det.dur}</div>
            {det.free && <div style={{ padding: `5px ${SP.md + 2}px`, borderRadius: RAD.lg, background: "rgba(160,138,65,.15)", border: "1px solid rgba(160,138,65,.3)", fontFamily: FONT_SANS, fontSize: TYPE.xs, color: "rgba(160,138,65,.85)" }}>{L("free")}</div>}
          </div>
          <div style={{ ...heading(TYPE.xxl - 2), color: tx("var(--txt)", OP.primary + 0.03), marginBottom: SP.lg }}>{det.title}</div>
          <div style={{ padding: `${SP.lg + 2}px ${SP.page}px`, background: `${ac}18`, border: `1px solid ${ac}30`, borderRadius: RAD.lg - 2, marginBottom: SP.lg }}>
            <div style={{ ...body(TYPE.base + 1), lineHeight: 1.8, color: tx("var(--txt)", 0.85) }}>{det.long || det.short}</div>
          </div>
          <div style={{ padding: `${SP.lg + 2}px ${SP.page}px`, background: `${ac}15`, border: `1px solid ${ac}35`, borderRadius: RAD.lg }}>
            <div style={{ marginBottom: SP.sm, cursor: "pointer" }} onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); setProg((e.clientX - r.left) / r.width * 100); }}>
              <div style={{ height: 3, background: "rgba(255,255,255,.1)", borderRadius: 2, overflow: "hidden" }}><div style={{ height: "100%", background: ac, borderRadius: 2, width: `${prog}%`, transition: "width .2s" }} /></div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", ...label(TYPE.xs), color: tx("var(--txt)", OP.tertiary + 0.03), marginBottom: SP.lg + 2 }}><span>00:00</span><span>{det.dur}</span></div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around" }}>
              <div style={{ fontSize: TYPE.xl - 2, color: tx("var(--txt)", OP.tertiary + 0.08), cursor: "pointer" }}>↺</div>
              <div style={{ fontSize: TYPE.sm, color: tx("var(--txt)", OP.tertiary + 0.08), cursor: "pointer", background: `rgba(255,255,255,${OP.bgSubtle})`, borderRadius: RAD.full, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>15</div>
              <div onClick={() => {
                if (!det.free) { setScreen("sub"); return; }
                const newPlay = !play;
                setPlay(newPlay);
                // First time pressing play in this session = start practice
                if (newPlay) {
                  logMeditation(det.title, "full");
                  if (doMarkPractice) doMarkPractice(parseInt(det.dur) || 20);
                  if (addGems) addGems(Math.max(1, parseInt(det.dur) || 20));
                }
              }} style={{ width: 60, height: 60, borderRadius: RAD.full, cursor: "pointer", background: `linear-gradient(135deg,${ac},${ac}88)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 24px ${ac}55`, fontSize: TYPE.xl - 2, color: "#fff" }}>{play ? "⏸" : "▶"}</div>
              <div style={{ fontSize: TYPE.sm, color: tx("var(--txt)", OP.tertiary + 0.08), cursor: "pointer", background: `rgba(255,255,255,${OP.bgSubtle})`, borderRadius: RAD.full, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>↻</div>
              <div style={{ fontSize: TYPE.base + 1, color: tx("var(--txt)", OP.tertiary + 0.08), cursor: "pointer" }}>AA</div>
            </div>
            {!det.free && <div onClick={() => setScreen("sub")} style={{ marginTop: SP.md + 2, textAlign: "center", ...label(TYPE.xs), color: ac, cursor: "pointer" }}>{L("lib_open_with_sub")}</div>}
          </div>
        </div>
      </div>
    );
  }

  const filters = [
    { id: "all", l: L("lib_filter_all"), c: tx("var(--txt)", OP.secondary + 0.05) },
    { id: "resource", l: L("lib_filter_resource"), c: "#F08838" },
    { id: "feminine", l: L("lib_filter_feminine"), c: "#E64DA8" },
    { id: "receiving", l: L("lib_filter_receiving"), c: "#FFAF32" },
    { id: "newlevel", l: L("lib_filter_growth"), c: "#9F7BD8" },
    { id: "self", l: L("lib_filter_self"), c: "#D080B0" },
  ];
  const vis = active === "all" ? SECTIONS : SECTIONS.filter((s) => s.id === active);

  return (
    <div style={{ minHeight: "100%", background: T.bg, paddingBottom: SP.page, position: "relative", transition: EASE.slow }}>
      <Orb style={{ top: -50, left: -60 }} color={T.o1} opacity={0.14} w={240} h={240} />
      <div style={{ padding: `50px ${SP.xl}px ${SP.lg + 2}px`, position: "relative", zIndex: 1 }}>
        <div style={{ ...label(9), letterSpacing: ".25em", color: T.accent, marginBottom: 6 }}>{L("lib_support_moment")}</div>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 36, fontWeight: 300, lineHeight: LH.tight - 0.1, color: tx("var(--txt)", OP.primary + 0.03), marginBottom: SP.lg + 2 }}>{L("lib_library")}</div>
        <div style={{ display: "flex", gap: 7, overflowX: "auto", margin: `0 -${SP.xl}px`, padding: `0 ${SP.xl}px ${SP.xs}px` }}>
          {filters.map((f) => (
            <div key={f.id} onClick={() => setActive(f.id)} style={{ padding: `${SP.sm}px ${SP.lg}px`, borderRadius: RAD.lg + 2, fontSize: TYPE.xs + 0.5, letterSpacing: LS.normal, whiteSpace: "nowrap", flexShrink: 0, cursor: "pointer", fontFamily: FONT_SANS, background: active === f.id ? `${f.c}30` : "rgba(255,255,255,.03)", border: `1.5px solid ${active === f.id ? f.c : "rgba(255,255,255,.08)"}`, color: active === f.id ? f.c : tx("var(--txt)", OP.tertiary + 0.08), boxShadow: active === f.id ? `0 0 12px ${f.c}44` : "none", transition: EASE.normal }}>{f.l}</div>
          ))}
        </div>
      </div>
      <div style={{ padding: `0 ${SP.xl}px`, position: "relative", zIndex: 1 }}>
        {vis.map((sec) => (
          <div key={sec.id} style={{ marginBottom: SP.xl + 2 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: SP.md + 1 }}>
              <div style={{ width: 11, height: 11, borderRadius: RAD.full, background: sec.color, boxShadow: `0 0 8px ${sec.color}88`, flexShrink: 0 }} />
              <div style={{ ...body(TYPE.base + 1), color: tx("var(--txt)", 0.82) }}>{sec.title}</div>
            </div>
            {sec.meds.map((med) => (
              <div key={med.n} onClick={() => setDet(med)} className="list-item press-card" style={{ display: "flex", alignItems: "flex-start", gap: SP.md, padding: `${SP.md + 1}px ${SP.md + 2}px`, background: T.card, border: `1px solid ${T.border}`, borderRadius: SP.lg, marginBottom: SP.sm, cursor: "pointer", position: "relative", overflow: "hidden", animationDelay: `${med.n * 0.05}s` }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: med.free ? "linear-gradient(to bottom,rgba(160,138,65,.9),rgba(160,138,65,.2))" : `linear-gradient(to bottom,${sec.color},${sec.color}22)`, borderRadius: "3px 0 0 3px" }} />
                <div style={{ fontFamily: FONT_SERIF, fontSize: TYPE.xl - 2, color: sec.color, width: 26, textAlign: "center", flexShrink: 0, lineHeight: 1, paddingTop: 2 }}>{med.n}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ ...body(TYPE.base), lineHeight: LH.tight + 0.1, color: tx("var(--txt)", OP.primary), marginBottom: 3 }}>{med.title}</div>
                  <div style={{ ...body(TYPE.sm), color: tx("var(--txt)", OP.secondary - 0.1), marginBottom: 5 }}>{med.short}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: SP.sm }}>
                    <span style={{ ...label(9), letterSpacing: ".1em", color: med.free ? "rgba(160,138,65,.8)" : sec.color }}>{med.free ? L("free") : L("lib_subscription")}</span>
                    <span style={{ fontSize: 9, color: tx("var(--txt)", OP.tertiary - 0.02) }}>·</span>
                    <span style={{ fontFamily: FONT_SANS, fontSize: 9, color: tx("var(--txt)", OP.tertiary + 0.06) }}>{med.dur}</span>
                  </div>
                </div>
                <div style={{ flexShrink: 0, marginTop: SP.xs }}>{med.free ? <div style={{ width: 26, height: 26, borderRadius: RAD.full, background: `${sec.color}33`, border: `1px solid ${sec.color}66`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: SP.sm, color: tx("var(--txt)", 0.8) }}>▶</div> : <Lock />}</div>
              </div>
            ))}
          </div>
        ))}
        {active === "all" && <>
          <div style={{ marginBottom: SP.xl + 2 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: SP.md + 1 }}><div style={{ width: 11, height: 11, borderRadius: RAD.full, background: tx("var(--txt)", OP.disabled + 0.02), flexShrink: 0 }} /><div style={{ ...body(TYPE.base + 1), color: tx("var(--txt)", OP.secondary - 0.1) }}>{L("lib_coming_soon")}</div></div>
            {COMING_SOON.map((m) => (
              <div key={m.n} style={{ display: "flex", alignItems: "flex-start", gap: SP.md, padding: `${SP.md + 1}px ${SP.md + 2}px`, background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.05)", borderRadius: SP.lg, marginBottom: SP.sm, opacity: 0.5 }}>
                <div style={{ fontFamily: FONT_SERIF, fontSize: TYPE.xl - 2, color: tx("var(--txt)", OP.tertiary - 0.07), width: 26, textAlign: "center", flexShrink: 0, paddingTop: 2 }}>{m.n}</div>
                <div style={{ flex: 1 }}><div style={{ ...body(TYPE.base), color: tx("var(--txt)", 0.5), marginBottom: 3 }}>{m.title}</div><div style={{ ...body(TYPE.sm), color: tx("var(--txt)", OP.tertiary - 0.04) }}>{m.short}</div></div>
                <div style={{ ...label(9), letterSpacing: ".1em", color: tx("var(--txt)", OP.disabled + 0.04), flexShrink: 0, marginTop: SP.xs }}>{L("lib_soon")}</div>
              </div>
            ))}
          </div>
          <div style={{ marginBottom: SP.xl + 2 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: SP.md + 1 }}><div style={{ width: 11, height: 11, borderRadius: RAD.full, background: "rgba(160,138,65,.8)", flexShrink: 0 }} /><div style={{ ...body(TYPE.base + 1), color: tx("var(--txt)", 0.82) }}>{L("lib_books")}</div></div>
            {BOOKS.map((b) => (
              <div key={b.id} style={{ display: "flex", alignItems: "flex-start", gap: SP.md, padding: `${SP.md + 1}px ${SP.md + 2}px`, background: T.card, border: `1px solid ${T.border}`, borderRadius: SP.lg, marginBottom: SP.sm, cursor: "pointer", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: b.free ? "linear-gradient(to bottom,rgba(160,138,65,.9),rgba(160,138,65,.2))" : "linear-gradient(to bottom,rgba(107,127,168,.9),rgba(107,127,168,.2))", borderRadius: "3px 0 0 3px" }} />
                <div style={{ fontFamily: FONT_SERIF, fontSize: TYPE.xl - 2, color: "rgba(160,138,65,.65)", width: 26, textAlign: "center", flexShrink: 0, paddingTop: 2 }}>◈</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ ...body(TYPE.base), lineHeight: LH.tight + 0.1, color: tx("var(--txt)", OP.primary), marginBottom: 3 }}>{b.title}</div>
                  <div style={{ ...body(TYPE.sm), color: tx("var(--txt)", OP.secondary - 0.1), marginBottom: 5 }}>{b.desc}</div>
                  <div style={{ ...label(9), letterSpacing: ".1em", color: b.free ? "rgba(160,138,65,.8)" : "rgba(107,127,168,.7)" }}>{b.free ? L("lib_book_free") : L("lib_book_sub")}</div>
                </div>
                {b.free ? <div style={{ width: 26, height: 26, borderRadius: RAD.full, background: "rgba(160,138,65,.15)", border: "1px solid rgba(160,138,65,.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: TYPE.xs, color: "rgba(160,138,65,.8)", flexShrink: 0 }}>→</div> : <Lock />}
              </div>
            ))}
          </div>
        </>}
      </div>
    </div>
  );
}
