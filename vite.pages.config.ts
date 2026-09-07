import {defineConfig} from 'vite';
import {buildVersion} from './build-version';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/postcss';
import path from 'node:path';
import {readdir,readFile,writeFile} from 'node:fs/promises';
const root=import.meta.dirname,base='/super-mack-fighters-turbo/';
// Phaser, Canvas and MIDI construct URLs at runtime, outside Vite's imported-asset handling.
const prefixAssets=(code:string)=>code.replace(/(["'`(])\/assets\//g,'$1'+base+'assets/');
export default defineConfig({
 root:path.join(root,'pages-src'),base,publicDir:path.join(root,'public'),
 resolve:{alias:{'@':root}},
 define:{'process.env.NEXT_PUBLIC_STATIC_EXPORT':JSON.stringify('true'),'__GAME_BUILD__':JSON.stringify(buildVersion())},
 css:{postcss:{plugins:[tailwindcss()]}},
  plugins:[{name:'game-pages-paths',enforce:'pre',transform(code,id){if(id.replaceAll('\\','/').startsWith(root.replaceAll('\\','/'))&&!id.includes('node_modules')&&/\.(tsx?|css|json)(\?|$)/.test(id))return prefixAssets(code)},async closeBundle(){
  const dir=path.join(root,'dist-pages');
  async function visit(folder:string){for(const file of await readdir(folder,{withFileTypes:true})){const p=path.join(folder,file.name);if(file.isDirectory()){if(file.name!=='bundle')await visit(p)}else if(/\.(html|css|js|json)$/.test(file.name)){const content=await readFile(p,'utf8');await writeFile(p,prefixAssets(content).replace(/href="\/"/g,`href="${base}"`).replace(/href="\/park-atlas"/g,`href="${base}?atlas"`));}}}
  await visit(dir);await writeFile(path.join(dir,'.nojekyll'),'');
 }},react()],
 build:{outDir:path.join(root,'dist-pages'),emptyOutDir:true,assetsDir:'bundle',sourcemap:false},
 server:{host:'127.0.0.1'},preview:{host:'127.0.0.1'}
});
