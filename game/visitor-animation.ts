// Measured sole pixels in the four original 256px visitor rows.
const soles=[216,216,216,217,216,217,216,216,216,217,216,216,217,217,217,217];
export function visitorOrigin(frame:number){return {x:128,y:soles[frame]??216};}
