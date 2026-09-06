import {fighter,type FighterId} from './data';
import {movesFor,moveCommand,ultraFor} from './moves';
export function MoveList({id,player=0}:{id:FighterId;player?:number}){return <section className="move-list"><h3>{fighter(id).short}</h3>{movesFor(id).map(move=><div key={move.input}><strong>{move.name}</strong><span>{moveCommand(move.input,player)}</span></div>)}<div className="ultra-command"><strong>{ultraFor(id).name}</strong><span>{player?'O':'R'} / Y · SUPER 100%</span></div></section>}
