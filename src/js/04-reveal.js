'use strict';
(function(){
  window.__rv=1; /* tells head failsafe that reveal logic booted */
  var items=$$('[data-reveal]');
  if(REDUCED || !('IntersectionObserver' in window)){
    items.forEach(function(i){ i.classList.add('in'); }); return;
  }
  /* SMOOTH REVEAL: (1) a far observer promotes items to a compositor layer (.rv-prep) just before
     they are needed and drops it once settled, so the fade/rise never has to rasterise mid-scroll;
     (2) items that enter in the same frame are staggered (max 4 steps) and revealed in ONE rAF,
     not one style write per observer entry; (3) the reveal waits for calm so it never lands on
     top of a fast scroll and the particle field. */
  var queue=[],flushing=false;
  function flush(){
    flushing=false;
    var batch=queue; queue=[];
    batch.sort(function(a,b){ return a.getBoundingClientRect().top-b.getBoundingClientRect().top; });
    batch.forEach(function(el,k){
      el.style.transitionDelay=Math.min(k,4)*60+'ms';
      el.classList.add('in');
      setTimeout(function(){ el.classList.remove('rv-prep'); el.style.transitionDelay=''; },900+Math.min(k,4)*60);
    });
  }
  function enqueue(el){
    queue.push(el);
    if(!flushing){ flushing=true; requestAnimationFrame(function(){ calm(flush,350); }); }
  }
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ io.unobserve(e.target); enqueue(e.target); } });
  },{threshold:.01,rootMargin:'0px 0px 220px 0px'});
  var pre=new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('rv-prep'); pre.unobserve(e.target); } });
  },{rootMargin:'0px 0px 700px 0px'});
  items.forEach(function(i){ io.observe(i); pre.observe(i); });
  /* failsafe: if observers never fire, reveal anything already near the viewport */
  setTimeout(function(){
    items.forEach(function(el){
      if(el.classList.contains('in')) return;
      if(el.getBoundingClientRect().top<innerHeight+220) el.classList.add('in');
    });
  },3000);
})();

/* ---------- scroll-scrubbed purpose illumination ----------
   The purpose statement ignites word by word as it travels the viewport band
   (top 80% → bottom 52%), then holds full. Vanilla scrub: rAF-throttled,
   skipped off-screen and under reduced motion (plain statement instead). */
(function(){
  if(REDUCED) return;
  var el=document.querySelector('.purpose-statement'); if(!el) return;
  var frag=document.createDocumentFragment(),words=[];
  el.textContent.split(/(\s+)/).forEach(function(p){
    if(!p)return;
    if(/^\s+$/.test(p)){frag.appendChild(document.createTextNode(' '));return;}
    var s=document.createElement('span'); s.className='w'; s.textContent=p;
    words.push(s); frag.appendChild(s);
  });
  el.innerHTML=''; el.appendChild(frag);
  var N=words.length,run=false,lastP=-1;
  function paint(){
    run=false;
    var r=el.getBoundingClientRect(),vh=innerHeight||1;
    if(r.bottom<0||r.top>vh)return;
    var total=vh*.28+r.height,p=(vh*.8-r.top)/total;
    p=p<0?0:p>1?1:p;
    p=Math.round(p*400)/400;                /* quantise: no style writes for sub-pixel scroll */
    if(p===lastP) return; lastP=p;
    for(var i=0;i<N;i++){
      var o=.14+.86*(p*(N*1.15)-i);
      words[i].style.opacity=(o<.14?'.14':o>1?'1':o.toFixed(3));
    }
  }
  function kick(){if(!run){run=true;requestAnimationFrame(paint);}}
  addEventListener('scroll',kick,{passive:true});
  addEventListener('resize',kick);
  kick();
})();

/* ---------- nav ---------- */
