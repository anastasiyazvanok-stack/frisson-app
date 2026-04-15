const STATES_RU = [
  {
    title: "Пустота / Истощение", hex: "#8B1A3A", items: [
      { problem: "Постоянная усталость, нет энергии, ничего не хочется", rec: "Медитация «Восполниться энергией»" },
      { problem: "Чувство, что внутри «дыры», зависимость от людей/еды/внимания", rec: "Медитация «Залатывание дефицитов»" },
      { problem: "Ощущение, что жизнь проходит мимо", rec: "Медитация «Контакт с женской частью»" },
    ],
  },
  {
    title: "Тревога", hex: "#D4453C", items: [
      { problem: "Постоянное ожидание плохого, накручивание", rec: "Техника «Определение тревоги + работа с прошлым опытом»" },
      { problem: "Тревога из-за прошлого (измена, предательство, потеря)", rec: "Техника «Найти первичную ситуацию и прожить её»" },
      { problem: "Гиперконтроль, невозможность расслабиться", rec: "Техника «Отпускание контроля через внутреннего ребёнка»" },
      { problem: "Подавленные желания вызывают тревогу", rec: "Техника «Разрешение желаний внутреннего ребёнка»" },
    ],
  },
  {
    title: "Ревность / Неуверенность", hex: "#C44B88", items: [
      { problem: "Страх, что выберут другую", rec: "Практика «Работа с внутренним ребёнком на привлекательность»" },
      { problem: "Недоверие к мужчинам", rec: "Практика «Перепроживание родительских установок + разрешение доверять»" },
      { problem: "Постоянные подозрения, сравнение себя", rec: "Практика «Возврат к своей ценности и целостности»" },
    ],
  },
  {
    title: "Закрытость / Не получается получать", hex: "#FFAF32", items: [
      { problem: "Много даю, но не получаю (в любви, деньгах)", rec: "Аудиопрактика «Где я перекрыла себе получение»" },
      { problem: "Стыд брать деньги, заботу, внимание", rec: "Медитация «Получение благ от мира»" },
      { problem: "Ощущение «мне нельзя больше»", rec: "Медитация «Новый уровень»" },
    ],
  },
  {
    title: "Нет опоры / Неуверенность", hex: "#4A7AB8", items: [
      { problem: "Страх будущего, ощущение «я не справлюсь»", rec: "Медитация «Вера как мост»" },
      { problem: "Ощущение, что нет внутреннего стержня", rec: "Медитация «Я автор своей жизни»" },
      { problem: "Нестабильность, разбрасывание по жизни", rec: "Медитация «Доверие к миру»" },
    ],
  },
  {
    title: "Потеря себя", hex: "#9E6BC4", items: [
      { problem: "Живёте не своей жизнью, усталость от ролей", rec: "Медитация «Право быть настоящей»" },
      { problem: "Притягиваются «не те» люди", rec: "Медитация «Право быть настоящей»" },
      { problem: "Ощущение, что вы не в контакте с собой", rec: "Медитация «Контакт с женской частью»" },
    ],
  },
  {
    title: "Женское состояние / Магнетизм", hex: "#E88FC6", items: [
      { problem: "Хочется больше лёгкости, женственности", rec: "Медитация «Женская энергия»" },
      { problem: "Нет ощущения наслаждения жизнью", rec: "Медитация «Женское внутреннее расслабление»" },
      { problem: "Хочется притягивать, а не добиваться", rec: "Медитация «Манкость и женственность»" },
    ],
  },
  {
    title: "Деньги и ресурс", hex: "#D4A74A", items: [
      { problem: "Страх денег, напряжение при мысли о деньгах", rec: "Медитация «Деньги и безопасность»" },
      { problem: "Нет роста дохода", rec: "Медитация «Новый уровень»" },
      { problem: "Нет энергии на действия", rec: "Медитация «Восполниться энергией»" },
    ],
  },
  {
    title: "Любовь к себе", hex: "#E76F51", items: [
      { problem: "Обесценивание себя", rec: "Медитация «Ценность себя»" },
      { problem: "Нет ощущения, что «я достойна»", rec: "Медитация «Получение благ от мира»" },
      { problem: "Постоянное чувство «я недостаточная»", rec: "Медитация «Женское счастье — это норма»" },
    ],
  },
  {
    title: "Рост / Новый уровень", hex: "#4FAE92", items: [
      { problem: "Чувство, что застряли в старой жизни", rec: "Медитация «Разговор с собой из будущего»" },
      { problem: "Есть цели, но нет движения", rec: "Медитация «Новый уровень»" },
      { problem: "Переход в новую реальность вызывает страх", rec: "Медитация «Вера как мост»" },
    ],
  },
  {
    title: "Отношения", hex: "#E8A04C", items: [
      { problem: "Он отдаляется / меньше внимания", rec: "Медитация «Где я перекрыла себе получение»" },
      { problem: "Чувство, что вас не выбирают", rec: "Медитация «Получение благ от мира»" },
      { problem: "Страх потерять мужчину", rec: "Медитация «Доверие к миру»" },
      { problem: "Вы много вкладываетесь, а в ответ мало", rec: "Медитация «Получение благ от мира» · Медитация «Ценность себя»" },
      { problem: "Притягиваются «не те» мужчины", rec: "Медитация «Право быть настоящей» · Медитация «Контакт с женской частью»" },
      { problem: "Отношения есть, но нет глубины / тепла", rec: "Медитация «Женская энергия» · Медитация «Женское внутреннее расслабление»" },
      { problem: "Страх близости, сложно открываться", rec: "Медитация «Доверие к миру»" },
      { problem: "Вы растворяетесь в мужчине", rec: "Медитация «Я автор своей жизни» · Медитация «Право быть настоящей»" },
      { problem: "Постоянная тревога в отношениях", rec: "Техники работы с тревогой · Медитация «Доверие к миру»" },
      { problem: "Ревность, подозрения, сравнение", rec: "Практика против ревности · Медитация «Ценность себя»" },
      { problem: "Нет отношений, но сильное желание любви", rec: "Медитация «Получение благ от мира» · Медитация «Женское счастье — это норма»" },
      { problem: "Ощущение «я не достойна нормальных отношений»", rec: "Медитация «Ценность себя» · Медитация «Получение благ от мира»" },
      { problem: "Повторяются одни и те же сценарии", rec: "Медитация «Право быть настоящей» · Аудиопрактика «Где я перекрыла себе получение»" },
    ],
  },
];

