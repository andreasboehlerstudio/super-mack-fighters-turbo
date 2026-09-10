import test from 'node:test';
import assert from 'node:assert/strict';
import {createMatch,neutral,step,activeHitbox,aiInput,createBrain} from './combat.ts';
import {attackTiming} from './combat-timing.ts';
import {motionFrame} from './fighter-animation.ts';
const ready=(dynamic=true)=>{const m=createMatch('roland','michael',19,{dynamicCombat:dynamic});m.phase='fight';m.actors[0].x=400;m.actors[1].x=474;return m};
test('dynamic pilot is opt-in and confined to the two test fighters',()=>{
 assert.equal(ready(false).actors[0].dynamic,false);
 const m=createMatch('ed','roland',19,{dynamicCombat:true});assert.equal(m.actors[0].dynamic,false);assert.equal(m.actors[1].dynamic,true);
});
test('pilot contact artwork and collision open and close together for all four normals',()=>{
 for(const action of ['punch','kick','airpunch','airkick'] as const){const a=ready().actors[0],t=attackTiming(action,true);a.action=action;
  a.age=t.startup-1;assert.equal(activeHitbox(a),null);
  a.age=t.startup;assert.ok(activeHitbox(a));assert.equal(motionFrame(action,a.age,0,true)!%8,3);
  a.age=t.recovery;assert.equal(activeHitbox(a),null);assert.equal(motionFrame(action,a.age,0,true)!%8,5);
 }
});
test('a connected punch can chain to kick; a whiff cannot cancel its recovery',()=>{
 for(const near of [true,false]){const m=ready();if(!near)m.actors[1].x=750;
  step(m,[{...neutral(),punch:true},neutral()]);
  while(m.actors[0].age<8)step(m,[neutral(),neutral()]);
  step(m,[{...neutral(),kick:true},neutral()]);
  assert.equal(m.actors[0].action,near?'kick':'punch');
 }
});
test('buffered follow-up starts exactly after recovery and holding does not repeat',()=>{
 const m=ready();m.actors[1].x=750;
 step(m,[{...neutral(),kick:true},neutral()]);
 while(m.actors[0].lock>8)step(m,[neutral(),neutral()]);
 step(m,[{...neutral(),punch:true},neutral()]);
 let calls=0;for(let i=0;i<80;i++){step(m,[{...neutral(),punch:true},neutral()]);calls+=m.events.filter(e=>e.type==='punch').length;}
 assert.equal(calls,1);assert.equal(m.actors[0].action,'idle');
});
test('jump attacks recover into flight and land with a finite short recovery',()=>{
 for(const key of ['punch','kick'] as const){const m=ready();m.actors[1].x=750;
  step(m,[{...neutral(),jump:true},neutral()]);step(m,[{...neutral(),[key]:true},neutral()]);
  assert.equal(m.actors[0].action,'air'+key);
  for(let i=0;i<90;i++)step(m,[neutral(),neutral()]);
  assert.equal(m.actors[0].y,0);assert.equal(m.actors[0].action,'idle');assert.equal(m.actors[0].lock,0);
 }
});
test('the pilot CPU can follow a connected punch with a kick, but never a missed one',()=>{
 const m=ready(),brain=createBrain();brain.fighter='michael';
 const a=m.actors[1];a.action='punch';a.age=8;a.lock=8;a.attackHit=true;
 assert.equal(aiInput(m,1,.7,brain).kick,true);
 a.attackHit=false;assert.equal(aiInput(m,1,.7,brain).kick,false);
});
