import { recommendedPractices } from '../data/practiceCatalog.js';
import { userStorage as localStorage, getActiveUser } from "../lib/userStorage.js";
import { useState, useRef, useEffect } from "react";
import { TYPE, SP, RAD, EASE, FONT_SERIF, FONT_SANS, label } from "../utils/design";
import { authHeader } from "../lib/supabase";
import { getPsycap } from "../data/psycap";

const BG = "linear-gradient(160deg,#120B18 0%,#2A1A3A 48%,#0E0810 100%)";
const STORAGE_KEY = "lux_coach_history";
const MEMORY_KEY = "lux_coach_memory";
const MAX_SAVED = 40;
// How often (in user turns) to silently refresh the cross-session memory card
// during a single long conversation — on top of the refresh that always
// happens when she leaves the chat (see the unmount effect below).
const MEMORY_REFRESH_EVERY = 6;

const GREETING = {
  ru: "Привет. Я здесь — и слышу тебя. О чём хочешь поговорить сегодня?",
  en: "Hi. I'm here — and I hear you. What would you like to talk about today?",
};

function stripMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/_(.*?)_/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/`(.*?)`/g, "$1")
    .trim();
}

function loadHistory(lang) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [{ role: "assistant", content: GREETING[lang] || GREETING.ru }];
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {}
  return [{ role: "assistant", content: GREETING[lang] || GREETING.ru }];
}

function loadMemory() {
  try { return localStorage.getItem(MEMORY_KEY) || ""; } catch { return ""; }
}

function saveMemory(text) {
  try { if (text) localStorage.setItem(MEMORY_KEY, text); } catch {}
}

// Current psychological capital scores (0-100 per axis), read straight from
// the local tracker — sent alongside chat requests so the coach responds to
// where she actually is, not a blank slate.
function buildPsycapContext() {
  try {
    return getPsycap()?.axes || null;
  } catch {
    return null;
  }
}

