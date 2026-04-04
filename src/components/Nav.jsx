import { THEMES } from "../data/themes";
import { FONT_SANS } from "../utils/helpers";

export default function Nav({ active, setScreen, theme }) {
  const T = THEMES[theme] || THEMES.full;
  const items = [
    {
      id: "home", l: "Главная",
      ic: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>,
    },
    {
      id: "library", l: "Практики",
      ic: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M10 8l6 4-6 4V8z"/></svg>,
    },
    {
      id: "journal", l: "Дневник",
      ic: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
    },
    {
      id: "profile", l: "Профиль",
      ic: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    },
  ];

  return (
    <div style={{
      background: T.bg,
      backdropFilter: "blur(20px)",
      borderTop: `1px solid ${T.nav}`,
      display: "flex",
      justifyContent: "space-around",
      padding: "10px 0 22px",
    }}>
      {items.map((it) => (
        <div
          key={it.id}
          onClick={() => setScreen(it.id)}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer" }}
        >
          <div style={{ color: active === it.id ? T.accent : "rgba(242,232,226,.25)", transition: "color .3s" }}>
            {it.ic}
          </div>
          <span style={{
            fontSize: 9,
            letterSpacing: ".1em",
            textTransform: "uppercase",
            fontFamily: FONT_SANS,
            color: active === it.id ? T.accent : "rgba(242,232,226,.25)",
            transition: "color .3s",
          }}>
            {it.l}
          </span>
        </div>
      ))}
    </div>
  );
}
