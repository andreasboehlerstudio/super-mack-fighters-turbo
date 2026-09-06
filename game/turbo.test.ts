import test from 'node:test';
import assert from 'node:assert/strict';
import {FIGHTERS} from './data.ts';
import {movesFor} from './moves.ts';
import {createMatch,step,neutral,teamHealth,aiInput,createBrain,type Match,type Input,type MatchOptions} from './combat.ts';
const ticks=(m:Match,n:number,a=neutral(),b=neutral())=>{for(let i=0;i<n;i++)step(m,[a,b])};
const ready=(options:MatchOptions={},id=FIGHTERS[0].id)=>{const m=createMatch(id,'snorri',19,options);ticks(m,150);return m};
test('all 63 specials use their distinct command and can hit from either side',()=>{
 for(const f of FIGHTERS)for(const reverse of [false,true])for(let variant=0;variant<3;variant++){
  const m=ready({},f.id);m.actors[0].x=reverse?560:400;m.actors[1].x=reverse?400:560;step(m,[neutral(),neutral()]);
  const forward=m.actors[0].face===1?'right':'left',back=forward==='right'?'left':'right';
  if(variant===2){ticks(m,44,{...neutral(),[back]:true});m.actors[0].x=reverse?560:400;m.actors[1].x=reverse?400:560;step(m,[{...neutral(),[forward]:true,punch:true},neutral()])}
  else for(const input of [{...neutral(),down:true},neutral(),{...neutral(),[forward]:true},neutral(),{...neutral(),[variant===0?'punch':'kick']:true}])step(m,[input,neutral()]);
  assert.equal(m.actors[0].action,'special',f.id+' '+variant);assert.equal(m.actors[0].activeMove,variant);ticks(m,150);assert.ok(m.actors[1].hp<100,f.id+' '+variant+' should connect');
  assert.equal(new Set(movesFor(f.id).map(move=>move.kind)).size,3);
 }
});
test('charge needs sustained back input and expires after release',()=>{
 for(const hold of [1,30,41]){const m=ready();ticks(m,hold,{...neutral(),left:true});step(m,[{...neutral(),right:true,punch:true},neutral()]);assert.equal(m.actors[0].action,'punch')}
 const m=ready();ticks(m,45,{...neutral(),left:true});ticks(m,14);step(m,[{...neutral(),right:true,punch:true},neutral()]);assert.equal(m.actors[0].action,'punch');
});
test('every ultra spends the full meter once, has a telegraph and can be blocked',()=>{
 for(const f of FIGHTERS){const m=ready({},f.id);m.actors[0].x=400;m.actors[1].x=540;m.meter[0]=100;step(m,[{...neutral(),ultra:true},neutral()]);assert.equal(m.actors[0].action,'ultra');assert.equal(m.meter[0],0);assert.equal(m.actors[1].hp,100);assert.ok(m.hitstop>0);ticks(m,190,{...neutral(),ultra:true},{...neutral(),block:true});assert.ok(m.actors[1].hp<100,f.id);assert.ok(m.actors[1].hp>=94,f.id+' ultra remains blockable');assert.equal(m.meter[0],0)}
 const empty=ready();empty.meter[0]=99;step(empty,[{...neutral(),ultra:true},neutral()]);assert.notEqual(empty.actors[0].action,'ultra');assert.equal(empty.meter[0],99);
});
test('parry is optional, precisely timed and cannot be held for continuous defense',()=>{
 const hit=(enabled:boolean,early:boolean)=>{const m=ready({parry:enabled});m.actors[1].x=340;if(early)ticks(m,20,neutral(),{...neutral(),parry:true});step(m,[{...neutral(),punch:true},neutral()]);ticks(m,6);step(m,[neutral(),{...neutral(),parry:true}]);ticks(m,2);return m};
 const good=hit(true,false);assert.equal(good.actors[1].hp,100);assert.equal(good.meter[1],14);
 assert.equal(hit(false,false).actors[1].hp,92);assert.equal(hit(true,true).actors[1].hp,92);
});
test('tag preserves each health pool, shares meter and respects a cooldown',()=>{
 const m=ready({partners:['max','matthias']});m.actors[0].hp=27;m.bench[0]!.hp=63;m.meter[0]=75;step(m,[{...neutral(),tag:true},neutral()]);assert.equal(m.actors[0].id,'max');assert.equal(m.actors[0].hp,63);assert.equal(m.bench[0]!.hp,27);assert.equal(m.meter[0],75);ticks(m,35);step(m,[{...neutral(),tag:true},neutral()]);assert.equal(m.actors[0].id,'max');ticks(m,245);step(m,[{...neutral(),tag:true},neutral()]);assert.equal(m.actors[0].id,'ed');assert.equal(m.actors[0].hp,27);assert.equal(teamHealth(m,0),90);
});
test('knocking out a tag member brings in the partner before awarding a round',()=>{
 const m=ready({partners:['max','matthias']});m.actors[0].x=270;m.actors[1].x=340;m.actors[1].hp=1;ticks(m,15,{...neutral(),punch:true});assert.equal(m.actors[1].hp,0);assert.equal(m.phase,'fight');ticks(m,65);assert.equal(m.actors[1].id,'matthias');assert.equal(m.actors[1].hp,100);assert.equal(m.score[0],0);
});
test('low gravity increases airtime, wind is bounded, scenery never deals damage',()=>{
 const airtime=(stageId:string)=>{const m=ready({stageId});step(m,[{...neutral(),jump:true},neutral()]);let n=0;while(m.actors[0].y<0&&n++<200)step(m,[neutral(),neutral()]);return {n,m}};
 assert.ok(airtime('stage-cosmic').n>airtime('stage-hq').n);const wind=airtime('stage-skyport').m;assert.ok(Math.abs(wind.actors[0].x-270)<50);
 for(const stageId of ['stage-svalgurok','stage-traumatica','stage-skyport','stage-batavia','stage-cosmic','stage-blue-fire','stage-hq']){const m=ready({stageId});ticks(m,3000);assert.deepEqual(m.actors.map(a=>a.hp),[100,100])}
});
test('a complete AI tag match with turbo rules and parry reaches two team wins',()=>{
 const m=ready({partners:['max','matthias'],parry:true,turbo:1.32,stageId:'stage-cosmic'}),brains=[createBrain(),createBrain()];for(let i=0;i<45000&&m.phase!=='complete';i++)step(m,[aiInput(m,0,.8,brains[0]),aiInput(m,1,.5,brains[1])]);assert.equal(m.phase,'complete');assert.equal(Math.max(...m.score),2);for(let i=0;i<2;i++){assert.ok(m.meter[i]>=0&&m.meter[i]<=100);assert.ok(teamHealth(m,i)>=0)}
});
