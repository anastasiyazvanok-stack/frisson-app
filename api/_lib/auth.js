// Shared auth guard for the AI proxy endpoints.
// Files under api/_lib are not deployed as routes by Vercel (leading underscore),
// so this is safe to import without exposing a new public endpoint.
//
// Why this exists: the Anthropic API key lives server-side, and every request that
// reaches these handlers gets proxied straight to Claude. Without this check, anyone
// on the internet — no account, no rate limit — could call /api/ai-chat directly and
// spend the app's Anthropic budget, or use it as a free unrestricted LLM proxy. The
// app already requires a signed-in Supabase session to reach any screen that calls
// these endpoints, so requiring the same session here costs no legitimate user anything.
import { createClient } from "@supabase/supabase-js";

const url = process.env.VITE_SUPABASE_URL;
const anon = process.env.VITE_SUPABASE_ANON_KEY;

// Verifies the caller's Supabase access token from the Authorization header.
// Returns the authenticated user object, or null if missing/invalid/expired.
export async function requireUser(req) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : null;
  if (!token || !url || !anon) return null;

  try {
    const client = createClient(url, anon, { auth: { persistSession: false } });
    const { data, error } = await client.auth.getUser(token);
    if (error || !data?.user) return null;
    return data.user;
  } catch {
    return null;
  }
}
