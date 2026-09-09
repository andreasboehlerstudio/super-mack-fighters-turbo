import test from 'node:test';
import assert from 'node:assert/strict';
import {pixelScreenScale,pixelScreenFrame,COMBAT_RENDER_ZOOM,snapCombatPixel,RASTER_WIDTH,artRasterSize} from './pixel-grid.ts';

test('portraits and scene art share the same density at every display size',()=>{
 assert.deepEqual(artRasterSize(1280,720),{width:960,height:540});
 assert.deepEqual(artRasterSize(256,256),{width:192,height:192});
 assert.equal(256*COMBAT_RENDER_ZOOM,256);
});
test('pixel mode fits the viewport and produces integer physical pixels at different DPI',()=>{
 for(const dpr of [1,1.25,1.5,2,3])for(const [w,h] of [[1280,720],[1920,1080],[1265,700],[2560,1440]]){
  const scale=pixelScreenScale(w,h,dpr);
  assert.ok(scale*1280<=w+.001&&scale*720<=h+.001);
  assert.ok(Math.abs(scale*1280/RASTER_WIDTH*dpr-Math.round(scale*1280/RASTER_WIDTH*dpr))<.0001);
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

test('window mode remains centered and no larger than the expanded game',()=>{
 for(const dpr of [1,1.25,2])for(const [w,h] of [[1920,1080],[2560,1440],[900,600]]){
  const full=pixelScreenFrame(w,h,dpr,true,true),small=pixelScreenFrame(w,h,dpr,true,false);
  assert.ok(small.scale<=full.scale);assert.ok(small.left>=0&&small.top>=0);
  assert.ok(Math.abs(small.left*2+1280*small.scale-w)<=1/dpr);
 }
});
