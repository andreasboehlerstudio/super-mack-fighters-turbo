import {PATH_NODES,PATH_EDGES} from './park-paths.ts';
export type Point={x:number;y:number};
export const WORLD_WIDTH=1484,WORLD_HEIGHT=1060,PATH_WIDTH=16;
export const NODES:Record<string,Point>=PATH_NODES;
export const EDGES=PATH_EDGES;
const gates:Record<number,string>={0:'adventure',1:'entry',2:'england',3:'france-east',4:'greece',5:'grimm',6:'holland',7:'ireland',8:'island-east',9:'italy',10:'minimoys',11:'west-middle',12:'liechtenstein',13:'luxembourg',14:'monaco',15:'austria-west',16:'portugal-north',17:'russia',18:'swiss-south',19:'scandinavia-sw',20:'spain-west'};
export const DISTRICTS=Object.entries(gates).map(([area,node])=>({id:'park-'+area,...NODES[node],gate:NODES[node]}));
export function themeGate(id:string):Point{return DISTRICTS.find(d=>d.id===id)?.gate??NODES.entry;}
export function cameraTarget(p:Point,width=640,height=360):Point{return {x:Math.max(width/2,Math.min(WORLD_WIDTH-width/2,p.x)),y:Math.max(height/2,Math.min(WORLD_HEIGHT-height/2,p.y))};}
