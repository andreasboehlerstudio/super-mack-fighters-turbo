import Phaser from 'phaser';
import {fighter,type FighterId,station} from './data.ts';
import {createMatch,step,aiInput,createBrain,TICK,FLOOR,type Match,type Input} from './combat.ts';
import {Controls} from './input.ts';
import {ArcadeAudio} from './audio.ts';
import {ARENA_ART} from './arena-art.ts';
import {ArenaLife} from './arena-life.ts';
import {advanceWalkPhase,walkFrame} from './walk-animation.ts';
export interface BattleConfig {p1:FighterId;p2:FighterId;stationId:string;cpu:boolean;difficulty:number;}
export interface BattleHandle {pause:(p:boolean)=>void;touch:(key:keyof Input,value:boolean)=>void;destroy:()=>void;}
export function mountBattle(parent:HTMLElement,config:BattleConfig,audio:ArcadeAudio,onState:(m:Match)=>void,onComplete:(winner:number)=>void,onPause:()=>void):BattleHandle {
 let paused=false,match=createMatch(config.p1,config.p2),accumulator=0,ended=false;const controls=new Controls(()=>{if(!paused){paused=true;audio.pause(true);onPause();}}),brain=createBrain();
 class Arena extends Phaser.Scene {
  sprites:Phaser.GameObjects.Sprite[]=[];shadows:Phaser.GameObjects.Ellipse[]=[];fx!:Phaser.GameObjects.Graphics;back!:Phaser.GameObjects.Image;floor!:Phaser.GameObjects.Image;life!:ArenaLife;banner!:Phaser.GameObjects.Text;arena=station(config.stationId).arena;
  walkPhases=[0,0];lastX=match.actors.map(a=>a.x);
  preload(){this.load.spritesheet('arena-crowd','/assets/arena-crowd.png',{frameWidth:256,frameHeight:256});this.load.image('arena',ARENA_ART[config.stationId]?.url??`/assets/arena-${this.arena}.png`);for(const id of new Set([config.p1,config.p2])){if(!this.textures.exists(id))this.load.spritesheet(id,`/assets/${id}.png`,{frameWidth:256,frameHeight:256});this.load.spritesheet(id+'-walk',`/assets/walk/${id}.png`,{frameWidth:256,frameHeight:256});}}
  create(){this.back=this.add.image(480,270,'arena');const source=this.textures.get('arena').getSourceImage() as HTMLImageElement;const photo=!!ARENA_ART[config.stationId];if(photo){this.textures.get('arena').setFilter(Phaser.Textures.FilterMode.NEAREST);const scale=Math.max(980/source.width,552/source.height);this.back.setDisplaySize(source.width*scale,source.height*scale);this.add.rectangle(480,508,960,65,0x162337,.07);}else{this.back.setDisplaySize(1060,600);this.textures.get('arena').add('ground',0,0,Math.floor(source.height*.79),source.width,Math.floor(source.height*.21));this.floor=this.add.image(480,483,'arena','ground').setDisplaySize(1120,125);}this.life=new ArenaLife(this,config.stationId);this.shadows=match.actors.map(a=>this.add.ellipse(a.x,FLOOR+3,112,20,0x151728,.35));
   this.sprites=match.actors.map(a=>this.add.sprite(a.x,FLOOR+a.y,a.id,0).setOrigin(.5,1).setDisplaySize(274,274));this.fx=this.add.graphics();this.banner=this.add.text(480,190,'',{fontFamily:'Pixelify Sans',fontSize:'42px',fontStyle:'bold',color:'#fff2ca',stroke:'#151528',strokeThickness:9,align:'center'}).setOrigin(.5).setDepth(30);audio.setMode(config.p2==='graumacher'?'boss':'fight');audio.sound('select');onState(match);
  }
  update(_time:number,delta:number){if(paused)return;accumulator+=Math.min(delta/1000,.1);while(accumulator>=TICK){accumulator-=TICK;const p1=controls.read(0),p2=config.cpu?aiInput(match,1,config.difficulty,brain):controls.read(1);step(match,[p1,p2]);for(const event of match.events){audio.sound(event.type);if(event.type==='hit'||event.type==='ko'||event.type==='win')this.life.cheer(match.tick);if(event.type==='hit'){this.cameras.main.shake(85,.003);this.burst(event.x??480,event.y??340,0xffdd65);}if(event.type==='block')this.burst(event.x??480,event.y??340,0x7eedff);if(event.type==='special'&&event.label)this.callout(event.label,event.player??0);}
    if(match.tick%4===0||match.phase==='complete')onState(match);
    if(match.phase==='complete'&&!ended){ended=true;onComplete(match.winner??0);}
   }
   const center=(match.actors[0].x+match.actors[1].x)/2-480;this.back.x=480-center*.055;if(this.floor)this.floor.x=480-center*.14;this.fx.clear();this.life.draw(match.tick,center*.055);
   match.actors.forEach((a,i)=>{const s=this.sprites[i],age=a.age;let frame=0;if(a.action==='idle')frame=Math.floor(age/16)%2;if(a.action==='walk')frame=2+Math.floor(age/8)%2;if(a.action==='jump')frame=4;if(a.action==='crouch')frame=5;if(a.action==='punch')frame=age<8?6:7;if(a.action==='kick')frame=age<14?8:9;if(a.action==='block')frame=10;if(a.action==='hit')frame=11;if(a.action==='special')frame=age<(a.id==='graumacher'?44:18)?12:13;if(a.action==='defeat')frame=14;if(a.action==='victory')frame=15;
    const dx=a.x-this.lastX[i];this.lastX[i]=a.x;const isWalking=a.action==='walk'&&this.textures.exists(a.id+'-walk');
    if(isWalking){this.walkPhases[i]=advanceWalkPhase(this.walkPhases[i],Math.abs(dx),160,dx*a.face<0?-1:1);frame=walkFrame(this.walkPhases[i]);}else this.walkPhases[i]=0;
    const breath=a.action==='idle'?Math.sin(age*.095)*.009:0;
    s.setTexture(isWalking?a.id+'-walk':a.id,frame).setPosition(Math.round(a.x),Math.round(FLOOR+a.y)).setFlipX(a.face<0).setDisplaySize(274*(1-breath*.4),274*(1+breath));s.alpha=a.action==='hit'&&Math.floor(match.tick/3)%2===0?.55:1;this.shadows[i].setPosition(a.x,FLOOR+5).setScale(1+a.y/500).setAlpha(.35+a.y/700);
    if(a.action==='special'&&fighter(a.id).kind==='dash'&&age>18&&age<34&&match.tick%4===0){const echo=this.add.sprite(s.x-a.face*14,s.y,a.id,frame).setOrigin(.5,1).setDisplaySize(274,274).setFlipX(a.face<0).setTint(Phaser.Display.Color.HexStringToColor(fighter(a.id).color).color).setAlpha(.35).setDepth(1);this.tweens.add({targets:echo,alpha:0,duration:180,onComplete:()=>echo.destroy()});}
    if(a.specialCd===0&&a.action==='idle'&&match.tick%12<6){this.fx.lineStyle(2,Phaser.Display.Color.HexStringToColor(fighter(a.id).color).color,.5);this.fx.strokeEllipse(a.x,FLOOR+3,120,22);}
    if(a.action==='special'){const col=Phaser.Display.Color.HexStringToColor(fighter(a.id).color).color;this.fx.lineStyle(4,col,.7);if(fighter(a.id).kind==='burst'&&age>=18&&age<35)this.fx.strokeCircle(a.x,FLOOR+a.y-65,80+(age-18)*4);else if(age<18||a.id==='graumacher'&&age<44){this.fx.strokeCircle(a.x+a.face*42,FLOOR+a.y-65,10+age%16);if(a.id==='graumacher'){this.fx.fillStyle(0xcdd3e2,.12+.1*Math.sin(age));this.fx.fillRect(0,FLOOR-14,960,20);}}}
   });
   for(const p of match.projectiles){const c=Phaser.Display.Color.HexStringToColor(p.color).color;for(let glow=3;glow>0;glow--){this.fx.fillStyle(c,.065*glow);this.fx.fillCircle(p.x-p.vx*.025*glow,FLOOR+p.y,p.radius*(1+glow*.38));}this.fx.fillStyle(c,1);this.fx.fillRoundedRect(p.x-p.radius,FLOOR+p.y-p.radius,p.radius*2,p.radius*2,5);this.fx.fillStyle(0xffffff,.95);this.fx.fillRect(p.x-4,FLOOR+p.y-7,8,14);this.fx.lineStyle(2,0xffffff,.8);this.fx.strokeCircle(p.x,FLOOR+p.y,p.radius*.8);}
   if(match.phase==='intro'){const text=config.p2==='graumacher'&&match.round===1&&match.phaseTicks>85?'DER GRAUMACHER\n„Alles steht still!“':match.phaseTicks>36?`RUNDE ${match.round}`:'FIGHT!';this.banner.setText(text).setFontSize(text.length>25?29:45);}
   else if(match.phase==='roundover')this.banner.setText(match.roundWinner===null?'UNENTSCHIEDEN':match.phaseTicks<78?fighter(match.actors[match.roundWinner].id).short.toUpperCase()+' GEWINNT':match.actors[1-match.roundWinner].hp<=0?'K.O.!':'ZEIT ABGELAUFEN').setFontSize(match.phaseTicks<78?40:56);
   else if(match.phase==='fight'&&match.time>65*60-24)this.banner.setText('FIGHT!').setFontSize(54);
   else this.banner.setText('');
  }
  burst(x:number,y:number,color:number){for(let j=0;j<12;j++){const angle=j*Math.PI/6,rect=this.add.rectangle(x,y,6+j%3*2,4,color).setDepth(25);this.tweens.add({targets:rect,x:x+Math.cos(angle)*(35+j%4*12),y:y+Math.sin(angle)*45,alpha:0,duration:220,onComplete:()=>rect.destroy()});}}
  callout(label:string,index:number){const text=this.add.text(index?725:235,245,label.toUpperCase(),{fontFamily:'Pixelify Sans',fontSize:'19px',fontStyle:'bold',color:fighter(match.actors[index].id).color,stroke:'#121329',strokeThickness:6}).setOrigin(.5).setDepth(25);this.tweens.add({targets:text,y:220,alpha:0,delay:550,duration:250,onComplete:()=>text.destroy()});}
 }
 // The surrounding console scales once as a whole. Phaser must not measure that transformed
 // parent and scale again, otherwise high-resolution/fullscreen windows double the arena size.
 const game=new Phaser.Game({type:Phaser.AUTO,parent,width:960,height:540,backgroundColor:'#12172f',pixelArt:true,roundPixels:true,antialias:false,scene:Arena,audio:{noAudio:true},input:{keyboard:true,gamepad:true},scale:{mode:Phaser.Scale.NONE,autoCenter:Phaser.Scale.NO_CENTER},banner:false});
 return {pause:(p)=>{paused=p;accumulator=0;controls.clear();audio.pause(p);},touch:(key,value)=>controls.touch[key]=value,destroy:()=>{controls.destroy();game.destroy(true);}};
}
