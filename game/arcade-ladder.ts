import type {FighterId} from './data.ts';
export type BossRole='midboss'|'finalboss';
const opening:FighterId[]=['max','matthias','andreas','nathalie','laurent','reinhold','ed','snorri','wakala'];
const senior:FighterId[]=['alexia','annkathrin','nicolas','katja','miriam','thomas','mauritia','marianne','juergen'];
/** A fictional tournament ladder. The three authored milestones survive short and festival tours. */
export function arcadeLadder(length:number):FighterId[]{
 if(!Number.isInteger(length)||length<1||length>21)throw new Error('Die Turnierleiter braucht 1 bis 21 Stationen.');
 if(length===1)return ['roland'];if(length===2)return ['frederik','roland'];
 const middle=Math.floor(length/2),after=length-middle-2;
 const closing=after<=2?(['thomas','juergen'] as FighterId[]).slice(2-after):senior.slice(-after);
 return ['frederik',...opening.slice(0,middle-1),'michael',...closing,'roland'];
}
export function arcadeOpponent(index:number,length:number){return arcadeLadder(length)[Math.min(length-1,Math.max(0,index))]}
export function arcadeBoss(index:number,length:number):BossRole|undefined{return index===length-1?'finalboss':index===Math.floor(length/2)?'midboss':undefined}
export const bossLabel=(role:BossRole|undefined)=>role==='finalboss'?'FINAL BOSS':role==='midboss'?'MID BOSS':'NÄCHSTER KAMPF';
