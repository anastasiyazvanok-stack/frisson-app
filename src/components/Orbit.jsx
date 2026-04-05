import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const SCENARIOS = [
  { id: "anxiety", name: "Тревога", hex: "#D4453C", speedMul: 2.4, chaos: 0.0035, pulseAmp: 0.0018, pulseFreq: 4.5, contract: 0.001, tint: 0xFF5040,
    byLayer: {
      1: "Глубина теряет опору: старые страхи оживают и дёргают ядро изнутри. Нейроны дрожат быстро и мелко — как будто ищут, за что ухватиться, но не находят.",
      2: "Подлинность отодвигается на задний план. Сеть сжимается и вибрирует — вместо своего голоса слышно только фоновый шум.",
      3: "Сознание перегружается потоком мыслей. Связи вспыхивают хаотично и быстро — мозг пытается всё просчитать и контролировать, но теряет центр.",
      4: "Чувства не успевают течь — их замораживает. Нейроны пульсируют, но не проходят глубину. Тело напряжено, сердце стучит мимо смысла.",
      5: "Эмоции вспыхивают резко и неконтролируемо. Сеть мечется без направления — каждый импульс превращается в искру тревоги.",
      6: "Поведение становится суетливым. Внешний контур дёргается, теряет плавность — действия опережают решения.",
    },
  },
  { id: "love", name: "Любовь · Наполненность", hex: "#E88FC6", speedMul: 0.75, chaos: 0, pulseAmp: 0.0012, pulseFreq: 0.6, contract: -0.0003, tint: 0xF0A0D0,
    byLayer: {
      1: "Глубина дышит спокойно. Старые раны отпускаются — нейроны движутся мягко и ровно, центр становится тёплым и безопасным.",
      2: "Подлинность раскрывается без усилий. Сеть расширяется, становится прозрачной — ты чувствуешь себя собой, без масок.",
      3: "Сознание выбирает из тишины. Связи формируются плавно и осмысленно — решения приходят как узнавание, а не как борьба.",
      4: "Чувства текут свободно, без сопротивления. Нейроны двигаются как река — глубоко, медленно, с доверием.",
      5: "Эмоции мягкие и тёплые. Сеть пульсирует нежно, без резких скачков — это не страсть, а присутствие.",
      6: "Поведение становится естественным. Внешний контур движется органично — ты притягиваешь, просто оставаясь собой.",
    },
  },
  { id: "power", name: "Сила · Внутренний огонь", hex: "#E8A04C", speedMul: 2.0, chaos: 0, pulseAmp: 0.0018, pulseFreq: 1.6, contract: -0.0008, tint: 0xFFB040,
    byLayer: {
      1: "Глубина собирает энергию. Нейроны движутся с силой из центра наружу — в ядре просыпается импульс, готовый стать действием.",
      2: "Подлинность ярко проявлена. Сеть излучает, расширяется с импульсом — ты знаешь, кто ты, и это видно.",
      3: "Сознание задаёт чёткий вектор. Связи формируются направленно — каждое решение — это выбор силы, а не реакция.",
      4: "Чувства становятся топливом. Нейроны движутся быстро, но не хаотично — энергия чувств питает цель.",
      5: "Эмоции превращаются в импульс. Сеть вспыхивает энергией действия — не взрыв, а запуск.",
      6: "Поведение уверенное и мощное. Внешний контур движется вперёд без колебаний — ты создаёшь реальность, а не реагируешь на неё.",
    },
  },
  { id: "conflict", name: "Внутренний конфликт", hex: "#9E6BC4", speedMul: 1.5, chaos: 0.0022, pulseAmp: 0, pulseFreq: 0, contract: 0, tint: 0xA070C8, split: true,
    byLayer: {
      1: "Глубина разрывается между противоположными желаниями. Нейроны тянутся в разные стороны — в ядре две правды, и каждая претендует на первую.",
      2: "Подлинность размыта. Сеть не может собраться в одно целое — часть тебя хочет одного, другая часть — противоположного.",
      3: "Сознание парализовано выбором. Связи формируются и тут же распадаются — мысль не успевает стать решением.",
      4: "Чувства противоречат друг другу. Нейроны смешиваются без ясности — любовь и обида, желание и страх живут одновременно.",
      5: "Эмоции нестабильны. Сеть мечется между полюсами — то одно чувство главное, то через минуту другое.",
      6: "Поведение непоследовательно. Внешний контур теряет единое направление — действия противоречат словам, слова противоречат желаниям.",
    },
  },
  { id: "fear", name: "Страх", hex: "#4A7AB8", speedMul: 0.45, chaos: 0.0008, pulseAmp: 0.0025, pulseFreq: 0.35, contract: 0.0022, tint: 0x5080C0, jolt: true,
    byLayer: {
      1: "Глубина сжимается в защиту. Нейроны стягиваются в плотный узел — ядро готовится к угрозе, даже если её нет.",
      2: "Самость прячется. Сеть становится маленькой и почти неподвижной — лучше не высовываться, чем быть замеченной.",
      3: "Сознание фиксируется на угрозе. Связи замирают, потом резко вспыхивают — мозг сканирует опасность снова и снова.",
      4: "Чувства замирают, чтобы не чувствовать боль. Нейроны едва движутся — тело выбирает онемение вместо контакта.",
      5: "Эмоции усиливаются резкими вспышками. Сеть дёргается — это не выражение, а сигнал выживания.",
      6: "Поведение уходит в избегание. Внешний контур закрывается, защищается — ты делаешь меньше, чтобы рисковать меньше.",
    },
  },
];

