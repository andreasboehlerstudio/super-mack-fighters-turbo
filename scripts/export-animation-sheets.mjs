import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
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
  await sharp({create:{width,height,channels:4,background:'#00000000'}}).composite(cells).png().toFile(path.join(folder,`${clip}.png`));
  manifest.fighters[id][clip]={frames:frames.length,width,height,source:kind};
 }
}
await writeFile(path.join(assets,'animations/manifest.json'),JSON.stringify(manifest));
console.log(`Exported ${FIGHTERS.length} fighters × ${Object.keys(ANIMATION_SHEETS).length} animation sheets without resizing.`);
