// Night themes — juicy dopamine palette
// Each mood = unique combo of complementary jewel tones
const NIGHT = {
  // Пустота — Iris Milk: deep violet iris + creamy lavender mist + ethereal bloom
  empty: {
    e: "🌑", l: "Пустота", bg: "linear-gradient(165deg, #0c0620 0%, #16103a 50%, #1a0c30 100%)",
    card: "rgba(91,58,140,.2)", border: "rgba(120,80,180,.3)",
    accent: "#8B68C8", ar: "139,104,200",
    dim: "rgba(100,70,160,.22)", o1: "rgba(91,58,140,.75)", o2: "rgba(180,140,220,.5)",
    nav: "rgba(100,70,160,.3)", text: "#e8daf8", tr: "232,218,248",
    gF: "#1a1040", gT: "#0c0620"
  },
  // Тихо — Midnight Plum: deep berry + muted violet + soft mist
  quiet: {
    e: "🌒", l: "Тихо", bg: "linear-gradient(165deg, #130418 0%, #220830 50%, #180620 100%)",
    card: "rgba(120,36,100,.18)", border: "rgba(150,50,130,.28)",
    accent: "#9B3878", ar: "155,56,120",
    dim: "rgba(120,36,100,.2)", o1: "rgba(110,28,90,.75)", o2: "rgba(180,90,180,.5)",
    nav: "rgba(130,40,110,.3)", text: "#f0d8f0", tr: "240,216,240",
    gF: "#280A30", gT: "#130418"
  },
  // Наполнена — Ember & Amethyst: dark orange heat + deep violet depth
  full: {
    e: "🌕", l: "Наполнена", bg: "linear-gradient(165deg, #160808 0%, #280E08 40%, #1A0A1E 100%)",
    card: "rgba(200,90,30,.16)", border: "rgba(220,110,40,.26)",
    accent: "#D4682A", ar: "212,104,42",
    accent2: "#9060C8", ar2: "144,96,200",
    dim: "rgba(200,90,30,.2)", o1: "rgba(200,80,30,.75)", o2: "rgba(120,70,200,.5)",
    nav: "rgba(200,90,30,.3)", text: "#F5E8DC", tr: "245,232,220",
    gF: "#2A1008", gT: "#160808"
  },
  // В силе — Crimson Fire: pure red heat + ember glow + fierce energy
  power: {
    e: "🔥", l: "В силе", bg: "linear-gradient(165deg, #1C0404 0%, #340808 50%, #200606 100%)",
    card: "rgba(200,30,40,.18)", border: "rgba(220,50,55,.28)",
    accent: "#CC2434", ar: "204,36,52",
    accent2: "#F08060", ar2: "240,128,96",
    dim: "rgba(200,30,40,.22)", o1: "rgba(200,24,36,.8)", o2: "rgba(240,128,96,.45)",
    nav: "rgba(200,36,48,.32)", text: "#FFE4E0", tr: "255,228,224",
    gF: "#380A08", gT: "#1C0404"
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
