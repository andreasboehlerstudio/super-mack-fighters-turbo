import {mapPoint} from './park-map.ts';
export type Point={x:number;y:number};
// Simplified playable walkway network, aligned to the official atlas crop.
// World coordinates use a 1024-wide map with the top 120 pixels removed.
const raw:Record<string,[number,number]>={
 portugalBank:[713,475],
 entry:[152,447],avenue:[185,447],square:[205,464],italySouth:[230,464],italy:[240,447],italyNorth:[255,421],garden:[268,406],gardenEast:[289,399],chess:[306,413],junction:[329,431],junctionEast:[355,434],irelandSouth:[375,418],bridge:[396,416],teacups:[421,418],
 france:[247,475],franceSouth:[250,504],franceEast:[275,523],swissWest:[301,513],swiss:[327,497],swissNorth:[347,479],swissBridge:[355,452],greeceWest:[324,524],greece:[328,526],greeceHarbour:[351,529],greeceEast:[379,533],croatiaWest:[401,518],croatia:[425,504],
 ireland:[415,395],irelandBridge:[400,372],irelandNorth:[402,344],irelandGarden:[386,329],irelandGate:[364,320],woodlandWest:[411,353],woodland:[421,376],woodlandEast:[444,399],englandWest:[477,417],england:[503,415],fairyWest:[524,407],fairy:[546,395],fairyNorth:[563,377],minimoysWest:[590,354],minimoys:[620,333],minimoysEast:[647,329],austriaNorth:[677,339],austriaBridge:[695,347],austria:[720,341],austriaEast:[749,350],portugalNorth:[777,350],spainWest:[801,343],spain:[827,353],
 centre:[437,440],russiaNorth:[470,441],russia:[489,476],russiaSouth:[485,506],luxWest:[490,513],luxSouth:[512,524],lux:[540,511],hollandWest:[557,489],hollandNorth:[554,470],holland:[581,449],hollandEast:[604,459],lakeWest:[556,412],lakeSouth:[562,438],batavia:[636,433],lakeEast:[670,426],lakeNorth:[687,411],alpine:[710,409],alpineSouth:[730,427],portugal:[740,458],waterEast:[744,515],spainSouth:[785,524],scandiEast:[810,517],scandiSouth:[806,547],islandEast:[781,570],islandSouth:[766,585],island:[735,583],islandNorth:[715,569],scandi:[706,548],scandiWest:[697,525],hallEast:[692,513],hallNorth:[633,471]
};
export const NODES:Record<string,Point>=Object.fromEntries(Object.entries(raw).map(([id,[x,y]])=>[id,{x,y:y-120}]));
const lines=[
 'entry avenue square italySouth italy italyNorth garden gardenEast chess junction junctionEast irelandSouth bridge teacups centre russiaNorth russia russiaSouth luxWest luxSouth lux hollandWest hollandNorth holland hollandEast batavia lakeEast lakeNorth alpine alpineSouth portugal portugalBank hallEast waterEast spainSouth scandiEast scandiSouth islandEast islandSouth island islandNorth scandi scandiWest hallEast',
 'italy france franceSouth franceEast swissWest swiss swissNorth swissBridge junctionEast',
 'swiss greeceWest greece greeceHarbour greeceEast croatiaWest croatia russiaSouth',
 'teacups ireland irelandBridge irelandNorth irelandGarden irelandGate',
 'irelandNorth woodlandWest woodland woodlandEast englandWest england fairyWest fairy fairyNorth minimoysWest minimoys minimoysEast austriaNorth austriaBridge austria austriaEast portugalNorth spainWest spain',
 'england russiaNorth','fairyNorth lakeWest lakeSouth holland','hollandEast hallNorth batavia',
 'austriaNorth austriaBridge alpine lakeNorth','spain portugalNorth','greeceEast croatia','croatia luxWest'
];
export const EDGES:[string,string][]=lines.flatMap(line=>{const ids=line.split(' ');return ids.slice(1).map((id,i)=>[ids[i],id] as [string,string])});
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
 if(nearest.distance<=5)return intended;
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
export const SHUTTLE_GATE=NODES.avenue;
export function arenaGate(id:string):Point{
 if(id==='park-9')return NODES.italySouth;
 const aliases:Record<string,string>={'stage-voletarium':'park-1','stage-batavia':'park-6','stage-eurosat':'park-3','stage-bluefire':'park-8'};
 const point=mapPoint(aliases[id]??id);return point?projectToPath(point).point:SHUTTLE_GATE;
}
export function routeLength(route:Point[]){return route.slice(1).reduce((sum,p,i)=>sum+distance(route[i],p),0);}
