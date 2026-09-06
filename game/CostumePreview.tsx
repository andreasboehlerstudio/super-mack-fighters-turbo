'use client';
import {useEffect,useRef,useState} from 'react';
import {fighter,type FighterId} from './data';
import {COSTUME_NAMES,type Costume} from './rules';
import {loadCostumeSheet} from './costume-art';
export function CostumePreview({id,costume}:{id:FighterId;costume:Costume}){const canvas=useRef<HTMLCanvasElement>(null),[error,setError]=useState(false);useEffect(()=>{let alive=true,raf=0;setError(false);void loadCostumeSheet(id,costume,'walk').then(sheet=>{const ctx=canvas.current!.getContext('2d')!;const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;const draw=(time:number)=>{if(!alive)return;ctx.imageSmoothingEnabled=false;ctx.clearRect(0,0,256,256);ctx.drawImage(sheet,(reduced?0:Math.floor(time/160)%4)*256,0,256,256,0,0,256,256);raf=requestAnimationFrame(draw)};if(alive)raf=requestAnimationFrame(draw)}).catch(()=>alive&&setError(true));return()=>{alive=false;cancelAnimationFrame(raf)}},[id,costume]);return <figure><canvas ref={canvas} width={256} height={256} aria-label={`${fighter(id).name}: ${COSTUME_NAMES[costume]}`}/><figcaption>{fighter(id).short} · {error?'Kostüm konnte nicht geladen werden':COSTUME_NAMES[costume]}</figcaption></figure>}
