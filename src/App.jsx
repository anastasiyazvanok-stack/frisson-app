import { userStorage as localStorage, activateUser, readUser, subscribeUserChanges } from "./lib/userStorage.js";
import { localDay } from "./utils/dates.js";
import { useState, useRef, useEffect } from "react";
import { getThemes } from "./data/themes";
import { getActivity, markPractice, getName, setName as saveName } from "./data/activity";
import { supabase, fetchMeditations, fetchSections, getSession, signOut, syncToCloud, loadFromCloud, getIsRecoveryMode, clearRecoveryMode } from "./lib/supabase";
import { TYPE, SP, RAD, OP, EASE, FONT_SERIF, FONT_SANS, tx, label, heading } from "./utils/design";
import { useLangState, t as tr } from "./utils/i18n";
import GlobalStyles from "./components/GlobalStyles";
import Auth, { PasswordResetForm } from "./components/Auth";
import Admin from "./components/Admin";
import Onboarding from "./components/Onboarding";
import AppTour from "./components/AppTour";
import Home from "./components/Home";
import Library from "./components/Library";
import Journal from "./components/Journal";
import Situations from "./components/Situations";
import Profile from "./components/Profile";
import SubPage from "./components/SubPage";
import Orbit from "./components/Orbit";
import Nav from "./components/Nav";
import AICoach from "./components/AICoach";

export const VERSION = "5.8.0";

function Loading() {
  return <div role="status" style={{ background: '#06030a', color: '#eee', height: '100dvh', display: 'grid', placeItems: 'center' }}>LuxMind · …</div>;
}

export default function App() {
  const [lang, setLang] = useLangState();
  const [session, setSession] = useState(null);
  const [checked, setChecked] = useState(false);
  const [ready, setReady] = useState(false);
  const [recovery, setRecovery] = useState(getIsRecoveryMode);
  const [mode, setMode] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [retry, setRetry] = useState(0);
  const recoveryRef = useRef(getIsRecoveryMode());

  useEffect(() => {
    let alive = true;
    let receivedEvent = false;
    // Keep this callback synchronous: Supabase auth operations must not be
    // awaited while its auth-state callback holds the session lock.
    const receive = (event, next) => {
      if (!alive) return;
      receivedEvent = true;
      if (event === 'PASSWORD_RECOVERY') recoveryRef.current = true;
      if (!next) recoveryRef.current = false;
      setRecovery(recoveryRef.current);
      setSession(previous => previous?.user?.id === next?.user?.id ? previous : next);
      setChecked(true);
    };
    const { data: { subscription } } = supabase.auth.onAuthStateChange(receive);
    getSession().then(next => { if (alive && !receivedEvent) receive('INITIAL_SESSION', next); })
      .catch(error => { if (alive) { setLoadError(error); setChecked(true); } });
    return () => { alive = false; subscription.unsubscribe(); };
  }, []);

  const uid = session?.user?.id;
  useEffect(() => {
    let alive = true;
    activateUser(uid);
    setReady(false);
    setLoadError(null);
    if (!uid) return () => { alive = false; };
    loadFromCloud(uid).then(() => {
      if (!alive) return;
      if (!getName() && session.user.user_metadata?.name) saveName(session.user.user_metadata.name);
      setReady(uid);
    }).catch(error => {
      if (!alive) return;
      setLoadError(error);
      // Only an already initialized, account-scoped cache is safe offline.
      if (readUser(uid).loaded) setReady(uid);
    });
    return () => { alive = false; };
  }, [uid, retry]);

  async function logout() {
    try { if (uid) await syncToCloud(uid); } catch { /* Dirty account cache is retained for retry. */ }
    const { error } = await signOut();
    if (error) throw error;
    clearRecoveryMode(); setRecovery(false); setMode(null);
  }
  if (recovery && session) return <><GlobalStyles /><PasswordResetForm onDone={() => {
    clearRecoveryMode(); recoveryRef.current = false; setRecovery(false);
  }} onCancel={logout} /></>;
  if (!checked) return <Loading />;
  if (!uid) return <><GlobalStyles />{mode
    ? <Auth startMode={mode} onAuth={() => setMode(null)} />
    : <Onboarding onDone={setMode} lang={lang} setLang={setLang} />}</>;
  if (ready !== uid) return loadError ? <div role="alert" style={{ padding: 32, color: '#fff', background: '#160a20', minHeight: '100dvh' }}>
    <p>{lang === 'ru' ? 'Не удалось загрузить ваши данные. Проверьте соединение и попробуйте ещё раз.' : 'Could not load your data. Check your connection and try again.'}</p>
    <button onClick={() => setRetry(n => n + 1)}>{lang === 'ru' ? 'Повторить' : 'Retry'}</button>
  </div> : <Loading />;
  return <UserApp key={uid} userId={uid} userEmail={session.user.email} lang={lang} setLang={setLang} onSignOut={logout} initialSyncError={loadError} />;
}

