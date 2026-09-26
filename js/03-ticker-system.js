'use strict';
var tickers=[], rafId=null, ioTick=null;
if('IntersectionObserver' in window){
  ioTick=new IntersectionObserver(function(es){
    for(var i=0;i<es.length;i++){ var t=es[i].target._tick; if(t) t.on=es[i].isIntersecting; }
    for(var j=0;j<es.length;j++){ if(es[j].isIntersecting){ ensureLoop(); break; } }
  },{rootMargin:'80px'});
}
function addTicker(watch,fn){
  if(!ioTick) return;
  var t={on:false,fn:fn}; watch._tick=t; tickers.push(t); ioTick.observe(watch); ensureLoop();
}
function ensureLoop(){ if(rafId==null) rafId=requestAnimationFrame(frame); }
function frame(){
  var now=performance.now(), any=false, i;
  for(i=0;i<tickers.length;i++){ if(tickers[i].on){ any=true; tickers[i].fn(now); } }
  rafId = any ? requestAnimationFrame(frame) : null;
}

/* ---------- reveal ---------- */
