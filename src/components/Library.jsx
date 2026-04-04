import { useState, useEffect } from "react";
import { THEMES } from "../data/themes";
import { SECTIONS, COMING_SOON, BOOKS } from "../data/content";
import { FONT_SERIF, FONT_SANS } from "../utils/helpers";
import Orb from "./Orb";

export default function Library({ setScreen, theme, initSec }) {
  const T = THEMES[theme] || THEMES.full;
  const [det, setDet] = useState(null);
  const [play, setPlay] = useState(false);
  const [prog, setProg] = useState(0);
  const [active, setActive] = useState(initSec || "all");

  useEffect(() => { setActive(initSec || "all"); }, [initSec]);

  // Detail view
  if (det) {
    const sec = SECTIONS.find((s) => s.meds && s.meds.some((m) => m.n === det.n));
    const ac = (sec && sec.color) || T.accent;
    return (
      <div style={{ minHeight: "100%", background: T.bg, paddingBottom: 20, transition: "background .8s" }}>
        <div onClick={() => { setDet(null); setPlay(false); setProg(0); }} style={{ padding: "20px 24px 14px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <span style={{ fontSize: 15, color: "rgba(242,232,226,.45)" }}>←</span>
          <span style={{ fontSize: 11, letterSpacing: ".15em", textTransform: "uppercase", color: "rgba(242,232,226,.35)", fontFamily: FONT_SANS }}>Назад</span>
        </div>

        <div style={{ position: "relative", height: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            width: play ? 170 : 135, height: play ? 170 : 135, borderRadius: "50%",
            background: `${ac}30`, border: `2px solid ${ac}50`,
            animation: play ? `breathe 4s ease-in-out infinite` : "none",
            transition: "all .5s", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 40, color: ac,
          }}>◦</div>
        </div>

        <div style={{ padding: "0 24px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ padding: "5px 14px", borderRadius: 20, background: `${ac}33`, border: `1px solid ${ac}55`, fontFamily: FONT_SANS, fontSize: 10, color: ac }}>{sec?.title}</div>
            <div style={{ padding: "5px 14px", borderRadius: 20, background: "rgba(255,255,255,.06)", fontFamily: FONT_SANS, fontSize: 10, color: "rgba(242,232,226,.4)" }}>{det.dur}</div>
            {det.free && <div style={{ padding: "5px 14px", borderRadius: 20, background: "rgba(160,138,65,.15)", fontFamily: FONT_SANS, fontSize: 10, color: "rgba(160,138,65,.85)" }}>Бесплатно</div>}
          </div>

          <div style={{ fontFamily: FONT_SERIF, fontSize: 26, fontWeight: 300, lineHeight: 1.2, color: "rgba(242,232,226,.95)", marginBottom: 18 }}>{det.title}</div>

          <div style={{ padding: "18px 20px", background: `${ac}18`, border: `1px solid ${ac}30`, borderRadius: 16, marginBottom: 14 }}>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 15, lineHeight: 1.8, color: "rgba(242,232,226,.85)" }}>{det.short}</div>
          </div>

          {/* Player */}
          <div style={{ padding: "18px 20px", background: `${ac}15`, border: `1px solid ${ac}35`, borderRadius: 16 }}>
            <div style={{ marginBottom: 8, cursor: "pointer" }} onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width; setProg(Math.max(0, Math.min(100, x * 100))); }}>
              <div style={{ height: 3, background: "rgba(255,255,255,.1)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${prog}%`, background: ac, borderRadius: 2, transition: "width .1s" }} />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT_SANS, fontSize: 10, color: "rgba(242,232,226,.35)", marginBottom: 14 }}>
              <span>0:00</span><span>{det.dur}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around" }}>
              <div style={{ fontSize: 20, color: "rgba(242,232,226,.4)", cursor: "pointer" }}>↺</div>
              <div style={{ fontSize: 12, color: "rgba(242,232,226,.4)", cursor: "pointer", background: "rgba(255,255,255,.05)", padding: "6px 10px", borderRadius: 8 }}>-15</div>
              <div onClick={() => { if (!det.free) { setScreen("sub"); return; } setPlay((p) => !p); }} style={{
                width: 56, height: 56, borderRadius: "50%", background: `${ac}35`, border: `2px solid ${ac}`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                color: "rgba(242,232,226,.9)", cursor: "pointer",
              }}>{play ? "❚❚" : "▶"}</div>
              <div style={{ fontSize: 12, color: "rgba(242,232,226,.4)", cursor: "pointer", background: "rgba(255,255,255,.05)", padding: "6px 10px", borderRadius: 8 }}>+15</div>
              <div style={{ fontSize: 15, color: "rgba(242,232,226,.4)", cursor: "pointer" }}>AA</div>
            </div>
            {!det.free && (
              <div onClick={() => setScreen("sub")} style={{ marginTop: 14, textAlign: "center", fontFamily: FONT_SANS, fontSize: 11, color: T.accent, cursor: "pointer" }}>Разблокировать с подпиской →</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // List view
  const filters = [
    { id: "all", l: "Все", c: "rgba(242,232,226,.6)" },
    { id: "resource", l: "Ресурс", c: "#B84010" },
    { id: "feminine", l: "Женское", c: "#8F4A91" },
    { id: "receiving", l: "Реализация", c: "#C47808" },
    { id: "newlevel", l: "Уровень", c: "#0A5C5C" },
    { id: "self", l: "Подлинность", c: "#7D1736" },
  ];
  const vis = active === "all" ? SECTIONS : SECTIONS.filter((s) => s.id === active);

  return (
    <div style={{ minHeight: "100%", background: T.bg, paddingBottom: 20, position: "relative", transition: "background .8s" }}>
      <Orb style={{ top: -50, left: -60 }} color={T.o1} opacity={0.14} w={240} h={240} />

      <div style={{ padding: "50px 24px 18px", position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".25em", textTransform: "uppercase", color: `rgba(${T.ar},.4)`, marginBottom: 6 }}>библиотека</div>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 36, fontWeight: 300, lineHeight: 1.1, color: "rgba(242,232,226,.95)", marginBottom: 18 }}>Практики</div>

        <div style={{ display: "flex", gap: 7, overflowX: "auto", margin: "0 -24px", padding: "0 24px 4px" }}>
          {filters.map((f) => (
            <div key={f.id} onClick={() => setActive(f.id)} style={{
              padding: "8px 16px", borderRadius: 20, whiteSpace: "nowrap", cursor: "pointer",
              background: active === f.id ? `${f.c}22` : "rgba(255,255,255,.04)",
              border: `1px solid ${active === f.id ? `${f.c}44` : "rgba(255,255,255,.06)"}`,
              fontFamily: FONT_SANS, fontSize: 11, color: active === f.id ? f.c : "rgba(242,232,226,.35)",
              transition: "all .3s",
            }}>{f.l}</div>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 24px", position: "relative", zIndex: 1 }}>
        {vis.map((sec) => (
          <div key={sec.id} style={{ marginBottom: 26 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 13 }}>
              <div style={{ width: 11, height: 11, borderRadius: "50%", background: sec.color, boxShadow: `0 0 12px ${sec.color}55` }} />
              <div style={{ fontFamily: FONT_SERIF, fontSize: 15, color: "rgba(242,232,226,.82)" }}>{sec.title}</div>
            </div>
            {sec.meds.map((med) => (
              <div key={med.n} onClick={() => setDet(med)} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
                background: T.card, border: `1px solid ${T.border}`, borderRadius: 14,
                marginBottom: 8, position: "relative", cursor: "pointer",
              }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: med.free ? "rgba(160,138,65,.85)" : sec.color, borderRadius: "3px 0 0 3px" }} />
                <div style={{ fontFamily: FONT_SERIF, fontSize: 20, color: sec.color, width: 26, textAlign: "center" }}>{med.n}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: FONT_SERIF, fontSize: 14, color: "rgba(242,232,226,.92)", marginBottom: 2 }}>{med.title}</div>
                  <div style={{ fontFamily: FONT_SERIF, fontSize: 12, color: "rgba(242,232,226,.45)", lineHeight: 1.4 }}>{med.short}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                    <span style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: sec.color }}>{sec.title}</span>
                    <span style={{ fontSize: 9, color: "rgba(242,232,226,.3)" }}>·</span>
                    <span style={{ fontFamily: FONT_SANS, fontSize: 9, color: "rgba(242,232,226,.38)" }}>{med.dur}</span>
                  </div>
                </div>
                <div style={{ flexShrink: 0, marginTop: 4 }}>
                  {med.free ? (
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(160,138,65,.2)", border: "1px solid rgba(160,138,65,.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "rgba(160,138,65,.85)" }}>▶</div>
                  ) : (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(242,232,226,.3)" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}

        {active === "all" && (
          <>
            {/* Coming soon */}
            <div style={{ marginBottom: 26 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 13 }}>
                <div style={{ width: 11, height: 11, borderRadius: "50%", background: "rgba(242,232,226,.15)" }} />
                <div style={{ fontFamily: FONT_SERIF, fontSize: 15, color: "rgba(242,232,226,.45)" }}>Скоро</div>
              </div>
              {COMING_SOON.map((m) => (
                <div key={m.n} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 16px", background: "rgba(255,255,255,.02)", borderRadius: 14, marginBottom: 6 }}>
                  <div style={{ fontFamily: FONT_SERIF, fontSize: 20, color: "rgba(242,232,226,.25)", width: 26, textAlign: "center" }}>{m.n}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: FONT_SERIF, fontSize: 14, color: "rgba(242,232,226,.55)" }}>{m.title}</div>
                    <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(242,232,226,.25)", marginTop: 2 }}>{m.short}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Books */}
            <div style={{ marginBottom: 26 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 13 }}>
                <div style={{ width: 11, height: 11, borderRadius: "50%", background: "rgba(160,138,65,.5)" }} />
                <div style={{ fontFamily: FONT_SERIF, fontSize: 15, color: "rgba(242,232,226,.65)" }}>Книги</div>
              </div>
              {BOOKS.map((b) => (
                <div key={b.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, marginBottom: 8, position: "relative" }}>
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: b.free ? "rgba(160,138,65,.85)" : "rgba(242,232,226,.12)", borderRadius: "3px 0 0 3px" }} />
                  <div style={{ fontFamily: FONT_SERIF, fontSize: 20, color: "rgba(160,138,65,.65)", width: 26, textAlign: "center" }}>✦</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: FONT_SERIF, fontSize: 14, color: "rgba(242,232,226,.92)", marginBottom: 2 }}>{b.title}</div>
                    <div style={{ fontFamily: FONT_SERIF, fontSize: 12, color: "rgba(242,232,226,.45)", lineHeight: 1.4 }}>{b.desc}</div>
                    <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: b.free ? "rgba(160,138,65,.7)" : "rgba(242,232,226,.25)", marginTop: 4 }}>{b.free ? "Бесплатно" : "По подписке"}</div>
                  </div>
                  {b.free ? (
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(160,138,65,.2)", border: "1px solid rgba(160,138,65,.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "rgba(160,138,65,.85)" }}>→</div>
                  ) : (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(242,232,226,.3)" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
