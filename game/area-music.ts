import type {Instrument,MusicNote,MusicScore} from './music-score.ts';

type Groove='adventure'|'march'|'breakbeat'|'waltz'|'sirtaki'|'fairy'|'folk'|'jig'|'industrial'|'disco'|'island'|'race'|'sea'|'space'|'alpine'|'nordic'|'rumba';
export interface AreaTheme {
 id:string;area:string;title:string;description:string;bpm:number;tonic:number;scale:number[];
 lead:Instrument;answer:Instrument;groove:Groove;beats:number;chords:number[];a:string;b:string;
}
const major=[0,2,4,5,7,9,11],minor=[0,2,3,5,7,8,10],dorian=[0,2,3,5,7,9,10],lydian=[0,2,4,6,7,9,11],harmonic=[0,2,3,5,7,8,11],phrygian=[0,1,4,5,7,8,10];
// Each two-bar melody is composed in scale degrees. Rests and note lengths are explicit.
export const AREA_THEMES:AreaTheme[]=[
 {id:'park-0',area:'Abenteuerland',title:'Dschungelkompass',description:'Marimba, Flötenrufe und synkopierte Trommeln',bpm:126,tonic:50,scale:dorian,lead:'marimba',answer:'flute',groove:'adventure',beats:4,chords:[0,0,3,4,5,3,1,4],a:'0/.5 2/.5 4/1 r/.5 5/.5 4/.5 2/.5 | 3/.5 2/.5 0/1 -1/.5 0/.5 2/1',b:'7/1 6/.5 4/.5 5/1 4/1 | 2/.5 3/.5 4/1 1/1 0/1'},
 {id:'park-1',area:'Deutschland',title:'Fanfare am Tor',description:'Festliche Bläser und ein federnder Marsch',bpm:120,tonic:48,scale:major,lead:'brass',answer:'bell',groove:'march',beats:4,chords:[0,4,5,3,0,1,4,4],a:'0/1 2/.5 4/.5 7/1 4/1 | 5/.75 4/.25 2/1 1/1 r/1',b:'4/.5 4/.5 5/1 7/1 6/1 | 5/.5 3/.5 2/1 1/.5 2/.5 0/1'},
 {id:'park-2',area:'England',title:'London Afterglow',description:'Orgel, trockener Bass und britischer Arcade-Breakbeat',bpm:138,tonic:52,scale:dorian,lead:'organ',answer:'brass',groove:'breakbeat',beats:4,chords:[0,3,0,6,3,3,1,4],a:'4/.5 r/.5 4/.5 2/.5 0/.75 2/.25 3/1 | 4/.5 6/.5 7/1 r/.5 6/.5 4/1',b:'7/.75 6/.25 4/.5 2/.5 3/.5 r/.5 5/1 | 4/.5 2/.5 0/1 -1/.5 0/.5 2/1'},
 {id:'park-3',area:'Frankreich',title:'Étoiles de Paris',description:'Akkordeonwalzer mit glitzerndem Sternenmotiv',bpm:150,tonic:55,scale:harmonic,lead:'accordion',answer:'bell',groove:'waltz',beats:3,chords:[0,0,3,4,5,3,4,4],a:'0/.5 2/.5 4/1 3/.5 2/.5 | 1/1 -1/.5 1/.5 4/1',b:'7/1 6/.5 5/.5 4/1 | 3/.5 2/.5 1/.5 -1/.5 0/1'},
 {id:'park-4',area:'Griechenland',title:'Ägäis im Gegenlicht',description:'Bouzouki-artige Zupfmelodie über einem Sirtaki-Puls',bpm:134,tonic:50,scale:dorian,lead:'mandolin',answer:'flute',groove:'sirtaki',beats:4,chords:[0,6,3,0,5,3,6,4],a:'0/.5 1/.5 2/.5 4/.5 3/1 2/.5 1/.5 | 0/1 -1/.5 0/.5 2/.5 1/.5 0/1',b:'4/.5 5/.5 6/1 7/.5 6/.5 4/1 | 5/.5 4/.5 3/.5 2/.5 1/1 0/1'},
 {id:'park-5',area:'Grimms Märchenwald',title:'Sternenpfad',description:'Celesta, leise Streicher und ein schwebender Märchenwalzer',bpm:126,tonic:57,scale:lydian,lead:'bell',answer:'flute',groove:'fairy',beats:3,chords:[0,1,5,4,3,1,0,4],a:'0/1 4/.5 3/.5 2/1 | 1/.5 3/.5 6/1 4/1',b:'7/.5 6/.5 4/1 3/.5 2/.5 | 1/1 4/.5 1/.5 0/1'},
 {id:'park-6',area:'Holland',title:'Grachtenlichter',description:'Drehorgel und verspielte Glocken im Hafentakt',bpm:116,tonic:53,scale:major,lead:'organ',answer:'bell',groove:'folk',beats:4,chords:[0,4,3,0,5,1,4,0],a:'2/.5 1/.5 0/1 4/.5 3/.5 2/1 | 1/.5 0/.5 -1/1 1/.5 2/.5 4/1',b:'5/1 4/.5 3/.5 2/.5 4/.5 7/1 | 6/.5 4/.5 3/1 2/.5 1/.5 0/1'},
 {id:'park-7',area:'Irland',title:'Kleeblatt-Jig',description:'Tin-Whistle, gezupfte Saiten und ein 6/8-Tanz',bpm:174,tonic:50,scale:major,lead:'flute',answer:'mandolin',groove:'jig',beats:3,chords:[0,0,4,0,3,5,4,4],a:'0/.5 2/.5 4/.5 2/.5 0/.5 2/.5 | 1/.5 3/.5 4/.5 6/.5 4/.5 1/.5',b:'7/.5 6/.5 4/.5 5/.5 4/.5 2/.5 | 3/.5 2/.5 1/.5 -1/.5 0/1'},
 {id:'park-8',area:'Island',title:'Basalt & Blue Fire',description:'Dunkle Synths, Metallklänge und ein antreibender Maschinenrhythmus',bpm:148,tonic:47,scale:minor,lead:'synth',answer:'brass',groove:'industrial',beats:4,chords:[0,0,5,6,3,5,6,4],a:'0/.5 0/.5 7/.5 r/.5 6/.5 4/.5 2/1 | 3/.75 4/.25 3/.5 2/.5 0/1 -1/1',b:'7/1 r/.5 6/.5 4/.5 6/.5 7/1 | 5/.5 4/.5 3/1 1/.5 2/.5 0/1'},
 {id:'park-9',area:'Italien',title:'Piazza Dorata',description:'Mandoline, warmer Bass und sonniger Piazza-Groove',bpm:124,tonic:55,scale:major,lead:'mandolin',answer:'accordion',groove:'disco',beats:4,chords:[0,5,1,4,3,0,1,4],a:'2/.5 4/.5 7/1 6/.5 4/.5 2/1 | 5/.5 4/.5 2/.5 1/.5 0/1 r/1',b:'4/.75 5/.25 7/1 9/.5 7/.5 6/1 | 5/.5 4/.5 3/.5 2/.5 1/1 0/1'},
 {id:'park-10',area:'Königreich der Minimoys',title:'Unter Blattkronen',description:'Kleine Marimba-Sprünge, Zauberglocken und Dschungel-Percussion',bpm:142,tonic:60,scale:lydian,lead:'marimba',answer:'bell',groove:'adventure',beats:4,chords:[0,1,3,0,5,1,3,4],a:'0/.25 2/.25 4/.5 r/.5 3/.5 6/.5 4/.5 2/1 | 1/.5 3/.5 5/.5 3/.5 4/1 r/1',b:'7/.5 4/.5 6/.5 3/.5 5/1 2/1 | 3/.25 4/.25 6/.5 4/1 1/.5 2/.5 0/1'},
 {id:'park-11',area:'Kroatien',title:'Adria-Impuls',description:'Elektrische Arpeggien und kantiger 3+3+2-Puls für Voltron',bpm:144,tonic:54,scale:dorian,lead:'synth',answer:'mandolin',groove:'island',beats:4,chords:[0,3,6,0,5,3,1,4],a:'0/.75 4/.75 3/.5 2/.75 6/.75 4/.5 | 7/1 6/.5 4/.5 3/.75 2/.25 0/1',b:'4/.75 5/.75 7/.5 6/.75 4/.75 2/.5 | 3/.5 5/.5 4/1 1/.75 2/.25 0/1'},
 {id:'park-12',area:'Liechtenstein',title:'Alpenkarussell',description:'Spieluhr und warme Bläser im Karussellwalzer',bpm:156,tonic:58,scale:major,lead:'bell',answer:'brass',groove:'waltz',beats:3,chords:[0,4,0,3,5,1,4,4],a:'4/1 2/.5 0/.5 2/1 | 3/.5 4/.5 6/1 4/1',b:'7/.5 9/.5 7/1 5/.5 4/.5 | 3/.5 2/.5 1/1 0/1'},
 {id:'park-13',area:'Luxemburg',title:'Sonnenhof',description:'Sanfte Gitarre, Flöte und ein leichter Hofgarten-Tanz',bpm:110,tonic:53,scale:major,lead:'guitar',answer:'flute',groove:'folk',beats:4,chords:[0,2,3,4,5,3,1,4],a:'0/1 2/.5 3/.5 4/1 2/.5 1/.5 | 2/1 4/.5 6/.5 5/1 r/1',b:'5/.5 6/.5 7/1 4/.5 2/.5 3/1 | 4/.5 3/.5 1/1 -1/.5 1/.5 0/1'},
 {id:'park-14',area:'Monaco',title:'Riviera Rush',description:'Glänzende Bläser, Funkbass und Rennpuls',bpm:140,tonic:51,scale:dorian,lead:'brass',answer:'synth',groove:'race',beats:4,chords:[0,3,0,6,3,5,1,4],a:'0/.75 r/.25 2/.5 4/.5 6/.75 4/.25 2/1 | 3/.5 5/.5 7/.75 6/.25 4/.5 r/.5 2/1',b:'7/.5 7/.5 6/.75 4/.25 5/.5 6/.5 4/1 | 3/.75 2/.25 0/.5 -1/.5 1/.5 2/.5 0/1'},
 {id:'park-15',area:'Österreich',title:'Donaugold',description:'Akkordeon und Streicher in einem schnellen Walzer',bpm:168,tonic:50,scale:major,lead:'accordion',answer:'strings',groove:'waltz',beats:3,chords:[0,4,0,3,5,1,4,4],a:'2/.75 4/.25 7/1 6/.5 4/.5 | 3/.75 4/.25 6/1 4/1',b:'5/1 7/.5 9/.5 8/1 | 6/.5 4/.5 3/.5 1/.5 0/1'},
 {id:'park-16',area:'Portugal',title:'Segel im Abendrot',description:'Nylon-Gitarre, melancholische Flöte und rollender Seerhythmus',bpm:118,tonic:52,scale:harmonic,lead:'guitar',answer:'flute',groove:'sea',beats:4,chords:[0,3,5,4,0,5,3,4],a:'0/1 2/.5 3/.5 4/1 3/.5 2/.5 | 1/.75 -1/.25 1/1 4/1 r/1',b:'7/1 6/.75 5/.25 4/.5 3/.5 2/1 | 3/.5 2/.5 1/.75 -1/.25 0/2'},
 {id:'park-17',area:'Russland · Euro-Mir',title:'Orbit 17',description:'Eigenes Space-Dance-Thema mit Synth-Hook und pulsierendem Sequenzer',bpm:146,tonic:54,scale:minor,lead:'synth',answer:'bell',groove:'space',beats:4,chords:[0,5,2,6,0,3,5,4],a:'0/.75 7/.25 4/.5 2/.5 0/.5 r/.5 6/1 | 5/.75 4/.25 2/.5 0/.5 2/1 r/1',b:'7/1 9/.5 7/.5 6/.75 4/.25 2/1 | 5/.5 4/.5 3/.75 2/.25 1/.5 -1/.5 0/1'},
 {id:'park-18',area:'Schweiz',title:'Gipfelwind',description:'Alphornartige Bläser, Kuhglocken und klarer Bergpuls',bpm:128,tonic:48,scale:major,lead:'brass',answer:'flute',groove:'alpine',beats:4,chords:[0,0,4,0,3,5,1,4],a:'0/1.5 4/.5 7/1 4/1 | 2/.5 4/.5 6/1 4/1 r/1',b:'7/1 9/1 7/.5 5/.5 4/1 | 3/.5 4/.5 2/1 1/.5 -1/.5 0/1'},
 {id:'park-19',area:'Skandinavien',title:'Nordlichtfahrt',description:'Nordische Flöte, Streicherflächen und große Rahmentrommeln',bpm:114,tonic:50,scale:dorian,lead:'flute',answer:'strings',groove:'nordic',beats:4,chords:[0,6,3,0,5,3,6,4],a:'0/1.5 2/.5 4/1 5/1 | 6/1 4/.5 2/.5 3/1 r/1',b:'7/1 6/.5 4/.5 5/1 3/1 | 4/.5 3/.5 2/1 -1/.5 0/.5 0/1'},
 {id:'park-20',area:'Spanien',title:'Fuego de la Plaza',description:'Flamencoartige Gitarre, Kastagnetten und spanischer Rumba-Puls',bpm:132,tonic:52,scale:phrygian,lead:'guitar',answer:'brass',groove:'rumba',beats:4,chords:[0,1,0,6,3,1,6,0],a:'0/.5 1/.25 2/.25 4/.5 3/.5 2/.75 1/.25 0/1 | 1/.75 3/.25 5/.5 4/.5 3/.5 1/.5 0/1',b:'7/.75 6/.25 4/.5 2/.5 3/.5 4/.5 5/1 | 4/.5 3/.5 2/.5 1/.5 0/1 r/1'},
];

