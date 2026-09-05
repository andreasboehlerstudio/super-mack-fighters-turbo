import {station} from './data';
import {COASTERS} from './coasters';
import {ARENA_PHOTOS} from './arena-photos';
export const ARENA_ART=Object.fromEntries([
 ...Object.entries(ARENA_PHOTOS).map(([id,ref])=>[id,{url:`/assets/arenas/${id}.png`,source:ref.source,alt:`${station(id).name} als neu gezeichnete Pixel-Art-Arena`}]),
 ...COASTERS.map(c=>[c.id,{url:`/assets/arenas/${c.id}.png`,source:`https://www.europapark.de/de/freizeitpark/attraktionen/${c.slug}`,alt:`Pixel-Art-Kampfhintergrund: ${c.name}`}])
]) as Record<string,{url:string;source:string;alt:string}>;
export const arenaImage=(id:string)=>ARENA_ART[id]?.url??`/assets/arena-${station(id).arena}.png`;
