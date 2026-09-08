import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import MidiPackage from '@tonejs/midi';
const {Midi}=MidiPackage;
import {midiScore,originalScore,scoreWindow,MIDI_PROGRAMS,scoreMidi,isDrum,type Instrument} from './music-score.ts';
import {instrumentSamples,SnesMusic} from './snes-music.ts';
import {AREA_THEMES,areaScore,melodyTokens} from './area-music.ts';
import {STATIONS} from './data.ts';
import {ArcadeAudio} from './audio.ts';

test('MIDI melody, tempo changes, percussion and track volume survive conversion',()=>{
 const midi=new Midi();midi.header.tempos=[{ticks:0,bpm:120},{ticks:480,bpm:60}];midi.header.update();
 const melody=midi.addTrack();melody.instrument.number=73;melody.addCC({number:7,ticks:0,value:.5});melody.addNote({midi:72,ticks:0,durationTicks:480,velocity:.8});melody.addNote({midi:76,ticks:480,durationTicks:480,velocity:.7});
 const drums=midi.addTrack();drums.channel=9;drums.addNote({midi:36,ticks:0,durationTicks:120,velocity:1});
 const score=midiScore(midi.toArray(),'Vorlage');assert.equal(score.title,'Vorlage');assert.equal(score.notes.length,3);
 const lead=score.notes.filter(n=>n.instrument==='flute');assert.equal(lead[0].midi,72);assert.equal(lead[1].midi,76);assert.equal(lead[0].duration,.5);assert.equal(lead[1].time,.5);assert.equal(lead[1].duration,1);assert.ok(Math.abs(lead[0].velocity-.4)<.02);assert.equal(score.duration,1.5);assert.equal(score.notes.find(n=>n.instrument==='kick')!.midi,36);
});
test('invalid or empty MIDI cannot replace a working soundtrack',()=>{
 assert.throws(()=>midiScore(new Uint8Array([0,1,2])));assert.throws(()=>midiScore(new Midi().toArray()));assert.throws(()=>midiScore(new Uint8Array(2_000_001)));
});
test('loop seam and adjacent scheduler windows play every note exactly once',()=>{
 const score={title:'Loop',duration:1,notes:[{time:0,duration:.2,midi:60,velocity:.5,instrument:'flute' as const,pan:0},{time:.5,duration:.2,midi:67,velocity:.5,instrument:'flute' as const,pan:0}]};
 const events=[...scoreWindow(score,0,.5),...scoreWindow(score,.5,1),...scoreWindow(score,1,1.5),...scoreWindow(score,1.5,2)];assert.deepEqual(events.map(e=>e.at),[0,.5,1,1.5]);assert.deepEqual(scoreWindow(score,2,2),[]);
});
test('own sample bank is deterministic, finite, audible and bounded',()=>{
 for(const instrument of Object.keys(MIDI_PROGRAMS) as Instrument[]){const a=instrumentSamples(instrument),b=instrumentSamples(instrument);assert.deepEqual(a,b);assert.ok(a.every(x=>Number.isFinite(x)&&Math.abs(x)<=1));const rms=Math.sqrt(a.reduce((s,x)=>s+x*x,0)/a.length);assert.ok(rms>.03&&rms<.75,instrument+' '+rms)}
 for(const mode of ['menu','fight','boss','victory'] as const){const score=originalScore(mode);assert.ok(score.notes.length>100);assert.ok(score.notes.every(n=>n.time>=0&&n.time+n.duration<=score.duration+.001));}
});

test('all 21 areas have individual complete melodies and 32-bar MIDI loops',()=>{
 assert.deepEqual(AREA_THEMES.map(t=>t.id),STATIONS.map(s=>s.id));assert.equal(new Set(AREA_THEMES.map(t=>t.a)).size,21);assert.equal(new Set(AREA_THEMES.map(t=>t.b)).size,21);
 for(const theme of AREA_THEMES){
  for(const pattern of [theme.a,theme.b])assert.equal(melodyTokens(pattern).reduce((n,t)=>n+t.length,0),theme.beats*2,theme.id);
  const score=areaScore(theme.id),bytes=scoreMidi(score,theme.bpm,theme.beats),restored=midiScore(bytes);
  assert.ok(score.notes.length>500);assert.equal(restored.notes.length,score.notes.length);assert.ok(Math.abs(restored.duration-score.duration)<.001,theme.id+' loop length');assert.ok(score.notes.every(n=>n.midi>=0&&n.midi<=127&&n.duration>0&&n.time+n.duration<=score.duration+.001));
 }
});
test('all arena arrangements keep melody below the piercing register and foreground bass and drums',()=>{
 for(const theme of AREA_THEMES){
  const score=areaScore(theme.id),melody=score.notes.filter(n=>!isDrum(n.instrument)&&n.instrument!=='bass'&&n.instrument!=='strings');
  assert.equal(score.mix,'combat');assert.ok(melody.every(n=>n.midi<=74&&n.velocity<=.52));
  const bass=score.notes.filter(n=>n.instrument==='bass'),snare=score.notes.filter(n=>n.instrument==='snare'),kick=score.notes.filter(n=>n.instrument==='kick');
  assert.ok(bass.every(n=>n.midi>=36&&n.midi<=54));assert.ok(bass.length>=96);
  assert.ok(snare.length>=64&&kick.length>=64);
  for(let bar=0;bar<32;bar++){const start=bar*theme.beats*60/theme.bpm,end=(bar+1)*theme.beats*60/theme.bpm;
   assert.ok(kick.some(n=>n.time>=start-1e-6&&n.time<end-1e-6),theme.id+' missing kick bar '+bar);
   assert.ok(snare.some(n=>n.time>=start-1e-6&&n.time<end-1e-6),theme.id+' missing snare bar '+bar);
  }
 }
 for(const instrument of ['kick','snare','bass'] as Instrument[]){const a=instrumentSamples(instrument,true);assert.ok(a.every(n=>Number.isFinite(n)&&Math.abs(n)<=1));assert.ok(a.some(n=>Math.abs(n)>.1));}
});

