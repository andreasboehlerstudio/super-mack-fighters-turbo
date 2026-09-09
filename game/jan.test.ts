import test from 'node:test';
import assert from 'node:assert/strict';
import {createMatch,neutral,step,activeMove,hurtbox} from './combat.ts';
import {arcadeLadder,arcadeOpponent} from './arcade-ladder.ts';
import {hitsJanBack} from './jan-form.ts';
const duel=()=>{const m=createMatch('michael','jan');m.phase='fight';m.actors[0].x=400;m.actors[1].x=475;return m;};
function hit(m:ReturnType<typeof duel>,rear=false,block=false){m.hitstop=0;const a=m.actors[0],b=m.actors[1];a.x=rear?b.x+75:b.x-75;Object.assign(a,{face:rear?-1:1,action:'punch',age:7,lock:20,attackHit:false});Object.assign(b,{face:-1,action:block?'block':'idle',age:0,lock:0,invuln:0,turnTicks:0});step(m,[neutral(),{...neutral(),block}]);}
test('Jan transforms on exactly two unblocked hits; normal actions stay normal beforehand',()=>{
 const m=duel();hit(m,false,true);assert.equal(m.actors[1].hitsReceived,0);assert.equal(m.actors[1].hulk,false);
 hit(m);assert.equal(m.actors[1].hitsReceived,1);assert.equal(m.actors[1].hulk,false);
 hit(m);const jan=m.actors[1];assert.equal(jan.hulk,true);assert.equal(jan.transformTicks,90);assert.equal(jan.hp,100);assert.equal(jan.lock,90);assert.equal(hurtbox(jan).h,284);assert.ok(m.events.some(e=>e.label==='YOU MADE JAN ANGRY NOW!'));
 for(let i=0;i<103;i++)step(m,[neutral(),neutral()]);assert.equal(jan.transformTicks,0);assert.equal(jan.hulk,true);
});
test('Hulk resists front attacks and can be defeated from the back on either facing',()=>{
 const m=duel();m.actors[1].hulk=true;hit(m);assert.equal(m.actors[1].hp,100);hit(m,true);assert.equal(m.actors[1].hp,0);
 assert.equal(hitsJanBack({x:400,face:1},300),true);assert.equal(hitsJanBack({x:400,face:-1},500),true);assert.equal(hitsJanBack({x:400,face:1},500),false);
 const n=duel();n.actors[1].hp=1;hit(n);assert.equal(n.actors[1].hp,1,'normal Jan cannot be knocked out from the front');
});
test('all Hulk attack buttons trigger specials and a connected hit knocks out even a blocker',()=>{
 for(const button of ['punch','kick','ultra'] as const){const m=createMatch('jan','michael');m.phase='fight';Object.assign(m.actors[0],{hulk:true,x:400});m.actors[1].x=500;
  step(m,[{...neutral(),[button]:true},neutral()]);assert.equal(m.actors[0].action,'special');assert.equal(activeMove(m.actors[0]).power,100);
  for(let i=0;i<90&&m.phase==='fight';i++)step(m,[neutral(),{...neutral(),block:true}]);assert.equal(m.actors[1].hp,0,button);
 }
});
test('Hulk has a turn delay, retains form on tag, resets each round, and cannot normal-punch in air',()=>{
 const m=createMatch('jan','ed',1,{partners:['michael',null]});m.phase='fight';const jan=m.actors[0];jan.hulk=true;jan.face=1;m.actors[1].x=100;
 for(let i=0;i<41;i++)step(m,[neutral(),neutral()]);assert.equal(jan.face,1);step(m,[neutral(),neutral()]);assert.equal(jan.face,-1);
 jan.y=-60;step(m,[{...neutral(),punch:true},neutral()]);assert.equal(jan.action,'jump');jan.y=0;jan.vy=0;
 step(m,[{...neutral(),tag:true},neutral()]);assert.equal(m.bench[0]?.hulk,true);
 m.phase='roundover';m.phaseTicks=1;m.score=[1,0];step(m,[neutral(),neutral()]);assert.equal(m.actors[0].hulk,false);assert.equal(m.actors[0].hitsReceived,0);
});
test('arcade runs vary between fixed milestones and Jan is in the random pool',()=>{
 const seen=new Set<string>(),runs=new Set<string>();for(let i=0;i<80;i++){const seed='run-'+i,ladder=arcadeLadder(21,seed);assert.equal(ladder[0],'frederik');assert.equal(ladder[10],'michael');assert.equal(ladder[20],'roland');assert.equal(new Set(ladder).size,21);assert.deepEqual(ladder,arcadeLadder(21,seed));ladder.forEach((id,n)=>{seen.add(id);assert.equal(arcadeOpponent(n,21,seed),id)});runs.add(ladder.join(','));}assert.ok(seen.has('jan'));assert.ok(runs.size>1);
});

test('timeout cannot defeat a living Jan and transformation settles after the bell',()=>{
 const m=duel();m.time=1;m.actors[1].hp=20;step(m,[neutral(),neutral()]);assert.equal(m.roundWinner,null);assert.deepEqual(m.score,[0,0]);
 m.actors[1].hulk=true;m.actors[1].transformTicks=2;m.actors[1].lock=2;step(m,[neutral(),neutral()]);step(m,[neutral(),neutral()]);assert.equal(m.actors[1].transformTicks,0);
});
