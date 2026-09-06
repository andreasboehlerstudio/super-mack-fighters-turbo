import test from 'node:test';
import assert from 'node:assert/strict';
import {spriteOrigin} from './sprite-origin.ts';
test('ground, jump and air attacks place their authored foot point at the same world position',()=>{
 for(const [id,kind,frame,foot] of [['laurent','action',4,246],['laurent','motion',35,224],['wakala','action',4,212],['wakala','motion',35,246],['juergen','action',4,212]] as const){
  const pivot=spriteOrigin(id,kind,frame);assert.equal(100-pivot.y+foot,100);
 }
});
test('fixed whole-sheet horizontal shifts do not move Max or Wakala when changing sheets',()=>{
 assert.equal(spriteOrigin('max','motion',19).x,123);assert.equal(spriteOrigin('wakala','motion',43).x,108);
 assert.equal(spriteOrigin('max','walk',3).x,128);
});

test('space reserved for an extended kick never shifts the fighter head on screen',()=>{
 for(const [id,shift] of [['michael',19],['graumacher',17]] as const){
  const before=128-spriteOrigin(id,'motion',16).x;
  const kicking=128-shift-spriteOrigin(id,'motion',27).x;
  assert.equal(kicking,before);assert.equal(spriteOrigin(id,'motion',35).x,128);
 }
});
