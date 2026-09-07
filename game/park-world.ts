import {NODES,EDGES,PATH_WIDTH,themeGate} from './park-layout.ts';
export {NODES,EDGES} from './park-layout.ts';
export type {Point} from './park-layout.ts';
import type {Point} from './park-layout.ts';
export const distance=(a:Point,b:Point)=>Math.hypot(a.x-b.x,a.y-b.y);
export function projectToPath(p:Point){
 let best={point:NODES.entry,edge:EDGES[0],distance:Infinity};
 for(const edge of EDGES){
  const a=NODES[edge[0]],b=NODES[edge[1]],dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy))),point={x:a.x+dx*t,y:a.y+dy*t},d=distance(p,point);
  if(d<best.distance)best={point,edge,distance:d};
 }
 return best;
}
export type Walkable=(p:Point)=>boolean;
/** Clearance was measured from the actual displayed sand and bridge artwork. */
export function createWalkable(clearance:Int16Array):Walkable{
 if(clearance.length!==742*530)throw Error('Invalid park collision map');
 return p=>{const x=Math.round(p.x/2),y=Math.round(p.y/2);return x>=0&&y>=0&&x<742&&y<530&&clearance[y*742+x]>=2};
}
const corridor:Walkable=p=>projectToPath(p).distance<=PATH_WIDTH/2-5;
export function clearWalkLine(a:Point,b:Point,allowed:Walkable):boolean{
 const steps=Math.max(1,Math.ceil(distance(a,b)*2));
 for(let i=0;i<=steps;i++)if(!allowed({x:a.x+(b.x-a.x)*i/steps,y:a.y+(b.y-a.y)*i/steps}))return false;
 return true;
}
/** Stop along the requested vector, never project back to a path or oscillate. */
export function walkStep(p:Point,dx:number,dy:number,allowed:Walkable=corridor):Point{
 const length=Math.hypot(dx,dy);if(!Number.isFinite(length)||length===0)return p;
 const steps=Math.ceil(length/.5);let result=p;
 for(let i=1;i<=steps;i++){
  const next={x:p.x+dx*i/steps,y:p.y+dy*i/steps};
  if(!allowed(next))break;
  result=next;
 }
 return result;
}
function routeProjection(p:Point,allowed?:Walkable){
 if(!allowed)return projectToPath(p);
 // Nearby parallel paths may be separated by a hedge: choose a visible connector.
 const candidates=EDGES.map(edge=>{const a=NODES[edge[0]],b=NODES[edge[1]],dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy))),point={x:a.x+dx*t,y:a.y+dy*t};return {edge,point,distance:distance(p,point)}}).sort((a,b)=>a.distance-b.distance);
 return candidates.find(c=>clearWalkLine(p,c.point,allowed));
}
export function findWalkRoute(start:Point,end:Point,allowed?:Walkable):Point[]{
 const a=routeProjection(start,allowed),b=routeProjection(end,allowed);if(!a||!b)return [];
 if(a.edge===b.edge)return [start,a.point,b.point,end].filter((p,i,list)=>!i||distance(p,list[i-1])>.001);
 const points={...NODES,$start:a.point,$end:b.point},edges:[string,string][]=[...EDGES,...a.edge.map(id=>['$start',id] as [string,string]),...b.edge.map(id=>[id,'$end'] as [string,string])];
 const costs:Record<string,number>={$start:0},previous:Record<string,string>={},pending=new Set(Object.keys(points));
 while(pending.size){
  const node=[...pending].reduce((best,id)=>(costs[id]??Infinity)<(costs[best]??Infinity)?id:best);
  if(!Number.isFinite(costs[node]))break;
  pending.delete(node);if(node==='$end')break;
  for(const edge of edges){
   const next=edge[0]===node?edge[1]:edge[1]===node?edge[0]:null;
   if(!next||!pending.has(next))continue;
   const cost=costs[node]+distance(points[node as keyof typeof points],points[next as keyof typeof points]);
   if(cost<(costs[next]??Infinity)){costs[next]=cost;previous[next]=node;}
  }
 }
 if(!Number.isFinite(costs.$end))return [];
 const ids=['$end'];while(ids[0]!=='$start')ids.unshift(previous[ids[0]]);
 return [start,...ids.map(id=>points[id as keyof typeof points]),end].filter((p,i,list)=>!i||distance(p,list[i-1])>.001);
}
/** Spend the full frame's distance even across several short route segments. */
export function advanceRoute(start:Point,route:Point[],budget:number):{point:Point;route:Point[]}{
 let point=start,index=0;
 while(index<route.length){const next=route[index],d=distance(point,next);if(d<=budget+.000001){point=next;budget=Math.max(0,budget-d);index++}else{if(budget>0)point={x:point.x+(next.x-point.x)/d*budget,y:point.y+(next.y-point.y)/d*budget};break}}
 return {point,route:route.slice(index)};
}
export const PARK_ENTRY=NODES.entry;
export const SHUTTLE_GATE=NODES.entry;
export const arenaGate=themeGate;
export function routeLength(route:Point[]){return route.slice(1).reduce((sum,p,i)=>sum+distance(route[i],p),0);}
