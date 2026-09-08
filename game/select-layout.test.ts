import test from 'node:test';
import assert from 'node:assert/strict';
import {HEROES} from './data.ts';
import {pageTarget,selectPage,SELECT_PAGE_SIZE} from './select-layout.ts';
test('portrait pages expose every fighter once and preserve the partial final page',()=>{
 const seen=[];
 for(let p=0;p<Math.ceil(HEROES.length/SELECT_PAGE_SIZE);p++){
  const page=HEROES.slice(p*SELECT_PAGE_SIZE,(p+1)*SELECT_PAGE_SIZE);
  assert.ok(page.length<=SELECT_PAGE_SIZE);seen.push(...page.map(f=>f.id));
 }
 assert.deepEqual(seen,HEROES.map(f=>f.id));
 for(let i=0;i<HEROES.length;i++)for(const dir of [-1,1]){
  const next=pageTarget(i,dir,HEROES.length);assert.ok(next>=0&&next<HEROES.length);
  assert.notEqual(selectPage(next),selectPage(i));
 }
 assert.equal(pageTarget(0,1,38),27);
 assert.equal(pageTarget(26,1,38),37);
 assert.equal(pageTarget(27,-1,38),0);
 assert.equal(pageTarget(0,-1,38),27);
 assert.equal(pageTarget(0,1,1),0);
});
