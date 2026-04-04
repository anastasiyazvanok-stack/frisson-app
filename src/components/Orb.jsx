export default function Orb({ style = {}, color, opacity = 0.15, w = 200, h = 200, delay = 0 }) {
  return (
    <div style={{
      position: "absolute",
      width: w,
      height: h,
      borderRadius: "50%",
      background: color,
      opacity,
      filter: "blur(60px)",
      animation: `breathe ${8 + delay}s ease-in-out infinite`,
      animationDelay: `${delay}s`,
      pointerEvents: "none",
      ...style,
    }} />
  );
}
