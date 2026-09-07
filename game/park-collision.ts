import {createWalkable,type Walkable} from './park-world';
let pending:Promise<Walkable>|undefined;
/** Shared by walking view and overview so guides cannot cross a visual hedge. */
export function loadParkCollision():Promise<Walkable>{
 return pending??=fetch('/assets/atlas/walk-clearance.bin').then(response=>{
  if(!response.ok)throw Error('Park collision load failed');return response.arrayBuffer();
 }).then(buffer=>createWalkable(new Int16Array(buffer))).catch(error=>{pending=undefined;throw error;});
}
