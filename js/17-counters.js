'use strict';
(function(){
  var outs=$$('[data-count]'); if(!outs.length) return;
  function finish(o){
    var final=+o.getAttribute('data-count');
    if(REDUCED){ o.textContent=final.toLocaleString('en-IN'); return; }
    var t0=performance.now(), DUR=1500;
    (function step(now){
      var p=Math.min(1,(now-t0)/DUR), ease=1-Math.pow(1-p,4);
      o.textContent=Math.round(final*ease).toLocaleString('en-IN');
      if(p<1) requestAnimationFrame(step);
    })(t0);
  }
  if(!('IntersectionObserver' in window)){ outs.forEach(finish); return; }
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ io.unobserve(e.target); finish(e.target); } });
  },{threshold:.4});
  outs.forEach(function(o){ io.observe(o); });
})();

/* ---------- 10 · industries ---------- */
