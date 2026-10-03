/* ============ MAGNETIC BUTTONS — solid CTAs lean toward the cursor ============
   Fine pointers only; reduced-motion and touch keep the plain hover.
   Pull is rAF-coalesced and clamped, release springs back on leave. */
(function(){
'use strict';
if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches) return;
if(!(window.matchMedia&&matchMedia('(pointer: fine)').matches)||innerWidth<900) return;
var BTNS=Array.prototype.slice.call(document.querySelectorAll('.btn-solid'));
if(!BTNS.length) return;
BTNS.forEach(function(b){
  var raf=0,tx=0,ty=0;
  function apply(){
    raf=0;
    b.style.transition='transform .18s ease-out';
    b.style.transform='translate('+tx+'px,'+ty+'px)';
  }
  b.addEventListener('pointermove',function(e){
    if(e.pointerType==='touch')return;
    var r=b.getBoundingClientRect();
    tx=Math.max(-10,Math.min(10,(e.clientX-(r.left+r.width/2))*.18));
    ty=Math.max(-10,Math.min(10,(e.clientY-(r.top+r.height/2))*.22));
    tx=+tx.toFixed(1); ty=+ty.toFixed(1);
    if(!raf)raf=requestAnimationFrame(apply);
  });
  b.addEventListener('pointerleave',function(){
    if(raf){cancelAnimationFrame(raf);raf=0;}
    b.style.transition='transform .55s cubic-bezier(.22,1,.36,1)';
    b.style.transform='';
  });
});
})();
