'use client';
import {useEffect,useRef,useState} from 'react';
import {FighterPortrait} from './FighterPortrait';
import {newJoinPress,type PlayerPads} from './match-setup';
import type {FighterId} from './data';

export function JoinScreen({hero,opponent,hostPad,suspended,onJoin,onKeyboard,onBack}:{hero:FighterId;opponent:FighterId;hostPad:number|null;suspended:boolean;onJoin:(pads:PlayerPads)=>void;onKeyboard:()=>void;onBack:()=>void}){
 const current=useRef({hostPad,onJoin,onBack,suspended});current.current={hostPad,onJoin,onBack,suspended};
 const [hostConnected,setHostConnected]=useState(true);
 useEffect(()=>{
  const previous=new Map<number,boolean>();let raf=0;
  const key=(event:KeyboardEvent)=>{if(current.current.suspended||event.repeat)return;if(event.code==='Digit2'||event.code==='Numpad2'){event.preventDefault();current.current.onJoin([current.current.hostPad,null]);}else if(event.code==='Escape'){event.preventDefault();current.current.onBack();}};
  const poll=()=>{raf=requestAnimationFrame(poll);const pads=Array.from(navigator.getGamepads?.()??[]).filter((p):p is Gamepad=>!!p?.connected);setHostConnected(current.current.hostPad===null||pads.some(p=>p.index===current.current.hostPad));
   for(const pad of pads){const pressed=!!pad.buttons[9]?.pressed;if(!current.current.suspended&&newJoinPress(pad.index,current.current.hostPad,pressed,previous.get(pad.index)))current.current.onJoin([current.current.hostPad,pad.index]);previous.set(pad.index,pressed);}
   for(const index of previous.keys())if(!pads.some(p=>p.index===index))previous.delete(index);
  };
  window.addEventListener('keydown',key);raf=requestAnimationFrame(poll);return()=>{cancelAnimationFrame(raf);window.removeEventListener('keydown',key)};
 },[]);
 return <section className="join-screen" aria-label="Zweiten Spieler anmelden">
  <div className="join-heading"><span>FREIER KAMPF · GEGEN MENSCHEN</span><h1>HERE COMES A NEW CHALLENGER!</h1></div>
  <div className="join-seats"><div className="join-seat"><FighterPortrait id={hero}/><strong>SPIELER 1</strong><span>{hostConnected?'BEREIT':'CONTROLLER GETRENNT'}</span><p>{hostPad===null?'TASTATUR · WASD / F / G':'CONTROLLER '+(hostPad+1)}</p>{hostPad!==null&&<button className="text-button" onClick={onKeyboard}>1P mit Tastatur spielen</button>}</div>
   <b className="join-vs">VS</b>
   <div className="join-seat waiting"><FighterPortrait id={opponent}/><strong>SPIELER 2</strong><span role="status">WARTE AUF BEITRITT</span><p>TASTE 2 ODER START AUF DEINEM CONTROLLER</p><button className="arcade-button" disabled={!hostConnected} onClick={()=>onJoin([hostPad,null])}>2P · Mit Tastatur beitreten</button></div>
  </div>
  <p className="join-note">An einem Gerät · 2P spielt mit Pfeiltasten, J und K oder einem eigenen Controller.</p>
  <button className="text-button join-back" onClick={onBack}>◀ ZURÜCK ZUR MODUSWAHL</button>
 </section>;
}
