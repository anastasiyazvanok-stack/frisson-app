import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(url, anon, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

// Track PASSWORD_RECOVERY at module level — before React mounts — so we never miss the event
let _recoveryMode = false;
export const getIsRecoveryMode = () => _recoveryMode;
supabase.auth.onAuthStateChange((event) => {
  if (event === "PASSWORD_RECOVERY") _recoveryMode = true;
  else if (event === "SIGNED_IN" || event === "SIGNED_OUT") _recoveryMode = false;
});

// ─── Auth helpers ───

export async function signUp(email, password, name) {
  return await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });
}

export async function signIn(email, password) {
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  return await supabase.auth.signOut();
}

export async function resetPassword(email) {
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}?resetpw=1`,
  });
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data?.session || null;
}

// ─── User data sync ───

const SYNC_KEYS = [
  "frisson-theme",
  "frisson_escore",
  "frisson_escore_date",
  "frisson_ehist",
  "frisson_gems",
  "frisson_activity",
  "frisson_psycap_v2",
  "frisson_journal",
];

export function collectLocalData() {
  const out = {};
  for (const key of SYNC_KEYS) {
    const v = localStorage.getItem(key);
    if (v !== null) out[key] = v;
  }
  return out;
}

export function applyCloudData(cloudData) {
  if (!cloudData || typeof cloudData !== "object") return;
  for (const key of SYNC_KEYS) {
    if (cloudData[key] !== undefined) {
      localStorage.setItem(key, cloudData[key]);
    }
  }
}

export async function syncToCloud(userId) {
  try {
    const data = collectLocalData();
    await supabase
      .from("user_data")
      .upsert({ id: userId, data, updated_at: new Date().toISOString() });
  } catch (e) {
    console.warn("[frisson] sync failed:", e);
  }
}

export async function loadFromCloud(userId) {
  try {
    const { data, error } = await supabase
      .from("user_data")
      .select("data")
      .eq("id", userId)
      .single();
    if (error) return null;
    return data?.data || null;
  } catch {
    return null;
  }
}

// ─── Content fetchers (read-only, cached) ───

// Fetch meditations from backend, fall back to empty array on error.
// Called once on app load — result cached in localStorage for offline access.
function readCache(key) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v).data || [] : []; }
  catch { return []; }
}

export async function fetchMeditations() {
  try {
    const { data, error } = await supabase
      .from("meditations")
      .select("*, sections(id, name, color)")
      .eq("active", true)
      .order("sort_order");
    if (error) throw error;
    try { localStorage.setItem("frisson_cache_meds", JSON.stringify({ data, ts: Date.now() })); } catch {}
    return data || [];
  } catch {
    return readCache("frisson_cache_meds");
  }
}

export async function fetchSections() {
  try {
    const { data, error } = await supabase.from("sections").select("*").eq("active", true).order("sort_order");
    if (error) throw error;
    try { localStorage.setItem("frisson_cache_sections", JSON.stringify({ data, ts: Date.now() })); } catch {}
    return data || [];
  } catch {
    return readCache("frisson_cache_sections");
  }
}

export async function fetchBooks() {
  try {
    const { data, error } = await supabase.from("books").select("*").eq("active", true).order("sort_order");
    if (error) throw error;
    return data || [];
  } catch { return []; }
}
