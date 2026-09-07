import {FIGHTERS,type FighterId} from './data.ts';
export type LocalScore={id:string;tour:string;initials:string;hero:FighterId;score:number};
type StorageLike=Pick<Storage,'getItem'|'setItem'>;
const KEY='smft-local-highscores-v1';
export function readLocalScores(storage:StorageLike,tour:string):LocalScore[]{
 let values:unknown;try{values=JSON.parse(storage.getItem(KEY)??'[]')}catch{return []}
 if(!Array.isArray(values))return [];
 return values.filter((v):v is LocalScore=>v&&v.tour===tour&&typeof v.id==='string'&&/^[A-Z0-9]{3}$/.test(v.initials)&&FIGHTERS.some(f=>f.id===v.hero)&&Number.isSafeInteger(v.score)&&v.score>=0).sort((a,b)=>b.score-a.score).slice(0,50);
}
export function saveLocalScore(storage:StorageLike,entry:LocalScore){
 let values:unknown;try{values=JSON.parse(storage.getItem(KEY)??'[]')}catch{values=[]}
 const others=Array.isArray(values)?values.filter(v=>v&&v.tour!==entry.tour).slice(-200):[];
 const scores=[...readLocalScores(storage,entry.tour).filter(v=>v.id!==entry.id),entry].sort((a,b)=>b.score-a.score).slice(0,50);
 storage.setItem(KEY,JSON.stringify([...others,...scores]));
}
