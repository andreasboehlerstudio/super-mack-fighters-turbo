import {WORLD_WIDTH,WORLD_HEIGHT} from './park-layout.ts';
export const PARK_DETAIL_SCALE=2;
export const PARK_TILE_PIXELS=256;
export const PARK_TILE_WORLD=PARK_TILE_PIXELS/PARK_DETAIL_SCALE;
export const PARK_VIEW_WIDTH=480,PARK_VIEW_HEIGHT=270;
export function visibleParkTiles(camera:{x:number;y:number},width=PARK_VIEW_WIDTH,height=PARK_VIEW_HEIGHT){
 const tiles:{key:string;x:number;y:number;width:number;height:number;url:string}[]=[];
 const firstX=Math.max(0,Math.floor((camera.x-width/2)/PARK_TILE_WORLD));
 const firstY=Math.max(0,Math.floor((camera.y-height/2)/PARK_TILE_WORLD));
 const lastX=Math.min(Math.ceil(WORLD_WIDTH/PARK_TILE_WORLD)-1,Math.floor((camera.x+width/2)/PARK_TILE_WORLD));
 const lastY=Math.min(Math.ceil(WORLD_HEIGHT/PARK_TILE_WORLD)-1,Math.floor((camera.y+height/2)/PARK_TILE_WORLD));
 for(let row=firstY;row<=lastY;row++)for(let col=firstX;col<=lastX;col++){
  const x=col*PARK_TILE_WORLD,y=row*PARK_TILE_WORLD;
  tiles.push({key:`${col}-${row}`,x,y,width:Math.min(PARK_TILE_WORLD,WORLD_WIDTH-x),height:Math.min(PARK_TILE_WORLD,WORLD_HEIGHT-y),url:`/assets/atlas/detail/${col}-${row}.webp`});
 }
 return tiles;
}
