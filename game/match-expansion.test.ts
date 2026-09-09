import test from 'node:test';
import assert from 'node:assert/strict';
import {HEROES,FIGHTERS,FULL_TOUR,SHORT_TOUR} from './data.ts';
import {createMatch,step,neutral,activeHitbox,type Match} from './combat.ts';
import {postMatchScreen,makeBattleConfig} from './match-setup.ts';
import {arcadeLadder,arcadeBoss} from './arcade-ladder.ts';
import {FESTIVAL_TOURS} from './tour-extras.ts';
import {DEFAULT_RULES} from './rules.ts';
import {motionFrame} from './fighter-animation.ts';
const tick=(m:Match,n:number)=>{for(let i=0;i<n;i++)step(m,[neutral(),neutral()])};

test('each fighter can land one aerial punch or kick from either facing direction',()=>{
 for(const f of FIGHTERS)for(const attack of ['punch','kick'] as const)for(const facing of [-1,1] as const){
  const m=createMatch(f.id,'ed');m.phase='fight';m.actors[0].x=480;m.actors[1].x=480+facing*80;for(const a of m.actors){a.y=-80;a.vy=-40}
  step(m,[{...neutral(),[attack]:true},neutral()]);assert.equal(m.actors[0].action,attack==='punch'?'airpunch':'airkick');tick(m,30);assert.equal(m.actors[1].hp,attack==='punch'?91:87,f.id+' '+attack+' '+facing);
 }
});
test('jump plus attack together works, momentum continues during the attack, landing cancels its hitbox',()=>{
 const m=createMatch('max','ed');m.phase='fight';step(m,[{...neutral(),jump:true,punch:true,right:true},neutral()]);assert.equal(m.actors[0].action,'airpunch');const x=m.actors[0].x;tick(m,10);assert.ok(m.actors[0].x>x+20);assert.ok(m.actors[0].y<0);
 m.actors[0].y=-1;m.actors[0].vy=150;m.actors[0].action='airkick';m.actors[0].age=12;m.actors[0].lock=15;step(m,[neutral(),neutral()]);assert.equal(m.actors[0].action,'land');assert.equal(activeHitbox(m.actors[0]),null);assert.equal(m.actors[0].vx,0);tick(m,6);assert.equal(m.actors[0].action,'idle');
});
test('attack sprite extension and gameplay hit windows coincide',()=>{
 for(const [action,start,last,end] of [['punch',8,12,25],['kick',14,19,37],['airpunch',6,11,24],['airkick',9,17,32]] as const){
  const a=createMatch('max','ed').actors[0];a.action=action;
  const frames=new Set<number>();for(let age=0;age<end;age++){a.age=age;const frame=motionFrame(action,age)!;frames.add(frame);assert.equal(!!activeHitbox(a),age>=start&&age<=last);assert.equal(frame%8>=3&&frame%8<=4,age>=start&&age<=last)}assert.equal(frames.size,8);
 }
});
test('local Versus ends after 2-0 or 2-1, retains the completed score, then selects characters',()=>{
 for(const mode of ['cpu','versus'] as const)for(const winners of [[0,0],[1,1],[0,1,0],[1,0,1]]){
  const config=makeBattleConfig({mode,p1:'ed',p2:'max',arena:'park-9',route:FULL_TOUR,index:0,difficulty:.3,rules:DEFAULT_RULES,pads:[null,null]});
  const m=createMatch(config.p1,config.p2,1,{training:config.training});tick(m,150);
  for(const [index,winner] of winners.entries()){
   assert.equal(m.phase,'fight');m.actors[1-winner].hp=0;step(m,[neutral(),neutral()]);assert.equal(m.phase,'roundover');tick(m,145);if(index<winners.length-1)tick(m,110);
  }
  assert.equal(m.phase,'complete');assert.equal(m.winner,winners.at(-1));const score=[...m.score],round=m.round;tick(m,500);assert.deepEqual(m.score,score);assert.equal(m.round,round);assert.equal(postMatchScreen(mode,m.winner===0,false),'select');
 }
});
test('all tours open with Frederik, meet Michael at midpoint and end with Roland',()=>{
 for(const route of [FULL_TOUR,SHORT_TOUR,...FESTIVAL_TOURS.map(t=>t.route)]){
  const ladder=arcadeLadder(route.length);assert.equal(ladder.length,route.length);assert.equal(new Set(ladder).size,route.length);assert.equal(ladder[0],'frederik');assert.equal(ladder[Math.floor(route.length/2)],'michael');assert.equal(ladder.at(-1),'roland');
  for(let index=0;index<route.length;index++){const config=makeBattleConfig({mode:'arcade',p1:'ed',p2:'max',arena:'park-9',route,index,difficulty:.12,rules:{...DEFAULT_RULES,tag:true},pads:[null,null]});assert.equal(config.p2,ladder[index]);assert.equal(config.boss,arcadeBoss(index,route.length));assert.notEqual(config.partners![1],config.p2);assert.ok(config.difficulty>=.12&&config.difficulty<=.92)}
 }
 // A run is stable when resumed, while a new run varies its non-boss opponents.
 assert.deepEqual(arcadeLadder(21,'same-run'),arcadeLadder(21,'same-run'));
 assert.notDeepEqual(arcadeLadder(21,'same-run'),arcadeLadder(21,'new-run'));
 assert.ok(arcadeLadder(21).every(id=>HEROES.some(f=>f.id===id)));assert.deepEqual(arcadeLadder(1),['roland']);assert.deepEqual(arcadeLadder(2),['frederik','roland']);
});