const LAYERS = [
  { id:1, name:"Бессознательное", sub:"центр · самый глубокий", hex:"#8B1A3A", col:0x8B1A3A, lc:0x6B0F2A, radius:22, speed:0.18, bright:0.82, sz:0.42, lineAmt:0.6, desc:"Здесь хранится всё, что накопилось до того, как ты начала осознавать — детские программы, родительские предписания, старая боль и нерастраченная любовь." },
  { id:2, name:"Самость / Подлинность", sub:"уровень 2", hex:"#C44B88", col:0xC44B88, lc:0x9B3A6B, radius:26, speed:0.28, bright:0.75, sz:0.40, lineAmt:0.45, desc:"То, кем ты являешься до всех масок и ролей. Когда ты в контакте с подлинностью, исчезает усталость от притворства, приходят «свои» люди." },
  { id:3, name:"Сознательное", sub:"уровень 3", hex:"#2A9D8F", col:0x2A9D8F, lc:0x1A7A6E, radius:20, speed:0.45, bright:0.78, sz:0.34, lineAmt:0.95, desc:"Взрослая часть, которая умеет выбирать осознанно. Именно она переписывает старые установки и выбирает доверие вместо тревоги." },
  { id:4, name:"Чувства", sub:"уровень 4", hex:"#264653", col:0x3A7CA5, lc:0x2B5F7E, radius:24, speed:0.22, bright:0.70, sz:0.44, lineAmt:0.75, desc:"Язык души, который говорит медленно и глубоко. Непрожитые чувства превращаются в тревогу. Прожитые — освобождают и открывают место для нового." },
  { id:5, name:"Эмоции", sub:"уровень 5", hex:"#E76F51", col:0xE76F51, lc:0xBB5A40, radius:18, speed:0.55, bright:0.72, sz:0.38, lineAmt:0.55, desc:"Быстрая энергия в ответ на ситуацию. Подавленные эмоции блокируют творчество. Разрешить себе эмоции — значит открыть поток жизненной силы." },
  { id:6, name:"Поведение", sub:"внешний слой", hex:"#C8960A", col:0xC8960A, lc:0xA07808, radius:30, speed:0.15, bright:0.60, sz:0.46, lineAmt:0.3, desc:"То, что видит мир. Когда бессознательное исцелено, а сознательное выбрало новое, поведение меняется органично, без насилия над собой." },
];

