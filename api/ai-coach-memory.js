import Anthropic from "@anthropic-ai/sdk";
import { requireUser } from "./_lib/auth.js";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Keeps a short, private, ever-updating profile of the coaching relationship —
// never shown to the user directly, only fed back into the coach's system
// prompt (see buildContextNote in ai-chat.js) so it can pick up her arc across
// sessions instead of starting cold every time she opens the chat.
const SYSTEM = {
  ru: `Ты ведёшь короткую внутреннюю карточку клиентки для психологического коуча. Тебе дают предыдущую версию карточки и свежий кусок разговора. Обнови карточку: убери то, что уже неактуально или разрешилось, добавь новое, перефразируй по мере необходимости.

Пиши от третьего лица, сухо и по делу, не для чтения клиенткой — только для внутреннего использования коучем. Не больше 120 слов.

Структура (не показывай заголовки, просто слитный текст в этом порядке):
1. Повторяющиеся темы и ситуации
2. Названные паттерны/убеждения (если коуч их уже называл)
3. Что сдвигается или улучшается
4. Что стоит спросить или к чему вернуться в следующий раз

Если разговор ещё слишком короткий или общий, чтобы что-то содержательное сказать — верни предыдущую карточку почти без изменений или пустую строку.

Отвечай ТОЛЬКО текстом карточки, без вступлений и пояснений.`,
  en: `You maintain a short internal profile card of a client for a psychological coach. You're given the previous version of the card and a fresh chunk of conversation. Update the card: drop what's no longer relevant or already resolved, add what's new, rephrase as needed.

Write in third person, dry and factual — not for the client to read, only for the coach's internal use. No more than 120 words.

Structure (don't show headings, just flowing text in this order):
1. Recurring themes and situations
2. Named patterns/beliefs (if the coach has already named them)
3. What's shifting or improving
4. What's worth asking about or returning to next time

If the conversation is still too short or generic to say anything substantive, return the previous card almost unchanged, or an empty string.

Respond ONLY with the card text, no preamble or explanation.`,
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const user = await requireUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const { messages = [], previousMemory = "", lang = "ru" } = req.body || {};
  if (!messages.length) return res.status(400).json({ error: "No messages" });

  const transcript = messages
    .slice(-16)
    .map((m) => `${m.role === "user" ? "—" : "Коуч"}: ${String(m.content).slice(0, 500)}`)
    .join("\n");

  const userTurn = (lang === "en"
    ? `PREVIOUS CARD:\n${previousMemory || "(empty — first session)"}\n\nRECENT CONVERSATION:\n${transcript}`
    : `ПРЕДЫДУЩАЯ КАРТОЧКА:\n${previousMemory || "(пусто — первая сессия)"}\n\nСВЕЖИЙ РАЗГОВОР:\n${transcript}`
  ).slice(0, 6000);

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      system: SYSTEM[lang] || SYSTEM.ru,
      messages: [{ role: "user", content: userTurn }],
    });

    res.json({ memory: response.content[0].text.trim() });
  } catch (e) {
    console.error("ai-coach-memory error:", e);
    res.status(500).json({ error: "AI unavailable" });
  }
}
