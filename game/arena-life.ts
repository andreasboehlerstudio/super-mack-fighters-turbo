import Phaser from 'phaser';
import {COASTERS} from './coasters';
import {arenaLifeProfile,ridePose} from './arena-life-profiles';
type Mood='sun'|'water'|'mist'|'night'|'sparks';
type Life={mood:Mood;water?:[number,number,number,number];crowd:number[];color:number};
const moods:Mood[]=['water','sun','mist','night','water','night','water','sun','mist','night','night','sparks','sun','night','night','water','water','night','night','water','sun'];
// Water regions use normalized coordinates of the arena artwork, away from the fight plane.
const water:Record<string,[number,number,number,number]>={
 'park-0':[.28,.61,.41,.05],'park-4':[.30,.55,.43,.10],'park-3':[.25,.64,.50,.04],
 'park-9':[.02,.62,.44,.07],'park-12':[.25,.60,.48,.07],'park-13':[.05,.64,.90,.03],
 'park-16':[.18,.56,.67,.13],
 'coaster-atlantica':[.23,.55,.52,.13],'coaster-poseidon':[.20,.57,.60,.12],
 'stage-svalgurok':[.01,.65,.98,.03],'stage-batavia':[.01,.59,.36,.035]
};
function profile(id:string):Life{const area=COASTERS.find(c=>c.id===id)?.area??id;const index=Number(area.split('-')[1]);let mood=moods[index]??'night';
 if(/blue-fire|voltron/.test(id))mood='sparks';
 if(/wodan/.test(id))mood='mist';
 if(id==='stage-svalgurok'||id==='stage-skyport')mood='sun';
 if(id==='stage-traumatica')mood='mist';
 return {mood,water:water[id],crowd:[.105,.165,.815,.885],color:mood==='sun'?0xffe2a0:mood==='sparks'?0x87ecff:0x89cde3};
}
/** Cosmetic scenery only. No collision bodies or changes to combat state. */
export class ArenaLife {
 private people:Phaser.GameObjects.Sprite[]=[];
 private shadows:Phaser.GameObjects.Ellipse[]=[];
 private ink:Phaser.GameObjects.Graphics;
 private style:Life;
 private celebrateUntil=0;
 private environment;
 private ride:Phaser.GameObjects.Sprite|null=null;
 private reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 constructor(private scene:Phaser.Scene,private id:string){
  this.style=profile(id);this.environment=arenaLifeProfile(id);this.ink=scene.add.graphics();
  if(this.environment.ride&&scene.textures.exists('arena-props'))this.ride=scene.add.sprite(0,0,'arena-props',this.environment.ride.frame).setOrigin(.5,119/128).setVisible(false);
  if(scene.textures.exists('arena-crowd')){
   scene.textures.get('arena-crowd').setFilter(Phaser.Textures.FilterMode.NEAREST);
   this.people=this.environment.crowd.map((x,i)=>{
    this.shadows.push(scene.add.ellipse(x*960,402,45,9,0x142039,.26));
    return scene.add.sprite(x*960,this.environment.feet,'arena-crowd',i*4).setOrigin(.5,154/160).setFlipX(i===1).setTint(this.environment.night?0xc8d7ed:0xffffff);
   });
  }
 }
 cheer(tick:number){this.celebrateUntil=tick+100}
 draw(tick:number,pan:number){
  const time=this.reduced?0:tick/60,active=tick<this.celebrateUntil;
  this.people.forEach((person,i)=>{const phase=Math.floor(time*(active?6:2.5)+i*.8)%4;person.setFrame(i*4+(this.reduced?0:active?[0,1,2,3][phase]:[0,1,0,3][phase]));person.x=Math.round(this.environment.crowd[i]*960-pan);this.shadows[i].x=person.x;});
  if(this.ride&&this.environment.ride){const p=this.reduced?null:ridePose(this.environment.ride,tick);this.ride.setVisible(!!p);if(p)this.ride.setPosition(Math.round(p.x-pan),Math.round(p.y)).setFlipX(p.flip).setRotation(p.angle+(p.flip?Math.PI:0)).setAlpha(p.alpha);}
  this.ink.clear();if(this.reduced)return;
  const {mood,color,water}=this.style;
  const t=time,g=this.ink;
  const event=this.environment.event;
  if(event==='fountain')for(const [index,source]of this.environment.sources.entries()){
   const x=source[0]*980-10-pan,y=source[1]*552-6;
   for(let j=0;j<13;j++){const age=(t*1.3+j/13)%1,height=12+5*Math.sin(t*.35+index),spread=(j%3-1)*5;g.fillStyle(0xc7f4ff,(1-age)*.48);g.fillRect(Math.round(x+spread*age),Math.round(y-4*height*age*(1-age)),2,2);}
  }
  if(event==='steam')for(const [index,source]of this.environment.sources.entries())for(let j=0;j<9;j++){const age=(t*.20+j/9)%1;g.fillStyle(0xc4d4e4,(1-age)*.10);g.fillRect(Math.round(source[0]*980-10-pan+Math.sin(age*3+index)*12),Math.round(source[1]*552-6-age*48),5+Math.floor(age*13),3);}
  if(event==='leaves')for(let j=0;j<7;j++){const age=(t*.035+j*.17)%1;g.fillStyle(j%2?0xc99a4c:0x8f963d,.7);g.fillRect(Math.round((j*167+t*12)%1030-30-pan),Math.round(90+age*270),3,1+(j+Math.floor(t*4))%3);}
  if(event==='fireflies')for(let j=0;j<14;j++){g.fillStyle(j%2?0xa6f6c2:0xffdf91,.15+.5*Math.sin(t*1.5+j)**4);g.fillRect(Math.round(70+(j*67)%830+Math.sin(t*.4+j)*8-pan),Math.round(220+(j*31)%130+Math.cos(t*.5+j)*5),2,2);}
  if(event==='electric'&&tick%420<18){const phase=tick%18;g.lineStyle(1,0xb3e8ff,.48);g.beginPath();g.moveTo(173-pan,75);for(let j=1;j<7;j++)g.lineTo(173-pan+((j*17+phase*7)%15)-7,75+j*4);g.strokePath();}
  if(event==='lamps')for(let j=0;j<10;j++){g.fillStyle(0xffd396,.1+.18*Math.sin(t*.6+j)**2);g.fillRect(Math.round(70+j*89-pan),285+j%3*13,2,2);}
  if(this.id==='stage-svalgurok'){for(let j=0;j<24;j++){const age=(t*.7+j*.13)%1,x=330-age*65+Math.sin(j*2.3)*3,y=145+age*age*80;g.fillStyle(0xa5efff,(1-age)*.45);g.fillRect(x|0,y|0,2,4)}}
  if(this.id==='stage-traumatica'){const flash=(tick%720)<9;g.fillStyle(0xc6e5ff,flash?.11:0);g.fillRect(0,0,960,380);for(let j=0;j<9;j++){g.fillStyle(0xc9ccdc,.045);g.fillRect(((t*9+j*140)%1130-100)|0,300+j%3*18,120,5)}}
  if(this.id==='stage-batavia'){const x=80+Math.sin(t*.1)*55-pan,y=320+Math.sin(t)*2;g.fillStyle(0x4b302b,1);g.fillRect(x|0,y|0,42,5);g.fillRect((x+5)|0,(y+5)|0,32,4);g.fillStyle(0xdbb976,1);g.fillRect((x+19)|0,(y-19)|0,2,20);g.fillStyle(0xe0cbae,.8);g.fillRect((x+22)|0,(y-17)|0,13,10);g.fillStyle(0x9fdef3,.25);g.fillRect((x-9)|0,(y+11)|0,60,2)}
  if(this.id==='stage-blue-fire'){for(let j=0;j<6;j++){const a=t*.9+j*Math.PI/3;g.lineStyle(2,0x8ac2d9,.35);g.lineBetween(158,132,158+Math.cos(a)*8,132+Math.sin(a)*8)}g.fillStyle(t%3<1.5?0xffd283:0x69d5ee,.4);g.fillRect(90,315,3,3);g.fillRect(841,319,3,3)}
  if(this.id==='stage-hq'){for(const [j,x] of [154,218,278,634,733,789].entries()){g.fillStyle(0x6ff4c6,.45);g.fillRect(x,253,Math.floor((t*8+j*12)%27),2)}for(let j=0;j<3;j++){g.fillStyle(0xffd171,.4);g.fillRect(164+j*8,237+Math.round(Math.sin(t+j)*4),2,2)}}
  if(this.id==='stage-cosmic'){for(let j=0;j<20;j++){g.fillStyle(j%2?0xd8eaff:0xf0b4fa,.15+.15*Math.sin(t+j)**2);g.fillRect(50+j*47,80+(j*29)%205,2,2)}}
  if(water)for(let i=0;i<23;i++){const [x,y,w,h]=water,px=(x+w*((i*.137+time*.007)%1))*960-pan,py=(y+h*((i*.231)%1))*540;this.ink.fillStyle(0xe4fbff,.10+.1*Math.sin(time*2+i)**2);this.ink.fillRect(Math.round(px),Math.round(py),3+i%6*2,1);}
  if(mood==='mist'){
   for(let i=0;i<8;i++){const x=((i*151+time*7)%1110)-80-pan,y=328+i%3*16;this.ink.fillStyle(0xaec2d1,.032);this.ink.fillRect(Math.round(x),y,95+i%3*16,3);}
  }else for(let i=0;i<14;i++){const x=(i*83+time*(mood==='sparks'?15:5))%1030-35-pan,y=110+(i*37)%260+Math.sin(time*.7+i)*9;this.ink.fillStyle(color,mood==='sparks'?.22:.12);this.ink.fillRect(Math.round(x),Math.round(y),mood==='sparks'?2:3,mood==='sparks'?3:2);}
 }
}
