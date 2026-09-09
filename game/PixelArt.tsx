'use client';
import {useEffect,useRef} from 'react';
import {UI_ART_SCALE,RASTER_WIDTH} from './pixel-grid';
import {loadPixelImage} from './image-cache';
/** Sample each displayed image into the same logical pixel density as the game. */
export function PixelArt({src,alt,className='',density=1,onLoad,onError}:{src:string;alt:string;className?:string;density?:number;onLoad?:()=>void;onError?:()=>void}){
 const ref=useRef<HTMLSpanElement>(null),callbacks=useRef({onLoad,onError});callbacks.current={onLoad,onError};
 useEffect(()=>{const host=ref.current!,canvas=host.querySelector('canvas')!,ctx=canvas.getContext('2d')!;let alive=true,img:HTMLImageElement|undefined;
  const draw=()=>{if(!alive||!img?.naturalWidth||!host.clientWidth||!host.clientHeight)return;
   const rect=host.getBoundingClientRect(),screen=host.closest('.game-screen')?.getBoundingClientRect(),pixel=screen?screen.width/RASTER_WIDTH:1/UI_ART_SCALE;
   const mod=(x:number)=>((x%pixel)+pixel)%pixel,localScale=rect.width/host.clientWidth;
   const ox=mod(rect.left-(screen?.left??0))/localScale,oy=mod(rect.top-(screen?.top??0))/localScale;
   const unit=UI_ART_SCALE*density,size={width:Math.max(1,Math.ceil((host.clientWidth+ox)*unit)),height:Math.max(1,Math.ceil((host.clientHeight+oy)*unit))};
   canvas.width=size.width;canvas.height=size.height;canvas.style.width=size.width/unit+'px';canvas.style.height=size.height/unit+'px';canvas.style.left=-ox+'px';canvas.style.top=-oy+'px';ctx.imageSmoothingEnabled=false;
   const scale=Math.max(size.width/img.naturalWidth,size.height/img.naturalHeight),w=img.naturalWidth*scale,h=img.naturalHeight*scale;
   ctx.drawImage(img,Math.round((size.width-w)/2),Math.round((size.height-h)*.35),Math.round(w),Math.round(h));};
  ctx.clearRect(0,0,canvas.width,canvas.height);
  void loadPixelImage(src).then(loaded=>{if(!alive)return;img=loaded;draw();callbacks.current.onLoad?.()},()=>{if(alive)callbacks.current.onError?.()});
  const observer=new ResizeObserver(draw);observer.observe(host);window.addEventListener('resize',draw);return()=>{alive=false;observer.disconnect();window.removeEventListener('resize',draw)};
 },[src,density]);
 return <span ref={ref} className={'pixel-art '+className} role="img" aria-label={alt}><canvas aria-hidden="true"/></span>;
}
