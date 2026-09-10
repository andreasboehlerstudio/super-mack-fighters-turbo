import type {Match} from './combat.ts';

export const KO_END=68;
/** Ignition, expansion, burning hold, then separately drawn disintegration frames. */
export function koFireFrame(age:number){
 if(age<0||age>=KO_END)return null;
 if(age<6)return 0;if(age<12)return 1;if(age<20)return 2;
 if(age<48)return 3+Math.floor((age-20)/7)%2;
 return Math.min(8,5+Math.floor((age-48)/5));
}
/** Simulation ticks keep the overlay in sync with slow motion, pause and online play. */
export function koAge(m:Pick<Match,'phase'|'phaseTicks'|'actors'>){
 if(m.phase!=='roundover'||!m.actors.some(a=>a.hp<=0))return null;
 const age=145-m.phaseTicks;
 return age>=0&&age<KO_END?age:null;
}
export function koPose(age:number,reduced=false){
 const exit=Math.max(0,Math.min(1,(age-48)/20));
 const scale=reduced?1:age<6?1.18-.22*age/6:age<12?.96+.04*(age-6)/6:1;
 return {scale,alpha:1-exit,y:reduced?0:-Math.round(exit*14),fire:Math.max(0,1-Math.max(0,age-16)/40)};
}
