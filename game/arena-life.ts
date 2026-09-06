import Phaser from 'phaser';
import {COASTERS} from './coasters';
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
 private reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 constructor(private scene:Phaser.Scene,private id:string){
  this.style=profile(id);this.ink=scene.add.graphics();
  if(scene.textures.exists('arena-crowd')){
   scene.textures.get('arena-crowd').setFilter(Phaser.Textures.FilterMode.NEAREST);
   this.people=this.style.crowd.map((x,i)=>{
    this.shadows.push(scene.add.ellipse(x*960,409,22,5,0x142039,.26));
    return scene.add.sprite(x*960,410,'arena-crowd',i*4).setOrigin(.5,1).setDisplaySize(72,72).setFlipX(i>1).setTint(this.style.mood==='sun'?0xffffff:0xc8d7ed);
   });
  }
 }
 cheer(tick:number){this.celebrateUntil=tick+100}
 draw(tick:number,pan:number){
  const time=this.reduced?0:tick/60,active=tick<this.celebrateUntil;
  this.people.forEach((person,i)=>{const phase=Math.floor(time*(active?6:2.5)+i*.8)%4;person.setFrame(i*4+(this.reduced?0:active?[0,1,2,3][phase]:[0,1,0,3][phase]));person.x=this.style.crowd[i]*960-pan;this.shadows[i].x=person.x;});
  this.ink.clear();if(this.reduced)return;
  const {mood,color,water}=this.style;
  const t=time,g=this.ink;
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
