import { readUser, writeUser, acceptCloud } from './userStorage.js';
export class SyncConflict extends Error {
  constructor() { super('Changes exist on another device'); this.code = 'SYNC_CONFLICT'; }
}
// Serialize writes per account; a delayed A request must never collect B's data.
export function createUserSync(client) {
  const inFlight = new Map();
  async function load(uid) {
    const { data, error } = await client.from('user_data').select('data, updated_at').eq('id', uid).maybeSingle();
    if (error) throw error;
    const local = readUser(uid);
    if (local.dirty) {
      if (local.revision !== (data?.updated_at ?? null)) throw new SyncConflict();
      writeUser(uid, { ...local, loaded: true });
    } else acceptCloud(uid, data?.data || {}, data?.updated_at ?? null);
  }
  async function write(uid) {
    const snapshot = readUser(uid);
    if (!snapshot.dirty) return;
    if (!snapshot.loaded) await load(uid);
    const record = readUser(uid);
    const updated_at = new Date(Math.max(Date.now(), Date.parse(record.revision || 0) + 1 || 0)).toISOString();
    const row = { id: uid, data: record.data, updated_at };
    const query = record.revision
      ? client.from('user_data').update(row).eq('id', uid).eq('updated_at', record.revision)
      : client.from('user_data').insert(row);
    const { data, error } = await query.select('updated_at').maybeSingle();
    if (error) { if (error.code === '23505') throw new SyncConflict(); throw error; }
    if (!data) throw new SyncConflict();
    const current = readUser(uid);
    writeUser(uid, { ...current, revision: data.updated_at, loaded: true,
      dirty: JSON.stringify(current.data) !== JSON.stringify(record.data) });
  }
  function sync(uid) {
    if (!uid) return Promise.resolve();
    if (inFlight.has(uid)) return inFlight.get(uid);
    const pending = write(uid).finally(() => inFlight.delete(uid));
    inFlight.set(uid, pending);
    return pending;
  }
  return { load, sync };
}
