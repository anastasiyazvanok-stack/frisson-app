import { useState } from "react";
import { getPersonalContent } from "../data/content";
import { FONT_SERIF, FONT_SANS, TYPE, SP, RAD, OP, EASE, tx, label, body, heading } from "../utils/design";
import { VERSION } from "../App";
import { t as tr } from "../utils/i18n";
import { LensMark, LogoLockup } from "./Brand";

const STEPS = {
  ru: [
    { type: "splash" },
    { type: "info", ey: "психологический капитал", hl: "Это то,\nиз чего\nвы живёте", body: "То, как вы любите, выбираете,\nчувствуете и создаёте реальность" },
    { type: "info", ey: "когда он растёт", hl: "Меняется\nне состояние.\nМеняется жизнь", body: "Отношения. Опора. Способность\nпринимать и создавать свою норму" },
    { type: "info", ey: "для чего NECTAR", hl: "Укреплять\nкапитал\nкаждый день", body: "Медитации · Орбита с 8 сценариями\n40+ ситуаций-рекомендаций\nДневник и трекинг состояния", tags: ["Опору", "Спокойствие", "Наполненность", "Женственность", "Силу", "Выход из тревоги"] },
    { type: "info", ey: "почему нектар", hl: "Вы — источник\nсвоей безграничной\nэнергии и силы", body: "А источнику нужно наполняться.\nЭто место — ваш собственный нектар." },
    { type: "info", ey: "добро пожаловать", hl: "Ваше внутреннее\nстановится\nосновой\nновой жизни", body: "Создано Магистром Клинической Психологии\nАнастасией Званок" },
    { type: "q", q: "Как ты себя чувствуешь прямо сейчас?", opts: ["Я устала — нужна тишина и восполнение", "Я ищу себя и хочу вспомнить свою силу", "Я в тревоге — хочу обрести покой", "Я готова расцветать и идти дальше"], key: "f" },
    { type: "q", q: "Что привело тебя сюда?", opts: ["Хочу лучше понять себя и свои желания", "Хочу восстановить энергию и ресурс", "Хочу почувствовать свою ценность", "Хочу раскрыть свою женственность и притяжение"], key: "r" },
    { type: "personal" },
    { type: "consent" },
  ],
  en: [
    { type: "splash" },
    { type: "info", ey: "psychological capital", hl: "It's what\nyou live\nfrom", body: "How you love, choose,\nfeel and create reality" },
    { type: "info", ey: "when it grows", hl: "Not the state\nchanges.\nLife changes", body: "Relationships. Support. The ability\nto receive and create your norm" },
    { type: "info", ey: "what NECTAR is for", hl: "Grow your\ncapital\nevery day", body: "Meditations · Orbit with 8 scenarios\n40+ situation recommendations\nJournal and state tracking", tags: ["Support", "Calm", "Fullness", "Femininity", "Strength", "Leaving anxiety"] },
    { type: "info", ey: "why nectar", hl: "You are the source\nof your own boundless\nenergy and strength", body: "And a source needs a place to fill back up.\nThat place is your own nectar." },
    { type: "info", ey: "welcome", hl: "Your inner world\nbecomes\nthe foundation\nof a new life", body: "Created by Master of Clinical Psychology\nAnastasia Zvanok" },
    { type: "q", q: "How are you feeling right now?", opts: ["I'm tired — I need silence and replenishment", "I'm searching for myself, I want to remember my strength", "I'm anxious — I want to find peace", "I'm ready to bloom and move forward"], key: "f" },
    { type: "q", q: "What brought you here?", opts: ["I want to understand myself and my desires better", "I want to restore energy and resource", "I want to feel my value", "I want to reveal my femininity and attraction"], key: "r" },
    { type: "personal" },
    { type: "consent" },
  ],
};

