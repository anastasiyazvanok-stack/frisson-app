import { useState } from "react";
import { THEMES } from "../data/themes";
import { FONT_SERIF, FONT_SANS } from "../utils/helpers";
import Orb from "./Orb";

export default function AppTour({ onDone, theme }) {
  const T = THEMES[theme] || THEMES.full;
  const [step, setStep] = useState(0);

  const feats = [
    { ic: "🌖", sec: "Главная", color: "#8F4A91", title: "Выбирайте настроение", desc: "Нажмите на карточку настроения — и весь интерфейс подстроится под ваше состояние.", detail: "Каждое настроение меняет цвета, рекомендации и послания дня." },
    { ic: "◦", sec: "Библиотека", color: "#B84010", title: "17 медитаций в 5 разделах", desc: "Каждая практика создана психологом для конкретного внутреннего запроса.", detail: "Ресурс, женственность, реализация, новый уровень, подлинность." },
    { ic: "✦", sec: "Навигатор ситуаций", color: "#C47808", title: "Что меня беспокоит?", desc: "Выберите ситуацию — получите персональную подборку практик.", detail: "12 жизненных ситуаций с точными рекомендациями." },
    { ic: "◈", sec: "Дневник", color: "rgba(160,138,65,.9)", title: "Намерения и рефлексия", desc: "Пишите намерения, благодарности, ставьте цели и рефлексируйте после практик.", detail: "Четыре раздела для ежедневной работы с собой." },
    { ic: "◈", sec: "Профиль", color: "#0A5C5C", title: "Тест психологической энергии", desc: "7 вопросов — и вы видите свой уровень внутреннего ресурса.", detail: "График динамики, статистика практик, информация об авторе." },
  ];

  const cur = feats[step];
  const isL = step === feats.length - 1;

  return (
    <div style={{ width: "100%", height: "100vh", background: T.bg, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      <Orb style={{ top: "-10%", right: "-10%" }} color={T.o1} opacity={0.2} w={280} h={280} />

      <div style={{ padding: "20px 24px 0", display: "flex", justifyContent: "flex-end", position: "relative", zIndex: 1 }}>
        <div onClick={onDone} style={{ fontFamily: FONT_SANS, fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(242,232,226,.3)", cursor: "pointer" }}>Пропустить</div>
      </div>

      <div style={{ display: "flex", gap: 6, justifyContent: "center", padding: "12px 0", position: "relative", zIndex: 1 }}>
        {feats.map((_, i) => (
          <div key={i} style={{ height: 4, borderRadius: 2, transition: "all .4s", width: i === step ? 22 : 8, background: i <= step ? T.accent : "rgba(255,255,255,.08)" }} />
        ))}
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 28px", position: "relative", zIndex: 1, animation: "fadeUp .5s ease both" }} key={step}>
        <div style={{ width: 96, height: 96, borderRadius: "50%", background: `${cur.color}22`, border: `1px solid ${cur.color}35`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28 }}>
          <div style={{ fontFamily: FONT_SERIF, fontSize: 36, color: cur.color }}>{cur.ic}</div>
        </div>
        <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".3em", textTransform: "uppercase", color: `${cur.color}aa`, marginBottom: 10 }}>{cur.sec}</div>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 30, fontWeight: 300, color: "rgba(242,232,226,.95)", textAlign: "center", lineHeight: 1.2, marginBottom: 16 }}>{cur.title}</div>
        <div style={{ fontFamily: FONT_SANS, fontSize: 14, fontWeight: 300, lineHeight: 1.8, color: "rgba(242,232,226,.5)", textAlign: "center", marginBottom: 22 }}>{cur.desc}</div>
        <div style={{ padding: "14px 20px", background: `${cur.color}18`, border: `1px solid ${cur.color}25`, borderRadius: 14 }}>
          <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: `${cur.color}88`, marginBottom: 6 }}>подробнее</div>
          <div style={{ fontFamily: FONT_SERIF, fontSize: 13.5, lineHeight: 1.7, color: "rgba(242,232,226,.75)" }}>{cur.detail}</div>
        </div>
      </div>

      <div style={{ padding: "0 28px 40px", position: "relative", zIndex: 2 }}>
        <div onClick={isL ? onDone : () => setStep((s) => s + 1)} style={{
          width: "100%", padding: 16, borderRadius: 16, textAlign: "center",
          background: "linear-gradient(135deg, rgba(148,74,145,.45), rgba(184,64,16,.3))",
          border: "1px solid rgba(200,120,180,.25)",
          fontFamily: FONT_SANS, fontSize: 13, letterSpacing: ".12em", textTransform: "uppercase",
          color: "rgba(245,235,230,.9)", cursor: "pointer",
        }}>
          {isL ? "Начать" : "Далее"}
        </div>
      </div>
    </div>
  );
}
