import { useState, useRef, useEffect } from "react";
import { getThemes } from "./data/themes";
import { getActivity, markPractice, getName, setName as saveName } from "./data/activity";
import GlobalStyles from "./components/GlobalStyles";
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

export const VERSION = "3.4.2";

export default function App() {
  const [onb, setOnb] = useState(() => localStorage.getItem("frisson_onb") === "1");
  const [tour, setTour] = useState(() => localStorage.getItem("frisson_tour") === "1");
  const [screen, setScreen] = useState("home");
  const [theme, setTheme] = useState(() => localStorage.getItem("frisson-theme") || "full");
  const setThemePersisted = (t) => { localStorage.setItem("frisson-theme", t); setTheme(t); };
  const THEMES = getThemes();
  const [eScore, setEScoreRaw] = useState(() => {
    const v = localStorage.getItem("frisson_escore");
    return v !== null && v !== "null" ? parseInt(v) : null;
  });
  const setEScore = (v) => { localStorage.setItem("frisson_escore", v === null ? "null" : String(v)); setEScoreRaw(v); };
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
  const addGems = (n) => setGems((g) => { const v = g + n; localStorage.setItem("frisson_gems", v); return v; });

  // Activity tracking
  const [activity, setActivity] = useState(getActivity);
  const [userName, setUserName] = useState(getName);
  const [showNameInput, setShowNameInput] = useState(() => !getName());
  const doMarkPractice = (minutes) => { const a = markPractice(minutes); setActivity({ ...a }); };
  const doSetName = (n) => { saveName(n); setUserName(n); setShowNameInput(false); };

  const scrollRef = useRef(null);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [screen]);

  const T = THEMES[theme] || THEMES.full;
  const showNav = screen !== "sub" && screen !== "situations";

  // Name input screen
  if (showNameInput) return (
    <><GlobalStyles />
    <div style={{ width: "100%", height: "100dvh", background: "#080A06", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 32px" }}>
      <div style={{ fontFamily: "'Cormorant',Georgia,serif", fontSize: 42, fontWeight: 300, color: "#fff", textAlign: "center", marginBottom: 8 }}>Frisson</div>
      <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 10, letterSpacing: ".3em", textTransform: "uppercase", color: "rgba(180,150,165,.5)", marginBottom: 40 }}>✦ как вас зовут? ✦</div>
      <input
        autoFocus
        placeholder="Ваше имя"
        onKeyDown={(e) => { if (e.key === "Enter" && e.target.value.trim()) doSetName(e.target.value.trim()); }}
        style={{ width: "100%", maxWidth: 260, padding: "16px 20px", borderRadius: 16, background: "rgba(255,255,255,.06)", border: "1px solid rgba(200,160,180,.25)", outline: "none", fontFamily: "'Cormorant',Georgia,serif", fontSize: 20, color: "#fff", textAlign: "center", caretColor: "rgba(200,160,180,.8)" }}
      />
      <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 11, color: "rgba(200,160,180,.4)", marginTop: 16 }}>Нажмите Enter</div>
    </div></>
  );

  if (!onb) return (<><GlobalStyles /><Onboarding onDone={() => { localStorage.setItem("frisson_onb", "1"); setOnb(true); }} /></>);
  if (!tour) return (<><GlobalStyles /><AppTour onDone={() => { localStorage.setItem("frisson_tour", "1"); setTour(true); }} theme={theme} THEMES={THEMES} /></>);

  const screens = {
    home: <Home setScreen={setScreen} theme={theme} setTheme={setThemePersisted} eScore={eScore} pLog={pLog} setLibSec={setLibSec} THEMES={THEMES} activity={activity} userName={userName} doMarkPractice={doMarkPractice} />,
    library: <Library setScreen={setScreen} theme={theme} initSec={libSec} initMed={openMed} clearMed={() => setOpenMed(null)} medFrom={medFrom} clearMedFrom={() => setMedFrom(null)} THEMES={THEMES} doMarkPractice={doMarkPractice} addGems={addGems} />,
    orbit: <Orbit setScreen={setScreen} addGems={addGems} doMarkPractice={doMarkPractice} initScenario={openScenario} clearInitScenario={() => setOpenScenario(null)} />,
    journal: <Journal theme={theme} addGems={addGems} THEMES={THEMES} doMarkPractice={doMarkPractice} />,
    situations: <Situations setScreen={setScreen} theme={theme} goToMed={goToMed} THEMES={THEMES} />,
    profile: <Profile setScreen={setScreen} theme={theme} eScore={eScore} setEScore={setEScore} eHist={eHist} setEHist={setEHist} pLog={pLog} gems={gems} THEMES={THEMES} activity={activity} eScoreHistory={eHist} goToScenario={goToScenario} />,
    sub: <SubPage setScreen={setScreen} theme={theme} THEMES={THEMES} />,
  };

  return (
    <>
      <GlobalStyles />
      <div style={{ width: "100%", height: "100dvh", background: "#04020a", display: "flex", alignItems: "flex-start", justifyContent: "center", overflow: "hidden", transition: "background .6s" }}>
        <div className={""} style={{ width: "100%", maxWidth: 430, height: "100dvh", display: "flex", flexDirection: "column", background: T.bg, transition: "background .6s", boxShadow: "0 0 80px rgba(92,14,28,.2)", position: "relative" }}>
          {/* Ambient floating dots — app-wide background */}
          {screen !== "orbit" && (
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
              {Array.from({ length: 18 }, (_, i) => (
                <div key={i} className="ambient-dot" style={{
                  position: "absolute",
                  left: `${(i * 53 + 13) % 100}%`,
                  top: `${(i * 37 + 7) % 100}%`,
                  width: 2, height: 2, borderRadius: "50%",
                  background: `rgba(${T.ar},.${3 + (i % 4)})`,
                  boxShadow: `0 0 4px rgba(${T.ar},.4)`,
                  animationDelay: `${(i * 0.4) % 8}s`,
                  animationDuration: `${6 + (i % 5)}s`,
                }} />
              ))}
            </div>
          )}
          <div ref={scrollRef} key={screen} className="screen-in" style={{ flex: 1, overflowY: screen === "orbit" ? "hidden" : "auto", overflowX: "hidden", position: "relative", zIndex: 1, display: "flex", flexDirection: "column" }}>{screens[screen]}</div>
          {showNav && <Nav active={screen} setScreen={setScreen} theme={theme} THEMES={THEMES} />}
          <div style={{ position: "absolute", bottom: showNav ? 22 : 4, right: 6, fontSize: 8, color: "rgba(255,255,255,.12)", fontFamily: "sans-serif", pointerEvents: "none", zIndex: 50 }}>v{VERSION}</div>
        </div>
      </div>
    </>
  );
}
