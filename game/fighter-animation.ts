import type {Action} from './combat.ts';
import {walkFrame} from './walk-animation.ts';
export const MOTION_COLUMNS=8,MOTION_ROWS=6,MOTION_FRAMES=MOTION_COLUMNS*MOTION_ROWS;
/** Eight animation phases per action. The extended pose coincides with the hit window. */
export function motionFrame(action:Action,age:number,walkPhase=0):number|null {
 if(action==='idle')return Math.floor(age/5)%8;
 if(action==='walk')return 8+walkFrame(walkPhase,8);
 const move=action==='punch'?[2,8,13,25]:action==='kick'?[3,14,20,37]:action==='airpunch'?[4,6,12,24]:action==='airkick'?[5,9,18,32]:null;
 if(!move)return null;
 const [row,start,recovery,end]=move;
 const pose=age<start?Math.min(2,Math.floor(age/start*3)):age<recovery?3+Math.min(1,Math.floor((age-start)/(recovery-start)*2)):5+Math.min(2,Math.floor((age-recovery)/(end-recovery)*3));
 return row*8+pose;
}
