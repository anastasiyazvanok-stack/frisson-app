import { Capacitor } from '@capacitor/core';
import { supabase } from './supabase.js';
export async function aiFetch(path, options) {
  const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
  if (Capacitor.isNativePlatform() && !/^https:\/\//.test(base)) throw new Error('AI server is not configured');
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session?.access_token) throw new Error('Sign in required');
  return fetch(`${base}${path}`, { ...options, signal: AbortSignal.timeout(30000),
    headers: { ...options?.headers, Authorization: `Bearer ${data.session.access_token}` } });
}
