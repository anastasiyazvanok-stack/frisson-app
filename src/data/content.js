export const TEST_QUESTIONS = [
  {
    q: "Как ощущалось ваше тело сегодня?",
    o: [
      "Тяжёлым и без сил",
      "Напряжённым и уставшим",
      "Обычно — ни хорошо, ни плохо",
      "Лёгким и бодрым",
      "Наполненным и сильным",
    ],
  },
  {
    q: "Каким было ваше настроение сегодня?",
    o: [
      "Подавленным или тревожным",
      "Усталым и серым",
      "Ровным, без особых эмоций",
      "В целом светлым и спокойным",
      "Радостным и наполненным",
    ],
  },
  {
    q: "Сегодня вы жили или просто выполняли задачи?",
    o: [
      "Только выполняла задачи, как робот",
      "Действовала механически, без ощущений",
      "Было и то и другое",
      "Чаще чувствовала жизнь, чем функционировала",
      "Жила — ощущала себя собой",
    ],
  },
  {
    q: "Хватало ли вам сегодня внутренних сил?",
    o: [
      "Нет, сил не было совсем — ощущала пустоту",
      "Едва хватало на самое необходимое",
      "Хватало на основное, но не на всё",
      "В целом хватало",
      "Да, чувствовала себя наполненной и сильной",
    ],
  },
  {
    q: "Как вы справлялись с трудностями и напряжением?",
    o: [
      "Не справлялась, всё казалось непосильным",
      "Очень тяжело, едва держалась",
      "Справлялась, но с усилием",
      "В целом справлялась",
      "Легко, с опорой на себя",
    ],
  },
  {
    q: "Чувствовали ли вы сегодня свою ценность?",
    o: [
      "Совсем нет",
      "Скорее нет",
      "Иногда",
      "Чаще да",
      "Да, безусловно",
    ],
  },
  {
    q: "Была ли в вас сегодня лёгкость, радость, ощущение жизни?",
    o: [
      "Совсем не было, внутри ощущалась пустота",
      "Почти нет",
      "В отдельные моменты",
      "Было довольно часто",
      "Да, ощущалось на протяжении всего дня",
    ],
  },
];

const TEST_QUESTIONS_EN = [
  {
    q: "How did your body feel today?",
    o: ["Heavy and drained", "Tense and tired", "Normal — neither good nor bad", "Light and refreshed", "Full and strong"],
  },
  {
    q: "What was your mood today?",
    o: ["Depressed or anxious", "Tired and grey", "Even, no strong emotions", "Generally bright and calm", "Joyful and full"],
  },
  {
    q: "Today did you live or just get through tasks?",
    o: ["Only completing tasks, like a robot", "Acting mechanically, without feeling", "Both — it varied", "More often felt alive than just functioning", "Truly alive — felt like myself"],
  },
  {
    q: "Did you have enough inner strength today?",
    o: ["No — none at all, felt empty", "Barely enough for essentials", "Enough for the basics, not for everything", "Generally enough", "Yes — felt full and strong"],
  },
  {
    q: "How did you cope with difficulties and tension?",
    o: ["Couldn't cope — everything felt overwhelming", "Very hard, barely holding on", "Managed, but with effort", "Managed overall", "Easily, with inner support"],
  },
  {
    q: "Did you feel your own worth today?",
    o: ["Not at all", "Mostly no", "Sometimes", "Mostly yes", "Yes, unconditionally"],
  },
  {
    q: "Was there lightness, joy, a sense of life in you today?",
    o: ["None at all — felt empty inside", "Almost none", "In certain moments", "Quite often", "Yes, throughout the whole day"],
  },
];

export function getTestQuestions(lang = "ru") { return lang === "en" ? TEST_QUESTIONS_EN : TEST_QUESTIONS; }

// Section titles (EN translations)
const SECTION_TITLES_EN = {
  resource: "Resource & recovery",
  feminine: "Feminine state",
  receiving: "Realization & receiving",
  newlevel: "New level",
  self: "Authenticity & self-worth",
};

