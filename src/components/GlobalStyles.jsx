export default function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Plus+Jakarta+Sans:wght@200;300;400;500&display=swap');
      *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
      body{background:#06030a}::-webkit-scrollbar{display:none}
      @keyframes breathe{0%,100%{transform:scale(1);opacity:.85}50%{transform:scale(1.08);opacity:1}}
      @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
      @keyframes shimmer{0%,100%{opacity:.15}50%{opacity:.5}}
      @keyframes floatUp{0%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-80px) scale(.5)}}
      .fu1{animation:fadeUp .5s .06s ease both}.fu2{animation:fadeUp .5s .12s ease both}
      .fu3{animation:fadeUp .5s .18s ease both}.fu4{animation:fadeUp .5s .24s ease both}.fu5{animation:fadeUp .5s .3s ease both}
      .pc{transition:transform .15s ease}.pc:active{transform:scale(.97)}
    `}</style>
  );
}
