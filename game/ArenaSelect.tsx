'use client';
import {useEffect,useRef} from 'react';
import {STATIONS,station,fighter,type FighterId} from './data';
import {arenaImage} from './arena-art';
import {FighterPortrait} from './FighterPortrait';

type Props={value:string;p1:FighterId;p2:FighterId;training:boolean;suspended:boolean;pad:number|null;onChange:(id:string)=>void;onConfirm:()=>void;onBack:()=>void};
export function ArenaSelect(props:Props){
 const latest=useRef(props);latest.current=props;
 const selected=station(props.value);
 useEffect(()=>{
  let held=true,backHeld=true,direction=0,next=0;
  const move=(delta:number)=>{const p=latest.current,at=STATIONS.findIndex(s=>s.id===p.value);p.onChange(STATIONS[(at+delta+STATIONS.length)%STATIONS.length].id)};
  const key=(e:KeyboardEvent)=>{if(latest.current.suspended)return;if(e.target instanceof HTMLElement&&e.target.closest('.console-menu'))return;const delta={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7,KeyA:-1,KeyD:1,KeyW:-7,KeyS:7}[e.code];if(delta){e.preventDefault();move(delta)}else if(e.code==='Escape'){e.preventDefault();latest.current.onBack()}else if(e.code==='Enter'&&(!(e.target instanceof HTMLButtonElement)||e.target.closest('.arena-select-grid'))){e.preventDefault();if(!e.repeat)latest.current.onConfirm()}};
  window.addEventListener('keydown',key);
  const timer=setInterval(()=>{const p=latest.current;if(p.suspended)return;const pads=navigator.getGamepads?.()??[],pad=p.pad===null?Array.from(pads).find(v=>v?.connected):pads[p.pad];if(!pad)return;const b=(i:number)=>!!pad.buttons[i]?.pressed,confirm=b(0)||b(9),back=b(1),delta=b(15)||pad.axes[0]>.5?1:b(14)||pad.axes[0]<-.5?-1:b(13)||pad.axes[1]>.5?7:b(12)||pad.axes[1]<-.5?-7:0,now=performance.now();if(delta&&(delta!==direction||now>=next)){move(delta);next=now+(delta!==direction?320:160)}direction=delta;if(confirm&&!held)p.onConfirm();if(back&&!backHeld)p.onBack();held=confirm;backHeld=back;},45);
  return()=>{clearInterval(timer);window.removeEventListener('keydown',key)};
 },[]);
 return <section className="arena-select" aria-label="Arena auswählen">
  <header><div><small>{props.training?'TRAINING':'VERSUS · FREIER KAMPF'}</small><h1>ARENA WÄHLEN</h1></div><span>21 THEMENBEREICHE</span></header>
  <div className="arena-select-preview"><img className="arena-select-art" src={arenaImage(props.value)} alt={selected.name+' – Kampfarena'}/><div className="arena-select-fighters"><FighterPortrait id={props.p1}/><span>{fighter(props.p1).short}<b>VS</b>{fighter(props.p2).short}</span><FighterPortrait id={props.p2}/></div><h2 aria-live="polite">{selected.name}</h2></div>
  <div className="arena-select-grid" role="group" aria-label="Kampfplätze">{STATIONS.map(area=><button key={area.id} aria-pressed={props.value===area.id} onClick={()=>props.onChange(area.id)} className={props.value===area.id?'is-selected':''}><img src={arenaImage(area.id)} alt=""/><span>{area.name}</span></button>)}</div>
  <footer><button className="arcade-button secondary" onClick={props.onBack}>◀ FIGUREN</button><span>← ↑ ↓ → WÄHLEN · A / ENTER BESTÄTIGEN</span><button className="arcade-button" onClick={props.onConfirm}>{props.training?'TRAINING STARTEN':'KAMPF STARTEN'} →</button></footer>
 </section>;
}
