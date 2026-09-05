import { createClient } from '@supabase/supabase-js';

export function validBody(body) {
  return body && typeof body === 'object' && !Array.isArray(body) && JSON.stringify(body).length <= 20000;
}
export async function authorizeAI(req, res, create = createClient) {
  res.setHeader('Cache-Control', 'no-store');
  const origin = req.headers?.origin;
  const allowed = new Set(['capacitor://localhost', 'https://localhost',
    ...(process.env.AI_ALLOWED_ORIGINS || '').split(',').map(v => v.trim()).filter(Boolean)]);
  if (req.headers?.host) allowed.add(`https://${req.headers.host}`);
  if (origin) {
    if (!allowed.has(origin)) { res.status(403).json({ error: 'Origin not allowed' }); return null; }
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  }
  if (req.method === 'OPTIONS') { res.status(204).end(); return null; }
  if (req.method !== 'POST') { res.status(405).end(); return null; }
  const authorization = req.headers?.authorization;
  const token = typeof authorization === 'string' ? authorization.match(/^Bearer (\S{1,8192})$/i)?.[1] : null;
  if (!token) { res.status(401).json({ error: 'Sign in required' }); return null; }
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) { res.status(503).json({ error: 'AI access not configured' }); return null; }
  try {
    const client = create(url, key, { auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${token}` } } });
    const { data, error } = await client.auth.getUser(token);
    if (error || !data?.user) { res.status(401).json({ error: 'Invalid session' }); return null; }
    if (!validBody(req.body)) { res.status(400).json({ error: 'Invalid request body' }); return null; }
    // Database quota is shared by all serverless instances, and fails closed.
    const quota = await client.rpc('consume_ai_quota');
    if (quota.error) { res.status(503).json({ error: 'AI quota unavailable' }); return null; }
    if (quota.data !== true) { res.setHeader('Retry-After', '60'); res.status(429).json({ error: 'AI limit reached' }); return null; }
    return data.user;
  } catch {
    res.status(503).json({ error: 'AI access unavailable' }); return null;
  }
}
