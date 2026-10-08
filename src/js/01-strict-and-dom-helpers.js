'use strict';
/* If this script ever fails to parse, the .js class is never added
   and all content stays visible — no blank page. */
document.documentElement.classList.add('js');

var REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
function $(s,c){ return (c||document).querySelector(s); }
function $$(s,c){ return Array.prototype.slice.call((c||document).querySelectorAll(s)); }
function raf2(fn){ requestAnimationFrame(function(){ requestAnimationFrame(fn); }); }
function motionOff(){ return document.documentElement.classList.contains('motion-off'); }
/* run fn now, or as soon as animations are resumed (WCAG 2.2.2) */
function whenOn(fn){
  if(!motionOff()) return fn();
  var iv=setInterval(function(){ if(!motionOff()){ clearInterval(iv); fn(); } },250);
}
/* ---------- layout reserve (no growing-content layout shift) ----------
   Demo logs / captions grow while they play, which pushed every section below them down (and
   collapsed again on replay). We measure the FINAL height up front (hidden probe, same width and
   classes) and set it as min-height, so appended rows fill space that is already there.
   holdMin() is a ratchet backstop: if a row ever overflows the estimate, it grows once, never shrinks. */
function holdMin(el){
  if(!el) return;
  var h=el.offsetHeight, c=parseFloat(el.style.minHeight)||0;
  if(h>c+0.5) el.style.minHeight=h+'px';
}
var LOG_ROW='<svg viewBox="0 0 24 24"><path d="M4.5 12.5l5 5L19.5 7"/></svg>';
function reserveLog(ol,variants){
  if(!ol||!ol.parentNode) return;
  ol._variants=variants;
  var w=ol.offsetWidth; if(!w) return;
  var best=0;
  variants.forEach(function(texts){
    var p=document.createElement('ol');
    p.className=ol.className; p.setAttribute('aria-hidden','true');
    p.style.cssText='position:absolute;visibility:hidden;pointer-events:none;margin:0;left:0;top:0;width:'+w+'px';
    texts.forEach(function(t){
      var li=document.createElement('li'); li.className='in'; li.style.transition='none';
      li.innerHTML=LOG_ROW+'<span>'+t+'</span>'; p.appendChild(li);
    });
    ol.parentNode.appendChild(p);
    best=Math.max(best,p.offsetHeight);
    p.remove();
  });
  ol.style.minHeight=best+'px';
}
(function(){
  var t=0;
  addEventListener('resize',function(){
    clearTimeout(t);
    t=setTimeout(function(){
      $$('ol.syslog').forEach(function(ol){ if(ol._variants) reserveLog(ol,ol._variants); });
    },220);
  });
  /* webfont swap changes line wraps → re-measure once fonts are in */
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(function(){
    $$('ol.syslog').forEach(function(ol){ if(ol._variants) reserveLog(ol,ol._variants); });
  });
})();

/* ---------- scroll-state tracker ----------
   Demos (phone mockups, review engine, QR) must not mutate the DOM while the visitor is scrolling:
   that work competes with the particle field and the compositor and reads as jerk. We flag
   scrolling (html.is-scrolling, ~140ms after the last scroll event), let CSS pause heavy decorative
   loops, and make demo steps wait for calm — capped, so a demo never stalls for long. */
var pxScrolling=false, _pxT=0, _pxQ=[];
addEventListener('scroll',function(){
  if(!pxScrolling){ pxScrolling=true; document.documentElement.classList.add('is-scrolling'); }
  clearTimeout(_pxT); _pxT=setTimeout(pxScrollEnd,140);
},{passive:true});
function pxScrollEnd(){
  pxScrolling=false; document.documentElement.classList.remove('is-scrolling');
  var q=_pxQ; _pxQ=[];
  for(var i=0;i<q.length;i++) setTimeout(q[i],i*70);   /* spread, never a burst */
}
/* run fn now if calm, else once scrolling stops (or after maxWait ms, whichever first) */
function calm(fn,maxWait){
  if(!pxScrolling) return fn();
  var done=false;
  function go(){ if(done) return; done=true; fn(); }
  _pxQ.push(go); setTimeout(go,maxWait||1500);
}
function whenCalm(fn){ whenOn(function(){ calm(fn); }); }
function sleep(ms){ return new Promise(function(r){ setTimeout(function(){ whenCalm(r); },ms); }); }
function toast(msg){
  var t=$('#toast'); if(!t) return;
  t.textContent=msg; t.classList.add('show');
  clearTimeout(toast._t); toast._t=setTimeout(function(){ t.classList.remove('show'); },4200);
}

/* ============================================================
   PREMIUM CHROME — one pass upgrades every phone on the page
============================================================ */
