import { userStorage as localStorage } from "../lib/userStorage.js";
// Psychological Capital tracker — 6 axes of inner growth
// All scores 0-100, persisted in localStorage

const KEY = "frisson_psycap_v2";
const MAX = 100;
const MIN = 0;
const BASELINE = 0;
const MAX_DAILY_GAIN = 1.5; // max points per axis per day — keeps growth very slow

// ── 5 AXES ──────────────────────────────────────────────────────────────
const AXES_RU = [
  { id: "safety",     label: "Внутренняя безопасность", short: "Безопасность", hex: "#B9A9DA", desc: "Ощущение внутреннего фундамента, на который можно опереться — когда не нужно быть настороже, тело расслаблено, а жизнь не воспринимается как угроза. Из безопасности рождается способность отдыхать, открываться и жить, а не выживать." },
  { id: "worth",      label: "Самоценность",             short: "Самоценность", hex: "#e39a3c", desc: "Глубинное знание: вы ценны не потому, что достигли или заслужили, а просто потому, что вы есть. Из самоценности рождается способность позволить себе больше — любви, денег, отдыха, признания — без чувства вины." },
  { id: "feminine",   label: "Женская энергия",          short: "Женственность",hex: "#C57A8A", desc: "Живой контакт с вашей женской природой — мягкостью, чувственностью, способностью наслаждаться и принимать. Когда женская энергия наполнена, жизнь перестаёт быть задачей и становится опытом, который хочется переживать." },
  { id: "trust",      label: "Доверие к миру",           short: "Доверие",      hex: "#8E76B8", desc: "Ощущение, что мир в целом добр к вам — что можно отпустить контроль, не ожидая плохого. Из доверия рождается способность принимать помощь, открываться переменам и позволять хорошему случаться без немедленного ожидания потери." },
  { id: "authentic",  label: "Подлинность",              short: "Подлинность",  hex: "#e39a3c", desc: "Степень совпадения с собой настоящей — когда ваши действия, слова и выборы исходят из вашей сути, а не из страха или чужих ожиданий. Чем выше подлинность, тем меньше неврозов, тем правильнее люди в вашей жизни." },
];
const AXES_EN = [
  { id: "safety",     label: "Inner safety",       short: "Safety",       hex: "#B9A9DA", desc: "A sense of inner foundation you can lean on — no need to be on guard, body is relaxed, life doesn't feel like a threat. From safety comes the ability to rest, open up, and live rather than survive." },
  { id: "worth",      label: "Self-worth",         short: "Self-worth",   hex: "#e39a3c", desc: "A deep knowing: you are valuable not because you achieved or earned it, but simply because you exist. From self-worth comes the ability to allow yourself more — love, money, rest, recognition — without guilt." },
  { id: "feminine",   label: "Feminine energy",    short: "Femininity",   hex: "#C57A8A", desc: "Alive contact with your feminine nature — softness, sensuality, the ability to enjoy and receive. When feminine energy is full, life stops being a task to solve and becomes an experience to feel." },
  { id: "trust",      label: "Trust in the world", short: "Trust",        hex: "#8E76B8", desc: "The sense that the world is, on the whole, kind to you — that you can release control without waiting for something bad. From trust comes the ability to receive help, embrace change, and let good things happen." },
  { id: "authentic",  label: "Authenticity",       short: "Authenticity", hex: "#e39a3c", desc: "The degree to which you are aligned with your true self — when your actions, words and choices come from your core, not from fear or others' expectations. The higher your authenticity, the less neurosis, and the more right the people in your life." },
];
export const AXES = AXES_RU;
export function getAxes(lang = "ru") { return lang === "en" ? AXES_EN : AXES_RU; }

