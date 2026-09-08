import { buildCatalog } from "../data/catalog.js";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
// THEMES passed via props
import { getSections, getComingSoon } from "../data/content";
import { getTales } from "../data/tales";
import { getAudioUrl } from "../data/audioUrls";
import { TYPE, SP, RAD, OP, LS, EASE, LH, FONT_SERIF, FONT_SANS, tx, label, body, heading } from "../utils/design";
import { logMeditation } from "../data/psycap";
import Orb from "./Orb";
import { t as tr } from "../utils/i18n";

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const PlayIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path d="M7 4L19 11L7 18V4Z" fill="white"/>
  </svg>
);
const PauseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <rect x="4.5" y="3" width="4.5" height="16" rx="2" fill="white"/>
    <rect x="13" y="3" width="4.5" height="16" rx="2" fill="white"/>
  </svg>
);

export default function Library({ setScreen, goBack, theme, initSec, initMed, clearMed, medFrom, clearMedFrom, THEMES, doMarkPractice, addGems, remoteMeds = null, remoteSections = null, lang = "ru" }) {
  const T = THEMES[theme] || THEMES.full;
  const L = (k) => tr(lang, k);
  const SECTIONS = useMemo(() => buildCatalog(lang, remoteMeds, remoteSections), [lang, remoteMeds, remoteSections]);
  const COMING_SOON = getComingSoon(lang);
  const TALES = getTales(lang);
  const ALL_MEDS = SECTIONS.flatMap((s) => s.meds);

  const [det, setDet] = useState(() => {
    if (initMed) { const m = ALL_MEDS.find((x) => (x.title === initMed || x.canonicalTitle === initMed || x.id === initMed)); return m || null; }
    return null;
  });
  const [taleDet, setTaleDet] = useState(null);
  const [play, setPlay] = useState(false);
  const [prog, setProg] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const pendingPlay = useRef(false);
  const audioRef = useRef(null);
  const [active, setActive] = useState(initSec || "all");

  useEffect(() => { setActive(initSec || "all"); }, [initSec]);
  useEffect(() => {
    if (initMed) {
      const m = ALL_MEDS.find((x) => (x.title === initMed || x.canonicalTitle === initMed || x.id === initMed));
      if (m) setDet(m);
      if (clearMed) clearMed();
    }
  }, [initMed, SECTIONS]);

  useEffect(() => {
    setDet(current => {
      if (!current) return null;
      return SECTIONS.flatMap(s => s.meds).find(m => m.id === current.id || m.canonicalTitle === current.canonicalTitle) || null;
    });
  }, [SECTIONS]);

  // ─── Audio engine ────────────────────────────────────────────────────────
  const loggedRef = useRef(false);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
      setProg(pct);
      const played = Array.from({ length: audio.played.length }, (_, i) => [audio.played.start(i), audio.played.end(i)]);
      const listened = played.reduce((sum, [start, end]) => sum + end - start, 0);
      if (!loggedRef.current && audio.duration > 0 && listened / audio.duration >= 0.8 && det) {
        loggedRef.current = true;
        logMeditation(det.canonicalTitle || det.title, "full");
        if (doMarkPractice) doMarkPractice(Math.round(audio.duration / 60));
        if (addGems) addGems(Math.max(1, Math.round(audio.duration / 60)));
      }
    };
    const onLoaded = () => { setDuration(audio.duration); setAudioError(false); };
    const onEnded = () => { setPlay(false); setProg(100); };
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("canplay", onLoaded);
    const onError = () => { setPlay(false); setAudioError(true); };
    audio.addEventListener("error", onError);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("canplay", onLoaded);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, [det]);

  // Reset player when meditation changes
  useEffect(() => {
    setPlay(false);
    setProg(0);
    setCurrentTime(0);
    setDuration(0);
    setAudioError(false);
    loggedRef.current = false;
    const audio = audioRef.current;
    if (pendingPlay.current) {
      pendingPlay.current = false;
      setPlay(true);
    } else if (audio) { audio.pause(); audio.currentTime = 0; }
  }, [det?.id]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const audioUrl = getAudioUrl(det);
    if (!audioUrl) return;
    if (audio.src !== new URL(audioUrl, window.location.href).href) {
      audio.src = audioUrl;
      audio.load();
    }
    if (play) { audio.pause(); setPlay(false); }
    else { audio.play().catch(() => { setPlay(false); setAudioError(true); }); setPlay(true); }
  }, [play, det]);

  const seekTo = useCallback((pct) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    audio.currentTime = (pct / 100) * audio.duration;
  }, []);

  const skipSeconds = useCallback((secs) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration || 0, audio.currentTime + secs));
  }, []);

  // Open meditation and auto-play (call synchronously in tap handler for iOS gesture chain)
  const startMed = useCallback((med) => {
    setDet(med);
    const audioUrl = getAudioUrl(med);
    if (!audioUrl || !audioRef.current) return;
    const audio = audioRef.current;
    pendingPlay.current = true;
    setAudioError(false);
    if (audio.src !== new URL(audioUrl, window.location.href).href) {
      audio.src = audioUrl;
      audio.load();
    }
    audio.play().catch(() => { setPlay(false); setAudioError(true); });
    setPlay(true);
    setProg(0); setCurrentTime(0); setDuration(0);
    loggedRef.current = false;
  }, []);

  // ─── Media Session API (lock screen controls + background playback) ────────
  useEffect(() => {
    if (!det || !("mediaSession" in navigator)) return;
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: det.title,
        artist: "LuxMind",
        album: lang === "ru" ? "Медитации" : "Meditations",
      });
      navigator.mediaSession.setActionHandler("play", () => { audioRef.current?.play().catch(() => { setPlay(false); setAudioError(true); }); setPlay(true); });
      navigator.mediaSession.setActionHandler("pause", () => { audioRef.current?.pause(); setPlay(false); });
      navigator.mediaSession.setActionHandler("seekbackward", (d) => skipSeconds(-(d?.seekOffset ?? 15)));
      navigator.mediaSession.setActionHandler("seekforward", (d) => skipSeconds(d?.seekOffset ?? 15));
    } catch (e) {}
  }, [det, skipSeconds, lang]);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    try { navigator.mediaSession.playbackState = play ? "playing" : "paused"; } catch (e) {}
  }, [play]);

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      audio?.pause();
      if ('mediaSession' in navigator) {
        for (const action of ['play', 'pause', 'seekbackward', 'seekforward']) {
          try { navigator.mediaSession.setActionHandler(action, null); } catch { /* unsupported action */ }
        }
      }
    };
  }, []);

  const fmt = (s) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const filters = [
    { id: "all", l: L("lib_filter_all"), c: tx("var(--txt)", OP.secondary + 0.05) },
    { id: "resource", l: L("lib_filter_resource"), c: "#F08838" },
    { id: "feminine", l: L("lib_filter_feminine"), c: "#E64DA8" },
    { id: "receiving", l: L("lib_filter_receiving"), c: "#FFAF32" },
    { id: "newlevel", l: L("lib_filter_growth"), c: "#9F7BD8" },
    { id: "self", l: L("lib_filter_self"), c: "#D080B0" },
    { id: "tales", l: lang === "ru" ? "Сказки" : "Tales", c: "#C080D0" },
  ];
  if (Array.isArray(remoteMeds)) {
    filters.splice(1, 5, ...SECTIONS.map(s => ({ id: s.id, l: s.title, c: s.color })));
  }
  const effectiveActive = filters.some(f => f.id === active) ? active : "all";
  const vis = (effectiveActive === "all" || effectiveActive === "tales") ? SECTIONS : SECTIONS.filter((s) => s.id === effectiveActive);

  return (
    <>
      {/* Always-mounted audio element — lets startMed() call play() synchronously in tap gesture */}
      <audio ref={audioRef} preload="none" />

      {/* ─── Tale reader view ─── */}
      {taleDet && (() => {
        const ac = taleDet.color || T.accent;
        return (
          <div style={{ minHeight: "100%", background: T.bg, paddingBottom: SP.page * 2, transition: EASE.slow }}>
            <div onClick={() => setTaleDet(null)} style={{ margin: `${SP.md}px ${SP.xl}px`, display: "inline-flex", alignItems: "center", gap: 9, cursor: "pointer", borderRadius: RAD.full, background: "rgba(255,255,255,.06)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,.1)", padding: `${SP.sm}px ${SP.lg}px` }}>
              <span style={{ fontSize: TYPE.base + 1, color: tx("var(--txt)", OP.secondary) }}>←</span>
              <span style={{ ...label(TYPE.sm - 1), color: tx("var(--txt)", OP.secondary) }}>{lang === "ru" ? "Назад" : "Back"}</span>
            </div>
            <div style={{ position: "relative", height: 140, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 60%, ${ac}20 0%, transparent 70%)`, pointerEvents: "none" }} />
              <div style={{ fontSize: 64, filter: `drop-shadow(0 0 24px ${ac}88)`, lineHeight: 1 }}>✦</div>
            </div>
            <div style={{ padding: `0 ${SP.xl}px ${SP.xl}px` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: SP.md + 2 }}>
                <div style={{ padding: `5px ${SP.md + 2}px`, borderRadius: RAD.lg, background: `${ac}33`, border: `1px solid ${ac}66`, ...label(TYPE.xs), color: tx("var(--txt)", 0.8) }}>{taleDet.label}</div>
              </div>
              <div style={{ ...heading(TYPE.xxl - 2), color: tx("var(--txt)", OP.primary + 0.03), marginBottom: SP.md }}>{taleDet.title}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: SP.lg + 4 }}>
                {taleDet.tags.map((tag) => (
                  <div key={tag} style={{ padding: `4px ${SP.md}px`, borderRadius: RAD.full, background: `${ac}18`, border: `1px solid ${ac}30`, ...label(TYPE.xs - 1), color: tx("var(--txt)", 0.6) }}>{tag}</div>
                ))}
              </div>
              <div style={{ padding: `${SP.lg + 2}px ${SP.page}px`, background: `${ac}10`, border: `1px solid ${ac}22`, borderRadius: RAD.lg, marginBottom: SP.lg + 4 }}>
                <div style={{ ...body(TYPE.base), lineHeight: 1.75, color: tx("var(--txt)", 0.75), fontStyle: "italic" }}>{taleDet.short}</div>
              </div>
              <div style={{ padding: `${SP.xl}px ${SP.page}px`, background: `rgba(255,255,255,.025)`, border: `1px solid rgba(255,255,255,.06)`, borderRadius: RAD.lg }}>
                {taleDet.text.split("\n\n").map((para, i) => (
                  <div key={i} style={{ fontFamily: FONT_SERIF, fontSize: TYPE.base + 1, lineHeight: 1.9, color: tx("var(--txt)", para.startsWith("—") ? 0.92 : 0.78), marginBottom: SP.lg + 2, fontStyle: para.startsWith("—") ? "italic" : "normal" }}>{para}</div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ─── Meditation detail view ─── */}
      {!taleDet && det && (() => {
        const sec = SECTIONS.find((s) => s.meds && s.meds.some((m) => m.n === det.n));
        const ac = (sec && sec.color) || T.accent;
        const hasAudio = !!getAudioUrl(det);
        const iconColor = hasAudio ? "white" : `rgba(255,255,255,0.35)`;
        return (
          <div style={{ minHeight: "100%", background: T.bg, paddingBottom: SP.page * 2, transition: EASE.slow }}>
            <div onClick={() => {
              setDet(null); setPlay(false); setProg(0);
              const audio = audioRef.current;
              if (audio) { audio.pause(); audio.currentTime = 0; }
              if (medFrom) { setScreen(medFrom); if (clearMedFrom) clearMedFrom(); }
            }} style={{ margin: `${SP.md}px ${SP.xl}px`, display: "inline-flex", alignItems: "center", gap: 9, cursor: "pointer", borderRadius: RAD.full, background: "rgba(255,255,255,.06)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,.1)", padding: `${SP.sm}px ${SP.lg}px` }}>
              <span style={{ fontSize: TYPE.base + 1, color: tx("var(--txt)", OP.secondary) }}>←</span>
              <span style={{ ...label(TYPE.sm - 1), color: tx("var(--txt)", OP.secondary) }}>{medFrom ? L("lib_back_to_nav") : L("back")}</span>
            </div>

            {/* Title + chips */}
            <div style={{ padding: `0 ${SP.xl}px ${SP.lg}px` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: SP.md + 2 }}>
                <div style={{ padding: `5px ${SP.md + 2}px`, borderRadius: RAD.lg, background: `${ac}33`, border: `1px solid ${ac}66`, ...label(TYPE.xs), color: tx("var(--txt)", 0.8) }}>{L("lib_meditation")}</div>
                <div style={{ padding: `5px ${SP.md + 2}px`, borderRadius: RAD.lg, background: `rgba(255,255,255,${OP.bgSubtle})`, border: `1px solid rgba(255,255,255,.1)`, fontFamily: FONT_SANS, fontSize: TYPE.xs, color: tx("var(--txt)", OP.secondary + 0.05) }}>{det.dur}</div>
              </div>
              <div style={{ fontFamily: FONT_SERIF, fontSize: TYPE.xxl - 2, fontWeight: 300, lineHeight: LH.tight, color: tx("var(--txt)", OP.primary + 0.03), marginBottom: 0 }}>{det.title}</div>
            </div>

            {/* Orb */}
            <div style={{ position: "relative", height: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ position: "relative", width: play ? 160 : 130, height: play ? 160 : 130, transition: "all 1.2s ease" }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `radial-gradient(circle at 60% 65%,${ac}55 0%,${ac}22 50%,transparent 80%)`, filter: "blur(8px)", animation: "breathe 4s ease-in-out infinite" }} />
                <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: `radial-gradient(circle at 40% 35%,rgba(255,255,255,.3) 0%,${ac}cc 35%,${ac}44 70%,transparent 100%)`, filter: "blur(2px)", animation: "breathe 4s ease-in-out infinite", boxShadow: `0 0 60px ${ac}66` }} />
              </div>
            </div>

            <div style={{ padding: `0 ${SP.xl}px` }}>
              {/* Description */}
              <div style={{ padding: `${SP.lg + 2}px ${SP.page}px`, background: `${ac}18`, border: `1px solid ${ac}30`, borderRadius: RAD.lg - 2, marginBottom: SP.lg }}>
                <div style={{ ...body(TYPE.base + 1), lineHeight: 1.8, color: tx("var(--txt)", 0.85) }}>{det.long || det.short}</div>
              </div>

              {audioError && <div role="alert" style={{ color: '#ffccd0', marginBottom: 12 }}>{lang === 'ru' ? 'Не удалось загрузить аудио. Проверьте соединение и нажмите воспроизведение ещё раз.' : 'Could not load audio. Check your connection and try playing again.'}</div>}
              {lang === 'en' && hasAudio && !det.audio_language && <p style={{ opacity: .7 }}>Recording language: Russian</p>}
              {/* ─── Player card ─── */}
              <div className="glass-card" style={{ padding: `${SP.lg + 2}px ${SP.page}px ${SP.xl}px`, background: `${ac}15`, border: `1px solid ${ac}35`, borderRadius: RAD.lg, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", boxShadow: "0 2px 12px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.04)" }}>
                {/* Progress bar */}
                <div style={{ marginBottom: SP.sm, cursor: hasAudio ? "pointer" : "default", padding: `${SP.sm}px 0` }}
                  onClick={(e) => { if (!hasAudio) return; const r = e.currentTarget.getBoundingClientRect(); seekTo((e.clientX - r.left) / r.width * 100); }}>
                  <div style={{ height: 3, background: "rgba(255,255,255,.12)", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", background: ac, borderRadius: 2, width: `${prog}%`, transition: "width .2s" }} />
                  </div>
                </div>
                {/* Time */}
                <div style={{ display: "flex", justifyContent: "space-between", ...label(TYPE.xs), color: tx("var(--txt)", OP.tertiary + 0.03), marginBottom: SP.xl }}>
                  <span>{fmt(currentTime)}</span>
                  <span>{duration > 0 ? fmt(duration) : det.dur}</span>
                </div>
                {/* Controls */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div className="press-card" onClick={() => { if (hasAudio) togglePlay(); }}
                    style={{ width: 70, height: 70, borderRadius: RAD.full, cursor: hasAudio ? "pointer" : "default", background: hasAudio ? `linear-gradient(135deg,${ac},${ac}88)` : "rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: hasAudio ? `0 0 40px ${ac}66, 0 0 16px ${ac}44` : "none", opacity: hasAudio ? 1 : 0.35 }}>
                    {play ? <PauseIcon /> : <PlayIcon />}
                  </div>
                </div>
                {!hasAudio && (
                  <div style={{ marginTop: SP.md + 2, textAlign: "center", ...label(TYPE.xs), color: tx("var(--txt)", OP.disabled), fontStyle: "italic" }}>
                    {lang === "ru" ? "Аудио скоро появится" : "Audio coming soon"}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ─── List view ─── */}
      {!taleDet && !det && (
        <div style={{ minHeight: "100%", background: T.bg, paddingBottom: SP.page, position: "relative", transition: EASE.slow }}>
          <Orb style={{ top: -50, left: -60 }} color={T.o1} opacity={0.14} w={240} h={240} />
          <div style={{ padding: `50px ${SP.xl}px ${SP.lg + 2}px`, position: "relative", zIndex: 1 }}>
            {goBack && (
              <div onClick={goBack} style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer", marginBottom: SP.lg }}>
                <span style={{ fontSize: TYPE.base, color: tx("var(--txt)", OP.tertiary + 0.08) }}>←</span>
                <span style={{ ...label(TYPE.sm), color: tx("var(--txt)", OP.tertiary + 0.08) }}>{lang === "ru" ? "Назад" : "Back"}</span>
              </div>
            )}
            <div style={{ ...label(9), letterSpacing: ".25em", color: T.accent, marginBottom: 6 }}>{L("lib_support_moment")}</div>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 36, fontWeight: 300, lineHeight: LH.tight - 0.1, color: tx("var(--txt)", OP.primary + 0.03), marginBottom: SP.lg + 2 }}>{L("lib_library")}</div>
            <div style={{ display: "flex", gap: 7, overflowX: "auto", margin: `0 -${SP.xl}px`, padding: `0 ${SP.xl}px ${SP.xs}px` }}>
              {filters.map((f) => (
                <div key={f.id} className="pc" onClick={() => setActive(f.id)} style={{ padding: `${SP.sm}px ${SP.lg}px`, borderRadius: RAD.lg, fontSize: TYPE.xs + 0.5, letterSpacing: LS.normal, whiteSpace: "nowrap", flexShrink: 0, cursor: "pointer", fontFamily: FONT_SANS, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", background: active === f.id ? `${f.c}30` : "rgba(255,255,255,.03)", border: `1.5px solid ${active === f.id ? f.c : "rgba(255,255,255,.08)"}`, color: active === f.id ? f.c : tx("var(--txt)", OP.tertiary + 0.08), boxShadow: active === f.id ? `0 0 14px ${f.c}44, inset 0 0 8px ${f.c}08` : "none", transition: EASE.normal }}>{f.l}</div>
              ))}
            </div>
          </div>

          {/* ─── About the Author ─── */}
          {active !== "tales" && (
            <div className="glass-card" style={{ margin: `0 ${SP.xl}px ${SP.xl}px`, padding: SP.page, background: `rgba(${T.ar},.05)`, border: `1px solid rgba(${T.ar},.12)`, borderRadius: RAD.lg, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: `radial-gradient(circle, ${T.accent}15 0%, transparent 70%)`, pointerEvents: "none" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: SP.lg }}>
                <div style={{ width: 46, height: 46, borderRadius: "50%", background: "rgba(125,23,54,.35)", border: `1.5px solid ${T.accent}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🎓</div>
                <div>
                  <div style={{ fontFamily: FONT_SERIF, fontSize: 15, color: tx("var(--txt)", 0.92), marginBottom: 2 }}>{L("author_name")}</div>
                  <div style={{ ...label(TYPE.xs), letterSpacing: ".12em", color: T.accent }}>{L("author_role")}</div>
                </div>
              </div>
              <div style={{ ...body(TYPE.base), lineHeight: LH.loose, color: tx("var(--txt)", 0.72), marginBottom: SP.md }}>{L("author_bio")}</div>
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                {[L("author_tag1"), L("author_tag2"), L("author_tag3")].map((tag) => (
                  <div key={tag} style={{ padding: `4px ${SP.md}px`, borderRadius: RAD.md, background: `rgba(${T.ar},.06)`, border: `1px solid rgba(${T.ar},.1)`, ...label(TYPE.xs), color: tx("var(--txt)", 0.55) }}>{tag}</div>
                ))}
              </div>
            </div>
          )}

          <div style={{ padding: `0 ${SP.xl}px`, position: "relative", zIndex: 1 }}>
            {/* ─── Tales section ─── */}
            {active === "tales" && (
              <div>
                <div style={{ marginBottom: SP.xl, padding: `${SP.lg}px ${SP.page}px`, background: "rgba(192,128,208,.06)", border: "1px solid rgba(192,128,208,.15)", borderRadius: RAD.lg }}>
                  <div style={{ fontFamily: FONT_SERIF, fontSize: TYPE.base + 1, lineHeight: 1.75, color: tx("var(--txt)", 0.65) }}>
                    {lang === "ru" ? "Терапевтические сказки помогают увидеть себя со стороны, прожить сложные переживания через метафору и найти внутренний ресурс." : "Therapeutic fairy tales help you see yourself from the outside, process difficult experiences through metaphor, and find inner resources."}
                  </div>
                </div>
                {TALES.map((tale) => (
                  <div key={tale.id} onClick={() => setTaleDet(tale)} className="list-item press-card glass-card" style={{ display: "flex", alignItems: "flex-start", gap: SP.md, padding: `${SP.lg}px ${SP.md + 2}px`, background: `rgba(${T.ar},.04)`, border: `1px solid rgba(192,128,208,.18)`, borderRadius: RAD.lg, marginBottom: SP.md, cursor: "pointer", position: "relative", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.04)" }}>
                    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: "linear-gradient(to bottom,#C080D0,#C080D033)", borderRadius: "3px 0 0 3px" }} />
                    <div style={{ fontFamily: FONT_SERIF, fontSize: TYPE.xl - 2, color: "#C080D0", width: 26, textAlign: "center", flexShrink: 0, lineHeight: 1, paddingTop: 2 }}>✦</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ ...label(TYPE.xs - 0.5), letterSpacing: ".12em", color: "#C080D0", marginBottom: 4 }}>{tale.label}</div>
                      <div style={{ ...body(TYPE.base + 1), lineHeight: LH.tight + 0.1, color: tx("var(--txt)", OP.primary), marginBottom: 5 }}>{tale.title}</div>
                      <div style={{ ...body(TYPE.sm), color: tx("var(--txt)", OP.secondary - 0.1), lineHeight: 1.55 }}>{tale.short}</div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: SP.sm }}>
                        {tale.tags.map((tag) => (
                          <div key={tag} style={{ padding: `3px ${SP.sm + 2}px`, borderRadius: RAD.full, background: "rgba(192,128,208,.1)", border: "1px solid rgba(192,128,208,.2)", ...label(TYPE.xs - 1), color: tx("var(--txt)", 0.5) }}>{tag}</div>
                        ))}
                      </div>
                    </div>
                    <div style={{ flexShrink: 0, marginTop: SP.xs }}>
                      <div style={{ width: 26, height: 26, borderRadius: RAD.full, background: "rgba(192,128,208,.2)", border: "1px solid rgba(192,128,208,.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: TYPE.sm, color: "#C080D0" }}>→</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ─── Meditation sections ─── */}
            {active !== "tales" && vis.map((sec) => (
              <div key={sec.id} style={{ marginBottom: SP.xl + 2 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: SP.md + 1 }}>
                  <div style={{ width: 11, height: 11, borderRadius: RAD.full, background: sec.color, boxShadow: `0 0 8px ${sec.color}88`, flexShrink: 0 }} />
                  <div style={{ width: 40, height: 1, background: `linear-gradient(to right,${sec.color},transparent)`, flexShrink: 0 }} />
                  <div style={{ ...body(TYPE.base + 1), color: tx("var(--txt)", 0.82) }}>{sec.title}</div>
                </div>
                {sec.meds.map((med) => (
                  <div key={med.id || med.n} onClick={() => setDet(med)} className="list-item press-card glass-card" style={{ display: "flex", alignItems: "flex-start", gap: SP.md, padding: `${SP.md + 1}px ${SP.md + 2}px`, background: `rgba(${T.ar},.04)`, border: `1px solid rgba(${T.ar},.1)`, borderRadius: RAD.lg, marginBottom: SP.sm, cursor: "pointer", position: "relative", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.04)", animationDelay: `${med.n * 0.05}s` }}>
                    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: `linear-gradient(to bottom,${sec.color},${sec.color}22)`, borderRadius: "3px 0 0 3px" }} />
                    <div style={{ fontFamily: FONT_SERIF, fontSize: TYPE.xl - 2, color: sec.color, width: 26, textAlign: "center", flexShrink: 0, lineHeight: 1, paddingTop: 2 }}>{med.n}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ ...body(TYPE.base), lineHeight: LH.tight + 0.1, color: tx("var(--txt)", OP.primary), marginBottom: 3 }}>{med.title}</div>
                      <div style={{ ...body(TYPE.sm), color: tx("var(--txt)", OP.secondary - 0.1), marginBottom: 5 }}>{med.short}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: SP.sm }}>
                        <span style={{ fontFamily: FONT_SANS, fontSize: 9, color: tx("var(--txt)", OP.tertiary + 0.06) }}>{med.dur}</span>
                      </div>
                    </div>
                    {/* Play button — tap here to open AND auto-play */}
                    <div
                      onClick={(e) => { e.stopPropagation(); startMed(med); }}
                      style={{ flexShrink: 0, marginTop: SP.xs, width: 30, height: 30, borderRadius: RAD.full, background: `${sec.color}33`, border: `1px solid ${sec.color}66`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M3 2L10 6L3 10V2Z" fill={sec.color}/>
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {/* ─── Coming soon ─── */}
            {active === "all" && (
              <div style={{ marginBottom: SP.xl + 2 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: SP.md + 1 }}>
                  <div style={{ width: 11, height: 11, borderRadius: RAD.full, background: tx("var(--txt)", OP.disabled + 0.02), flexShrink: 0 }} />
                  <div style={{ width: 40, height: 1, background: `linear-gradient(to right,${tx("var(--txt)", OP.disabled + 0.02)},transparent)`, flexShrink: 0 }} />
                  <div style={{ ...body(TYPE.base + 1), color: tx("var(--txt)", OP.secondary - 0.1) }}>{L("lib_coming_soon")}</div>
                </div>
                {COMING_SOON.map((m) => (
                  <div key={m.n} style={{ display: "flex", alignItems: "flex-start", gap: SP.md, padding: `${SP.md + 1}px ${SP.md + 2}px`, background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.05)", borderRadius: SP.lg, marginBottom: SP.sm, opacity: 0.5 }}>
                    <div style={{ fontFamily: FONT_SERIF, fontSize: TYPE.xl - 2, color: tx("var(--txt)", OP.tertiary - 0.07), width: 26, textAlign: "center", flexShrink: 0, paddingTop: 2 }}>{m.n}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ ...body(TYPE.base), color: tx("var(--txt)", 0.5), marginBottom: 3 }}>{m.title}</div>
                      <div style={{ ...body(TYPE.sm), color: tx("var(--txt)", OP.tertiary - 0.04) }}>{m.short}</div>
                    </div>
                    <div style={{ ...label(9), letterSpacing: ".1em", color: tx("var(--txt)", OP.disabled + 0.04), flexShrink: 0, marginTop: SP.xs }}>{L("lib_soon")}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
