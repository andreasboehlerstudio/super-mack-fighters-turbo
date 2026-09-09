import {fighter,type FighterId} from './data';
import {useState} from 'react';
import {PixelArt} from './PixelArt';
export function FighterPortrait({id,className='',thumbnail=false}:{id:FighterId;className?:string;thumbnail?:boolean}){
 const [failed,setFailed]=useState<string|null>(null);
 if(failed===id)return <span className={`fighter-portrait ${className}`} role="img" aria-label={`Pixelporträt von ${fighter(id).name}`} style={{backgroundColor:'#152442',backgroundImage:`url('/assets/${id}.png')`,backgroundRepeat:'no-repeat',backgroundSize:'788% 788%',backgroundPosition:'7.8% 4.5%'}}/>;
 return <PixelArt className={`fighter-portrait ${className}`} src={`/assets/runtime/portraits/${id}${thumbnail?'-thumb':''}.webp?v=1`} alt={`Pixelporträt von ${fighter(id).name}`} onError={()=>setFailed(id)}/>;
}
