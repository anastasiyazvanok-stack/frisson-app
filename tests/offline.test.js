import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';

test('service worker precaches shell and never handles personal API or external requests',async()=>{
  const events=new Map();let precached;
  const code=fs.readFileSync(new URL('../public/sw.js',import.meta.url),'utf8').replace('const PRECACHE = [];','const PRECACHE = ["/app/index.html", "/app/assets/main.js"];');
  const context=vm.createContext({URL,self:{registration:{scope:'https://example.test/app/'},location:{origin:'https://example.test'},addEventListener:(key,fn)=>events.set(key,fn),clients:{claim:async()=>{}}},caches:{open:async()=>({addAll:async urls=>{precached=urls}}),match:async url=>url==='https://example.test/app/index.html'?'offline shell':null},fetch:async()=>{throw Error('offline')}});
  vm.runInContext(code,context);let pending;
  events.get('install')({waitUntil:p=>{pending=p}});await pending;assert.equal(precached.length,2);
  for(const url of ['https://example.test/api/ai-chat','https://project.supabase.co/rest/v1/user_data']) {
    events.get('fetch')({request:{url,method:'GET',mode:'cors'},respondWith(){assert.fail('private response must not be cached')}});
  }
  events.get('fetch')({request:{url:'https://example.test/app/',method:'GET',mode:'navigate'},respondWith:p=>{pending=p}});assert.equal(await pending,'offline shell');
});
