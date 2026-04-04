export function getMoon() {
  const d = new Date() - new Date(2000, 0, 6, 18, 14, 0);
  const p = ((d / 86400000 % 29.53) + 29.53) % 29.53;
  const phase = Math.round(p / 29.53 * 8) % 8;
  const names = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"];
  const labels = ["Новолуние", "Растущий серп", "Первая четверть", "Растущая луна", "Полнолуние", "Убывающая луна", "Последняя четверть", "Убывающий серп"];
  return { e: names[phase], l: labels[phase], p: Math.round(p / 29.53 * 100) };
}

export function useGreeting() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "Доброе утро";
  if (h >= 12 && h < 17) return "Добрый день";
  if (h >= 17 && h < 22) return "Добрый вечер";
  return "Доброй ночи";
}

export const FONT_SERIF = "'Cormorant','Cormorant Garamond',Georgia,serif";
export const FONT_SANS = "'Plus Jakarta Sans',system-ui,sans-serif";
