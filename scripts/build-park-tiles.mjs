import {mkdir,copyFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
let sharp;try{sharp=require('sharp')}catch{sharp=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp'))}
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=process.argv[2]?path.resolve(process.argv[2]):path.join(root,'public/assets/atlas/park-1-detail.png');
const target=path.join(root,'public/assets/atlas');
const meta=await sharp(source).metadata();
if(meta.width!==2968||meta.height!==2120)throw Error('Unexpected map dimensions');
await mkdir(path.join(target,'detail'),{recursive:true});
if(source!==path.join(target,'park-1-detail.png'))await copyFile(source,path.join(target,'park-1-detail.png'));
await sharp(source).resize(1484,1060,{kernel:'nearest'}).png().toFile(path.join(target,'park-1-overview.png'));
const tiles=[];
for(let y=0;y<meta.height;y+=256)for(let x=0;x<meta.width;x+=256){
 const width=Math.min(256,meta.width-x),height=Math.min(256,meta.height-y),file=`${x/256}-${y/256}.png`;
 await sharp(source).extract({left:x,top:y,width,height}).png().toFile(path.join(target,'detail',file));
 tiles.push({file,x,y,width,height});
}
await writeFile(path.join(target,'detail/manifest.json'),JSON.stringify({width:2968,height:2120,worldScale:2,tileSize:256,tiles},null,2)+'\n');
console.log(`Exported ${tiles.length} seamless native tiles.`);

