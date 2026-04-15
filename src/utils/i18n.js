import { useEffect, useState } from "react";

const LANG_KEY = "frisson_lang";

export function getInitialLang() {
  const saved = localStorage.getItem(LANG_KEY);
  if (saved === "ru" || saved === "en") return saved;
  const nav = (typeof navigator !== "undefined" && navigator.language) || "";
  return nav.toLowerCase().startsWith("ru") ? "ru" : "en";
}

export function persistLang(lang) {
  localStorage.setItem(LANG_KEY, lang);
}

export function useLangState() {
  const [lang, setLangRaw] = useState(getInitialLang);
  const setLang = (l) => { persistLang(l); setLangRaw(l); };
  return [lang, setLang];
}

// pick(obj, lang) — obj shape: { ru: ..., en: ... } OR plain string (returns as-is).
export const pick = (obj, lang) => (obj && typeof obj === "object" && (obj.ru || obj.en)) ? (obj[lang] ?? obj.ru) : obj;

// Month short names used in charts / tests
export const MONTHS_SHORT = {
  ru: ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};

export const DAYS_SHORT = {
  ru: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
  en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
};

// Central UI string dictionary
export const STR = {
  // common
  cancel: { ru: "Отмена", en: "Cancel" },
  back: { ru: "Назад", en: "Back" },
  all: { ru: "Все →", en: "All →" },
  loading: { ru: "Загрузка...", en: "Loading..." },
  save: { ru: "Сохранить", en: "Save" },
  close: { ru: "Закрыть", en: "Close" },
  done: { ru: "Готово", en: "Done" },
  next: { ru: "Далее →", en: "Next →" },
  continue: { ru: "Продолжить →", en: "Continue →" },
  minShort: { ru: "мин", en: "min" },
  free: { ru: "Бесплатно", en: "Free" },
  locked: { ru: "Платно", en: "Premium" },

  // nav
  nav_home: { ru: "Главная", en: "Home" },
  nav_library: { ru: "Практики", en: "Practices" },
  nav_orbit: { ru: "Сценарии", en: "Scenarios" },
  nav_journal: { ru: "Дневник", en: "Journal" },
  nav_profile: { ru: "Профиль", en: "Profile" },

  // profile
  inner_world: { ru: "Внутренний мир", en: "Inner world" },
  path_begin: { ru: "✦ Начало пути", en: "✦ Beginning of the path" },
  activate_sub: { ru: "♛  Активировать подписку", en: "♛  Activate subscription" },
  measure_energy: { ru: "Замерьте свою психологическую энергию", en: "Measure your psychological energy" },
  test_meta: { ru: "7 вопросов · 3 минуты · Бесплатно", en: "7 questions · 3 minutes · Free" },
  take_test: { ru: "Пройти тест →", en: "Take the test →" },
  retake_test: { ru: "↻ Повторить тест", en: "↻ Retake the test" },
  psych_energy: { ru: "Психологическая энергия", en: "Psychological energy" },
  out_of_100: { ru: "из 100", en: "out of 100" },
  energy_chart: { ru: "График энергии", en: "Energy chart" },
  growth_dynamics: { ru: "Динамика роста", en: "Growth dynamics" },
  empty_chart_hint: { ru: "Пройдите тест — здесь появится ваш график", en: "Take the test — your chart will appear here" },
  practices: { ru: "Практики", en: "Practices" },
  weekly_activity: { ru: "Активность за неделю", en: "Weekly activity" },
  stat_meds: { ru: "Медитаций", en: "Meditations" },
  stat_minutes: { ru: "Минут", en: "Minutes" },
  stat_streak: { ru: "Дней подряд", en: "Day streak" },
  stat_gems: { ru: "Кристаллов", en: "Gems" },
  question_of: { ru: (i, n) => `Вопрос ${i} из ${n}`, en: (i, n) => `Question ${i} of ${n}` },
  see_result: { ru: "Посмотреть результат →", en: "See result →" },
  next_question: { ru: "Следующий вопрос →", en: "Next question →" },
  points_since_last: { ru: "с прошлого теста", en: "since last test" },
  points: { ru: "баллов", en: "points" },
  great_growth: { ru: "Отличный рост! Продолжайте практики.", en: "Great growth! Keep up your practice." },
  growing: { ru: "Энергия растёт. Вы на верном пути.", en: "Energy is rising. You're on the right path." },
  resource_dropped: { ru: "Ресурс снизился. Время для восполнения.", en: "Resource has dropped. Time to replenish." },
  slight_drop: { ru: "Небольшое снижение. Позаботьтесь о себе.", en: "A small drop. Take care of yourself." },
  stable_level: { ru: "Стабильный уровень. Хорошая основа.", en: "Stable level. A good foundation." },
  achievements: { ru: "Достижения", en: "Achievements" },
  of: { ru: "из", en: "of" },
  author_name: { ru: "Анастасия Званок", en: "Anastasia Zvanok" },
  author_role: { ru: "Автор · Психолог", en: "Author · Psychologist" },
  author_bio: {
    ru: "Магистр Клинической Психологии с европейским образованием. Помогаю женщинам выйти из внутреннего дефицита в ресурс, самоценность и наполненность.",
    en: "Master of Clinical Psychology with a European education. I help women move out of inner deficit into resource, self-worth, and fullness."
  },
  author_tag1: { ru: "Магистратура", en: "Master's degree" },
  author_tag2: { ru: "Европейский диплом", en: "European diploma" },
  author_tag3: { ru: "Женская психология", en: "Women's psychology" },
  oliver_quote: {
    ru: "«Скажи мне, что ты собираешься сделать со своей единственной дикой и драгоценной жизнью?»",
    en: "\u201CTell me, what is it you plan to do with your one wild and precious life?\u201D"
  },
  language: { ru: "Язык", en: "Language" },

  // home
  greet_morning: { ru: "Доброе утро", en: "Good morning" },
  greet_day: { ru: "Добрый день", en: "Good afternoon" },
  greet_evening: { ru: "Добрый вечер", en: "Good evening" },
  greet_night: { ru: "Доброй ночи", en: "Good night" },
  day: { ru: "день", en: "day" },
  day_streak: { ru: "дней подряд", en: "days in a row" },
  practice_done: { ru: "Практика сделана", en: "Practice done" },
  mark_practice: { ru: "Отметить практику", en: "Mark practice" },
  today: { ru: "сегодня", en: "today" },
  how_are_you: { ru: "Как ты сейчас?", en: "How do you feel?" },
  take_test_profile: { ru: "Пройдите тест в профиле", en: "Take the test in your profile" },
  states: { ru: "Состояния", en: "States" },
  what_worries: { ru: "Что меня беспокоит прямо сейчас?", en: "What's bothering me right now?" },
  situation_hint: { ru: "Выберите ситуацию — получите практики именно для вас", en: "Pick a situation — get practices tailored to you" },
  for_you_now: { ru: "Для тебя сейчас", en: "For you now" },
  premium: { ru: "Frisson Premium", en: "Frisson Premium" },
  premium_title: { ru: "Полная библиотека\nпрактик — открыта", en: "Full library of\npractices — unlocked" },
  per_month: { ru: "zł / мес", en: "zł / mo" },
  yearly_discount: { ru: "или 900 zł / год — выгода 50%", en: "or 900 zł / yr — save 50%" },
  open_access: { ru: "Открыть доступ", en: "Get access" },
  journal: { ru: "Дневник", en: "Journal" },
  no_entry_today: { ru: "Сегодня у вас нет записи", en: "No entry today" },
  card_sub_resource: { ru: "Ресурс", en: "Resource" },
  card_sub_feminine: { ru: "Женское", en: "Feminine" },
  card_sub_receiving: { ru: "Реализация", en: "Realization" },
  card_sub_newlevel: { ru: "Новый уровень", en: "New level" },
  card_title_fill: { ru: "Наполниться", en: "Replenish" },
  card_title_fem: { ru: "Женственность", en: "Femininity" },
  card_title_receive: { ru: "Получать", en: "Receive" },
  card_title_grow: { ru: "Расти", en: "Grow" },

  // app (name entry)
  ask_name: { ru: "✦ как вас зовут? ✦", en: "✦ what's your name? ✦" },
  your_name: { ru: "Ваше имя", en: "Your name" },
  enter: { ru: "Войти →", en: "Enter →" },

  // sub page
  sub_full_access: { ru: "✦ Полный доступ", en: "✦ Full access" },
  sub_tagline: { ru: "Откройте полную библиотеку практик — и начните жить из состояния, а не из усилия", en: "Unlock the full library of practices — and start living from state, not effort" },
  sub_save50: { ru: "Выгода 50%", en: "Save 50%" },
  sub_yearly: { ru: "Годовая подписка", en: "Annual subscription" },
  sub_per_year: { ru: "zł / год", en: "zł / yr" },
  sub_per_month_equiv: { ru: "= 75 zł в месяц", en: "= 75 zł per month" },
  sub_instead_of: { ru: "вместо 1800 zł при оплате помесячно", en: "instead of 1800 zł billed monthly" },
  sub_pick_yearly: { ru: "Выбрать годовой план →", en: "Choose annual plan →" },
  sub_monthly: { ru: "Месячная подписка", en: "Monthly subscription" },
  sub_per_month_full: { ru: "zł / месяц", en: "zł / month" },
  sub_start_at: { ru: "Начать за 150 zł →", en: "Start for 150 zł →" },
  sub_whats_included: { ru: "✦ Что входит", en: "✦ What's included" },
  sub_meds: { ru: "Медитации", en: "Meditations" },
  sub_meds_desc: { ru: "Вся библиотека практик + новые каждый месяц", en: "Full library of practices + new ones every month" },
  sub_projects: { ru: "Проекты", en: "Projects" },
  sub_projects_desc: { ru: "Тревога · Ревность в отношениях", en: "Anxiety · Jealousy in relationships" },
  sub_books: { ru: "Книги", en: "Books" },
  sub_books_desc: { ru: "4 книги по женской психологии", en: "4 books on women's psychology" },
  sub_journal: { ru: "Дневник", en: "Journal" },
  sub_journal_desc: { ru: "Безлимитные записи", en: "Unlimited entries" },
  sub_cancel_anytime: { ru: "Отменить подписку можно в любой момент.", en: "You can cancel your subscription at any time." },

  // situations
  sit_navigator: { ru: "Навигатор практик", en: "Practice navigator" },
  sit_title: { ru: "Что вас беспокоит\nпрямо сейчас?", en: "What's bothering you\nright now?" },
  sit_hint: { ru: "Нажмите на проблему — откроется практика", en: "Tap a problem to see the practice" },
  sit_open_lib: { ru: "Открыть полную библиотеку", en: "Open the full library" },
  sit_go_practice: { ru: "Перейти к практике →", en: "Go to practice →" },

  // library
  lib_back_to_nav: { ru: "Назад к навигатору", en: "Back to navigator" },
  lib_support_moment: { ru: "Поддержка в моменте", en: "Support in the moment" },
  lib_library: { ru: "Библиотека", en: "Library" },
  lib_meditation: { ru: "Медитация", en: "Meditation" },
  lib_subscription: { ru: "Подписка", en: "Subscription" },
  lib_open_with_sub: { ru: "Открыть по подписке →", en: "Unlock with subscription →" },
  lib_coming_soon: { ru: "Скоро в библиотеке", en: "Coming soon to the library" },
  lib_soon: { ru: "скоро", en: "soon" },
  lib_books: { ru: "Книги", en: "Books" },
  lib_book_free: { ru: "Книга · Бесплатно", en: "Book · Free" },
  lib_book_sub: { ru: "Книга · Подписка", en: "Book · Subscription" },
  lib_filter_all: { ru: "Все", en: "All" },
  lib_filter_resource: { ru: "Ресурс", en: "Resource" },
  lib_filter_feminine: { ru: "Женское", en: "Feminine" },
  lib_filter_receiving: { ru: "Реализация", en: "Realization" },
  lib_filter_growth: { ru: "Рост", en: "Growth" },
  lib_filter_self: { ru: "Самость", en: "Self" },

  // journal
  jr_journal: { ru: "Дневник", en: "Journal" },
  jr_tab_intent: { ru: "Намерения", en: "Intentions" },
  jr_tab_grat: { ru: "Благодарность", en: "Gratitude" },
  jr_tab_goals: { ru: "Цели ✦", en: "Goals ✦" },
  jr_tab_reflect: { ru: "Рефлексия", en: "Reflection" },
  jr_question: { ru: "✦ Вопрос дня", en: "✦ Question of the day" },
  jr_q_intent: { ru: "«Каким я хочу быть сегодня? Пишу в настоящем времени.»", en: "\u00ABWho do I want to be today? I write in the present tense.\u00BB" },
  jr_q_grat: { ru: "«За что ты благодарна сегодня — себе и миру?»", en: "\u00ABWhat are you grateful for today — to yourself and the world?\u00BB" },
  jr_q_goals: { ru: "«Что я создаю в своей жизни прямо сейчас?»", en: "\u00ABWhat am I creating in my life right now?\u00BB" },
  jr_q_reflect: { ru: "«Что происходило внутри меня после практики?»", en: "\u00ABWhat was happening inside me after the practice?\u00BB" },
  jr_intent_format: { ru: "✦ Формат намерения", en: "✦ Intention format" },
  jr_intent_hint_pre: { ru: "Пишите в настоящем времени: ", en: "Write in the present tense: " },
  jr_intent_hint_accent: { ru: "\"Я есть\", \"У меня уже есть\"", en: "\"I am\", \"I already have\"" },
  jr_intent_hint_post: { ru: ". Это фиксирует образ желаемого состояния.", en: ". This anchors the image of the desired state." },
  jr_intent_ph: { ru: "Я есть... / У меня уже есть... / Я наполненная...", en: "I am... / I already have... / I am full..." },
  jr_grat_ph: { ru: "Я благодарна себе за... / Я благодарна жизни за...", en: "I'm grateful to myself for... / I'm grateful to life for..." },
  jr_save: { ru: "Сохранить →", en: "Save →" },
  jr_add: { ru: "Добавить →", en: "Add →" },
  jr_goal_ph: { ru: "Новая цель...", en: "New goal..." },
  jr_before_goals: { ru: "✦ Перед тем как писать цели", en: "✦ Before writing goals" },
  jr_true_goals: { ru: "Мои истинные цели", en: "My true goals" },
  jr_goals_hint: { ru: "Послушайте эту практику перед тем, как ставить цели.", en: "Listen to this practice before setting goals." },
  jr_state_after: { ru: "Состояние после практики", en: "State after practice" },
  jr_insights: { ru: "✦ Инсайты, мысли, идеи", en: "✦ Insights, thoughts, ideas" },
  jr_reflect_ph: { ru: "Что я почувствовала во время практики? Какие образы, мысли, идеи пришли?", en: "What did I feel during the practice? What images, thoughts, ideas came up?" },
  jr_mood_empty: { ru: "Пусто", en: "Empty" },
  jr_mood_quiet: { ru: "Тихо", en: "Quiet" },
  jr_mood_full: { ru: "Полна", en: "Full" },
  jr_mood_power: { ru: "В силе", en: "In power" },

  // psycap tracker
  pc_header: { ru: "Психологический капитал", en: "Psychological capital" },
  pc_of_100: { ru: "из 100", en: "of 100" },
  pc_per_month: { ru: "за месяц", en: "this month" },
  pc_develop: { ru: "Развивают:", en: "Grow this:" },
  pc_last_activity: { ru: "Последняя активность", en: "Last activity" },
  pc_never: { ru: "ещё не было", en: "not yet" },
  pc_recommended: { ru: "Сейчас рекомендуется →", en: "Recommended now →" },
  pc_to_library: { ru: "В библиотеку", en: "To library" },
  pc_to_orbit: { ru: "На орбиту", en: "To orbit" },
  pc_week: { ru: "Неделя", en: "Week" },
  pc_month: { ru: "Месяц", en: "Month" },
  pc_all_time: { ru: "Всё время", en: "All time" },
  pc_no_data: { ru: "Ещё нет данных", en: "No data yet" },
  pc_chart_hint: { ru: "Точки на графике — это события. Нажмите, чтобы увидеть, что произошло.", en: "Dots on the chart are events. Tap to see what happened." },
  pc_feed_empty: { ru: "История практик появится здесь после первой активности", en: "Your practice history will appear here after your first activity" },
  pc_weekly_checkin: { ru: "Еженедельный чекин", en: "Weekly check-in" },
  pc_how_now: { ru: "Как вы сейчас?", en: "How are you now?" },
  pc_30sec: { ru: "30 секунд на 4 шкалы", en: "30 seconds, 4 scales" },
  pc_later: { ru: "Позже", en: "Later" },
  pc_checkin_cta: { ru: "Чекин →", en: "Check-in →" },
  pc_overview: { ru: "Обзор", en: "Overview" },
  pc_growth: { ru: "Рост", en: "Growth" },
  pc_feed: { ru: "Лента", en: "Feed" },

  // orbit
  orb_title: { ru: "Орбита Психики", en: "Psyche Orbit" },
  orb_gems_received: { ru: "кристаллов получено", en: "gems received" },
  orb_time_medit: { ru: "Время медитации", en: "Meditation time" },
  orb_watch_listen: { ru: "Смотрите на орбиту и слушайте звук", en: "Watch the orbit and listen to the sound" },
  orb_3min: { ru: "3 минуты", en: "3 minutes" },
  orb_5min: { ru: "5 минут", en: "5 minutes" },
  orb_10min: { ru: "10 минут", en: "10 minutes" },
  orb_15min: { ru: "15 минут", en: "15 minutes" },
  orb_neutral: { ru: "Нейтрально", en: "Neutral" },
  orb_pause: { ru: "❚❚ Пауза", en: "❚❚ Pause" },
  orb_resume: { ru: "▶ Продолжить", en: "▶ Resume" },
  orb_stop: { ru: "■ Стоп", en: "■ Stop" },
  orb_stop_short: { ru: "Стоп", en: "Stop" },
  orb_breath_in: { ru: "вдох ↑", en: "inhale ↑" },
  orb_breath_hold: { ru: "задержка ◦", en: "hold ◦" },
  orb_breath_out: { ru: "выдох ↓", en: "exhale ↓" },
  orb_intro_title: { ru: "Это ваш внутренний мир", en: "This is your inner world" },
  orb_intro_body: { ru: "Каждая точка — это нейрон.<br/>Каждая линия — это связь между мыслями, чувствами и паттернами, которые создают ваше внутреннее состояние.", en: "Each dot is a neuron.<br/>Each line is a connection between thoughts, feelings, and patterns that create your inner state." },
  orb_intro_layers: { ru: "6 слоёв психики", en: "6 layers of the psyche" },
  orb_intro_layers_body: { ru: "От <b>Бессознательного</b> в центре до <b>Поведения</b> снаружи. Нажмите точки слева, чтобы переключаться между уровнями.", en: "From the <b>Unconscious</b> at the center to <b>Behavior</b> on the outside. Tap the dots on the left to switch between levels." },
  orb_intro_scenarios: { ru: "9 сценариев", en: "9 scenarios" },
  orb_intro_scenarios_body: { ru: "Выберите своё состояние: тревога, любовь, сила, страх... Нейроны начнут двигаться как в этом состоянии. Это визуализация того, что происходит внутри.", en: "Pick your state: anxiety, love, power, fear... The neurons will move as in that state. This is a visualization of what happens inside." },
  orb_intro_medit: { ru: "Медитация", en: "Meditation" },
  orb_intro_medit_body: { ru: "Нажмите ♫ и выберите время. Начнёт играть музыка, а орбита начнёт плавно меняться — как меняется психика, когда вы дышите и отпускаете.", en: "Tap ♫ and pick a duration. Music will play and the orbit will shift gently — as your psyche shifts when you breathe and let go." },
  orb_start: { ru: "Начать →", en: "Start →" },
  orb_skip: { ru: "Пропустить", en: "Skip" },
  orb_scenario: { ru: "сценарий", en: "scenario" },
  orb_level: { ru: "Уровень", en: "Level" },
  orb_scenario_of: { ru: "Сценарий", en: "Scenario" },

  // themes / energy levels
  mood_empty: { ru: "Пустота", en: "Emptiness" },
  mood_quiet: { ru: "Тишина", en: "Quiet" },
  mood_full: { ru: "Наполненность", en: "Fullness" },
  mood_power: { ru: "Сила", en: "Power" },
  energy_exhausted: { ru: "Истощение", en: "Exhaustion" },
  energy_low: { ru: "Низкая энергия", en: "Low energy" },
  energy_moderate: { ru: "Умеренная", en: "Moderate" },
  energy_good: { ru: "Хорошая", en: "Good" },
  energy_high: { ru: "Высокая", en: "High" },
};

export const t = (lang, key, ...args) => {
  const entry = STR[key];
  if (!entry) return key;
  const v = entry[lang] ?? entry.ru;
  return typeof v === "function" ? v(...args) : v;
};
