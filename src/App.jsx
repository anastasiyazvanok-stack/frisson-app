import { useState, useRef, useEffect } from "react";
import { getThemes } from "./data/themes";
import { getActivity, markPractice, getName, setName as saveName } from "./data/activity";
import { TYPE, SP, RAD, OP, EASE, FONT_SERIF, FONT_SANS, tx, label, heading } from "./utils/design";
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

export const VERSION = "5.2.2";

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

  const [activity, setActivity] = useState(getActivity);
  const [userName, setUserName] = useState(getName);
  const [showNameInput, setShowNameInput] = useState(() => !getName());
  const doMarkPractice = (minutes) => { const a = markPractice(minutes); setActivity({ ...a }); };
  const doSetName = (n) => { saveName(n); setUserName(n); setShowNameInput(false); };

  const scrollRef = useRef(null);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [screen]);

  const T = THEMES[theme] || THEMES.full;
  const showNav = screen !== "sub" && screen !== "situations";

  if (!onb) return (<><GlobalStyles /><Onboarding onDone={() => { localStorage.setItem("frisson_onb", "1"); setOnb(true); }} /></>);
  if (!tour) return (<><GlobalStyles /><AppTour onDone={() => { localStorage.setItem("frisson_tour", "1"); setTour(true); }} theme={theme} THEMES={THEMES} /></>);

  if (showNameInput) return (
    <><GlobalStyles />
    <div style={{ width: "100%", height: "100dvh", background: "linear-gradient(165deg, #1a0418 0%, #2a1408 50%, #0c0820 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: `0 ${SP.xxl}px`, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", width: "70%", height: "70%", top: "-15%", left: "-15%", borderRadius: "50%", background: "radial-gradient(circle,rgba(230,77,168,.6),rgba(159,123,216,.4) 55%,transparent 72%)", filter: "blur(55px)", animation: "breathe 18s ease-in-out infinite" }} />
      <div style={{ position: "absolute", width: "55%", height: "55%", bottom: "-10%", right: "-8%", borderRadius: "50%", background: "radial-gradient(circle,rgba(240,136,56,.5),rgba(208,128,176,.4) 55%,transparent 72%)", filter: "blur(50px)", animation: "breathe 22s 4s ease-in-out infinite" }} />
      <div style={{ position: "relative", zIndex: 1, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ ...heading(40), color: "#fff", textAlign: "center", textShadow: "0 0 40px rgba(230,77,168,.5)", marginBottom: SP.sm }}>Frisson</div>
        <div style={{ ...label(TYPE.xs), color: "rgba(180,150,165,.5)", letterSpacing: ".3em", marginBottom: 40 }}>✦ как вас зовут? ✦</div>
        <input
          autoFocus
          placeholder="Ваше имя"
          onKeyDown={(e) => { if (e.key === "Enter" && e.target.value.trim()) doSetName(e.target.value.trim()); }}
          style={{ width: "100%", maxWidth: 260, padding: `${SP.lg}px ${SP.page}px`, borderRadius: RAD.lg, background: "rgba(0,0,0,.25)", border: "1px solid rgba(200,160,180,.3)", outline: "none", fontFamily: FONT_SERIF, fontSize: TYPE.xl, color: "#fff", textAlign: "center", caretColor: "rgba(230,77,168,.8)", backdropFilter: "blur(12px)" }}
        />
        <div style={{ ...label(TYPE.xs), color: "rgba(180,150,165,.35)", marginTop: SP.lg }}>Нажмите Enter</div>
      </div>
    </div></>
  );

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
          <div ref={scrollRef} key={screen} className="screen-in" style={{ flex: 1, overflowY: screen === "orbit" ? "hidden" : "auto", overflowX: "hidden", position: "relative", zIndex: 1, display: "flex", flexDirection: "column" }}>{screens[screen]}</div>
          {showNav && <Nav active={screen} setScreen={setScreen} theme={theme} THEMES={THEMES} />}
          <div style={{ position: "absolute", bottom: showNav ? SP.xl : SP.xs, right: SP.sm, ...label(TYPE.xs), fontSize: 8, color: `rgba(255,255,255,.1)`, pointerEvents: "none", zIndex: 50 }}>v{VERSION}</div>
        </div>
      </div>
    </>
  );
}
