import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { SP, RAD, TYPE, EASE, FONT_SANS, FONT_SERIF } from "../utils/design";

const ADMIN_EMAIL = "anastasiyazvanok@gmail.com";

const S = {
  bg:      "#07040e",
  surface: "rgba(255,255,255,.04)",
  border:  "rgba(255,255,255,.1)",
  accent:  "rgba(230,77,168,1)",
  accentD: "rgba(230,77,168,.18)",
  text:    "rgba(240,230,240,.9)",
  sub:     "rgba(200,185,210,.5)",
  danger:  "rgba(240,80,80,.85)",
  success: "rgba(80,200,120,.85)",
};

const inp = {
  width: "100%", boxSizing: "border-box",
  padding: "10px 14px", borderRadius: 10,
  background: "rgba(0,0,0,.35)",
  border: "1px solid rgba(255,255,255,.12)",
  color: S.text, fontFamily: FONT_SANS, fontSize: 14, outline: "none",
  WebkitAppearance: "none",
};

function Btn({ children, onClick, danger, secondary, small, disabled, loading }) {
  const bg = danger ? "rgba(240,80,80,.75)"
    : secondary ? "rgba(255,255,255,.07)"
    : "linear-gradient(135deg, rgba(210,55,140,.75), rgba(220,100,40,.6))";
  return (
    <button onClick={onClick} disabled={disabled || loading}
      style={{
        padding: small ? "6px 14px" : "10px 20px", borderRadius: 10,
        background: bg, border: `1px solid ${danger ? "rgba(240,80,80,.4)" : secondary ? "rgba(255,255,255,.1)" : "rgba(220,100,40,.5)"}`,
        color: S.text, fontFamily: FONT_SANS, fontSize: small ? 12 : 13, fontWeight: 500,
        cursor: disabled || loading ? "default" : "pointer", letterSpacing: ".06em",
        opacity: disabled || loading ? 0.45 : 1, transition: EASE.normal,
        whiteSpace: "nowrap", flexShrink: 0,
      }}
    >{loading ? "..." : children}</button>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,.75)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "20px 16px", overflowY: "auto", backdropFilter: "blur(4px)" }}>
      <div style={{ width: "100%", maxWidth: 560, background: "#0f0a1a", border: `1px solid ${S.border}`, borderRadius: 16, padding: 24, position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontFamily: FONT_SANS, fontSize: 16, fontWeight: 600, color: S.text }}>{title}</div>
          <div onClick={onClose} style={{ cursor: "pointer", color: S.sub, fontSize: 20, lineHeight: 1 }}>×</div>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontFamily: FONT_SANS, fontSize: 11, fontWeight: 600, color: S.sub, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}

