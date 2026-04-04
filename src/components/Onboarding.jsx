import { useState } from "react";
import { PERSONAL_CONTENT } from "../data/content";
import { FONT_SERIF, FONT_SANS } from "../utils/helpers";

export default function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const [ans, setAns] = useState({});
  const [agreed, setAgreed] = useState(false);

  const steps = [
    { type: "splash" },
    { type: "info", ey: "женский капитал", hl: "Это то,\nиз чего\nвы живёте", body: "То, как вы любите, творите, притягиваете — это отражение вашего внутреннего капитала.", tags: ["Энергия", "Ценность", "Женственность", "Получение"] },
    { type: "info", ey: "когда он растёт", hl: "Меняется\nне состояние.\nМеняется жизнь", body: "Отношения, деньги, самоощущение — всё начинает двигаться, когда внутри есть ресурс." },
    { type: "info", ey: "для чего Frisson", hl: "Укреплять\nкапитал\nкаждый день", body: "Медитации, дневник, навигатор ситуаций — всё, чтобы расти изнутри." },
    { type: "info", ey: "добро пожаловать", hl: "Ваше внутреннее\nстановится\nосновой\nновой жизни", body: "Добро пожаловать в Frisson." },
    { type: "q", q: "Как ты себя чувствуешь прямо сейчас?", opts: ["Я устала — нужна тишина и восполнение", "Я в поиске — хочу понять, чего хочу", "Я чувствую силу — хочу расти дальше", "Мне тревожно — нужна опора"], key: "feeling" },
    { type: "q", q: "Что привело тебя сюда?", opts: ["Хочу лучше понять себя и свои желания", "Хочу восстановить энергию и ресурс", "Хочу почувствовать свою ценность", "Хочу раскрыть свою женственность и притяжение"], key: "r" },
    { type: "personal" },
    { type: "consent" },
  ];

  const cur = steps[step];
  const isLast = step === steps.length - 1;
  const canNext = (cur.type !== "q" || (cur.key && ans[cur.key])) && (cur.type !== "consent" || agreed);

  return (
    <div style={{ width: "100%", height: "100vh", background: "#080A06", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      {/* Background orbs */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", width: "78%", height: "78%", top: "-18%", left: "-18%", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(148,74,145,.12), transparent 70%)" }} />
        <div style={{ position: "absolute", width: "65%", height: "65%", bottom: "-12%", right: "-10%", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(184,64,16,.08), transparent 70%)" }} />
        <div style={{ position: "absolute", width: "40%", height: "40%", top: "28%", left: "32%", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(160,138,65,.06), transparent 70%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 40%, rgba(20,12,24,.0), rgba(8,10,6,1) 75%)" }} />
        {Array.from({ length: 50 }, (_, i) => (
          <div key={i} style={{
            position: "absolute",
            left: `${(i * 37) % 100}%`,
            top: `${(i * 53) % 100}%`,
            width: Math.random() * 2 + 1,
            height: Math.random() * 2 + 1,
            borderRadius: "50%",
            background: "rgba(200,180,160,.15)",
            animation: `shimmer ${3 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }} />
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 28px 20px", position: "relative", zIndex: 1 }}>
        {/* Progress dots */}
        {step > 0 && (
          <div style={{ display: "flex", gap: 6, marginBottom: 36, animation: "fadeUp .3s ease both" }}>
            {steps.map((_, i) => (
              <div key={i} style={{ width: i === step ? 18 : 6, height: 6, borderRadius: 3, background: i <= step ? "rgba(200,160,180,.5)" : "rgba(200,160,180,.12)", transition: "all .4s" }} />
            ))}
          </div>
        )}

        {/* Splash */}
        {cur.type === "splash" && (
          <div style={{ textAlign: "center", width: "100%", animation: "fadeUp .8s ease both" }}>
            <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".35em", textTransform: "uppercase", color: "rgba(200,160,180,.45)", marginBottom: 20 }}>женский психологический капитал</div>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 80, fontWeight: 300, lineHeight: .9, color: "#fff", textShadow: "0 0 60px rgba(148,74,145,.2)" }}>Frisson</div>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 17, color: "rgba(220,205,215,.62)", letterSpacing: ".08em", marginTop: 16 }}>Путь к себе настоящей</div>
          </div>
        )}

        {/* Info screens */}
        {cur.type === "info" && (
          <div style={{ textAlign: "center", width: "100%", animation: "fadeUp .4s ease both" }}>
            <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".32em", textTransform: "uppercase", color: "rgba(200,160,180,.4)", marginBottom: 18 }}>{cur.ey}</div>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 46, fontWeight: 300, lineHeight: 1.08, color: "rgba(242,232,226,.95)", whiteSpace: "pre-line", marginBottom: 24 }}>{cur.hl}</div>
            <div style={{ fontFamily: FONT_SANS, fontSize: 13, fontWeight: 300, lineHeight: 1.85, color: "rgba(220,205,215,.55)", maxWidth: 320, margin: "0 auto" }}>{cur.body}</div>
            {cur.tags && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7, justifyContent: "center", marginTop: 22 }}>
                {cur.tags.map((t) => (
                  <div key={t} style={{ padding: "6px 14px", borderRadius: 20, background: "rgba(148,74,145,.1)", border: "1px solid rgba(148,74,145,.2)", fontFamily: FONT_SANS, fontSize: 11, color: "rgba(200,160,180,.65)" }}>{t}</div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Question screens */}
        {cur.type === "q" && (
          <div style={{ width: "100%", animation: "fadeUp .5s ease both" }}>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 24, color: "rgba(240,232,235,.95)", textAlign: "center", marginBottom: 28, lineHeight: 1.3 }}>{cur.q}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {cur.opts.map((opt, oi) => (
                <div key={opt} onClick={() => setAns((a) => ({ ...a, [cur.key]: opt }))} className="pc" style={{
                  padding: "16px 20px",
                  borderRadius: 16,
                  background: ans[cur.key] === opt ? "rgba(148,74,145,.18)" : "rgba(255,255,255,.04)",
                  border: `1px solid ${ans[cur.key] === opt ? "rgba(200,120,180,.4)" : "rgba(255,255,255,.06)"}`,
                  fontFamily: FONT_SERIF,
                  fontSize: 15,
                  color: ans[cur.key] === opt ? "rgba(240,220,230,.95)" : "rgba(220,210,215,.6)",
                  cursor: "pointer",
                  transition: "all .3s",
                }}>
                  {opt}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Personal response */}
        {cur.type === "personal" && ans.r && PERSONAL_CONTENT[ans.r] && (() => {
          const c = PERSONAL_CONTENT[ans.r];
          return (
            <div style={{ width: "100%", animation: "fadeUp .6s ease both" }}>
              <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".28em", textTransform: "uppercase", color: "rgba(200,160,180,.4)", marginBottom: 22, textAlign: "center" }}>подобрано для тебя</div>
              {[{ l: "я слышу тебя", t: c.v }, { l: "что изменится", t: c.s }, { l: "от анастасии", t: c.a }].map((item) => (
                <div key={item.l} style={{ marginBottom: 18 }}>
                  <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(200,160,180,.35)", marginBottom: 6 }}>{item.l}</div>
                  <div style={{ fontFamily: FONT_SERIF, fontSize: 15, lineHeight: 1.78, color: "rgba(255,238,228,.75)" }}>{item.t}</div>
                </div>
              ))}
              <div style={{ padding: 16, background: "rgba(0,0,0,.2)", border: "1px solid rgba(255,235,225,.08)", borderRadius: 14, marginTop: 8 }}>
                <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(200,160,180,.35)", marginBottom: 10 }}>в frisson для тебя</div>
                {c.p.map((p) => (
                  <div key={p} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(200,160,180,.4)" }} />
                    <div style={{ fontFamily: FONT_SERIF, fontSize: 14, color: "rgba(255,235,225,.88)" }}>{p}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Consent */}
        {cur.type === "consent" && (
          <div style={{ width: "100%", animation: "fadeUp .6s ease both" }}>
            <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".3em", textTransform: "uppercase", color: "rgba(200,160,180,.35)", marginBottom: 16, textAlign: "center" }}>перед началом</div>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 32, fontWeight: 300, color: "rgba(245,235,230,.95)", textAlign: "center", marginBottom: 28, lineHeight: 1.2 }}>Ваше согласие</div>
            {[
              "Сервис Frisson — образовательная платформа. Не является медицинским учреждением и не заменяет психотерапию.",
              "Обработка данных осуществляется согласно Регламенту ЕС 2016/679 (GDPR). Данные хранятся на серверах ЕС.",
              "Записи дневника и результаты тестов доступны исключительно вам. Не используются в маркетинге.",
              "Вы вправе в любой момент запросить выгрузку, исправление или удаление своих данных.",
            ].map((txt, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "13px 16px", background: "rgba(255,255,255,.02)", borderRadius: 12, marginBottom: 8 }}>
                <div style={{ fontFamily: FONT_SERIF, fontSize: 16, color: "rgba(200,160,180,.5)", flexShrink: 0, width: 20 }}>{["◇", "◈", "○", "✦"][i]}</div>
                <div style={{ fontFamily: FONT_SANS, fontSize: 13, fontWeight: 300, color: "rgba(220,205,215,.72)", lineHeight: 1.65 }}>{txt}</div>
              </div>
            ))}
            <div onClick={() => setAgreed((a) => !a)} style={{ display: "flex", alignItems: "flex-start", gap: 14, marginTop: 20, cursor: "pointer", padding: "0 4px" }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, border: `1.5px solid ${agreed ? "rgba(200,120,180,.6)" : "rgba(255,255,255,.15)"}`, background: agreed ? "rgba(148,74,145,.3)" : "transparent", flexShrink: 0, transition: "all .3s", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {agreed && <span style={{ color: "rgba(240,220,230,.9)", fontSize: 12 }}>✓</span>}
              </div>
              <div style={{ fontFamily: FONT_SANS, fontSize: 13, fontWeight: 300, lineHeight: 1.65, color: "rgba(220,205,215,.6)" }}>Я ознакомилась с условиями и даю согласие на обработку данных</div>
            </div>
          </div>
        )}
      </div>

      {/* Button */}
      <div style={{ padding: "0 28px 32px", position: "relative", zIndex: 2 }}>
        <div
          onClick={() => canNext && (isLast ? onDone() : setStep((s) => s + 1))}
          style={{
            width: "100%",
            padding: 17,
            borderRadius: 16,
            textAlign: "center",
            background: canNext ? "linear-gradient(135deg, rgba(148,74,145,.5), rgba(184,64,16,.35))" : "rgba(255,255,255,.04)",
            border: `1px solid ${canNext ? "rgba(200,120,180,.3)" : "rgba(255,255,255,.06)"}`,
            fontFamily: FONT_SANS,
            fontSize: 13,
            letterSpacing: ".12em",
            textTransform: "uppercase",
            color: canNext ? "rgba(245,235,230,.9)" : "rgba(242,232,226,.2)",
            cursor: canNext ? "pointer" : "default",
            transition: "all .4s",
          }}
        >
          {isLast ? "Начать" : step === 0 ? "Начать путь" : "Далее"}
        </div>
      </div>
    </div>
  );
}
