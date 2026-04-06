import { useState } from "react";
import { PERSONAL_CONTENT } from "../data/content";
import { FONT_SERIF, FONT_SANS } from "../utils/helpers";
import { VERSION } from "../App";

export default function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const [ans, setAns] = useState({});
  const [agreed, setAgreed] = useState(false);

  const steps = [
    { type: "splash" },
    { type: "info", ey: "женский капитал", hl: "Это то,\nиз чего\nвы живёте", body: "То, как вы любите, выбираете,\nчувствуете и создаёте реальность" },
    { type: "info", ey: "когда он растёт", hl: "Меняется\nне состояние.\nМеняется жизнь", body: "Отношения. Опора. Способность\nпринимать и создавать свою норму" },
    { type: "info", ey: "для чего Frisson", hl: "Укреплять\nкапитал\nкаждый день", body: "Медитации, практики, дневник\nи трекинг состояния", tags: ["Опору", "Спокойствие", "Наполненность", "Женственность", "Силу", "Выход из тревоги"] },
    { type: "info", ey: "добро пожаловать", hl: "Ваше внутреннее\nстановится\nосновой\nновой жизни", body: "Создано Магистром Клинической Психологии\nАнастасией Званок" },
    { type: "q", q: "Как ты себя чувствуешь прямо сейчас?", opts: ["Я устала — нужна тишина и восполнение", "Я ищу себя и хочу вспомнить свою силу", "Я в тревоге — хочу обрести покой", "Я готова расцветать и идти дальше"], key: "f" },
    { type: "q", q: "Что привело тебя сюда?", opts: ["Хочу лучше понять себя и свои желания", "Хочу восстановить энергию и ресурс", "Хочу почувствовать свою ценность", "Хочу раскрыть свою женственность и притяжение"], key: "r" },
    { type: "personal" },
    { type: "consent" },
  ];

  const cur = steps[step];
  const isLast = step === steps.length - 1;
  const canNext = (cur.type !== "q" || (cur.key && ans[cur.key])) && (cur.type !== "consent" || agreed);

  return (
    <div style={{ width: "100%", height: "100dvh", background: "#080A06", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", width: "78%", height: "78%", top: "-18%", left: "-18%", borderRadius: "50%", background: "radial-gradient(circle,rgba(140,20,100,.85),rgba(80,20,120,.6) 55%,transparent 72%)", filter: "blur(55px)", animation: "breathe 18s ease-in-out infinite" }} />
        <div style={{ position: "absolute", width: "65%", height: "65%", bottom: "-12%", right: "-10%", borderRadius: "50%", background: "radial-gradient(circle,rgba(30,20,120,.75),rgba(100,20,80,.5) 55%,transparent 72%)", filter: "blur(50px)", animation: "breathe 22s 4s ease-in-out infinite" }} />
        <div style={{ position: "absolute", width: "40%", height: "40%", top: "28%", left: "32%", borderRadius: "50%", background: "radial-gradient(circle,rgba(160,20,130,.5),rgba(60,20,160,.3) 55%,transparent 72%)", filter: "blur(44px)", animation: "breathe 14s 7s ease-in-out infinite" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 45%,transparent 18%,rgba(3,2,8,.82) 100%)" }} />
        {Array.from({ length: 50 }, (_, i) => (
          <div key={i} style={{
            position: "absolute",
            left: `${(i * 37 + 11) % 100}%`,
            top: `${(i * 53 + 7) % 100}%`,
            width: 0.8,
            height: 0.8,
            borderRadius: "50%",
            background: `rgba(255,255,255,${0.1 + 0.18 * (i % 5) / 5})`,
            animation: `shimmer ${3 + i % 5}s ${i % 7}s ease-in-out infinite`,
          }} />
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 28px 0", position: "relative", zIndex: 2 }}>
        {step > 0 && (
          <div style={{ display: "flex", gap: 6, marginBottom: 36, animation: "fadeUp .3s ease both" }}>
            {steps.slice(1).map((_, i) => (
              <div key={i} style={{ height: 4, borderRadius: 2, transition: "all .4s", width: step - 1 === i ? 28 : 4, background: step - 1 === i ? "rgba(180,150,165,.8)" : "rgba(255,255,255,.18)" }} />
            ))}
          </div>
        )}

        {cur.type === "splash" && (
          <div style={{ textAlign: "center", width: "100%", animation: "fadeUp 1s ease both" }}>
            <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".35em", textTransform: "uppercase", color: "rgba(180,150,165,.5)", marginBottom: 28 }}>✦ пространство состояния ✦</div>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 80, fontWeight: 300, lineHeight: 0.9, color: "#fff", textShadow: "0 0 60px rgba(160,20,180,.7)", marginBottom: 18 }}>Frisson</div>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 17, color: "rgba(220,205,215,.62)", letterSpacing: ".04em", marginBottom: 12 }}>пространство, где вы раскрываете<br/>свой женский внутренний капитал</div>
            <div style={{ fontFamily: FONT_SANS, fontSize: 9, color: "rgba(180,150,165,.35)", marginBottom: 28 }}>v{VERSION}</div>
          </div>
        )}

        {cur.type === "info" && (
          <div style={{ textAlign: "center", width: "100%", animation: "fadeUp .45s ease both" }}>
            <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".32em", textTransform: "uppercase", color: "rgba(180,150,165,.45)", marginBottom: 28 }}>{cur.ey}</div>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 46, fontWeight: 300, lineHeight: 1.08, color: "rgba(245,235,230,.95)", letterSpacing: ".01em", marginBottom: 26, whiteSpace: "pre-line" }}>{cur.hl}</div>
            <div style={{ fontFamily: FONT_SANS, fontSize: 13, fontWeight: 300, lineHeight: 1.85, color: "rgba(215,200,210,.52)", maxWidth: 270, margin: "0 auto", whiteSpace: "pre-line", marginBottom: cur.tags ? 24 : 0 }}>{cur.body}</div>
            {cur.tags && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7, justifyContent: "center", maxWidth: 280, margin: "0 auto" }}>
                {cur.tags.map((w) => (
                  <div key={w} style={{ padding: "5px 13px", borderRadius: 20, background: "rgba(92,14,28,.25)", border: "1px solid rgba(150,80,100,.25)", fontFamily: FONT_SANS, fontSize: 11, fontWeight: 300, color: "rgba(220,200,210,.7)" }}>{w}</div>
                ))}
              </div>
            )}
          </div>
        )}

        {cur.type === "q" && (
          <div style={{ width: "100%", animation: "fadeUp .5s ease both" }}>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 24, color: "rgba(240,232,235,.95)", textAlign: "center", lineHeight: 1.5, marginBottom: 32, fontWeight: 300 }}>{cur.q}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {cur.opts.map((opt, oi) => (
                <div key={opt} onClick={() => setAns((a) => ({ ...a, [cur.key]: opt }))} style={{
                  padding: "15px 20px", borderRadius: 16, textAlign: "center", cursor: "pointer",
                  background: ans[cur.key] === opt ? "rgba(92,14,28,.3)" : "rgba(0,0,0,.25)",
                  border: `1px solid ${ans[cur.key] === opt ? "rgba(200,160,180,.45)" : "rgba(255,255,255,.1)"}`,
                  fontFamily: FONT_SANS, fontSize: 14, fontWeight: 300,
                  color: ans[cur.key] === opt ? "#fff" : "rgba(255,235,225,.72)",
                  transition: "all .25s", animation: `fadeUp .4s ${oi * 0.08}s ease both`,
                }}>{opt}</div>
              ))}
            </div>
          </div>
        )}

        {cur.type === "personal" && ans.r && PERSONAL_CONTENT[ans.r] && (() => {
          const c = PERSONAL_CONTENT[ans.r];
          return (
            <div style={{ width: "100%", animation: "fadeUp .6s ease both" }}>
              <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".28em", textTransform: "uppercase", color: "rgba(180,150,165,.55)", textAlign: "center", marginBottom: 22 }}>только для тебя</div>
              {[{ l: "я слышу тебя", t: c.v }, { l: "что изменится", t: c.s }, { l: "от анастасии", t: c.a }].map((x) => (
                <div key={x.l} style={{ padding: 18, background: "rgba(0,0,0,.3)", border: "1px solid rgba(255,230,215,.15)", backdropFilter: "blur(14px)", borderRadius: 18, marginBottom: 10 }}>
                  <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(181,200,212,.65)", marginBottom: 8 }}>{x.l}</div>
                  <div style={{ fontFamily: FONT_SERIF, fontSize: 15, lineHeight: 1.78, color: "rgba(255,238,228,.88)" }}>{x.t}</div>
                </div>
              ))}
              <div style={{ padding: 16, background: "rgba(0,0,0,.2)", border: "1px solid rgba(255,230,215,.1)", backdropFilter: "blur(10px)", borderRadius: 16 }}>
                <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(181,200,212,.65)", marginBottom: 10 }}>с чего начать</div>
                {c.p.map((p) => (
                  <div key={p} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, paddingBottom: 8, borderBottom: "1px solid rgba(255,255,255,.06)" }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(200,160,180,.6)", flexShrink: 0 }} />
                    <div style={{ fontFamily: FONT_SERIF, fontSize: 14, color: "rgba(255,235,225,.88)" }}>{p}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {cur.type === "consent" && (
          <div style={{ width: "100%", animation: "fadeUp .6s ease both" }}>
            <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".3em", textTransform: "uppercase", color: "rgba(180,150,165,.5)", textAlign: "center", marginBottom: 28 }}>последний шаг</div>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 32, fontWeight: 300, color: "rgba(245,235,230,.95)", textAlign: "center", marginBottom: 28 }}>Frisson</div>
            {[
              "Сервис Frisson — образовательная платформа. Не является медицинским учреждением и не заменяет работу с лицензированным специалистом.",
              "Обработка данных осуществляется согласно Регламенту ЕС 2016/679 (GDPR). Данные хранятся на защищённых серверах в пределах ЕС.",
              "Записи дневника и результаты тестов доступны исключительно вам. Не используются в коммерческих целях без вашего согласия.",
              "Вы вправе в любой момент запросить выгрузку, исправление или удаление своих данных согласно ст. 17 GDPR.",
            ].map((txt, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "13px 16px", background: "rgba(0,0,0,.25)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, marginBottom: 10 }}>
                <div style={{ fontFamily: FONT_SERIF, fontSize: 16, color: "rgba(200,160,180,.5)", flexShrink: 0, lineHeight: 1.4 }}>◦</div>
                <div style={{ fontFamily: FONT_SANS, fontSize: 13, fontWeight: 300, color: "rgba(220,205,215,.72)", lineHeight: 1.65 }}>{txt}</div>
              </div>
            ))}
            <div onClick={() => setAgreed((a) => !a)} style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "16px 18px", background: agreed ? "rgba(92,14,28,.25)" : "rgba(0,0,0,.2)", border: `1px solid ${agreed ? "rgba(200,160,180,.4)" : "rgba(255,255,255,.1)"}`, borderRadius: 16, cursor: "pointer", transition: "all .3s", marginTop: 8 }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, border: `1.5px solid ${agreed ? "rgba(200,160,180,.7)" : "rgba(255,255,255,.25)"}`, background: agreed ? "rgba(92,14,28,.4)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, transition: "all .3s" }}>{agreed && <div style={{ fontSize: 12, color: "rgba(230,210,220,.9)" }}>✓</div>}</div>
              <div style={{ fontFamily: FONT_SANS, fontSize: 13, fontWeight: 300, lineHeight: 1.65, color: "rgba(220,205,215,.8)" }}>Я ознакомилась и принимаю <span style={{ color: "rgba(200,160,180,.85)", textDecoration: "underline" }}>Пользовательское соглашение</span> и <span style={{ color: "rgba(200,160,180,.85)", textDecoration: "underline" }}>Политику конфиденциальности</span>. Мне исполнилось 18 лет.</div>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: "16px 28px", paddingBottom: "max(24px, env(safe-area-inset-bottom, 24px))", position: "relative", zIndex: 2, flexShrink: 0 }}>
        <div onClick={() => canNext && (isLast ? onDone() : setStep((s) => s + 1))} style={{
          width: "100%", padding: 16, borderRadius: 28, textAlign: "center",
          cursor: canNext ? "pointer" : "default",
          background: canNext ? "rgba(140,20,120,.55)" : "rgba(255,255,255,.03)",
          border: `1.5px solid ${canNext ? "rgba(220,80,200,.7)" : "rgba(255,255,255,.07)"}`,
          backdropFilter: "blur(16px)",
          boxShadow: canNext ? "0 0 32px rgba(160,20,140,.5)" : "none",
          fontFamily: FONT_SANS, fontSize: 10, fontWeight: 400, letterSpacing: ".28em", textTransform: "uppercase",
          color: canNext ? "rgba(245,228,233,.96)" : "rgba(230,218,225,.18)",
          opacity: canNext ? 1 : 0.4, transition: "all .3s",
        }}>{isLast ? "Войти в своё пространство →" : cur.type === "splash" ? "Войти →" : "Дальше →"}</div>
      </div>
    </div>
  );
}
