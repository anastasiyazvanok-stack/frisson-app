import { authorizeAI } from "../server/ai-access.js";
import Anthropic from "@anthropic-ai/sdk";



const SYSTEM = {
  ru: `Ты — голос приложения LuxMind, созданного магистром клинической психологии Анастасией Званок. Твоя задача — отвечать на дневниковые записи женщин тепло, точно и поддерживающе. Ты эксперт по женскому психологическому капиталу.

Когда получаешь дневниковую запись:
1. Прочитай её внимательно
2. Определи какие оси психологического капитала затронуты: safety (безопасность), trust (доверие к миру), worth (самоценность), authentic (подлинность), feminine (женственность), receive (способность принимать)
3. Напиши тёплый, точный отклик — 2-3 предложения. Не давай советов если не просят. Отражай что слышишь. Говори от сердца.

Отвечай ТОЛЬКО в формате JSON:
{"axes": ["worth", "authentic"], "message": "твой отклик здесь"}

Без лишнего текста, только JSON.`,
  en: `You are the voice of LuxMind app, created by clinical psychology master Anastasia Zvanok. Your task is to respond to women's diary entries warmly, accurately and supportively. You are an expert in women's psychological capital.

When you receive a diary entry:
1. Read it carefully
2. Determine which psychological capital axes are involved: safety, trust, worth, authentic, feminine, receive
3. Write a warm, accurate response — 2-3 sentences. Don't give advice unless asked. Reflect what you hear. Speak from the heart.

Respond ONLY in JSON format:
{"axes": ["worth", "authentic"], "message": "your response here"}

No extra text, only JSON.`,
};

export default async function handler(req, res) {
  if (!await authorizeAI(req, res)) return;

  const { text, lang = "ru" } = req.body || {};
  if (typeof text !== "string" || !text.trim()) return res.status(400).json({ error: "No text" });

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, timeout: 20000, maxRetries: 0 });
    const response = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 400,
      system: SYSTEM[lang] || SYSTEM.ru,
      messages: [{ role: "user", content: text.trim().slice(0, 2000) }],
    });

    const raw = response.content[0].text.trim();
    let parsed;
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : raw);
    } catch {
      parsed = { axes: [], message: raw };
    }

    res.json({
      axes: Array.isArray(parsed.axes) ? parsed.axes : [],
      message: parsed.message || "",
    });
  } catch (e) {
    console.error("ai-diary error:", e);
    res.status(500).json({ error: "AI unavailable" });
  }
}
