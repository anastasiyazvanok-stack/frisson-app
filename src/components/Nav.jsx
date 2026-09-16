import { TYPE, SP, RAD, OP, EASE, FONT_SANS, label, tx } from "../utils/design";
import { t as tr } from "../utils/i18n";

export default function Nav({ active, setScreen, theme, THEMES, lang = "ru" }) {
  const T = THEMES[theme] || THEMES.full;
  const L = (k) => tr(lang, k);
  const items = [
    {
      id: "home", l: L("nav_home"),
      ic: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>,
    },
    {
      id: "library", l: L("nav_library"),
      ic: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27z"/></svg>,
    },
    {
      id: "orbit", l: L("nav_orbit"),
      ic: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(0 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/></svg>,
    },
    {
      id: "journal", l: L("nav_journal"),
      ic: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
    },
    {
      id: "profile", l: L("nav_profile"),
      ic: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
    },
  ];

  return (
    <div style={{
      background: "rgba(14,8,16,.75)",
      backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
      borderTop: `1px solid rgba(${T.ar},.12)`,
      display: "flex",
      justifyContent: "space-around",
      padding: `10px 0 ${SP.xl}px`,
      transition: EASE.slow,
      position: "relative",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent 5%, ${T.accent}44 30%, ${T.accent}66 50%, ${T.accent}44 70%, transparent 95%)`,
        opacity: 0.6,
      }} />
      {items.map((it) => {
        const on = active === it.id;
        return (
          <div
            key={it.id}
            onClick={() => setScreen(it.id)}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              cursor: "pointer", position: "relative", padding: `6px ${SP.md}px`,
              borderRadius: RAD.md,
              background: on ? `rgba(${T.ar},.1)` : "transparent",
              transition: "all .3s cubic-bezier(.34,1.56,.64,1)",
            }}
          >
            <div style={{
              color: on ? T.accent : tx("var(--txt)", OP.disabled + 0.06),
              transition: "all .3s cubic-bezier(.34,1.56,.64,1)",
              transform: on ? "scale(1.1)" : "scale(1)",
              filter: on ? `drop-shadow(0 0 6px ${T.accent}88)` : "none",
            }}>
              {it.ic}
            </div>
            <span style={{
              ...label(TYPE.xs), fontSize: 9,
              color: on ? T.accent : tx("var(--txt)", OP.disabled + 0.06),
              transition: "all .3s ease",
              fontWeight: on ? 500 : 400,
            }}>
              {it.l}
            </span>
            {on && <div style={{
              position: "absolute", top: -1,
              width: 16, height: 2, borderRadius: 2,
              background: T.accent,
              boxShadow: `0 0 8px ${T.accent}`,
              transition: "all .3s cubic-bezier(.34,1.56,.64,1)",
            }} />}
          </div>
        );
      })}
    </div>
  );
}
