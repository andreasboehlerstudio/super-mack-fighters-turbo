import test from 'node:test';
import assert from 'node:assert/strict';
import {createMatch,neutral,step} from './combat.ts';
import {movesFor,ultraFor} from './moves.ts';
import {HEROES,type FighterId} from './data.ts';
import {SELECT_COLUMNS,SELECT_ROWS,SELECT_PAGE_SIZE} from './select-layout.ts';

test('Karsten, Edda and Michael Scholz have themed move sets and fit the portrait grid',()=>{
 assert.deepEqual(movesFor('karsten').map(m=>[m.name,m.kind]),[['Objektivblitz','bolt'],['Dolly-Fahrt','dash'],['Kran-Schwenk','arc']]);
 assert.equal(ultraFor('karsten').name,'ONE TAKE');
 assert.deepEqual(movesFor('edda').map(m=>m.kind),['arc','burst','dash']);
 assert.deepEqual(movesFor('scholz').map(m=>[m.name,m.kind]),[['Pionier-Impuls','wave'],['Allee-Sprint','dash'],['Qualitätskontrolle','bolt']]);
 assert.equal(ultraFor('scholz').name,'PIONIERGEIST 73');
 assert.equal(HEROES.length,39);
 assert.equal(SELECT_PAGE_SIZE,SELECT_COLUMNS*SELECT_ROWS);assert.equal(Math.ceil(HEROES.length/SELECT_PAGE_SIZE),1);
});

test('new fighters execute all three specials and retain projectile identity after a tag',()=>{
 for(const id of ['valentina','schaer','glen','steffen','vendel','karsten','edda','scholz','bobo','mross','otto','ross','freudenreich','robbemond','olli','boeckli','louis','tesla'] as FighterId[])for(let move=0;move<3;move++){
  const m=createMatch(id,'roland',19,{training:true,partners:['ed',null]});
  for(let i=0;i<150;i++)step(m,[neutral(),neutral()]);
  m.actors[0].x=400;m.actors[1].x=id==='olli'?535:560;
  const send=(keys:Partial<ReturnType<typeof neutral>>,n=1)=>{for(let i=0;i<n;i++)step(m,[{...neutral(),...keys},neutral()]);};
  if(move===2){send({left:true},45);send({right:true,punch:true});}
  else{send({down:true});send({right:true});send(move===0?{punch:true}:{kick:true});}
  assert.equal(m.actors[0].action,'special',`${id}/${move}`);assert.equal(m.actors[0].activeMove,move);
  const startX=m.actors[0].x;let launched=false,hit=false;
  for(let i=0;i<110;i++){send({});if(m.projectiles.length){launched=true;assert.ok(m.projectiles.every(p=>p.sourceId===id));}hit ||= m.actors[1].hp<100;}
  const kind=movesFor(id)[move].kind;
  if(kind==='bolt'||kind==='arc')assert.ok(launched,`${id}/${move} projectile`);
  if(kind==='dash')assert.ok(m.actors[0].x>startX+50,`${id}/${move} dash`);
  if(move!==2)assert.ok(hit,`${id}/${move} damage`);
 }
 const m=createMatch('karsten','roland',19,{training:true,partners:['ed',null]});
 for(let i=0;i<150;i++)step(m,[neutral(),neutral()]);
 for(const key of ['down','right','punch'])step(m,[{...neutral(),[key]:true},neutral()]);
 while(m.actors[0].lock>0)step(m,[neutral(),neutral()]);
 const shot=m.projectiles[0];assert.ok(shot);step(m,[{...neutral(),tag:true},neutral()]);
 assert.equal(m.actors[0].id,'ed');assert.equal(shot.sourceId,'karsten');
});

test('Olli pulls an open opponent forward but respects block, parry and facing',()=>{
 for(const defense of ['open','block','parry','behind'] as const){
  const m=createMatch('olli','roland',19,{training:true,parry:true});
  m.phase='fight';m.actors[0].x=400;m.actors[1].x=defense==='behind'?265:535;
  Object.assign(m.actors[0],{action:'special',age:17,lock:40,face:1,activeMove:0});
  const keys=neutral();if(defense==='block')keys.block=true;if(defense==='parry')keys.parry=true;
  step(m,[neutral(),keys]);
  if(defense==='open'){assert.equal(m.actors[1].x,478);assert.equal(m.actors[1].hp,73);}
  else if(defense==='block'){assert.ok(m.actors[1].x>=535);assert.ok(m.actors[1].hp>90);}
  else{assert.equal(m.actors[1].hp,100);assert.equal(m.actors[1].x,defense==='behind'?265:535);}
 }
});
