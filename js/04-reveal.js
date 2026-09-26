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

/* ---------- nav ---------- */
