import { userStorage, getActiveUser } from './userStorage.js';
import { findPractice } from '../data/practiceCatalog.js';
const KEY = 'nectar_practices';
export function getPracticeState() {
  let state;
  try { state = JSON.parse(userStorage.getItem(KEY)); } catch { /* Empty or invalid account cache. */ }
  state = { favorites: {}, progress: {}, completed: {}, ...state };
  // Read legacy named meditation events without touching counters or other accounts.
  try {
    const legacy = JSON.parse(userStorage.getItem('frisson_psycap_v2'));
    for (const event of legacy?.events || []) {
      if (event.type !== 'meditation' || event.meta?.completion !== 'full') continue;
      const med = findPractice(event.name);
      if (med && event.ts > (state.completed[med.id]?.at || 0)) state.completed[med.id] = { at: event.ts };
    }
  } catch { /* Empty or invalid account cache. */ }
  return state;
}
export function updatePracticeState(update, owner = getActiveUser()) {
  if (!owner || owner !== getActiveUser()) return;
  const next = update(getPracticeState());
  userStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
export function toggleFavorite(id) {
  return updatePracticeState(s => {
    if (s.favorites[id]) delete s.favorites[id]; else s.favorites[id] = Date.now();
    return s;
  });
}
export function mergeListenedRanges(ranges, start, end) {
  if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end <= start) return ranges;
  const sorted = [...ranges, [start, end]].sort((a,b) => a[0]-b[0]);
  const merged = [];
  for (const range of sorted) {
    const last = merged.at(-1);
    if (last && range[0] <= last[1] + 0.25) last[1] = Math.max(last[1], range[1]);
    else merged.push([...range]);
  }
  return merged;
}
export function isListened(ranges, duration) {
  return Number.isFinite(duration) && duration > 0 && ranges.reduce((n,[a,b]) => n + b-a, 0) >= duration * 0.8;
}
export const formatTime = seconds => `${Math.floor((seconds || 0)/60)}:${String(Math.floor((seconds || 0)%60)).padStart(2,'0')}`;
