import type {FighterId} from './data';
import type {Costume} from './rules';
import {costumePlacements,type CostumeAnchor,type Rect} from './costume-layout';
const cache=new Map<string,Promise<HTMLCanvasElement>>();
const load=(url:string)=>new Promise<HTMLImageElement>((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(Error('Costume asset: '+url));image.src=url});
let anchors:Promise<Record<FighterId,{action:CostumeAnchor[];walk:CostumeAnchor[]}>>|undefined;
let motionAnchors:Promise<Record<FighterId,CostumeAnchor[]>>|undefined;
function bounds(ctx:CanvasRenderingContext2D,x:number,y:number,w:number,h:number):Rect{const data=ctx.getImageData(x,y,w,h).data;let left=w,top=h,right=0,bottom=0;for(let j=0;j<h;j++)for(let i=0;i<w;i++)if(data[(j*w+i)*4+3]>80){left=Math.min(left,i);right=Math.max(right,i);top=Math.min(top,j);bottom=Math.max(bottom,j)}return {x:x+left,y:y+top,w:Math.max(1,right-left+1),h:Math.max(1,bottom-top+1)}}
/** Compose generated accessories on the measured head and neck of every pose. */
export function loadCostumeSheet(id:FighterId,costume:Costume,kind:'walk'|'action'|'motion'='action'):Promise<HTMLCanvasElement>{
 const key=`${id}-${costume}-${kind}`;if(cache.has(key))return cache.get(key)!;
 const promise=(async()=>{
  const base=await load(`/assets/${kind==='action'?'':kind+'/'}${id}.png?v=combat-5-gait-3`),out=document.createElement('canvas');
  out.width=base.naturalWidth;out.height=base.naturalHeight;const ctx=out.getContext('2d')!;ctx.imageSmoothingEnabled=false;ctx.drawImage(base,0,0);
  if(costume==='classic')return out;
  anchors??=fetch('/assets/costume-anchors.json?v=combat-5').then(r=>{if(!r.ok)throw Error('Costume anchors unavailable');return r.json()});
  if(kind==='motion')motionAnchors??=fetch('/assets/motion/anchors.json?v=combat-5').then(r=>{if(!r.ok)throw Error('Motion costume anchors unavailable');return r.json()});
  const [accessory,poses]=await Promise.all([load('/assets/costume-accessories.png'),anchors]);
  const motion=kind==='motion'?await motionAnchors:undefined;
  const items=document.createElement('canvas');items.width=accessory.width;items.height=accessory.height;
  const ic=items.getContext('2d',{willReadFrequently:true})!;ic.drawImage(accessory,0,0);
  const index=['summer','halloween','winter','rulantica'].indexOf(costume),cw=items.width/4,ch=items.height/2;
  const rects={head:bounds(ic,index*cw,0,cw,costume==='summer'?170:ch),body:bounds(ic,index*cw,ch,cw,ch),glasses:bounds(ic,0,170,cw,86)};
  let frame=0;
  for(let y=0;y<out.height;y+=256)for(let x=0;x<out.width;x+=256){
   const anchor=kind==='motion'?motion?.[id]?.[frame++]:poses[id]?.[kind]?.[frame++];if(!anchor)throw Error(`Missing costume pose ${id}/${kind}/${frame-1}`);
   for(const {src,dest} of costumePlacements(id,costume,anchor,rects))ctx.drawImage(items,src.x,src.y,src.w,src.h,x+dest.x,y+dest.y,dest.w,dest.h);
  }
  return out;
 })();
 if(cache.size>=24)cache.delete(cache.keys().next().value!);cache.set(key,promise);promise.catch(()=>cache.delete(key));return promise;
}
