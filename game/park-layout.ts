export type Point={x:number;y:number};
export const WORLD_WIDTH=1792,WORLD_HEIGHT=1024,PATH_WIDTH=44;
// A readable game layout. All entrances open onto the same rendered path network.
const rows=[[8,19,17,6,10,15,20],[3,18,4,11,13,16,0],[1,9,2,7,5,12,14]];
const sprites=[0,1,2,3,4,5,6,7,8,9,20,10,11,12,12,13,14,15,16,17,18];
export const DISTRICTS=rows.flatMap((row,r)=>row.map((area,c)=>({id:'park-'+area,x:224+c*224,y:264+r*256,tile:sprites[area],gate:{x:224+c*224,y:304+r*256}})));
export const NODES:Record<string,Point>={entry:{x:224,y:944}};
export const EDGES:[string,string][]=[];
for(let r=0;r<3;r++){
 const keys:string[]=[];
 for(let c=0;c<15;c++){const id=`road-${r}-${c}`;NODES[id]={x:112+c*112,y:304+r*256};keys.push(id);if(c)EDGES.push([keys[c-1],id]);if(r&&c%2===0)EDGES.push([`road-${r-1}-${c}`,id]);}
}
EDGES.push(['entry','road-2-1']);
export function themeGate(id:string):Point{return DISTRICTS.find(d=>d.id===id)?.gate??NODES.entry;}
export function cameraTarget(p:Point,width=640,height=360):Point{return {x:Math.max(width/2,Math.min(WORLD_WIDTH-width/2,p.x)),y:Math.max(height/2,Math.min(WORLD_HEIGHT-height/2,p.y))};}
