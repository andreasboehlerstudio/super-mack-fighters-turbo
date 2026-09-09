export type FighterId = 'ed'|'edda'|'snorri'|'roland'|'marianne'|'juergen'|'mauritia'|'michael'|'thomas'|'annkathrin'|'frederik'|'alexia'|'miriam'|'katja'|'nicolas'|'max'|'matthias'|'laurent'|'reinhold'|'nathalie'|'andreas'|'karsten'|'vendel'|'valentina'|'jan'|'schaer'|'glen'|'steffen'|'scholz'|'wakala'|'bobo'|'mross'|'otto'|'ross'|'freudenreich'|'robbemond'|'olli'|'boeckli'|'louis'|'tesla'|'graumacher';
export type SpecialKind = 'bolt'|'wave'|'dash'|'burst'|'arc';
export interface FighterDef {id:FighterId;name:string;short:string;color:string;special:string;kind:SpecialKind;speed:number;power:number;reach:number;shotSpeed:number;cooldown:number;tag:string;note:string;}
const f=(id:FighterId,name:string,color:string,special:string,kind:SpecialKind,speed:number,power:number,reach:number,shotSpeed:number,cooldown:number,tag:string,note:string):FighterDef=>({id,name,short:name.replace(' Mack',''),color,special,kind,speed,power,reach,shotSpeed,cooldown,tag,note});
export const FIGHTERS:FighterDef[]=[
 f('ed','Ed Euromaus','#ffd35a','Sternen-Sprint','dash',260,16,85,560,150,'FLINK & MUTIG','Ein schneller Vorstoß. Überwinde Distanz und erwische offene Deckung.'),
 f('edda','Edda Euromausi','#ff8dcc','Schleifenbogen','arc',265,17,88,535,150,'MUT & SCHWUNG','Ein pinker Funkelbogen. Mit Pirouette und Sprint bleibt Edda in Bewegung.'),
 f('snorri','Snorri','#51dceb','Sechsarm-Strudel','wave',205,20,113,310,175,'REICHWEITE & WASSER','Eine tiefe Wasserwelle. Der Gegner kann darüber springen.'),
 {...f('freudenreich','Madame Freudenreich','#ef91b5','Dino-Stampfer','wave',190,26,108,350,205,'DINO & WUCHT','Eine Dino-Spur rollt am Boden entlang. Langsamer Gang, kräftige Überraschungen.'),short:'Madame F.'},
 {...f('robbemond','Van Robbemond','#ff9d74','Batavia-Vorstoß','dash',250,21,103,570,185,'PIRAT & SCHWUNG','Ein entschlossener Ausfall, eine Schatzmünze und eine Hafenwelle.'),short:'Robbemond'},
 f('tesla','Nikola Tesla','#a6b5ff','Spulenblitz','bolt',225,22,98,640,185,'STROM & DISTANZ','Der Voltron-Erfinder schickt einen kantigen Blitz voraus und folgt mit einem Spannungssprung.'),
 f('wakala','Wakala','#c5a1ee','Wunderland-Sprung','dash',225,22,105,510,185,'TRICK & SCHRECK','Der unheimliche Hase aus Traumatica. Täuscht an und springt nach vorn.'),
 f('olli','Olli Eurofant','#8abefc','Rüsselgriff','burst',185,27,116,320,215,'GRIFF & NÄHE','Ein kurzer Rüsselgriff zieht offene Gegner heran. Die Stampfwelle deckt den Boden ab.'),
 f('boeckli','Böckli','#ffd68f','Gipfelsturm','dash',260,20,98,590,175,'HÖRNER & ANLAUF','Ein schneller Ansturm, ein Alpenbogen und ein kräftiger Hornwirbel.'),
 f('louis','Louis','#ff947f','Federbogen','arc',280,16,84,570,140,'FEDERN & FLINKHEIT','Der flinke Hahn wirbelt Federn durch die Luft und setzt mit einem Sprint nach.'),
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
 f('scholz','Michael Scholz','#f2ce79','Pionier-Impuls','wave',200,23,104,420,185,'ERFAHRUNG & WEITBLICK','Der Parkpionier: Eine goldene Bodenwelle schafft Raum für seinen nächsten Schritt.'),
 f('bobo','DJ BoBo','#63e9ff','Dancefloor-Slide','dash',275,17,88,610,155,'TANZ & TEMPO','Schnelle Tanzschritte, ein Beat-Bogen und ein Bassdrop bringen die Arena in Bewegung.'),
 f('mross','Stefan Mross','#ffcb69','Sonntags-Fanfare','bolt',220,22,100,480,180,'FANFARE & TAKT','Eine goldene Klangfanfare hält Abstand. Der Bühnen-Sprint überbrückt ihn wieder.'),
 f('otto','Otto Waalkes','#ffb56c','Friesen-Sprung','dash',255,19,96,540,165,'TRICKS & OTTIFANTEN','Ein frecher Vorstoß, eine Ottifanten-Welle und ein überraschender Ostfriesen-Wirbel.'),
 f('ross','Ross Antony','#f5a1ed','Glitzerwirbel','burst',270,18,91,515,155,'SHOW & FUNKELN','Ein schneller Glitzerwirbel. Weihnachtssterne halten Abstand, der Show-Sprint bringt Ross wieder heran.'),
 f('max','Max Mager','#ffb064','Schnitt-Sprint','dash',270,17,90,640,155,'SCHNITT & SPRINT','Ein orangefarbener Schnitt durch die Arena. Schnell heran, schnell treffen.'),
 f('matthias','Matthias Schilling','#76cafa','Fokusblitz','bolt',220,24,104,520,195,'FOKUS & KRAFT','Ein gebündelter blauer Lichtimpuls mit großer Reichweite.'),
 f('laurent','Laurent Kuhn','#ffe380','Lichtkante','wave',240,19,99,510,170,'LICHT & BODEN','Eine goldene Lichtkante fliegt knapp über dem Boden.'),
 f('reinhold','Reinhold Lamers','#72e0d0','Bassdruck','burst',195,27,112,320,220,'BASS & NÄHE','Ein kräftiger türkisfarbener Klangstoß in alle Richtungen.'),
 f('nathalie','Nathalie Ruder','#ffb2dc','Farbflug','arc',255,18,90,550,150,'FARBE & BOGEN','Ein pinker Farbfunke schwingt durch die Luft.'),
 f('andreas','Andreas Böhler','#bd9cff','Render-Rush','dash',250,21,97,580,185,'RHYTHMUS & SCHUB','Ein violetter Vorstoß hinterlässt eine leuchtende Spur.'),
 f('karsten','Karsten Mosner','#ffe1a0','Objektivblitz','bolt',230,21,96,540,175,'LICHT & BEWEGUNG','Gebündeltes Licht, ein schneller Dolly-Vorstoß und ein aufsteigender Kran-Schwenk.'),
 f('vendel','Michael Vendel','#b8dbc2','Impulswelle','wave',220,22,102,460,180,'STAND & SCHUB','Eine Bodenwelle schafft Raum. Kraft-Sprint und Druckwirbel bringen Michael wieder in den Nahkampf.'),
 f('jan','Jan Reiff','#8cde68','Action!','dash',240,20,102,520,165,'REGIE & VERWANDLUNG','Nach zwei ungeblockten Treffern: grüner Hulk. Nur Rückenangriffe können Jan besiegen. Hulk: Angriffstasten lösen Spezialangriffe mit Ein-Treffer-K.-o. aus; springe hinter ihn während seiner langen Erholung.'),
 f('valentina','Valentina Sachs','#ff956f','Sonnenbogen','arc',290,19,94,545,160,'SOMMER & SCHWUNG','Ein warmer Sonnenbogen hält Abstand. Sommerbrise überbrückt ihn, Blütenwirbel schützt die Nähe.'),
 f('schaer','Nathalie Schär','#ff8cae','Reel-Rush','dash',275,17,90,580,150,'TEAM S · TEMPO','Ein schneller Reel-Vorstoß. Herzchen fliegen im Story-Bogen, der Hashtag-Wirbel deckt die Nähe ab.'),
 f('glen','Glen Homburg','#ffe079','Kommentar-Stopp','burst',205,24,107,420,195,'TEAM S · KONTROLLE','Ein kurzer Kommentarstoß hält Gegner auf Abstand. Share-Welle und Community-Boost schaffen Platz.'),
 f('steffen','Steffen Weber','#79e7ed','Like-Impuls','bolt',240,20,96,600,175,'TEAM S · REICHWEITE','Ein Like-Impuls fliegt gerade voraus. Feed-Sprint und Reichweiten-Welle wechseln Distanz und Tempo.'),
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
export const SOURCES=[{label:'Michael Scholz · erster Mitarbeiter seit 1973',url:'https://mack.group/de/presse-medien/pressemitteilungen/2023-10-27/ueber-2300-jahre-engagement-fuer-den-europa-park'},{label:'Ed & Edda · offizielle Maskottchen-Referenz',url:'https://mack.group/de/mack-gruppe/geschaeftsfelder/wir-erzaehlen-erlebnisse/ed-edda'},{label:'21 offizielle Themenbereiche',url:park},{label:'Die zwölf aktuellen Familienmitglieder',url:'https://mack.group/de/ueber-uns/familie-mack'},{label:'Wakala · offizielle Traumatica-Referenz',url:'https://mack.group/de/presse-medien/pressemitteilungen/2025-09-05/traumatica-festival-of-fear-1'},{label:'Snorri: der Sixtopus',url:'https://www.europapark.de/de/rulantica/infos/media-unterhaltung/story/snorri'}];