const TEXT = {
  ru: {
    spaceOfState: "✦ пространство состояния ✦",
    tagline: "пространство, где вы раскрываете\nсвой женский внутренний капитал",
    onlyForYou: "только для тебя",
    iHearYou: "я слышу тебя",
    whatChanges: "что изменится",
    fromAnastasia: "от анастасии",
    whereToStart: "с чего начать",
    lastStep: "последний шаг",
    consent1: "Сервис NECTAR — образовательная платформа. Не является медицинским учреждением и не заменяет работу с лицензированным специалистом.",
    consent2: "Обработка данных осуществляется согласно Регламенту ЕС 2016/679 (GDPR). Часть данных обрабатывается сторонними сервисами (Supabase, Anthropic) для синхронизации и работы ИИ-функций — подробности в Политике конфиденциальности.",
    consent3: "Записи дневника и результаты тестов доступны исключительно вам. Не используются в коммерческих целях без вашего согласия.",
    consent4: "Вы вправе в любой момент запросить выгрузку, исправление или удаление своих данных согласно ст. 17 GDPR.",
    agreePre: "Я ознакомилась и принимаю ",
    userAgreement: "Пользовательское соглашение",
    and: " и ",
    privacy: "Политику конфиденциальности",
    agePost: ". Мне исполнилось 18 лет.",
    enterSpace: "Войти в своё пространство →",
    enter: "Войти →",
    next: "Дальше →",
  },
  en: {
    spaceOfState: "✦ space of state ✦",
    tagline: "a space where you unfold\nyour feminine inner capital",
    onlyForYou: "only for you",
    iHearYou: "I hear you",
    whatChanges: "what will change",
    fromAnastasia: "from Anastasia",
    whereToStart: "where to begin",
    lastStep: "final step",
    consent1: "The NECTAR service is an educational platform. It is not a medical institution and does not replace work with a licensed specialist.",
    consent2: "Data processing is carried out in accordance with EU Regulation 2016/679 (GDPR). Some data is processed by third-party services (Supabase, Anthropic) for sync and AI features — see the Privacy Policy for details.",
    consent3: "Journal entries and test results are accessible only to you. They are not used for commercial purposes without your consent.",
    consent4: "You have the right at any time to request export, correction or deletion of your data under Article 17 of the GDPR.",
    agreePre: "I have read and accept the ",
    userAgreement: "User Agreement",
    and: " and ",
    privacy: "Privacy Policy",
    agePost: ". I am 18 or older.",
    enterSpace: "Enter your space →",
    enter: "Enter →",
    next: "Next →",
  },
};

