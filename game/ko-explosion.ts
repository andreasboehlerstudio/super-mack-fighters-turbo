import Phaser from 'phaser';
import type {Match} from './combat.ts';
import {koAge,koPose,koFireFrame} from './ko-presentation.ts';

/** Authored pixel sprites at native size; no vector rays or interpolated flame geometry. */
export class KoExplosion{
 private texture:Phaser.Textures.CanvasTexture;
 private sprite:Phaser.GameObjects.Image;
 private title:HTMLImageElement;
 private fire:HTMLImageElement;
 private lastFrame='';
 constructor(scene:Phaser.Scene){
  this.texture=scene.textures.createCanvas('ko-animation',960,350)!;
  this.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
  this.sprite=scene.add.image(480,175,'ko-animation').setDepth(29).setVisible(false);
  this.title=scene.textures.get('ko-title').getSourceImage() as HTMLImageElement;
  this.fire=scene.textures.get('ko-fire').getSourceImage() as HTMLImageElement;
 }
 draw(match:Match,reduced=false){
  const age=koAge(match);
  if(age===null){this.sprite.setVisible(false);this.lastFrame='';return;}
  this.sprite.setVisible(true);
  const frame=Math.floor(age/2),key=frame+':'+reduced;
  if(key===this.lastFrame)return;this.lastFrame=key;
  const ctx=this.texture.context,pose=koPose(age,reduced),cx=480,cy=188;
  ctx.clearRect(0,0,960,350);ctx.imageSmoothingEnabled=false;
  const f=reduced?4:koFireFrame(age),fw=this.fire.naturalWidth/3,fh=this.fire.naturalHeight/3;
  if(f!==null){ctx.globalAlpha=reduced?.4:1;ctx.drawImage(this.fire,f%3*fw,Math.floor(f/3)*fh,fw,fh,Math.round(cx-fw/2),Math.round(cy-fh/2),fw,fh);}
  ctx.globalAlpha=pose.alpha;
  const w=Math.round(448*pose.scale),h=Math.round(149*pose.scale);
  ctx.drawImage(this.title,Math.round(cx-w/2),Math.round(cy-h/2)+pose.y,w,h);
  ctx.globalAlpha=1;this.texture.refresh();
 }
}
