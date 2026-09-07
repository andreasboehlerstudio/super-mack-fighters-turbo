import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {FIGHTERS} from './data.ts';
import {FIGHTER_VOICES,isAttackCall,renderAttackCall} from './fighter-voice.ts';

test('every fighter has distinct audible, bounded attack calls with clean endpoints',()=>{
 const hashes=new Set<string>();
 for(const fighter of FIGHTERS){
  assert.ok(FIGHTER_VOICES[fighter.id]);
  const pcm=renderAttackCall(fighter.id,'punch');
  assert.ok(pcm.length>=3000);assert.equal(pcm[0],0);assert.ok(Math.abs(pcm.at(-1)!)<.005);
  let energy=0;for(const n of pcm){assert.ok(Number.isFinite(n)&&Math.abs(n)<=.701);energy+=n*n;}
  assert.ok(energy/pcm.length>.005);
  hashes.add(createHash('sha256').update(new Uint8Array(pcm.buffer)).digest('hex'));
 }
 assert.equal(hashes.size,FIGHTERS.length);
});
test('variants differ and special calls outlast normal punches; impact events never trigger a call',()=>{
 assert.notDeepEqual(renderAttackCall('roland','punch',0),renderAttackCall('roland','punch',1));
 assert.ok(renderAttackCall('ed','ultra').length>renderAttackCall('ed','special').length);
 assert.ok(renderAttackCall('ed','special').length>renderAttackCall('ed','punch').length);
 for(const event of ['hit','block','jump','tag','ko'])assert.equal(isAttackCall(event),false);
 for(const event of ['punch','kick','special','ultra'])assert.equal(isAttackCall(event),true);
});
