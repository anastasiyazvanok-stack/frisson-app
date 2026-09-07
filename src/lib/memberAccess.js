import { useEffect, useState } from 'react';
import { supabase } from './supabase.js';

export function accessIsActive(access, now = Date.now()) {
  return access?.active === true && (access.status === 'admin' || Date.parse(access.expires_at) > now);
}
export function useMemberAccess(userId) {
  const [access, setAccess] = useState(null);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let alive = true, busy = false;
    async function refresh() {
      if (busy) return;
      busy = true;
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error || data.session?.user.id !== userId) throw new Error('Session changed');
        const response = await fetch('/api/access', { method: 'POST', credentials: 'same-origin',
          headers: { Authorization: `Bearer ${data.session.access_token}` }, signal: AbortSignal.timeout(15000) });
        if (!response.ok) throw new Error('Access unavailable');
        const result = await response.json();
        if (alive) { setAccess(result); setError(false); }
      } catch { if (alive) { setAccess(null); setError(true); } }
      finally { busy = false; }
    }
    refresh();
    const timer = setInterval(refresh, 60000);
    const visible = () => { if (document.visibilityState === 'visible') refresh(); };
    window.addEventListener('online', refresh);
    document.addEventListener('visibilitychange', visible);
    return () => { alive = false; clearInterval(timer); window.removeEventListener('online', refresh); document.removeEventListener('visibilitychange', visible); };
  }, [userId, retry]);
  // Expiry is enforced locally to stop an already mounted player as well.
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer); }, []);
  return { access, active: accessIsActive(access, now), error, refresh: () => setRetry(n => n + 1) };
}
