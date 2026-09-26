'use strict';
(function(){
  var p=$('#proc'); if(!p) return;
  if(REDUCED || !('IntersectionObserver' in window)){ p.classList.add('play'); return; }
  var fill=p.querySelector('.proc-fill'), dot=$('#procDot'), items=$$('.proc-ol li',p);
  if(!fill||!items.length){ p.classList.add('play'); return; }
  p.classList.add('drive');
  fill.style.transition='none';
  var mq=matchMedia('(max-width:780px)');
  function update(){
    if(mq.matches) return;  /* mobile: static list, always lit via CSS */
    var r=p.getBoundingClientRect(), vh=innerHeight||1;
    var total=r.height+vh*0.5;
    var q=(vh*0.75-r.top)/total;
    q=Math.min(1,Math.max(0,q));
    fill.style.transform='scaleX('+q+')';
    if(dot) dot.style.left=(6+q*88)+'%';
    for(var i=0;i<items.length;i++){
      items[i].classList.toggle('lit', q>=(i+0.3)/items.length);
    }
  }
  addTicker(p,function(){ update(); });
  update();
})();

/* ---------- 14 · compounding orbit ---------- */
