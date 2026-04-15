import { useState } from "react";
import { TYPE, SP, RAD, OP, EASE, FONT_SERIF, FONT_SANS, tx, label, body, heading, card as cardStyle, section } from "../utils/design";
import Orb from "./Orb";
import { t as tr } from "../utils/i18n";

export default function AppTour({ onDone, theme, THEMES, lang = "ru" }) {
  const T = THEMES[theme] || THEMES.full;
  const L = (k) => tr(lang, k);
  const [step, setStep] = useState(0);

  const FEATS = {
    ru: [
      { ic: "🌕", sec: "Главная", color: "#E64DA8", title: "Выбирайте настроение", desc: "Нажмите на карточку — интерфейс подстроится под вас.", tip: "Настроение меняет цвет интерфейса и рекомендации" },
      { ic: "◦", sec: "Библиотека", color: "#F08838", title: "Вся библиотека практик", desc: "Медитации, книги и проекты — каждая практика решает конкретный запрос.", tip: "Начните с бесплатной «Женское внутреннее расслабление» 19 мин" },
      { ic: "◈", sec: "Орбита Психики", color: "#9F7BD8", title: "Визуализация внутреннего мира", desc: "Каждая точка — это нейрон, каждая линия — связь между мыслями и чувствами. Выберите сценарий (тревога, любовь, сила...) и увидите, как двигается психика в этом состоянии.", tip: "Нажмите ♫ и выберите время — музыка и орбита плавно меняются вместе с вами" },
      { ic: "✦", sec: "Навигатор ситуаций", color: "#FFAF32", title: "Что меня беспокоит?", desc: "Выберите из 12 ситуаций — получите точные практики.", tip: "Можно выбрать несколько ситуаций сразу" },
      { ic: "◈", sec: "Дневник", color: "rgba(200,160,80,.9)", title: "Намерения и рефлексия", desc: "Пишите в настоящем времени. Фиксируйте инсайты после практик.", tip: "Регулярность важнее объёма — даже 3 строки в день" },
      { ic: "◈", sec: "Профиль", color: "#7EC8DC", title: "Психологический капитал", desc: "Шесть осей внутреннего роста: безопасность, самоценность, получение, женственность, доверие, подлинность. Каждая практика растит конкретную ось.", tip: "Проходите тест энергии раз в 1–2 недели для калибровки" },
    ],
    en: [
      { ic: "🌕", sec: "Home", color: "#E64DA8", title: "Choose your mood", desc: "Tap a card — the interface will adapt to you.", tip: "Your mood changes the interface color and recommendations" },
      { ic: "◦", sec: "Library", color: "#F08838", title: "The full practice library", desc: "Meditations, books and projects — each practice addresses a specific need.", tip: "Start with the free \u00ABFeminine inner relaxation\u00BB, 19 min" },
      { ic: "◈", sec: "Psyche Orbit", color: "#9F7BD8", title: "A visualization of your inner world", desc: "Each dot is a neuron, each line a link between thoughts and feelings. Pick a scenario (anxiety, love, power...) and see how your psyche moves in that state.", tip: "Tap ♫ and pick a duration — music and orbit shift gently with you" },
      { ic: "✦", sec: "Situation navigator", color: "#FFAF32", title: "What's bothering me?", desc: "Pick from 12 situations — get precise practices.", tip: "You can pick several situations at once" },
      { ic: "◈", sec: "Journal", color: "rgba(200,160,80,.9)", title: "Intentions and reflection", desc: "Write in present tense. Capture insights after practices.", tip: "Consistency matters more than length — even 3 lines a day" },
      { ic: "◈", sec: "Profile", color: "#7EC8DC", title: "Psychological capital", desc: "Six axes of inner growth: safety, self-worth, receiving, femininity, trust, authenticity. Each practice grows a specific axis.", tip: "Take the energy test every 1–2 weeks for calibration" },
    ],
  };
  const feats = FEATS[lang] || FEATS.ru;

  const cur = feats[step];
  const isL = step === feats.length - 1;
  const skip = lang === "en" ? "Skip" : "Пропустить";
  const start = lang === "en" ? "Start →" : "Начать →";
  const nextStep = lang === "en" ? "Next step →" : "Следующий шаг →";
  const tipLabel = lang === "en" ? "✦ Tip" : "✦ Совет";

  return (
    <div style={{ width: "100%", height: "100dvh", background: T.bg, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", transition: "background .5s" }}>
      <Orb style={{ top: "-10%", right: "-10%" }} color={T.o1} opacity={0.2} w={280} h={280} />
      <div style={{ padding: `${SP.page}px ${SP.xl}px 0`, display: "flex", justifyContent: "flex-end", position: "relative", zIndex: 2 }}>
        <div onClick={onDone} style={{ ...label(TYPE.sm), letterSpacing: ".12em", color: tx("var(--txt)", OP.tertiary - 0.02), cursor: "pointer", padding: `${SP.sm}px 0` }}>{skip}</div>
      </div>
      <div style={{ display: "flex", gap: 6, justifyContent: "center", padding: `${SP.md}px 0`, position: "relative", zIndex: 2 }}>
        {feats.map((_, i) => (
          <div key={i} style={{ height: SP.xs, borderRadius: 2, transition: EASE.slow, width: step === i ? 28 : SP.xs, background: step === i ? T.accent : `rgba(255,255,255,${OP.disabled})` }} />
        ))}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: `${SP.page}px ${SP.xxl}px`, position: "relative", zIndex: 2 }}>
        <div style={{ width: 96, height: 96, borderRadius: RAD.full, background: `${cur.color}22`, border: `2px solid ${cur.color}55`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: SP.xl, boxShadow: `0 0 40px ${cur.color}33`, animation: "breathe 4s ease-in-out infinite" }}>
          <div style={{ fontFamily: FONT_SERIF, fontSize: 36, color: cur.color }}>{cur.ic}</div>
        </div>
        <div style={{ ...label(9), letterSpacing: ".3em", color: cur.color, marginBottom: SP.md }}>
          {cur.sec}
        </div>
        <div style={{ ...heading(30), color: tx("var(--txt)", OP.primary + 0.03), textAlign: "center", marginBottom: SP.lg + 2 }}>{cur.title}</div>
        <div style={{ fontFamily: FONT_SANS, fontSize: TYPE.base, fontWeight: 300, lineHeight: 1.8, color: tx("var(--txt)", 0.62), textAlign: "center", maxWidth: 300, marginBottom: SP.xl }}>{cur.desc}</div>
        <div style={{ padding: `${SP.md + 2}px ${SP.page}px`, background: `${cur.color}18`, border: `1px solid ${cur.color}35`, borderRadius: SP.lg, maxWidth: 300, width: "100%" }}>
          <div style={{ ...label(9), letterSpacing: ".2em", color: cur.color, marginBottom: 6 }}>{tipLabel}</div>
          <div style={{ ...body(13.5), lineHeight: 1.7, color: tx("var(--txt)", 0.75) }}>{cur.tip}</div>
        </div>
      </div>
      <div style={{ padding: `0 28px 40px`, position: "relative", zIndex: 2 }}>
        <div onClick={isL ? onDone : () => setStep((s) => s + 1)} style={{ width: "100%", padding: SP.lg, borderRadius: RAD.lg + 8, textAlign: "center", cursor: "pointer", background: `${cur.color}40`, border: `1.5px solid ${cur.color}80`, backdropFilter: "blur(16px)", boxShadow: `0 0 ${SP.xl}px ${cur.color}30`, ...label(TYPE.xs), fontWeight: 400, letterSpacing: ".25em", color: tx("var(--txt)", OP.primary), transition: EASE.slow }}>{isL ? start : nextStep}</div>
      </div>
    </div>
  );
}
