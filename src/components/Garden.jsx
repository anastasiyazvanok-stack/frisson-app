import { useMemo } from "react";

// Deterministic pseudo-random from seed
const rng = (seed) => { let s = seed; return () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647; }; };

// Eight families, each a tint / brand value / shade of one Nectar palette member.
const FLOWER_TYPES = [
  { petals: 5, colors: ["#EDE6F6", "#DCD2EC", "#B9A9DA"] },  // mist
  { petals: 6, colors: ["#9A4759", "#5C1C2E", "#3E1220"] },  // bordeaux
  { petals: 4, colors: ["#B7A5DC", "#8E76B8", "#6B5694"] },  // iris
  { petals: 8, colors: ["#F0C489", "#E39A3C", "#B87A22"] },  // amber
  { petals: 5, colors: ["#E8845E", "#D0562A", "#A03E1C"] },  // ember
  { petals: 7, colors: ["#7A4570", "#3B1533", "#250C20"] },  // plum
  { petals: 6, colors: ["#D07A55", "#B2461F", "#7A3216"] },  // rust
  { petals: 5, colors: ["#F7E2A8", "#F3CE72", "#D9A83E"] },  // gold
];

function Flower({ x, type, growth, seed, height }) {
  const r = rng(seed);
  const ft = FLOWER_TYPES[type % FLOWER_TYPES.length];
  const color = ft.colors[Math.floor(r() * ft.colors.length)];
  const stemH = height * growth;
  const petalSize = (4 + r() * 4) * Math.min(1, growth * 1.2);
  const sway = Math.sin(seed * 0.7) * 3;
  const leafSide = r() > 0.5 ? 1 : -1;
  const leafY = stemH * (0.3 + r() * 0.3);
  const bloomOpacity = Math.max(0, (growth - 0.3) / 0.7);

  return (
    <g transform={`translate(${x}, 0)`}>
      {/* Stem */}
      <path
        d={`M0,0 Q${sway},${-stemH * 0.5} ${sway * 0.5},${-stemH}`}
        stroke={`rgba(60,${100 + Math.floor(growth * 80)},60,${0.3 + growth * 0.5})`}
        strokeWidth={1 + growth * 0.8}
        fill="none"
        strokeLinecap="round"
      />
      {/* Leaf */}
      {growth > 0.2 && (
        <ellipse
          cx={sway * 0.5 + leafSide * (4 + growth * 3)}
          cy={-leafY}
          rx={3 + growth * 3}
          ry={1.5 + growth}
          fill={`rgba(70,${130 + Math.floor(growth * 60)},70,${0.3 + growth * 0.4})`}
          transform={`rotate(${leafSide * (20 + r() * 30)}, ${sway * 0.5 + leafSide * (4 + growth * 3)}, ${-leafY})`}
        />
      )}
      {/* Flower head */}
      {growth > 0.3 && (
        <g transform={`translate(${sway * 0.5}, ${-stemH})`} opacity={bloomOpacity}>
          {Array.from({ length: ft.petals }, (_, i) => {
            const angle = (i / ft.petals) * Math.PI * 2 + seed * 0.3;
            const px = Math.cos(angle) * petalSize;
            const py = Math.sin(angle) * petalSize;
            return (
              <ellipse
                key={i}
                cx={px * 0.6}
                cy={py * 0.6}
                rx={petalSize * 0.55}
                ry={petalSize * 0.3}
                fill={color}
                opacity={0.7 + r() * 0.3}
                transform={`rotate(${(angle * 180) / Math.PI}, ${px * 0.6}, ${py * 0.6})`}
              />
            );
          })}
          {/* Center */}
          <circle r={petalSize * 0.22} fill={`rgba(243,206,114,${0.6 + growth * 0.3})`} />
          {/* Glow */}
          <circle r={petalSize * 0.6} fill="none" stroke={color} strokeWidth={0.3} opacity={0.3} />
        </g>
      )}
      {/* Bud for small growth */}
      {growth > 0.1 && growth <= 0.3 && (
        <ellipse
          cx={sway * 0.5}
          cy={-stemH}
          rx={2}
          ry={3}
          fill={`rgba(${80 + Math.floor(growth * 200)},${120 + Math.floor(growth * 100)},80,${0.4 + growth})`}
        />
      )}
    </g>
  );
}

function Butterfly({ x, y, seed, t }) {
  const wingSpan = 5 + (seed % 3) * 2;
  const colors = ["#DCD2EC", "#B9A9DA", "#F3CE72", "#8E76B8", "#D0562A"];
  const color = colors[seed % colors.length];
  const flap = Math.sin(t * 4 + seed) * 20;
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse cx={-wingSpan * 0.4} cy={0} rx={wingSpan} ry={wingSpan * 0.6} fill={color} opacity={0.5} transform={`skewY(${flap})`} />
      <ellipse cx={wingSpan * 0.4} cy={0} rx={wingSpan} ry={wingSpan * 0.6} fill={color} opacity={0.5} transform={`skewY(${-flap})`} />
      <ellipse cx={0} cy={0} rx={1} ry={2.5} fill="rgba(29,16,21,.6)" />
    </g>
  );
}

