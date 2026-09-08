import {fighter,type FighterId,type SpecialKind} from './data.ts';

export type MoveInput='quarter-punch'|'quarter-kick'|'charge';
export interface MoveDef {name:string;kind:SpecialKind;input:MoveInput;power:number;speed:number;cooldown:number;startup:number;duration:number;reach:number;}
const names:Record<FighterId,[string,string,string]>={
 ed:['Sternenbogen','Mäuseblitz','EUROPA-STERNENFEST'],
 edda:['Schleifenpirouette','Paraden-Sprint','EDDAS STERNENPARADE'],
 snorri:['Tentakel-Torpedo','Lagunenstrom','RULANTICA-FLUT'],
 roland:['Schienenwirbel','Coaster-Express','GRAND-PARK-FINALE'],
 marianne:['Herzstrahl','Lichtermeer','TAUSEND HERZFUNKEN'],
 juergen:['Taktwelle','Präzisionsschub','MEISTERWERK'],
 mauritia:['Kristalltanz','Glanz-Sprint','KRISTALLZAUBER'],
 michael:['Portalwelle','Zukunftssprung','MACKMEDIA-MULTIVERSUM'],
 thomas:['Flammenpfeil','Glutwelle','FEUERWERK-FINALE'],
 annkathrin:['Brückensprung','Lichtkomet','LICHTER DER ZUKUNFT'],
 frederik:['Team-Komet','Kraftkreis','TEAM-TURBO'],
 alexia:['Prismenwelle','Farbsprung','REGENBOGEN-NOVA'],
 miriam:['Adria-Sprint','Gezeitenblitz','ADRIA-FESTIVAL'],
 katja:['Sternenstrahl','Tanzwelle','STERNENBALLETT'],
 nicolas:['Resonanzstoß','Klang-Sprint','RESONANZ-SINFONIE'],
 max:['Schnittbogen','Montagewirbel','FINAL CUT'],
 matthias:['Fokuswelle','Zoom-Sprint','PERFEKTER FOKUS'],
 laurent:['Licht-Sprint','Scheinwerferstrahl','LICHTERMEER'],
 reinhold:['Bassimpuls','Subwoofer-Welle','BASS-FINALE'],
 nathalie:['Farbwirbel','Prismenflug','FARBENFEST'],
 andreas:['Renderbogen','Frame-Wirbel','MASTER RENDER'],
 karsten:['Dolly-Fahrt','Kran-Schwenk','ONE TAKE'],
 scholz:['Allee-Sprint','Qualitätskontrolle','PIONIERGEIST 73'],
 wakala:['Nachtfunken','Hasen-Haken','WAKALAS WUNDERLAND'],
 bobo:['Beat-Bogen','Bassdrop','DANCEFLOOR FINALE'],
 mross:['Bühnen-Sprint','Sonntags-Welle','IMMER WIEDER FINALE'],
 otto:['Ottifanten-Ansturm','Ostfriesen-Wirbel','OTTIFANTEN-PARADE'],
 ross:['Weihnachts-Welle','Show-Sprint','CRAZY CHRISTMAS FINALE'],
 freudenreich:['Gugelhupf-Bogen','Omas Wirbel','DINO-FAMILIENTREFFEN'],
 robbemond:['Schatzmünze','Hafenwelle','SCHATZ VON BATAVIA'],
 olli:['Stampfwelle','Elefanten-Anlauf','EUROFANTEN-PARADE'],
 boeckli:['Alpenbogen','Hornwirbel','GIPFELGLÜCK'],
 louis:['Flügelwirbel','Kikeriki-Sprint','COCORICO FINALE'],
 tesla:['Induktionsbogen','Spannungssprung','VOLTRON-ENTLADUNG'],
 graumacher:['Grauschleier-Sprint','Stillstandsblitz','LETZTER SCHATTEN']
};
const other:Record<SpecialKind,[SpecialKind,SpecialKind]>={dash:['arc','burst'],wave:['dash','bolt'],arc:['burst','dash'],burst:['bolt','wave'],bolt:['wave','dash']};
export function movesFor(id:FighterId):[MoveDef,MoveDef,MoveDef]{
 const variants:Partial<Record<FighterId,[SpecialKind,SpecialKind]>>={karsten:['dash','arc'],mross:['dash','wave'],otto:['wave','burst'],ross:['wave','dash'],freudenreich:['arc','burst'],robbemond:['arc','wave'],olli:['wave','dash'],tesla:['arc','dash']};
 const d=fighter(id),[second,third]:[SpecialKind,SpecialKind]=variants[id]??other[d.kind];
 return [
  {name:d.special,kind:d.kind,input:'quarter-punch',power:d.power,speed:d.shotSpeed,cooldown:d.cooldown,startup:id==='graumacher'?44:18,duration:id==='graumacher'?76:53,reach:id==='olli'?115:d.kind==='burst'?165:d.reach},
  {name:names[id][0],kind:second,input:'quarter-kick',power:Math.round(d.power*.78),speed:d.shotSpeed*.92,cooldown:Math.round(d.cooldown*.82),startup:13,duration:43,reach:second==='burst'?170:d.reach+10},
  {name:names[id][1],kind:third,input:'charge',power:d.power+6,speed:d.shotSpeed*1.12,cooldown:d.cooldown+35,startup:20,duration:58,reach:third==='burst'?185:d.reach+16}
 ];
}
export const ultraFor=(id:FighterId)=>({name:names[id][2],kind:fighter(id).kind,power:42});
export const moveCommand=(input:MoveInput,player=0)=>input==='charge'?`← HALTEN · → + ${player?'J':'F'}`:`↓ ↘ → + ${input==='quarter-punch'?(player?'J':'F'):(player?'K':'G')}`;
