import {DISTRICTS,EDGES,NODES,PATH_WIDTH,WORLD_WIDTH,WORLD_HEIGHT} from './park-layout';
export const WORLD_ART='/assets/park-tiles-v2.png';
export function buildParkTexture(atlas:CanvasImageSource){
 const canvas=document.createElement('canvas');canvas.width=WORLD_WIDTH;canvas.height=WORLD_HEIGHT;
 const ctx=canvas.getContext('2d')!;ctx.imageSmoothingEnabled=false;
 for(let y=0;y<WORLD_HEIGHT;y+=64)for(let x=0;x<WORLD_WIDTH;x+=64)ctx.drawImage(atlas,768,768,256,256,x,y,64,64);
 // Draw one collision-aligned path mask, then fill it with the generated cobblestones.
 const mask=document.createElement('canvas');mask.width=WORLD_WIDTH;mask.height=WORLD_HEIGHT;const m=mask.getContext('2d')!;
 m.lineCap='square';m.lineJoin='miter';m.strokeStyle='#fff';m.lineWidth=PATH_WIDTH;
 for(const [a,b] of EDGES){m.beginPath();m.moveTo(NODES[a].x,NODES[a].y);m.lineTo(NODES[b].x,NODES[b].y);m.stroke();}
 for(const d of DISTRICTS)m.fillRect(d.x-22,d.y-4,44,44);
 const tile=document.createElement('canvas');tile.width=32;tile.height=32;const tc=tile.getContext('2d')!;tc.imageSmoothingEnabled=false;tc.drawImage(atlas,1024,768,256,256,0,0,32,32);
 // Composite the repeated texture in one draw: separate source-in tiles would erase previous paths.
 m.globalCompositeOperation='source-in';m.imageSmoothingEnabled=false;m.fillStyle=m.createPattern(tile,'repeat')!;m.fillRect(0,0,WORLD_WIDTH,WORLD_HEIGHT);
 ctx.drawImage(mask,0,0);
 for(const d of DISTRICTS)ctx.drawImage(atlas,d.tile%6*256,Math.floor(d.tile/6)*256,256,256,d.x-88,d.y-176,176,176);
 return canvas;
}
