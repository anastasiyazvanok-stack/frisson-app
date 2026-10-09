import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { activateUser, acceptCloud, readUser, readRecovery, userStorage, writeUser } from '../src/lib/userStorage.js';
import { createUserSync } from '../src/lib/userSync.js';
import { summarizeData } from '../src/lib/dataSummary.js';
let memory;
beforeEach(() => {memory=new Map(); globalThis.localStorage={getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,String(v)),removeItem:k=>memory.delete(k)};activateUser('A');});
const rev='2026-09-17T10:00:00.000Z';
function delayedReader() {let resolve; const pending=new Promise(r=>resolve=r);return {resolve, sync:createUserSync({from:()=>({select:()=>({eq:()=>({maybeSingle:()=>pending})})})})};}
test('late cloud response cannot replace a newer synced local version',async()=>{
 acceptCloud('A',{frisson_gems:'1'},rev);const r=delayedReader();const pending=r.sync.load('A');
 writeUser('A',{data:{frisson_gems:'2'},revision:'2026-10-02T10:00:00.000Z',dirty:false,loaded:true});
 r.resolve({data:{data:{frisson_gems:'1'},updated_at:rev},error:null});await assert.rejects(pending,{code:'SYNC_CONFLICT'});assert.equal(readUser('A').data.frisson_gems,'2');
});
test('edits during a cloud read are retained',async()=>{
 acceptCloud('A',{frisson_gems:'1'},rev);const r=delayedReader();const pending=r.sync.load('A');userStorage.setItem('frisson_gems','3');
 r.resolve({data:{data:{frisson_gems:'1'},updated_at:rev},error:null});await assert.rejects(pending,{code:'SYNC_CONFLICT'});assert.equal(readUser('A').data.frisson_gems,'3');
});
test('missing cloud row cannot erase an initialized version',async()=>{
 acceptCloud('A',{frisson_gems:'5'},rev);const r=delayedReader();const pending=r.sync.load('A');r.resolve({data:null,error:null});await assert.rejects(pending,{code:'SYNC_CONFLICT'});assert.equal(readUser('A').data.frisson_gems,'5');
});
test('previous copies survive replacement and stay account scoped',()=>{
 acceptCloud('A',{frisson_journal:'first'},rev);for(let i=0;i<8;i++)acceptCloud('A',{frisson_journal:'copy'+i},'rev'+i);
 assert.equal(readRecovery('A').initial.data.frisson_journal,'first');assert.equal(readRecovery('A').recent.length,3);assert.equal(readRecovery('B').initial,null);
});
test('invalid local data is preserved instead of reset',()=>{
 memory.set('frisson:user:A','{broken');assert.throws(()=>readUser('A'),{code:'LOCAL_DATA_ERROR'});assert.throws(()=>acceptCloud('A',{},rev));assert.equal(memory.get('frisson:user:A'),'{broken');
});
test('backup storage failure prevents replacement of original data',()=>{
 acceptCloud('A',{frisson_gems:'9'},rev);const old=memory.get('frisson:user:A');globalThis.localStorage.setItem=()=>{throw new Error('quota')};assert.throws(()=>acceptCloud('A',{},rev));assert.equal(memory.get('frisson:user:A'),old);
});
test('diagnostics contain counts rather than private content',()=>{
 const s=summarizeData({frisson_journal:JSON.stringify({intent:[{text:'private'}]}),lux_coach_history:JSON.stringify([{content:'private'}])});assert.equal(s.diary,1);assert.equal(s.messages,1);assert.ok(!JSON.stringify(s).includes('private'));
});

