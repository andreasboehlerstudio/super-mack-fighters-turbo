// Reuse decoded images when portraits reappear in selection, VS and the HUD.
const images=new Map<string,Promise<HTMLImageElement>>();
export function loadPixelImage(src:string):Promise<HTMLImageElement>{
 const cached=images.get(src);if(cached)return cached;
 const pending=new Promise<HTMLImageElement>((resolve,reject)=>{
  const image=new Image();image.decoding='async';
  image.onload=()=>resolve(image);image.onerror=()=>reject(new Error('Bild konnte nicht geladen werden: '+src));image.src=src;
 });
 images.set(src,pending);
 void pending.catch(()=>{if(images.get(src)===pending)images.delete(src)});
 if(images.size>96)images.delete(images.keys().next().value!);
 return pending;
}
