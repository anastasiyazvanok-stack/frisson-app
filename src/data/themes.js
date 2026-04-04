export const THEMES = {
  empty: {
    e: "🌑", l: "Пустота", bg: "#070818",
    card: "rgba(255,255,255,.04)", border: "rgba(50,55,130,.25)",
    accent: "#6060C0", ar: "96,96,192",
    dim: "rgba(255,255,255,.06)", o1: "rgba(30,30,110,.8)", o2: "rgba(60,30,150,.45)",
    nav: "rgba(50,55,130,.28)", text: "#dde0f8",
    gF: "#0e0f28", gT: "#070818"
  },
  quiet: {
    e: "🌒", l: "Тихо", bg: "#090c14",
    card: "rgba(255,255,255,.04)", border: "rgba(96,112,180,.22)",
    accent: "#8090C0", ar: "128,144,192",
    dim: "rgba(255,255,255,.06)", o1: "rgba(96,112,180,.55)", o2: "rgba(180,100,40,.35)",
    nav: "rgba(96,112,180,.22)", text: "#eaecf8",
    gF: "#10142a", gT: "#090c14"
  },
  full: {
    e: "🌕", l: "Наполнена", bg: "#0d0614",
    card: "rgba(255,255,255,.04)", border: "rgba(180,20,120,.3)",
    accent: "#B020A0", ar: "176,32,160",
    dim: "rgba(255,255,255,.06)", o1: "rgba(180,20,120,.7)", o2: "rgba(80,30,180,.5)",
    nav: "rgba(148,38,148,.3)", text: "#fce8ff",
    gF: "#2a0428", gT: "#0d0614"
  },
  power: {
    e: "🔥", l: "В силе", bg: "#100806",
    card: "rgba(255,255,255,.04)", border: "rgba(180,60,20,.3)",
    accent: "#C04818", ar: "192,72,24",
    dim: "rgba(255,255,255,.06)", o1: "rgba(180,60,10,.7)", o2: "rgba(100,80,160,.4)",
    nav: "rgba(180,60,20,.3)", text: "#fceee8",
    gF: "#2c1008", gT: "#100806"
  },
};

export const ENERGY_LEVELS = [
  { min: 0, max: 25, l: "Критическое истощение" },
  { min: 26, max: 45, l: "Низкий ресурс" },
  { min: 46, max: 65, l: "Средний ресурс" },
  { min: 66, max: 82, l: "Хороший ресурс" },
  { min: 83, max: 100, l: "Высокий ресурс" },
];

export const getEnergyLevel = (s) =>
  ENERGY_LEVELS.find((l) => s >= l.min && s <= l.max) || ENERGY_LEVELS[0];