// Subtitle tokens seen in RECOMMENDATIONS.s (format: "N мин · Group")
const REC_GROUP_EN = {
  "Ресурс": "Resource",
  "Реализация": "Realization",
  "Женское": "Feminine",
  "Новый уровень": "New level",
  "Бесплатно": "Free",
};
function translateRecS(s) {
  let out = s.replace(" мин", " min");
  for (const [ru, en] of Object.entries(REC_GROUP_EN)) out = out.replace(ru, en);
  return out;
}

// EN meditation content keyed by meditation number
const MEDS_EN = {
  1: { title: "Return to fullness", dur: "20 min", short: "Replenishing the inner void and love deficit.", long: "This practice helps restore what you've been missing for a long time: warmth, support, love, a sense of fullness and safety. Good if you often live from inner hunger, cling painfully to people, or feel empty inside." },
  2: { title: "Replenish your energy", dur: "15 min", short: "Restoring strength after overload and fatigue.", long: "This practice is for when you're simply exhausted. When strength is low, everything feels hard, the body is sluggish, the head overloaded. It helps restore mental and bodily energy and bring back inner engagement." },
  3: { title: "Feminine inner relaxation", dur: "12 min", short: "Releasing bodily and mental tension.", long: "For those used to living in tension: being composed, in control, always inwardly ready. Even rest in such a state doesn't bring real relaxation. The practice helps lower the inner armor and return to softness." },
  4: { title: "I manage my own life", dur: "14 min", short: "Returning to an adult position of running your life.", long: "The practice returns you to the center of your own life. Suitable if everything depends too much on the external: on others' moods, circumstances, anxiety, chaos. It helps you feel again: I can choose, decide, direct and create." },
  5: { title: "Feminine energy", dur: "20 min", short: "Returning to softness, sensuality, and a living state.", long: "Returns a woman to her natural state: softness, fluidity, beauty, feeling life, enjoying yourself and the world. Not about image or role — about an inner state in which a woman stops being just a function." },
  6: { title: "Return to feminine self", dur: "28 min", short: "Returning to your feminine individuality.", long: "About returning to yourself as a woman. To your uniqueness, inner taste, your desires, your beauty. Suitable if you feel you've adapted too much, become convenient, gone into function — and lost your own feminine individuality." },
  7: { title: "A state of feminine attraction", dur: "11 min", short: "An inner state of attractiveness.", long: "Forms not an external picture but inner attractiveness. The state when a woman has a taste for herself, for life, for the moment. When she doesn't ask for glances but starts to naturally draw them." },
  8: { title: "Feminine happiness is the norm", dur: "22 min", short: "Rewiring the norm: living well is safe.", long: "Needed if inside there's a habit of living as if happiness is rare. Changes the inner baseline itself: from expecting hardship to permission to live well. A meditation not for inspiration, but for a new norm of life." },
  10: { title: "Receiving goods from the world", dur: "19 min", short: "Opening the ability to accept good things.", long: "If the previous practice helps you see where you closed — this helps you begin to open. Brings the woman into a state where the good stops being foreign or awkward." },
  11: { title: "Trust in the world", dur: "13 min", short: "Lowering basic wariness toward life.", long: "Works with the deep sense that the world is unsafe. When life is experienced as a place where you must always be on guard, control everything and wait for a catch. The meditation helps restore basic trust in life." },
  13: { title: "Gratitude and a new level", dur: "19 min", short: "Completing the old stage and opening a new life.", long: "Helps not just thank the past, but truly release the old stage as the primary reality. Creates inner space for a new level of life." },
  14: { title: "New level", dur: "18 min", short: "Adjusting the psyche to more love and money.", long: "Helps get used to more. Not just wanting more, but truly being able to hold it. Because often a woman wants a new level but inwardly gets scared and rolls back." },
  15: { title: "Conversation with future self", dur: "19 min", short: "Contact with a future version of yourself.", long: "Helps feel the inner connection with the self who has already become more mature, calmer, clearer, and who has entered a new reality. Gives direction and helps make decisions from the future identity." },
  16: { title: "Faith as a bridge", dur: "18 min", short: "Support in the transition period.", long: "Needed for the in-between moment. When you've already left the past but don't yet see results. When you want to quit everything. The meditation helps hold that point and not betray yourself on the way." },
  17: { title: "The right to be real", dur: "23 min", short: "Returning to yourself without playing or adapting.", long: "Helps stop living in someone else's image and return to your living self. Realness changes who you begin to attract. When you stop being not-yourself, more of your people and your response appear in life." },
  24: { title: "Replenishing feminine resource", dur: "14 min", short: "Deep restoration of feminine resource and return to your source.", long: "This practice replenishes feminine resource at a deep level — not through effort and action, but through allowing yourself to receive. Right for when you feel you give more than you receive, when your feminine essence has nearly run dry, and you need to return to your own source." },
  25: { title: "My rhythm, my format, my life", dur: "14 min", short: "Finding your own way of living through contact with yourself.", long: "A practice about finding your own rhythm and format for life — not through others' rules or expectations, but through genuine contact with yourself. When you feel your way into how you truly want to move through life, anxiety fades, inner boundaries strengthen, and life stops feeling like something you need to measure up to." },
};