// ── CONTENT TAGGING ─────────────────────────────────────────────────────
// Each meditation maps to exactly 2 axes based on its core psychological mechanism.
// Axes: safety | worth | feminine | trust | authentic
export const MED_TAGS = {
  // Resource section
  "Возвращение к наполненности":        ["worth", "safety"],      // Залечивает дефициты: достойна быть наполненной + внутренняя безопасность как фундамент
  "Восполниться энергией":              ["safety", "feminine"],   // Истощение = угроза безопасности нервной системы; восстановление = женская природа
  "Женское внутреннее расслабление":    ["safety", "feminine"],   // Снять броню = ощутить безопасность; мягкость = суть женского
  "Я управляю своей жизнью":            ["authentic", "worth"],   // Занять позицию автора = жить из себя + знать свою цену
  // Feminine section
  "Женская энергия":                    ["feminine", "authentic"], // Прямая работа с женской природой + быть женщиной, а не функцией = подлинность
  "Состояние женской притягательности": ["feminine", "worth"],    // Внутренний магнетизм = из женского состояния + ощущение собственного вкуса/ценности
  // Receiving / Opening section
  "Где я перекрыла себе получение":     ["worth", "authentic"],   // Осознать блоки = увидеть, где предала себя (подлинность) + разрешить себе (самоценность)
  "Получение благ от мира":             ["worth", "trust"],       // Детские установки «я неудачница» = самоценность; открыться миру = доверие
  "Доверие к миру":                     ["trust", "safety"],      // Прямая работа с доверием + ощущение безопасности мира
  "Деньги и безопасность":              ["safety", "trust"],      // Деньги как зона безопасности + доверие что поток продолжается
  // New level section
  "Благодарность и новый уровень":      ["trust", "authentic"],   // Отпустить старый этап = доверие процессу + честное завершение (подлинность)
  "Новый уровень":                      ["worth", "authentic"],   // Я достойна большего + расширение в себя настоящую = подлинность
  "Разговор с собой из будущего":       ["authentic", "worth"],   // Связь с собой настоящей через время + ощущение своей ценности и возможностей
  "Вера — мост между реальностями":     ["trust", "safety"],      // Довериться переходному периоду + не предать себя = внутренняя безопасность в неопределённости
  // Self section
  "Право быть настоящей":               ["authentic", "trust"],   // Снять маски = быть собой + доверие что это безопасно
  "Мой ритм, мой формат, моя жизнь":    ["authentic", "safety"],  // Свой ритм = подлинность; тревога уходит когда не нужно соответствовать = безопасность
  // Feminine resource
  "Восполнение женской ресурсности":    ["feminine", "worth"],    // Напитать женскую часть = женское; разрешить себе наполняться = знать что достойна
};

// Diary entry tags → axes (user can tag entries)
export const DIARY_TAGS = {
  base:        ["authentic", "worth", "safety"], // any entry → 3 core axes
  желания:     ["feminine", "authentic"],
  тело:        ["feminine", "safety"],
  отношения:   ["worth", "trust"],
  деньги:      ["trust", "worth"],
};

// Auto-detect axes from diary text (keyword scan)
export function detectDiaryAxes(text) {
  const t = text.toLowerCase();
  const axes = new Set(DIARY_TAGS.base);
  if (/женств|красот|тело|чувств|энерги|мягк|нежн/.test(t))             { axes.add("feminine"); }
  if (/доверя|отпуст|контрол|страх|тревог|боюсь|верю миру/.test(t))     { axes.add("trust"); }
  if (/получ|приним|изобил|денег|деньги|подарок|заслуж/.test(t))        { axes.add("worth"); axes.add("trust"); }
  if (/ценн|достойн|люблю себ|уважаю|я важн|я значим/.test(t))          { axes.add("worth"); }
  if (/безопасн|спокойств|расслаб|защищ|тревог/.test(t))                { axes.add("safety"); }
  if (/настоящ|подлинн|маска|честн|я сама|своё|своим/.test(t))          { axes.add("authentic"); }
  return [...axes];
}

// Orbit layers → axes
export const LAYER_AXES = {
  1: "safety",    // Бессознательное — базовое ощущение безопасности
  2: "authentic", // Самость — контакт с подлинным «я»
  3: "worth",     // Сознательное — осознанная самоценность
  4: "feminine",  // Чувства — женская энергия и чувственность
  5: "trust",     // Эмоции — способность доверять и отпускать
  6: "worth",     // Поведение — действия, отражающие знание своей ценности
};

