import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { MED_GUIDES } from "../data/medGuides";
import { logOrbitSession } from "../data/psycap";

import { TYPE, SP, RAD, OP, EASE, FONT_SERIF, FONT_SANS, tx, label, body, heading } from "../utils/design";
import { t as tr } from "../utils/i18n";

// Orbit EN translation maps for names/sounds
const EN_SCENARIO_NAME = { anxiety: "Anxiety", love: "Love · Fullness", power: "Power · Inner fire", conflict: "Inner conflict", fear: "Fear", abundance: "Abundance · Receiving", feminine: "Femininity · Flow", capital: "Psychological capital" };
const EN_LAYER = {
  1: { name: "Unconscious", sub: "center · deepest" },
  2: { name: "Self / Authenticity", sub: "level 2" },
  3: { name: "Conscious", sub: "level 3" },
  4: { name: "Feelings", sub: "level 4" },
  5: { name: "Emotions", sub: "level 5" },
  6: { name: "Behavior", sub: "outer layer" },
};
const EN_SOUND_LABEL = { neutral: "Warm silence", anxiety: "Soothing", love: "Open heart", power: "Inner fire", conflict: "Centering", fear: "Safe place", abundance: "Flow", feminine: "Flow", capital: "Stability" };
const orbLayerName = (layer, lang) => lang === "en" ? (EN_LAYER[layer.id]?.name || layer.name) : layer.name;
const orbLayerSub = (layer, lang) => lang === "en" ? (EN_LAYER[layer.id]?.sub || layer.sub) : layer.sub;
const orbScenarioName = (sc, lang) => lang === "en" ? (EN_SCENARIO_NAME[sc.id] || sc.name) : sc.name;
const orbSoundLabel = (id, original, lang) => lang === "en" ? (EN_SOUND_LABEL[id] || original) : original;

