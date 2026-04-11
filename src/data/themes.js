// Night themes — juicy dopamine palette
// Each mood = unique combo of complementary jewel tones
const NIGHT = {
  // Пустота — deep midnight indigo + lavender + dusty rose accents
  empty: {
    e: "🌑", l: "Пустота", bg: "linear-gradient(165deg, #0a0820 0%, #14122c 50%, #1a0e26 100%)",
    card: "rgba(140,110,200,.1)", border: "rgba(160,130,210,.22)",
    accent: "#9F7BD8", ar: "159,123,216",
    dim: "rgba(140,110,200,.16)", o1: "rgba(120,80,200,.7)", o2: "rgba(200,140,180,.5)",
    nav: "rgba(140,110,200,.28)", text: "#ede0ff",
    gF: "#1c1438", gT: "#0a0820"
  },
  // Тихо — burgundy plum + dusty lavender + warm copper accents
  quiet: {
    e: "🌒", l: "Тихо", bg: "linear-gradient(165deg, #1a0a14 0%, #2a1024 50%, #1c0820 100%)",
    card: "rgba(180,100,160,.1)", border: "rgba(200,120,170,.22)",
    accent: "#D080B0", ar: "208,128,176",
    dim: "rgba(180,100,160,.16)", o1: "rgba(180,80,140,.7)", o2: "rgba(220,140,90,.5)",
    nav: "rgba(180,100,160,.28)", text: "#ffe0f0",
    gF: "#2c1228", gT: "#1a0a14"
  },
  // Наполнена — burnt amber + deep wine + magenta sparkle + lavender kiss
  // (fulfillment moodboard: passion fruit, orange, amber, purple shimmer)
  full: {
    e: "🌕", l: "Наполнена", bg: "linear-gradient(165deg, #1e0612 0%, #3a0c1c 45%, #2a0818 100%)",
    card: "rgba(232,160,48,.09)", border: "rgba(232,160,48,.24)",
    accent: "#E8A030", ar: "232,160,48",
    dim: "rgba(232,160,48,.16)", o1: "rgba(216,80,32,.72)", o2: "rgba(184,72,168,.55)",
    nav: "rgba(232,160,48,.28)", text: "#fbe6d2",
    gF: "#3c0e22", gT: "#1e0612"
  },
  // В силе — deep burgundy wine + chocolate + ice blue accent (Ice Blue × Burgundy)
  power: {
    e: "🔥", l: "В силе", bg: "linear-gradient(165deg, #120408 0%, #2a0a14 50%, #180810 100%)",
    card: "rgba(142,26,50,.12)", border: "rgba(160,180,210,.22)",
    accent: "#9C1E36", ar: "156,30,54",
    dim: "rgba(142,26,50,.18)", o1: "rgba(142,26,50,.75)", o2: "rgba(160,195,220,.45)",
    nav: "rgba(142,26,50,.3)", text: "#f3dde0",
    gF: "#2e0c16", gT: "#120408"
  },
};

// Day themes — Cloud Dancer base with rich jewel gradients
const DAY = {
  empty: {
    e: "🌑", l: "Пустота", bg: "linear-gradient(165deg, #EDE8F2 0%, #F0EDE8 40%, #E8E4F0 100%)",
    card: "rgba(80,60,140,.08)", border: "rgba(80,60,140,.18)",
    accent: "#6048B0", ar: "96,72,176",
    dim: "rgba(80,60,140,.1)", o1: "rgba(100,60,180,.25)", o2: "rgba(60,30,150,.15)",
    nav: "rgba(80,60,140,.08)", text: "#2a2040",
    gF: "#E0DCF0", gT: "#EDE8F2"
  },
  quiet: {
    e: "🌒", l: "Тихо", bg: "linear-gradient(165deg, #F0E4EC 0%, #EDE9E4 40%, #E8DEE8 100%)",
    card: "rgba(140,40,90,.08)", border: "rgba(140,40,90,.16)",
    accent: "#9B2868", ar: "155,40,104",
    dim: "rgba(140,40,90,.1)", o1: "rgba(160,30,110,.22)", o2: "rgba(220,140,60,.12)",
    nav: "rgba(140,40,90,.08)", text: "#3a1028",
    gF: "#E8D8E4", gT: "#F0E4EC"
  },
  full: {
    e: "🌕", l: "Наполнена", bg: "linear-gradient(165deg, #F2E4EE 0%, #F0EAE8 40%, #EEE0F0 100%)",
    card: "rgba(180,20,110,.08)", border: "rgba(180,20,110,.16)",
    accent: "#B81878", ar: "184,24,120",
    dim: "rgba(180,20,110,.1)", o1: "rgba(200,30,140,.22)", o2: "rgba(120,40,180,.12)",
    nav: "rgba(180,20,110,.08)", text: "#380620",
    gF: "#EAD8E8", gT: "#F2E4EE"
  },
  power: {
    e: "🔥", l: "В силе", bg: "linear-gradient(165deg, #F4ECE0 0%, #F0ECE4 40%, #F0E4D8 100%)",
    card: "rgba(210,100,20,.08)", border: "rgba(210,100,20,.16)",
    accent: "#D07018", ar: "208,112,24",
    dim: "rgba(210,100,20,.1)", o1: "rgba(220,100,20,.22)", o2: "rgba(140,40,100,.12)",
    nav: "rgba(210,100,20,.08)", text: "#381808",
    gF: "#EAE0D0", gT: "#F4ECE0"
  },
};

export function getThemes() { return NIGHT; }
export const THEMES = NIGHT;

export const ENERGY_LEVELS = [
  { min: 0, max: 25, l: "Критическое истощение" },
  { min: 26, max: 45, l: "Низкий ресурс" },
  { min: 46, max: 65, l: "Средний ресурс" },
  { min: 66, max: 82, l: "Хороший ресурс" },
  { min: 83, max: 100, l: "Высокий ресурс" },
];

export const getEnergyLevel = (s) =>
  ENERGY_LEVELS.find((l) => s >= l.min && s <= l.max) || ENERGY_LEVELS[0];
