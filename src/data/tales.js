export const TALES_RU = [
  {
    id: "femininity",
    title: "Женственность",
    label: "Терапевтическая сказка",
    color: "#C080D0",
    free: true,
    tags: ["Женственность", "Уверенность", "Красота"],
    short: "Помогает в вопросах к себе как к женщине, в переживаниях о красоте и молодости, вселяет уверенность в себе.",
    text: `В маленьком городе на берегу моря жила женщина по имени Ива. Её руки создавали красивые вещи, её слова согревали людей, её дом всегда был наполнен теплом.

Но каждое утро, стоя перед зеркалом, она видела что-то другое. Морщинки у глаз, изменившееся тело, первые нити седины. И каждый раз внутри что-то сжималось: «Я становлюсь меньше. Я теряю что-то важное».

Однажды ночью ей приснился берег. На большом камне у самой воды сидела женщина — в белом, с тихим светом в глазах. Ива подошла ближе и увидела, что это она сама. Но другая. Старше, спокойнее, с таким миром внутри, которого раньше не было.

— Ты потеряла себя? — спросила та женщина.

— Я теряю красоту, — ответила Ива.

— Нет. Ты теряешь страх.

Ива не поняла. Женщина встала и медленно подошла к воде.

— Посмотри сюда. Весной море бурное и яркое. Осенью — тёмное и глубокое. Какое из них более настоящее?

— Оба, — тихо сказала Ива.

— Вот именно. Красота не уходит — она углубляется. Молодость — это искра. Зрелость — это пламя. Одно ярче, другое теплее и дольше горит.

Ива стояла и слушала, как шум волн постепенно смешивается с тишиной внутри.

— Ты всё время смотришь в зеркало и ищешь то, что было. Но то, что есть сейчас — сильнее. Ты знаешь себя. Ты знаешь, чего хочешь. Ты умеешь любить и принимать любовь. Это не приходит в двадцать лет — это приходит с жизнью.

Ива проснулась. За окном рассветало. Она встала и снова встала перед зеркалом.

Впервые за долгое время она не стала искать то, чего нет.

Она увидела себя: женщину, которая пережила многое и выстояла. Чьи глаза светятся не юностью — а мудростью и настоящей жизнью. Чья красота — не в отсутствии времени, а в том, что время сделало с ней.

«Я красива,» — сказала она тихо.

Не вопросительно. Не ища подтверждения. Просто зная.

И это знание было прочнее любого зеркала.`,
  },
];

const TALES_EN = [
  {
    id: "femininity",
    title: "Femininity",
    label: "Therapeutic fairy tale",
    color: "#C080D0",
    free: true,
    tags: ["Femininity", "Confidence", "Beauty"],
    short: "Helps with questions about yourself as a woman, with worries about beauty and youth, instills self-confidence.",
    text: `In a small town by the sea there lived a woman named Iva. Her hands created beautiful things, her words warmed people, her home was always filled with warmth.

But every morning, standing before the mirror, she saw something different. Fine lines around her eyes, a changed body, the first threads of silver. And each time something tightened inside: "I am becoming less. I am losing something important."

One night she dreamed of the shore. On a large stone at the water's edge sat a woman — in white, with a quiet light in her eyes. Iva came closer and saw that it was herself. But different. Older, calmer, with a peace inside that had not been there before.

"Have you lost yourself?" the woman asked.

"I am losing my beauty," Iva answered.

"No. You are losing your fear."

Iva did not understand. The woman rose and slowly walked to the water.

"Look here. In spring the sea is turbulent and bright. In autumn — dark and deep. Which one is more real?"

"Both," said Iva quietly.

"Exactly. Beauty does not leave — it deepens. Youth is a spark. Maturity is a flame. One is brighter, the other is warmer and burns longer."

Iva stood and listened as the sound of waves gradually blended with the stillness inside her.

"You keep looking in the mirror searching for what was. But what is here now is stronger. You know yourself. You know what you want. You know how to love and receive love. This does not come at twenty — it comes with life."

Iva woke. Outside, dawn was breaking. She rose and stood before the mirror again.

For the first time in a long while, she did not search for what was missing.

She saw herself: a woman who had lived much and withstood it. Whose eyes shone not with youth — but with wisdom and real life. Whose beauty lay not in the absence of time, but in what time had made of her.

"I am beautiful," she said quietly.

Not as a question. Not seeking confirmation. Simply knowing.

And that knowing was stronger than any mirror.`,
  },
];

export function getTales(lang = "ru") { return lang === "en" ? TALES_EN : TALES_RU; }
