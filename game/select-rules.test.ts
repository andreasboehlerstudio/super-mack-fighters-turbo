import test from 'node:test';
import assert from 'node:assert/strict';
import {HEROES,SHORT_TOUR} from './data.ts';
import {randomOpponent,makeBattleConfig} from './match-setup.ts';
import {DEFAULT_RULES,readRules,COSTUMES} from './rules.ts';

test('CPU draws cover the playable roster without the player or immediate repeats',()=>{
 const eligible=HEROES.filter(h=>h.id!=='valentina'&&h.id!=='ed');
 const drawn=eligible.map((_,i)=>randomOpponent('valentina','ed',()=> (i+.5)/eligible.length));
 assert.deepEqual(drawn,eligible.map(h=>h.id));
});

test('disabled costumes are cleared from saves and never passed to a match',()=>{
 for(const costume of COSTUMES){
  const rules={...DEFAULT_RULES,costume1:costume,costume2:costume,parry:true,tag:true};
  assert.equal(readRules(rules).costume1,'classic');assert.equal(readRules(rules).costume2,'classic');
  assert.equal(readRules(rules).parry,true);assert.equal(readRules(rules).tag,true);
  for(const mode of ['cpu','arcade','training','versus'] as const){
   const config=makeBattleConfig({mode,p1:'valentina',p2:'max',arena:'park-9',route:SHORT_TOUR,index:0,difficulty:.38,rules,pads:[null,null]});
   assert.deepEqual(config.costumes,['classic','classic']);
   if(mode!=='arcade')assert.equal(config.p2,'max');
  }
 }
});
