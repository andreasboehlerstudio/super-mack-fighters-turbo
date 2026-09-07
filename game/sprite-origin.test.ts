import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spriteOrigin} from './sprite-origin.ts';
import {animationPose,animationOrigin} from './animation-sheets.ts';
import {FIGHTERS,type FighterId} from './data.ts';
const art=JSON.parse(readFileSync(new URL('../public/assets/animations/combat-v5.json',import.meta.url),'utf8'));
test('every fighter has four distinct eight-pose attacks and eight reactions at native detail',()=>{
 assert.equal(art.sheets.length,FIGHTERS.length*5);
 for(const sheet of art.sheets){assert.ok(sheet.scale>0&&sheet.scale<=1,sheet.id);assert.equal(sheet.frames.length,8);assert.equal(new Set(sheet.frames.map((f:any)=>f.hash)).size,8);for(const f of sheet.frames){assert.ok(f.nativeBodyHeight>=180);assert.equal(f.scale,sheet.scale);assert.ok(f.left>=2&&f.top>=2&&f.left+f.width<=254&&f.bottom<=253);}}
});
test('rendered origins match each authored sole anchor through grounded attacks and reactions',()=>{
 for(const sheet of art.sheets){for(const f of sheet.frames){const reaction=sheet.clip==='reactions',frame=reaction?[4,5,10,11,12,13,14,15][f.frame]:({punch:16,kick:24,airpunch:32,airkick:40} as Record<string,number>)[sheet.clip]+f.frame;assert.deepEqual(spriteOrigin(sheet.id as FighterId,reaction?'action':'motion',frame),f.origin);if(['punch','kick'].includes(sheet.clip)||reaction&&f.frame!==0)assert.equal(f.bottom-f.origin.y,0,`${sheet.id}/${sheet.clip}/${f.frame}`);}}
});
test('Jurgen air-punch shows contact during active frames and uses all eight poses',()=>{
 const used=new Set<number>();for(let age=0;age<24;age++){const p=animationPose('airpunch',age,0,18,'juergen');used.add(p.frame);if(age>=6&&age<12)assert.ok([2,3].includes(p.frame));}assert.equal(used.size,8);
 assert.deepEqual(animationOrigin('juergen','tag',0),animationOrigin('juergen','idle',0));
});
