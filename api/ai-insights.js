import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { capital, activity, lang = "ru" } = req.body || {};

  const dataDesc = lang === "ru"
    ? `Данные пользователя:
- Уровень капитала по осям: ${JSON.stringify(capital?.axes || {})}
- Общий балл капитала: ${capital?.overall ?? "нет данных"}/100
- Медитаций выполнено: ${activity?.totalMeds ?? 0}
- Минут практики: ${activity?.totalMinutes ?? 0}
- Дней подряд: ${activity?.streak ?? 0}`
    : `User data:
- Capital axes: ${JSON.stringify(capital?.axes || {})}
- Overall capital score: ${capital?.overall ?? "no data"}/100
- Meditations completed: ${activity?.totalMeds ?? 0}
- Practice minutes: ${activity?.totalMinutes ?? 0}
- Day streak: ${activity?.streak ?? 0}`;

  const system = lang === "ru"
    ? `Ты — Анастасия, эксперт по женскому психологическому капиталу. На основе данных пользователя напиши персональный инсайт — что растёт, где есть потенциал, что можно сделать прямо сейчас. Пиши тепло, конкретно, по делу. 4-6 предложений. Без списков — живой текст.`
    : `You are Anastasia, women's psychological capital expert. Based on user data, write a personal insight — what's growing, where there's potential, what can be done right now. Write warmly, specifically, to the point. 4-6 sentences. No lists — flowing text.`;

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 500,
      system,
      messages: [{ role: "user", content: dataDesc }],
    });

    res.json({ insight: response.content[0].text.trim() });
  } catch (e) {
    console.error("ai-insights error:", e);
    res.status(500).json({ error: "AI unavailable" });
  }
}
