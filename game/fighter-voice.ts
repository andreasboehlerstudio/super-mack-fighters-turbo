import type {FighterId} from './data.ts';

export type AttackCall = 'punch'|'kick'|'special'|'ultra';
type Timbre = 'human'|'mouse'|'water'|'elephant'|'goat'|'bird'|'monster';
type Voice = {pitch:number;timbre:Timbre;rough:number};
const human=(pitch:number,rough=.12):Voice=>({pitch,timbre:'human',rough});
// Stylized arcade voices, not recordings or impersonations of the real people.
export const FIGHTER_VOICES:Record<FighterId,Voice>={
 ed:{pitch:390,timbre:'mouse',rough:.04},edda:{pitch:480,timbre:'mouse',rough:.03},
 snorri:{pitch:180,timbre:'water',rough:.08},
 olli:{pitch:125,timbre:'elephant',rough:.2},boeckli:{pitch:210,timbre:'goat',rough:.18},
 louis:{pitch:510,timbre:'bird',rough:.08},wakala:{pitch:105,timbre:'monster',rough:.3},
 graumacher:{pitch:78,timbre:'monster',rough:.35},
 roland:human(112,.21),marianne:human(220),juergen:human(128,.16),mauritia:human(235),
 michael:human(153),thomas:human(137,.2),annkathrin:human(256),frederik:human(172),
 alexia:human(270),miriam:human(241),katja:human(260),nicolas:human(163),
 max:human(180),matthias:human(135,.2),laurent:human(143),reinhold:human(106,.24),
 nathalie:human(248),andreas:human(155),karsten:human(124,.2),scholz:human(116,.25),
 bobo:human(169,.16),mross:human(145),freudenreich:human(205,.26),
 otto:human(192,.2),ross:human(198,.1),
 vendel:human(148,.18),
 schaer:human(228,.1),glen:human(130,.18),steffen:human(158,.15),
 robbemond:human(103,.3),tesla:human(132,.18),
};
export function isAttackCall(type:string):type is AttackCall{return ['punch','kick','special','ultra'].includes(type)}

/** Small mono PCM samples with vowel resonances, breath attack and a pitch fall. */
export function renderAttackCall(id:FighterId,attack:AttackCall,variant=0,rate=22050):Float32Array {
 const voice=FIGHTER_VOICES[id],v=((variant%3)+3)%3;
 const duration=attack==='ultra'?.42:attack==='special'?.3:attack==='kick'?.22:.17;
 const pcm=new Float32Array(Math.ceil(duration*rate));
 const pitch=voice.pitch*[.96,1.04,1][v]*(attack==='ultra'?1.13:1);
 const formants=voice.timbre==='elephant'?[420,1050,2200]:voice.timbre==='mouse'?[1000,2300,3400]:voice.timbre==='bird'?[1400,2800,4100]:[650+v*70,1250+v*170,2600];
 let phase=0,seed=1777+v*719,peak=0;
 for(let i=0;i<pcm.length;i++){
  const t=i/rate,u=t/duration;
  let contour=1.2-.4*u;
  if(voice.timbre==='water')contour+=.22*Math.sin(t*95);
  if(voice.timbre==='goat')contour+=.13*Math.sin(t*76);
  if(voice.timbre==='bird')contour+=.3*Math.sin(t*48);
  if(voice.timbre==='elephant')contour+=.08*Math.sin(t*65);
  const hz=pitch*contour;
  phase+=2*Math.PI*hz/rate;
  let voiced=0;
  for(let h=1;h<=24&&h*hz<rate*.45;h++){
   const f=h*hz;
   const resonance=formants.reduce((sum,center,j)=>sum+[1,.6,.22][j]*Math.exp(-.5*((f-center)/(100+j*70))**2),0);
   voiced+=Math.sin(phase*h)*(resonance+.045)/(h**.45);
  }
  seed=(Math.imul(seed,1664525)+1013904223)>>>0;
  const noise=(seed/4294967296*2-1);
  const breath=Math.exp(-t*100)*.65+voice.rough*.12;
  const envelope=Math.min(1,t/.009)*Math.pow(1-u,.8)*Math.min(1,(1-u)/.12);
  const pulse=voice.timbre==='monster'?.65+.35*Math.sin(phase*.5):voice.timbre==='water'?.75+.25*Math.sin(t*115):1;
  // A gently crushed sample texture retains consonants without harsh clipping.
  pcm[i]=Math.round(Math.tanh((voiced*pulse+noise*breath)*1.25)*envelope*2048)/2048;
  peak=Math.max(peak,Math.abs(pcm[i]));
 }
 if(peak>0)for(let i=0;i<pcm.length;i++)pcm[i]=pcm[i]/peak*.7;
 return pcm;
}

export class AttackVoices {
 private samples=new Map<string,AudioBuffer>();
 private next=[0,0];private variants=[0,0];
 private context:AudioContext;private destination:AudioNode;
 constructor(context:AudioContext,destination:AudioNode){this.context=context;this.destination=destination;}
 play(id:FighterId,attack:AttackCall,player:number){
  const c=this.context,slot=player===1?1:0,now=c.currentTime;
  if(now<this.next[slot]||c.state!=='running')return;
  const variant=this.variants[slot]++%3,key=`${id}:${attack}:${variant}`;
  let buffer=this.samples.get(key);
  if(!buffer){const pcm=renderAttackCall(id,attack,variant);buffer=c.createBuffer(1,pcm.length,22050);buffer.getChannelData(0).set(pcm);this.samples.set(key,buffer);}
  this.next[slot]=now+buffer.duration+.025;
  const source=c.createBufferSource(),gain=c.createGain(),pan=c.createStereoPanner();
  source.buffer=buffer;gain.gain.value=attack==='ultra'?.5:.4;pan.pan.value=slot===0?-.24:.24;
  source.connect(gain);gain.connect(pan);pan.connect(this.destination);
  source.onended=()=>{source.disconnect();gain.disconnect();pan.disconnect()};
  source.start(now+.005);
 }
}
