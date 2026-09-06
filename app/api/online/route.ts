import {database} from '@/db/client';
import {HEROES,STATIONS} from '@/game/data';
const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const hash=async(s:string)=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))).map(x=>x.toString(16).padStart(2,'0')).join('');
export async function GET(request:Request){
 const url=new URL(request.url),code=url.searchParams.get('code')??'';if(!/^[A-Z2-9]{10}$/.test(code))return new Response('Einladung nicht gefunden',{status:404});
 const room=await database().prepare('SELECT token, offer, answer, config FROM rooms WHERE code = ? AND expires > ?').bind(code,Date.now()).first<{token:string;offer:string;answer:string|null;config:string}>();
 if(!room)return new Response('Einladung abgelaufen',{status:404});
 const token=request.headers.get('authorization')?.replace(/^Bearer /,'');
 if(token){if(await hash(token)!==room.token)return new Response('Nicht erlaubt',{status:403});return Response.json({answer:room.answer?JSON.parse(room.answer):null});}
 if(room.answer)return new Response('Dieser Kampf ist bereits belegt',{status:409});
 return Response.json({offer:JSON.parse(room.offer),config:JSON.parse(room.config)});
}
export async function POST(request:Request){
 const raw=await request.text();if(raw.length>40000)return new Response('Zu groß',{status:413});let b;try{b=JSON.parse(raw)}catch{return new Response('Ungültige Anfrage',{status:400})}
 if(!b||typeof b!=='object')return new Response('Ungültige Anfrage',{status:400});
 if(b.action==='create'&&b.offer?.type==='offer'&&typeof b.offer.sdp==='string'&&b.offer.sdp.length<30000&&HEROES.some(f=>f.id===b.config?.p1)&&STATIONS.some(s=>s.id===b.config?.stationId)){
  const bytes=crypto.getRandomValues(new Uint8Array(10)),code=Array.from(bytes,x=>alphabet[x%32]).join(''),token=crypto.randomUUID();
  await database().prepare('DELETE FROM rooms WHERE expires < ?').bind(Date.now()).run();
  const config={p1:b.config.p1,stationId:b.config.stationId,turbo:1.18,parry:true};
  await database().prepare('INSERT INTO rooms (code, token, offer, config, expires) VALUES (?, ?, ?, ?, ?)').bind(code,await hash(token),JSON.stringify(b.offer),JSON.stringify(config),Date.now()+600000).run();
  return Response.json({code,token});
 }
 if(b.action==='join'&&typeof b.code==='string'&&/^[A-Z2-9]{10}$/.test(b.code)&&b.answer?.type==='answer'&&typeof b.answer.sdp==='string'&&b.answer.sdp.length<30000&&HEROES.some(f=>f.id===b.hero)){
  const result=await database().prepare('UPDATE rooms SET answer = ? WHERE code = ? AND answer IS NULL AND expires > ?').bind(JSON.stringify({description:b.answer,hero:b.hero}),b.code,Date.now()).run();
  return result.meta.changes?Response.json({joined:true}):new Response('Einladung abgelaufen oder bereits belegt',{status:409});
 }
 return new Response('Ungültige Einladung',{status:400});
}