export default function Orbit({ setScreen }) {
  const canvasRef = useRef(null);
  const touchRef = useRef(null);
  const stateRef = useRef(null);
  const camRef = useRef(null);
  const [activeId, setActiveId] = useState(1);
  const [activeScenario, setActiveScenarioState] = useState(null);
  const [panelMode, setPanelMode] = useState("layer"); // "layer" | "scenario"
  const scenarioRef = useRef(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const [soundOn, setSoundOn] = useState(false);
  const audioRef = useRef({ ctx: null, gain: null, oscs: [], analyser: null, freq: new Uint8Array(64), bass: 0, mid: 0 });

  const layer = LAYERS[activeId - 1];

  function setScenario(sc) {
    scenarioRef.current = sc;
    setActiveScenarioState(sc);
    if (sc) { setPanelMode("scenario"); setPanelOpen(true); }
  }

  function openLayer(id) {
    setActiveId(id);
    setPanelMode("layer");
    setPanelOpen(true);
    const l = LAYERS[id - 1];
    const s = stateRef.current;
    if (s) {
      s.tR = l.radius; s.tS = l.speed; s.tB = l.bright; s.tSz = l.sz; s.tLAmt = l.lineAmt;
      s.transE = 1.0; s.curIdx = id - 1;
    }
  }

  function buildSound() {
    const a = audioRef.current;
    a.ctx = new (window.AudioContext || window.webkitAudioContext)();
    a.gain = a.ctx.createGain();
    a.gain.gain.setValueAtTime(0, a.ctx.currentTime);
    a.gain.gain.linearRampToValueAtTime(0.13, a.ctx.currentTime + 2.5);
    a.analyser = a.ctx.createAnalyser(); a.analyser.fftSize = 128;
    a.gain.connect(a.analyser); a.gain.connect(a.ctx.destination);
    a.freq = new Uint8Array(a.analyser.frequencyBinCount);

    const sub = a.ctx.createOscillator(), sg = a.ctx.createGain();
    sub.type = "sine"; sub.frequency.value = 132; sg.gain.value = 0.55;
    sub.connect(sg); sg.connect(a.gain); sub.start();

    const merger = a.ctx.createChannelMerger(2); merger.connect(a.gain);
    const oL = a.ctx.createOscillator(), gL = a.ctx.createGain();
    oL.type = "sine"; oL.frequency.value = 528; gL.gain.value = 0.45;
    oL.connect(gL); gL.connect(merger, 0, 0); oL.start();
    const oR = a.ctx.createOscillator(), gR = a.ctx.createGain();
    oR.type = "sine"; oR.frequency.value = 536; gR.gain.value = 0.45;
    oR.connect(gR); gR.connect(merger, 0, 1); oR.start();

    const ov = a.ctx.createOscillator(), og = a.ctx.createGain();
    ov.type = "sine"; ov.frequency.value = 1056; og.gain.value = 0.06;
    ov.connect(og); og.connect(a.gain); ov.start();

    const lfo = a.ctx.createOscillator(), lg = a.ctx.createGain();
    lfo.type = "sine"; lfo.frequency.value = 0.05; lg.gain.value = 0.06;
    lfo.connect(lg); lg.connect(a.gain.gain); lfo.start();

    const hb = a.ctx.createOscillator(), hg = a.ctx.createGain();
    hb.type = "sine"; hb.frequency.value = 0.18; hg.gain.value = 0.03;
    hb.connect(hg); hg.connect(og.gain); hb.start();

    a.oscs = [sub, oL, oR, ov, lfo, hb];
  }

  function stopSound() {
    const a = audioRef.current;
    if (!a.ctx) return;
    a.gain.gain.linearRampToValueAtTime(0, a.ctx.currentTime + 1.2);
    setTimeout(() => {
      a.oscs.forEach((o) => { try { o.stop(); } catch (e) {} });
      a.ctx.close(); a.ctx = null; a.analyser = null; a.oscs = []; a.bass = 0; a.mid = 0;
    }, 1400);
  }

  function toggleSound() {
    if (!soundOn) { buildSound(); } else { stopSound(); }
    setSoundOn(!soundOn);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const N = 2400;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(0x060208, 1);

    // Soft circular sprite for particles (prevents white square artifacts)
    const spriteCanvas = document.createElement("canvas");
    spriteCanvas.width = 64; spriteCanvas.height = 64;
    const spriteCtx = spriteCanvas.getContext("2d");
    const grad = spriteCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.4, "rgba(255,255,255,0.6)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    spriteCtx.fillStyle = grad;
    spriteCtx.fillRect(0, 0, 64, 64);
    const sprite = new THREE.CanvasTexture(spriteCanvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 1, 1000);
    camera.position.z = 85;

    const PA = new Float32Array(N * 3), VA = new Float32Array(N * 3), PH = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
      const r = Math.pow(Math.random(), 0.4) * 26;
      PA[i * 3] = r * Math.sin(ph) * Math.cos(th);
      PA[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      PA[i * 3 + 2] = r * Math.cos(ph);
      PH[i] = Math.random() * 1000;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(PA, 3));
    const mat = new THREE.PointsMaterial({ color: new THREE.Color(LAYERS[0].col), size: 0.8, map: sprite, transparent: true, opacity: 0.82, sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false });
    const points = new THREE.Points(geo, mat); scene.add(points);

    const MAX_L = 8000, LPA = new Float32Array(MAX_L * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(LPA, 3));
    lineGeo.setDrawRange(0, 0);
    const lineMat = new THREE.LineBasicMaterial({ color: new THREE.Color(LAYERS[0].lc), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    const lines = new THREE.LineSegments(lineGeo, lineMat); scene.add(lines);

    const MAX_E = 200, EPA = new Float32Array(MAX_E * 3);
    const elGeo = new THREE.BufferGeometry();
    elGeo.setAttribute("position", new THREE.BufferAttribute(EPA, 3));
    elGeo.setDrawRange(0, 0);
    const elMat = new THREE.PointsMaterial({ color: 0xffddcc, size: 2.2, map: sprite, transparent: true, opacity: 1, sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false });
    const electrons = new THREE.Points(elGeo, elMat); scene.add(electrons);

    const state = {
      curIdx: 0, tR: 22, cR: 22, tS: 0.18, cS: 0.18, tB: 0.82, cB: 0.82, tSz: 0.42, cSz: 0.42,
      lAmt: 0.6, tLAmt: 0.6, sX: 0, sY: 0, sZ: 0, transE: 0, cZ: 0, cZV: 0,
      dragging: false, lastPX: 0, lastPY: 0, dragVX: 0, dragVY: 0,
      pinching: false, lastPinchDist: 0, camZ: 85,
    };
    stateRef.current = state;
    camRef.current = camera;
    const aEl = [], conns = [];
    let lastSp = 0;

    const clock = new THREE.Clock();
    let animId;

    function loop() {
      animId = requestAnimationFrame(loop);
      const t = clock.getElapsedTime(), K = 0.018, l = LAYERS[state.curIdx];
      const au = audioRef.current;

      if (au.analyser) {
        au.analyser.getByteFrequencyData(au.freq);
        let bs = 0, ms = 0;
        for (let i = 0; i < 8; i++) bs += au.freq[i];
        for (let i = 8; i < 24; i++) ms += au.freq[i];
        au.bass = bs / (8 * 255); au.mid = ms / (16 * 255);
      }
      const bass = au.bass, mid = au.mid;

      state.cR += (state.tR - state.cR) * K; state.cS += (state.tS - state.cS) * K;
      state.cB += (state.tB - state.cB) * K; state.cSz += (state.tSz - state.cSz) * K;
      state.lAmt += (state.tLAmt - state.lAmt) * K;
      state.transE *= 0.982;
      if (state.transE > 0.05) { state.sX += state.transE * 0.013 * Math.sin(t * 1.8); state.sY += state.transE * 0.016; state.sZ += state.transE * 0.009 * Math.cos(t * 1.4); }

      // Inertia when not dragging
      if (!state.dragging) {
        state.sY += state.dragVY * 0.3 + 0.001; // gentle auto-rotate Y
        state.sX += state.dragVX * 0.3;
        state.dragVX *= 0.96; state.dragVY *= 0.96;
      }

      const zF = l.id === 3 ? 0.28 : l.id === 5 ? 0.5 : 0.1, zA = l.id === 3 ? 14 : l.id === 5 ? 12 : 7;
      state.cZV += (Math.sin(t * zF) * zA - state.cZ) * 0.007; state.cZV *= 0.94; state.cZ += state.cZV;

      [points, lines, electrons].forEach((o) => { o.rotation.x = state.sX; o.rotation.y = state.sY; o.rotation.z = state.sZ; o.position.z = state.cZ; });

      const sc = scenarioRef.current;
      const scS = sc ? sc.speedMul : 1;
      const effS = state.cS * scS;
      const scPulse = sc ? Math.sin(t * (sc.pulseFreq || 1)) * (sc.pulseAmp || 0) : 0;
      const joltActive = sc && sc.jolt && (Math.sin(t * 1.3) > 0.95);

      const p = geo.getAttribute("position"), a = p.array;
      for (let i = 0; i < N; i++) {
        const i3 = i * 3, x = a[i3], y = a[i3 + 1], z = a[i3 + 2], px = PH[i];
        VA[i3] += Math.sin(t * 0.05 + px) * 0.001 * effS; VA[i3 + 1] += Math.cos(t * 0.06 + px * 1.3) * 0.001 * effS; VA[i3 + 2] += Math.sin(t * 0.055 + px * 0.7) * 0.001 * effS;
        VA[i3] += Math.sin(t * 0.02 + px * 2.1 + y * 0.1) * 0.0008 * effS; VA[i3 + 1] += Math.cos(t * 0.025 + px * 1.7 + z * 0.1) * 0.0008 * effS; VA[i3 + 2] += Math.sin(t * 0.022 + px * 0.9 + x * 0.1) * 0.0008 * effS;
        const d = Math.sqrt(x * x + y * y + z * z) || 0.01;
        const pull = Math.max(0, d - (state.cR + bass * 6)) * 0.002 + 0.0003;
        VA[i3] -= (x / d) * pull; VA[i3 + 1] -= (y / d) * pull; VA[i3 + 2] -= (z / d) * pull;
        if (mid > 0.04) { const rp = Math.sin(t * 3.3 + px) * 0.0008 * mid; VA[i3] += (x / d) * rp; VA[i3 + 1] += (y / d) * rp; VA[i3 + 2] += (z / d) * rp; }
        if (l.id === 4) { const hb = Math.sin(t * 1.2 + px * 0.1) * 0.0015; VA[i3] += (x / d) * hb; VA[i3 + 1] += (y / d) * hb; VA[i3 + 2] += (z / d) * hb; }
        if (l.id === 5) { VA[i3] += (Math.random() - 0.5) * 0.004; VA[i3 + 1] += (Math.random() - 0.5) * 0.004; VA[i3 + 2] += (Math.random() - 0.5) * 0.004; }
        if (l.id === 3) { const nx = -y / d, ny = x / d; VA[i3] += nx * 0.003 * state.cS; VA[i3 + 1] += ny * 0.003 * state.cS; }

        // Scenario physics
        if (sc) {
          if (sc.chaos) { VA[i3] += (Math.random() - 0.5) * sc.chaos; VA[i3+1] += (Math.random() - 0.5) * sc.chaos; VA[i3+2] += (Math.random() - 0.5) * sc.chaos; }
          if (sc.pulseAmp) { VA[i3] += (x/d) * scPulse; VA[i3+1] += (y/d) * scPulse; VA[i3+2] += (z/d) * scPulse; }
          if (sc.contract) { VA[i3] -= (x/d) * sc.contract; VA[i3+1] -= (y/d) * sc.contract; VA[i3+2] -= (z/d) * sc.contract; }
          if (sc.split) { const pullX = (x > 0 ? 14 : -14) - x; VA[i3] += pullX * 0.00015; }
          if (joltActive) { VA[i3] += (Math.random() - 0.5) * 0.02; VA[i3+1] += (Math.random() - 0.5) * 0.02; VA[i3+2] += (Math.random() - 0.5) * 0.02; }
        }

        VA[i3] *= 0.992; VA[i3 + 1] *= 0.992; VA[i3 + 2] *= 0.992;
        a[i3] += VA[i3]; a[i3 + 1] += VA[i3 + 1]; a[i3 + 2] += VA[i3 + 2];
      }
      p.needsUpdate = true;

      if (state.lAmt > 0.01) {
        const lp = lineGeo.getAttribute("position"), la = lp.array; let lc = 0;
        const md2 = 9 + l.id * 0.5, mdsq = md2 * md2, step = Math.max(1, Math.floor(N / 600));
        conns.length = 0;
        for (let i = 0; i < N && lc < MAX_L; i += step) {
          const i3 = i * 3, x1 = a[i3], y1 = a[i3 + 1], z1 = a[i3 + 2];
          for (let j = i + step; j < N && lc < MAX_L; j += step) {
            const j3 = j * 3, dx = a[j3] - x1, dy = a[j3 + 1] - y1, dz = a[j3 + 2] - z1;
            if (dx * dx + dy * dy + dz * dz < mdsq) {
              const idx = lc * 6; la[idx] = x1; la[idx + 1] = y1; la[idx + 2] = z1; la[idx + 3] = a[j3]; la[idx + 4] = a[j3 + 1]; la[idx + 5] = a[j3 + 2];
              if (lc < 500) conns.push({ x1, y1, z1, x2: a[j3], y2: a[j3 + 1], z2: a[j3 + 2] });
              lc++;
            }
          }
        }
        lineGeo.setDrawRange(0, lc * 2); lp.needsUpdate = true; lineMat.opacity = state.lAmt * 0.13 + mid * 0.05;
      } else { lineGeo.setDrawRange(0, 0); }

      if (l.id === 3 && conns.length > 0 && aEl.length < 4 && (t - lastSp) > 0.9) {
        const c = conns[Math.floor(Math.random() * conns.length)];
        aEl.push({ sx: c.x1, sy: c.y1, sz: c.z1, ex: c.x2, ey: c.y2, ez: c.z2, t: 0, sp: 0.003 + Math.random() * 0.003 });
        lastSp = t;
      }
      const ep = elGeo.getAttribute("position"), ea = ep.array; let alive = 0;
      for (let e = aEl.length - 1; e >= 0; e--) {
        const el = aEl[e]; el.t += el.sp;
        if (el.t >= 1) { aEl.splice(e, 1); continue; }
        ea[alive * 3] = el.sx + (el.ex - el.sx) * el.t; ea[alive * 3 + 1] = el.sy + (el.ey - el.sy) * el.t; ea[alive * 3 + 2] = el.sz + (el.ez - el.sz) * el.t; alive++;
      }
      elGeo.setDrawRange(0, alive); ep.needsUpdate = true;

      const targetCol = sc ? new THREE.Color(sc.tint) : new THREE.Color(l.col);
      const targetLc = sc ? new THREE.Color(sc.tint).multiplyScalar(0.6) : new THREE.Color(l.lc);
      mat.color.lerp(targetCol, 0.018); lineMat.color.lerp(targetLc, 0.018);
      mat.opacity = state.cB + bass * 0.08; mat.size = (state.cSz + bass * 0.05) * 2.2;

      camera.position.x = Math.sin(t * 0.018) * 6;
      camera.position.y = Math.cos(t * 0.024) * 4;
      camera.lookAt(0, 0, state.cZ * 0.15);
      renderer.render(scene, camera);
    }
    loop();

    const onResize = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      renderer.dispose(); geo.dispose(); mat.dispose(); lineGeo.dispose(); lineMat.dispose(); elGeo.dispose(); elMat.dispose(); sprite.dispose();
      stopSound();
    };
  }, []);

  // Touch/mouse/wheel interaction — separate effect so it doesn't re-bindO on state changes
  useEffect(() => {
    const el = touchRef.current;
    if (!el) return;

    const pinchDist = (e) => {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const onDown = (e) => {
      const s = stateRef.current; if (!s) return;
      if (e.touches && e.touches.length === 2) {
        s.pinching = true; s.dragging = false;
        s.lastPinchDist = pinchDist(e);
        return;
      }
      const pt = e.touches ? e.touches[0] : e;
      s.dragging = true; s.lastPX = pt.clientX; s.lastPY = pt.clientY;
      s.dragVX = 0; s.dragVY = 0;
    };

    const onMove = (e) => {
      const s = stateRef.current; if (!s) return;
      if (s.pinching && e.touches && e.touches.length === 2) {
        const d = pinchDist(e);
        const delta = (s.lastPinchDist - d) * 0.15;
        s.camZ = Math.max(40, Math.min(160, s.camZ + delta));
        if (camRef.current) camRef.current.position.z = s.camZ;
        s.lastPinchDist = d;
        return;
      }
      if (!s.dragging) return;
      const pt = e.touches ? e.touches[0] : e;
      const dx = pt.clientX - s.lastPX, dy = pt.clientY - s.lastPY;
      s.dragVX = dx * 0.005; s.dragVY = dy * 0.005;
      s.sY += dx * 0.005; s.sX += dy * 0.005;
      s.lastPX = pt.clientX; s.lastPY = pt.clientY;
    };

    const onUp = () => {
      const s = stateRef.current; if (!s) return;
      s.dragging = false; s.pinching = false;
    };

    const onWheel = (e) => {
      const s = stateRef.current; if (!s) return;
      e.preventDefault();
      s.camZ = Math.max(40, Math.min(160, s.camZ + e.deltaY * 0.05));
      if (camRef.current) camRef.current.position.z = s.camZ;
    };

    el.addEventListener("mousedown", onDown);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseup", onUp);
    el.addEventListener("mouseleave", onUp);
    el.addEventListener("touchstart", onDown, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: true });
    el.addEventListener("touchend", onUp);
    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("mousedown", onDown);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseup", onUp);
      el.removeEventListener("mouseleave", onUp);
      el.removeEventListener("touchstart", onDown);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onUp);
      el.removeEventListener("wheel", onWheel);
    };
  }, []);

  const ss = { fontFamily: "Georgia, serif" };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", background: "#060208", overflow: "hidden" }}>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} />

      {/* Touch interaction layer — above canvas, below UI */}
      <div ref={touchRef} style={{ position: "absolute", inset: 0, zIndex: 5, touchAction: "none" }} />

      {/* Sidebar */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 44, zIndex: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: "80px 0", background: "linear-gradient(90deg, rgba(6,2,8,.7), transparent)" }}>
        {LAYERS.map((l) => (
          <div key={l.id} onClick={() => openLayer(l.id)} style={{ width: 36, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", opacity: activeId === l.id ? 1 : 0.38, transition: "opacity .3s", padding: "4px 0" }}>
            <span style={{ width: activeId === l.id ? 10 : 7, height: activeId === l.id ? 10 : 7, borderRadius: "50%", background: l.hex, boxShadow: activeId === l.id ? `0 0 12px ${l.hex}` : `0 0 4px ${l.hex}66`, display: "block", transition: "all .3s" }} />
            <span style={{ fontSize: 7, letterSpacing: 1, color: activeId === l.id ? "rgba(240,220,200,.85)" : "rgba(210,185,162,.5)", ...ss }}>{l.id}</span>
          </div>
        ))}
      </div>

      {/* Top bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px 0 52px", background: "linear-gradient(180deg, rgba(6,2,8,.86), transparent)", zIndex: 30, pointerEvents: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div onClick={() => setScreen("home")} style={{ pointerEvents: "all", cursor: "pointer", fontSize: 15, color: "rgba(210,175,145,.5)", padding: "4px 8px" }}>←</div>
          <div>
            <div style={{ fontSize: 8, letterSpacing: 5, textTransform: "uppercase", color: "rgba(190,130,90,.42)", ...ss }}>Frisson</div>
            <div style={{ fontSize: 14, fontStyle: "italic", color: "rgba(228,202,182,.38)", marginTop: 2, ...ss }}>Орбита Психики</div>
          </div>
        </div>
        <button onClick={toggleSound} style={{ pointerEvents: "all", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, background: soundOn ? "rgba(140,30,60,.36)" : "rgba(100,20,50,.2)", border: `1px solid ${soundOn ? "rgba(200,130,90,.5)" : "rgba(190,130,90,.25)"}`, borderRadius: 16, padding: "5px 11px", fontSize: 8, letterSpacing: 2, textTransform: "uppercase", color: soundOn ? "rgba(240,210,178,.92)" : "rgba(210,175,145,.6)", transition: "all .3s", whiteSpace: "nowrap", ...ss }}>{soundOn ? "■ Стоп" : "♫ 528 Hz"}</button>
      </div>

      {/* Active label + name */}
      <div style={{ position: "absolute", top: 62, left: "50%", transform: "translateX(-50%)", textAlign: "center", pointerEvents: "none", zIndex: 20 }}>
        <div style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: (panelMode === "scenario" && activeScenario) ? activeScenario.hex : layer.hex, whiteSpace: "nowrap", ...ss }}>{(panelMode === "scenario" && activeScenario) ? activeScenario.name : layer.name}</div>
        <div style={{ fontSize: 8, letterSpacing: 2, color: "rgba(220,195,172,.3)", marginTop: 3, ...ss }}>{(panelMode === "scenario" && activeScenario) ? "сценарий" : layer.sub}</div>
      </div>

      {/* Scenario chips row */}
      <div style={{ position: "absolute", top: 96, left: 0, right: 0, zIndex: 20, overflowX: "auto", padding: "0 16px 0 52px", WebkitOverflowScrolling: "touch" }}>
        <div style={{ display: "flex", gap: 6, whiteSpace: "nowrap" }}>
          <div onClick={() => { scenarioRef.current = null; setActiveScenarioState(null); }} style={{ cursor: "pointer", padding: "5px 11px", borderRadius: 14, background: !activeScenario ? "rgba(190,130,90,.25)" : "rgba(30,20,25,.5)", border: `1px solid ${!activeScenario ? "rgba(200,150,110,.45)" : "rgba(190,130,90,.15)"}`, fontSize: 8, letterSpacing: 1.5, textTransform: "uppercase", color: !activeScenario ? "rgba(240,210,178,.92)" : "rgba(200,175,158,.5)", whiteSpace: "nowrap", flexShrink: 0, ...ss }}>Нейтрально</div>
          {SCENARIOS.map((sc) => (
            <div key={sc.id} onClick={() => setScenario(activeScenario?.id === sc.id ? null : sc)} style={{ cursor: "pointer", padding: "5px 11px", borderRadius: 14, background: activeScenario?.id === sc.id ? `${sc.hex}30` : "rgba(30,20,25,.5)", border: `1px solid ${activeScenario?.id === sc.id ? sc.hex : "rgba(190,130,90,.15)"}`, fontSize: 8, letterSpacing: 1.5, textTransform: "uppercase", color: activeScenario?.id === sc.id ? sc.hex : "rgba(200,175,158,.5)", whiteSpace: "nowrap", flexShrink: 0, ...ss }}>{sc.name}</div>
          ))}
        </div>
      </div>

      {/* Bottom panel — compact */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 25, transform: panelOpen ? "translateY(0)" : "translateY(100%)", transition: "transform .4s cubic-bezier(.32,.72,0,1)" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", background: "linear-gradient(180deg, rgba(6,2,8,0) 0%, rgba(6,2,8,.94) 18%, rgba(6,2,8,.98) 100%)", backdropFilter: "blur(20px)", borderTop: `1px solid ${((panelMode === "scenario" && activeScenario) ? activeScenario.hex : layer.hex)}22`, padding: "0 16px 20px 52px", position: "relative", maxHeight: "46vh", overflowY: "auto" }}>
          <div onClick={() => setPanelOpen(false)} style={{ display: "flex", justifyContent: "center", padding: "10px 0 8px", cursor: "pointer", position: "sticky", top: 0, background: "linear-gradient(180deg, rgba(6,2,8,.95) 70%, transparent)" }}>
            <i style={{ display: "block", width: 28, height: 3, borderRadius: 2, background: `${((panelMode === "scenario" && activeScenario) ? activeScenario.hex : layer.hex)}55` }} />
          </div>
          {activeScenario ? (
            <>
              <div style={{ fontSize: 8, letterSpacing: 2, textTransform: "uppercase", color: "rgba(190,130,90,.45)", marginBottom: 6, ...ss }}>Сценарий · {layer.name}</div>
              <div style={{ fontSize: 15, fontStyle: "italic", fontWeight: "normal", color: activeScenario.hex, lineHeight: 1.25, marginBottom: 8, ...ss }}>{activeScenario.name}</div>
              <div style={{ fontSize: 11, lineHeight: 1.75, color: "rgba(200,175,158,.78)", wordWrap: "break-word", ...ss }}>{activeScenario.byLayer[layer.id]}</div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 8, letterSpacing: 2, textTransform: "uppercase", color: "rgba(190,130,90,.45)", marginBottom: 6, ...ss }}>Уровень {layer.id}</div>
              <div style={{ fontSize: 15, fontStyle: "italic", fontWeight: "normal", color: layer.hex, lineHeight: 1.25, marginBottom: 8, ...ss }}>{layer.name}</div>
              <div style={{ fontSize: 11, lineHeight: 1.75, color: "rgba(200,175,158,.78)", wordWrap: "break-word", ...ss }}>{layer.desc}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
