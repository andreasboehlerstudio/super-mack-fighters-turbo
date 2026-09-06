import {WORLD_WIDTH,WORLD_HEIGHT} from './park-layout';
export const WORLD_ART='/assets/atlas/park-1.png';
export function buildParkTexture(atlas:CanvasImageSource){
 const canvas=document.createElement('canvas');canvas.width=WORLD_WIDTH;canvas.height=WORLD_HEIGHT;
 const ctx=canvas.getContext('2d')!;ctx.imageSmoothingEnabled=false;
 ctx.drawImage(atlas,0,0); // One source pixel is one world pixel for buildings and paths alike.
 return canvas;
}
