// All personal data is scoped to a verified account. Legacy unowned keys are
// deliberately left untouched and never assigned to whoever signs in next.
export const SYNC_KEYS = [
  'frisson-theme', 'frisson_escore', 'frisson_escore_date', 'frisson_ehist',
  'frisson_gems', 'frisson_activity', 'frisson_psycap_v2', 'frisson_journal',
  'nectar_practices', 'lux_coach_memory', 'lux_coach_history', 'frisson_tour', 'frisson_orbit_seen', 'frisson_checkin_last',
];
let activeUser = null;
const listeners = new Set();
const keyFor = uid => `frisson:user:${uid}`;
export const getActiveUser = () => activeUser;
export function activateUser(uid) { activeUser = uid || null; }
export function readUser(uid) {
  if (!uid) return { data: {}, dirty: false, revision: null, loaded: false };
  const text = globalThis.localStorage.getItem(keyFor(uid));
  if (text === null) return { data: {}, dirty: false, revision: null, loaded: false };
  try {
    const raw = JSON.parse(text);
    if (raw && raw.data && typeof raw.data === 'object' && !Array.isArray(raw.data)) return raw;
  } catch { /* Preserve unreadable data instead of replacing it with defaults. */ }
  const error = new Error('Local account data could not be read');
  error.code = 'LOCAL_DATA_ERROR';
  throw error;
}
const backupKey = uid => `frisson:recovery:${uid}`;
export function readRecovery(uid) {
  if (!uid) return { initial: null, recent: [] };
  const text = globalThis.localStorage.getItem(backupKey(uid));
  return text ? JSON.parse(text) : { initial: null, recent: [] };
}
export function preserveLocal(uid, record = readUser(uid)) {
  if (!uid || !Object.keys(record.data || {}).length) return;
  const saved = readRecovery(uid);
  const snapshot = { ...record, capturedAt: new Date().toISOString() };
  const same = entry => entry && JSON.stringify(entry.data) === JSON.stringify(record.data);
  if (!saved.initial) saved.initial = snapshot;
  if (!same(saved.initial) && !saved.recent.some(same)) saved.recent = [snapshot, ...saved.recent].slice(0, 3);
  globalThis.localStorage.setItem(backupKey(uid), JSON.stringify(saved));
}

export function writeUser(uid, record) {
  if (!uid) return;
  globalThis.localStorage.setItem(keyFor(uid), JSON.stringify(record));
}
export function acceptCloud(uid, data, revision) {
  preserveLocal(uid);
  const safe = {};
  // Keep opaque future fields too; an older client must not erase newer fields.
  for (const [key, value] of Object.entries(data || {})) if (typeof value === 'string') safe[key] = value;
  writeUser(uid, { data: safe, dirty: false, revision, loaded: true });
}
export function subscribeUserChanges(fn) { listeners.add(fn); return () => listeners.delete(fn); }
export const userStorage = {
  getItem(key) { return readUser(activeUser).data[key] ?? null; },
  setItem(key, value) {
    if (!activeUser || !SYNC_KEYS.includes(key)) return;
    const record = readUser(activeUser);
    if (record.data[key] === String(value)) return;
    record.data[key] = String(value); record.dirty = true;
    writeUser(activeUser, record);
    for (const fn of listeners) fn(activeUser);
  },
  removeItem(key) {
    if (!activeUser) return;
    const record = readUser(activeUser);
    if (!(key in record.data)) return;
    delete record.data[key]; record.dirty = true;
    writeUser(activeUser, record);
    for (const fn of listeners) fn(activeUser);
  },
};

