import {HEROES,type FighterId} from './data.ts';
import type {GameRules} from './rules.ts';
import type {BattleConfig} from './scene';
import {arcadeOpponent,arcadeBoss} from './arcade-ladder.ts';

export type GameMode='arcade'|'cpu'|'versus'|'training'|'online';
/** Local Versus matches end at character select; a rematch always needs a new selection. */
export function postMatchScreen(mode:GameMode,won:boolean,finalTourRound:boolean){
 return mode==='cpu'||mode==='versus'?'select':mode==='arcade'&&won&&finalTourRound?'ending':'result';
}
export type PlayerPads=[number|null,number|null];
export function localPlayersReady(joined:boolean,pads:PlayerPads,connected:readonly number[]):boolean {
 return joined && (pads[0]===null||pads[1]===null||pads[0]!==pads[1]) && pads.every(p=>p===null||connected.includes(p));
}
export function makeBattleConfig(options:{mode:GameMode;p1:FighterId;p2:FighterId;arena:string;route:string[];index:number;difficulty:number;rules:GameRules;pads:PlayerPads}):BattleConfig {
 const {mode,p1,p2,arena,route,index,difficulty,rules,pads}=options,tour=mode==='arcade';
 const current=tour?route[index]:arena,opponent=tour?arcadeOpponent(index,route.length):p2;
 const partner1=rules.partner1===p1?HEROES.find(h=>h.id!==p1)!.id:rules.partner1;
 const reserve=tour?(index===route.length-1?'juergen':HEROES[(index*3+3)%HEROES.length].id):rules.partner2;
 const partner2=reserve===opponent?HEROES.find(h=>h.id!==opponent)!.id:reserve;
 const boss=tour?arcadeBoss(index,route.length):undefined;
 return {boss,training:mode==='training',p1,p2:opponent,stationId:current,cpu:mode!=='versus',difficulty:Math.min(.92,difficulty+(tour?(index/Math.max(1,route.length-1))*.36+(boss==='midboss'?.08:boss==='finalboss'?.16:0):0)),parry:rules.parry,turbo:rules.turbo,partners:rules.tag?[partner1,partner2]:[null,null],costumes:[rules.costume1,rules.costume2],playerPads:[pads[0],mode==='versus'?pads[1]:null]};
}

/** A held title-menu button must be released before it can join another seat. */
export function newJoinPress(index:number,host:number|null,pressed:boolean,previous:boolean|undefined){return index!==host&&pressed&&previous===false;}
