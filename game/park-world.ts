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
 // The collision anchor is the feet, not the whole sprite. Keep a two-world-pixel
 // margin on visible ground so narrow bends do not become artificial dead ends.
 return p=>{const x=Math.round(p.x/2),y=Math.round(p.y/2);return x>=0&&y>=0&&x<742&&y<530&&clearance[y*742+x]>=1};
}
const corridor:Walkable=p=>projectToPath(p).distance<=PATH_WIDTH/2-5;
export function clearWalkLine(a:Point,b:Point,allowed:Walkable):boolean{
 const steps=Math.max(1,Math.ceil(distance(a,b)*2));
 for(let i=0;i<=steps;i++)if(!allowed({x:a.x+(b.x-a.x)*i/steps,y:a.y+(b.y-a.y)*i/steps}))return false;
 return true;
}
/** Follow nearby path tangents before reaching a boundary; never jump a hedge. */
export function walkStep(p:Point,dx:number,dy:number,allowed:Walkable=corridor):Point{
 const length=Math.hypot(dx,dy);if(!Number.isFinite(length)||length===0)return p;
 const ux=dx/length,uy=dy/length,steps=Math.ceil(length/.5),step=length/steps;let result=p;
 for(let i=0;i<steps;i++){
  let vx=ux,vy=uy;
  const ahead={x:result.x+ux*8,y:result.y+uy*8};
  if(!clearWalkLine(result,ahead,allowed)){
   let best:{point:Point;score:number}|undefined;
   for(const edge of EDGES){
    const a=NODES[edge[0]],b=NODES[edge[1]],ex=b.x-a.x,ey=b.y-a.y,len=Math.hypot(ex,ey);
    const t=Math.max(0,Math.min(1,((result.x-a.x)*ex+(result.y-a.y)*ey)/(len*len)));
    const center={x:a.x+ex*t,y:a.y+ey*t},alignment=(ux*ex+uy*ey)/len;
    if(distance(result,center)>18||Math.abs(alignment)<.35)continue;
    const nextT=Math.max(0,Math.min(1,t+Math.sign(alignment)*14/len));
    const point={x:a.x+ex*nextT,y:a.y+ey*nextT},d=distance(result,point);
    if(d<step||(point.x-result.x)*ux+(point.y-result.y)*uy<d*.2)continue;
    const score=Math.abs(alignment)-distance(result,center)/40;
    if((!best||score>best.score)&&clearWalkLine(result,point,allowed))best={point,score};
   }
   if(best){const d=distance(result,best.point);vx=(best.point.x-result.x)/d;vy=(best.point.y-result.y)/d;}
  }
  const next={x:result.x+vx*step,y:result.y+vy*step};
  if(!clearWalkLine(result,next,allowed))break;
  result=next;
 }
 return result;
}
/** Small rounded corners, accepted only when the entire curve is traversable. */
export function smoothWalkRoute(route:Point[],allowed:Walkable):Point[]{
 if(route.length<3)return route;
 const result=[route[0]];
 for(let i=1;i<route.length-1;i++){
  const a=route[i-1],b=route[i],c=route[i+1],ab=distance(a,b),bc=distance(b,c),r=Math.min(10,ab*.3,bc*.3);
  if(r<.25){result.push(b);continue;}
  const entry={x:b.x+(a.x-b.x)*r/ab,y:b.y+(a.y-b.y)*r/ab},exit={x:b.x+(c.x-b.x)*r/bc,y:b.y+(c.y-b.y)*r/bc};
  const curve=Array.from({length:7},(_,j)=>{const t=j/6,s=1-t;return {x:s*s*entry.x+2*s*t*b.x+t*t*exit.x,y:s*s*entry.y+2*s*t*b.y+t*t*exit.y}});
  const check=[result.at(-1)!,...curve,c];
  if(check.slice(1).every((p,j)=>clearWalkLine(check[j],p,allowed)))result.push(...curve);else result.push(b);
 }
 result.push(route.at(-1)!);return result.filter((p,i,list)=>!i||distance(p,list[i-1])>.001);
}
function routeProjection(p:Point,allowed?:Walkable){
 if(!allowed)return projectToPath(p);
 // Nearby parallel paths may be separated by a hedge: choose a visible connector.
 const candidates=EDGES.map(edge=>{const a=NODES[edge[0]],b=NODES[edge[1]],dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy))),point={x:a.x+dx*t,y:a.y+dy*t};return {edge,point,distance:distance(p,point)}}).sort((a,b)=>a.distance-b.distance);
 return candidates.find(c=>clearWalkLine(p,c.point,allowed));
}
export function findWalkRoute(start:Point,end:Point,allowed?:Walkable):Point[]{
 const a=routeProjection(start,allowed),b=routeProjection(end,allowed);if(!a||!b)return [];
 if(a.edge===b.edge&&(!allowed||clearWalkLine(start,end,allowed)))return [start,end].filter((p,i,list)=>!i||distance(p,list[i-1])>.001);
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
 const route=[start,...ids.map(id=>points[id as keyof typeof points]),end].filter((p,i,list)=>!i||distance(p,list[i-1])>.001);
 return allowed?smoothWalkRoute(route,allowed):route;
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
