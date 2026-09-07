import { test } from 'node:test';
import assert from 'node:assert/strict';
import { memberAccess } from '../server/member-access.js';
import { checkAudioRequest } from '../middleware.js';

test('membership does not accept missing, invalid or unverifiable sessions', async () => {
  assert.equal((await memberAccess(null)).status,401);
  process.env.SUPABASE_URL='https://example.test';process.env.SUPABASE_ANON_KEY='test';
  const create=()=>({auth:{getUser:async()=>({error:{}})}});
  assert.equal((await memberAccess('test',create)).status,401);
  const unavailable=()=>({auth:{getUser:async()=>({data:{user:{id:'A'}}})},rpc:async()=>({error:{}})});
  assert.equal((await memberAccess('test',unavailable)).status,503);
});
test('audio requests including byte ranges require live membership and are not cached',async()=>{
  const req=new Request('https://example.test/audio/test.mp3',{headers:{Cookie:'__Secure-frisson-audio=test',Range:'bytes=0-100'}});
  let response=await checkAudioRequest(req,async token=>{assert.equal(token,'test');return {status:200,access:{active:false}}});
  assert.equal(response.status,403);
  response=await checkAudioRequest(req,async()=>({status:503}));assert.equal(response.status,503);
  response=await checkAudioRequest(req,async()=>({status:200,access:{active:true}}));
  assert.equal(response.headers.get('x-middleware-next'),'1');assert.match(response.headers.get('cache-control'),/no-store/);
});
