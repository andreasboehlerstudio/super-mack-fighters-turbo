import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import {FIGHTERS} from '../game/data.ts';
import {ANIMATION_SHEETS} from '../game/animation-sheets.ts';
const sharp=createRequire(import.meta.url)('sharp'),out='../work/pixel-audit';
await mkdir(out,{recursive:true});
function blocks(data,width,height,step,ox=0,oy=0){
 let total=0,same=0;
 for(let y=oy;y+step<=height;y+=step)for(let x=ox;x+step<=width;x+=step){
  const i=(y*width+x)*4;if(data[i+3]<200)continue;total++;let equal=true;
  for(let dy=0;dy<step&&equal;dy++)for(let dx=0;dx<step&&equal;dx++)for(let k=0;k<4;k++)if(data[((y+dy)*width+x+dx)*4+k]!==data[i+k]){equal=false;break;}
  if(equal)same++;
 }
 return total?same/total:0;
}
const report=[],portraits=[];
for(const f of FIGHTERS){
 const row={id:f.id,name:f.name,clips:{}};
 for(const clip of Object.keys(ANIMATION_SHEETS)){
  const {data,info}=await sharp(`public/assets/animations/${f.id}/${clip}.webp`).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  row.clips[clip]={width:info.width,height:info.height,uniform2:Math.max(...[0,1].flatMap(x=>[0,1].map(y=>blocks(data,info.width,info.height,2,x,y))))};
 }
 const file=`public/assets/portraits/${f.id}.png`,{data,info}=await sharp(file).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 row.portrait={width:info.width,height:info.height,uniform4:Math.max(...[0,1,2,3].flatMap(x=>[0,1,2,3].map(y=>blocks(data,info.width,info.height,4,x,y))))};
 portraits.push(await sharp(file).resize(192,256,{fit:'fill',kernel:'nearest'}).png().toBuffer());report.push(row);
}
for(let page=0;page<Math.ceil(report.length/10);page++){
 const items=report.slice(page*10,page*10+10),width=960,height=Math.ceil(items.length/5)*284;
 const labels=items.map((f,i)=>`<text x="${i%5*192+8}" y="${Math.floor(i/5)*284+277}" fill="white" font-size="14">${f.name.replaceAll('&','&amp;')}</text>`).join('');
 await sharp({create:{width,height,channels:4,background:'#172333'}}).composite([...items.map((_,i)=>({input:portraits[page*10+i],left:i%5*192,top:Math.floor(i/5)*284})),{input:Buffer.from(`<svg width="${width}" height="${height}">${labels}</svg>`),left:0,top:0}]).png().toFile(`${out}/portraits-${page+1}.png`);
}
await writeFile(`${out}/measurements.json`,JSON.stringify(report,null,2));
let md=`# Pixelraster-Abgleich\n\n${report.length} Figuren inklusive Endgegner; alle ${Object.keys(ANIMATION_SHEETS).length} Spielclips pro Figur geprüft. Jans zusätzliche Riesenform ist nicht Teil dieser Tabelle. Prozentwerte messen exakt identische Farbblöcke im günstigsten Rasterversatz, nicht die künstlerische Qualität. Ein hoher Wert kann auch durch große einfarbige Flächen entstehen. Die Portraitwerte beziehen sich auf die Quelldateien, nicht auf die im Menü heruntergerechneten Spielbilder.\n\n| Figur | Portrait (4×4) | Stand (2×2) | Lauf (2×2) | Tritt (2×2) |\n|---|---:|---:|---:|---:|\n`;
for(const r of report)md+=`| ${r.name} | ${(100*r.portrait.uniform4).toFixed(1)} % | ${(100*r.clips.idle.uniform2).toFixed(1)} % | ${(100*r.clips.walk.uniform2).toFixed(1)} % | ${(100*r.clips.kick.uniform2).toFixed(1)} % |\n`;
await writeFile(`${out}/README.md`,md);console.log(md);
