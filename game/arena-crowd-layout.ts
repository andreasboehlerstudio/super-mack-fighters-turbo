export type CrowdSpot={x:number;y:number};
const pair=(lx:number,ly:number,rx:number,ry:number):readonly CrowdSpot[]=>[{x:lx,y:ly},{x:rx,y:ry}];

/** Foot positions on visible ground, in the same 960×540 space as the arena camera.
 * The artwork's pavement edge differs by stage; it is not the combat floor or a shared horizon.
 * Both shoes must clear water, planters, fences and the bases of buildings.
 */
export const ARENA_CROWD_SPOTS:Record<string,readonly CrowdSpot[]>={
 'park-0':pair(130,427,815,427), // timber deck in front of the river
 'park-1':pair(190,443,790,443), // German plaza, clear of lamps and facade
 'park-2':pair(82,430,820,420), // left of the fountain; right-hand pavement
 'park-3':pair(120,404,830,404),
 'park-4':pair(145,410,800,410),
 'park-5':pair(120,410,830,410),
 'park-6':pair(145,420,800,420),
 'park-7':pair(120,410,830,410),
 'park-8':pair(145,430,800,430), // on the dock, not the lagoon
 'park-9':pair(120,422,825,420),
 'park-10':pair(135,435,800,435),
 'park-11':pair(145,436,805,436), // in front of the low stone wall
 'park-12':pair(145,447,800,447), // paved bank in front of the balloon pond
 'park-13':pair(125,420,825,420),
 'park-14':pair(145,439,800,439),
 'park-15':pair(130,445,815,445),
 'park-16':pair(210,435,790,435), // open quayside, clear of crates and benches
 'park-17':pair(140,415,825,415), // new Euro-Mir forecourt
 'park-18':pair(135,448,795,448), // below the chalet walls
 'park-19':pair(165,443,795,443),
 'park-20':pair(145,415,795,415),
 'coaster-alpenexpress':pair(150,432,805,432),
 'coaster-arthur':pair(140,449,795,449),
 'coaster-atlantica':pair(144,410,801,410),
 'coaster-baaa-express':pair(120,404,830,404),
 'coaster-blue-fire':pair(144,416,800,416),
 'coaster-bobbahn':pair(144,414,800,414),
 'coaster-euro-mir':pair(120,408,830,408),
 'coaster-eurosat':pair(120,420,830,420),
 'coaster-matterhorn':pair(144,418,800,418),
 'coaster-pegasus':pair(145,410,800,420),
 'coaster-poseidon':pair(144,415,800,415),
 'coaster-silver-star':pair(144,412,800,412),
 'coaster-voltron':pair(120,415,830,415),
 'coaster-wodan':pair(144,412,800,412),
 'stage-batavia':pair(145,412,800,412),
 'stage-blue-fire':pair(144,410,800,410),
 'stage-cosmic':pair(120,404,830,404),
 'stage-hq':pair(120,404,830,404),
 'stage-skyport':pair(120,404,830,404),
 'stage-svalgurok':pair(144,404,800,404),
 'stage-traumatica':pair(120,404,830,404)
};

/** Translate people and their contact shadows together, locked to whole scene pixels. */
export function crowdGroundPose(spot:CrowdSpot,pan=0){
 return {x:Math.round(spot.x-pan),y:spot.y,shadowY:spot.y+1};
}
