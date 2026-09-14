const STATES_RU = [
  {
    title: "Пустота / Истощение", hex: "#B9A9DA", items: [
      {
        problem: "Постоянная усталость — нет сил даже на простые вещи",
        rec: "Медитация «Восполниться энергией» — даёт телу разрешение на настоящее восстановление, переключает из режима выживания в режим наполнения",
      },
      {
        problem: "Чувство внутренней пустоты, которую заполняю едой / алкоголем / людьми",
        rec: "Медитация «Возвращение к наполненности» — залатывает внутренние дефициты и работает с ранами, которые вы заполняете снаружи",
      },
      {
        problem: "Много отдаю, но внутри пусто и холодно",
        rec: "Медитация «Возвращение к наполненности» — восстанавливает внутренний ресурс · Медитация «Восполнение женской ресурсности» — напитывает женскую часть, которая отдаёт без восполнения",
      },
      {
        problem: "Женская часть иссякла — нет вкуса к жизни, нет желаний",
        rec: "Медитация «Восполнение женской ресурсности» — разбуживает желания и возвращает вкус к себе через женский ресурс",
      },
      {
        problem: "Тело вяло, голова перегружена, отдых не восстанавливает",
        rec: "Медитация «Восполниться энергией» — работает с глубоким истощением нервной системы · Медитация «Женское внутреннее расслабление» — снимает хроническое напряжение, которое блокирует восстановление",
      },
      {
        problem: "Ощущение, что жизнь проходит мимо, нет настоящей радости",
        rec: "Медитация «Женская энергия» — открывает способность переживать удовольствие и лёгкость · Медитация «Восполнение женской ресурсности» — возвращает наполненность, из которой рождается радость",
      },
    ],
  },
  {
    title: "Самооценка / Самоценность", hex: "#E39A3C", items: [
      {
        problem: "Ощущение «я недостаточная» — постоянное обесценивание себя",
        rec: "Медитация «Получение благ от мира» — трансформирует глубинное убеждение «я не достойна» и переписывает отношение мира к вам",
      },
      {
        problem: "Постоянное сравнение с другими — и ощущение проигрыша",
        rec: "Медитация «Получение благ от мира» — переключает с дефицитного восприятия себя · Медитация «Возвращение к наполненности» — сравнение исходит из внутренней пустоты, работает с её корнем",
      },
      {
        problem: "Чувство «я неудачница», «у меня никогда ничего не получается»",
        rec: "Медитация «Получение благ от мира» — работает с детскими установками «я плохая» и «у меня не получается», меняет идентичность",
      },
      {
        problem: "Раны детства и старые установки мешают жить здесь и сейчас",
        rec: "Медитация «Возвращение к наполненности» — залечивает эмоциональные раны прошлого · Медитация «Получение благ от мира» — переписывает убеждения, сформированные в детстве",
      },
      {
        problem: "Стыдно занимать место, быть заметной, просить",
        rec: "Медитация «Право быть настоящей» — возвращает разрешение быть собой и занимать своё место · Медитация «Получение благ от мира» — снимает ощущение «я не достойна занимать много»",
      },
      {
        problem: "Хочется запретить себе счастье — «другим можно, а мне нет»",
        rec: "Скоро появится: Женское счастье — это норма",
      },
    ],
  },
  {
    title: "Закрытость / Сложно получать", hex: "#F3CE72", items: [
      {
        problem: "Много даю, но не получаю — в любви, деньгах, внимании",
        rec: "Медитация «Восполнение женской ресурсности» — работает с корнем: закрытость к получению идёт из пересохшей женской части · Медитация «Возвращение к наполненности» — учит наполняться, а не только отдавать",
      },
      {
        problem: "Стыдно принимать помощь, подарки, деньги — «должна сама»",
        rec: "Медитация «Женская энергия» — принятие = женское качество, медитация открывает способность принимать как норму · Медитация «Получение благ от мира» — убирает установку «я должна заслужить»",
      },
      {
        problem: "Ощущение «мне нельзя больше», «это не для меня»",
        rec: "Медитация «Новый уровень» — перепрограммирует внутренний «потолок» · Медитация «Получение благ от мира» — снимает убеждение «я не достойна большего»",
      },
      {
        problem: "Доброта мира пугает — «если дадут, буду должна» или «это ненадолго»",
        rec: "Медитация «Доверие к миру» — открывает ощущение безопасности получения, убирает страх «я окажусь в долгу»",
      },
      {
        problem: "Нет места для красоты, заботы о себе, наслаждения",
        rec: "Медитация «Восполнение женской ресурсности» — возвращает внутреннее пространство для красоты и наполнения · Медитация «Женское внутреннее расслабление» — снимает напряжение, из которого невозможно наслаждаться",
      },
    ],
  },
  {
    title: "Нет опоры / Потеря веры", hex: "#8E76B8", items: [
      {
        problem: "Приняла решение, но ничего не меняется — хочется сдаться",
        rec: "Медитация «Вера — мост между реальностями» — создана именно для этого момента: между точкой А и точкой Б, когда результатов ещё нет",
      },
      {
        problem: "Страх будущего, ощущение «я не справлюсь»",
        rec: "Медитация «Вера — мост между реальностями» — помогает удержать веру в себя · Медитация «Доверие к миру» — снимает ощущение, что мир враждебен и не поможет",
      },
      {
        problem: "Нет внутреннего стержня — ощущение опоры только на внешнее",
        rec: "Медитация «Я управляю своей жизнью» — возвращает ощущение себя как центра своей жизни, а не как щепки в волнах",
      },
      {
        problem: "Нестабильность — настроение и состояние полностью зависят от обстоятельств",
        rec: "Медитация «Я управляю своей жизнью» — переключает из реакции в позицию автора · Медитация «Доверие к миру» — снимает тревожную гиперчувствительность к внешнему",
      },
      {
        problem: "Пустота между старой и новой жизнью — ощущение «подвешенности»",
        rec: "Медитация «Вера — мост между реальностями» — работает именно с переходным состоянием, когда старое отпущено, а новое ещё не пришло",
      },
      {
        problem: "Нет направления, не знаю, чего хочу и куда иду",
        rec: "Медитация «Разговор с собой из будущего» — соединяет с версией себя, у которой уже есть ответы, даёт внутреннюю ясность и ориентир",
      },
    ],
  },
  {
    title: "Потеря себя / Маски и роли", hex: "#DCD2EC", items: [
      {
        problem: "Живу не своей жизнью, устала от ролей и масок",
        rec: "Медитация «Право быть настоящей» — даёт разрешение снять все роли и встретиться с собой настоящей",
      },
      {
        problem: "Постоянно подстраиваюсь под других, боюсь показать себя настоящей",
        rec: "Медитация «Право быть настоящей» — работает со страхом быть собой · Медитация «Я управляю своей жизнью» — возвращает контакт с собственной волей, а не адаптацией",
      },
      {
        problem: "Притягиваются «не те» люди — снова и снова",
        rec: "Медитация «Право быть настоящей» — когда вы в маске, притягиваете тех, кто нужен маске, а не вам · Медитация «Женская энергия» — меняет энергетическое поле притяжения",
      },
      {
        problem: "Ощущение, что не в контакте с собой и своими желаниями",
        rec: "Медитация «Восполнение женской ресурсности» — разбуживает желания через женский ресурс · Медитация «Разговор с собой из будущего» — восстанавливает контакт с собственной глубиной",
      },
      {
        problem: "Жизнь контролируется обстоятельствами и людьми, а не мной",
        rec: "Медитация «Я управляю своей жизнью» — возвращает позицию авторства: я выбираю, а не реагирую",
      },
      {
        problem: "Невроз, внутренняя усталость — устала от самой себя",
        rec: "Медитация «Право быть настоящей» — невроз часто возникает от постоянного несовпадения с собой · Медитация «Женское внутреннее расслабление» — снимает накопленное напряжение от борьбы с собой",
      },
    ],
  },
  {
    title: "Женское состояние / Магнетизм", hex: "#C57A8A", items: [
      {
        problem: "Потеряна связь с женственностью, чувствую себя функцией, а не женщиной",
        rec: "Медитация «Женская энергия» — прямая работа с возвращением в живое женское состояние из функционирования",
      },
      {
        problem: "Хочется расслабиться, отдать контроль, почувствовать себя женщиной",
        rec: "Медитация «Женская энергия» — открывает мягкость и принятие · Медитация «Женское внутреннее расслабление» — учит тело переходить из контроля в поток",
      },
      {
        problem: "Нет ощущения наслаждения — всё через напряжение и тревогу",
        rec: "Медитация «Женское внутреннее расслабление» — переключает базовое состояние из тревоги в удовольствие · Медитация «Состояние женской притягательности» — возвращает наслаждение как норму",
      },
      {
        problem: "Хочется притягивать, а не добиваться и доказывать",
        rec: "Медитация «Состояние женской притягательности» — пробуждает внутренний магнетизм через наслаждение · Медитация «Женская энергия» — переключает из мужской логики достижения в женскую логику притяжения",
      },
      {
        problem: "Трудно принимать заботу, любовь, комплименты — отталкиваю их",
        rec: "Медитация «Женская энергия» — принятие заботы = ядро женственности, медитация открывает этот канал · Медитация «Получение благ от мира» — снимает убеждение «я не достойна принимать»",
      },
      {
        problem: "Ощущение потери внутренней женской притягательности",
        rec: "Медитация «Состояние женской притягательности» — возвращает манкость как внутреннее состояние, а не внешний навык · Медитация «Восполнение женской ресурсности» — притягательность рождается из наполненной женской части",
      },
    ],
  },
  {
    title: "Тревога / Напряжение", hex: "#C9AFA6", items: [
      {
        problem: "Хроническое напряжение в теле, невозможно расслабиться и выдохнуть",
        rec: "Медитация «Женское внутреннее расслабление» — работает именно с хронической телесной броней, переводит тело из режима угрозы в режим безопасности",
      },
      {
        problem: "Внутренняя броня — страшно быть мягкой и уязвимой",
        rec: "Медитация «Женское внутреннее расслабление» — показывает мягкость как силу, а не слабость · Медитация «Доверие к миру» — снимает убеждение, что мир небезопасен для открытости",
      },
      {
        problem: "Мир ощущается небезопасным — постоянная настороженность и ожидание плохого",
        rec: "Медитация «Доверие к миру» — работает с базовым ощущением безопасности мира, переключает из режима выживания в режим доверия",
      },
      {
        problem: "Страх показать себя настоящей — вдруг оттолкнёт людей",
        rec: "Медитация «Право быть настоящей» — работает со страхом быть собой · Медитация «Доверие к миру» — снимает убеждение, что мир/люди не примут настоящую вас",
      },
      {
        problem: "Фоновая тревога, постоянное беспокойство без явной причины",
        rec: "Медитация «Женское внутреннее расслабление» — переводит нервную систему из хронического возбуждения · Медитация «Доверие к миру» — фоновая тревога часто держится убеждением «мир опасен»",
      },
    ],
  },
  {
    title: "Рост / Новый уровень", hex: "#7FA786", items: [
      {
        problem: "Чувство, что застряла в старой жизни — хочется большего",
        rec: "Медитация «Разговор с собой из будущего» — соединяет с образом уже выросшего «я», который тянет вперёд · Медитация «Новый уровень» — перепрограммирует психику на право жить на следующем уровне",
      },
      {
        problem: "Есть цели, но изнутри что-то откатывает назад",
        rec: "Медитация «Новый уровень» — работает с внутренним саботажем роста и страхом расширения · Медитация «Благодарность и новый уровень» — завершает старый этап, из которого невозможно выйти без прощания",
      },
      {
        problem: "Установки «ещё не готова», «нужно ещё заслужить право на большее»",
        rec: "Медитация «Благодарность и новый уровень» — трансформирует убеждения, удерживающие на старом уровне · Медитация «Получение благ от мира» — снимает ощущение «я не достаточно хороша для этого»",
      },
      {
        problem: "Страх перемен — хочется, но пугает потеря привычного и стабильного",
        rec: "Медитация «Вера — мост между реальностями» — учит удерживать веру в переходный период · Медитация «Благодарность и новый уровень» — помогает отпустить старое с благодарностью, а не с потерей",
      },
      {
        problem: "Когда приходит что-то хорошее — появляется страх это потерять",
        rec: "Медитация «Доверие к миру» — снимает ощущение, что хорошее временно и ненадёжно · Медитация «Новый уровень» — помогает удерживать изобилие, а не откатываться от него",
      },
      {
        problem: "Нет ясности, хочется связи со своим будущим «я»",
        rec: "Медитация «Разговор с собой из будущего» — даёт прямой контакт с версией себя, которая уже там, где вы хотите быть",
      },
    ],
  },
  {
    title: "Деньги и ресурс", hex: "#D07A55", items: [
      {
        problem: "Нет роста дохода — есть потолок, из которого хочется выйти",
        rec: "Медитация «Новый уровень» — убирает внутренние ограничители роста · Медитация «Благодарность и новый уровень» — завершает этап, на котором вы «застряли», освобождает для следующего",
      },
      {
        problem: "Изобилие чувствуется как что-то чужое, временное или незаслуженное",
        rec: "Медитация «Новый уровень» — прописывает изобилие как вашу норму, а не удачу · Медитация «Доверие к миру» — снимает страх, что хорошее заберут обратно",
      },
      {
        problem: "Нет энергии на действия — всё даётся с огромным трудом",
        rec: "Медитация «Восполниться энергией» — восстанавливает жизненный ресурс, без которого действия невозможны",
      },
      {
        problem: "Сложно принимать деньги легко — как подарок, поток, что-то естественное",
        rec: "Медитация «Женская энергия» — умение принимать, в том числе деньги, — это женское качество · Медитация «Получение благ от мира» — снимает убеждение «деньги нужно зарабатывать трудом, а не получать»",
      },
      {
        problem: "Ощущение «денег всегда мало» — даже когда объективно достаточно",
        rec: "Медитация «Получение благ от мира» — работает с дефицитным мышлением и ощущением нехватки · Медитация «Доверие к миру» — открывает ощущение, что мир поддерживает, а не обделяет",
      },
    ],
  },
  {
    title: "Отношения", hex: "#E8845E", items: [
      {
        problem: "Он отдаляется, становится меньше тепла и внимания",
        rec: "Медитация «Женская энергия» — возвращает притяжение через наполненность, а не через тревогу · Медитация «Женское внутреннее расслабление» — тревожное напряжение считывается партнёром и отдаляет",
      },
      {
        problem: "Чувство, что тебя не выбирают — снова и снова",
        rec: "Медитация «Получение благ от мира» — работает с базовым ощущением «я не достойна быть выбранной» · Медитация «Право быть настоящей» — когда не выбирают, часто это маску отвергают, а не вас",
      },
      {
        problem: "Страх потерять мужчину, ревность, постоянные подозрения",
        rec: "Медитация «Доверие к миру» — снимает тревожную гиперконтролирующую позицию · Медитация «Возвращение к наполненности» — ревность часто указывает на внутренний дефицит, а не на реальную угрозу",
      },
      {
        problem: "Много вкладываешь, а в ответ — мало или ничего",
        rec: "Медитация «Возвращение к наполненности» — когда внутри пусто, мы вкладываем в отношения то, что должны давать себе · Медитация «Женская энергия» — наполненная женщина не вкладывает из страха, а делится из избытка",
      },
      {
        problem: "Притягиваются «не те» мужчины — одни и те же типажи",
        rec: "Медитация «Право быть настоящей» — притягиваете тех, кого притягивает ваша маска · Медитация «Состояние женской притягательности» — меняет сам вибрационный уровень притяжения",
      },
      {
        problem: "Отношения есть, но нет глубины, тепла, настоящей близости",
        rec: "Медитация «Женская энергия» — глубина появляется, когда женщина раскрывается · Медитация «Доверие к миру» — близость невозможна без ощущения безопасности",
      },
      {
        problem: "Страх близости — сложно открыться и позволить себя любить",
        rec: "Медитация «Доверие к миру» — работает с базовым ощущением небезопасности открытости · Медитация «Право быть настоящей» — страх близости часто = страх показать настоящую себя",
      },
      {
        problem: "Растворяешься в мужчине — теряешь себя в отношениях",
        rec: "Медитация «Я управляю своей жизнью» — возвращает опору на себя и ощущение собственного центра · Медитация «Право быть настоящей» — нельзя раствориться, если есть контакт с собой",
      },
      {
        problem: "Постоянная тревога в отношениях, нет ощущения безопасности",
        rec: "Медитация «Доверие к миру» — создаёт внутреннее ощущение безопасности, не зависящее от поведения партнёра · Медитация «Женское внутреннее расслабление» — снимает телесную тревогу в отношениях",
      },
      {
        problem: "Нет отношений, но есть сильное желание любви и партнёра",
        rec: "Медитация «Состояние женской притягательности» — работает с внутренней готовностью притягивать · Медитация «Женская энергия» — наполненная женщина притягивает, а не ищет",
      },
      {
        problem: "Ощущение «я не достойна нормальных, здоровых отношений»",
        rec: "Медитация «Право быть настоящей» — возвращает ощущение, что вы заслуживаете любви, будучи собой · Медитация «Получение благ от мира» — трансформирует убеждение «мне не достаётся хорошее»",
      },
      {
        problem: "Повторяются одни и те же болезненные сценарии",
        rec: "Медитация «Право быть настоящей» — сценарии повторяются, пока не изменится то, что их создаёт — ваша маска · Медитация «Возвращение к наполненности» — повторяющиеся сценарии часто указывают на незалеченный дефицит",
      },
    ],
  },
];

