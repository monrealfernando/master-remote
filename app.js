const rail=document.getElementById('logo-window'),track=document.getElementById('logo-track');

const originals=[...track.children];
for(let group=0;group<2;group++) originals.forEach(item=>{const copy=item.cloneNode(true);copy.setAttribute('aria-hidden','true');copy.querySelector('img').alt='';track.append(copy)});
track.querySelectorAll('img').forEach(img=>{img.draggable=false});
let offset=0,last=0,hovered=false,focused=false,dragging=false,pointer=null,previousX=0,resumeAt=0,cycle=0;
function measure(){cycle=track.children[originals.length].offsetLeft-track.children[0].offsetLeft;draw()}
function draw(){if(cycle<=0)return;offset=((offset%cycle)+cycle)%cycle;track.style.transform=`translate3d(${-cycle-offset}px,0,0)`}
rail.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')hovered=true});
rail.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse')hovered=false});
rail.addEventListener('focus',()=>focused=rail.matches(':focus-visible'));rail.addEventListener('blur',()=>focused=false);
rail.addEventListener('pointerdown',e=>{if(!e.isPrimary||e.button!==0)return;dragging=true;pointer=e.pointerId;previousX=e.clientX;rail.setPointerCapture(pointer);rail.classList.add('dragging')});
rail.addEventListener('pointermove',e=>{if(!dragging||e.pointerId!==pointer)return;offset+=previousX-e.clientX;previousX=e.clientX;draw()});
function finish(e){if(e.pointerId!==pointer)return;dragging=false;pointer=null;rail.classList.remove('dragging');resumeAt=performance.now()+800}
rail.addEventListener('pointerup',finish);rail.addEventListener('pointercancel',finish);rail.addEventListener('lostpointercapture',finish);
rail.addEventListener('keydown',e=>{if(e.key!=='ArrowLeft'&&e.key!=='ArrowRight')return;e.preventDefault();offset+=e.key==='ArrowRight'?160:-160;draw()});
if(typeof ResizeObserver!=='undefined')new ResizeObserver(measure).observe(rail);window.addEventListener('resize',measure);window.addEventListener('load',measure);measure();
function animate(now){const delta=last?Math.min(now-last,50):0;last=now;if(!hovered&&!dragging&&!document.hidden&&now>=resumeAt){offset+=delta*.045;draw()}requestAnimationFrame(animate)}requestAnimationFrame(animate);

const demoDialog=document.getElementById('demo-dialog');
const demoVideo=document.getElementById('demo-video');
const demoTrigger=document.getElementById('open-demo');
demoTrigger.addEventListener('click',()=>{
  const frame=document.createElement('iframe');
  frame.src='https://www.youtube.com/embed/vOio96mICFE?autoplay=1&rel=0';
  frame.title='Demonstração da Master Remote';
  frame.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';
  frame.allowFullscreen=true;
  demoVideo.replaceChildren(frame);
  demoDialog.showModal();
  document.body.classList.add('video-open');
  document.getElementById('close-demo').focus();
});
document.getElementById('close-demo').addEventListener('click',()=>demoDialog.close());
demoDialog.addEventListener('click',event=>{if(event.target===demoDialog){const rect=demoDialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)demoDialog.close();}});
demoDialog.addEventListener('close',()=>{demoVideo.replaceChildren();document.body.classList.remove('video-open');demoTrigger.focus();});

const deviceButtons=document.querySelectorAll('[data-device]');
deviceButtons.forEach(button=>button.addEventListener('click',()=>{
  const isMobile=button.dataset.device==='mobile';
  document.getElementById('product-pc').hidden=isMobile;
  document.getElementById('product-mobile').hidden=!isMobile;
  deviceButtons.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
}));
