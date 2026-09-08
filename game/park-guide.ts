import type {Point} from './park-layout';
export const ROUTE_COLOR='#29e4ff',TARGET_COLOR='#36f0bc',GUIDE_OUTLINE='#14203e';
/** Same high-contrast route treatment in the world and the overview. */
export function drawParkGuide(ctx:CanvasRenderingContext2D,points:Point[],width=2){
 if(points.length<2)return;
 ctx.save();ctx.setLineDash([]);ctx.lineJoin='round';ctx.lineCap='round';
 ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));
 ctx.strokeStyle=GUIDE_OUTLINE;ctx.lineWidth=width+2;ctx.stroke();
 ctx.strokeStyle=ROUTE_COLOR;ctx.lineWidth=width;ctx.stroke();ctx.restore();
}
