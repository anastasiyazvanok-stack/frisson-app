import { useState } from "react";
import { THEMES } from "../data/themes";
import { FONT_SERIF, FONT_SANS } from "../utils/helpers";
import Orb from "./Orb";

export default function AppTour({ onDone, theme }) {
  const T = THEMES[theme] || THEMES.full;
  const [step, setStep] = useState(0);

  const feats = [
    { ic: "🌕", sec: "Главная", color: "#8F4A91", title: "Выбирайте настроение", desc: "Нажмите на карточку — интерфейс подстроится под вас.", tip: "Настроение меняет цвет интерфейса и рекомендации" },
    { ic: "◦", sec: "Библиотека", color: "#B84010", title: "17 медитаций в 5 разделах", desc: "Каждая практика решает конкретный запрос.", tip: "Начните с бесплатной «Женское внутреннее расслабление» 19 мин" },
    { ic: "✦", sec: "Навигатор ситуаций", color: "#C47808", title: "Что меня беспокоит?", desc: "Выберите из 12 ситуаций — получите точные практики.", tip: "Можно выбрать несколько ситуаций сразу" },
    { ic: "◈", sec: "Дневник", color: "rgba(160,138,65,.9)", title: "Намерения и рефлексия", desc: "Пишите в настоящем времени. Фиксируйте инсайты после практик.", tip: "Регулярность важнее объёма — даже 3 строки в день" },
    { ic: "◈", sec: "Профиль", color: "#0A5C5C", title: "Тест психологической энергии", desc: "7 вопросов — уровень ресурса с расшифровкой.", tip: "Проходите раз в 1–2 недели для отслеживания динамики" },
  ];

  const cur = feats[step];
  const isL = step === feats.length - 1;

  return (
    <div style={{ width: "100%", height: "100dvh", background: T.bg, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", transition: "background .5s" }}>
      <Orb style={{ top: "-10%", right: "-10%" }} color={T.o1} opacity={0.2} w={280} h={280} />
      <div style={{ padding: "20px 24px 0", display: "flex", justifyContent: "flex-end", position: "relative", zIndex: 2 }}>
        <div onClick={onDone} style={{ fontFamily: FONT_SANS, fontSize: 11, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(242,232,226,.3)", cursor: "pointer", padding: "8px 0" }}>Пропустить</div>
      </div>
      <div style={{ display: "flex", gap: 6, justifyContent: "center", padding: "12px 0", position: "relative", zIndex: 2 }}>
        {feats.map((_, i) => (
          <div key={i} style={{ height: 4, borderRadius: 2, transition: "all .4s", width: step === i ? 28 : 4, background: step === i ? T.accent : "rgba(255,255,255,.18)" }} />
        ))}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 32px", position: "relative", zIndex: 2 }}>
        <div style={{ width: 96, height: 96, borderRadius: "50%", background: `${cur.color}22`, border: `2px solid ${cur.color}55`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, boxShadow: `0 0 40px ${cur.color}33`, animation: "breathe 4s ease-in-out infinite" }}>
          <div style={{ fontFamily: FONT_SERIF, fontSize: 36, color: cur.color }}>{cur.ic}</div>
        </div>
        <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".3em", textTransform: "uppercase", color: cur.color, marginBottom: 12 }}>{cur.sec}</div>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 30, fontWeight: 300, color: "rgba(242,232,226,.95)", textAlign: "center", lineHeight: 1.2, marginBottom: 18 }}>{cur.title}</div>
        <div style={{ fontFamily: FONT_SANS, fontSize: 14, fontWeight: 300, lineHeight: 1.8, color: "rgba(242,232,226,.62)", textAlign: "center", maxWidth: 300, marginBottom: 24 }}>{cur.desc}</div>
        <div style={{ padding: "14px 20px", background: `${cur.color}18`, border: `1px solid ${cur.color}35`, borderRadius: 16, maxWidth: 300, width: "100%" }}>
          <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: cur.color, marginBottom: 6 }}>✦ Совет</div>
          <div style={{ fontFamily: FONT_SERIF, fontSize: 13.5, lineHeight: 1.7, color: "rgba(242,232,226,.75)" }}>{cur.tip}</div>
        </div>
      </div>
      <div style={{ padding: "0 28px 40px", position: "relative", zIndex: 2 }}>
        <div onClick={isL ? onDone : () => setStep((s) => s + 1)} style={{ width: "100%", padding: 16, borderRadius: 28, textAlign: "center", cursor: "pointer", background: `${cur.color}40`, border: `1.5px solid ${cur.color}80`, backdropFilter: "blur(16px)", boxShadow: `0 0 24px ${cur.color}30`, fontFamily: FONT_SANS, fontSize: 10, fontWeight: 400, letterSpacing: ".25em", textTransform: "uppercase", color: "rgba(242,232,226,.92)", transition: "all .4s" }}>{isL ? "Начать →" : "Следующий шаг →"}</div>
      </div>
    </div>
  );
}