export function melodyTokens(text:string){return text.replaceAll('|',' ').trim().split(/\s+/).map(token=>{const [degree,length]=token.split('/');return {degree:degree==='r'?null:Number(degree),length:Number(length)}})}
const pitch=(t:AreaTheme,degree:number)=>t.tonic+t.scale[((degree%7)+7)%7]+12*Math.floor(degree/7);
const cached=new Map<string,MusicScore>();

/** A 32-bar arrangement: statement, answer, reduced bridge, then a fuller return. */
export function areaScore(id:string):MusicScore {
 const found=cached.get(id);if(found)return found;
 const t=AREA_THEMES.find(theme=>theme.id===id);if(!t)throw new Error('Unbekannter Musikbereich: '+id);
 const notes:MusicNote[]=[],quarter=60/t.bpm,total=32*t.beats;
 const add=(beat:number,length:number,midi:number,instrument:Instrument,velocity:number,pan=0)=>{
  if(beat>=total)return;notes.push({time:beat*quarter,duration:Math.min(length,total-beat)*quarter,midi,instrument,velocity,pan});
 };
 for(let phrase=0;phrase<16;phrase++){
  const section=Math.floor(phrase/4),answer=phrase%4>=2,melody=melodyTokens(answer?t.b:t.a);let beat=phrase*t.beats*2;
  const instrument=section===2?t.answer:t.lead;
  for(let i=0;i<melody.length;i++){
   const n=melody[i];if(n.degree!==null){
    // Keep the regional motif in the middle register, with breathing room between short notes.
    if(n.length>=1||i%2===0)add(beat,Math.max(.4,n.length*.86),Math.min(74,pitch(t,n.degree)),instrument,section===2?.38:.52,-.08);
   }beat+=n.length;
  }
 }
 for(let bar=0;bar<32;bar++){
  const start=bar*t.beats,section=Math.floor(bar/8),chord=t.chords[bar%8],root=pitch(t,chord),soft=section===2,energy=soft?.65:section===3?1.06:1;
  const electronic=['space','race','industrial','breakbeat','disco','island'].includes(t.groove);
  const triad=[0,2,4].map(i=>pitch(t,chord+i));
  // Two-note voicings leave space for bass, melody, counterline and percussion on eight voices.
  for(const [i,p] of [triad[1],triad[2]].entries())add(start,t.beats-.18,p,'strings',.10*energy,i===0?-.45:.45);
  const bassRoot=36+((root%12)+12)%12;
  const bassBeats=t.beats===3?[0,1,1.5,2.5]:electronic?[0,.75,1.5,2,2.75,3.5]:t.groove==='rumba'||t.groove==='adventure'?[0,1.5,2.5,3]:[0,.75,2,2.75];
  bassBeats.forEach((b,i)=>add(start+b,electronic?.56:.78,bassRoot+(i%3===2?7:0),'bass',.92*energy));
  const arpInstrument=t.groove==='space'?'synth':t.groove==='fairy'?'bell':t.groove==='adventure'?'marimba':['waltz','folk'].includes(t.groove)?'pluck':'guitar';
  const arpStep=2;
  for(let b=.5,i=0;b<t.beats;b+=arpStep,i++){
   if(soft&&i%2===1)continue;
   add(start+b,Math.min(.26,arpStep*.6),Math.min(72,triad[(i+bar)%3]),arpInstrument,.17*energy,.5);
  }
  // Small responses at the ends of phrases rather than constant decorative notes.
  if(bar%4===3&&section!==2)add(start+t.beats-1,.65,Math.min(72,pitch(t,chord+2)),t.answer,.2,-.48);
  let kicks:number[],snares:number[],hats:number[];
  if(t.beats===3){kicks=[0,1.5];snares=t.groove==='jig'?[1.5,2.5]:[1,2];hats=[.5,1.5,2.5];}
  else if(['space','disco','race'].includes(t.groove)){kicks=[0,1,2,3];snares=[1,3];hats=[.5,1.5,2.5,3.5];}
  else if(t.groove==='breakbeat'){kicks=[0,1.75,2.5];snares=[1,3];hats=[.5,1.5,2,2.75,3.5];}
  else if(t.groove==='industrial'){kicks=[0,.75,2,2.5];snares=[1,3];hats=[.5,1.5,2.75,3.5];}
  else if(['island','rumba','adventure'].includes(t.groove)){kicks=[0,1.5,3];snares=[1,2.5];hats=[.5,1.75,2,3.5];}
  else if(['sea','nordic'].includes(t.groove)){kicks=[0,1.5,2.5];snares=[1,3];hats=[1.5,3.5];}
  else{kicks=[0,1.5,2.5];snares=[1,3];hats=[.5,1.5,2.5,3.5];}
  kicks.forEach(b=>add(start+b,.3,36,'kick',Math.min(1,.96*energy)));
  snares.forEach(b=>add(start+b,.22,38,'snare',.76*energy,.08));
  hats.forEach((b,i)=>add(start+b,.055,42,'hat',(i%2?.16:.11)*energy,-.4));
  if(bar%8===7&&!soft)for(let i=0;i<3;i++)add(start+t.beats-.75+i*.25,.09,38,'snare',(.4+i*.09)*energy,.2);
 }
 notes.sort((a,b)=>a.time-b.time);
 const score:MusicScore={title:t.title,duration:total*quarter,notes,mix:'combat'};cached.set(id,score);return score;
}
