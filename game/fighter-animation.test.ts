import test from 'node:test';
import assert from 'node:assert/strict';
import {motionFrame} from './fighter-animation.ts';
import {advanceWalkPhase,walkFrame} from './walk-animation.ts';
test('walking never picks the shortened, repeated row in the motion atlas',()=>{
 for(let age=0;age<120;age++)assert.equal(motionFrame('walk',age,age/120),null);
});
test('all eight walking phases advance by distance, and reversing retraces them',()=>{
 let phase=0;const seen=new Set<number>();
 for(let i=0;i<32;i++){seen.add(walkFrame(phase));phase=advanceWalkPhase(phase,5,160);}
 assert.equal(seen.size,8);assert.equal(phase,0);
 phase=advanceWalkPhase(phase,40,160);assert.equal(phase,.25);
 phase=advanceWalkPhase(phase,40,160,-1);assert.equal(phase,0);
});
test('attack contact poses remain tied to the gameplay hit window',()=>{
 for(const [action,start,recovery] of [['punch',8,13],['kick',14,20],['airpunch',6,12],['airkick',9,18]] as const){
  assert.equal(motionFrame(action,start)!%8,3);
  assert.equal(motionFrame(action,recovery)!%8,5);
 }
});
