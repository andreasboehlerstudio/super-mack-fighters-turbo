import {HEROES,type FighterId} from './data.ts';
import type {GameRules} from './rules.ts';
import type {BattleConfig} from './scene';

export type GameMode='arcade'|'cpu'|'versus'|'training'|'online';
export type PlayerPads=[number|null,number|null];
export function localPlayersReady(joined:boolean,pads:PlayerPads,connected:readonly number[]):boolean {
 return joined && (pads[0]===null||pads[1]===null||pads[0]!==pads[1]) && pads.every(p=>p===null||connected.includes(p));
}
export function makeBattleConfig(options:{mode:GameMode;p1:FighterId;p2:FighterId;arena:string;route:string[];index:number;difficulty:number;rules:GameRules;pads:PlayerPads}):BattleConfig {
 const {mode,p1,p2,arena,route,index,difficulty,rules,pads}=options,tour=mode==='arcade';
 const current=tour?route[index]:arena,opponent=tour?(index===route.length-1?'graumacher':HEROES[(index*3+2)%HEROES.length].id):p2;
 const partner1=rules.partner1===p1?HEROES.find(h=>h.id!==p1)!.id:rules.partner1;
 const partner2=tour?(HEROES[(index*3+3)%HEROES.length].id):(rules.partner2===opponent?HEROES.find(h=>h.id!==opponent)!.id:rules.partner2);
 return {training:mode==='training',p1,p2:opponent,stationId:current,cpu:mode!=='versus',difficulty:Math.min(.92,difficulty+(tour?index*.035:0)),parry:rules.parry,turbo:rules.turbo,partners:rules.tag?[partner1,partner2]:[null,null],costumes:[rules.costume1,rules.costume2],playerPads:[pads[0],mode==='versus'?pads[1]:null]};
}

/** A held title-menu button must be released before it can join another seat. */
export function newJoinPress(index:number,host:number|null,pressed:boolean,previous:boolean|undefined){return index!==host&&pressed&&previous===false;}
