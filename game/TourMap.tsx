import {useState} from 'react';
import {STATIONS,station} from './data';
import {MAP_SOURCE,mapPoint,mapStatus} from './park-map';
import type {Point} from './park-world';

export function TourMap({route,index,compact=false,position}:{route:string[];index:number;compact?:boolean;position?:Point|null}){
 const current=route[index],next=route[index+1];
 const [inspected,setInspected]=useState(current);
 const [filter,setFilter]=useState<'tour'|'areas'|'coasters'>('tour');
 const point=mapPoint(inspected),status=mapStatus(inspected,route,index);
 const parkStages=STATIONS.filter(s=>mapPoint(s.id));
 const travel=route.slice(0,index+2).filter(id=>mapPoint(id));
 const backstage=route.filter(id=>!mapPoint(id));
 const focus=station(inspected);
 return <section className={`tour-map ${compact?'compact-map':''}`} aria-label="Parkplan deiner Arena-Tour">
  <div className="map-toolbar"><span>EUROPA-PARK / TOURKARTE</span><button onClick={()=>setFilter(filter==='tour'?'areas':filter==='areas'?'coasters':'tour')}>{filter==='tour'?'THEMENBEREICHE ANZEIGEN':filter==='areas'?'ACHTERBAHNEN ANZEIGEN':'MEINE TOUR ANZEIGEN'}</button></div>
  <div className="park-map-surface">
   <svg className="park-map-art" viewBox="0 0 1024 648" role="img" aria-label="Europa-Park-Parkplan mit eingezeichneter Tour"><image href="/assets/park-map.png" width="1024" height="768" y="-120"/><rect width="1024" height="648" fill="#0d2949" opacity=".23"/>{travel.slice(1).map((id,i)=>{const a=mapPoint(travel[i])!,b=mapPoint(id)!;return <path key={id} d={`M ${a.x} ${a.y} L ${b.x} ${b.y}`} stroke={mapStatus(id,route,index)==='next'?'#ffde80':'#89f0ce'} strokeWidth="5" strokeDasharray="8 8" fill="none"/>})}</svg>
   <div className="map-location-banner"><span>{status==='current'?(position?'▼ DEINE NÄCHSTE ARENA':'▼ AKTUELLE ARENA'):status==='done'?'✓ BESUCHT':status==='next'?'→ NÄCHSTER HALT':status==='outside'?'ORT ANSEHEN':'TOURZIEL'}</span><strong>{focus.name}</strong></div>
   {position&&<span className="map-player-location" role="img" aria-label="Dein Standort in der Parkwelt" style={{left:`${position.x/1024*100}%`,top:`${position.y/648*100}%`}}>●<b>DU</b></span>}
   {parkStages.filter(s=>filter==='tour'?route.includes(s.id):s.kind===(filter==='areas'?'Themenbereich':'Achterbahn')).map(s=>{const p=mapPoint(s.id)!,state=mapStatus(s.id,route,index),order=route.indexOf(s.id);return <button key={s.id} className={`map-pin ${state} ${inspected===s.id?'inspected':''}`} style={{left:`${p.x/1024*100}%`,top:`${p.y/648*100}%`}} aria-label={`${s.name} auf der Karte${state==='current'?', aktuelles Tourziel':''}`} aria-pressed={inspected===s.id} title={s.name} onClick={()=>setInspected(s.id)}><span>{state==='done'?'✓':order>=0?order+1:'·'}</span>{(inspected===s.id||state==='current'||state==='next')&&<b>{s.name}</b>}</button>})}
   {!point&&<div className="map-chapter"><span>{inspected==='finale'?'★ FINALE':'◆ HINTER DEN KULISSEN'}</span><p>Dieses Tourziel liegt außerhalb des hier dargestellten Parkplans.</p></div>}
   <button className="map-recenter" onClick={()=>setInspected(current)}>◎ AKTUELLES TOURZIEL</button>
  </div>
  <div className="map-legend"><span className="legend-done">■ Besucht</span><span className="legend-current">■ Aktuelle Arena</span><span className="legend-next">□ Nächster Halt</span>{position&&<span>● Dein Standort</span>}</div>
  <div className="backstage-route"><div className="backstage-heading">AUSSENARENEN & STUDIOS <span>Eigenes Tourkapitel außerhalb des Parkplans</span></div><div className="backstage-nodes">{backstage.map(id=>{const s=station(id),state=mapStatus(id,route,index);return <button key={id} className={`backstage-node ${state} ${id===inspected?'inspected':''}`} onClick={()=>setInspected(id)} aria-label={`${s.name} auf der Tour`}><i>{state==='done'?'✓':id==='finale'?'★':route.indexOf(id)+1}</i><span>{s.name}</span></button>})}</div></div>
  <div className="tour-next"><span>JETZT <strong>{station(current).name}</strong></span><span>{next?'DANACH':'LETZTES DUELL'} <strong>{next?station(next).name:'Der Graumacher'}</strong></span></div>
  <p className="map-source-note">Pixel-Art nach dem <a href={MAP_SOURCE} target="_blank" rel="noreferrer">offiziellen Parkplan ↗</a>. Die Linie zeigt die Duellfolge.</p>
 </section>
}