// Orbit scenarios → axes (scenario gives 2 axes when active, overrides layer mapping)
export const SCENARIO_AXES = {
  anxiety:   ["safety", "trust"],      // Тревога → внутренняя безопасность + доверие миру
  love:      ["worth", "feminine"],    // Любовь/Наполненность → самоценность (достойна любви) + женская открытость
  power:     ["authentic", "worth"],   // Сила → подлинность + самоценность
  conflict:  ["authentic", "trust"],   // Внутренний конфликт → честность с собой + доверие
  fear:      ["safety", "trust"],      // Страх → безопасность + доверие
  abundance: ["worth", "trust"],       // Изобилие → самоценность (достойна) + доверие что поток есть
  feminine:  ["feminine", "authentic"],// Женственность → женская энергия + подлинность
  capital:   ["worth", "authentic"],   // Психологический капитал → самоценность + подлинность
};

// ── STATE ───────────────────────────────────────────────────────────────
function defaults() {
  const axes = {};
  AXES.forEach((a) => (axes[a.id] = BASELINE));
  return {
    axes,
    events: [],
    lastActivity: null,
    lastTestScore: null,
    orbitDaily: {},
    lastDecay: Date.now(),
    dailyAxisGain: {},   // { axisId: gainToday } — resets each day
    dailyAxisGainDate: null,
  };
}

function load() {
  try {
    const d = JSON.parse(localStorage.getItem(KEY));
    if (!d) return defaults();
    if (!d.axes || !d.events) return defaults();
    AXES.forEach((a) => { if (d.axes[a.id] === undefined) d.axes[a.id] = BASELINE; });
    return d;
  } catch { return defaults(); }
}
function save(d) { localStorage.setItem(KEY, JSON.stringify(d)); }

function today() { return new Date().toISOString().slice(0, 10); }

function applyDecay(d) {
  const now = Date.now();
  const days = Math.floor((now - (d.lastDecay || now)) / 86400000);
  if (days >= 7) {
    const periods = Math.floor(days / 7);
    AXES.forEach((a) => {
      d.axes[a.id] = Math.max(BASELINE, d.axes[a.id] - periods * 0.5);
    });
    d.lastDecay = now;
  }
}

// Diminishing returns: progress slows significantly as axis approaches 100
function calcGain(current, basePoints) {
  const headroom = MAX - current;
  if (headroom <= 0) return 0;
  return basePoints * Math.sqrt(headroom / MAX);
}

// ── CORE: add event and update axes ─────────────────────────────────────
function addEvent(type, name, axes, basePoints, meta = {}) {
  const d = load();
  applyDecay(d);
  const t = today();
  // Reset daily gain tracker if it's a new day
  if (d.dailyAxisGainDate !== t) {
    d.dailyAxisGain = {};
    d.dailyAxisGainDate = t;
  }
  axes.forEach((axId) => {
    const alreadyGained = d.dailyAxisGain[axId] || 0;
    const remaining = MAX_DAILY_GAIN - alreadyGained;
    if (remaining <= 0) return; // daily cap hit for this axis
    const rawGain = calcGain(d.axes[axId], basePoints);
    const gain = Math.min(rawGain, remaining);
    d.axes[axId] = Math.min(MAX, d.axes[axId] + gain);
    d.dailyAxisGain[axId] = alreadyGained + gain;
  });
  d.events.unshift({ ts: Date.now(), type, name, axes, points: basePoints, meta });
  if (d.events.length > 500) d.events = d.events.slice(0, 500);
  d.lastActivity = Date.now();
  save(d);
  return d;
}

// ── PUBLIC API ──────────────────────────────────────────────────────────

// Meditation listened (full or partial)
export function logMeditation(title, completion = "full") {
  const axes = MED_TAGS[title];
  if (!axes) return;
  const points = completion === "full" ? 3 : 1.2;
  addEvent("meditation", title, axes, points, { completion });
  addStreakBonus();
}

