// All personal data is scoped to a verified account. Legacy unowned keys are
// deliberately left untouched and never assigned to whoever signs in next.
export const SYNC_KEYS = [
  'frisson-theme', 'frisson_escore', 'frisson_escore_date', 'frisson_ehist',
  'frisson_gems', 'frisson_activity', 'frisson_psycap_v2', 'frisson_journal',
  'frisson_tour', 'frisson_orbit_seen', 'frisson_checkin_last',
];
let activeUser = null;
const listeners = new Set();
const keyFor = uid => `frisson:user:${uid}`;
export function activateUser(uid) { activeUser = uid || null; }
export function readUser(uid) {
  if (!uid) return { data: {}, dirty: false, revision: null, loaded: false };
  try {
    const raw = JSON.parse(globalThis.localStorage.getItem(keyFor(uid)));
    if (raw && raw.data && typeof raw.data === 'object') return raw;
  } catch { /* Invalid local cache: a cloud load is required. */ }
  return { data: {}, dirty: false, revision: null, loaded: false };
}
export function writeUser(uid, record) {
  if (!uid) return;
  globalThis.localStorage.setItem(keyFor(uid), JSON.stringify(record));
}
export function acceptCloud(uid, data, revision) {
  const safe = {};
  for (const key of SYNC_KEYS) if (typeof data?.[key] === 'string') safe[key] = data[key];
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
