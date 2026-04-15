import { useState, useEffect } from "react";

const MOON = {
  ru: ["Новолуние", "Растущий серп", "Первая четверть", "Растущая луна", "Полнолуние", "Убывающая луна", "Последняя четверть", "Убывающий серп"],
  en: ["New moon", "Waxing crescent", "First quarter", "Waxing gibbous", "Full moon", "Waning gibbous", "Last quarter", "Waning crescent"],
};

export function getMoon(lang = "ru") {
  const d = new Date() - new Date(2000, 0, 6, 18, 14, 0);
  const p = ((d / 86400000 % 29.53) + 29.53) % 29.53;
  const names = MOON[lang] || MOON.ru;
  if (p < 1.85) return { e: "🌑", n: names[0] };
  if (p < 7.38) return { e: "🌒", n: names[1] };
  if (p < 9.22) return { e: "🌓", n: names[2] };
  if (p < 14.77) return { e: "🌔", n: names[3] };
  if (p < 16.61) return { e: "🌕", n: names[4] };
  if (p < 22.15) return { e: "🌖", n: names[5] };
  if (p < 23.99) return { e: "🌗", n: names[6] };
  return { e: "🌘", n: names[7] };
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

export const FONT_SERIF = "'Cormorant','Cormorant Garamond',Georgia,serif";
export const FONT_SANS = "'Plus Jakarta Sans',system-ui,sans-serif";
