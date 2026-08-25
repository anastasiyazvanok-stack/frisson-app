// Psychological Capital tracker — 6 axes of inner growth
// All scores 0-100, persisted in localStorage

const KEY = "frisson_psycap_v2";
const MAX = 100;
const MIN = 0;
const BASELINE = 20;
const MAX_DAILY_GAIN = 1.5; // max points per axis per day — keeps growth very slow

// ── 6 AXES ──────────────────────────────────────────────────────────────
const AXES_RU = [
  { id: "safety",     label: "Внутренняя безопасность", short: "Безопасность", hex: "#7EC8DC", desc: "Насколько вы чувствуете себя в безопасности внутри — без постоянной тревоги, напряжения и ожидания плохого." },
  { id: "worth",      label: "Самоценность",             short: "Самоценность", hex: "#E64DA8", desc: "Ощущение, что вы достойны хорошего просто потому, что вы есть — без доказательств и условий." },
  { id: "receive",    label: "Способность получать",     short: "Получение",    hex: "#FFAF32", desc: "Умение принимать любовь, деньги, помощь и внимание — без стыда, вины и ощущения «мне нельзя»." },
  { id: "feminine",   label: "Женская энергия",          short: "Женственность",hex: "#D080B0", desc: "Контакт с вашей мягкостью, чувственностью и живым состоянием — когда вы не функция, а живая женщина." },
  { id: "trust",      label: "Доверие к миру",           short: "Доверие",      hex: "#9F7BD8", desc: "Способность отпустить контроль и позволить жизни идти — без постоянного ожидания подвоха." },
  { id: "authentic",  label: "Подлинность",              short: "Подлинность",  hex: "#F08838", desc: "Жить из себя настоящей — без масок, ролей и подстройки под чужие ожидания." },
];
const AXES_EN = [
  { id: "safety",     label: "Inner safety",       short: "Safety",       hex: "#7EC8DC", desc: "How safe you feel inside — without constant anxiety, tension, or waiting for something bad to happen." },
  { id: "worth",      label: "Self-worth",         short: "Self-worth",   hex: "#E64DA8", desc: "The feeling that you deserve good things simply because you exist — no proof required." },
  { id: "receive",    label: "Ability to receive", short: "Receiving",    hex: "#FFAF32", desc: "The ability to accept love, money, help and attention — without shame, guilt, or feeling like you shouldn't." },
  { id: "feminine",   label: "Feminine energy",    short: "Femininity",   hex: "#D080B0", desc: "Contact with your softness, sensuality and aliveness — when you are a living woman, not just a function." },
  { id: "trust",      label: "Trust in the world", short: "Trust",        hex: "#9F7BD8", desc: "The ability to release control and let life flow — without constantly waiting for a catch." },
  { id: "authentic",  label: "Authenticity",       short: "Authenticity", hex: "#F08838", desc: "Living from your true self — without masks, roles, or adapting to others' expectations." },
];
export const AXES = AXES_RU;
export function getAxes(lang = "ru") { return lang === "en" ? AXES_EN : AXES_RU; }

// ── CONTENT TAGGING ─────────────────────────────────────────────────────
// Each meditation maps to exactly 2 axes based on its psychological mechanism
export const MED_TAGS = {
  // Resource section
  "Возвращение к наполненности":        ["worth", "receive"],     // Наполниться = знать что достойна + принять
  "Восполниться энергией":              ["safety", "feminine"],   // Истощение = угроза безопасности; энергия = женская природа
  "Женское внутреннее расслабление":    ["safety", "feminine"],   // Снять броню = безопасность; мягкость = женское
  "Я управляю своей жизнью":                ["authentic", "worth"],   // Взять управление = жить из себя + знать цену
  // Feminine section
  "Женская энергия":                    ["feminine", "authentic"], // Прямая работа с женской природой
  "Возвращение к себе женственной":     ["feminine", "authentic"], // Женская индивидуальность + возврат к себе
  "Состояние женской притягательности": ["feminine", "worth"],    // Притяжение = из женского + вкус к себе
  // Receiving section
  "Где я перекрыла себе получение":     ["receive", "worth"],     // Блоки получения + ощущение недостойности
  "Получение благ от мира":             ["receive", "trust"],     // Принять = открыться + доверять миру
  "Доверие к миру":                     ["trust", "safety"],      // Доверие + базовая безопасность
  "Деньги и безопасность":              ["safety", "receive"],    // Деньги как зона безопасности + разрешение получать
  // New level section
  "Благодарность и новый уровень":      ["trust", "authentic"],   // Отпустить = доверие + честное завершение
  "Новый уровень":                      ["worth", "receive"],     // Я достойна большего + способность это выдержать
  "Разговор с собой из будущего":       ["authentic", "worth"],   // Связь с собой настоящей + вера в свою ценность
  "Вера — мост между реальностями":     ["trust", "safety"],      // Довериться переходу + не предать себя
  // Self section
  "Право быть настоящей":               ["authentic", "trust"],   // Быть собой + доверие что это безопасно
  "Мой ритм, мой формат, моя жизнь":    ["authentic", "safety"],  // Свой ритм = подлинность + тревога уходит = безопасность
  // Feminine section addition
  "Восполнение женской ресурсности":    ["feminine", "receive"],  // Женский ресурс = женское + разрешить себе наполняться
};

