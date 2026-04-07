import { useState, useEffect } from "react";
// THEMES passed via props
import { SECTIONS, COMING_SOON, BOOKS } from "../data/content";
import { FONT_SERIF, FONT_SANS } from "../utils/helpers";
import Orb from "./Orb";
import Lock from "./Lock";

export default function Library({ setScreen, theme, initSec, initMed, clearMed, medFrom, clearMedFrom, THEMES }) {
  const T = THEMES[theme] || THEMES.full;
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
      <div style={{ minHeight: "100%", background: T.bg, paddingBottom: 20, transition: "background .6s" }}>
        <div onClick={() => {
          setDet(null); setPlay(false); setProg(0);
          if (medFrom) { setScreen(medFrom); if (clearMedFrom) clearMedFrom(); }
        }} style={{ padding: "20px 24px 12px", display: "flex", alignItems: "center", gap: 9, cursor: "pointer", borderBottom: `1px solid ${T.border}` }}>
          <span style={{ fontSize: 15, color: "rgba(242,232,226,.45)" }}>←</span>
          <span style={{ fontSize: 11, letterSpacing: ".15em", textTransform: "uppercase", color: "rgba(242,232,226,.45)", fontFamily: FONT_SANS }}>{medFrom ? "Назад к навигатору" : "Назад"}</span>
        </div>
        <div style={{ position: "relative", height: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: play ? 170 : 135, height: play ? 170 : 135, borderRadius: "50%", background: `radial-gradient(circle at 40% 35%,rgba(255,255,255,.3) 0%,${ac}cc 35%,${ac}44 70%,transparent 100%)`, filter: "blur(2px)", transition: "all 1.2s ease", animation: "breathe 4s ease-in-out infinite", boxShadow: `0 0 60px ${ac}66` }} />
        </div>
        <div style={{ padding: "0 24px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ padding: "5px 14px", borderRadius: 20, background: `${ac}33`, border: `1px solid ${ac}66`, fontFamily: FONT_SANS, fontSize: 10, textTransform: "uppercase", letterSpacing: ".12em", color: "rgba(242,232,226,.8)" }}>Медитация</div>
            <div style={{ padding: "5px 14px", borderRadius: 20, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", fontFamily: FONT_SANS, fontSize: 10, color: "rgba(242,232,226,.6)" }}>{det.dur}</div>
            {det.free && <div style={{ padding: "5px 14px", borderRadius: 20, background: "rgba(160,138,65,.15)", border: "1px solid rgba(160,138,65,.3)", fontFamily: FONT_SANS, fontSize: 10, color: "rgba(160,138,65,.85)" }}>Бесплатно</div>}
          </div>
          <div style={{ fontFamily: FONT_SERIF, fontSize: 26, fontWeight: 300, lineHeight: 1.2, color: "rgba(242,232,226,.95)", marginBottom: 16 }}>{det.title}</div>
          <div style={{ padding: "18px 20px", background: `${ac}18`, border: `1px solid ${ac}30`, borderRadius: 18, marginBottom: 16 }}>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 15, lineHeight: 1.8, color: "rgba(242,232,226,.85)" }}>{det.long || det.short}</div>
          </div>
          <div style={{ padding: "18px 20px", background: `${ac}15`, border: `1px solid ${ac}35`, borderRadius: 20 }}>
            <div style={{ marginBottom: 8, cursor: "pointer" }} onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); setProg((e.clientX - r.left) / r.width * 100); }}>
              <div style={{ height: 3, background: "rgba(255,255,255,.1)", borderRadius: 2, overflow: "hidden" }}><div style={{ height: "100%", background: ac, borderRadius: 2, width: `${prog}%`, transition: "width .2s" }} /></div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT_SANS, fontSize: 10, color: "rgba(242,232,226,.35)", marginBottom: 18 }}><span>00:00</span><span>{det.dur}</span></div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around" }}>
              <div style={{ fontSize: 20, color: "rgba(242,232,226,.4)", cursor: "pointer" }}>↺</div>
              <div style={{ fontSize: 12, color: "rgba(242,232,226,.4)", cursor: "pointer", background: "rgba(255,255,255,.06)", borderRadius: "50%", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>15</div>
              <div onClick={() => { if (!det.free) { setScreen("sub"); return; } setPlay((p) => !p); }} style={{ width: 60, height: 60, borderRadius: "50%", cursor: "pointer", background: `linear-gradient(135deg,${ac},${ac}88)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 24px ${ac}55`, fontSize: 20, color: "#fff" }}>{play ? "⏸" : "▶"}</div>
              <div style={{ fontSize: 12, color: "rgba(242,232,226,.4)", cursor: "pointer", background: "rgba(255,255,255,.06)", borderRadius: "50%", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>↻</div>
              <div style={{ fontSize: 15, color: "rgba(242,232,226,.4)", cursor: "pointer" }}>AA</div>
            </div>
            {!det.free && <div onClick={() => setScreen("sub")} style={{ marginTop: 14, textAlign: "center", fontFamily: FONT_SANS, fontSize: 10, letterSpacing: ".15em", textTransform: "uppercase", color: ac, cursor: "pointer" }}>Открыть по подписке →</div>}
          </div>
        </div>
      </div>
    );
  }

  const filters = [
    { id: "all", l: "Все", c: "rgba(242,232,226,.6)" },
    { id: "resource", l: "Ресурс", c: "#B84010" },
    { id: "feminine", l: "Женское", c: "#8F4A91" },
    { id: "receiving", l: "Реализация", c: "#C47808" },
    { id: "newlevel", l: "Рост", c: "#0A5C5C" },
    { id: "self", l: "Самость", c: "#7D1736" },
  ];
  const vis = active === "all" ? SECTIONS : SECTIONS.filter((s) => s.id === active);

  return (
    <div style={{ minHeight: "100%", background: T.bg, paddingBottom: 20, position: "relative", transition: "background .6s" }}>
      <Orb style={{ top: -50, left: -60 }} color={T.o1} opacity={0.14} w={240} h={240} />
      <div style={{ padding: "50px 24px 18px", position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".25em", textTransform: "uppercase", color: T.accent, marginBottom: 6 }}>Поддержка в моменте</div>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 36, fontWeight: 300, lineHeight: 1.1, color: "rgba(242,232,226,.95)", marginBottom: 18 }}>Библиотека</div>
        <div style={{ display: "flex", gap: 7, overflowX: "auto", margin: "0 -24px", padding: "0 24px 4px" }}>
          {filters.map((f) => (
            <div key={f.id} onClick={() => setActive(f.id)} style={{ padding: "8px 16px", borderRadius: 22, fontSize: 10.5, letterSpacing: ".06em", whiteSpace: "nowrap", flexShrink: 0, cursor: "pointer", fontFamily: FONT_SANS, background: active === f.id ? `${f.c}30` : "rgba(255,255,255,.03)", border: `1.5px solid ${active === f.id ? f.c : "rgba(255,255,255,.08)"}`, color: active === f.id ? f.c : "rgba(242,232,226,.4)", boxShadow: active === f.id ? `0 0 12px ${f.c}44` : "none", transition: "all .3s" }}>{f.l}</div>
          ))}
        </div>
      </div>
      <div style={{ padding: "0 24px", position: "relative", zIndex: 1 }}>
        {vis.map((sec) => (
          <div key={sec.id} style={{ marginBottom: 26 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 13 }}>
              <div style={{ width: 11, height: 11, borderRadius: "50%", background: sec.color, boxShadow: `0 0 8px ${sec.color}88`, flexShrink: 0 }} />
              <div style={{ fontFamily: FONT_SERIF, fontSize: 15, color: "rgba(242,232,226,.82)" }}>{sec.title}</div>
            </div>
            {sec.meds.map((med) => (
              <div key={med.n} onClick={() => setDet(med)} className="list-item press-card" style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "13px 14px", background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, marginBottom: 8, cursor: "pointer", position: "relative", overflow: "hidden", animationDelay: `${med.n * 0.05}s` }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: med.free ? "linear-gradient(to bottom,rgba(160,138,65,.9),rgba(160,138,65,.2))" : `linear-gradient(to bottom,${sec.color},${sec.color}22)`, borderRadius: "3px 0 0 3px" }} />
                <div style={{ fontFamily: FONT_SERIF, fontSize: 20, color: sec.color, width: 26, textAlign: "center", flexShrink: 0, lineHeight: 1, paddingTop: 2 }}>{med.n}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: FONT_SERIF, fontSize: 14, color: "rgba(242,232,226,.92)", marginBottom: 3, lineHeight: 1.3 }}>{med.title}</div>
                  <div style={{ fontFamily: FONT_SERIF, fontSize: 12, color: "rgba(242,232,226,.45)", lineHeight: 1.5, marginBottom: 5 }}>{med.short}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: med.free ? "rgba(160,138,65,.8)" : sec.color }}>{med.free ? "Бесплатно" : "Подписка"}</span>
                    <span style={{ fontSize: 9, color: "rgba(242,232,226,.3)" }}>·</span>
                    <span style={{ fontFamily: FONT_SANS, fontSize: 9, color: "rgba(242,232,226,.38)" }}>{med.dur}</span>
                  </div>
                </div>
                <div style={{ flexShrink: 0, marginTop: 4 }}>{med.free ? <div style={{ width: 26, height: 26, borderRadius: "50%", background: `${sec.color}33`, border: `1px solid ${sec.color}66`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "rgba(242,232,226,.8)" }}>▶</div> : <Lock />}</div>
              </div>
            ))}
          </div>
        ))}
        {active === "all" && <>
          <div style={{ marginBottom: 26 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 13 }}><div style={{ width: 11, height: 11, borderRadius: "50%", background: "rgba(242,232,226,.2)", flexShrink: 0 }} /><div style={{ fontFamily: FONT_SERIF, fontSize: 15, color: "rgba(242,232,226,.45)" }}>Скоро в библиотеке</div></div>
            {COMING_SOON.map((m) => (
              <div key={m.n} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "13px 14px", background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.05)", borderRadius: 16, marginBottom: 8, opacity: 0.5 }}>
                <div style={{ fontFamily: FONT_SERIF, fontSize: 20, color: "rgba(242,232,226,.25)", width: 26, textAlign: "center", flexShrink: 0, paddingTop: 2 }}>{m.n}</div>
                <div style={{ flex: 1 }}><div style={{ fontFamily: FONT_SERIF, fontSize: 14, color: "rgba(242,232,226,.5)", marginBottom: 3 }}>{m.title}</div><div style={{ fontFamily: FONT_SERIF, fontSize: 12, color: "rgba(242,232,226,.28)", lineHeight: 1.5 }}>{m.short}</div></div>
                <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(242,232,226,.22)", flexShrink: 0, marginTop: 4 }}>скоро</div>
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 26 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 13 }}><div style={{ width: 11, height: 11, borderRadius: "50%", background: "rgba(160,138,65,.8)", flexShrink: 0 }} /><div style={{ fontFamily: FONT_SERIF, fontSize: 15, color: "rgba(242,232,226,.82)" }}>Книги</div></div>
            {BOOKS.map((b) => (
              <div key={b.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "13px 14px", background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, marginBottom: 8, cursor: "pointer", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: b.free ? "linear-gradient(to bottom,rgba(160,138,65,.9),rgba(160,138,65,.2))" : "linear-gradient(to bottom,rgba(107,127,168,.9),rgba(107,127,168,.2))", borderRadius: "3px 0 0 3px" }} />
                <div style={{ fontFamily: FONT_SERIF, fontSize: 20, color: "rgba(160,138,65,.65)", width: 26, textAlign: "center", flexShrink: 0, paddingTop: 2 }}>◈</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: FONT_SERIF, fontSize: 14, color: "rgba(242,232,226,.92)", marginBottom: 3, lineHeight: 1.3 }}>{b.title}</div>
                  <div style={{ fontFamily: FONT_SERIF, fontSize: 12, color: "rgba(242,232,226,.45)", lineHeight: 1.5, marginBottom: 5 }}>{b.desc}</div>
                  <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: b.free ? "rgba(160,138,65,.8)" : "rgba(107,127,168,.7)" }}>{b.free ? "Книга · Бесплатно" : "Книга · Подписка"}</div>
                </div>
                {b.free ? <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(160,138,65,.15)", border: "1px solid rgba(160,138,65,.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "rgba(160,138,65,.8)", flexShrink: 0 }}>→</div> : <Lock />}
              </div>
            ))}
          </div>
        </>}
      </div>
    </div>
  );
}
