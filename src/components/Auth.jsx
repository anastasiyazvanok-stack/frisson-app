import { useState } from "react";
import { signIn, signUp, resetPassword, supabase } from "../lib/supabase";
import { TYPE, SP, RAD, EASE, FONT_SERIF, FONT_SANS, label, heading } from "../utils/design";

const INPUT_STYLE = {
  width: "100%",
  padding: `${SP.md + 4}px ${SP.lg}px`,
  borderRadius: RAD.md,
  background: "rgba(0,0,0,.3)",
  border: "1px solid rgba(200,160,180,.18)",
  outline: "none",
  fontFamily: FONT_SANS,
  fontSize: TYPE.sm + 2,
  fontWeight: 300,
  color: "rgba(245,235,230,.9)",
  caretColor: "rgba(230,77,168,.8)",
  backdropFilter: "blur(12px)",
  transition: EASE.normal,
  boxSizing: "border-box",
  WebkitAppearance: "none",
};

function Orb({ style, color = "230,77,168", opacity = 0.3, w = 300, h = 300, delay = 0 }) {
  return (
    <div style={{
      position: "absolute", borderRadius: "50%",
      width: w, height: h,
      background: `radial-gradient(circle, rgba(${color},${opacity}) 0%, transparent 70%)`,
      filter: "blur(50px)",
      animation: `breathe ${14 + delay}s ${delay}s ease-in-out infinite`,
      pointerEvents: "none",
      ...style,
    }} />
  );
}

const BG = "linear-gradient(160deg, #140a1c 0%, #1e0d0a 38%, #0e0620 70%, #07030d 100%)";

const FEATURES = [
  { icon: "✦", text: "Медитации, женские практики и терапевтические аудио" },
  { icon: "✦", text: "Дневник намерений, благодарности и целей" },
  { icon: "✦", text: "Подсчёт психологического капитала и тест на энергию" },
  { icon: "✦", text: "Персонализация под ваше состояние и запрос" },
  { icon: "✦", text: "Визуализация внутреннего мира и сценарии роста" },
];

