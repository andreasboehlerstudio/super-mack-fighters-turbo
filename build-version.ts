import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
export function buildVersion(){
 const root=import.meta.dirname,version=JSON.parse(readFileSync(new URL('./package.json',import.meta.url),'utf8')).version;
 let revision=process.env.GITHUB_SHA?.slice(0,7),dirty=false;
 if(!revision)try{
  const git=(args:string[])=>execFileSync('git',['-c',`safe.directory=${root.replaceAll('\\','/')}`,...args],{cwd:root,encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim();
  revision=git(['rev-parse','--short=7','HEAD']);dirty=!!git(['status','--porcelain']);
 }catch{revision='local'}
 return {version,revision,dirty};
}
