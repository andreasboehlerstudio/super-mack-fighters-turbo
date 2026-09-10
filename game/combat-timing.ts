import type {FighterId} from './data.ts';
export type NormalAttack='punch'|'kick'|'airpunch'|'airkick';
export const DYNAMIC_TEST_FIGHTERS:readonly FighterId[]=['roland','michael'];
export const isNormalAttack=(action:string):action is NormalAttack=>['punch','kick','airpunch','airkick'].includes(action);
export const attackTiming=(action:NormalAttack,dynamic=false)=>{
 const [startup,recovery,duration]= (dynamic?{
  punch:[4,8,16],kick:[7,12,23],airpunch:[3,8,15],airkick:[5,12,21],
 }:{punch:[8,13,25],kick:[14,20,37],airpunch:[6,12,24],airkick:[9,18,32]})[action];
 return {startup,recovery,duration};
};
