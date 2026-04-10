// Psychological Capital + Femininity (HEROF model)
// H = Hope · E = self-Efficacy · R = Resilience · O = Optimism · F = Femininity
// Each practice grows specific dimensions. The more you practice, the higher
// your scores. Visible to users in Profile with clear explanations.

const KEY = "frisson_psycap";
const MAX = 100;
const STARTING_VALUE = 12;

function defaults() {
  return {
    hope: STARTING_VALUE, efficacy: STARTING_VALUE, resilience: STARTING_VALUE,
    optimism: STARTING_VALUE, femininity: STARTING_VALUE,
    history: [],
  };
}

function load() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY)) || defaults();
    if (d.femininity === undefined) d.femininity = STARTING_VALUE;
    return d;
  } catch { return defaults(); }
}
function save(d) { localStorage.setItem(KEY, JSON.stringify(d)); }

// Each practice = HEROF weights (points added per session)
// Sum is roughly 4-6 per practice — gradual realistic growth
export const PRACTICE_HEROF = {
  // Orbit scenarios
  neutral:   { h: 1, e: 1, r: 1, o: 1, f: 1 },
  anxiety:   { h: 0, e: 1, r: 3, o: 1, f: 0 }, // recovery → resilience
  love:      { h: 3, e: 0, r: 1, o: 2, f: 2 }, // love → hope, optimism, femininity
  power:     { h: 2, e: 4, r: 1, o: 1, f: 0 }, // inner fire → self-efficacy
  conflict:  { h: 1, e: 3, r: 2, o: 0, f: 0 }, // resolving → efficacy + resilience
  fear:      { h: 1, e: 1, r: 4, o: 1, f: 0 }, // facing fear → resilience
  abundance: { h: 3, e: 1, r: 0, o: 3, f: 1 }, // receiving → hope + optimism
  feminine:  { h: 1, e: 0, r: 1, o: 1, f: 5 }, // direct → femininity
  capital:   { h: 2, e: 2, r: 2, o: 2, f: 0 }, // direct → all HERO
  // Journal sections
  intent:    { h: 3, e: 1, r: 0, o: 2, f: 0 },
  grat:      { h: 1, e: 0, r: 1, o: 4, f: 0 },
  goals:     { h: 2, e: 3, r: 0, o: 1, f: 0 },
  reflect:   { h: 0, e: 1, r: 3, o: 1, f: 1 },
};

// Map each Library meditation title to a HEROF practice key
// Listening to a recorded meditation = full practice with weighted points
export const MED_TO_PSYCAP = {
  // Resource section
  "Возвращение к наполненности": "love",       // filling self with love
  "Восполниться энергией": "power",             // energy restoration
  "Женское внутреннее расслабление": "feminine", // feminine relaxation
  "Я автор своей жизни": "power",               // self-efficacy
  // Feminine section — all directly feminine
  "Женская энергия": "feminine",
  "Возвращение к себе женственной": "feminine",
  "Состояние женской притягательности": "feminine",
  "Женское счастье — это норма": "feminine",
  // Receiving section
  "Где я перекрыла себе получение": "abundance",
  "Получение благ от мира": "abundance",
  "Доверие к миру": "abundance",                // optimism + hope (trust)
  "Деньги и безопасность": "abundance",
  // New level section
  "Благодарность и новый уровень": "abundance", // gratitude → optimism
  "Новый уровень": "capital",                   // builds all HERO
  "Разговор с собой из будущего": "capital",    // hope + identity
  "Вера — мост между реальностями": "fear",     // resilience for transitions
  // Self section
  "Право быть настоящей": "feminine",            // authenticity
};

// Human-readable practice names for the analytics breakdown
export const PRACTICE_NAMES = {
  neutral: "Нейтральная медитация",
  anxiety: "Работа с тревогой",
  love: "Любовь · Наполненность",
  power: "Сила · Внутренний огонь",
  conflict: "Внутренний конфликт",
  fear: "Работа со страхом",
  abundance: "Изобилие · Получение",
  feminine: "Женственность · Текучесть",
  capital: "Психологический капитал",
  intent: "Намерения в дневнике",
  grat: "Благодарность",
  goals: "Цели",
  reflect: "Рефлексия",
};

