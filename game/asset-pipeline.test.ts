import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {FIGHTERS,STATIONS,SHORT_TOUR} from './data.ts';
import {ANIMATION_SHEETS,animationPose,animationOrigin,type AnimationClip} from './animation-sheets.ts';
import {COMBAT_RENDER_ZOOM,FIGHTER_DISPLAY_SIZE} from './pixel-grid.ts';
import {visibleParkTiles,PARK_VIEW_WIDTH,PARK_VIEW_HEIGHT} from './park-tiles.ts';
import {cameraTarget,WORLD_WIDTH,WORLD_HEIGHT} from './park-layout.ts';
import {makeBattleConfig} from './match-setup.ts';
import {DEFAULT_RULES} from './rules.ts';
const asset=(p:string)=>new URL('../public/assets/'+p,import.meta.url);
function losslessWebpSize(bytes:Buffer){
 assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');
 for(let offset=12;offset+8<bytes.length;){
  const type=bytes.toString('ascii',offset,offset+4),length=bytes.readUInt32LE(offset+4);
  if(type==='VP8L'){assert.equal(bytes[offset+8],0x2f);const bits=bytes.readUInt32LE(offset+9);return {width:(bits&0x3fff)+1,height:((bits>>>14)&0x3fff)+1};}
  offset+=8+length+(length&1);
 }
 throw Error('Expected a lossless WebP image');
}
test('all fighters have a native sheet for every action and all frame references are valid',()=>{
 assert.equal(FIGHTER_DISPLAY_SIZE*COMBAT_RENDER_ZOOM,128);
 for(const f of FIGHTERS)for(const clip of Object.keys(ANIMATION_SHEETS) as AnimationClip[]){
  const spec=ANIMATION_SHEETS[clip],size=losslessWebpSize(readFileSync(asset(`animations/${f.id}/${clip}.webp`)));
  assert.equal(size.width,Math.min(4,spec.frames.length)*256,`${f.id}/${clip} width`);
  assert.equal(size.height,Math.ceil(spec.frames.length/4)*256,`${f.id}/${clip} height`);
  for(let age=0;age<240;age++){
   const p=animationPose(clip,age,age/120);assert.ok(p.frame>=0&&p.frame<spec.frames.length,`${clip}:${age}`);assert.notEqual(p.sourceFrame,undefined);
   const origin=animationOrigin(f.id,clip,p.frame);assert.ok(Number.isFinite(origin.x)&&Number.isFinite(origin.y));
  }
 }
});
test('new idle stature matches the walk sheets without shrinking individual frames',()=>{
 const audit=JSON.parse(readFileSync(asset('animations/idle-v4.json'),'utf8'));
 assert.equal(audit.length,FIGHTERS.length);
 for(const f of FIGHTERS){const a=audit.find((v:{id:string})=>v.id===f.id);assert.ok(a);assert.equal(a.frames,8);assert.ok(a.maxBreathingHeightDifference<=6);for(let frame=0;frame<8;frame++)assert.deepEqual(animationOrigin(f.id,'idle',frame),{x:128,y:246});}
});
test('map tiles join without gaps, cover every camera view and retain native detail',()=>{
 const manifest=JSON.parse(readFileSync(asset('atlas/detail/manifest.json'),'utf8'));
 assert.equal(manifest.width,WORLD_WIDTH*2);assert.equal(manifest.height,WORLD_HEIGHT*2);
 let pixels=0;
 for(const t of manifest.tiles){const size=losslessWebpSize(readFileSync(asset('atlas/detail/'+t.file)));assert.equal(size.width,t.width);assert.equal(size.height,t.height);pixels+=t.width*t.height;}
 assert.equal(pixels,manifest.width*manifest.height);
 for(let x=0;x<=WORLD_WIDTH;x+=53)for(let y=0;y<=WORLD_HEIGHT;y+=53){
  const camera=cameraTarget({x,y},PARK_VIEW_WIDTH,PARK_VIEW_HEIGHT),tiles=visibleParkTiles(camera);
  assert.ok(tiles.length<=20);
  for(const dx of [-PARK_VIEW_WIDTH/2+.01,0,PARK_VIEW_WIDTH/2-.01])for(const dy of [-PARK_VIEW_HEIGHT/2+.01,0,PARK_VIEW_HEIGHT/2-.01])assert.ok(tiles.some(t=>camera.x+dx>=t.x&&camera.x+dx<t.x+t.width&&camera.y+dy>=t.y&&camera.y+dy<t.y+t.height));
 }
});
test('every free arena choice reaches the same arena in Versus, CPU and Training',()=>{
 for(const s of STATIONS){const size=losslessWebpSize(readFileSync(asset(`arenas/${s.id}.webp`)));assert.ok(size.width>0&&size.height>0);for(const mode of ['versus','cpu','training'] as const){const c=makeBattleConfig({mode,p1:'laurent',p2:'max',arena:s.id,route:SHORT_TOUR,index:3,difficulty:.3,rules:DEFAULT_RULES,pads:[null,null]});assert.equal(c.stationId,s.id);assert.equal(c.p2,'max');assert.equal(c.training,mode==='training');}}
});
