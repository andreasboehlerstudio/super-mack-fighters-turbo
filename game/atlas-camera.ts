export type AtlasCamera={x:number;y:number;zoom:number};
export type AtlasSize={width:number;height:number};
export const ATLAS_SIZE={width:1484,height:1060};
export const fitAtlas=(viewport:AtlasSize)=>Math.min(viewport.width/ATLAS_SIZE.width,viewport.height/ATLAS_SIZE.height);
export function clampAtlas(camera:AtlasCamera,viewport:AtlasSize):AtlasCamera{
 const zoom=Math.max(1,Math.min(4,camera.zoom)),scale=fitAtlas(viewport)*zoom;
 const limitX=Math.max(0,(ATLAS_SIZE.width*scale-viewport.width)/2),limitY=Math.max(0,(ATLAS_SIZE.height*scale-viewport.height)/2);
 return {zoom,x:limitX?Math.max(-limitX,Math.min(limitX,camera.x)):0,y:limitY?Math.max(-limitY,Math.min(limitY,camera.y)):0};
}
export function zoomAtlas(camera:AtlasCamera,nextZoom:number,anchor:{x:number;y:number},viewport:AtlasSize):AtlasCamera{
 const zoom=Math.max(1,Math.min(4,nextZoom)),ratio=zoom/camera.zoom;
 return clampAtlas({zoom,x:anchor.x-(anchor.x-camera.x)*ratio,y:anchor.y-(anchor.y-camera.y)*ratio},viewport);
}
export function focusAtlas(point:readonly[number,number],viewport:AtlasSize,zoom=2.4):AtlasCamera{
 const scale=fitAtlas(viewport)*zoom;
 return clampAtlas({zoom,x:(.5-point[0])*ATLAS_SIZE.width*scale,y:(.5-point[1])*ATLAS_SIZE.height*scale},viewport);
}
