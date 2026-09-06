// Walk phase follows travelled distance, so a planted foot does not slide when
// speed changes. Reversing travel reverses the cycle while facing the opponent.
export function advanceWalkPhase(phase:number,distance:number,stride:number,direction=1){
 if(!Number.isFinite(distance)||stride<=0)return phase;
 return ((phase+distance/stride*direction)%1+1)%1;
}
export const walkFrame=(phase:number,frames=4)=>Math.floor(((phase%1+1)%1)*frames)%frames;