export function PasswordResetForm({ onDone }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function submit() {
    setError("");
    if (password.length < 8) return setError("Пароль — минимум 8 символов");
    if (password !== confirm) return setError("Пароли не совпадают");
    setLoading(true);
    const { error: e } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (e) setError(e.message);
    else { localStorage.removeItem("lux_pw_reset"); setDone(true); setTimeout(onDone, 2000); }
  }

  return (
    <div style={{ width: "100%", height: "100dvh", background: BG, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: `0 ${SP.xxl}px`, position: "relative", overflow: "hidden" }}>
      <Orb style={{ top: -100, right: -80 }} color="230,77,168" opacity={0.28} w={380} h={380} />
      <Orb style={{ bottom: -80, left: -60 }} color="220,100,40" opacity={0.24} w={320} h={320} delay={3} />
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 360, animation: "fadeUp .5s ease both" }}>
        <div style={{ textAlign: "center", marginBottom: SP.xl + 4 }}>
          <div style={{ fontFamily: FONT_SERIF, fontSize: 28, color: "rgba(245,235,230,.92)", marginBottom: 6 }}>Новый пароль</div>
          <div style={{ ...label(TYPE.xs - 1), color: "rgba(180,150,165,.38)", letterSpacing: ".3em" }}>СБРОС ПАРОЛЯ</div>
        </div>
        {done ? (
          <div style={{ textAlign: "center", fontFamily: FONT_SANS, fontSize: TYPE.sm + 1, color: "rgba(100,210,140,.85)", padding: `${SP.md}px 0` }}>
            Пароль обновлён — входим в приложение...
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: SP.sm + 2 }}>
            <input type="password" placeholder="Новый пароль" value={password} onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()} style={INPUT_STYLE} autoComplete="new-password" />
            <input type="password" placeholder="Повторите пароль" value={confirm} onChange={(e) => setConfirm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()} style={INPUT_STYLE} autoComplete="new-password" />
            {error && <div style={{ fontFamily: FONT_SANS, fontSize: TYPE.xs + 1, textAlign: "center", color: "rgba(240,100,100,.85)" }}>{error}</div>}
            <div onClick={!loading ? submit : undefined} style={{
              width: "100%", padding: `${SP.lg + 2}px`, borderRadius: 28, textAlign: "center", cursor: loading ? "default" : "pointer",
              background: "linear-gradient(135deg, rgba(210,55,140,.75), rgba(220,110,40,.6))",
              border: "1.5px solid rgba(220,100,55,.55)", backdropFilter: "blur(20px)",
              boxShadow: "0 0 40px rgba(210,55,140,.35), inset 0 1px 0 rgba(255,255,255,.08)",
              ...label(TYPE.xs), fontWeight: 400, letterSpacing: ".28em",
              color: "rgba(252,240,248,.96)", opacity: loading ? 0.6 : 1, transition: EASE.normal,
              marginTop: SP.xs, touchAction: "manipulation",
            }}>
              {loading ? "•••" : "СОХРАНИТЬ ПАРОЛЬ"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Auth({ onAuth, startMode = "welcome" }) {
  const [mode, setMode] = useState(startMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  function clearForm() { setError(""); setSent(false); }
  function switchTo(m) { clearForm(); setMode(m); }

  async function submit() {
    clearForm();
    if (mode === "login") {
      if (!email || !password) return setError("Заполните email и пароль");
      setLoading(true);
      const { error: e } = await signIn(email.trim(), password);
      setLoading(false);
      if (e) setError(e.message.includes("Invalid") ? "Неверный email или пароль" : e.message);
      else onAuth();
    } else if (mode === "register") {
      if (!name.trim()) return setError("Введите ваше имя");
      if (!email.includes("@")) return setError("Введите корректный email");
      if (password.length < 8) return setError("Пароль — минимум 8 символов");
      if (password !== confirm) return setError("Пароли не совпадают");
      setLoading(true);
      const { data, error: e } = await signUp(email.trim(), password, name.trim());
      setLoading(false);
      if (e) setError(e.message);
      else if (data?.session) onAuth(name.trim());
      else switchTo("verify");
    } else if (mode === "forgot") {
      if (!email.includes("@")) return setError("Введите корректный email");
      setLoading(true);
      const { error: e } = await resetPassword(email.trim());
      setLoading(false);
      if (e) { setError(e.message); }
      else { localStorage.setItem("lux_pw_reset", "1"); setSent(true); }
    }
  }

  return (
    <div style={{
      width: "100%", height: "100dvh",
      background: BG,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: `0 ${SP.xxl}px`, position: "relative", overflow: "hidden",
    }}>
      <Orb style={{ top: -100, right: -80 }} color="230,77,168" opacity={0.28} w={380} h={380} />
      <Orb style={{ bottom: -80, left: -60 }} color="220,100,40" opacity={0.24} w={320} h={320} delay={3} />
      <Orb style={{ top: "42%", left: "50%", transform: "translateX(-50%)" }} color="159,110,220" opacity={0.1} w={440} h={440} delay={6} />

      {/* ─── WELCOME SCREEN ─── */}
      {mode === "welcome" && (
        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 360, display: "flex", flexDirection: "column", alignItems: "center", animation: "fadeUp .7s ease both" }}>
          <img
            src="./brand/logo-full-white.png"
            alt="LuxMind"
            style={{ width: "72%", maxWidth: 280, height: "auto", filter: "drop-shadow(0 0 40px rgba(230,77,168,.45)) drop-shadow(0 0 80px rgba(240,120,40,.25))", marginBottom: SP.xl + 4 }}
            onError={(e) => { e.target.style.display = "none"; }}
          />

          <div style={{ fontFamily: FONT_SERIF, fontSize: 20, fontWeight: 300, color: "rgba(240,228,236,.82)", textAlign: "center", lineHeight: 1.6, letterSpacing: ".01em", marginBottom: SP.xl, padding: `0 ${SP.xs}px` }}>
            Пространство трансформации через развитие внутреннего психологического капитала для женщин
          </div>

          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: SP.sm + 2, marginBottom: SP.xxl }}>
            {FEATURES.map((f) => (
              <div key={f.text} style={{ display: "flex", alignItems: "flex-start", gap: SP.md, padding: `${SP.md}px ${SP.lg}px`, background: "rgba(230,77,168,.07)", border: "1px solid rgba(230,77,168,.16)", borderRadius: RAD.md }}>
                <span style={{ fontFamily: FONT_SERIF, fontSize: 14, color: "rgba(230,77,168,.7)", flexShrink: 0, marginTop: 1 }}>{f.icon}</span>
                <span style={{ fontFamily: FONT_SANS, fontSize: TYPE.sm + 1, fontWeight: 300, color: "rgba(228,215,228,.78)", lineHeight: 1.5 }}>{f.text}</span>
              </div>
            ))}
          </div>

          {/* Primary CTA */}
          <div
            onClick={() => switchTo("register")}
            style={{
              width: "100%", padding: `${SP.lg + 2}px`, borderRadius: 28,
              textAlign: "center", cursor: "pointer",
              background: "linear-gradient(135deg, rgba(210,55,140,.75) 0%, rgba(230,77,168,.6) 45%, rgba(220,110,40,.6) 100%)",
              border: "1.5px solid rgba(220,100,55,.55)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 0 40px rgba(210,55,140,.38), 0 0 80px rgba(230,100,40,.18), inset 0 1px 0 rgba(255,255,255,.08)",
              ...label(TYPE.xs), fontWeight: 400, letterSpacing: ".28em",
              color: "rgba(252,240,248,.96)",
              transition: EASE.normal, marginBottom: SP.md,
              touchAction: "manipulation",
            }}
          >
            НАЧАТЬ
          </div>

          {/* Secondary — already have account */}
          <div
            onClick={() => switchTo("login")}
            style={{
              width: "100%", padding: SP.lg, borderRadius: 28,
              textAlign: "center", cursor: "pointer",
              background: "rgba(255,255,255,.04)",
              border: "1px solid rgba(255,255,255,.1)",
              ...label(TYPE.xs), fontWeight: 400, letterSpacing: ".2em",
              color: "rgba(200,185,210,.55)",
              transition: EASE.normal,
              touchAction: "manipulation",
            }}
          >
            УЖЕ ЕСТЬ АККАУНТ
          </div>
        </div>
      )}

      {/* ─── VERIFY SCREEN ─── */}
      {mode === "verify" && (
        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 360, animation: "fadeUp .5s ease both" }}>
          <div style={{ textAlign: "center", padding: `${SP.xl + 4}px ${SP.lg}px`, background: "rgba(0,0,0,.25)", border: "1px solid rgba(200,160,180,.12)", borderRadius: RAD.lg }}>
            <div style={{ fontSize: 36, marginBottom: SP.lg }}>✉️</div>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 22, color: "rgba(245,235,230,.9)", marginBottom: SP.md }}>Проверьте почту</div>
            <div style={{ fontFamily: FONT_SANS, fontSize: TYPE.sm + 1, color: "rgba(220,205,215,.7)", lineHeight: 1.7, fontWeight: 300 }}>
              Письмо с подтверждением отправлено на{" "}
              <span style={{ color: "rgba(230,77,168,.85)", fontWeight: 400 }}>{email}</span>.
              Откройте его и нажмите на ссылку.
            </div>
            <div onClick={() => switchTo("login")} style={{ marginTop: SP.xl, cursor: "pointer", ...label(TYPE.xs), color: "rgba(200,160,180,.5)", letterSpacing: ".2em" }}>← ВОЙТИ</div>
          </div>
        </div>
      )}

      {/* ─── FORM SCREENS: register | login | forgot ─── */}
      {(mode === "register" || mode === "login" || mode === "forgot") && (
        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 360, animation: "fadeUp .45s ease both" }}>
          {/* Back + title */}
          <div style={{ textAlign: "center", marginBottom: SP.xl + 4 }}>
            <div
              onClick={() => mode === "forgot" ? switchTo("login") : switchTo("welcome")}
              style={{ position: "absolute", left: 0, top: 0, cursor: "pointer", fontFamily: FONT_SANS, fontSize: TYPE.sm, color: "rgba(200,160,180,.45)", padding: `${SP.xs}px 0` }}
            >
              ←
            </div>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 28, color: "rgba(245,235,230,.92)", marginBottom: 6 }}>
              {mode === "register" ? "Создать аккаунт" : mode === "login" ? "Добро пожаловать" : "Сброс пароля"}
            </div>
            <div style={{ ...label(TYPE.xs - 1), color: "rgba(180,150,165,.38)", letterSpacing: ".3em" }}>
              {mode === "register" ? "РЕГИСТРАЦИЯ" : mode === "login" ? "ВХОД" : "ЗАБЫЛИ ПАРОЛЬ"}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: SP.sm + 2 }}>
            {mode === "register" && (
              <input placeholder="Ваше имя" value={name} onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()} style={INPUT_STYLE} autoComplete="name" />
            )}
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()} style={INPUT_STYLE} autoComplete="email" inputMode="email" />
            {mode !== "forgot" && (
              <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()} style={INPUT_STYLE}
                autoComplete={mode === "login" ? "current-password" : "new-password"} />
            )}
            {mode === "register" && (
              <input type="password" placeholder="Повторите пароль" value={confirm} onChange={(e) => setConfirm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()} style={INPUT_STYLE} autoComplete="new-password" />
            )}

            {(error || sent) && (
              <div style={{ fontFamily: FONT_SANS, fontSize: TYPE.xs + 1, textAlign: "center", padding: `${SP.sm}px 0`, color: error ? "rgba(240,100,100,.85)" : "rgba(100,210,140,.85)" }}>
                {error || "Письмо отправлено — проверьте почту"}
              </div>
            )}

            <div onClick={!loading ? submit : undefined} style={{
              width: "100%", padding: `${SP.lg + 2}px`, borderRadius: 28,
              textAlign: "center", cursor: loading ? "default" : "pointer",
              background: "linear-gradient(135deg, rgba(210,55,140,.75), rgba(220,110,40,.6))",
              border: "1.5px solid rgba(220,100,55,.55)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 0 40px rgba(210,55,140,.35), 0 0 80px rgba(230,100,40,.15), inset 0 1px 0 rgba(255,255,255,.08)",
              ...label(TYPE.xs), fontWeight: 400, letterSpacing: ".28em",
              color: "rgba(252,240,248,.96)",
              opacity: loading ? 0.6 : 1, transition: EASE.normal,
              marginTop: SP.xs, touchAction: "manipulation",
            }}>
              {loading ? "•••" : mode === "login" ? "ВОЙТИ" : mode === "register" ? "СОЗДАТЬ АККАУНТ" : "ОТПРАВИТЬ ПИСЬМО"}
            </div>

            {mode === "login" && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span onClick={() => switchTo("forgot")} style={{ fontFamily: FONT_SANS, fontSize: TYPE.xs + 1, color: "rgba(200,160,180,.5)", cursor: "pointer", textDecoration: "underline" }}>
                  Забыли пароль?
                </span>
                <span onClick={() => switchTo("register")} style={{ fontFamily: FONT_SANS, fontSize: TYPE.xs + 1, color: "rgba(200,160,180,.5)", cursor: "pointer", textDecoration: "underline" }}>
                  Создать аккаунт
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
