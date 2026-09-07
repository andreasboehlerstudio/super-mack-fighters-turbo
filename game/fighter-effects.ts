import type Phaser from 'phaser';
import type {Actor,Projectile} from './combat.ts';
import type {FighterId} from './data.ts';
import {drawGuestSpecial,drawGuestProjectile} from './guest-effects';

/** Character themes are expressed through transient effects, never attached props. */
export function drawFighterSpecial(g:Phaser.GameObjects.Graphics,a:Actor,ground:number){
 drawGuestSpecial(g,a,ground);
 if(a.id==='scholz'){
  if((a.action==='special'||a.action==='ultra')&&a.age<36){
   const spread=Math.floor(a.age/3),alpha=Math.min(1,a.age/5,(36-a.age)/10);
   // A short golden avenue opens under his feet; it is an effect, not a hazard.
   g.fillStyle(0xf2ce79,.7*alpha);
   for(let tile=0;tile<spread;tile++){
    const tx=Math.round(a.x+a.face*(tile*12+8)),ty=Math.round(ground+3);
    g.fillRect(tx,ty,8,3);g.fillRect(tx,ty+7,8,3);
   }
  }
  return;
 }
 if(a.id!=='karsten')return;
 const x=Math.round(a.x+a.face*42),y=Math.round(ground+a.y-65);
 if(a.action==='special'&&a.age<18){
  const length=4+Math.floor(a.age/3);
  g.fillStyle(0xffe1a0,.85);g.fillRect(x-length,y-1,length*2,2);g.fillRect(x-1,y-length,2,length*2);
 }
 if(a.action==='ultra'&&a.age<58){
  // Short film-strip accents at the arena edges leave both fighters unobstructed.
  const alpha=Math.min(1,a.age/8,(58-a.age)/12);
  g.fillStyle(0x090e1c,.8*alpha);g.fillRect(0,0,960,12);g.fillRect(0,528,960,12);
  g.fillStyle(0xffe1a0,.6*alpha);
  for(let slot=0;slot<32;slot++){const fx=(slot*32+a.age*2)%992-16;g.fillRect(fx,3,12,5);g.fillRect(fx,532,12,5);}
 }
}

export function drawFighterProjectile(g:Phaser.GameObjects.Graphics,p:Projectile,id:FighterId,ground:number):boolean {
 if(drawGuestProjectile(g,p,id,ground))return true;
 if(id!=='karsten'&&id!=='edda'&&id!=='scholz')return false;
 const x=Math.round(p.x),y=Math.round(ground+p.y),r=Math.round(p.radius),direction=Math.sign(p.vx);
 if(id==='karsten'){
  // Stepped aperture-light pulse with horizontal streaks, no physical lens or camera.
  for(let trail=3;trail>0;trail--){g.fillStyle(0xffcc74,.12*(4-trail));g.fillRect(x-direction*(r+trail*10)-8,y-2,16,4);}
  g.fillStyle(0xffcb75,1);g.fillRect(x-r,y-Math.round(r*.45),r*2,Math.round(r*.9));g.fillRect(x-Math.round(r*.45),y-r,Math.round(r*.9),r*2);
  g.fillStyle(0xfff7db,1);g.fillRect(x-7,y-7,14,14);g.fillRect(x-11,y-2,22,4);g.fillRect(x-2,y-11,4,22);
 }else if(id==='scholz'){
  // A stepped crest keeps the low wave and the charged pulse on the pixel grid.
  g.fillStyle(0xb8833e,1);g.fillRect(x-r,y-8,r*2,16);
  g.fillStyle(0xf2ce79,1);g.fillRect(x-r+4,y-12,r*2-8,24);
  g.fillRect(x-8,y-r,16,r*2);
  g.fillStyle(0xfff3c1,1);g.fillRect(x-4,y-r+4,8,r*2-8);
  for(let trail=1;trail<=3;trail++){
   g.fillStyle(0xf2ce79,1-trail*.23);
   g.fillRect(x-direction*(r+trail*10)-4,y+8-trail*2,7,4);
  }
 }else{
  // Pink star composed on the same pixel grid as the rest of the combat effects.
  g.fillStyle(0xff83c3,1);g.fillRect(x-r,y-4,r*2,8);g.fillRect(x-4,y-r,8,r*2);
  g.fillRect(x-9,y-9,18,18);g.fillStyle(0xffefaf,1);g.fillRect(x-4,y-4,8,8);
  for(let trail=1;trail<=3;trail++){g.fillStyle(0xffb7dd,1-trail*.22);g.fillRect(x-direction*(r+trail*9),y+(trail%2?8:-9),4,4);}
 }
 return true;
}
