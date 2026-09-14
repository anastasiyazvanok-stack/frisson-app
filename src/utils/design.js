// ─── NECTAR DESIGN SYSTEM ───
// Single source of truth for all visual tokens.
// Import { DS } everywhere instead of magic numbers.

export const FONT_SERIF = "'Cormorant Garamond',Georgia,serif";
export const FONT_SANS  = "'Manrope',system-ui,sans-serif";

// ─── TYPE SCALE (px) ───
// 6 steps: xs, sm, base, lg, xl, xxl — nothing else.
export const TYPE = {
  xs:   11,    // meta, timestamps, tiny labels
  sm:   13,    // secondary labels, descriptions
  base: 15,    // body text, card content
  lg:   18,    // section titles, card headings
  xl:   22,    // screen titles
  xxl:  28,    // hero / greeting
};

// ─── SPACING SCALE (px) ───
// Based on 4px grid. Use only these values.
export const SP = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  24,
  xxl: 32,
  page: 20,   // horizontal page padding
};

// ─── BORDER RADIUS ───
// Brandbook: 4 / 12 / 20 / 999 only.
export const RAD = {
  sm:   4,    // pills, small chips, icons
  md:  12,    // cards, inputs, buttons
  lg:  20,    // modals, overlays, hero cards
  full: 999,  // circles
};

// ─── OPACITY LEVELS ───
// Text: 4 tiers only. Backgrounds: 3 tiers.
export const OP = {
  primary:   0.94,
  secondary: 0.65,
  tertiary:  0.44,
  disabled:  0.22,
  // Background fills
  bgSubtle:  0.06,
  bgMedium:  0.12,
  bgStrong:  0.22,
};

// ─── LETTER SPACING ───
export const LS = {
  tight:  "0.02em",  // body serif
  normal: "0.06em",  // body sans
  wide:   "0.16em",  // uppercase labels (brandbook Label: 11/600/.16em)
};

// ─── TRANSITIONS ───
export const EASE = {
  fast:   "all .15s ease",
  normal: "all .25s ease",
  slow:   "all .4s ease",
  color:  "color .4s ease, background .4s ease",
};

// ─── LINE HEIGHT ───
export const LH = {
  tight:  1.2,
  normal: 1.5,
  loose:  1.7,
};

// ─── SEMANTIC COLORS (theme-independent) ───
// Nectar brandbook palette. Semantic roles (brandbook §Design tokens):
//   ember    — действие / основной CTA
//   amber    — прогресс и психологический капитал
//   lavender — состояния, дневник, вечерние практики
//   bordeaux — глубина, разбор трудного
//   iris     — ИИ-коуч
export const COLOR = {
  positive: "#4E7A55",
  negative: "#C25A66",
  // Lightened success tint — brandbook success (#4E7A55) sits under 4.5:1 as text on obsidian,
  // so fills/borders use `positive`, text uses this.
  positiveSoft: "#7FA786",
  gold:     "#F3CE72",
  // Nectar brandbook palette
  obsidian: "#0E0810",
  wingBlack:"#1D1015",
  plum:     "#3B1533",
  bordeaux: "#5C1C2E",
  rust:     "#B2461F",
  ember:    "#D0562A",
  amber:    "#E39A3C",
  honeyGold:"#F3CE72",
  iris:     "#8E76B8",
  lavender: "#B9A9DA",
  mist:     "#DCD2EC",
  cream:    "#F7EFE6",
  shell:    "#EFE3D8",
  ink:      "#24131A",
  muted:    "#C9AFA6",
  mutedLight:"#5C4048",
};

// RGB triplets for the same palette — for `rgba(${RGB.ember},.2)` fills.
export const RGB = {
  obsidian: "14,8,16",
  wingBlack:"29,16,21",
  plum:     "59,21,51",
  bordeaux: "92,28,46",
  rust:     "178,70,31",
  ember:    "208,86,42",
  amber:    "227,154,60",
  gold:     "243,206,114",
  iris:     "142,118,184",
  lavender: "185,169,218",
  mist:     "220,210,236",
  cream:    "247,239,230",
  ink:      "36,19,26",
};

export const HAIRLINE = "rgba(185,169,218,.16)";

// ─── BRAND GRADIENTS (brandbook §Gradients — exact values) ───
// Max three stops in new gradients; gold and lavender never share a gradient;
// a gradient is never the background of a whole app screen.
export const GRAD = {
  // Обложки, крупные плоскости
  nectarFlow: "linear-gradient(150deg,#150A15,#3B1533 22%,#5C1C2E 48%,#B2461F 76%,#E39A3C 94%,#F3CE72)",
  // Дневник, вечерние практики
  duskWing:   "radial-gradient(75% 70% at 30% 20%,#B9A9DA,#8E76B8 28%,#3B1533 62%,#0E0810)",
  // Психологический капитал
  emberGlow:  "radial-gradient(60% 60% at 50% 65%,#E39A3C,#B2461F 32%,#2A0D18 72%,#0E0810)",
  // Иконка, аватары, фавикон
  iconDeep:   "radial-gradient(115% 110% at 30% 12%,#7A3226,#52202B 36%,#2B1020 70%,#150A15)",
  // Primary button fill
  btnPrimary: "linear-gradient(120deg,#B2461F,#D0562A 55%,#E39A3C)",
  // Capital / progress bar fill
  progress:   "linear-gradient(90deg,#B2461F,#E39A3C 70%,#F3CE72)",
};

// ─── SCREEN BASES ───
// Every screen starts from a dark base; light arrives as one spot (brandbook §Screens).
export const BG = {
  // App shell / loaders / doc overlays — flat obsidian
  deep:  "#0E0810",
  // Entry screens (auth, onboarding): obsidian → plum → obsidian
  entry: "linear-gradient(160deg,#150A15 0%,#3B1533 46%,#0E0810 100%)",
  // AI coach (iris role)
  coach: "linear-gradient(160deg,#120B18 0%,#2A1A3A 48%,#0E0810 100%)",
  // Raised surfaces (modals, sheets)
  surface: "#1D1015",
};

// ─── HELPERS ───

// Generate rgba string from theme's rgb triplet + opacity tier
export const tx = (rgb, op = OP.primary) => `rgba(${rgb},${op})`;

// Quick text style — most common pattern in the app
export const label = (size = TYPE.xs) => ({
  fontFamily: FONT_SANS,
  fontSize: size,
  letterSpacing: LS.wide,
  textTransform: "uppercase",
});

export const body = (size = TYPE.base) => ({
  fontFamily: FONT_SERIF,
  fontSize: size,
  lineHeight: LH.normal,
});

export const heading = (size = TYPE.xl) => ({
  fontFamily: FONT_SERIF,
  fontSize: size,
  fontWeight: 300,
  lineHeight: LH.tight,
});

// Card container style
export const card = (T) => ({
  padding: `${SP.lg}px ${SP.lg}px`,
  background: T.card,
  border: `1px solid ${T.border}`,
  borderRadius: RAD.md,
});

// Section wrapper with standard page margin
export const section = (mb = SP.lg) => ({
  margin: `0 ${SP.page}px ${mb}px`,
  position: "relative",
  zIndex: 1,
});

const DS = { FONT_SERIF, FONT_SANS, TYPE, SP, RAD, OP, LS, EASE, LH, COLOR, RGB, HAIRLINE, GRAD, BG, tx, label, body, heading, card, section };
export default DS;
