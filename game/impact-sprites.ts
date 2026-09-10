import Phaser from 'phaser';
import {impactFrame,impactPixels,IMPACT_SIZE,IMPACT_FRAMES,type ImpactKind} from './impact-art.ts';

/** Cached, transparent native-size sprites. Their lifetime follows simulation time. */
export class ImpactSprites{
 private pool:{sprite:Phaser.GameObjects.Sprite;born:number;active:boolean}[]=[];
 constructor(scene:Phaser.Scene){
  for(const kind of ['light','heavy','special','block'] as const){
   const key='contact-'+kind;if(scene.textures.exists(key))continue;
   const canvas=document.createElement('canvas');canvas.width=IMPACT_SIZE*IMPACT_FRAMES;canvas.height=IMPACT_SIZE;
   const ctx=canvas.getContext('2d')!;ctx.imageSmoothingEnabled=false;
   for(let f=0;f<IMPACT_FRAMES;f++){const image=ctx.createImageData(IMPACT_SIZE,IMPACT_SIZE);image.data.set(impactPixels(kind,f));ctx.putImageData(image,f*IMPACT_SIZE,0);}
   const texture=scene.textures.addCanvas(key,canvas)!;
   for(let f=0;f<IMPACT_FRAMES;f++)texture.add(f,0,f*IMPACT_SIZE,0,IMPACT_SIZE,IMPACT_SIZE);
   texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
  }
  this.pool=Array.from({length:12},()=>({sprite:scene.add.sprite(0,0,'contact-light',0).setDepth(24).setVisible(false),born:0,active:false}));
 }
 emit(x:number,y:number,tick:number,kind:ImpactKind,direction:number,reduced=false){
  const item=this.pool.find(p=>!p.active)??this.pool.reduce((a,b)=>a.born<b.born?a:b);
  item.born=tick;item.active=true;
  item.sprite.setTexture('contact-'+kind,0).setPosition(Math.round(x),Math.round(y)).setFlipX(direction<0).setAlpha(reduced?.65:1).setVisible(true);
 }
 draw(tick:number){for(const item of this.pool){if(!item.active)continue;const frame=impactFrame(tick-item.born);if(frame===null){item.active=false;item.sprite.setVisible(false)}else item.sprite.setFrame(frame);}}
 clear(){for(const item of this.pool){item.active=false;item.sprite.setVisible(false)}}
}
