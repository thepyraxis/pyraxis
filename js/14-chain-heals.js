'use strict';
(function(){
  var chain=$('#chain'); if(!chain) return;
  if(REDUCED || !('IntersectionObserver' in window)){ chain.classList.add('connected'); return; }
  var fired=false;
  var io=new IntersectionObserver(function(es){
    if(fired){ io.disconnect(); return; }
    es.forEach(function(e){ if(e.isIntersecting){ fired=true; setTimeout(function(){ chain.classList.add('connected'); },500); io.disconnect(); } });
  },{threshold:.35});
  io.observe(chain);
})();

/* ---------- 05 · convergence map ---------- */
