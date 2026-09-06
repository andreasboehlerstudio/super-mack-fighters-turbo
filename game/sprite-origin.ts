import type {FighterId} from './data.ts';
export type SpriteKind='action'|'walk'|'motion';
const jumpFeet:Partial<Record<FighterId,number>>={roland:242,marianne:243,juergen:212,mauritia:205,thomas:206,katja:205,wakala:212};
/** Authored foot anchors, not pose-dependent stretching or alpha-box normalization. */
export function spriteOrigin(id:FighterId,kind:SpriteKind,frame:number){
 if(kind==='motion'){
  // These complete kick rows were shifted together to leave room for the extended shoe.
  const kick=frame>=24&&frame<32;
  return {x:kick&&id==='michael'?109:kick&&id==='graumacher'?111:id==='max'?123:id==='wakala'?108:128,y:frame>=32&&id!=='wakala'?224:246};
 }
 return {x:128,y:kind==='action'&&frame===4?(jumpFeet[id]??246):246};
}
