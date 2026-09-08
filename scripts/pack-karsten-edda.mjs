import sharp from 'sharp';
import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {COMBAT_ART_ORIGINS} from '../game/combat-art-origins.ts';
import {ANIMATION_SHEETS} from '../game/animation-sheets.ts';
const selected=process.argv.slice(2),ids=selected.length?selected:['karsten','edda'];
if(ids.some(id=>!/^[a-z]+$/.test(id)))throw Error('Expected character IDs');
const repo=path.resolve(import.meta.dirname,'..'),dir=path.join(repo,'../work',ids.join('-')),assets=path.join(repo,'public/assets');
const jobs=[];for(const id of ids){const folder=path.join(repo,'art-source/characters',id);const records=JSON.parse(await readFile(path.join(folder,'prompts.json'),'utf8'));jobs.push(...records.map(j=>({...j,source:path.join(folder,j.clip+'.png')})));}
const median=a=>[...a].sort((a,b)=>a-b)[Math.floor(a.length/2)];
function bounds(d,w,h,y0=0,y1=h){let l=w,r=-1,t=h,b=-1,count=0;for(let y=Math.max(0,y0);y<Math.min(h,y1);y++)for(let x=0;x<w;x++)if(d[(y*w+x)*4+3]>128){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);count++;}return {left:l,top:t,width:r-l+1,height:b-t+1,bottom:b,count};}
async function decodeSheet(j){
 const metadata=await sharp(j.source).metadata();if(!metadata.hasAlpha&&!j.chromaKey)throw Error(j.id+'/'+j.clip+' needs real transparency');
 const {data,info}=await sharp(j.source).ensureAlpha().raw().toBuffer({resolveWithObject:true}),{width:w,height:h}=info;
 if(data[3]>128&&!j.chromaKey)throw Error('Background is opaque '+j.source);
 for(let p=0;p<data.length;p+=4){const key=j.chromaKey&&data[p+1]>110&&data[p+1]>data[p]+35&&data[p+1]>data[p+2]+35;data[p+3]=!key&&data[p+3]>128?255:0;if(!data[p+3])data.fill(0,p,p+3);}
 const seen=new Int32Array(w*h),queue=new Int32Array(w*h),parts=[];
 for(let p=0;p<w*h;p++)if(!seen[p]&&data[p*4+3]){
  const label=p+1;let first=0,last=1,l=w,r=0,t=h,b=0;queue[0]=p;seen[p]=label;
  while(first<last){const q=queue[first++],x=q%w,y=Math.floor(q/w);l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);
   for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const nx=x+dx,ny=y+dy;if(nx<0||nx>=w||ny<0||ny>=h)continue;const n=ny*w+nx;if(!seen[n]&&data[n*4+3]){seen[n]=label;queue[last++]=n;}}
  }if(last>=6)parts.push({l,r,t,b,n:last,label,labels:new Set([label])});
 }
 const main=parts.filter(p=>p.n>2500).sort((a,b)=>b.n-a.n).slice(0,8);if(main.length!==8)throw Error(`${j.id}/${j.clip}: ${main.length} silhouettes`);
 main.sort((a,b)=>a.t+a.b-b.t-b.b);const sorted=[...main.slice(0,4).sort((a,b)=>a.l-b.l),...main.slice(4).sort((a,b)=>a.l-b.l)];
 for(const p of parts.filter(p=>!main.includes(p))){const ranked=main.map(m=>({m,d:Math.max(0,m.l-p.r,p.l-m.r)**2+Math.max(0,m.t-p.b,p.t-m.b)**2})).sort((a,b)=>a.d-b.d);if(ranked[0].d<24**2){const m=ranked[0].m;m.l=Math.min(m.l,p.l);m.r=Math.max(m.r,p.r);m.t=Math.min(m.t,p.t);m.b=Math.max(m.b,p.b);m.labels.add(p.label);}}
 // Bounding boxes can overlap when a neighboring fist extends left. Keep only this silhouette's pixels.
 const frames=[];for(const p of sorted){const cell=await sharp(data,{raw:info}).extract({left:p.l,top:p.t,width:p.r-p.l+1,height:p.b-p.t+1}).raw().toBuffer({resolveWithObject:true});for(let y=0;y<cell.info.height;y++)for(let x=0;x<cell.info.width;x++)if(!p.labels.has(seen[(p.t+y)*w+p.l+x]))cell.data.fill(0,(y*cell.info.width+x)*4,(y*cell.info.width+x+1)*4);frames.push({...cell,b:bounds(cell.data,cell.info.width,cell.info.height)});}
 return frames;
}
await mkdir(path.join(dir,'normalized'),{recursive:true});
const origins={...COMBAT_ART_ORIGINS},motionAnchors=JSON.parse(await readFile(path.join(assets,'motion/anchors.json'),'utf8')),anchors=JSON.parse(await readFile(path.join(assets,'costume-anchors.json'),'utf8'));
const idleAudit=JSON.parse(await readFile(path.join(assets,'animations/idle-v4.json'),'utf8')).filter(x=>!ids.includes(x.id));
const combatAudit=JSON.parse(await readFile(path.join(assets,'animations/combat-v5.json'),'utf8'));combatAudit.sheets=combatAudit.sheets.filter(x=>!ids.includes(x.id));
const manifest=JSON.parse(await readFile(path.join(assets,'animations/manifest.json'),'utf8'));
const report=[];
for(const id of ids){
 const sourceDir=path.join(repo,'art-source/characters',id);await mkdir(sourceDir,{recursive:true});
 const all=jobs.filter(j=>j.id===id),portrait=all.find(j=>j.clip==='portrait');if(!portrait)throw Error('Missing portrait '+id);
 const framesByClip={},measurements={},sources={};for(const j of all.filter(j=>j.clip!=='portrait'))sources[j.clip]=await decodeSheet(j);
 for(const clip of ['idle','walk','punch','kick','airpunch','airkick','reactions'])if(!sources[clip])throw Error('Missing '+id+'/'+clip);
 // Scholz's raised elbow reaches his glasses; use the crown band to anchor the skull.
 const height=196,headBand=id==='edda'?.34:id==='scholz'?.12:id==='robbemond'?.10:.16,idleScale=height/median(sources.idle.map(f=>f.b.height));
 const sourceHead=f=>bounds(f.data,f.info.width,f.info.height,f.b.top,f.b.top+Math.round(f.b.height*headBand));
 const targetHead=median(sources.idle.map(f=>sourceHead(f).width))*idleScale;
 for(const [clip,src] of Object.entries(sources)){
  const isAir=clip.startsWith('air'),reactions=clip==='reactions';
  const nativeHead=sourceHead(src[0]).width;
  let scale=clip==='idle'?idleScale:clip==='walk'?height/median(src.map(f=>f.b.height)):isAir?targetHead/nativeHead:height/median((reactions?[2,4,5]:[0,1,7]).map(i=>src[i].b.height));
  // A crouched reaction sheet can share the idle head size without sharing its standing height.
  // Calibrate the whole authored clip once; never resize individual poses during playback.
  scale*=all.find(j=>j.clip===clip)?.scaleMultiplier??1;
  if(!(scale>0&&scale<=1))throw Error('Invalid scale '+id+'/'+clip);
  const prepared=[];
  for(let i=0;i<8;i++){
   const f=src[i],frameScale=clip==='idle'?Math.max(height-2,Math.min(height+2,f.b.height*scale))/f.b.height:scale;
   const w=Math.round(f.info.width*frameScale),h=Math.round(f.info.height*frameScale),data=await sharp(f.data,{raw:f.info}).resize(w,h,{kernel:'nearest'}).raw().toBuffer();
   const b=bounds(data,w,h),head=bounds(data,w,h,b.top,b.top+Math.round(height*headBand));
   prepared.push({f,w,h,data,b,head,x:Math.round(128-head.left-head.width/2),y:isAir||reactions&&i===0?246-height+1-b.top:246-b.bottom});
  }
  const shiftX=Math.min(0,253-Math.max(...prepared.map(p=>p.x+p.b.left+p.b.width-1)));
  const minY=Math.min(...prepared.map(p=>p.y+p.b.top)),maxY=Math.max(...prepared.map(p=>p.y+p.b.bottom)),shiftY=minY<2?2-minY:Math.min(0,253-maxY);
  const frames=[],ms=[];
  for(let i=0;i<8;i++){
   const p=prepared[i],desiredX=p.x+shiftX,x=Math.max(2-p.b.left,Math.min(253-(p.b.left+p.b.width-1),desiredX)),y=p.y+shiftY,out=Buffer.alloc(256*256*4);
   let clipped=0;for(let sy=0;sy<p.h;sy++)for(let sx=0;sx<p.w;sx++){const at=(sy*p.w+sx)*4;if(p.data[at+3]){const dx=x+sx,dy=y+sy;if(dx<2||dx>253||dy<2||dy>253){clipped++;continue;}p.data.copy(out,(dy*256+dx)*4,at,at+4);}}
   if(clipped)throw Error(`${id}/${clip}/${i}: ${clipped} clipped pixels`);
   const b=bounds(out,256,256),headHeight=Math.round(height*(id==='edda'?.43:.30));
   const fullHead=bounds(out,256,256,b.top,b.top+headHeight);
   const anchor={head:{x:fullHead.left,y:fullHead.top,w:fullHead.width,h:headHeight},neck:{x:Math.round(fullHead.left+fullHead.width/2),y:b.top+headHeight}};
   ms.push({...b,frame:i,origin:{x:128+shiftX+x-desiredX,y:246+shiftY},headWidth:p.head.width,headX:x+p.head.left+p.head.width/2,scale,nativeBodyHeight:p.f.b.height,nativeSpan:Math.max(p.f.b.height,p.f.b.width),hash:createHash('sha256').update(out).digest('hex'),anchor});
   frames.push(await sharp(out,{raw:{width:256,height:256,channels:4}}).png().toBuffer());
  }
  if(new Set(ms.map(f=>f.hash)).size!==8)throw Error('Duplicate frames '+id+'/'+clip);
  if(clip==='idle'&&(Math.max(...ms.map(f=>f.height))-Math.min(...ms.map(f=>f.height))>6||shiftX!==0||shiftY!==0))throw Error('Unstable idle '+id+JSON.stringify({heights:ms.map(f=>f.height),shiftX,shiftY}));
  framesByClip[clip]=frames;measurements[clip]=ms;
  await sharp({create:{width:1024,height:512,channels:4,background:'#00000000'}}).composite(frames.map((input,i)=>({input,left:i%4*256,top:Math.floor(i/4)*256}))).png().toFile(path.join(dir,'normalized',id+'-'+clip+'.png'));
  const row={id,clip,scale,idleHeight:height,groundRatio:height/256,frames:ms.map(({anchor,...f})=>f)};report.push(row);if(!['idle','walk'].includes(clip))combatAudit.sheets.push(row);
 }
 origins[id]={};
 const motion=[...framesByClip.idle,...framesByClip.walk,...framesByClip.punch,...framesByClip.kick,...framesByClip.airpunch,...framesByClip.airkick];
 motionAnchors[id]=[];
 for(const [row,clip]of ['idle','walk','punch','kick','airpunch','airkick'].entries())measurements[clip].forEach((f,i)=>{origins[id]['motion-'+(row*8+i)]=f.origin;motionAnchors[id][row*8+i]=f.anchor;});
 const actionMap=[['idle',0],['idle',4],['walk',0],['walk',4],['reactions',0],['reactions',1],['punch',3],['punch',5],['kick',3],['kick',5],['reactions',2],['reactions',3],['reactions',4],['reactions',5],['reactions',6],['reactions',7]];
 const action=actionMap.map(([clip,i])=>framesByClip[clip][i]);
 anchors[id]={action:actionMap.map(([clip,i])=>measurements[clip][i].anchor),walk:measurements.walk.map(f=>f.anchor)};
 actionMap.forEach(([clip,i],frame)=>origins[id]['action-'+frame]=measurements[clip][i].origin);measurements.walk.forEach((f,i)=>origins[id]['walk-'+i]=f.origin);
 for(const [kind,frames,columns,rows]of [['action',action,4,4],['walk',framesByClip.walk,4,2],['motion',motion,8,6]]){
  const target=path.join(assets,kind==='action'?'':kind,id+'.png');await sharp({create:{width:columns*256,height:rows*256,channels:4,background:'#00000000'}}).composite(frames.map((input,i)=>({input,left:i%columns*256,top:Math.floor(i/columns)*256}))).png({compressionLevel:9}).toFile(target);
 }
 const folder=path.join(assets,'animations',id);await mkdir(folder,{recursive:true});manifest.fighters[id]={};
 for(const [clip,spec]of Object.entries(ANIMATION_SHEETS)){
  const atlas=spec.kind==='motion'?motion:spec.kind==='walk'?framesByClip.walk:action,frames=spec.frames.map(f=>atlas[f]);
  const width=Math.min(4,frames.length)*256,height=Math.ceil(frames.length/4)*256;
  const raw=await sharp({create:{width,height,channels:4,background:'#00000000'}}).composite(frames.map((input,i)=>({input,left:i%4*256,top:Math.floor(i/4)*256}))).raw().toBuffer();
  const target=path.join(folder,clip+'.webp');await sharp(raw,{raw:{width,height,channels:4}}).webp({lossless:true,effort:6}).toFile(target);
  const decoded=await sharp(target).ensureAlpha().raw().toBuffer();
  for(let p=0;p<raw.length;p+=4)if(raw[p+3]!==decoded[p+3]||(raw[p+3]&&(raw[p]!==decoded[p]||raw[p+1]!==decoded[p+1]||raw[p+2]!==decoded[p+2])))throw Error('Visible lossless mismatch '+target);
  manifest.fighters[id][clip]={frames:frames.length,width,height,source:spec.kind};
 }
 idleAudit.push({id,frames:8,bodyHeight:height,maxBreathingHeightDifference:Math.max(...measurements.idle.map(f=>f.height))-Math.min(...measurements.idle.map(f=>f.height)),baseline:246,originX:128});
 await copyFile(portrait.source,path.join(assets,'portraits',id+'.png'));
 // Sources are retained next to prompts.json; rebuilding leaves them untouched.

 const montage=[];for(const [row,clip]of ['idle','walk','punch','kick','airpunch','airkick','reactions'].entries())for(let i=0;i<8;i++)montage.push({input:framesByClip[clip][i],left:i*256,top:row*256});
 await sharp({create:{width:2048,height:1792,channels:4,background:'#182337'}}).composite(montage).png().toFile(path.join(dir,id+'-review.png'));
}
await writeFile(path.join(assets,'motion/anchors.json'),JSON.stringify(motionAnchors));await writeFile(path.join(assets,'costume-anchors.json'),JSON.stringify(anchors));
await writeFile(path.join(repo,'game/combat-art-origins.ts'),`/** Authored packing offsets for native-resolution combat art. No pose is resized at runtime. */\nexport const COMBAT_ART_ORIGINS:Readonly<Record<string,Readonly<Record<string,{x:number;y:number}>>>>=${JSON.stringify(origins)};\n`);
await writeFile(path.join(assets,'animations/idle-v4.json'),JSON.stringify(idleAudit,null,2)+'\n');
await writeFile(path.join(assets,'animations/combat-v5.json'),JSON.stringify(combatAudit,null,2));
await writeFile(path.join(assets,'animations/manifest.json'),JSON.stringify(manifest));
await writeFile(path.join(dir,'measurements-'+ids.join('-')+'.json'),JSON.stringify(report,null,2));
console.log(report.map(r=>({id:r.id,clip:r.clip,scale:r.scale,height:[Math.min(...r.frames.map(f=>f.height)),Math.max(...r.frames.map(f=>f.height))],head:[Math.min(...r.frames.map(f=>f.headWidth)),Math.max(...r.frames.map(f=>f.headWidth))]})));
