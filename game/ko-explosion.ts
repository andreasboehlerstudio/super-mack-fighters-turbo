import Phaser from 'phaser';
import type {Match} from './combat.ts';
import {koAge,koPose} from './ko-presentation.ts';

type Point=[number,number];
/** Scanline rasterization: every flame edge lands on the same native grid as the arena. */
function polygon(ctx:CanvasRenderingContext2D,points:Point[],color:string){
 ctx.fillStyle=color;
 const low=Math.floor(Math.min(...points.map(p=>p[1]))),high=Math.ceil(Math.max(...points.map(p=>p[1])));
 for(let y=low;y<high;y++){
  const xs:number[]=[];
  for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}
  xs.sort((a,b)=>a-b);for(let i=0;i+1<xs.length;i+=2)ctx.fillRect(Math.round(xs[i]),y,Math.max(1,Math.round(xs[i+1])-Math.round(xs[i])),1);
 }
}

/** One transparent native-resolution texture, reused only during the round finish. */
export class KoExplosion{
 private texture:Phaser.Textures.CanvasTexture;
 private sprite:Phaser.GameObjects.Image;
 private title:CanvasImageSource;
 private lastFrame='';
 constructor(scene:Phaser.Scene){
  this.texture=scene.textures.createCanvas('ko-animation',960,350)!;
  this.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
  this.sprite=scene.add.image(480,175,'ko-animation').setDepth(29).setVisible(false);
  this.title=scene.textures.get('ko-title').getSourceImage() as HTMLImageElement;
 }
 draw(match:Match,reduced=false){
  const age=koAge(match);
  if(age===null){this.sprite.setVisible(false);this.lastFrame='';return;}
  this.sprite.setVisible(true);
  const frame=Math.floor(age/2),key=frame+':'+reduced;
  if(key===this.lastFrame)return;this.lastFrame=key;
  const ctx=this.texture.context,pose=koPose(age,reduced),cx=480,cy=188;
  ctx.clearRect(0,0,960,350);ctx.imageSmoothingEnabled=false;
  // Warm layered tongues expand radially, then break into floating embers.
  const growth=reduced?1:Math.min(1,.45+age/9),flicker=reduced?0:frame;
  ctx.globalAlpha=reduced?.35:pose.fire;
  for(let layer=0;layer<4;layer++){
   const points:Point[]=[],size=(1-layer*.085)*growth;
   for(let i=0;i<72;i++){
    const a=i*Math.PI*2/72,spike=i%2===0?1:.58;
    const radius=spike*(.88+.12*Math.sin(Math.floor(i/2)*19+flicker*.4));
    points.push([cx+Math.cos(a)*338*size*radius,cy+Math.sin(a)*138*size*radius]);
   }
   polygon(ctx,points,['#c9320b','#ff7410','#ffd43a','#fff1a4'][layer]);
  }
  for(let layer=0;layer<4;layer++)for(let i=0;i<36;i++){
   const a=i*Math.PI*2/36+.035*Math.sin(i*7),dx=Math.cos(a),dy=Math.sin(a);
   const length=(1-layer*.14)*growth*(.80+.2*Math.sin(i*19+flicker*.6));
   const tip:Point=[cx+dx*352*length,cy+dy*130*length];
   const side=.026+(i%3)*.009,root=.23;
   polygon(ctx,[[cx+Math.cos(a-side)*270*root,cy+Math.sin(a-side)*90*root],
    [cx+Math.cos(a-side)*265*length,cy+Math.sin(a-side)*100*length],tip,
    [cx+Math.cos(a+side)*235*length,cy+Math.sin(a+side)*95*length],
    [cx+Math.cos(a+side)*270*root,cy+Math.sin(a+side)*90*root]],
    ['#c9320b','#f66b0b','#ffc52d','#fff2a3'][layer]);
  }
  if(!reduced)for(let i=0;i<42;i++){
   const a=i*2.39996,travel=age*(1+i%3*.18),radius=150+i%7*19;
   const x=Math.round(cx+Math.cos(a)*(radius+travel)),y=Math.round(cy+Math.sin(a)*(radius*.38+travel*.34)-age*.27);
   const size=Math.max(1,5-i%3-Math.floor(age/22));
   ctx.globalAlpha=Math.max(0,(1-age/72))*(i%3===frame%3?.6:1);
   ctx.fillStyle=i%3?'#ffb923':'#fff3b6';ctx.fillRect(x,y,size,size);
   if(i%4===0){ctx.fillStyle='#ee5b13';ctx.fillRect(x-2,y+size,size,2);}
  }
  // Re-sample the source into whole destination pixels; never CSS-scale a second overlay.
  ctx.globalAlpha=pose.alpha;
  const w=Math.round(448*pose.scale),h=Math.round(149*pose.scale);
  ctx.drawImage(this.title,Math.round(cx-w/2),Math.round(cy-h/2)+pose.y,w,h);
  ctx.globalAlpha=1;this.texture.refresh();
 }
}
