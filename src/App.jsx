import { useState } from "react";
import { THEMES } from "./data/themes";
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

export const VERSION = "1.5.0";

export default function App() {
  const [onb, setOnb] = useState(() => localStorage.getItem("frisson_onb") === "1");
  const [tour, setTour] = useState(() => localStorage.getItem("frisson_tour") === "1");
  const [screen, setScreen] = useState("home");
  const [theme, setTheme] = useState("full");
  const [eScore, setEScore] = useState(null);
  const [eHist, setEHist] = useState([
    { score: 42, date: "1 мар" },
    { score: 55, date: "8 мар" },
    { score: 48, date: "15 мар" },
    { score: 63, date: "21 мар" },
  ]);
  const [pLog] = useState([0, 1, 0, 2, 1, 0, 0]);
  const [libSec, setLibSec] = useState("all");

  const T = THEMES[theme] || THEMES.full;
  const showNav = screen !== "sub" && screen !== "situations" && screen !== "orbit";

  if (!onb) return (<><GlobalStyles /><Onboarding onDone={() => { localStorage.setItem("frisson_onb", "1"); setOnb(true); }} /></>);
  if (!tour) return (<><GlobalStyles /><AppTour onDone={() => { localStorage.setItem("frisson_tour", "1"); setTour(true); }} theme={theme} /></>);

  const screens = {
    home: <Home setScreen={setScreen} theme={theme} setTheme={setTheme} eScore={eScore} pLog={pLog} setLibSec={setLibSec} />,
    library: <Library setScreen={setScreen} theme={theme} initSec={libSec} />,
    orbit: <Orbit setScreen={setScreen} />,
    journal: <Journal theme={theme} />,
    situations: <Situations setScreen={setScreen} theme={theme} />,
    profile: <Profile setScreen={setScreen} theme={theme} eScore={eScore} setEScore={setEScore} eHist={eHist} setEHist={setEHist} pLog={pLog} />,
    sub: <SubPage setScreen={setScreen} theme={theme} />,
  };

  return (
    <>
      <GlobalStyles />
      <div style={{ width: "100%", height: "100dvh", background: "#04020a", display: "flex", alignItems: "flex-start", justifyContent: "center", overflow: "hidden" }}>
        <div style={{ width: "100%", maxWidth: 430, height: "100dvh", display: "flex", flexDirection: "column", background: T.bg, transition: "background .6s", boxShadow: "0 0 80px rgba(92,14,28,.2)", position: "relative" }}>
          <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>{screens[screen]}</div>
          {showNav && <Nav active={screen} setScreen={setScreen} theme={theme} />}
          <div style={{ position: "absolute", bottom: showNav ? 22 : 4, right: 6, fontSize: 8, color: "rgba(255,255,255,.12)", fontFamily: "sans-serif", pointerEvents: "none", zIndex: 50 }}>v{VERSION}</div>
        </div>
      </div>
    </>
  );
}
