export type Point={x:number;y:number};
export const WORLD_WIDTH=1484,WORLD_HEIGHT=1060,PATH_WIDTH=24;
// Trace the cream paths of atlas/park-1.png at its native resolution.
export const NODES:Record<string,Point>={};
export const EDGES:[string,string][]=[];
type Stop=readonly [string,number,number];
function road(...stops:Stop[]){for(let i=0;i<stops.length;i++){const [id,x,y]=stops[i];NODES[id]={x,y};if(i)EDGES.push([stops[i-1][0],id]);}}
road(['entry',756,238],['central-north',756,342],['central-bend',757,397],['hub',784,446],['lux-north',784,502]);
road(['central-north',756,342],['france-east',669,343],['swiss-ne',628,364],['swiss-east',628,423],['swiss-se',590,446],['west-hub',527,466],['swiss-south',434,456],['west-cross',292,455]);
road(['west-cross',292,455],['greece-east',281,402],['greece-turn',283,364],['monaco-south',289,301],['monaco',286,243]);
road(['greece-east',281,402],['greece-gate',261,421],['greece',207,422]);
road(['hub',784,446],['liechtenstein',884,442],['east-hub',1109,442],['ireland-west',1162,457],['ireland',1304,457]);
road(['east-hub',1109,442],['italy-south',1104,326],['italy',1102,269]);
road(['west-cross',292,455],['croatia-ne',295,519],['croatia-east',270,564],['west-middle',255,615]);
road(['west-hub',527,466],['russia-east',521,539],['middle-west',527,569],['russia-se',502,612],['russia',407,635],['russia-sw',346,634],['west-middle',255,615]);
road(['middle-west',527,569],['england-sw',553,604],['england',620,617],['england-se',667,602],['lux-west',692,580]);
road(['lux-north',784,502],['lux-nw',740,531],['lux-west',692,580],['lux-sw',679,614],['lux-south-west',718,647],['luxembourg',802,657],['lux-se',852,650],['middle-east',904,624]);
road(['lux-north',784,502],['lux-ne',842,530],['lux-east',879,570],['middle-east',904,624]);
road(['middle-east',904,624],['grimm-west',971,630],['grimm',1019,650],['east-middle',1124,658]);
road(['east-hub',1109,442],['east-bend',1138,459],['grimm-east',1144,545],['east-middle',1124,658],['minimoys-west',1172,691],['southeast-cross',1202,700],['minimoys',1265,685]);
road(['west-middle',255,615],['holland-nw',248,666],['holland-west',250,736],['holland-sw',251,774],['southwest-cross',309,811]);
road(['southwest-cross',309,811],['holland-south',358,797],['holland',410,799],['holland-se',453,819],['lake-west',521,819],['lake-bridge-west',576,791],['lake-bridge',622,790],['lake-southwest',667,810],['portugal-north',708,839],['south-hub',805,840],['lake-southeast',869,809],['adventure',949,806],['austria-ne',1057,808],['southeast-bend',1125,817],['right-lake',1202,765],['southeast-cross',1202,700]);
road(['southwest-cross',309,811],['island-ne',303,864],['island-east',301,932],['island-se',307,969],['scandinavia-sw',355,1009],['scandinavia',438,1021],['scandinavia-se',510,1002],['scandinavia-east',556,953],['scandinavia-ne',540,917]);
road(['south-hub',805,840],['austria-west',819,882],['austria-sw',814,961],['austria',794,1005]);
road(['southeast-bend',1125,817],['spain-nw',1103,837],['spain-west',1106,907],['spain-sw',1107,962],['spain',1141,994]);
const gates:Record<number,string>={0:'adventure',1:'entry',2:'england',3:'france-east',4:'greece',5:'grimm',6:'holland',7:'ireland',8:'island-east',9:'italy',10:'minimoys',11:'west-middle',12:'liechtenstein',13:'luxembourg',14:'monaco',15:'austria-west',16:'portugal-north',17:'russia',18:'swiss-south',19:'scandinavia-sw',20:'spain-west'};
export const DISTRICTS=Object.entries(gates).map(([area,node])=>({id:'park-'+area,...NODES[node],gate:NODES[node]}));
export function themeGate(id:string):Point{return DISTRICTS.find(d=>d.id===id)?.gate??NODES.entry;}
export function cameraTarget(p:Point,width=640,height=360):Point{return {x:Math.max(width/2,Math.min(WORLD_WIDTH-width/2,p.x)),y:Math.max(height/2,Math.min(WORLD_HEIGHT-height/2,p.y))};}
