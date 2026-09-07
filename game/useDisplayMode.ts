'use client';
import {useCallback,useEffect,useRef,useState} from 'react';

/** Start expanded; browser fullscreen is requested synchronously on the first Start gesture. */
export function useDisplayMode(){
 const [expanded,setExpanded]=useState(true),[message,setMessage]=useState('');
 const powered=useRef(false),wasFullscreen=useRef(false);
 useEffect(()=>{
  const changed=()=>{const active=!!document.fullscreenElement;if(active)setExpanded(true);else if(wasFullscreen.current)setExpanded(false);wasFullscreen.current=active;};
  document.addEventListener('fullscreenchange',changed);
  return()=>document.removeEventListener('fullscreenchange',changed);
 },[]);
 const enter=useCallback((explicit=false)=>{
  setExpanded(true);setMessage('');
  if(document.fullscreenElement)return;
  // Embedded browsers and gamepad polling may lack permission or a trusted gesture.
  // The viewport-filling game remains usable when the browser refuses fullscreen.
  try{const request=document.documentElement.requestFullscreen?.();void request?.catch(()=>{if(explicit)setMessage('Das Spiel füllt dieses Fenster. Browser-Vollbild ist hier nicht verfügbar.');});}
  catch{if(explicit)setMessage('Das Spiel füllt dieses Fenster. Browser-Vollbild ist hier nicht verfügbar.');}
 },[]);
 const powerOn=useCallback(()=>{if(powered.current)return;powered.current=true;enter();},[enter]);
 const toggle=useCallback(()=>{
  if(expanded){setExpanded(false);setMessage('');if(document.fullscreenElement)void document.exitFullscreen().catch(()=>setExpanded(!!document.fullscreenElement));}
  else enter(true);
 },[expanded,enter]);
 return {expanded,message,powerOn,toggle};
}
