'use client';
import {useEffect,useRef,useState,type PointerEvent as ReactPointerEvent} from 'react';
import {STATIONS,station} from './data';
import {ATLAS_SIZE,clampAtlas,fitAtlas,focusAtlas,zoomAtlas,type AtlasCamera} from './atlas-camera';
import {WORLD_WIDTH,WORLD_HEIGHT,type Point} from './park-layout';
import {mapStatus} from './park-map';

const variants=['Klassische Oberwelt','Kompakte Spielkarte','Grüne Parklandschaft','Abendzauber'];
// Normalized landmark centers, aligned to the individually illustrated maps.
const locations:Record<number,readonly[number,number]>={0:[.52,.68],1:[.50,.08],2:[.41,.49],3:[.40,.23],4:[.10,.29],5:[.69,.49],6:[.27,.66],7:[.85,.33],8:[.11,.85],9:[.73,.15],10:[.87,.53],11:[.095,.50],12:[.59,.33],13:[.53,.55],14:[.18,.14],15:[.63,.85],16:[.44,.85],17:[.27,.48],18:[.30,.32],19:[.29,.87],20:[.86,.85]};
const compactLocations:Record<number,readonly[number,number]>={...locations,1:[.48,.09],3:[.60,.25],9:[.68,.13],12:[.49,.40],2:[.68,.44],5:[.83,.47],13:[.49,.54],6:[.16,.62],10:[.84,.65],0:[.49,.65],14:[.21,.13],17:[.28,.43]};
const gardenLocations:Record<number,readonly[number,number]>={...locations,1:[.54,.12],9:[.78,.22],3:[.52,.28],18:[.34,.34],12:[.57,.41],2:[.43,.49],5:[.75,.54],13:[.59,.55],10:[.89,.62],6:[.23,.64],0:[.49,.69],4:[.11,.31],17:[.26,.49]};
const nightLocations:Record<number,readonly[number,number]>={...locations,14:[.26,.12],1:[.50,.09],9:[.78,.13],3:[.61,.25],18:[.35,.26],12:[.50,.38],2:[.69,.42],5:[.69,.57],13:[.49,.51],10:[.89,.59],6:[.21,.60],0:[.47,.68],17:[.30,.42],11:[.12,.44],4:[.12,.24],16:[.46,.87]};
export function ParkAtlas({route,index,position,onWalkingMap}:{route:string[];index:number;position?:Point|null;onWalkingMap?:()=>void}){
 const current=route[index]??'park-1',viewport=useRef<HTMLDivElement>(null),[size,setSize]=useState({width:800,height:445});
 const [camera,setCamera]=useState<AtlasCamera>({x:0,y:0,zoom:1}),[variant,setVariant]=useState(0),[selected,setSelected]=useState(current),[ready,setReady]=useState(false),[failed,setFailed]=useState(false);
 const cameraRef=useRef(camera),sizeRef=useRef(size),pointers=useRef(new Map<number,{x:number;y:number}>()),gesture=useRef<{x:number;y:number;distance:number}|null>(null),moved=useRef(false);
 cameraRef.current=camera;sizeRef.current=size;
 const points=[locations,compactLocations,gardenLocations,nightLocations][variant];
 const changeCamera=(value:AtlasCamera)=>{cameraRef.current=value;setCamera(value)};
 useEffect(()=>{const el=viewport.current!;const update=()=>{const next={width:el.clientWidth,height:el.clientHeight};sizeRef.current=next;setSize(next);setCamera(c=>clampAtlas(c,next))};update();const observer=new ResizeObserver(update);observer.observe(el);return()=>observer.disconnect()},[]);
 useEffect(()=>{const el=viewport.current!;const wheel=(e:WheelEvent)=>{e.preventDefault();const rect=el.getBoundingClientRect(),sz=sizeRef.current;const anchor={x:(e.clientX-rect.left)*sz.width/rect.width-sz.width/2,y:(e.clientY-rect.top)*sz.height/rect.height-sz.height/2};const updated=zoomAtlas(cameraRef.current,cameraRef.current.zoom*Math.exp(-e.deltaY*.0015),anchor,sz);cameraRef.current=updated;setCamera(updated)};el.addEventListener('wheel',wheel,{passive:false});return()=>el.removeEventListener('wheel',wheel)},[]);
 const localPoint=(e:ReactPointerEvent)=>{const rect=viewport.current!.getBoundingClientRect();return{x:(e.clientX-rect.left)*size.width/rect.width,y:(e.clientY-rect.top)*size.height/rect.height}};
 const measure=()=>{const p=[...pointers.current.values()];if(!p.length)return null;return{x:p.reduce((n,v)=>n+v.x,0)/p.length,y:p.reduce((n,v)=>n+v.y,0)/p.length,distance:p.length>1?Math.hypot(p[1].x-p[0].x,p[1].y-p[0].y):0}};
 const down=(e:ReactPointerEvent<HTMLDivElement>)=>{if(e.button!==0)return;pointers.current.set(e.pointerId,localPoint(e));gesture.current=measure();moved.current=false;e.currentTarget.setPointerCapture(e.pointerId);e.currentTarget.focus({preventScroll:true})};
 const move=(e:ReactPointerEvent)=>{if(!pointers.current.has(e.pointerId))return;pointers.current.set(e.pointerId,localPoint(e));const previous=gesture.current,next=measure();if(previous&&next){const dx=next.x-previous.x,dy=next.y-previous.y;if(Math.abs(dx)+Math.abs(dy)>2)moved.current=true;let value=cameraRef.current;if(previous.distance>0&&next.distance>0)value=zoomAtlas(value,value.zoom*next.distance/previous.distance,{x:previous.x-size.width/2,y:previous.y-size.height/2},size);changeCamera(clampAtlas({...value,x:value.x+dx,y:value.y+dy},size))}gesture.current=next};
 const up=(e:ReactPointerEvent)=>{pointers.current.delete(e.pointerId);gesture.current=measure()};
 const focus=(id:string)=>{setSelected(id);const point=points[Number(id.replace('park-',''))];if(point)changeCamera(focusAtlas(point,size))};
 const zoom=(amount:number)=>changeCamera(zoomAtlas(cameraRef.current,cameraRef.current.zoom+amount,{x:0,y:0},size));
 const reset=()=>changeCamera({x:0,y:0,zoom:1});
 const scale=fitAtlas(size)*camera.zoom;
 return <section className="park-atlas" aria-label="Pixel-Parkatlas mit Zoom">
  <div className="atlas-toolbar"><button onClick={()=>focus(current)}>{route.length?"◎ TOURZIEL":"◎ EINGANG"}</button><div role="group" aria-label="Kartenansicht">{variants.map((label,i)=><button key={label} aria-label={label} title={label} aria-pressed={variant===i} onClick={()=>{if(i===variant)return;setVariant(i);setReady(false);setFailed(false);reset()}}>{i+1}</button>)}</div>{onWalkingMap?<button onClick={onWalkingMap}>LAUFWEGE</button>:<span className="atlas-count">21 THEMENBEREICHE</span>}</div>
  <div ref={viewport} className="atlas-viewport" tabIndex={0} aria-label="Karte: ziehen zum Verschieben, Mausrad oder Plus und Minus zum Zoomen, Pfeiltasten zum Verschieben, 0 für Übersicht." onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onLostPointerCapture={up}
   onKeyDown={e=>{const offsets:Record<string,[number,number]>={ArrowLeft:[60,0],ArrowRight:[-60,0],ArrowUp:[0,60],ArrowDown:[0,-60]};if(offsets[e.key]){e.preventDefault();e.stopPropagation();const [x,y]=offsets[e.key];changeCamera(clampAtlas({...cameraRef.current,x:cameraRef.current.x+x,y:cameraRef.current.y+y},size))}else if(['+','=','-','0'].includes(e.key)){e.preventDefault();e.stopPropagation();e.key==='0'?reset():zoom(e.key==='-'?-.4:.4)}}}>
   <div className="atlas-artboard" style={{width:ATLAS_SIZE.width,height:ATLAS_SIZE.height,transform:`translate(${size.width/2+camera.x}px,${size.height/2+camera.y}px) scale(${scale}) translate(-50%,-50%)`}}>
    <img key={variant} src={`/assets/atlas/park-${variant+1}.png`} alt={`${variants[variant]}: Europa-Park als Pixel-Oberwelt mit 21 Themenbereichen`} width={1484} height={1060} draggable={false} onLoad={()=>setReady(true)} onError={()=>{setFailed(true);setReady(true)}}/>
    {variant===0&&position&&<span className="map-player-location" style={{left:position.x/WORLD_WIDTH*100+'%',top:position.y/WORLD_HEIGHT*100+'%',transform:`translate(-50%,-50%) scale(${1/scale})`}} aria-label="Dein Standort">●</span>}
    {ready&&!failed&&STATIONS.map(area=>{const p=points[Number(area.id.replace('park-',''))];if(!p)return null;const state=mapStatus(area.id,route,index);return <button key={area.id} className={`atlas-marker ${state} ${selected===area.id?'is-selected':''}`} style={{left:p[0]*100+'%',top:p[1]*100+'%',transform:`translate(-50%,-50%) scale(${1/scale})`}} aria-label={area.name+' heranzoomen'} aria-pressed={selected===area.id} onPointerDown={e=>e.stopPropagation()} onClick={()=>focus(area.id)}>{state==='done'?'✓':route.length&&area.id===current?'◆':'+'}</button>})}
   </div>
   {!ready&&<span className="atlas-loading">PARKKARTE LÄDT …</span>}{failed&&<span className="atlas-loading">Die Karte konnte nicht geladen werden.{onWalkingMap&&<button onClick={onWalkingMap}>Laufkarte öffnen</button>}</span>}
   <div className="atlas-zoom" role="group" aria-label="Zoom" onPointerDown={e=>e.stopPropagation()}><button aria-label="Verkleinern" disabled={camera.zoom<=1} onClick={()=>zoom(-.4)}>−</button><output>{Math.round(camera.zoom*100)}%</output><button aria-label="Vergrößern" disabled={camera.zoom>=4} onClick={()=>zoom(.4)}>+</button><button onClick={reset}>ÜBERSICHT</button></div>
  </div>
  <div className="atlas-caption"><strong>{station(selected).name}</strong><span>{variants[variant]} · ZIEHEN / ZOOMEN</span></div>
  <div className="atlas-area-picker"><span>THEMENBEREICH</span><button aria-label="Vorheriger Themenbereich" onClick={()=>focus(STATIONS[(STATIONS.findIndex(s=>s.id===selected)+STATIONS.length-1)%STATIONS.length].id)}>◀</button><strong aria-live="polite">{station(selected).name}</strong><button aria-label="Nächster Themenbereich" onClick={()=>focus(STATIONS[(STATIONS.findIndex(s=>s.id===selected)+1)%STATIONS.length].id)}>▶</button><button onClick={()=>focus(selected)}>HERANZOOMEN ↗</button></div>
 </section>;
}
