// Night themes (original dark)
const NIGHT = {
  empty: {
    e: "🌑", l: "Пустота", bg: "#070818",
    card: "rgba(40,44,100,.1)", border: "rgba(50,55,130,.18)",
    accent: "#6060C0", ar: "96,96,192",
    dim: "rgba(40,44,100,.14)", o1: "rgba(30,30,110,.8)", o2: "rgba(60,30,150,.45)",
    nav: "rgba(50,55,130,.28)", text: "#dde0f8",
    gF: "#0e0f28", gT: "#070818"
  },
  quiet: {
    e: "🌒", l: "Тихо", bg: "#090c14",
    card: "rgba(96,112,180,.06)", border: "rgba(96,112,180,.15)",
    accent: "#8090C0", ar: "128,144,192",
    dim: "rgba(96,112,180,.1)", o1: "rgba(96,112,180,.55)", o2: "rgba(180,100,40,.35)",
    nav: "rgba(96,112,180,.22)", text: "#eaecf8",
    gF: "#10142a", gT: "#090c14"
  },
  full: {
    e: "🌕", l: "Наполнена", bg: "#0d0614",
    card: "rgba(148,38,148,.07)", border: "rgba(180,20,120,.2)",
    accent: "#B020A0", ar: "176,32,160",
    dim: "rgba(148,38,148,.12)", o1: "rgba(180,20,120,.7)", o2: "rgba(80,30,180,.5)",
    nav: "rgba(148,38,148,.3)", text: "#fce8ff",
    gF: "#2a0428", gT: "#0d0614"
  },
  power: {
    e: "🔥", l: "В силе", bg: "#100806",
    card: "rgba(180,60,20,.07)", border: "rgba(180,60,20,.18)",
    accent: "#C04818", ar: "192,72,24",
    dim: "rgba(138,40,16,.14)", o1: "rgba(180,60,10,.7)", o2: "rgba(100,80,160,.4)",
    nav: "rgba(180,60,20,.3)", text: "#fceee8",
    gF: "#2c1008", gT: "#100806"
  },
};

// Day themes — Cloud Dancer base with jewel accents
const DAY = {
  empty: {
    e: "🌑", l: "Пустота", bg: "#F0EDE8",
    card: "rgba(80,70,120,.06)", border: "rgba(80,70,120,.12)",
    accent: "#6858A8", ar: "104,88,168",
    dim: "rgba(80,70,120,.08)", o1: "rgba(100,80,160,.15)", o2: "rgba(60,30,150,.08)",
    nav: "rgba(80,70,120,.1)", text: "#2a2440",
    gF: "#E8E4DE", gT: "#F0EDE8"
  },
  quiet: {
    e: "🌒", l: "Тихо", bg: "#EDE9E4",
    card: "rgba(120,60,90,.05)", border: "rgba(120,60,90,.12)",
    accent: "#8B3A6B", ar: "139,58,107",
    dim: "rgba(120,60,90,.07)", o1: "rgba(140,50,100,.12)", o2: "rgba(200,120,60,.08)",
    nav: "rgba(120,60,90,.1)", text: "#3a1830",
    gF: "#E6E0DA", gT: "#EDE9E4"
  },
  full: {
    e: "🌕", l: "Наполнена", bg: "#F0EAE8",
    card: "rgba(160,30,100,.05)", border: "rgba(160,30,100,.12)",
    accent: "#A82070", ar: "168,32,112",
    dim: "rgba(160,30,100,.07)", o1: "rgba(180,40,120,.12)", o2: "rgba(100,40,160,.08)",
    nav: "rgba(160,30,100,.1)", text: "#380828",
    gF: "#E8E0DE", gT: "#F0EAE8"
  },
  power: {
    e: "🔥", l: "В силе", bg: "#F0ECE4",
    card: "rgba(200,100,30,.05)", border: "rgba(200,100,30,.12)",
    accent: "#C06820", ar: "192,104,32",
    dim: "rgba(200,100,30,.08)", o1: "rgba(200,100,30,.12)", o2: "rgba(120,50,100,.08)",
    nav: "rgba(200,100,30,.1)", text: "#3a1808",
    gF: "#E8E4DC", gT: "#F0ECE4"
  },
};

export function getThemes(mode) { return mode === "day" ? DAY : NIGHT; }
export const THEMES = NIGHT; // default export for backward compat

export const ENERGY_LEVELS = [
  { min: 0, max: 25, l: "Критическое истощение" },
  { min: 26, max: 45, l: "Низкий ресурс" },
  { min: 46, max: 65, l: "Средний ресурс" },
  { min: 66, max: 82, l: "Хороший ресурс" },
  { min: 83, max: 100, l: "Высокий ресурс" },
];

export const getEnergyLevel = (s) =>
  ENERGY_LEVELS.find((l) => s >= l.min && s <= l.max) || ENERGY_LEVELS[0];
