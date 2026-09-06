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
export function walkStep(p:Point,dx:number,dy:number):Point{
 const intended={x:p.x+dx,y:p.y+dy},nearest=projectToPath(intended);
 if(nearest.distance<=PATH_WIDTH/2-5)return intended;
 const from=projectToPath(p);
 if(distance(p,nearest.point)<=Math.hypot(dx,dy)+.1)return nearest.point;
 const a=NODES[from.edge[0]],b=NODES[from.edge[1]],length=distance(a,b),dot=(dx*(b.x-a.x)+dy*(b.y-a.y))/length;
 return projectToPath({x:from.point.x+dot*(b.x-a.x)/length,y:from.point.y+dot*(b.y-a.y)/length}).point;
}
export function findWalkRoute(start:Point,end:Point):Point[]{
 const a=projectToPath(start),b=projectToPath(end);
 if(a.edge===b.edge)return [a.point,b.point];
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
 return ids.map(id=>points[id as keyof typeof points]);
}
export const PARK_ENTRY=NODES.entry;
export const SHUTTLE_GATE=NODES.entry;
export const arenaGate=themeGate;
export function routeLength(route:Point[]){return route.slice(1).reduce((sum,p,i)=>sum+distance(route[i],p),0);}
