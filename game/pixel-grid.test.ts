import test from 'node:test';
import assert from 'node:assert/strict';
import {pixelScreenScale,pixelScreenFrame,COMBAT_RENDER_ZOOM,snapCombatPixel} from './pixel-grid.ts';
test('pixel mode fits the viewport and produces integer physical pixels at different DPI',()=>{
 for(const dpr of [1,1.25,1.5,2,3])for(const [w,h] of [[1280,720],[1920,1080],[1265,700],[2560,1440]]){
  const scale=pixelScreenScale(w,h,dpr);
  assert.ok(scale*1280<=w+.001&&scale*720<=h+.001);
  assert.ok(Math.abs(scale*2*dpr-Math.round(scale*2*dpr))<.0001);
 }
});
test('centering cannot place the output raster on half a physical pixel',()=>{
 for(const dpr of [1,1.25,1.5,2])for(const [w,h] of [[1265,701],[1919,1079]]){
  const frame=pixelScreenFrame(w,h,dpr);
  for(const position of [frame.left,frame.top])assert.ok(Math.abs(position*dpr-Math.round(position*dpr))<1e-8);
 }
});
test('combat positions land on the shared raster rather than fractional texture pixels',()=>{
 for(const x of [0,.1,18.3,215.7,959.9])assert.ok(Math.abs(snapCombatPixel(x)*COMBAT_RENDER_ZOOM-Math.round(snapCombatPixel(x)*COMBAT_RENDER_ZOOM))<.0001);
});
