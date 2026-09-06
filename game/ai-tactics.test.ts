import test from 'node:test';
import assert from 'node:assert/strict';
import {aiInput,createBrain,createMatch,neutral,step,LEFT,RIGHT} from './combat.ts';
import {FIGHTERS} from './data.ts';

test('CPU observes the opening before choosing an approach',()=>{
 const m=createMatch('ed','max'),brain=createBrain();m.phase='fight';
 for(let i=0;i<18;i++){const input=aiInput(m,1,.7,brain);assert.deepEqual(input,neutral());step(m,[neutral(),input]);}
 assert.equal(m.actors[1].x,690);
});
test('a wounded CPU actually gains distance, mirrored on both sides',()=>{
 for(const side of [0,1]){
  const m=createMatch('max','max',12),brain=createBrain();m.phase='fight';
  m.actors[side].x=side?540:420;m.actors[1-side].x=side?420:540;m.actors[side].hp=25;
  aiInput(m,side,.6,brain);m.tick=brain.next;
  const initial=Math.abs(m.actors[0].x-m.actors[1].x);
  for(let i=0;i<20;i++){const input=aiInput(m,side,.6,brain);step(m,side?[neutral(),input]:[input,neutral()]);}
  assert.ok(Math.abs(m.actors[0].x-m.actors[1].x)>initial+40);
 }
});
test('a cornered CPU fights or guards instead of retreating into the wall',()=>{
 for(const side of [0,1])for(let seed=1;seed<=30;seed++){
  const m=createMatch('max','max',seed),brain=createBrain();m.phase='fight';
  m.actors[side].x=side?RIGHT:LEFT;m.actors[1-side].x=side?RIGHT-85:LEFT+85;m.actors[side].hp=25;
  aiInput(m,side,.8,brain);m.tick=brain.next;const out=aiInput(m,side,.8,brain);
  // Holding back while crouching charges a special without moving into the wall.
  assert.equal(out[side?'right':'left']&&!out.down,false);assert.notEqual(brain.intent,'retreat');
 }
});
test('CPU punishes a visible missed kick without reading future player input',()=>{
 const m=createMatch('max','max'),brain=createBrain();m.phase='fight';m.actors[1].x=370;
 m.actors[0].action='kick';m.actors[0].age=23;m.actors[0].lock=13;
 aiInput(m,1,.6,brain);m.tick=brain.next;const input=aiInput(m,1,.6,brain);
 assert.ok(input.punch||input.kick);assert.equal(brain.intent,'attack');
});
test('varied CPU pairings finish and produce attacks, retreat and pauses',()=>{
 const intents=new Set<string>();
 for(let i=0;i<FIGHTERS.length;i++){
  const m=createMatch(FIGHTERS[i].id,FIGHTERS[(i+7)%FIGHTERS.length].id,51+i),brains=[createBrain(),createBrain()];let hits=0;
  for(let frame=0;frame<22000&&m.phase!=='complete';frame++){
   step(m,[aiInput(m,0,.55,brains[0]),aiInput(m,1,.75,brains[1])]);
   for(const b of brains)intents.add(b.intent);hits+=m.events.filter(e=>e.type==='hit').length;
  }
  assert.equal(m.phase,'complete',FIGHTERS[i].id);assert.ok(hits>4,FIGHTERS[i].id+' no real fight');assert.equal(Math.max(...m.score),2);
 }
 for(const intent of ['approach','retreat','attack','wait','special','defend'])assert.ok(intents.has(intent),intent);
});