export function getSections(lang = "ru") {
  if (lang !== "en") return SECTIONS;
  return SECTIONS.map((s) => ({
    ...s,
    title: SECTION_TITLES_EN[s.id] || s.title,
    meds: s.meds.map((m) => ({ ...m, ...(MEDS_EN[m.n] || {}) })),
  }));
}

const COMING_SOON_EN = [
  { n: 18, title: "The Girl archetype", short: "Lightness, spontaneity, authentic desires" },
  { n: 19, title: "Muse and Lover archetype", short: "Sensuality, attraction, feminine magic" },
  { n: 20, title: "Mistress of her life archetype", short: "Full authorship — from strength, not control" },
  { n: 21, title: "Self-value", short: "Inner value without others' approval" },
  { n: 22, title: "Inner support", short: "Inner foundation in moments of anxiety" },
  { n: 23, title: "Magnetism — I am the source", short: "Stop chasing — start attracting" },
];
export function getComingSoon(lang = "ru") { return lang === "en" ? COMING_SOON_EN : COMING_SOON; }

const BOOKS_EN = [
  { id: "b1", title: "Psychological capital — what is it?", free: true, desc: "What a woman's capital consists of and why it defines quality of life." },
  { id: "b2", title: "How state affects our whole life", free: true, desc: "Why one event destroys one woman and inspires another." },
  { id: "b3", title: "Women's sexuality", free: false, desc: "Feminine sexuality as part of psychological health." },
  { id: "b4", title: "True femininity", free: false, desc: "Being real — not in a role, not in an image, but from within." },
];
export function getBooks(lang = "ru") { return lang === "en" ? BOOKS_EN : BOOKS; }

export function getRecommendations(lang = "ru") {
  if (lang !== "en") return RECOMMENDATIONS;
  const out = {};
  for (const [k, arr] of Object.entries(RECOMMENDATIONS)) {
    out[k] = arr.map((r) => ({ ...r, s: translateRecS(r.s) }));
  }
  return out;
}

const MOOD_MESSAGES_EN = {
  empty: [
    "I allow myself to be empty so I can truly be filled.",
    "Something new is born in emptiness.",
    "I'm not broken. I'm on pause.",
    "Emptiness is not the end. It's the space before a beginning.",
    "Right now I don't need to hold anything.",
    "I let go. I simply let go.",
    "Today I'm in no rush.",
    "I allow myself not to know what's next.",
    "A pause is movement too. Inward.",
    "I'm allowed to be quiet and transparent.",
  ],
  quiet: [
    "I hear myself. That's enough.",
    "In silence I find what noise hid for years.",
    "I choose silence because I know my worth.",
    "I return to myself.",
    "In silence I am real.",
    "I don't need to be rushed.",
    "I give myself time to hear my heart.",
    "Silence is also strength.",
    "I'm not running from myself. I sit beside her.",
    "My softness isn't weakness. It's presence.",
  ],
  full: [
    "The world is open to me.",
    "When I'm full, everything comes on its own.",
    "I don't seek. I attract.",
    "Today I am the source.",
    "I am a vessel allowed to be full.",
    "I want to live. Greedily and beautifully.",
    "Today I choose myself. Again.",
    "There is much of me. And that's beautiful.",
    "I'm so much my own that I attract my people.",
    "There is a fire inside me that doesn't go out.",
    "My beauty isn't in the mirror. It's in how I enter a room.",
    "I don't try to be beautiful. I am.",
    "I'm seen. And I like it.",
    "I'm the one they think about after the meeting.",
    "My body is a work of art.",
    "I don't attract with looks. I attract with who I am.",
    "There is something in me that can't be explained. And doesn't need to be.",
    "I am beautiful in motion, in silence, in laughter, in desire.",
  ],
  power: [
    "I don't prove. I simply am.",
    "I choose. I create. I go.",
    "Today I manage my own life.",
    "I don't ask. I choose.",
    "I know my worth. And it's growing.",
    "I don't compete. I simply am myself, and everything works out.",
    "I go where everything is allowed to me.",
    "I am enough. I am worthy. Everything is allowed to me.",
    "I'm not for everyone. I'm for those who know how to value.",
    "My attractiveness is born from within.",
    "I'm the woman they remember.",
    "The more I'm on my own side, the more beautiful I am.",
    "I don't adorn myself for the world. I adorn myself for me.",
    "There is a fire in me that makes me irresistible.",
    "I'm magnetic. Simply because I'm alive.",
    "Everything I want wants me even more.",
  ],
};

