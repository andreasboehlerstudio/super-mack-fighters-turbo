import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
import {FIGHTERS} from './data.ts';
import {loadPixelImage} from './image-cache.ts';

test('all playable portrait variants exist and the whole selection fits a compact transfer budget',()=>{
 let thumbnails=0;
 for(const f of FIGHTERS){
  const base=`public/assets/runtime/portraits/${f.id}`;
  thumbnails+=statSync(base+'-thumb.webp').size;
  assert.ok(statSync(base+'.webp').size>0);
 }
 assert.ok(thumbnails<4*1024*1024);
 const entries=JSON.parse(readFileSync('public/assets/runtime/manifest.json','utf8'));
 for(const entry of entries)assert.equal(statSync('public/assets/'+entry.file).size,entry.bytes,entry.file);
 const places=entries.filter((e:{file:string})=>/\/arenas\/.*-thumb\.webp$/.test(e.file));
 assert.ok(places.length>=21);
 assert.ok(places.reduce((s:number,e:{bytes:number})=>s+e.bytes,0)<2*1024*1024);
});
test('repeated portraits share a pending image and failed downloads can be retried',async()=>{
 const original=globalThis.Image;
 const instances:{onload:()=>void;onerror:()=>void}[]=[];
 globalThis.Image=class{onload=()=>{};onerror=()=>{};src='';decoding='';constructor(){instances.push(this)}} as unknown as typeof Image;
 try{
  const a=loadPixelImage('cache-test-ok'),b=loadPixelImage('cache-test-ok');
  assert.equal(a,b);assert.equal(instances.length,1);instances[0].onload();await a;
  assert.equal(loadPixelImage('cache-test-ok'),a);
  const failed=loadPixelImage('cache-test-retry');instances[1].onerror();await assert.rejects(failed);
  const retry=loadPixelImage('cache-test-retry');assert.notEqual(retry,failed);instances[2].onload();await retry;
 }finally{globalThis.Image=original;}
});
