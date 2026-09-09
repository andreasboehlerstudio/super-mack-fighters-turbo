import sharp from 'sharp';
import {readdir,mkdir,stat,writeFile} from 'node:fs/promises';
import path from 'node:path';

// Nearest-neighbour sampling and lossless encoding preserve hard pixel edges.
// Keep the original artwork for future exports and map zoom levels.
const root=path.resolve(import.meta.dirname,'../public/assets'),rows=[];
async function exportImage(source,target,width,height){
 await mkdir(path.dirname(target),{recursive:true});
 await sharp(source).resize(width,height,{fit:'fill',kernel:'nearest'}).webp({lossless:true,effort:6}).toFile(target);
 rows.push({file:path.relative(root,target).replaceAll('\\','/'),bytes:(await stat(target)).size,sourceBytes:(await stat(source)).size,width,height});
}
for(const name of await readdir(path.join(root,'portraits'))){
 if(!name.endsWith('.png'))continue;
 await exportImage(path.join(root,'portraits',name),path.join(root,'runtime/portraits',name.replace('.png','.webp')),384,512);
 await exportImage(path.join(root,'portraits',name),path.join(root,'runtime/portraits',name.replace('.png','-thumb.webp')),192,256);
}
const arenas=[...(await readdir(path.join(root,'arenas'))).filter(n=>n.endsWith('.webp')).map(n=>'arenas/'+n),...(await readdir(root)).filter(n=>/^arena-\d+\.png$/.test(n))];
for(const name of arenas){
 const target=path.join(root,'runtime',name.replace(/\.png$/,'.webp'));
 await exportImage(path.join(root,name),target,960,540);
 await exportImage(path.join(root,name),target.replace('.webp','-thumb.webp'),160,90);
}
await exportImage(path.join(root,'atlas/park-1-overview.webp'),path.join(root,'runtime/atlas/park-1-overview.webp'),742,530);
await writeFile(path.join(root,'runtime/manifest.json'),JSON.stringify(rows,null,2)+'\n');
for(const group of ['portraits','arenas']){
 const subset=rows.filter(r=>r.file.includes('/'+group+'/')&&!r.file.includes('-thumb'));
 console.log(group,JSON.stringify({files:subset.length,before:subset.reduce((s,r)=>s+r.sourceBytes,0),after:subset.reduce((s,r)=>s+r.bytes,0)}));
}
