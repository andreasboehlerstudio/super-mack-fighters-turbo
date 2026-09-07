import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {arenaLifeProfile,ridePose} from './arena-life-profiles.ts';
import {readLocalScores,saveLocalScore} from './local-highscores.ts';
import {visitorOrigin} from './visitor-animation.ts';
import {ARENA_CROWD_SPOTS,crowdGroundPose} from './arena-crowd-layout.ts';
import {COASTERS} from './coasters.ts';
import {SPECIAL_STAGES} from './stages.ts';

test('every arena has its own ground layout and camera movement keeps feet attached to shadows',()=>{
 const ids=[...Array.from({length:21},(_,i)=>'park-'+i),...COASTERS.map(c=>c.id),...SPECIAL_STAGES.map(s=>s.id)];
 assert.equal(ids.length,42);
 for(const id of ids){
  const spots=ARENA_CROWD_SPOTS[id];assert.equal(spots?.length,2,`${id}: explicit standpoints required`);
  assert.deepEqual(arenaLifeProfile(id).crowd,spots);
  for(const spot of spots){
   assert.ok(spot.x>=80&&spot.x<=880&&spot.y>=400&&spot.y<=450,`${id}: crowd stays on the visible foreground`);
   for(const pan of [-9.5,0,7.25,10]){
    const pose=crowdGroundPose(spot,pan);
    assert.ok(Number.isInteger(pose.x)&&Number.isInteger(pose.y));
    assert.equal(pose.y,spot.y);assert.ok(Math.abs(pose.x+pan-spot.x)<=.5);
    assert.equal(pose.shadowY-pose.y,1,'contact shadow must touch the soles during camera movement');
   }
  }
 }
 assert.notDeepEqual(arenaLifeProfile('park-1').crowd,arenaLifeProfile('stage-skyport').crowd,'shared German crowd art must not imply a shared horizon');
 assert.equal(arenaLifeProfile('park-17').event,'lamps');
 assert.deepEqual(arenaLifeProfile('park-17').sources,[],'Euro-Mir must not retain the old locomotive steam source');
});
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
