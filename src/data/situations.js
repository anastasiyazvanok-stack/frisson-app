const STATES_RU = [
  {
    title: "Пустота / Истощение", hex: "#8B1A3A", items: [
      { problem: "Постоянная усталость, нет энергии, ничего не хочется", rec: "Медитация «Восполниться энергией»" },
      { problem: "Чувство, что внутри «дыры», зависимость от людей/еды/внимания", rec: "Медитация «Возвращение к наполненности»" },
      { problem: "Ощущение, что жизнь проходит мимо", rec: "Медитация «Женская энергия»" },
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
      { problem: "Страх будущего, ощущение «я не справлюсь»", rec: "Медитация «Вера — мост между реальностями»" },
      { problem: "Ощущение, что нет внутреннего стержня", rec: "Медитация «Я управляю своей жизнью»" },
      { problem: "Нестабильность, разбрасывание по жизни", rec: "Медитация «Доверие к миру»" },
    ],
  },
  {
    title: "Потеря себя", hex: "#9E6BC4", items: [
      { problem: "Живёте не своей жизнью, усталость от ролей", rec: "Медитация «Право быть настоящей»" },
      { problem: "Притягиваются «не те» люди", rec: "Медитация «Право быть настоящей»" },
      { problem: "Ощущение, что вы не в контакте с собой", rec: "Медитация «Женская энергия»" },
    ],
  },
  {
    title: "Женское состояние / Магнетизм", hex: "#E88FC6", items: [
      { problem: "Хочется больше лёгкости, женственности", rec: "Медитация «Женская энергия»" },
      { problem: "Нет ощущения наслаждения жизнью", rec: "Медитация «Женское внутреннее расслабление»" },
      { problem: "Хочется притягивать, а не добиваться", rec: "Медитация «Состояние женской притягательности»" },
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
      { problem: "Обесценивание себя", rec: "Медитация «Возвращение к наполненности»" },
      { problem: "Нет ощущения, что «я достойна»", rec: "Медитация «Получение благ от мира»" },
      { problem: "Постоянное чувство «я недостаточная»", rec: "Медитация «Получение благ от мира»" },
    ],
  },
  {
    title: "Рост / Новый уровень", hex: "#4FAE92", items: [
      { problem: "Чувство, что застряли в старой жизни", rec: "Медитация «Разговор с собой из будущего»" },
      { problem: "Есть цели, но нет движения", rec: "Медитация «Новый уровень»" },
      { problem: "Переход в новую реальность вызывает страх", rec: "Медитация «Вера — мост между реальностями»" },
    ],
  },
  {
    title: "Отношения", hex: "#E8A04C", items: [
      { problem: "Он отдаляется / меньше внимания", rec: "Медитация «Где я перекрыла себе получение»" },
      { problem: "Чувство, что вас не выбирают", rec: "Медитация «Получение благ от мира»" },
      { problem: "Страх потерять мужчину", rec: "Медитация «Доверие к миру»" },
      { problem: "Вы много вкладываетесь, а в ответ мало", rec: "Медитация «Получение благ от мира» · Медитация «Возвращение к наполненности»" },
      { problem: "Притягиваются «не те» мужчины", rec: "Медитация «Право быть настоящей» · Медитация «Женская энергия»" },
      { problem: "Отношения есть, но нет глубины / тепла", rec: "Медитация «Женская энергия» · Медитация «Женское внутреннее расслабление»" },
      { problem: "Страх близости, сложно открываться", rec: "Медитация «Доверие к миру»" },
      { problem: "Вы растворяетесь в мужчине", rec: "Медитация «Я управляю своей жизнью» · Медитация «Право быть настоящей»" },
      { problem: "Постоянная тревога в отношениях", rec: "Медитация «Доверие к миру» · Медитация «Женское внутреннее расслабление»" },
      { problem: "Ревность, подозрения, сравнение", rec: "Медитация «Возвращение к наполненности» · Медитация «Доверие к миру»" },
      { problem: "Нет отношений, но сильное желание любви", rec: "Медитация «Получение благ от мира» · Медитация «Женская энергия»" },
      { problem: "Ощущение «я не достойна нормальных отношений»", rec: "Медитация «Право быть настоящей» · Медитация «Получение благ от мира»" },
      { problem: "Повторяются одни и те же сценарии", rec: "Медитация «Право быть настоящей» · Аудиопрактика «Где я перекрыла себе получение»" },
    ],
  },
];

