import {createRequire} from 'node:module';
import {mkdir,writeFile,unlink} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {FIGHTERS} from '../game/data.ts';
import {ANIMATION_SHEETS} from '../game/animation-sheets.ts';
const require=createRequire(import.meta.url);
let sharp;try{sharp=require('sharp')}catch{sharp=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp'))}
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),assets=path.join(root,'public/assets'),manifest={frameSize:256,version:1,fighters:{}};
for(const {id} of FIGHTERS){
 const folder=path.join(assets,'animations',id);await mkdir(folder,{recursive:true});manifest.fighters[id]={};
 for(const [clip,{kind,frames}] of Object.entries(ANIMATION_SHEETS)){
  const src=path.join(assets,kind==='action'?'':kind,`${id}.png`),columns=kind==='motion'?8:4,width=Math.min(4,frames.length)*256,height=Math.ceil(frames.length/4)*256;
  const cells=await Promise.all(frames.map(async(frame,i)=>({input:await sharp(src).extract({left:frame%columns*256,top:Math.floor(frame/columns)*256,width:256,height:256}).png().toBuffer(),left:i%4*256,top:Math.floor(i/4)*256})));
  const original=await sharp({create:{width,height,channels:4,background:'#00000000'}}).composite(cells).raw().toBuffer();
  // Transparent RGB carries no visible information and is canonicalized before encoding.
  for(let p=0;p<original.length;p+=4)if(original[p+3]===0)original.fill(0,p,p+3);
  const target=path.join(folder,`${clip}.webp`);
  await sharp(original,{raw:{width,height,channels:4}}).webp({lossless:true,effort:6}).toFile(target);
  const decoded=await sharp(target).ensureAlpha().raw().toBuffer();
  for(let p=0;p<decoded.length;p+=4)if(decoded[p+3]===0)decoded.fill(0,p,p+3);
  if(!original.equals(decoded))throw Error(`Lossless round-trip failed: ${id}/${clip}`);
  // Remove only this verified clip's obsolete PNG, within the explicit animation folder.
  await unlink(path.join(folder,`${clip}.png`)).catch(e=>{if(e.code!=='ENOENT')throw e});
  manifest.fighters[id][clip]={frames:frames.length,width,height,source:kind};
 }
}
await writeFile(path.join(assets,'animations/manifest.json'),JSON.stringify(manifest));
console.log(`Exported ${FIGHTERS.length} fighters × ${Object.keys(ANIMATION_SHEETS).length} animation sheets without resizing.`);