// Sound profiles: each scenario has therapeutic frequencies
// Neutral: 528 Hz (Solfeggio love/repair) + 8 Hz binaural → alpha
// Musical meditation profiles — warm pads + chord progressions
// Frequencies in Hz for chord notes (C major pentatonic, etc.)
// Each profile = root drone + chord pad + scale for random chimes
const SOUND_PROFILES = {
  neutral:  { label: "Тёплая тишина",   root: 130.81, chord: [261.63, 329.63, 392.00, 523.25], scale: [523.25, 587.33, 659.25, 783.99, 880.00], desc: "Тёплый пад в тональности C-мажор — мягкий фон для любого состояния. Редкие колокольчики создают ощущение тишины и простора." },
  anxiety:  { label: "Успокоение",      root: 110.00, chord: [220.00, 261.63, 329.63, 440.00], scale: [440.00, 493.88, 523.25, 587.33, 659.25], desc: "Глубокий медленный пад в A-миноре — тональность мягкости и восстановления. Очень тихо, без резких тонов. Нервная система постепенно замедляется." },
  love:     { label: "Открытое сердце", root: 146.83, chord: [293.66, 369.99, 440.00, 587.33], scale: [587.33, 659.25, 739.99, 880.00, 987.77], desc: "Тёплая гармония D-мажора с мягкими колокольчиками — резонанс сердечной чакры. Наполненность и нежность." },
  power:    { label: "Внутренний огонь",root: 164.81, chord: [329.63, 415.30, 493.88, 659.25], scale: [659.25, 739.99, 830.61, 987.77, 1108.73], desc: "Уверенный E-мажорный пад с лёгкими восходящими колокольчиками — поддерживает решимость без напряжения." },
  conflict: { label: "Центрирование",   root: 123.47, chord: [246.94, 311.13, 369.99, 493.88], scale: [493.88, 554.37, 622.25, 739.99, 830.61], desc: "Мягкий пад между мажором и минором — помогает найти центр посреди противоречий. Успокаивающая неопределённость." },
  fear:     { label: "Безопасное место",root: 98.00,  chord: [196.00, 246.94, 293.66, 392.00], scale: [392.00, 440.00, 493.88, 587.33, 659.25], desc: "Глубокий низкий пад в G-миноре — как тёплые объятия. Нервной системе сигнал: безопасно, можно расслабиться." },
  abundance:{ label: "Поток",           root: 174.61, chord: [349.23, 440.00, 523.25, 698.46], scale: [698.46, 783.99, 880.00, 1046.50, 1174.66], desc: "Светлый F-мажорный пад с частыми колокольчиками — ощущение открытости и щедрого потока." },
  feminine: { label: "Текучесть",       root: 220.00, chord: [277.18, 329.63, 440.00, 554.37], scale: [554.37, 622.25, 739.99, 880.00, 987.77], desc: "Плавный женственный пад в C#-миноре — мягкие тона колокольчиков создают ощущение танца и текучести." },
  capital:  { label: "Устойчивость",    root: 130.81, chord: [261.63, 329.63, 392.00, 523.25], scale: [523.25, 659.25, 783.99, 987.77, 1174.66], desc: "Устойчивый C-мажорный пад с редкими ясными колокольчиками — основа для фокусированной уверенности." },
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

export default function Orbit({ setScreen, addGems, doMarkPractice, initScenario, clearInitScenario, lang = "ru" }) {
  const L = (k, ...a) => tr(lang, k, ...a);
  const isDay = false;
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
  const [isPaused, setIsPaused] = useState(false);
  const pauseStartRef = useRef(0);
  const pausedTotalRef = useRef(0);
  const [showIntro, setShowIntro] = useState(false);
  // Clear any stale intro flag from previous versions
  useEffect(() => { localStorage.removeItem("frisson_orbit_intro"); }, []);
  const dismissIntro = () => setShowIntro(false);
  const timerRef = useRef(null);
  const [gemPop, setGemPop] = useState(null);
  const medDurationRef = useRef(0);
  const medStartRef = useRef(0);
  const [soundOn, setSoundOn] = useState(false);
  const audioRef = useRef({ ctx: null, gain: null, oscs: [], analyser: null, freq: new Uint8Array(64), bass: 0, mid: 0 });

  const layer = LAYERS[activeId - 1];

  // Pre-select scenario from prop (e.g. from Profile recommendation)
  useEffect(() => {
    if (initScenario) {
      const sc = SCENARIOS.find((s) => s.id === initScenario);
      if (sc) {
        scenarioRef.current = sc;
        setActiveScenarioState(sc);
        setPanelMode("scenario");
        setPanelOpen(true);
        setPanelExpanded(true);
      }
      if (clearInitScenario) clearInitScenario();
    }
  }, [initScenario]);

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
    if (a.bellTimers) { a.bellTimers.forEach((t) => clearTimeout(t)); a.bellTimers = []; }
    if (!a.ctx) return;
    (a.oscs || []).forEach((o) => { try { o.stop(); } catch (e) {} });
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
    const ctx = a.ctx;

    // Master gain with slow fade-in
    a.gain = ctx.createGain();
    a.gain.gain.setValueAtTime(0, ctx.currentTime);
    a.gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 4);
    a.analyser = ctx.createAnalyser(); a.analyser.fftSize = 128;
    a.gain.connect(a.analyser);

    // Soft reverb via convolver (simple exponential decay impulse)
    const convLen = ctx.sampleRate * 3;
    const impulse = ctx.createBuffer(2, convLen, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = impulse.getChannelData(ch);
      for (let i = 0; i < convLen; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / convLen, 2.5);
      }
    }
    const conv = ctx.createConvolver();
    conv.buffer = impulse;
    const wetGain = ctx.createGain(); wetGain.gain.value = 0.4;
    const dryGain = ctx.createGain(); dryGain.gain.value = 0.8;
    conv.connect(wetGain);
    wetGain.connect(a.gain);
    dryGain.connect(a.gain);
    a.gain.connect(ctx.destination);

    // Warmth filter — rolls off brightness for softer pad
    const warmth = ctx.createBiquadFilter();
    warmth.type = "lowpass";
    warmth.frequency.value = 1600;
    warmth.Q.value = 0.3;
    warmth.connect(conv);
    warmth.connect(dryGain);

    // ── Drone root (deep foundation)
    const droneOsc = ctx.createOscillator();
    const droneGain = ctx.createGain();
    droneOsc.type = "sine";
    droneOsc.frequency.value = prof.root;
    droneGain.gain.value = 0.18;
    droneOsc.connect(droneGain); droneGain.connect(warmth);
    droneOsc.start();

    // Slow drone detune (breathing effect)
    const droneLfo = ctx.createOscillator();
    const droneLfoGain = ctx.createGain();
    droneLfo.type = "sine";
    droneLfo.frequency.value = 0.08;
    droneLfoGain.gain.value = 1.5;
    droneLfo.connect(droneLfoGain); droneLfoGain.connect(droneOsc.frequency);
    droneLfo.start();

    // ── Chord pad — layered sine oscillators for each chord note
    const chordOscs = [];
    const chordGains = [];
    prof.chord.forEach((freq, i) => {
      // Two slightly detuned oscillators per note for rich texture
      [0, 1].forEach((det) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = i < 2 ? "sine" : "triangle"; // lower notes sine, upper triangle for soft shimmer
        o.frequency.value = freq * (det === 0 ? 1 : 1.005);
        g.gain.value = 0;
        // Slow fade-in per voice
        g.gain.setValueAtTime(0, ctx.currentTime);
        g.gain.linearRampToValueAtTime(0.1 / (1 + i * 0.5), ctx.currentTime + 5 + i);
        o.connect(g); g.connect(warmth);
        o.start();
        chordOscs.push(o);
        chordGains.push(g);
      });
    });

    // ── Slow chord volume LFO — breathing pad
    const padLfo = ctx.createOscillator();
    const padLfoGain = ctx.createGain();
    padLfo.type = "sine";
    padLfo.frequency.value = 0.06;
    padLfoGain.gain.value = 0.03;
    padLfo.connect(padLfoGain);
    padLfoGain.connect(a.gain.gain);
    padLfo.start();

    // ── Random bell/bowl chimes from scale
    const bellTimers = [];
    const scheduleBell = () => {
      if (!a.ctx) return;
      const t = ctx.currentTime;
      const freq = prof.scale[Math.floor(Math.random() * prof.scale.length)];
      // Triangle wave with long decay = singing bowl feel
      const bOsc = ctx.createOscillator();
      const bOsc2 = ctx.createOscillator(); // second voice for harmonic
      const bGain = ctx.createGain();
      bOsc.type = "sine";
      bOsc2.type = "sine";
      bOsc.frequency.value = freq;
      bOsc2.frequency.value = freq * 2.01; // slightly detuned harmonic
      bGain.gain.setValueAtTime(0, t);
      bGain.gain.linearRampToValueAtTime(0.08, t + 0.08);
      bGain.gain.exponentialRampToValueAtTime(0.001, t + 5);
      const bPan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      if (bPan) bPan.pan.value = (Math.random() - 0.5) * 0.6;
      bOsc.connect(bGain);
      bOsc2.connect(bGain);
      if (bPan) { bGain.connect(bPan); bPan.connect(warmth); }
      else bGain.connect(warmth);
      bOsc.start(t); bOsc2.start(t);
      bOsc.stop(t + 5.5); bOsc2.stop(t + 5.5);
      // Schedule next bell — more frequent for positive scenarios
      const positiveIds = ["love", "feminine", "abundance", "capital"];
      const nextDelay = positiveIds.includes(profileId) ? 5000 + Math.random() * 6000 : 9000 + Math.random() * 9000;
      const nextTimer = setTimeout(scheduleBell, nextDelay);
      bellTimers.push(nextTimer);
    };
    const firstBell = setTimeout(scheduleBell, 4000 + Math.random() * 3000);
    bellTimers.push(firstBell);

    a.bellTimers = bellTimers;
    a.oscs = [droneOsc, droneLfo, padLfo, ...chordOscs];
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
    try { if (addGems) addGems(earned); } catch (e) {}
    try { if (doMarkPractice) doMarkPractice(Math.round(seconds / 60)); } catch (e) {}
    try {
      const curLayer = LAYERS[activeId - 1];
      if (curLayer) logOrbitSession(activeId, curLayer.name, activeScenario?.name);
    } catch (e) {}
    setGemPop({ amount: earned, id: Date.now() });
    setTimeout(() => setGemPop(null), 4000);
  }

  function startMeditation(seconds) {
    try {
      // Always start meditation UI first — audio is secondary
      setShowTimerPicker(false);
      setMeditating(true);
      setIsPaused(false);
      pausedTotalRef.current = 0;
      pauseStartRef.current = 0;
      setMedDuration(seconds);
      setMedTime(seconds);
      medDurationRef.current = seconds;
      medStartRef.current = Date.now();

      // Try to start audio (may fail on iOS if AudioContext blocked)
      try {
        buildSound(activeScenario?.id || "neutral");
        setSoundOn(true);
      } catch (audioErr) {
        console.warn("Audio failed to start:", audioErr);
      }

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        try {
          // Skip if paused
          if (pauseStartRef.current > 0) return;
          const elapsedMs = Date.now() - medStartRef.current - pausedTotalRef.current;
          const elapsed = Math.floor(elapsedMs / 1000);
          const remaining = Math.max(0, medDurationRef.current - elapsed);
          setMedTime(remaining);
          if (remaining <= 0) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            try { stopSound(); } catch (e) {}
            setSoundOn(false);
            setMeditating(false);
            setIsPaused(false);
            try { awardCrystals(medDurationRef.current); } catch (e) { console.warn("Award failed:", e); }
            medStartRef.current = 0;
            medDurationRef.current = 0;
            pausedTotalRef.current = 0;
            pauseStartRef.current = 0;
          }
        } catch (tickErr) {
          console.error("Timer tick error:", tickErr);
        }
      }, 200);
    } catch (err) {
      console.error("startMeditation failed:", err);
      setMeditating(false);
      setShowTimerPicker(false);
    }
  }

  function pauseMeditation() {
    if (isPaused) return;
    pauseStartRef.current = Date.now();
    setIsPaused(true);
    // Fade sound out but keep ctx alive for resume
    const a = audioRef.current;
    if (a.ctx && a.gain) {
      try {
        a.gain.gain.cancelScheduledValues(a.ctx.currentTime);
        a.gain.gain.setValueAtTime(a.gain.gain.value, a.ctx.currentTime);
        a.gain.gain.linearRampToValueAtTime(0, a.ctx.currentTime + 0.4);
      } catch (e) {}
    }
  }

  function resumeMeditation() {
    if (!isPaused) return;
    // Add paused duration to total
    pausedTotalRef.current += Date.now() - pauseStartRef.current;
    pauseStartRef.current = 0;
    setIsPaused(false);
    // Fade sound back in
    const a = audioRef.current;
    if (a.ctx && a.gain) {
      try {
        a.gain.gain.cancelScheduledValues(a.ctx.currentTime);
        a.gain.gain.setValueAtTime(0, a.ctx.currentTime);
        a.gain.gain.linearRampToValueAtTime(0.35, a.ctx.currentTime + 1.5);
      } catch (e) {}
    }
  }

  function stopMeditation() {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    const elapsedMs = Date.now() - medStartRef.current - pausedTotalRef.current;
    const elapsed = Math.floor(elapsedMs / 1000);
    stopSound();
    setSoundOn(false);
    setMeditating(false);
    setIsPaused(false);
    setMedTime(0);
    if (elapsed >= 30) awardCrystals(elapsed);
    // Reset refs so healing physics stops
    medStartRef.current = 0;
    medDurationRef.current = 0;
    pausedTotalRef.current = 0;
    pauseStartRef.current = 0;
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
    // Fallback dimensions if container hasn't laid out yet
    const initW = canvas.clientWidth || canvas.parentElement?.clientWidth || window.innerWidth;
    const initH = canvas.clientHeight || canvas.parentElement?.clientHeight || window.innerHeight;
    renderer.setSize(initW, initH);
    renderer.setClearColor(isDay ? 0xEDE8E4 : 0x060208, 1);

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
    const camera = new THREE.PerspectiveCamera(45, (initW || 1) / (initH || 1), 1, 1000);
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
    const blendMode = isDay ? THREE.NormalBlending : THREE.AdditiveBlending;
    const mat = new THREE.PointsMaterial({ color: new THREE.Color(LAYERS[0].col), size: 0.8, map: sprite, transparent: true, opacity: isDay ? 0.9 : 0.82, sizeAttenuation: true, blending: blendMode, depthWrite: false });
    const points = new THREE.Points(geo, mat); scene.add(points);

    const MAX_L = 8000, LPA = new Float32Array(MAX_L * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(LPA, 3));
    lineGeo.setDrawRange(0, 0);
    const lineMat = new THREE.LineBasicMaterial({ color: new THREE.Color(LAYERS[0].lc), transparent: true, opacity: 0, blending: blendMode, depthWrite: false });
    const lines = new THREE.LineSegments(lineGeo, lineMat); scene.add(lines);

    const MAX_E = 200, EPA = new Float32Array(MAX_E * 3);
    const elGeo = new THREE.BufferGeometry();
    elGeo.setAttribute("position", new THREE.BufferAttribute(EPA, 3));
    elGeo.setDrawRange(0, 0);
    const elMat = new THREE.PointsMaterial({ color: isDay ? 0x4030a0 : 0xffddcc, size: 2.2, map: sprite, transparent: true, opacity: 1, sizeAttenuation: true, blending: blendMode, depthWrite: false });
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
      // Fear needs MORE healing since its contraction is strongest
      const isFear = sc && sc.id === "fear";
      const fadeStrength = isFear ? 0.95 : 0.85;
      const expandStrength = isFear ? 0.8 : 0.4;
      const healFade = isNegative ? (1 - hp * fadeStrength) : 1;
      const healExpand = isNegative ? (1 + hp * expandStrength) : (isPositive ? (1 + hp * 0.15) : 1);
      const healSpeed = isNegative ? (1 - hp * 0.6) : (isPositive ? (1 + hp * 0.1) : 1);
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
          if (hp > 0 && isNegative) {
            const expand = (isFear ? 0.0012 : 0.0004) * hp;
            VA[i3] += (x/d) * expand; VA[i3+1] += (y/d) * expand; VA[i3+2] += (z/d) * expand;
          }
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
      const w = canvas.clientWidth || canvas.parentElement?.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || canvas.parentElement?.clientHeight || window.innerHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);
    // ResizeObserver catches layout changes (e.g. when navigating from another screen)
    let ro = null;
    if (typeof ResizeObserver !== "undefined" && canvas.parentElement) {
      ro = new ResizeObserver(onResize);
      ro.observe(canvas.parentElement);
    }
    // Also force a resize on the next two frames in case mount-time dims were 0
    requestAnimationFrame(() => { onResize(); requestAnimationFrame(onResize); });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      if (ro) ro.disconnect();
      renderer.dispose(); geo.dispose(); mat.dispose(); lineGeo.dispose(); lineMat.dispose(); elGeo.dispose(); elMat.dispose(); sprite.dispose();
      cleanupAudio();
    };
  }, []);

  // Cleanup meditation timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
      medStartRef.current = 0;
      medDurationRef.current = 0;
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

  const ss = { fontFamily: FONT_SERIF };
  const fmtTimer = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  // Current guide text during meditation
  const guideText = (() => {
    if (!meditating || medDuration === 0) return null;
    const progress = 1 - (medTime / medDuration);
    const guideId = activeScenario?.id || "neutral";
    const guide = MED_GUIDES[guideId] || MED_GUIDES.neutral;
    let current = null;
    for (let i = guide.length - 1; i >= 0; i--) {
      if (progress >= guide[i].at) { current = guide[i]; break; }
    }
    return current;
  })();
  const acHex = activeScenario ? activeScenario.hex : layer.hex;
  const hideUI = meditating ? 0 : 1;

  return (
    <div style={{ position: "relative", width: "100%", flex: 1, minHeight: 0, background: isDay ? "#EDE8E4" : "#060208", overflow: "hidden" }}>
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} />
      <div ref={touchRef} style={{ position: "absolute", inset: 0, zIndex: 5, touchAction: "none", pointerEvents: showTimerPicker || meditating ? "none" : "auto" }} />

      {/* Sidebar — hides during meditation */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 44, zIndex: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: SP.sm, padding: "80px 0", background: "linear-gradient(90deg, rgba(6,2,8,.7), transparent)", opacity: hideUI, transition: "opacity .8s", pointerEvents: meditating ? "none" : "auto" }}>
        {LAYERS.map((l) => (
          <div key={l.id} onClick={() => openLayer(l.id)} style={{ width: 36, display: "flex", flexDirection: "column", alignItems: "center", gap: SP.xs, cursor: "pointer", opacity: activeId === l.id ? 1 : OP.tertiary, transition: EASE.normal, padding: `${SP.xs}px 0` }}>
            <span style={{ width: activeId === l.id ? 10 : 7, height: activeId === l.id ? 10 : 7, borderRadius: "50%", background: l.hex, boxShadow: activeId === l.id ? `0 0 ${SP.md}px ${l.hex}` : `0 0 ${SP.xs}px ${l.hex}66`, display: "block", transition: EASE.normal }} />
            <span style={{ fontSize: 7, letterSpacing: 1, color: activeId === l.id ? "rgba(240,220,200,.85)" : "rgba(210,185,162,.5)", ...ss }}>{l.id}</span>
          </div>
        ))}
      </div>

      {/* Top bar — partially hides during meditation */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${SP.lg}px 0 52px`, background: meditating ? "transparent" : "linear-gradient(180deg, rgba(6,2,8,.86), transparent)", zIndex: 30, pointerEvents: "none", transition: "background .8s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: SP.md, opacity: hideUI, transition: "opacity .8s" }}>
          <div onClick={() => { if (meditating) return; setScreen("home"); }} style={{ pointerEvents: meditating ? "none" : "all", cursor: "pointer", fontSize: 15, color: "rgba(210,175,145,.5)", padding: `${SP.xs}px ${SP.sm}px` }}>←</div>
          <div>
            <div style={{ fontSize: 8, letterSpacing: 5, textTransform: "uppercase", color: "rgba(190,130,90,.42)", ...ss }}>Frisson</div>
            <div style={{ fontSize: TYPE.base, fontStyle: "italic", color: "rgba(228,202,182,.38)", marginTop: 2, ...ss }}>{L("orb_title")}</div>
          </div>
          <button type="button" onClick={() => setShowIntro(true)} style={{ pointerEvents: meditating ? "none" : "all", cursor: "pointer", width: SP.xxl, height: SP.xxl, borderRadius: "50%", border: "1px solid rgba(210,175,145,.3)", background: "rgba(6,2,8,.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "rgba(210,175,145,.7)", marginLeft: 6, touchAction: "manipulation", WebkitAppearance: "none", padding: 0, ...ss }}>?</button>
        </div>
        <button onClick={toggleSound} style={{ pointerEvents: "all", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, background: soundOn ? "rgba(140,30,60,.36)" : "rgba(100,20,50,.2)", border: `1px solid ${soundOn ? "rgba(200,130,90,.5)" : "rgba(190,130,90,.25)"}`, borderRadius: SP.lg, padding: "5px 11px", fontSize: 8, letterSpacing: 2, textTransform: "uppercase", color: soundOn ? "rgba(240,210,178,.92)" : "rgba(210,175,145,.6)", transition: EASE.normal, whiteSpace: "nowrap", ...ss }}>{meditating ? L("orb_stop") : soundOn ? L("orb_stop") : `♫ ${orbSoundLabel((activeScenario?.id || "neutral"), getProfile().label, lang)}`}</button>
      </div>

      {/* Meditation: guide text + timer */}
      {meditating && (() => {
        const breathEl = guideText?.breath && (
          <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: guideText.breath === "in" ? "rgba(190,230,245,.95)" : guideText.breath === "hold" ? "rgba(250,220,120,.9)" : "rgba(230,185,205,.95)", marginBottom: SP.xs, ...ss }}>
            {guideText.breath === "in" ? L("orb_breath_in") : guideText.breath === "hold" ? L("orb_breath_hold") : L("orb_breath_out")}
          </div>
        );
        const textEl = guideText && (
          <div style={{ fontSize: 15, fontStyle: "italic", lineHeight: 1.55, color: "rgba(255,248,240,.96)", ...ss }}>{guideText.text}</div>
        );
        return (
          <>
            {/* Text always at top, inside a dark blurred pill — readable over any orb */}
            {guideText && (
              <div key={guideText.text} style={{ position: "absolute", left: SP.lg, right: SP.lg, top: 80, zIndex: 27, pointerEvents: "none", display: "flex", justifyContent: "center", animation: "fadeUp .6s ease both" }}>
                <div style={{
                  maxWidth: 380, padding: `${SP.md}px ${SP.lg}px`,
                  background: "rgba(6,2,8,.72)",
                  backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
                  borderRadius: RAD.lg,
                  border: `1px solid ${acHex}28`,
                  textAlign: "center",
                  boxShadow: "0 4px 24px rgba(0,0,0,.5)",
                }}>
                  {breathEl}
                  {textEl}
                </div>
              </div>
            )}

            {/* Bottom block: timer only (text moved to top) */}
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 10, zIndex: 28, display: "flex", flexDirection: "column", alignItems: "center", pointerEvents: "none" }}>{false && (<div />)}
              <div style={{ background: "rgba(6,2,8,.75)", backdropFilter: "blur(12px)", borderRadius: RAD.lg, padding: `10px ${SP.lg}px`, display: "flex", alignItems: "center", gap: SP.md, border: `1px solid ${acHex}22` }}>
                <div style={{ fontSize: TYPE.xl, fontWeight: 200, color: `${acHex}cc`, letterSpacing: 2, minWidth: 56, textAlign: "center", ...ss }}>{fmtTimer(medTime)}</div>
                <div style={{ width: 1, height: SP.xl, background: `${acHex}22` }} />
                <button type="button" onClick={isPaused ? resumeMeditation : pauseMeditation} style={{ pointerEvents: "all", cursor: "pointer", padding: `6px ${SP.md}px`, borderRadius: RAD.md, background: `${acHex}28`, border: `1px solid ${acHex}55`, fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: "#fff", touchAction: "manipulation", WebkitAppearance: "none", ...ss }}>{isPaused ? L("orb_resume") : L("orb_pause")}</button>
                <button type="button" onClick={stopMeditation} style={{ pointerEvents: "all", cursor: "pointer", padding: `6px ${SP.md}px`, borderRadius: RAD.md, background: `${acHex}18`, border: `1px solid ${acHex}33`, fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: `${acHex}cc`, touchAction: "manipulation", WebkitAppearance: "none", ...ss }}>{L("orb_stop_short")}</button>
              </div>
              <div style={{ width: 80, height: 2, borderRadius: 1, background: "rgba(255,255,255,.06)", marginTop: 6, overflow: "hidden" }}>
                <div style={{ height: "100%", background: acHex, borderRadius: 1, width: medDuration ? `${(medTime / medDuration) * 100}%` : "0%", transition: "width 1s linear" }} />
              </div>
            </div>
          </>
        );
      })()}

      {/* Crystal reward popup — large and celebratory */}
      {gemPop && (
        <div key={gemPop.id} style={{ position: "absolute", inset: 0, zIndex: 40, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, rgba(240,208,96,.12) 0%, transparent 60%)", animation: "breathe 2s ease-in-out" }} />
          <div style={{ textAlign: "center", animation: "gemBurst 3.5s ease forwards" }}>
            <div style={{ fontSize: 56, color: "#F0D060", animation: "gemGlow 1.2s ease-in-out 3", lineHeight: 1 }}>+{gemPop.amount}</div>
            <div style={{ fontSize: 32, color: "#F0D060", marginTop: 4, animation: "gemGlow 1.2s ease-in-out 3" }}>⟡</div>
            <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "rgba(240,208,96,.7)", marginTop: SP.md, ...ss }}>{L("orb_gems_received")}</div>
          </div>
        </div>
      )}

      {/* First-visit intro overlay */}
      {showIntro && !showTimerPicker && !meditating && (
        <div style={{ position: "absolute", inset: 0, zIndex: 55, background: "rgba(6,2,8,.95)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", pointerEvents: "auto", overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
          <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", padding: `40px ${SP.xl}px 40px` }}>
          <div style={{ maxWidth: 340, width: "100%", textAlign: "center" }}>
            <div style={{ fontFamily: FONT_SANS, fontSize: 9, letterSpacing: ".3em", textTransform: "uppercase", color: "rgba(230,180,200,.6)", marginBottom: 10 }}>✦ {L("orb_title")} ✦</div>
            <div style={{ ...heading(TYPE.xxl), color: "#fff", marginBottom: 18 }}>{L("orb_intro_title")}</div>

            <div style={{ ...body(TYPE.base), color: "rgba(245,235,230,.78)", marginBottom: 18 }} dangerouslySetInnerHTML={{ __html: L("orb_intro_body") }} />

            <div style={{ padding: `${SP.md}px ${SP.md + 2}px`, background: `rgba(255,255,255,${OP.bgSubtle})`, border: `1px solid rgba(255,255,255,${OP.bgSubtle + 0.02})`, borderRadius: RAD.md, marginBottom: SP.md, textAlign: "left" }}>
              <div style={{ ...label(), fontSize: 9, color: "rgba(230,180,200,.65)", marginBottom: 6 }}>{L("orb_intro_layers")}</div>
              <div style={{ fontFamily: FONT_SERIF, fontSize: TYPE.sm, lineHeight: 1.75, color: "rgba(245,235,230,.7)" }} dangerouslySetInnerHTML={{ __html: L("orb_intro_layers_body") }} />
            </div>

            <div style={{ padding: `${SP.md}px ${SP.md + 2}px`, background: `rgba(255,255,255,${OP.bgSubtle})`, border: `1px solid rgba(255,255,255,${OP.bgSubtle + 0.02})`, borderRadius: RAD.md, marginBottom: SP.md, textAlign: "left" }}>
              <div style={{ ...label(), fontSize: 9, color: "rgba(230,180,200,.65)", marginBottom: 6 }}>{L("orb_intro_scenarios")}</div>
              <div style={{ fontFamily: FONT_SERIF, fontSize: TYPE.sm, lineHeight: 1.75, color: "rgba(245,235,230,.7)" }}>{L("orb_intro_scenarios_body")}</div>
            </div>

            <div style={{ padding: `${SP.md}px ${SP.md + 2}px`, background: `rgba(255,255,255,${OP.bgSubtle})`, border: `1px solid rgba(255,255,255,${OP.bgSubtle + 0.02})`, borderRadius: RAD.md, marginBottom: SP.page, textAlign: "left" }}>
              <div style={{ ...label(), fontSize: 9, color: "rgba(230,180,200,.65)", marginBottom: 6 }}>{L("orb_intro_medit")}</div>
              <div style={{ fontFamily: FONT_SERIF, fontSize: TYPE.sm, lineHeight: 1.75, color: "rgba(245,235,230,.7)" }}>{L("orb_intro_medit_body")}</div>
            </div>

            <button type="button" onClick={dismissIntro} style={{ padding: `14px ${SP.xxl}px`, borderRadius: RAD.lg + 4, background: "linear-gradient(135deg, rgba(230,77,168,.55), rgba(240,136,56,.45))", border: "1.5px solid rgba(240,136,56,.7)", fontFamily: FONT_SANS, fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "#fff", cursor: "pointer", boxShadow: `0 0 ${SP.xl}px rgba(230,77,168,.3)`, touchAction: "manipulation", WebkitAppearance: "none", marginTop: SP.sm }}>{L("orb_start")}</button>
            <div onClick={dismissIntro} style={{ marginTop: 14, padding: `${SP.sm}px ${SP.lg}px`, fontFamily: FONT_SANS, fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", color: `rgba(245,235,230,${OP.tertiary})`, cursor: "pointer" }}>{L("orb_skip")}</div>
          </div>
          </div>
        </div>
      )}

      {/* Timer picker overlay */}
      {showTimerPicker && (
        <div style={{ position: "absolute", inset: 0, zIndex: 50, background: "rgba(6,2,8,.85)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, pointerEvents: "auto", padding: SP.xl }}>
          <div style={{ fontSize: TYPE.xs, letterSpacing: 3, textTransform: "uppercase", color: `${acHex}cc`, marginBottom: 6, ...ss }}>{L("orb_time_medit")}</div>
          <div style={{ fontSize: 13, color: `rgba(220,200,180,.7)`, marginBottom: SP.page, textAlign: "center", maxWidth: 280, lineHeight: 1.6, ...ss }}>{L("orb_watch_listen")}</div>
          {[{ label: L("orb_3min"), sec: 180 }, { label: L("orb_5min"), sec: 300 }, { label: L("orb_10min"), sec: 600 }, { label: L("orb_15min"), sec: 900 }].map((opt) => (
            <button key={opt.sec} type="button" onClick={(e) => { e.stopPropagation(); startMeditation(opt.sec); }} style={{ cursor: "pointer", width: 220, padding: `${SP.lg}px 0`, borderRadius: SP.lg, textAlign: "center", background: `${acHex}33`, border: `1.5px solid ${acHex}`, fontSize: 15, color: "#fff", fontWeight: 400, touchAction: "manipulation", WebkitAppearance: "none", margin: 0, ...ss }}>{opt.label}</button>
          ))}
          <button type="button" onClick={(e) => { e.stopPropagation(); setShowTimerPicker(false); }} style={{ cursor: "pointer", marginTop: SP.md, padding: `10px ${SP.page}px`, background: "transparent", border: "none", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: `rgba(220,200,180,${OP.secondary})`, touchAction: "manipulation", WebkitAppearance: "none", ...ss }}>{L("cancel")}</button>
        </div>
      )}

      {/* Active label + name — hides during meditation */}
      <div style={{ position: "absolute", top: 62, left: "50%", transform: "translateX(-50%)", textAlign: "center", pointerEvents: "none", zIndex: 20, opacity: hideUI, transition: "opacity .8s" }}>
        <div style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: (panelMode === "scenario" && activeScenario) ? activeScenario.hex : layer.hex, whiteSpace: "nowrap", ...ss }}>{(panelMode === "scenario" && activeScenario) ? orbScenarioName(activeScenario, lang) : orbLayerName(layer, lang)}</div>
        <div style={{ fontSize: 8, letterSpacing: 2, color: `rgba(220,195,172,${OP.tertiary})`, marginTop: 3, ...ss }}>{(panelMode === "scenario" && activeScenario) ? L("orb_scenario") : orbLayerSub(layer, lang)}</div>
      </div>

      {/* Scenario chips row — hides during meditation */}
      <div style={{ position: "absolute", top: 96, left: 0, right: 0, zIndex: 20, overflowX: "auto", padding: `0 ${SP.lg}px 0 52px`, WebkitOverflowScrolling: "touch", opacity: hideUI, transition: "opacity .8s", pointerEvents: meditating ? "none" : "auto" }}>
        <div style={{ display: "flex", gap: 6, whiteSpace: "nowrap" }}>
          <div onClick={() => { scenarioRef.current = null; setActiveScenarioState(null); }} style={{ cursor: "pointer", padding: "5px 11px", borderRadius: RAD.md, background: !activeScenario ? "rgba(190,130,90,.25)" : "rgba(30,20,25,.5)", border: `1px solid ${!activeScenario ? "rgba(200,150,110,.45)" : "rgba(190,130,90,.15)"}`, fontSize: 8, letterSpacing: 1.5, textTransform: "uppercase", color: !activeScenario ? `rgba(240,210,178,${OP.primary})` : `rgba(200,175,158,${OP.secondary})`, whiteSpace: "nowrap", flexShrink: 0, ...ss }}>{L("orb_neutral")}</div>
          {SCENARIOS.map((sc) => (
            <div key={sc.id} onClick={() => setScenario(activeScenario?.id === sc.id ? null : sc)} style={{ cursor: "pointer", padding: "5px 11px", borderRadius: RAD.md, background: activeScenario?.id === sc.id ? `${sc.hex}30` : "rgba(30,20,25,.5)", border: `1px solid ${activeScenario?.id === sc.id ? sc.hex : "rgba(190,130,90,.15)"}`, fontSize: 8, letterSpacing: 1.5, textTransform: "uppercase", color: activeScenario?.id === sc.id ? sc.hex : `rgba(200,175,158,${OP.secondary})`, whiteSpace: "nowrap", flexShrink: 0, ...ss }}>{orbScenarioName(sc, lang)}</div>
          ))}
        </div>
      </div>

      {/* Bottom panel — collapsed/expanded, hidden during meditation */}
      {panelOpen && !meditating && (() => {
        const acHex = activeScenario ? activeScenario.hex : layer.hex;
        const panelTitle = activeScenario ? orbScenarioName(activeScenario, lang) : orbLayerName(layer, lang);
        const panelSub = activeScenario ? `${L("orb_scenario_of")} · ${orbLayerName(layer, lang)}` : `${L("orb_level")} ${layer.id}`;
        const panelDesc = activeScenario ? activeScenario.byLayer[layer.id] : layer.desc;
        const prof = getProfile();
        return (
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 25, transition: "all .35s cubic-bezier(.32,.72,0,1)" }}>
            <div style={{ maxWidth: 640, margin: "0 auto", background: "linear-gradient(180deg, rgba(6,2,8,0) 0%, rgba(6,2,8,.94) 16%, rgba(6,2,8,.98) 100%)", backdropFilter: "blur(20px)", borderTop: `1px solid ${acHex}22`, padding: `0 ${SP.lg}px ${panelExpanded ? SP.page : 10}px 52px`, position: "relative", maxHeight: panelExpanded ? "52%" : "auto", overflowY: panelExpanded ? "auto" : "hidden" }}>
              {/* Drag handle — toggles expanded */}
              <div onClick={() => setPanelExpanded(!panelExpanded)} style={{ display: "flex", justifyContent: "center", padding: "10px 0 6px", cursor: "pointer", position: panelExpanded ? "sticky" : "relative", top: 0, background: panelExpanded ? "linear-gradient(180deg, rgba(6,2,8,.95) 70%, transparent)" : "transparent", zIndex: 2 }}>
                <i style={{ display: "block", width: 28, height: 3, borderRadius: 2, background: `${acHex}55`, transition: EASE.fast }} />
              </div>
              {/* Title row — always visible */}
              <div onClick={() => setPanelExpanded(!panelExpanded)} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 10, marginBottom: panelExpanded ? SP.sm : 0 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 8, letterSpacing: 2, textTransform: "uppercase", color: "rgba(190,130,90,.45)", marginBottom: 3, ...ss }}>{panelSub}</div>
                  <div style={{ fontSize: TYPE.base, fontStyle: "italic", fontWeight: "normal", color: acHex, lineHeight: 1.25, ...ss }}>{panelTitle}</div>
                </div>
                <div style={{ fontSize: 11, color: `${acHex}88`, transform: panelExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .3s" }}>▾</div>
              </div>
              {/* Expanded content */}
              {panelExpanded && (
                <div style={{ animation: "fadeUp .25s ease both" }}>
                  <div style={{ fontSize: 11, lineHeight: 1.75, color: "rgba(200,175,158,.78)", wordWrap: "break-word", marginBottom: SP.md, marginTop: SP.xs, ...ss }}>{panelDesc}</div>
                  <div style={{ padding: `10px ${SP.md + 2}px`, background: `${acHex}0c`, border: `1px solid ${acHex}22`, borderRadius: RAD.sm + 2 }}>
                    <div style={{ fontSize: 8, letterSpacing: 2, textTransform: "uppercase", color: acHex, marginBottom: 5, ...ss }}>♫ {prof.label}</div>
                    <div style={{ fontSize: TYPE.xs, lineHeight: 1.7, color: "rgba(200,175,158,.6)", ...ss }}>{prof.desc}</div>
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
