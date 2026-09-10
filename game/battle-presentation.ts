import type {Match} from './combat.ts';

/** Slow the finishing hit and recovery, then return smoothly to normal speed. */
export function finishTimeScale(m:Pick<Match,'phase'|'phaseTicks'|'actors'>){
 if(m.phase!=='roundover'||!m.actors.some(a=>a.hp===0))return 1;
 const progress=Math.max(0,145-m.phaseTicks);
 if(progress<36)return .45;
 const t=Math.min(1,(progress-36)/36);
 return .45+.55*t*t*(3-2*t);
}
export const CALLOUT_TIMING={notice:{hold:1000,exit:350},special:{hold:1200,exit:250},ultra:{hold:1600,exit:300}} as const;
