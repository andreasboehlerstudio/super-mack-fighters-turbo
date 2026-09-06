import test from 'node:test';
import assert from 'node:assert/strict';
import {ATLAS_SIZE,clampAtlas,focusAtlas,fitAtlas,zoomAtlas} from './atlas-camera.ts';

test('Overview centers the whole map and cannot be dragged out of view',()=>{
 assert.deepEqual(clampAtlas({x:5000,y:-5000,zoom:0},{width:800,height:440}),{x:0,y:0,zoom:1});
});
test('Zoom keeps the map point under the cursor in place',()=>{
 const viewport={width:800,height:440},before={x:20,y:-10,zoom:2},anchor={x:80,y:40};
 const after=zoomAtlas(before,3,anchor,viewport);
 assert.equal((anchor.x-before.x)/before.zoom,(anchor.x-after.x)/after.zoom);
 assert.equal((anchor.y-before.y)/before.zoom,(anchor.y-after.y)/after.zoom);
});
test('Panning and focusing at an edge never expose empty space beyond the map',()=>{
 const viewport={width:800,height:440};
 for(const camera of [clampAtlas({x:99999,y:-99999,zoom:99},viewport),focusAtlas([0,1],viewport)]){
  const scale=fitAtlas(viewport)*camera.zoom;
  assert.ok(Math.abs(camera.x)<=(ATLAS_SIZE.width*scale-viewport.width)/2+.001);
  assert.ok(Math.abs(camera.y)<=(ATLAS_SIZE.height*scale-viewport.height)/2+.001);
  assert.ok(camera.zoom>=1&&camera.zoom<=4);
 }
});
