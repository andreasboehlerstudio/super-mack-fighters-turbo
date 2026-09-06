import {createRequire} from 'node:module';
import {readdir,mkdir,writeFile,rename,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const require=createRequire(import.meta.url);
let sharp;try{sharp=require('sharp')}catch{sharp=require(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp'))}
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=path.join(root,'public/assets/atlas'),archive=path.join(root,'art-source/atlas');
if(!archive.startsWith(root+path.sep))throw Error('Archive must remain in this project');
await mkdir(archive,{recursive:true});
const records=[];
for(const file of await readdir(source)){
 if(!file.endsWith('.png'))continue;
 const input=path.join(source,file),output=path.join(source,file.replace(/\.png$/,'.webp'));
 const original=await sharp(input).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const webp=await sharp(input).webp({lossless:true,effort:6}).toBuffer();
 const decoded=await sharp(webp).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 if(original.info.width!==decoded.info.width||original.info.height!==decoded.info.height||!original.data.equals(decoded.data))throw Error('Pixel mismatch: '+file);
 const bytes=(await stat(input)).size;
 await writeFile(output,webp);
 await rename(input,path.join(archive,file));
 records.push({file,webp:path.basename(output),width:original.info.width,height:original.info.height,originalBytes:bytes,webpBytes:webp.length,pixelSha256:createHash('sha256').update(original.data).digest('hex'),identicalPixels:true});
}
if(records.length){await writeFile(path.join(root,'docs/art/lossless-atlas.json'),JSON.stringify(records,null,2)+'\n');}
console.log({images:records.length,originalMiB:records.reduce((n,r)=>n+r.originalBytes,0)/2**20,webpMiB:records.reduce((n,r)=>n+r.webpBytes,0)/2**20,allPixelsIdentical:true});
