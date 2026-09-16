// ─── NECTAR BRAND MARKS ───
// Geometry straight from the brandbook (§Logo). Drawn in code rather than shipped as
// PNGs so the mark stays crisp at any size and recolours with the theme.
//
// Знак «Линза»: module u = S/16. Two outline circles, d = 10u, centres 6u apart at top 3u.
// Lens: 2.2u × 5.5u, fully rounded, centred on the intersection axis.
// (The handoff README says 3u × 7u, but the brandbook document itself and every SVG export
//  draw 2.2u × 5.5u — the drawn values win.)
// One mark — one colour. Outline is exactly 1 px on screen at any rendered size.

import { FONT_SERIF } from "../utils/design";

const S = 512;
// SVG strokes straddle their path (half inside, half outside) — unlike the brandbook's own
// CSS-border mockup, where a border never extends past its box. Sitting the circles flush
// against the viewBox edge (the literal 0/16u/16u grid math) clipped that outer half of the
// stroke off, which read as the circles being "cut off on the sides" at small render sizes
// where the stroke is a bigger fraction of the whole mark. PAD reserves room for it.
const PAD = S * 0.035;
const CS = S - 2 * PAD;
const u = CS / 16;

export function LensMark({ size = 56, color = "#F7EFE6", opacity = 1, style }) {
  // strokeWidth is expressed in viewBox units, so S/size renders as exactly 1 device px.
  const sw = S / size;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${S} ${S}`}
      fill="none"
      aria-hidden="true"
      style={{ opacity, flexShrink: 0, ...style }}
    >
      <circle cx={PAD + 5 * u} cy={PAD + 8 * u} r={5 * u} fill="none" stroke={color} strokeWidth={sw} />
      <circle cx={PAD + 11 * u} cy={PAD + 8 * u} r={5 * u} fill="none" stroke={color} strokeWidth={sw} />
      <rect x={PAD + 6.9 * u} y={PAD + 5.25 * u} width={2.2 * u} height={5.5 * u} rx={1.1 * u} fill={color} />
    </svg>
  );
}

// Вордмарк: Cormorant Garamond 300, uppercase, letter-spacing .18em, one flat colour.
// Brandbook forbids gradients, shadows, outlines and skew on the wordmark — don't add a glow.
// Minimum on-screen size is 96 px wide, which is about fontSize 22.
export function Wordmark({ size = 34, color = "#F7EFE6", style }) {
  return (
    <div
      style={{
        fontFamily: FONT_SERIF,
        fontWeight: 300,
        fontSize: size,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        lineHeight: 1.05,
        color,
        // letter-spacing trails the last glyph — pull it back so the word stays optically centred
        textIndent: "0.18em",
        ...style,
      }}
    >
      Nectar
    </div>
  );
}

// Вертикальный локап: знак сверху, зазор = высота знака × 0.4.
export function LogoLockup({ mark = 56, size = 34, color = "#F7EFE6", style }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: mark * 0.4, ...style }}>
      <LensMark size={mark} color={color} />
      <Wordmark size={size} color={color} />
    </div>
  );
}
