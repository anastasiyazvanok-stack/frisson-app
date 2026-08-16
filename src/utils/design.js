// ─── FRISSON DESIGN SYSTEM ───
// Single source of truth for all visual tokens.
// Import { DS } everywhere instead of magic numbers.

export const FONT_SERIF = "'Cormorant','Cormorant Garamond',Georgia,serif";
export const FONT_SANS  = "'Plus Jakarta Sans',system-ui,sans-serif";

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
export const RAD = {
  sm:   8,    // pills, small chips, icons
  md:  14,    // cards, inputs, buttons
  lg:  20,    // modals, overlays, hero cards
  full: 9999, // circles
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
  wide:   "0.14em",  // uppercase labels
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
export const COLOR = {
  positive: "#3BA88A",
  negative: "#C44040",
  gold:     "#D4A840",
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

const DS = { FONT_SERIF, FONT_SANS, TYPE, SP, RAD, OP, LS, EASE, LH, COLOR, tx, label, body, heading, card, section };
export default DS;
