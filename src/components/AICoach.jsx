import { useState, useRef, useEffect } from "react";
import { TYPE, SP, RAD, EASE, FONT_SERIF, FONT_SANS, label } from "../utils/design";
import { getOverallScore } from "../data/psycap";
import { getActivity } from "../data/activity";

const BG = "linear-gradient(160deg, #0d0618 0%, #130a1e 40%, #0a0d1a 70%, #07030d 100%)";

export default function AICoach({ goBack, lang = "ru" }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: lang === "ru"
        ? "Привет. Я здесь — и слышу тебя. О чём хочешь поговорить сегодня?"
        : "Hi. I'm here — and I hear you. What would you like to talk about today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");

    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const capitalScore = getOverallScore();
      const activity = getActivity();
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          context: { capitalScore, lastActivity: activity?.lastDate },
          lang,
        }),
      });
      if (res.ok) {
        const { message } = await res.json();
        setMessages((m) => [...m, { role: "assistant", content: message }]);
      } else {
        setMessages((m) => [...m, { role: "assistant", content: lang === "ru" ? "Что-то пошло не так. Попробуй ещё раз." : "Something went wrong. Please try again." }]);
      }
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: lang === "ru" ? "Нет связи. Проверь интернет." : "No connection. Check your internet." }]);
    }
    setLoading(false);
  }

  return (
    <div style={{ width: "100%", height: "100dvh", background: BG, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      {/* Orbs */}
      <div style={{ position: "absolute", top: -60, right: -40, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(159,110,220,.2) 0%, transparent 70%)", filter: "blur(50px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 100, left: -40, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(230,77,168,.15) 0%, transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />

      {/* Header */}
      <div style={{ padding: `max(${SP.xxl}px, env(safe-area-inset-top, ${SP.xxl}px)) ${SP.xl}px ${SP.lg}px`, flexShrink: 0, borderBottom: "1px solid rgba(255,255,255,.05)", backdropFilter: "blur(10px)", position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: SP.md }}>
          <div onClick={goBack} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16, color: "rgba(200,180,220,.7)" }}>←</div>
          <div>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 20, color: "rgba(245,235,230,.92)", fontWeight: 300 }}>
              {lang === "ru" ? "Анастасия" : "Anastasia"}
            </div>
            <div style={{ ...label(TYPE.xs - 1), color: "rgba(159,110,220,.6)", letterSpacing: ".2em" }}>
              {lang === "ru" ? "ИИ-коуч · LuxMind" : "AI coach · LuxMind"}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: `${SP.xl}px ${SP.xl}px`, display: "flex", flexDirection: "column", gap: SP.md, position: "relative", zIndex: 1 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", animation: "fadeUp .3s ease both" }}>
            {m.role === "assistant" && (
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, rgba(159,110,220,.5), rgba(230,77,168,.4))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginRight: SP.sm, marginTop: 4, fontSize: 12 }}>✦</div>
            )}
            <div style={{
              maxWidth: "78%",
              padding: `${SP.md + 2}px ${SP.lg}px`,
              borderRadius: m.role === "user" ? `${RAD.lg}px ${RAD.lg}px 4px ${RAD.lg}px` : `${RAD.lg}px ${RAD.lg}px ${RAD.lg}px 4px`,
              background: m.role === "user"
                ? "linear-gradient(135deg, rgba(210,55,140,.35), rgba(159,110,220,.25))"
                : "rgba(255,255,255,.05)",
              border: `1px solid ${m.role === "user" ? "rgba(210,55,140,.3)" : "rgba(255,255,255,.08)"}`,
              fontFamily: FONT_SANS, fontSize: TYPE.sm + 1, fontWeight: 300, lineHeight: 1.65,
              color: "rgba(240,228,240,.88)",
              backdropFilter: "blur(10px)",
            }}>
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: SP.sm, animation: "fadeUp .3s ease both" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, rgba(159,110,220,.5), rgba(230,77,168,.4))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 12 }}>✦</div>
            <div style={{ padding: `${SP.md}px ${SP.lg}px`, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)", borderRadius: `${RAD.lg}px ${RAD.lg}px ${RAD.lg}px 4px` }}>
              <div style={{ display: "flex", gap: 5 }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(159,110,220,.6)", animation: `breathe 1.2s ${i * 0.2}s ease-in-out infinite` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: `${SP.md}px ${SP.xl}px`, paddingBottom: `max(${SP.xl}px, env(safe-area-inset-bottom, ${SP.xl}px))`, borderTop: "1px solid rgba(255,255,255,.05)", background: "rgba(7,3,13,.8)", backdropFilter: "blur(20px)", flexShrink: 0, display: "flex", gap: SP.sm, alignItems: "flex-end", position: "relative", zIndex: 2 }}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => { setInput(e.target.value); e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"; }}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder={lang === "ru" ? "Напиши что-нибудь..." : "Write something..."}
          rows={1}
          style={{ flex: 1, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", borderRadius: RAD.lg, padding: `${SP.md}px ${SP.lg}px`, fontFamily: FONT_SANS, fontSize: TYPE.sm + 1, fontWeight: 300, color: "rgba(240,228,240,.88)", outline: "none", resize: "none", lineHeight: 1.5, caretColor: "rgba(230,77,168,.8)", WebkitAppearance: "none", colorScheme: "dark", maxHeight: 120 }}
        />
        <div onClick={send} style={{ width: 42, height: 42, borderRadius: "50%", background: input.trim() && !loading ? "linear-gradient(135deg, rgba(210,55,140,.7), rgba(159,110,220,.6))" : "rgba(255,255,255,.06)", border: `1px solid ${input.trim() && !loading ? "rgba(210,55,140,.5)" : "rgba(255,255,255,.1)"}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: input.trim() && !loading ? "pointer" : "default", transition: EASE.normal, flexShrink: 0, fontSize: 16, color: "rgba(245,235,230,.9)" }}>
          {loading ? "·" : "↑"}
        </div>
      </div>
    </div>
  );
}
