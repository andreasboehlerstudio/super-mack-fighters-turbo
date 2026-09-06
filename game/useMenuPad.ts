'use client';
import {useEffect,useRef} from 'react';
/** The controller follows the same visible controls as keyboard navigation. */
export function useMenuPad(open:boolean,onBack:()=>void){
 const back=useRef(onBack);back.current=onBack;
 useEffect(()=>{
  if(!open)return;
  let held=true,cancelHeld=true,next=0,lastDirection=0;
  const timer=setInterval(()=>{
   const pad=Array.from(navigator.getGamepads?.()??[]).find(p=>p?.connected);
   if(!pad)return;
   const b=(n:number)=>!!pad.buttons[n]?.pressed,confirm=b(0)||b(9),cancel=b(1);
   if(cancel&&!cancelHeld)back.current();
   cancelHeld=cancel;
   const dialog=document.querySelector<HTMLElement>('[role="dialog"]');
   if(!dialog)return;
   const nodes=Array.from(dialog.querySelectorAll<HTMLElement>('.console-choice,button,[role="slider"]'))
    .filter(el=>el.offsetParent!==null&&!el.hasAttribute('disabled')&&(el.classList.contains('console-choice')||!el.closest('.console-choice')));
   if(!nodes.length){held=confirm;return}
   const active=document.activeElement,index=Math.max(0,nodes.findIndex(el=>el===active||el.contains(active))),node=nodes[index];
   const dy=b(13)||pad.axes[1]>.5?1:b(12)||pad.axes[1]<-.5?-1:0,dx=b(15)||pad.axes[0]>.5?1:b(14)||pad.axes[0]<-.5?-1:0;
   const now=performance.now(),direction=dy||dx*2;
   const focus=(delta:number)=>{const el=nodes[(index+delta+nodes.length)%nodes.length];(el.classList.contains('console-choice')?el.querySelector<HTMLElement>('button'):el)?.focus()};
   const change=(delta:number)=>{
    if(node.classList.contains('console-choice'))node.querySelectorAll<HTMLButtonElement>('button')[delta>0?1:0]?.click();
    else if(node.getAttribute('role')==='slider')node.dispatchEvent(new KeyboardEvent('keydown',{key:delta>0?'ArrowRight':'ArrowLeft',bubbles:true}));
    else focus(delta);
   };
   if(direction&&(direction!==lastDirection||now>next)){if(dy)focus(dy);else change(dx);next=now+200}
   if(confirm&&!held){if(node.classList.contains('console-choice'))change(1);else if(node.matches('button'))node.click()}
   held=confirm;lastDirection=direction;
  },45);
  return()=>clearInterval(timer);
 },[open]);
}
