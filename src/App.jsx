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
import Nav from "./components/Nav";

export default function App() {
  const [onb, setOnb] = useState(false);
  const [tour, setTour] = useState(false);
  const [screen, setScreen] = useState("home");
  const [theme, setTheme] = useState("full");
  const [eScore, setEScore] = useState(null);
  const [eHist, setEHist] = useState([
    { score: 42, date: "1 мар" },
    { score: 55, date: "8 мар" },
    { score: 48, date: "15 мар" },
    { score: 62, date: "22 мар" },
  ]);
  const [pLog] = useState([0, 1, 0, 2, 1, 0, 0]);
  const [libSec, setLibSec] = useState("all");

  const T = THEMES[theme] || THEMES.full;
  const showNav = screen !== "sub" && screen !== "situations";

  if (!onb) return (<><GlobalStyles /><Onboarding onDone={() => setOnb(true)} /></>);
  if (!tour) return (<><GlobalStyles /><AppTour onDone={() => setTour(true)} theme={theme} /></>);

  const screens = {
    home: <Home setScreen={setScreen} theme={theme} setTheme={setTheme} eScore={eScore} pLog={pLog} setLibSec={setLibSec} />,
    library: <Library setScreen={setScreen} theme={theme} initSec={libSec} />,
    journal: <Journal theme={theme} />,
    situations: <Situations setScreen={setScreen} theme={theme} />,
    profile: <Profile setScreen={setScreen} theme={theme} eScore={eScore} setEScore={setEScore} eHist={eHist} setEHist={setEHist} pLog={pLog} />,
    sub: <SubPage setScreen={setScreen} theme={theme} />,
  };

  return (
    <>
      <GlobalStyles />
      <div style={{ width: "100%", height: "100vh", background: "#04020a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 430, height: "100vh", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
          <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>{screens[screen]}</div>
          {showNav && <Nav active={screen} setScreen={setScreen} theme={theme} />}
        </div>
      </div>
    </>
  );
}
