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
  /* Mobile = small viewport or touch: lighter frame set + canvas-based scrub
     (see below). Decided once — DPR/viewport don't change without reload. */
  var IS_MOBILE=matchMedia('(max-width: 899px), (pointer: coarse)').matches;
  /* backing store always tracks the real screen (up to 2x): a 1x canvas on a
     2-3x phone display is upscaled by the compositor and reads blurry. A 2D
     circle canvas costs ~1MB — the 50 decoded frames are the real memory,
     and those already load lazily below. */
  var COUNT=40, BASE='public/founder-sequence/frame-', cur=1, dragging=false;
  /* The 1x frames are 960px wide — for a 280-340px circle that is already
     ~3x oversampling, so the 1440px @2x set is only worth it on desktop
     retina. Phones always take the 1x set (~1.3MB total instead of ~2.1MB). */
  var HI=!IS_MOBILE&&(window.devicePixelRatio||1)>1.5;
  function frameSrc(idx){ return BASE+String(idx).padStart(3,'0')+(HI?'@2x':'')+'.webp'; }
  /* Mobile loads every 2nd frame (~21 of 40) — halves requests + bytes, and
     neighbouring frames are near-identical so the scrub still looks smooth.
     draw() snaps to the nearest LOADED frame at/below cur. */
  function shouldLoad(idx){ return !IS_MOBILE||(idx%2===1)||idx===COUNT; }
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
  /* Poster first: frame 1 loads immediately (high priority) so the circle is
     never blank on slow mobile networks; the rest wait until the section
     nears, then stream in small batches so they don't fight first paint. */
  var imgs=new Array(COUNT), i, img, framesLoaded=false, first=false;
  for(i=1;i<=COUNT;i++){ imgs[i-1]=new Image(); imgs[i-1].decoding='async'; }
  try{ imgs[0].fetchPriority='high'; }catch(_){}
  imgs[0].src=frameSrc(1);
  imgs[0].addEventListener('load',function(){ first=true; if(cur<=2) draw(); },{once:true});
  if(REDUCED){ try{ imgs[COUNT-1].fetchPriority='high'; }catch(_){} imgs[COUNT-1].src=frameSrc(COUNT); }
  function startFrames(){
    if(framesLoaded) return; framesLoaded=true;
    var queue=[];
    for(var k=0;k<COUNT;k++){ if(k!==0&&shouldLoad(k+1)) queue.push(k); }
    if(REDUCED&&queue.indexOf(COUNT-1)<0) queue.push(COUNT-1);
    var BATCH=IS_MOBILE?4:8;
    (function next(){
      var batch=queue.splice(0,BATCH);
      batch.forEach(function(idx){
        var im=imgs[idx];
        try{ im.fetchPriority='low'; }catch(_){}
        im.src=frameSrc(idx+1);
        if(im.complete&&im.naturalWidth) return;
        im.addEventListener('load',function(){
          if(idx+1===cur||!first){ first=true; draw(); }
        },{once:true});
      });
      if(queue.length){
        if('requestIdleCallback' in window) requestIdleCallback(next,{timeout:800});
        else setTimeout(next,120);
      }
    })();
    draw();
  }
  function pickFrame(idx){
    /* nearest loaded frame at or below idx (mobile stride leaves gaps) */
    for(var j=idx;j>=1;j--){ var im=imgs[j-1]; if(im&&im.complete&&im.naturalWidth) return im; }
    for(var k2=idx+1;k2<=COUNT;k2++){ var im2=imgs[k2-1]; if(im2&&im2.complete&&im2.naturalWidth) return im2; }
    return null;
  }
  function draw(){
    var im=pickFrame(cur);
    if(!im) return;
    /* mobile canvas caps at 1.5x DPR — a 280px circle at 420px backing is
       already crisp, and full 2x doubles every drawImage cost on weak GPUs. */
    var cap=IS_MOBILE?1.5:2;
    var dpr=Math.min(window.devicePixelRatio||1,cap), r=box.getBoundingClientRect();
    if(r.width<2||r.height<2) return;
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
  /* scroll mapping — desktop mirrors ScrollTrigger: trigger section,
     start "top 85%", end "bottom 25%". Mobile maps to the CANVAS itself:
     the old section mapping advanced the frames while the circle was still
     below the fold (or already gone) because phones have little scroll
     room — the scrub started before you saw it and finished after. Now
      p=0 when the canvas top hits 92% vh (just entering) and p=1 when its
      bottom reaches 38% vh (upper-middle, still on screen), so the full
      1→40 plays while the portrait is visible. */
  function onScroll(){
    if(dragging) return;
    var vh=innerHeight||1, p;
    if(IS_MOBILE){
      if(!box) return;
      var b=box.getBoundingClientRect();
      if(b.width<2) return;
      var mStart=vh*.92, mEnd=vh*.38;
      p=(mStart-b.top)/((mStart-mEnd)+b.height);
    }else{
      if(!sec) return;
      var r=sec.getBoundingClientRect();
      var start=vh*.85, end=vh*.25;
      p=(start-r.top)/((start-end)+r.height);
    }
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