export function getMoodMessages(lang = "ru") { return lang === "en" ? MOOD_MESSAGES_EN : MOOD_MESSAGES; }

const PERSONAL_CONTENT_EN = {
  "I want to understand myself and my desires better": {
    v: "This is one of the deepest needs — to know what you truly want. Not what you should. Not what's expected. But what is yours, alive, real. And you're already on the way — because you asked this question.",
    s: "Through practice you'll start to hear yourself through the noise of others' expectations. Desires will stop being scary — and become your inner compass.",
    a: "I see tremendous courage in this request. Most women live a whole life without once stopping to ask themselves — what do I want?",
    p: ["I manage my own life", "Conversation with future self", "The right to be real"],
  },
  "I want to restore energy and resource": {
    v: "When your resource is at zero — it's not weakness or laziness. It's an honest signal from body and psyche: I need care. You came to the right place — and that's already a choice in your own direction.",
    s: "Through practice you'll learn to fill yourself from within, not only through external sources. Energy will become your foundation — steady and renewable.",
    a: "Resource does recover. Not instantly — but each practice does its work on the nervous system. I've seen it hundreds of times.",
    p: ["Feminine inner relaxation", "Replenish your energy", "Return to fullness"],
  },
  "I want to feel my value": {
    v: "The feeling of having to earn your place is one of the most painful. You're not alone in it. And it is not the truth about you — it's a learned pattern that can be changed.",
    s: "Through practice your value will stop depending on someone else's gaze, approval or behavior. You'll start to receive good things without guilt or fear of losing them.",
    a: "Behind this request there is always a woman who gave very much and received little in return. I created these practices for her — for you.",
    p: ["I manage my own life", "Return to fullness", "The right to be real"],
  },
  "I want to reveal my femininity and attraction": {
    v: "Connection with the feminine isn't about looks or a role. It's about how you feel from within. Softness, sensuality, enjoying yourself — this is your nature, and this connection can be restored.",
    s: "Through practice you'll feel your attraction — not because you're trying, but because you're returning to your true self. It's a completely different feeling.",
    a: "Femininity is not a mask or a technique. It's an inner state. I've guided hundreds of women through this return — and each time it was like an exhale after a long-held breath.",
    p: ["Feminine energy", "Return to feminine self", "A state of feminine attraction"],
  },
};

export function getPersonalContent(lang = "ru") { return lang === "en" ? PERSONAL_CONTENT_EN : PERSONAL_CONTENT; }

