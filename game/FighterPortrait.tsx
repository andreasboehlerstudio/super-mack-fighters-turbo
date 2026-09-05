import {fighter,type FighterId} from './data';
import {useState} from 'react';
export function FighterPortrait({id,className=''}:{id:FighterId;className?:string}){
 const [failed,setFailed]=useState<string|null>(null);
 if(failed===id)return <span className={`fighter-portrait ${className}`} role="img" aria-label={`Pixelporträt von ${fighter(id).name}`} style={{backgroundColor:'#152442',backgroundImage:`url('/assets/${id}.png')`,backgroundRepeat:'no-repeat',backgroundSize:'788% 788%',backgroundPosition:'7.8% 4.5%'}}/>;
 return <img className={`fighter-portrait ${className}`} src={`/assets/portraits/${id}.png`} alt={`Pixelporträt von ${fighter(id).name}`} draggable={false} onError={()=>setFailed(id)}/>;
}
