import { THEMES } from "../data/themes";
import { FONT_SERIF, FONT_SANS } from "../utils/helpers";
import Orb from "./Orb";

export default function SubPage({ setScreen, theme }) {
  const T = THEMES[theme] || THEMES.full;

  return (
    <div style={{ minHeight: "100%", background: T.bg, paddingBottom: 20, position: "relative", transition: "background .8s" }}>
      <Orb style={{ top: -60, left: "50%", transform: "translateX(-50%)" }} color={T.o1} opacity={0.18} w={300} h={300} />

      <div onClick={() => setScreen("home")} style={{ padding: "20px 24px 0", display: "flex", alignItems: "center", gap: 9, cursor: "pointer", position: "relative", zIndex: 1 }}>
        <span style={{ fontSize: 15, color: "rgba(242,232,226,.4)" }}>←</span>
        <span style={{ fontSize: 11, letterSpacing: ".15em", textTransform: "uppercase", color: "rgba(242,232,226,.35)", fontFamily: FONT_SANS }}>Назад</span>
      </div>

      <div style={{ padding: "20px 24px 0", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".25em", textTransform: "uppercase", color: `rgba(${T.ar},.4)`, marginBottom: 10 }}>подписка</div>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 34, fontWeight: 300, lineHeight: 1.15, color: "rgba(242,232,226,.95)", marginBottom: 10 }}>Frisson Full Access</div>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 15, lineHeight: 1.65, color: "rgba(242,232,226,.45)", marginBottom: 28 }}>Все медитации, книги и инструменты для вашего внутреннего роста</div>
      </div>

      <div style={{ padding: "0 24px", position: "relative", zIndex: 1 }}>
        {/* Monthly plan */}
        <div style={{ borderRadius: 22, overflow: "hidden", marginBottom: 12, cursor: "pointer", background: T.card, border: `1px solid ${T.border}`, position: "relative" }}>
          <div style={{ position: "absolute", top: 0, right: 0, background: T.dim, borderRadius: "0 22px 0 14px", padding: "6px 14px", fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: T.accent }}>Популярный</div>
          <div style={{ padding: "24px 22px 20px" }}>
            <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: `rgba(${T.ar},.4)`, marginBottom: 8 }}>ежемесячно</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
              <div style={{ fontFamily: FONT_SERIF, fontSize: 42, fontWeight: 300, color: "rgba(242,232,226,.95)" }}>99</div>
              <div><div style={{ fontSize: 14, color: "rgba(242,232,226,.5)", fontFamily: FONT_SANS }}>zł / месяц</div></div>
            </div>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 13, color: "rgba(242,232,226,.35)", marginBottom: 14 }}>Полный доступ · Отменить в любой момент</div>
            <div style={{ width: "100%", padding: 14, borderRadius: 15, textAlign: "center", background: `linear-gradient(135deg, ${T.o1}, ${T.o2})`, border: `1px solid ${T.accent}44`, fontFamily: FONT_SANS, fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(245,235,230,.9)", cursor: "pointer" }}>Начать</div>
          </div>
        </div>

        {/* Yearly plan */}
        <div style={{ borderRadius: 20, overflow: "hidden", marginBottom: 22, cursor: "pointer", background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.06)" }}>
          <div style={{ padding: "20px 22px 18px" }}>
            <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: `rgba(${T.ar},.4)`, marginBottom: 8 }}>ежегодно</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 16 }}>
              <div style={{ fontFamily: FONT_SERIF, fontSize: 36, fontWeight: 300, color: "rgba(242,232,226,.85)" }}>900</div>
              <div style={{ fontSize: 14, color: "rgba(242,232,226,.5)", fontFamily: FONT_SANS }}>zł / месяц — выгода 24%</div>
            </div>
            <div style={{ width: "100%", padding: 13, borderRadius: 13, textAlign: "center", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", fontFamily: FONT_SANS, fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(242,232,226,.5)", cursor: "pointer" }}>Выбрать</div>
          </div>
        </div>

        {/* Features */}
        <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: `rgba(${T.ar},.4)`, marginBottom: 12 }}>что включено</div>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 18, overflow: "hidden", marginBottom: 22 }}>
          {[
            ["Медитации", "17 практик + ежемесячно новая"],
            ["Проекты", "Тревога · Ревность в отношениях · и др."],
            ["Дневник", "Намерения · Благодарность · Рефлексия"],
            ["Навигатор", "Персональный подбор практик"],
            ["Книги", "4 книги по женской психологии"],
          ].map((row, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderBottom: i < 4 ? `1px solid ${T.border}` : "none" }}>
              <div style={{ width: 80, fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: T.accent, fontFamily: FONT_SANS }}>{row[0]}</div>
              <div style={{ fontFamily: FONT_SERIF, fontSize: 13, color: "rgba(230,218,210,.85)" }}>{row[1]}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", fontFamily: FONT_SERIF, fontSize: 13, color: "rgba(242,232,226,.28)", lineHeight: 1.7, marginBottom: 20 }}>
          Оплата через Apple Pay / Google Pay · Автопродление · Отмена в любой момент
        </div>
      </div>
    </div>
  );
}
