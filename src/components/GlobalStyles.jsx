export default function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Plus+Jakarta+Sans:wght@200;300;400;500&display=swap');
      *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
      body{background:#06030a}::-webkit-scrollbar{display:none}
      :root{--vh:1dvh}
      @keyframes breathe{0%,100%{transform:scale(1);opacity:.85}50%{transform:scale(1.08);opacity:1}}
      @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
      @keyframes shimmer{0%,100%{opacity:.15}50%{opacity:.5}}
      @keyframes floatUp{0%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-44px) scale(1.2)}}
      @keyframes gemBurst{0%{opacity:0;transform:scale(.5) translateY(20px)}12%{opacity:1;transform:scale(1.3) translateY(-8px)}30%{opacity:1;transform:scale(1) translateY(-16px)}75%{opacity:1;transform:scale(1) translateY(-24px)}100%{opacity:0;transform:scale(.9) translateY(-50px)}}
      @keyframes gemGlow{0%,100%{text-shadow:0 0 8px currentColor,0 0 20px currentColor}50%{text-shadow:0 0 16px currentColor,0 0 40px currentColor,0 0 60px currentColor}}
      @keyframes moonHalo{0%,100%{transform:scale(1);opacity:.35}50%{transform:scale(1.35);opacity:.6}}
      @keyframes floatBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
      @keyframes driftY{0%{transform:translateY(0) translateX(0)}50%{transform:translateY(-12px) translateX(6px)}100%{transform:translateY(0) translateX(0)}}
      @keyframes screenFade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
      @keyframes navPop{0%{transform:scale(1)}50%{transform:scale(1.2)}100%{transform:scale(1)}}
      .fu1{animation:fadeUp .5s .06s ease both}.fu2{animation:fadeUp .5s .12s ease both}
      .fu3{animation:fadeUp .5s .18s ease both}.fu4{animation:fadeUp .5s .24s ease both}.fu5{animation:fadeUp .5s .3s ease both}
      @keyframes pulseGlow{0%,100%{box-shadow:0 0 4px var(--glow-color,rgba(176,32,160,.3))}50%{box-shadow:0 0 16px var(--glow-color,rgba(176,32,160,.5)),0 0 32px var(--glow-color,rgba(176,32,160,.2))}}
      @keyframes shimmerSlide{0%{background-position:-200% 0}100%{background-position:200% 0}}
      @keyframes listSlideIn{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
      @keyframes pressDown{0%{transform:scale(1)}50%{transform:scale(.95)}100%{transform:scale(1)}}
      @keyframes glowPulse{0%,100%{opacity:.6}50%{opacity:1}}
      .pc{transition:transform .15s cubic-bezier(.2,.8,.4,1)}.pc:active{transform:scale(.95)}
      .screen-in{animation:screenFade .35s ease both}
      .moon-halo{animation:moonHalo 4s ease-in-out infinite}
      .card-float{animation:floatBob 5s ease-in-out infinite}
      .nav-active-pop{animation:navPop .5s ease}
      .ambient-dot{animation:driftY 8s ease-in-out infinite}
      .pulse-glow{animation:pulseGlow 3s ease-in-out infinite}
      .shimmer-bg{background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,.04) 50%,transparent 100%);background-size:200% 100%;animation:shimmerSlide 3s ease-in-out infinite}
      .list-item{animation:listSlideIn .4s ease both}
      .press-card{transition:transform .2s cubic-bezier(.2,.8,.4,1),box-shadow .2s}.press-card:active{transform:scale(.96) translateY(1px)}
    `}</style>
  );
}
