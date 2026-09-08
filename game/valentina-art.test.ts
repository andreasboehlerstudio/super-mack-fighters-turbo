import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const sharp=createRequire(import.meta.url)('sharp') as (path:string)=>{ensureAlpha:()=>{raw:()=>{toBuffer:(options:{resolveWithObject:true})=>Promise<{data:Buffer;info:{width:number;height:number}}>}}};
import {ANIMATION_SHEETS} from './animation-sheets.ts';

test('Valentina keeps uniform pixel blocks in every animation and in her portrait',async()=>{
 for(const clip of Object.keys(ANIMATION_SHEETS)){
  const path=fileURLToPath(new URL(`../public/assets/animations/valentina/${clip}.webp`,import.meta.url));
  const {data,info}=await sharp(path).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  for(let frameY=0;frameY<info.height;frameY+=256)for(let y=frameY+1;y<frameY+255;y+=2)for(let x=0;x<info.width;x+=2){
   const first=(y*info.width+x)*4;
   // Lossless WebP may discard RGB beneath fully transparent pixels.
   for(const [dx,dy] of [[1,0],[0,1],[1,1]])for(let c=data[first+3]===0?3:0;c<4;c++)assert.equal(data[((y+dy)*info.width+x+dx)*4+c],data[first+c],`${clip}: mixed pixel sizes at ${x},${y}`);
  }
 }
 const path=fileURLToPath(new URL('../public/assets/portraits/valentina.png',import.meta.url));
 const {data,info}=await sharp(path).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 assert.equal(info.width,768);assert.equal(info.height,1024);
 for(let y=0;y<info.height;y+=4)for(let x=0;x<info.width;x+=4)for(let dy=0;dy<4;dy++)for(let dx=0;dx<4;dx++)for(let c=0;c<4;c++)assert.equal(data[((y+dy)*info.width+x+dx)*4+c],data[(y*info.width+x)*4+c]);
});