const STATES_EN = [
  {
    title: "Emptiness / Exhaustion", hex: "#8B1A3A", items: [
      { problem: "Constant fatigue, no energy, nothing is wanted", rec: "Meditation \u00ABReplenish your energy\u00BB" },
      { problem: "Feeling of inner \u00ABholes\u00BB, dependency on people/food/attention", rec: "Meditation \u00ABPatching deficits\u00BB" },
      { problem: "Feeling that life is passing by", rec: "Meditation \u00ABContact with the feminine part\u00BB" },
    ],
  },
  {
    title: "Anxiety", hex: "#D4453C", items: [
      { problem: "Constantly expecting the worst, spiraling", rec: "Technique \u00ABIdentifying anxiety + working with past experience\u00BB" },
      { problem: "Anxiety from the past (betrayal, loss)", rec: "Technique \u00ABFind the primary situation and live through it\u00BB" },
      { problem: "Hyper-control, inability to relax", rec: "Technique \u00ABReleasing control through the inner child\u00BB" },
      { problem: "Suppressed desires cause anxiety", rec: "Technique \u00ABAllowing the inner child's desires\u00BB" },
    ],
  },
  {
    title: "Jealousy / Insecurity", hex: "#C44B88", items: [
      { problem: "Fear that he'll choose another", rec: "Practice \u00ABWorking with the inner child on attractiveness\u00BB" },
      { problem: "Distrust of men", rec: "Practice \u00ABRe-living parental imprints + permission to trust\u00BB" },
      { problem: "Constant suspicion, comparing yourself", rec: "Practice \u00ABReturning to your worth and wholeness\u00BB" },
    ],
  },
  {
    title: "Closedness / Can't receive", hex: "#FFAF32", items: [
      { problem: "I give a lot but don't receive (in love, money)", rec: "Audio practice \u00ABWhere I blocked my receiving\u00BB" },
      { problem: "Shame about taking money, care, attention", rec: "Meditation \u00ABReceiving goods from the world\u00BB" },
      { problem: "Feeling \u00ABI'm not allowed more\u00BB", rec: "Meditation \u00ABNew level\u00BB" },
    ],
  },
  {
    title: "No support / Insecurity", hex: "#4A7AB8", items: [
      { problem: "Fear of the future, \u00ABI won't cope\u00BB feeling", rec: "Meditation \u00ABFaith as a bridge\u00BB" },
      { problem: "Feeling there is no inner core", rec: "Meditation \u00ABI am the author of my life\u00BB" },
      { problem: "Instability, scattering through life", rec: "Meditation \u00ABTrust in the world\u00BB" },
    ],
  },
  {
    title: "Losing yourself", hex: "#9E6BC4", items: [
      { problem: "Living someone else's life, tired of roles", rec: "Meditation \u00ABThe right to be real\u00BB" },
      { problem: "Attracting the \u00ABwrong\u00BB people", rec: "Meditation \u00ABThe right to be real\u00BB" },
      { problem: "Feeling out of contact with yourself", rec: "Meditation \u00ABContact with the feminine part\u00BB" },
    ],
  },
  {
    title: "Feminine state / Magnetism", hex: "#E88FC6", items: [
      { problem: "Wanting more lightness, femininity", rec: "Meditation \u00ABFeminine energy\u00BB" },
      { problem: "No sense of enjoying life", rec: "Meditation \u00ABFeminine inner relaxation\u00BB" },
      { problem: "Wanting to attract, not chase", rec: "Meditation \u00ABAllure and femininity\u00BB" },
    ],
  },
  {
    title: "Money and resource", hex: "#D4A74A", items: [
      { problem: "Fear of money, tension around money", rec: "Meditation \u00ABMoney and safety\u00BB" },
      { problem: "No income growth", rec: "Meditation \u00ABNew level\u00BB" },
      { problem: "No energy for action", rec: "Meditation \u00ABReplenish your energy\u00BB" },
    ],
  },
  {
    title: "Self-love", hex: "#E76F51", items: [
      { problem: "Devaluing yourself", rec: "Meditation \u00ABYour value\u00BB" },
      { problem: "No sense of \u00ABI am worthy\u00BB", rec: "Meditation \u00ABReceiving goods from the world\u00BB" },
      { problem: "Constant feeling of \u00ABI'm not enough\u00BB", rec: "Meditation \u00ABFeminine happiness is the norm\u00BB" },
    ],
  },
  {
    title: "Growth / New level", hex: "#4FAE92", items: [
      { problem: "Feeling stuck in old life", rec: "Meditation \u00ABConversation with future self\u00BB" },
      { problem: "Goals exist but no movement", rec: "Meditation \u00ABNew level\u00BB" },
      { problem: "Transition to new reality brings fear", rec: "Meditation \u00ABFaith as a bridge\u00BB" },
    ],
  },
  {
    title: "Relationships", hex: "#E8A04C", items: [
      { problem: "He's pulling away / less attention", rec: "Meditation \u00ABWhere I blocked my receiving\u00BB" },
      { problem: "Feeling unchosen", rec: "Meditation \u00ABReceiving goods from the world\u00BB" },
      { problem: "Fear of losing the man", rec: "Meditation \u00ABTrust in the world\u00BB" },
      { problem: "You invest a lot, get little back", rec: "Meditation \u00ABReceiving goods from the world\u00BB \u00B7 Meditation \u00ABYour value\u00BB" },
      { problem: "Attracting the \u00ABwrong\u00BB men", rec: "Meditation \u00ABThe right to be real\u00BB \u00B7 Meditation \u00ABContact with the feminine part\u00BB" },
      { problem: "Relationship exists but no depth / warmth", rec: "Meditation \u00ABFeminine energy\u00BB \u00B7 Meditation \u00ABFeminine inner relaxation\u00BB" },
      { problem: "Fear of intimacy, hard to open up", rec: "Meditation \u00ABTrust in the world\u00BB" },
      { problem: "You dissolve in the man", rec: "Meditation \u00ABI am the author of my life\u00BB \u00B7 Meditation \u00ABThe right to be real\u00BB" },
      { problem: "Constant anxiety in the relationship", rec: "Anxiety techniques \u00B7 Meditation \u00ABTrust in the world\u00BB" },
      { problem: "Jealousy, suspicion, comparison", rec: "Anti-jealousy practice \u00B7 Meditation \u00ABYour value\u00BB" },
      { problem: "No relationship but strong desire for love", rec: "Meditation \u00ABReceiving goods from the world\u00BB \u00B7 Meditation \u00ABFeminine happiness is the norm\u00BB" },
      { problem: "Feeling \u00ABI'm not worthy of a normal relationship\u00BB", rec: "Meditation \u00ABYour value\u00BB \u00B7 Meditation \u00ABReceiving goods from the world\u00BB" },
      { problem: "The same patterns keep repeating", rec: "Meditation \u00ABThe right to be real\u00BB \u00B7 Audio practice \u00ABWhere I blocked my receiving\u00BB" },
    ],
  },
];

export const STATES = STATES_RU;
export function getStates(lang = "ru") { return lang === "en" ? STATES_EN : STATES_RU; }
