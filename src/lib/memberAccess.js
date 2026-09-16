import { useEffect, useState } from 'react';
import { supabase } from './supabase';
export function accessIsActive(access, now = Date.now()) {
  return access?.active === true && (access.status === 'admin' ||
    ((!access.starts_at || Date.parse(access.starts_at) <= now) && Date.parse(access.expires_at) > now));
}
export function useMemberAccess(userId) {
  const [state, setState] = useState({ userId: null, access: null, error: false });
  const [retry, setRetry] = useState(0);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!userId) return;
    let alive = true, busy = false;
    async function refresh() {
      if (busy) return;
      busy = true;
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session?.user.id !== userId) throw new Error('Session changed');
        const { data, error } = await supabase.rpc('get_member_access').abortSignal(AbortSignal.timeout(15000));
        if (error || !data) throw new Error('Access unavailable');
        if (alive) setState({ userId, access: data, error: false });
      } catch { if (alive) setState({ userId, access: null, error: true }); }
      finally { busy = false; }
    }
    refresh();
    const timer = setInterval(refresh, 30000);
    const visible = () => { if (document.visibilityState === 'visible') refresh(); };
    window.addEventListener('online', refresh);
    document.addEventListener('visibilitychange', visible);
    return () => { alive = false; clearInterval(timer); window.removeEventListener('online', refresh); document.removeEventListener('visibilitychange', visible); };
  }, [userId, retry]);
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer); }, []);
  const current = state.userId === userId ? state : { access: null, error: false };
  return { ...current, active: accessIsActive(current.access, now), refresh: () => setRetry(n => n + 1) };
}
