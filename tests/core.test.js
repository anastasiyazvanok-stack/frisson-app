import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { activateUser, acceptCloud, readUser, userStorage } from '../src/lib/userStorage.js';
import { createUserSync } from '../src/lib/userSync.js';
import { buildCatalog } from '../src/data/catalog.js';
import { AUDIO_URLS, getAudioUrl } from '../src/data/audioUrls.js';
import { getActivity, markPractice } from '../src/data/activity.js';
import { localDay, previousDay } from '../src/utils/dates.js';
import { authorizeAI } from '../server/ai-access.js';

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
test('English catalogue uses canonical audio identities',()=>{
  const files=Object.values(AUDIO_URLS).map(p=>p.split('/').pop());const meds=buildCatalog('en',null,null).flatMap(s=>s.meds);assert.equal(meds.length,15);
  for(const med of meds)assert.ok(getAudioUrl(med,{LOCAL_AUDIO_FILES:files,BASE_URL:'/frisson-app/'}).startsWith('/frisson-app/audio/'));
});
test('missing local recordings are unavailable; configured CDN works',()=>{
  const med=buildCatalog('ru',null,null)[0].meds[0];assert.equal(getAudioUrl(med,{}),null);assert.ok(getAudioUrl(med,{VITE_AUDIO_BASE_URL:'https://media.example.test/audio'}).startsWith('https://media.example.test/audio/'));
});
test('remote catalogue is authoritative including empty, hidden and added records',()=>{
  assert.deepEqual(buildCatalog('ru',[],[]),[]);
  const sections=[{id:'s',name:'Новый раздел',active:true}];const meds=[{id:'remote',title:'Новая медитация',section_id:'s',audio_url:'https://example.test/new.mp3',active:true},{id:'hidden',section_id:'s',active:false}];
  const result=buildCatalog('ru',meds,sections);assert.equal(result.length,1);assert.equal(result[0].meds.length,1);assert.equal(getAudioUrl(result[0].meds[0],{}),'https://example.test/new.mp3');
});
test('hidden sections stay hidden',()=>{assert.deepEqual(buildCatalog('ru',[{id:'m',section_id:'hidden',active:true}],[{id:'hidden',active:false}]),[])});
test('new day practice normalizes yesterday before counting',()=>{
  activateUser('A');userStorage.setItem('frisson_activity',JSON.stringify({streak:3,lastDay:previousDay(),todayDone:true,totalMeds:3,totalMinutes:30,achievements:[],name:'A'}));
  const result=markPractice(10);assert.equal(result.streak,4);assert.equal(result.lastDay,localDay());assert.equal(result.todayDone,true);assert.equal(markPractice(1).streak,4);
});
test('missed days reset a stale streak even if todayDone was already false',()=>{
  activateUser('A');userStorage.setItem('frisson_activity',JSON.stringify({streak:3,lastDay:'2000-01-01',todayDone:false,totalMeds:3,totalMinutes:30,achievements:[]}));assert.equal(getActivity().streak,0);assert.equal(markPractice(1).streak,1);
});
function response(){return {code:200,headers:{},setHeader(k,v){this.headers[k]=v},status(n){this.code=n;return this},json(v){this.body=v},end(){}}}
test('AI rejects missing token before provider/database calls',async()=>{
  const res=response();await authorizeAI({method:'POST',headers:{},body:{}},res,()=>{throw Error('must not be called')});assert.equal(res.code,401);
});
test('AI rejects forged sessions, enforces quota, and fails closed if migration missing',async()=>{
  process.env.SUPABASE_URL='https://example.test';process.env.SUPABASE_ANON_KEY='test';
  const req={method:'POST',headers:{authorization:'Bearer test'},body:{text:'synthetic'}};
  let res=response();await authorizeAI(req,res,()=>({auth:{getUser:async()=>({error:{}})}}));assert.equal(res.code,401);
  for(const [quota,expected] of [[{error:{}},503],[{data:false},429]]){res=response();await authorizeAI(req,res,()=>({auth:{getUser:async()=>({data:{user:{id:'A'}}})},rpc:async()=>quota}));assert.equal(res.code,expected)}
});
test('AI accepts a valid session and database quota with native CORS',async()=>{
  process.env.SUPABASE_URL='https://example.test';process.env.SUPABASE_ANON_KEY='test';const res=response();const user=await authorizeAI({method:'POST',headers:{authorization:'Bearer test',origin:'capacitor://localhost'},body:{text:'synthetic'}},res,()=>({auth:{getUser:async()=>({data:{user:{id:'A'}}})},rpc:async()=>({data:true})}));assert.equal(user.id,'A');assert.equal(res.headers['Access-Control-Allow-Origin'],'capacitor://localhost');
});
test('AI rejects unapproved origins and malformed bodies',async()=>{
  let res=response();await authorizeAI({method:'POST',headers:{origin:'https://foreign.test'},body:{}},res);assert.equal(res.code,403);
  res=response();await authorizeAI({method:'POST',headers:{authorization:'Bearer test'},body:'bad'},res,()=>({auth:{getUser:async()=>({data:{user:{id:'A'}}})},rpc(){throw Error('must not call quota')}}));assert.equal(res.code,400);
});
