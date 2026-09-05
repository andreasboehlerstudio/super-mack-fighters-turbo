import test from 'node:test';
import assert from 'node:assert/strict';
import {STATIONS} from './data.ts';
import {arenaGate,findWalkRoute,NODES,EDGES,PARK_ENTRY,projectToPath,distance,walkStep} from './park-world.ts';
test('all arena entrances can be reached along the connected walkway network',()=>{for(const stage of STATIONS){const gate=arenaGate(stage.id),route=findWalkRoute(PARK_ENTRY,gate);assert.ok(route.length>1,stage.id);assert.ok(distance(route.at(-1)!,gate)<.01);for(let i=1;i<route.length;i++){const a=route[i-1],b=route[i];for(let t=0;t<=1;t+=.1)assert.ok(projectToPath({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t}).distance<.01,stage.id+' route crosses a building');}}});
test('movement cannot leave a path corridor even when held toward buildings',()=>{for(const node of Object.values(NODES)){for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1],[.7,.7]]){let p={...node};for(let i=0;i<500;i++){p=walkStep(p,dx,dy);assert.ok(projectToPath(p).distance<=5.01);assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y));}}}});
test('all walkway intersections connect and every edge is traversable both ways',()=>{for(const [a,b] of EDGES){assert.ok(findWalkRoute(NODES[a],NODES[b]).length>0);assert.ok(findWalkRoute(NODES[b],NODES[a]).length>0);}});
