import {database} from '@/db/client';
import {HEROES} from '@/game/data';
export async function GET(request:Request){const tour=new URL(request.url).searchParams.get('tour')??'short';const result=await database().prepare('SELECT initials, hero, score FROM highscores WHERE tour = ? ORDER BY score DESC, created ASC LIMIT 10').bind(tour).all();return Response.json(result.results);}
export async function POST(request:Request){
 if(Number(request.headers.get('content-length'))>2048)return new Response('Zu groß',{status:413});
 const raw=await request.text();if(raw.length>2048)return new Response('Zu groß',{status:413});
 let b:Record<string,unknown>|null=null;try{b=JSON.parse(raw)}catch{}
 if(!b||typeof b.id!=='string'||!/^[-a-z0-9]{36}$/.test(b.id)||typeof b.initials!=='string'||!/^[A-Z0-9]{3}$/.test(b.initials)||!HEROES.some(f=>f.id===b.hero)||!Number.isInteger(b.score)||Number(b.score)<0||Number(b.score)>9999999||typeof b.tour!=='string'||!['short','full','summer','halloween','winter','rulantica'].includes(b.tour))return new Response('Ungültiger Eintrag',{status:400});
 await database().prepare('INSERT INTO highscores (id, initials, hero, score, tour, created) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO NOTHING').bind(b.id,b.initials,b.hero,b.score,b.tour,Date.now()).run();return Response.json({saved:true});
}
