import type Phaser from 'phaser';
import type {Actor,Projectile} from './combat.ts';
import {fighter,type FighterId} from './data.ts';

const guests=new Set<FighterId>(['bobo','mross','otto','ross','freudenreich','robbemond','olli','boeckli','louis','tesla']);
type Graphics=Phaser.GameObjects.Graphics;
const color=(id:FighterId)=>parseInt(fighter(id).color.slice(1),16);

/** Small solid pixel motifs. All coordinates land on the same combat raster. */
function motif(g:Graphics,id:FighterId,x:number,y:number,size:number,alpha=1){
 x=Math.round(x);y=Math.round(y);const u=Math.max(2,Math.round(size/8));
 g.fillStyle(color(id),alpha);
 if(id==='otto'){
  // A tiny comic elephant with round ears, four feet and an upturned trunk.
  g.fillRect(x-3*u,y-2*u,5*u,4*u);g.fillRect(x+u,y-3*u,3*u,4*u);
  g.fillRect(x+3*u,y,2*u,2*u);g.fillRect(x+4*u,y-u,u,3*u);
  g.fillRect(x-3*u,y+2*u,u,u);g.fillRect(x,y+2*u,u,u);
  g.fillStyle(0xffe1af,alpha);g.fillRect(x,y-2*u,2*u,3*u);
  g.fillStyle(0x182337,alpha);g.fillRect(x+2*u,y-2*u,u,u);
 }else if(id==='ross'){
  // Faceted stars also read as snowflakes during the Christmas wave.
  g.fillRect(x-u,y-4*u,2*u,8*u);g.fillRect(x-4*u,y-u,8*u,2*u);
  for(const s of [-1,1])for(const t of [-1,1])g.fillRect(x+s*2*u,y+t*2*u,u,u);
  g.fillStyle(0xfff4d6,alpha);g.fillRect(x-u,y-u,2*u,2*u);
 }else if(id==='bobo'||id==='mross'){
  g.fillRect(x-u,y-4*u,u,5*u);g.fillRect(x-u,y-4*u,4*u,u);
  g.fillRect(x+2*u,y-4*u,u,4*u);g.fillRect(x-3*u,y,3*u,2*u);g.fillRect(x,y-u,3*u,2*u);
 }else if(id==='tesla'){
  for(let i=0;i<7;i++){const dx=[1,0,-1,0,1,0,-1][i];g.fillRect(x+dx*u,y+(i-3)*u,3*u,u);}
  g.fillStyle(0xf0f6ff,alpha);g.fillRect(x,y-u,2*u,u);
 }else if(id==='robbemond'){
  g.fillRect(x-2*u,y-3*u,4*u,6*u);g.fillRect(x-3*u,y-2*u,6*u,4*u);
  g.fillStyle(0xffe08a,alpha);g.fillRect(x-u,y-2*u,2*u,4*u);
 }else if(id==='louis'){
  g.fillStyle(0xfff1d6,alpha);for(let i=0;i<5;i++)g.fillRect(x+(i-2)*u,y-(i-2)*u,2*u,2*u);
  g.fillStyle(0x77b5eb,alpha);g.fillRect(x-u,y-u,2*u,u);
 }else if(id==='freudenreich'){
  // A dinosaur footprint: three toes and one heel.
  for(let i=0;i<3;i++)g.fillRect(x+(i-1)*3*u-u,y-3*u,2*u,3*u);
  g.fillRect(x-2*u,y,4*u,3*u);
 }else if(id==='boeckli'){
  for(let i=0;i<4;i++)g.fillRect(x-i*u,y+i*u,(i*2+1)*u,u);
  g.fillStyle(0xfff3d4,alpha);g.fillRect(x,y,u,u);
 }else{
  for(let i=0;i<3;i++)g.fillRect(x-4*u+i*u,y-3*u+i*2*u,(8-i*2)*u,u);
 }
}

export function drawGuestSpecial(g:Graphics,a:Actor,ground:number){
 if(!guests.has(a.id)||!['special','ultra'].includes(a.action))return;
 const ultra=a.action==='ultra',start=ultra?22:12,end=ultra?62:36;
 if(a.age<start||a.age>end)return;
 const progress=(a.age-start)/(end-start),alpha=Math.min(1,progress*5,(1-progress)*4);
 const x=Math.round(a.x),y=Math.round(ground+a.y);
 if(a.id==='olli'&&!ultra&&a.activeMove===0){
  // Brief spectral trunk for the special only; no permanent prop on the sprite.
  const length=Math.round(Math.sin(progress*Math.PI)*112);
  g.fillStyle(0x91b8e1,alpha*.8);g.fillRect(a.face>0?x:x-length,y-92,length,10);
  g.fillRect(x+a.face*length-5,y-92,10,24);g.fillRect(x+a.face*length-12,y-73,17,7);
  return;
 }
 const count=ultra?7:3;
 for(let i=0;i<count;i++){
  const spread=(i-(count-1)/2)*(ultra?40:24),rise=Math.round(progress*35);
  motif(g,a.id,x+a.face*(30+progress*50)+spread,y-50-rise-(i%2)*30,ultra?25:17,alpha);
 }
}

export function drawGuestProjectile(g:Graphics,p:Projectile,id:FighterId,ground:number){
 if(!guests.has(id))return false;
 const direction=Math.sign(p.vx),y=ground+p.y;
 for(let i=3;i>0;i--)motif(g,id,p.x-direction*i*15,y+(i%2?4:-4),p.radius*.55,.15*(4-i));
 motif(g,id,p.x,y,p.radius*1.2);
 return true;
}
