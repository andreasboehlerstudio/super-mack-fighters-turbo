'use client';
import {useEffect,useRef,useState} from 'react';
import {station} from './data';
import {ParkAtlas} from './ParkAtlas';
import {DISTRICTS,WORLD_WIDTH,WORLD_HEIGHT} from './park-layout';
import {WORLD_ART,buildParkTexture} from './park-render';
import {mapStatus} from './park-map';
import {drawParkGuide} from './park-guide';
import {findWalkRoute,type Point} from './park-world';
import {loadParkCollision} from './park-collision';
function WalkingMap({route,index,compact=false,position,onAtlas}:{route:string[];index:number;compact?:boolean;position?:Point|null;onAtlas:()=>void}){
 const current=route[index],next=route[index+1],[inspected,setInspected]=useState(current),canvas=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{let alive=true;const image=new Image();image.onload=()=>{if(!alive||!canvas.current)return;const c=canvas.current.getContext('2d')!;c.imageSmoothingEnabled=false;c.drawImage(buildParkTexture(image),0,0,896,640);if(position)void loadParkCollision().then(allowed=>{if(!alive)return;const goal=DISTRICTS.find(d=>d.id===current);if(goal){const path=findWalkRoute(position,goal.gate,allowed);drawParkGuide(c,path.map(p=>({x:p.x/WORLD_WIDTH*896,y:p.y/WORLD_HEIGHT*640})),3);}}).catch(()=>{});};image.src=WORLD_ART;return()=>{alive=false}},[current,position]);
 return <section className={'tour-map pixel-tour-map '+(compact?'compact-map':'')} aria-label="Parkplan deiner Arena-Tour"><div className="map-toolbar"><button onClick={onAtlas}>← PIXELATLAS</button><span>LAUFWEGE</span><button onClick={()=>setInspected(current)}>◎ TOURZIEL</button></div><div className="park-map-surface"><canvas ref={canvas} className="park-map-art" width="896" height="640" aria-label="Übersicht derselben begehbaren Pixelwelt"/>{DISTRICTS.map(d=>{const state=mapStatus(d.id,route,index),order=route.indexOf(d.id);return <button key={d.id} className={'map-pin '+state+(inspected===d.id?' inspected':'')} style={{left:d.gate.x/WORLD_WIDTH*100+'%',top:d.gate.y/WORLD_HEIGHT*100+'%'}} onClick={()=>setInspected(d.id)} aria-label={station(d.id).name+' auf der Karte'} aria-pressed={d.id===inspected}>{state==='done'?'✓':order>=0?order+1:'·'}{(d.id===inspected||state==='current')&&<b>{station(d.id).name}</b>}</button>})}{position&&<span className="map-player-location" style={{left:position.x/WORLD_WIDTH*100+'%',top:position.y/WORLD_HEIGHT*100+'%'}} aria-label="Dein Standort">●</span>}</div><div className="map-legend"><span>✓ Besucht</span><span>◆ Nächster Kampf: {station(current).name}</span><span>● Du</span></div><div className="tour-next"><span>AUSGEWÄHLT<strong>{station(inspected).name}</strong></span><span>{next?'DANACH':'FINALE'}<strong>{next?station(next).name:station(current).name}</strong></span></div><p className="map-source-note">Vereinfachte Spielwelt · 21 Themenbereiche · durchgehende Laufwege</p></section>
}

export function TourMap(props:{route:string[];index:number;compact?:boolean;position?:Point|null}){const [walking,setWalking]=useState(false);return walking?<WalkingMap {...props} onAtlas={()=>setWalking(false)}/>:<ParkAtlas position={props.position} route={props.route} index={props.index} onWalkingMap={()=>setWalking(true)}/>;}
