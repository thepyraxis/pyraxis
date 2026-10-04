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
  /* backing store always tracks the real screen (up to 2x): a 1x canvas on a
     2-3x phone display is upscaled by the compositor and reads blurry. A 2D
     circle canvas costs ~1MB — the 50 decoded frames are the real memory,
     and those already load lazily below. */
  var COUNT=50, BASE='public/founder-sequence/frame-', cur=1, dragging=false;
  /* retina phones (2-3x screens) out-resolve the 960px frames, so they get
     the 1440px @2x set; 1x screens keep the lighter set. Decided once —
     DPR doesn't change without a zoom that reloads layout anyway. */
  var HI=(window.devicePixelRatio||1)>1.5;
  function frameSrc(idx){ return BASE+String(idx).padStart(3,'0')+(HI?'@2x':'')+'.webp'; }
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
      im.src=frameSrc(idx+1);
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
  /* phones / touch: portrait is scroll-driven only, no drag-to-scrub */
  var NODRAG=matchMedia('(max-width:899px), (pointer:coarse)');
  if(NODRAG.matches) box.setAttribute('aria-label','Aman Deep Sharma, founder of PYRAXIS');
  var sx=0, sf=1; if(!NODRAG.matches) box.style.cursor='grab';
  box.addEventListener('pointerdown',function(e){
    if(NODRAG.matches) return;
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
  /* SCROLL-JERK FIX: one rect read per frame max, and none at all while the founder section is far
     away (the section only animates while near the viewport). */
  var fsQ=false;
  addEventListener('scroll',function(){
    if(fsQ) return;
    var y=window.scrollY||0, top=sec?sec.offsetTop:0, h=sec?sec.offsetHeight:0;
    if(sec && (y+innerHeight<top-innerHeight || y>top+h+innerHeight)) return;
    fsQ=true; requestAnimationFrame(function(){ fsQ=false; onScroll(); });
  },{passive:true});
  addEventListener('resize',function(){ draw(); onScroll(); });
  addEventListener('load',onScroll);
  onScroll();
})();
/* ============ DEPLOYMENTS — card hover glow port (Next.js portfolio/ProjectCard.tsx) ============
   Pointer-tracked radial glow, rect cached on enter, one rAF-coalesced DOM write per frame. */
