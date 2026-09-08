import {HEROES,type FighterId} from './data.ts';
export const COSTUMES=['classic','summer','halloween','winter','rulantica'] as const;
export type Costume=typeof COSTUMES[number];
export const COSTUME_NAMES:Record<Costume,string>={classic:'Klassisch',summer:'Sommer',halloween:'Halloween',winter:'Winterzauber',rulantica:'Rulantica'};
export interface GameRules {turbo:number;parry:boolean;tag:boolean;partner1:FighterId;partner2:FighterId;costume1:Costume;costume2:Costume}
export const DEFAULT_RULES:GameRules={turbo:1.18,parry:false,tag:false,partner1:'snorri',partner2:'max',costume1:'classic',costume2:'classic'};
export function readRules(value:unknown):GameRules{const v=(value&&typeof value==='object'?value:{}) as Partial<GameRules>;const hero=(id:unknown)=>HEROES.some(h=>h.id===id);return {turbo:[1,1.18,1.32].includes(v.turbo??0)?v.turbo!:1.18,parry:v.parry===true,tag:v.tag===true,partner1:hero(v.partner1)?v.partner1!:'snorri',partner2:hero(v.partner2)?v.partner2!:'max',costume1:'classic',costume2:'classic'}};
