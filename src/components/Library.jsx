import { useState, useEffect } from "react";
// THEMES passed via props
import { getSections, getComingSoon } from "../data/content";
import { getTales } from "../data/tales";
import { TYPE, SP, RAD, OP, LS, EASE, LH, FONT_SERIF, FONT_SANS, tx, label, body, heading } from "../utils/design";
import { getPracticeCatalog, findPractice, searchPractices } from '../data/practiceCatalog.js';
import { getPracticeState, toggleFavorite, formatTime } from '../lib/practiceState.js';
import { subscribeUserChanges } from '../lib/userStorage.js';
import { usePracticePlayer } from '../hooks/usePracticePlayer.js';
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

export default function Library({ setScreen, goBack, theme, initSec, initMed, clearMed, medFrom, clearMedFrom, THEMES, doMarkPractice, addGems, lang = "ru" }) {
  const T = THEMES[theme] || THEMES.full;
  const L = (k) => tr(lang, k);
  const SECTIONS = getSections(lang);
  const COMING_SOON = getComingSoon(lang);
  const TALES = getTales(lang);
  const ALL_MEDS = getPracticeCatalog(lang);
  const [det, setDet] = useState(() => findPractice(initMed, lang) || null);
  const [taleDet, setTaleDet] = useState(null);
  const [active, setActive] = useState(['favorites', 'listened'].includes(initSec) ? 'all' : initSec || 'all');
  const [view, setView] = useState(['favorites', 'listened'].includes(initSec) ? initSec : 'all');
  const [query, setQuery] = useState('');
  const [personal, setPersonal] = useState(getPracticeState);
  useEffect(() => subscribeUserChanges(() => setPersonal(getPracticeState())), []);
  useEffect(() => {
    setActive(['favorites','listened'].includes(initSec) ? 'all' : initSec || 'all');
    setView(['favorites','listened'].includes(initSec) ? initSec : 'all');
  }, [initSec]);
  useEffect(() => {
    if (initMed) { setDet(findPractice(initMed, lang) || null); clearMed?.(); }
  }, [initMed, lang]);
  const { audioRef, play, currentTime, duration, prog, error, togglePlay, seekTo } = usePracticePlayer(det, doMarkPractice, addGems);
  const startMed = med => setDet(med);
  const fmt = formatTime;
  const favoriteButton = med => (
    <button type="button" aria-label={`${personal.favorites[med.id] ? (lang === 'ru' ? 'Убрать из избранного' : 'Remove favorite') : (lang === 'ru' ? 'В избранное' : 'Save favorite')}: ${med.title}`}
      aria-pressed={!!personal.favorites[med.id]} onClick={e => { e.stopPropagation(); toggleFavorite(med.id); }}
      style={{ background: 'transparent', border: 'none', color: personal.favorites[med.id] ? T.accent : tx('var(--txt)', .65), minWidth: 44, minHeight: 44, cursor: 'pointer', fontSize: 25, flexShrink: 0 }}>
      {personal.favorites[med.id] ? '♥' : '♡'}
    </button>
  );
  const resume = ALL_MEDS.filter(m => m.audio_url && personal.progress[m.id]?.position > 5)
    .sort((a,b) => personal.progress[b.id].at-personal.progress[a.id].at)[0];
  const filters = [
    { id: "all", l: lang === "ru" ? "Все состояния" : "All feelings", c: T.accent },
    { id: "resource", l: L("lib_filter_resource"), c: "#E39A3C" },
    { id: "feminine", l: L("lib_filter_feminine"), c: "#DCD2EC" },
    { id: "receiving", l: L("lib_filter_receiving"), c: "#F3CE72" },
    { id: "newlevel", l: L("lib_filter_growth"), c: "#8E76B8" },
    { id: "self", l: L("lib_filter_self"), c: "#C9AFA6" },
    { id: "tales", l: lang === "ru" ? "Сказки" : "Tales", c: "#B9A9DA" },
  ];
  let matches = searchPractices(ALL_MEDS, query).filter(m =>
    (query.trim() || active === 'all' || active === 'tales' || m.sectionId === active) &&
    (view !== 'favorites' || personal.favorites[m.id]) && (view !== 'listened' || personal.completed[m.id]));
  if (view === 'listened') matches.sort((a,b) => personal.completed[b.id].at-personal.completed[a.id].at);
  const vis = view === 'listened' || query.trim()
    ? [{ id: 'results', color: T.accent, title: lang === 'ru' ? `Практики · ${matches.length}` : `Practices · ${matches.length}`, meds: matches }]
    : SECTIONS.map(sec => ({ ...sec, meds: matches.filter(m => m.sectionId === sec.id) })).filter(sec => sec.meds.length);


  return (
    <>
      {/* Shared audio element; playback begins with the player button */}
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
        const hasAudio = !!det.audio_url;
        return (
          <div style={{ minHeight: "100%", background: T.bg, paddingBottom: SP.page * 2, transition: EASE.slow }}>
            <div onClick={() => {
              setDet(null);
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1 style={{ fontFamily: FONT_SERIF, fontSize: TYPE.xxl - 2, fontWeight: 300, lineHeight: LH.tight, color: tx("var(--txt)", OP.primary + 0.03), margin: 0, flex: 1 }}>{det.title}</h1>
                {favoriteButton(det)}
              </div>
              {personal.completed[det.id] && <div style={{ ...body(TYPE.sm), color: T.accent, marginTop: 8 }}>{lang === 'ru' ? 'Прослушано ✓' : 'Listened ✓'}</div>}
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

              {/* ─── Player card ─── */}
              <div className="glass-card" style={{ padding: `${SP.lg + 2}px ${SP.page}px ${SP.xl}px`, background: `${ac}15`, border: `1px solid ${ac}35`, borderRadius: RAD.lg, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", boxShadow: "0 2px 12px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.04)" }}>
                {/* Progress bar */}
                <input type="range" aria-label={lang === 'ru' ? 'Позиция воспроизведения' : 'Playback position'} min="0" max="100" step="0.1" value={Number.isFinite(prog) ? prog : 0} disabled={!hasAudio || !duration} onChange={e => seekTo(Number(e.target.value))} style={{ width: '100%', accentColor: ac, minHeight: 28, cursor: 'pointer' }} />
                {/* Time */}
                <div style={{ display: "flex", justifyContent: "space-between", ...label(TYPE.xs), color: tx("var(--txt)", OP.tertiary + 0.03), marginBottom: SP.xl }}>
                  <span>{fmt(currentTime)}</span>
                  <span>{duration > 0 ? fmt(duration) : det.dur}</span>
                </div>
                {/* Controls */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <button type="button" aria-label={play ? (lang === 'ru' ? 'Пауза' : 'Pause') : (lang === 'ru' ? 'Слушать' : 'Play')} className="press-card" onClick={() => { if (hasAudio) togglePlay(); }}
                    style={{ width: 70, height: 70, borderRadius: RAD.full, cursor: hasAudio ? "pointer" : "default", background: hasAudio ? `linear-gradient(135deg,${ac},${ac}88)` : "rgba(255,255,255,.08)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: hasAudio ? `0 0 40px ${ac}66, 0 0 16px ${ac}44` : "none", opacity: hasAudio ? 1 : 0.35 }}>
                    {play ? <PauseIcon /> : <PlayIcon />}
                  </button>
                </div>
                {currentTime > 5 && !play && <button type="button" onClick={() => seekTo(0)} style={{ display: 'block', margin: '16px auto 0', background: 'transparent', border: 'none', color: tx('var(--txt)', .75), padding: 10 }}>{lang === 'ru' ? 'Начать сначала' : 'Start again'}</button>}
                {error && <p role="alert" style={{ color: tx('var(--txt)', .85), textAlign: 'center' }}>{lang === 'ru' ? 'Не удалось включить аудио. Проверьте соединение и нажмите «Слушать» ещё раз.' : 'Audio could not play. Check your connection and try again.'}</p>}
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
            <div style={{ position: 'relative', marginBottom: 16 }}>
              <input type="search" aria-label={lang === 'ru' ? 'Поиск практик' : 'Search practices'} placeholder={lang === 'ru' ? 'Найти практику или состояние…' : 'Find a practice or a feeling…'} value={query} onChange={e => { setQuery(e.target.value); setView("all"); setActive("all"); }}
                style={{ width: '100%', boxSizing: 'border-box', padding: '15px 42px 15px 16px', borderRadius: 18, background: `rgba(${T.ar},.08)`, border: `1px solid rgba(${T.ar},.3)`, color: tx('var(--txt)', .95), fontSize: 16, fontFamily: FONT_SANS }} />
              {query && <button type="button" aria-label={lang === 'ru' ? 'Очистить поиск' : 'Clear search'} onClick={() => setQuery('')} style={{ position: 'absolute', right: 4, top: 4, width: 40, height: 40, border: 0, background: 'transparent', color: tx('var(--txt)', .8), fontSize: 22 }}>×</button>}
            </div>
            <div role="group" aria-label={lang === 'ru' ? 'Мои практики' : 'My practices'} style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
              {[['all', 'Все', 'All'], ['favorites', 'Избранное', 'Favorites'], ['listened', 'Прослушанные', 'Listened']].map(([id, ru, en]) => <button key={id} type="button" aria-pressed={view === id} onClick={() => { setView(id); setActive('all'); }} style={{ flex: 1, minHeight: 44, padding: '10px 3px', borderRadius: 14, border: `1px solid rgba(${T.ar},${view === id ? .5 : .12})`, background: `rgba(${T.ar},${view === id ? .18 : .03})`, color: tx('var(--txt)', view === id ? .95 : .65), fontFamily: FONT_SANS, fontSize: 12, cursor: 'pointer' }}>{lang === 'ru' ? ru : en}</button>)}
            </div>
            <div style={{ display: "flex", gap: 7, overflowX: "auto", margin: `0 -${SP.xl}px`, padding: `0 ${SP.xl}px ${SP.xs}px` }}>
              {filters.filter(f => view === "all" || f.id !== "tales").map((f) => (
                <div key={f.id} className="pc" onClick={() => setActive(f.id)} style={{ padding: `${SP.sm}px ${SP.lg}px`, borderRadius: RAD.lg, fontSize: TYPE.xs + 0.5, letterSpacing: LS.normal, whiteSpace: "nowrap", flexShrink: 0, cursor: "pointer", fontFamily: FONT_SANS, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", background: active === f.id ? `${f.c}30` : "rgba(255,255,255,.03)", border: `1.5px solid ${active === f.id ? f.c : "rgba(255,255,255,.08)"}`, color: active === f.id ? f.c : tx("var(--txt)", OP.tertiary + 0.08), boxShadow: active === f.id ? `0 0 14px ${f.c}44, inset 0 0 8px ${f.c}08` : "none", transition: EASE.normal }}>{f.l}</div>
              ))}
            </div>
          </div>

          {resume && view === 'all' && !query.trim() && active !== 'tales' && <button type="button" onClick={() => setDet(resume)} style={{ display: 'block', width: `calc(100% - ${SP.xl * 2}px)`, textAlign: 'left', margin: `0 ${SP.xl}px 20px`, padding: 20, borderRadius: 20, background: `linear-gradient(130deg, rgba(${T.ar},.2), rgba(${T.ar},.04))`, border: `1px solid rgba(${T.ar},.35)`, color: tx('var(--txt)', .9), cursor: 'pointer' }}>
            <div style={{ ...label(11), color: T.accent, marginBottom: 8 }}>{lang === 'ru' ? 'Продолжить практику' : 'Continue practice'} →</div>
            <div style={{ ...body(18), marginBottom: 6 }}>{resume.title}</div>
            <div style={{ ...body(12), opacity: .7 }}>{lang === 'ru' ? 'Сохранено на' : 'Saved at'} {fmt(personal.progress[resume.id].position)}</div>
          </button>}
          {matches.length === 0 && (active !== 'tales' || query.trim()) && <p role="status" style={{ padding: '12px 24px', color: tx('var(--txt)', .75), lineHeight: 1.7 }}>{query.trim() ? (lang === 'ru' ? 'Ничего не найдено. Попробуйте другое название или состояние.' : 'Nothing found. Try another name or feeling.') : view === 'favorites' ? (lang === 'ru' ? 'Здесь будут ваши любимые практики. Нажмите на сердечко рядом с названием.' : 'Save a practice using the heart to find it here.') : (lang === 'ru' ? 'Здесь появятся прослушанные практики. Выберите медитацию, с которой хочется начать.' : 'Your completed practices will appear here.')}</p>}
          {/* ─── About the Author ─── */}
          {active !== "tales" && view === "all" && !query.trim() && (
            <div className="glass-card" style={{ margin: `0 ${SP.xl}px ${SP.xl}px`, padding: SP.page, background: `rgba(${T.ar},.05)`, border: `1px solid rgba(${T.ar},.12)`, borderRadius: RAD.lg, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: `radial-gradient(circle, ${T.accent}15 0%, transparent 70%)`, pointerEvents: "none" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: SP.lg }}>
                <div style={{ width: 46, height: 46, borderRadius: "50%", background: "rgba(92,28,46,.35)", border: `1.5px solid ${T.accent}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🎓</div>
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
            {active === "tales" && view === "all" && !query.trim() && (
              <div>
                <div style={{ marginBottom: SP.xl, padding: `${SP.lg}px ${SP.page}px`, background: "rgba(185,169,218,.06)", border: "1px solid rgba(185,169,218,.15)", borderRadius: RAD.lg }}>
                  <div style={{ fontFamily: FONT_SERIF, fontSize: TYPE.base + 1, lineHeight: 1.75, color: tx("var(--txt)", 0.65) }}>
                    {lang === "ru" ? "Терапевтические сказки помогают увидеть себя со стороны, прожить сложные переживания через метафору и найти внутренний ресурс." : "Therapeutic fairy tales help you see yourself from the outside, process difficult experiences through metaphor, and find inner resources."}
                  </div>
                </div>
                {TALES.map((tale) => (
                  <div key={tale.id} onClick={() => setTaleDet(tale)} className="list-item press-card glass-card" style={{ display: "flex", alignItems: "flex-start", gap: SP.md, padding: `${SP.lg}px ${SP.md + 2}px`, background: `rgba(${T.ar},.04)`, border: `1px solid rgba(185,169,218,.18)`, borderRadius: RAD.lg, marginBottom: SP.md, cursor: "pointer", position: "relative", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.04)" }}>
                    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: "linear-gradient(to bottom,#B9A9DA,#8E76B833)", borderRadius: "3px 0 0 3px" }} />
                    <div style={{ fontFamily: FONT_SERIF, fontSize: TYPE.xl - 2, color: "#b9a9da", width: 26, textAlign: "center", flexShrink: 0, lineHeight: 1, paddingTop: 2 }}>✦</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ ...label(TYPE.xs - 0.5), letterSpacing: ".12em", color: "#b9a9da", marginBottom: 4 }}>{tale.label}</div>
                      <div style={{ ...body(TYPE.base + 1), lineHeight: LH.tight + 0.1, color: tx("var(--txt)", OP.primary), marginBottom: 5 }}>{tale.title}</div>
                      <div style={{ ...body(TYPE.sm), color: tx("var(--txt)", OP.secondary - 0.1), lineHeight: 1.55 }}>{tale.short}</div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: SP.sm }}>
                        {tale.tags.map((tag) => (
                          <div key={tag} style={{ padding: `3px ${SP.sm + 2}px`, borderRadius: RAD.full, background: "rgba(185,169,218,.1)", border: "1px solid rgba(185,169,218,.2)", ...label(TYPE.xs - 1), color: tx("var(--txt)", 0.5) }}>{tag}</div>
                        ))}
                      </div>
                    </div>
                    <div style={{ flexShrink: 0, marginTop: SP.xs }}>
                      <div style={{ width: 26, height: 26, borderRadius: RAD.full, background: "rgba(185,169,218,.2)", border: "1px solid rgba(185,169,218,.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: TYPE.sm, color: "#b9a9da" }}>→</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ─── Meditation sections ─── */}
            {(active !== "tales" || query.trim()) && vis.map((sec) => (
              <div key={sec.id} style={{ marginBottom: SP.xl + 2 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: SP.md + 1 }}>
                  <div style={{ width: 11, height: 11, borderRadius: RAD.full, background: sec.color, boxShadow: `0 0 8px ${sec.color}88`, flexShrink: 0 }} />
                  <div style={{ width: 40, height: 1, background: `linear-gradient(to right,${sec.color},transparent)`, flexShrink: 0 }} />
                  <div style={{ ...body(TYPE.base + 1), color: tx("var(--txt)", 0.82) }}>{sec.title}</div>
                </div>
                {sec.meds.map((med) => (
                  <div key={med.n} className="list-item press-card glass-card" style={{ display: "flex", alignItems: "flex-start", gap: SP.md, padding: `${SP.md + 1}px ${SP.md + 2}px`, background: `rgba(${T.ar},.04)`, border: `1px solid rgba(${T.ar},.1)`, borderRadius: RAD.lg, marginBottom: SP.sm, cursor: "pointer", position: "relative", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,.25), inset 0 1px 0 rgba(255,255,255,.04)", animationDelay: `${med.n * 0.05}s` }}>
                    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: `linear-gradient(to bottom,${sec.color},${sec.color}22)`, borderRadius: "3px 0 0 3px" }} />
                    <div style={{ fontFamily: FONT_SERIF, fontSize: TYPE.xl - 2, color: sec.color, width: 26, textAlign: "center", flexShrink: 0, lineHeight: 1, paddingTop: 2 }}>{med.n}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <button type="button" onClick={() => setDet(med)} style={{ ...body(TYPE.base), lineHeight: LH.tight + 0.1, color: tx("var(--txt)", OP.primary), marginBottom: 3, padding: 0, border: 0, background: 'transparent', textAlign: 'left', cursor: 'pointer' }}>{med.title}</button>
                      <div style={{ ...body(TYPE.sm), color: tx("var(--txt)", OP.secondary - 0.1), marginBottom: 5 }}>{med.short}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: SP.sm }}>
                        <span style={{ fontFamily: FONT_SANS, fontSize: 9, color: tx("var(--txt)", OP.tertiary + 0.06) }}>{med.dur}</span>
                        {personal.completed[med.id] && <span style={{ ...body(11), color: T.accent }}>{lang === 'ru' ? 'Прослушано ✓' : 'Listened ✓'}</span>}
                      </div>
                    </div>
                    {favoriteButton(med)}
                    {/* Open the shared player */}
                    <button type="button" aria-label={`${lang === 'ru' ? 'Открыть практику' : 'Open practice'}: ${med.title}`}
                      onClick={() => startMed(med)}
                      style={{ flexShrink: 0, marginTop: SP.xs, width: 30, height: 30, borderRadius: RAD.full, background: `${sec.color}33`, border: `1px solid ${sec.color}66`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M3 2L10 6L3 10V2Z" fill={sec.color}/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ))}

            {/* ─── Coming soon ─── */}
            {active === "all" && view === "all" && !query.trim() && (
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
