import { useState } from "react";
import { getPersonalContent } from "../data/content";
import { FONT_SERIF, FONT_SANS, TYPE, SP, RAD, OP, EASE, tx, label, body, heading } from "../utils/design";
import { VERSION } from "../App";
import { t as tr } from "../utils/i18n";

const STEPS = {
  ru: [
    { type: "splash" },
    { type: "info", ey: "женский капитал", hl: "Это то,\nиз чего\nвы живёте", body: "То, как вы любите, выбираете,\nчувствуете и создаёте реальность" },
    { type: "info", ey: "когда он растёт", hl: "Меняется\nне состояние.\nМеняется жизнь", body: "Отношения. Опора. Способность\nпринимать и создавать свою норму" },
    { type: "info", ey: "для чего Frisson", hl: "Укреплять\nкапитал\nкаждый день", body: "Медитации, практики, дневник\nи трекинг состояния", tags: ["Опору", "Спокойствие", "Наполненность", "Женственность", "Силу", "Выход из тревоги"] },
    { type: "info", ey: "добро пожаловать", hl: "Ваше внутреннее\nстановится\nосновой\nновой жизни", body: "Создано Магистром Клинической Психологии\nАнастасией Званок" },
    { type: "q", q: "Как ты себя чувствуешь прямо сейчас?", opts: ["Я устала — нужна тишина и восполнение", "Я ищу себя и хочу вспомнить свою силу", "Я в тревоге — хочу обрести покой", "Я готова расцветать и идти дальше"], key: "f" },
    { type: "q", q: "Что привело тебя сюда?", opts: ["Хочу лучше понять себя и свои желания", "Хочу восстановить энергию и ресурс", "Хочу почувствовать свою ценность", "Хочу раскрыть свою женственность и притяжение"], key: "r" },
    { type: "personal" },
    { type: "consent" },
  ],
  en: [
    { type: "splash" },
    { type: "info", ey: "feminine capital", hl: "It's what\nyou live\nfrom", body: "How you love, choose,\nfeel and create reality" },
    { type: "info", ey: "when it grows", hl: "Not the state\nchanges.\nLife changes", body: "Relationships. Support. The ability\nto receive and create your norm" },
    { type: "info", ey: "what Frisson is for", hl: "Grow your\ncapital\nevery day", body: "Meditations, practices, journal\nand state tracking", tags: ["Support", "Calm", "Fullness", "Femininity", "Strength", "Leaving anxiety"] },
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
    consent1: "Сервис Frisson — образовательная платформа. Не является медицинским учреждением и не заменяет работу с лицензированным специалистом.",
    consent2: "Обработка данных осуществляется согласно Регламенту ЕС 2016/679 (GDPR). Данные хранятся на защищённых серверах в пределах ЕС.",
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
    consent1: "The Frisson service is an educational platform. It is not a medical institution and does not replace work with a licensed specialist.",
    consent2: "Data processing is carried out in accordance with EU Regulation 2016/679 (GDPR). Data is stored on secure servers within the EU.",
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

export default function Onboarding({ onDone, lang = "ru", setLang }) {
  const [step, setStep] = useState(0);
  const [ans, setAns] = useState({});
  const [agreed, setAgreed] = useState(false);

  const steps = STEPS[lang] || STEPS.ru;
  const TX = TEXT[lang] || TEXT.ru;
  const PERSONAL = getPersonalContent(lang);

  const cur = steps[step];
  const isLast = step === steps.length - 1;
  const canNext = (cur.type !== "q" || (cur.key && ans[cur.key])) && (cur.type !== "consent" || agreed);

  return (
    <div style={{ width: "100%", height: "100dvh", background: "linear-gradient(165deg, #1a0418 0%, #2a1408 50%, #0c0820 100%)", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", width: "78%", height: "78%", top: "-18%", left: "-18%", borderRadius: "50%", background: "radial-gradient(circle,rgba(230,77,168,.8),rgba(159,123,216,.5) 55%,transparent 72%)", filter: "blur(55px)", animation: "onbDrift1 24s ease-in-out infinite" }} />
        <div style={{ position: "absolute", width: "65%", height: "65%", bottom: "-12%", right: "-10%", borderRadius: "50%", background: "radial-gradient(circle,rgba(240,136,56,.7),rgba(208,128,176,.5) 55%,transparent 72%)", filter: "blur(50px)", animation: "onbDrift2 28s 4s ease-in-out infinite" }} />
        <div style={{ position: "absolute", width: "40%", height: "40%", top: "28%", left: "32%", borderRadius: "50%", background: "radial-gradient(circle,rgba(255,175,50,.55),rgba(159,123,216,.3) 55%,transparent 72%)", filter: "blur(44px)", animation: "onbDrift3 18s 7s ease-in-out infinite" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 45%,transparent 18%,rgba(8,4,16,.78) 100%)" }} />

        {Array.from({ length: 60 }, (_, i) => {
          const size = 1 + (i % 4) * 0.7;
          const dur = 8 + (i % 7) * 2;
          return (
            <div key={i} style={{
              position: "absolute",
              left: `${(i * 37 + 11) % 100}%`,
              top: `${(i * 53 + 7) % 100}%`,
              width: size, height: size, borderRadius: "50%",
              background: i % 5 === 0 ? "rgba(255,200,220,.7)" : i % 3 === 0 ? "rgba(255,180,120,.6)" : "rgba(255,255,255,.5)",
              boxShadow: `0 0 ${size * 3}px currentColor`,
              color: i % 5 === 0 ? "rgba(230,77,168,.5)" : i % 3 === 0 ? "rgba(240,136,56,.4)" : "rgba(255,255,255,.3)",
              animation: `onbFloat${i % 4} ${dur}s ${(i % 9) * 0.4}s ease-in-out infinite`,
            }} />
          );
        })}

        <img src="./brand/ornament-white.png" alt="" style={{ position: "absolute", top: "10%", right: "8%", width: 64, height: "auto", opacity: 0.06, animation: "onbDrift1 32s ease-in-out infinite", pointerEvents: "none" }} />
        <img src="./brand/ornament-white.png" alt="" style={{ position: "absolute", bottom: "12%", left: "6%", width: 48, height: "auto", opacity: 0.05, animation: "onbDrift2 36s 5s ease-in-out infinite", pointerEvents: "none" }} />
      </div>

      <style>{`
        @keyframes onbDrift1 { 0%, 100% { transform: translate(0, 0) scale(1); } 33% { transform: translate(20px, -30px) scale(1.05); } 66% { transform: translate(-15px, 20px) scale(.98); } }
        @keyframes onbDrift2 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-25px, -20px) scale(1.08); } }
        @keyframes onbDrift3 { 0%, 100% { transform: translate(0, 0) scale(1); opacity: .85; } 50% { transform: translate(30px, 25px) scale(1.12); opacity: 1; } }
        @keyframes onbFloat0 { 0%, 100% { transform: translate(0, 0); opacity: .3; } 50% { transform: translate(15px, -25px); opacity: 1; } }
        @keyframes onbFloat1 { 0%, 100% { transform: translate(0, 0); opacity: .4; } 50% { transform: translate(-20px, -15px); opacity: 1; } }
        @keyframes onbFloat2 { 0%, 100% { transform: translate(0, 0); opacity: .5; } 50% { transform: translate(10px, 30px); opacity: 1; } }
        @keyframes onbFloat3 { 0%, 100% { transform: translate(0, 0); opacity: .35; } 50% { transform: translate(-12px, 18px); opacity: 1; } }
      `}</style>

      {/* Language toggle (on splash step only) */}
      {step === 0 && setLang && (
        <div style={{ position: "absolute", top: SP.page, left: SP.xl, zIndex: 3, display: "flex", gap: 3, background: "rgba(0,0,0,.35)", border: "1px solid rgba(255,255,255,.12)", borderRadius: RAD.md, padding: 3, backdropFilter: "blur(8px)" }}>
          {[["ru", "RU"], ["en", "EN"]].map(([code, short]) => (
            <div key={code} onClick={() => setLang(code)} style={{ padding: `4px 10px`, borderRadius: RAD.sm, cursor: "pointer", background: lang === code ? "rgba(230,77,168,.3)" : "transparent", ...label(TYPE.xs), color: lang === code ? "#fff" : "rgba(255,255,255,.55)" }}>{short}</div>
          ))}
        </div>
      )}

      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: `40px ${SP.xxl - 4}px 0`, position: "relative", zIndex: 2 }}>
        {step > 0 && (
          <div style={{ display: "flex", gap: 6, marginBottom: 36, animation: "fadeUp .3s ease both" }}>
            {steps.slice(1).map((_, i) => (
              <div key={i} style={{ height: SP.xs, borderRadius: 2, transition: EASE.slow, width: step - 1 === i ? SP.xxl - 4 : SP.xs, background: step - 1 === i ? "rgba(180,150,165,.8)" : `rgba(255,255,255,${OP.disabled})` }} />
            ))}
          </div>
        )}

        {cur.type === "splash" && (
          <div style={{ textAlign: "center", width: "100%", animation: "fadeUp 1s ease both" }}>
            <div style={{ ...label(TYPE.sm), color: "rgba(180,150,165,.55)", letterSpacing: ".35em", marginBottom: SP.xl }}>{TX.spaceOfState}</div>
            <img src="./brand/logo-full-white.png" alt="Frisson" style={{ width: "78%", maxWidth: 320, height: "auto", filter: "drop-shadow(0 0 40px rgba(230,77,168,.5)) drop-shadow(0 0 80px rgba(240,136,56,.3))", marginBottom: SP.xl }} />
            <div style={{ fontFamily: FONT_SERIF, fontSize: 20, fontWeight: 300, lineHeight: 1.5, color: `rgba(220,205,215,${OP.primary - 0.05})`, letterSpacing: ".02em", marginBottom: SP.md, padding: `0 ${SP.md}px`, whiteSpace: "pre-line" }}>{TX.tagline}</div>
            <div style={{ ...label(TYPE.xs), color: `rgba(180,150,165,${OP.tertiary})`, letterSpacing: ".14em" }}>v{VERSION}</div>
          </div>
        )}

        {cur.type === "info" && (
          <div style={{ textAlign: "center", width: "100%", animation: "fadeUp .45s ease both" }}>
            <div style={{ ...label(TYPE.sm), color: "rgba(180,150,165,.55)", letterSpacing: ".32em", marginBottom: SP.xxl - 4 }}>{cur.ey}</div>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 52, fontWeight: 300, lineHeight: 1.08, color: `rgba(248,238,232,${OP.primary})`, letterSpacing: ".01em", marginBottom: SP.xl, whiteSpace: "pre-line" }}>{cur.hl}</div>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 18, fontWeight: 300, lineHeight: 1.65, color: `rgba(225,210,220,${OP.secondary + 0.1})`, maxWidth: 320, margin: "0 auto", whiteSpace: "pre-line", marginBottom: cur.tags ? SP.xl : 0 }}>{cur.body}</div>
            {cur.tags && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: SP.sm, justifyContent: "center", maxWidth: 320, margin: "0 auto" }}>
                {cur.tags.map((w) => (
                  <div key={w} style={{ padding: `${SP.sm}px ${SP.md + 2}px`, borderRadius: RAD.lg, background: "rgba(92,14,28,.28)", border: "1px solid rgba(180,100,130,.3)", fontFamily: FONT_SANS, fontSize: TYPE.sm + 1, fontWeight: 300, color: "rgba(230,210,220,.85)" }}>{w}</div>
                ))}
              </div>
            )}
          </div>
        )}

        {cur.type === "q" && (
          <div style={{ width: "100%", animation: "fadeUp .5s ease both" }}>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 28, fontWeight: 300, color: `rgba(248,238,232,${OP.primary})`, textAlign: "center", lineHeight: 1.35, marginBottom: SP.xxl }}>{cur.q}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: SP.md }}>
              {cur.opts.map((opt, oi) => (
                <div key={opt} onClick={() => setAns((a) => ({ ...a, [cur.key]: opt }))} style={{
                  padding: `${SP.lg + 2}px ${SP.page}px`, borderRadius: RAD.lg, textAlign: "center", cursor: "pointer",
                  background: ans[cur.key] === opt ? "rgba(92,14,28,.35)" : "rgba(0,0,0,.28)",
                  border: `1px solid ${ans[cur.key] === opt ? "rgba(220,180,200,.55)" : "rgba(255,255,255,.12)"}`,
                  fontFamily: FONT_SANS, fontSize: TYPE.base + 1, fontWeight: 400, lineHeight: 1.4,
                  color: ans[cur.key] === opt ? "#fff" : "rgba(255,240,232,.82)",
                  boxShadow: ans[cur.key] === opt ? "0 0 24px rgba(230,77,168,.2)" : "none",
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
              <div style={{ ...label(TYPE.xs), color: `rgba(180,150,165,${OP.secondary})`, letterSpacing: ".28em", textAlign: "center", marginBottom: SP.xl - 2 }}>{TX.onlyForYou}</div>
              {[{ l: TX.iHearYou, t: c.v }, { l: TX.whatChanges, t: c.s }, { l: TX.fromAnastasia, t: c.a }].map((x) => (
                <div key={x.l} style={{ padding: SP.lg + 2, background: "rgba(0,0,0,.3)", border: "1px solid rgba(255,230,215,.15)", backdropFilter: "blur(14px)", borderRadius: RAD.lg - 2, marginBottom: SP.sm + 2 }}>
                  <div style={{ ...label(TYPE.xs), color: "rgba(181,200,212,.65)", letterSpacing: ".2em", marginBottom: SP.sm }}>{x.l}</div>
                  <div style={{ ...body(TYPE.base + 1), color: "rgba(255,238,228,.88)" }}>{x.t}</div>
                </div>
              ))}
              <div style={{ padding: SP.lg, background: "rgba(0,0,0,.2)", border: "1px solid rgba(255,230,215,.1)", backdropFilter: "blur(10px)", borderRadius: RAD.md + 2 }}>
                <div style={{ ...label(TYPE.xs), color: "rgba(181,200,212,.65)", letterSpacing: ".2em", marginBottom: SP.sm + 2 }}>{TX.whereToStart}</div>
                {c.p.map((p) => (
                  <div key={p} style={{ display: "flex", alignItems: "center", gap: SP.sm + 2, marginBottom: SP.sm, paddingBottom: SP.sm, borderBottom: `1px solid rgba(255,255,255,${OP.bgSubtle})` }}>
                    <div style={{ width: SP.xs, height: SP.xs, borderRadius: RAD.full, background: "rgba(200,160,180,.6)", flexShrink: 0 }} />
                    <div style={{ ...body(TYPE.base), color: "rgba(255,235,225,.88)" }}>{p}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {cur.type === "consent" && (
          <div style={{ width: "100%", animation: "fadeUp .6s ease both" }}>
            <div style={{ ...label(TYPE.xs), color: "rgba(180,150,165,.5)", letterSpacing: ".3em", textAlign: "center", marginBottom: SP.xxl - 4 }}>{TX.lastStep}</div>
            <div style={{ ...heading(TYPE.xxl + 4), color: `rgba(245,235,230,${OP.primary})`, textAlign: "center", marginBottom: SP.xxl - 4 }}>Frisson</div>
            {[TX.consent1, TX.consent2, TX.consent3, TX.consent4].map((txt, i) => (
              <div key={i} style={{ display: "flex", gap: SP.md, padding: `${SP.md + 1}px ${SP.lg}px`, background: "rgba(0,0,0,.25)", border: "1px solid rgba(255,255,255,.08)", borderRadius: RAD.md, marginBottom: SP.sm + 2 }}>
                <div style={{ fontFamily: FONT_SERIF, fontSize: SP.lg, color: "rgba(200,160,180,.5)", flexShrink: 0, lineHeight: 1.4 }}>◦</div>
                <div style={{ fontFamily: FONT_SANS, fontSize: TYPE.sm + 1, fontWeight: 300, color: "rgba(220,205,215,.72)", lineHeight: 1.65 }}>{txt}</div>
              </div>
            ))}
            <div onClick={() => setAgreed((a) => !a)} style={{ display: "flex", alignItems: "flex-start", gap: SP.md + 2, padding: `${SP.lg}px ${SP.lg + 2}px`, background: agreed ? "rgba(92,14,28,.25)" : "rgba(0,0,0,.2)", border: `1px solid ${agreed ? "rgba(200,160,180,.4)" : "rgba(255,255,255,.1)"}`, borderRadius: RAD.md + 2, cursor: "pointer", transition: EASE.normal, marginTop: SP.sm }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, border: `1.5px solid ${agreed ? "rgba(200,160,180,.7)" : "rgba(255,255,255,.25)"}`, background: agreed ? "rgba(92,14,28,.4)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, transition: EASE.normal }}>{agreed && <div style={{ fontSize: TYPE.sm, color: "rgba(230,210,220,.9)" }}>✓</div>}</div>
              <div style={{ fontFamily: FONT_SANS, fontSize: TYPE.sm + 1, fontWeight: 300, lineHeight: 1.65, color: "rgba(220,205,215,.8)" }}>{TX.agreePre}<span style={{ color: "rgba(200,160,180,.85)", textDecoration: "underline" }}>{TX.userAgreement}</span>{TX.and}<span style={{ color: "rgba(200,160,180,.85)", textDecoration: "underline" }}>{TX.privacy}</span>{TX.agePost}</div>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: `${SP.lg}px ${SP.xxl - 4}px`, paddingBottom: `max(${SP.xl}px, env(safe-area-inset-bottom, ${SP.xl}px))`, position: "relative", zIndex: 2, flexShrink: 0 }}>
        <div onClick={() => canNext && (isLast ? onDone() : setStep((s) => s + 1))} style={{
          width: "100%", padding: SP.lg, borderRadius: RAD.xxl || 28, textAlign: "center",
          cursor: canNext ? "pointer" : "default",
          background: canNext ? "linear-gradient(135deg, rgba(230,77,168,.6), rgba(240,136,56,.5))" : "rgba(255,255,255,.03)",
          border: `1.5px solid ${canNext ? "rgba(240,136,56,.7)" : "rgba(255,255,255,.07)"}`,
          backdropFilter: "blur(16px)",
          boxShadow: canNext ? "0 0 32px rgba(230,77,168,.45), 0 0 60px rgba(240,136,56,.25)" : "none",
          ...label(TYPE.xs), fontWeight: 400, letterSpacing: ".28em",
          color: canNext ? "rgba(245,228,233,.96)" : `rgba(230,218,225,${OP.disabled})`,
          opacity: canNext ? 1 : 0.4, transition: EASE.normal,
        }}>{isLast ? TX.enterSpace : cur.type === "splash" ? TX.enter : TX.next}</div>
      </div>
    </div>
  );
}
