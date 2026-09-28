'use strict';
(function(){
  var sec=document.getElementById('purpose'); if(!sec) return;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window)){ sec.classList.add('seen'); return; }
  new IntersectionObserver(function(es){
    es.forEach(function(e){ sec.classList.toggle('seen',e.isIntersecting); });
  },{threshold:.3}).observe(sec);
})();
