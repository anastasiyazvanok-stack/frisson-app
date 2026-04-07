// THEMES passed via props
import { FONT_SERIF, FONT_SANS } from "../utils/helpers";
import Orb from "./Orb";

export default function SubPage({ setScreen, theme, THEMES }) {
  const T = THEMES[theme] || THEMES.full;

  return (
    <div style={{ minHeight: "100%", background: T.bg, paddingBottom: 20, position: "relative", transition: "background .6s" }}>
      <Orb style={{ top: -60, left: "50%", transform: "translateX(-50%)" }} color={T.o1} opacity={0.16} w={280} h={280} />
      <div onClick={() => setScreen("home")} style={{ padding: "20px 24px 0", display: "flex", alignItems: "center", gap: 9, cursor: "pointer", position: "relative", zIndex: 1 }}>
        <span style={{ fontSize: 15, color: "rgba(242,232,226,.4)" }}>←</span><span style={{ fontSize: 11, letterSpacing: ".15em", textTransform: "uppercase", color: "rgba(242,232,226,.4)", fontFamily: FONT_SANS }}>Назад</span>
      </div>
      <div style={{ padding: "20px 24px 0", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".25em", textTransform: "uppercase", color: T.accent, marginBottom: 10 }}>✦ Полный доступ</div>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 34, fontWeight: 300, lineHeight: 1.15, color: "rgba(242,232,226,.95)", marginBottom: 8 }}>Frisson Premium</div>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 15, lineHeight: 1.65, color: "rgba(242,232,226,.45)", maxWidth: 280, margin: "0 auto 24px" }}>Откройте полную библиотеку практик — и начните жить из состояния, а не из усилия</div>
      </div>
      <div style={{ padding: "0 24px", position: "relative", zIndex: 1 }}>
        <div style={{ borderRadius: 22, overflow: "hidden", marginBottom: 12, cursor: "pointer", background: `linear-gradient(135deg,${T.gF},${T.gT})`, border: `1.5px solid ${T.accent}55`, position: "relative" }}>
          <div style={{ position: "absolute", top: 0, right: 0, background: T.dim, borderRadius: "0 22px 0 14px", padding: "6px 14px", fontSize: 9, letterSpacing: ".15em", textTransform: "uppercase", color: T.accent, fontFamily: FONT_SANS }}>Выгода 50%</div>
          <div style={{ padding: "24px 22px 20px" }}>
            <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(242,232,226,.4)", marginBottom: 8 }}>Годовая подписка</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
              <div style={{ fontFamily: FONT_SERIF, fontSize: 42, fontWeight: 300, color: "rgba(242,232,226,.95)", lineHeight: 1 }}>900</div>
              <div><div style={{ fontSize: 14, color: "rgba(242,232,226,.5)", fontFamily: FONT_SANS }}>zł / год</div><div style={{ fontSize: 11, color: T.accent, fontFamily: FONT_SANS }}>= 75 zł в месяц</div></div>
            </div>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 13, color: "rgba(242,232,226,.35)", marginBottom: 20 }}>вместо 1800 zł при оплате помесячно</div>
            <div style={{ width: "100%", padding: 14, borderRadius: 15, textAlign: "center", background: T.dim, border: `1px solid ${T.border}`, fontFamily: FONT_SERIF, fontSize: 17, color: "rgba(242,232,226,.9)", cursor: "pointer" }}>Выбрать годовой план →</div>
          </div>
        </div>
        <div style={{ borderRadius: 20, overflow: "hidden", marginBottom: 22, cursor: "pointer", background: T.card, border: `1px solid ${T.border}` }}>
          <div style={{ padding: "20px 22px 18px" }}>
            <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(242,232,226,.4)", marginBottom: 8 }}>Месячная подписка</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 16 }}>
              <div style={{ fontFamily: FONT_SERIF, fontSize: 36, fontWeight: 300, color: "rgba(242,232,226,.95)", lineHeight: 1 }}>150</div>
              <div style={{ fontSize: 14, color: "rgba(242,232,226,.5)", fontFamily: FONT_SANS }}>zł / месяц</div>
            </div>
            <div style={{ width: "100%", padding: 13, borderRadius: 13, textAlign: "center", background: T.dim, border: `1px solid ${T.border}`, fontFamily: FONT_SERIF, fontSize: 16, color: "rgba(242,232,226,.82)", cursor: "pointer" }}>Начать за 150 zł →</div>
          </div>
        </div>
        <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(242,232,226,.4)", marginBottom: 14 }}>✦ Что входит</div>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 18, overflow: "hidden", marginBottom: 22 }}>
          {[["Медитации", "17 практик + ежемесячно новая"], ["Проекты", "Тревога · Ревность в отношениях"], ["Книги", "4 книги по женской психологии"], ["Тесты", "Женственность · Самоценность · Тревога"], ["Дневник", "Дневник + Внутренний сад"]].map((row, i, arr) => (
            <div key={i} style={{ padding: "15px 18px", borderBottom: i < arr.length - 1 ? `1px solid ${T.border}` : "none", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 80, fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(242,232,226,.35)", fontFamily: FONT_SANS, flexShrink: 0 }}>{row[0]}</div>
              <div style={{ fontFamily: FONT_SERIF, fontSize: 13, color: "rgba(230,218,210,.85)" }}>{row[1]}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", fontFamily: FONT_SERIF, fontSize: 13, color: "rgba(242,232,226,.28)", lineHeight: 1.6 }}>Отменить подписку можно в любой момент.</div>
      </div>
    </div>
  );
}
