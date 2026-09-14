const BLUR = 70;
// The glow needs a fully-transparent margin at least as large as the blur radius —
// otherwise WebKit clips the blur at the element's own box edge, showing a hard square
// patch instead of a soft circle (barely visible at low opacity, obvious at high opacity).
// Rendering the gradient on an inner div that's padded well past the declared w×h gives
// the blur room to fall off completely before it reaches any edge.
const PAD = BLUR * 1.5;

export default function Orb({ style = {}, color, opacity = 0.15, w = 200, h = 200, delay = 0 }) {
  return (
    <div style={{ position: "absolute", width: w, height: h, pointerEvents: "none", ...style }}>
      <div style={{
        position: "absolute",
        inset: -PAD,
        borderRadius: "50%",
        background: `radial-gradient(circle,${color},transparent 55%)`,
        filter: `blur(${BLUR}px)`,
        opacity,
        animation: `breathe 8s ${delay}s ease-in-out infinite`,
      }} />
    </div>
  );
}
