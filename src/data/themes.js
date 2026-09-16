// Night themes — Nectar brandbook palette
// Base: Obsidian #0E0810 · Warm: Rust/Ember/Amber/Gold · Cool: Iris/Lavender · Text: Cream #F7EFE6
const NIGHT = {
  // Пустота — Iris/soul: void obsidian + cool iris glow (emptiness, stillness, soul)
  empty: {
    e: "🌑", l: "Пустота", bg: "linear-gradient(165deg, #0A0610 0%, #0E0810 50%, #0A0610 100%)",
    card: "rgba(142,118,184,.10)", border: "rgba(185,169,218,.18)",
    accent: "#8E76B8", ar: "142,118,184",
    dim: "rgba(142,118,184,.14)", o1: "rgba(92,28,46,.65)", o2: "rgba(142,118,184,.28)",
    nav: "rgba(142,118,184,.12)", text: "#F7EFE6", tr: "247,239,230",
    gF: "#1D1015", gT: "#0A0610"
  },
  // Тихо — Lavender/night: plum depth + lavender accent (states, night practices, stillness)
  quiet: {
    e: "🌒", l: "Тихо", bg: "linear-gradient(165deg, #150A18 0%, #1D1015 50%, #0E0810 100%)",
    card: "rgba(185,169,218,.10)", border: "rgba(185,169,218,.22)",
    accent: "#B9A9DA", ar: "185,169,218",
    dim: "rgba(185,169,218,.14)", o1: "rgba(59,21,51,.72)", o2: "rgba(185,169,218,.28)",
    nav: "rgba(185,169,218,.12)", text: "#F7EFE6", tr: "247,239,230",
    gF: "#3B1533", gT: "#150A18"
  },
  // Наполнена — Amber/nectar flow: warm ember-brown depth + brighter amber/gold glow
  full: {
    e: "🌕", l: "Наполнена", bg: "linear-gradient(165deg, #180B08 0%, #5C2A12 35%, #2A0D18 68%, #150A0C 100%)",
    card: "rgba(227,154,60,.16)", border: "rgba(227,154,60,.34)",
    accent: "#E39A3C", ar: "227,154,60",
    accent2: "#F3CE72", ar2: "243,206,114",
    dim: "rgba(208,86,42,.26)", o1: "rgba(208,86,42,.85)", o2: "rgba(243,206,114,.5)",
    nav: "rgba(227,154,60,.2)", text: "#FFF6EA", tr: "255,246,234",
    gF: "#3B1533", gT: "#150A0C"
  },
  // В силе — Ember/action: dark burnt base + ember accent (energy, power, action)
  power: {
    e: "🔥", l: "В силе", bg: "linear-gradient(165deg, #100804 0%, #1E0C06 50%, #100804 100%)",
    card: "rgba(208,86,42,.10)", border: "rgba(208,86,42,.22)",
    accent: "#D0562A", ar: "208,86,42",
    dim: "rgba(178,70,31,.16)", o1: "rgba(92,28,46,.75)", o2: "rgba(208,86,42,.32)",
    nav: "rgba(208,86,42,.12)", text: "#FFF6EA", tr: "255,246,234",
    gF: "#2A1008", gT: "#100804"
  },
};

// Day themes — Nectar light side: Cream #F7EFE6 / Shell #EFE3D8 base, Ink #24131A text.
// NOTE: currently unused — Orbit hardcodes `isDay = false` and nothing imports DAY.
// Accents here are the contrast-safe (deep/warm) palette members rather than the dark-theme
// role colors: amber/gold/iris are unreadable as text on cream, so they only carry the orbs.
const DAY = {
  empty: {
    e: "🌑", l: "Пустота", bg: "linear-gradient(165deg, #F7EFE6 0%, #F1EAF2 45%, #EFE3D8 100%)",
    card: "rgba(59,21,51,.06)", border: "rgba(59,21,51,.14)",
    accent: "#3B1533", ar: "59,21,51",
    dim: "rgba(59,21,51,.09)", o1: "rgba(142,118,184,.26)", o2: "rgba(220,210,236,.4)",
    nav: "rgba(59,21,51,.07)", text: "#24131A", tr: "36,19,26",
    gF: "#EDE4F0", gT: "#F7EFE6"
  },
  quiet: {
    e: "🌒", l: "Тихо", bg: "linear-gradient(165deg, #F7EFE6 0%, #F0E8F0 45%, #EFE3D8 100%)",
    card: "rgba(92,28,46,.06)", border: "rgba(92,28,46,.14)",
    accent: "#5C1C2E", ar: "92,28,46",
    dim: "rgba(92,28,46,.09)", o1: "rgba(185,169,218,.3)", o2: "rgba(142,118,184,.16)",
    nav: "rgba(92,28,46,.07)", text: "#24131A", tr: "36,19,26",
    gF: "#EBDFEA", gT: "#F7EFE6"
  },
  full: {
    e: "🌕", l: "Наполнена", bg: "linear-gradient(165deg, #F7EFE6 0%, #F4E8DA 45%, #EFE3D8 100%)",
    card: "rgba(92,28,46,.06)", border: "rgba(227,154,60,.22)",
    accent: "#5C1C2E", ar: "92,28,46",
    accent2: "#B2461F", ar2: "178,70,31",
    dim: "rgba(227,154,60,.12)", o1: "rgba(227,154,60,.32)", o2: "rgba(243,206,114,.24)",
    nav: "rgba(227,154,60,.1)", text: "#24131A", tr: "36,19,26",
    gF: "#F2E2CE", gT: "#F7EFE6"
  },
  power: {
    e: "🔥", l: "В силе", bg: "linear-gradient(165deg, #F7EFE6 0%, #F4E4D6 45%, #EFE3D8 100%)",
    card: "rgba(178,70,31,.07)", border: "rgba(178,70,31,.18)",
    accent: "#B2461F", ar: "178,70,31",
    dim: "rgba(178,70,31,.1)", o1: "rgba(208,86,42,.28)", o2: "rgba(92,28,46,.16)",
    nav: "rgba(178,70,31,.08)", text: "#24131A", tr: "36,19,26",
    gF: "#F1DFCD", gT: "#F7EFE6"
  },
};

export function getThemes() { return NIGHT; }
export const THEMES = NIGHT;

export const ENERGY_LEVELS = [
  { min: 0, max: 25, l: { ru: "Критическое истощение", en: "Critical exhaustion" } },
  { min: 26, max: 45, l: { ru: "Низкий ресурс", en: "Low resource" } },
  { min: 46, max: 65, l: { ru: "Средний ресурс", en: "Moderate resource" } },
  { min: 66, max: 82, l: { ru: "Хороший ресурс", en: "Good resource" } },
  { min: 83, max: 100, l: { ru: "Высокий ресурс", en: "High resource" } },
];

export const getEnergyLevel = (s, lang = "ru") => {
  const lv = ENERGY_LEVELS.find((l) => s >= l.min && s <= l.max) || ENERGY_LEVELS[0];
  return { ...lv, l: typeof lv.l === "object" ? (lv.l[lang] || lv.l.ru) : lv.l };
};

// Theme labels (mood names)
export const THEME_LABELS = {
  empty: { ru: "Пустота", en: "Emptiness" },
  quiet: { ru: "Тихо", en: "Quiet" },
  full: { ru: "Наполнена", en: "Full" },
  power: { ru: "В силе", en: "In power" },
};
export const themeLabel = (key, lang = "ru") => (THEME_LABELS[key] && THEME_LABELS[key][lang]) || key;