export const SECTIONS = [
  {
    id: "resource", title: "Ресурс и восстановление", color: "#F08838", meds: [
      { n: 1, title: "Возвращение к наполненности", dur: "20 мин", free: false, short: "Восполнение внутренней пустоты и дефицита любви.", long: "Эта практика помогает восстановить то, чего долго не хватало: тепла, поддержки, любви, ощущения наполненности и безопасности. Подойдёт если вы часто живёте из внутреннего голода, болезненно цепляетесь за людей или чувствуете, что внутри как будто пусто." },
      { n: 2, title: "Восполниться энергией", dur: "15 мин", free: false, short: "Возвращение сил после перегрузки и усталости.", long: "Практика нужна когда вы просто истощены. Когда сил мало, всё даётся тяжело, тело вяло, голова перегружена. Помогает восстановить психическую и телесную энергию и вернуть внутреннюю включённость." },
      { n: 3, title: "Женское внутреннее расслабление", dur: "12 мин", free: true, short: "Снятие телесного и психического напряжения.", long: "Для тех, кто привык жить в напряжении: быть собранной, контролирующей, всё время внутренне готовой. Даже отдых в таком состоянии не даёт настоящего расслабления. Практика помогает опустить внутреннюю броню и вернуться в мягкость." },
      { n: 4, title: "Я управляю своей жизнью", dur: "14 мин", free: false, short: "Возвращение во взрослую позицию управления жизнью.", long: "Практика возвращает вас в центр своей жизни. Подойдёт если всё слишком зависит от внешнего: от настроения других, обстоятельств, тревоги, хаоса. Помогает снова почувствовать: я могу выбирать, решать, направлять и создавать." },
    ]
  },
  {
    id: "feminine", title: "Женское состояние", color: "#E64DA8", meds: [
      { n: 5, title: "Женская энергия", dur: "20 мин", free: false, short: "Возвращение в мягкость, чувственность и живое состояние.", long: "Возвращает женщину в её естественное состояние: мягкость, текучесть, красоту, чувствование жизни, удовольствие от себя и мира. Не про образ и не про роль — про внутреннее состояние, в котором женщина перестаёт быть только функцией." },
      { n: 6, title: "Возвращение к себе женственной", dur: "28 мин", free: false, short: "Возвращение к своей женской индивидуальности.", long: "Про возвращение к себе как к женщине. К своей уникальности, внутреннему вкусу, своим желаниям, своей красоте. Подойдёт если вы чувствуете что слишком подстроились, стали удобной, ушли в функцию — и потеряли собственную женскую индивидуальность." },
      { n: 7, title: "Состояние женской притягательности", dur: "11 мин", free: false, short: "Внутреннее состояние притягательности.", long: "Формирует не внешнюю картинку, а внутреннюю притягательность. То состояние, когда в женщине есть вкус к себе, к жизни, к моменту. Когда она не просит взглядов на себя, а начинает естественно их притягивать." },
      { n: 24, title: "Восполнение женской ресурсности", dur: "14 мин", free: false, short: "Глубокое восполнение женского ресурса и возвращение к своему источнику.", long: "Практика восполняет женский ресурс на глубоком уровне — не через действия и усилия, а через разрешение себе наполняться. Подойдёт когда вы чувствуете, что отдаёте больше, чем получаете, когда женского в вас почти не осталось, и нужно вернуться к своему источнику." },
    ]
  },
  {
    id: "receiving", title: "Реализация и получение благ", color: "#FFAF32", meds: [
      { n: 10, title: "Получение благ от мира", dur: "19 мин", free: false, short: "Открытие способности принимать хорошее.", long: "Если предыдущая практика помогает увидеть где вы закрылись — эта помогает начать открываться. Переводит женщину в состояние, где хорошее перестаёт быть чем-то чужим или неудобным." },
      { n: 11, title: "Доверие к миру", dur: "13 мин", free: false, short: "Снижение базовой настороженности к жизни.", long: "Работает с глубоким ощущением небезопасности мира. Когда жизнь переживается как место где нужно всегда быть настороже, всё контролировать и ждать подвоха. Медитация помогает вернуть базовое доверие жизни." },
    ]
  },
  {
    id: "newlevel", title: "Новый уровень", color: "#9F7BD8", meds: [
      { n: 13, title: "Благодарность и новый уровень", dur: "19 мин", free: false, short: "Завершение старого этапа и открытие новой жизни.", long: "Помогает не просто поблагодарить прошлое, а действительно отпустить старый этап как основную реальность. Создаёт внутреннее пространство для нового уровня жизни." },
      { n: 14, title: "Новый уровень", dur: "18 мин", free: false, short: "Адаптация психики к большей любви и деньгам.", long: "Помогает привыкнуть к большему. Не просто захотеть большего, а действительно начать его выдерживать. Потому что часто женщина хочет нового уровня, но внутренне его пугается и откатывается назад." },
      { n: 15, title: "Разговор с собой из будущего", dur: "19 мин", free: false, short: "Контакт с будущей версией себя.", long: "Помогает почувствовать внутреннюю связь с той собой, которая уже стала взрослее, спокойнее, яснее и пришла в новую реальность. Даёт направление и помогает принимать решения из будущей идентичности." },
      { n: 16, title: "Вера — мост между реальностями", dur: "18 мин", free: false, short: "Поддержка в переходном периоде.", long: "Нужна для момента между. Когда вы уже вышли из прошлого, но ещё не видите результатов. Когда хочется всё бросить. Медитация помогает выдержать эту точку и не предать себя на пути." },
    ]
  },
  {
    id: "self", title: "Подлинность и самоценность", color: "#D080B0", meds: [
      { n: 17, title: "Право быть настоящей", dur: "23 мин", free: false, short: "Возвращение к себе без игры и подстройки.", long: "Помогает перестать жить в чужом образе и вернуться к себе живой. Настоящесть меняет и то, кого вы начинаете притягивать. Когда вы перестаёте быть не собой, в вашей жизни появляется больше своих людей и своего отклика." },
      { n: 25, title: "Мой ритм, мой формат, моя жизнь", dur: "14 мин", free: false, short: "Нахождение своего способа жить через контакт с собой.", long: "Практика о том, как найти свой ритм и формат жизни — не через чужие правила и ожидания, а через настоящий контакт с собой. Когда вы нащупываете, как именно вам подходит двигаться по жизни, уходит тревога и переживания, укрепляются внутренние границы, и жизнь перестаёт ощущаться как что-то, чему нужно соответствовать." },
    ]
  },
];

