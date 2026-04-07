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
  { id: "first", label: "Первый шаг", desc: "Первая практика", check: (d) => d.totalMeds >= 1 },
  { id: "streak3", label: "3 дня подряд", desc: "Практика 3 дня подряд", check: (d) => d.streak >= 3 },
  { id: "streak7", label: "Неделя силы", desc: "7 дней практики подряд", check: (d) => d.streak >= 7 },
  { id: "streak14", label: "Две недели", desc: "14 дней без перерыва", check: (d) => d.streak >= 14 },
  { id: "streak30", label: "Месяц роста", desc: "30 дней подряд!", check: (d) => d.streak >= 30 },
  { id: "med5", label: "5 практик", desc: "Завершено 5 практик", check: (d) => d.totalMeds >= 5 },
  { id: "med10", label: "10 практик", desc: "Завершено 10 практик", check: (d) => d.totalMeds >= 10 },
  { id: "med25", label: "25 практик", desc: "Завершено 25 практик", check: (d) => d.totalMeds >= 25 },
  { id: "med50", label: "Мастер практик", desc: "50 практик завершено", check: (d) => d.totalMeds >= 50 },
  { id: "min60", label: "Час тишины", desc: "60 минут медитации", check: (d) => d.totalMinutes >= 60 },
  { id: "min300", label: "5 часов внутри", desc: "300 минут медитации", check: (d) => d.totalMinutes >= 300 },
  { id: "min600", label: "10 часов пути", desc: "600 минут медитации", check: (d) => d.totalMinutes >= 600 },
];

function checkAchievements(d) {
  return ACHIEVEMENTS.filter((a) => a.check(d)).map((a) => a.id);
}

export { ACHIEVEMENTS };
