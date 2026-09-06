import {useEffect,useRef,useState} from 'react';
import {AREA_THEMES,areaScore} from './area-music';
import type {ArcadeAudio} from './audio';

export function MusicJukebox({audio,initialArea,titleMidiReady=false}:{audio:ArcadeAudio|null;initialArea:string;titleMidiReady?:boolean}){
 const [index,setIndex]=useState(Math.max(0,AREA_THEMES.findIndex(t=>t.id===initialArea))),[playing,setPlaying]=useState(false),[titlePlaying,setTitlePlaying]=useState(false),[error,setError]=useState('');
 const active=useRef(false),request=useRef(0);const theme=AREA_THEMES[index];
 useEffect(()=>()=>{request.current++;if(active.current)audio?.previewArea(null);active.current=false},[audio]);
 const play=async(id:string)=>{if(!audio)return;const ticket=++request.current;try{await audio.unlock();if(ticket!==request.current)return;audio.previewArea(id);setTitlePlaying(false);active.current=true;setPlaying(true);setError('')}catch{setError('Sound konnte nicht gestartet werden. Bitte noch einmal starten.')}};
 const stop=()=>{request.current++;audio?.previewArea(null);active.current=false;setPlaying(false);setTitlePlaying(false)};
 const change=(delta:number)=>{const next=(index+delta+AREA_THEMES.length)%AREA_THEMES.length;setIndex(next);if(playing)void play(AREA_THEMES[next].id)};
 const playTitle=async()=>{if(!audio||!titleMidiReady)return;const ticket=++request.current;try{await audio.unlock();if(ticket!==request.current)return;audio.previewTitle();active.current=true;setPlaying(false);setTitlePlaying(true);setError('')}catch{setError('Titelthema konnte nicht gestartet werden.')}};
 return <section className="music-jukebox" aria-label="Themenbereich-Musik">
  <img src={`/assets/arenas/${theme.id}.png`} alt=""/>
  <div className="jukebox-copy"><small>SOUND TEST · {String(index+1).padStart(2,'0')} / 21</small><h3 aria-live="polite">{theme.title}</h3><p>{theme.area} · {theme.bpm} BPM · {Math.round(areaScore(theme.id).duration)} SEK.</p><p>{theme.description}</p></div>
  <div className="jukebox-controls"><button className="text-button" aria-label="Vorheriger Soundtrack" onClick={()=>change(-1)}>◀</button><button className="arcade-button secondary" onClick={()=>playing?stop():void play(theme.id)}>{playing?'■ HÖRPROBE STOPPEN':'♪ HÖRPROBE STARTEN'}</button><button className="text-button" aria-label="Nächster Soundtrack" onClick={()=>change(1)}>▶</button><a className="text-button" href={`/assets/music/${theme.id}.mid`} download={`${theme.title}.mid`}>MIDI ↓</a></div>
  {titleMidiReady&&<div className="jukebox-title-theme"><strong>FEEL FREE · TITELTHEMA</strong><button className="text-button" onClick={()=>titlePlaying?stop():void playTitle()}>{titlePlaying?'■ STOPPEN':'♪ ANHÖREN'}</button><a className="text-button" href="/assets/music/feel-free-menu.mid" download="Feel-Free-SNES.mid">MIDI ↓</a></div>}
  {error&&<p role="alert">{error}</p>}
 </section>;
}
