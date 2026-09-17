import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { activateUser, acceptCloud, readUser, userStorage } from '../src/lib/userStorage.js';
import { getPracticeCatalog, findPractice, searchPractices, recommendedPractices } from '../src/data/practiceCatalog.js';
import { getPracticeState, toggleFavorite, updatePracticeState, mergeListenedRanges, isListened } from '../src/lib/practiceState.js';
beforeEach(() => {
 const memory = new Map(); globalThis.localStorage = { getItem:k=>memory.get(k)??null, setItem:(k,v)=>memory.set(k,String(v)), removeItem:k=>memory.delete(k) }; activateUser('A');
});
test('catalog IDs and audio survive a language switch', () => {
 const ru=getPracticeCatalog('ru'), en=getPracticeCatalog('en');
 assert.equal(ru.filter(m=>m.audio_url).length,15);
 for(const med of ru) { const translated=en.find(m=>m.id===med.id); assert.equal(translated.audio_url,med.audio_url); assert.equal(findPractice(translated.title).id,med.id); }
});
test('search supports partial words, case, punctuation, feelings and both languages',()=>{
 const all=getPracticeCatalog();
 assert.equal(searchPractices(all,'  ПРАВО настоящей ')[0].id,'med-17');
 assert.ok(searchPractices(all,'сон').some(m=>m.id==='med-3'));
 assert.ok(searchPractices(all,'тревог').some(m=>m.id==='med-11'));
 assert.equal(searchPractices(all,'Faith — as a bridge')[0].id,'med-16');
 assert.equal(searchPractices(all,'qwerty123456').length,0);
});
test('coach recommendations link exact real names without overlapping titles',()=>{
 assert.deepEqual(recommendedPractices('Попробуй «Благодарность и новый уровень».').map(m=>m.id),['med-13']);
 assert.deepEqual(recommendedPractices('Try "Faith as a bridge".','en').map(m=>m.id),['med-16']);
 assert.equal(recommendedPractices('Попробуй «Выдуманная медитация».').length,0);
 assert.equal(recommendedPractices('Попробуй «Возвращение к женской себе».').length,0);
});
test('favorites, progress and history are isolated and included in cloud snapshots',()=>{
 toggleFavorite('med-1'); updatePracticeState(s=>{s.progress['med-1']={position:123};s.completed['med-2']={at:100};return s});
 const snapshot=readUser('A').data; assert.ok(snapshot.nectar_practices);
 activateUser('B');assert.deepEqual(getPracticeState().favorites,{});assert.deepEqual(getPracticeState().completed,{});
 updatePracticeState(s=>{s.favorites['med-3']=1;return s},'A'); assert.deepEqual(getPracticeState().favorites,{});
 acceptCloud('A',snapshot,'rev');activateUser('A');assert.equal(getPracticeState().progress['med-1'].position,123);assert.ok(getPracticeState().favorites['med-1']);
 toggleFavorite('med-1');assert.deepEqual(getPracticeState().favorites,{});
});
test('legacy named full listens are shown without changing counters or importing partial/diary',()=>{
 userStorage.setItem('frisson_psycap_v2',JSON.stringify({events:[{type:'meditation',name:'Доверие к миру',ts:123,meta:{completion:'full'}},{type:'meditation',name:'Женская энергия',ts:124,meta:{completion:'partial'}},{type:'diary',name:'Право быть настоящей',ts:125}]}));
 assert.deepEqual(getPracticeState().completed,{'med-11':{at:123}});assert.equal(userStorage.getItem('frisson_activity'),null);
});
test('seeking and replaying the same segment do not count as completing audio',()=>{
 let ranges=mergeListenedRanges([],0,10); ranges=mergeListenedRanges(ranges,90,100);
 assert.equal(isListened(ranges,100),false);
 ranges=mergeListenedRanges(ranges,0,10);assert.equal(isListened(ranges,100),false);
 ranges=mergeListenedRanges(ranges,10,80);assert.equal(isListened(ranges,100),true);
 assert.equal(isListened(ranges,NaN),false);
});
