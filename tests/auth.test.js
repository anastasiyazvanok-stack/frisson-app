import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { create, act } from 'react-test-renderer';
import { createServer } from 'vite';

const fakeSupabase = `
import { acceptCloud } from './userStorage.js';
export const state = { listener: null, loads: [], pending: {}, session: { user: { id: 'A', email: 'a@example.test' } } };
export const supabase = { auth: { onAuthStateChange(fn) { state.listener = fn; return {data:{subscription:{unsubscribe(){}}}}; } } };
export const getSession = async () => state.session;
export const getIsRecoveryMode = () => false;
export const clearRecoveryMode = () => {};
export const signOut = async () => ({error:null});
export const signIn = async () => ({error:null});
export const signUp = async () => ({error:null});
export const resetPassword = async () => ({error:null});
export const syncToCloud = async () => {};
export const fetchMeditations = async () => null;
export const fetchSections = async () => null;
export const fetchBooks = async () => [];
export function loadFromCloud(uid) {
 state.loads.push(uid);
 return new Promise(resolve => { state.pending[uid] = () => {
   acceptCloud(uid, { frisson_activity: JSON.stringify({name:uid,streak:0,totalMeds:0,totalMinutes:0,achievements:[]}), frisson_gems:uid==='A'?'12':'3',frisson_tour:'1' }, 'revision'); resolve();
 }; });
}
`;
test('account UI waits for hydration, remounts on account change, and ignores token refresh', async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const memory=new Map([['lux_pw_reset','1']]);globalThis.localStorage={getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,v),removeItem:k=>memory.delete(k)};
  globalThis.window={addEventListener(){},removeEventListener(){}};
  globalThis.document={addEventListener(){},removeEventListener(){}};
  const server=await createServer({server:{middlewareMode:true,hmr:false},appType:'custom',plugins:[{name:'test-auth',enforce:'pre',load(id){
    if(id.endsWith('/src/lib/supabase.js'))return fakeSupabase;
    if(id.endsWith('/src/components/Home.jsx'))return `import React from 'react'; export default function Home(p){return React.createElement('p',{'data-home':true},p.userName)}`;
  }}]});
  let renderer;
  try {
    const {default:App}=await server.ssrLoadModule('/src/App.jsx');
    const {state}=await server.ssrLoadModule('/src/lib/supabase.js');
    await act(async()=>{renderer=create(React.createElement(App))});
    assert.equal(renderer.root.findAll(n=>n.props['data-home']).length,0);
    await act(async()=>state.pending.A());
    assert.equal(renderer.root.find(n=>n.props['data-home']).children[0],'A');
    await act(async()=>state.listener('TOKEN_REFRESHED',state.session));
    assert.deepEqual(state.loads,['A']);
    state.session={user:{id:'B',email:'b@example.test'}};
    await act(async()=>state.listener('SIGNED_IN',state.session));
    assert.equal(renderer.root.findAll(n=>n.props['data-home']).length,0);
    await act(async()=>state.pending.B());
    assert.equal(renderer.root.find(n=>n.props['data-home']).children[0],'B');
  } finally { if(renderer)await act(async()=>renderer.unmount());await server.close(); }
});
