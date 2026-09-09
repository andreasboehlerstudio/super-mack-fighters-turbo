/** One art raster for the complete scene: actors, scenery, crowds and effects. */
export const RASTER_WIDTH=960,RASTER_HEIGHT=540;
export const CONSOLE_WIDTH=1280,CONSOLE_HEIGHT=720;
export const COMBAT_RENDER_ZOOM=RASTER_WIDTH/960;
export const FIGHTER_DISPLAY_SIZE=256;
export const UI_ART_SCALE=RASTER_WIDTH/CONSOLE_WIDTH;
export function artRasterSize(width:number,height:number){return {width:Math.max(1,Math.round(width*UI_ART_SCALE)),height:Math.max(1,Math.round(height*UI_ART_SCALE))};}
export function pixelScreenScale(width:number,height:number,dpr=1,pixelPerfect=true){
 const ratio=Number.isFinite(dpr)&&dpr>0?dpr:1;
 const fit=Math.max(.01,Math.min(width/CONSOLE_WIDTH,height/CONSOLE_HEIGHT));
 if(!pixelPerfect)return fit;
 const magnification=Math.floor(Math.min(width*ratio/RASTER_WIDTH,height*ratio/RASTER_HEIGHT));
 // Very small embedded views still fit; from one native raster upward use whole device pixels.
 return magnification>=1?magnification*RASTER_WIDTH/(CONSOLE_WIDTH*ratio):fit;
}
export const snapCombatPixel=(value:number)=>Math.round(value*COMBAT_RENDER_ZOOM)/COMBAT_RENDER_ZOOM;
export function pixelScreenFrame(width:number,height:number,dpr=1,pixelPerfect=true,expanded=true){
 const ratio=Number.isFinite(dpr)&&dpr>0?dpr:1,space=expanded?1:.78,scale=pixelScreenScale(width*space,height*space,ratio,pixelPerfect);
 return {scale,left:Math.round((width-CONSOLE_WIDTH*scale)*ratio/2)/ratio,top:Math.round((height-CONSOLE_HEIGHT*scale)*ratio/2)/ratio};
}