// Diary entry tags → axes (user can tag entries)
export const DIARY_TAGS = {
  base:        ["authentic", "worth", "safety"], // any entry → 3 core axes
  желания:     ["feminine", "authentic"],
  тело:        ["feminine", "safety"],
  отношения:   ["worth", "trust"],
  деньги:      ["receive", "worth"],
};

// Auto-detect axes from diary text (keyword scan)
export function detectDiaryAxes(text) {
  const t = text.toLowerCase();
  const axes = new Set(DIARY_TAGS.base);
  if (/женств|красот|тело|чувств|энерги|мягк|нежн/.test(t))             { axes.add("feminine"); }
  if (/доверя|отпуст|контрол|страх|тревог|боюсь|верю миру/.test(t))     { axes.add("trust"); }
  if (/получ|приним|изобил|денег|деньги|подарок|заслуж/.test(t))        { axes.add("receive"); }
  if (/ценн|достойн|люблю себ|уважаю|я важн|я значим/.test(t))          { axes.add("worth"); }
  if (/безопасн|спокойств|расслаб|защищ|тревог/.test(t))                { axes.add("safety"); }
  if (/настоящ|подлинн|маска|честн|я сама|своё|своим/.test(t))          { axes.add("authentic"); }
  return [...axes];
}

// Orbit layers → axes
export const LAYER_AXES = {
  1: "safety",    // Бессознательное
  2: "authentic", // Самость / Подлинность
  3: "worth",     // Сознательное
  4: "feminine",  // Чувства
  5: "trust",     // Эмоции
  6: "receive",   // Поведение
};

// Orbit scenarios → axes (scenario gives 2 axes when active, overrides layer mapping)
export const SCENARIO_AXES = {
  anxiety:   ["safety", "trust"],      // Тревога → безопасность + доверие
  love:      ["worth", "receive"],     // Любовь · Наполненность → самоценность + получение
  power:     ["authentic", "worth"],   // Сила → подлинность + самоценность
  conflict:  ["authentic", "trust"],   // Внутренний конфликт → подлинность + доверие
  fear:      ["safety", "trust"],      // Страх → безопасность + доверие
  abundance: ["receive", "trust"],     // Изобилие → получение + доверие
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

// Diary entry completed
export function logDiary(text, tags = []) {
  const axSet = new Set(DIARY_TAGS.base);
  tags.forEach((t) => {
    const ax = DIARY_TAGS[t];
    if (ax) ax.forEach((id) => axSet.add(id));
  });
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
    safety:    { med: "Женское внутреннее расслабление", scenario: "fear",     text: "Начните с практики расслабления или сценария работы со страхом в орбите." },
    worth:     { med: "Разговор с собой из будущего",    scenario: "power",    text: "Укрепите самоценность через контакт с собой в будущем или внутренний огонь." },
    receive:   { med: "Где я перекрыла себе получение",  scenario: "abundance", text: "Откройте способность получать — послушайте медитацию или попробуйте сценарий изобилия." },
    feminine:  { med: "Женская энергия",                  scenario: "feminine", text: "Вернитесь в свою женскую природу через медитацию или текучий сценарий на орбите." },
    trust:     { med: "Доверие к миру",                   scenario: "love",     text: "Развивайте доверие через практику или сценарий любви и наполненности." },
    authentic: { med: "Право быть настоящей",             scenario: "capital",  text: "Вернитесь к себе настоящей через медитацию или сценарий психологического капитала." },
  };
  const RECS_EN = {
    safety:    { med: "Feminine inner relaxation", scenario: "fear",      text: "Start with a relaxation practice or the fear scenario in the orbit." },
    worth:     { med: "Conversation with future self", scenario: "power", text: "Strengthen self-worth through contact with your future self or the inner fire." },
    receive:   { med: "Where I blocked my receiving", scenario: "abundance", text: "Open your ability to receive — listen to the meditation or try the abundance scenario." },
    feminine:  { med: "Feminine energy",            scenario: "feminine",  text: "Return to your feminine nature through meditation or a flowing orbit scenario." },
    trust:     { med: "Trust in the world",         scenario: "love",      text: "Build trust through practice or the love and fullness scenario." },
    authentic: { med: "The right to be real",       scenario: "capital",   text: "Return to your true self through meditation or the psychological capital scenario." },
  };
  const RECS = lang === "en" ? RECS_EN : RECS_RU;
  return { axis: lowestLocalized, ...RECS[lowest.id] };
}

export function resetPsycap() { localStorage.removeItem(KEY); }
