import {isDrum,originalScore,scoreWindow,type Instrument,type MusicMode,type MusicNote,type MusicScore} from './music-score.ts';

const SAMPLE_RATE=32000,PERIOD=256;
const harmonics:Record<string,number[]>={flute:[1,.04,.18,.015,.04],brass:[1,.55,.32,.17,.07,.025],strings:[1,.4,.27,.19,.11,.07,.035],pluck:[1,.24,.35,.11,.06],bass:[1,.2,.08,.025],mandolin:[1,.65,.24,.39,.1,.13,.055],guitar:[1,.52,.18,.07,.025],bell:[1,.02,.03,.48,.01,.16],accordion:[1,.38,.65,.13,.26,.07,.12],organ:[1,.65,.02,.36,.01,.03,.13],synth:[1,.58,.35,.2,.12,.09,.045],marimba:[1,.02,.015,.24,.02,.015,.008]};
/** Own synthesized sample bank; no samples extracted from commercial games. */
export function instrumentSamples(kind:Instrument,combat=false):Float32Array {
 const drum=isDrum(kind),length=drum?Math.floor(SAMPLE_RATE*(kind==='hat'?.06:combat?.34:.24)):PERIOD,data=new Float32Array(length);let seed=371,previous=0;
 for(let i=0;i<length;i++){
  let sample=0;
  if(drum){const t=i/SAMPLE_RATE;seed=(Math.imul(seed,1664525)+1013904223)>>>0;const noise=seed/4294967296*2-1,high=noise-previous;previous=noise;
   sample=combat&&kind==='kick'?Math.sin(2*Math.PI*(48*t+100*.04*(1-Math.exp(-t/.04))))*Math.exp(-t*14):combat&&kind==='snare'?(noise*.38+Math.sin(2*Math.PI*180*t)*.45)*Math.exp(-t*18):kind==='kick'?Math.sin(2*Math.PI*(44*t+70*.035*(1-Math.exp(-t/.035))))*Math.exp(-t*22):kind==='snare'?(noise*.65+Math.sin(2*Math.PI*175*t)*.25)*Math.exp(-t*24):high*.45*Math.exp(-t*65);
  }else {const levels=harmonics[kind];sample=levels.reduce((sum,level,h)=>sum+level*Math.sin(2*Math.PI*(h+1)*i/PERIOD),0)/levels.reduce((a,b)=>a+b,0)}
  data[i]=Math.round(Math.max(-1,Math.min(1,sample))*2047)/2047;
 }
 return data;
}

