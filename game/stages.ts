export type StageEffect='water-platform'|'storm'|'wind'|'harbor'|'low-gravity'|'machinery'|'studio';
export const SPECIAL_STAGES=[
 {id:'stage-svalgurok',name:'Rulantica – Svalgurok',effect:'water-platform' as StageEffect,note:'Sanft bewegte Plattform · Wasser ohne Schaden',area:null},
 {id:'stage-traumatica',name:'Traumatica – The Fallen District',effect:'storm' as StageEffect,note:'Nebel und entfernte Lichtblitze · freie Kampffläche',area:null},
 {id:'stage-skyport',name:'Voletarium – Skyport',effect:'wind' as StageEffect,note:'Sichtbare Windrichtung · leichter Schub nur im Sprung',area:'park-1'},
 {id:'stage-batavia',name:'Piraten in Batavia – Hafenstadt',effect:'harbor' as StageEffect,note:'Boote und Wasserbewegung hinter dem Kampf',area:'park-6'},
 {id:'stage-cosmic',name:'Eurosat – Cosmic Arena',effect:'low-gravity' as StageEffect,note:'Niedrige Schwerkraft · längere Sprünge für beide',area:'park-3'},
 {id:'stage-blue-fire',name:'Blue Fire Hangar',effect:'machinery' as StageEffect,note:'Turbinen und Funken · keine Hazard-Treffer',area:'park-8'},
 {id:'stage-hq',name:'MackMedia HQ',effect:'studio' as StageEffect,note:'Render-PCs, Storyboards und kleine Easter Eggs',area:null}
];
export function stagePhysics(id:string,tick:number){const effect=SPECIAL_STAGES.find(s=>s.id===id)?.effect;return {gravity:effect==='low-gravity'?1050:1550,wind:effect==='wind'?Math.sin(tick/180)*48:0,floorOffset:effect==='water-platform'?Math.sin(tick/120)*7:0,effect};}