const DOCS = {
  ru: {
    privacy: {
      title: "Политика конфиденциальности",
      sections: [
        { h: "1. Общие положения", t: "Настоящая Политика конфиденциальности регулирует порядок сбора, обработки и хранения персональных данных пользователей приложения NECTAR. Сервис создан Анастасией Званок (Оператор). Используя приложение, вы соглашаетесь с условиями настоящей Политики." },
        { h: "2. Какие данные мы собираем", t: "• Имя пользователя (вводится добровольно)\n• Ответы на вопросы теста энергии\n• Записи дневника и сообщения ИИ-коучу\n• Данные психологического капитала (результаты трекинга состояния)\n• Выбранные настройки и предпочтения внутри приложения\n• Анонимные технические данные об использовании (без привязки к личности)" },
        { h: "3. Хранение данных", t: "По умолчанию данные хранятся локально на вашем устройстве (localStorage). Если вы входите в аккаунт, данные дополнительно синхронизируются с облачным хранилищем на базе Supabase — чтобы дневник и прогресс не терялись при смене устройства. Оператор не читает содержание ваших записей вручную." },
        { h: "4. Субпроцессоры", t: "Для работы сервиса мы используем субпроцессоров:\n• Supabase — хранение аккаунта и синхронизация данных\n• Anthropic PBC (США) — обрабатывает текст записей в Дневнике и переписки с ИИ-коучем, чтобы сформировать ответ, только когда вы пользуетесь этими функциями\nОбращение к Anthropic может означать передачу данных за пределы ЕЭЗ. Если вы не хотите, чтобы текст записи обрабатывался ИИ — не используйте функции ИИ-коуча и анализа дневника; остальная часть приложения работает без этого." },
        { h: "5. Особые категории данных", t: "Записи дневника и результаты теста энергии могут содержать сведения о вашем эмоциональном и психологическом состоянии. Мы обрабатываем их только с вашего явного согласия, данного при регистрации (ст. 9(2)(a) GDPR), и не используем для целей, не указанных в этой Политике." },
        { h: "6. Цели обработки данных", t: "Данные используются исключительно для:\n• Персонализации работы приложения\n• Предоставления рекомендаций медитаций и практик\n• Работы ИИ-коуча и анализа дневниковых записей\n• Улучшения пользовательского опыта" },
        { h: "7. Передача третьим лицам", t: "Мы не продаём и не передаём ваши персональные данные третьим лицам в коммерческих целях. Анонимные агрегированные данные могут использоваться для внутренней аналитики в целях улучшения сервиса." },
        { h: "8. Срок хранения", t: "Мы храним ваши данные, пока ваш аккаунт активен. После удаления аккаунта данные удаляются из наших систем в разумный срок, кроме случаев, когда более длительное хранение требуется законом." },
        { h: "9. Ваши права (GDPR)", t: "В соответствии с Регламентом ЕС 2016/679 вы вправе:\n• Получить доступ к своим данным\n• Исправить или удалить свои данные (ст. 17 GDPR)\n• Ограничить обработку данных\n• Возразить против обработки (ст. 21 GDPR)\n• Перенести данные\n• Отозвать согласие в любой момент\n• Подать жалобу в уполномоченный надзорный орган" },
        { h: "10. Безопасность", t: "Мы применяем технические и организационные меры для защиты ваших данных от несанкционированного доступа, утраты или раскрытия: доступ к базе данных ограничен политиками на уровне строк (RLS), соединение шифруется (HTTPS/TLS)." },
        { h: "11. Возраст", t: "Сервис предназначен для лиц, достигших 18 лет. Мы сознательно не собираем данные лиц моложе 18 лет." },
        { h: "12. Изменения в Политике", t: "О существенных изменениях вы будете уведомлены через интерфейс приложения. Продолжение использования сервиса после уведомления означает согласие с обновлёнными условиями." },
        { h: "13. Контакт", t: "По вопросам обработки данных и реализации прав:\nfrisson.app@gmail.com\n\nДата вступления в силу: 14 сентября 2026 г." },
      ],
    },
    terms: {
      title: "Пользовательское соглашение",
      sections: [
        { h: "1. Принятие условий", t: "Используя приложение NECTAR, вы принимаете настоящее Пользовательское соглашение в полном объёме. Если вы не согласны с какими-либо условиями, пожалуйста, прекратите использование Сервиса." },
        { h: "2. О Сервисе", t: "NECTAR — образовательная платформа для работы с психологическим капиталом и внутренним состоянием. Сервис не является медицинским учреждением и не предоставляет медицинских услуг, психиатрических диагнозов или психотерапии. При наличии психологических, психиатрических или иных медицинских проблем обратитесь к лицензированному специалисту." },
        { h: "3. Возраст пользователей", t: "Сервис предназначен исключительно для лиц, достигших 18 лет. Регистрируясь и используя Сервис, вы подтверждаете, что вам исполнилось 18 лет." },
        { h: "4. Подписка и оплата", t: "• Базовые функции могут быть доступны бесплатно; полный доступ предоставляется по подписке\n• Стоимость подписки указана в приложении на момент оформления\n• Подписка автоматически продлевается, если не отменена до даты списания\n• Оператор вправе изменять стоимость подписки, уведомив об этом заранее\n• Возврат средств осуществляется в соответствии с политикой платёжной платформы" },
        { h: "5. Интеллектуальная собственность", t: "Все материалы Сервиса — медитации, аудиозаписи, тексты, практики, дизайн, логотипы — являются интеллектуальной собственностью Оператора или правообладателей. Копирование, воспроизведение, распространение или коммерческое использование без письменного разрешения Оператора запрещено." },
        { h: "6. Пользовательский контент", t: "Ваши записи в Дневнике являются личными. Они хранятся на вашем устройстве и (при входе в аккаунт) синхронизируются с облаком; при использовании ИИ-коуча и анализа дневника текст записи обрабатывается субпроцессором Anthropic для формирования ответа (см. Политику конфиденциальности). Оператор не читает содержание записей вручную. Вы несёте полную ответственность за содержание своих материалов и их соответствие применимому законодательству." },
        { h: "7. Допустимое использование", t: "Вы обязуетесь:\n• Использовать Сервис только в законных личных целях\n• Не предпринимать попыток взлома, обхода защиты или иного нарушения работы Сервиса\n• Не распространять контент Сервиса третьим лицам\n• Не создавать нескольких аккаунтов для обхода ограничений" },
        { h: "8. Ограничение ответственности", t: "Сервис предоставляется «как есть» без каких-либо явных или подразумеваемых гарантий. Оператор не несёт ответственности за прямой или косвенный ущерб, возникший в результате использования или невозможности использования Сервиса." },
        { h: "9. Изменение условий", t: "Оператор вправе изменить условия настоящего Соглашения. Об изменениях вы будете уведомлены через интерфейс приложения. Продолжение использования Сервиса означает согласие с обновлёнными условиями." },
        { h: "10. Расторжение", t: "Вы вправе прекратить использование Сервиса в любой момент, удалив приложение и данные. Оператор вправе ограничить или прекратить доступ при нарушении условий Соглашения." },
        { h: "11. Применимое право", t: "Настоящее Соглашение регулируется действующим законодательством. Споры разрешаются путём переговоров, а при невозможности — в суде по месту нахождения Оператора." },
        { h: "12. Контакт", t: "По вопросам использования Сервиса:\nfrisson.app@gmail.com\n\nДата вступления в силу: 14 сентября 2026 г." },
      ],
    },
  },
  en: {
    privacy: {
      title: "Privacy Policy",
      sections: [
        { h: "1. General Provisions", t: "This Privacy Policy governs the collection, processing and storage of personal data of NECTAR application users. The Service is created by Anastasia Zvanok (Operator). By using the application, you agree to the terms of this Policy." },
        { h: "2. Data We Collect", t: "• Username (entered voluntarily)\n• Energy test answers\n• Journal entries and AI coach messages\n• Psychological capital tracking data\n• In-app settings and preferences\n• Anonymous technical usage data (not linked to identity)" },
        { h: "3. Data Storage", t: "By default, data is stored locally on your device (localStorage). If you sign in, data is additionally synced to cloud storage on Supabase — so your journal and progress aren't lost when you switch devices. The Operator does not manually read the content of your entries." },
        { h: "4. Sub-processors", t: "To run the service we use these sub-processors:\n• Supabase — account storage and data sync\n• Anthropic PBC (USA) — processes the text of your Journal entries and AI coach conversations to generate a reply, only when you use those features\nUsing Anthropic may involve transferring data outside the EEA. If you don't want your entry text processed by AI, don't use the AI coach and diary analysis features — the rest of the app works without them." },
        { h: "5. Special Category Data", t: "Journal entries and energy test results may reveal information about your emotional and psychological state. We process this only with your explicit consent, given at sign-up (Art. 9(2)(a) GDPR), and do not use it for purposes beyond this Policy." },
        { h: "6. Purposes of Processing", t: "Data is used exclusively to:\n• Personalize the app experience\n• Provide meditation and practice recommendations\n• Run the AI coach and journal analysis features\n• Improve the user experience" },
        { h: "7. Third Party Sharing", t: "We do not sell or transfer your personal data to third parties for commercial purposes. Anonymous aggregated data may be used for internal analytics to improve the service." },
        { h: "8. Data Retention", t: "We keep your data for as long as your account is active. After account deletion, data is removed from our systems within a reasonable time, except where longer retention is required by law." },
        { h: "9. Your Rights (GDPR)", t: "Under EU Regulation 2016/679 you have the right to:\n• Access your data\n• Correct or delete your data (Art. 17 GDPR)\n• Restrict processing\n• Object to processing (Art. 21 GDPR)\n• Data portability\n• Withdraw consent at any time\n• Lodge a complaint with a supervisory authority" },
        { h: "10. Security", t: "We apply technical and organizational measures to protect your data from unauthorized access, loss or disclosure: database access is restricted by row-level security (RLS) policies, and connections are encrypted (HTTPS/TLS)." },
        { h: "11. Age", t: "The Service is intended for persons aged 18 and over. We do not knowingly collect data from persons under 18." },
        { h: "12. Policy Changes", t: "You will be notified of significant changes through the app interface. Continued use after notification constitutes acceptance of the updated terms." },
        { h: "13. Contact", t: "For data processing inquiries:\nfrisson.app@gmail.com\n\nEffective date: September 14, 2026" },
      ],
    },
    terms: {
      title: "Terms of Use",
      sections: [
        { h: "1. Acceptance", t: "By using NECTAR, you accept these Terms of Use in full. If you disagree with any terms, please stop using the Service." },
        { h: "2. About the Service", t: "NECTAR is an educational platform for working with psychological capital and inner states. The Service is not a medical institution and does not provide medical services, psychiatric diagnoses or psychotherapy. For psychological, psychiatric or other medical issues, please consult a licensed professional." },
        { h: "3. Age Requirement", t: "The Service is exclusively for persons aged 18 and over. By using the Service, you confirm you are 18 or older." },
        { h: "4. Subscription & Payment", t: "• Basic features may be available for free; full access requires a subscription\n• Subscription pricing is shown in the app at time of purchase\n• Subscriptions auto-renew unless cancelled before the billing date\n• The Operator may change pricing with prior notice\n• Refunds are handled per the payment platform's policy" },
        { h: "5. Intellectual Property", t: "All Service materials — meditations, audio recordings, texts, practices, design, logos — are the intellectual property of the Operator or rights holders. Copying, reproduction, distribution or commercial use without written permission is prohibited." },
        { h: "6. User Content", t: "Your Journal entries are personal. They are stored on your device and (if you sign in) synced to the cloud; when you use the AI coach and journal analysis, entry text is processed by our sub-processor Anthropic to generate a reply (see the Privacy Policy). The Operator does not manually read entry content. You are fully responsible for your content and its compliance with applicable law." },
        { h: "7. Acceptable Use", t: "You agree to:\n• Use the Service only for lawful personal purposes\n• Not attempt to hack, bypass security or otherwise disrupt the Service\n• Not distribute Service content to third parties\n• Not create multiple accounts to circumvent restrictions" },
        { h: "8. Limitation of Liability", t: "The Service is provided 'as is' without any express or implied warranties. The Operator is not liable for any direct or indirect damage arising from use or inability to use the Service." },
        { h: "9. Changes to Terms", t: "The Operator may modify these Terms. You will be notified through the app. Continued use constitutes acceptance of the updated terms." },
        { h: "10. Termination", t: "You may stop using the Service at any time by deleting the app and data. The Operator may restrict or terminate access for violations of these Terms." },
        { h: "11. Governing Law", t: "These Terms are governed by applicable law. Disputes shall be resolved by negotiation, or if not possible, in court at the Operator's location." },
        { h: "12. Contact", t: "For Service inquiries:\nfrisson.app@gmail.com\n\nEffective date: September 14, 2026" },
      ],
    },
  },
};

