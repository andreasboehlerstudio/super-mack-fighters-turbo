import {SPECIAL_STAGES} from './stages';
import {station} from './data';
import {COASTERS} from './coasters';
import {ARENA_PHOTOS} from './arena-photos';
export const ARENA_ART=Object.fromEntries([
 ...Object.entries(ARENA_PHOTOS).map(([id,ref])=>[id,{url:`/assets/arenas/${id}.webp`,source:ref.source,alt:`${station(id).name} als neu gezeichnete Pixel-Art-Arena`}]),
 ...SPECIAL_STAGES.map(s=>[s.id,{url:`/assets/arenas/${s.id}.webp`,source:station(s.id).source,alt:`Eigenständige Pixel-Art-Spielinterpretation: ${s.name}`}]),
 ...COASTERS.map(c=>[c.id,{url:`/assets/arenas/${c.id}.webp`,source:`https://www.europapark.de/de/freizeitpark/attraktionen/${c.slug}`,alt:`Pixel-Art-Kampfhintergrund: ${c.name}`}])
]) as Record<string,{url:string;source:string;alt:string}>;
export const arenaImage=(id:string)=>ARENA_ART[id]?.url??`/assets/arena-${station(id).arena}.png`;
