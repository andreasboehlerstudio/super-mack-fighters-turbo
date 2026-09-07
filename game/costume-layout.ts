import type {Costume} from './rules.ts';
export type Rect={x:number;y:number;w:number;h:number};
export type CostumeAnchor={head:Rect;neck:{x:number;y:number}};
export type CostumeItems={head:Rect;body:Rect;glasses:Rect};
export type Placement={src:Rect;dest:Rect};
/** Pose-specific attachments; the full sprite can also contain distant effects. */
export function costumePlacements(id:string,costume:Costume,a:CostumeAnchor,items:CostumeItems):Placement[]{
 if(costume==='classic')return [];
 const mascot=id==='ed'||id==='edda'||id==='snorri'||id==='wakala',h=a.head,n=a.neck,cx=h.x+h.w*.5,result:Placement[]=[];
 const add=(src:Rect,width:number,center:number,top:number)=>{const y=Math.max(1,Math.min(250,top)),fit=Math.min(width,253,(254-y)*src.w/src.h);const w=Math.max(1,Math.round(fit)),hh=Math.max(1,Math.round(fit*src.h/src.w));result.push({src,dest:{x:Math.round(Math.max(1,Math.min(255-w,center-w/2))),y:Math.round(y),w,h:hh}})};
 const hat=(src:Rect,width:number,bottom:number)=>{const fit=Math.min(width,(bottom-1)*src.w/src.h);add(src,Math.max(12,fit),cx,bottom-Math.max(12,fit)*src.h/src.w)};
 if(costume==='summer'){
  hat(items.head,h.w*(mascot?1.0:1.22),h.y+h.h*.30);
  add(items.glasses,h.w*(id==='snorri'?.58:mascot?.68:.94),cx+h.w*.08,h.y+h.h*(id==='snorri'?.61:.44));
 }else if(costume==='halloween')hat(items.head,h.w*(mascot?1.1:1.5),h.y+h.h*.28);
 else if(costume==='winter')hat(items.head,h.w*(mascot?1.0:1.2),h.y+h.h*.31);
 else add(items.head,h.w*(id==='snorri'?.55:mascot?.76:1.05),cx+h.w*.08,h.y+h.h*(id==='snorri'?.56:.28));
 const width=h.w*(costume==='rulantica'?(id==='snorri'?.43:mascot?.66:1.25):costume==='winter'?(mascot?.42:.68):costume==='summer'?(mascot?.48:.8):(mascot?.24:.34));
 const top=n.y-(costume==='winter'?width*.27:costume==='summer'?width*.18:costume==='rulantica'?width*.08:-h.h*.16);
 add(items.body,width,n.x+(costume==='halloween'?-h.w*.2:0),top);
 return result;
}
