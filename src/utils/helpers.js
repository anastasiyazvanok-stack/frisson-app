import { useState, useEffect } from "react";

const MOON = {
  ru: ["Новолуние", "Растущая луна", "Первая четверть", "Растущая луна", "Полнолуние", "Убывающая луна", "Последняя четверть", "Убывающая луна"],
  en: ["New moon", "Waxing moon", "First quarter", "Waxing moon", "Full moon", "Waning moon", "Last quarter", "Waning moon"],
};

const MOON_EMOJI = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"];

// Reference new moon: 2000-01-06 18:14 UTC (must be UTC — a local-time epoch
// shifts every phase by the viewer's offset).
const NEW_MOON_EPOCH = Date.UTC(2000, 0, 6, 18, 14, 0);
const SYNODIC = 29.530588853; // mean synodic month, days

export function getMoon(lang = "ru", now = new Date()) {
  const days = (now - NEW_MOON_EPOCH) / 86400000;
  const age = ((days % SYNODIC) + SYNODIC) % SYNODIC; // days since new moon
  // Eight equal windows centred on each phase point, so the window around the
  // new moon wraps across the end of the cycle instead of reading as "waning".
  const i = Math.round((age / SYNODIC) * 8) % 8;
  const names = MOON[lang] || MOON.ru;
  return { e: MOON_EMOJI[i], n: names[i] };
}

export function useGreeting(lang = "ru") {
  const g = () => {
    const h = new Date().getHours();
    if (lang === "en") {
      return h >= 5 && h < 12 ? "Good morning" : h >= 12 && h < 17 ? "Good afternoon" : h >= 17 && h < 23 ? "Good evening" : "Good night";
    }
    return h >= 5 && h < 12 ? "Доброе утро" : h >= 12 && h < 17 ? "Добрый день" : h >= 17 && h < 23 ? "Добрый вечер" : "Доброй ночи";
  };
  const [v, sv] = useState(g);
  useEffect(() => {
    sv(g());
    const id = setInterval(() => sv(g()), 60000);
    return () => clearInterval(id);
  }, [lang]);
  return v;
}

export const FONT_SERIF = "'Cormorant Garamond',Georgia,serif";
export const FONT_SANS  = "'Manrope',system-ui,sans-serif";
