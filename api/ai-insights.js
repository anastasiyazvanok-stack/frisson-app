import Anthropic from "@anthropic-ai/sdk";
import { requireUser } from "./_lib/auth.js";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const AXIS_NAMES_RU = {
  safety: "Безопасность",
  trust: "Доверие к миру",
  worth: "Самоценность",
  authentic: "Подлинность",
  feminine: "Женственность",
  receive: "Способность принимать",
};

function formatData(capital, activity, lang) {
  const overall = capital?.overall ?? 0;
  const axes = capital?.axes || {};
  const meds = activity?.totalMeds ?? 0;
  const minutes = activity?.totalMedMinutes ?? activity?.totalMinutes ?? 0;
  const streak = activity?.streak ?? 0;

  const hasData = overall > 0 || meds > 0;

  if (!hasData) {
    return lang === "ru"
      ? "Пользователь только начинает — данных по практикам пока нет. Напиши тёплое приветственное слово о том, что путь только начинается и это хорошее место для начала."
      : "The user is just starting — no practice data yet. Write a warm welcoming message about the journey beginning.";
  }

  if (lang === "ru") {
    const axisLines = Object.entries(axes)
      .filter(([, v]) => v > 0)
      .sort(([, a], [, b]) => b - a)
      .map(([k, v]) => `  ${AXIS_NAMES_RU[k] || k}: ${Math.round(v)} баллов`)
      .join("\n");

    return `Общий капитал: ${Math.round(overall)}/100
${axisLines ? `Оси капитала:\n${axisLines}` : ""}
Медитаций выполнено: ${meds}
Минут практики: ${minutes}
Дней подряд: ${streak}`.trim();
  } else {
    return `Overall capital: ${Math.round(overall)}/100
Meditations completed: ${meds}
Practice minutes: ${minutes}
Day streak: ${streak}`;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const user = await requireUser(req);
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const { capital, activity, lang = "ru" } = req.body || {};

  const dataDesc = formatData(capital, activity, lang);

  const system = lang === "ru"
    ? `Ты — Анастасия, коуч приложения Nectar по женскому психологическому капиталу. На основе данных напиши короткий личный инсайт — тепло, живо, без шаблонов. Что уже растёт, что можно отметить, куда двигаться. Только обычный текст, без звёздочек и форматирования. 3-4 предложения.`
    : `You are Anastasia, Nectar coach for women's psychological capital. Based on the data, write a short personal insight — warmly, naturally, no templates. What's already growing, what to notice, where to move. Plain text only, no asterisks or formatting. 3-4 sentences.`;

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      system,
      messages: [{ role: "user", content: dataDesc }],
    });

    const text = response.content[0].text
      .trim()
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1");

    res.json({ insight: text });
  } catch (e) {
    console.error("ai-insights error:", e);
    res.status(500).json({ error: "AI unavailable" });
  }
}