export default function Onboarding({ onDone, lang = "ru", setLang }) {
  const [step, setStep] = useState(0);
  const [ans, setAns] = useState({});
  const [agreed, setAgreed] = useState(false);
  const [showDoc, setShowDoc] = useState(null); // "privacy" | "terms"

  const steps = STEPS[lang] || STEPS.ru;
  const TX = TEXT[lang] || TEXT.ru;
  const PERSONAL = getPersonalContent(lang);

  const cur = steps[step];
  const isLast = step === steps.length - 1;
  const canNext = (cur.type !== "q" || (cur.key && ans[cur.key])) && (cur.type !== "consent" || agreed);

  return (
    <div style={{ width: "100%", height: "100dvh", background: "linear-gradient(160deg,#150A15 0%,#5C1C2E 46%,#0E0810 100%)", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", width: "80%", height: "80%", top: "-20%", left: "-20%", borderRadius: "50%", background: "radial-gradient(circle,rgba(227,154,60,.55) 0%,rgba(92,28,46,.3) 50%,transparent 72%)", filter: "blur(70px)", animation: "onbDrift1 24s ease-in-out infinite" }} />
        <div style={{ position: "absolute", width: "68%", height: "68%", bottom: "-14%", right: "-12%", borderRadius: "50%", background: "radial-gradient(circle,rgba(208,86,42,.5) 0%,rgba(92,28,46,.28) 50%,transparent 72%)", filter: "blur(65px)", animation: "onbDrift2 28s 4s ease-in-out infinite" }} />
        <div style={{ position: "absolute", width: "48%", height: "48%", top: "26%", left: "28%", borderRadius: "50%", background: "radial-gradient(circle,rgba(142,118,184,.38) 0%,rgba(142,118,184,.18) 50%,transparent 72%)", filter: "blur(55px)", animation: "onbDrift3 18s 7s ease-in-out infinite" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 42%,transparent 12%,rgba(14,8,16,.88) 100%)" }} />

        <LensMark size={64} opacity={0.06} style={{ position: "absolute", top: "10%", right: "8%", animation: "onbDrift1 32s ease-in-out infinite", pointerEvents: "none" }} />
        <LensMark size={48} opacity={0.05} style={{ position: "absolute", bottom: "12%", left: "6%", animation: "onbDrift2 36s 5s ease-in-out infinite", pointerEvents: "none" }} />
      </div>

      <style>{`
        @keyframes onbDrift1 { 0%, 100% { transform: translate(0, 0) scale(1); } 33% { transform: translate(20px, -30px) scale(1.05); } 66% { transform: translate(-15px, 20px) scale(.98); } }
        @keyframes onbDrift2 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-25px, -20px) scale(1.08); } }
        @keyframes onbDrift3 { 0%, 100% { transform: translate(0, 0) scale(1); opacity: .85; } 50% { transform: translate(30px, 25px) scale(1.12); opacity: 1; } }
      `}</style>

      {/* Language toggle (on splash step only) */}
      {step === 0 && setLang && (
        <div style={{ position: "absolute", top: SP.page, left: SP.xl, zIndex: 3, display: "flex", gap: 3, background: "rgba(0,0,0,.35)", border: "1px solid rgba(255,255,255,.12)", borderRadius: RAD.md, padding: 3, backdropFilter: "blur(8px)" }}>
          {[["ru", "RU"], ["en", "EN"]].map(([code, short]) => (
            <div key={code} onClick={() => setLang(code)} style={{ padding: `4px 10px`, borderRadius: RAD.sm, cursor: "pointer", background: lang === code ? "rgba(227,154,60,.3)" : "transparent", ...label(TYPE.xs), color: lang === code ? "#fff" : "rgba(255,255,255,.55)" }}>{short}</div>
          ))}
        </div>
      )}

      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: `40px ${SP.xxl - 4}px 0`, position: "relative", zIndex: 2 }}>
        {step > 0 && (
          <div style={{ display: "flex", gap: 6, marginBottom: 36, animation: "fadeUp .3s ease both" }}>
            {steps.slice(1).map((_, i) => (
              <div key={i} style={{ height: SP.xs, borderRadius: 2, transition: EASE.slow, width: step - 1 === i ? SP.xxl - 4 : SP.xs, background: step - 1 === i ? "rgba(185,169,218,.75)" : `rgba(255,255,255,${OP.disabled})` }} />
            ))}
          </div>
        )}

        {cur.type === "splash" && (
          <div style={{ textAlign: "center", width: "100%", animation: "fadeUp 1s ease both" }}>
            <div style={{ fontFamily: FONT_SERIF, fontStyle: "italic", fontWeight: 300, fontSize: 15, letterSpacing: ".08em", color: "rgba(201,175,166,.6)", marginBottom: SP.xl }}>{TX.spaceOfState}</div>
            <LogoLockup mark={64} size={40} style={{ marginBottom: SP.xl }} />
            <div style={{ fontFamily: FONT_SERIF, fontSize: 20, fontWeight: 300, lineHeight: 1.5, color: `rgba(201,175,166,${OP.primary - 0.05})`, letterSpacing: ".02em", marginBottom: SP.md, padding: `0 ${SP.md}px`, whiteSpace: "pre-line" }}>{TX.tagline}</div>
            <div style={{ ...label(TYPE.xs), color: `rgba(201,175,166,${OP.tertiary})`, letterSpacing: ".14em" }}>v{VERSION}</div>
          </div>
        )}

        {cur.type === "info" && (
          <div style={{ textAlign: "center", width: "100%", animation: "fadeUp .45s ease both" }}>
            <div style={{ ...label(TYPE.sm), color: "rgba(201,175,166,.55)", letterSpacing: ".32em", marginBottom: SP.xxl - 4 }}>{cur.ey}</div>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 52, fontWeight: 300, lineHeight: 1.08, color: `rgba(247,239,230,${OP.primary})`, letterSpacing: ".01em", marginBottom: SP.xl, whiteSpace: "pre-line" }}>{cur.hl}</div>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 18, fontWeight: 300, lineHeight: 1.65, color: `rgba(247,239,230,${OP.secondary + 0.1})`, maxWidth: 320, margin: "0 auto", whiteSpace: "pre-line", marginBottom: cur.tags ? SP.xl : 0 }}>{cur.body}</div>
            {cur.tags && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: SP.sm, justifyContent: "center", maxWidth: 320, margin: "0 auto" }}>
                {cur.tags.map((w) => (
                  <div key={w} style={{ padding: `${SP.sm}px ${SP.md + 2}px`, borderRadius: RAD.lg, background: "rgba(227,154,60,.1)", border: "1px solid rgba(227,154,60,.22)", fontFamily: FONT_SANS, fontSize: TYPE.sm + 1, fontWeight: 300, color: "rgba(247,239,230,.82)" }}>{w}</div>
                ))}
              </div>
            )}
          </div>
        )}

        {cur.type === "q" && (
          <div style={{ width: "100%", animation: "fadeUp .5s ease both" }}>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 28, fontWeight: 300, color: `rgba(247,239,230,${OP.primary})`, textAlign: "center", lineHeight: 1.35, marginBottom: SP.xxl }}>{cur.q}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: SP.md }}>
              {cur.opts.map((opt, oi) => (
                <div key={opt} onClick={() => setAns((a) => ({ ...a, [cur.key]: opt }))} style={{
                  padding: `${SP.lg + 2}px ${SP.page}px`, borderRadius: RAD.lg, textAlign: "center", cursor: "pointer",
                  background: ans[cur.key] === opt ? "rgba(92,28,46,.38)" : "rgba(255,255,255,.03)",
                  border: `1px solid ${ans[cur.key] === opt ? "rgba(227,154,60,.45)" : "rgba(255,255,255,.09)"}`,
                  fontFamily: FONT_SANS, fontSize: TYPE.base + 1, fontWeight: 400, lineHeight: 1.4,
                  color: ans[cur.key] === opt ? "rgba(247,239,230,.96)" : "rgba(247,239,230,.7)",
                  boxShadow: ans[cur.key] === opt ? "0 0 32px rgba(227,154,60,.22), 0 0 60px rgba(208,86,42,.12), inset 0 1px 0 rgba(255,255,255,.06)" : "none",
                  transition: EASE.normal, animation: `fadeUp .4s ${oi * 0.08}s ease both`,
                }}>{opt}</div>
              ))}
            </div>
          </div>
        )}

        {cur.type === "personal" && ans.r && PERSONAL[ans.r] && (() => {
          const c = PERSONAL[ans.r];
          return (
            <div style={{ width: "100%", animation: "fadeUp .6s ease both" }}>
              <div style={{ ...label(TYPE.xs), color: `rgba(201,175,166,${OP.secondary})`, letterSpacing: ".28em", textAlign: "center", marginBottom: SP.xl - 2 }}>{TX.onlyForYou}</div>
              {[{ l: TX.iHearYou, t: c.v }, { l: TX.whatChanges, t: c.s }, { l: TX.fromAnastasia, t: c.a }].map((x) => (
                <div key={x.l} style={{ padding: SP.lg + 2, background: "rgba(0,0,0,.3)", border: "1px solid rgba(247,239,230,.15)", backdropFilter: "blur(14px)", borderRadius: RAD.lg - 2, marginBottom: SP.sm + 2 }}>
                  <div style={{ ...label(TYPE.xs), color: "rgba(220,210,236,.65)", letterSpacing: ".2em", marginBottom: SP.sm }}>{x.l}</div>
                  <div style={{ ...body(TYPE.base + 1), color: "rgba(247,239,230,.88)" }}>{x.t}</div>
                </div>
              ))}
              <div style={{ padding: SP.lg, background: "rgba(0,0,0,.2)", border: "1px solid rgba(247,239,230,.1)", backdropFilter: "blur(10px)", borderRadius: RAD.md + 2 }}>
                <div style={{ ...label(TYPE.xs), color: "rgba(220,210,236,.65)", letterSpacing: ".2em", marginBottom: SP.sm + 2 }}>{TX.whereToStart}</div>
                {c.p.map((p) => (
                  <div key={p} style={{ display: "flex", alignItems: "center", gap: SP.sm + 2, marginBottom: SP.sm, paddingBottom: SP.sm, borderBottom: `1px solid rgba(255,255,255,${OP.bgSubtle})` }}>
                    <div style={{ width: SP.xs, height: SP.xs, borderRadius: RAD.full, background: "rgba(201,175,166,.6)", flexShrink: 0 }} />
                    <div style={{ ...body(TYPE.base), color: "rgba(247,239,230,.88)" }}>{p}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {cur.type === "consent" && (
          <div style={{ width: "100%", animation: "fadeUp .6s ease both" }}>
            <div style={{ ...label(TYPE.xs), color: "rgba(201,175,166,.5)", letterSpacing: ".3em", textAlign: "center", marginBottom: SP.xxl - 4 }}>{TX.lastStep}</div>
            <div style={{ ...heading(TYPE.xxl + 4), color: `rgba(247,239,230,${OP.primary})`, textAlign: "center", marginBottom: SP.xxl - 4 }}>NECTAR</div>
            {[TX.consent1, TX.consent2, TX.consent3, TX.consent4].map((txt, i) => (
              <div key={i} style={{ display: "flex", gap: SP.md, padding: `${SP.md + 1}px ${SP.lg}px`, background: "rgba(227,154,60,.05)", border: "1px solid rgba(227,154,60,.14)", borderRadius: RAD.md, marginBottom: SP.sm + 2 }}>
                <div style={{ fontFamily: FONT_SERIF, fontSize: SP.lg, color: "rgba(201,175,166,.5)", flexShrink: 0, lineHeight: 1.4 }}>◦</div>
                <div style={{ fontFamily: FONT_SANS, fontSize: TYPE.sm + 1, fontWeight: 300, color: "rgba(201,175,166,.72)", lineHeight: 1.65 }}>{txt}</div>
              </div>
            ))}
            <div onClick={() => setAgreed((a) => !a)} style={{ display: "flex", alignItems: "flex-start", gap: SP.md + 2, padding: `${SP.lg}px ${SP.lg + 2}px`, background: agreed ? "rgba(227,154,60,.1)" : "rgba(255,255,255,.02)", border: `1px solid ${agreed ? "rgba(227,154,60,.38)" : "rgba(255,255,255,.09)"}`, borderRadius: RAD.md + 2, cursor: "pointer", transition: EASE.normal, marginTop: SP.sm, boxShadow: agreed ? "0 0 24px rgba(227,154,60,.12)" : "none" }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, border: `1.5px solid ${agreed ? "rgba(227,154,60,.7)" : "rgba(255,255,255,.22)"}`, background: agreed ? "rgba(178,70,31,.35)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, transition: EASE.normal }}>{agreed && <div style={{ fontSize: TYPE.sm, color: "rgba(247,239,230,.95)" }}>✓</div>}</div>
              <div style={{ fontFamily: FONT_SANS, fontSize: TYPE.sm + 1, fontWeight: 300, lineHeight: 1.65, color: "rgba(201,175,166,.8)" }}>{TX.agreePre}<span onClick={(e) => { e.stopPropagation(); setShowDoc("terms"); }} style={{ color: "rgba(201,175,166,.95)", textDecoration: "underline", cursor: "pointer" }}>{TX.userAgreement}</span>{TX.and}<span onClick={(e) => { e.stopPropagation(); setShowDoc("privacy"); }} style={{ color: "rgba(201,175,166,.95)", textDecoration: "underline", cursor: "pointer" }}>{TX.privacy}</span>{TX.agePost}</div>
            </div>
          </div>
        )}
      </div>

      {showDoc && (() => {
        const doc = DOCS[lang]?.[showDoc] || DOCS.ru[showDoc];
        return (
          <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "#0e0810", display: "flex", flexDirection: "column", animation: "fadeUp .35s ease both" }}>
            <div style={{ display: "flex", alignItems: "center", gap: SP.md, padding: `max(${SP.xl}px, env(safe-area-inset-top, ${SP.xl}px)) ${SP.lg}px ${SP.lg}px`, borderBottom: "1px solid rgba(255,255,255,.08)", flexShrink: 0, background: "rgba(14,8,16,.95)" }}>
              <div onClick={() => setShowDoc(null)} style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: RAD.full, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", cursor: "pointer", flexShrink: 0, fontSize: 18, color: "rgba(201,175,166,.7)" }}>←</div>
              <div style={{ fontFamily: FONT_SANS, fontSize: TYPE.sm + 2, fontWeight: 500, color: "rgba(247,239,230,.9)", letterSpacing: ".01em", flex: 1 }}>{doc.title}</div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: `${SP.xl}px ${SP.lg}px`, paddingBottom: `max(${SP.xxl}px, env(safe-area-inset-bottom, ${SP.xxl}px))` }}>
              {doc.sections.map((sec, i) => (
                <div key={i} style={{ marginBottom: SP.xxl }}>
                  <div style={{ fontFamily: FONT_SANS, fontSize: TYPE.sm + 1, fontWeight: 600, color: "rgba(201,175,166,.9)", marginBottom: SP.sm, letterSpacing: ".01em" }}>{sec.h}</div>
                  <div style={{ fontFamily: FONT_SANS, fontSize: TYPE.sm, fontWeight: 300, color: "rgba(201,175,166,.75)", lineHeight: 1.75, whiteSpace: "pre-line" }}>{sec.t}</div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      <div style={{ padding: `${SP.lg}px ${SP.xxl - 4}px`, paddingBottom: `max(${SP.xl}px, env(safe-area-inset-bottom, ${SP.xl}px))`, position: "relative", zIndex: 2, flexShrink: 0 }}>
        {step > 0 && (
          <div onClick={() => setStep((s) => s - 1)} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", marginBottom: SP.sm, justifyContent: "center" }}>
            <span style={{ fontSize: TYPE.sm, color: "rgba(201,175,166,.45)" }}>←</span>
            <span style={{ ...label(TYPE.xs), color: "rgba(201,175,166,.45)", letterSpacing: ".2em" }}>{lang === "ru" ? "Назад" : "Back"}</span>
          </div>
        )}
        {isLast ? (
          <div style={{ display: "flex", flexDirection: "column", gap: SP.sm }}>
            <div onClick={() => canNext && onDone("register")} style={{
              width: "100%", padding: SP.lg, borderRadius: RAD.xxl || 28, textAlign: "center",
              cursor: canNext ? "pointer" : "default",
              background: canNext ? "linear-gradient(135deg, rgba(178,70,31,.7) 0%, rgba(227,154,60,.55) 45%, rgba(208,86,42,.55) 100%)" : "rgba(255,255,255,.03)",
              border: `1.5px solid ${canNext ? "rgba(208,86,42,.6)" : "rgba(255,255,255,.07)"}`,
              backdropFilter: "blur(20px)",
              boxShadow: canNext ? "0 0 40px rgba(178,70,31,.4), 0 0 80px rgba(208,86,42,.2), inset 0 1px 0 rgba(255,255,255,.08)" : "none",
              ...label(TYPE.xs), fontWeight: 400, letterSpacing: ".28em",
              color: canNext ? "rgba(247,239,230,.96)" : `rgba(247,239,230,${OP.disabled})`,
              opacity: canNext ? 1 : 0.4, transition: EASE.normal,
            }}>{lang === "ru" ? "СОЗДАТЬ АККАУНТ →" : "CREATE ACCOUNT →"}</div>
            <div onClick={() => canNext && onDone("login")} style={{
              width: "100%", padding: `${SP.md + 2}px`, textAlign: "center",
              cursor: canNext ? "pointer" : "default",
              ...label(TYPE.xs), letterSpacing: ".2em",
              color: canNext ? "rgba(201,175,166,.7)" : `rgba(201,175,166,.25)`,
              opacity: canNext ? 1 : 0.4, transition: EASE.normal,
            }}>{lang === "ru" ? "Уже есть аккаунт → Войти" : "Already have an account → Log in"}</div>
          </div>
        ) : (
          <div onClick={() => canNext && setStep((s) => s + 1)} style={{
            width: "100%", padding: SP.lg, borderRadius: RAD.xxl || 28, textAlign: "center",
            cursor: canNext ? "pointer" : "default",
            background: canNext ? "linear-gradient(135deg, rgba(178,70,31,.7) 0%, rgba(227,154,60,.55) 45%, rgba(208,86,42,.55) 100%)" : "rgba(255,255,255,.03)",
            border: `1.5px solid ${canNext ? "rgba(208,86,42,.6)" : "rgba(255,255,255,.07)"}`,
            backdropFilter: "blur(20px)",
            boxShadow: canNext ? "0 0 40px rgba(178,70,31,.4), 0 0 80px rgba(208,86,42,.2), inset 0 1px 0 rgba(255,255,255,.08)" : "none",
            ...label(TYPE.xs), fontWeight: 400, letterSpacing: ".28em",
            color: canNext ? "rgba(247,239,230,.96)" : `rgba(247,239,230,${OP.disabled})`,
            opacity: canNext ? 1 : 0.4, transition: EASE.normal,
          }}>{cur.type === "splash" ? TX.enter : TX.next}</div>
        )}
      </div>
    </div>
  );
}
