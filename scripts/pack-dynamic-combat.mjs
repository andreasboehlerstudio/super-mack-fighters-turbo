import sharp from 'sharp';
import {mkdir,writeFile} from 'node:fs/promises';
const specs=[['roland','punch',[0,2,3,4,5,6,7,0]],['michael','kick',[0,2,3,4,4,5,6,7]]];
for(const [id,clip,order] of specs){
 const input=`art-source/dynamic-combat/${id}-${clip}-spritecook.webp`,parts=[];
 for(const [i,frame]of order.entries())parts.push({input:await sharp(input).extract({left:frame*196,top:0,width:196,height:196}).png().toBuffer(),left:i%4*256+30,top:Math.floor(i/4)*256+52});
 await mkdir(`public/assets/animations/dynamic/${id}`,{recursive:true});
 await sharp({create:{width:1024,height:512,channels:4,background:'#00000000'}}).composite(parts).webp({lossless:true}).toFile(`public/assets/animations/dynamic/${id}/${clip}.webp`);
}
await writeFile('art-source/dynamic-combat/spritecook-assets.json',JSON.stringify({date:'2026-09-10',credits:40,assets:[{fighter:'roland',clip:'punch',source:'6f846554-1496-40aa-aac0-1ef8cd991007',job:'ec801d43-8863-425b-aaba-6fc9d9a03aa9',asset:'1f62be34-64d4-4796-bc2c-2917880297a1'},{fighter:'michael',clip:'kick',source:'92cf3a66-cff3-4474-a5a7-e8a0ded80fd7',job:'ade4ceb5-9578-44cb-9d87-611f06f0e9e8',asset:'398d4674-b2e0-41da-9937-40db29440b1a'}],packing:'196px source frames placed without resizing into 256px cells at (30,52). Fixed anchor (128,246). Contact frames selected to coincide with simulation hit windows.'},null,2));