const STATES_EN = [
  {
    title: "Emptiness / Exhaustion", hex: "#B9A9DA", items: [
      {
        problem: "Constant fatigue — no energy even for simple things",
        rec: "Meditation «Replenish your energy» — gives the body permission to truly restore, shifts from survival mode into filling mode",
      },
      {
        problem: "Feeling of inner emptiness, filling it with food / alcohol / people",
        rec: "Meditation «Return to fullness» — heals inner deficits and the wounds you fill from the outside",
      },
      {
        problem: "I give so much, but inside I feel empty and cold",
        rec: "Meditation «Return to fullness» — restores inner resource · Meditation «Feminine resource replenishment» — nourishes the feminine part that gives without refilling",
      },
      {
        problem: "Feminine part has dried up — no taste for life, no desires",
        rec: "Meditation «Feminine resource replenishment» — awakens desires and restores taste for yourself through feminine resource",
      },
      {
        problem: "Body is sluggish, mind overloaded, rest doesn't restore",
        rec: "Meditation «Replenish your energy» — works with deep nervous system exhaustion · Meditation «Feminine inner relaxation» — releases the chronic tension that blocks recovery",
      },
      {
        problem: "Feeling life is passing me by, no real joy",
        rec: "Meditation «Feminine energy» — opens the capacity to experience pleasure and lightness · Meditation «Feminine resource replenishment» — restores the fullness from which joy is born",
      },
    ],
  },
  {
    title: "Self-worth / Self-value", hex: "#E39A3C", items: [
      {
        problem: "Feeling «I'm not enough» — constant self-devaluation",
        rec: "Meditation «Receiving from the world» — transforms the deep belief «I'm not worthy» and rewrites your relationship with your own value",
      },
      {
        problem: "Constantly comparing myself to others and feeling I lose",
        rec: "Meditation «Receiving from the world» — shifts from deficit self-perception · Meditation «Return to fullness» — comparison comes from inner emptiness; this works at the root",
      },
      {
        problem: "Feeling «I'm a failure», «nothing ever works out for me»",
        rec: "Meditation «Receiving from the world» — works with childhood beliefs «I'm bad» and «I don't succeed», transforms identity",
      },
      {
        problem: "Childhood wounds and old beliefs blocking life in the present",
        rec: "Meditation «Return to fullness» — heals emotional wounds from the past · Meditation «Receiving from the world» — rewrites beliefs formed in childhood",
      },
      {
        problem: "Ashamed to take up space, be visible, or ask for help",
        rec: "Meditation «The right to be real» — restores permission to be yourself and occupy your place · Meditation «Receiving from the world» — releases the feeling «I don't deserve to take up much»",
      },
      {
        problem: "I ban my own happiness — «others can have it, not me»",
        rec: "Coming soon: Feminine happiness is the norm",
      },
    ],
  },
  {
    title: "Closedness / Hard to receive", hex: "#F3CE72", items: [
      {
        problem: "I give a lot but don't receive — in love, money, attention",
        rec: "Meditation «Feminine resource replenishment» — works at the root: difficulty receiving stems from a dried-up feminine part · Meditation «Return to fullness» — teaches you to fill yourself, not only give",
      },
      {
        problem: "Ashamed to accept help, gifts, money — «I must do it alone»",
        rec: "Meditation «Feminine energy» — receiving is a feminine quality; this meditation opens that channel as a norm · Meditation «Receiving from the world» — removes the belief «I must earn everything»",
      },
      {
        problem: "Feeling «I'm not allowed more», «this isn't for me»",
        rec: "Meditation «New level» — reprograms the inner ceiling · Meditation «Receiving from the world» — releases the belief «I'm not worthy of more»",
      },
      {
        problem: "The world's kindness feels dangerous — «if I receive, I'll owe» or «it won't last»",
        rec: "Meditation «Trust in the world» — opens the sense of safety around receiving, removes the fear «I'll end up in debt»",
      },
      {
        problem: "No room for beauty, self-care, or pleasure in my life",
        rec: "Meditation «Feminine resource replenishment» — restores inner space for beauty and nourishment · Meditation «Feminine inner relaxation» — releases the tension that makes enjoyment impossible",
      },
    ],
  },
  {
    title: "No support / Loss of faith", hex: "#8E76B8", items: [
      {
        problem: "Made a decision but nothing changes — I want to give up",
        rec: "Meditation «Faith as a bridge» — created exactly for this moment: between point A and point B, when results haven't arrived yet",
      },
      {
        problem: "Fear of the future, feeling «I won't cope»",
        rec: "Meditation «Faith as a bridge» — helps hold faith in yourself · Meditation «Trust in the world» — removes the sense that the world is hostile and won't help",
      },
      {
        problem: "No inner core — I feel grounded only in external things",
        rec: "Meditation «I manage my own life» — restores the sense of yourself as the center of your life, not a leaf in the wind",
      },
      {
        problem: "Instability — my mood and state completely depend on circumstances",
        rec: "Meditation «I manage my own life» — shifts from reaction to authorship · Meditation «Trust in the world» — releases anxious hypersensitivity to the external",
      },
      {
        problem: "Emptiness between old and new life — feeling suspended",
        rec: "Meditation «Faith as a bridge» — works specifically with the transitional state: the old is released, the new hasn't arrived yet",
      },
      {
        problem: "No direction, I don't know what I want or where I'm going",
        rec: "Meditation «Conversation with future self» — connects you with the version of yourself that already has the answers, gives inner clarity",
      },
    ],
  },
  {
    title: "Losing yourself / Masks and roles", hex: "#DCD2EC", items: [
      {
        problem: "Living someone else's life, exhausted from roles and masks",
        rec: "Meditation «The right to be real» — gives permission to drop all roles and meet your real self",
      },
      {
        problem: "Constantly adapting to others, afraid to show my real self",
        rec: "Meditation «The right to be real» — works with fear of being yourself · Meditation «I manage my own life» — restores contact with your own will rather than constant adaptation",
      },
      {
        problem: "Attracting the «wrong» people — again and again",
        rec: "Meditation «The right to be real» — when you wear a mask, you attract those who fit the mask, not you · Meditation «Feminine energy» — changes the energetic field of attraction",
      },
      {
        problem: "Feeling out of contact with myself and my desires",
        rec: "Meditation «Feminine resource replenishment» — awakens desires through feminine resource · Meditation «Conversation with future self» — restores contact with your own depth",
      },
      {
        problem: "Life is controlled by circumstances and others, not me",
        rec: "Meditation «I manage my own life» — restores authorship: I choose, I don't react",
      },
      {
        problem: "Neurosis, inner exhaustion — tired of being myself",
        rec: "Meditation «The right to be real» — neurosis often comes from constant mismatch with yourself · Meditation «Feminine inner relaxation» — releases accumulated tension from fighting with yourself",
      },
    ],
  },
  {
    title: "Feminine state / Magnetism", hex: "#C57A8A", items: [
      {
        problem: "Lost connection to femininity, feel like a function, not a woman",
        rec: "Meditation «Feminine energy» — direct work on returning from functioning mode to alive feminine state",
      },
      {
        problem: "Wanting to relax, release control, feel like a woman",
        rec: "Meditation «Feminine energy» — opens softness and receiving · Meditation «Feminine inner relaxation» — teaches the body to transition from control into flow",
      },
      {
        problem: "No sense of pleasure — everything is through tension and anxiety",
        rec: "Meditation «Feminine inner relaxation» — shifts the baseline state from anxiety to enjoyment · Meditation «A state of feminine allure» — returns pleasure as the norm",
      },
      {
        problem: "Wanting to attract, not chase and prove",
        rec: "Meditation «A state of feminine allure» — awakens inner magnetism through enjoyment · Meditation «Feminine energy» — shifts from masculine achievement logic to feminine attraction logic",
      },
      {
        problem: "Hard to receive care, love, compliments — I push them away",
        rec: "Meditation «Feminine energy» — receiving care is at the core of femininity; this meditation opens that channel · Meditation «Receiving from the world» — removes the belief «I don't deserve to receive»",
      },
      {
        problem: "Feeling a loss of inner feminine magnetism",
        rec: "Meditation «A state of feminine allure» — restores allure as an inner state, not an external skill · Meditation «Feminine resource replenishment» — magnetism is born from a nourished feminine part",
      },
    ],
  },
  {
    title: "Anxiety / Tension", hex: "#C9AFA6", items: [
      {
        problem: "Chronic tension in the body, impossible to relax and breathe out",
        rec: "Meditation «Feminine inner relaxation» — works specifically with chronic body armor, moves the body from threat mode to safety mode",
      },
      {
        problem: "Inner armor — afraid to be soft and vulnerable",
        rec: "Meditation «Feminine inner relaxation» — shows softness as strength, not weakness · Meditation «Trust in the world» — removes the belief that the world is unsafe for openness",
      },
      {
        problem: "The world feels unsafe — constant vigilance and expecting the worst",
        rec: "Meditation «Trust in the world» — works with the baseline sense of the world's safety, shifts from survival to trust",
      },
      {
        problem: "Afraid to show my real self — what if I push people away",
        rec: "Meditation «The right to be real» — works with fear of being yourself · Meditation «Trust in the world» — releases the belief that the world/people won't accept the real you",
      },
      {
        problem: "Background anxiety, constant worry without a clear reason",
        rec: "Meditation «Feminine inner relaxation» — moves the nervous system out of chronic activation · Meditation «Trust in the world» — background anxiety is often held in place by the belief «the world is dangerous»",
      },
    ],
  },
  {
    title: "Growth / New level", hex: "#7FA786", items: [
      {
        problem: "Feeling stuck in old life — wanting more",
        rec: "Meditation «Conversation with future self» — connects with the image of your already-grown self that pulls you forward · Meditation «New level» — reprograms the psyche for the right to live at the next level",
      },
      {
        problem: "Goals exist but something inside keeps pulling me back",
        rec: "Meditation «New level» — works with inner sabotage of growth and fear of expansion · Meditation «Gratitude and new level» — completes the old stage you can't leave without saying goodbye",
      },
      {
        problem: "Beliefs: «not ready yet», «must earn the right to more first»",
        rec: "Meditation «Gratitude and new level» — transforms beliefs that keep you at the old level · Meditation «Receiving from the world» — releases the sense «I'm not good enough for this yet»",
      },
      {
        problem: "Fear of change — wanting it but afraid of losing stability",
        rec: "Meditation «Faith as a bridge» — teaches holding faith through the transition · Meditation «Gratitude and new level» — helps release the old with gratitude, not grief",
      },
      {
        problem: "When good things come — I get afraid of losing them",
        rec: "Meditation «Trust in the world» — removes the sense that good things are temporary and unreliable · Meditation «New level» — helps hold abundance rather than retreat from it",
      },
      {
        problem: "No clarity — wanting to connect with my future self",
        rec: "Meditation «Conversation with future self» — gives direct contact with the version of yourself who is already where you want to be",
      },
    ],
  },
  {
    title: "Money and resource", hex: "#D07A55", items: [
      {
        problem: "No income growth — there's a ceiling I want to break through",
        rec: "Meditation «New level» — removes inner growth limiters · Meditation «Gratitude and new level» — completes the stage you're stuck on, clears space for the next",
      },
      {
        problem: "Abundance feels foreign, temporary, or undeserved",
        rec: "Meditation «New level» — programs abundance as your norm, not your luck · Meditation «Trust in the world» — removes the fear that good things will be taken away",
      },
      {
        problem: "No energy for action — everything takes enormous effort",
        rec: "Meditation «Replenish your energy» — restores the life resource without which action is impossible",
      },
      {
        problem: "Hard to receive money easily — as a gift, as flow, as something natural",
        rec: "Meditation «Feminine energy» — the ability to receive, including money, is a feminine quality · Meditation «Receiving from the world» — removes the belief «money must be earned through hard work, not received»",
      },
      {
        problem: "Feeling «never enough money» — even when there's objectively plenty",
        rec: "Meditation «Receiving from the world» — works with deficit thinking and the feeling of lack · Meditation «Trust in the world» — opens the sense that the world supports you, it doesn't withhold",
      },
    ],
  },
  {
    title: "Relationships", hex: "#E8845E", items: [
      {
        problem: "He's pulling away, less warmth and attention",
        rec: "Meditation «Feminine energy» — returns attraction through fullness, not through anxiety · Meditation «Feminine inner relaxation» — anxious tension is felt by a partner and creates distance",
      },
      {
        problem: "Feeling unchosen — again and again",
        rec: "Meditation «Receiving from the world» — works with the core feeling «I'm not worthy of being chosen» · Meditation «The right to be real» — when not chosen, it's often the mask that's rejected, not you",
      },
      {
        problem: "Fear of losing the man, jealousy, constant suspicion",
        rec: "Meditation «Trust in the world» — releases anxious hyper-controlling position · Meditation «Return to fullness» — jealousy often points to inner deficit, not a real threat",
      },
      {
        problem: "I invest a lot, but get little or nothing in return",
        rec: "Meditation «Return to fullness» — when empty inside, we invest in relationships what we should give ourselves · Meditation «Feminine energy» — a fulfilled woman shares from abundance, not gives from fear",
      },
      {
        problem: "Attracting the «wrong» men — the same types again and again",
        rec: "Meditation «The right to be real» — you attract who your mask attracts · Meditation «A state of feminine allure» — changes the actual vibrational level of attraction",
      },
      {
        problem: "There's a relationship, but no depth, warmth, real closeness",
        rec: "Meditation «Feminine energy» — depth appears when a woman opens up · Meditation «Trust in the world» — closeness is impossible without a sense of safety",
      },
      {
        problem: "Fear of intimacy — hard to open up and let yourself be loved",
        rec: "Meditation «Trust in the world» — works with the baseline sense that openness is unsafe · Meditation «The right to be real» — fear of intimacy is often fear of showing your real self",
      },
      {
        problem: "I dissolve in the man — I lose myself in the relationship",
        rec: "Meditation «I manage my own life» — restores grounding in yourself and sense of your own center · Meditation «The right to be real» — you can't dissolve if you have contact with yourself",
      },
      {
        problem: "Constant anxiety in the relationship, no sense of safety",
        rec: "Meditation «Trust in the world» — creates internal safety that doesn't depend on a partner's behavior · Meditation «Feminine inner relaxation» — releases body anxiety in relationships",
      },
      {
        problem: "No relationship but strong desire for love and a partner",
        rec: "Meditation «A state of feminine allure» — works with inner readiness to attract · Meditation «Feminine energy» — a fulfilled woman attracts, she doesn't search",
      },
      {
        problem: "Feeling «I'm not worthy of a healthy, normal relationship»",
        rec: "Meditation «The right to be real» — restores the sense that you deserve love as yourself · Meditation «Receiving from the world» — transforms the belief «good things don't come to me»",
      },
      {
        problem: "The same painful patterns keep repeating",
        rec: "Meditation «The right to be real» — patterns repeat until what creates them changes — your mask · Meditation «Return to fullness» — repeating patterns often point to an unhealed deficit",
      },
    ],
  },
];

export const STATES = STATES_RU;
export function getStates(lang = "ru") { return lang === "en" ? STATES_EN : STATES_RU; }