export default function AICoach({ goBack, goToMed, lang = "ru" }) {
  const owner = useRef(getActiveUser()).current;
  const memoryRequest = useRef(0);
  const [messages, setMessages] = useState(() => loadHistory(lang));
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const alive = useRef(true);
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function saveHistory(msgs) {
    if (!alive.current || getActiveUser() !== owner) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs.slice(-MAX_SAVED)));
    } catch {}
  }

  function clearHistory() {
    const fresh = [{ role: "assistant", content: GREETING[lang] || GREETING.ru }];
    setMessages(fresh);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }

  // Fire-and-forget: asks the model to fold the recent exchange into her
  // running memory card. Never blocks the UI — if it fails, the next trigger
  // just tries again from the same previousMemory.
  function refreshMemory(msgs) {
    if (getActiveUser() !== owner) return;
    const requestId = ++memoryRequest.current;
    const previousMemory = loadMemory();
    if (msgs.filter((m) => m.role === "user").length < 1) return;
    (async () => {
      try {
        const res = await fetch("/api/ai-coach-memory", {
          method: "POST",
          headers: { "Content-Type": "application/json", ...(await authHeader(owner)) },
          body: JSON.stringify({ messages: msgs, previousMemory, lang }),
        });
        if (res.ok) {
          const { memory } = await res.json();
          if (memory && getActiveUser() === owner && memoryRequest.current === requestId) saveMemory(memory);
        }
      } catch {}
    })();
  }

  // Keep the latest messages reachable from the unmount effect below without
  // re-subscribing it on every keystroke/message.
  const messagesRef = useRef(messages);
  useEffect(() => { messagesRef.current = messages; }, [messages]);

  // Covers every way of leaving the chat — the header back button, the
  // App-level swipe-back gesture, or switching tabs — not just one of them.
  // Refresh on explicit navigation, not account teardown: never send A's conversation under B's session.
  const leaveChat = () => { refreshMemory(messagesRef.current); goBack(); };

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");

    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    saveHistory(newMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(await authHeader(owner)) },
        body: JSON.stringify({
          messages: newMessages,
          lang,
          context: { memory: loadMemory(), psycap: buildPsycapContext() },
        }),
      });
      if (!alive.current || getActiveUser() !== owner) return;
      if (res.ok) {
        const { message } = await res.json();
        const clean = stripMarkdown(message);
        const updated = [...newMessages, { role: "assistant", content: clean }];
        setMessages(updated);
        saveHistory(updated);
        const userTurns = updated.filter((m) => m.role === "user").length;
        if (userTurns > 0 && userTurns % MEMORY_REFRESH_EVERY === 0) refreshMemory(updated);
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
      <div style={{ position: "absolute", top: -60, right: -40, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(142,118,184,.2) 0%, transparent 70%)", filter: "blur(50px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 100, left: -40, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(227,154,60,.15) 0%, transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />

      {/* Header */}
      <div style={{ padding: `max(${SP.xxl}px, env(safe-area-inset-top, ${SP.xxl}px)) ${SP.xl}px ${SP.lg}px`, flexShrink: 0, borderBottom: "1px solid rgba(255,255,255,.05)", backdropFilter: "blur(10px)", position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: SP.md }}>
          <div onClick={leaveChat} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16, color: "rgba(185,169,218,.7)" }}>←</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 20, color: "rgba(247,239,230,.92)", fontWeight: 300 }}>
              {lang === "ru" ? "Анастасия" : "Anastasia"}
            </div>
            <div style={{ ...label(TYPE.xs - 1), color: "rgba(142,118,184,.6)", letterSpacing: ".2em" }}>
              {lang === "ru" ? "ИИ-коуч · NECTAR" : "AI coach · NECTAR"}
            </div>
          </div>
          <div onClick={clearHistory} style={{ fontSize: 11, fontFamily: FONT_SANS, color: "rgba(255,255,255,.2)", cursor: "pointer", padding: `${SP.xs}px ${SP.sm}px`, borderRadius: SP.sm }}>
            {lang === "ru" ? "очистить" : "clear"}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: `${SP.xl}px ${SP.xl}px`, display: "flex", flexDirection: "column", gap: SP.md, position: "relative", zIndex: 1 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            {m.role === "assistant" && (
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, rgba(142,118,184,.5), rgba(227,154,60,.4))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginRight: SP.sm, marginTop: 4, fontSize: 12 }}>✦</div>
            )}
            <div style={{
              maxWidth: "78%",
              padding: `${SP.md + 2}px ${SP.lg}px`,
              borderRadius: m.role === "user" ? `${RAD.lg}px ${RAD.lg}px 4px ${RAD.lg}px` : `${RAD.lg}px ${RAD.lg}px ${RAD.lg}px 4px`,
              background: m.role === "user" ? "linear-gradient(135deg, rgba(178,70,31,.35), rgba(142,118,184,.25))" : "rgba(255,255,255,.05)",
              border: `1px solid ${m.role === "user" ? "rgba(178,70,31,.3)" : "rgba(255,255,255,.08)"}`,
              fontFamily: FONT_SANS, fontSize: TYPE.sm + 1, fontWeight: 300, lineHeight: 1.7,
              color: "rgba(247,239,230,.88)",
              backdropFilter: "blur(10px)",
              whiteSpace: "pre-wrap",
            }}>
              {m.content}
              {m.role === 'assistant' && recommendedPractices(m.content, lang).map(med => <button key={med.id} type="button" onClick={() => goToMed?.(med.id, 'coach')} style={{ display: 'block', width: '100%', textAlign: 'left', marginTop: 12, padding: '12px 14px', borderRadius: 14, border: '1px solid rgba(227,154,60,.35)', background: 'rgba(227,154,60,.1)', color: '#f7efe6', cursor: 'pointer', fontFamily: FONT_SANS, lineHeight: 1.5 }}>
                <span style={{ display: 'block', fontSize: 12, color: '#e39a3c' }}>{lang === 'ru' ? 'Открыть практику' : 'Open practice'} →</span>{med.title}
              </button>)}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: SP.sm }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, rgba(142,118,184,.5), rgba(227,154,60,.4))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 12 }}>✦</div>
            <div style={{ padding: `${SP.md}px ${SP.lg}px`, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)", borderRadius: `${RAD.lg}px ${RAD.lg}px ${RAD.lg}px 4px` }}>
              <div style={{ display: "flex", gap: 5 }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(142,118,184,.6)", animation: `breathe 1.2s ${i * 0.2}s ease-in-out infinite` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: `${SP.md}px ${SP.xl}px`, paddingBottom: `max(${SP.xl}px, env(safe-area-inset-bottom, ${SP.xl}px))`, borderTop: "1px solid rgba(255,255,255,.05)", background: "rgba(14,8,16,.8)", backdropFilter: "blur(20px)", flexShrink: 0, display: "flex", gap: SP.sm, alignItems: "flex-end", position: "relative", zIndex: 2 }}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => { setInput(e.target.value); e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"; }}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder={lang === "ru" ? "Напиши что-нибудь..." : "Write something..."}
          rows={1}
          style={{ flex: 1, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", borderRadius: RAD.lg, padding: `${SP.md}px ${SP.lg}px`, fontFamily: FONT_SANS, fontSize: TYPE.sm + 1, fontWeight: 300, color: "rgba(247,239,230,.88)", outline: "none", resize: "none", lineHeight: 1.5, caretColor: "rgba(227,154,60,.8)", WebkitAppearance: "none", colorScheme: "dark", maxHeight: 120 }}
        />
        <div onClick={send} style={{ width: 42, height: 42, borderRadius: "50%", background: input.trim() && !loading ? "linear-gradient(135deg, rgba(178,70,31,.7), rgba(142,118,184,.6))" : "rgba(255,255,255,.06)", border: `1px solid ${input.trim() && !loading ? "rgba(178,70,31,.5)" : "rgba(255,255,255,.1)"}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: input.trim() && !loading ? "pointer" : "default", transition: EASE.normal, flexShrink: 0, fontSize: 16, color: "rgba(247,239,230,.9)" }}>
          {loading ? "·" : "↑"}
        </div>
      </div>
    </div>
  );
}
