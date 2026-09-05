const clamp=(n:number)=>Math.min(1,Math.max(0,n));
const ease=(n:number)=>1-Math.pow(1-clamp(n),3);
/** All motion is expressed in the title screen's 640 × 360 logical pixels. */
export function titleMotion(seconds:number,reduced=false){if(reduced)return {scale:1,logoY:0,alpha:1,edY:0,snorriY:0,edX:0,snorriX:0,shine:-1};const t=Math.max(0,seconds),settle=clamp((t-.65)/.38);return {scale:t<.65?.86+.17*ease(t/.65):1+.03*(1-ease(settle)),logoY:Math.round(-10*(1-ease(t/.8))),alpha:clamp(t/.35),edY:t>1.1?Math.round(Math.sin((t-1.1)*2.3)*.8):0,snorriY:t>1.1?Math.round(Math.sin((t-1.1)*2+.8)*1.3):0,edX:Math.round(-12*(1-ease((t-.25)/.8))),snorriX:Math.round(12*(1-ease((t-.3)/.8))),shine:t%7.5<1.7?(t%7.5)/1.7:-1};}

export function createAnimatedTitle(){const names=['background','logo','ed','snorri'] as const;const images={} as Record<typeof names[number],HTMLImageElement>;let loaded=false,failed=false;const ready=Promise.all(names.map(name=>new Promise<void>(resolve=>{const img=new Image();images[name]=img;img.onload=()=>resolve();img.onerror=()=>{failed=true;resolve()};img.src=`/assets/title-${name==='background'?'background':name==='logo'?'logo':name}-snes.png`}))).then(()=>{loaded=!failed});const shine=document.createElement('canvas');shine.width=640;shine.height=360;const shineCtx=shine.getContext('2d')!;
 const draw=(ctx:CanvasRenderingContext2D,time:number,reduced:boolean)=>{if(!loaded)return false;const motion=titleMotion(time,reduced);ctx.imageSmoothingEnabled=false;ctx.drawImage(images.background,0,0,640,360);
  if(!reduced){
   // Moving rows are sampled only from the water, preserving crisp pixel clusters.
   for(let y=263;y<293;y+=2){const shift=Math.round(Math.sin(time*1.8+y*.5));ctx.drawImage(images.background,171/640*images.background.width,y/360*images.background.height,266/640*images.background.width,2/360*images.background.height,171+shift,y,266,2)}
   const stars=[[113,5],[288,7],[543,9],[583,55],[36,74],[593,94]];stars.forEach(([x,y],i)=>{const cycle=(time*.55+i*.27)%1;if(cycle>.78){ctx.fillStyle=cycle>.87&&cycle<.95?'#fef3c8':'#bcd9e9';ctx.fillRect(x-1,y,3,1);ctx.fillRect(x,y-1,1,3);if(cycle>.87&&cycle<.95){ctx.fillRect(x-2,y,5,1);ctx.fillRect(x,y-2,1,5)}}});
  }
  const logo={x:96,y:10+motion.logoY,w:448*motion.scale,h:215*motion.scale};logo.x=320-logo.w/2;logo.y+=107.5-logo.h/2;ctx.save();ctx.globalAlpha=motion.alpha;ctx.drawImage(images.logo,Math.round(logo.x),Math.round(logo.y),Math.round(logo.w),Math.round(logo.h));ctx.restore();
  if(!reduced&&motion.shine>=0&&time>1.1){shineCtx.clearRect(0,0,640,360);shineCtx.globalCompositeOperation='source-over';const x=Math.round(-50+motion.shine*710);for(let row=0;row<230;row+=3){shineCtx.fillStyle='#fff2bd';shineCtx.fillRect(x+Math.round(row*.3),row,5,3);shineCtx.fillStyle='#abcaff';shineCtx.fillRect(x+Math.round(row*.3)+5,row,8,3)}shineCtx.globalCompositeOperation='destination-in';shineCtx.drawImage(images.logo,Math.round(logo.x),Math.round(logo.y),Math.round(logo.w),Math.round(logo.h));ctx.save();ctx.globalAlpha=.23;ctx.globalCompositeOperation='screen';ctx.drawImage(shine,0,0);ctx.restore();}
  // Both characters come from the same approved illustration. Integer-pixel
  // idle poses retain their outlines and their shared lighting.
  const edHeight=148+motion.edY,edWidth=edHeight*images.ed.width/images.ed.height;ctx.drawImage(images.ed,Math.round(118-edWidth/2+motion.edX),Math.round(338-edHeight),Math.round(edWidth),edHeight);
  const snorriHeight=146+motion.snorriY,snorriWidth=snorriHeight*images.snorri.width/images.snorri.height;ctx.drawImage(images.snorri,Math.round(507-snorriWidth/2+motion.snorriX),Math.round(344-snorriHeight),Math.round(snorriWidth),snorriHeight);
  return true;
 };return {ready,draw};}
