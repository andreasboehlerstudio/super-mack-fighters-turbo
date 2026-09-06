import {createRequire} from 'node:module';
import {mkdir} from 'node:fs/promises';
import path from 'node:path';
import {FIGHTERS} from '../game/data.ts';
import {ANIMATION_SHEETS} from '../game/animation-sheets.ts';
const require=createRequire(import.meta.url);
let sharp;try{sharp=require('sharp')}catch{sharp=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp'))}
await mkdir('../work',{recursive:true});
let count=0;const montage=[];
for(const [row,{id}] of FIGHTERS.entries()){
 for(const [clip,spec] of Object.entries(ANIMATION_SHEETS)){
 const raw=await sharp(`public/assets/animations/${id}/${clip}.png`).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 for(let f=0;f<spec.frames.length;f++){let pixels=0;for(let y=0;y<256;y++)for(let x=0;x<256;x++)if(raw.data[(((Math.floor(f/4)*256+y)*raw.info.width+f%4*256+x)*4)+3]>128)pixels++;if(pixels<500)throw Error(`Empty or missing pose: ${id}/${clip}/${f}`);count++;}
 }
 for(const [column,[clip,frame]] of [['idle',0],['walk',0],['walk',2],['kick',3]].entries()){
 const input=await sharp(`public/assets/animations/${id}/${clip}.png`).extract({left:frame%4*256,top:Math.floor(frame/4)*256,width:256,height:256}).png().toBuffer();
 montage.push({input,left:column*256,top:row*256});
 }
}
for(let page=0;page<4;page++){
 const rows=FIGHTERS.slice(page*6,page*6+6);await sharp({create:{width:1024,height:rows.length*256,channels:4,background:'#172333'}}).composite(montage.filter(m=>m.top>=page*6*256&&m.top<(page+1)*6*256).map(m=>({...m,top:m.top-page*6*256}))).png().toFile(`../work/animation-audit-${page+1}.png`);
}
console.log(`Checked ${count} non-empty native animation poses across all fighters.`);