function UserApp({ userId, userEmail, lang, setLang, onSignOut, initialSyncError }) {
  const L = (k, ...a) => tr(lang, k, ...a);
  const [showAdmin, setShowAdmin] = useState(false);
  const [syncError, setSyncError] = useState(initialSyncError);
  const syncTimer = useRef(null);
  const queueSync = () => {
    clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      syncToCloud(userId).then(() => setSyncError(null)).catch(setSyncError);
    }, 1000);
  };
  useEffect(() => {
    let alive = true;
    const flush = () => syncToCloud(userId).then(() => { if (alive) setSyncError(null); })
      .catch(error => { if (alive) setSyncError(error); });
    const unsubscribe = subscribeUserChanges(uid => { if (uid === userId) queueSync(); });
    const onHide = () => { if (document.visibilityState === 'hidden') flush(); };
    const interval = setInterval(flush, 30000);
    window.addEventListener('online', flush);
    document.addEventListener('visibilitychange', onHide);
    flush();
    return () => { alive = false; unsubscribe(); clearTimeout(syncTimer.current); clearInterval(interval);
      window.removeEventListener('online', flush); document.removeEventListener('visibilitychange', onHide); };
  }, [userId]);
  async function handleSignOut() { try { await onSignOut(); } catch (error) { setSyncError(error); } }
  const [tour, setTour] = useState(() => localStorage.getItem("frisson_tour") === "1");
  const [screen, setScreenRaw] = useState("home");
  const historyRef = useRef(["home"]);
  const setScreen = (s) => {
    if (s !== screen) historyRef.current.push(s);
    setScreenRaw(s);
  };
  const goBack = () => {
    const h = historyRef.current;
    if (h.length > 1) {
      h.pop();
      setScreenRaw(h[h.length - 1]);
    } else {
      setScreenRaw("home");
    }
  };
  const [theme, setTheme] = useState(() => localStorage.getItem("frisson-theme") || "full");
  const setThemePersisted = (t) => { localStorage.setItem("frisson-theme", t); setTheme(t); };
  const THEMES = getThemes();
  const [eScore, setEScoreRaw] = useState(() => {
    const v = localStorage.getItem("frisson_escore");
    const savedDate = localStorage.getItem("frisson_escore_date");
    const todayStr = localDay();
    if (savedDate && savedDate !== todayStr) return null;
    return v !== null && v !== "null" ? parseInt(v) : null;
  });
  const setEScore = (v) => {
    const todayStr = localDay();
    localStorage.setItem("frisson_escore", v === null ? "null" : String(v));
    localStorage.setItem("frisson_escore_date", todayStr);
    setEScoreRaw(v);
    queueSync(userId);
  };
  const [eHist, setEHistRaw] = useState(() => {
    try { const v = JSON.parse(localStorage.getItem("frisson_ehist")); return Array.isArray(v) ? v : []; }
    catch { return []; }
  });
  const setEHist = (updater) => setEHistRaw((prev) => {
    const next = typeof updater === "function" ? updater(prev) : updater;
    localStorage.setItem("frisson_ehist", JSON.stringify(next));
    return next;
  });
  const [pLog] = useState([0, 1, 0, 2, 1, 0, 0]);
  const [libSec, setLibSec] = useState("all");
  const [openMed, setOpenMed] = useState(null);
  const [medFrom, setMedFrom] = useState(null);
  const goToMed = (medTitle, from) => { setOpenMed(medTitle); setMedFrom(from || null); setScreen("library"); };
  const [openScenario, setOpenScenario] = useState(null);
  const goToScenario = (scId) => { setOpenScenario(scId); setScreen("orbit"); };
  const [gems, setGems] = useState(() => parseInt(localStorage.getItem("frisson_gems")) || 0);
  const addGems = (n) => setGems((g) => { const v = g + n; localStorage.setItem("frisson_gems", v); queueSync(userId); return v; });

  // ─── Cloud content (fetched once on app load, cached for offline) ───
  const [remoteMeds, setRemoteMeds] = useState(null);
  const [remoteSections, setRemoteSections] = useState(null);
  function refreshContent() {
    Promise.all([fetchMeditations(), fetchSections()])
      .then(([m, s]) => { setRemoteMeds(m); setRemoteSections(s); });
  }
  useEffect(() => { refreshContent(); }, []);

  const [activity, setActivity] = useState(getActivity);
  const [userName, setUserName] = useState(getName);
  const [showNameInput, setShowNameInput] = useState(() => !getName());
  const [nameVal, setNameVal] = useState("");
  const doMarkPractice = (minutes) => { const a = markPractice(minutes); setActivity({ ...a }); queueSync(userId); };
  const doSetName = (n) => { saveName(n); setUserName(n); setShowNameInput(false); queueSync(userId); };

  const scrollRef = useRef(null);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [screen]);

  const T = THEMES[theme] || THEMES.full;
  const showNav = screen !== "sub" && screen !== "situations" && screen !== "coach";

  if (showAdmin) return (<><GlobalStyles /><Admin userEmail={userEmail} onClose={() => { setShowAdmin(false); refreshContent(); }} /></>);

  if (!tour) return (<><GlobalStyles /><AppTour onDone={() => { localStorage.setItem("frisson_tour", "1"); setTour(true); queueSync(userId); }} theme={theme} THEMES={THEMES} lang={lang} /></>);

  if (showNameInput) return (
    <><GlobalStyles />
    <div style={{ width: "100%", height: "100dvh", background: "linear-gradient(165deg, #1a0418 0%, #2a1408 50%, #0c0820 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: `0 ${SP.xxl}px`, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", width: "70%", height: "70%", top: "-15%", left: "-15%", borderRadius: "50%", background: "radial-gradient(circle,rgba(230,77,168,.6),rgba(159,123,216,.4) 55%,transparent 72%)", filter: "blur(55px)", animation: "breathe 18s ease-in-out infinite" }} />
      <div style={{ position: "absolute", width: "55%", height: "55%", bottom: "-10%", right: "-8%", borderRadius: "50%", background: "radial-gradient(circle,rgba(240,136,56,.5),rgba(208,128,176,.4) 55%,transparent 72%)", filter: "blur(50px)", animation: "breathe 22s 4s ease-in-out infinite" }} />
      <div style={{ position: "relative", zIndex: 1, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <img src="./brand/ornament-white.png" alt="" style={{ width: 56, height: "auto", opacity: 0.7, filter: "drop-shadow(0 0 20px rgba(230,77,168,.4))", marginBottom: SP.lg }} />
        <div style={{ ...heading(40), color: "#fff", textAlign: "center", textShadow: "0 0 40px rgba(230,77,168,.5)", marginBottom: SP.sm }}>LuxMind</div>
        <div style={{ ...label(TYPE.xs), color: "rgba(180,150,165,.5)", letterSpacing: ".3em", marginBottom: 40 }}>{L("ask_name")}</div>
        <input
          autoFocus
          placeholder={L("your_name")}
          value={nameVal}
          onChange={(e) => setNameVal(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && nameVal.trim()) doSetName(nameVal.trim()); }}
          style={{ width: "100%", maxWidth: 260, padding: `${SP.lg}px ${SP.page}px`, borderRadius: RAD.lg, background: "rgba(0,0,0,.25)", border: "1px solid rgba(200,160,180,.3)", outline: "none", fontFamily: FONT_SERIF, fontSize: TYPE.xl, color: "#fff", textAlign: "center", caretColor: "rgba(230,77,168,.8)", backdropFilter: "blur(12px)" }}
        />
        <button
          type="button"
          onClick={() => { if (nameVal.trim()) doSetName(nameVal.trim()); }}
          style={{
            marginTop: SP.xl, width: "100%", maxWidth: 260, padding: SP.lg, borderRadius: RAD.lg,
            textAlign: "center", cursor: nameVal.trim() ? "pointer" : "default",
            background: nameVal.trim() ? "linear-gradient(135deg, rgba(230,77,168,.6), rgba(240,136,56,.5))" : "rgba(255,255,255,.03)",
            border: `1.5px solid ${nameVal.trim() ? "rgba(240,136,56,.7)" : "rgba(255,255,255,.07)"}`,
            boxShadow: nameVal.trim() ? "0 0 32px rgba(230,77,168,.4)" : "none",
            ...label(TYPE.xs), fontWeight: 400, letterSpacing: ".25em",
            color: nameVal.trim() ? "rgba(245,228,233,.96)" : "rgba(230,218,225,.2)",
            opacity: nameVal.trim() ? 1 : 0.4, transition: EASE.normal,
            touchAction: "manipulation", WebkitAppearance: "none",
          }}
        >{L("enter")}</button>
      </div>
    </div></>
  );

  const screens = {
    home: <Home setScreen={setScreen} theme={theme} setTheme={setThemePersisted} eScore={eScore} pLog={pLog} setLibSec={setLibSec} THEMES={THEMES} activity={activity} userName={userName} doMarkPractice={doMarkPractice} lang={lang} goToMed={goToMed} remoteMeds={remoteMeds} remoteSections={remoteSections} />,
    library: <Library setScreen={setScreen} goBack={goBack} theme={theme} initSec={libSec} initMed={openMed} clearMed={() => setOpenMed(null)} medFrom={medFrom} clearMedFrom={() => setMedFrom(null)} THEMES={THEMES} doMarkPractice={doMarkPractice} addGems={addGems} remoteMeds={remoteMeds} remoteSections={remoteSections} lang={lang} />,
    orbit: <Orbit setScreen={setScreen} goBack={goBack} addGems={addGems} doMarkPractice={doMarkPractice} initScenario={openScenario} clearInitScenario={() => setOpenScenario(null)} lang={lang} eScore={eScore} theme={theme} THEMES={THEMES} activity={activity} userName={userName} />,
    journal: <Journal theme={theme} addGems={addGems} THEMES={THEMES} doMarkPractice={doMarkPractice} lang={lang} />,
    situations: <Situations setScreen={setScreen} goBack={goBack} theme={theme} goToMed={goToMed} THEMES={THEMES} lang={lang} />,
    profile: <Profile setScreen={setScreen} theme={theme} eScore={eScore} setEScore={setEScore} eHist={eHist} setEHist={setEHist} pLog={pLog} gems={gems} THEMES={THEMES} activity={activity} eScoreHistory={eHist} goToScenario={goToScenario} lang={lang} setLang={setLang} onSignOut={handleSignOut} onAdmin={userEmail === "anastasiyazvanok@gmail.com" ? () => setShowAdmin(true) : undefined} />,
    sub: <SubPage setScreen={setScreen} goBack={goBack} theme={theme} THEMES={THEMES} lang={lang} />,
    coach: <AICoach goBack={goBack} lang={lang} />,
  };

  return (
    <>
      <GlobalStyles />
      <div style={{ width: "100%", height: "100dvh", background: "#040208", display: "flex", alignItems: "flex-start", justifyContent: "center", overflow: "hidden" }}>
        <div style={{ width: "100%", maxWidth: 430, height: "100dvh", display: "flex", flexDirection: "column", background: T.bg, transition: EASE.slow, boxShadow: "0 0 60px rgba(6,2,8,.8)", position: "relative", "--txt": T.tr || "242,232,226" }}>
          {screen !== "orbit" && (
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
              {Array.from({ length: 14 }, (_, i) => {
                const useAlt = T.ar2 && i % 3 === 0;
                const col = useAlt ? T.ar2 : T.ar;
                return (
                  <div key={i} className="ambient-dot" style={{
                    position: "absolute",
                    left: `${(i * 53 + 13) % 100}%`,
                    top: `${(i * 37 + 7) % 100}%`,
                    width: useAlt ? 2.5 : 1.5, height: useAlt ? 2.5 : 1.5, borderRadius: RAD.full,
                    background: `rgba(${col},.${2 + (i % 3)})`,
                    boxShadow: `0 0 ${useAlt ? 5 : 3}px rgba(${col},.4)`,
                    animationDelay: `${(i * 0.5) % 8}s`,
                    animationDuration: `${8 + (i % 4)}s`,
                  }} />
                );
              })}
            </div>
          )}
          {syncError && <div role="alert" style={{ padding: '10px 16px', color: '#ffe9dc', background: '#613647', position: 'relative', zIndex: 2, fontSize: 12 }}>
            {lang === 'ru' ? (syncError.code === 'SYNC_CONFLICT' ? 'На другом устройстве есть изменения. Ваша локальная копия сохранена; синхронизация приостановлена, чтобы ничего не перезаписать.' : 'Не удалось сохранить данные в облаке. Изменения сохранены на этом устройстве; повторим отправку при восстановлении связи.') : (syncError.code === 'SYNC_CONFLICT' ? 'Another device has changes. Your local copy is safe; sync is paused to prevent overwriting it.' : 'Cloud sync failed. Your changes are saved on this device and will be retried.')}
          </div>}
          <div ref={scrollRef} key={screen} className="screen-in" style={{ flex: 1, overflowY: screen === "orbit" ? "hidden" : "auto", overflowX: "hidden", position: "relative", zIndex: 1, display: "flex", flexDirection: "column" }}>{screens[screen]}</div>
          {/* Edge-swipe back gesture (left edge swipe-right) */}
          {screen !== "orbit" && screen !== "home" && (
            <div
              style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 22, zIndex: 40, touchAction: "pan-y" }}
              onTouchStart={(e) => { const t = e.touches[0]; e.currentTarget._x = t.clientX; e.currentTarget._y = t.clientY; }}
              onTouchEnd={(e) => {
                const t = e.changedTouches[0];
                const dx = t.clientX - (e.currentTarget._x || 0);
                const dy = Math.abs(t.clientY - (e.currentTarget._y || 0));
                if (dx > 50 && dy < 80) goBack();
              }}
            />
          )}
          {showNav && <Nav active={screen} setScreen={setScreen} theme={theme} THEMES={THEMES} lang={lang} />}
          <div style={{ position: "absolute", bottom: showNav ? SP.xl : SP.xs, right: SP.sm, ...label(TYPE.xs), fontSize: 8, color: `rgba(255,255,255,.1)`, pointerEvents: "none", zIndex: 50 }}>v{VERSION}</div>
        </div>
      </div>
    </>
  );
}
