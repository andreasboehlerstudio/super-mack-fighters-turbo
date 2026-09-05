'use client';
import {useEffect,useRef} from 'react';
import {fighter,station} from './data';
import {FighterPortrait} from './FighterPortrait';
import type {BattleConfig} from './scene';
import {arenaImage} from './arena-art';
export function VersusScreen({battle,onReady}:{battle:BattleConfig;onReady:()=>void}){
 const ready=useRef(onReady);ready.current=onReady;
 useEffect(()=>{let raf=0,last=0,elapsed=0,ended=false,padHeld=true;const finish=()=>{if(ended)return;ended=true;ready.current()};
  const key=(e:KeyboardEvent)=>{if(['Enter','Space'].includes(e.code)){e.preventDefault();if(elapsed>.7)finish()}};
  const draw=(time:number)=>{const dt=last?Math.min((time-last)/1000,.05):0;last=time;if(!document.hidden){elapsed+=dt;const pad=Array.from(navigator.getGamepads?.()??[]).find(p=>p?.connected),pressed=!!(pad?.buttons[0]?.pressed||pad?.buttons[9]?.pressed);if(pressed&&!padHeld&&elapsed>.7)finish();padHeld=pressed;if(elapsed>2.7)finish();}if(!ended)raf=requestAnimationFrame(draw)};
  window.addEventListener('keydown',key);raf=requestAnimationFrame(draw);return()=>{cancelAnimationFrame(raf);window.removeEventListener('keydown',key)};
 },[]);
 return <section className="versus-screen" aria-label={`${fighter(battle.p1).name} gegen ${fighter(battle.p2).name}`} onClick={()=>ready.current()}>
  <img className="versus-backdrop" src={arenaImage(battle.stationId)} alt=""/>
  <div className="versus-arena"><span>NÄCHSTER KAMPF</span><strong>{station(battle.stationId).name.toUpperCase()}</strong></div>
  <div className="versus-player one"><FighterPortrait id={battle.p1}/><div><small>1P</small><strong>{fighter(battle.p1).name}</strong></div></div>
  <div className="versus-player two"><FighterPortrait id={battle.p2}/><div><small>{battle.cpu?'CPU':'2P'}</small><strong>{fighter(battle.p2).name}</strong></div></div>
  <b className="versus-letter">VS</b><span className="versus-skip">ENTER / A</span>
 </section>;
}