type Voice={source:AudioBufferSourceNode;gain:GainNode;pan:StereoPannerNode;start:number;end:number;level:number};
export class SnesMusic {
 private context:BaseAudioContext;private output:GainNode;private bank=new Map<string,AudioBuffer>();private voices=new Set<Voice>();
 private bus:GainNode;private filter:BiquadFilterNode;private echo:DelayNode;private feedback:GainNode;private wet:GainNode;
 private score:MusicScore=originalScore('menu');private origin=0;private cursor=0;private offset=0;private paused=false;
 constructor(context:BaseAudioContext,output:GainNode){
  this.context=context;this.output=output;this.bus=context.createGain();this.filter=context.createBiquadFilter();this.filter.type='lowpass';this.filter.frequency.value=6500;this.filter.Q.value=.45;
  this.echo=context.createDelay(1);this.echo.delayTime.value=.18;this.feedback=context.createGain();this.feedback.gain.value=.22;this.wet=context.createGain();this.wet.gain.value=.13;
  this.bus.connect(this.filter);this.filter.connect(output);this.filter.connect(this.echo);this.echo.connect(this.feedback);this.feedback.connect(this.echo);this.echo.connect(this.wet);this.wet.connect(output);
 }
 setScore(score:MusicScore){if(!(score.duration>0)||!score.notes.length)throw new Error('Leere Musiksequenz');this.stopVoices();this.score=score;this.filter.frequency.setTargetAtTime(score.mix==='combat'?3800:6500,this.context.currentTime,.05);this.wet.gain.setTargetAtTime(score.mix==='combat'?.045:.13,this.context.currentTime,.05);this.offset=0;this.cursor=0;this.origin=this.context.currentTime+.06;}
 setMode(mode:MusicMode){this.setScore(originalScore(mode))}
 get title(){return this.score.title}
 pause(paused:boolean){if(this.paused===paused)return;this.paused=paused;
  if(paused){this.offset=Math.max(0,this.context.currentTime-this.origin);this.stopVoices()}else{this.origin=this.context.currentTime-this.offset+.04;this.cursor=this.offset;}
 }
 private buffer(kind:Instrument){const combat=this.score.mix==='combat',key=kind+(combat?'-combat':'');let buffer=this.bank.get(key);if(!buffer){const data=instrumentSamples(kind,combat);buffer=this.context.createBuffer(1,data.length,SAMPLE_RATE);buffer.getChannelData(0).set(data);this.bank.set(key,buffer)}return buffer;}
 play(note:MusicNote,time:number){
  const c=this.context;if(!Number.isFinite(time)||!Number.isFinite(note.duration)||note.duration<=0||note.velocity<=0)return;
  const active=[...this.voices].filter(v=>v.start<=time&&v.end>time);
  if(active.length>=8){const victim=active.sort((a,b)=>a.level-b.level||a.end-b.end)[0];victim.gain.gain.cancelScheduledValues(time);victim.gain.gain.setValueAtTime(.0001,time);victim.source.stop(time+.006);victim.end=time;}
  const source=c.createBufferSource(),gain=c.createGain(),pan=c.createStereoPanner(),drum=isDrum(note.instrument),release=drum?.02:note.instrument==='strings'?.13:.06;
  const duration=Math.min(30,Math.max(.02,note.duration)),attack=Math.min(duration*.3,note.instrument==='strings'?.045:.009),level=Math.min(1,note.velocity)*(this.score.mix==='combat'?(note.instrument==='bass'?.65:note.instrument==='kick'?.72:note.instrument==='snare'?.62:note.instrument==='hat'?.26:.26):(note.instrument==='bass'?.55:drum?.48:.3));
  source.buffer=this.buffer(note.instrument);source.loop=!drum;
  if(!drum)source.playbackRate.value=(440*2**((Math.max(0,Math.min(127,note.midi))-69)/12))/(SAMPLE_RATE/PERIOD);
  const end=time+(drum?source.buffer.duration:duration+release);
  gain.gain.setValueAtTime(.0001,time);gain.gain.exponentialRampToValueAtTime(Math.max(.0002,level),time+attack);
  gain.gain.exponentialRampToValueAtTime(Math.max(.0002,level*(['pluck','mandolin','guitar','marimba','bell'].includes(note.instrument)?.15:.72)),time+duration);
  gain.gain.exponentialRampToValueAtTime(.0001,time+duration+release);
  pan.pan.value=Math.max(-1,Math.min(1,note.pan));source.connect(gain);gain.connect(pan);pan.connect(this.bus);
  const voice={source,gain,pan,start:time,end,level};this.voices.add(voice);source.onended=()=>{this.voices.delete(voice);source.disconnect();gain.disconnect();pan.disconnect()};source.start(time);source.stop(end);
 }
 schedule(){if(this.paused||this.context.state!=='running')return;const now=Math.max(0,this.context.currentTime-this.origin);if(this.cursor<now-.25)this.cursor=now;
  const end=now+.12;for(const event of scoreWindow(this.score,this.cursor,end))this.play(event.note,Math.max(this.context.currentTime+.002,this.origin+event.at));this.cursor=end;
 }
 private stopVoices(){const now=this.context.currentTime;for(const voice of this.voices){voice.gain.gain.cancelScheduledValues(now);voice.gain.gain.setTargetAtTime(.0001,now,.006);voice.source.stop(now+.025)}this.voices.clear();}
 destroy(){this.stopVoices();for(const node of [this.bus,this.filter,this.echo,this.feedback,this.wet])node.disconnect();this.bank.clear();}
}
