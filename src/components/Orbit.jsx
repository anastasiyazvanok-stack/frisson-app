import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// Sound profiles: each scenario has therapeutic frequencies
// Neutral: 528 Hz (Solfeggio love/repair) + 8 Hz binaural → alpha
const SOUND_PROFILES = {
  neutral:  { label: "528 Hz · Исцеление", base: 528, beat: 8, sub: 132, overtone: 1056, lfoRate: 0.05, lfoDepth: 0.06, desc: "528 Гц — частота исцеления ДНК (Solfeggio). Бинауральный бит 8 Гц переводит мозг в альфа-состояние: спокойное бодрствование и внутренняя тишина." },
  anxiety:  { label: "396 Hz · Освобождение", base: 396, beat: 4, sub: 99, overtone: 792, lfoRate: 0.035, lfoDepth: 0.04, desc: "396 Гц — освобождение от страха и вины (Solfeggio). Бинауральный бит 4 Гц (тета) мягко замедляет тревожный мозг. Нейроны постепенно перестают дрожать и находят опору." },
  love:     { label: "639 Hz · Связь", base: 639, beat: 7.83, sub: 160, overtone: 1278, lfoRate: 0.04, lfoDepth: 0.07, desc: "639 Гц — гармонизация отношений и сердечная связь (Solfeggio). Бинауральный бит 7.83 Гц (резонанс Шумана) синхронизирует с частотой Земли. Нейроны начинают дышать в унисон." },
  power:    { label: "741 Hz · Пробуждение", base: 741, beat: 14, sub: 185, overtone: 1482, lfoRate: 0.08, lfoDepth: 0.05, desc: "741 Гц — пробуждение интуиции и силы (Solfeggio). Бинауральный бит 14 Гц (бета) активирует решительность. Нейроны собираются в единый направленный поток." },
  conflict: { label: "417 Hz · Трансформация", base: 417, beat: 6, sub: 104, overtone: 834, lfoRate: 0.06, lfoDepth: 0.08, desc: "417 Гц — трансформация и очищение от негативных паттернов (Solfeggio). Бинауральный бит 6 Гц (тета) помогает мозгу отпустить одну из сторон конфликта и найти единый центр." },
  fear:     { label: "396 Hz · Безопасность", base: 396, beat: 3, sub: 99, overtone: 792, lfoRate: 0.025, lfoDepth: 0.03, desc: "396 Гц — освобождение от страха (Solfeggio). Бинауральный бит 3 Гц (глубокая дельта) возвращает ощущение безопасности на уровне нервной системы. Сжатые нейроны начинают расслабляться." },
  abundance:{ label: "852 Hz · Изобилие", base: 852, beat: 10, sub: 213, overtone: 1704, lfoRate: 0.045, lfoDepth: 0.06, desc: "852 Гц — возвращение к духовному порядку и открытость к получению (Solfeggio). Бинауральный бит 10 Гц (альфа) настраивает мозг на расслабленную готовность принимать." },
  feminine: { label: "432 Hz · Женственность", base: 432, beat: 7.83, sub: 108, overtone: 864, lfoRate: 0.03, lfoDepth: 0.09, desc: "432 Гц — природная гармония (Верди). Бинауральный бит 7.83 Гц (резонанс Шумана) соединяет с ритмами природы. Нейроны начинают танцевать — текуче, плавно, женственно." },
  capital:  { label: "528 Hz · Устойчивость", base: 528, beat: 12, sub: 132, overtone: 1056, lfoRate: 0.05, lfoDepth: 0.04, desc: "528 Гц — восстановление и целостность (Solfeggio). Бинауральный бит 12 Гц (альфа-бета граница) — частота сфокусированной уверенности. Нейроны выстраиваются в устойчивую структуру." },
};

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
  { id: "abundance", name: "Изобилие · Получение благ", hex: "#D4A74A", speedMul: 0.9, chaos: 0, pulseAmp: 0.0024, pulseFreq: 0.45, contract: -0.0006, tint: 0xE8C060, radiate: 0.0012,
    byLayer: {
      1: "Глубина раскрывается и отпускает сжатие. Нейроны расширяются изнутри наружу волнами вдоха-выдоха — ядро разрешает себе получать, не заслуживая.",
      2: "Подлинность занимает своё место без стыда. Сеть расширяется плавно и щедро — ты не просишь, ты просто есть, и этого достаточно для мира.",
      3: "Сознание открывается к потоку возможностей. Связи формируются как мосты вовне — мозг перестаёт отсекать хорошее как «это не для меня».",
      4: "Чувства становятся приёмной способностью. Нейроны движутся открыто, без защит — благодарность и радость проходят через тело свободно.",
      5: "Эмоции превращаются в резонанс с миром. Сеть светится мягко и равномерно — радость не нужно защищать от чужого взгляда.",
      6: "Поведение становится открытым и щедрым. Внешний контур расширяется, принимает и отдаёт — ты берёшь, что тебе даётся, без вины.",
    },
  },
  { id: "feminine", name: "Женственность · Текучесть", hex: "#E89CB8", speedMul: 1.0, chaos: 0, pulseAmp: 0.0008, pulseFreq: 0.4, contract: 0, tint: 0xF0B0C8, swirl: 0.0018,
    byLayer: {
      1: "Глубина течёт как вода. Нейроны движутся плавно по спирали вокруг ядра — женское помнит свою мягкую природу и не спешит.",
      2: "Самость раскрывается в своей красоте. Сеть танцует — не демонстрирует, не играет, а просто живёт изнутри.",
      3: "Сознание выбирает из чувствительности. Связи формируются интуитивно, тангенциально — не просчитывая, а ощущая правильное.",
      4: "Чувства становятся рекой. Нейроны текут медленно и глубоко, огибают препятствия — каждое чувство важно и имеет своё место.",
      5: "Эмоции становятся чувственной красотой. Сеть вибрирует мягко и плавно — это не игра для других, а настоящее присутствие в себе.",
      6: "Поведение становится чувственным и магнетичным. Внешний контур движется плавно — притяжение рождается изнутри, без усилия.",
    },
  },
  { id: "capital", name: "Психологический капитал", hex: "#4FAE92", speedMul: 1.15, chaos: 0, pulseAmp: 0.0009, pulseFreq: 0.3, contract: -0.0002, tint: 0x60C0A4, radiate: 0.0006, structured: true,
    byLayer: {
      1: "Глубина знает, что справится. Нейроны движутся устойчиво и уверенно — внутренняя опора держит даже в шторм, потому что есть надежда.",
      2: "Самость уверена в своей ценности. Сеть стоит прямо и излучает ровный свет — ты веришь в свою способность быть собой в любых условиях.",
      3: "Сознание оптимистично и решительно. Связи формируются чётко и структурно — трудности воспринимаются как задачи, а не как катастрофы.",
      4: "Чувства становятся ресурсом устойчивости. Нейроны движутся спокойно — даже боль не ломает, потому что внутри живёт вера в результат.",
      5: "Эмоции стабильны и направлены. Сеть излучает ровный свет эффективности — ты чувствуешь, что можешь, и это сильнее тревоги.",
      6: "Поведение последовательное и результативное. Внешний контур действует из веры в себя — надежда + стойкость + оптимизм + способность.",
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

export default function Orbit({ setScreen, addGems }) {
  const canvasRef = useRef(null);
  const touchRef = useRef(null);
  const stateRef = useRef(null);
  const camRef = useRef(null);
  const [activeId, setActiveId] = useState(1);
  const [activeScenario, setActiveScenarioState] = useState(null);
  const [panelMode, setPanelMode] = useState("layer"); // "layer" | "scenario"
  const scenarioRef = useRef(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const [panelExpanded, setPanelExpanded] = useState(false);
  const [meditating, setMeditating] = useState(false);
  const [medTime, setMedTime] = useState(0); // seconds remaining
  const [medDuration, setMedDuration] = useState(0);
  const [showTimerPicker, setShowTimerPicker] = useState(false);
  const timerRef = useRef(null);
  const [gemPop, setGemPop] = useState(null);
  const medDurationRef = useRef(0);
  const medStartRef = useRef(0);
  const [soundOn, setSoundOn] = useState(false);
  const audioRef = useRef({ ctx: null, gain: null, oscs: [], analyser: null, freq: new Uint8Array(64), bass: 0, mid: 0 });

  const layer = LAYERS[activeId - 1];

  function setScenario(sc) {
    scenarioRef.current = sc;
    setActiveScenarioState(sc);
    if (sc) { setPanelMode("scenario"); setPanelOpen(true); setPanelExpanded(true); }
    else { setPanelExpanded(false); }
    if (soundOn) { buildSound(sc?.id || "neutral"); }
  }

  function openLayer(id) {
    setActiveId(id);
    setPanelMode("layer");
    setPanelOpen(true);
    setPanelExpanded(true);
    const l = LAYERS[id - 1];
    const s = stateRef.current;
    if (s) {
      s.tR = l.radius; s.tS = l.speed; s.tB = l.bright; s.tSz = l.sz; s.tLAmt = l.lineAmt;
      s.transE = 1.0; s.curIdx = id - 1;
    }
  }

  function getProfile() {
    return SOUND_PROFILES[activeScenario?.id] || SOUND_PROFILES.neutral;
  }

  function cleanupAudio() {
    const a = audioRef.current;
    if (!a.ctx) return;
    a.oscs.forEach((o) => { try { o.stop(); } catch (e) {} });
    try { a.ctx.close(); } catch (e) {}
    a.ctx = null; a.analyser = null; a.oscs = []; a.bass = 0; a.mid = 0;
  }

  function buildSound(profileId) {
    cleanupAudio();
    const prof = SOUND_PROFILES[profileId] || SOUND_PROFILES.neutral;
    const a = audioRef.current;
    try {
      a.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) { return; }
    a.gain = a.ctx.createGain();
    a.gain.gain.setValueAtTime(0, a.ctx.currentTime);
    a.gain.gain.linearRampToValueAtTime(0.13, a.ctx.currentTime + 2.5);
    a.analyser = a.ctx.createAnalyser(); a.analyser.fftSize = 128;
    a.gain.connect(a.analyser); a.gain.connect(a.ctx.destination);
    a.freq = new Uint8Array(a.analyser.frequencyBinCount);

    const sub = a.ctx.createOscillator(), sg = a.ctx.createGain();
    sub.type = "sine"; sub.frequency.value = prof.sub; sg.gain.value = 0.5;
    sub.connect(sg); sg.connect(a.gain); sub.start();

    const merger = a.ctx.createChannelMerger(2); merger.connect(a.gain);
    const oL = a.ctx.createOscillator(), gL = a.ctx.createGain();
    oL.type = "sine"; oL.frequency.value = prof.base; gL.gain.value = 0.42;
    oL.connect(gL); gL.connect(merger, 0, 0); oL.start();
    const oR = a.ctx.createOscillator(), gR = a.ctx.createGain();
    oR.type = "sine"; oR.frequency.value = prof.base + prof.beat; gR.gain.value = 0.42;
    oR.connect(gR); gR.connect(merger, 0, 1); oR.start();

    const ov = a.ctx.createOscillator(), og = a.ctx.createGain();
    ov.type = "sine"; ov.frequency.value = prof.overtone; og.gain.value = 0.05;
    ov.connect(og); og.connect(a.gain); ov.start();

    const lfo = a.ctx.createOscillator(), lg = a.ctx.createGain();
    lfo.type = "sine"; lfo.frequency.value = prof.lfoRate; lg.gain.value = prof.lfoDepth;
    lfo.connect(lg); lg.connect(a.gain.gain); lfo.start();

    const hb = a.ctx.createOscillator(), hg = a.ctx.createGain();
    hb.type = "sine"; hb.frequency.value = 0.18; hg.gain.value = 0.03;
    hb.connect(hg); hg.connect(og.gain); hb.start();

    a.oscs = [sub, oL, oR, ov, lfo, hb];
  }

  function stopSound() {
    const a = audioRef.current;
    if (!a.ctx || !a.gain) { cleanupAudio(); return; }
    try {
      a.gain.gain.cancelScheduledValues(a.ctx.currentTime);
      a.gain.gain.setValueAtTime(a.gain.gain.value, a.ctx.currentTime);
      a.gain.gain.linearRampToValueAtTime(0, a.ctx.currentTime + 0.8);
    } catch (e) {}
    setTimeout(() => cleanupAudio(), 1000);
  }

  function awardCrystals(seconds) {
    const earned = Math.max(1, Math.round(seconds / 60));
    if (addGems) addGems(earned);
    setGemPop({ amount: earned, id: Date.now() });
    setTimeout(() => setGemPop(null), 4000);
  }

  function startMeditation(seconds) {
    setShowTimerPicker(false);
    buildSound(activeScenario?.id || "neutral");
    setSoundOn(true);
    setMeditating(true);
    setMedDuration(seconds);
    setMedTime(seconds);
    medDurationRef.current = seconds;
    medStartRef.current = Date.now();
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - medStartRef.current) / 1000);
      const remaining = Math.max(0, medDurationRef.current - elapsed);
      setMedTime(remaining);
      if (remaining <= 0) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        stopSound();
        setSoundOn(false);
        setMeditating(false);
        awardCrystals(medDurationRef.current);
      }
    }, 200);
  }

  function stopMeditation() {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    const elapsed = Math.floor((Date.now() - medStartRef.current) / 1000);
    stopSound();
    setSoundOn(false);
    setMeditating(false);
    setMedTime(0);
    if (elapsed >= 30) awardCrystals(elapsed);
  }

  function toggleSound() {
    if (soundOn || meditating) {
      stopMeditation();
    } else {
      setShowTimerPicker(true);
    }
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

      // Healing progress: 0 = start of meditation, 1 = fully healed
      // Negative scenarios (anxiety, fear, conflict) gradually open up
      // Positive scenarios (love, feminine, power) gradually intensify
      let hp = 0;
      if (medStartRef.current > 0 && medDurationRef.current > 0) {
        const medElapsed = (Date.now() - medStartRef.current) / 1000;
        hp = Math.min(1, medElapsed / medDurationRef.current);
        hp = hp * hp * (3 - 2 * hp); // smoothstep easing
      }

      const isNegative = sc && (sc.id === "anxiety" || sc.id === "fear" || sc.id === "conflict");
      const isPositive = sc && (sc.id === "love" || sc.id === "feminine" || sc.id === "power" || sc.id === "abundance" || sc.id === "capital");

      // During meditation: negative scenarios fade out, radius expands, speed calms
      const healFade = isNegative ? (1 - hp * 0.85) : 1; // negative effects reduce to 15%
      const healExpand = isNegative ? (1 + hp * 0.4) : (isPositive ? (1 + hp * 0.15) : 1); // expand radius
      const healSpeed = isNegative ? (1 - hp * 0.6) : (isPositive ? (1 + hp * 0.1) : 1); // slow down
      // Positive scenarios get a gentle breath expansion during meditation
      const healBreath = isPositive && hp > 0 ? Math.sin(t * 0.4) * 0.0008 * hp : 0;

      const scS = sc ? sc.speedMul * healSpeed : 1;
      const effS = state.cS * scS;
      const scPulse = sc ? Math.sin(t * (sc.pulseFreq || 1)) * (sc.pulseAmp || 0) * healFade : 0;
      const joltActive = sc && sc.jolt && healFade > 0.3 && (Math.sin(t * 1.3) > 0.95);

      // Expand radius during healing
      if (hp > 0) { state.tR = l.radius * healExpand; }

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

        // Scenario physics — modulated by healing progress
        if (sc) {
          if (sc.chaos) { const c = sc.chaos * healFade; VA[i3] += (Math.random() - 0.5) * c; VA[i3+1] += (Math.random() - 0.5) * c; VA[i3+2] += (Math.random() - 0.5) * c; }
          if (sc.pulseAmp) { VA[i3] += (x/d) * scPulse; VA[i3+1] += (y/d) * scPulse; VA[i3+2] += (z/d) * scPulse; }
          if (sc.contract) { const ct = sc.contract * (isNegative ? healFade : 1); VA[i3] -= (x/d) * ct; VA[i3+1] -= (y/d) * ct; VA[i3+2] -= (z/d) * ct; }
          if (sc.split) { const pullX = (x > 0 ? 14 : -14) - x; VA[i3] += pullX * 0.00015 * healFade; }
          if (joltActive) { const j = 0.02 * healFade; VA[i3] += (Math.random() - 0.5) * j; VA[i3+1] += (Math.random() - 0.5) * j; VA[i3+2] += (Math.random() - 0.5) * j; }
          if (sc.radiate) { const pulse = (0.5 + 0.5 * Math.sin(t * 0.55)); const r = sc.radiate * (isPositive ? (1 + hp * 0.5) : 1); VA[i3] += (x/d) * r * pulse; VA[i3+1] += (y/d) * r * pulse; VA[i3+2] += (z/d) * r * pulse; }
          if (sc.swirl) { const sw = sc.swirl * (isPositive ? (1 + hp * 0.3) : 1); const hxy = Math.sqrt(x*x + z*z) || 0.01; VA[i3] += (-z/hxy) * sw; VA[i3+2] += (x/hxy) * sw; VA[i3+1] += Math.sin(t * 0.8 + px * 0.3) * sw * 0.4; }
          if (sc.structured) { VA[i3] *= 0.996; VA[i3+1] *= 0.996; VA[i3+2] *= 0.996; }
          // Healing breath for positive scenarios during meditation
          if (healBreath) { VA[i3] += (x/d) * healBreath; VA[i3+1] += (y/d) * healBreath; VA[i3+2] += (z/d) * healBreath; }
          // Gentle expansion push for all scenarios during meditation
          if (hp > 0 && isNegative) { const expand = 0.0004 * hp; VA[i3] += (x/d) * expand; VA[i3+1] += (y/d) * expand; VA[i3+2] += (z/d) * expand; }
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

      // Color shifts toward warm calm during meditation healing
      let targetCol = sc ? new THREE.Color(sc.tint) : new THREE.Color(l.col);
      let targetLc = sc ? new THREE.Color(sc.tint).multiplyScalar(0.6) : new THREE.Color(l.lc);
      if (hp > 0 && isNegative) {
        const healCol = new THREE.Color(0xF0A0D0); // warm pink = healed state
        targetCol = new THREE.Color(sc.tint).lerp(healCol, hp * 0.7);
        targetLc = targetCol.clone().multiplyScalar(0.5);
      } else if (hp > 0 && isPositive) {
        const brightCol = new THREE.Color(sc.tint).multiplyScalar(1 + hp * 0.3);
        targetCol = brightCol;
        targetLc = brightCol.clone().multiplyScalar(0.6);
      }
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
      cleanupAudio();
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
  const fmtTimer = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const acHex = activeScenario ? activeScenario.hex : layer.hex;
  const hideUI = meditating ? 0 : 1;

  return (
    <div style={{ position: "relative", width: "100%", flex: 1, minHeight: 0, background: "#060208", overflow: "hidden" }}>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} />
      <div ref={touchRef} style={{ position: "absolute", inset: 0, zIndex: 5, touchAction: "none" }} />

      {/* Sidebar — hides during meditation */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 44, zIndex: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: "80px 0", background: "linear-gradient(90deg, rgba(6,2,8,.7), transparent)", opacity: hideUI, transition: "opacity .8s", pointerEvents: meditating ? "none" : "auto" }}>
        {LAYERS.map((l) => (
          <div key={l.id} onClick={() => openLayer(l.id)} style={{ width: 36, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", opacity: activeId === l.id ? 1 : 0.38, transition: "opacity .3s", padding: "4px 0" }}>
            <span style={{ width: activeId === l.id ? 10 : 7, height: activeId === l.id ? 10 : 7, borderRadius: "50%", background: l.hex, boxShadow: activeId === l.id ? `0 0 12px ${l.hex}` : `0 0 4px ${l.hex}66`, display: "block", transition: "all .3s" }} />
            <span style={{ fontSize: 7, letterSpacing: 1, color: activeId === l.id ? "rgba(240,220,200,.85)" : "rgba(210,185,162,.5)", ...ss }}>{l.id}</span>
          </div>
        ))}
      </div>

      {/* Top bar — partially hides during meditation */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px 0 52px", background: meditating ? "transparent" : "linear-gradient(180deg, rgba(6,2,8,.86), transparent)", zIndex: 30, pointerEvents: "none", transition: "background .8s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, opacity: hideUI, transition: "opacity .8s" }}>
          <div onClick={() => { if (meditating) return; setScreen("home"); }} style={{ pointerEvents: meditating ? "none" : "all", cursor: "pointer", fontSize: 15, color: "rgba(210,175,145,.5)", padding: "4px 8px" }}>←</div>
          <div>
            <div style={{ fontSize: 8, letterSpacing: 5, textTransform: "uppercase", color: "rgba(190,130,90,.42)", ...ss }}>Frisson</div>
            <div style={{ fontSize: 14, fontStyle: "italic", color: "rgba(228,202,182,.38)", marginTop: 2, ...ss }}>Орбита Психики</div>
          </div>
        </div>
        <button onClick={toggleSound} style={{ pointerEvents: "all", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, background: soundOn ? "rgba(140,30,60,.36)" : "rgba(100,20,50,.2)", border: `1px solid ${soundOn ? "rgba(200,130,90,.5)" : "rgba(190,130,90,.25)"}`, borderRadius: 16, padding: "5px 11px", fontSize: 8, letterSpacing: 2, textTransform: "uppercase", color: soundOn ? "rgba(240,210,178,.92)" : "rgba(210,175,145,.6)", transition: "all .3s", whiteSpace: "nowrap", ...ss }}>{meditating ? "■ Стоп" : soundOn ? "■ Стоп" : `♫ ${getProfile().label}`}</button>
      </div>

      {/* Meditation timer — bottom bar, orb stays visible */}
      {meditating && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 12, zIndex: 28, display: "flex", flexDirection: "column", alignItems: "center", pointerEvents: "none" }}>
          <div style={{ background: "rgba(6,2,8,.7)", backdropFilter: "blur(12px)", borderRadius: 20, padding: "12px 24px", display: "flex", alignItems: "center", gap: 16, border: `1px solid ${acHex}22` }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 200, color: `${acHex}dd`, letterSpacing: 3, ...ss }}>{fmtTimer(medTime)}</div>
              <div style={{ fontSize: 7, letterSpacing: 2, textTransform: "uppercase", color: `${acHex}55`, marginTop: 2, ...ss }}>{getProfile().label}</div>
            </div>
            <div style={{ width: 1, height: 32, background: `${acHex}22` }} />
            <div onClick={stopMeditation} style={{ pointerEvents: "all", cursor: "pointer", padding: "8px 16px", borderRadius: 14, background: `${acHex}18`, border: `1px solid ${acHex}33`, fontSize: 8, letterSpacing: 2, textTransform: "uppercase", color: `${acHex}aa`, ...ss }}>Завершить</div>
          </div>
          <div style={{ width: 100, height: 2, borderRadius: 1, background: "rgba(255,255,255,.06)", marginTop: 8, overflow: "hidden" }}>
            <div style={{ height: "100%", background: acHex, borderRadius: 1, width: medDuration ? `${(medTime / medDuration) * 100}%` : "0%", transition: "width 1s linear" }} />
          </div>
        </div>
      )}

      {/* Crystal reward popup — large and celebratory */}
      {gemPop && (
        <div key={gemPop.id} style={{ position: "absolute", inset: 0, zIndex: 40, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, rgba(240,208,96,.12) 0%, transparent 60%)", animation: "breathe 2s ease-in-out" }} />
          <div style={{ textAlign: "center", animation: "gemBurst 3.5s ease forwards" }}>
            <div style={{ fontSize: 56, color: "#F0D060", animation: "gemGlow 1.2s ease-in-out 3", lineHeight: 1 }}>+{gemPop.amount}</div>
            <div style={{ fontSize: 32, color: "#F0D060", marginTop: 4, animation: "gemGlow 1.2s ease-in-out 3" }}>⟡</div>
            <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "rgba(240,208,96,.7)", marginTop: 10, ...ss }}>кристаллов получено</div>
          </div>
        </div>
      )}

      {/* Timer picker overlay */}
      {showTimerPicker && (
        <div style={{ position: "absolute", inset: 0, zIndex: 35, background: "rgba(6,2,8,.88)", backdropFilter: "blur(12px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <div style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: `${acHex}88`, marginBottom: 8, ...ss }}>Время медитации</div>
          <div style={{ fontSize: 13, color: "rgba(200,175,158,.6)", marginBottom: 16, textAlign: "center", maxWidth: 260, lineHeight: 1.6, ...ss }}>Смотрите на орбиту и слушайте звук. Все отвлекающие элементы исчезнут.</div>
          {[{ label: "3 минуты", sec: 180 }, { label: "5 минут", sec: 300 }, { label: "10 минут", sec: 600 }, { label: "15 минут", sec: 900 }].map((opt) => (
            <div key={opt.sec} onClick={() => startMeditation(opt.sec)} style={{ cursor: "pointer", width: 200, padding: "13px 0", borderRadius: 14, textAlign: "center", background: `${acHex}18`, border: `1px solid ${acHex}33`, fontSize: 13, color: acHex, transition: "all .2s", ...ss }}>{opt.label}</div>
          ))}
          <div onClick={() => setShowTimerPicker(false)} style={{ cursor: "pointer", marginTop: 10, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "rgba(200,175,158,.35)", ...ss }}>Отмена</div>
        </div>
      )}

      {/* Active label + name — hides during meditation */}
      <div style={{ position: "absolute", top: 62, left: "50%", transform: "translateX(-50%)", textAlign: "center", pointerEvents: "none", zIndex: 20, opacity: hideUI, transition: "opacity .8s" }}>
        <div style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: (panelMode === "scenario" && activeScenario) ? activeScenario.hex : layer.hex, whiteSpace: "nowrap", ...ss }}>{(panelMode === "scenario" && activeScenario) ? activeScenario.name : layer.name}</div>
        <div style={{ fontSize: 8, letterSpacing: 2, color: "rgba(220,195,172,.3)", marginTop: 3, ...ss }}>{(panelMode === "scenario" && activeScenario) ? "сценарий" : layer.sub}</div>
      </div>

      {/* Scenario chips row — hides during meditation */}
      <div style={{ position: "absolute", top: 96, left: 0, right: 0, zIndex: 20, overflowX: "auto", padding: "0 16px 0 52px", WebkitOverflowScrolling: "touch", opacity: hideUI, transition: "opacity .8s", pointerEvents: meditating ? "none" : "auto" }}>
        <div style={{ display: "flex", gap: 6, whiteSpace: "nowrap" }}>
          <div onClick={() => { scenarioRef.current = null; setActiveScenarioState(null); }} style={{ cursor: "pointer", padding: "5px 11px", borderRadius: 14, background: !activeScenario ? "rgba(190,130,90,.25)" : "rgba(30,20,25,.5)", border: `1px solid ${!activeScenario ? "rgba(200,150,110,.45)" : "rgba(190,130,90,.15)"}`, fontSize: 8, letterSpacing: 1.5, textTransform: "uppercase", color: !activeScenario ? "rgba(240,210,178,.92)" : "rgba(200,175,158,.5)", whiteSpace: "nowrap", flexShrink: 0, ...ss }}>Нейтрально</div>
          {SCENARIOS.map((sc) => (
            <div key={sc.id} onClick={() => setScenario(activeScenario?.id === sc.id ? null : sc)} style={{ cursor: "pointer", padding: "5px 11px", borderRadius: 14, background: activeScenario?.id === sc.id ? `${sc.hex}30` : "rgba(30,20,25,.5)", border: `1px solid ${activeScenario?.id === sc.id ? sc.hex : "rgba(190,130,90,.15)"}`, fontSize: 8, letterSpacing: 1.5, textTransform: "uppercase", color: activeScenario?.id === sc.id ? sc.hex : "rgba(200,175,158,.5)", whiteSpace: "nowrap", flexShrink: 0, ...ss }}>{sc.name}</div>
          ))}
        </div>
      </div>

      {/* Bottom panel — collapsed/expanded, hidden during meditation */}
      {panelOpen && !meditating && (() => {
        const acHex = activeScenario ? activeScenario.hex : layer.hex;
        const panelTitle = activeScenario ? activeScenario.name : layer.name;
        const panelSub = activeScenario ? `Сценарий · ${layer.name}` : `Уровень ${layer.id}`;
        const panelDesc = activeScenario ? activeScenario.byLayer[layer.id] : layer.desc;
        const prof = getProfile();
        return (
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 25, transition: "all .35s cubic-bezier(.32,.72,0,1)" }}>
            <div style={{ maxWidth: 640, margin: "0 auto", background: "linear-gradient(180deg, rgba(6,2,8,0) 0%, rgba(6,2,8,.94) 16%, rgba(6,2,8,.98) 100%)", backdropFilter: "blur(20px)", borderTop: `1px solid ${acHex}22`, padding: `0 16px ${panelExpanded ? 20 : 10}px 52px`, position: "relative", maxHeight: panelExpanded ? "52%" : "auto", overflowY: panelExpanded ? "auto" : "hidden" }}>
              {/* Drag handle — toggles expanded */}
              <div onClick={() => setPanelExpanded(!panelExpanded)} style={{ display: "flex", justifyContent: "center", padding: "10px 0 6px", cursor: "pointer", position: panelExpanded ? "sticky" : "relative", top: 0, background: panelExpanded ? "linear-gradient(180deg, rgba(6,2,8,.95) 70%, transparent)" : "transparent", zIndex: 2 }}>
                <i style={{ display: "block", width: 28, height: 3, borderRadius: 2, background: `${acHex}55`, transition: "all .2s" }} />
              </div>
              {/* Title row — always visible */}
              <div onClick={() => setPanelExpanded(!panelExpanded)} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10, marginBottom: panelExpanded ? 8 : 0 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 8, letterSpacing: 2, textTransform: "uppercase", color: "rgba(190,130,90,.45)", marginBottom: 3, ...ss }}>{panelSub}</div>
                  <div style={{ fontSize: 14, fontStyle: "italic", fontWeight: "normal", color: acHex, lineHeight: 1.25, ...ss }}>{panelTitle}</div>
                </div>
                <div style={{ fontSize: 11, color: `${acHex}88`, transform: panelExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .3s" }}>▾</div>
              </div>
              {/* Expanded content */}
              {panelExpanded && (
                <div style={{ animation: "fadeUp .25s ease both" }}>
                  <div style={{ fontSize: 11, lineHeight: 1.75, color: "rgba(200,175,158,.78)", wordWrap: "break-word", marginBottom: 12, marginTop: 4, ...ss }}>{panelDesc}</div>
                  <div style={{ padding: "10px 14px", background: `${acHex}0c`, border: `1px solid ${acHex}22`, borderRadius: 10 }}>
                    <div style={{ fontSize: 8, letterSpacing: 2, textTransform: "uppercase", color: acHex, marginBottom: 5, ...ss }}>♫ {prof.label}</div>
                    <div style={{ fontSize: 10, lineHeight: 1.7, color: "rgba(200,175,158,.6)", ...ss }}>{prof.desc}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
