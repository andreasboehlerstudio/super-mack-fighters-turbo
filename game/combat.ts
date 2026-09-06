import {fighter,type FighterId} from './data.ts';
import {movesFor,ultraFor,type MoveDef} from './moves.ts';
import {stagePhysics} from './stages.ts';
export const TICK=1/60,FLOOR=445,LEFT=65,RIGHT=895;
export type Action='idle'|'walk'|'jump'|'land'|'crouch'|'punch'|'kick'|'airpunch'|'airkick'|'block'|'hit'|'special'|'ultra'|'parry'|'tag'|'defeat'|'victory';
export type Input={left:boolean;right:boolean;down:boolean;jump:boolean;punch:boolean;kick:boolean;block:boolean;parry:boolean;ultra:boolean;tag:boolean};
export const neutral=():Input=>({left:false,right:false,down:false,jump:false,punch:false,kick:false,block:false,parry:false,ultra:false,tag:false});
export interface Token{key:'down'|'forward'|'punch'|'kick';tick:number}
export interface Actor{id:FighterId;x:number;y:number;vy:number;vx:number;face:1|-1;hp:number;action:Action;age:number;lock:number;specialCd:number;attackHit:boolean;buffer:Token[];last:Input;wins:number;combo:number;lastHit:number;activeMove:number;chargeTicks:number;chargeGrace:number;chargeFace:number;queued:{key:"punch"|"kick"|"jump"|"ultra";tick:number}|null;parryTicks:number;parryCd:number;invuln:number}
export interface Projectile{id:number;owner:number;x:number;y:number;originY:number;vx:number;age:number;kind:string;damage:number;radius:number;color:string;ultra?:boolean}
export type CombatEvent={type:'punch'|'kick'|'jump'|'hit'|'block'|'special'|'round'|'win'|'ko'|'parry'|'ultra'|'tag';player?:number;x?:number;y?:number;label?:string};
export const comboName=(hits:number)=>hits>=6?'ULTRA COMBO':hits>=4?'TURBO COMBO':hits===3?'TRIPLE HIT':'DOUBLE HIT';
export interface MatchOptions{training?:boolean;parry?:boolean;turbo?:number;stageId?:string;partners?:[FighterId|null,FighterId|null]}
export interface Match{actors:[Actor,Actor];tick:number;phase:'intro'|'fight'|'roundover'|'complete';phaseTicks:number;round:number;time:number;winner:number|null;roundWinner:number|null;projectiles:Projectile[];events:CombatEvent[];hitstop:number;serial:number;seed:number;meter:[number,number];bench:[Actor|null,Actor|null];tagCd:[number,number];pendingTag:[number,number];teams:[FighterId[],FighterId[]];score:[number,number];rules:{training:boolean;parry:boolean;turbo:number;stageId:string}}
const actor=(id:FighterId,x:number,face:1|-1):Actor=>({id,x,y:0,vy:0,vx:0,face,hp:100,action:'idle',age:0,lock:0,specialCd:0,attackHit:false,buffer:[],last:neutral(),wins:0,combo:0,lastHit:-999,activeMove:0,chargeTicks:0,chargeGrace:0,chargeFace:face,queued:null,parryTicks:0,parryCd:0,invuln:0});
export function createMatch(a:FighterId,b:FighterId,seed=19,options:MatchOptions={}):Match{
 const partners=options.partners??[null,null];
 return {actors:[actor(a,270,1),actor(b,690,-1)],tick:0,phase:'intro',phaseTicks:150,round:1,time:65*60,winner:null,roundWinner:null,projectiles:[],events:[],hitstop:0,serial:0,seed,meter:options.training?[100,100]:[0,0],bench:[partners[0]?actor(partners[0],270,1):null,partners[1]?actor(partners[1],690,-1):null],tagCd:[0,0],pendingTag:[0,0],teams:[[a,...(partners[0]?[partners[0]]:[])],[b,...(partners[1]?[partners[1]]:[])]],score:[0,0],rules:{training:options.training??false,parry:options.parry??false,turbo:Math.min(1.4,Math.max(1,options.turbo??1.18)),stageId:options.stageId??'park-9'}};
}
export function pushToken(buffer:Token[],key:Token['key'],tick:number){return [...buffer.filter(t=>tick-t.tick<=60),{key,tick}].slice(-10)}
export function comboReady(buffer:Token[],tick:number,attack:'punch'|'kick'='punch'){let at=0;const seq=['down','forward',attack];for(const t of buffer){if(tick-t.tick<=60&&t.key===seq[at])at++;if(at===3)return true}return false}
const setAction=(a:Actor,action:Action,lock=0)=>{if(a.action!==action||lock){a.action=action;a.age=0}a.lock=lock;a.attackHit=false};
const meter=(m:Match,i:number,amount:number)=>m.meter[i]=Math.max(0,Math.min(100,m.meter[i]+amount));
export const teamHealth=(m:Match,i:number)=>m.actors[i].hp+(m.bench[i]?.hp??0);
export const activeMove=(a:Actor)=>movesFor(a.id)[a.activeMove]??movesFor(a.id)[0];
export type Hitbox={x:number;y:number;w:number;h:number};
export const boxesOverlap=(a:Hitbox,b:Hitbox)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
export const hurtbox=(a:Actor):Hitbox=>{const mascot=['ed','snorri','wakala'].includes(a.id),width=mascot?84:62,height=a.action==='crouch'?104:mascot?168:178;return {x:a.x-width/2,y:a.y-height,w:width,h:height}};
/** Shared collision geometry: training draws the same boxes used to resolve hits. */
export function activeHitbox(a:Actor):Hitbox|null {
 const d=fighter(a.id),move=activeMove(a);let reach=0,top=95,height=70,behind=0;
 if(a.action==='punch'&&a.age>=8&&a.age<=12&&!a.attackHit){reach=d.reach;top=145;height=30}
 else if(a.action==='kick'&&a.age>=14&&a.age<=19&&!a.attackHit){reach=d.reach+28;top=94;height=36}
 else if(a.action==='airpunch'&&a.age>=6&&a.age<=11&&!a.attackHit){reach=d.reach+8;top=132;height=58}
 else if(a.action==='airkick'&&a.age>=9&&a.age<=17&&!a.attackHit){reach=d.reach+42;top=102;height=60}
 else if(a.action==='special'&&move.kind==='dash'&&a.age>=move.startup&&a.age<move.startup+18&&!a.attackHit){reach=move.reach;behind=24}
 else if(a.action==='special'&&move.kind==='burst'&&a.age===move.startup)return {x:a.x-move.reach,y:a.y-120,w:move.reach*2,h:120};
 else if(a.action==='ultra'&&d.kind==='dash'&&a.age>=28&&a.age<50&&!a.attackHit){reach=d.reach+35;behind=24;top=105;height=85}
 else if(a.action==='ultra'&&d.kind==='burst'&&[28,36,44].includes(a.age))return {x:a.x-250,y:a.y-120,w:500,h:120};
 else return null;
 return {x:a.face>0?a.x-behind:a.x-reach,y:a.y-top,w:reach+behind,h:height};
}
const meleeConnects=(a:Actor,b:Actor)=>{const box=activeHitbox(a);return !!box&&boxesOverlap(box,hurtbox(b))};
function damage(m:Match,attacker:number,defender:number,amount:number,x:number,y:number,guard=true,superHit=false){
 const a=m.actors[attacker],b=m.actors[defender];if(b.hp<=0||b.invuln>0)return;
 if(m.rules.parry&&b.parryTicks>0){b.parryTicks=0;b.invuln=4;b.lock=7;b.parryCd=22;meter(m,defender,14);m.hitstop=6;m.events.push({type:'parry',player:defender,x,y,label:'PARRY!'});if(Math.abs(a.x-b.x)<150)a.lock=Math.max(a.lock,14);return}
 const continuing=b.action==='hit'&&b.lock>0;
 const blocked=guard&&b.y===0&&b.action==='block',dealt=blocked?Math.max(1,Math.round(amount*.12)):amount;
 b.hp=Math.max(0,b.hp-dealt);setAction(b,blocked?'block':'hit',blocked?9:17);b.x=Math.max(LEFT,Math.min(RIGHT,b.x+a.face*(blocked?8:22)));
 if(!superHit)meter(m,attacker,blocked?3:8);meter(m,defender,blocked?4:Math.round(dealt*.55)+2);
 if(!blocked){a.combo=continuing?a.combo+1:1;a.lastHit=m.tick;}m.events.push({type:blocked?'block':'hit',player:defender,x,y,label:blocked?'BLOCK':a.combo>1?`${a.combo} HITS · ${comboName(a.combo)}`:undefined});m.hitstop=blocked?2:5;
 if(b.hp===0){setAction(b,'defeat');m.events.push({type:'ko',player:defender});if((m.bench[defender]?.hp??0)>0)m.pendingTag[defender]=48}
}
function launch(m:Match,a:Actor,index:number,move:Pick<MoveDef,'kind'|'power'|'speed'|'reach'>,superHit=false){
 const height=move.kind==='wave'?20:move.kind==='arc'?90:65;
 if(move.kind==='burst'){const b=m.actors[1-index];if(boxesOverlap({x:a.x-move.reach,y:a.y-120,w:move.reach*2,h:120},hurtbox(b)))damage(m,index,1-index,move.power,b.x,FLOOR+b.y-65,true,superHit)}
 else if(move.kind!=='dash')m.projectiles.push({id:++m.serial,owner:index,x:a.x+a.face*42,y:a.y-height,originY:a.y-height,vx:a.face*move.speed,age:0,kind:move.kind,damage:move.power,radius:superHit?29:move.kind==='wave'?25:19,color:fighter(a.id).color,ultra:superHit});
}
function tag(m:Match,index:number,forced=false){
 const outgoing=m.actors[index],incoming=m.bench[index];if(!incoming||incoming.hp<=0||!forced&&(m.tagCd[index]>0||outgoing.lock>0||outgoing.y<0))return false;
 incoming.x=outgoing.x;incoming.y=0;incoming.vy=0;incoming.vx=0;incoming.face=outgoing.face;incoming.wins=m.score[index];incoming.last=neutral();incoming.buffer=[];incoming.chargeTicks=0;incoming.chargeGrace=0;incoming.invuln=24;setAction(incoming,'tag',30);
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
 if(!['punch','kick','airpunch','airkick','special','ultra','hit'].includes(a.action))a.face=other.x>=a.x?1:-1;
 const forward=a.face===1?input.right:input.left,back=a.face===1?input.left:input.right,lastForward=a.face===1?a.last.right:a.last.left;
 if(a.chargeFace!==a.face){a.chargeTicks=0;a.chargeGrace=0;a.chargeFace=a.face}
 if(back&&!forward){a.chargeTicks=Math.min(90,a.chargeTicks+1);a.chargeGrace=12}else{a.chargeGrace=Math.max(0,a.chargeGrace-1);if(a.chargeGrace===0)a.chargeTicks=0}
 if(input.down&&!a.last.down)a.buffer=pushToken(a.buffer,'down',m.tick);
 if(forward&&!lastForward)a.buffer=pushToken(a.buffer,'forward',m.tick);
 if(input.punch&&!a.last.punch)a.buffer=pushToken(a.buffer,'punch',m.tick);
 if(input.kick&&!a.last.kick)a.buffer=pushToken(a.buffer,'kick',m.tick);
 if(a.lock>0)return;
 const queued=a.queued&&m.tick-a.queued.tick<=6?a.queued.key:null;a.queued=null;const punch=queued==='punch'||input.punch&&!a.last.punch,kick=queued==='kick'||input.kick&&!a.last.kick;
 if((queued==='jump'||input.jump&&!a.last.jump)&&a.y===0&&a.vy===0){a.vy=-625;a.vx=(Number(input.right)-Number(input.left))*d.speed*.85;setAction(a,'jump');m.events.push({type:'jump',player:index});}
 if(a.y<0||a.vy<0){
  if(punch){setAction(a,'airpunch',24);m.events.push({type:'punch',player:index,label:'LUFTSCHLAG'})}
  else if(kick){setAction(a,'airkick',32);m.events.push({type:'kick',player:index,label:'LUFTTRITT'})}
  else setAction(a,'jump');
  return;
 }
 if(input.tag&&!a.last.tag&&tag(m,index))return;
 if((queued==='ultra'||input.ultra&&!a.last.ultra)&&m.meter[index]>=100&&a.y===0){meter(m,index,-100);setAction(a,'ultra',76);m.hitstop=16;m.events.push({type:'ultra',player:index,x:a.x,y:FLOOR-90,label:ultraFor(a.id).name});a.buffer=[];return}
 if(input.parry&&!a.last.parry&&m.rules.parry&&a.parryCd===0&&a.y===0){setAction(a,'parry',18);a.parryTicks=6;a.parryCd=36;return}
 let move=-1;
 if(a.y===0&&a.specialCd===0){if(forward&&punch&&a.chargeTicks>=42&&a.chargeGrace>0)move=2;else if(punch&&comboReady(a.buffer,m.tick))move=0;else if(kick&&comboReady(a.buffer,m.tick,'kick'))move=1}
 if(move>=0){a.activeMove=move;const def=activeMove(a);setAction(a,'special',def.duration);a.specialCd=def.cooldown;a.buffer=[];a.chargeTicks=0;a.chargeGrace=0;return}
 if(punch){setAction(a,'punch',25);m.events.push({type:'punch',player:index})}
 else if(kick){setAction(a,'kick',37);m.events.push({type:'kick',player:index})}
 else if(input.block&&a.y===0)setAction(a,'block');
 else if(input.down&&a.y===0)setAction(a,'crouch');
 else if(input.left!==input.right){a.x+=(input.right?1:-1)*d.speed*TICK;setAction(a,a.y<0?'jump':'walk')}
 else setAction(a,a.y<0?'jump':'idle');
}
export function step(m:Match,inputs:[Input,Input]){
 m.events=[];m.tick++;if(m.phase==='complete')return;
 for(const [i,a] of m.actors.entries())for(const key of ['jump','punch','kick','ultra'] as const)if(inputs[i][key]&&!a.last[key])a.queued={key,tick:m.tick};
 if(m.hitstop>0){m.hitstop--;m.actors.forEach((a,i)=>a.last={...inputs[i]});return}
 if(m.phase!=='fight'){
  m.phaseTicks--;if(m.phaseTicks<=0){if(m.phase==='intro'){m.phase='fight';m.events.push({type:'round'})}else if(m.score.some(w=>w>=2)){m.phase='complete';m.winner=m.score[0]>=2?0:1;m.events.push({type:'win',player:m.winner})}else nextRound(m)}return;
 }
 if(!m.rules.training)m.time--;else m.meter=[100,100];
 for(let i=0;i<2;i++){m.tagCd[i]=Math.max(0,m.tagCd[i]-1);if(m.pendingTag[i]>0&&--m.pendingTag[i]===0)tag(m,i,true);if(m.bench[i])m.bench[i]!.specialCd=Math.max(0,m.bench[i]!.specialCd-1)}
 // Defensive inputs from both players resolve before either attack can connect.
 commands(m,0,inputs[0]);commands(m,1,inputs[1]);
 const physics=stagePhysics(m.rules.stageId,m.tick);
 m.actors.forEach((a,index)=>{
  if(a.hp<=0)return;const other=m.actors[1-index],d=fighter(a.id),move=activeMove(a);
  if(a.y<0||a.vy<0){const steer=Number(inputs[index].right)-Number(inputs[index].left);if(steer&&a.action!=='hit')a.vx+=(steer*d.speed*.85-a.vx)*.12;a.x+=(a.vx+physics.wind)*TICK;a.y+=a.vy*TICK;a.vy+=physics.gravity*TICK;if(a.y>=0){a.y=0;a.vy=0;a.vx=0;if(['jump','airpunch','airkick'].includes(a.action))setAction(a,'land',6);}}
  if(a.action==='special'){
   if(a.age===move.startup){m.events.push({type:'special',player:index,label:move.name});launch(m,a,index,move)}
   if(move.kind==='dash'&&a.age>=move.startup&&a.age<move.startup+18){a.x+=a.face*move.speed*TICK;if(!a.attackHit&&meleeConnects(a,other)){a.attackHit=true;damage(m,index,1-index,move.power,other.x,FLOOR+other.y-60)}}
  }
  if(a.action==='ultra'){
   const superMove=ultraFor(a.id),pulse=[28,36,44].includes(a.age);
   if(pulse)launch(m,a,index,{kind:superMove.kind,power:14,speed:d.shotSpeed*1.25,reach:250},true);
   if(superMove.kind==='dash'&&a.age>=28&&a.age<50){a.x+=a.face*d.shotSpeed*1.3*TICK;if(!a.attackHit&&meleeConnects(a,other)){a.attackHit=true;damage(m,index,1-index,42,other.x,FLOOR+other.y-60,true,true)}}
  }
  if(['punch','kick','airpunch','airkick'].includes(a.action)&&!a.attackHit){if(meleeConnects(a,other)){a.attackHit=true;damage(m,index,1-index,a.action==='punch'?8:a.action==='airpunch'?9:a.action==='airkick'?13:12,other.x,FLOOR+other.y-65)}}
  a.x=Math.max(LEFT,Math.min(RIGHT,a.x));
 });
 const [a,b]=m.actors;
 if(a.hp>0&&b.hp>0&&Math.abs(a.x-b.x)<72&&Math.abs(a.y-b.y)<90){const dir=a.x<=b.x?1:-1,push=(72-Math.abs(a.x-b.x))/2;a.x=Math.max(LEFT,Math.min(RIGHT,a.x-push*dir));b.x=Math.max(LEFT,Math.min(RIGHT,b.x+push*dir))}
 m.projectiles=m.projectiles.filter(p=>{p.age++;p.x+=p.vx*TICK;if(p.kind==='arc')p.y=p.originY-Math.sin(p.age*.075)*43;const target=m.actors[1-p.owner];if(target.hp>0&&boxesOverlap({x:p.x-p.radius,y:p.y-p.radius,w:p.radius*2,h:p.radius*2},hurtbox(target))){damage(m,p.owner,1-p.owner,p.damage,target.x,FLOOR+p.y,true,!!p.ultra);return false}return p.x>-60&&p.x<1020&&p.age<220});
 m.actors.forEach((a,i)=>a.last={...inputs[i]});
 if(m.rules.training){if(m.actors.some(a=>a.hp<=0)){m.phase='intro';m.phaseTicks=90;m.projectiles=[];m.actors=m.teams.map((ids,i)=>actor(ids[0],i?610:350,i?-1:1)) as [Actor,Actor];m.bench=m.teams.map((ids,i)=>ids[1]?actor(ids[1],i?610:350,i?-1:1):null) as [Actor|null,Actor|null];}return;}
 if(teamHealth(m,0)<=0||teamHealth(m,1)<=0||m.time<=0){
  m.phase='roundover';m.phaseTicks=145;const left=teamHealth(m,0)/m.teams[0].length,right=teamHealth(m,1)/m.teams[1].length;m.roundWinner=left===right?null:left>right?0:1;
  if(m.roundWinner!==null){if(m.actors[m.roundWinner].hp===0&&(m.bench[m.roundWinner]?.hp??0)>0)tag(m,m.roundWinner,true);m.score[m.roundWinner]++;m.actors.forEach((a,i)=>{a.wins=m.score[i];setAction(a,i===m.roundWinner?'victory':'defeat')})}m.projectiles=[];m.pendingTag=[0,0];
 }
}
export function random(m:Match){m.seed=(Math.imul(m.seed,1664525)+1013904223)>>>0;return m.seed/4294967296}
export type Tactic='wait'|'approach'|'retreat'|'attack'|'defend'|'special';
export interface Brain{next:number;hold:Input;comboStep:number;comboAt:number;attack:'punch'|'kick';chargeUntil:number;fighter:FighterId|null;intent:Tactic;lastOffense:number}
export const createBrain=():Brain=>({next:0,hold:neutral(),comboStep:0,comboAt:0,attack:'punch',chargeUntil:0,fighter:null,intent:'wait',lastOffense:0});
export function aiInput(m:Match,index:number,difficulty:number,brain:Brain):Input{
 const a=m.actors[index],b=m.actors[1-index],d=fighter(a.id),level=Math.max(0,Math.min(1,difficulty)),distance=Math.abs(a.x-b.x);
 if(m.phase!=='fight'||a.hp<=0){brain.fighter=null;brain.comboStep=0;brain.chargeUntil=0;brain.hold=neutral();return neutral()}
 // A short opening read, also after tagging in. Never inspect the player's pending input.
 if(brain.fighter!==a.id){brain.fighter=a.id;brain.next=m.tick+Math.round(20+(1-level)*18+random(m)*12);brain.hold=neutral();brain.intent='wait';brain.lastOffense=m.tick;return neutral()}
 const forward=b.x>a.x?'right':'left',back=forward==='right'?'left':'right',spaceBehind=forward==='right'?a.x-LEFT:RIGHT-a.x;
 const projectile=m.projectiles.find(p=>p.owner!==index&&(a.x-p.x)*p.vx>0&&Math.abs(p.x-a.x)<210&&Math.abs(p.y-(a.y-80))<140);
 const recovering=b.lock>0&&((b.action==='punch'&&b.age>12)||(b.action==='kick'&&b.age>19)||(b.action==='special'&&b.age>activeMove(b).startup+18)||(b.action==='ultra'&&b.age>50)||b.action==='land');
 const pressure=!recovering&&['punch','kick','airpunch','airkick','special','ultra'].includes(b.action)&&distance<190&&Math.abs(a.y-b.y)<150;
 if(a.action==='hit'){brain.comboStep=0;brain.chargeUntil=0;brain.hold=neutral();brain.next=Math.max(brain.next,m.tick+8)}
 if(a.lock>0)return neutral();
 if(brain.chargeUntil){const out=neutral();if(m.tick<brain.chargeUntil){out[back]=spaceBehind>30;out.down=true;}else{out[forward]=true;out.punch=true;brain.chargeUntil=0;brain.next=m.tick+22;}return out}
 if(brain.comboStep>0){if(m.tick<brain.comboAt)return neutral();const out=neutral();if(brain.comboStep===1)out.down=true;if(brain.comboStep===2)out[a.face===1?'right':'left']=true;if(brain.comboStep===3)out[brain.attack]=true;brain.comboStep=brain.comboStep===3?0:brain.comboStep+1;brain.comboAt=m.tick+7;return out}
 if(m.tick<brain.next){const held={...brain.hold,punch:false,kick:false,jump:false,parry:false,ultra:false,tag:false};if(brain.intent==='retreat'&&(spaceBehind<28||distance>330))held[back]=false;if(brain.intent==='approach'&&distance<d.reach+10)held[forward]=false;return held}
 brain.next=m.tick+Math.round(16+(1-level)*17+random(m)*10);const out=neutral();brain.intent='wait';
 const wounded=a.hp<38&&b.hp>a.hp+12,ranged=['bolt','wave','arc'].includes(d.kind),preferred=ranged?225:d.reach+45,canRetreat=spaceBehind>60,overdue=m.tick-brain.lastOffense>170;
 const attack=()=>{out[distance>d.reach+16?'kick':random(m)<.55?'punch':'kick']=true;brain.intent='attack';brain.lastOffense=m.tick};
 const retreat=()=>{out[back]=true;brain.intent='retreat';brain.next=m.tick+Math.round(18+random(m)*12)};
 if(m.bench[index]&&m.bench[index]!.hp>a.hp+20&&a.hp<45&&m.tagCd[index]===0)out.tag=true;
 else if(a.y<0){if(distance<155&&Math.abs(a.y-b.y)<150)attack();else if(distance>180)out[forward]=true;}
 else if((projectile||pressure)&&random(m)<.42+level*.43){
  brain.intent='defend';
  if(!projectile&&canRetreat&&distance>d.reach+10&&(wounded||random(m)<.4))retreat();
  else if(m.rules.parry&&a.parryCd===0&&random(m)<level*.14)out.parry=true;
  else if(projectile?.kind==='wave'&&random(m)<.42)out.jump=true;
  else out.block=true;
 }
 else if(recovering&&distance<d.reach+45){attack();}
 else if(wounded&&canRetreat&&distance<preferred+25&&!overdue){retreat();}
 else if(m.meter[index]>=100&&distance<(d.kind==='burst'?215:d.kind==='dash'?280:530)&&!pressure){out.ultra=true;brain.intent='attack';brain.lastOffense=m.tick;}
 else {
  // Select a plan at human-sized intervals; range, recovery and corner room change its odds.
  const candidates=movesFor(a.id).filter(move=>move.kind==='burst'?distance<move.reach+15:move.kind==='dash'?distance>115&&distance<290:distance>145&&distance<650);
  const options:{intent:Tactic;weight:number}[]=[
   {intent:'wait',weight:overdue?.1:1.3},
   {intent:'approach',weight:distance>d.reach+25?(distance>preferred+60?6:overdue?5:ranged?1.1:3):0},
   {intent:'retreat',weight:canRetreat&&distance<preferred+15&&!overdue?(distance<d.reach+20?2.1:ranged?3:1):0},
   {intent:'attack',weight:distance<d.reach+48?(recovering?12:overdue?9:4.5):0},
   {intent:'special',weight:a.specialCd===0&&candidates.length&&!pressure?(overdue?6:ranged?3.4:2.3):0}
  ];
  let roll=random(m)*options.reduce((sum,p)=>sum+p.weight,0);const chosen=options.find(p=>(roll-=p.weight)<0)!.intent;brain.intent=chosen;
  if(chosen==='retreat')retreat();
  else if(chosen==='approach'){out[forward]=true;if(distance>210&&distance<380&&random(m)<.06+level*.04)out.jump=true;}
  else if(chosen==='attack')attack();
  else if(chosen==='special'){
   const move=candidates[Math.floor(random(m)*candidates.length)];brain.lastOffense=m.tick;
   if(move.input==='charge'){brain.chargeUntil=m.tick+46;out[back]=true;out.down=true;}
   else{brain.comboStep=1;brain.comboAt=m.tick+1;brain.attack=move.input==='quarter-kick'?'kick':'punch';}
  }
 }
 brain.hold=out;return out;
}