// Diary entry completed — tags are already axis IDs from detectDiaryAxes
export function logDiary(text, tags = []) {
  const axSet = new Set([...DIARY_TAGS.base, ...tags]);
  addEvent("diary", text.slice(0, 40), [...axSet], 1.5, { tags });
  addStreakBonus();
}

// Orbit session (>1 min) — capped 1x per layer+scenario combo per day
export function logOrbitSession(layerId, layerName, scenarioName, scenarioId) {
  const d = load();
  const t = today();
  const cacheKey = scenarioId ? `${layerId}_${scenarioId}` : String(layerId);
  if (!d.orbitDaily[t]) d.orbitDaily[t] = {};
  if (d.orbitDaily[t][cacheKey]) return; // already counted today
  d.orbitDaily[t][cacheKey] = true;
  save(d);
  // If a scenario is active, map to its 2 axes at 3 pts each; otherwise fall back to layer's 1 axis at 2 pts
  const displayName = scenarioName ? `Орбита · ${scenarioName}` : `Орбита · ${layerName}`;
  if (scenarioId && SCENARIO_AXES[scenarioId]) {
    addEvent("orbit", displayName, SCENARIO_AXES[scenarioId], 2, { layerId, scenarioName, scenarioId, layerName });
  } else {
    const axId = LAYER_AXES[layerId];
    if (!axId) return;
    addEvent("orbit", displayName, [axId], 1, { layerId, scenarioName, layerName });
  }
  addStreakBonus();
}

// Energy test — records score for history only, does NOT affect psych capital axes
// Axes only grow through actual practices (meditations, orbit, diary)
export function logEnergyTest(score) {
  const d = load();
  applyDecay(d);
  d.lastTestScore = score;
  d.events.unshift({
    ts: Date.now(),
    type: "test",
    name: `Тест энергии: ${score}`,
    axes: [],
    points: 0,
    meta: { score },
  });
  if (d.events.length > 500) d.events = d.events.slice(0, 500);
  d.lastActivity = Date.now();
  save(d);
}

// Weekly self-report check-in: 4 sliders (0-100)
export function logWeeklyCheckin(values) {
  const d = load();
  applyDecay(d);
  // Values: { safety, worth, feminine, trust } — sliders
  // Blend: 70% current + 30% reported
  ["safety", "worth", "feminine", "trust"].forEach((id) => {
    if (typeof values[id] === "number") {
      d.axes[id] = Math.round(d.axes[id] * 0.7 + values[id] * 0.3);
    }
  });
  d.events.unshift({
    ts: Date.now(),
    type: "checkin",
    name: "Еженедельный чекин",
    axes: ["safety", "worth", "feminine", "trust"],
    points: 0,
    meta: { values },
  });
  d.lastActivity = Date.now();
  save(d);
}

// Daily streak bonus — tiny safety nudge once per day for consistent practice
function addStreakBonus() {
  const d = load();
  const t = today();
  if (d.lastStreakDay === t) return;
  d.lastStreakDay = t;
  const gain = calcGain(d.axes.safety, 0.3);
  d.axes.safety = Math.min(MAX, d.axes.safety + gain);
  save(d);
}

// ── GETTERS ─────────────────────────────────────────────────────────────
export function getPsycap() {
  const d = load();
  applyDecay(d);
  save(d);
  return d;
}

export function getOverallScore() {
  const d = getPsycap();
  const total = AXES.reduce((s, a) => s + d.axes[a.id], 0);
  return Math.round(total / AXES.length);
}

export function getLowestAxis() {
  const d = getPsycap();
  const sorted = [...AXES].map((a) => ({ ...a, value: d.axes[a.id] })).sort((a, b) => a.value - b.value);
  return sorted[0];
}

export function getHighestAxis() {
  const d = getPsycap();
  const sorted = [...AXES].map((a) => ({ ...a, value: d.axes[a.id] })).sort((a, b) => b.value - a.value);
  return sorted[0];
}

// Get last activity date for a specific axis
export function getLastAxisActivity(axId) {
  const d = getPsycap();
  const evt = d.events.find((e) => e.axes.includes(axId));
  return evt ? evt.ts : null;
}

