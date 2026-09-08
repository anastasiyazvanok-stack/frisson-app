import { createClient } from '@supabase/supabase-js';

export async function memberAccess(token, create = createClient) {
  if (!token || !/^\S{1,8192}$/.test(token)) return { status: 401 };
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return { status: 503 };
  try {
    const client = create(url, key, { auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${token}` }, fetch: (url, init) => fetch(url, { ...init, signal: AbortSignal.timeout(10000) }) } });
    const { data, error } = await client.auth.getUser(token);
    if (error || !data?.user) return { status: 401 };
    const access = await client.rpc('get_member_access');
    if (access.error || !access.data) return { status: 503 };
    return { status: 200, access: access.data, client, user: data.user };
  } catch { return { status: 503 }; }
}
