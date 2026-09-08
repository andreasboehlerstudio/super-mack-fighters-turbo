import MidiPackage from '@tonejs/midi/build/Midi.js';
const {Midi}=MidiPackage;

export type MusicMode='menu'|'fight'|'boss'|'victory';
export type Instrument='flute'|'brass'|'strings'|'pluck'|'bass'|'mandolin'|'guitar'|'bell'|'accordion'|'organ'|'synth'|'marimba'|'kick'|'snare'|'hat';
export interface MusicNote {time:number;duration:number;midi:number;velocity:number;instrument:Instrument;pan:number}
export interface MusicScore {title:string;duration:number;notes:MusicNote[];mix?:'combat'}
export const isDrum=(instrument:Instrument)=>['kick','snare','hat'].includes(instrument);
export const MIDI_PROGRAMS:Record<Instrument,number>={flute:73,brass:61,strings:48,pluck:10,bass:33,mandolin:105,guitar:24,bell:8,accordion:21,organ:16,synth:81,marimba:12,kick:0,snare:0,hat:0};

/** Export the same notes used by the game as a Standard MIDI File with a bar-exact end. */
export function scoreMidi(score:MusicScore,bpm:number,beats=4,compound=false):Uint8Array {
 const midi=new Midi();midi.name=score.title;midi.header.setTempo(bpm);
 midi.header.timeSignatures=[{ticks:0,timeSignature:compound?[6,8]:[beats,4]}];midi.header.update();
 let channel=0;
 for(const instrument of new Set(score.notes.map(n=>n.instrument))){
  const track=midi.addTrack();track.name=instrument;track.channel=isDrum(instrument)?9:channel++;if(channel===9)channel++;
  track.instrument.number=MIDI_PROGRAMS[instrument];
  const notes=score.notes.filter(n=>n.instrument===instrument);
  track.addCC({number:10,time:0,value:(notes[0].pan+1)/2});
  for(const n of notes)track.addNote({midi:n.midi,time:n.time,duration:n.duration,velocity:n.velocity});
  track.endOfTrackTicks=Math.round(midi.header.secondsToTicks(score.duration));
  // Tone's encoder omits endOfTrackTicks. A silent All Notes Off event preserves the bar boundary.
  track.addCC({number:123,ticks:track.endOfTrackTicks,value:0});
 }
 return midi.toArray();
}

/** MIDI timing is resolved by the parser, including tempo changes. No audio is uploaded. */
export function midiScore(bytes:ArrayBuffer|Uint8Array,title?:string):MusicScore {
 if(bytes.byteLength>2_000_000)throw new Error('Die MIDI-Datei ist zu groß.');
 const data=bytes instanceof Uint8Array?bytes:new Uint8Array(bytes);
 if(String.fromCharCode(...data.slice(0,4))!=='MThd')throw new Error('Keine gültige MIDI-Datei.');
 const midi=new Midi(data),notes:MusicNote[]=[];
 for(const track of midi.tracks){
  const program=track.instrument.number;
  const melodic:Instrument=(Object.entries(MIDI_PROGRAMS).find(([kind,p])=>!isDrum(kind as Instrument)&&p===program)?.[0] as Instrument|undefined)??(program>=32&&program<40?'bass':program>=40&&program<56?'strings':program>=56&&program<72?'brass':program>=72&&program<80?'flute':'pluck');
  for(const note of track.notes){
   let instrument:Instrument=melodic;
   if(track.instrument.percussion)instrument=[35,36].includes(note.midi)?'kick':[38,39,40].includes(note.midi)?'snare':'hat';
   const cc=(index:number,fallback:number)=>{const events=track.controlChanges[index]??[];let value=fallback;for(const event of events){if(event.time>note.time)break;value=event.value}return value};
   notes.push({time:note.time,duration:note.duration,midi:note.midi,velocity:note.velocity*cc(7,1)*cc(11,1),instrument,pan:cc(10,.5)*2-1});
  }
 }
 if(!notes.length||notes.length>30_000||!Number.isFinite(midi.duration)||midi.duration<=0||midi.duration>1200)throw new Error('Die MIDI-Datei enthält keine passende Musiksequenz.');
 notes.sort((a,b)=>a.time-b.time);
 const duration=Math.max(midi.duration,...midi.tracks.map(t=>midi.header.ticksToSeconds(t.endOfTrackTicks??0)));
 return {title:title??(midi.name||'MIDI-Soundtrack'),duration,notes};
}

/** Existing original composition, now arranged for the sample instruments. */
export function originalScore(mode:MusicMode):MusicScore {
 const bpm=mode==='boss'?146:mode==='menu'?112:132,step=60/bpm/4,notes:MusicNote[]=[];
 const add=(beat:number,duration:number,midi:number,instrument:Instrument,velocity:number,pan=0)=>notes.push({time:beat*step,duration:duration*step,midi,instrument,velocity,pan});
 for(let b=0;b<128;b++){
  const root=[48,53,55,51][Math.floor(b/32)],scale=mode==='boss'?[0,3,6,7,10,12,15,19]:[0,4,7,9,12,16,14,7],melody=[0,2,4,2,5,4,3,2,1,3,5,3,6,5,2,4];
  if(b%2===0)add(b,1.65,root+12+scale[melody[Math.floor(b/2)%16]],mode==='menu'?'flute':'brass',.62,-.12);
  if(b%4===0)add(b,3.2,root+(b%8===0?0:7),'bass',.78);
  if(b%16===0||b%16===10)add(b,.7,36,'kick',.9);
  if(b%16===4||b%16===12)add(b,.65,38,'snare',.55,.12);
  if(b%2===1)add(b,.2,42,'hat',.32,-.4);
  if(b%8===2)add(b,.65,root+scale[b%3]+24,'pluck',.48,.45);
  if(b%16===0)for(const interval of [0,mode==='boss'?3:4,7])add(b,14,root+12+interval,'strings',.15,.25);
 }
 notes.sort((a,b)=>a.time-b.time);
 return {title:'Arcade-Original · '+mode,duration:128*step,notes};
}

/** Half-open windows prevent double notes at loop boundaries and scheduler overlap. */
export function scoreWindow(score:MusicScore,from:number,to:number):Array<{note:MusicNote;at:number}> {
 if(to<=from||score.duration<=0||!Number.isFinite(score.duration))return [];
 const result:Array<{note:MusicNote;at:number}>=[];
 for(let loop=Math.max(0,Math.floor(from/score.duration));loop<=Math.floor(to/score.duration);loop++){
  const offset=loop*score.duration;
  for(const note of score.notes){const at=offset+note.time;if(note.time<score.duration&&at>=from&&at<to)result.push({note,at})}
 }
 return result;
}