export default function Garden({ gems = 0, theme }) {
  // Growth level: 0 gems = bare ground, 100+ = lush garden
  const level = Math.min(1, gems / 100);
  const flowerCount = Math.min(18, Math.max(1, Math.floor(gems / 3)));

  const flowers = useMemo(() => {
    const r = rng(42);
    return Array.from({ length: 18 }, (_, i) => ({
      x: -85 + (i / 17) * 170 + (r() - 0.5) * 20,
      type: Math.floor(r() * FLOWER_TYPES.length),
      seed: Math.floor(r() * 10000),
      height: 20 + r() * 30,
    }));
  }, []);

  const butterflies = useMemo(() => {
    const r = rng(99);
    return Array.from({ length: 3 }, (_, i) => ({
      seed: Math.floor(r() * 100),
      baseX: -60 + r() * 120,
      baseY: -30 - r() * 25,
    }));
  }, []);

  // Animate with CSS instead of rAF for simplicity
  const t = Date.now() / 1000;

  return (
    <div style={{ width: "100%", position: "relative", overflow: "hidden" }}>
      <svg viewBox="-100 -70 200 80" style={{ width: "100%", height: "auto", display: "block" }}>
        {/* Ground gradient */}
        <defs>
          <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={`rgba(40,${60 + Math.floor(level * 40)},30,${0.2 + level * 0.3})`} />
            <stop offset="100%" stopColor="rgba(14,8,16,.2)" />
          </linearGradient>
        </defs>

        {/* Ground */}
        <ellipse cx="0" cy="4" rx="95" ry="8" fill="url(#ground)" />

        {/* Grass blades */}
        {level > 0.05 && Array.from({ length: Math.floor(level * 30) }, (_, i) => {
          const gx = -80 + (i / 29) * 160 + Math.sin(i * 7) * 8;
          const gh = 3 + level * 5 + Math.sin(i * 3) * 2;
          return <line key={`g${i}`} x1={gx} y1={2} x2={gx + Math.sin(i) * 2} y2={-gh} stroke={`rgba(60,${110 + Math.floor(level * 50)},50,${0.15 + level * 0.2})`} strokeWidth={0.5} strokeLinecap="round" />;
        })}

        {/* Flowers */}
        <g transform="translate(0, 2)">
          {flowers.slice(0, flowerCount).map((f, i) => {
            const growth = Math.min(1, level * 1.5 - i * 0.05);
            return growth > 0 ? <Flower key={i} x={f.x} type={f.type} growth={growth} seed={f.seed} height={f.height} /> : null;
          })}
        </g>

        {/* Butterflies — only when garden is lush */}
        {level > 0.5 && butterflies.slice(0, Math.floor((level - 0.5) * 6)).map((b, i) => (
          <Butterfly key={`b${i}`} x={b.baseX + Math.sin(t * 0.3 + b.seed) * 20} y={b.baseY + Math.cos(t * 0.4 + b.seed) * 8} seed={b.seed} t={t} />
        ))}

        {/* Sparkles when very lush */}
        {level > 0.7 && Array.from({ length: Math.floor((level - 0.7) * 15) }, (_, i) => {
          const sx = -70 + Math.sin(i * 13 + 5) * 140;
          const sy = -15 - Math.sin(i * 7 + 2) * 35;
          return <circle key={`s${i}`} cx={sx} cy={sy} r={0.6} fill="#f3ce72" opacity={0.2 + Math.sin(t * 2 + i * 3) * 0.2}>
            <animate attributeName="opacity" values={`${0.1 + (i % 3) * 0.1};0.5;${0.1 + (i % 3) * 0.1}`} dur={`${2 + (i % 3)}s`} repeatCount="indefinite" />
          </circle>;
        })}
      </svg>

      {/* Label */}
      <div style={{ textAlign: "center", marginTop: 4 }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 11, color: "rgba(247,239,230,.5)", fontStyle: "italic" }}>
          {level < 0.1 ? "Ваш сад ждёт первой практики..." :
           level < 0.3 ? "Первые ростки появляются..." :
           level < 0.5 ? "Сад начинает цвести..." :
           level < 0.7 ? "Сад цветёт и растёт..." :
           level < 0.9 ? "Прекрасный цветущий сад..." :
           "Сад в полном расцвете ✦"}
        </div>
      </div>
    </div>
  );
}
