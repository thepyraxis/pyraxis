'use strict';
(function(){
  var items=$$('[data-reveal]');
  if(REDUCED || !('IntersectionObserver' in window)){
    items.forEach(function(i){ i.classList.add('in'); }); return;
  }
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  },{threshold:.01,rootMargin:'0px 0px 180px 0px'});
  items.forEach(function(i){ io.observe(i); });
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
  var N=words.length,run=false;
  function paint(){
    run=false;
    var r=el.getBoundingClientRect(),vh=innerHeight||1;
    if(r.bottom<0||r.top>vh)return;
    var total=vh*.28+r.height,p=(vh*.8-r.top)/total;
    p=p<0?0:p>1?1:p;
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
