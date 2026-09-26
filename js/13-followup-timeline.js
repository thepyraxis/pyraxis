'use strict';
(function(){
  var d=$('#dtx'); if(!d) return;
  if(REDUCED || !('IntersectionObserver' in window)){ d.classList.add('play'); return; }
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ d.classList.add('play'); io.disconnect(); } });
  },{threshold:.05,rootMargin:'0px 0px -5% 0px'});
  io.observe(d);
})();

/* ---------- 02 · chain heals ---------- */
