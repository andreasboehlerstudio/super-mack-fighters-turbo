import type {FighterId} from './data.ts';
/** A single URL lets park sprites and classic-costume canvases share downloads. */
export function fighterSheetUrl(id:FighterId,kind:'action'|'walk'|'motion'='action'){
 return `/assets/${kind==='action'?'':kind+'/'}${id}.png?v=${id==='valentina'?'native-6':'combat-5-gait-3'}`;
}