// ─── Meditation form ───
function MedForm({ initial, sections, onSave, onClose }) {
  const blank = { title: "", short: "", long: "", n: "", section_id: sections[0]?.id || "", audio_url: "", sort_order: 0, active: true };
  const [form, setForm] = useState(initial || blank);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");
  const fileRef = useRef();

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function uploadAudio(file) {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const { data, error } = await supabase.storage.from("audio").upload(path, file, { contentType: `audio/${ext}` });
    setUploading(false);
    if (error) { setErr("Ошибка загрузки: " + error.message); return; }
    const { data: { publicUrl } } = supabase.storage.from("audio").getPublicUrl(path);
    set("audio_url", publicUrl);
  }

  async function save() {
    if (!form.title.trim()) { setErr("Название обязательно"); return; }
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      short: form.short.trim(),
      long: form.long.trim() || null,
      n: form.n.trim() || null,
      section_id: form.section_id || null,
      audio_url: form.audio_url.trim() || null,
      sort_order: parseInt(form.sort_order) || 0,
      active: !!form.active,
    };
    let error;
    if (initial?.id) {
      ({ error } = await supabase.from("meditations").update(payload).eq("id", initial.id));
    } else {
      ({ error } = await supabase.from("meditations").insert([payload]));
    }
    setSaving(false);
    if (error) { setErr(error.message); return; }
    onSave();
  }

  return (
    <>
      <Field label="Название *">
        <input style={inp} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Название медитации" />
      </Field>
      <Field label="Краткое описание">
        <textarea style={{ ...inp, minHeight: 72, resize: "vertical" }} value={form.short} onChange={(e) => set("short", e.target.value)} placeholder="Короткое описание для карточки" />
      </Field>
      <Field label="Полное описание">
        <textarea style={{ ...inp, minHeight: 100, resize: "vertical" }} value={form.long} onChange={(e) => set("long", e.target.value)} placeholder="Длинное описание (опционально, показывается внутри)" />
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        <Field label="Символ / №">
          <input style={inp} value={form.n} onChange={(e) => set("n", e.target.value)} placeholder="I, II, ♦..." />
        </Field>
        <Field label="Порядок">
          <input style={inp} type="number" value={form.sort_order} onChange={(e) => set("sort_order", e.target.value)} />
        </Field>
        <Field label="Раздел">
          <select style={{ ...inp }} value={form.section_id} onChange={(e) => set("section_id", e.target.value)}>
            <option value="">— без раздела —</option>
            {sections.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Аудио URL">
        <div style={{ display: "flex", gap: 8 }}>
          <input style={{ ...inp }} value={form.audio_url} onChange={(e) => set("audio_url", e.target.value)} placeholder="https://... или загрузите файл →" />
          <input ref={fileRef} type="file" accept="audio/*" style={{ display: "none" }} onChange={(e) => e.target.files[0] && uploadAudio(e.target.files[0])} />
          <Btn small loading={uploading} onClick={() => fileRef.current?.click()}>📁 Загрузить</Btn>
        </div>
        {form.audio_url && <div style={{ marginTop: 6, fontSize: 11, color: S.success }}>✓ {form.audio_url.slice(0, 60)}…</div>}
      </Field>
      <Field label="Активна">
        <div onClick={() => set("active", !form.active)} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <div style={{ width: 40, height: 22, borderRadius: 11, background: form.active ? S.accent : "rgba(255,255,255,.15)", transition: EASE.normal, position: "relative" }}>
            <div style={{ position: "absolute", top: 3, left: form.active ? 21 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: EASE.normal }} />
          </div>
          <span style={{ fontFamily: FONT_SANS, fontSize: 13, color: form.active ? S.accent : S.sub }}>{form.active ? "Видна пользователям" : "Скрыта"}</span>
        </div>
      </Field>
      {err && <div style={{ fontFamily: FONT_SANS, fontSize: 12, color: S.danger, marginBottom: 12 }}>{err}</div>}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 4 }}>
        <Btn secondary onClick={onClose}>Отмена</Btn>
        <Btn loading={saving} onClick={save}>{initial?.id ? "Сохранить" : "Добавить медитацию"}</Btn>
      </div>
    </>
  );
}

// ─── Section form ───
function SecForm({ initial, onSave, onClose }) {
  const blank = { name: "", color: "#e04da8", sort_order: 0, active: true };
  const [form, setForm] = useState(initial || blank);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function save() {
    if (!form.name.trim()) { setErr("Название обязательно"); return; }
    setSaving(true);
    const payload = { name: form.name.trim(), color: form.color, sort_order: parseInt(form.sort_order) || 0, active: !!form.active };
    let error;
    if (initial?.id) {
      ({ error } = await supabase.from("sections").update(payload).eq("id", initial.id));
    } else {
      ({ error } = await supabase.from("sections").insert([payload]));
    }
    setSaving(false);
    if (error) { setErr(error.message); return; }
    onSave();
  }

  return (
    <>
      <Field label="Название *">
        <input style={inp} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Название раздела" />
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        <Field label="Цвет">
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input type="color" value={form.color} onChange={(e) => set("color", e.target.value)} style={{ width: 44, height: 36, borderRadius: 8, border: "1px solid rgba(255,255,255,.15)", background: "none", cursor: "pointer" }} />
            <input style={{ ...inp }} value={form.color} onChange={(e) => set("color", e.target.value)} placeholder="#e04da8" />
          </div>
        </Field>
        <Field label="Порядок">
          <input style={inp} type="number" value={form.sort_order} onChange={(e) => set("sort_order", e.target.value)} />
        </Field>
        <Field label="Активен">
          <div onClick={() => set("active", !form.active)} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", paddingTop: 8 }}>
            <div style={{ width: 40, height: 22, borderRadius: 11, background: form.active ? S.accent : "rgba(255,255,255,.15)", transition: EASE.normal, position: "relative" }}>
              <div style={{ position: "absolute", top: 3, left: form.active ? 21 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: EASE.normal }} />
            </div>
          </div>
        </Field>
      </div>
      {err && <div style={{ fontFamily: FONT_SANS, fontSize: 12, color: S.danger, marginBottom: 12 }}>{err}</div>}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 4 }}>
        <Btn secondary onClick={onClose}>Отмена</Btn>
        <Btn loading={saving} onClick={save}>{initial?.id ? "Сохранить" : "Добавить раздел"}</Btn>
      </div>
    </>
  );
}

