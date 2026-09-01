// THEMES passed via props
import { TYPE, SP, RAD, OP, EASE, FONT_SERIF, FONT_SANS, tx, label, body, heading, card as cardStyle, section } from "../utils/design";
import Orb from "./Orb";
import { t as tr } from "../utils/i18n";

export default function SubPage({ setScreen, goBack, theme, THEMES, lang = "ru" }) {
  const T = THEMES[theme] || THEMES.full;
  const L = (k) => tr(lang, k);

  return (
    <div style={{ minHeight: "100%", background: T.bg, paddingBottom: SP.page, position: "relative", transition: EASE.slow }}>
      <Orb style={{ top: -60, left: "50%", transform: "translateX(-50%)" }} color={T.o1} opacity={OP.disabled} w={280} h={280} />
      <div onClick={() => goBack ? goBack() : setScreen("home")} style={{ padding: `${SP.page}px ${SP.xl}px 0`, display: "flex", alignItems: "center", gap: 9, cursor: "pointer", position: "relative", zIndex: 1 }}>
        <span style={{ fontSize: 15, color: tx("var(--txt)", OP.tertiary + 0.08) }}>←</span>
        <span style={{ ...label(TYPE.sm), color: tx("var(--txt)", OP.tertiary + 0.08) }}>{L("back")}</span>
      </div>
      <div style={{ padding: `${SP.page}px ${SP.xl}px 0`, textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ ...label(9), color: T.accent, letterSpacing: ".25em", marginBottom: SP.md - 2 }}>{L("sub_full_access")}</div>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 34, fontWeight: 300, lineHeight: 1.15, color: tx("var(--txt)", OP.primary + 0.03), marginBottom: SP.sm }}>LuxMind Premium</div>
        <div style={{ ...body(15), color: tx("var(--txt)", 0.45), maxWidth: 280, margin: `0 auto ${SP.xl}px` }}>{L("sub_tagline")}</div>
      </div>
      <div style={{ padding: `0 ${SP.xl}px`, position: "relative", zIndex: 1 }}>
        <div style={{ borderRadius: RAD.lg + 2, overflow: "hidden", marginBottom: SP.md, cursor: "pointer", background: `linear-gradient(135deg,${T.gF},${T.gT})`, border: `1.5px solid ${T.accent}44`, position: "relative", boxShadow: `0 8px 32px rgba(0,0,0,.4), 0 0 20px ${T.accent}12` }}>
          <div style={{ position: "absolute", top: 0, right: 0, background: T.dim, borderRadius: `0 ${RAD.lg + 2}px 0 ${RAD.md}px`, padding: `6px ${RAD.md}px`, ...label(9), letterSpacing: ".15em", color: T.accent }}>{L("sub_save50")}</div>
          <div style={{ padding: `${SP.xl}px ${SP.xl - 2}px ${SP.page}px` }}>
            <div style={{ ...label(9), letterSpacing: ".22em", color: tx("var(--txt)", OP.tertiary + 0.08), marginBottom: SP.sm }}>{L("sub_yearly")}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: SP.sm, marginBottom: SP.xs }}>
              <div style={{ fontFamily: FONT_SERIF, fontSize: 42, fontWeight: 300, color: tx("var(--txt)", OP.primary + 0.03), lineHeight: 1 }}>900</div>
              <div>
                <div style={{ fontSize: TYPE.base, color: tx("var(--txt)", OP.secondary - 0.05), fontFamily: FONT_SANS }}>{L("sub_per_year")}</div>
                <div style={{ fontSize: TYPE.sm, color: T.accent, fontFamily: FONT_SANS }}>{L("sub_per_month_equiv")}</div>
              </div>
            </div>
            <div style={{ ...body(13), color: tx("var(--txt)", OP.tertiary + 0.03), marginBottom: SP.page }}>{L("sub_instead_of")}</div>
            <div className="premium-shimmer press-card" style={{ width: "100%", padding: SP.md + 2, borderRadius: RAD.lg, textAlign: "center", background: `linear-gradient(135deg, ${T.accent}22, ${T.accent}11, ${T.accent}22)`, backgroundSize: "200% 100%", border: `1px solid ${T.accent}33`, ...body(TYPE.lg), color: tx("var(--txt)", OP.primary - 0.02), cursor: "pointer", boxShadow: `0 0 16px ${T.accent}18` }}>{L("sub_pick_yearly")}</div>
          </div>
        </div>

        <div className="press-card glass-card" style={{ borderRadius: RAD.lg, overflow: "hidden", marginBottom: SP.xl - 2, cursor: "pointer", background: `rgba(${T.ar},.05)`, border: `1px solid rgba(${T.ar},.12)` }}>
          <div style={{ padding: `${SP.page}px ${SP.xl - 2}px ${SP.lg + 2}px` }}>
            <div style={{ ...label(9), letterSpacing: ".22em", color: tx("var(--txt)", OP.tertiary + 0.08), marginBottom: SP.sm }}>{L("sub_monthly")}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: SP.sm, marginBottom: SP.lg }}>
              <div style={{ fontFamily: FONT_SERIF, fontSize: 36, fontWeight: 300, color: tx("var(--txt)", OP.primary + 0.03), lineHeight: 1 }}>150</div>
              <div style={{ fontSize: TYPE.base, color: tx("var(--txt)", OP.secondary - 0.05), fontFamily: FONT_SANS }}>{L("sub_per_month_full")}</div>
            </div>
            <div style={{ width: "100%", padding: 13, borderRadius: 13, textAlign: "center", background: T.dim, border: `1px solid ${T.border}`, ...body(TYPE.lg - 1), color: tx("var(--txt)", 0.82), cursor: "pointer" }}>{L("sub_start_at")}</div>
          </div>
        </div>

        <div style={{ ...label(9), letterSpacing: ".22em", color: tx("var(--txt)", OP.tertiary + 0.08), marginBottom: SP.md + 2 }}>{L("sub_whats_included")}</div>
        <div className="glass-card" style={{ background: `rgba(${T.ar},.04)`, border: `1px solid rgba(${T.ar},.1)`, borderRadius: RAD.lg, overflow: "hidden", marginBottom: SP.xl - 2 }}>
          {[[L("sub_meds"), L("sub_meds_desc")], [L("sub_journal"), L("sub_journal_desc")]].map((row, i, arr) => (
            <div key={i} style={{ padding: `15px ${SP.lg + 2}px`, borderBottom: i < arr.length - 1 ? `1px solid rgba(${T.ar},.08)` : "none", display: "flex", alignItems: "center", gap: SP.md }}>
              <div style={{ width: 80, ...label(9), letterSpacing: ".1em", color: tx("var(--txt)", OP.tertiary + 0.03), flexShrink: 0 }}>{row[0]}</div>
              <div style={{ ...body(13), color: tx("var(--txt)", 0.85) }}>{row[1]}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", ...body(13), color: tx("var(--txt)", 0.28) }}>{L("sub_cancel_anytime")}</div>
      </div>
    </div>
  );
}