// Monthly delta: current score minus score 30 days ago
export function getMonthlyDelta() {
  const d = getPsycap();
  const now = Date.now();
  const monthAgo = now - 30 * 86400000;
  const current = getOverallScore();
  // Sum all positive events in last 30 days
  const gained = d.events
    .filter((e) => e.ts >= monthAgo && e.points > 0)
    .reduce((s, e) => s + e.points, 0);
  return Math.round(gained / AXES.length);
}

// Score history timeseries for growth chart
export function getScoreHistory(rangeMs = 30 * 86400000) {
  const d = getPsycap();
  const now = Date.now();
  const start = now - rangeMs;
  const events = d.events.filter((e) => e.ts >= start).sort((a, b) => a.ts - b.ts);
  // Build timeseries: starting from current score minus all gains, apply events forward
  const totalPoints = events.filter((e) => e.points > 0).reduce((s, e) => s + e.points, 0);
  const startScore = Math.max(MIN, getOverallScore() - Math.round(totalPoints / AXES.length));
  const points = [{ ts: start, score: startScore }];
  let current = startScore;
  events.forEach((e) => {
    current += Math.round((e.points * e.axes.length) / AXES.length);
    points.push({ ts: e.ts, score: Math.min(MAX, current), event: e });
  });
  if (points[points.length - 1].ts < now) {
    points.push({ ts: now, score: getOverallScore() });
  }
  return points;
}

// Get events grouped by day for activity feed
export function getEventsByDay() {
  const d = getPsycap();
  const groups = {};
  d.events.forEach((e) => {
    const day = new Date(e.ts).toISOString().slice(0, 10);
    if (!groups[day]) groups[day] = [];
    groups[day].push(e);
  });
  return Object.entries(groups)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([day, events]) => ({ day, events }));
}

// Smart recommendation based on lowest axis
export function getRecommendation(lang = "ru") {
  const lowest = getLowestAxis();
  const axes = getAxes(lang);
  const lowestLocalized = axes.find((a) => a.id === lowest.id) || lowest;
  const RECS_RU = {
    safety:    { med: "Женское внутреннее расслабление", scenario: "fear",     text: "Ваша нервная система нуждается в ощущении безопасности — начните с практики расслабления или сценария «Страх» в орбите." },
    worth:     { med: "Получение благ от мира",          scenario: "power",    text: "Самоценность растёт через практики — попробуйте медитацию на трансформацию установок или сценарий «Сила» в орбите." },
    feminine:  { med: "Женская энергия",                  scenario: "feminine", text: "Ваша женская часть зовёт на наполнение — послушайте медитацию или выберите сценарий «Женственность» в орбите." },
    trust:     { med: "Доверие к миру",                   scenario: "love",     text: "Доверие укрепляется постепенно — начните с медитации или сценария «Любовь» в орбите." },
    authentic: { med: "Право быть настоящей",             scenario: "capital",  text: "Вернитесь к себе настоящей — послушайте медитацию или пройдите сценарий «Капитал» в орбите." },
  };
  const RECS_EN = {
    safety:    { med: "Feminine inner relaxation", scenario: "fear",      text: "Your nervous system needs safety — start with a relaxation meditation or the 'Fear' scenario in the orbit." },
    worth:     { med: "Receiving from the world",  scenario: "power",     text: "Self-worth grows through practice — try the beliefs-transforming meditation or the 'Power' scenario in the orbit." },
    feminine:  { med: "Feminine energy",            scenario: "feminine",  text: "Your feminine part is calling for nourishment — listen to the meditation or choose the 'Femininity' scenario in the orbit." },
    trust:     { med: "Trust in the world",         scenario: "love",      text: "Trust builds gradually — start with the meditation or the 'Love' scenario in the orbit." },
    authentic: { med: "The right to be real",       scenario: "capital",   text: "Return to your true self — listen to the meditation or go through the 'Capital' scenario in the orbit." },
  };
  const RECS = lang === "en" ? RECS_EN : RECS_RU;
  return { axis: lowestLocalized, ...RECS[lowest.id] };
}

export function resetPsycap() { localStorage.removeItem(KEY); }
