import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const sharp=createRequire(import.meta.url)('sharp') as (path:string)=>{ensureAlpha:()=>{raw:()=>{toBuffer:(options:{resolveWithObject:true})=>Promise<{data:Buffer;info:{width:number;height:number}}>}}};
import {ANIMATION_SHEETS} from './animation-sheets.ts';

test('Valentina retains native sprite detail instead of forced doubled pixels, with crisp alpha',async()=>{
 for(const clip of Object.keys(ANIMATION_SHEETS)){
  const path=fileURLToPath(new URL(`../public/assets/animations/valentina/${clip}.webp`,import.meta.url));
  const {data,info}=await sharp(path).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  let visible=0,detailed=0;
  for(let frameY=0;frameY<info.height;frameY+=256)for(let y=frameY+1;y<frameY+255;y+=2)for(let x=0;x<info.width;x+=2){
   const first=(y*info.width+x)*4;
   assert.ok(data[first+3]===0||data[first+3]===255);
   if(data[first+3]===0)continue;visible++;
   if([[1,0],[0,1],[1,1]].some(([dx,dy])=>[0,1,2,3].some(c=>data[((y+dy)*info.width+x+dx)*4+c]!==data[first+c])))detailed++;
  }
  assert.ok(detailed/visible>.1,`${clip}: source detail was reduced to 2 × 2 blocks again`);
 }
 const path=fileURLToPath(new URL('../public/assets/portraits/valentina.png',import.meta.url));
 const {data,info}=await sharp(path).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 assert.equal(info.width,768);assert.equal(info.height,1024);
 for(let y=0;y<info.height;y+=4)for(let x=0;x<info.width;x+=4)for(let dy=0;dy<4;dy++)for(let dx=0;dx<4;dx++)for(let c=0;c<4;c++)assert.equal(data[((y+dy)*info.width+x+dx)*4+c],data[(y*info.width+x)*4+c]);
});
