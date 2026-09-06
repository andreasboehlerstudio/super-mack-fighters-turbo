import {DISTRICTS} from './park-layout.ts';
// Representative landmarks from Europa-Park's official interactive parkplan (2026-09-05).
// The illustration is a simplified game map; company stages belong to a separate tour chapter.
import {SPECIAL_STAGES} from './stages.ts';
import {COASTERS} from './coasters.ts';
export const MAP_SOURCE='https://www.europapark.de/de/freizeitpark/attraktionen/interaktiver-europa-park-parkplan';
export const PARK_COORDINATES:Record<string,[number,number]>={
 'park-0':[48.263254,7.721724], 'park-1':[48.26888354,7.72201145],
 'park-2':[48.26526313,7.72198224], 'park-3':[48.267345,7.72113],
 'park-4':[48.26657683,7.71944295], 'park-5':[48.264436,7.722543],
 'park-6':[48.26389425,7.72047363], 'park-7':[48.2661,7.723581],
 'park-8':[48.26289154,7.71867088], 'park-9':[48.26784026,7.72196878],
 'park-10':[48.26385125,7.72387299], 'park-11':[48.26575448,7.71963293],
 'park-12':[48.26591191,7.72171306], 'park-13':[48.26455214,7.7205158],
 'park-14':[48.26789417,7.72006714], 'park-15':[48.262636,7.722091],
 'park-16':[48.262055,7.721479], 'park-17':[48.26518754,7.72045036],
 'park-18':[48.266913,7.72049], 'park-19':[48.26286332,7.72016747],
 'park-20':[48.2616,7.722934]
};
const COASTER_COORDINATES:Record<string,[number,number]>={
 "coaster-baaa-express": [48.26623696,7.72322337],
 "coaster-alpenexpress": [
  48.262209,
  7.722644
 ],
 "coaster-arthur": [
  48.26385125,
  7.72387299
 ],
 "coaster-atlantica": [
  48.262055,
  7.721479
 ],
 "coaster-blue-fire": [
  48.26289154,
  7.71867088
 ],
 "coaster-euro-mir": [
  48.26509996,
  7.72005324
 ],
 "coaster-eurosat": [
  48.267345,
  7.72113
 ],
 "coaster-matterhorn": [
  48.266913,
  7.72049
 ],
 "coaster-pegasus": [
  48.26777171,
  7.71932955
 ],
 "coaster-bobbahn": [
  48.266435,
  7.721336
 ],
 "coaster-silver-star": [
  48.267746,
  7.720779
 ],
 "coaster-voltron": [
  48.26575448,
  7.71963293
 ],
 "coaster-wodan": [
  48.26167104,
  7.71856683
 ],
 "coaster-poseidon": [
  48.26657683,
  7.71944295
 ]
};
export function mapPoint(id:string){return DISTRICTS.find(d=>d.id===id)?.gate??null;}
export function mapStatus(id:string,route:string[],index:number){const at=route.indexOf(id);return at<0?'outside':at<index?'done':at===index?'current':at===index+1?'next':'future';}
