import {neutral,type Input} from './combat.ts';
const keys=Object.keys(neutral()) as (keyof Input)[];
export const packInput=(input:Input)=>keys.reduce((n,k,i)=>n|(input[k]?1<<i:0),0);
export const unpackInput=(value:number)=>Object.fromEntries(keys.map((k,i)=>[k,!!(value&(1<<i))])) as Input;
export class NetworkSession {
 frame=0;local=new Map<number,number>();remote=new Map<number,number>();remoteReady=false;localReady=false;paused=[false,false];error='';lastMessage=Date.now();
 peer:RTCPeerConnection;channel:RTCDataChannel;side:0|1;
 constructor(peer:RTCPeerConnection,channel:RTCDataChannel,side:0|1){this.peer=peer;this.channel=channel;this.side=side;
  for(let n=0;n<4;n++){this.local.set(n,0);this.remote.set(n,0)}
  channel.addEventListener('message',this.receive);channel.addEventListener('close',this.closed);channel.addEventListener('error',this.closed);
 }
 private closed=()=>{this.error='Verbindung getrennt. Bitte starte eine neue Einladung.'};
 private receive=(event:MessageEvent)=>{try{const m=JSON.parse(event.data);this.lastMessage=Date.now();if(m.type==='ready')this.remoteReady=true;else if(m.type==='pause'&&typeof m.value==='boolean')this.paused[1-this.side]=m.value;else if(m.type==='input'&&Number.isInteger(m.frame)&&m.frame>=this.frame&&m.frame<this.frame+300&&Number.isInteger(m.bits)&&m.bits>=0&&m.bits<1024&&!this.remote.has(m.frame))this.remote.set(m.frame,m.bits)}catch{this.error='Ungültige Spieldaten empfangen.'}};
 send(value:unknown){if(this.channel.readyState!=='open'){this.closed();return}this.channel.send(JSON.stringify(value));}
 ready(){if(!this.localReady){this.localReady=true;this.send({type:'ready'})}}
 pause(value:boolean){this.paused[this.side]=value;this.send({type:'pause',value})}
 get waiting(){return !this.remoteReady||this.paused.some(Boolean)||this.error!==''}
 inputs(read:()=>Input):[Input,Input]|null {
  if(this.waiting)return null;
  const future=this.frame+4;if(!this.local.has(future)){const bits=packInput(read());this.local.set(future,bits);this.send({type:'input',frame:future,bits})}
  if(!this.remote.has(this.frame)){if(Date.now()-this.lastMessage>15000)this.error='Die Verbindung antwortet nicht mehr.';return null}
  const own=unpackInput(this.local.get(this.frame)??0),other=unpackInput(this.remote.get(this.frame)!);this.local.delete(this.frame);this.remote.delete(this.frame);this.frame++;return this.side===0?[own,other]:[other,own];
 }
 destroy(){this.channel.removeEventListener('message',this.receive);this.channel.removeEventListener('close',this.closed);this.channel.removeEventListener('error',this.closed);this.channel.close();this.peer.close()}
}
export function gatherIce(peer:RTCPeerConnection){return new Promise<void>((resolve,reject)=>{if(peer.iceGatheringState==='complete'){resolve();return}const done=()=>{clearTimeout(timer);peer.removeEventListener('icegatheringstatechange',change);resolve()},change=()=>{if(peer.iceGatheringState==='complete')done()},timer=setTimeout(()=>{peer.removeEventListener('icegatheringstatechange',change);if(peer.localDescription?.sdp.includes('candidate:'))resolve();else reject(new Error('Keine Netzwerkverbindung gefunden.'))},10000);peer.addEventListener('icegatheringstatechange',change)})}
