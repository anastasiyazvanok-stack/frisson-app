import { test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { create, act } from 'react-test-renderer';
import { createServer } from 'vite';

test('quick Play survives selection effects, seeking alone earns nothing, errors are shown', async () => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  globalThis.window = { location: { href: 'https://example.test/' } };
  const memory = new Map(); globalThis.localStorage = { getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,v) };
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' });
  let renderer;
  try {
    const { default: Library } = await server.ssrLoadModule('/src/components/Library.jsx');
    const { getThemes } = await server.ssrLoadModule('/src/data/themes.js');
    const events = new Map(), calls=[];
    const audio = { src:'',currentTime:0,duration:100,played:{length:0},
      play(){calls.push('play');return Promise.resolve()},pause(){calls.push('pause')},load(){},
      addEventListener(k,f){events.set(k,f)},removeEventListener(k,f){if(events.get(k)===f)events.delete(k)},
    };
    let rewards = 0;
    await act(async()=>{renderer=create(React.createElement(Library,{theme:'full',THEMES:getThemes(),remoteSections:[{id:'s',name:'Test',color:'#ffffff'}],remoteMeds:[{id:'m',title:'Test recording',section_id:'s',audio_url:'https://example.test/test.mp3',dur:'2 мин'}],addGems:()=>rewards++}),{createNodeMock:element=>element.type==='audio'?audio:null})});
    calls.length=0;
    const quick=renderer.root.findAll(n=>n.type==='div' && n.props.onClick && String(n.props.onClick).includes('stopPropagation'));
    assert.equal(quick.length,1);
    await act(async()=>quick[0].props.onClick({stopPropagation(){}}));
    assert.equal(calls[0],'play');assert.ok(!calls.includes('pause'),'selection effect must not cancel play');
    audio.currentTime=90;await act(async()=>events.get('timeupdate')());assert.equal(rewards,0,'seek position does not equal listening');
    audio.played={length:1,start:()=>0,end:()=>85};await act(async()=>events.get('timeupdate')());assert.equal(rewards,1);
    await act(async()=>events.get('timeupdate')());assert.equal(rewards,1,'only reward once');
    await act(async()=>events.get('error')());assert.equal(renderer.root.findAll(n=>n.props.role==='alert').length,1);
    await act(async()=>renderer.unmount());renderer=null;assert.equal(calls.at(-1),'pause');
  } finally {if(renderer)await act(async()=>renderer.unmount());await server.close()}
});
