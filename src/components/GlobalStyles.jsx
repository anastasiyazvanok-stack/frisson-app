export default function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Plus+Jakarta+Sans:wght@200;300;400;500&display=swap');

      *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
      html{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility}
      body{background:#060208;overflow:hidden}
      ::-webkit-scrollbar{display:none}

      :root{
        --vh:1dvh;
        --txt:242,232,226;
        --txt-inv:20,16,12;
        --orb-bg:6,2,8;
      }

      /* ─── Core Animations ─── */
      @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
      @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      @keyframes breathe{0%,100%{transform:scale(1);opacity:.85}50%{transform:scale(1.06);opacity:1}}
      @keyframes driftY{0%{transform:translate(0,0)}50%{transform:translate(4px,-8px)}100%{transform:translate(0,0)}}
      @keyframes screenFade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}

      /* ─── Glow & Shimmer ─── */
      @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
      @keyframes floatUp{0%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-36px) scale(1.1)}}
      @keyframes gemGlow{0%,100%{text-shadow:0 0 6px currentColor}50%{text-shadow:0 0 14px currentColor,0 0 28px currentColor}}
      @keyframes moonHalo{0%,100%{transform:scale(1);opacity:.3}50%{transform:scale(1.25);opacity:.5}}
      @keyframes pulseGlow{0%,100%{box-shadow:0 0 4px var(--glow-color,rgba(176,32,160,.25))}50%{box-shadow:0 0 12px var(--glow-color,rgba(176,32,160,.4))}}
      @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      @keyframes glowPulse{0%,100%{filter:drop-shadow(0 0 4px var(--glow-color,rgba(200,100,180,.3)))}50%{filter:drop-shadow(0 0 10px var(--glow-color,rgba(200,100,180,.5)))}}
      @keyframes gradientFlow{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
      @keyframes fireFlicker{0%,100%{transform:scale(1);filter:brightness(1)}25%{transform:scale(1.12);filter:brightness(1.2)}50%{transform:scale(1.04);filter:brightness(1.08)}75%{transform:scale(1.14);filter:brightness(1.25)}}

      /* ─── Staggered fade-in (spring curve) ─── */
      .fu1{animation:fadeUp .5s .05s cubic-bezier(.22,1,.36,1) both}
      .fu2{animation:fadeUp .5s .12s cubic-bezier(.22,1,.36,1) both}
      .fu3{animation:fadeUp .5s .19s cubic-bezier(.22,1,.36,1) both}
      .fu4{animation:fadeUp .5s .26s cubic-bezier(.22,1,.36,1) both}
      .fu5{animation:fadeUp .5s .33s cubic-bezier(.22,1,.36,1) both}

      /* ─── Interaction (spring bounce-back) ─── */
      .pc{transition:transform .2s cubic-bezier(.34,1.56,.64,1)}.pc:active{transform:scale(.94)}
      .press-card{transition:transform .2s cubic-bezier(.34,1.56,.64,1),box-shadow .3s ease}.press-card:active{transform:scale(.965)}

      /* ─── Glass effects ─── */
      .glass-card{
        backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
        box-shadow:0 4px 24px rgba(0,0,0,.35),inset 0 1px 0 rgba(255,255,255,.06);
      }

      /* ─── Applied animation classes ─── */
      .screen-in{animation:screenFade .35s cubic-bezier(.22,1,.36,1) both}
      .moon-halo{animation:moonHalo 4s ease-in-out infinite}
      .ambient-dot{animation:driftY 10s ease-in-out infinite}
      .pulse-glow{animation:pulseGlow 3s ease-in-out infinite}
      .fire-flicker{animation:fireFlicker 1.8s ease-in-out infinite}
      .premium-shimmer{background-size:200% 100%;animation:gradientFlow 4s ease infinite}

      /* ─── Scroll snap ─── */
      .snap-x{scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch}
      .snap-x>*{scroll-snap-align:start}

      /* ─── Gemstone burst ─── */
      @keyframes gemBurst{0%{opacity:1;transform:translateY(0) scale(1)}30%{opacity:1;transform:translateY(-20px) scale(1.2)}100%{opacity:0;transform:translateY(-60px) scale(.8)}}
    `}</style>
  );
}
