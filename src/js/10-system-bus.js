'use strict';
(function(){
  var bus=$('#bus'); if(!bus) return;
  var mods=$$('.mod',bus), pulse=$('#busPulse'), fill=$('#busFill'), btn=$('#busReplay');
  var D=2800, t0=null, running=false, tops=[], H=1;
  function measure(){
    var br=bus.getBoundingClientRect();
    H=Math.max(1,bus.offsetHeight-16);
    tops=mods.map(function(m){
      var r=m.getBoundingClientRect();
      return r.top-br.top+r.height/2-8;
    });
  }
  function start(){
    measure();
    mods.forEach(function(m){ m.classList.remove('lit'); });
    fill.style.transition='none';
    fill.style.transform='scaleY(0)';
    /* force reflow so the reset applies before the fill transition returns */
    void fill.offsetWidth;
    fill.style.transition='';
    if(REDUCED){
      fill.style.transform='scaleY(1)';
      mods.forEach(function(m){ m.classList.add('lit'); });
      return;
    }
    running=true; t0=null; pulse.style.opacity='1';
  }
  addTicker(bus,function(now){
    if(!running) return;
    if(t0==null) t0=now;
    var p=Math.min(1,(now-t0)/D);
    pulse.style.top=(8+p*H-7)+'px';
    fill.style.transform='scaleY('+p+')';
    for(var i=0;i<mods.length;i++){ if(tops[i]<=p*H) mods[i].classList.add('lit'); }
    if(p>=1){ running=false; pulse.style.opacity='0'; }
  });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ io.disconnect(); setTimeout(start,500); } });
    },{threshold:.25});
    io.observe(bus);
  } else { start(); }
  if(btn) btn.addEventListener('click', start);
})();

/* ---------- 05 · journey flow cycling ---------- */
