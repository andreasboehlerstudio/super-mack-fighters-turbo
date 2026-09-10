import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {COMBAT_CALL_CLIPS} from './combat-call-clips.ts';
import {impactPixels,impactFrame,IMPACT_SIZE} from './impact-art.ts';
import {createMatch,meleeContactY,activeHitbox,FLOOR} from './combat.ts';

test('every combat call points to audible PCM inside its shipped bank',async()=>{
 for(const bank of ['male','female'] as const){
  const wav=await readFile(new URL(`../public/assets/audio/combat/${bank}-v1.wav`,import.meta.url));
  assert.equal(wav.toString('ascii',0,4),'RIFF');assert.equal(wav.readUInt32LE(24),22050);
  let cursor=0;
  for(const [offset,duration] of COMBAT_CALL_CLIPS[bank]){
   assert.ok(duration>.08&&duration<1);assert.ok(Math.abs(offset-cursor)<.0001);
   const start=Math.round(offset*22050),count=Math.round(duration*22050);
   assert.ok(44+(start+count)*2<=wav.length);let peak=0;
   for(let i=0;i<count;i++)peak=Math.max(peak,Math.abs(wav.readInt16LE(44+(start+i)*2)));
   assert.ok(peak>1000,'clip must contain sound');cursor=offset+duration;
  }
 }
});

test('impact sprites have hard alpha, transparent borders and a finite lifetime',()=>{
 for(const kind of ['light','heavy','special','block'] as const){
  for(let f=0;f<10;f++){
   const p=impactPixels(kind,f);let lit=0;
   for(let y=0;y<IMPACT_SIZE;y++)for(let x=0;x<IMPACT_SIZE;x++){
    const alpha=p[(y*IMPACT_SIZE+x)*4+3];assert.ok(alpha===0||alpha===255);lit+=Number(alpha>0);
    if(x===0||y===0||x===IMPACT_SIZE-1||y===IMPACT_SIZE-1)assert.equal(alpha,0);
   }
   assert.ok(lit>0&&lit<IMPACT_SIZE*IMPACT_SIZE/3);
  }
 }
 assert.equal(impactFrame(-1),null);assert.equal(impactFrame(0),0);assert.equal(impactFrame(19),9);assert.equal(impactFrame(20),null);
});

test('melee sparks follow punch, kick and airborne contact heights',()=>{
 const [a,b]=createMatch('roland','michael').actors;a.x=400;b.x=474;
 a.action='punch';a.age=8;assert.equal(meleeContactY(a,b),FLOOR-130);
 a.action='kick';a.age=14;assert.equal(meleeContactY(a,b),FLOOR-76);
 a.action='airkick';a.age=9;a.y=-50;const box=activeHitbox(a)!;
 assert.ok(meleeContactY(a,b)>=FLOOR+box.y&&meleeContactY(a,b)<=FLOOR+box.y+box.h);
});
