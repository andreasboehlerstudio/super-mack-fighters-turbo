import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createWalkable,advanceRoute,walkStep,NODES,distance,findWalkRoute,arenaGate,clearWalkLine} from './park-world.ts';
import {STATIONS} from './data.ts';
const bytes=readFileSync(new URL('../public/assets/atlas/walk-clearance.bin',import.meta.url));
const allowed=createWalkable(new Int16Array(bytes.buffer,bytes.byteOffset,bytes.length/2));
test('holding into every path boundary stops without backwards snapping or alternating movement',()=>{
 for(const start of Object.values(NODES))for(let n=0;n<16;n++){
  const dx=Math.cos(n*Math.PI/8)*2,dy=Math.sin(n*Math.PI/8)*2;let p={...start},stalled=false;
  for(let i=0;i<900;i++){
   const next=walkStep(p,dx,dy,allowed);
   assert.ok(allowed(next));assert.ok((next.x-p.x)*dx+(next.y-p.y)*dy>=-1e-9);
   assert.ok(distance(p,next)<=2.00001);
   if(stalled)assert.deepEqual(next,p,'held input must not restart movement against a wall');
   stalled=distance(p,next)<1e-9;p=next;
  }
  assert.ok(stalled,'all directions eventually meet the visible path edge');
 }
});
test('no tunnelling across a hedge with a large frame step',()=>{
 const p=NODES.entry,result=walkStep(p,500,0,allowed);assert.ok(result.x-p.x<40);assert.ok(allowed(result));
});
test('auto walking consumes short waypoints without pausing and stops at the exact destination',()=>{
 const result=advanceRoute({x:0,y:0},[{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:5,y:1}],4);
 assert.deepEqual(result.point,{x:3,y:1});assert.equal(result.route.length,1);
 assert.deepEqual(advanceRoute(result.point,result.route,9),{point:{x:5,y:1},route:[]});
});
test('all theme routes with collision-aware connectors stay on visible ground',()=>{
 for(const a of STATIONS)for(const b of STATIONS){
  const route=findWalkRoute(arenaGate(a.id),arenaGate(b.id),allowed);assert.ok(route.length,`${a.id} -> ${b.id}`);
  for(let i=1;i<route.length;i++)assert.ok(clearWalkLine(route[i-1],route[i],allowed));
 }
});
