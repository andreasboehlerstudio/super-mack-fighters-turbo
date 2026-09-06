import {WORLD_WIDTH,WORLD_HEIGHT} from './park-layout';
export const WORLD_ART='/assets/atlas/park-1-detail.png';
export const WORLD_OVERVIEW='/assets/atlas/park-1-overview.png';
export function buildParkTexture(atlas:CanvasImageSource){
 const canvas=document.createElement('canvas');canvas.width=WORLD_WIDTH*2;canvas.height=WORLD_HEIGHT*2;
 const ctx=canvas.getContext('2d')!;ctx.imageSmoothingEnabled=false;
 ctx.drawImage(atlas,0,0,canvas.width,canvas.height);
 return canvas;
}
