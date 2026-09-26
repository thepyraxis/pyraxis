/* ============ PURPOSE — FounderSequence port (Next.js founder-story/FounderSequence.tsx) ============
   Scroll-scrubbed frame sequence + drag-to-scrub, circular canvas.
   Frames: public/founder-sequence/frame-001.webp … (matches Next.js FRAME_PATH, relative for static html).
   Reduced-motion: hold final frame, drag still works. */
(function(){
  'use strict';
  var box=document.getElementById('founderCanvas'), cv=document.getElementById('founderFrame');
  if(!box||!cv) return;
  var ctx=cv.getContext('2d'); if(!ctx) return;
  var REDUCED=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var COUNT=50, BASE='public/founder-sequence/frame-', cur=1, dragging=false;
  /* text reveal — mirrors FounderStory.tsx: IO threshold 0.3 toggles visibility, stagger via --d */
  var sec=document.getElementById('purpose');
  if(sec){
    if(REDUCED||!('IntersectionObserver' in window)){ sec.classList.add('seen'); }
    else{
      var pio=new IntersectionObserver(function(es){
        es.forEach(function(e){ sec.classList.toggle('seen',e.isIntersecting); });
      },{threshold:.3});
      pio.observe(sec);
    }
  }
  /* frames stay unloaded until the section nears — 50 eager ~95KB requests
     used to fight first paint on mobile, so they now load lazily. */
  var imgs=new Array(COUNT), i, img, framesLoaded=false, first=false;
  for(i=1;i<=COUNT;i++){ imgs[i-1]=new Image(); imgs[i-1].decoding='async'; }
  function startFrames(){
    if(framesLoaded) return; framesLoaded=true;
    imgs.forEach(function(im,idx){
      try{ im.fetchPriority='low'; }catch(_){}
      im.src=BASE+String(idx+1).padStart(3,'0')+'.webp';
      if(im.complete&&im.naturalWidth) return;
      im.addEventListener('load',function(){
        if(idx+1===cur||!first){ first=true; draw(); }
      },{once:true});
    });
    draw();
  }
  function draw(){
    var im=imgs[cur-1];
    if(!im||!im.complete||!im.naturalWidth) return;
    var dpr=Math.min(window.devicePixelRatio||1,2), r=box.getBoundingClientRect();
    var w=Math.max(2,Math.round(r.width*dpr)), h=Math.max(2,Math.round(r.height*dpr));
    if(cv.width!==w||cv.height!==h){ cv.width=w; cv.height=h; }
    var s=Math.max(cv.width/im.naturalWidth,cv.height/im.naturalHeight);
    var dw=im.naturalWidth*s, dh=im.naturalHeight*s;
    ctx.imageSmoothingEnabled=true; ctx.imageSmoothingQuality='high';
    ctx.clearRect(0,0,cv.width,cv.height);
    ctx.drawImage(im,(cv.width-dw)/2,(cv.height-dh)/2,dw,dh);
  }
  if('IntersectionObserver' in window){
    var fio=new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ fio.disconnect(); startFrames(); } });
    },{rootMargin:'1200px 0px'});
    fio.observe(sec||box);
  }else{ startFrames(); }
  addEventListener('resize',draw);
  var sx=0, sf=1; box.style.cursor='grab';
  box.addEventListener('pointerdown',function(e){
    dragging=true; sx=e.clientX; sf=cur;
    try{ box.setPointerCapture(e.pointerId); }catch(_){}
    box.style.cursor='grabbing';
  });
  box.addEventListener('pointermove',function(e){
    if(!dragging) return;
    cur=Math.min(COUNT,Math.max(1,sf+Math.round((e.clientX-sx)/6)));
    draw();
  });
  function end(e){
    if(!dragging) return; dragging=false; box.style.cursor='grab';
    try{ box.releasePointerCapture(e.pointerId); }catch(_){}
  }
  box.addEventListener('pointerup',end); box.addEventListener('pointercancel',end);
  if(REDUCED){ cur=COUNT; draw(); return; }
  /* scroll mapping — mirrors ScrollTrigger: trigger section, start "top 85%", end "bottom 25%" */
  function onScroll(){
    if(dragging||!sec) return;
    var r=sec.getBoundingClientRect(), vh=innerHeight||1;
    var start=vh*.85, end=vh*.25;
    var p=(start-r.top)/((start-end)+r.height);
    p=Math.min(1,Math.max(0,p));
    var idx=Math.min(COUNT,Math.max(1,Math.round(p*(COUNT-1))+1));
    if(idx!==cur){ cur=idx; draw(); }
  }
  addEventListener('scroll',function(){ requestAnimationFrame(onScroll); },{passive:true});
  addEventListener('resize',function(){ draw(); onScroll(); });
  addEventListener('load',onScroll);
  onScroll();
})();
/* ============ DEPLOYMENTS — card hover glow port (Next.js portfolio/ProjectCard.tsx) ============
   Pointer-tracked radial glow, rect cached on enter, one rAF-coalesced DOM write per frame. */
