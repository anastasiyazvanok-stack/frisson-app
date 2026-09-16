import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { activateUser, acceptCloud, readUser, userStorage } from '../src/lib/userStorage.js';
import { createUserSync } from '../src/lib/userSync.js';
import { getActivity, getWeekPractices, markPractice } from '../src/data/activity.js';
import { localDay, previousDay } from '../src/utils/dates.js';

let memory;
beforeEach(() => { memory = new Map(); globalThis.localStorage = {
  getItem: k => memory.get(k) ?? null, setItem: (k,v) => memory.set(k,String(v)), removeItem: k => memory.delete(k),
}; activateUser(null); });
function fakeCloud() {
  const rows = new Map(); const state = { rows, error: null, beforeWrite: null };
  state.client = { from() {
    let mode = 'select', row, id, revision;
    const chain = {
      select(){return chain}, eq(k,v){ if(k==='id')id=v;else revision=v;return chain },
      update(v){ mode='update';row=structuredClone(v);return chain },
      insert(v){mode='insert';row=structuredClone(v);id=v.id;return chain},
      async maybeSingle(){
        if(state.error)return {data:null,error:state.error};
        if(mode==='select')return {data:structuredClone(rows.get(id)) ?? null,error:null};
        await state.beforeWrite?.();
        if(mode==='insert' && rows.has(id))return {error:{code:'23505'}};
        if(mode==='update' && rows.get(id)?.updated_at!==revision)return {data:null,error:null};
        rows.set(id,row);return {data:{updated_at:row.updated_at},error:null};
      },
    };return chain;
  }};return state;
}
test('A and B have separate diaries; legacy data is never automatically claimed',()=>{
  memory.set('frisson_journal','legacy private'); activateUser('A');assert.equal(userStorage.getItem('frisson_journal'),null);
  userStorage.setItem('frisson_journal','A private');activateUser('B');assert.equal(userStorage.getItem('frisson_journal'),null);
  userStorage.setItem('frisson_journal','B private');activateUser('A');assert.equal(userStorage.getItem('frisson_journal'),'A private');assert.equal(memory.get('frisson_journal'),'legacy private');
});
test('cloud snapshot replaces omitted keys for that user only',()=>{
  activateUser('A');userStorage.setItem('frisson_journal','A');acceptCloud('A',{'frisson_gems':'3'},'rev');assert.equal(userStorage.getItem('frisson_journal'),null);
});
test('new user cloud upload never collects another active account',async()=>{
  const cloud=fakeCloud(),sync=createUserSync(cloud.client);await sync.load('A');activateUser('A');userStorage.setItem('frisson_journal','A');
  await sync.load('B');activateUser('B');userStorage.setItem('frisson_journal','B');await sync.sync('A');assert.equal(cloud.rows.get('A').data.frisson_journal,'A');assert.equal(readUser('B').data.frisson_journal,'B');
});
test('failed read does not become first login or overwrite remote data',async()=>{
  const cloud=fakeCloud(),sync=createUserSync(cloud.client);cloud.error={message:'offline'};await assert.rejects(sync.load('A'));assert.equal(readUser('A').loaded,false);assert.equal(cloud.rows.size,0);
});
test('failed writes remain dirty and are surfaced, successful retry clears dirty',async()=>{
  const cloud=fakeCloud(),sync=createUserSync(cloud.client);await sync.load('A');activateUser('A');userStorage.setItem('frisson_gems','1');cloud.error={message:'denied'};
  await assert.rejects(sync.sync('A'));assert.equal(readUser('A').dirty,true);cloud.error=null;await sync.sync('A');assert.equal(readUser('A').dirty,false);
});
test('concurrent remote edit is not overwritten',async()=>{
  const cloud=fakeCloud(),sync=createUserSync(cloud.client);cloud.rows.set('A',{data:{},updated_at:'2026-09-01T00:00:00Z'});await sync.load('A');activateUser('A');userStorage.setItem('frisson_gems','5');cloud.rows.set('A',{data:{frisson_gems:'9'},updated_at:'2026-09-02T00:00:00Z'});
  await assert.rejects(sync.sync('A'),{code:'SYNC_CONFLICT'});assert.equal(cloud.rows.get('A').data.frisson_gems,'9');assert.equal(readUser('A').data.frisson_gems,'5');
});
test('edits during upload remain dirty for next sync',async()=>{
  const cloud=fakeCloud(),sync=createUserSync(cloud.client);await sync.load('A');activateUser('A');userStorage.setItem('frisson_gems','1');cloud.beforeWrite=()=>userStorage.setItem('frisson_gems','2');await sync.sync('A');assert.equal(readUser('A').dirty,true);assert.equal(cloud.rows.get('A').data.frisson_gems,'1');cloud.beforeWrite=null;await sync.sync('A');assert.equal(cloud.rows.get('A').data.frisson_gems,'2');
});
test('new accounts have zero counters and no chat history',()=>{
 activateUser('A'); userStorage.setItem('lux_coach_history','private'); markPractice(20,'meditation');
 activateUser('B'); assert.equal(getActivity().totalMeds,0); assert.equal(userStorage.getItem('lux_coach_history'),null); assert.deepEqual(getWeekPractices(getActivity()),[0,0,0,0,0,0,0]);
});
test('diary activity does not count as a meditation',()=>{
 activateUser('A'); markPractice(5); assert.equal(getActivity().totalMeds,0);
 markPractice(20,'meditation'); assert.equal(getActivity().totalMeds,1); assert.equal(getActivity().totalMedMinutes,20);
 assert.equal(getWeekPractices(getActivity()).reduce((a,b)=>a+b,0),2);
});