export const COMING_SOON = [
  { n: 18, title: "Архетип Девочки", short: "Лёгкость, спонтанность, подлинные желания" },
  { n: 19, title: "Архетип Музы и Любовницы", short: "Чувственность, притяжение, женская магия" },
  { n: 20, title: "Архетип Хозяйки своей жизни", short: "Полное авторство — из силы, не контроля" },
  { n: 21, title: "Ценность себя", short: "Внутренняя ценность без чужого одобрения" },
  { n: 22, title: "Опора внутри", short: "Внутренний фундамент в моменты тревоги" },
  { n: 23, title: "Магнетизм — я источник", short: "Перестать добиваться — начать притягивать" },
];

export const BOOKS = [
  { id: "b1", title: "Психологический капитал — что это?", free: true, desc: "Из чего состоит капитал женщины и почему он определяет качество жизни." },
  { id: "b2", title: "Как состояние влияет на всю нашу жизнь", free: true, desc: "Почему одно событие разрушает одну и вдохновляет другую." },
  { id: "b3", title: "Сексуальность женщины", free: false, desc: "Женская сексуальность как часть психологического здоровья." },
  { id: "b4", title: "Настоящая женственность", free: false, desc: "Быть настоящей — не в роли, не в образе, а изнутри." },
];

export const SITUATIONS = [
  { title: "Сложности в отношениях", desc: "Чувствую дистанцию, теряю себя", recs: ["Возвращение к себе женственной", "Состояние женской притягательности", "Женская энергия"] },
  { title: "Боюсь потерять его", desc: "Тревога, ревность, держусь из страха", recs: ["Возвращение к наполненности", "Я управляю своей жизнью", "Доверие к миру"] },
  { title: "Постоянное напряжение", desc: "Тело зажато, голова не выключается", recs: ["Женское внутреннее расслабление", "Доверие к миру", "Восполниться энергией"] },
  { title: "Страшно за будущее", desc: "Тревога, невозможно довериться жизни", recs: ["Доверие к миру", "Вера — мост между реальностями", "Женское внутреннее расслабление"] },
  { title: "Что-то не получается", desc: "Блок, застревание, топчусь на месте", recs: ["Я управляю своей жизнью", "Доверие к миру", "Новый уровень"] },
  { title: "Чувствую обиду", desc: "Накопленная боль, сложно отпустить", recs: ["Возвращение к наполненности", "Право быть настоящей", "Женское внутреннее расслабление"] },
  { title: "Деньги идут с трудом", desc: "Нет роста, жизнь будто скупится", recs: ["Получение благ от мира", "Доверие к миру", "Новый уровень"] },
  { title: "Не чувствую себя женщиной", desc: "Потеряна связь с женственностью", recs: ["Женская энергия", "Возвращение к себе женственной", "Состояние женской притягательности"] },
  { title: "Пустота и усталость", desc: "Ресурс на нуле, нет радости", recs: ["Женское внутреннее расслабление", "Возвращение к наполненности", "Восполниться энергией"] },
  { title: "Не знаю чего хочу", desc: "Потеряны желания, живу по инерции", recs: ["Право быть настоящей", "Разговор с собой из будущего", "Я управляю своей жизнью"] },
  { title: "Боюсь быть собой", desc: "Надеваю маски, страшно показать себя", recs: ["Право быть настоящей", "Возвращение к наполненности", "Женская энергия"] },
  { title: "Ощущаю себя недостойной", desc: "Сложно принимать хорошее", recs: ["Возвращение к наполненности", "Получение благ от мира", "Право быть настоящей"] },
];

