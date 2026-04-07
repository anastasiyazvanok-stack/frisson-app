import { FONT_SANS } from "../utils/helpers";

export default function Nav({ active, setScreen, theme, THEMES }) {
  const T = THEMES[theme] || THEMES.full;
  const items = [
    {
      id: "home", l: "Главная",
      ic: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>,
    },
    {
      id: "library", l: "Библиотека",
      ic: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27z"/></svg>,
    },
    {
      id: "orbit", l: "Психика",
      ic: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(0 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/></svg>,
    },
    {
      id: "journal", l: "Дневник",
      ic: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
    },
    {
      id: "profile", l: "Профиль",
      ic: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
    },
  ];

  return (
    <div style={{
      background: T.bg,
      backdropFilter: "blur(20px)",
      borderTop: `1px solid ${T.nav}`,
      display: "flex",
      justifyContent: "space-around",
      padding: "10px 0 18px",
      transition: "all .6s",
    }}>
      {items.map((it) => {
        const isActive = active === it.id;
        return (
          <div
            key={it.id}
            onClick={() => setScreen(it.id)}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", position: "relative" }}
          >
            <div
              key={`${it.id}-${isActive}`}
              className={isActive ? "nav-active-pop" : ""}
              style={{ color: isActive ? T.accent : "rgba(242,232,226,.25)", transition: "color .4s", filter: isActive ? `drop-shadow(0 0 6px ${T.accent}aa)` : "none" }}
            >
              {it.ic}
            </div>
            <span style={{
              fontSize: 9,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              fontFamily: FONT_SANS,
              color: isActive ? T.accent : "rgba(242,232,226,.25)",
              transition: "color .4s",
            }}>
              {it.l}
            </span>
            {isActive && <div style={{ position: "absolute", top: -10, width: 4, height: 4, borderRadius: "50%", background: T.accent, boxShadow: `0 0 8px ${T.accent}` }} />}
          </div>
        );
      })}
    </div>
  );
}
