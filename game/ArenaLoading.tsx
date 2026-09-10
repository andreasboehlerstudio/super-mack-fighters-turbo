import {useEffect,useRef} from 'react';

// Deliberate bitmap lettering: no font interpolation or vector spinner while assets load.
const LETTERS:Record<string,string[]>={
 D:['11110','10001','10001','10001','10001','10001','11110'],
 I:['11111','00100','00100','00100','00100','00100','11111'],
 E:['11111','10000','10000','11110','10000','10000','11111'],
 A:['01110','10001','10001','11111','10001','10001','10001'],
 R:['11110','10001','10001','11110','10100','10010','10001'],
 N:['10001','11001','11001','10101','10011','10011','10001'],
 Ö:['01010','00000','01110','10001','10001','10001','10001','10001','01110'],
 F:['11111','10000','10000','11110','10000','10000','10000'],
 T:['11111','00100','00100','00100','00100','00100','00100'],
};
export function ArenaLoading(){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const ctx=ref.current!.getContext('2d')!;ctx.imageSmoothingEnabled=false;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;let frame=0;
  const draw=()=>{
   ctx.fillStyle='#111b32';ctx.fillRect(0,0,960,540);
   const rect=(x:number,y:number,w:number,h:number,c:string)=>{ctx.fillStyle=c;ctx.fillRect(x,y,w,h)};
   // Stepped castle gate, shaded with flat palette clusters.
   rect(397,158,166,130,'#080e20');
   for(const x of [402,518]){
    rect(x,168,40,114,'#58748c');rect(x,168,6,114,'#89acb5');rect(x+32,168,8,114,'#33455f');
    for(let i=0;i<3;i++)rect(x+i*14,154,10,22,'#8eadb5');
    for(let y=186;y<278;y+=18){rect(x,y,40,3,'#263b55');rect(x+(y%36?13:26),y-15,3,15,'#33455f');}
    rect(x+14,201,12,24,'#101b33');rect(x+17,204,6,15,'#ffc76a');
   }
   rect(442,182,76,26,'#708f9e');rect(442,182,76,5,'#c5cfbb');
   rect(454,208,52,8,'#58748c');rect(461,216,38,9,'#58748c');
   rect(459,234,42,48,'#543948');rect(462,234,6,48,'#c68d53');rect(489,234,6,48,'#c68d53');
   rect(468,242,21,3,'#e6ad61');rect(468,267,21,3,'#e6ad61');
   rect(391,282,178,6,'#e9c081');rect(385,288,190,5,'#6e5360');
   for(const x of [416,532]){rect(x,127,3,27,'#f7df9a');rect(x+3,128,23,12,'#dc7847');rect(x+3,140,17,3,'#8f4141');}
   const text='DIE ARENA ÖFFNET',unit=3,start=Math.round((960-(text.length*6-1)*unit)/2);
   for(let i=0;i<text.length;i++){
    const rows=LETTERS[text[i]];if(!rows)continue;
    rows.forEach((row,y)=>[...row].forEach((p,x)=>{if(p==='1'){const px=start+i*18+x*unit,py=324+(y+7-rows.length)*unit;rect(px+3,py+3,3,3,'#554054');rect(px,py,3,3,'#ffe4a0');}}));
   }
   // Cycling blocks signal activity, not an invented loading percentage.
   for(let i=0;i<8;i++){const active=reduced?i===3:(i-frame+8)%8<3;rect(419+i*16,371,10,10,active?'#ffd177':'#34475e');if(active)rect(419+i*16,371,10,3,'#fff0b7');}
   frame=(frame+1)%8;
  };
  draw();if(reduced)return;const timer=setInterval(draw,150);return()=>clearInterval(timer);
 },[]);
 return <div className="battle-loading" role="status" aria-label="Die Arena öffnet …"><canvas ref={ref} width={960} height={540} aria-hidden="true"/></div>;
}
