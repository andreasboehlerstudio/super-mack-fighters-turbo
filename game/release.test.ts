import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {arenaLifeProfile,ridePose} from './arena-life-profiles.ts';
import {readLocalScores,saveLocalScore} from './local-highscores.ts';
import {visitorOrigin} from './visitor-animation.ts';
test('every themed area uses its own two-person crowd and every ride remains cosmetic and finite',()=>{
 const manifest=JSON.parse(readFileSync(new URL('../public/assets/arena-life/manifest.json',import.meta.url),'utf8'));
 assert.equal(manifest.areas.length,21);
 for(let i=0;i<21;i++){const p=arenaLifeProfile('park-'+i);assert.equal(p.area,'park-'+i);assert.equal(p.crowd.length,2);const art=manifest.areas.find((a:any)=>a.id===p.area);assert.equal(art.frames.length,8);for(const f of art.frames){assert.ok(f.scale<=1);assert.equal(f.foot,154)}assert.ok(readFileSync(new URL('../public/assets/arena-life/'+p.area+'.webp',import.meta.url)).length>1000);if(p.ride){let visible=0,hidden=0;for(let tick=0;tick<p.ride.period*60;tick++){const v=ridePose(p.ride,tick);if(v){visible++;assert.ok([v.x,v.y,v.angle,v.alpha].every(Number.isFinite));assert.ok(v.alpha>=0&&v.alpha<=1)}else hidden++;}assert.ok(visible&&hidden);}}
});
test('visitor soles meet their world shadow in every walking phase',()=>{for(let f=0;f<16;f++)assert.ok(visitorOrigin(f).y>=216&&visitorOrigin(f).y<=217)});
test('local Pages scores persist per tour, sort correctly and do not duplicate retries',()=>{
 const values=new Map<string,string>(),storage={getItem:(k:string)=>values.get(k)??null,setItem:(k:string,v:string)=>{values.set(k,v)}};
 const base={tour:'short',initials:'AND',hero:'andreas' as const,id:'one',score:300};
 saveLocalScore(storage,base);saveLocalScore(storage,base);saveLocalScore(storage,{...base,id:'two',score:800});saveLocalScore(storage,{...base,tour:'full',id:'three',score:1000});
 assert.deepEqual(readLocalScores(storage,'short').map(r=>r.score),[800,300]);assert.equal(readLocalScores(storage,'full').length,1);
 storage.setItem('smft-local-highscores-v1','broken');assert.deepEqual(readLocalScores(storage,'short'),[]);
});
