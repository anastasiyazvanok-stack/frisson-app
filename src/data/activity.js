// Activity tracking: streaks, daily practice, achievements
const KEY = "frisson_activity";

function today() { return new Date().toISOString().slice(0, 10); }

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || defaults(); }
  catch { return defaults(); }
}

function defaults() {
  return { streak: 0, lastDay: null, todayDone: false, totalMeds: 0, totalMinutes: 0, achievements: [], name: "" };
}

function save(data) { localStorage.setItem(KEY, JSON.stringify(data)); }

export function getActivity() {
  const d = load();
  const t = today();
  // Reset todayDone if day changed
  if (d.lastDay && d.lastDay !== t) {
    // Check if yesterday — streak continues. Otherwise streak breaks.
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (d.lastDay !== yesterday && d.todayDone) {
      // last activity was NOT yesterday — streak resets
      d.streak = 0;
    }
    d.todayDone = false;
    save(d);
  }
  return d;
}

export function markPractice(minutes = 0) {
  const d = load();
  const t = today();
  if (!d.todayDone) {
    // First practice today
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (d.lastDay === yesterday || d.lastDay === t) {
      d.streak += d.lastDay === t ? 0 : 1;
    } else {
      d.streak = 1;
    }
    d.todayDone = true;
    d.lastDay = t;
  }
  d.totalMeds += 1;
  d.totalMinutes += minutes;
  // Check achievements
  d.achievements = checkAchievements(d);
  save(d);
  return d;
}

export function setName(name) {
  const d = load();
  d.name = name;
  save(d);
  return d;
}

export function getName() { return load().name; }

const ACHIEVEMENTS = [
  { id: "first", label: { ru: "Первый шаг", en: "First step" }, desc: { ru: "Первая практика", en: "First practice" }, check: (d) => d.totalMeds >= 1 },
  { id: "streak3", label: { ru: "3 дня подряд", en: "3-day streak" }, desc: { ru: "Практика 3 дня подряд", en: "Practice 3 days in a row" }, check: (d) => d.streak >= 3 },
  { id: "streak7", label: { ru: "Неделя силы", en: "Week of strength" }, desc: { ru: "7 дней практики подряд", en: "7 days of practice in a row" }, check: (d) => d.streak >= 7 },
  { id: "streak14", label: { ru: "Две недели", en: "Two weeks" }, desc: { ru: "14 дней без перерыва", en: "14 days without a break" }, check: (d) => d.streak >= 14 },
  { id: "streak30", label: { ru: "Месяц роста", en: "Month of growth" }, desc: { ru: "30 дней подряд!", en: "30 days in a row!" }, check: (d) => d.streak >= 30 },
  { id: "med5", label: { ru: "5 практик", en: "5 practices" }, desc: { ru: "Завершено 5 практик", en: "Completed 5 practices" }, check: (d) => d.totalMeds >= 5 },
  { id: "med10", label: { ru: "10 практик", en: "10 practices" }, desc: { ru: "Завершено 10 практик", en: "Completed 10 practices" }, check: (d) => d.totalMeds >= 10 },
  { id: "med25", label: { ru: "25 практик", en: "25 practices" }, desc: { ru: "Завершено 25 практик", en: "Completed 25 practices" }, check: (d) => d.totalMeds >= 25 },
  { id: "med50", label: { ru: "Мастер практик", en: "Practice master" }, desc: { ru: "50 практик завершено", en: "50 practices completed" }, check: (d) => d.totalMeds >= 50 },
  { id: "min60", label: { ru: "Час тишины", en: "An hour of silence" }, desc: { ru: "60 минут медитации", en: "60 minutes of meditation" }, check: (d) => d.totalMinutes >= 60 },
  { id: "min300", label: { ru: "5 часов внутри", en: "5 hours inside" }, desc: { ru: "300 минут медитации", en: "300 minutes of meditation" }, check: (d) => d.totalMinutes >= 300 },
  { id: "min600", label: { ru: "10 часов пути", en: "10 hours on the path" }, desc: { ru: "600 минут медитации", en: "600 minutes of meditation" }, check: (d) => d.totalMinutes >= 600 },
];

function checkAchievements(d) {
  return ACHIEVEMENTS.filter((a) => a.check(d)).map((a) => a.id);
}

export function getAchievements(lang = "ru") {
  return ACHIEVEMENTS.map((a) => ({
    ...a,
    label: typeof a.label === "object" ? (a.label[lang] || a.label.ru) : a.label,
    desc: typeof a.desc === "object" ? (a.desc[lang] || a.desc.ru) : a.desc,
  }));
}

export { ACHIEVEMENTS };
