import test from 'node:test';
import assert from 'node:assert/strict';
import {titleMotion} from './title-motion.ts';
test('title entrance settles and idle animation stays inside the approved composition',()=>{assert.equal(titleMotion(0).alpha,0);for(let i=0;i<18000;i++){const t=i/60,m=titleMotion(t);assert.ok(m.scale>=.86&&m.scale<=1.031);assert.ok(m.alpha>=0&&m.alpha<=1);assert.ok(Math.abs(m.edY)<=1);assert.ok(Math.abs(m.snorriY)<=1);if(t>1.1){assert.equal(m.scale,1);assert.ok(m.logoY===0&&m.edX===0&&m.snorriX===0)}}});
test('reduced motion preserves a fully visible, stationary title',()=>{assert.deepEqual(titleMotion(0,true),titleMotion(100,true));assert.equal(titleMotion(0,true).alpha,1);assert.equal(titleMotion(0,true).shine,-1)});