test('arena and jukebox changes restore the correct gameplay or menu theme',()=>{
 const audio=new ArcadeAudio();audio.setArena('park-9');assert.equal(audio.trackTitle,'Piazza Dorata');audio.previewArea('park-17');assert.equal(audio.trackTitle,'Orbit 17');audio.previewArea(null);assert.equal(audio.trackTitle,'Piazza Dorata');audio.setMode('menu');assert.match(audio.trackTitle,/menu/);audio.previewArea('park-20');audio.previewArea(null);assert.match(audio.trackTitle,/menu/);audio.setArena('park-3',true);assert.equal(audio.trackTitle,'Étoiles de Paris');assert.throws(()=>audio.setArena('missing'));assert.equal(audio.trackTitle,'Étoiles de Paris');
});
test('imported title MIDI stays in the menu and title preview restores the active arena',()=>{
 const audio=new ArcadeAudio(),bytes=scoreMidi(originalScore('menu'),112);
 audio.useMidi('menu',bytes,'Feel Free · MIDI');assert.equal(audio.hasTitleMidi,true);assert.equal(audio.trackTitle,'Feel Free · MIDI');
 audio.setArena('park-9');assert.equal(audio.trackTitle,'Piazza Dorata');
 audio.previewTitle();assert.equal(audio.trackTitle,'Feel Free · MIDI');
 audio.previewArea(null);assert.equal(audio.trackTitle,'Piazza Dorata');
 audio.setMode('menu');assert.equal(audio.trackTitle,'Feel Free · MIDI');
});

test('shipped Feel Free MIDI keeps its 32-bar loop and audible source melody',()=>{
 const score=midiScore(readFileSync(new URL('../public/assets/music/feel-free-menu.mid',import.meta.url)));
 assert.ok(Math.abs(score.duration-61.44)<.001);
 const lead=score.notes.filter(n=>n.instrument==='flute');
 assert.equal(lead.length,88);assert.ok(lead.every(n=>n.midi>=64&&n.midi<=73&&n.velocity>.8));
 assert.equal(score.notes.length,664);
 assert.ok(score.notes.every(n=>n.time>=0&&n.duration>0&&n.time+n.duration<=score.duration+.001));
 const seam=scoreWindow(score,score.duration-.12,score.duration+.12);
 assert.equal(seam.filter(e=>e.note.instrument==='flute'&&Math.abs(e.at-score.duration)<.001).length,1);
});

class Param {value=0;events:Array<[string,number,number]>=[];setValueAtTime(v:number,t:number){this.events.push(['set',v,t])}exponentialRampToValueAtTime(v:number,t:number){this.events.push(['ramp',v,t])}setTargetAtTime(v:number,t:number){this.events.push(['target',v,t])}cancelScheduledValues(t:number){this.events=this.events.filter(e=>e[2]<t)}}
class Node {gain=new Param();pan=new Param();frequency=new Param();Q=new Param();delayTime=new Param();playbackRate=new Param();type='';loop=false;buffer:any;onended:()=>void=()=>{};starts:number[]=[];stops:number[]=[];connect(_node:unknown){}disconnect(){}start(t:number){this.starts.push(t)}stop(t:number){this.stops.push(t)}}
class Context {currentTime=0;state='running';sources:Node[]=[];createGain(){return new Node()}createBiquadFilter(){return new Node()}createDelay(){return new Node()}createStereoPanner(){return new Node()}createBuffer(_channels:number,length:number,rate:number){const data=new Float32Array(length);return {getChannelData:()=>data,duration:length/rate}}createBufferSource(){const node=new Node();this.sources.push(node);return node}}
test('pause holds the music position and changing the score cancels queued notes',()=>{
 const c=new Context(),music=new SnesMusic(c as unknown as BaseAudioContext,new Node() as unknown as GainNode);
 music.setScore({title:'A',duration:2,notes:[{time:0,duration:.2,midi:60,velocity:.5,instrument:'flute',pan:0},{time:.5,duration:.2,midi:64,velocity:.5,instrument:'flute',pan:0}]});music.schedule();assert.equal(c.sources.length,1);
 c.currentTime=.2;music.pause(true);assert.equal(c.sources[0].stops.at(-1),.225);c.currentTime=10;music.schedule();assert.equal(c.sources.length,1);
 music.pause(false);c.currentTime=10.3;music.schedule();assert.equal(c.sources.length,2);assert.ok(c.sources[1].starts[0]>10.3&&c.sources[1].starts[0]<10.5);
 music.setMode('fight');assert.ok(c.sources[1].stops.at(-1)!<10.4);music.destroy();
});
