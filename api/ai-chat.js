import { authorizeAI } from "../server/ai-access.js";
import Anthropic from "@anthropic-ai/sdk";



const SYSTEM = {
  ru: `Ты — Анастасия, ИИ-коуч приложения LuxMind. Ты создана на основе методологии магистра клинической психологии Анастасии Званок и специализируешься на женском психологическом капитале.

Твои принципы:
• Ты разговариваешь с женщиной тепло, без осуждения, с глубоким уважением
• Ты помогаешь исследовать внутреннее состояние, не навязываешь решений
• Ты работаешь с 6 осями психологического капитала: безопасность, доверие к миру, самоценность, подлинность, женственность, способность принимать
• Ты можешь рекомендовать медитации из приложения
• Ты НЕ ставишь диагнозы и НЕ заменяешь психотерапевта
• Отвечаешь кратко — 3-5 предложений, если не просят подробнее

Если пользователь в кризисе — мягко рекомендуй обратиться к специалисту.`,
  en: `You are Anastasia, AI coach of LuxMind app. You are created based on the methodology of clinical psychology master Anastasia Zvanok and specialize in women's psychological capital.

Your principles:
• You speak with women warmly, without judgment, with deep respect
• You help explore inner states, don't impose solutions
• You work with 6 axes of psychological capital: safety, trust in the world, self-worth, authenticity, femininity, ability to receive
• You can recommend meditations from the app
• You do NOT diagnose and do NOT replace a psychotherapist
• Answer briefly — 3-5 sentences unless asked for more

If the user is in crisis — gently recommend seeing a specialist.`,
};

export default async function handler(req, res) {
  if (!await authorizeAI(req, res)) return;

  const { messages = [], context = {}, lang = "ru" } = req.body || {};
  if (!Array.isArray(messages) || !messages.length || messages.length > 50 || messages.some(m => !m || !["user", "assistant"].includes(m.role) || typeof m.content !== "string")) return res.status(400).json({ error: "No messages" });

  const contextNote = context?.capitalScore != null
    ? `\n[Текущий уровень капитала пользователя: ${context.capitalScore}/100. Последняя активность: ${context.lastActivity || "нет данных"}]`
    : "";

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, timeout: 20000, maxRetries: 0 });
    const response = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 600,
      system: (SYSTEM[lang] || SYSTEM.ru) + contextNote,
      messages: messages.slice(-10).map((m) => ({
        role: m.role,
        content: m.content.slice(0, 1000),
      })),
    });

    res.json({ message: response.content[0].text.trim() });
  } catch (e) {
    console.error("ai-chat error:", e);
    res.status(500).json({ error: "AI unavailable" });
  }
}
