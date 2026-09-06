(() => {
 const audio=new Audio();audio.preload='none';audio.loop=true;audio.volume=.4;
 let current=null;const volume=document.getElementById('music-volume');
 const reset=()=>{if(!current)return;current.setAttribute('aria-pressed','false');current.textContent='▶ ANHÖREN';current.closest('.music-panel').classList.remove('playing')};
 const status=text=>{if(current)current.closest('.music-panel').querySelector('.music-status').textContent=text};
 for(const button of document.querySelectorAll('[data-play]'))button.addEventListener('click',async()=>{
  if(button===current&&!audio.paused){audio.pause();reset();status('Pausiert');return}
  const changed=button!==current;audio.pause();reset();current=button;
  if(changed){audio.src='/assets/music/'+button.dataset.play+'.ogg';for(const panel of document.querySelectorAll('.music-panel')){panel.querySelector('.music-status').textContent='';panel.querySelector('progress').value=0}}
  const selected=button;status('Lädt …');try{await audio.play();if(current!==selected)return;button.setAttribute('aria-pressed','true');button.textContent='Ⅱ PAUSE';button.closest('.music-panel').classList.add('playing');status('Spielt in Schleife')}catch(error){if(current===selected&&error.name!=='AbortError'){reset();status('Start fehlgeschlagen. Bitte erneut versuchen.')}}
 });
 audio.addEventListener('timeupdate',()=>{if(current&&Number.isFinite(audio.duration))current.closest('.music-panel').querySelector('progress').value=audio.currentTime/audio.duration});
 audio.addEventListener('error',()=>{reset();status('Hörprobe konnte nicht geladen werden.')});
 volume.addEventListener('input',()=>audio.volume=Number(volume.value)/100);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){audio.pause();reset();status('Pausiert')}});
 window.addEventListener('pagehide',()=>audio.pause());
})();
