import type {MoveDef} from './moves.ts';
export const isJanHulk=(a:{id:string;hulk?:boolean})=>a.id==='jan'&&a.hulk===true;
export const hitsJanBack=(a:{x:number;face:number},sourceX:number)=>(sourceX-a.x)*a.face < -12;
export const JAN_HULK_MOVES:[MoveDef,MoveDef,MoveDef]=[
 {name:'ACTION! · Regie-Ansturm',kind:'dash',input:'quarter-punch',power:100,speed:390,cooldown:115,startup:32,duration:110,reach:160},
 {name:'Director’s Cut · Set-Beben',kind:'wave',input:'quarter-kick',power:100,speed:450,cooldown:120,startup:36,duration:112,reach:160},
 {name:'FINAL TAKE · Letzte Klappe',kind:'burst',input:'charge',power:100,speed:0,cooldown:135,startup:42,duration:125,reach:190}
];