export const RECOMMENDATIONS = {
  empty: [
    { t: "Возвращение к наполненности", s: "14 мин · Ресурс", free: false, sec: "resource" },
    { t: "Восполниться энергией", s: "15 мин · Ресурс", free: false, sec: "resource" },
    { t: "Женское внутреннее расслабление", s: "12 мин · Бесплатно", free: true, sec: "resource" },
  ],
  quiet: [
    { t: "Доверие к миру", s: "13 мин · Реализация", free: false, sec: "receiving" },
    { t: "Женское внутреннее расслабление", s: "12 мин · Бесплатно", free: true, sec: "resource" },
    { t: "Возвращение к себе женственной", s: "28 мин · Женское", free: false, sec: "feminine" },
  ],
  full: [
    { t: "Разговор с собой из будущего", s: "19 мин · Новый уровень", free: false, sec: "newlevel" },
    { t: "Состояние женской притягательности", s: "11 мин · Женское", free: false, sec: "feminine" },
    { t: "Получение благ от мира", s: "19 мин · Реализация", free: false, sec: "receiving" },
  ],
  power: [
    { t: "Новый уровень", s: "18 мин · Новый уровень", free: false, sec: "newlevel" },
    { t: "Я управляю своей жизнью", s: "14 мин · Ресурс", free: false, sec: "resource" },
    { t: "Состояние женской притягательности", s: "11 мин · Женское", free: false, sec: "feminine" },
  ],
};

export const PERSONAL_CONTENT = {
  "Хочу лучше понять себя и свои желания": {
    v: "Это одна из самых глубоких потребностей — знать, чего ты хочешь на самом деле. Не то, что должна. Не то, что ожидают. А своё, живое, настоящее. И ты уже на пути — потому что задала этот вопрос.",
    s: "Через практики ты начнёшь слышать себя сквозь шум чужих ожиданий. Желания перестанут пугать — и станут твоим внутренним компасом.",
    a: "Я вижу в этом запросе огромную смелость. Большинство женщин проживают целую жизнь, так и не остановившись, чтобы спросить себя — а чего хочу я?",
    p: ["Я управляю своей жизнью", "Разговор с собой из будущего", "Право быть настоящей"],
  },
  "Хочу восстановить энергию и ресурс": {
    v: "Когда ресурс на нуле — это не слабость и не лень. Это честный сигнал тела и психики: мне нужна забота. Ты пришла в нужное место — и уже это выбор в свою сторону.",
    s: "Через практики ты научишься наполняться изнутри, а не только через внешние источники. Энергия станет твоей основой — устойчивой и восстанавливаемой.",
    a: "Ресурс восстанавливается. Не сразу — но каждая практика делает своё дело на уровне нервной системы. Я видела это сотни раз.",
    p: ["Женское внутреннее расслабление", "Восполниться энергией", "Возвращение к наполненности"],
  },
  "Хочу почувствовать свою ценность": {
    v: "Ощущение что нужно заслужить своё место — одно из самых болезненных. Ты не одна с этим. И это не правда о тебе — это усвоенный паттерн, который можно изменить.",
    s: "Через практики твоя ценность перестанет зависеть от чужого взгляда, одобрения или поведения. Ты начнёшь принимать хорошее без вины и страха потерять.",
    a: "За этим запросом всегда стоит женщина, которая давала очень много и недополучала в ответ. Я создала эти практики именно для неё — для тебя.",
    p: ["Я управляю своей жизнью", "Возвращение к наполненности", "Право быть настоящей"],
  },
  "Хочу раскрыть свою женственность и притяжение": {
    v: "Связь с женским — это не про внешность и не про роль. Это про то, как ты ощущаешь себя изнутри. Мягкость, чувственность, удовольствие от себя — это твоя природа, и эту связь можно восстановить.",
    s: "Через практики ты почувствуешь своё притяжение — не потому что стараешься, а потому что возвращаешься к себе настоящей. Это совсем другое ощущение.",
    a: "Женственность — это не маска и не техника. Это состояние изнутри. Я провела через это возвращение сотни женщин — и каждый раз это было как выдох после долгого задержания дыхания.",
    p: ["Женская энергия", "Возвращение к себе женственной", "Состояние женской притягательности"],
  },
};

