import { createUserSync } from "./userSync.js";
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
  else if (event === "SIGNED_OUT") _recoveryMode = false;
});

export function clearRecoveryMode() { _recoveryMode = false; }

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
    redirectTo: import.meta.env.VITE_AUTH_REDIRECT_URL || new URL(import.meta.env.BASE_URL, window.location.origin).href,
  });
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data?.session || null;
}

// ─── User data sync ───
const userSync = createUserSync(supabase);
export const syncToCloud = userSync.sync;
export const loadFromCloud = userSync.load;

// ─── Content fetchers (read-only, cached) ───

// Fetch meditations from backend, fall back to empty array on error.
// Called once on app load — result cached in localStorage for offline access.
function readCache(key) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v).data ?? null : null; }
  catch { return null; }
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
