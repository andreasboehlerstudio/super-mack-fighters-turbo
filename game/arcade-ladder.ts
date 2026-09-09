import {HEROES,type FighterId} from './data.ts';
export type BossRole='midboss'|'finalboss';
/** Stable per saved run: map, retries and resume share the same shuffled opponents. */
export function arcadeLadder(length:number,runId='classic'):FighterId[]{
 if(!Number.isInteger(length)||length<1||length>21)throw new Error('Die Turnierleiter braucht 1 bis 21 Stationen.');
 if(length===1)return ['roland'];if(length===2)return ['frederik','roland'];
 let seed=2166136261;for(const c of runId)seed=Math.imul(seed^c.charCodeAt(0),16777619)>>>0;
 const pool=HEROES.map(f=>f.id).filter(id=>!['frederik','michael','roland'].includes(id));
 for(let i=pool.length-1;i>0;i--){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const j=Math.floor(seed/4294967296*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
 const ladder=pool.slice(0,length-3);ladder.unshift('frederik');ladder.splice(Math.floor(length/2),0,'michael');ladder.push('roland');return ladder;
}
export function arcadeOpponent(index:number,length:number,runId='classic'){return arcadeLadder(length,runId)[Math.min(length-1,Math.max(0,index))]}
export function arcadeBoss(index:number,length:number):BossRole|undefined{return index===length-1?'finalboss':index===Math.floor(length/2)?'midboss':undefined}
export const bossLabel=(role:BossRole|undefined)=>role==='finalboss'?'FINAL BOSS':role==='midboss'?'MID BOSS':'NÄCHSTER KAMPF';
