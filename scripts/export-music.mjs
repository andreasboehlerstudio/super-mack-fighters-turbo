import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {AREA_THEMES,areaScore,melodyTokens} from '../game/area-music.ts';
import {scoreMidi} from '../game/music-score.ts';
import {SnesMusic} from '../game/snes-music.ts';

const root=fileURLToPath(new URL('..',import.meta.url)),out=path.join(root,'public/assets/music');
const scratch=process.env.MUSIC_RENDER_OUTPUT||path.join(root,'../work/music-render/audio');
await fs.mkdir(out,{recursive:true});await fs.mkdir(scratch,{recursive:true});
const {OfflineAudioContext}=createRequire(import.meta.url)(process.env.MUSIC_RENDER_MODULE||'web-audio-engine');
const manifest=[],measurements=[];
for(const t of AREA_THEMES){
 for(const text of [t.a,t.b])if(melodyTokens(text).reduce((s,n)=>s+n.length,0)!==t.beats*2)throw new Error('Unvollständiger Takt: '+t.id);
 const score=areaScore(t.id),midi=scoreMidi(score,t.bpm,t.beats,t.groove==='jig');await fs.writeFile(path.join(out,t.id+'.mid'),midi);
 const rate=32000,length=Math.round(score.duration*rate),c=new OfflineAudioContext(2,length*2,rate),gain=c.createGain();gain.gain.value=1;gain.connect(c.destination);
 const synth=new SnesMusic(c,gain);
 for(let loop=0;loop<2;loop++)for(const note of score.notes)synth.play(note,note.time+loop*score.duration);
 const rendered=await c.startRendering(),channels=[0,1].map(i=>rendered.getChannelData(i).slice(length,length*2));
 // Render a warm second pass: echo and release tails already cross the loop boundary.
 let peak=0,sum=0;for(const channel of channels)for(const v of channel){if(!Number.isFinite(v))throw new Error('Ungültige Audiodaten: '+t.id);peak=Math.max(peak,Math.abs(v));sum+=v*v;}
 const rms=Math.sqrt(sum/(length*2));if(peak<.01||peak>1||rms<.01)throw new Error('Audiopegel außerhalb des Ziels: '+t.id+' '+peak+' '+rms);
 const buffer=Buffer.alloc(44+length*4);buffer.write('RIFF');buffer.writeUInt32LE(buffer.length-8,4);buffer.write('WAVEfmt ',8);buffer.writeUInt32LE(16,16);buffer.writeUInt16LE(1,20);buffer.writeUInt16LE(2,22);buffer.writeUInt32LE(rate,24);buffer.writeUInt32LE(rate*4,28);buffer.writeUInt16LE(4,32);buffer.writeUInt16LE(16,34);buffer.write('data',36);buffer.writeUInt32LE(length*4,40);
 const amplitude=.78/peak;for(let i=0;i<length;i++)for(let ch=0;ch<2;ch++)buffer.writeInt16LE(Math.round(channels[ch][i]*amplitude*32767),44+i*4+ch*2);
 const wav=path.join(scratch,t.id+'.wav');await fs.writeFile(wav,buffer);
 execFileSync('ffmpeg',['-v','error','-y','-i',wav,'-c:a','libvorbis','-q:a','4','-metadata','title='+t.title,'-metadata','artist=Super Mack Fighters Turbo','-metadata','comment=Original area theme; SNES-inspired sample arrangement',path.join(out,t.id+'.ogg')]);
 manifest.push({id:t.id,area:t.area,title:t.title,description:t.description,bpm:t.bpm,meter:t.groove==='jig'?'6/8':t.beats===3?'3/4':'4/4',bars:32,duration:score.duration,midi:`/assets/music/${t.id}.mid`,audio:`/assets/music/${t.id}.ogg`});
 measurements.push({id:t.id,notes:score.notes.length,seconds:score.duration,peak,rms});
 console.log(t.id+' · '+t.title+' · '+score.duration.toFixed(1)+' s');
}
await fs.writeFile(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
await fs.writeFile(path.join(scratch,'measurements.json'),JSON.stringify(measurements,null,2)+'\n');
const escape=text=>text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const galleryPath=path.join(root,'public/art-gallery.html');let gallery=await fs.readFile(galleryPath,'utf8');
gallery=gallery.replace(/<div class="music-panel"[\s\S]*?<\/div>/g,'');
for(const t of manifest){
 const marker=new RegExp('(<figure><a href="/assets/arenas/'+t.id+'\\.png">[\\s\\S]*?</figcaption>)(</figure>)');
 gallery=gallery.replace(marker,(_,start,end)=>`${start}<div class="music-panel" data-area="${t.id}"><h2>${escape(t.title)}</h2><p>${escape(t.description)}</p><small>${t.bpm} BPM · ${Math.round(t.duration)} SEK. · EIGENE KOMPOSITION</small><button type="button" data-play="${t.id}" aria-label="${escape(t.area)}: ${escape(t.title)} abspielen" aria-pressed="false">▶ ANHÖREN</button><a href="${t.midi}" download="${escape(t.title)}.mid">MIDI ↓</a><progress max="1" value="0" aria-label="Fortschritt der Hörprobe"></progress><span class="music-status" aria-live="polite"></span></div>${end}`);
}
if(!gallery.includes('/music-gallery.js'))gallery=gallery.replace('</header>','<div class="gallery-music-controls"><a href="/">◀ ZUM SPIEL</a><label>♪ LAUTSTÄRKE <input id="music-volume" aria-label="Lautstärke der Hörproben" type="range" min="0" max="100" value="40"></label><a href="/assets/music/park-soundtracks.zip" download>ALLE 21 MIDI ↓</a></div></header>').replace('</html>','<link rel="stylesheet" href="/music-gallery.css"><script src="/music-gallery.js" defer></script></html>');
gallery=gallery.replace('21 Pixel-Art-Arenen · Alle spielbaren Themenbereiche<br>Ein Bild anklicken, um es in voller Größe zu öffnen.','21 Pixel-Art-Arenen · 21 eigene SNES-Soundtracks<br>Musik anhören, als MIDI herunterladen und die Arena in voller Größe öffnen.');
await fs.writeFile(galleryPath,gallery);
