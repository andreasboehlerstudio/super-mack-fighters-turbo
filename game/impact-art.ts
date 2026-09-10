/** Original arcade hit sparks, authored directly on the combat pixel grid. */
export const IMPACT_SIZE=192, IMPACT_FRAMES=10, IMPACT_FRAME_TICKS=2;
export type ImpactKind='light'|'heavy'|'special'|'block';
export function impactFrame(age:number){return age<0||age>=IMPACT_FRAMES*IMPACT_FRAME_TICKS?null:Math.floor(age/IMPACT_FRAME_TICKS)}
export function impactPixels(kind:ImpactKind,frame:number){
 const size=IMPACT_SIZE,pixels=new Uint8ClampedArray(size*size*4);
 const f=Math.max(0,Math.min(IMPACT_FRAMES-1,frame)),t=f/(IMPACT_FRAMES-1);
 const palette=kind==='block'?[0x254c99,0x388eda,0x80dfff,0xe5ffff]:[0xa83021,0xf45a22,0xffb52e,0xfff2aa,0xffffff];
 const force=kind==='special'?1.2:kind==='heavy'?1.05:.86;
 const reach=(f===0?36:48+Math.sin(t*Math.PI)*15)*force;
 for(let y=2;y<size-2;y++)for(let x=2;x<size-2;x++){
  const dx=x-size/2,dy=y-size/2,r=Math.hypot(dx,dy),a=Math.atan2(dy,dx);let shade=-1;
  if(kind==='block'){
   const ring=18+t*38,edge=Math.abs(r-ring);
   if(dx>-ring*.45&&edge<Math.max(1,5-t*4))shade=edge<2?3:1;
   if(f<2&&Math.abs(dx)+Math.abs(dy)<14-f*5)shade=3;
  }else{
   // Unequal tapered tongues rotate and curl as the central flash burns away.
   const lobes=Math.pow(Math.max(0,Math.cos(a*7+.3+t*2+Math.sin(a*3)*.7)),5);
   const flame=reach*(.31+.69*lobes)*(1-t*.55);
   const hollow=Math.max(0,(t-.3)*72)*force;
   if(r<flame&&r>hollow){
    const rim=flame-r;
    shade=r<12*(1-t)?4:rim<2?0:rim<6?1:rim<12?2:3;
   }
   // A small directional slash at the contact point, not an enclosing rectangle.
   if(f<3&&Math.abs(dy+dx*.23)<Math.max(1,4-f)&&Math.abs(dx)<(32-f*5)*force)shade=4;
  }
  for(let n=0;n<9;n++){
   const angle=n*2.399+.2,travel=(22+t*(42+n%3*8))*force;
   const sx=Math.round(Math.cos(angle)*travel),sy=Math.round(Math.sin(angle)*travel-t*t*14);
   const length=Math.max(1,6-f*.5),along=(dx-sx)*Math.cos(angle)+(dy-sy)*Math.sin(angle),across=-(dx-sx)*Math.sin(angle)+(dy-sy)*Math.cos(angle);
   if(f>0&&Math.abs(along)<length&&Math.abs(across)<(f<6?1.5:.6))shade=kind==='block'?2:f<5?3:1;
  }
  if(shade>=0){const c=palette[shade],o=(y*size+x)*4;pixels[o]=c>>16;pixels[o+1]=c>>8&255;pixels[o+2]=c&255;pixels[o+3]=255;}
 }
 return pixels;
}
