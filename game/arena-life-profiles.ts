import {COASTERS} from './coasters.ts';
import {ARENA_CROWD_SPOTS,type CrowdSpot} from './arena-crowd-layout.ts';
export type SceneryEvent='leaves'|'fireflies'|'fountain'|'steam'|'electric'|'harbor'|'lamps';
type Point=readonly [number,number];
export type Ride={frame:number;path:readonly Point[];duration:number;period:number;rotate?:boolean};
export type ArenaLifeProfile={area:string;event:SceneryEvent;night:boolean;crowd:readonly CrowdSpot[];sources:readonly Point[];ride?:Ride};
const events:SceneryEvent[]=['harbor','leaves','fountain','fountain','harbor','fireflies','lamps','leaves','harbor','fountain','fireflies','electric','fountain','fountain','leaves','steam','harbor','steam','steam','lamps','fountain'];
const sources:Record<number,Point[]>={2:[[.28,.715]],3:[[.32,.69],[.59,.70]],9:[[.21,.61],[.30,.62]],12:[[.42,.64],[.58,.64]],13:[[.11,.68],[.88,.68]],15:[[.74,.42]],17:[[.80,.42]],18:[[.26,.27],[.68,.24]],20:[[.28,.65]]};
const rides:Record<number,Ride>={
 2:{frame:2,path:[[.355,.45],[.58,.355],[.82,.256],[1.08,.155]],duration:9,period:19,rotate:true},
 4:{frame:0,path:[[.807,.327],[.837,.27],[.866,.226],[.895,.184],[.926,.166],[.960,.168],[1.045,.214]],duration:3.8,period:16,rotate:true},
 8:{frame:4,path:[[.07,.718],[.13,.72],[.20,.728]],duration:17,period:29},
 11:{frame:3,path:[[1.05,.116],[.966,.17],[.90,.227],[.842,.297],[.79,.376],[.75,.447],[.71,.508]],duration:4.5,period:17,rotate:true},
 12:{frame:6,path:[[.12,.19],[.28,.15],[.46,.11]],duration:22,period:35},
 16:{frame:5,path:[[.32,.711],[.45,.696],[.58,.668]],duration:13,period:25}
};
export function arenaLifeProfile(id:string):ArenaLifeProfile{
 const special:Record<string,string>={'stage-svalgurok':'park-8','stage-batavia':'park-6','stage-skyport':'park-1','stage-cosmic':'park-3','stage-blue-fire':'park-8','stage-hq':'park-1','stage-traumatica':'park-5'};
 const area=COASTERS.find(c=>c.id===id)?.area??special[id]??id,index=Number(area.split('-')[1]),valid=Number.isInteger(index)&&index>=0&&index<21?index:1;
 // Paths are authored for the matching backdrop only; coaster close-ups keep their own effects.
 return {area:`park-${valid}`,event:id==='park-17'?'lamps':events[valid],night:[3,5,6,10,11,13,17,18,19].includes(valid),crowd:ARENA_CROWD_SPOTS[id]??ARENA_CROWD_SPOTS['park-'+valid],sources:id===area&&id!=='park-17'?sources[valid]??[]:[],ride:id===area?rides[valid]:undefined};
}
export function ridePose(ride:Ride,tick:number){
 const seconds=tick/60,phase=(seconds+2)%ride.period;
 if(phase>ride.duration)return null;
 const lengths=ride.path.slice(1).map((p,i)=>Math.hypot((p[0]-ride.path[i][0])*960,(p[1]-ride.path[i][1])*540)),total=lengths.reduce((a,b)=>a+b,0);let offset=phase/ride.duration*total;
 for(let i=0;i<lengths.length;i++){if(offset<=lengths[i]||i===lengths.length-1){const a=ride.path[i],b=ride.path[i+1],f=offset/lengths[i];return {x:(a[0]+(b[0]-a[0])*f)*980-10,y:(a[1]+(b[1]-a[1])*f)*552-6,angle:ride.rotate?Math.atan2((b[1]-a[1])*552,(b[0]-a[0])*980):0,alpha:Math.min(1,phase*2,(ride.duration-phase)*2),flip:b[0]<a[0]};}offset-=lengths[i];}return null;
}
