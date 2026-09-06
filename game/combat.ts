import {fighter,type FighterId} from './data.ts';
import {movesFor,ultraFor,type MoveDef} from './moves.ts';
import {stagePhysics} from './stages.ts';
export const TICK=1/60,FLOOR=445,LEFT=65,RIGHT=895;
export type Action='idle'|'walk'|'jump'|'crouch'|'punch'|'kick'|'block'|'hit'|'special'|'ultra'|'parry'|'tag'|'defeat'|'victory';
export type Input={left:boolean;right:boolean;down:boolean;jump:boolean;punch:boolean;kick:boolean;block:boolean;parry:boolean;ultra:boolean;tag:boolean};
export const neutral=():Input=>({left:false,right:false,down:false,jump:false,punch:false,kick:false,block:false,parry:false,ultra:false,tag:false});
export interface Token{key:'down'|'forward'|'punch'|'kick';tick:number}
export interface Actor{id:FighterId;x:number;y:number;vy:number;face:1|-1;hp:number;action:Action;age:number;lock:number;specialCd:number;attackHit:boolean;buffer:Token[];last:Input;wins:number;combo:number;lastHit:number;activeMove:number;chargeTicks:number;chargeGrace:number;chargeFace:number;parryTicks:number;parryCd:number;invuln:number}
export interface Projectile{id:number;owner:number;x:number;y:number;originY:number;vx:number;age:number;kind:string;damage:number;radius:number;color:string;ultra?:boolean}
export type CombatEvent={type:'punch'|'kick'|'jump'|'hit'|'block'|'special'|'round'|'win'|'ko'|'parry'|'ultra'|'tag';player?:number;x?:number;y?:number;label?:string};
export interface MatchOptions{parry?:boolean;turbo?:number;stageId?:string;partners?:[FighterId|null,FighterId|null]}
export interface Match{actors:[Actor,Actor];tick:number;phase:'intro'|'fight'|'roundover'|'complete';phaseTicks:number;round:number;time:number;winner:number|null;roundWinner:number|null;projectiles:Projectile[];events:CombatEvent[];hitstop:number;serial:number;seed:number;meter:[number,number];bench:[Actor|null,Actor|null];tagCd:[number,number];pendingTag:[number,number];teams:[FighterId[],FighterId[]];score:[number,number];rules:{parry:boolean;turbo:number;stageId:string}}
const actor=(id:FighterId,x:number,face:1|-1):Actor=>({id,x,y:0,vy:0,face,hp:100,action:'idle',age:0,lock:0,specialCd:0,attackHit:false,buffer:[],last:neutral(),wins:0,combo:0,lastHit:-999,activeMove:0,chargeTicks:0,chargeGrace:0,chargeFace:face,parryTicks:0,parryCd:0,invuln:0});
export function createMatch(a:FighterId,b:FighterId,seed=19,options:MatchOptions={}):Match{
 const partners=options.partners??[null,null];
 return {actors:[actor(a,270,1),actor(b,690,-1)],tick:0,phase:'intro',phaseTicks:150,round:1,time:65*60,winner:null,roundWinner:null,projectiles:[],events:[],hitstop:0,serial:0,seed,meter:[0,0],bench:[partners[0]?actor(partners[0],270,1):null,partners[1]?actor(partners[1],690,-1):null],tagCd:[0,0],pendingTag:[0,0],teams:[[a,...(partners[0]?[partners[0]]:[])],[b,...(partners[1]?[partners[1]]:[])]],score:[0,0],rules:{parry:options.parry??false,turbo:Math.min(1.4,Math.max(1,options.turbo??1.18)),stageId:options.stageId??'park-9'}};
}
export function pushToken(buffer:Token[],key:Token['key'],tick:number){return [...buffer.filter(t=>tick-t.tick<=60),{key,tick}].slice(-10)}
export function comboReady(buffer:Token[],tick:number,attack:'punch'|'kick'='punch'){let at=0;const seq=['down','forward',attack];for(const t of buffer){if(tick-t.tick<=60&&t.key===seq[at])at++;if(at===3)return true}return false}
const setAction=(a:Actor,action:Action,lock=0)=>{if(a.action!==action||lock){a.action=action;a.age=0}a.lock=lock;a.attackHit=false};
const meter=(m:Match,i:number,amount:number)=>m.meter[i]=Math.max(0,Math.min(100,m.meter[i]+amount));
export const teamHealth=(m:Match,i:number)=>m.actors[i].hp+(m.bench[i]?.hp??0);
export const activeMove=(a:Actor)=>movesFor(a.id)[a.activeMove]??movesFor(a.id)[0];
function damage(m:Match,attacker:number,defender:number,amount:number,x:number,y:number,guard=true,superHit=false){
 const a=m.actors[attacker],b=m.actors[defender];if(b.hp<=0||b.invuln>0)return;
 if(m.rules.parry&&b.parryTicks>0){b.parryTicks=0;b.invuln=4;b.lock=7;b.parryCd=22;meter(m,defender,14);m.hitstop=6;m.events.push({type:'parry',player:defender,x,y,label:'PARRY!'});if(Math.abs(a.x-b.x)<150)a.lock=Math.max(a.lock,14);return}
 const blocked=guard&&b.y===0&&b.action==='block',dealt=blocked?Math.max(1,Math.round(amount*.12)):amount;
 b.hp=Math.max(0,b.hp-dealt);setAction(b,blocked?'block':'hit',blocked?9:17);b.x=Math.max(LEFT,Math.min(RIGHT,b.x+a.face*(blocked?8:22)));
 if(!superHit)meter(m,attacker,blocked?3:8);meter(m,defender,blocked?4:Math.round(dealt*.55)+2);
 a.combo=m.tick-a.lastHit<75?a.combo+1:1;a.lastHit=m.tick;m.events.push({type:blocked?'block':'hit',player:defender,x,y,label:blocked?'BLOCK':a.combo>1?`${a.combo} TREFFER`:undefined});m.hitstop=blocked?2:5;
 if(b.hp===0){setAction(b,'defeat');m.events.push({type:'ko',player:defender});if((m.bench[defender]?.hp??0)>0)m.pendingTag[defender]=48}
}
function launch(m:Match,a:Actor,index:number,move:Pick<MoveDef,'kind'|'power'|'speed'|'reach'>,superHit=false){
 const height=move.kind==='wave'?20:move.kind==='arc'?90:65;
 if(move.kind==='burst'){const b=m.actors[1-index];if(Math.abs(a.x-b.x)<move.reach&&Math.abs(a.y-b.y)<120)damage(m,index,1-index,move.power,b.x,FLOOR+b.y-65,true,superHit)}
 else if(move.kind!=='dash')m.projectiles.push({id:++m.serial,owner:index,x:a.x+a.face*42,y:a.y-height,originY:a.y-height,vx:a.face*move.speed,age:0,kind:move.kind,damage:move.power,radius:superHit?29:move.kind==='wave'?25:19,color:fighter(a.id).color,ultra:superHit});
}
function tag(m:Match,index:number,forced=false){
 const outgoing=m.actors[index],incoming=m.bench[index];if(!incoming||incoming.hp<=0||!forced&&(m.tagCd[index]>0||outgoing.lock>0||outgoing.y<0))return false;
 incoming.x=outgoing.x;incoming.y=0;incoming.vy=0;incoming.face=outgoing.face;incoming.wins=m.score[index];incoming.last=neutral();incoming.buffer=[];incoming.chargeTicks=0;incoming.chargeGrace=0;incoming.invuln=24;setAction(incoming,'tag',30);
 m.actors[index]=incoming;m.bench[index]=outgoing;m.tagCd[index]=240;m.pendingTag[index]=0;m.events.push({type:'tag',player:index,x:incoming.x,y:FLOOR-100,label:fighter(incoming.id).short+' IST DRAN'});return true;
}
function nextRound(m:Match){
 m.actors=m.teams.map((ids,i)=>actor(ids[0],i?690:270,i?-1:1)) as [Actor,Actor];
 m.bench=m.teams.map((ids,i)=>ids[1]?actor(ids[1],i?690:270,i?-1:1):null) as [Actor|null,Actor|null];
 m.actors.forEach((a,i)=>a.wins=m.score[i]);m.tagCd=[0,0];m.pendingTag=[0,0];m.projectiles=[];m.round++;m.time=65*60;m.phase='intro';m.phaseTicks=110;
}
function commands(m:Match,index:number,input:Input){
 const a=m.actors[index];if(a.hp<=0)return;
 const other=m.actors[1-index],d=fighter(a.id);a.age++;a.specialCd=Math.max(0,a.specialCd-1);a.lock=Math.max(0,a.lock-1);a.parryTicks=Math.max(0,a.parryTicks-1);a.parryCd=Math.max(0,a.parryCd-1);a.invuln=Math.max(0,a.invuln-1);
 if(!['punch','kick','special','ultra','hit'].includes(a.action))a.face=other.x>=a.x?1:-1;
 const forward=a.face===1?input.right:input.left,back=a.face===1?input.left:input.right,lastForward=a.face===1?a.last.right:a.last.left;
 if(a.chargeFace!==a.face){a.chargeTicks=0;a.chargeGrace=0;a.chargeFace=a.face}
 if(back&&!forward){a.chargeTicks=Math.min(90,a.chargeTicks+1);a.chargeGrace=12}else{a.chargeGrace=Math.max(0,a.chargeGrace-1);if(a.chargeGrace===0)a.chargeTicks=0}
 if(input.down&&!a.last.down)a.buffer=pushToken(a.buffer,'down',m.tick);
 if(forward&&!lastForward)a.buffer=pushToken(a.buffer,'forward',m.tick);
 if(input.punch&&!a.last.punch)a.buffer=pushToken(a.buffer,'punch',m.tick);
 if(input.kick&&!a.last.kick)a.buffer=pushToken(a.buffer,'kick',m.tick);
 if(a.lock>0)return;
 const punch=input.punch&&!a.last.punch,kick=input.kick&&!a.last.kick;
 if(input.tag&&!a.last.tag&&tag(m,index))return;
 if(input.ultra&&!a.last.ultra&&m.meter[index]>=100&&a.y===0){meter(m,index,-100);setAction(a,'ultra',76);m.hitstop=16;m.events.push({type:'ultra',player:index,x:a.x,y:FLOOR-90,label:ultraFor(a.id).name});a.buffer=[];return}
 if(input.parry&&!a.last.parry&&m.rules.parry&&a.parryCd===0&&a.y===0){setAction(a,'parry',18);a.parryTicks=6;a.parryCd=36;return}
 let move=-1;
 if(a.y===0&&a.specialCd===0){if(forward&&punch&&a.chargeTicks>=42&&a.chargeGrace>0)move=2;else if(punch&&comboReady(a.buffer,m.tick))move=0;else if(kick&&comboReady(a.buffer,m.tick,'kick'))move=1}
 if(move>=0){a.activeMove=move;const def=activeMove(a);setAction(a,'special',def.duration);a.specialCd=def.cooldown;a.buffer=[];a.chargeTicks=0;a.chargeGrace=0;return}
 if(punch){setAction(a,'punch',25);m.events.push({type:'punch',player:index})}
 else if(kick){setAction(a,'kick',37);m.events.push({type:'kick',player:index})}
 else if(input.jump&&!a.last.jump&&a.y===0){a.vy=-625;setAction(a,'jump');m.events.push({type:'jump',player:index})}
 else if(input.block&&a.y===0)setAction(a,'block');
 else if(input.down&&a.y===0)setAction(a,'crouch');
 else if(input.left!==input.right){a.x+=(input.right?1:-1)*d.speed*TICK;setAction(a,a.y<0?'jump':'walk')}
 else setAction(a,a.y<0?'jump':'idle');
}
export function step(m:Match,inputs:[Input,Input]){
 m.events=[];m.tick++;if(m.phase==='complete')return;
 if(m.hitstop>0){m.hitstop--;return}
 if(m.phase!=='fight'){
  m.phaseTicks--;if(m.phaseTicks<=0){if(m.phase==='intro'){m.phase='fight';m.events.push({type:'round'})}else if(m.score.some(w=>w>=2)){m.phase='complete';m.winner=m.score[0]>=2?0:1;m.events.push({type:'win',player:m.winner})}else nextRound(m)}return;
 }
 m.time--;
 for(let i=0;i<2;i++){m.tagCd[i]=Math.max(0,m.tagCd[i]-1);if(m.pendingTag[i]>0&&--m.pendingTag[i]===0)tag(m,i,true);if(m.bench[i])m.bench[i]!.specialCd=Math.max(0,m.bench[i]!.specialCd-1)}
 // Defensive inputs from both players resolve before either attack can connect.
 commands(m,0,inputs[0]);commands(m,1,inputs[1]);
 const physics=stagePhysics(m.rules.stageId,m.tick);
 m.actors.forEach((a,index)=>{
  if(a.hp<=0)return;const other=m.actors[1-index],d=fighter(a.id),move=activeMove(a);
  if(a.y<0||a.vy<0){a.y+=a.vy*TICK;a.vy+=physics.gravity*TICK;a.x+=physics.wind*TICK;if(a.y>=0){a.y=0;a.vy=0}}
  if(a.action==='special'){
   if(a.age===move.startup){m.events.push({type:'special',player:index,label:move.name});launch(m,a,index,move)}
   if(move.kind==='dash'&&a.age>=move.startup&&a.age<move.startup+18){a.x+=a.face*move.speed*TICK;if(!a.attackHit&&(other.x-a.x)*a.face>-24&&Math.abs(a.x-other.x)<move.reach&&Math.abs(a.y-other.y)<95){a.attackHit=true;damage(m,index,1-index,move.power,other.x,FLOOR+other.y-60)}}
  }
  if(a.action==='ultra'){
   const superMove=ultraFor(a.id),pulse=[28,36,44].includes(a.age);
   if(pulse)launch(m,a,index,{kind:superMove.kind,power:14,speed:d.shotSpeed*1.25,reach:250},true);
   if(superMove.kind==='dash'&&a.age>=28&&a.age<50){a.x+=a.face*d.shotSpeed*1.3*TICK;if(!a.attackHit&&Math.abs(a.x-other.x)<d.reach+35&&Math.abs(a.y-other.y)<105){a.attackHit=true;damage(m,index,1-index,42,other.x,FLOOR+other.y-60,true,true)}}
  }
  if((a.action==='punch'||a.action==='kick')&&!a.attackHit){const start=a.action==='punch'?8:14,end=a.action==='punch'?12:19,reach=d.reach+(a.action==='kick'?28:0),distance=(other.x-a.x)*a.face;if(a.age>=start&&a.age<=end&&distance>=0&&distance<reach&&Math.abs(a.y-other.y)<(other.action==='crouch'&&a.action==='punch'?40:95)){a.attackHit=true;damage(m,index,1-index,a.action==='punch'?8:12,other.x,FLOOR+other.y-65)}}
  a.x=Math.max(LEFT,Math.min(RIGHT,a.x));
 });
 const [a,b]=m.actors;
 if(a.hp>0&&b.hp>0&&Math.abs(a.x-b.x)<72&&Math.abs(a.y-b.y)<90){const dir=a.x<=b.x?1:-1,push=(72-Math.abs(a.x-b.x))/2;a.x=Math.max(LEFT,Math.min(RIGHT,a.x-push*dir));b.x=Math.max(LEFT,Math.min(RIGHT,b.x+push*dir))}
 m.projectiles=m.projectiles.filter(p=>{p.age++;p.x+=p.vx*TICK;if(p.kind==='arc')p.y=p.originY-Math.sin(p.age*.075)*43;const target=m.actors[1-p.owner];if(target.hp>0&&Math.abs(p.x-target.x)<p.radius+24&&p.y>target.y-112-p.radius&&p.y<target.y+p.radius){damage(m,p.owner,1-p.owner,p.damage,target.x,FLOOR+p.y,true,!!p.ultra);return false}return p.x>-60&&p.x<1020&&p.age<220});
 m.actors.forEach((a,i)=>a.last={...inputs[i]});
 if(teamHealth(m,0)<=0||teamHealth(m,1)<=0||m.time<=0){
  m.phase='roundover';m.phaseTicks=145;const left=teamHealth(m,0)/m.teams[0].length,right=teamHealth(m,1)/m.teams[1].length;m.roundWinner=left===right?null:left>right?0:1;
  if(m.roundWinner!==null){if(m.actors[m.roundWinner].hp===0&&(m.bench[m.roundWinner]?.hp??0)>0)tag(m,m.roundWinner,true);m.score[m.roundWinner]++;m.actors.forEach((a,i)=>{a.wins=m.score[i];setAction(a,i===m.roundWinner?'victory':'defeat')})}m.projectiles=[];m.pendingTag=[0,0];
 }
}
export function random(m:Match){m.seed=(Math.imul(m.seed,1664525)+1013904223)>>>0;return m.seed/4294967296}
export interface Brain{next:number;hold:Input;comboStep:number;comboAt:number;attack:'punch'|'kick';chargeUntil:number}
export const createBrain=():Brain=>({next:0,hold:neutral(),comboStep:0,comboAt:0,attack:'punch',chargeUntil:0});
export function aiInput(m:Match,index:number,difficulty:number,brain:Brain):Input{
 const a=m.actors[index],b=m.actors[1-index],d=fighter(a.id);if(m.phase!=='fight'||a.hp<=0)return neutral();const level=Math.max(0,Math.min(1,difficulty)),distance=Math.abs(a.x-b.x);
 if(brain.chargeUntil){const out=neutral();if(m.tick<brain.chargeUntil)out[a.face===1?'left':'right']=true;else{out[a.face===1?'right':'left']=true;out.punch=true;brain.chargeUntil=0}return out}
 if(brain.comboStep>0){if(m.tick<brain.comboAt)return neutral();const out=neutral();if(brain.comboStep===1)out.down=true;if(brain.comboStep===2)out[a.face===1?'right':'left']=true;if(brain.comboStep===3)out[brain.attack]=true;brain.comboStep=brain.comboStep===3?0:brain.comboStep+1;brain.comboAt=m.tick+7;return out}
 if(m.tick<brain.next)return {...brain.hold,punch:false,kick:false,jump:false,parry:false,ultra:false,tag:false};
 brain.next=m.tick+Math.round(15+(1-level)*19+random(m)*12);const out=neutral(),threat=m.projectiles.some(p=>p.owner!==index&&Math.abs(p.x-a.x)<200)||(['punch','kick','special','ultra'].includes(b.action)&&distance<150);
 if(m.bench[index]&&m.bench[index]!.hp>a.hp+20&&a.hp<45&&m.tagCd[index]===0)out.tag=true;
 else if(m.meter[index]>=100&&distance<(d.kind==='burst'?220:500)&&a.lock===0)out.ultra=true;
 else if(threat&&random(m)<.25+level*.55){if(m.rules.parry&&a.parryCd===0&&random(m)<level*.2)out.parry=true;else if(m.projectiles.some(p=>p.kind==='wave'&&p.owner!==index)&&random(m)>.25)out.jump=true;else out.block=true}
 else if(a.specialCd===0&&a.lock===0&&random(m)<(a.id==='graumacher'?.85:.2+level*.22)){
  if(distance>240&&random(m)<.22)brain.chargeUntil=m.tick+46;else{brain.comboStep=1;brain.comboAt=m.tick;brain.attack=random(m)<.35?'kick':'punch'}
 }else if(distance>d.reach+5){out[b.x>a.x?'right':'left']=true;if(random(m)<.08+level*.08)out.jump=true}
 else{if(random(m)<.5)out.punch=true;else out.kick=true;if(random(m)<.13)out[b.x>a.x?'left':'right']=true}
 brain.hold=out;return out;
}
