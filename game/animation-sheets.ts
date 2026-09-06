import type {Action} from './combat.ts';
import type {FighterId} from './data.ts';
import {motionFrame} from './fighter-animation.ts';
import {walkFrame} from './walk-animation.ts';
import {spriteOrigin} from './sprite-origin.ts';

const sequence=(start:number,length:number)=>Array.from({length},(_,i)=>start+i);
/** Each action is exported losslessly at 256 × 256 pixels per pose. */
export const ANIMATION_SHEETS={
 idle:{kind:'motion',frames:sequence(0,8)},walk:{kind:'walk',frames:sequence(0,8)},
 punch:{kind:'motion',frames:sequence(16,8)},kick:{kind:'motion',frames:sequence(24,8)},
 airpunch:{kind:'motion',frames:sequence(32,8)},airkick:{kind:'motion',frames:sequence(40,8)},
 jump:{kind:'action',frames:[4]},land:{kind:'action',frames:[5]},crouch:{kind:'action',frames:[5]},block:{kind:'action',frames:[10]},
 hit:{kind:'action',frames:[11]},special:{kind:'action',frames:[12,13]},ultra:{kind:'action',frames:[12,13]},
 parry:{kind:'action',frames:[10]},tag:{kind:'action',frames:[0]},defeat:{kind:'action',frames:[14]},victory:{kind:'action',frames:[15]}
} as const;
export type AnimationClip=keyof typeof ANIMATION_SHEETS;
export const animationUrl=(id:FighterId,clip:AnimationClip)=>`/assets/animations/${id}/${clip}.png?v=clips-2`;
export function animationPose(action:Action,age:number,walkPhase:number,specialStartup=18){
 const clip:AnimationClip=action;
 const motion=motionFrame(action,age,walkPhase);
 const frame=action==='walk'?walkFrame(walkPhase):motion!==null?motion%8:action==='special'?Number(age>=specialStartup):action==='ultra'?Number(age>=28):0;
 const spec=ANIMATION_SHEETS[clip];
 return {clip,frame,kind:spec.kind,sourceFrame:spec.frames[frame]};
}
export function animationOrigin(id:FighterId,clip:AnimationClip,frame:number){
 const spec=ANIMATION_SHEETS[clip];
 return spriteOrigin(id,spec.kind,spec.frames[frame]);
}