export function addPsycap(source) {
  const w = PRACTICE_HEROF[source];
  if (!w) return load();
  const d = load();
  d.hope = Math.min(MAX, d.hope + w.h);
  d.efficacy = Math.min(MAX, d.efficacy + w.e);
  d.resilience = Math.min(MAX, d.resilience + w.r);
  d.optimism = Math.min(MAX, d.optimism + w.o);
  d.femininity = Math.min(MAX, d.femininity + (w.f || 0));
  d.history.push({ ts: Date.now(), ...w, source });
  if (d.history.length > 300) d.history = d.history.slice(-300);
  save(d);
  return d;
}

export function getPsycap() { return load(); }

export function getPsycapStats() {
  const d = load();
  const total = d.hope + d.efficacy + d.resilience + d.optimism + d.femininity;
  const avg = Math.round(total / 5);

  const now = Date.now();
  const weekAgo = now - 7 * 86400000;
  const twoWeeksAgo = now - 14 * 86400000;
  const thisWeek = d.history.filter((h) => h.ts >= weekAgo);
  const lastWeek = d.history.filter((h) => h.ts >= twoWeeksAgo && h.ts < weekAgo);
  const sum = (entries) => entries.reduce((s, e) => s + e.h + e.e + e.r + e.o + (e.f || 0), 0);
  const weeklyGrowth = sum(thisWeek) - sum(lastWeek);

  const dims = [
    { id: "hope",       label: "Надежда",          value: d.hope,       hex: "#F08838", desc: "Способность видеть пути и желать большего" },
    { id: "efficacy",   label: "Самоэффективность", value: d.efficacy,   hex: "#E64DA8", desc: "Уверенность, что справишься с задачами" },
    { id: "resilience", label: "Стойкость",        value: d.resilience, hex: "#9F7BD8", desc: "Способность восстанавливаться после трудностей" },
    { id: "optimism",   label: "Оптимизм",         value: d.optimism,   hex: "#FFAF32", desc: "Вера, что хорошее возможно и произойдёт" },
    { id: "femininity", label: "Женственность",    value: d.femininity, hex: "#D080B0", desc: "Контакт с мягкостью, текучестью и природой" },
  ];
  const sorted = [...dims].sort((a, b) => b.value - a.value);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];

  const RECS = {
    hope:       { scenario: "love",      label: "Любовь · Наполненность",   text: "Откройте сердце надежде. Любовь и наполненность учат видеть возможности и желать без страха." },
    efficacy:   { scenario: "power",     label: "Сила · Внутренний огонь",  text: "Укрепите веру в свои силы. Практика внутреннего огня собирает энергию для уверенных действий." },
    resilience: { scenario: "anxiety",   label: "Работа с тревогой",        text: "Учитесь восстанавливаться. Сценарии тревоги и страха тренируют возвращение в покой." },
    optimism:   { scenario: "abundance", label: "Изобилие · Получение благ", text: "Настройтесь на хорошее. Практика изобилия меняет то, что вы ожидаете от мира." },
    femininity: { scenario: "feminine",  label: "Женственность · Текучесть", text: "Вернитесь в свою природу. Практика текучести раскрывает мягкость, чувственность и магнетизм." },
  };

  // Practice breakdown — count of each source over all time
  const practiceCounts = {};
  d.history.forEach((h) => { practiceCounts[h.source] = (practiceCounts[h.source] || 0) + 1; });
  const topPractices = Object.entries(practiceCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, count]) => ({ id, name: PRACTICE_NAMES[id] || id, count }));

  return {
    dims, total, avg, weeklyGrowth,
    strongest, weakest,
    recommendation: RECS[weakest.id],
    sessionsThisWeek: thisWeek.length,
    totalSessions: d.history.length,
    topPractices,
  };
}

export function resetPsycap() { localStorage.removeItem(KEY); }
