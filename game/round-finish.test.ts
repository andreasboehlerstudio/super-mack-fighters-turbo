import test from 'node:test';
import assert from 'node:assert/strict';
import {createMatch,step,neutral} from './combat.ts';
import {finishTimeScale,CALLOUT_TIMING} from './battle-presentation.ts';

test('winning air attack finishes and both fighters land before victory or completion',()=>{
 const m=createMatch('valentina','ed');m.phase='fight';m.score[0]=1;
 Object.assign(m.actors[0],{x:400,y:-70,vy:100,vx:120,action:'airkick',age:9,lock:23});
 Object.assign(m.actors[1],{x:480,y:-70,vy:100,hp:1});
 step(m,[neutral(),neutral()]);
 assert.equal(m.phase,'roundover');assert.equal(m.actors[1].hp,0);
 assert.equal(m.actors[0].action,'airkick');assert.ok(m.actors[0].y<0);
 const health=m.actors.map(a=>a.hp);
 for(let n=0;n<140;n++)step(m,[{...neutral(),punch:true,jump:true},neutral()]);
 assert.deepEqual(m.actors.map(a=>a.hp),health);
 assert.ok(m.actors.every(a=>a.y===0&&a.vy===0));
 assert.equal(m.actors[0].action,'victory');assert.equal(m.actors[1].action,'defeat');
 for(let n=0;n<15;n++)step(m,[neutral(),neutral()]);
 assert.equal(m.phase,'complete');assert.equal(m.winner,0);
});
test('time-out preserves ground attack recovery and does not start KO slow motion',()=>{
 const m=createMatch('ed','snorri');m.phase='fight';m.time=1;m.actors[1].hp=90;
 Object.assign(m.actors[0],{action:'kick',age:20,lock:17});
 step(m,[neutral(),neutral()]);assert.equal(m.actors[0].action,'kick');
 assert.equal(finishTimeScale(m),1);
 for(let n=0;n<20;n++)step(m,[neutral(),neutral()]);
 assert.equal(m.actors[0].action,'victory');
});
test('KO slowdown starts immediately, recovers monotonically, and resets for new rounds',()=>{
 const m=createMatch('ed','snorri');m.phase='roundover';m.phaseTicks=145;m.actors[1].hp=0;
 assert.equal(finishTimeScale(m),.45);let previous=.45;
 for(let left=145;left>=0;left--){m.phaseTicks=left;const speed=finishTimeScale(m);assert.ok(speed>=previous&&speed<=1);previous=speed;}
 assert.equal(previous,1);m.phase='intro';assert.equal(finishTimeScale(m),1);
 for(const kind of ['special','ultra'] as const){const timing=CALLOUT_TIMING[kind];assert.ok(timing.hold>=1000&&timing.hold+timing.exit<=2000);assert.ok(timing.exit>0);}
});