// ─── Main admin panel ───
export default function Admin({ userEmail, onClose }) {
  const [tab, setTab] = useState("meditations");
  const [meds, setMeds] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // { type, data }
  const [deleting, setDeleting] = useState(null);
  const [opError, setOpError] = useState("");

  const isAdmin = userEmail === ADMIN_EMAIL;

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const [{ data: m }, { data: s }] = await Promise.all([
      supabase.from("meditations").select("*, sections(id, name, color)").order("sort_order"),
      supabase.from("sections").select("*").order("sort_order"),
    ]);
    setMeds(m || []);
    setSections(s || []);
    setLoading(false);
  }

  async function deleteMed(id) {
    setDeleting(id); setOpError("");
    const { error } = await supabase.from("meditations").delete().eq("id", id);
    setDeleting(null);
    if (error) setOpError("Ошибка удаления: " + error.message);
    else load();
  }

  async function deleteSec(id) {
    setDeleting(id); setOpError("");
    const { error } = await supabase.from("sections").delete().eq("id", id);
    setDeleting(null);
    if (error) setOpError("Ошибка удаления: " + error.message);
    else load();
  }

  async function toggleActive(table, id, current) {
    const { error } = await supabase.from(table).update({ active: !current }).eq("id", id);
    if (error) setOpError("Ошибка: " + error.message);
    else load();
  }

  if (!isAdmin) return (
    <div style={{ width: "100%", height: "100dvh", background: S.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_SANS, color: S.sub }}>
      Доступ запрещён
    </div>
  );

  return (
    <div style={{ width: "100%", minHeight: "100dvh", background: S.bg, fontFamily: FONT_SANS, color: S.text }}>
      {/* Header */}
      <div style={{ padding: "16px 24px", borderBottom: `1px solid ${S.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: S.bg, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontFamily: FONT_SERIF, fontSize: 22, color: S.text }}>LuxMind</div>
          <div style={{ fontSize: 11, color: S.sub, letterSpacing: ".1em", textTransform: "uppercase" }}>Admin</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ fontSize: 12, color: S.sub }}>{userEmail}</div>
          <Btn small secondary onClick={onClose}>← Приложение</Btn>
        </div>
      </div>

      {opError && (
        <div style={{ margin: "12px 24px 0", padding: "10px 16px", background: "rgba(220,50,50,.1)", border: "1px solid rgba(220,50,50,.3)", borderRadius: 8, fontSize: 13, color: "#e05555" }}>
          {opError} <span onClick={() => setOpError("")} style={{ cursor: "pointer", marginLeft: 8, opacity: .6 }}>✕</span>
        </div>
      )}

      {/* Tabs */}
      <div style={{ padding: "16px 24px 0", display: "flex", gap: 4, borderBottom: `1px solid ${S.border}` }}>
        {[["meditations", "🎧 Медитации"], ["sections", "📂 Разделы"]].map(([id, label]) => (
          <div key={id} onClick={() => setTab(id)} style={{
            padding: "8px 18px", borderRadius: "10px 10px 0 0", cursor: "pointer",
            background: tab === id ? "rgba(230,77,168,.15)" : "transparent",
            borderBottom: tab === id ? `2px solid ${S.accent}` : "2px solid transparent",
            fontSize: 13, fontWeight: tab === id ? 600 : 400,
            color: tab === id ? S.accent : S.sub, transition: EASE.normal,
          }}>{label}</div>
        ))}
      </div>

      <div style={{ padding: 24 }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: S.sub }}>Загрузка…</div>
        ) : tab === "meditations" ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: S.sub }}>{meds.length} медитаций</div>
              <Btn onClick={() => setModal({ type: "add_med" })}>+ Добавить медитацию</Btn>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {meds.map((m) => (
                <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: S.surface, border: `1px solid ${S.border}`, borderRadius: 12, transition: EASE.normal }}>
                  {/* Active dot */}
                  <div onClick={() => toggleActive("meditations", m.id, m.active)} style={{ width: 10, height: 10, borderRadius: "50%", background: m.active ? S.success : "rgba(255,255,255,.2)", cursor: "pointer", flexShrink: 0, boxShadow: m.active ? `0 0 8px ${S.success}` : "none" }} title={m.active ? "Активна (нажать чтобы скрыть)" : "Скрыта (нажать чтобы показать)"} />
                  {/* n */}
                  <div style={{ width: 28, fontFamily: FONT_SERIF, fontSize: 15, color: m.sections?.color || S.sub, flexShrink: 0, textAlign: "center" }}>{m.n || "—"}</div>
                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: S.text, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.title}</div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      {m.sections && <div style={{ fontSize: 11, color: m.sections.color, background: m.sections.color + "22", padding: "2px 8px", borderRadius: 6 }}>{m.sections.name}</div>}
                      {m.audio_url ? <div style={{ fontSize: 11, color: S.success }}>🎵 аудио</div> : <div style={{ fontSize: 11, color: "rgba(240,180,80,.7)" }}>⚠️ нет аудио</div>}
                      <div style={{ fontSize: 11, color: S.sub }}>#{m.sort_order}</div>
                    </div>
                  </div>
                  {/* Actions */}
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <Btn small secondary onClick={() => setModal({ type: "edit_med", data: m })}>Изменить</Btn>
                    <Btn small danger loading={deleting === m.id} onClick={() => { if (confirm(`Удалить «${m.title}»?`)) deleteMed(m.id); }}>✕</Btn>
                  </div>
                </div>
              ))}
              {meds.length === 0 && <div style={{ textAlign: "center", padding: 40, color: S.sub }}>Медитаций пока нет. Добавьте первую!</div>}
            </div>
          </>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: S.sub }}>{sections.length} разделов</div>
              <Btn onClick={() => setModal({ type: "add_sec" })}>+ Добавить раздел</Btn>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {sections.map((s) => (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: S.surface, border: `1px solid ${S.border}`, borderRadius: 12 }}>
                  <div onClick={() => toggleActive("sections", s.id, s.active)} style={{ width: 10, height: 10, borderRadius: "50%", background: s.active ? s.color : "rgba(255,255,255,.2)", cursor: "pointer", flexShrink: 0, boxShadow: s.active ? `0 0 8px ${s.color}` : "none" }} />
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: S.text }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: S.sub }}>#{s.sort_order} · {s.color}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <Btn small secondary onClick={() => setModal({ type: "edit_sec", data: s })}>Изменить</Btn>
                    <Btn small danger loading={deleting === s.id} onClick={() => { if (confirm(`Удалить раздел «${s.name}»?`)) deleteSec(s.id); }}>✕</Btn>
                  </div>
                </div>
              ))}
              {sections.length === 0 && <div style={{ textAlign: "center", padding: 40, color: S.sub }}>Разделов нет.</div>}
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      {modal?.type === "add_med" && (
        <Modal title="Новая медитация" onClose={() => setModal(null)}>
          <MedForm sections={sections} onSave={() => { setModal(null); load(); }} onClose={() => setModal(null)} />
        </Modal>
      )}
      {modal?.type === "edit_med" && (
        <Modal title="Изменить медитацию" onClose={() => setModal(null)}>
          <MedForm initial={modal.data} sections={sections} onSave={() => { setModal(null); load(); }} onClose={() => setModal(null)} />
        </Modal>
      )}
      {modal?.type === "add_sec" && (
        <Modal title="Новый раздел" onClose={() => setModal(null)}>
          <SecForm onSave={() => { setModal(null); load(); }} onClose={() => setModal(null)} />
        </Modal>
      )}
      {modal?.type === "edit_sec" && (
        <Modal title="Изменить раздел" onClose={() => setModal(null)}>
          <SecForm initial={modal.data} onSave={() => { setModal(null); load(); }} onClose={() => setModal(null)} />
        </Modal>
      )}
    </div>
  );
}
