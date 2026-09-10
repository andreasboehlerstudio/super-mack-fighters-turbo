import type Phaser from 'phaser';
import {activeMove,type Actor,type Projectile} from './combat.ts';

type FlameRect={x:number;y:number;w:number;h:number;color:number};
const palette=[0xb9311d,0xf56620,0xffc344,0xfff4b5];
/** Native pixel clusters: hard edges, stepped tongues, no blurred circular glow. */
export function flameRects(frame:number,height=64):FlameRect[]{
 const rectangles:FlameRect[]=[];
 for(let tongue=0;tongue<5;tongue++){
  const center=(tongue-2)*height*.12;
  const length=height*(.53+.33*Math.sin(tongue*2.4+frame*.8)**2);
  for(let layer=0;layer<4;layer++){
   const tall=length*(1-layer*.17),base=height*(.14-layer*.026);
   for(let y=0;y<tall;y+=2){
    const t=y/tall,curve=Math.sin(t*4+frame*.8+tongue)*height*.09*t;
    const half=Math.max(1,Math.round(base*(1-t)**.8));
    rectangles.push({x:Math.round(center+curve)-half,y:-y,w:half*2,h:2,color:palette[layer]});
   }
  }
 }
 for(let spark=0;spark<5;spark++){
  const travel=(frame*7+spark*13)%height;
  rectangles.push({x:Math.round(Math.sin(spark*2.4)*height*.45),y:-height/2-travel,w:2,h:3,color:0xffd46a});
 }
 return rectangles;
}
const cached=new Map<number,FlameRect[][]>();
function flame(g:Phaser.GameObjects.Graphics,x:number,y:number,tick:number,height:number,horizontal=0){
 let frames=cached.get(height);if(!frames){frames=Array.from({length:8},(_,i)=>flameRects(i,height));cached.set(height,frames);}
 for(const r of frames[Math.floor(tick/2)%8]){
  g.fillStyle(r.color,1);
  if(horizontal)g.fillRect(Math.round(x+horizontal*r.y),Math.round(y+r.x),r.h,r.w);
  else g.fillRect(Math.round(x+r.x),Math.round(y+r.y),r.w,r.h);
 }
}
export function drawSpecialFire(g:Phaser.GameObjects.Graphics,a:Actor,ground:number){
 if(a.transformTicks>0||!['special','ultra'].includes(a.action))return;
 const ultra=a.action==='ultra',start=ultra?28:activeMove(a).startup;
 if(a.age<Math.max(0,start-12)||a.age>start+(ultra?30:18))return;
 const bodyHeight=a.hulk?175:90,x=a.x+a.face*(a.hulk?72:46),y=ground+a.y-bodyHeight;
 flame(g,x,y+22,a.age,ultra?88:60);
 const kind=ultra?'burst':activeMove(a).kind;
 if(kind==='burst'){
  flame(g,a.x-65,ground+a.y,a.age+4,ultra?112:80);
  flame(g,a.x+65,ground+a.y,a.age+9,ultra?112:80);
 }else if(kind==='dash'&&a.age>=start)flame(g,a.x-a.face*34,y+20,a.age,88,a.face);
}
/** Flames travel with the projectile; each character's emblem can be drawn on top. */
export function drawProjectileFire(g:Phaser.GameObjects.Graphics,p:Projectile,ground:number){
 const direction=Math.sign(p.vx)||1;
 flame(g,p.x,ground+p.y,p.age,p.ultra?88:64,direction);
 // Rounded, stepped leading edge joins the tongues without a flat rectangular cut.
 const radius=p.ultra?34:25;
 for(let layer=0;layer<4;layer++){
  const r=radius*(1-layer*.2);g.fillStyle(palette[layer],1);
  for(let y=-Math.floor(r);y<=r;y+=2){
   const reach=Math.max(1,Math.round(Math.sqrt(Math.max(0,r*r-y*y))*.7));
   g.fillRect(Math.round(p.x)+(direction>0?-3:-reach),Math.round(ground+p.y+y),reach+3,2);
  }
 }
}
