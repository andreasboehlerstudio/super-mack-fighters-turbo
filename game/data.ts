export type FighterId = 'ed'|'snorri'|'roland'|'marianne'|'juergen'|'mauritia'|'michael'|'thomas'|'annkathrin'|'frederik'|'alexia'|'miriam'|'katja'|'nicolas'|'max'|'matthias'|'laurent'|'reinhold'|'nathalie'|'andreas'|'wakala'|'graumacher';
export type SpecialKind = 'bolt'|'wave'|'dash'|'burst'|'arc';
export interface FighterDef {id:FighterId;name:string;short:string;color:string;special:string;kind:SpecialKind;speed:number;power:number;reach:number;shotSpeed:number;cooldown:number;tag:string;note:string;}
const f=(id:FighterId,name:string,color:string,special:string,kind:SpecialKind,speed:number,power:number,reach:number,shotSpeed:number,cooldown:number,tag:string,note:string):FighterDef=>({id,name,short:name.replace(' Mack',''),color,special,kind,speed,power,reach,shotSpeed,cooldown,tag,note});
export const FIGHTERS:FighterDef[]=[
 f('ed','Ed Euromaus','#ffd35a','Sternen-Sprint','dash',260,16,85,560,150,'FLINK & MUTIG','Ein schneller Vorstoß. Überwinde Distanz und erwische offene Deckung.'),
 f('snorri','Snorri','#51dceb','Sechsarm-Strudel','wave',205,20,113,310,175,'REICHWEITE & WASSER','Eine tiefe Wasserwelle. Der Gegner kann darüber springen.'),
 f('roland','Roland Mack','#ffac60','Achterbahn-Welle','arc',215,22,102,410,180,'SCHWUNG & KRAFT','Ein goldener Energie-Bogen in Achterbahnform.'),
 f('marianne','Marianne Mack','#fb9dc4','Herzfunkeln','burst',225,18,88,340,150,'NÄHE & FUNKEN','Ein funkelnder Rundumschlag mit kurzer Reichweite.'),
 f('juergen','Jürgen Mack','#85b5ff','Taktgeber','bolt',210,23,97,440,190,'RUHE & PRÄZISION','Ein langsamer vorbereiteter, kräftiger Energieimpuls.'),
 f('mauritia','Mauritia Mack','#d7b0ff','Kristallbogen','arc',240,18,90,470,150,'BOGEN & TEMPO','Ein schneller violetter Kristallbogen.'),
 f('michael','Michael Mack','#54ffc4','Pixelportal','bolt',235,18,93,600,160,'DISTANZ & TEMPO','Ein gerader, besonders schneller Pixelblitz.'),
 f('thomas','Thomas Mack','#ff846b','Feuerwirbel','burst',210,25,110,330,205,'NÄHE & KRAFT','Ein kräftiger Wirbel. Braucht Abstand zum nächsten Einsatz.'),
 f('annkathrin','Ann-Kathrin Mack','#9df4dd','Lichtbrücke','wave',245,17,94,470,150,'BODEN & LICHT','Eine flache Lichtwelle, die viel Boden abdeckt.'),
 f('frederik','Frederik Mack','#9dc7ff','Team-Boost','dash',255,19,95,620,175,'SPRINT & SCHUB','Ein weiter Energie-Sprint mit kurzer Anlaufphase.'),
 f('alexia','Alexia Mack','#f7a5f6','Prismenpuls','bolt',240,19,88,480,145,'DISTANZ & TAKT','Ein kompakter Prismenpuls mit kurzer Erholung.'),
 f('miriam','Miriam Mack','#70e4d0','Adria-Welle','wave',235,21,102,380,170,'WASSER & WEITE','Eine türkisfarbene Welle entlang des Bodens.'),
 f('katja','Katja Mack','#ffa0d0','Sternenpirouette','burst',260,18,96,400,155,'TANZ & NÄHE','Ein schneller Sternenwirbel in beide Richtungen.'),
 f('nicolas','Nicolas Mack','#c3dd7b','Resonanzring','arc',225,20,104,510,175,'BOGEN & WEITE','Ein grüner Ring mit schwingender Flugbahn.'),
 f('max','Max Mager','#ffb064','Schnitt-Sprint','dash',270,17,90,640,155,'SCHNITT & SPRINT','Ein orangefarbener Schnitt durch die Arena. Schnell heran, schnell treffen.'),
 f('matthias','Matthias Schilling','#76cafa','Fokusblitz','bolt',220,24,104,520,195,'FOKUS & KRAFT','Ein gebündelter blauer Lichtimpuls mit großer Reichweite.'),
 f('laurent','Laurent Kuhn','#ffe380','Lichtkante','wave',240,19,99,510,170,'LICHT & BODEN','Eine goldene Lichtkante fliegt knapp über dem Boden.'),
 f('reinhold','Reinhold Lamers','#72e0d0','Bassdruck','burst',195,27,112,320,220,'BASS & NÄHE','Ein kräftiger türkisfarbener Klangstoß in alle Richtungen.'),
 f('nathalie','Nathalie Ruder','#ffb2dc','Farbflug','arc',255,18,90,550,150,'FARBE & BOGEN','Ein pinker Farbfunke schwingt durch die Luft.'),
 f('andreas','Andreas Böhler','#bd9cff','Render-Rush','dash',250,21,97,580,185,'RHYTHMUS & SCHUB','Ein violetter Vorstoß hinterlässt eine leuchtende Spur.'),
 f('wakala','Wakala','#c5a1ee','Wunderland-Sprung','dash',225,22,105,510,185,'TRICK & SCHRECK','Der unheimliche Hase aus Traumatica. Täuscht an und springt nach vorn.'),
 f('graumacher','Der Graumacher','#c5c8d8','Stillstands-Welle','wave',165,24,116,330,210,'FINALHERAUSFORDERUNG','Erst leuchtet der Boden, dann kommt die Welle. Springe oder blocke!'),
];
export const HEROES=FIGHTERS.filter(f=>f.id!=='graumacher');
export const fighter=(id:FighterId)=>FIGHTERS.find(f=>f.id===id)!;
export interface Station {id:string;name:string;kind:'Themenbereich'|'Achterbahn'|'Unternehmen'|'Marke / Studio'|'Finale'|'Spezialarena';arena:number;custom:boolean;source:string;subtitle:string;}
const park='https://www.europapark.de/de/freizeitpark/attraktionen/themenbereiche';
const group='https://mack.group/de/mack-gruppe/geschaeftsfelder/wir-schaffen-erlebnisse';
const areaNames=['Abenteuerland','Deutschland','England','Frankreich','Griechenland','Grimms Märchenwald','Holland','Irland','Island','Italien','Königreich der Minimoys','Kroatien','Liechtenstein','Luxemburg','Monaco','Österreich','Portugal','Russland','Schweiz','Skandinavien','Spanien'];
export const STATIONS:Station[]=areaNames.map((name,i)=>({id:'park-'+i,name,kind:'Themenbereich' as const,arena:name==='Griechenland'?1:name==='Skandinavien'?2:name==='Italien'?0:i%3,custom:true,source:park,subtitle:'Themenbereich · '+name}));
export const SHORT_TOUR=['park-9','park-4','park-19','park-6','park-15','park-20','park-3','park-1'];
export const FULL_TOUR=['park-1','park-9','park-2','park-7','park-5','park-12','park-14','park-0','park-16','park-13','park-11','park-4','park-18','park-3','park-8','park-19','park-17','park-6','park-10','park-15','park-20'];
export const station=(id:string)=>STATIONS.find(s=>s.id===id)??STATIONS[9];
export const SOURCES=[{label:'21 offizielle Themenbereiche',url:park},{label:'Die zwölf aktuellen Familienmitglieder',url:'https://mack.group/de/ueber-uns/familie-mack'},{label:'Wakala · offizielle Traumatica-Referenz',url:'https://mack.group/de/presse-medien/pressemitteilungen/2025-09-05/traumatica-festival-of-fear-1'},{label:'Snorri: der Sixtopus',url:'https://www.europapark.de/de/rulantica/infos/media-unterhaltung/story/snorri'}];
