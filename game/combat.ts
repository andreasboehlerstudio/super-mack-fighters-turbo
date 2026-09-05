import {fighter,type FighterId,type FighterDef} from './data.ts';
export const TICK=1/60, FLOOR=445, LEFT=65, RIGHT=895;
export type Action='idle'|'walk'|'jump'|'crouch'|'punch'|'kick'|'block'|'hit'|'special'|'defeat'|'victory';
export type Input={left:boolean;right:boolean;down:boolean;jump:boolean;punch:boolean;kick:boolean;block:boolean};
export const neutral=():Input=>({left:false,right:false,down:false,jump:false,punch:false,kick:false,block:false});
export interface Token {key:'down'|'forward'|'punch';tick:number;}
export interface Actor {id:FighterId;x:number;y:number;vy:number;face:1|-1;hp:number;action:Action;age:number;lock:number;specialCd:number;attackHit:boolean;buffer:Token[];last:Input;wins:number;combo:number;lastHit:number;}
export interface Projectile {id:number;owner:number;x:number;y:number;originY:number;vx:number;age:number;kind:string;damage:number;radius:number;color:string;}
export type CombatEvent={type:'punch'|'kick'|'jump'|'hit'|'block'|'special'|'round'|'win'|'ko';player?:number;x?:number;y?:number;label?:string};
export interface Match {actors:[Actor,Actor];tick:number;phase:'intro'|'fight'|'roundover'|'complete';phaseTicks:number;round:number;time:number;winner:number|null;roundWinner:number|null;projectiles:Projectile[];events:CombatEvent[];hitstop:number;serial:number;seed:number;}
const actor=(id:FighterId,x:number,face:1|-1):Actor=>({id,x,y:0,vy:0,face,hp:100,action:'idle',age:0,lock:0,specialCd:0,attackHit:false,buffer:[],last:neutral(),wins:0,combo:0,lastHit:-999});
export function createMatch(a:FighterId,b:FighterId,seed=19):Match {return {actors:[actor(a,270,1),actor(b,690,-1)],tick:0,phase:'intro',phaseTicks:150,round:1,time:65*60,winner:null,roundWinner:null,projectiles:[],events:[],hitstop:0,serial:0,seed};}
export function pushToken(buffer:Token[],key:Token['key'],tick:number){const recent=buffer.filter(t=>tick-t.tick<=60);recent.push({key,tick});return recent.slice(-8);}
export function comboReady(buffer:Token[],tick:number){let at=0;const seq=['down','forward','punch'];for(const t of buffer){if(tick-t.tick<=60&&t.key===seq[at])at++;if(at===3)return true;}return false;}
const setAction=(a:Actor,action:Action,lock=0)=>{if(a.action!==action||lock){a.action=action;a.age=0;}a.lock=lock;a.attackHit=false;};
const attackDuration=(a:Actor)=>a.action==='punch'?25:a.action==='kick'?37:a.id==='graumacher'?76:53;
function damage(m:Match,attacker:number,defender:number,amount:number,x:number,y:number,guard:boolean){const a=m.actors[attacker],b=m.actors[defender];if(b.hp<=0)return;const blocked=guard&&b.y===0&&b.action==='block';b.hp=Math.max(0,b.hp-(blocked?Math.max(1,Math.round(amount*.12)):amount));setAction(b,blocked?'block':'hit',blocked?9:17);b.x=Math.max(LEFT,Math.min(RIGHT,b.x+a.face*(blocked?8:22)));a.combo=m.tick-a.lastHit<75?a.combo+1:1;a.lastHit=m.tick;m.events.push({type:blocked?'block':'hit',player:defender,x,y,label:blocked?'BLOCK':a.combo>1?`${a.combo} TREFFER`:undefined});m.hitstop=blocked?2:5;if(b.hp===0){setAction(b,'defeat');m.events.push({type:'ko'});}}
function special(m:Match,a:Actor,index:number,d:FighterDef){m.events.push({type:'special',player:index,label:d.special});const height=d.kind==='wave'?20:d.kind==='arc'?90:65;if(d.kind==='burst'){const b=m.actors[1-index];if(Math.abs(a.x-b.x)<165&&Math.abs(a.y-b.y)<120)damage(m,index,1-index,d.power,b.x,FLOOR+b.y-70,true);}else if(d.kind!=='dash'){m.projectiles.push({id:++m.serial,owner:index,x:a.x+a.face*42,y:a.y-height,originY:a.y-height,vx:a.face*d.shotSpeed,age:0,kind:d.kind,damage:d.power,radius:d.kind==='wave'?25:19,color:d.color});}}
export function step(m:Match,inputs:[Input,Input]){m.events=[];m.tick++;if(m.phase==='complete')return;
 if(m.hitstop>0){m.hitstop--;return;}
 if(m.phase!=='fight'){m.phaseTicks--;if(m.phaseTicks<=0){if(m.phase==='intro'){m.phase='fight';m.events.push({type:'round'});}else if(m.actors.some(a=>a.wins>=2)){m.phase='complete';m.winner=m.actors[0].wins>=2?0:1;m.events.push({type:'win',player:m.winner});}else{const wins=m.actors.map(a=>a.wins);m.actors=[actor(m.actors[0].id,270,1),actor(m.actors[1].id,690,-1)];m.actors.forEach((a,i)=>a.wins=wins[i]);m.projectiles=[];m.round++;m.time=65*60;m.phase='intro';m.phaseTicks=110;}}return;}
 m.time--;
 m.actors.forEach((a,index)=>{const input=inputs[index],other=m.actors[1-index],d=fighter(a.id);a.age++;a.specialCd=Math.max(0,a.specialCd-1);a.lock=Math.max(0,a.lock-1);if(!['punch','kick','special','hit'].includes(a.action))a.face=other.x>=a.x?1:-1;
 const forward=a.face===1?input.right:input.left,lastForward=a.face===1?a.last.right:a.last.left;
 if(input.down&&!a.last.down)a.buffer=pushToken(a.buffer,'down',m.tick);
 if(forward&&!lastForward)a.buffer=pushToken(a.buffer,'forward',m.tick);
 if(input.punch&&!a.last.punch)a.buffer=pushToken(a.buffer,'punch',m.tick);
 if(a.lock===0){
  if(input.punch&&!a.last.punch&&comboReady(a.buffer,m.tick)&&a.specialCd===0&&a.y===0){setAction(a,'special',a.id==='graumacher'?76:53);a.specialCd=d.cooldown;a.buffer=[];}
  else if(input.punch&&!a.last.punch){setAction(a,'punch',25);m.events.push({type:'punch',player:index});}
  else if(input.kick&&!a.last.kick){setAction(a,'kick',37);m.events.push({type:'kick',player:index});}
  else if(input.jump&&!a.last.jump&&a.y===0){a.vy=-625;setAction(a,'jump');m.events.push({type:'jump',player:index});}
  else if(input.block&&a.y===0)setAction(a,'block');
  else if(input.down&&a.y===0)setAction(a,'crouch');
  else if(input.left!==input.right){a.x+=(input.right?1:-1)*d.speed*TICK;setAction(a,a.y<0?'jump':'walk');}
  else setAction(a,a.y<0?'jump':'idle');
 }
 if(a.y<0||a.vy<0){a.y+=a.vy*TICK;a.vy+=1550*TICK;if(a.y>=0){a.y=0;a.vy=0;}}
 if(a.action==='special'){const trigger=a.id==='graumacher'?44:18;if(a.age===trigger)special(m,a,index,d);if(d.kind==='dash'&&a.age>=18&&a.age<36){a.x+=a.face*d.shotSpeed*TICK;if(!a.attackHit&&Math.abs(a.x-other.x)<d.reach&&Math.abs(a.y-other.y)<95){a.attackHit=true;damage(m,index,1-index,d.power,other.x,FLOOR+other.y-60,true);}}}
 if((a.action==='punch'||a.action==='kick')&&!a.attackHit){const start=a.action==='punch'?8:14,end=a.action==='punch'?12:19,reach=d.reach+(a.action==='kick'?28:0),forwardDistance=(other.x-a.x)*a.face;if(a.age>=start&&a.age<=end&&forwardDistance>=0&&forwardDistance<reach&&Math.abs(a.y-other.y)<(other.action==='crouch'&&a.action==='punch'?40:95)){a.attackHit=true;damage(m,index,1-index,a.action==='punch'?8:12,other.x,FLOOR+other.y-65,true);}}
 if(['punch','kick','special'].includes(a.action)&&a.age>=attackDuration(a))setAction(a,a.y<0?'jump':'idle');a.x=Math.max(LEFT,Math.min(RIGHT,a.x));a.last={...input};
 });
 const [a,b]=m.actors;if(Math.abs(a.x-b.x)<72&&Math.abs(a.y-b.y)<90){const dir=a.x<=b.x?1:-1;const push=(72-Math.abs(a.x-b.x))/2;a.x=Math.max(LEFT,Math.min(RIGHT,a.x-push*dir));b.x=Math.max(LEFT,Math.min(RIGHT,b.x+push*dir));}
 m.projectiles=m.projectiles.filter(p=>{p.age++;p.x+=p.vx*TICK;if(p.kind==='arc')p.y=p.originY-Math.sin(p.age*.075)*43;const target=m.actors[1-p.owner];if(Math.abs(p.x-target.x)<p.radius+24&&p.y>target.y-112-p.radius&&p.y<target.y+p.radius){damage(m,p.owner,1-p.owner,p.damage,target.x,FLOOR+p.y,true);return false;}return p.x>-60&&p.x<1020&&p.age<220;});
 if(m.actors.some(a=>a.hp<=0)||m.time<=0){m.phase='roundover';m.phaseTicks=145;m.roundWinner=a.hp===b.hp?null:a.hp>b.hp?0:1;if(m.roundWinner!==null){m.actors[m.roundWinner].wins++;setAction(m.actors[m.roundWinner],'victory');setAction(m.actors[1-m.roundWinner],'defeat');}m.projectiles=[];}
}
export function random(m:Match){m.seed=(Math.imul(m.seed,1664525)+1013904223)>>>0;return m.seed/4294967296;}
export interface Brain {next:number;hold:Input;comboStep:number;comboAt:number;}
export const createBrain=():Brain=>({next:0,hold:neutral(),comboStep:0,comboAt:0});
export function aiInput(m:Match,index:number,difficulty:number,brain:Brain):Input{const a=m.actors[index],b=m.actors[1-index],d=fighter(a.id);if(m.phase!=='fight')return neutral();const level=Math.max(0,Math.min(1,difficulty));
 if(brain.comboStep>0){if(m.tick<brain.comboAt)return neutral();const out=neutral();if(brain.comboStep===1)out.down=true;if(brain.comboStep===2){if(a.face===1)out.right=true;else out.left=true;}if(brain.comboStep===3)out.punch=true;brain.comboStep=brain.comboStep===3?0:brain.comboStep+1;brain.comboAt=m.tick+7;return out;}
 if(m.tick<brain.next)return {...brain.hold,punch:false,kick:false,jump:false};brain.next=m.tick+Math.round(15+(1-level)*19+random(m)*12);const out=neutral(),distance=Math.abs(a.x-b.x),threat=m.projectiles.some(p=>p.owner!==index&&Math.abs(p.x-a.x)<240)||(['punch','kick','special'].includes(b.action)&&distance<150);
 if(threat&&random(m)<.25+level*.55){if(m.projectiles.some(p=>p.kind==='wave'&&p.owner!==index)&&random(m)>.25)out.jump=true;else out.block=true;}
 else if(a.specialCd===0&&a.lock===0&&random(m)<(a.id==='graumacher'?.85:.2+level*.22)){brain.comboStep=1;brain.comboAt=m.tick;}
 else if(distance>d.reach+5){if(b.x>a.x)out.right=true;else out.left=true;if(random(m)<.08+level*.08)out.jump=true;}
 else {if(random(m)<.5)out.punch=true;else out.kick=true;if(random(m)<.13){if(b.x>a.x)out.left=true;else out.right=true;}}
 brain.hold=out;return out;
}