// Each state has its own unique set of phrases — no sharing
export const MOOD_MESSAGES = {
  empty: [
    "Я позволяю себе быть пустой, чтобы наполниться по-настоящему.",
    "В пустоте рождается новое.",
    "Я не сломана. Я в паузе.",
    "Пустота — не конец. Это пространство перед началом.",
    "Сейчас мне не нужно ничего держать.",
    "Я отпускаю. Просто отпускаю.",
    "Сегодня я никуда не спешу.",
    "Я разрешаю себе не знать, что дальше.",
    "Пауза — это тоже движение. Внутрь.",
    "Мне можно быть тихой и прозрачной.",
  ],
  quiet: [
    "Я слышу себя. Этого достаточно.",
    "В тишине я нахожу то, что шум скрывал годами.",
    "Я выбираю тишину, потому что знаю себе цену.",
    "Я возвращаюсь к себе.",
    "В тишине я настоящая.",
    "Меня не нужно торопить.",
    "Я даю себе время услышать своё сердце.",
    "Тишина — это тоже сила.",
    "Я не убегаю от себя. Я сажусь рядом.",
    "Моя мягкость — это не слабость. Это присутствие.",
  ],
  full: [
    "Мир открыт для меня.",
    "Когда я наполнена, всё приходит само.",
    "Я не ищу. Я притягиваю.",
    "Сегодня я источник.",
    "Я сосуд, которому позволено быть полным.",
    "Мне хочется жить. Жадно и красиво.",
    "Сегодня я выбираю себя. Снова.",
    "Меня много. И это прекрасно.",
    "Я настолько своя, что притягиваю своих.",
    "Внутри меня огонь, который не гаснет.",
    "Моя красота не в зеркале. Она в том, как я вхожу в комнату.",
    "Я не стараюсь быть красивой. Я ею являюсь.",
    "Меня видно. И мне это нравится.",
    "Я та, о которой думают после встречи.",
    "Моё тело — это произведение искусства.",
    "Я притягиваю не внешностью. Я притягиваю собой.",
    "Есть что-то во мне, что невозможно объяснить. И не нужно.",
    "Я красива в движении, в молчании, в смехе, в желании.",
  ],
  power: [
    "Я не доказываю. Я просто есть.",
    "Я выбираю. Я создаю. Я иду.",
    "Сегодня я управляю своей жизнью.",
    "Я не прошу. Я выбираю.",
    "Я знаю себе цену. И она растёт.",
    "Я не конкурирую. Я просто являюсь собой, и всё получается.",
    "Я иду туда, где мне можно всё.",
    "Я достаточна. Я достойна. Мне можно всё.",
    "Я не для всех. Я для тех, кто умеет ценить.",
    "Моя привлекательность рождается изнутри.",
    "Я та женщина, которую запоминают.",
    "Чем больше я на своей стороне, тем красивее.",
    "Я не украшаю себя для мира. Я украшаю себя для себя.",
    "Во мне есть огонь, который делает меня неотразимой.",
    "Я манкая. Просто потому что живая.",
    "Всё, что я хочу, хочет меня ещё больше.",
  ],
};