const STATES_EN = [
  {
    title: "Emptiness / Exhaustion", hex: "#8B1A3A", items: [
      { problem: "Constant fatigue, no energy, nothing is wanted", rec: "Meditation «Replenish your energy»" },
      { problem: "Feeling of inner «holes», dependency on people/food/attention", rec: "Meditation «Return to fullness»" },
      { problem: "Feeling that life is passing by", rec: "Meditation «Feminine energy»" },
    ],
  },
  {
    title: "Closedness / Can't receive", hex: "#FFAF32", items: [
      { problem: "I give a lot but don't receive (in love, money)", rec: "Audio practice «Where I blocked my receiving»" },
      { problem: "Shame about taking money, care, attention", rec: "Meditation «Receiving goods from the world»" },
      { problem: "Feeling «I'm not allowed more»", rec: "Meditation «New level»" },
    ],
  },
  {
    title: "No support / Insecurity", hex: "#4A7AB8", items: [
      { problem: "Fear of the future, «I won't cope» feeling", rec: "Meditation «Faith as a bridge»" },
      { problem: "Feeling there is no inner core", rec: "Meditation «I manage my own life»" },
      { problem: "Instability, scattering through life", rec: "Meditation «Trust in the world»" },
    ],
  },
  {
    title: "Losing yourself", hex: "#9E6BC4", items: [
      { problem: "Living someone else's life, tired of roles", rec: "Meditation «The right to be real»" },
      { problem: "Attracting the «wrong» people", rec: "Meditation «The right to be real»" },
      { problem: "Feeling out of contact with yourself", rec: "Meditation «Return to feminine self»" },
    ],
  },
  {
    title: "Feminine state / Magnetism", hex: "#E88FC6", items: [
      { problem: "Wanting more lightness, femininity", rec: "Meditation «Feminine energy»" },
      { problem: "No sense of enjoying life", rec: "Meditation «Feminine inner relaxation»" },
      { problem: "Wanting to attract, not chase", rec: "Meditation «A state of feminine attraction»" },
    ],
  },
  {
    title: "Money and resource", hex: "#D4A74A", items: [
      { problem: "Fear of money, tension around money", rec: "Meditation «Money and safety»" },
      { problem: "No income growth", rec: "Meditation «New level»" },
      { problem: "No energy for action", rec: "Meditation «Replenish your energy»" },
    ],
  },
  {
    title: "Self-love", hex: "#E76F51", items: [
      { problem: "Devaluing yourself", rec: "Meditation «Return to fullness»" },
      { problem: "No sense of «I am worthy»", rec: "Meditation «Receiving goods from the world»" },
      { problem: "Constant feeling of «I'm not enough»", rec: "Meditation «Feminine happiness is the norm»" },
    ],
  },
  {
    title: "Growth / New level", hex: "#4FAE92", items: [
      { problem: "Feeling stuck in old life", rec: "Meditation «Conversation with future self»" },
      { problem: "Goals exist but no movement", rec: "Meditation «New level»" },
      { problem: "Transition to new reality brings fear", rec: "Meditation «Faith as a bridge»" },
    ],
  },
  {
    title: "Relationships", hex: "#E8A04C", items: [
      { problem: "He's pulling away / less attention", rec: "Meditation «Where I blocked my receiving»" },
      { problem: "Feeling unchosen", rec: "Meditation «Receiving goods from the world»" },
      { problem: "Fear of losing the man", rec: "Meditation «Trust in the world»" },
      { problem: "You invest a lot, get little back", rec: "Meditation «Receiving goods from the world» · Meditation «Return to fullness»" },
      { problem: "Attracting the «wrong» men", rec: "Meditation «The right to be real» · Meditation «Return to feminine self»" },
      { problem: "Relationship exists but no depth / warmth", rec: "Meditation «Feminine energy» · Meditation «Feminine inner relaxation»" },
      { problem: "Fear of intimacy, hard to open up", rec: "Meditation «Trust in the world»" },
      { problem: "You dissolve in the man", rec: "Meditation «I manage my own life» · Meditation «The right to be real»" },
      { problem: "Constant anxiety in the relationship", rec: "Meditation «Trust in the world» · Meditation «Feminine inner relaxation»" },
      { problem: "Jealousy, suspicion, comparison", rec: "Meditation «Return to fullness» · Meditation «Trust in the world»" },
      { problem: "No relationship but strong desire for love", rec: "Meditation «Receiving goods from the world» · Meditation «Feminine happiness is the norm»" },
      { problem: "Feeling «I'm not worthy of a normal relationship»", rec: "Meditation «The right to be real» · Meditation «Receiving goods from the world»" },
      { problem: "The same patterns keep repeating", rec: "Meditation «The right to be real» · Audio practice «Where I blocked my receiving»" },
    ],
  },
];

export const STATES = STATES_RU;
export function getStates(lang = "ru") { return lang === "en" ? STATES_EN : STATES_RU; }
